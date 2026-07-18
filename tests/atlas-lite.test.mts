import test from "node:test"
import assert from "node:assert/strict"
import {
  atlasFingerprintOrder,
  getAtlasPatternHref,
  getAtlasLitePattern,
  getAtlasLitePatterns,
  matchAtlasLiteFoundation,
  matchAtlasLiteProfile,
} from "@/lib/atlas-lite"
import type { FoundationSnapshot, ModuleSnapshot } from "@/lib/profile-store"

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

test("overlapping foundations map to the bridge-builder atlas pattern", () => {
  const match = matchAtlasLiteFoundation({
    familyKey: "realist",
    runnerUpKey: "institutionalist",
    strategyModifier: "Hedger",
    normativeModifier: "Conditional Solidarist",
    foundationState: "lowDifferentiation",
    dimensionScores: {
      securityCompetition: 4.2,
      institutions: 4.1,
      domesticFilters: 4.0,
      normsIdentity: 4.0,
      politicalEconomy: 4.1,
      restraint: 4.0,
      orderJustice: 4.0,
    },
  })

  assert.equal(match.nearest.id, "broad-spectrum-bridge-builder")
})

test("true-tension profiles map to the cross-pressured atlas pattern", () => {
  const foundation: FoundationSnapshot = {
    timestamp: 1,
    payload: "payload",
    resultPath: "/results/payload",
    familyKey: "institutionalist",
    familyLabel: "Liberal Institutionalist",
    runnerUpKey: "constructivist",
    runnerUpLabel: "Social Constructivist",
    summary: "summary",
    dimensionScores: {
      securityCompetition: 4.3,
      institutions: 5.8,
      domesticFilters: 4.9,
      normsIdentity: 5.1,
      politicalEconomy: 4.7,
      restraint: 5.4,
      orderJustice: 5.3,
    },
    strategyModifier: "Restrainer",
    normativeModifier: "Pluralist",
    keyDrivers: [],
    strongLenses: [],
    locale: "en",
    localeCopyVersion: 1,
  }

  const moduleSnapshots: ModuleSnapshot[] = [
    {
      timestamp: 2,
      slug: "security",
      instrumentVersion: 2,
      locale: "en",
      localeCopyVersion: 1,
      laneScores: {},
      title: "Security",
      shorthand: "Security Pressure",
      mode: "standard",
      headline: "headline",
      summary: "summary",
      resultPath: "/modules/security/results/abc",
      scores: {
        activism: 5.5,
        escalation: 5.3,
        alliance: 5.8,
        legitimacy: 5.2,
      },
      instincts: [],
      challenge: "challenge",
      measures: [],
      doesNotClaim: [],
      evidence: [],
      laneSummaries: [],
      overlayDeltas: {
        securityCompetition: 0.55,
        institutions: 0.42,
        restraint: -0.7,
        orderJustice: -0.48,
      },
    },
    {
      timestamp: 3,
      slug: "technology",
      instrumentVersion: 2,
      locale: "en",
      localeCopyVersion: 1,
      laneScores: {},
      title: "Technology",
      shorthand: "Tech Power",
      mode: "standard",
      headline: "headline",
      summary: "summary",
      resultPath: "/modules/technology/results/def",
      scores: {
        control: 5.8,
        governance: 4.0,
        industrial: 5.4,
        safety: 4.8,
      },
      instincts: [],
      challenge: "challenge",
      measures: [],
      doesNotClaim: [],
      evidence: [],
      laneSummaries: [],
      overlayDeltas: {
        securityCompetition: 0.7,
        institutions: -0.6,
        politicalEconomy: 0.65,
        restraint: -0.35,
      },
    },
  ]

  const match = matchAtlasLiteProfile({
    foundation,
    profileState: "trueTension",
    moduleSnapshots,
  })

  assert.equal(match.nearest.id, "cross-pressured-synthesizer")
})
