import type { DimensionKey } from "@/lib/types"

export const MIN_PERCENTILE_SAMPLE_SIZE = 100

export type AggregateDimensionBucket = {
  dimension: DimensionKey
  bucket: number
  count: number
}

export type AggregateStats = {
  instrumentVersion: number
  scoringVersion: number
  buckets: AggregateDimensionBucket[]
}

export type PercentileResult = {
  percentile: number
  n: number
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
