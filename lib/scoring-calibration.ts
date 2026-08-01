import type { DimensionKey } from "@/lib/types"

export const CALIBRATION_VERSION = "v21-instrument-v2-random-baseline-2026-07-29"

export const CALIBRATION_SOURCE = {
  method: "seeded random respondents",
  respondentCount: 500,
  seed: 20260728,
  mode: "analyst",
  instrumentVersion: 2,
  scoringVersion: 2,
  generatedOn: "2026-07-29",
} as const

/**
 * Top-two family-score gap calibration from 500 seeded random respondents
 * (seed 20260728, analyst mode, instrument v2, scoring v2) on 2026-07-29.
 * Observed gaps: min 0.000000, max 6.540000, mean 1.011780,
 * population SD 0.841762; p10 0.129000, p25 0.367500, p50 0.830000,
 * p75 1.500000, p90 2.051000.
 */
export const LOW_DIFFERENTIATION_THRESHOLD = 0.3675 // Observed p25.
export const SHARPLY_DIFFERENTIATED_THRESHOLD = 1.5 // Observed p75.

/**
 * This baseline is deliberately calibrated against random respondents because
 * random respondents isolate item-bank structure from population signal. It
 * must be regenerated whenever the item bank changes.
 *
 * TODO(Branch D): Real-respondent percentiles are a separate concern belonging
 * to the percentile service and must not be substituted for this baseline.
 */
export const NEUTRAL_BASELINE = {
  securityCompetition: { mean: 4.523059999999993, sd: 0.1744638541360359 },
  institutions: { mean: 4.601080000000002, sd: 0.15689242684081353 },
  domesticFilters: { mean: 5.035799999999994, sd: 0.13450784363746227 },
  normsIdentity: { mean: 4.6205199999999955, sd: 0.20445862564342954 },
  politicalEconomy: { mean: 4.978640000000004, sd: 0.19302370424380524 },
  restraint: { mean: 4.665580000000001, sd: 0.13901461649769062 },
  orderJustice: { mean: 4.233599999999997, sd: 0.21589219531979376 },
} as const satisfies Record<DimensionKey, { mean: number; sd: number }>
