import { foundationFamilyPairKey } from "@/lib/quiz-schema"
import type {
  DimensionKey,
  FamilyKey,
  FoundationQuestionSet,
} from "@/lib/types"

export type FoundationTargetedScoringCalibration =
  | "targetedExtended:realist|institutionalist"
  | "targetedExtended:realist|constructivist"
  | "targetedExtended:realist|criticalPoliticalEconomy"
  | "targetedExtended:institutionalist|constructivist"
  | "targetedExtended:institutionalist|criticalPoliticalEconomy"
  | "targetedExtended:constructivist|criticalPoliticalEconomy"

export type FoundationScoringCalibration =
  | "core"
  | "extended"
  | FoundationTargetedScoringCalibration

export type V2ScoringCalibrationDefinition = {
  neutralBaseline: Record<DimensionKey, { mean: number; sd: number }>
  strategyLowerThreshold: number
  strategyUpperThreshold: number
  normativeLowerThreshold: number
  normativeUpperThreshold: number
  lowDifferentiationThreshold: number
  sharplyDifferentiatedThreshold: number
}

const DIMENSIONS: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

/**
 * A core dimension is the mean of one forward- and one reverse-coded
 * seven-point item. Under independent uniform responses its neutral mean is 4
 * and its SD is sqrt(2).
 */
export const CORE_NEUTRAL_BASELINE = Object.fromEntries(
  DIMENSIONS.map((dimension) => [
    dimension,
    { mean: 4, sd: Math.SQRT2 },
  ]),
) as Record<DimensionKey, { mean: number; sd: number }>

export const CORE_STRATEGY_LOWER_THRESHOLD = 3
export const CORE_STRATEGY_UPPER_THRESHOLD = 5
export const CORE_NORMATIVE_LOWER_THRESHOLD = 3
export const CORE_NORMATIVE_UPPER_THRESHOLD = 5

/**
 * Full-form independent-null calibration: N=500,000, seed 20260728,
 * independent uniform Likert answers and uniform ranked-choice positions.
 * This replaces the earlier flat-response-style sweep, which repeated one
 * Likert value across every item and materially understated variance.
 */
export const V2_NEUTRAL_BASELINE = {
  securityCompetition: { mean: 4.523514, sd: 0.299654 },
  institutions: { mean: 4.594763, sd: 0.22274 },
  domesticFilters: { mean: 5.029755, sd: 0.327796 },
  normsIdentity: { mean: 4.618209, sd: 0.328527 },
  politicalEconomy: { mean: 4.965565, sd: 0.313137 },
  restraint: { mean: 4.657735, sd: 0.22382 },
  orderJustice: { mean: 4.239235, sd: 0.413632 },
} as const satisfies Record<DimensionKey, { mean: number; sd: number }>

export const STRATEGY_LOWER_THRESHOLD = 4.56
export const STRATEGY_UPPER_THRESHOLD = 4.76
export const NORMATIVE_LOWER_THRESHOLD = 4.06
export const NORMATIVE_UPPER_THRESHOLD = 4.43
export const LOW_DIFFERENTIATION_THRESHOLD = 0.36
export const SHARPLY_DIFFERENTIATED_THRESHOLD = 1.46

/**
 * Targeted-form hybrid calibration.
 *
 * Neutral means and SDs come from 100,000 unconditional independent-null
 * respondents for each exact 14+5 item form (seeds 20260730–20260735).
 * Modifier and top-two-gap cut points come from the actual conditional
 * workflow over 500,000 core candidates (core seed 20260728, extension seed
 * 20260729; 127,474 eligible). They use the live rounded dimension and family
 * scores, p=.33/.67 for the modifier cuts, and p=.25/.75 for the gap cuts.
 * Conditioning the neutral baseline itself on an already-close top pair would
 * subtract the evidence that selected the pair, so only downstream cut points
 * use the conditional workflow.
 */
const TARGETED_SCORING_CALIBRATIONS = {
  "targetedExtended:realist|institutionalist": {
    neutralBaseline: {
      securityCompetition: { mean: 4.395515, sd: 0.523432 },
      institutions: { mean: 4.554012, sd: 0.468754 },
      domesticFilters: { mean: 4.715818, sd: 0.868666 },
      normsIdentity: { mean: 4.540561, sd: 0.50712 },
      politicalEconomy: { mean: 4.755848, sd: 0.777357 },
      restraint: { mean: 4.321488, sd: 0.802459 },
      orderJustice: { mean: 3.943898, sd: 1.244651 },
    },
    strategyLowerThreshold: 3.98,
    strategyUpperThreshold: 4.66,
    normativeLowerThreshold: 3.52,
    normativeUpperThreshold: 4.53,
    lowDifferentiationThreshold: 0.29,
    sharplyDifferentiatedThreshold: 1.14,
  },
  "targetedExtended:realist|constructivist": {
    neutralBaseline: {
      securityCompetition: { mean: 4.615027, sd: 0.638576 },
      institutions: { mean: 4.432166, sd: 0.425747 },
      domesticFilters: { mean: 4.706875, sd: 0.724194 },
      normsIdentity: { mean: 4.521682, sd: 0.52408 },
      politicalEconomy: { mean: 4.735534, sd: 0.760112 },
      restraint: { mean: 4.400856, sd: 0.74786 },
      orderJustice: { mean: 3.946854, sd: 1.247751 },
    },
    strategyLowerThreshold: 3.92,
    strategyUpperThreshold: 4.57,
    normativeLowerThreshold: 3.93,
    normativeUpperThreshold: 5,
    lowDifferentiationThreshold: 0.35,
    sharplyDifferentiatedThreshold: 1.19,
  },
  "targetedExtended:realist|criticalPoliticalEconomy": {
    neutralBaseline: {
      securityCompetition: { mean: 4.733549, sd: 0.714107 },
      institutions: { mean: 4.329744, sd: 0.573477 },
      domesticFilters: { mean: 4.819163, sd: 0.73136 },
      normsIdentity: { mean: 4.381706, sd: 0.741599 },
      politicalEconomy: { mean: 4.904761, sd: 0.535353 },
      restraint: { mean: 4.527625, sd: 0.502384 },
      orderJustice: { mean: 4.26799, sd: 1.278248 },
    },
    strategyLowerThreshold: 4.26,
    strategyUpperThreshold: 4.71,
    normativeLowerThreshold: 3.57,
    normativeUpperThreshold: 4.7,
    lowDifferentiationThreshold: 0.21,
    sharplyDifferentiatedThreshold: 0.78,
  },
  "targetedExtended:institutionalist|constructivist": {
    neutralBaseline: {
      securityCompetition: { mean: 4.479363, sd: 0.580062 },
      institutions: { mean: 4.554412, sd: 0.638132 },
      domesticFilters: { mean: 4.155409, sd: 1.113384 },
      normsIdentity: { mean: 4.559558, sd: 0.773202 },
      politicalEconomy: { mean: 4.885656, sd: 0.686894 },
      restraint: { mean: 4.538638, sd: 0.445234 },
      orderJustice: { mean: 4.112571, sd: 0.625087 },
    },
    strategyLowerThreshold: 4.41,
    strategyUpperThreshold: 4.8,
    normativeLowerThreshold: 3.81,
    normativeUpperThreshold: 4.37,
    lowDifferentiationThreshold: 0.16,
    sharplyDifferentiatedThreshold: 0.63,
  },
  "targetedExtended:institutionalist|criticalPoliticalEconomy": {
    neutralBaseline: {
      securityCompetition: { mean: 4.44463, sd: 0.751395 },
      institutions: { mean: 4.629683, sd: 0.507183 },
      domesticFilters: { mean: 4.648472, sd: 0.863563 },
      normsIdentity: { mean: 4.456453, sd: 0.674537 },
      politicalEconomy: { mean: 5.00891, sd: 0.612663 },
      restraint: { mean: 4.671232, sd: 0.471834 },
      orderJustice: { mean: 4.36449, sd: 0.728146 },
    },
    strategyLowerThreshold: 4.57,
    strategyUpperThreshold: 4.99,
    normativeLowerThreshold: 3.79,
    normativeUpperThreshold: 4.41,
    lowDifferentiationThreshold: 0.22,
    sharplyDifferentiatedThreshold: 0.85,
  },
  "targetedExtended:constructivist|criticalPoliticalEconomy": {
    neutralBaseline: {
      securityCompetition: { mean: 4.239779, sd: 1.279119 },
      institutions: { mean: 4.75577, sd: 0.448997 },
      domesticFilters: { mean: 4.877804, sd: 0.659609 },
      normsIdentity: { mean: 4.371157, sd: 0.913211 },
      politicalEconomy: { mean: 4.836436, sd: 0.511297 },
      restraint: { mean: 4.719904, sd: 0.452709 },
      orderJustice: { mean: 4.405795, sd: 0.719427 },
    },
    strategyLowerThreshold: 4.53,
    strategyUpperThreshold: 4.94,
    normativeLowerThreshold: 3.96,
    normativeUpperThreshold: 4.57,
    lowDifferentiationThreshold: 0.19,
    sharplyDifferentiatedThreshold: 0.73,
  },
} as const satisfies Record<
  FoundationTargetedScoringCalibration,
  V2ScoringCalibrationDefinition
>

const SCORING_CALIBRATIONS: Record<
  FoundationScoringCalibration,
  V2ScoringCalibrationDefinition
> = {
  core: {
    neutralBaseline: CORE_NEUTRAL_BASELINE,
    strategyLowerThreshold: CORE_STRATEGY_LOWER_THRESHOLD,
    strategyUpperThreshold: CORE_STRATEGY_UPPER_THRESHOLD,
    normativeLowerThreshold: CORE_NORMATIVE_LOWER_THRESHOLD,
    normativeUpperThreshold: CORE_NORMATIVE_UPPER_THRESHOLD,
    // The independent-null core quartiles are effectively the same as the
    // full-form cuts; retaining these values also matches the targeted
    // eligibility calibration above.
    lowDifferentiationThreshold: 0.3675,
    sharplyDifferentiatedThreshold: 1.5,
  },
  extended: {
    neutralBaseline: V2_NEUTRAL_BASELINE,
    strategyLowerThreshold: STRATEGY_LOWER_THRESHOLD,
    strategyUpperThreshold: STRATEGY_UPPER_THRESHOLD,
    normativeLowerThreshold: NORMATIVE_LOWER_THRESHOLD,
    normativeUpperThreshold: NORMATIVE_UPPER_THRESHOLD,
    lowDifferentiationThreshold: LOW_DIFFERENTIATION_THRESHOLD,
    sharplyDifferentiatedThreshold: SHARPLY_DIFFERENTIATED_THRESHOLD,
  },
  ...TARGETED_SCORING_CALIBRATIONS,
}

export function getV2ScoringCalibration(
  calibration: FoundationScoringCalibration,
): V2ScoringCalibrationDefinition {
  return SCORING_CALIBRATIONS[calibration]
}

export function foundationScoringCalibrationForForm(
  questionSet: FoundationQuestionSet,
  targetedFamilyPair?: readonly [FamilyKey, FamilyKey],
): FoundationScoringCalibration | null {
  if (questionSet === "core") return "core"
  if (questionSet === "fullExtended") return "extended"
  if (!targetedFamilyPair || targetedFamilyPair[0] === targetedFamilyPair[1]) {
    return null
  }

  const key =
    `targetedExtended:${foundationFamilyPairKey(...targetedFamilyPair)}` as
      FoundationTargetedScoringCalibration
  return Object.hasOwn(TARGETED_SCORING_CALIBRATIONS, key) ? key : null
}
