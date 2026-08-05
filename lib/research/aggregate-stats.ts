import { db } from "@/lib/db"
import type {
  AggregateDimensionBucket,
  AggregateLabelCount,
  AggregateStats,
} from "@/lib/percentiles"
import {
  hasPublishableAggregateCohort,
  MIN_PERCENTILE_SAMPLE_SIZE,
} from "@/lib/percentiles"
import {
  FOUNDATION_INSTRUMENT_VERSION,
  FOUNDATION_STRUCTURAL_VERSION,
} from "@/lib/quiz-schema"
import { FOUNDATION_SCORING_VERSION } from "@/lib/scoring"
import {
  PAYLOAD_DIMENSION_ORDER,
  type ResolvedFoundationPayload,
} from "@/lib/share"
import {
  foundationAggregateFormKey,
  type Tier1Cohort,
} from "@/lib/research/tier1-aggregate"
import { tier1AggregatesEnabled } from "@/lib/research/feature-flags"
import type {
  DimensionKey,
  NormativeModifier,
} from "@/lib/types"
import { getArchetypeByCode } from "@/lib/archetypes"

const SELECT_CURRENT_BUCKETS = `
  select dimension, bucket::text, count::text
  from agg_dimension_buckets
  where instrument_version = $1::integer
    and scoring_version = $2::integer
    and form_key = $3::text
    and completion_locale = $4::text
    and locale_copy_version = $5::integer
  order by dimension, bucket
`
const SELECT_CURRENT_LABELS = `
  select archetype_code, normative_modifier, count::text
  from agg_labels
  where instrument_version = $1::integer
    and scoring_version = $2::integer
    and form_key = $3::text
    and completion_locale = $4::text
    and locale_copy_version = $5::integer
  order by archetype_code, normative_modifier
`
const ALLOWED_DIMENSIONS = new Set<string>(PAYLOAD_DIMENSION_ORDER)

type BucketRow = {
  dimension: string
  bucket: string | number
  count: string | number
}

type LabelRow = {
  archetype_code: string
  normative_modifier: string
  count: string | number
}

const STATS_CACHE_MS = 5 * 60 * 1_000
const aggregateRowsCache = new Map<
  string,
  {
    expiresAt: number
    value: Promise<{ bucketRows: BucketRow[]; labelRows: LabelRow[] }>
  }
>()

async function readCachedAggregateRows(
  formKey: string,
  completionLocale: string,
  localeCopyVersion: number,
) {
  const cacheKey = `${formKey}:${completionLocale}:${localeCopyVersion}`
  const cached = aggregateRowsCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value
  }

  const value = (async () => {
    const parameters = [
      FOUNDATION_INSTRUMENT_VERSION,
      FOUNDATION_SCORING_VERSION,
      formKey,
      completionLocale,
      localeCopyVersion,
    ]
    const [bucketRows, labelRows] = await Promise.all([
      db.query<BucketRow>(SELECT_CURRENT_BUCKETS, parameters),
      db.query<LabelRow>(SELECT_CURRENT_LABELS, parameters),
    ])
    return { bucketRows, labelRows }
  })()
  aggregateRowsCache.set(cacheKey, {
    expiresAt: Date.now() + STATS_CACHE_MS,
    value,
  })

  try {
    return await value
  } catch (error) {
    aggregateRowsCache.delete(cacheKey)
    throw error
  }
}

export async function readCurrentAggregateStats(
  cohort: Tier1Cohort,
): Promise<AggregateStats> {
  let buckets: AggregateDimensionBucket[] = []
  let labels: AggregateLabelCount[] = []
  const formKey = foundationAggregateFormKey(
    cohort.questionSet,
    cohort.targetedFamilyPair,
  )

  if (
    formKey &&
    tier1AggregatesEnabled() &&
    db.isConfigured
  ) {
    try {
      const rows = await readCachedAggregateRows(
        formKey,
        cohort.completionLocale,
        cohort.localeCopyVersion,
      )
      const normalizedLabels = rows.labelRows.flatMap((row) =>
        normalizeLabelRow(row),
      )
      // The endpoint is public. Do not expose a derived profile or score
      // distribution while an exact form/locale cohort could describe only a
      // handful of people. UI-level percentile suppression alone is not a
      // privacy boundary.
      if (hasPublishableAggregateCohort(normalizedLabels)) {
        buckets = filterPublishableDimensionBuckets(
          rows.bucketRows.flatMap((row) => normalizeBucketRow(row)),
        )
        labels = normalizedLabels
      }
    } catch {
      console.error("[aggregate] Stats read failed.")
    }
  }

  return {
    instrument: "foundation",
    mode: cohort.questionSet,
    instrumentVersion: FOUNDATION_INSTRUMENT_VERSION,
    scoringVersion: FOUNDATION_SCORING_VERSION,
    questionSet: cohort.questionSet,
    ...(cohort.targetedFamilyPair
      ? { targetedFamilyPair: [...cohort.targetedFamilyPair] as [typeof cohort.targetedFamilyPair[0], typeof cohort.targetedFamilyPair[1]] }
      : {}),
    completionLocale: cohort.completionLocale,
    localeCopyVersion: cohort.localeCopyVersion,
    buckets,
    labels,
  }
}

/**
 * Resolves the only public aggregate-read contract: an exact, current
 * Foundation result cohort. Historical links remain readable as results, but
 * they must not be compared with counters produced by a different tuple.
 */
export async function readAggregateStatsForFoundationPayload(
  resolved: ResolvedFoundationPayload,
): Promise<AggregateStats | null> {
  if (resolved.payload.v !== 5) {
    return null
  }

  const payload = resolved.payload
  const { provenance, questionSet, targetedFamilyPair } = resolved

  if (
    payload.iv !== FOUNDATION_STRUCTURAL_VERSION ||
    payload.bv !== FOUNDATION_INSTRUMENT_VERSION ||
    payload.sv !== FOUNDATION_SCORING_VERSION ||
    provenance.instrumentStructuralVersion !== FOUNDATION_STRUCTURAL_VERSION ||
    provenance.instrumentVersion !== FOUNDATION_INSTRUMENT_VERSION ||
    provenance.scoringVersion !== FOUNDATION_SCORING_VERSION ||
    payload.qs !== questionSet ||
    provenance.questionSet !== questionSet ||
    !isFoundationQuestionSet(questionSet) ||
    payload.cl !== provenance.completionLocale ||
    !isCompletionLocale(provenance.completionLocale) ||
    payload.cv !== provenance.localeCopyVersion ||
    !Number.isInteger(provenance.localeCopyVersion) ||
    provenance.localeCopyVersion < 0 ||
    !hasExactTargetedPair(
      questionSet,
      [
        targetedFamilyPair,
        provenance.targetedFamilyPair,
        payload.tp,
      ],
    )
  ) {
    return null
  }

  return readCurrentAggregateStats({
    questionSet,
    ...(targetedFamilyPair ? { targetedFamilyPair } : {}),
    completionLocale: provenance.completionLocale,
    localeCopyVersion: provenance.localeCopyVersion,
  })
}

function normalizeBucketRow(row: BucketRow): AggregateDimensionBucket[] {
  const bucket = Number(row.bucket)
  const count = Number(row.count)

  if (
    !ALLOWED_DIMENSIONS.has(row.dimension) ||
    !Number.isFinite(bucket) ||
    bucket < 1 ||
    bucket > 7 ||
    !Number.isSafeInteger(count) ||
    count < 0
  ) {
    return []
  }

  return [{
    dimension: row.dimension as DimensionKey,
    bucket,
    count,
  }]
}

function filterPublishableDimensionBuckets(
  buckets: readonly AggregateDimensionBucket[],
): AggregateDimensionBucket[] {
  const counts = new Map<DimensionKey, number>()
  const invalidDimensions = new Set<DimensionKey>()

  for (const entry of buckets) {
    const count = (counts.get(entry.dimension) ?? 0) + entry.count
    if (!Number.isSafeInteger(count)) {
      invalidDimensions.add(entry.dimension)
      continue
    }
    counts.set(entry.dimension, count)
  }

  const publishableDimensions = new Set(
    [...counts.entries()]
      .filter(
        ([dimension, count]) =>
          !invalidDimensions.has(dimension) &&
          count >= MIN_PERCENTILE_SAMPLE_SIZE,
      )
      .map(([dimension]) => dimension),
  )

  return buckets.filter((entry) =>
    publishableDimensions.has(entry.dimension),
  )
}

function normalizeLabelRow(row: LabelRow): AggregateLabelCount[] {
  const count = Number(row.count)
  if (
    !getArchetypeByCode(row.archetype_code) ||
    !isNormativeModifier(row.normative_modifier) ||
    !Number.isSafeInteger(count) ||
    count < 0
  ) {
    return []
  }

  return [{
    archetypeCode: row.archetype_code,
    normativeModifier: row.normative_modifier,
    count,
  }]
}

function isNormativeModifier(value: string): value is NormativeModifier {
  return (
    value === "Pluralist" ||
    value === "Conditional Solidarist" ||
    value === "Universalist"
  )
}

function isFoundationQuestionSet(
  value: unknown,
): value is Tier1Cohort["questionSet"] {
  return (
    value === "core" ||
    value === "targetedExtended" ||
    value === "fullExtended"
  )
}

function isCompletionLocale(
  value: unknown,
): value is Tier1Cohort["completionLocale"] {
  return value === "en" || value === "zh-Hans"
}

function hasExactTargetedPair(
  questionSet: Tier1Cohort["questionSet"],
  pairs: readonly (
    | ResolvedFoundationPayload["targetedFamilyPair"]
    | undefined
  )[],
): boolean {
  if (questionSet !== "targetedExtended") {
    return pairs.every((pair) => pair === undefined)
  }

  const first = pairs[0]
  return (
    first !== undefined &&
    pairs.every(
      (pair) =>
        pair !== undefined &&
        pair[0] === first[0] &&
        pair[1] === first[1],
    ) &&
    foundationAggregateFormKey(questionSet, first) !== null
  )
}
