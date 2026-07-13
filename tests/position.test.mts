import test from "node:test"
import assert from "node:assert/strict"
import {
  answerSpread,
  FIELD_PROJECTION_VERSION,
  spreadRingFraction,
  toDisplayPosition,
  toMapPosition,
  TRADITION_ANCHORS,
} from "@/lib/results/position"
import type { DimensionScores, FamilyKey } from "@/lib/types"

// The same synthetic tradition profiles used by tests/scoring.test.mts. Each is
// intended to project into its own quadrant of the field map.
const syntheticProfiles: Record<FamilyKey, DimensionScores> = {
  realist: {
    securityCompetition: 6.2,
    institutions: 2.5,
    domesticFilters: 3.0,
    normsIdentity: 2.8,
    politicalEconomy: 3.4,
    restraint: 3.0,
    orderJustice: 4.7,
  },
  institutionalist: {
    securityCompetition: 3.2,
    institutions: 6.2,
    domesticFilters: 5.6,
    normsIdentity: 4.8,
    politicalEconomy: 4.7,
    restraint: 5.4,
    orderJustice: 4.6,
  },
  constructivist: {
    securityCompetition: 3.1,
    institutions: 4.6,
    domesticFilters: 4.2,
    normsIdentity: 6.3,
    politicalEconomy: 4.2,
    restraint: 4.8,
    orderJustice: 4.6,
  },
  criticalPoliticalEconomy: {
    securityCompetition: 3.3,
    institutions: 2.6,
    domesticFilters: 5.7,
    normsIdentity: 4.5,
    politicalEconomy: 6.4,
    restraint: 4.4,
    orderJustice: 3.2,
  },
}

const flatProfile: DimensionScores = {
  securityCompetition: 4,
  institutions: 4,
  domesticFilters: 4,
  normsIdentity: 4,
  politicalEconomy: 4,
  restraint: 4,
  orderJustice: 4,
}

function quadrant(x: number, y: number) {
  return { horizontal: Math.sign(x), vertical: Math.sign(y) }
}

test("the field projection has a stable compatibility version", () => {
  assert.equal(FIELD_PROJECTION_VERSION, 1)
})

test("a flat profile lands exactly at the center of the map", () => {
  const position = toMapPosition(flatProfile)
  assert.equal(position.x, 0)
  assert.equal(position.y, 0)
})

test("a flat profile has zero answer spread and the maximal spread ring", () => {
  assert.equal(answerSpread(flatProfile), 0)

  const flatRing = spreadRingFraction(flatProfile)
  const spikyRing = spreadRingFraction(syntheticProfiles.realist)

  assert.ok(flatRing > spikyRing, "flat ring should be wider than a differentiated profile's ring")
  // The flat profile should produce the widest ring the map can draw.
  for (const profile of Object.values(syntheticProfiles)) {
    assert.ok(
      flatRing >= spreadRingFraction(profile),
      "no differentiated profile should exceed the flat profile's ring width",
    )
  }
})

test("map coordinates stay within the [-1, 1] field", () => {
  for (const profile of Object.values(syntheticProfiles)) {
    const { x, y } = toMapPosition(profile)
    assert.ok(x >= -1 && x <= 1, `x out of range: ${x}`)
    assert.ok(y >= -1 && y <= 1, `y out of range: ${y}`)
  }
})

test("each synthetic tradition profile lands in its own quadrant", () => {
  const expectedQuadrants: Record<FamilyKey, { horizontal: number; vertical: number }> = {
    // power (x < 0), tipped toward order/sovereignty (y > 0)
    realist: { horizontal: -1, vertical: 1 },
    // rules (x > 0), materially grounded (y < 0)
    institutionalist: { horizontal: 1, vertical: -1 },
    // rules (x > 0), ideas (y > 0)
    constructivist: { horizontal: 1, vertical: 1 },
    // structural competition (x < 0), material extreme (y < 0)
    criticalPoliticalEconomy: { horizontal: -1, vertical: -1 },
  }

  const seen = new Set<string>()
  for (const [family, profile] of Object.entries(syntheticProfiles) as [
    FamilyKey,
    DimensionScores,
  ][]) {
    const { x, y } = toMapPosition(profile)
    const q = quadrant(x, y)
    assert.deepEqual(
      q,
      expectedQuadrants[family],
      `${family} projected to (${x.toFixed(3)}, ${y.toFixed(3)})`,
    )
    seen.add(`${q.horizontal},${q.vertical}`)
  }

  assert.equal(seen.size, 4, "the four traditions must occupy four distinct quadrants")
})

test("each synthetic profile shares its tradition anchor's quadrant", () => {
  for (const anchor of TRADITION_ANCHORS) {
    const profile = syntheticProfiles[anchor.key]
    const profilePos = toMapPosition(profile)
    assert.equal(
      Math.sign(profilePos.x),
      Math.sign(anchor.position.x),
      `${anchor.key} horizontal side should match its anchor`,
    )
    assert.equal(
      Math.sign(profilePos.y),
      Math.sign(anchor.position.y),
      `${anchor.key} vertical side should match its anchor`,
    )
  }
})

test("distinct payloads produce visibly different positions", () => {
  const realist = toMapPosition(syntheticProfiles.realist)
  const cpe = toMapPosition(syntheticProfiles.criticalPoliticalEconomy)
  const distance = Math.hypot(realist.x - cpe.x, realist.y - cpe.y)
  assert.ok(distance > 0.3, `expected a visible gap between profiles, got ${distance.toFixed(3)}`)
})

test("answer spread grows with dimension dispersion", () => {
  assert.ok(answerSpread(syntheticProfiles.realist) > answerSpread(flatProfile))
  assert.ok(answerSpread(syntheticProfiles.constructivist) > 0)
})

test("low differentiation widens the ring and damps the position toward center", () => {
  const profile = syntheticProfiles.realist

  const honestRing = spreadRingFraction(profile, true)
  const confidentRing = spreadRingFraction(profile, false)
  assert.ok(honestRing >= confidentRing, "low-differentiation ring should not be narrower")
  assert.ok(honestRing >= 0.75, "low-differentiation ring should be wide")

  const damped = toDisplayPosition(profile, true)
  const undamped = toDisplayPosition(profile, false)
  assert.ok(
    Math.hypot(damped.x, damped.y) < Math.hypot(undamped.x, undamped.y),
    "low-differentiation position should sit closer to center",
  )
})
