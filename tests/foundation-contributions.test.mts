import test from "node:test"
import assert from "node:assert/strict"
import { resolveArchetype } from "@/lib/archetypes"
import { getDimensionPush } from "@/lib/results/dimension-bands"
import {
  decomposeFoundationFamilyDifference,
  decomposeTopFoundationFamilyDifference,
} from "@/lib/results/foundation-contributions"
import {
  buildCanonicalFoundationResult,
  familyProfiles,
  getV2ScoringCalibration,
  scoreFamilies,
  type FoundationScoringCalibration,
} from "@/lib/scoring"
import type { DimensionKey, DimensionScores, FamilyKey } from "@/lib/types"

const DIMENSION_ORDER: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

const CALIBRATIONS: FoundationScoringCalibration[] = [
  "core",
  "extended",
  "targetedExtended:realist|institutionalist",
  "targetedExtended:realist|constructivist",
  "targetedExtended:realist|criticalPoliticalEconomy",
  "targetedExtended:institutionalist|constructivist",
  "targetedExtended:institutionalist|criticalPoliticalEconomy",
  "targetedExtended:constructivist|criticalPoliticalEconomy",
]

const CLEAR_REALIST_PROFILE: DimensionScores = {
  securityCompetition: 6.2,
  institutions: 2.5,
  domesticFilters: 3,
  normsIdentity: 2.8,
  politicalEconomy: 3.4,
  restraint: 3,
  orderJustice: 4.7,
}

const CLOSE_EXTENDED_PROFILE: DimensionScores = {
  securityCompetition: 4.55,
  institutions: 4.59,
  domesticFilters: 5.03,
  normsIdentity: 4.62,
  politicalEconomy: 4.97,
  restraint: 4.66,
  orderJustice: 4.24,
}

const RAW_MIDPOINT_PROFILE: DimensionScores = {
  securityCompetition: 4,
  institutions: 4,
  domesticFilters: 4,
  normsIdentity: 4,
  politicalEconomy: 4,
  restraint: 4,
  orderJustice: 4,
}

function stableLiveOrdering(scores: Record<FamilyKey, number>) {
  const order = Object.keys(familyProfiles) as FamilyKey[]
  return [...order].sort(
    (left, right) =>
      scores[right] - scores[left] || order.indexOf(left) - order.indexOf(right),
  )
}

function assertReconciles(
  dimensionScores: DimensionScores,
  calibration: FoundationScoringCalibration,
) {
  const liveScores = scoreFamilies(dimensionScores, calibration)
  const [expectedPrimary, expectedRunnerUp] = stableLiveOrdering(liveScores)
  const decomposition = decomposeTopFoundationFamilyDifference(
    dimensionScores,
    calibration,
  )
  const rowSum = decomposition.rows.reduce(
    (sum, row) => sum + row.signedContribution,
    0,
  )

  assert.equal(decomposition.primaryFamily, expectedPrimary)
  assert.equal(decomposition.runnerUpFamily, expectedRunnerUp)
  assert.equal(decomposition.displayed.primary, liveScores[expectedPrimary])
  assert.equal(decomposition.displayed.runnerUp, liveScores[expectedRunnerUp])
  assert.equal(
    decomposition.displayed.difference,
    liveScores[expectedPrimary] - liveScores[expectedRunnerUp],
  )
  assert.ok(decomposition.displayed.difference >= 0)
  assert.ok(Math.abs(rowSum - decomposition.unrounded.difference) < 1e-12)
  assert.ok(
    Math.abs(
      rowSum + decomposition.roundingResidual -
        decomposition.displayed.difference,
    ) < 1e-12,
  )
  assert.ok(
    Math.abs(decomposition.roundingResidual) <= 0.01 + Number.EPSILON,
    "independent two-decimal family-score rounding must contribute at most one hundredth",
  )
  assert.equal(
    Number(decomposition.unrounded.primary.toFixed(2)),
    decomposition.displayed.primary,
  )
  assert.equal(
    Number(decomposition.unrounded.runnerUp.toFixed(2)),
    decomposition.displayed.runnerUp,
  )

  const canonicalIndex = new Map(
    DIMENSION_ORDER.map((dimension, index) => [dimension, index]),
  )
  for (let index = 1; index < decomposition.rows.length; index += 1) {
    const previous = decomposition.rows[index - 1]
    const current = decomposition.rows[index]
    const previousMagnitude = Math.abs(previous.signedContribution)
    const currentMagnitude = Math.abs(current.signedContribution)

    assert.ok(previousMagnitude >= currentMagnitude)
    if (previousMagnitude === currentMagnitude) {
      assert.ok(
        (canonicalIndex.get(previous.dimension) ?? -1) <
          (canonicalIndex.get(current.dimension) ?? -1),
      )
    }
  }
}

test("exact V2 contribution rows reconcile core, full, and every targeted calibration", () => {
  for (const calibration of CALIBRATIONS) {
    assertReconciles(CLEAR_REALIST_PROFILE, calibration)
    assertReconciles(CLOSE_EXTENDED_PROFILE, calibration)
  }
})

test("signed rows reproduce the registered calibration and family-weight difference", () => {
  const calibration: FoundationScoringCalibration =
    "targetedExtended:institutionalist|constructivist"
  const result = buildCanonicalFoundationResult(CLOSE_EXTENDED_PROFILE, calibration)
  const decomposition = decomposeFoundationFamilyDifference({
    dimensionScores: CLOSE_EXTENDED_PROFILE,
    calibration,
    primaryFamily: result.familyKey,
    runnerUpFamily: result.runnerUpKey,
  })
  const definition = getV2ScoringCalibration(calibration)

  for (const row of decomposition.rows) {
    const { mean, sd } = definition.neutralBaseline[row.dimension]
    const expectedStandardized =
      (CLOSE_EXTENDED_PROFILE[row.dimension] - mean) / sd
    const expectedWeightDifference =
      (familyProfiles[result.familyKey][row.dimension] ?? 0) -
      (familyProfiles[result.runnerUpKey][row.dimension] ?? 0)

    assert.equal(row.standardizedScore, expectedStandardized)
    assert.equal(row.weightDifference, expectedWeightDifference)
    assert.equal(
      row.signedContribution,
      expectedStandardized * expectedWeightDifference,
    )
  }
})

test("pure and blend comparisons use the same decomposition contract", () => {
  const clearResult = buildCanonicalFoundationResult(
    CLEAR_REALIST_PROFILE,
    "extended",
  )
  const clearArchetype = resolveArchetype(
    clearResult,
    getV2ScoringCalibration("extended").lowDifferentiationThreshold,
  )
  const closeResult = buildCanonicalFoundationResult(
    CLOSE_EXTENDED_PROFILE,
    "extended",
  )
  const closeArchetype = resolveArchetype(
    closeResult,
    getV2ScoringCalibration("extended").lowDifferentiationThreshold,
  )

  assert.equal("archetypes" in clearArchetype, false)
  assert.equal("archetypes" in closeArchetype, true)
  assertReconciles(CLEAR_REALIST_PROFILE, "extended")
  assertReconciles(CLOSE_EXTENDED_PROFILE, "extended")
})

test("stable live-score ties resolve in registered family order", () => {
  const decomposition = decomposeTopFoundationFamilyDifference(
    RAW_MIDPOINT_PROFILE,
    "core",
  )

  assert.equal(decomposition.primaryFamily, "realist")
  assert.equal(decomposition.runnerUpFamily, "institutionalist")
  assert.equal(decomposition.displayed.difference, 0)
  assert.equal(decomposition.unrounded.difference, 0)
  assert.equal(decomposition.roundingResidual, 0)
  assert.deepEqual(
    decomposition.rows.map(({ dimension }) => dimension),
    DIMENSION_ORDER,
  )
})

test("rounding residual explicitly bridges raw terms to displayed scores", () => {
  const decomposition = decomposeTopFoundationFamilyDifference(
    CLEAR_REALIST_PROFILE,
    "extended",
  )
  const rowSum = decomposition.rows.reduce(
    (sum, row) => sum + row.signedContribution,
    0,
  )

  assert.ok(Math.abs(decomposition.roundingResidual) > 1e-6)
  assert.ok(
    Math.abs(
      rowSum + decomposition.roundingResidual -
        decomposition.displayed.difference,
    ) < 1e-12,
  )
})

test("classification contribution is not raw-midpoint extremity", () => {
  const midpointExtremity = getDimensionPush(RAW_MIDPOINT_PROFILE)
  const decomposition = decomposeTopFoundationFamilyDifference(
    RAW_MIDPOINT_PROFILE,
    "extended",
  )

  assert.ok(midpointExtremity.every(({ deviation }) => deviation === 0))
  assert.ok(
    decomposition.rows.some(
      ({ signedContribution }) => Math.abs(signedContribution) > 1e-6,
    ),
  )
  assert.ok(Math.abs(decomposition.unrounded.difference) > 1e-6)
})

test("a family cannot be compared with itself", () => {
  assert.throws(
    () =>
      decomposeFoundationFamilyDifference({
        dimensionScores: CLEAR_REALIST_PROFILE,
        calibration: "extended",
        primaryFamily: "realist",
        runnerUpFamily: "realist",
      }),
    /requires two distinct families/u,
  )
})
