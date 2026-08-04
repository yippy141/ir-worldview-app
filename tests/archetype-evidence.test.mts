import test from "node:test"
import assert from "node:assert/strict"
import {
  archetypeEvidence,
  archetypeEvidencePath,
  archetypeEvidenceSlug,
  getArchetypeEvidenceBySlug,
  parseArchetypeEvidenceReturnPath,
  validateArchetypeEvidence,
} from "@/lib/archetype-evidence"
import { archetypes, resolveArchetype } from "@/lib/archetypes"
import { buildCanonicalFoundationResult } from "@/lib/scoring"

const ownerAuthoredNames = {
  "P+": "Kairos",
  "P-": "Shi (勢)",
  "R+": "Grotian",
  "R-": "Concert",
  "M+": "Satyagraha",
  "M-": "Musyawarah",
  "S+": "Dirigisme",
  "S-": "Dependencia",
} as const

// Names whose evidence page must footnote a collision or a live second
// meaning, rather than presenting the term as unambiguous.
const namesRequiringANote: readonly string[] = ["R+", "P-"]

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

test("names that collide with an established usage carry an evidence-page note", () => {
  for (const record of archetypeEvidence) {
    if (namesRequiringANote.includes(record.code)) {
      assert.ok(
        record.nameNote?.trim(),
        `${record.code} must footnote its name.`,
      )
    }
  }

  const grotian = archetypeEvidence.find(({ code }) => code === "R+")
  assert.match(grotian?.nameNote ?? "", /Wight/)

  const shi = archetypeEvidence.find(({ code }) => code === "P-")
  assert.match(shi?.nameNote ?? "", /大势/)
})

test("blend names compose the two pure names and claim no analogue", () => {
  // No V22 name carries a leading article, so blendNamePart's article-stripping
  // rule is not exercised here. Pure names must reach a blend verbatim.
  assert.equal(archetypes.find(({ code }) => code === "P+")?.name, "Kairos")
  assert.equal(archetypes.find(({ code }) => code === "M+")?.name, "Satyagraha")

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
  assert.equal(blend.name, "Kairos–Satyagraha")
  assert.equal(blend.analogue, null)
})

test("analogue return links accept only local Foundation result paths", () => {
  assert.equal(
    parseArchetypeEvidenceReturnPath("/results/abc_DEF-123"),
    "/results/abc_DEF-123",
  )

  for (const value of [
    "https://example.com/results/token",
    "//example.com/results/token",
    "/profile",
    "/results/token?extra=true",
    ["/results/token"],
    undefined,
  ]) {
    assert.equal(parseArchetypeEvidenceReturnPath(value), null)
  }
})
