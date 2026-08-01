import { db } from "@/lib/db"
import {
  dimensionBuckets,
  TIER1_RESULT_BODY_LIMIT_BYTES,
  validateTier1AggregateResult,
  validateTier1CompletionStep,
} from "@/lib/research/tier1-aggregate"
import { FOUNDATION_INSTRUMENT_VERSION } from "@/lib/quiz-schema"

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
      dimension,
      bucket,
      count
    )
    select $2::integer, $3::integer, dimension, bucket, 1
    from dimension_input
    on conflict (instrument_version, scoring_version, dimension, bucket)
    do update set count = agg_dimension_buckets.count + 1
    returning 1
  ),
  item_latency_input as (
    select item_id, bucket
    from jsonb_to_recordset($7::jsonb)
      as input(item_id text, bucket integer)
  ),
  incremented_item_latencies as (
    insert into agg_item_latency (
      instrument_version,
      item_id,
      latency_bucket_ms,
      count
    )
    select $2::integer, item_id, bucket, 1
    from item_latency_input
    on conflict (instrument_version, item_id, latency_bucket_ms)
    do update set count = agg_item_latency.count + 1
    returning 1
  )
  insert into agg_labels (
    instrument_version,
    scoring_version,
    family,
    strategy_modifier,
    normative_modifier,
    count
  )
  values ($2::integer, $3::integer, $4::text, $5::text, $6::text, 1)
  on conflict (
    instrument_version,
    scoring_version,
    family,
    strategy_modifier,
    normative_modifier
  )
  do update set count = agg_labels.count + 1
`

const INCREMENT_COMPLETION = `
  insert into agg_completion (
    instrument_version,
    tier,
    step_index,
    count
  )
  values ($1::integer, $2::text, $3::integer, 1)
  on conflict (instrument_version, tier, step_index)
  do update set count = agg_completion.count + 1
`

export async function POST(request: Request) {
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

    try {
      await db.query(INCREMENT_COMPLETION, [
        FOUNDATION_INSTRUMENT_VERSION,
        validation.completion.tier,
        validation.completion.stepIndex,
      ])
    } catch {
      // Missing or unavailable storage is an intentional no-op for the product.
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
  try {
    await db.query(INCREMENT_RESULT_AGGREGATES, [
      JSON.stringify(dimensionBuckets(result.dimensionScores)),
      result.instrumentVersion,
      result.scoringVersion,
      result.family,
      result.strategyModifier,
      result.normativeModifier,
      JSON.stringify(
        result.itemLatencies.map(({ itemId, bucket }) => ({
          item_id: itemId,
          bucket,
        })),
      ),
    ])
  } catch {
    // Missing or unavailable storage is an intentional no-op for the product.
  }

  return Response.json({ ok: true }, { status: 202 })
}
