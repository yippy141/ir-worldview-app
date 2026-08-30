import {
  familyProfiles,
  getV2ScoringCalibration,
  scoreFamilies,
  type FoundationScoringCalibration,
} from "@/lib/scoring"
import type { DimensionKey, DimensionScores, FamilyKey } from "@/lib/types"

const DIMENSION_ORDER: readonly DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

const FAMILY_ORDER = Object.keys(familyProfiles) as FamilyKey[]
const MIN_CALIBRATION_SD = 1e-9

export type FoundationContributionRow = {
  dimension: DimensionKey
  standardizedScore: number
  primaryWeight: number
  runnerUpWeight: number
  weightDifference: number
  /**
   * This dimension's signed term in the primary-minus-runner-up family-score
   * difference. Positive values favor the primary family; negative values
   * favor the runner-up.
   */
  signedContribution: number
}

export type FoundationContributionTotals = {
  primary: number
  runnerUp: number
  difference: number
}

export type FoundationContributionDecomposition = {
  calibration: FoundationScoringCalibration
  primaryFamily: FamilyKey
  runnerUpFamily: FamilyKey
  /** Stable absolute-contribution order, with canonical dimension order as the tie break. */
  rows: FoundationContributionRow[]
  /** Totals before the live scorer rounds each family score to two decimals. */
  unrounded: FoundationContributionTotals
  /** The exact two-decimal family scores emitted by the live V2 scorer. */
  displayed: FoundationContributionTotals
  /**
   * displayed.difference - unrounded.difference. Add this residual to the
   * signed row sum to reconcile the displayed family-score difference.
   */
  roundingResidual: number
}

export type FoundationContributionInput = {
  dimensionScores: DimensionScores
  calibration: FoundationScoringCalibration
  primaryFamily: FamilyKey
  runnerUpFamily: FamilyKey
}

/**
 * Decompose the exact V2 family-score comparison into its seven matrix terms.
 *
 * This is classification math: it uses the registered form calibration and
 * the difference between two family weight vectors. It intentionally does not
 * use distance from the raw 1-7 midpoint, which describes extremity rather
 * than contribution to a family comparison.
 */
export function decomposeFoundationFamilyDifference({
  dimensionScores,
  calibration,
  primaryFamily,
  runnerUpFamily,
}: FoundationContributionInput): FoundationContributionDecomposition {
  if (primaryFamily === runnerUpFamily) {
    throw new Error("Foundation contribution decomposition requires two distinct families.")
  }

  const calibrationDefinition = getV2ScoringCalibration(calibration)
  const primaryProfile = familyProfiles[primaryFamily]
  const runnerUpProfile = familyProfiles[runnerUpFamily]
  let unroundedPrimary = 0
  let unroundedRunnerUp = 0

  const rows = DIMENSION_ORDER.map((dimension, canonicalIndex) => {
    const { mean, sd } = calibrationDefinition.neutralBaseline[dimension]
    const standardizedScore = Math.abs(sd) < MIN_CALIBRATION_SD
      ? dimensionScores[dimension] - mean
      : (dimensionScores[dimension] - mean) / sd
    const primaryWeight = primaryProfile[dimension] ?? 0
    const runnerUpWeight = runnerUpProfile[dimension] ?? 0
    const weightDifference = primaryWeight - runnerUpWeight
    const primaryTerm = standardizedScore * primaryWeight
    const runnerUpTerm = standardizedScore * runnerUpWeight

    unroundedPrimary += primaryTerm
    unroundedRunnerUp += runnerUpTerm

    return {
      canonicalIndex,
      dimension,
      standardizedScore,
      primaryWeight,
      runnerUpWeight,
      weightDifference,
      signedContribution: standardizedScore * weightDifference,
    }
  })
    .sort(
      (left, right) =>
        Math.abs(right.signedContribution) - Math.abs(left.signedContribution) ||
        left.canonicalIndex - right.canonicalIndex,
    )
    .map(({ canonicalIndex, ...row }) => {
      void canonicalIndex
      return row
    })

  const displayedScores = scoreFamilies(dimensionScores, calibration)
  const unroundedDifference = unroundedPrimary - unroundedRunnerUp
  const displayedDifference =
    displayedScores[primaryFamily] - displayedScores[runnerUpFamily]

  return {
    calibration,
    primaryFamily,
    runnerUpFamily,
    rows,
    unrounded: {
      primary: unroundedPrimary,
      runnerUp: unroundedRunnerUp,
      difference: unroundedDifference,
    },
    displayed: {
      primary: displayedScores[primaryFamily],
      runnerUp: displayedScores[runnerUpFamily],
      difference: displayedDifference,
    },
    roundingResidual: displayedDifference - unroundedDifference,
  }
}

/** Resolve and decompose the exact live-score top two, including stable ties. */
export function decomposeTopFoundationFamilyDifference(
  dimensionScores: DimensionScores,
  calibration: FoundationScoringCalibration,
): FoundationContributionDecomposition {
  const displayedScores = scoreFamilies(dimensionScores, calibration)
  const orderedFamilies = [...FAMILY_ORDER].sort(
    (left, right) =>
      displayedScores[right] - displayedScores[left] ||
      FAMILY_ORDER.indexOf(left) - FAMILY_ORDER.indexOf(right),
  )
  const [primaryFamily, runnerUpFamily] = orderedFamilies

  return decomposeFoundationFamilyDifference({
    dimensionScores,
    calibration,
    primaryFamily,
    runnerUpFamily,
  })
}
