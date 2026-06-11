import test from "node:test"
import assert from "node:assert/strict"
import { exploreFamilies, getFamilyBySlug } from "@/lib/explore-content"
import {
  familyKeyFromSlug,
  familySlug,
  MODELED_FAMILY_KEYS,
} from "@/lib/worldview-config"

test("modeled explore families use canonical slugs", () => {
  assert.deepEqual(
    exploreFamilies.map((family) => family.familyKey).sort(),
    [...MODELED_FAMILY_KEYS].sort(),
  )

  for (const family of exploreFamilies) {
    const canonicalSlug = familySlug(family.familyKey)

    assert.equal(family.slug, canonicalSlug)
    assert.equal(familyKeyFromSlug(canonicalSlug), family.familyKey)
    assert.equal(getFamilyBySlug(canonicalSlug)?.familyKey, family.familyKey)
  }
})

test("explore cards and result neighbor links resolve to canonical slugs", () => {
  for (const family of exploreFamilies) {
    assert.ok(
      getFamilyBySlug(familySlug(family.familyKey)),
      `expected explore card slug for ${family.familyKey} to resolve`,
    )

    for (const neighbor of family.neighbors) {
      const neighborTarget = getFamilyBySlug(familySlug(neighbor.familyKey))

      assert.ok(
        neighborTarget,
        `expected neighbor slug for ${family.familyKey} -> ${neighbor.familyKey} to resolve`,
      )
      assert.equal(familyKeyFromSlug(familySlug(neighbor.familyKey)), neighbor.familyKey)
    }
  }
})
