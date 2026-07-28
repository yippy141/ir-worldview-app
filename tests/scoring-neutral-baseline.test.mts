import test from "node:test"
import assert from "node:assert/strict"
import { NEUTRAL_BASELINE } from "@/lib/scoring-calibration"
import { scoreFamilies } from "@/lib/scoring"
import type { DimensionKey, DimensionScores } from "@/lib/types"

// This is the formal statement of the design property that a random respondent
// is equidistant from all four families. It will fail whenever calibration drifts
// out of sync with the item bank, which is the intended behaviour.
test("the neutral calibration baseline gives every family a zero score", () => {
  const dimensionScores = Object.fromEntries(
    (Object.entries(NEUTRAL_BASELINE) as [
      DimensionKey,
      { mean: number; sd: number },
    ][]).map(([dimension, calibration]) => [dimension, calibration.mean]),
  ) as DimensionScores

  for (const [family, score] of Object.entries(scoreFamilies(dimensionScores))) {
    assert.ok(
      Math.abs(score) <= 1e-9,
      `Expected ${family} to be zero at the neutral baseline, got ${score}.`,
    )
  }
})
