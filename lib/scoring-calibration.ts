import {
  LOW_DIFFERENTIATION_THRESHOLD as V2_LOW_DIFFERENTIATION_THRESHOLD,
  SHARPLY_DIFFERENTIATED_THRESHOLD as V2_SHARPLY_DIFFERENTIATED_THRESHOLD,
  V2_NEUTRAL_BASELINE,
} from "@/lib/scoring/v2-calibration"

export const CALIBRATION_VERSION =
  "v21-instrument-v2-independent-null-2026-08-01"

export const CALIBRATION_SOURCE = {
  method: "seeded independent-uniform item responses",
  respondentCount: 500_000,
  seed: 20260728,
  mode: "analyst",
  instrumentVersion: 2,
  scoringVersion: 2,
  generatedOn: "2026-08-01",
} as const

/**
 * Full-form top-two family-score gap calibration from the independent-null
 * sample above. These describe scorer behavior, not population percentiles.
 */
export const LOW_DIFFERENTIATION_THRESHOLD =
  V2_LOW_DIFFERENTIATION_THRESHOLD
export const SHARPLY_DIFFERENTIATED_THRESHOLD =
  V2_SHARPLY_DIFFERENTIATED_THRESHOLD

/**
 * Current full-form scoring baseline. The version-local source lives beside
 * the immutable V2 scorer so future scoring versions cannot rewrite replay.
 */
export const NEUTRAL_BASELINE = V2_NEUTRAL_BASELINE
