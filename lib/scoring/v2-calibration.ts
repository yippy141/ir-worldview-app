import type { DimensionKey } from "@/lib/types"

/**
 * Frozen scoring-v2 baseline. Keep this version-local when current calibration
 * moves forward so historical replays remain reproducible.
 */
export const V2_NEUTRAL_BASELINE = {
  securityCompetition: { mean: 4.523059999999993, sd: 0.1744638541360359 },
  institutions: { mean: 4.601080000000002, sd: 0.15689242684081353 },
  domesticFilters: { mean: 5.035799999999994, sd: 0.13450784363746227 },
  normsIdentity: { mean: 4.6205199999999955, sd: 0.20445862564342954 },
  politicalEconomy: { mean: 4.978640000000004, sd: 0.19302370424380524 },
  restraint: { mean: 4.665580000000001, sd: 0.13901461649769062 },
  orderJustice: { mean: 4.233599999999997, sd: 0.21589219531979376 },
} as const satisfies Record<DimensionKey, { mean: number; sd: number }>
