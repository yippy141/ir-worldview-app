import type { DimensionKey } from "@/lib/types"

export const CALIBRATION_VERSION = "v21-random-baseline-2026-07-29"

export const CALIBRATION_SOURCE = {
  method: "seeded random respondents",
  respondentCount: 500,
  seed: 20260728,
  mode: "analyst",
  instrumentVersion: 3,
  generatedOn: "2026-07-29",
} as const

/**
 * Top-two family-score gap calibration from 500 seeded random respondents
 * (seed 20260728, analyst mode, instrument v3) on 2026-07-29. Observed gaps:
 * min 0.000000, max 3.050000, mean 0.552240, population SD 0.450249;
 * p10 0.090000, p25 0.210000, p50 0.440000, p75 0.790000, p90 1.141000.
 */
export const LOW_DIFFERENTIATION_THRESHOLD = 0.21 // Observed p25.
export const SHARPLY_DIFFERENTIATED_THRESHOLD = 0.79 // Observed p75.

/**
 * This baseline is deliberately calibrated against random respondents because
 * random respondents isolate item-bank structure from population signal. It
 * must be regenerated whenever the item bank changes.
 *
 * TODO(Branch D): Real-respondent percentiles are a separate concern belonging
 * to the percentile service and must not be substituted for this baseline.
 */
export const NEUTRAL_BASELINE = {
  securityCompetition: { mean: 4.625600000000005, sd: 0.4968849363785998 },
  institutions: { mean: 4.627160000000002, sd: 0.20894098305496822 },
  domesticFilters: { mean: 5.225439999999994, sd: 0.3718542811372106 },
  normsIdentity: { mean: 4.728999999999997, sd: 0.49932975076598135 },
  politicalEconomy: { mean: 5.04672, sd: 0.307279093984641 },
  restraint: { mean: 4.736060000000002, sd: 0.24695966553259996 },
  orderJustice: { mean: 4.26404, sd: 0.298133658616421 },
} as const satisfies Record<DimensionKey, { mean: number; sd: number }>
