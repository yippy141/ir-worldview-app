import type {
  CompletionLocale,
  DimensionKey,
  FamilyKey,
  FoundationQuestionSet,
  NormativeModifier,
} from "@/lib/types"

export const MIN_PERCENTILE_SAMPLE_SIZE = 100

export type AggregateDimensionBucket = {
  dimension: DimensionKey
  bucket: number
  count: number
}

export type AggregateStats = {
  instrumentVersion: number
  scoringVersion: number
  questionSet: FoundationQuestionSet
  targetedFamilyPair?: [FamilyKey, FamilyKey]
  completionLocale: CompletionLocale
  localeCopyVersion: number
  buckets: AggregateDimensionBucket[]
  labels: AggregateLabelCount[]
}

export type AggregateLabelCount = {
  archetypeCode: string
  normativeModifier: NormativeModifier
  count: number
}

export type PercentileResult = {
  percentile: number
  n: number
}

export function getAggregateCohortSize(
  labels: readonly AggregateLabelCount[],
): number | null {
  const n = labels.reduce((total, entry) => total + entry.count, 0)
  return Number.isSafeInteger(n) && n >= 0 ? n : null
}

export function hasPublishableAggregateCohort(
  labels: readonly AggregateLabelCount[],
): boolean {
  const n = getAggregateCohortSize(labels)
  return n !== null && n >= MIN_PERCENTILE_SAMPLE_SIZE
}

export function getProfileRarity(
  archetypeCode: string,
  normativeModifier: NormativeModifier,
  stats: AggregateStats,
): { percentage: number; n: number } | null {
  const n = getAggregateCohortSize(stats.labels)
  if (n === null || n < MIN_PERCENTILE_SAMPLE_SIZE) {
    return null
  }

  const matching = stats.labels
    .filter(
      (entry) =>
        entry.archetypeCode === archetypeCode &&
        entry.normativeModifier === normativeModifier,
    )
    .reduce((total, entry) => total + entry.count, 0)

  return {
    percentage: Number(((matching / n) * 100).toFixed(1)),
    n,
  }
}

/**
 * Returns a whole-number midrank percentile within the supplied aggregate
 * sample. Scores are rounded to the same one-decimal buckets used at intake.
 */
export function getPercentile(
  dimension: DimensionKey,
  score: number,
  stats: AggregateStats,
): PercentileResult | null {
  if (!Number.isFinite(score) || score < 1 || score > 7) {
    return null
  }

  const distribution = stats.buckets.filter(
    (entry) =>
      entry.dimension === dimension &&
      Number.isFinite(entry.bucket) &&
      entry.bucket >= 1 &&
      entry.bucket <= 7 &&
      Number.isSafeInteger(entry.count) &&
      entry.count >= 0,
  )
  const n = distribution.reduce((total, entry) => total + entry.count, 0)

  if (!Number.isSafeInteger(n) || n < MIN_PERCENTILE_SAMPLE_SIZE) {
    return null
  }

  const scoreBucket = Number(score.toFixed(1))
  let below = 0
  let tied = 0

  for (const entry of distribution) {
    if (entry.bucket < scoreBucket) {
      below += entry.count
    } else if (entry.bucket === scoreBucket) {
      tied += entry.count
    }
  }

  return {
    percentile: Math.round(((below + tied / 2) / n) * 100),
    n,
  }
}
