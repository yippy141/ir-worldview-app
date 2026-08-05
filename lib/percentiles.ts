import type {
  CompletionLocale,
  DimensionKey,
  FamilyKey,
  FoundationQuestionSet,
  NormativeModifier,
} from "@/lib/types"
import type { AiAxisKey, AiQuizMode } from "@/lib/ai-governance-types"
import type { ModuleAxisKey } from "@/lib/modules/types"

export const MIN_PERCENTILE_SAMPLE_SIZE = 100

export type PercentileInstrument =
  | "foundation"
  | "security"
  | "technology"
  | "ai-governance"

export type PercentileModeByInstrument = {
  foundation: FoundationQuestionSet
  security: "standard" | "analyst"
  technology: "standard" | "analyst"
  "ai-governance": AiQuizMode
}

export type PercentileAxisByInstrument = {
  foundation: DimensionKey
  security: ModuleAxisKey
  technology: ModuleAxisKey
  "ai-governance": AiAxisKey
}

export type PercentileMode =
  PercentileModeByInstrument[PercentileInstrument]
export type PercentileAxis =
  PercentileAxisByInstrument[PercentileInstrument]

export type AggregateDimensionBucket = {
  dimension: DimensionKey
  bucket: number
  count: number
}

export type AggregateStats = {
  instrument: "foundation"
  mode: FoundationQuestionSet
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
  let n = 0
  for (const entry of labels) {
    if (!Number.isSafeInteger(entry.count) || entry.count < 0) {
      return null
    }
    n += entry.count
    if (!Number.isSafeInteger(n)) {
      return null
    }
  }
  return n
}

export function hasPublishableAggregateCohort(
  labels: readonly AggregateLabelCount[],
): boolean {
  const n = getAggregateCohortSize(labels)
  return n !== null && n >= MIN_PERCENTILE_SAMPLE_SIZE
}

export function getProfileRarity(
  archetypeCode: string,
  stats: AggregateStats,
): { percentage: number; n: number } | null {
  const n = getAggregateCohortSize(stats.labels)
  if (n === null || n < MIN_PERCENTILE_SAMPLE_SIZE) {
    return null
  }

  const matching = stats.labels
    .filter((entry) => entry.archetypeCode === archetypeCode)
    .reduce((total, entry) => total + entry.count, 0)

  return {
    percentage: Number(((matching / n) * 100).toFixed(1)),
    n,
  }
}

/**
 * Returns a whole-number midrank percentile within the supplied aggregate
 * sample. Scores are rounded to the same one-decimal buckets used at intake.
 * The explicit instrument and mode tuple prevents a distribution collected
 * for one form from becoming comparison language on another.
 */
export function getPercentile<
  Instrument extends PercentileInstrument,
>(
  instrument: Instrument,
  mode: PercentileModeByInstrument[Instrument],
  axis: PercentileAxisByInstrument[Instrument],
  score: number,
  stats: AggregateStats,
): PercentileResult | null {
  if (
    instrument !== stats.instrument ||
    mode !== stats.mode ||
    !Number.isFinite(score) ||
    score < 1 ||
    score > 7
  ) {
    return null
  }

  const distribution = stats.buckets.filter(
    (entry) =>
      entry.dimension === axis &&
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
