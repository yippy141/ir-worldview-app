import {
  buildAiGovernanceSummary,
  getAxisCards,
} from "@/lib/ai-governance-results"
import {
  buildAiGovernanceDeepDive,
  getPrimaryAxisSummary,
} from "@/lib/ai-governance-results-v2"
import { buildAiGovernancePayoff } from "@/lib/results/ai-governance-payoff"
import type {
  AiArchetypeKey,
  AiAxisKey,
  AiAxisScores,
  AiResult,
  GeopoliticsModifier,
  PaceModifier,
  RiskLens,
} from "@/lib/ai-governance-types"
import { getCurrentAiGovernanceVersion } from "@/lib/ai-governance-versions"
import {
  getArchetypeByCode,
  lensFromFamily,
  normFromNormativeModifier,
  postureFromStrategyModifier,
} from "@/lib/archetypes"
import {
  buildEnglishFoundationResultSocialCopy,
  buildEnglishProfileSocialCopy,
  buildFoundationCardCopy,
  buildZhHansFoundationResultSocialCopy,
} from "@/lib/foundation-social-copy"
import { normativeModifierGloss, strategyModifierGloss } from "@/lib/copy/glosses"
import { INSTRUMENT_COPY_VERSIONS } from "@/lib/locale-provenance"
import {
  CURRENT_MODULE_CALIBRATION_VERSIONS,
  getModuleAxisCalibration,
  MODULE_CLASSIFICATION_AXES,
  type ModuleCalibrationContext,
} from "@/lib/modules/calibration"
import {
  buildModuleResult,
  getModuleQuestions,
  getSelectedModuleOptions,
  modules,
} from "@/lib/modules/framework"
import { buildModuleDecisiveCalls } from "@/lib/modules/result-copy"
import {
  ACTOR_LENS_INSTRUCTION,
  ACTOR_LENS_RESULT_SUMMARY,
  hasPerspectiveBankCapability,
} from "@/lib/modules/perspective-bank"
import type {
  ModuleAnalytics,
  ModuleAnswers,
  ModuleAxisKey,
  ModuleDefinition,
  ModuleResult,
  ModuleSlug,
} from "@/lib/modules/types"
import {
  assessFoundationNarrative,
  buildFoundationNarrative,
  type FoundationNarrativeState,
} from "@/lib/narrative/foundation"
import { buildZhHansFoundationNarrative } from "@/lib/narrative/foundation-zh-hans"
import { FOUNDATION_INSTRUMENT_VERSION } from "@/lib/quiz-schema"
import {
  dimensionOneLiners,
  getActiveTensions,
  getFlipAnalysis,
  getIssueAreaTilts,
  getKeyDrivers,
  getPressureTestQuestions,
  getRunnerUpSeparation,
  getWhatWouldChangeThis,
  getWhyThisResult,
  neighborOverlapTexts,
} from "@/lib/result-helpers"
import { buildFoundationPayoff } from "@/lib/results/foundation-payoff"
import { familyDescriptions, FOUNDATION_SCORING_VERSION } from "@/lib/scoring"
import type {
  DimensionKey,
  DimensionScores,
  FamilyKey,
  NormativeModifier,
  QuizMode,
  StrategyModifier,
} from "@/lib/types"
import { traditionNounLabel } from "@/lib/worldview-config"

export type RuntimeCopyJob =
  | "payoff"
  | "mechanism"
  | "definition"
  | "instruction"
  | "limitation"
  | "evidence"
  | "tradeoff"

export type RuntimeCopySurface =
  | "foundation-result:en"
  | "foundation-result:zh-Hans"
  | "foundation-open-graph:en"
  | "foundation-open-graph:zh-Hans"
  | "foundation-share-card:en"
  | "module-result:security"
  | "module-result:technology"
  | "ai-governance-result:en"
  | "ai-governance-open-graph:en"
  | "ai-governance-share:en"
  | "profile:en"
  | "profile-open-graph:en"

export type RuntimeCopyReviewState = "coverage-only-needs-human-review"

export type RuntimeCopySurfaceManifest = {
  surface: RuntimeCopySurface
  blocks: string[]
  reviewState: RuntimeCopyReviewState
  coverageScope: string
  exclusions: string[]
}

const FOUNDATION_EN_BLOCKS = [
  "summary",
  "family-explanation",
  "what-would-change",
  "modifier:strategy",
  "modifier:normative",
  "payoff:notice-first",
  "payoff:tension-title",
  "payoff:tension-body",
  "payoff:rival-argument",
  "payoff:case-question",
  "payoff:case-reason",
  "payoff:security-debate",
  "payoff:technology-debate",
  "payoff:issue-tilt",
  "payoff:issue-note",
  "payoff:underweight",
  "driver",
  "runner-up-separation",
  "dimension-one-liner",
  "neighbor-overlap",
  "mixed-note",
  "why-this-result",
  "flip-analysis",
  "pressure-question",
] as const

const FOUNDATION_ZH_HANS_BLOCKS = [
  "headline",
  "summary",
  "profile-reading",
  "model-placement",
  "judgment-effect",
  "next-test",
] as const

const MODULE_SECURITY_BLOCKS = [
  "headline",
  "summary",
  "challenge",
  "instinct",
  "lane-summary",
  "perspective-modeling:summary",
  "perspective-modeling:instruction",
  "foundation-relation",
  "scope:measures",
  "scope:does-not-claim",
  "decisive:case-title",
  "decisive:framing",
  "decisive:implication",
] as const

const MODULE_TECHNOLOGY_BLOCKS = [
  "headline",
  "summary",
  "challenge",
  "instinct",
  "lane-summary",
  "card-type:headline",
  "card-type:summary",
  "foundation-relation",
  "scope:measures",
  "scope:does-not-claim",
  "decisive:case-title",
  "decisive:framing",
  "decisive:implication",
] as const

const AI_RESULT_BLOCKS = [
  "archetype-label",
  "summary",
  "archetype-description",
  "governing-instinct",
  "question-to-sit-with",
  "primary-axis-summary",
  "policy-signal:title",
  "policy-signal:stance",
  "policy-signal:explanation",
  "payoff-debate:title",
  "payoff-debate:question",
  "payoff-debate:text",
  "payoff-main-tension:title",
  "payoff-main-tension:text",
  "international-order",
  "tension:title",
  "tension:text",
  "comparison:nearest",
  "comparison:farthest",
  "evidence-shift",
  "strongest-critique",
  "axis-description",
] as const

const PROFILE_BLOCKS = [
  "saved-foundation:name",
  "saved-foundation:gloss",
  "saved-foundation:reading-code",
  "saved-module:headline",
  "saved-module:summary",
  "saved-module:lane-summary",
  "saved-module:title",
  "saved-module:subtitle",
  "saved-module:measures",
  "saved-module:does-not-claim",
  "saved-ai:archetype-label",
  "saved-ai:summary",
] as const

export const RUNTIME_COPY_SURFACE_MANIFEST: RuntimeCopySurfaceManifest[] = [
  {
    surface: "foundation-result:en",
    blocks: [...FOUNDATION_EN_BLOCKS],
    reviewState: "coverage-only-needs-human-review",
    coverageScope:
      "Computed English result prose emitted by the live Foundation narrative, payoff, modifier, driver, dimension, runner-up, and pressure-test helpers.",
    exclusions: [
      "Page-local static interface copy, reading-list copy, invalid-result copy, and core-versus-extended action text are outside this generated corpus.",
      "The fixture probes authored branch combinations; it is not a claim that every synthetic probe is reachable from a valid scored payload.",
    ],
  },
  {
    surface: "foundation-result:zh-Hans",
    blocks: [...FOUNDATION_ZH_HANS_BLOCKS],
    reviewState: "coverage-only-needs-human-review",
    coverageScope:
      "The complete Simplified Chinese narrative returned by buildZhHansFoundationNarrative and rendered by the localized result page.",
    exclusions: [
      "Localized page chrome, static methodology text, invalid-result copy, and reading-list copy remain outside this generated corpus.",
    ],
  },
  {
    surface: "foundation-open-graph:en",
    blocks: ["title", "description"],
    reviewState: "coverage-only-needs-human-review",
    coverageScope: "Canonical English Foundation Open Graph title and description.",
    exclusions: ["Static invalid-result metadata is not branch-rendered here."],
  },
  {
    surface: "foundation-open-graph:zh-Hans",
    blocks: ["title", "description"],
    reviewState: "coverage-only-needs-human-review",
    coverageScope: "Canonical Simplified Chinese Foundation Open Graph title and description.",
    exclusions: ["Static invalid-result metadata is not branch-rendered here."],
  },
  {
    surface: "foundation-share-card:en",
    blocks: ["reading-code", "name", "gloss"],
    reviewState: "coverage-only-needs-human-review",
    coverageScope: "Canonical generated text drawn onto the English Foundation share card.",
    exclusions: ["Static brand and method labels on the image are audited as source copy, not runtime combinations."],
  },
  {
    surface: "module-result:security",
    blocks: [...MODULE_SECURITY_BLOCKS],
    reviewState: "coverage-only-needs-human-review",
    coverageScope:
      "Computed Security result prose for deterministic answer witnesses that cover every headline and lane branch exposed by the public calibration oracle.",
    exclusions: [
      "Frozen question, prompt, and option-bank text is protected by the bank audit and is not duplicated here.",
      "The branch oracle does not prove exhaustive decisive-call combinations across the full answer space.",
      "Static result chrome, score captions, links, and research-status copy remain source-audited.",
    ],
  },
  {
    surface: "module-result:technology",
    blocks: [...MODULE_TECHNOLOGY_BLOCKS],
    reviewState: "coverage-only-needs-human-review",
    coverageScope:
      "Computed Technology result prose for deterministic answer witnesses that cover every headline and lane branch exposed by the public calibration oracle.",
    exclusions: [
      "Frozen question, prompt, and option-bank text is protected by the bank audit and is not duplicated here.",
      "The branch oracle does not prove exhaustive card-type or decisive-call combinations across the full answer space.",
      "Static result chrome, score captions, links, and research-status copy remain source-audited.",
    ],
  },
  {
    surface: "ai-governance-result:en",
    blocks: [...AI_RESULT_BLOCKS],
    reviewState: "coverage-only-needs-human-review",
    coverageScope:
      "Computed English AI result prose across archetype profiles, axis endpoint pairs, modifiers, payoff debates, tensions, comparisons, and evidence-shift helpers.",
    exclusions: [
      "Static page chrome, reading-list copy, and invalid-result copy are outside this generated corpus.",
      "Strongest-axis pair coverage does not prove every ordering or every simultaneous multi-axis configuration.",
    ],
  },
  {
    surface: "ai-governance-open-graph:en",
    blocks: ["title", "description"],
    reviewState: "coverage-only-needs-human-review",
    coverageScope: "The valid-result AI Open Graph title and description composed by the live result route.",
    exclusions: ["Static invalid-result metadata is not branch-rendered here."],
  },
  {
    surface: "ai-governance-share:en",
    blocks: ["title", "text"],
    reviewState: "coverage-only-needs-human-review",
    coverageScope: "The title and text passed to the native share action on the valid AI result route.",
    exclusions: ["Browser- or operating-system-generated share UI is outside the repository."],
  },
  {
    surface: "profile:en",
    blocks: [...PROFILE_BLOCKS],
    reviewState: "coverage-only-needs-human-review",
    coverageScope:
      "Canonical saved-layer strings that ProfileReport renders again without synthesizing cross-layer prose.",
    exclusions: [
      "Profile state combinations are declared separately and are not falsely instantiated as new prose combinations.",
      "Static Profile empty-state, unavailable-state, history, action, and explanatory copy remains source-audited rather than branch-rendered here.",
      "Saved evidence-log question and option text remains covered by frozen-bank protection rather than being duplicated into this fixture.",
    ],
  },
  {
    surface: "profile-open-graph:en",
    blocks: ["title", "description"],
    reviewState: "coverage-only-needs-human-review",
    coverageScope: "Canonical valid-profile Open Graph title and description.",
    exclusions: ["Invalid or unavailable profile metadata is not branch-rendered here."],
  },
]

type FoundationInputProvenance = {
  kind: "foundation"
  locale: "en" | "zh-Hans"
  instrumentVersion: number
  scoringVersion: number
  localeCopyVersion: number
  caseId: string
  state: FoundationNarrativeState
  familyKey: FamilyKey
  runnerUpKey: FamilyKey
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
  dimensionScores: DimensionScores
}

type ModuleInputProvenance = {
  kind: "module"
  slug: ModuleSlug
  bankVersion: number
  scoringVersion: number
  locale: "en"
  localeCopyVersion: number
  mode: QuizMode
  patternId: string
  answers: ModuleAnswers
  scores: Record<string, number>
}

type AiInputProvenance = {
  kind: "ai-governance"
  bankVersion: number
  scoringVersion: number
  locale: "en"
  localeCopyVersion: number
  templateId: string
  archetypeKey: AiArchetypeKey
  axisScores: AiAxisScores
  strongestAxes: [AiAxisKey, AiAxisKey]
  riskLens: RiskLens
  paceModifier: PaceModifier
  geopoliticsModifier: GeopoliticsModifier
}

export type RuntimeCopyInputProvenance =
  | FoundationInputProvenance
  | ModuleInputProvenance
  | AiInputProvenance

export type RuntimeCopyOccurrence = {
  id: string
  surface: RuntimeCopySurface
  block: string
  job: RuntimeCopyJob
  inputs: RuntimeCopyInputProvenance
}

export type RuntimeCopyFixtureRow = {
  id: string
  text: string
  surfaces: RuntimeCopySurface[]
  blocks: string[]
  jobs: RuntimeCopyJob[]
  occurrences: RuntimeCopyOccurrence[]
}

type FoundationCoverage = {
  locale: "en" | "zh-Hans"
  blocks: string[]
  states: FoundationNarrativeState[]
  familyKeys: FamilyKey[]
  runnerUpPairs: string[]
  strategyModifiers: StrategyModifier[]
  normativeModifiers: NormativeModifier[]
  appliedReadingCombinations: number
  dimensionBands: Record<DimensionKey, Array<"low" | "middle" | "high">>
}

export type ModuleModeRuntimeCoverage = {
  slug: ModuleSlug
  mode: QuizMode
  retainedAnswerPatterns: number
  searchCandidatesChecked: number
  headlineBranches: {
    expected: number
    observed: number
    uncovered: string[]
  }
  laneBranches: Record<
    string,
    {
      expected: number
      observed: number
      uncovered: string[]
    }
  >
  oracle: "public-callback-calibration-grid"
  proofLimit:
    "The public callbacks expose authored score branches, but the answer space is too large for exhaustive enumeration. Completed deterministic answers must cover every callback branch found by the calibration-grid oracle."
}

type AiRuntimeCoverage = {
  bankVersion: number
  scoringVersion: number
  archetypes: AiArchetypeKey[]
  riskLenses: RiskLens[]
  paceModifiers: PaceModifier[]
  geopoliticsModifiers: GeopoliticsModifier[]
  strongestAxes: AiAxisKey[]
  strongestAxisPairs: string[]
}

type ProfileRuntimeCoverage = {
  declaredStates: string[]
  instantiatedStateCombinations: 0
  reusedBlocks: string[]
  compositionRule:
    "Profile reuses each saved layer's canonical visible blocks and does not synthesize new prose across layers."
  stateLimit:
    "The fixture inventories reused saved-layer strings only. Profile state combinations and static empty or unavailable copy require component tests and human review."
}

type RuntimeCopyManifestValidation = {
  passes: boolean
  missingDeclaredBlocks: string[]
  undeclaredObservedBlocks: string[]
  duplicateManifestSurfaces: RuntimeCopySurface[]
}

export type RuntimeCopyFixture = {
  generatedFrom: string[]
  reviewUnit: "exact user-visible block"
  reviewState: RuntimeCopyReviewState
  reviewMeaning:
    "Coverage records what the generators can emit. It does not record editorial approval, human review, or release readiness."
  occurrenceCount: number
  uniqueTextCount: number
  surfaceManifest: RuntimeCopySurfaceManifest[]
  manifestValidation: RuntimeCopyManifestValidation
  coverage: {
    foundation: FoundationCoverage[]
    modules: ModuleModeRuntimeCoverage[]
    aiV3: AiRuntimeCoverage
    profile: ProfileRuntimeCoverage
    social: {
      surfaces: ReadonlyArray<
        | "foundation-open-graph:en"
        | "foundation-open-graph:zh-Hans"
        | "foundation-share-card:en"
        | "profile-open-graph:en"
      >
    }
  }
  rows: RuntimeCopyFixtureRow[]
}

type RawRuntimeCopyOccurrence = RuntimeCopyOccurrence & { text: string }

const DIMENSION_KEYS: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]
const FAMILY_KEYS: FamilyKey[] = [
  "realist",
  "institutionalist",
  "constructivist",
  "criticalPoliticalEconomy",
]
const STRATEGY_MODIFIERS: StrategyModifier[] = [
  "Restrainer",
  "Hedger",
  "Maximizer",
]
const NORMATIVE_MODIFIERS: NormativeModifier[] = [
  "Pluralist",
  "Conditional Solidarist",
  "Universalist",
]
const QUIZ_MODES: QuizMode[] = ["standard", "analyst"]
const BRANCH_BANDS = ["low", "middle", "high"] as const

const REVIEW_SCORES: DimensionScores = {
  securityCompetition: 5,
  institutions: 4.5,
  domesticFilters: 4,
  normsIdentity: 4.5,
  politicalEconomy: 4,
  restraint: 5,
  orderJustice: 4,
}

const ZH_HANS_SECTION_METADATA: Record<
  string,
  { block: string; job: RuntimeCopyJob }
> = {
  "这组画像如何理解世界政治": {
    block: "profile-reading",
    job: "definition",
  },
  "模型为什么把它放在这里": {
    block: "model-placement",
    job: "mechanism",
  },
  "这通常会怎样影响判断": {
    block: "judgment-effect",
    job: "payoff",
  },
  "下一步最值得检验什么": {
    block: "next-test",
    job: "instruction",
  },
}

/**
 * Build the review corpus from the same public generators used by result
 * surfaces. Rows are deduplicated by exact visible text. Every source input is
 * retained as an occurrence so reviewers can trace shared copy back to all of
 * the routes and answer patterns that produce it.
 */
export function buildRuntimeCopyFixture(): RuntimeCopyFixture {
  const foundation = buildFoundationOccurrences()
  const moduleCorpus = buildModuleOccurrences()
  const ai = buildAiOccurrences()
  const social = buildSocialOccurrences(foundation.occurrences)
  const profile = buildProfileOccurrences(
    social.occurrences,
    moduleCorpus.occurrences,
    ai.occurrences,
  )
  const occurrences = [
    ...foundation.occurrences,
    ...moduleCorpus.occurrences,
    ...ai.occurrences,
    ...social.occurrences,
    ...profile.occurrences,
  ]
  const rows = deduplicateOccurrences(occurrences)
  const manifestValidation = validateSurfaceManifest(occurrences)

  return {
    generatedFrom: [
      "app/results/[payload]/page.tsx",
      "app/ai/results/[payload]/page.tsx",
      "lib/narrative/foundation.ts",
      "lib/narrative/foundation-zh-hans.ts",
      "lib/result-helpers.ts",
      "lib/results/foundation-payoff.ts",
      "lib/modules/security.ts",
      "lib/modules/technology.ts",
      "lib/ai-governance-results.ts",
      "lib/ai-governance-results-v2.ts",
      "lib/results/ai-governance-payoff.ts",
      "lib/foundation-social-copy.ts",
      "components/modules/module-result.tsx",
      "components/profile/profile-report.tsx",
    ],
    reviewUnit: "exact user-visible block",
    reviewState: "coverage-only-needs-human-review",
    reviewMeaning:
      "Coverage records what the generators can emit. It does not record editorial approval, human review, or release readiness.",
    occurrenceCount: occurrences.length,
    uniqueTextCount: rows.length,
    surfaceManifest: RUNTIME_COPY_SURFACE_MANIFEST,
    manifestValidation,
    coverage: {
      foundation: foundation.coverage,
      modules: moduleCorpus.coverage,
      aiV3: ai.coverage,
      profile: profile.coverage,
      social: social.coverage,
    },
    rows,
  }
}

type FoundationCase = {
  id: string
  scores: DimensionScores
  dimensionProbe?: {
    key: DimensionKey
    band: "low" | "middle" | "high"
  }
}

function buildFoundationOccurrences() {
  const occurrences: RawRuntimeCopyOccurrence[] = []
  const cases = buildFoundationCases()
  const stateCases = Object.fromEntries(
    cases
      .filter((candidate) => candidate.id.startsWith("state:"))
      .map((candidate) => [
        assessFoundationNarrative(candidate.scores).state,
        candidate,
      ]),
  ) as Record<FoundationNarrativeState, FoundationCase>

  const inputs: Array<{
    caseId: string
    familyKey: FamilyKey
    runnerUpKey: FamilyKey
    strategyModifier: StrategyModifier
    normativeModifier: NormativeModifier
    dimensionScores: DimensionScores
  }> = []

  // Preserve the original 4 x 3 x 3 applied-reading matrix.
  for (const familyKey of FAMILY_KEYS) {
    const runnerUpKey = FAMILY_KEYS.find((candidate) => candidate !== familyKey)!
    for (const strategyModifier of STRATEGY_MODIFIERS) {
      for (const normativeModifier of NORMATIVE_MODIFIERS) {
        inputs.push({
          caseId: `applied:${familyKey}:${strategyModifier}:${normativeModifier}`,
          familyKey,
          runnerUpKey,
          strategyModifier,
          normativeModifier,
          dimensionScores: REVIEW_SCORES,
        })
      }
    }
  }

  // Exercise every family, runner-up, and narrative-state branch.
  for (const familyKey of FAMILY_KEYS) {
    for (const runnerUpKey of FAMILY_KEYS) {
      if (runnerUpKey === familyKey) continue
      for (const state of Object.keys(stateCases) as FoundationNarrativeState[]) {
        const stateCase = stateCases[state]
        inputs.push({
          caseId: `${stateCase.id}:${familyKey}:${runnerUpKey}`,
          familyKey,
          runnerUpKey,
          strategyModifier: "Hedger",
          normativeModifier: "Conditional Solidarist",
          dimensionScores: stateCase.scores,
        })
      }
    }
  }

  // Exercise every low, midpoint, and high dimension-description branch.
  for (const dimensionCase of cases.filter((candidate) => candidate.dimensionProbe)) {
    inputs.push({
      caseId: dimensionCase.id,
      familyKey: "realist",
      runnerUpKey: "institutionalist",
      strategyModifier: "Hedger",
      normativeModifier: "Conditional Solidarist",
      dimensionScores: dimensionCase.scores,
    })
  }

  const uniqueInputs = deduplicateBy(inputs, (input) => input.caseId)
  for (const input of uniqueInputs) {
    appendEnglishFoundationOccurrences(occurrences, input)
    appendZhHansFoundationOccurrences(occurrences, input)
  }

  const dimensionBands = Object.fromEntries(
    DIMENSION_KEYS.map((key) => [
      key,
      cases
        .filter((candidate) => candidate.dimensionProbe?.key === key)
        .map((candidate) => candidate.dimensionProbe!.band),
    ]),
  ) as FoundationCoverage["dimensionBands"]

  const baseCoverage = {
    states: uniqueSorted(
      uniqueInputs.map((input) =>
        assessFoundationNarrative(input.dimensionScores).state,
      ),
    ) as FoundationNarrativeState[],
    familyKeys: uniqueSorted(uniqueInputs.map((input) => input.familyKey)) as FamilyKey[],
    runnerUpPairs: uniqueSorted(
      uniqueInputs.map((input) => `${input.familyKey}:${input.runnerUpKey}`),
    ),
    strategyModifiers: uniqueSorted(
      uniqueInputs.map((input) => input.strategyModifier),
    ) as StrategyModifier[],
    normativeModifiers: uniqueSorted(
      uniqueInputs.map((input) => input.normativeModifier),
    ) as NormativeModifier[],
    appliedReadingCombinations: FAMILY_KEYS.length * STRATEGY_MODIFIERS.length * NORMATIVE_MODIFIERS.length,
    dimensionBands,
  }

  return {
    occurrences,
    coverage: [
      {
        locale: "en" as const,
        blocks: [...FOUNDATION_EN_BLOCKS],
        ...baseCoverage,
      },
      {
        locale: "zh-Hans" as const,
        blocks: [...FOUNDATION_ZH_HANS_BLOCKS],
        ...baseCoverage,
      },
    ],
  }
}

function buildFoundationCases(): FoundationCase[] {
  const stateCases = findFoundationStateCases()
  const cases: FoundationCase[] = (
    Object.entries(stateCases) as Array<
      [FoundationNarrativeState, DimensionScores]
    >
  ).map(([state, scores]) => ({ id: `state:${state}`, scores }))

  for (const key of DIMENSION_KEYS) {
    for (const band of BRANCH_BANDS) {
      const scores = midpointFoundationScores()
      scores[key] = band === "low" ? 2 : band === "high" ? 6 : 4.1
      cases.push({
        id: `dimension:${key}:${band}`,
        scores,
        dimensionProbe: { key, band },
      })
    }
  }

  return cases
}

function findFoundationStateCases(): Record<
  FoundationNarrativeState,
  DimensionScores
> {
  const found: Partial<Record<FoundationNarrativeState, DimensionScores>> = {}
  const values = [2, 4, 6]
  const combinationCount = values.length ** DIMENSION_KEYS.length

  for (let index = 0; index < combinationCount; index += 1) {
    let cursor = index
    const scores = midpointFoundationScores()
    for (const key of DIMENSION_KEYS) {
      scores[key] = values[cursor % values.length]
      cursor = Math.floor(cursor / values.length)
    }
    const state = assessFoundationNarrative(scores).state
    found[state] ??= scores
    if (Object.keys(found).length === 3) break
  }

  for (const state of [
    "lowDifferentiation",
    "stableModeration",
    "sharplyDifferentiated",
  ] as const) {
    if (!found[state]) {
      throw new Error(`Unable to render Foundation narrative state: ${state}.`)
    }
  }

  return found as Record<FoundationNarrativeState, DimensionScores>
}

function midpointFoundationScores(): DimensionScores {
  return Object.fromEntries(DIMENSION_KEYS.map((key) => [key, 4])) as DimensionScores
}

function appendEnglishFoundationOccurrences(
  target: RawRuntimeCopyOccurrence[],
  input: {
    caseId: string
    familyKey: FamilyKey
    runnerUpKey: FamilyKey
    strategyModifier: StrategyModifier
    normativeModifier: NormativeModifier
    dimensionScores: DimensionScores
  },
) {
  const narrative = buildFoundationNarrative(input)
  const provenance: FoundationInputProvenance = {
    kind: "foundation",
    locale: "en",
    instrumentVersion: FOUNDATION_INSTRUMENT_VERSION,
    scoringVersion: FOUNDATION_SCORING_VERSION,
    localeCopyVersion: INSTRUMENT_COPY_VERSIONS.foundation.en,
    caseId: input.caseId,
    state: narrative.state,
    familyKey: input.familyKey,
    runnerUpKey: input.runnerUpKey,
    strategyModifier: input.strategyModifier,
    normativeModifier: input.normativeModifier,
    dimensionScores: input.dimensionScores,
  }

  const familyLabel = traditionNounLabel(input.familyKey)
  const runnerUpLabel = traditionNounLabel(input.runnerUpKey)
  const payoff = buildFoundationPayoff({
    dimensionScores: input.dimensionScores,
    familyKey: input.familyKey,
    familyLabel,
    runnerUpKey: input.runnerUpKey,
    runnerUpLabel,
    strategyModifier: input.strategyModifier,
    normativeModifier: input.normativeModifier,
  })
  const issueAreaTilt = getIssueAreaTilts(
    input.familyKey,
    input.dimensionScores,
  )[0]
  const runnerUpSeparation = getRunnerUpSeparation(
    input.familyKey,
    input.runnerUpKey,
    input.dimensionScores,
  )
  const neighborOverlap =
    neighborOverlapTexts[input.familyKey]?.[input.runnerUpKey] ?? ""
  const flipAnalysis = getFlipAnalysis(
    input.familyKey,
    input.runnerUpKey,
    input.dimensionScores,
  )
  const mixedNote = buildLiveFoundationMixedNote({
    state: narrative.state,
    familyLabel,
    runnerUpLabel,
    firstTension: getFirstActiveTension(input.dimensionScores),
  })
  const prefix = `foundation:en:${input.caseId}`
  const surface = "foundation-result:en" as const
  const append = (
    block: (typeof FOUNDATION_EN_BLOCKS)[number],
    job: RuntimeCopyJob,
    text: string | null | undefined,
    suffix: string = block,
  ) => {
    if (!text) return
    target.push({
      id: `${prefix}:${suffix}`,
      surface,
      block,
      job,
      inputs: provenance,
      text,
    })
  }

  append("summary", "payoff", narrative.summary)
  append("family-explanation", "definition", familyDescriptions[input.familyKey])
  append(
    "what-would-change",
    "tradeoff",
    getWhatWouldChangeThis(
      input.familyKey,
      input.runnerUpKey,
      input.dimensionScores,
    ),
  )
  append(
    "modifier:strategy",
    "definition",
    strategyModifierGloss(input.strategyModifier),
  )
  append(
    "modifier:normative",
    "definition",
    normativeModifierGloss(input.normativeModifier),
  )
  append("payoff:notice-first", "payoff", payoff.corePattern.noticeFirst)
  append("payoff:tension-title", "tradeoff", payoff.mainTension.title)
  append("payoff:tension-body", "tradeoff", payoff.mainTension.body)
  append(
    "payoff:rival-argument",
    "tradeoff",
    payoff.mainTension.rivalArgument,
  )
  append("payoff:case-question", "tradeoff", payoff.caseTest.question)
  append("payoff:case-reason", "mechanism", payoff.caseTest.reason)
  append(
    "payoff:security-debate",
    "payoff",
    payoff.liveDebates.find((debate) => debate.title === "Great-power rivalry")
      ?.text,
  )
  append(
    "payoff:technology-debate",
    "payoff",
    payoff.liveDebates.find(
      (debate) => debate.title === "Technology competition",
    )?.text,
  )
  if (issueAreaTilt) {
    append("payoff:issue-tilt", "payoff", issueAreaTilt.tilt)
    append("payoff:issue-note", "mechanism", issueAreaTilt.note)
  } else {
    append("payoff:underweight", "limitation", payoff.corePattern.underweight)
  }
  for (const driver of getKeyDrivers(input.dimensionScores)) {
    append(
      "driver",
      "mechanism",
      `${driver.label}. ${driver.description}`,
      `driver:${driver.dimension}`,
    )
  }
  append(
    "runner-up-separation",
    "mechanism",
    runnerUpSeparation,
  )
  for (const dimension of DIMENSION_KEYS) {
    append(
      "dimension-one-liner",
      "definition",
      dimensionOneLiners[dimension](input.dimensionScores[dimension]),
      `dimension:${dimension}`,
    )
  }
  append("neighbor-overlap", "tradeoff", neighborOverlap)
  append("mixed-note", "tradeoff", mixedNote)
  getWhyThisResult(
    input.familyKey,
    input.runnerUpKey,
    input.dimensionScores,
  ).forEach((text, index) =>
    append("why-this-result", "mechanism", text, `why:${index + 1}`),
  )
  append("flip-analysis", "mechanism", flipAnalysis)
  getPressureTestQuestions(input.familyKey).forEach((text, index) =>
    append("pressure-question", "tradeoff", text, `pressure:${index + 1}`),
  )
}

function getFirstActiveTension(dimensionScores: DimensionScores) {
  return getActiveTensions(dimensionScores)[0]?.text ?? null
}

function buildLiveFoundationMixedNote({
  state,
  familyLabel,
  runnerUpLabel,
  firstTension,
}: {
  state: FoundationNarrativeState
  familyLabel: string
  runnerUpLabel: string
  firstTension: string | null
}) {
  if (firstTension) return firstTension
  if (state === "lowDifferentiation") {
    return `${familyLabel} and ${runnerUpLabel} are both close shorthand for this foundation profile. The gap between them is narrow enough that forcing a single tradition would hide part of the mix.`
  }
  if (state === "sharplyDifferentiated") {
    return "Cross-dimension consistency makes this baseline comparatively clear. The main test now is whether it still holds under issue-specific pressure."
  }
  return "A nearby runner-up remains relevant in harder cases even though the baseline is clear. That overlap is part of the result."
}

function appendZhHansFoundationOccurrences(
  target: RawRuntimeCopyOccurrence[],
  input: {
    caseId: string
    familyKey: FamilyKey
    runnerUpKey: FamilyKey
    strategyModifier: StrategyModifier
    normativeModifier: NormativeModifier
    dimensionScores: DimensionScores
  },
) {
  const narrative = buildZhHansFoundationNarrative(input)
  const provenance: FoundationInputProvenance = {
    kind: "foundation",
    locale: "zh-Hans",
    instrumentVersion: FOUNDATION_INSTRUMENT_VERSION,
    scoringVersion: FOUNDATION_SCORING_VERSION,
    localeCopyVersion: INSTRUMENT_COPY_VERSIONS.foundation["zh-Hans"],
    caseId: input.caseId,
    state: narrative.state,
    familyKey: input.familyKey,
    runnerUpKey: input.runnerUpKey,
    strategyModifier: input.strategyModifier,
    normativeModifier: input.normativeModifier,
    dimensionScores: input.dimensionScores,
  }

  target.push(
    {
      id: `foundation:zh-Hans:${input.caseId}:headline`,
      surface: "foundation-result:zh-Hans",
      block: "headline",
      job: "payoff",
      inputs: provenance,
      text: narrative.headline,
    },
    {
      id: `foundation:zh-Hans:${input.caseId}:summary`,
      surface: "foundation-result:zh-Hans",
      block: "summary",
      job: "payoff",
      inputs: provenance,
      text: narrative.summary,
    },
  )
  appendFoundationSections(
    target,
    `foundation:zh-Hans:${input.caseId}`,
    "foundation-result:zh-Hans",
    narrative.sections,
    ZH_HANS_SECTION_METADATA,
    provenance,
  )
}

function appendFoundationSections(
  target: RawRuntimeCopyOccurrence[],
  idPrefix: string,
  surface: "foundation-result:en" | "foundation-result:zh-Hans",
  sections: Array<{ title: string; text: string }>,
  metadataByTitle: Record<string, { block: string; job: RuntimeCopyJob }>,
  inputs: FoundationInputProvenance,
) {
  const seenBlocks = new Set<string>()
  for (const section of sections) {
    const metadata = metadataByTitle[section.title]
    if (!metadata) {
      throw new Error(`Unmapped Foundation narrative section: ${section.title}.`)
    }
    if (seenBlocks.has(metadata.block)) {
      throw new Error(`Duplicate Foundation narrative block: ${metadata.block}.`)
    }
    seenBlocks.add(metadata.block)
    target.push({
      id: `${idPrefix}:${metadata.block}`,
      surface,
      block: metadata.block,
      job: metadata.job,
      inputs,
      text: section.text,
    })
  }

  if (seenBlocks.size !== Object.keys(metadataByTitle).length) {
    throw new Error(`Foundation narrative omitted a known section on ${surface}.`)
  }
}

type ModulePattern = {
  id: string
  answers: ModuleAnswers
  result: ModuleResult
}

type ModuleOracle = {
  interpretations: Map<string, { headline: string; summary: string }>
  lanes: Record<string, Set<string>>
}

function buildModuleOccurrences() {
  const occurrences: RawRuntimeCopyOccurrence[] = []
  const coverage: ModuleModeRuntimeCoverage[] = []

  for (const moduleDefinition of modules) {
    for (const mode of QUIZ_MODES) {
      const oracle = buildModuleOracle(moduleDefinition, mode)
      const search = findModuleBranchPatterns(moduleDefinition, mode, oracle)
      const version = CURRENT_MODULE_CALIBRATION_VERSIONS[moduleDefinition.slug]

      for (const pattern of search.patterns) {
        const inputs: ModuleInputProvenance = {
          kind: "module",
          slug: moduleDefinition.slug,
          bankVersion: version.bankVersion,
          scoringVersion: version.scoringVersion,
          locale: "en",
          localeCopyVersion: INSTRUMENT_COPY_VERSIONS.module.en,
          mode,
          patternId: pattern.id,
          answers: pattern.answers,
          scores: pattern.result.scores,
        }
        const prefix = `module:${moduleDefinition.slug}:${mode}:${pattern.id}`
        const surface = `module-result:${moduleDefinition.slug}` as RuntimeCopySurface
        const selected = getSelectedModuleOptions(
          moduleDefinition,
          mode,
          pattern.answers,
        )
        const usesPerspectiveBankPresentation = hasPerspectiveBankCapability({
          slug: moduleDefinition.slug,
          bankVersion: version.bankVersion,
        })
        const decisiveSelections = usesPerspectiveBankPresentation
          ? selected.filter(({ question }) => question.cardType !== "actorLens")
          : selected
        const laneLabelMap = Object.fromEntries(
          moduleDefinition.lanes.map((lane) => [lane.key, lane.label]),
        ) as Record<string, string>
        const decisiveCalls = buildModuleDecisiveCalls({
          moduleDefinition,
          selected: decisiveSelections,
          laneLabelMap,
        })
        occurrences.push(
          {
            id: `${prefix}:headline`,
            surface,
            block: "headline",
            job: "payoff",
            inputs,
            text: pattern.result.headline,
          },
          {
            id: `${prefix}:summary`,
            surface,
            block: "summary",
            job: "payoff",
            inputs,
            text: pattern.result.summary,
          },
          {
            id: `${prefix}:challenge`,
            surface,
            block: "challenge",
            job: "tradeoff",
            inputs,
            text: pattern.result.challenge,
          },
          ...pattern.result.instincts.map((instinct, index) => ({
            id: `${prefix}:instinct:${index + 1}`,
            surface,
            block: "instinct",
            job: "mechanism" as const,
            inputs,
            text: instinct,
          })),
          ...pattern.result.laneSummaries.map((lane) => ({
            id: `${prefix}:lane:${lane.key}`,
            surface,
            block: "lane-summary",
            job: "mechanism" as const,
            inputs,
            text: lane.summary,
          })),
          ...(!usesPerspectiveBankPresentation && pattern.result.cardTypeRead
            ? [
                {
                  id: `${prefix}:card-type:headline`,
                  surface,
                  block: "card-type:headline",
                  job: "definition" as const,
                  inputs,
                  text: pattern.result.cardTypeRead.headline,
                },
                {
                  id: `${prefix}:card-type:summary`,
                  surface,
                  block: "card-type:summary",
                  job: "mechanism" as const,
                  inputs,
                  text: pattern.result.cardTypeRead.summary,
                },
              ]
            : []),
          ...(usesPerspectiveBankPresentation && pattern.result.cardTypeScores.actorLens
            ? [
                {
                  id: `${prefix}:perspective-modeling:summary`,
                  surface,
                  block: "perspective-modeling:summary",
                  job: "limitation" as const,
                  inputs,
                  text: ACTOR_LENS_RESULT_SUMMARY,
                },
                {
                  id: `${prefix}:perspective-modeling:instruction`,
                  surface,
                  block: "perspective-modeling:instruction",
                  job: "limitation" as const,
                  inputs,
                  text: `${ACTOR_LENS_INSTRUCTION} The choices remain visible below as separate descriptive evidence and do not alter any scored ${moduleDefinition.shortTitle} result.`,
                },
              ]
            : []),
          {
            id: `${prefix}:foundation-relation`,
            surface,
            block: "foundation-relation",
            job: "limitation",
            inputs,
            text: `Read this as a ${moduleDefinition.shortTitle.toLowerCase()}-specific result. It can sit beside your Foundation in the Profile, but it never changes the Foundation’s seven dimensions or family summary.`,
          },
          {
            id: `${prefix}:scope:measures`,
            surface,
            block: "scope:measures",
            job: "definition",
            inputs,
            text: `${moduleDefinition.measures.join("; ")}.`,
          },
          {
            id: `${prefix}:scope:does-not-claim`,
            surface,
            block: "scope:does-not-claim",
            job: "limitation",
            inputs,
            text: `${moduleDefinition.doesNotClaim.join("; ")}.`,
          },
          ...decisiveCalls.flatMap((call, index) => [
            {
              id: `${prefix}:decisive:${index + 1}:case-title`,
              surface,
              block: "decisive:case-title",
              job: "definition" as const,
              inputs,
              text: call.caseTitle,
            },
            {
              id: `${prefix}:decisive:${index + 1}:framing`,
              surface,
              block: "decisive:framing",
              job: "evidence" as const,
              inputs,
              text: call.framing,
            },
            {
              id: `${prefix}:decisive:${index + 1}:implication`,
              surface,
              block: "decisive:implication",
              job: "mechanism" as const,
              inputs,
              text: call.implication,
            },
          ]),
        )
      }

      coverage.push({
        slug: moduleDefinition.slug,
        mode,
        retainedAnswerPatterns: search.patterns.length,
        searchCandidatesChecked: search.candidatesChecked,
        headlineBranches: branchCoverage(
          oracle.interpretations.keys(),
          search.observedInterpretations,
        ),
        laneBranches: Object.fromEntries(
          Object.entries(oracle.lanes).map(([laneKey, expected]) => [
            laneKey,
            branchCoverage(expected, search.observedLanes[laneKey] ?? new Set()),
          ]),
        ),
        oracle: "public-callback-calibration-grid",
        proofLimit:
          "The public callbacks expose authored score branches, but the answer space is too large for exhaustive enumeration. Completed deterministic answers must cover every callback branch found by the calibration-grid oracle.",
      })
    }
  }

  return { occurrences, coverage }
}

function buildModuleOracle(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
): ModuleOracle {
  const classification = MODULE_CLASSIFICATION_AXES[moduleDefinition.slug]
  const interpretations = new Map<
    string,
    { headline: string; summary: string }
  >()

  for (const assignment of enumerateBandAssignments(classification.headline)) {
    const analytics = emptyModuleAnalytics(moduleDefinition, mode)
    for (const [axis, band] of Object.entries(assignment) as Array<
      [ModuleAxisKey, (typeof BRANCH_BANDS)[number]]
    >) {
      analytics.scores[axis] = moduleBandValue(
        moduleDefinition.slug,
        mode,
        { kind: "headline" },
        axis,
        band,
      )
    }
    const interpretation = moduleDefinition.interpret(analytics, { mode })
    interpretations.set(
      interpretationKey(interpretation.headline, interpretation.summary),
      {
        headline: interpretation.headline,
        summary: interpretation.summary,
      },
    )
  }

  const lanes: Record<string, Set<string>> = {}
  for (const [laneKey, axes] of Object.entries(classification.lanes)) {
    const summaries = new Set<string>()
    for (const assignment of enumerateBandAssignments(axes)) {
      const analytics = emptyModuleAnalytics(moduleDefinition, mode)
      for (const [axis, band] of Object.entries(assignment) as Array<
        [ModuleAxisKey, (typeof BRANCH_BANDS)[number]]
      >) {
        analytics.laneScores[laneKey][axis] = moduleBandValue(
          moduleDefinition.slug,
          mode,
          { kind: "lane", laneKey },
          axis,
          band,
        )
      }
      const lane = moduleDefinition
        .summarizeLanes(analytics, undefined, { mode })
        .find((candidate) => candidate.key === laneKey)
      if (!lane) {
        throw new Error(
          `Module ${moduleDefinition.slug} omitted known lane ${laneKey}.`,
        )
      }
      summaries.add(lane.summary)
    }
    lanes[laneKey] = summaries
  }

  return { interpretations, lanes }
}

function findModuleBranchPatterns(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  oracle: ModuleOracle,
) {
  const patterns: ModulePattern[] = []
  const observedInterpretations = new Set<string>()
  const observedLanes = Object.fromEntries(
    moduleDefinition.lanes.map((lane) => [lane.key, new Set<string>()]),
  ) as Record<string, Set<string>>
  let candidatesChecked = 0

  const inspect = (id: string, answers: ModuleAnswers) => {
    candidatesChecked += 1
    const result = buildModuleResult(moduleDefinition, mode, answers)
    const interpretation = interpretationKey(result.headline, result.summary)
    const addsInterpretation =
      oracle.interpretations.has(interpretation) &&
      !observedInterpretations.has(interpretation)
    const addsLane = result.laneSummaries.some(
      (lane) =>
        oracle.lanes[lane.key]?.has(lane.summary) &&
        !observedLanes[lane.key]?.has(lane.summary),
    )

    if (!addsInterpretation && !addsLane) return
    patterns.push({ id, answers, result })
    if (oracle.interpretations.has(interpretation)) {
      observedInterpretations.add(interpretation)
    }
    for (const lane of result.laneSummaries) {
      if (oracle.lanes[lane.key]?.has(lane.summary)) {
        observedLanes[lane.key].add(lane.summary)
      }
    }
  }

  const axisKeys = moduleDefinition.axes.map((axis) => axis.key)
  for (const objective of enumerateObjectives(axisKeys)) {
    inspect(
      `objective:${axisKeys.map((axis) => objective[axis]).join(":")}`,
      buildObjectiveAnswers(moduleDefinition, mode, objective),
    )
  }

  const questions = getModuleQuestions(moduleDefinition, mode)
  const maximumOptionCount = Math.max(
    ...questions.map((question) => question.options.length),
  )
  for (let optionIndex = 0; optionIndex < maximumOptionCount; optionIndex += 1) {
    inspect(
      `option-index:${optionIndex}`,
      Object.fromEntries(
        questions.map((question) => [
          question.id,
          {
            primary:
              question.options[optionIndex % question.options.length].id,
          },
        ]),
      ),
    )
  }

  const randomLimit = 20_000
  for (
    let index = 0;
    index < randomLimit && !moduleCoverageComplete(oracle, observedInterpretations, observedLanes);
    index += 1
  ) {
    inspect(
      `seed:${index}`,
      buildSeededModuleAnswers(moduleDefinition, mode, index),
    )
  }

  return {
    patterns,
    candidatesChecked,
    observedInterpretations,
    observedLanes,
  }
}

function buildObjectiveAnswers(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  objective: Record<ModuleAxisKey, -1 | 0 | 1>,
): ModuleAnswers {
  return Object.fromEntries(
    getModuleQuestions(moduleDefinition, mode).map((question) => {
      const ordered = [...question.options].sort((left, right) => {
        const scoreDifference =
          objectiveOptionScore(right.signals, objective) -
          objectiveOptionScore(left.signals, objective)
        return scoreDifference || left.id.localeCompare(right.id)
      })
      return [question.id, { primary: ordered[0].id }]
    }),
  )
}

function objectiveOptionScore(
  signals: Record<string, number>,
  objective: Record<ModuleAxisKey, -1 | 0 | 1>,
) {
  const entries = Object.entries(objective) as Array<
    [ModuleAxisKey, -1 | 0 | 1]
  >
  if (entries.every(([, direction]) => direction === 0)) {
    return -entries.reduce(
      (total, [axis]) => total + Math.abs((signals[axis] ?? 4) - 4),
      0,
    )
  }
  return entries.reduce(
    (total, [axis, direction]) =>
      total + direction * ((signals[axis] ?? 4) - 4),
    0,
  )
}

function buildSeededModuleAnswers(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  index: number,
): ModuleAnswers {
  const random = seededRandom(
    stableStringSeed(`${moduleDefinition.slug}:${mode}:${index}`),
  )

  return Object.fromEntries(
    getModuleQuestions(moduleDefinition, mode).map((question) => {
      const primaryIndex = Math.floor(random() * question.options.length)
      const primary = question.options[primaryIndex].id
      if (
        mode !== "analyst" ||
        !question.allowSecondChoiceInAnalyst ||
        question.options.length < 2 ||
        random() < 0.5
      ) {
        return [question.id, { primary }]
      }

      const offset = 1 + Math.floor(random() * (question.options.length - 1))
      const secondary =
        question.options[(primaryIndex + offset) % question.options.length].id
      return [question.id, { primary, secondary }]
    }),
  )
}

function moduleCoverageComplete(
  oracle: ModuleOracle,
  observedInterpretations: Set<string>,
  observedLanes: Record<string, Set<string>>,
) {
  if (
    [...oracle.interpretations.keys()].some(
      (branch) => !observedInterpretations.has(branch),
    )
  ) {
    return false
  }
  return Object.entries(oracle.lanes).every(([laneKey, expected]) =>
    [...expected].every((branch) => observedLanes[laneKey]?.has(branch)),
  )
}

function emptyModuleAnalytics(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
): ModuleAnalytics {
  const scores = Object.fromEntries(
    moduleDefinition.axes.map((axis) => [axis.key, 4]),
  )
  return {
    mode,
    scores: { ...scores },
    laneScores: Object.fromEntries(
      moduleDefinition.lanes.map((lane) => [lane.key, { ...scores }]),
    ),
    cardTypeScores: {},
  }
}

function moduleBandValue(
  slug: ModuleSlug,
  mode: QuizMode,
  context: ModuleCalibrationContext,
  axis: ModuleAxisKey,
  band: (typeof BRANCH_BANDS)[number],
) {
  const calibration = getModuleAxisCalibration(slug, mode, context, axis)
  if (band === "low") return calibration.attainable.minimum
  if (band === "high") return calibration.attainable.maximum
  return Number(
    ((calibration.cuts.lower.raw + calibration.cuts.upper.raw) / 2).toFixed(4),
  )
}

function enumerateBandAssignments(keys: readonly ModuleAxisKey[]) {
  return enumerateAssignments(keys, BRANCH_BANDS)
}

function enumerateObjectives(keys: readonly ModuleAxisKey[]) {
  return enumerateAssignments(keys, [-1, 0, 1] as const) as Array<
    Record<ModuleAxisKey, -1 | 0 | 1>
  >
}

function enumerateAssignments<Key extends string, Value>(
  keys: readonly Key[],
  values: readonly Value[],
): Array<Record<Key, Value>> {
  let assignments: Array<Partial<Record<Key, Value>>> = [{}]
  for (const key of keys) {
    assignments = assignments.flatMap((assignment) =>
      values.map((value) => ({ ...assignment, [key]: value })),
    )
  }
  return assignments as Array<Record<Key, Value>>
}

function interpretationKey(headline: string, summary: string) {
  return `${headline}\u0000${summary}`
}

function branchCoverage(
  expectedValues: Iterable<string>,
  observedValues: Set<string>,
) {
  const expected = [...expectedValues]
  return {
    expected: expected.length,
    observed: expected.filter((value) => observedValues.has(value)).length,
    uncovered: expected.filter((value) => !observedValues.has(value)).sort(),
  }
}

function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296
  }
}

function buildAiOccurrences() {
  const version = getCurrentAiGovernanceVersion()
  const archetypes = Object.keys(
    version.scoring.archetypeLabels,
  ) as AiArchetypeKey[]
  const axisKeys = Object.keys(version.schema.aiAxisLabels) as AiAxisKey[]
  const templates = buildAiAxisTemplates(
    axisKeys,
    version.scoring.archetypeProfiles,
  )
  const occurrences: RawRuntimeCopyOccurrence[] = []
  const observedArchetypes = new Set<AiArchetypeKey>()
  const riskLenses = new Set<RiskLens>()
  const paceModifiers = new Set<PaceModifier>()
  const geopoliticsModifiers = new Set<GeopoliticsModifier>()
  const strongestAxes = new Set<AiAxisKey>()
  const strongestAxisPairs = new Set<string>()

  for (const template of templates) {
    const archetypeScores = version.scoring.scoreArchetypes(template.axisScores)
    const orderedArchetypes = (Object.entries(archetypeScores) as Array<
      [AiArchetypeKey, number]
    >).sort((left, right) => right[1] - left[1])
    const archetypeKey = orderedArchetypes[0][0]
    const neighboringArchetypeKey = orderedArchetypes[1][0]
    const riskLens = version.scoring.getRiskLens(template.axisScores)
    const paceModifier = version.scoring.getPaceModifier(template.axisScores)
    const geopoliticsModifier = version.scoring.getGeopoliticsModifier(
      template.axisScores,
    )
    const strongest = getStrongestAiAxes(template.axisScores)
    observedArchetypes.add(archetypeKey)
    riskLenses.add(riskLens)
    paceModifiers.add(paceModifier)
    geopoliticsModifiers.add(geopoliticsModifier)
    strongest.forEach((axis) => strongestAxes.add(axis))
    strongestAxisPairs.add(
      [...strongest]
        .sort((left, right) => axisKeys.indexOf(left) - axisKeys.indexOf(right))
        .join(":"),
    )
    const inputs: AiInputProvenance = {
        kind: "ai-governance",
        bankVersion: version.bankVersion,
        scoringVersion: version.scoringVersion,
        locale: "en",
        localeCopyVersion: INSTRUMENT_COPY_VERSIONS.aiGovernance.en,
        templateId: template.id,
        archetypeKey,
        axisScores: template.axisScores,
        strongestAxes: strongest,
        riskLens,
        paceModifier,
        geopoliticsModifier,
    }
    const result: AiResult = {
        archetypeKey,
        archetypeLabel: version.scoring.archetypeLabels[archetypeKey],
        riskLens,
        paceModifier,
        geopoliticsModifier,
        axisScores: template.axisScores,
        archetypeScores,
        explanation: version.scoring.archetypeDescriptions[archetypeKey],
        neighboringArchetypeKey,
        neighboringArchetype:
          version.scoring.archetypeLabels[neighboringArchetypeKey],
    }
    const deepDive = buildAiGovernanceDeepDive(
        result,
        version.scoring.archetypeProfiles,
        version.scoring.archetypeLabels,
    )
    const payoff = buildAiGovernancePayoff(result)
    const prefix = `ai:${archetypeKey}:${template.id}`
    const surface = "ai-governance-result:en" as const
    occurrences.push(
        {
          id: `${prefix}:archetype-label`,
          surface,
          block: "archetype-label",
          job: "definition",
          inputs,
          text: result.archetypeLabel,
        },
        {
          id: `${prefix}:summary`,
          surface,
          block: "summary",
          job: "payoff",
          inputs,
          text: buildAiGovernanceSummary(
            archetypeKey,
            template.axisScores,
            riskLens,
            paceModifier,
            version.scoring.archetypeLabels,
          ),
        },
        {
          id: `${prefix}:archetype-description`,
          surface,
          block: "archetype-description",
          job: "definition",
          inputs,
          text: result.explanation,
        },
        {
          id: `${prefix}:governing-instinct`,
          surface,
          block: "governing-instinct",
          job: "payoff",
          inputs,
          text: deepDive.governingInstinct,
        },
        {
          id: `${prefix}:question-to-sit-with`,
          surface,
          block: "question-to-sit-with",
          job: "tradeoff",
          inputs,
          text: deepDive.questionToSitWith,
        },
        {
          id: `${prefix}:primary-axis-summary`,
          surface,
          block: "primary-axis-summary",
          job: "evidence",
          inputs,
          text: getPrimaryAxisSummary(template.axisScores),
        },
        ...deepDive.policySignals.flatMap((signal, index) => [
          {
            id: `${prefix}:policy-signal:${index + 1}:title`,
            surface,
            block: "policy-signal:title",
            job: "definition" as const,
            inputs,
            text: signal.title,
          },
          {
            id: `${prefix}:policy-signal:${index + 1}:stance`,
            surface,
            block: "policy-signal:stance",
            job: "payoff" as const,
            inputs,
            text: signal.stance,
          },
          {
            id: `${prefix}:policy-signal:${index + 1}:explanation`,
            surface,
            block: "policy-signal:explanation",
            job: "mechanism" as const,
            inputs,
            text: signal.explanation,
          },
        ]),
        ...payoff.policyDebates.flatMap((debate, index) => [
          {
            id: `${prefix}:payoff-debate:${index + 1}:title`,
            surface,
            block: "payoff-debate:title",
            job: "definition" as const,
            inputs,
            text: debate.title,
          },
          {
            id: `${prefix}:payoff-debate:${index + 1}:question`,
            surface,
            block: "payoff-debate:question",
            job: "tradeoff" as const,
            inputs,
            text: debate.question,
          },
          {
            id: `${prefix}:payoff-debate:${index + 1}:text`,
            surface,
            block: "payoff-debate:text",
            job: "payoff" as const,
            inputs,
            text: debate.text,
          },
        ]),
        {
          id: `${prefix}:payoff-main-tension:title`,
          surface,
          block: "payoff-main-tension:title",
          job: "tradeoff",
          inputs,
          text: payoff.mainTension.title,
        },
        {
          id: `${prefix}:payoff-main-tension:text`,
          surface,
          block: "payoff-main-tension:text",
          job: "tradeoff",
          inputs,
          text: payoff.mainTension.text,
        },
        ...deepDive.internationalOrder.map((text, index) => ({
          id: `${prefix}:international-order:${index + 1}`,
          surface,
          block: "international-order",
          job: "mechanism" as const,
          inputs,
          text,
        })),
        ...deepDive.tensions.flatMap((tension, index) => [
          {
            id: `${prefix}:tension:${index + 1}:title`,
            surface,
            block: "tension:title",
            job: "tradeoff" as const,
            inputs,
            text: tension.title,
          },
          {
            id: `${prefix}:tension:${index + 1}:text`,
            surface,
            block: "tension:text",
            job: "tradeoff" as const,
            inputs,
            text: tension.text,
          },
        ]),
        {
          id: `${prefix}:comparison:nearest`,
          surface,
          block: "comparison:nearest",
          job: "mechanism",
          inputs,
          text: deepDive.comparison.contrastText,
        },
        {
          id: `${prefix}:comparison:farthest`,
          surface,
          block: "comparison:farthest",
          job: "mechanism",
          inputs,
          text: deepDive.comparison.farthestText,
        },
        ...deepDive.evidenceShift.map((text, index) => ({
          id: `${prefix}:evidence-shift:${index + 1}`,
          surface,
          block: "evidence-shift",
          job: "evidence" as const,
          inputs,
          text,
        })),
        {
          id: `${prefix}:strongest-critique`,
          surface,
          block: "strongest-critique",
          job: "limitation",
          inputs,
          text: deepDive.strongestCritique,
        },
        ...getAxisCards(template.axisScores).map((card) => ({
          id: `${prefix}:axis:${card.axis}`,
          surface,
          block: "axis-description",
          job: "definition" as const,
          inputs,
          text: card.description,
        })),
      )

    const metadataTitle = `${result.archetypeLabel} result | AI Governance Compass`
    const metadataDescription = `Shared AI Governance Compass result: ${deepDive.governingInstinct}`
    occurrences.push(
      {
        id: `${prefix}:open-graph:title`,
        surface: "ai-governance-open-graph:en",
        block: "title",
        job: "payoff",
        inputs,
        text: metadataTitle,
      },
      {
        id: `${prefix}:open-graph:description`,
        surface: "ai-governance-open-graph:en",
        block: "description",
        job: "payoff",
        inputs,
        text: metadataDescription,
      },
      {
        id: `${prefix}:share:title`,
        surface: "ai-governance-share:en",
        block: "title",
        job: "payoff",
        inputs,
        text: `AI Governance Compass: ${result.archetypeLabel}`,
      },
      {
        id: `${prefix}:share:text`,
        surface: "ai-governance-share:en",
        block: "text",
        job: "payoff",
        inputs,
        text: `My AI governance profile: ${result.archetypeLabel} · ${riskLens} · ${paceModifier} · ${geopoliticsModifier}`,
      },
    )
  }

  if (observedArchetypes.size !== archetypes.length) {
    const missing = archetypes.filter((key) => !observedArchetypes.has(key))
    throw new Error(`AI runtime fixture did not reach archetypes: ${missing.join(", ")}.`)
  }

  return {
    occurrences,
    coverage: {
      bankVersion: version.bankVersion,
      scoringVersion: version.scoringVersion,
      archetypes: uniqueSorted([...observedArchetypes]) as AiArchetypeKey[],
      riskLenses: uniqueSorted([...riskLenses]) as RiskLens[],
      paceModifiers: uniqueSorted([...paceModifiers]) as PaceModifier[],
      geopoliticsModifiers: uniqueSorted(
        [...geopoliticsModifiers],
      ) as GeopoliticsModifier[],
      strongestAxes: uniqueSorted([...strongestAxes]) as AiAxisKey[],
      strongestAxisPairs: uniqueSorted([...strongestAxisPairs]),
    },
  }
}

function buildAiAxisTemplates(
  axisKeys: AiAxisKey[],
  archetypeProfiles: Record<
    AiArchetypeKey,
    Partial<Record<AiAxisKey, number>>
  >,
) {
  const templates: Array<{ id: string; axisScores: AiAxisScores }> = []

  templates.push({ id: "midpoint", axisScores: midpointAiScores(axisKeys) })

  for (const [archetypeKey, profile] of Object.entries(archetypeProfiles) as Array<
    [AiArchetypeKey, Partial<Record<AiAxisKey, number>>]
  >) {
    const axisScores = midpointAiScores(axisKeys)
    for (const axis of axisKeys) {
      axisScores[axis] = Number(
        Math.max(1, Math.min(7, 4 + (profile[axis] ?? 0) * 2.75)).toFixed(2),
      )
    }
    templates.push({ id: `archetype:${archetypeKey}`, axisScores })
  }

  // Every unordered pair is exercised at every endpoint orientation. This
  // covers the strongest-axis summary and the conditional tension rules.
  for (let first = 0; first < axisKeys.length; first += 1) {
    for (let second = first + 1; second < axisKeys.length; second += 1) {
      for (const firstValue of [1, 7]) {
        for (const secondValue of [1, 7]) {
          const axisScores = midpointAiScores(axisKeys)
          axisScores[axisKeys[first]] = firstValue
          axisScores[axisKeys[second]] = secondValue
          templates.push({
            id: `strongest:${axisKeys[first]}:${firstValue}:${axisKeys[second]}:${secondValue}`,
            axisScores,
          })
        }
      }
    }
  }

  // Risk and pace categories remain visible even when neither axis is one of
  // the two strongest signals.
  const categoryValues = [3, 4, 6]
  for (const riskValue of categoryValues) {
    for (const paceValue of categoryValues) {
      const axisScores = midpointAiScores(axisKeys)
      axisScores.riskHorizon = riskValue
      axisScores.deploymentPace = paceValue
      axisScores.oversight = 7
      axisScores.geopolitics = 1
      templates.push({
        id: `risk-pace:${riskValue}:${paceValue}`,
        axisScores,
      })
    }
  }

  return templates
}

function midpointAiScores(axisKeys: AiAxisKey[]): AiAxisScores {
  return Object.fromEntries(axisKeys.map((axis) => [axis, 4])) as AiAxisScores
}

function getStrongestAiAxes(axisScores: AiAxisScores): [AiAxisKey, AiAxisKey] {
  return (Object.entries(axisScores) as Array<[AiAxisKey, number]>)
    .sort((left, right) => Math.abs(right[1] - 4) - Math.abs(left[1] - 4))
    .slice(0, 2)
    .map(([axis]) => axis) as [AiAxisKey, AiAxisKey]
}

function buildSocialOccurrences(
  foundationOccurrences: RawRuntimeCopyOccurrence[],
) {
  const occurrences: RawRuntimeCopyOccurrence[] = []
  const summaries = foundationOccurrences.filter(
    (occurrence) =>
      occurrence.block === "summary" &&
      occurrence.inputs.kind === "foundation",
  )

  for (const summary of summaries) {
    if (summary.inputs.kind !== "foundation") continue
    const inputs = summary.inputs
    const posture = postureFromStrategyModifier(
      inputs.strategyModifier,
      inputs.dimensionScores.restraint,
    )
    const primaryLens = lensFromFamily(inputs.familyKey)
    const runnerUpLens = lensFromFamily(inputs.runnerUpKey)
    const code = inputs.state === "lowDifferentiation"
      ? `${primaryLens}/${runnerUpLens}${posture}`
      : `${primaryLens}${posture}`
    const archetype = getArchetypeByCode(code)
    if (!archetype) {
      throw new Error(`Unable to resolve social-copy archetype: ${code}.`)
    }

    const prefix = `social:${inputs.locale}:${inputs.caseId}`
    if (inputs.locale === "zh-Hans") {
      const copy = buildZhHansFoundationResultSocialCopy(archetype, summary.text)
      occurrences.push(
        {
          id: `${prefix}:open-graph:title`,
          surface: "foundation-open-graph:zh-Hans",
          block: "title",
          job: "payoff",
          inputs,
          text: copy.title,
        },
        {
          id: `${prefix}:open-graph:description`,
          surface: "foundation-open-graph:zh-Hans",
          block: "description",
          job: "payoff",
          inputs,
          text: copy.description,
        },
      )
      continue
    }

    const norm = normFromNormativeModifier(inputs.normativeModifier)
    const card = buildFoundationCardCopy(archetype, norm)
    const resultCopy = buildEnglishFoundationResultSocialCopy(archetype, norm)
    const profileCopy = buildEnglishProfileSocialCopy(archetype)
    occurrences.push(
      {
        id: `${prefix}:open-graph:title`,
        surface: "foundation-open-graph:en",
        block: "title",
        job: "payoff",
        inputs,
        text: resultCopy.title,
      },
      {
        id: `${prefix}:open-graph:description`,
        surface: "foundation-open-graph:en",
        block: "description",
        job: "payoff",
        inputs,
        text: resultCopy.description,
      },
      {
        id: `${prefix}:share-card:reading-code`,
        surface: "foundation-share-card:en",
        block: "reading-code",
        job: "definition",
        inputs,
        text: card.readingCode,
      },
      {
        id: `${prefix}:share-card:name`,
        surface: "foundation-share-card:en",
        block: "name",
        job: "payoff",
        inputs,
        text: card.name,
      },
      {
        id: `${prefix}:share-card:gloss`,
        surface: "foundation-share-card:en",
        block: "gloss",
        job: "definition",
        inputs,
        text: card.gloss,
      },
      {
        id: `${prefix}:profile-open-graph:title`,
        surface: "profile-open-graph:en",
        block: "title",
        job: "payoff",
        inputs,
        text: profileCopy.title,
      },
      {
        id: `${prefix}:profile-open-graph:description`,
        surface: "profile-open-graph:en",
        block: "description",
        job: "payoff",
        inputs,
        text: profileCopy.description,
      },
    )
  }

  return {
    occurrences,
    coverage: {
      surfaces: [
        "foundation-open-graph:en",
        "foundation-open-graph:zh-Hans",
        "foundation-share-card:en",
        "profile-open-graph:en",
      ] as const,
    },
  }
}

function buildProfileOccurrences(
  socialOccurrences: RawRuntimeCopyOccurrence[],
  moduleOccurrences: RawRuntimeCopyOccurrence[],
  aiOccurrences: RawRuntimeCopyOccurrence[],
) {
  const foundationBlockMap: Record<string, string> = {
    name: "saved-foundation:name",
    gloss: "saved-foundation:gloss",
    "reading-code": "saved-foundation:reading-code",
  }
  const moduleBlockMap: Record<string, string> = {
    headline: "saved-module:headline",
    summary: "saved-module:summary",
    "lane-summary": "saved-module:lane-summary",
    "scope:measures": "saved-module:measures",
    "scope:does-not-claim": "saved-module:does-not-claim",
  }
  const aiBlockMap: Record<string, string> = {
    "archetype-label": "saved-ai:archetype-label",
    summary: "saved-ai:summary",
  }
  const layerBlocks = [
    ...socialOccurrences
      .filter((occurrence) => occurrence.surface === "foundation-share-card:en")
      .map((occurrence) => ({
        occurrence,
        profileBlock: foundationBlockMap[occurrence.block],
      })),
    ...moduleOccurrences
      .filter((occurrence) => Boolean(moduleBlockMap[occurrence.block]))
      .map((occurrence) => ({
        occurrence,
        profileBlock: moduleBlockMap[occurrence.block],
      })),
    ...aiOccurrences
      .filter(
        (occurrence) =>
          occurrence.surface === "ai-governance-result:en" &&
          Boolean(aiBlockMap[occurrence.block]),
      )
      .map((occurrence) => ({
        occurrence,
        profileBlock: aiBlockMap[occurrence.block],
      })),
  ]
  const occurrences = layerBlocks.map(
    ({ occurrence, profileBlock }): RawRuntimeCopyOccurrence => ({
      ...occurrence,
      id: `profile:${occurrence.id}`,
      surface: "profile:en",
      block: profileBlock,
    }),
  )

  for (const moduleDefinition of modules) {
    const source = moduleOccurrences.find(
      (occurrence) =>
        occurrence.inputs.kind === "module" &&
        occurrence.inputs.slug === moduleDefinition.slug,
    )
    if (!source) {
      throw new Error(
        `Profile runtime fixture has no module provenance for ${moduleDefinition.slug}.`,
      )
    }
    occurrences.push(
      {
        ...source,
        id: `profile:module:${moduleDefinition.slug}:title`,
        surface: "profile:en",
        block: "saved-module:title",
        text: moduleDefinition.shortTitle,
      },
      {
        ...source,
        id: `profile:module:${moduleDefinition.slug}:subtitle`,
        surface: "profile:en",
        block: "saved-module:subtitle",
        text: moduleDefinition.subtitle,
      },
    )
  }

  return {
    occurrences,
    coverage: {
      declaredStates: [
        "local:foundation-resolved",
        "local:foundation-unavailable",
        "shared:foundation-resolved",
        "shared:foundation-unavailable",
        "focus-area:none",
        "focus-area:security",
        "focus-area:technology",
        "focus-area:security+technology",
        "ai:none",
        "ai:present",
      ],
      instantiatedStateCombinations: 0 as const,
      reusedBlocks: [...PROFILE_BLOCKS],
      compositionRule:
        "Profile reuses each saved layer's canonical visible blocks and does not synthesize new prose across layers." as const,
      stateLimit:
        "The fixture inventories reused saved-layer strings only. Profile state combinations and static empty or unavailable copy require component tests and human review." as const,
    },
  }
}

function validateSurfaceManifest(
  occurrences: RawRuntimeCopyOccurrence[],
): RuntimeCopyManifestValidation {
  const manifestsBySurface = new Map<
    RuntimeCopySurface,
    RuntimeCopySurfaceManifest[]
  >()
  for (const manifest of RUNTIME_COPY_SURFACE_MANIFEST) {
    const entries = manifestsBySurface.get(manifest.surface) ?? []
    entries.push(manifest)
    manifestsBySurface.set(manifest.surface, entries)
  }

  const observedBySurface = new Map<RuntimeCopySurface, Set<string>>()
  for (const occurrence of occurrences) {
    const blocks = observedBySurface.get(occurrence.surface) ?? new Set<string>()
    blocks.add(occurrence.block)
    observedBySurface.set(occurrence.surface, blocks)
  }

  const missingDeclaredBlocks: string[] = []
  const undeclaredObservedBlocks: string[] = []
  for (const manifest of RUNTIME_COPY_SURFACE_MANIFEST) {
    const observed = observedBySurface.get(manifest.surface) ?? new Set<string>()
    for (const block of manifest.blocks) {
      if (!observed.has(block)) {
        missingDeclaredBlocks.push(`${manifest.surface}:${block}`)
      }
    }
    const declared = new Set(manifest.blocks)
    for (const block of observed) {
      if (!declared.has(block)) {
        undeclaredObservedBlocks.push(`${manifest.surface}:${block}`)
      }
    }
  }

  for (const [surface, blocks] of observedBySurface) {
    if (manifestsBySurface.has(surface)) continue
    for (const block of blocks) {
      undeclaredObservedBlocks.push(`${surface}:${block}`)
    }
  }

  const duplicateManifestSurfaces = [...manifestsBySurface.entries()]
    .filter(([, entries]) => entries.length > 1)
    .map(([surface]) => surface)
    .sort()

  missingDeclaredBlocks.sort()
  undeclaredObservedBlocks.sort()
  return {
    passes:
      missingDeclaredBlocks.length === 0 &&
      undeclaredObservedBlocks.length === 0 &&
      duplicateManifestSurfaces.length === 0,
    missingDeclaredBlocks,
    undeclaredObservedBlocks,
    duplicateManifestSurfaces,
  }
}

function deduplicateOccurrences(
  occurrences: RawRuntimeCopyOccurrence[],
): RuntimeCopyFixtureRow[] {
  const occurrenceIds = new Set<string>()
  const byText = new Map<string, RuntimeCopyOccurrence[]>()

  for (const { text, ...occurrence } of occurrences) {
    if (!text.trim()) {
      throw new Error(`Runtime copy occurrence ${occurrence.id} is empty.`)
    }
    if (occurrenceIds.has(occurrence.id)) {
      throw new Error(`Duplicate runtime copy occurrence id: ${occurrence.id}.`)
    }
    occurrenceIds.add(occurrence.id)
    const existing = byText.get(text) ?? []
    existing.push(occurrence)
    byText.set(text, existing)
  }

  const rowIds = new Map<string, string>()
  return [...byText.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([text, rowOccurrences]) => {
      const id = `runtime-copy-${stableTextHash(text)}`
      const conflictingText = rowIds.get(id)
      if (conflictingText && conflictingText !== text) {
        throw new Error(`Runtime copy fixture id collision: ${id}.`)
      }
      rowIds.set(id, text)
      const sortedOccurrences = [...rowOccurrences].sort((left, right) =>
        left.id.localeCompare(right.id),
      )
      return {
        id,
        text,
        surfaces: uniqueSorted(
          sortedOccurrences.map((occurrence) => occurrence.surface),
        ) as RuntimeCopySurface[],
        blocks: uniqueSorted(
          sortedOccurrences.map((occurrence) => occurrence.block),
        ),
        jobs: uniqueSorted(
          sortedOccurrences.map((occurrence) => occurrence.job),
        ) as RuntimeCopyJob[],
        occurrences: sortedOccurrences,
      }
    })
}

function stableTextHash(text: string) {
  let hash = 0x811c9dc5
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, "0")
}

function stableStringSeed(value: string) {
  return Number.parseInt(stableTextHash(value), 16)
}

function uniqueSorted<Value extends string>(values: Value[]): Value[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right))
}

function deduplicateBy<Value>(
  values: Value[],
  keyFor: (value: Value) => string,
) {
  const seen = new Set<string>()
  return values.filter((value) => {
    const key = keyFor(value)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
