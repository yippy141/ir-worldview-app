import test from "node:test"
import assert from "node:assert/strict"
import {
  buildProfileSharePayload,
  encodeProfileSharePayload,
  normalizeProfileShareInput,
  resolveProfileSharePayload,
} from "@/lib/profile-share"
import { buildProfileAssessment } from "@/lib/profile-helpers"
import { dimensionScoresToArray, encodePayload, resolveFoundationPayload } from "@/lib/share"
import type { ProfileStore } from "@/lib/profile-store"

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

const profile: ProfileStore = {
  v: 2,
  foundation: {
    timestamp: 1,
    payload: foundationPayload,
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
  },
  modules: {
    security: {
      timestamp: 2,
      slug: "security",
      title: "Security",
      shorthand: "Security Pressure",
      mode: "standard",
      headline: "Security read: coalition-centered pressure management",
      summary: "Security summary",
      resultPath: "/modules/security/results/abc",
      scores: {},
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
      title: "Technology",
      shorthand: "Tech Power",
      mode: "standard",
      headline: "Technology read: control with capacity-building",
      summary: "Technology summary",
      resultPath: "/modules/technology/results/def",
      scores: {},
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
}

test("shared profile payloads roundtrip and reconstruct a stable integrated profile", () => {
  const payload = buildProfileSharePayload(profile)
  assert.ok(payload)

  const encoded = encodeProfileSharePayload(payload)
  const resolved = resolveProfileSharePayload(encoded)

  assert.ok(resolved)
  assert.equal(resolved.profile.foundation?.familyKey, profile.foundation?.familyKey)
  assert.equal(
    resolved.assessment.state,
    buildProfileAssessment(profile).state,
  )
  assert.equal(resolved.profile.modules.security?.laneSummaries[0]?.key, "deterrence")
  assert.equal(resolved.profile.modules.technology?.laneSummaries[0]?.key, "controls")
  assert.equal(resolved.profile.modules.technology?.cardTypeScores?.actorLens?.control, 5.7)
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
      f: "bad-foundation",
      ms: [],
      ps: "stableModeration",
    }),
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

function encodeRawPayload(payload: unknown) {
  return btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}
