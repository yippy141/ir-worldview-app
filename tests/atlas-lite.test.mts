import test from "node:test"
import assert from "node:assert/strict"
import {
  atlasFingerprintOrder,
  getAtlasPatternHref,
  getAtlasLitePattern,
  getAtlasLitePatterns,
} from "@/lib/atlas-lite"

const legacyPatternIdentity = [
  { id: "broad-spectrum-bridge-builder", name: "Bridge Builder" },
  { id: "constraint-first-realist", name: "Constraint-First Realist" },
  { id: "competitive-balancer", name: "Competitive Balancer" },
  { id: "coalition-pragmatist", name: "Coalition Pragmatist" },
  { id: "institution-builder", name: "Institution Builder" },
  { id: "legitimacy-attuned-reader", name: "Legitimacy Reader" },
  { id: "justice-forward-solidarist", name: "Justice-Forward Solidarist" },
  { id: "structural-inequality-critic", name: "Structural Inequality Critic" },
  { id: "development-sovereignty-builder", name: "Development-Sovereignty Builder" },
  { id: "cross-pressured-synthesizer", name: "Cross-Pressured Synthesizer" },
] as const

const publicNames = [
  "Several Lenses",
  "Power with Limits",
  "Power and Leverage",
  "Coalitions First",
  "Rules and Cooperation",
  "Meaning and Legitimacy",
  "Justice and Protection",
  "Power Behind the Rules",
  "Capacity and Autonomy",
  "Different by Domain",
] as const

test("atlas preserves legacy identities, ordering, and detail URLs", () => {
  const patterns = getAtlasLitePatterns()

  assert.deepEqual(
    patterns.map(({ id, name }) => ({ id, name })),
    legacyPatternIdentity,
  )
  assert.deepEqual(
    patterns.map(({ id }) => getAtlasPatternHref(id)),
    legacyPatternIdentity.map(({ id }) => `/explore/atlas/${id}`),
  )
})

test("atlas provides complete and unique public display contracts", () => {
  const patterns = getAtlasLitePatterns()
  const actualPublicNames = patterns.map(({ publicName }) => publicName)

  assert.deepEqual(actualPublicNames, publicNames)
  assert.equal(new Set(actualPublicNames).size, patterns.length)

  for (const pattern of patterns) {
    assert.equal(pattern.technicalDescriptor, pattern.name)
    assert.ok(pattern.technicalDescriptor.trim().length > 0)
    assert.ok(pattern.decisionRule.trim().length > 0)
  }
})

test("atlas exposes a bounded curated pattern set, valid neighbors, and detail-ready content", () => {
  const patterns = getAtlasLitePatterns()

  assert.ok(patterns.length >= 8 && patterns.length <= 12)

  for (const pattern of patterns) {
    assert.ok(pattern.cardSummary.length > 0)
    assert.ok(pattern.cardDrivers.length >= 2 && pattern.cardDrivers.length <= 3)
    assert.ok(pattern.detailSummary.length > 0)
    assert.ok(pattern.soWhat.length > 0)
    assert.ok(pattern.detailDrivers.length >= 3)
    assert.ok(pattern.underestimates.length >= 2)
    assert.ok(pattern.securitySummary.length > 0)
    assert.ok(pattern.technologySummary.length > 0)
    assert.ok(pattern.confusionNote.length > 0)
    assert.ok(pattern.pressureTestQuestions.length >= 2)
    assert.deepEqual(
      Object.keys(pattern.fingerprint).sort(),
      [...atlasFingerprintOrder].sort(),
    )

    for (const neighborId of pattern.neighborIds) {
      assert.ok(
        getAtlasLitePattern(neighborId),
        `expected neighbor ${neighborId} for atlas pattern ${pattern.id} to resolve`,
      )
    }
  }
})

test("atlas records are static editorial content without assignment rules", () => {
  for (const pattern of getAtlasLitePatterns()) {
    assert.equal(Object.hasOwn(pattern, "rules"), false)
  }
})
