import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import exploreHubData from "@/content/explore/hub.en.json" with { type: "json" }
import {
  EXPLORE_HUB_DIMENSION_ORDER,
  EXPLORE_HUB_LENS_ORDER,
  EXPLORE_HUB_SECTION_ORDER,
  exploreFamilies,
  exploreHubContentValidationErrors,
  getExploreHubContent,
  getFamilyBySlug,
  validateExploreHubContent,
} from "@/lib/explore-content"
import { archetypes, getArchetypePath } from "@/lib/archetypes"
import { getAtlasLitePatterns, getAtlasPatternHref } from "@/lib/atlas-lite"
import { getVisibleReferenceEntities } from "@/lib/field/items"
import { dimensionLabels } from "@/lib/quiz-schema"
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

test("Explore hub locks the nine-section ontology and bounded content schema", () => {
  assert.deepEqual(exploreHubContentValidationErrors, [])
  const hub = getExploreHubContent()
  assert.ok(hub)
  assert.equal(hub.schemaVersion, 1)
  assert.equal(hub.locale, "en")
  assert.equal(hub.hero.payoff.length, 2)
  assert.deepEqual(
    hub.sections.map(({ id }) => id),
    EXPLORE_HUB_SECTION_ORDER,
  )
  assert.deepEqual(
    hub.lensBands.map(({ lens }) => lens),
    EXPLORE_HUB_LENS_ORDER,
  )
  assert.deepEqual(
    hub.normativeAliases.map(({ state, label }) => ({ state, label })),
    [
      { state: "o", label: "Order-first" },
      { state: "c", label: "Conditional" },
      { state: "j", label: "Justice-first" },
    ],
  )
  assert.deepEqual(
    hub.dimensions.map(({ key }) => key),
    EXPLORE_HUB_DIMENSION_ORDER,
  )
  assert.deepEqual(
    hub.contextRecords.map(({ id, href }) => ({ id, href })),
    [
      { id: "security", href: "/modules/security" },
      { id: "technology", href: "/modules/technology" },
      { id: "ai-governance", href: "/ai" },
      { id: "perspective-runs", href: "/perspectives" },
      { id: "current-cases", href: "/cases" },
    ],
  )
})

test("Explore hub validation fails closed on reordered sections, unsafe routes, or extra fields", () => {
  const reordered = structuredClone(exploreHubData) as unknown as {
    sections: unknown[]
  }
  const firstSection = reordered.sections[0]
  reordered.sections[0] = reordered.sections[1]
  reordered.sections[1] = firstSection
  assert.equal(getExploreHubContent(reordered), null)
  assert.ok(
    validateExploreHubContent(reordered).some((error) =>
      error.includes("sections[0].id"),
    ),
  )

  const unsafe = structuredClone(exploreHubData) as unknown as {
    referenceDirectory: { href: string }
  }
  unsafe.referenceDirectory.href = "https://example.com/profiles"
  assert.equal(getExploreHubContent(unsafe), null)
  assert.ok(
    validateExploreHubContent(unsafe).some((error) =>
      error.includes("referenceDirectory.href"),
    ),
  )

  const expanded = structuredClone(exploreHubData) as unknown as Record<string, unknown>
  expanded.generatedFallback = "Never render this."
  assert.equal(getExploreHubContent(expanded), null)
  assert.ok(
    validateExploreHubContent(expanded).some((error) =>
      error.includes("unexpected or missing fields"),
    ),
  )
})

test("Explore hub derives identities, dimensions, patterns, and reference rows from canonical APIs", () => {
  const hub = getExploreHubContent()
  assert.ok(hub)

  const archetypePaths = new Set<string>()
  for (const lens of hub.lensBands) {
    const records = archetypes.filter((archetype) => archetype.lens === lens.lens)
    assert.deepEqual(
      records.map(({ posture }) => posture),
      ["+", "-"],
    )
    records.forEach((record) => archetypePaths.add(getArchetypePath(record.code)))
  }
  assert.equal(archetypePaths.size, 8)

  assert.deepEqual(
    hub.dimensions.map(({ key }) => dimensionLabels[key]),
    EXPLORE_HUB_DIMENSION_ORDER.map((key) => dimensionLabels[key]),
  )

  const patterns = getAtlasLitePatterns()
  assert.equal(patterns.length, 10)
  assert.equal(
    new Set(patterns.map(({ id }) => getAtlasPatternHref(id))).size,
    patterns.length,
  )
  assert.equal(hub.decisionPatternDirectory.mapHref, "/explore/atlas")

  const references = getVisibleReferenceEntities()
  assert.ok(references.every((record) => record.publicationStatus === "published"))
  assert.equal(hub.referenceDirectory.href, "/explore/reference")

  const routeSource = readFileSync(
    resolve(process.cwd(), "app/explore/page.tsx"),
    "utf8",
  )
  assert.match(routeSource, /hub\.sections\.map/)
  assert.match(routeSource, /data-explore-section=\{section\.id\}/)
  assert.match(routeSource, /getVisibleReferenceEntities\(\)/)
  assert.doesNotMatch(routeSource, /associatedThinkers/)
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
