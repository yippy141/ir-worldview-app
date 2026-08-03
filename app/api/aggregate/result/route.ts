import { db } from "@/lib/db"
import {
  dimensionBuckets,
  foundationAggregateFormKey,
  TIER1_RESULT_BODY_LIMIT_BYTES,
  validateTier1AggregateResult,
  validateTier1CompletionStep,
} from "@/lib/research/tier1-aggregate"
import { FOUNDATION_INSTRUMENT_VERSION } from "@/lib/quiz-schema"
import { tier1AggregatesEnabled } from "@/lib/research/feature-flags"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const INCREMENT_RESULT_AGGREGATES = `
  with dimension_input as (
    select dimension, bucket
    from jsonb_to_recordset($1::jsonb)
      as input(dimension text, bucket numeric)
  ),
  incremented_dimensions as (
    insert into agg_dimension_buckets (
      instrument_version,
      scoring_version,
      form_key,
      completion_locale,
      locale_copy_version,
      dimension,
      bucket,
      count
    )
    select
      $2::integer,
      $3::integer,
      $4::text,
      $5::text,
      $6::integer,
      dimension,
      bucket,
      1
    from dimension_input
    on conflict (
      instrument_version,
      scoring_version,
      form_key,
      completion_locale,
      locale_copy_version,
      dimension,
      bucket
    )
    do update set count = agg_dimension_buckets.count + 1
    returning 1
  ),
  item_latency_input as (
    select item_id, bucket
    from jsonb_to_recordset($11::jsonb)
      as input(item_id text, bucket integer)
  ),
  incremented_item_latencies as (
    insert into agg_item_latency (
      instrument_version,
      form_key,
      completion_locale,
      locale_copy_version,
      item_id,
      latency_bucket_ms,
      count
    )
    select
      $2::integer,
      $4::text,
      $5::text,
      $6::integer,
      item_id,
      bucket,
      1
    from item_latency_input
    on conflict (
      instrument_version,
      form_key,
      completion_locale,
      locale_copy_version,
      item_id,
      latency_bucket_ms
    )
    do update set count = agg_item_latency.count + 1
    returning 1
  )
  insert into agg_labels (
    instrument_version,
    scoring_version,
    form_key,
    completion_locale,
    locale_copy_version,
    family,
    strategy_modifier,
    normative_modifier,
    archetype_code,
    count
  )
  values (
    $2::integer,
    $3::integer,
    $4::text,
    $5::text,
    $6::integer,
    $7::text,
    $8::text,
    $9::text,
    $10::text,
    1
  )
  on conflict (
    instrument_version,
    scoring_version,
    form_key,
    completion_locale,
    locale_copy_version,
    family,
    strategy_modifier,
    normative_modifier,
    archetype_code
  )
  do update set count = agg_labels.count + 1
`

const INCREMENT_COMPLETION = `
  insert into agg_completion (
    instrument_version,
    form_key,
    completion_locale,
    locale_copy_version,
    tier,
    step_index,
    count
  )
  values (
    $1::integer,
    $2::text,
    $3::text,
    $4::integer,
    $5::text,
    $6::integer,
    1
  )
  on conflict (
    instrument_version,
    form_key,
    completion_locale,
    locale_copy_version,
    tier,
    step_index
  )
  do update set count = agg_completion.count + 1
`

export async function POST(request: Request) {
  const requestRejection = rejectUntrustedRequest(request)
  if (requestRejection) return requestRejection

  const contentLength = Number(request.headers.get("content-length") ?? "0")
  if (contentLength > TIER1_RESULT_BODY_LIMIT_BYTES) {
    return Response.json(
      { ok: false, error: "Aggregate result is too large." },
      { status: 413 },
    )
  }

  const body = await request.text()
  if (new TextEncoder().encode(body).byteLength > TIER1_RESULT_BODY_LIMIT_BYTES) {
    return Response.json(
      { ok: false, error: "Aggregate result is too large." },
      { status: 413 },
    )
  }

  let value: unknown
  try {
    value = JSON.parse(body)
  } catch {
    return Response.json(
      { ok: false, error: "Aggregate result must be valid JSON." },
      { status: 400 },
    )
  }

  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    ("tier" in value || "stepIndex" in value)
  ) {
    const validation = validateTier1CompletionStep(value)
    if (!validation.ok) {
      return Response.json(
        { ok: false, error: validation.error },
        { status: 400 },
      )
    }

    if (!tier1AggregatesEnabled() || !db.isConfigured) {
      return Response.json({ ok: true }, { status: 202 })
    }

    const formKey = foundationAggregateFormKey(
      validation.completion.questionSet,
      validation.completion.targetedFamilyPair,
    )
    if (!formKey) {
      return Response.json(
        { ok: false, error: "Invalid aggregate form." },
        { status: 400 },
      )
    }

    try {
      await db.query(INCREMENT_COMPLETION, [
        FOUNDATION_INSTRUMENT_VERSION,
        formKey,
        validation.completion.completionLocale,
        validation.completion.localeCopyVersion,
        validation.completion.questionSet,
        validation.completion.stepIndex,
      ])
    } catch {
      console.error("[aggregate] Completion counter write failed.")
      // Aggregate collection is best-effort. A valid quiz interaction must not
      // gain a client-visible failure state because counter storage is down.
      return Response.json({ ok: true }, { status: 202 })
    }

    return Response.json({ ok: true }, { status: 202 })
  }

  const validation = validateTier1AggregateResult(value)
  if (!validation.ok) {
    return Response.json(
      { ok: false, error: validation.error },
      { status: 400 },
    )
  }

  const result = validation.result
  if (!tier1AggregatesEnabled() || !db.isConfigured) {
    return Response.json({ ok: true }, { status: 202 })
  }

  const formKey = foundationAggregateFormKey(
    result.questionSet,
    result.targetedFamilyPair,
  )
  if (!formKey) {
    return Response.json(
      { ok: false, error: "Invalid aggregate form." },
      { status: 400 },
    )
  }

  try {
    await db.query(INCREMENT_RESULT_AGGREGATES, [
      JSON.stringify(dimensionBuckets(result.dimensionScores)),
      result.instrumentVersion,
      result.scoringVersion,
      formKey,
      result.completionLocale,
      result.localeCopyVersion,
      result.family,
      result.strategyModifier,
      result.normativeModifier,
      result.archetypeCode,
      JSON.stringify(
        result.itemLatencies.map(({ itemId, bucket }) => ({
          item_id: itemId,
          bucket,
        })),
      ),
    ])
  } catch {
    console.error("[aggregate] Result counter write failed.")
    // Keep storage failures indistinguishable from a disabled/no-database
    // no-op so result navigation never depends on aggregate availability.
    return Response.json({ ok: true }, { status: 202 })
  }

  return Response.json({ ok: true }, { status: 202 })
}

function rejectUntrustedRequest(request: Request): Response | null {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? ""
  if (!contentType.startsWith("application/json")) {
    return Response.json(
      { ok: false, error: "Content-Type must be application/json." },
      { status: 415 },
    )
  }

  const fetchSite = request.headers.get("sec-fetch-site")
  if (fetchSite === "cross-site") {
    return Response.json(
      { ok: false, error: "Cross-site aggregate submissions are not accepted." },
      { status: 403 },
    )
  }

  const origin = request.headers.get("origin")
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json(
      { ok: false, error: "Aggregate submission origin is not allowed." },
      { status: 403 },
    )
  }

  return null
}
