import test from "node:test"
import assert from "node:assert/strict"
import { dimensionLabels } from "@/lib/quiz-schema"
import {
  dimensionOneLiners,
  getKeyDrivers,
  getStrongLenses,
} from "@/lib/result-helpers"
import {
  DIMENSION_POLES,
  OBSERVED_DIMENSION_RANGES,
  dimensionBand,
  dimensionHighCut,
  dimensionLowCut,
  getDimensionPush,
} from "@/lib/results/dimension-bands"
import type { DimensionKey, DimensionScores } from "@/lib/types"

const DIMENSION_KEYS = Object.keys(dimensionLabels) as DimensionKey[]

function observedMeanProfile(): DimensionScores {
  return Object.fromEntries(
    DIMENSION_KEYS.map((dimension) => [
      dimension,
      OBSERVED_DIMENSION_RANGES[dimension].mean,
    ]),
  ) as DimensionScores
}

test("a score at the middle of the observed distribution never reads as conviction", () => {
  for (const dimension of DIMENSION_KEYS) {
    const { mean } = OBSERVED_DIMENSION_RANGES[dimension]

    assert.equal(
      dimensionBand(dimension, mean),
      "midRange",
      `${dimension} at its observed mean of ${mean} should read as mid-range.`,
    )
  }
})

test("band cutoffs clear the nominal 1-7 lean as well as the observed range", () => {
  for (const dimension of DIMENSION_KEYS) {
    const { p10, p90 } = OBSERVED_DIMENSION_RANGES[dimension]

    assert.ok(
      dimensionHighCut(dimension) >= 5,
      `${dimension} must not award high-band copy below the nominal midpoint lean.`,
    )
    assert.ok(
      dimensionHighCut(dimension) >= p90,
      `${dimension} must not award high-band copy inside the bulk of the observed range.`,
    )
    assert.ok(
      dimensionLowCut(dimension) <= 3,
      `${dimension} must not award low-band copy above the nominal midpoint lean.`,
    )
    assert.ok(
      dimensionLowCut(dimension) <= p10,
      `${dimension} must not award low-band copy inside the bulk of the observed range.`,
    )
  }
})

test("domestic politics and markets stop reading as conviction at a score of 5", () => {
  // Both dimensions centre above the nominal midpoint, so a flat `score >= 5`
  // cutoff used to describe an average profile as emphatic.
  for (const dimension of ["domesticFilters", "politicalEconomy"] as const) {
    assert.equal(dimensionBand(dimension, 5), "midRange")
    assert.ok(OBSERVED_DIMENSION_RANGES[dimension].mean < 5)
  }
})

test("every dimension has distinct copy for all three bands", () => {
  for (const dimension of DIMENSION_KEYS) {
    const copy = [
      dimensionOneLiners[dimension](dimensionLowCut(dimension) - 0.5),
      dimensionOneLiners[dimension](OBSERVED_DIMENSION_RANGES[dimension].mean),
      dimensionOneLiners[dimension](dimensionHighCut(dimension) + 0.5),
    ]

    assert.equal(new Set(copy).size, 3, `${dimension} reuses copy across bands.`)
    for (const line of copy) {
      assert.ok(line.length > 0)
      assert.ok(
        !/,\s+not\s+/i.test(line) && !/\brather than\b/i.test(line),
        `${dimension} band copy uses a banned contrastive construction: ${line}`,
      )
    }
  }
})

test("key drivers describe a flat profile without claiming a strong lean", () => {
  const flatProfile = observedMeanProfile()

  for (const driver of getKeyDrivers(flatProfile)) {
    assert.equal(
      dimensionBand(driver.dimension, flatProfile[driver.dimension]),
      "midRange",
      `${driver.dimension} should stay mid-range for an average profile.`,
    )
    assert.ok(driver.label.length > 0)
    assert.ok(driver.description.length > 0)
  }
})

test("strong lenses stay empty at the observed means", () => {
  assert.deepEqual(getStrongLenses(observedMeanProfile()), [])
})

test("each strong lens becomes reachable at its calibrated dimension band", () => {
  const cases = [
    ["politicalEconomy", "political-economy-salience", "high"],
    ["domesticFilters", "domestic-politics", "high"],
    ["normsIdentity", "identity-legitimacy", "high"],
    ["orderJustice", "normative-justice", "high"],
    ["orderJustice", "normative-justice", "low"],
  ] as const

  for (const [dimension, expectedKey, direction] of cases) {
    const scores = observedMeanProfile()
    scores[dimension] =
      direction === "high"
        ? dimensionHighCut(dimension)
        : dimensionLowCut(dimension)

    assert.deepEqual(
      getStrongLenses(scores).map((lens) => lens.key),
      [expectedKey],
      `${expectedKey} should be reachable at the ${direction} ${dimension} cut.`,
    )
  }
})

test("an average profile puts every push bar on the spine", () => {
  // The diverging chart must not imply a dimension pushed the result when the
  // score sits exactly at the centre of what the instrument produces.
  for (const row of getDimensionPush(observedMeanProfile())) {
    assert.ok(
      Math.abs(row.deviation) < 0.01,
      `${row.dimension} should sit on the spine at its observed mean.`,
    )
  }
})

test("push deviations stay bounded, signed, and sorted by strength", () => {
  const scores = observedMeanProfile()
  scores.securityCompetition = 7
  scores.institutions = 1
  scores.orderJustice = 5.4

  const rows = getDimensionPush(scores)
  assert.equal(rows.length, DIMENSION_KEYS.length)

  for (const row of rows) {
    assert.ok(
      row.deviation >= -1 && row.deviation <= 1,
      `${row.dimension} deviation must stay inside the plotted range.`,
    )
    assert.equal(
      row.pole,
      row.deviation >= 0
        ? DIMENSION_POLES[row.dimension].high
        : DIMENSION_POLES[row.dimension].low,
    )
  }

  const strengths = rows.map((row) => Math.abs(row.deviation))
  assert.deepEqual(strengths, [...strengths].sort((a, b) => b - a))
  assert.equal(rows[0].dimension, "securityCompetition")
  assert.equal(rows[0].pole, DIMENSION_POLES.securityCompetition.high)
})

test("political-economy salience does not create an unmodeled CPE identity lens", () => {
  const scores = observedMeanProfile()
  scores.securityCompetition = 3.6
  scores.institutions = 2.4
  scores.domesticFilters = 5.6
  scores.normsIdentity = 4.2
  scores.politicalEconomy = 6.4
  scores.restraint = 4.4
  scores.orderJustice = 3.2

  const keys = getStrongLenses(scores).map((lens) => lens.key)
  assert.ok(keys.includes("political-economy-salience"))
  assert.ok(!keys.includes("critical-systemic"))
})
