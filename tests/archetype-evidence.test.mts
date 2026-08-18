import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import {
  archetypeEvidence,
  archetypeEvidencePath,
  archetypeEvidenceSlug,
  getArchetypeEvidence,
  getArchetypeEvidenceBySlug,
  parseArchetypeEvidenceReturnPath,
  validateArchetypeEvidence,
} from "@/lib/archetype-evidence"
import { LEGACY_COMPARISON_QUALIFICATION } from "@/lib/archetype-content"
import { archetypes, resolveArchetype } from "@/lib/archetypes"
import { buildCanonicalFoundationResult } from "@/lib/scoring"

const repositoryRoot = process.cwd()

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
const namesRequiringANote = new Set<string>(["R+", "P-"])

test("owner-authored pure archetypes and analogue evidence are complete", () => {
  assert.deepStrictEqual(validateArchetypeEvidence(), [])
  assert.equal(archetypes.length, 8)
  assert.equal(archetypeEvidence.length, 8)
  assert.deepEqual(
    archetypeEvidence.map(({ code }) => code),
    archetypes.map(({ code }) => code),
  )

  for (const archetype of archetypes) {
    assert.equal(archetype.name, ownerAuthoredNames[archetype.code])
    assert.ok(archetype.analogue.label)
    assert.ok(archetype.analogue.year)
    assert.match(archetype.analogue.href, /^https:\/\//)

    const slug = archetypeEvidenceSlug(archetype.code)
    assert.equal(slug, archetype.slug)
    assert.equal(archetypeEvidencePath(archetype.code), `/archetypes/${slug}`)
    const resolved = getArchetypeEvidenceBySlug(slug)
    assert.equal(resolved?.archetype.code, archetype.code)
    assert.equal(
      resolved?.evidence.qualification,
      LEGACY_COMPARISON_QUALIFICATION,
    )
    assert.ok((resolved?.evidence.sources.length ?? 0) > 0)
  }

  assert.equal(
    new Set(archetypes.map(({ code }) => archetypeEvidenceSlug(code))).size,
    8,
  )
})

test("historical paths delegate slug ownership to the canonical identity catalog", () => {
  const source = readFileSync(
    resolve(repositoryRoot, "lib/archetype-evidence.ts"),
    "utf8",
  )

  assert.match(source, /return getArchetypeSlug\(code\)/)
  assert.match(source, /return getArchetypePath\(code\)/)
  assert.match(source, /getArchetypeBySlug\(slug\)/)
  assert.doesNotMatch(source, /code\s*\[\s*[01]\s*\]/)
  assert.doesNotMatch(source, /\.toLowerCase\s*\(/)
  assert.doesNotMatch(source, /["']p-plus["']/)
})

test("names that collide with an established usage carry an evidence-page note", () => {
  for (const record of archetypeEvidence) {
    if (namesRequiringANote.has(record.code)) {
      const evidence = getArchetypeEvidence(record.code)?.evidence
      assert.ok(
        evidence?.nameNote?.trim(),
        `${record.code} must footnote its name.`,
      )
    }
  }

  const grotian = getArchetypeEvidence("R+")?.evidence
  assert.match(grotian?.nameNote ?? "", /Wight/)

  const shi = getArchetypeEvidence("P-")?.evidence
  assert.match(shi?.nameNote ?? "", /大势/)
})

test("legacy comparison pages label provisional evidence without claiming review", () => {
  const source = readFileSync(
    resolve(repositoryRoot, "app/archetypes/[slug]/page.tsx"),
    "utf8",
  )

  assert.match(source, /\{evidence\.qualification\}/)
  assert.match(source, />Provisional source</)
  assert.doesNotMatch(source, />Reviewed source</)
  assert.match(source, /if \(!identity\) notFound\(\)/)
  assert.doesNotMatch(source, /if \(!resolved\) notFound\(\)/)
  assert.match(source, /Historical comparison under review/)
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
