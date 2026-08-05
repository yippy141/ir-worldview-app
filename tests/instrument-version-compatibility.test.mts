import test from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import securityV21Bank from "@/content/instrument/security.v2.json" with {
  type: "json",
}
import technologyV21Bank from "@/content/instrument/technology.v2.json" with {
  type: "json",
}
import aiGovernanceV21Bank from "@/content/instrument/ai-governance.v2.json" with {
  type: "json",
}
import goldenFixture from "@/tests/fixtures/instrument-version-golden.json" with {
  type: "json",
}
import {
  resolveModulePayload,
} from "@/lib/modules/framework"
import {
  MODULE_V21_TUPLE,
  MODULE_V22_TUPLE,
  SUPPORTED_MODULE_VERSIONS,
} from "@/lib/modules/versions"
import {
  buildAiGovernanceDeepDive,
  buildAiGovernanceResultFromSharePayload,
  getRunnerUpKey,
} from "@/lib/ai-governance-results-v2"
import {
  resolveAiPayload,
} from "@/lib/ai-governance-share"
import {
  AI_GOVERNANCE_V21_TUPLE,
  AI_GOVERNANCE_V22_TUPLE,
  SUPPORTED_AI_GOVERNANCE_VERSIONS,
} from "@/lib/ai-governance-versions"
import { encodeUrlPayload } from "@/lib/url-payload"
import type {
  AiAnswers,
  AiQuizMode,
} from "@/lib/ai-governance-types"

const LEGACY_SECURITY_V2_TOKEN =
  "eyJ2IjoyLCJzbHVnIjoic2VjdXJpdHkiLCJtb2RlIjoic3RhbmRhcmQiLCJhbnN3ZXJzIjp7InRhaXdhbl9xdWFyYW50aW5lIjp7InByaW1hcnkiOiJjbGFyaWZ5X3Jlc3BvbnNlIn0sImdyYXlfem9uZV9zYWJvdGFnZSI6eyJwcmltYXJ5IjoiY29hbGl0aW9uX3Byb2JlIn19fQ"

const LEGACY_TECHNOLOGY_V2_TOKEN =
  "eyJ2IjoyLCJzbHVnIjoidGVjaG5vbG9neSIsIm1vZGUiOiJzdGFuZGFyZCIsImFuc3dlcnMiOnsiY2hpcHNfY29udHJvbHMiOnsicHJpbWFyeSI6InByZXNlcnZlX3RoZV9jaG9rZXBvaW50In0sIm9wZW5fd2VpZ2h0X21vZGVscyI6eyJwcmltYXJ5Ijoic3RhZ2VkX3JlbGVhc2VfcnVsZXMifX19"

const LEGACY_AI_V1_TOKEN =
  "eyJ2IjoxLCJhcyI6WzQuMiw1LjEsNiwzLjgsNC42LDIuOSw1LjQsNF0sImFrIjoiY29vcmRpbmF0aW9uQXJjaGl0ZWN0IiwibmsiOiJzdGF0ZUNhcGFjaXR5QnVpbGRlciIsInJsIjoiRnJvbnRpZXItcmlzayBmaXJzdCIsInBtIjoiVGhyZXNob2xkIGd1YXJkcmFpbHMiLCJnbSI6IkNvb3JkaW5hdGlvbi1maXJzdCJ9"

test("V21 module and AI banks are immutable snapshots", () => {
  const snapshots = [
    [
      securityV21Bank,
      "f5c6d608c695f84d08392430b92a7bff9c31552f35e4b1c73cd10191dd276556",
    ],
    [
      technologyV21Bank,
      "a7637c00545bcda08af296ebfd64aaec303566406d5c4b6134085fd8943c971e",
    ],
    [
      aiGovernanceV21Bank,
      "68432752b6a2c81905ce93cc7ec373d8ccfceccc8e9886cd5e83c6425b1e97a3",
    ],
  ] as const

  for (const [snapshot, expected] of snapshots) {
    const digest = createHash("sha256")
      .update(JSON.stringify(snapshot))
      .digest("hex")
    assert.equal(digest, expected)
  }
})

test("supported registries expose only the approved V21 and V22 tuples", () => {
  for (const slug of ["security", "technology"] as const) {
    assert.deepEqual(
      SUPPORTED_MODULE_VERSIONS[slug].map((version) => ({
        bankVersion: version.bankVersion,
        scoringVersion: version.scoringVersion,
        runtimeVersion: version.runtime.MODULE_SCORING_VERSION,
      })),
      [
        { ...MODULE_V21_TUPLE, runtimeVersion: 1 },
        { ...MODULE_V22_TUPLE, runtimeVersion: 2 },
      ],
    )
  }

  assert.deepEqual(
    SUPPORTED_AI_GOVERNANCE_VERSIONS.map((version) => ({
      bankVersion: version.bankVersion,
      scoringVersion: version.scoringVersion,
      runtimeVersion: version.scoring.AI_GOVERNANCE_SCORING_VERSION,
    })),
    [
      { ...AI_GOVERNANCE_V21_TUPLE, runtimeVersion: 1 },
      { ...AI_GOVERNANCE_V22_TUPLE, runtimeVersion: 2 },
    ],
  )
})

test("checked-in V21 and V22 module and AI answers replay to golden results", () => {
  for (const cohort of [goldenFixture.v21, goldenFixture.v22]) {
    for (const moduleFixture of cohort.modules) {
      const resolved = resolveModulePayload(
        encodeUrlPayload(moduleFixture.payload),
      )
      assert.ok(resolved)
      assert.deepEqual(
        {
          bankVersion: resolved.bankVersion,
          scoringVersion: resolved.scoringVersion,
        },
        cohort.tuple,
      )
      const result = resolved.runtime.buildModuleResult(
        resolved.definition,
        resolved.payload.mode,
        resolved.payload.answers,
      )
      assert.deepEqual(
        {
          headline: result.headline,
          scores: result.scores,
          overlayDeltas: result.overlayDeltas,
        },
        moduleFixture.expected,
      )
    }

    const version = SUPPORTED_AI_GOVERNANCE_VERSIONS.find(
      (candidate) =>
        candidate.bankVersion === cohort.tuple.bankVersion &&
        candidate.scoringVersion === cohort.tuple.scoringVersion,
    )
    assert.ok(version)
    const result = version.scoring.generateAiGovernanceResult(
      cohort.ai.answers as AiAnswers,
      cohort.ai.mode as AiQuizMode,
    )
    assert.deepEqual(
      {
        archetypeKey: result.archetypeKey,
        neighboringArchetypeKey: result.neighboringArchetypeKey,
        riskLens: result.riskLens,
        paceModifier: result.paceModifier,
        geopoliticsModifier: result.geopoliticsModifier,
        axisScores: result.axisScores,
        archetypeScores: result.archetypeScores,
      },
      cohort.ai.expected,
    )
  }
})

test("literal V21 module links replay through the frozen definitions and scorer", () => {
  const security = resolveModulePayload(LEGACY_SECURITY_V2_TOKEN)
  assert.ok(security)
  assert.deepEqual(
    {
      bankVersion: security.bankVersion,
      scoringVersion: security.scoringVersion,
      runtimeVersion: security.runtime.MODULE_SCORING_VERSION,
      definition: security.definition.slug,
    },
    {
      ...MODULE_V21_TUPLE,
      runtimeVersion: 1,
      definition: "security",
    },
  )
  const securityResult = security.runtime.buildModuleResult(
    security.definition,
    security.payload.mode,
    security.payload.answers,
  )
  assert.deepEqual(
    {
      headline: securityResult.headline,
      scores: securityResult.scores,
      overlayDeltas: securityResult.overlayDeltas,
    },
    {
      headline: "Security read: pressure and visible deterrence",
      scores: {
        activism: 5.45,
        escalation: 5.4,
        alliance: 5.55,
        legitimacy: 4.5,
      },
      overlayDeltas: {
        securityCompetition: 0.79,
        institutions: 0.52,
        normsIdentity: 0.11,
        restraint: -0.8,
        orderJustice: -0.28,
      },
    },
  )

  const technology = resolveModulePayload(LEGACY_TECHNOLOGY_V2_TOKEN)
  assert.ok(technology)
  const technologyResult = technology.runtime.buildModuleResult(
    technology.definition,
    technology.payload.mode,
    technology.payload.answers,
  )
  assert.deepEqual(
    {
      tuple: {
        bankVersion: technology.bankVersion,
        scoringVersion: technology.scoringVersion,
      },
      runtimeVersion: technology.runtime.MODULE_SCORING_VERSION,
      headline: technologyResult.headline,
      scores: technologyResult.scores,
    },
    {
      tuple: MODULE_V21_TUPLE,
      runtimeVersion: 1,
      headline: "Technology read: no single tool dominates",
      scores: {
        control: 5.6,
        governance: 4.75,
        industrial: 4.7,
        safety: 5.15,
      },
    },
  )
})

test("legacy module V1 string answers dispatch to the frozen V21 tuple", () => {
  const resolved = resolveModulePayload(
    encodeUrlPayload({
      v: 1,
      slug: "security",
      answers: {
        taiwan_quarantine: "clarify_response",
        gray_zone_sabotage: "coalition_probe",
      },
    }),
  )
  assert.ok(resolved)
  assert.equal(resolved.sourcePayloadVersion, 1)
  assert.deepEqual(
    {
      bankVersion: resolved.bankVersion,
      scoringVersion: resolved.scoringVersion,
      runtimeVersion: resolved.runtime.MODULE_SCORING_VERSION,
    },
    {
      ...MODULE_V21_TUPLE,
      runtimeVersion: 1,
    },
  )
  assert.deepEqual(
    resolved.runtime.buildModuleResult(
      resolved.definition,
      resolved.payload.mode,
      resolved.payload.answers,
    ).scores,
    goldenFixture.v21.modules[0].expected.scores,
  )
})

test("module payload tuple dispatch rejects every unsupported pairing", () => {
  const current = encodeUrlPayload({
    v: 3,
    bv: MODULE_V22_TUPLE.bankVersion,
    sv: MODULE_V22_TUPLE.scoringVersion,
    slug: "security",
    mode: "standard",
    answers: {
      taiwan_quarantine: { primary: "clarify_response" },
    },
  })
  const resolved = resolveModulePayload(current)
  assert.ok(resolved)
  assert.equal(resolved.runtime.MODULE_SCORING_VERSION, 2)

  for (const [bv, sv] of [[2, 2], [3, 1], [4, 2]]) {
    assert.equal(
      resolveModulePayload(
        encodeUrlPayload({
          v: 3,
          bv,
          sv,
          slug: "security",
          mode: "standard",
          answers: {
            taiwan_quarantine: { primary: "clarify_response" },
          },
        }),
      ),
      null,
    )
  }
})

test("literal AI V1 links dispatch to V21 and preserve encoded identities", () => {
  const resolved = resolveAiPayload(LEGACY_AI_V1_TOKEN)
  assert.ok(resolved)
  assert.deepEqual(
    {
      bankVersion: resolved.bankVersion,
      scoringVersion: resolved.scoringVersion,
      runtimeVersion: resolved.scoring.AI_GOVERNANCE_SCORING_VERSION,
    },
    {
      ...AI_GOVERNANCE_V21_TUPLE,
      runtimeVersion: 1,
    },
  )

  const result = buildAiGovernanceResultFromSharePayload(
    resolved.payload,
    resolved,
  )
  assert.equal(result.archetypeKey, "coordinationArchitect")
  assert.equal(result.neighboringArchetypeKey, "stateCapacityBuilder")
  assert.equal(getRunnerUpKey(result), "stateCapacityBuilder")
  assert.equal(
    buildAiGovernanceDeepDive(
      result,
      resolved.scoring.archetypeProfiles,
    ).comparison.runnerUpKey,
    "stateCapacityBuilder",
  )
})

test("the frozen V21 AI answer replay stays pinned to its golden result", () => {
  const version = SUPPORTED_AI_GOVERNANCE_VERSIONS[0]
  const result = version.scoring.generateAiGovernanceResult(
    {
      rh1: 7,
      rh2: 2,
      dp1: 6,
      dp2: 3,
      ov1: 7,
      ov2: 2,
      gp1: 6,
      gp2: 2,
      op1: 5,
      op2: 3,
      mr1: 6,
      mr2: 2,
      lg1: 7,
      lg2: 2,
      hf1: 6,
      hf2: 3,
      capabilityThreshold: "A",
      rivalBreakthrough: "B",
      openWeights: "C",
      militaryIntegration: "A",
      multilateralVerification: "B",
      futureSociety: "C",
    },
    "standard",
  )

  assert.deepEqual(
    {
      archetypeKey: result.archetypeKey,
      neighboringArchetypeKey: result.neighboringArchetypeKey,
      riskLens: result.riskLens,
      paceModifier: result.paceModifier,
      geopoliticsModifier: result.geopoliticsModifier,
      axisScores: result.axisScores,
      archetypeScores: result.archetypeScores,
    },
    {
      archetypeKey: "democraticGuardrailist",
      neighboringArchetypeKey: "precautionarySteward",
      riskLens: "Frontier-risk first",
      paceModifier: "Precaution-first",
      geopoliticsModifier: "Competition-first",
      axisScores: {
        riskHorizon: 7,
        deploymentPace: 6,
        oversight: 7,
        geopolitics: 6.5,
        openness: 1.9,
        militaryRole: 5.6,
        legitimacy: 7,
        humanFuture: 4.8,
      },
      archetypeScores: {
        precautionarySteward: 5.46,
        strategicCompetitor: 4.49,
        coordinationArchitect: 2.87,
        democraticGuardrailist: 6.4,
        stateCapacityBuilder: 2.56,
        openEcosystemBuilder: -5.18,
      },
    },
  )
})

test("AI V2 accepts only the active V22 tuple", () => {
  const fields = {
    as: [4.2, 5.1, 6, 3.8, 4.6, 2.9, 5.4, 4],
    ak: "coordinationArchitect",
    nk: "stateCapacityBuilder",
    rl: "Frontier-risk first",
    pm: "Threshold guardrails",
    gm: "Coordination-first",
  }
  const current = resolveAiPayload(
    encodeUrlPayload({
      v: 2,
      bv: AI_GOVERNANCE_V22_TUPLE.bankVersion,
      sv: AI_GOVERNANCE_V22_TUPLE.scoringVersion,
      ...fields,
    }),
  )
  assert.ok(current)
  assert.equal(current.scoring.AI_GOVERNANCE_SCORING_VERSION, 2)

  for (const [bv, sv] of [[2, 2], [3, 1], [4, 2]]) {
    assert.equal(
      resolveAiPayload(encodeUrlPayload({ v: 2, bv, sv, ...fields })),
      null,
    )
  }
})
