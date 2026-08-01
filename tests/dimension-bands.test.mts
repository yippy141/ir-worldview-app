import test from "node:test"
import assert from "node:assert/strict"
import { dimensionLabels } from "@/lib/quiz-schema"
import { dimensionOneLiners, getKeyDrivers } from "@/lib/result-helpers"
import {
  OBSERVED_DIMENSION_RANGES,
  dimensionBand,
  dimensionHighCut,
  dimensionLowCut,
} from "@/lib/results/dimension-bands"
import type { DimensionKey, DimensionScores } from "@/lib/types"

const DIMENSION_KEYS = Object.keys(dimensionLabels) as DimensionKey[]

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
  const flatProfile = Object.fromEntries(
    DIMENSION_KEYS.map((dimension) => [
      dimension,
      OBSERVED_DIMENSION_RANGES[dimension].mean,
    ]),
  ) as DimensionScores

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
