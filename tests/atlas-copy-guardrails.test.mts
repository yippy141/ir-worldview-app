import test from "node:test"
import assert from "node:assert/strict"
import { getAtlasLitePatterns } from "@/lib/atlas-lite"
import { securityModule } from "@/lib/modules/security"
import { technologyModule } from "@/lib/modules/technology"
import type { ModuleAnalytics } from "@/lib/modules/types"
import { buildFoundationNarrative } from "@/lib/narrative/foundation"
import { perspectiveCatalog } from "@/lib/perspectives/catalog"
import { buildPerspectiveResultCopy } from "@/lib/perspectives/result-helpers"
import { scorePerspectiveRun } from "@/lib/perspectives/scoring"
import { buildProfileAssessment } from "@/lib/profile-helpers"
import type { ProfileStore } from "@/lib/profile-store"

const FLAGGED_PATTERNS = [
  { label: '"you think"', pattern: /\byou think\b/i },
  { label: '"you place real emphasis"', pattern: /\byou place real emphasis\b/i },
  { label: '"nearest-fit shorthand"', pattern: /nearest-fit shorthand/i },
  { label: '"broad-spectrum"', pattern: /\bbroad-spectrum\b/i },
  { label: '"matters"', pattern: /\bmatters\b/i },
  {
    label: '"X, not Y"',
    pattern: /\b[^.!?\n,]{1,90},\s+not\s+[^.!?\n]{1,90}/i,
  },
  {
    label: '"This is not X. It is Y."',
    pattern: /\b(?:this|it|that) is not\b[^.!?]{1,90}[.!?]\s+(?:this|it|that) is\b/i,
  },
  { label: '"not just"', pattern: /\bnot just\b/i },
  {
    label: '"less about … more about"',
    pattern: /\bless about\b[^.!?]{0,90}\bmore about\b/i,
  },
  { label: '"rather than"', pattern: /\brather than\b/i },
  {
    label: '"doesn’t merely"',
    pattern: /\bdoes(?:n['’]t| not)\s+(?:just|merely)\b/i,
  },
  { label: '"the point is not"', pattern: /\bthe point is not\b/i },
  { label: '"more than a/an"', pattern: /\bmore than (?:a|an)\b/i },
  { label: '"not a verdict"', pattern: /\bnot a verdict\b/i },
]

// Exact public strings only. These two privacy statements need a direct data
// boundary; allowing the matching rule for any other sentence would hide copy
// regressions elsewhere.
const COPY_ALLOWLIST = new Map<string, ReadonlySet<string>>([
  [
    "Stored raw answer records, if activated in beta, are pseudonymous or de-identified rather than strictly anonymous.",
    new Set(['"rather than"']),
  ],
  [
    "It is meant for question improvement, model testing, and aggregate insight posts, not advertising or targeting.",
    new Set(['"X, not Y"']),
  ],
])

test("contrastive-antithesis guardrails catch every target template", () => {
  const cases = [
    ['"X, not Y"', "The result is a map, not a verdict."],
    ['"This is not X. It is Y."', "This is not a label. It is a field position."],
    ['"not just"', "This is not just a quiz."],
    ['"less about … more about"', "It is less about identity and more about choices."],
    ['"rather than"', "Use evidence rather than instinct."],
    ['"doesn’t merely"', "The result doesn’t merely summarize."],
    ['"the point is not"', "The point is not classification."],
    ['"more than a/an"', "This is more than an inventory."],
    ['"not a verdict"', "This result is not a verdict."],
  ] as const

  for (const [expected, copy] of cases) {
    assert.ok(
      findFlaggedPatterns(copy).includes(expected),
      `expected ${expected} to be detected in: ${copy}`,
    )
  }
})

test("the copy allowlist is exact and limited to necessary privacy language", () => {
  for (const copy of COPY_ALLOWLIST.keys()) {
    assertCleanCopy("allowlisted privacy copy", copy)
  }

  assert.ok(
    findFlaggedPatterns("This profile is descriptive rather than predictive.").includes(
      '"rather than"',
    ),
  )
})

test("atlas and visible summary surfaces avoid flagged copy patterns", () => {
  for (const pattern of getAtlasLitePatterns()) {
    assertCleanCopy(`atlas card summary for ${pattern.id}`, pattern.cardSummary)
    assertCleanCopy(`atlas detail summary for ${pattern.id}`, pattern.detailSummary)
    assertCleanCopy(`atlas so-what for ${pattern.id}`, pattern.soWhat)
    assertCleanCopy(`atlas pressure note for ${pattern.id}`, pattern.cardPressureNote)
    for (const [index, item] of pattern.underestimates.entries()) {
      assertCleanCopy(`atlas underestimates ${pattern.id} ${index}`, item)
    }
  }

  const foundationCases = [
    {
      familyKey: "realist",
      runnerUpKey: "institutionalist",
      strategyModifier: "Hedger",
      normativeModifier: "Conditional Solidarist",
      dimensionScores: {
        securityCompetition: 4.2,
        institutions: 4.1,
        domesticFilters: 4.0,
        normsIdentity: 4.0,
        politicalEconomy: 4.1,
        restraint: 4.0,
        orderJustice: 4.0,
      },
    },
    {
      familyKey: "institutionalist",
      runnerUpKey: "constructivist",
      strategyModifier: "Restrainer",
      normativeModifier: "Pluralist",
      dimensionScores: {
        securityCompetition: 4.3,
        institutions: 5.8,
        domesticFilters: 4.9,
        normsIdentity: 5.1,
        politicalEconomy: 4.7,
        restraint: 5.4,
        orderJustice: 5.3,
      },
    },
    {
      familyKey: "realist",
      runnerUpKey: "institutionalist",
      strategyModifier: "Maximizer",
      normativeModifier: "Pluralist",
      dimensionScores: {
        securityCompetition: 6.2,
        institutions: 2.5,
        domesticFilters: 3.0,
        normsIdentity: 2.8,
        politicalEconomy: 3.4,
        restraint: 3.0,
        orderJustice: 4.7,
      },
    },
  ] as const

  for (const input of foundationCases) {
    const narrative = buildFoundationNarrative(input)
    assertCleanCopy(`foundation summary for ${input.familyKey}`, narrative.summary)
  }

  for (const [label, profile] of [
    ["no-modules-overlap", buildProfileFixture()],
    ["true-tension", buildProfileFixture(true)],
  ] as const) {
    const assessment = buildProfileAssessment(profile)
    assertCleanCopy(`profile synthesis for ${label}`, assessment.synthesis)
    assertCleanCopy(`profile summary for ${label}`, assessment.summary)
  }

  const securitySummaries = [
    securityModule.interpret(
      makeAnalytics({
        activism: 5.6,
        escalation: 5.2,
        alliance: 4.9,
        legitimacy: 4.7,
      }),
    ).summary,
    securityModule.interpret(
      makeAnalytics({
        activism: 3.5,
        escalation: 3.8,
        alliance: 4.1,
        legitimacy: 4.0,
      }),
    ).summary,
    securityModule.interpret(
      makeAnalytics({
        activism: 4.7,
        escalation: 4.8,
        alliance: 5.5,
        legitimacy: 4.8,
      }),
    ).summary,
    securityModule.interpret(
      makeAnalytics({
        activism: 4.4,
        escalation: 4.5,
        alliance: 4.8,
        legitimacy: 5.4,
      }),
    ).summary,
    securityModule.interpret(
      makeAnalytics({
        activism: 4.4,
        escalation: 4.5,
        alliance: 4.4,
        legitimacy: 4.5,
      }),
    ).summary,
  ]

  for (const [index, summary] of securitySummaries.entries()) {
    assertCleanCopy(`security summary ${index}`, summary)
  }

  const technologySummaries = [
    technologyModule.interpret(
      makeAnalytics({
        control: 5.8,
        governance: 4.2,
        industrial: 5.4,
        safety: 4.7,
      }),
    ).summary,
    technologyModule.interpret(
      makeAnalytics({
        control: 4.7,
        governance: 5.7,
        industrial: 4.5,
        safety: 4.8,
      }),
    ).summary,
    technologyModule.interpret(
      makeAnalytics({
        control: 4.4,
        governance: 4.3,
        industrial: 4.2,
        safety: 5.9,
      }),
    ).summary,
    technologyModule.interpret(
      makeAnalytics({
        control: 3.6,
        governance: 4.6,
        industrial: 3.9,
        safety: 4.6,
      }),
    ).summary,
    technologyModule.interpret(
      makeAnalytics({
        control: 4.6,
        governance: 4.7,
        industrial: 4.7,
        safety: 4.8,
      }),
    ).summary,
  ]

  for (const [index, summary] of technologySummaries.entries()) {
    assertCleanCopy(`technology summary ${index}`, summary)
  }

  const perspectiveBaseline = foundationCases[1].dimensionScores
  for (const perspective of perspectiveCatalog) {
    assertCleanCopy(`perspective description ${perspective.id}`, perspective.description)
    const answers = Object.fromEntries(
      perspective.scenarios.map((scenario) => [scenario.id, scenario.options[0].id]),
    )
    const copy = buildPerspectiveResultCopy(
      scorePerspectiveRun(perspective, perspectiveBaseline, answers),
    )

    for (const [field, value] of Object.entries(copy)) {
      assertCleanCopy(`perspective result ${perspective.id} ${field}`, value)
    }

    for (const scenario of perspective.scenarios) {
      assertCleanCopy(`perspective actor ${scenario.id}`, scenario.actor)
      assertCleanCopy(`perspective objective ${scenario.id}`, scenario.objective)
      assertCleanCopy(`perspective constraint ${scenario.id}`, scenario.constraint)
      assertCleanCopy(`perspective uncertainty ${scenario.id}`, scenario.uncertainty)
      assertCleanCopy(`perspective task ${scenario.id}`, scenario.task)
      for (const option of scenario.options) {
        assertCleanCopy(`perspective option ${scenario.id} ${option.id}`, option.response)
      }
    }
  }
})

function assertCleanCopy(label: string, text: string) {
  const allowed = COPY_ALLOWLIST.get(text) ?? new Set<string>()
  for (const flagged of FLAGGED_PATTERNS) {
    assert.ok(
      !flagged.pattern.test(text) || allowed.has(flagged.label),
      `${label} should avoid ${flagged.label}. Received: ${text}`,
    )
  }
}

function findFlaggedPatterns(text: string) {
  return FLAGGED_PATTERNS
    .filter((flagged) => flagged.pattern.test(text))
    .map((flagged) => flagged.label)
}

function makeAnalytics(
  scores: Record<string, number>,
  cardTypeScores: ModuleAnalytics["cardTypeScores"] = {},
): ModuleAnalytics {
  return {
    scores,
    laneScores: {},
    cardTypeScores,
  }
}

function buildProfileFixture(includeModules = false): ProfileStore {
  const profile: ProfileStore = {
    v: 4,
    foundation: {
      timestamp: 1,
      payload: "payload",
      resultPath: "/results/payload",
      familyKey: includeModules ? "institutionalist" : "realist",
      familyLabel: includeModules ? "Liberal Institutionalist" : "Strategic Realist",
      runnerUpKey: includeModules ? "constructivist" : "institutionalist",
      runnerUpLabel: includeModules ? "Social Constructivist" : "Liberal Institutionalist",
      summary: "summary",
      dimensionScores: includeModules
        ? {
            securityCompetition: 4.3,
            institutions: 5.8,
            domesticFilters: 4.9,
            normsIdentity: 5.1,
            politicalEconomy: 4.7,
            restraint: 5.4,
            orderJustice: 5.3,
          }
        : {
            securityCompetition: 4.2,
            institutions: 4.1,
            domesticFilters: 4.0,
            normsIdentity: 3.9,
            politicalEconomy: 4.1,
            restraint: 4.0,
            orderJustice: 3.8,
          },
      strategyModifier: includeModules ? "Restrainer" : "Hedger",
      normativeModifier: includeModules ? "Pluralist" : "Conditional Solidarist",
      keyDrivers: [],
      strongLenses: [],
    },
    foundationHistory: [],
    modules: {},
    moduleHistory: [],
    aiGovernance: null,
    aiHistory: [],
    perspectiveRuns: [],
  }

  if (!includeModules) {
    return profile
  }

  profile.modules.security = {
    timestamp: 2,
    slug: "security",
    title: "Security",
    shorthand: "Security Pressure",
    mode: "standard",
    headline: "Security read: coalition-centered pressure management",
    summary: "Security summary",
    resultPath: "/modules/security/results/abc",
    scores: {
      activism: 5.5,
      escalation: 5.3,
      alliance: 5.8,
      legitimacy: 5.2,
    },
    instincts: [],
    challenge: "Challenge text",
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
  }

  profile.modules.technology = {
    timestamp: 3,
    slug: "technology",
    title: "Technology",
    shorthand: "Tech Power",
    mode: "standard",
    headline: "Technology read: control with capacity-building",
    summary: "Technology summary",
    resultPath: "/modules/technology/results/def",
    scores: {
      control: 5.8,
      governance: 4.0,
      industrial: 5.4,
      safety: 4.8,
    },
    instincts: [],
    challenge: "Challenge text",
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
    cardTypeScores: {
      explanation: {
        control: 6.0,
        governance: 4.1,
        safety: 4.4,
      },
      decision: {
        control: 5.1,
        governance: 5.0,
        safety: 5.3,
      },
    },
  }

  return profile
}
