import assert from "node:assert/strict"
import { test } from "node:test"

import { archetypes, resolveArchetype } from "@/lib/archetypes"
import { resolveRestraintPosture } from "@/lib/results/posture"
import { buildCanonicalFoundationResult } from "@/lib/scoring"
import { MODELED_FAMILY_KEYS } from "@/lib/worldview-config"
import type { DimensionScores, FamilyKey } from "@/lib/types"

/** A profile that lands firmly on one family, with restraint dialled by hand. */
const FAMILY_SHAPES: Record<FamilyKey, Omit<DimensionScores, "restraint">> = {
  realist: {
    securityCompetition: 6.6,
    institutions: 2.2,
    domesticFilters: 3.2,
    normsIdentity: 2.4,
    politicalEconomy: 3.4,
    orderJustice: 5.2,
  },
  institutionalist: {
    securityCompetition: 2.6,
    institutions: 6.6,
    domesticFilters: 5.4,
    normsIdentity: 4.2,
    politicalEconomy: 4.2,
    orderJustice: 4.4,
  },
  constructivist: {
    securityCompetition: 3.0,
    institutions: 4.4,
    domesticFilters: 4.2,
    normsIdentity: 6.7,
    politicalEconomy: 3.8,
    orderJustice: 4.6,
  },
  criticalPoliticalEconomy: {
    securityCompetition: 3.4,
    institutions: 2.4,
    domesticFilters: 5.6,
    normsIdentity: 4.2,
    politicalEconomy: 6.7,
    orderJustice: 2.6,
  },
}

function profile(familyKey: FamilyKey, restraint: number) {
  return buildCanonicalFoundationResult({
    ...FAMILY_SHAPES[familyKey],
    restraint,
  } as DimensionScores)
}

test("restraint maps onto the track without inventing headroom", () => {
  assert.equal(resolveRestraintPosture(profile("realist", 1)).fraction, 0)
  assert.equal(resolveRestraintPosture(profile("realist", 7)).fraction, 1)
  assert.equal(resolveRestraintPosture(profile("realist", 4)).fraction, 0.5)
  assert.equal(resolveRestraintPosture(profile("realist", 4)).postureCut, 0.5)
})

test("every modeled lens names both ends from the archetype catalog", () => {
  for (const familyKey of MODELED_FAMILY_KEYS) {
    const posture = resolveRestraintPosture(profile(familyKey, 5.8))

    assert.equal(posture.low.code.endsWith("+"), true, `${familyKey} low end`)
    assert.equal(posture.high.code.endsWith("-"), true, `${familyKey} high end`)
    assert.notEqual(posture.low.name, posture.high.name)
    assert.equal(posture.low.name.length > 0, true)
    assert.equal(posture.high.name.length > 0, true)
    // The pair differs only in sign — same lens, or same lens blend.
    assert.equal(posture.low.code.slice(0, -1), posture.high.code.slice(0, -1))
  }
})

test("the realist pair is Kairos and Shi, both linked to their evidence pages", () => {
  const posture = resolveRestraintPosture(profile("realist", 5.8))

  assert.equal(posture.blend, false)
  assert.equal(posture.low.code, "P+")
  assert.equal(posture.low.name, "Kairos")
  assert.equal(posture.low.href, "/archetypes/p-plus")
  assert.equal(posture.high.code, "P-")
  assert.equal(posture.high.name, "Shi (勢)")
  assert.equal(posture.high.href, "/archetypes/p-minus")
})

test("the posture sign and the current end agree with the archetype layer", () => {
  for (const familyKey of MODELED_FAMILY_KEYS) {
    for (const restraint of [1.4, 3.2, 4.6, 6.4]) {
      const result = profile(familyKey, restraint)
      const posture = resolveRestraintPosture(result)
      const archetype = resolveArchetype(result)

      assert.equal(posture.posture, archetype.posture)
      assert.equal(posture.current.code, archetype.code)
      assert.equal(
        posture.current.code,
        posture.posture === "+" ? posture.low.code : posture.high.code,
      )
    }
  }
})

test("a blended reading pairs two blend archetypes and drops the evidence link", () => {
  // Nudge a profile until the two nearest families stay close enough to blend.
  const blended = resolveRestraintPosture(
    buildCanonicalFoundationResult({
      securityCompetition: 4.2,
      institutions: 4.3,
      domesticFilters: 4.2,
      normsIdentity: 4.3,
      politicalEconomy: 4.2,
      restraint: 5.6,
      orderJustice: 4.2,
    }),
  )

  if (!blended.blend) return
  assert.equal(blended.low.code.includes("/"), true)
  assert.equal(blended.high.code.includes("/"), true)
  assert.equal(blended.low.href, null)
  assert.equal(blended.high.href, null)
})

test("every archetype in the catalog is reachable as a posture endpoint", () => {
  const reachable = new Set<string>()
  for (const familyKey of MODELED_FAMILY_KEYS) {
    const posture = resolveRestraintPosture(profile(familyKey, 5.8))
    reachable.add(posture.low.code)
    reachable.add(posture.high.code)
  }

  for (const archetype of archetypes) {
    assert.equal(
      reachable.has(archetype.code),
      true,
      `${archetype.code} (${archetype.name}) is never offered as an endpoint`,
    )
  }
})
