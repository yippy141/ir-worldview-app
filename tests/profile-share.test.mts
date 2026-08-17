import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import {
  buildCompatibleProfileSharePayload,
  buildProfileSharePayload,
  buildProfileSharePayloadV1,
  buildProfileSharePayloadV2,
  decodeProfileSharePayload,
  encodeProfileSharePayload,
  normalizeProfileShareInput,
  resolveProfileSharePayload,
} from "@/lib/profile-share"
import { aiAxisScoresToArray, encodeAiPayload } from "@/lib/ai-governance-share"
import {
  buildModuleAnalytics,
  encodeModulePayload,
  getModuleDefinition,
  getModuleQuestions,
} from "@/lib/modules/framework"
import { MODULE_V22_TUPLE } from "@/lib/modules/versions"
import { getPerspectiveDefinition } from "@/lib/perspectives/catalog"
import {
  encodePerspectivePayload,
  resolvePerspectivePayload,
} from "@/lib/perspectives/share"
import { buildLocalizedProfileShareView } from "@/lib/profile-share-locale"
import { FIELD_PROJECTION_VERSION } from "@/lib/results/position"
import { dimensionScoresToArray, encodePayload, resolveFoundationPayload } from "@/lib/share"
import { parseProfileStore, type ProfileStore } from "@/lib/profile-store"
import { encodeUrlPayload } from "@/lib/url-payload"

const foundationPayload = encodePayload({
  v: 2,
  ds: dimensionScoresToArray({
    securityCompetition: 4.3,
    institutions: 5.8,
    domesticFilters: 4.9,
    normsIdentity: 5.1,
    politicalEconomy: 4.7,
    restraint: 5.4,
    orderJustice: 5.3,
  }),
  fk: "institutionalist",
  nk: "constructivist",
  sm: "Restrainer",
  nm: "Pluralist",
})

const resolvedFoundation = resolveFoundationPayload(foundationPayload)
assert.ok(resolvedFoundation, "expected canonical foundation payload to resolve in test fixture")

function buildCanonicalModuleFixture(slug: "security" | "technology") {
  const definition = getModuleDefinition(slug)
  assert.ok(definition)
  const mode = "standard" as const
  const answers = Object.fromEntries(
    getModuleQuestions(definition, mode).map((question) => [
      question.id,
      { primary: question.options[0].id },
    ]),
  )
  const analytics = buildModuleAnalytics(definition, mode, answers)
  return {
    payload: encodeModulePayload({
      v: 3,
      bv: MODULE_V22_TUPLE.bankVersion,
      sv: MODULE_V22_TUPLE.scoringVersion,
      slug,
      mode,
      answers,
    }),
    scores: analytics.scores,
    laneScores: analytics.laneScores,
    cardTypeScores: analytics.cardTypeScores,
    instrumentVersion: MODULE_V22_TUPLE.bankVersion,
  }
}

const securityCanonical = buildCanonicalModuleFixture("security")
const technologyCanonical = buildCanonicalModuleFixture("technology")

// Captured before V16; this must remain a literal compatibility fixture.
const PRE_V16_PROFILE_SHARE_V1 =
  "eyJ2IjoxLCJmIjoiZXlKMklqb3lMQ0prY3lJNld6WXVNalVzTWk0MUxEUXNNeTQzTlN3MUxqVXNOQzR5TlN3eUxqYzFYU3dpWm1zaU9pSnlaV0ZzYVhOMElpd2libXNpT2lKcGJuTjBhWFIxZEdsdmJtRnNhWE4wSWl3aWMyMGlPaUpJWldSblpYSWlMQ0p1YlNJNklrTnZibVJwZEdsdmJtRnNJRk52Ykdsa1lYSnBjM1FpZlEiLCJtcyI6W10sInBzIjoic3RhYmxlTW9kZXJhdGlvbiJ9"

const profile: ProfileStore = {
  v: 5,
  foundation: {
    timestamp: 1,
    payload: foundationPayload,
    instrumentStructuralVersion: 3,
    scoringVersion: 1,
    resultPath: `/results/${foundationPayload}`,
    familyKey: resolvedFoundation.result.familyKey,
    familyLabel: resolvedFoundation.result.familyLabel,
    runnerUpKey: resolvedFoundation.result.runnerUpKey,
    runnerUpLabel: resolvedFoundation.result.runnerUpLabel,
    summary: "Canonical foundation summary",
    dimensionScores: resolvedFoundation.dimensionScores,
    strategyModifier: resolvedFoundation.result.strategyModifier,
    normativeModifier: resolvedFoundation.result.normativeModifier,
    keyDrivers: [],
    strongLenses: [],
    locale: "en",
    localeCopyVersion: 1,
  },
  modules: {
    security: {
      timestamp: 2,
      slug: "security",
      locale: "en",
      localeCopyVersion: 1,
      ...securityCanonical,
      title: "Security",
      shorthand: "Security Pressure",
      mode: "standard",
      headline: "Security read: coalition-centered pressure management",
      summary: "Security summary",
      resultPath: "/modules/security/results/abc",
      instincts: [],
      comparison: "Security pulls the profile toward alliance durability and sharper coercive management.",
      challenge: "",
      measures: [],
      doesNotClaim: [],
      evidence: [],
      laneSummaries: [
        {
          key: "deterrence",
          label: "Deterrence and escalation",
          summary: "Pressure is accepted \u2014 but escalation ceilings stay visible.",
          score: 5.4,
          lowLabel: "Crisis-limiting",
          highLabel: "Pressure-forward",
        },
        {
          key: "alliances",
          label: "Alliances and autonomy",
          summary: "Alliance credibility carries unusual weight here.",
          score: 5.8,
          lowLabel: "Autonomy space",
          highLabel: "Alliance-centered",
        },
      ],
      overlayDeltas: {
        securityCompetition: 0.55,
        institutions: 0.42,
        restraint: -0.7,
        orderJustice: -0.48,
      },
      cardTypeRead: {
        headline: "Explanation and choice do not land in exactly the same place",
        summary: "The diagnostic read is somewhat harder than the endorsed policy line \u2014 not a contradiction.",
      },
      cardTypeScores: {
        explanation: {
          activism: 5.9,
          legitimacy: 4.4,
        },
        decision: {
          activism: 4.9,
          legitimacy: 5.3,
        },
      },
    },
    technology: {
      timestamp: 3,
      slug: "technology",
      locale: "en",
      localeCopyVersion: 1,
      ...technologyCanonical,
      title: "Technology",
      shorthand: "Tech Power",
      mode: "standard",
      headline: "Technology read: control with capacity-building",
      summary: "Technology summary",
      resultPath: "/modules/technology/results/def",
      instincts: [],
      comparison: "Technology sharpens the political-economy side of the profile.",
      challenge: "",
      measures: [],
      doesNotClaim: [],
      evidence: [],
      laneSummaries: [
        {
          key: "controls",
          label: "Controls and dependence",
          summary: "Chokepoints and dependencies are read in harder strategic terms.",
          score: 5.8,
          lowLabel: "Open by default",
          highLabel: "Control-first",
        },
        {
          key: "capacity",
          label: "Capacity and industrial policy",
          summary: "Public capacity-building stays central.",
          score: 5.4,
          lowLabel: "Market-led",
          highLabel: "State-capacity led",
        },
      ],
      overlayDeltas: {
        securityCompetition: 0.7,
        institutions: -0.6,
        politicalEconomy: 0.65,
        restraint: -0.35,
      },
      cardTypeScores: {
        explanation: {
          control: 6,
          governance: 4.1,
          safety: 4.4,
        },
        actorLens: {
          control: 5.7,
          governance: 4.8,
          safety: 4.2,
        },
        decision: {
          control: 5.1,
          governance: 5,
          safety: 5.3,
        },
      },
    },
  },
  foundationHistory: [],
  moduleHistory: [],
  aiGovernance: null,
  aiHistory: [],
  perspectiveRuns: [],
}

const aiScores = {
  riskHorizon: 5.1,
  deploymentPace: 4.8,
  oversight: 5.9,
  geopolitics: 4.6,
  openness: 4.2,
  militaryRole: 3.8,
  legitimacy: 5.7,
  humanFuture: 5.2,
}

const aiPayload = encodeAiPayload({
  v: 1,
  as: aiAxisScoresToArray(aiScores),
  ak: "coordinationArchitect",
  nk: "precautionarySteward",
  rl: "Mixed risk lens",
  pm: "Threshold guardrails",
  gm: "Coordination-first",
})

const perspectiveDefinition = getPerspectiveDefinition("exposed-ally")
assert.ok(perspectiveDefinition)
const perspectiveAnswers = Object.fromEntries(
  perspectiveDefinition.scenarios.map((scenario) => [
    scenario.id,
    scenario.options[0].id,
  ]),
)
const perspectivePayload = encodePerspectivePayload({
  v: 1,
  perspectiveId: "exposed-ally",
  scenarioSetVersion: perspectiveDefinition.scenarioSetVersion,
  baselineScores: dimensionScoresToArray(resolvedFoundation.dimensionScores),
  answers: perspectiveAnswers,
})
const resolvedPerspective = resolvePerspectivePayload(
  perspectivePayload,
  "exposed-ally",
)
assert.ok(resolvedPerspective)

const profileWithV2Overlays: ProfileStore = {
  ...profile,
  aiGovernance: {
    timestamp: 10,
    payload: aiPayload,
    resultPath: `/ai/results/${aiPayload}`,
    archetypeKey: "coordinationArchitect",
    archetypeLabel: "Coordination Architect",
    riskLens: "Mixed risk lens",
    paceModifier: "Threshold guardrails",
    geopoliticsModifier: "Coordination-first",
    axisScores: aiScores,
    summary: "Coordination remains the central governance instinct.",
    governingInstinct: "Build rules that can travel across borders.",
    locale: "en",
    localeCopyVersion: 1,
  },
  perspectiveRuns: [
    {
      locale: "en",
      localeCopyVersion: 1,
      id: "run-exposed-ally-1",
      timestamp: 11,
      perspectiveId: "exposed-ally",
      perspectiveLabel: "Exposed ally or vulnerable small state",
      scenarioSetVersion: 1,
      dimensionScores: resolvedPerspective.result.dimensionScores,
      baselineDeltas: resolvedPerspective.result.baselineDeltas,
      strongestShiftKeys: resolvedPerspective.result.strongestShiftKeys,
      resultPath: `/perspectives/exposed-ally/result/${perspectivePayload}`,
      payload: perspectivePayload,
    },
  ],
}

test("shared profile payloads roundtrip and reconstruct separate saved records", () => {
  const payload = buildProfileSharePayload(profile)
  assert.ok(payload)

  const encoded = encodeProfileSharePayload(payload)
  const resolved = resolveProfileSharePayload(encoded)

  assert.ok(resolved)
  assert.equal(resolved.payload.v, 3)
  assert.equal(resolved.profile.foundation?.familyKey, profile.foundation?.familyKey)
  assert.equal(resolved.profile.modules.security?.laneSummaries[0]?.key, "deterrence")
  assert.equal(resolved.profile.modules.technology?.laneSummaries[0]?.key, "controls")
  assert.equal(resolved.profile.modules.technology?.cardTypeScores?.actorLens?.control, 5.7)
})

test("Profile Share V3 contains canonical data only and renders one payload in either locale", () => {
  const payload = buildProfileSharePayload(profileWithV2Overlays)
  assert.ok(payload)
  assert.equal(payload.v, 3)
  assert.equal(payload.ms.length, 2)
  assert.equal(payload.pr?.length, 1)

  const serialized = JSON.stringify(payload)
  assert.doesNotMatch(serialized, /Canonical foundation summary/)
  assert.doesNotMatch(serialized, /Security summary/)
  assert.doesNotMatch(serialized, /Coordination remains the central governance instinct/)

  const encoded = encodeProfileSharePayload(payload)
  const english = resolveProfileSharePayload(encoded, "en")
  const chinese = resolveProfileSharePayload(encoded, "zh-Hans")
  assert.ok(english)
  assert.ok(chinese)

  const englishView = buildLocalizedProfileShareView(english.profile, "en")
  const chineseView = buildLocalizedProfileShareView(chinese.profile, "zh-Hans")
  assert.ok(englishView)
  assert.ok(chineseView)
  const englishFoundation = englishView.foundation
  const chineseFoundation = chineseView.foundation
  assert.ok(englishFoundation)
  assert.ok(chineseFoundation)
  assert.equal(englishView.title, "Concert")
  assert.equal(chineseView.title, "Concert")
  assert.equal(englishFoundation.archetypeName, "Concert")
  assert.equal(chineseFoundation.archetypeName, "Concert")
  assert.equal(englishFoundation.archetypeCode, "R−")
  assert.equal(chineseFoundation.archetypeCode, "R−")
  assert.equal(englishFoundation.familyLabel, "Institutionalism")
  assert.equal(englishFoundation.runnerUpLabel, "Constructivism")
  assert.equal(chineseFoundation.familyLabel, "自由制度主义")
  assert.match(chineseView.intro, /原型专名/)
  assert.deepEqual(englishFoundation.dimensions, chineseFoundation.dimensions.map(
    (dimension, index) => ({
      ...dimension,
      label: englishFoundation.dimensions[index].label,
    }),
  ))
  assert.equal(english.profile.foundation?.dimensionScores.institutions, 5.8)
  assert.equal(chinese.profile.foundation?.dimensionScores.institutions, 5.8)
  assert.match(english.profile.foundation?.resultPath ?? "", /^\/results\//)
  assert.match(chinese.profile.foundation?.resultPath ?? "", /^\/zh\/results\//)

  const conflictingCachedView = buildLocalizedProfileShareView(
    {
      ...english.profile,
      foundation: {
        ...english.profile.foundation!,
        familyKey: "realist",
        runnerUpKey: "criticalPoliticalEconomy",
        strategyModifier: "Maximizer",
        normativeModifier: "Universalist",
        summary: "Conflicting cached Foundation copy",
        dimensionScores: {
          ...english.profile.foundation!.dimensionScores,
          institutions: 1,
        },
      },
    },
    "en",
  )
  assert.ok(conflictingCachedView)
  assert.ok(conflictingCachedView.foundation)
  assert.equal(
    conflictingCachedView.foundation.familyLabel,
    "Institutionalism",
  )
  assert.deepEqual(
    conflictingCachedView.foundation.modifiers,
    ["Restrainer", "Pluralist"],
  )
  assert.equal(
    conflictingCachedView.foundation.dimensions.find(
      ({ key }) => key === "institutions",
    )?.score,
    5.8,
  )
})

test("mixed locale-copy cohorts are visible but never described as research-equivalent", () => {
  const payload = buildProfileSharePayload({
    ...profileWithV2Overlays,
    aiGovernance: {
      ...profileWithV2Overlays.aiGovernance!,
      locale: "zh-Hans",
    },
  })
  assert.ok(payload)
  const resolved = resolveProfileSharePayload(encodeProfileSharePayload(payload), "en")
  assert.ok(resolved)
  const view = buildLocalizedProfileShareView(resolved.profile, "en")
  assert.ok(view)
  assert.match(view.provenanceNotice ?? "", /not presented as research-equivalent/)
})

test("Profile Share V2 roundtrips optional AI and Perspective Run data with dates", () => {
  const payload = buildProfileSharePayloadV2(profileWithV2Overlays)
  assert.ok(payload)
  assert.equal(payload.v, 2)
  assert.equal(payload.pv, FIELD_PROJECTION_VERSION)
  assert.equal(payload.ai?.t, 10)
  assert.equal(payload.pr?.[0]?.t, 11)

  const decoded = decodeProfileSharePayload(encodeProfileSharePayload(payload))
  assert.deepEqual(decoded, payload)

  const resolved = resolveProfileSharePayload(encodeProfileSharePayload(payload))
  assert.ok(resolved)
  assert.equal(resolved.profile.v, 5)
  assert.equal(resolved.profile.aiGovernance?.payload, aiPayload)
  assert.equal(resolved.profile.aiGovernance?.timestamp, 10)
  assert.equal(resolved.profile.perspectiveRuns[0]?.id, "run-exposed-ally-1")
  assert.equal(resolved.profile.perspectiveRuns[0]?.timestamp, 11)
  assert.equal(resolved.profile.perspectiveRuns[0]?.perspectiveLabel, "Exposed ally or vulnerable small state")
})

test("the compatible writer preserves a legacy module, AI Governance, and a Perspective Run through shared rendering", () => {
  const legacySecurity = structuredClone(profileWithV2Overlays.modules.security)
  assert.ok(legacySecurity)
  delete legacySecurity.payload
  const legacyProfile: ProfileStore = {
    ...profileWithV2Overlays,
    modules: { security: legacySecurity },
  }

  const payload = buildCompatibleProfileSharePayload(legacyProfile)
  assert.ok(payload)
  assert.equal(payload.v, 2)
  assert.equal(payload.ms.length, 1)
  assert.equal(payload.ms[0]?.s, "security")
  assert.equal(payload.ai?.p, aiPayload)
  assert.equal(payload.pr?.[0]?.i, "run-exposed-ally-1")

  const encoded = encodeProfileSharePayload(payload)
  const decoded = decodeProfileSharePayload(encoded)
  assert.ok(decoded)
  assert.equal(decoded.v, 2)
  assert.equal(decoded.ms[0]?.s, "security")
  assert.equal(decoded.ai?.p, aiPayload)
  assert.equal(decoded.pr?.[0]?.i, "run-exposed-ally-1")

  const resolved = resolveProfileSharePayload(encoded, "en")
  assert.ok(resolved)
  assert.equal(resolved.profile.modules.security?.headline, legacySecurity.headline)
  assert.equal(resolved.profile.aiGovernance?.payload, aiPayload)
  assert.equal(resolved.profile.perspectiveRuns[0]?.id, "run-exposed-ally-1")

  const rendered = buildLocalizedProfileShareView(resolved.profile, "en")
  assert.ok(rendered)
  assert.equal(rendered.modules.length, 1)
  assert.equal(rendered.modules[0]?.slug, "security")
  assert.equal(rendered.ai?.label, "Coordination Architect")
  assert.deepEqual(rendered.perspectives, [
    {
      id: "run-exposed-ally-1",
      label: "Exposed ally or vulnerable small state",
    },
  ])
})

test("an unresolvable legacy Foundation remains a shareable Profile record", () => {
  const legacyProfile = parseProfileStore(
    readFileSync(
      new URL("./fixtures/profile-store-v1.json", import.meta.url),
      "utf8",
    ),
    "zh-Hans",
  )

  const payload = buildCompatibleProfileSharePayload(legacyProfile)
  assert.ok(payload)
  assert.equal(payload.v, 2)

  const encoded = encodeProfileSharePayload(payload)
  const decoded = decodeProfileSharePayload(encoded)
  assert.ok(decoded)
  assert.equal(decoded.v, 2)

  const resolved = resolveProfileSharePayload(encoded, "zh-Hans")
  assert.ok(resolved)
  assert.equal(resolved.foundationStatus, "unavailable")
  assert.equal(resolved.profile.foundation, null)
  assert.equal(resolved.profile.modules.security?.headline, "Legacy security result")

  const rendered = buildLocalizedProfileShareView(
    resolved.profile,
    "zh-Hans",
    { preserveUnavailableFoundation: true },
  )
  assert.ok(rendered)
  assert.equal(rendered.foundation, null)
  assert.equal(rendered.modules[0]?.slug, "security")
})

test("an unresolvable Foundation without modules still uses the compatibility envelope", () => {
  const legacyProfile = parseProfileStore(
    readFileSync(
      new URL("./fixtures/profile-store-v1.json", import.meta.url),
      "utf8",
    ),
    "en",
  )
  legacyProfile.modules = {}
  legacyProfile.moduleHistory = []

  const payload = buildCompatibleProfileSharePayload(legacyProfile)
  assert.ok(payload)
  assert.equal(payload.v, 2)

  const resolved = resolveProfileSharePayload(
    encodeProfileSharePayload(payload),
    "en",
  )
  assert.ok(resolved)
  assert.equal(resolved.foundationStatus, "unavailable")
  assert.equal(resolved.profile.foundation, null)
})

test("Profile Share V2 keeps the latest fifty valid Perspective Runs", () => {
  const seed = profileWithV2Overlays.perspectiveRuns[0]
  assert.ok(seed)
  const manyRuns = Array.from({ length: 60 }, (_, index) => ({
    ...seed,
    id: `run-exposed-ally-${index + 1}`,
    timestamp: index + 11,
  }))

  const payload = buildProfileSharePayloadV2({
    ...profileWithV2Overlays,
    perspectiveRuns: manyRuns,
  })
  assert.ok(payload)
  assert.equal(payload.pr?.length, 50)
  assert.equal(payload.pr?.[0]?.t, 21)
  assert.equal(payload.pr?.at(-1)?.t, 70)
  assert.ok(resolveProfileSharePayload(encodeProfileSharePayload(payload)))
})

test("Profile Share V1 still decodes and reconstructs a migrated v5 read-only profile", () => {
  const legacy = buildProfileSharePayloadV1(profile)
  assert.ok(legacy)
  const encoded = encodeProfileSharePayload(legacy)

  assert.deepEqual(decodeProfileSharePayload(encoded), legacy)
  const resolved = resolveProfileSharePayload(encoded)
  assert.ok(resolved)
  assert.equal(resolved.payload.v, 1)
  assert.equal(resolved.profile.v, 5)
  assert.equal(resolved.profile.foundationHistory.length, 1)
  assert.equal(resolved.profile.aiGovernance, null)
  assert.deepEqual(resolved.profile.perspectiveRuns, [])
})

test("a frozen pre-V16 Profile Share V1 link remains readable", () => {
  const decoded = decodeProfileSharePayload(PRE_V16_PROFILE_SHARE_V1)
  assert.ok(decoded)
  assert.equal(decoded.v, 1)
  const resolved = resolveProfileSharePayload(PRE_V16_PROFILE_SHARE_V1)
  assert.ok(resolved)
  assert.equal(resolved.payload.v, 1)
  assert.equal(resolved.profile.foundation?.familyKey, "realist")
})

test("frozen Profile Share V1, V2, and V3 payload objects remain readable", () => {
  for (const version of [1, 2, 3] as const) {
    const fixture = JSON.parse(
      readFileSync(
        new URL(`./fixtures/profile-share-v${version}.json`, import.meta.url),
        "utf8",
      ),
    )
    const encoded = encodeRawPayload(fixture)
    const decoded = decodeProfileSharePayload(encoded)
    assert.ok(decoded)
    assert.equal(decoded.v, version)
    assert.ok(resolveProfileSharePayload(encoded))
  }
})

test("invalid local optional overlays do not block sharing a valid Foundation", () => {
  const profileWithInvalidOptionalData: ProfileStore = {
    ...profileWithV2Overlays,
    aiGovernance: {
      ...profileWithV2Overlays.aiGovernance!,
      payload: "invalid-ai-token",
    },
    perspectiveRuns: profileWithV2Overlays.perspectiveRuns.map((run) => ({
      ...run,
      resultPath: "/invalid-perspective-result",
      payload: "invalid-perspective-token",
    })),
  }

  const payload = buildProfileSharePayload(profileWithInvalidOptionalData)
  assert.ok(payload)
  assert.equal(payload.ai, undefined)
  assert.equal(payload.pr, undefined)
  assert.ok(resolveProfileSharePayload(encodeProfileSharePayload(payload)))
})

test("shared profile inputs can be normalized from raw payloads, paths, and full URLs", () => {
  const payload = encodeProfileSharePayload(buildProfileSharePayload(profile)!)

  assert.equal(normalizeProfileShareInput(payload), payload)
  assert.equal(normalizeProfileShareInput(`/profile/share/${payload}`), payload)
  assert.equal(
    normalizeProfileShareInput(`https://example.test/profile/share/${payload}`),
    payload,
  )
})

test("malformed shared profile payloads fail safely", () => {
  const malformedPayloads = [
    "%%%bad%%%payload",
    encodeRawPayload({
      v: 1,
      f: foundationPayload,
      ms: [
        {
          s: "security",
          m: "standard",
          h: "headline",
          u: "summary",
          ls: [{ k: "deterrence", sc: "five", su: "bad" }],
          od: {},
        },
      ],
      ps: "stableModeration",
    }),
  ]

  for (const payload of malformedPayloads) {
    assert.equal(resolveProfileSharePayload(payload), null)
  }
})

test("malformed Profile Share V2 optional fields and projection metadata fail safely", () => {
  const valid = buildProfileSharePayloadV2(profileWithV2Overlays)
  assert.ok(valid)

  const malformed = [
    { ...valid, pv: FIELD_PROJECTION_VERSION + 1 },
    { ...valid, ft: 1e308 },
    { ...valid, ft: 1.5 },
    { ...valid, unexpected: true },
    { ...valid, ai: { ...valid.ai, p: "bad-ai-payload" } },
    { ...valid, pr: null },
    {
      ...valid,
      pr: valid.pr?.map((run) => ({ ...run, ds: [8, ...run.ds.slice(1)] })),
    },
    {
      ...valid,
      pr: valid.pr?.map((run) => ({ ...run, r: "https://example.test/result" })),
    },
    {
      ...valid,
      pr: valid.pr ? [valid.pr[0], valid.pr[0]] : [],
    },
    {
      ...valid,
      ms: valid.ms.length > 0 ? [valid.ms[0], valid.ms[0]] : [],
    },
  ]

  for (const candidate of malformed) {
    const encoded = encodeRawPayload(candidate)
    assert.equal(decodeProfileSharePayload(encoded), null)
    assert.equal(resolveProfileSharePayload(encoded), null)
  }
})

test("malformed Profile Share V3 provenance and canonical records fail safely", () => {
  const valid = buildProfileSharePayload(profileWithV2Overlays)
  assert.ok(valid)
  assert.equal(valid.v, 3)
  const malformed = [
    { ...valid, pv: FIELD_PROJECTION_VERSION + 1 },
    { ...valid, f: { ...valid.f, l: "fr" } },
    { ...valid, f: { ...valid.f, cv: -1 } },
    { ...valid, prose: "must not be embedded" },
    { ...valid, ms: valid.ms.length > 0 ? [valid.ms[0], valid.ms[0]] : [] },
    {
      ...valid,
      pr: valid.pr?.map((run) => ({ ...run, p: "invalid-perspective-token" })),
    },
  ]

  for (const candidate of malformed) {
    const encoded = encodeRawPayload(candidate)
    assert.equal(decodeProfileSharePayload(encoded), null)
    assert.equal(resolveProfileSharePayload(encoded), null)
  }
})

function encodeRawPayload(payload: unknown) {
  return encodeUrlPayload(payload)
}
