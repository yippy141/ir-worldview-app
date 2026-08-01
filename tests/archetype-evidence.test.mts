import test from "node:test"
import assert from "node:assert/strict"
import {
  archetypeEvidence,
  archetypeEvidencePath,
  archetypeEvidenceSlug,
  getArchetypeEvidenceBySlug,
  validateArchetypeEvidence,
} from "@/lib/archetype-evidence"
import { archetypes, resolveArchetype } from "@/lib/archetypes"
import { buildCanonicalFoundationResult } from "@/lib/scoring"

const ownerAuthoredNames = {
  "P+": "The Hegemon",
  "P-": "Shi (勢)",
  "R+": "Grotian",
  "R-": "Concert",
  "M+": "The Iconoclast",
  "M-": "Nemawashi (根回し)",
  "S+": "Dirigisme",
  "S-": "Dependencia",
} as const

test("owner-authored pure archetypes and analogue evidence are complete", () => {
  assert.deepStrictEqual(validateArchetypeEvidence(), [])
  assert.equal(archetypes.length, 8)
  assert.equal(archetypeEvidence.length, 8)

  for (const archetype of archetypes) {
    assert.equal(archetype.name, ownerAuthoredNames[archetype.code])
    assert.ok(archetype.analogue.label)
    assert.ok(archetype.analogue.year)
    assert.match(archetype.analogue.href, /^https:\/\//)

    const slug = archetypeEvidenceSlug(archetype.code)
    assert.equal(archetypeEvidencePath(archetype.code), `/archetypes/${slug}`)
    assert.equal(
      getArchetypeEvidenceBySlug(slug)?.archetype.code,
      archetype.code,
    )
  }

  assert.equal(
    new Set(archetypes.map(({ code }) => archetypeEvidenceSlug(code))).size,
    8,
  )
})

test("leading articles remain on pure names but are removed in blend names", () => {
  assert.equal(archetypes.find(({ code }) => code === "P+")?.name, "The Hegemon")

  const blend = resolveArchetype(
    buildCanonicalFoundationResult({
      securityCompetition: 6.2,
      institutions: 2.5,
      domesticFilters: 3,
      normsIdentity: 6.1,
      politicalEconomy: 3.4,
      restraint: 3,
      orderJustice: 4.7,
    }),
    10,
  )

  assert.equal(blend.code, "P/M+")
  assert.equal(blend.name, "Hegemon–Iconoclast")
  assert.equal(blend.analogue, null)
})
