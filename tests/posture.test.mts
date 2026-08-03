import assert from "node:assert/strict"
import { test } from "node:test"

import { atlasLitePatterns } from "@/lib/atlas-lite"
import { findRestraintProfilePair, resolveRestraintPosture } from "@/lib/results/posture"
import { MODELED_FAMILY_KEYS } from "@/lib/worldview-config"
import type { DimensionScores } from "@/lib/types"

function scores(restraint: number): DimensionScores {
  return {
    securityCompetition: 5.4,
    institutions: 3.2,
    domesticFilters: 4,
    normsIdentity: 3.6,
    politicalEconomy: 3.4,
    restraint,
    orderJustice: 4.6,
  }
}

test("restraint maps onto the track without inventing headroom", () => {
  assert.equal(resolveRestraintPosture("realist", scores(1)).fraction, 0)
  assert.equal(resolveRestraintPosture("realist", scores(7)).fraction, 1)
  assert.equal(resolveRestraintPosture("realist", scores(4)).fraction, 0.5)
  assert.equal(resolveRestraintPosture("realist", scores(9)).fraction, 1)
})

test("the drawn band boundaries match the scorer's cut points", () => {
  const posture = resolveRestraintPosture("realist", scores(4))

  assert.equal(resolveRestraintPosture("realist", scores(3.8)).band, "Maximizer")
  assert.equal(resolveRestraintPosture("realist", scores(4.5)).band, "Hedger")
  assert.equal(resolveRestraintPosture("realist", scores(5.6)).band, "Restrainer")
  assert.equal(posture.bandBoundaries.maximizer < posture.bandBoundaries.restrainer, true)
  assert.equal(posture.bandBoundaries.maximizer, (3.85 - 1) / 6)
  assert.equal(posture.bandBoundaries.restrainer, (5.15 - 1) / 6)
})

test("the realist lens names both ends from existing worldview profiles", () => {
  const posture = resolveRestraintPosture("realist", scores(5.6))

  assert.equal(posture.namedProfiles, true)
  assert.equal(posture.low.kind, "profile")
  assert.equal(posture.high.kind, "profile")
  assert.equal(posture.low.label, "Power and Leverage")
  assert.equal(posture.high.label, "Power with Limits")
  assert.equal(posture.low.href, "/explore/atlas/competitive-balancer")
  assert.equal(posture.high.href, "/explore/atlas/constraint-first-realist")
})

test("a lens whose profiles do not separate on restraint falls back to the modifier names", () => {
  for (const familyKey of ["institutionalist", "constructivist", "criticalPoliticalEconomy"] as const) {
    const posture = resolveRestraintPosture(familyKey, scores(4.4))
    assert.equal(posture.namedProfiles, false, `${familyKey} claimed a profile pair`)
    assert.equal(posture.low.label, "Maximizer")
    assert.equal(posture.high.label, "Restrainer")
    assert.equal(posture.low.href, undefined)
  }
})

test("every modeled lens resolves to a usable posture strip", () => {
  for (const familyKey of MODELED_FAMILY_KEYS) {
    const posture = resolveRestraintPosture(familyKey, scores(4.4))
    assert.equal(posture.low.label.length > 0, true)
    assert.equal(posture.high.label.length > 0, true)
    assert.notEqual(posture.low.label, posture.high.label)
  }
})

test("a named pair never points at the same profile twice", () => {
  for (const familyKey of MODELED_FAMILY_KEYS) {
    const pair = findRestraintProfilePair(familyKey, atlasLitePatterns)
    if (!pair) continue
    assert.notEqual(pair.low.id, pair.high.id)
    assert.notEqual(pair.low.fingerprint.restraint, pair.high.fingerprint.restraint)
  }
})
