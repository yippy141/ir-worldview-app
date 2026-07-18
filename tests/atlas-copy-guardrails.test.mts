import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { getAtlasLitePatterns } from "@/lib/atlas-lite"
import { getPublishedCurrentCases } from "@/lib/current-cases/catalog"
import type { CurrentCase } from "@/lib/current-cases/types"
import { securityModule } from "@/lib/modules/security"
import { technologyModule } from "@/lib/modules/technology"
import type { ModuleAnalytics } from "@/lib/modules/types"
import { buildFoundationNarrative } from "@/lib/narrative/foundation"
import { perspectiveCatalog } from "@/lib/perspectives/catalog"
import { buildPerspectiveResultCopy } from "@/lib/perspectives/result-helpers"
import { scorePerspectiveRun } from "@/lib/perspectives/scoring"
import {
  buildProfileAssessment,
  buildProfileSynthesisLite,
  buildProfileTriad,
} from "@/lib/profile-helpers"
import type { ProfileStore } from "@/lib/profile-store"
import {
  buildSummary,
  getBlindSpots,
  getPressureTestQuestions,
  getQuickTake,
  getWhyItMatters,
} from "@/lib/result-helpers"
import {
  worldStageMenuItems,
  worldStageSceneOptions,
  worldStageScenes,
} from "@/lib/world-stage/scenes"
import type { FamilyKey } from "@/lib/types"

const HARD_PATTERNS = [
  { label: '"16 questions"', pattern: /\b16 questions\b/i },
  {
    label: "public release language",
    pattern: /\bV\d+(?:\.\d+)*\b|\bBeta\b|\bversion history\b|\b(?:this|current|local-only) (?:release|build|version)\b/i,
  },
  {
    label: "implementation detail",
    pattern: /\b(?:ProfileStore(?: v\d+)?|Profile Share V\d+|environment variables?|request bod(?:y|ies)|legacy routes?|provider wrapper|first-party validator|schema-driven MVP)\b/i,
  },
  {
    label: "banned contrastive template",
    pattern: /\bnot (?:just|only|simply|merely)\b[^.!?\n]{0,180}\bbut\b|\bno longer just\b[\s\S]{0,220}\bit is also\b|\bno longer about\b[\s\S]{0,180}\bit is about\b|\bis not\b[^.!?\n]{1,120}\bbut\b/i,
  },
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

const ADVISORY_PATTERNS = [
  { label: '"you think"', pattern: /\byou think\b/i },
  { label: '"you place real emphasis"', pattern: /\byou place real emphasis\b/i },
  { label: '"nearest-fit shorthand"', pattern: /nearest-fit shorthand/i },
  { label: '"broad-spectrum"', pattern: /\bbroad-spectrum\b/i },
  { label: '"matters"', pattern: /\bmatters\b/i },
  {
    label: "abstract filler",
    pattern: /\b(?:this matters because|at its core|ultimately|the key question|consequential|structured way|contextual movement|modeled positions)\b/i,
  },
  { label: '"pressure-test"', pattern: /\bpressure[- ]tests?\b/i },
  {
    label: "lens/layer/field/map metaphor",
    pattern: /\b(?:actor[- ]lens|saved layers?|connected layers?|deeper layers?|read the field|map your|the reward is the map)\b/i,
  },
]

// These World Stage comparisons distinguish exact legal status, alliance form, or
// coding method. "Rather than" carries necessary domain meaning in each sentence.
const PRECISE_DOMAIN_COMPARISONS = [
  "U.S. ties are officially robust but unofficial, grounded in the Taiwan Relations Act rather than a defense treaty; Taiwan sits inside the lens as a contingency-shaping actor.",
  "Taiwan should not be colored or labeled as a formal treaty ally in this scene because the U.S. relationship is explicitly unofficial and law-based rather than treaty-based.",
  "Saudi and Emirati roles are best treated as hedging rather than as stable attachment to any single external pole.",
  "No single official dataset measures 'hedging'; this scene rests on doctrine texts, summit roles, and official partnership language rather than a quantified index.",
] as const

const COPY_ALLOWLIST = new Map<string, ReadonlySet<string>>(
  PRECISE_DOMAIN_COMPARISONS.map((copy) => [copy, new Set(['"rather than"'])]),
)

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
      findHardPatterns(copy).includes(expected),
      `expected ${expected} to be detected in: ${copy}`,
    )
  }
})

test("the copy allowlist is exact and limited to precise domain comparisons", () => {
  for (const copy of COPY_ALLOWLIST.keys()) {
    assertCleanCopy("allowlisted privacy copy", copy)
  }

  assert.ok(
    findHardPatterns("This profile is descriptive rather than predictive.").includes(
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
    for (const answers of getPerspectiveAnswerCombinations(perspective)) {
      const copy = buildPerspectiveResultCopy(
        scorePerspectiveRun(perspective, perspectiveBaseline, answers),
      )

      for (const [field, value] of Object.entries(copy)) {
        assertCleanCopy(`perspective result ${perspective.id} ${field}`, value)
      }
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

test("Current Case records enforce hard copy rules and report advisory signals", (t) => {
  for (const record of getPublishedCurrentCases()) {
    for (const [field, copy] of currentCasePublicCopy(record)) {
      assertAuditedCopy(t, `Current Case ${record.slug} ${field}`, copy)
    }
  }
})

test("World Stage public labels enforce hard copy rules and report advisory signals", (t) => {
  for (const item of worldStageMenuItems) {
    for (const [field, copy] of Object.entries({
      label: item.label,
      lens: item.lens,
      description: item.description,
      action: item.action,
    })) {
      assertAuditedCopy(t, `World Stage menu ${item.id} ${field}`, copy)
    }
  }

  for (const option of worldStageSceneOptions) {
    assertAuditedCopy(t, `World Stage scene option ${option.sceneId}`, option.label)
  }

  for (const scene of worldStageScenes) {
    const copy = [
      ["public label", scene.publicLabel],
      ["caption", scene.caption],
      ...scene.countryRoles.map((role) => [`country ${role.iso3}`, role.rationale]),
      ...scene.nodes.flatMap((node) => [
        [`node ${node.id} label`, node.label],
        [`node ${node.id} explanation`, node.whyItMatters],
      ]),
      ...scene.flows.flatMap((flow) => [
        [`flow ${flow.id} label`, flow.label],
        [`flow ${flow.id} meaning`, flow.meaning],
      ]),
      ...scene.caveats.map((caveat, index) => [`caveat ${index + 1}`, caveat]),
    ] as Array<[string, string]>

    for (const [field, value] of copy) {
      assertAuditedCopy(t, `World Stage ${scene.id} ${field}`, value)
    }
  }

  for (const [index, copy] of publicSourceCopy(
    "components/home/world-stage/world-stage-home.tsx",
  ).entries()) {
    assertAuditedCopy(t, `World Stage homepage copy ${index + 1}`, copy)
  }
})

test("Privacy, Corrections, and AI entry copy block releases and implementation details", (t) => {
  const files = [
    "app/privacy/page.tsx",
    "app/feedback/page.tsx",
    "app/ai/page.tsx",
    "app/ai/quiz/page.tsx",
    "app/ai/results/[payload]/page.tsx",
  ]

  for (const file of files) {
    for (const [index, copy] of publicSourceCopy(file).entries()) {
      assertAuditedCopy(t, `${file} copy ${index + 1}`, copy)
    }
  }

})

test("result and Profile helpers enforce hard copy rules and report advisory signals", (t) => {
  const families: FamilyKey[] = [
    "realist",
    "institutionalist",
    "constructivist",
    "criticalPoliticalEconomy",
  ]
  const scores = buildProfileFixture(true).foundation!.dimensionScores

  for (const family of families) {
    assertAuditedCopy(t, `result summary ${family}`, buildSummary(family, scores))
    for (const [path, copy] of stringLeaves(getQuickTake(family))) {
      assertAuditedCopy(t, `quick take ${family} ${path}`, copy)
    }
    for (const [path, copy] of stringLeaves(getWhyItMatters(family))) {
      assertAuditedCopy(t, `result significance ${family} ${path}`, copy)
    }
    for (const [path, copy] of stringLeaves(getBlindSpots(family))) {
      assertAuditedCopy(t, `blind spot ${family} ${path}`, copy)
    }
    for (const [index, copy] of getPressureTestQuestions(family).entries()) {
      assertAuditedCopy(t, `result challenge ${family} ${index + 1}`, copy)
    }
  }

  for (const [label, profile] of [
    ["Foundation only", buildProfileFixture()],
    ["saved Focus Areas", buildProfileFixture(true)],
  ] as const) {
    for (const [path, copy] of stringLeaves({
      synthesis: buildProfileSynthesisLite(profile),
      triad: buildProfileTriad(profile),
      assessment: buildProfileAssessment(profile),
    })) {
      assertAuditedCopy(t, `Profile helper ${label} ${path}`, copy)
    }
  }
})

function publicSourceCopy(file: string): string[] {
  const source = readFileSync(resolve(process.cwd(), file), "utf8")
  const candidates: string[] = []
  const stringPattern = /(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g
  let match: RegExpExecArray | null

  while ((match = stringPattern.exec(source)) !== null) {
    const text = match[2]
    const lineStart = source.lastIndexOf("\n", match.index) + 1
    const before = source.slice(lineStart, match.index)
    const isImport = /(?:\bfrom|\bimport\s*\(|\brequire\s*\()\s*$/.test(before)
    const isNonCopyAttribute =
      /(?:className|href|id|key|name|type|role|value|data-[\w-]+)\s*=\s*$/.test(before)
    if (looksLikePublicCopy(text) && !isImport && !isNonCopyAttribute) {
      candidates.push(text)
    }
  }

  for (const line of source.split("\n")) {
    const raw = line.trim()
    const text = line.replace(/<[^>]+>/g, " ").replace(/\{[^{}]*\}/g, " ").trim()
    const looksLikeCode =
      /^(?:(?:import|export|const|let|var|type|interface|function|return|if|else|for|while)\b|\/\/|\/\*|\*)/.test(raw) ||
      /[=;{}]/.test(raw) ||
      /["'`]/.test(raw) ||
      raw.endsWith(",")
    if (looksLikePublicCopy(text) && !looksLikeCode) candidates.push(text)
  }

  return [...new Set(candidates)]
}

function looksLikePublicCopy(text: string) {
  return text.trim().length >= 8 && /[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(text)
}

function currentCasePublicCopy(record: CurrentCase): Array<[string, string]> {
  return [
    ["title", record.title],
    ["dek", record.dek],
    ["briefing", record.briefing],
    ["global perspective", record.perspectives.global],
    ...record.perspectives.counterparties.flatMap((entry, index) => [
      [`counterparty ${index + 1} actor`, entry.actor],
      [`counterparty ${index + 1} perspective`, entry.perspective],
    ] as Array<[string, string]>),
    ...record.knownUncertainties.map((copy, index) => [`uncertainty ${index + 1}`, copy] as [string, string]),
    ...record.reasoningTags.map((copy, index) => [`reasoning tag ${index + 1}`, copy] as [string, string]),
    ["decision prompt", record.decision.prompt],
    ...record.decision.options.flatMap((option, index) => [
      [`option ${index + 1} label`, option.label],
      [`option ${index + 1} logic`, option.logic],
      [`option ${index + 1} tradeoff`, option.acceptedTradeoff],
    ] as Array<[string, string]>),
    ...record.worldviewReadings.flatMap((reading, index) => [
      [`reading ${index + 1} notices`, reading.noticesFirst],
      [`reading ${index + 1} interpretation`, reading.interpretation],
      [`reading ${index + 1} recommendation`, reading.recommendation],
      [`reading ${index + 1} objection`, reading.strongestObjection],
      [`reading ${index + 1} update`, reading.updateCondition],
    ] as Array<[string, string]>),
    ["new information", record.assumptionChallenge.newInformation],
    ["assumption prompt", record.assumptionChallenge.prompt],
    ...record.assumptionChallenge.options.map((option, index) => [
      `assumption option ${index + 1}`,
      option.label,
    ] as [string, string]),
    ...record.nextRoutes.flatMap((route, index) => [
      [`next route ${index + 1} label`, route.label],
      [`next route ${index + 1} reason`, route.reason],
    ] as Array<[string, string]>),
    ...record.disputes.factual.map((copy, index) => [`factual dispute ${index + 1}`, copy] as [string, string]),
    ...record.disputes.interpretive.map((copy, index) => [`interpretive dispute ${index + 1}`, copy] as [string, string]),
  ]
}

function stringLeaves(value: unknown, path = "copy"): Array<[string, string]> {
  if (typeof value === "string") return [[path, value]]
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => stringLeaves(entry, `${path}.${index}`))
  }
  if (typeof value !== "object" || value === null) return []
  return Object.entries(value).flatMap(([key, entry]) => stringLeaves(entry, `${path}.${key}`))
}

function assertAuditedCopy(
  t: { diagnostic(message: string): void },
  label: string,
  text: string,
) {
  assertCleanCopy(label, text)
  for (const advisory of ADVISORY_PATTERNS) {
    if (advisory.pattern.test(text)) {
      t.diagnostic(`Advisory copy signal in ${label}: ${advisory.label}`)
    }
  }
}

function getPerspectiveAnswerCombinations(
  perspective: (typeof perspectiveCatalog)[number],
) {
  return perspective.scenarios.reduce<Array<Record<string, string>>>(
    (combinations, scenario) =>
      combinations.flatMap((answers) =>
        scenario.options.map((option) => ({
          ...answers,
          [scenario.id]: option.id,
        })),
      ),
    [{}],
  )
}

function assertCleanCopy(label: string, text: string) {
  const allowed = COPY_ALLOWLIST.get(text) ?? new Set<string>()
  for (const flagged of HARD_PATTERNS) {
    assert.ok(
      !flagged.pattern.test(text) || allowed.has(flagged.label),
      `${label} should avoid ${flagged.label}. Received: ${text}`,
    )
  }
}

function findHardPatterns(text: string) {
  return HARD_PATTERNS
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
