import assert from "node:assert/strict"
import { test } from "node:test"

import { resolvePlacementFirmness } from "@/lib/results/placement-firmness"
import {
  LOW_DIFFERENTIATION_THRESHOLD,
  SHARPLY_DIFFERENTIATED_THRESHOLD,
} from "@/lib/scoring-calibration"
import type { FoundationNarrativeState } from "@/lib/narrative/foundation"

function firmness(nearestFitGap: number, state: FoundationNarrativeState) {
  return resolvePlacementFirmness({
    nearestFitGap,
    state,
    runnerUpLabel: "Liberal Institutionalist",
    lowDifferentiationThreshold: LOW_DIFFERENTIATION_THRESHOLD,
    sharplyDifferentiatedThreshold: SHARPLY_DIFFERENTIATED_THRESHOLD,
  })
}

test("more fill means more firmly fixed, which is the reverse of the old ring", () => {
  const flat = firmness(0.05, "lowDifferentiation")
  const middling = firmness(0.9, "stableModeration")
  const sharp = firmness(1.6, "sharplyDifferentiated")

  assert.equal(flat.fraction < middling.fraction, true)
  assert.equal(middling.fraction < sharp.fraction, true)
  assert.equal(flat.band, "loose")
  assert.equal(sharp.band, "firm")
})

test("the bar stays inside its track for any gap", () => {
  for (const gap of [-1, 0, 0.36, 1.46, 4, 100]) {
    const result = firmness(gap, "stableModeration")
    assert.equal(result.fraction >= 0 && result.fraction <= 1, true, `gap ${gap}`)
    assert.equal(result.looseCut >= 0 && result.looseCut <= 1, true, `gap ${gap}`)
  }
})

test("the loose cut sits below the firm end of the bar", () => {
  const result = firmness(0.9, "stableModeration")

  assert.equal(result.looseCut > 0, true)
  assert.equal(result.looseCut < 1, true)
  assert.equal(
    result.looseCut,
    LOW_DIFFERENTIATION_THRESHOLD / SHARPLY_DIFFERENTIATED_THRESHOLD,
  )
})

test("the band follows the narrative state, so page and bar never disagree", () => {
  // A gap past the sharp cut still reads loose if the narrative called it low
  // differentiation, because that classification also weighs distance from the
  // midpoint. One classifier, one answer.
  assert.equal(firmness(2, "lowDifferentiation").band, "loose")
  assert.equal(firmness(0.01, "sharplyDifferentiated").band, "firm")
  assert.equal(firmness(0.5, "stableModeration").band, "moderate")
})

test("each band names the runner-up and says what to do with the reading", () => {
  const states: FoundationNarrativeState[] = [
    "lowDifferentiation",
    "stableModeration",
    "sharplyDifferentiated",
  ]
  const readings = states.map((state) => firmness(0.7, state).reading)

  for (const reading of readings) {
    assert.equal(reading.includes("Liberal Institutionalist"), true)
    assert.equal(reading.endsWith("."), true)
  }
  assert.equal(new Set(readings).size, states.length)
})

test("a zero full scale cannot produce a non-finite fill", () => {
  const result = resolvePlacementFirmness({
    nearestFitGap: 0.5,
    state: "stableModeration",
    runnerUpLabel: "Strategic Realist",
    lowDifferentiationThreshold: 0,
    sharplyDifferentiatedThreshold: 0,
  })

  assert.equal(Number.isFinite(result.fraction), true)
  assert.equal(Number.isFinite(result.looseCut), true)
})
