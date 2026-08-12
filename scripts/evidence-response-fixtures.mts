#!/usr/bin/env node

/**
 * Deterministic response-style evidence for every supported instrument tuple.
 *
 * This module is intentionally side-effect free when imported. It reads the
 * checked-in banks through their version registries, runs only local scoring
 * code, and returns JSON-safe data. When invoked directly it prints that data
 * to stdout; it never writes a bank, calibration, fixture, artifact, or
 * database record.
 */

import { createHash } from "node:crypto"
import { pathToFileURL } from "node:url"
import { resolve } from "node:path"
import foundationScoringV1Json from "@/content/instrument/foundation.scoring.v1.json" with {
  type: "json",
}
import foundationV2Json from "@/content/instrument/foundation.v2.json" with {
  type: "json",
}
import { getSeededOptionOrder } from "@/lib/option-order"
import {
  getScoringVersion,
  type FoundationScoringVersion,
} from "@/lib/scoring/versions"
import { SUPPORTED_MODULE_VERSIONS } from "@/lib/modules/versions"
import { SUPPORTED_AI_GOVERNANCE_VERSIONS } from "@/lib/ai-governance-versions"
import type {
  AiAnswers,
  AiAxisKey,
  AiLikertQuestion,
  AiQuizMode,
  AiRankedChoiceAnswer,
  AiScenarioOption,
  AiScenarioQuestion,
} from "@/lib/ai-governance-types"
import type {
  ModuleAnswers,
  ModuleDefinition,
  ModuleQuestion,
  ModuleSlug,
} from "@/lib/modules/types"
import type {
  Answers,
  DimensionKey,
  QuizMode,
  RankedChoiceAnswer,
} from "@/lib/types"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { EVIDENCE_ARTIFACT_SCHEMA_VERSION } from "@/scripts/evidence-utils.mts"

export const EVIDENCE_RANDOM_SEED = 20260728
export const EVIDENCE_STYLE_PRESENTATION_SEED =
  "evidence-response-style-order-v1"
export const EVIDENCE_INVARIANCE_PRESENTATION_SEEDS = [
  "evidence-semantic-order-a-v1",
  "evidence-semantic-order-b-v1",
] as const

const MODES = ["standard", "analyst"] as const
const FOUNDATION_AXES: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

const RESPONSE_STYLES = [
  "all-minimum",
  "all-maximum",
  "midpoint",
  "always-first",
  "always-last",
  "alternating",
  "seeded-random-20260728",
] as const

type ResponseStyle = (typeof RESPONSE_STYLES)[number]
type Direction = "low" | "high"
type SecondaryChoiceStrategy =
  | "primary-only"
  | "reinforcing"
  | "competing"

export type JsonPrimitive = string | number | boolean | null
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue }
export type JsonObject = { [key: string]: JsonValue }

export type EvidenceFixtureRecord = {
  name: string
  kind: "response-style" | "axis-direction" | "secondary-choice"
  axis?: string
  direction?: Direction
  answeredItems: number
  answersDigest: string
  secondaryChoiceConstruction?: {
    strategy: SecondaryChoiceStrategy
    eligibleItemCount: number
    secondaryFieldCount: number
    skippedSecondaryItems: Array<{
      itemId: string
      reason:
        | "no-positively-aligned-candidate"
        | "no-negatively-opposed-candidate"
    }>
    selections: Array<{
      itemId: string
      primaryOptionId: string
      secondaryOptionId?: string
      similarityReview: {
        metric: "centered-cosine"
        candidateMinimum: number
        candidateMaximum: number
        hasAlignedAndOpposedCandidates: boolean
        selectedSecondarySimilarity?: number
        selectedRelationship?: "aligned" | "opposed"
      }
    }>
  }
  result: JsonObject
}

export type EvidenceResponseCohort = {
  key: string
  instrument: "foundation" | ModuleSlug | "ai-governance"
  bankVersion: number | null
  scoringVersion: number
  legacy: boolean
  mode: QuizMode
  itemCount: number
  fixtures: EvidenceFixtureRecord[]
}

export type EvidencePresentationInvariance = {
  cohortKey: string
  instrument: EvidenceResponseCohort["instrument"]
  bankVersion: number | null
  scoringVersion: number
  legacy: boolean
  mode: QuizMode
  seeds: [string, string]
  presentationQuestionCount: number
  changedPresentationQuestions: number
  semanticAnswersDigests: [string, string]
  semanticSecondaryChoiceCounts: [number, number]
  resultContractDigests: [string, string]
  scenarioSequences?: [string[], string[]]
  scenarioSequenceDigests?: [string, string]
}

export type EvidenceResponseFixtureReport = {
  schemaVersion: typeof EVIDENCE_ARTIFACT_SCHEMA_VERSION
  randomSeed: number
  stylePresentationSeed: string
  fixtureDefinitions: JsonObject
  cohorts: EvidenceResponseCohort[]
  presentationInvariance: EvidencePresentationInvariance[]
}

type SignalOption = {
  id: string
  signals: Record<string, number>
  pinned?: "last"
}

type FoundationEvidenceQuestion = {
  id: string
  kind: "likert" | "tradeoff" | "miniCase"
  modes?: QuizMode[]
  dimension?: string
  validationScale?: string
  reverse?: boolean
  allowSecondChoiceInAnalyst?: boolean
  options?: SignalOption[]
}

type FoundationCohort = {
  instrument: "foundation"
  bankVersion: number | null
  scoringVersion: number
  legacy: boolean
  mode: QuizMode
  questions: FoundationEvidenceQuestion[]
  scorer: FoundationScoringVersion
}

type ModuleRuntime = (typeof SUPPORTED_MODULE_VERSIONS)[ModuleSlug][number]["runtime"]

type ModuleCohort = {
  instrument: ModuleSlug
  bankVersion: number
  scoringVersion: number
  legacy: boolean
  mode: QuizMode
  definition: ModuleDefinition
  runtime: ModuleRuntime
  questions: ModuleQuestion[]
}

type AiVersion = (typeof SUPPORTED_AI_GOVERNANCE_VERSIONS)[number]

type AiCohort = {
  instrument: "ai-governance"
  bankVersion: number
  scoringVersion: number
  legacy: boolean
  mode: AiQuizMode
  version: AiVersion
  likertQuestions: AiLikertQuestion[]
  rootScenarios: AiScenarioQuestion[]
}

/**
 * Build the complete deterministic response-style and presentation-invariance
 * report. A fresh RNG is initialized for each cohort, so changes in one bank
 * cannot shift the fixture stream for another bank.
 */
export function buildEvidenceResponseFixtureReport(): EvidenceResponseFixtureReport {
  const cohorts: EvidenceResponseCohort[] = []
  const presentationInvariance: EvidencePresentationInvariance[] = []

  for (const cohort of getFoundationCohorts()) {
    cohorts.push(buildFoundationEvidenceCohort(cohort))
    presentationInvariance.push(buildFoundationInvariance(cohort))
  }

  for (const cohort of getModuleCohorts()) {
    cohorts.push(buildModuleEvidenceCohort(cohort))
    presentationInvariance.push(buildModuleInvariance(cohort))
  }

  for (const cohort of getAiCohorts()) {
    cohorts.push(buildAiEvidenceCohort(cohort))
    presentationInvariance.push(buildAiInvariance(cohort))
  }

  cohorts.sort(compareCohorts)
  presentationInvariance.sort((left, right) =>
    compareText(left.cohortKey, right.cohortKey)
  )

  return {
    schemaVersion: EVIDENCE_ARTIFACT_SCHEMA_VERSION,
    randomSeed: EVIDENCE_RANDOM_SEED,
    stylePresentationSeed: EVIDENCE_STYLE_PRESENTATION_SEED,
    fixtureDefinitions: canonicalObject({
      responseStyleAndAxisDirection:
        "Response-style and axis-direction fixtures use primary choices only.",
      analystSecondaryPrimaryOnly:
        "For every eligible analyst item, center complete option vectors at the instrument midpoint. Choose the closest-to-midpoint primary among options that have both a positively aligned and negatively opposed cosine-similarity partner; if no option has both signs, choose the closest-to-midpoint option with a positively aligned partner. Ties follow authored option order. Omit the secondary/backup field.",
      analystSecondaryReinforcing:
        "Use the same primary, then choose its distinct positively aligned option with the greatest centered-vector cosine similarity as the reinforcing secondary/backup. Ties follow authored option order; an item with no positive partner is disclosed and omitted.",
      analystSecondaryCompeting:
        "Use the same primary, then choose its distinct negatively opposed option with the lowest centered-vector cosine similarity as the competing secondary/backup. Ties follow authored option order; an item with no negative partner is disclosed and omitted rather than mislabeled as opposition.",
      analystSecondarySharedRules:
        "Only valid, distinct semantic option IDs are used. Missing signal components use the instrument midpoint. Every secondary-bearing fixture must retain at least one qualified secondary or construction fails closed. Fixed-seed presentation checks preserve pinned-last options but never change the selected semantic primary/secondary IDs. Standard fixtures remain primary-only.",
      "all-minimum":
        "Every scored scalar is set to its semantic minimum after reverse coding; every nominal choice minimizes its combined centered option signal.",
      "all-maximum":
        "Every scored scalar is set to its semantic maximum after reverse coding; every nominal choice maximizes its combined centered option signal.",
      midpoint:
        "Every scalar is set to 4; every nominal choice has the smallest squared distance from the instrument midpoint.",
      "always-first":
        "Scalars are set to 4 and every nominal choice uses the first position under the fixed style presentation seed.",
      "always-last":
        "Scalars are set to 4 and every nominal choice uses the last position under the fixed style presentation seed.",
      alternating:
        "Scalars alternate semantic minimum and maximum; nominal choices alternate first and last positions under the fixed style presentation seed.",
      "seeded-random-20260728":
        "Scalars and presented choice positions are sampled independently from a deterministic uniform stream reset to seed 20260728 for each cohort.",
      "axis-direction":
        "The named axis is set low or high after reverse coding and by option signal; other scalar axes stay at 4 and other choices use the closest-to-midpoint option.",
      "presentation-invariance":
        "Two seeds must change at least one presented option order while preserving the same semantic answer IDs and score-bearing result.",
    }),
    cohorts,
    presentationInvariance,
  }
}

function getFoundationCohorts(): FoundationCohort[] {
  const legacyScorer = requiredFoundationScorer("v1")
  const currentScorer = requiredFoundationScorer("v2")
  const legacyItems =
    foundationScoringV1Json.items as unknown as FoundationEvidenceQuestion[]
  const currentItems =
    foundationV2Json.items as unknown as FoundationEvidenceQuestion[]
  const cohorts: FoundationCohort[] = []

  for (const mode of MODES) {
    cohorts.push({
      instrument: "foundation",
      bankVersion: null,
      scoringVersion: 1,
      legacy: true,
      mode,
      questions:
        mode === "standard"
          ? legacyItems.filter((question) => !question.id.startsWith("an_"))
          : [...legacyItems],
      scorer: legacyScorer,
    })
    cohorts.push({
      instrument: "foundation",
      bankVersion: Number(foundationV2Json.instrumentVersion),
      scoringVersion: 2,
      legacy: false,
      mode,
      questions:
        mode === "standard"
          ? currentItems.filter((question) =>
              question.modes?.includes("standard")
            )
          : currentItems.filter((question) =>
              question.modes?.includes("analyst")
            ),
      scorer: currentScorer,
    })
  }

  return cohorts
}

function getModuleCohorts(): ModuleCohort[] {
  const cohorts: ModuleCohort[] = []

  for (const slug of ["security", "technology"] as const) {
    const versions = SUPPORTED_MODULE_VERSIONS[slug]
    const currentBankVersion = Math.max(
      ...versions.map((version) => version.bankVersion),
    )

    for (const version of versions) {
      for (const mode of MODES) {
        cohorts.push({
          instrument: slug,
          bankVersion: version.bankVersion,
          scoringVersion: version.scoringVersion,
          legacy: version.bankVersion !== currentBankVersion,
          mode,
          definition: version.definition,
          runtime: version.runtime,
          questions: version.runtime.getModuleQuestions(
            version.definition,
            mode,
          ),
        })
      }
    }
  }

  return cohorts
}

function getAiCohorts(): AiCohort[] {
  const cohorts: AiCohort[] = []
  const currentBankVersion = Math.max(
    ...SUPPORTED_AI_GOVERNANCE_VERSIONS.map(
      (version) => version.bankVersion,
    ),
  )

  for (const version of SUPPORTED_AI_GOVERNANCE_VERSIONS) {
    for (const mode of MODES) {
      cohorts.push({
        instrument: "ai-governance",
        bankVersion: version.bankVersion,
        scoringVersion: version.scoringVersion,
        legacy: version.bankVersion !== currentBankVersion,
        mode,
        version,
        likertQuestions: version.schema.getAiCoreQuestions(mode),
        rootScenarios: version.schema
          .getAiScenarioOrder(mode)
          .map((id) => version.schema.aiScenarioQuestions[id])
          .filter(
            (scenario): scenario is AiScenarioQuestion => Boolean(scenario),
          ),
      })
    }
  }

  return cohorts
}

function buildFoundationEvidenceCohort(
  cohort: FoundationCohort,
): EvidenceResponseCohort {
  const fixtures = RESPONSE_STYLES.map((style) => {
    const answers = buildFoundationStyleAnswers(
      cohort.questions,
      style,
    )
    return responseFixture(
      style,
      answers,
      foundationResultContract(
        cohort.scorer.generateResult(answers, cohort.mode),
      ),
    )
  })

  if (cohort.mode === "analyst") {
    for (const strategy of [
      "primary-only",
      "reinforcing",
      "competing",
    ] as const) {
      const built = buildFoundationSecondaryChoiceAnswers(
        cohort.questions,
        strategy,
      )
      if (built.construction.eligibleItemCount > 0) {
        fixtures.push(
          secondaryChoiceFixture(
            strategy,
            built.answers,
            foundationResultContract(
              cohort.scorer.generateResult(built.answers, cohort.mode),
            ),
            built.construction,
          ),
        )
      }
    }
  }

  for (const axis of FOUNDATION_AXES) {
    for (const direction of ["low", "high"] as const) {
      const answers = buildFoundationAxisAnswers(
        cohort.questions,
        axis,
        direction,
      )
      fixtures.push(
        axisFixture(
          axis,
          direction,
          answers,
          foundationResultContract(
            cohort.scorer.generateResult(answers, cohort.mode),
          ),
        ),
      )
    }
  }

  fixtures.sort(compareFixtures)
  return {
    key: cohortKey(cohort),
    instrument: cohort.instrument,
    bankVersion: cohort.bankVersion,
    scoringVersion: cohort.scoringVersion,
    legacy: cohort.legacy,
    mode: cohort.mode,
    itemCount: cohort.questions.length,
    fixtures,
  }
}

function buildModuleEvidenceCohort(
  cohort: ModuleCohort,
): EvidenceResponseCohort {
  const axes = cohort.definition.axes.map((axis) => axis.key)
  const fixtures = RESPONSE_STYLES.map((style) => {
    const answers = buildModuleStyleAnswers(
      cohort.questions,
      axes,
      style,
    )
    return responseFixture(
      style,
      answers,
      moduleResultContract(cohort, answers),
    )
  })

  if (cohort.mode === "analyst") {
    for (const strategy of [
      "primary-only",
      "reinforcing",
      "competing",
    ] as const) {
      const built = buildModuleSecondaryChoiceAnswers(
        cohort.questions,
        axes,
        strategy,
      )
      if (built.construction.eligibleItemCount > 0) {
        fixtures.push(
          secondaryChoiceFixture(
            strategy,
            built.answers,
            moduleResultContract(cohort, built.answers),
            built.construction,
          ),
        )
      }
    }
  }

  for (const axis of axes) {
    for (const direction of ["low", "high"] as const) {
      const answers = buildModuleAxisAnswers(
        cohort.questions,
        axes,
        axis,
        direction,
      )
      fixtures.push(
        axisFixture(
          axis,
          direction,
          answers,
          moduleResultContract(cohort, answers),
        ),
      )
    }
  }

  fixtures.sort(compareFixtures)
  return {
    key: cohortKey(cohort),
    instrument: cohort.instrument,
    bankVersion: cohort.bankVersion,
    scoringVersion: cohort.scoringVersion,
    legacy: cohort.legacy,
    mode: cohort.mode,
    itemCount: cohort.questions.length,
    fixtures,
  }
}

function buildAiEvidenceCohort(
  cohort: AiCohort,
): EvidenceResponseCohort {
  const axes = Object.keys(cohort.version.schema.aiAxisLabels) as AiAxisKey[]
  const fixtures = RESPONSE_STYLES.map((style) => {
    const answers = buildAiStyleAnswers(cohort, axes, style)
    return responseFixture(
      style,
      answers,
      aiResultContract(
        cohort.version.scoring.generateAiGovernanceResult(
          answers,
          cohort.mode,
        ),
      ),
    )
  })

  if (cohort.mode === "analyst") {
    for (const strategy of [
      "primary-only",
      "reinforcing",
      "competing",
    ] as const) {
      const built = buildAiSecondaryChoiceAnswers(
        cohort,
        axes,
        strategy,
      )
      if (built.construction.eligibleItemCount > 0) {
        fixtures.push(
          secondaryChoiceFixture(
            strategy,
            built.answers,
            aiResultContract(
              cohort.version.scoring.generateAiGovernanceResult(
                built.answers,
                cohort.mode,
              ),
            ),
            built.construction,
          ),
        )
      }
    }
  }

  for (const axis of axes) {
    for (const direction of ["low", "high"] as const) {
      const answers = buildAiAxisAnswers(
        cohort,
        axes,
        axis,
        direction,
      )
      fixtures.push(
        axisFixture(
          axis,
          direction,
          answers,
          aiResultContract(
            cohort.version.scoring.generateAiGovernanceResult(
              answers,
              cohort.mode,
            ),
          ),
        ),
      )
    }
  }

  fixtures.sort(compareFixtures)
  return {
    key: cohortKey(cohort),
    instrument: cohort.instrument,
    bankVersion: cohort.bankVersion,
    scoringVersion: cohort.scoringVersion,
    legacy: cohort.legacy,
    mode: cohort.mode,
    itemCount:
      cohort.likertQuestions.length + cohort.rootScenarios.length,
    fixtures,
  }
}

function buildFoundationStyleAnswers(
  questions: FoundationEvidenceQuestion[],
  style: ResponseStyle,
): Answers {
  const answers: Answers = {}
  const random = makeRng(EVIDENCE_RANDOM_SEED)
  let scalarIndex = 0
  let choiceIndex = 0

  for (const question of questions) {
    if (question.kind === "likert") {
      answers[question.id] = responseStyleScalar(
        style,
        Boolean(question.reverse),
        scalarIndex,
        random,
      )
      scalarIndex += 1
      continue
    }

    const options = question.options ?? []
    if (options.length === 0) continue
    const selected = responseStyleOption({
      style,
      options,
      axes: FOUNDATION_AXES,
      midpoint: 4,
      questionId: question.id,
      choiceIndex,
      random,
    })
    answers[question.id] = selected.id
    choiceIndex += 1
  }

  return answers
}

function buildFoundationAxisAnswers(
  questions: FoundationEvidenceQuestion[],
  axis: DimensionKey,
  direction: Direction,
): Answers {
  const answers: Answers = {}

  for (const question of questions) {
    if (question.kind === "likert") {
      answers[question.id] =
        question.dimension === axis
          ? semanticScalar(direction, Boolean(question.reverse))
          : 4
      continue
    }

    const options = question.options ?? []
    if (options.length === 0) continue
    answers[question.id] = chooseAxisOption(
      options,
      axis,
      direction,
      4,
      true,
    ).id
  }

  return answers
}

function buildModuleStyleAnswers(
  questions: ModuleQuestion[],
  axes: readonly string[],
  style: ResponseStyle,
): ModuleAnswers {
  const answers: ModuleAnswers = {}
  const random = makeRng(EVIDENCE_RANDOM_SEED)

  for (const [choiceIndex, question] of questions.entries()) {
    const options = moduleSignalOptions(question)
    const selected = responseStyleOption({
      style,
      options,
      axes,
      midpoint: 4,
      questionId: question.id,
      choiceIndex,
      random,
    })
    answers[question.id] = { primary: selected.id }
  }

  return answers
}

function buildModuleAxisAnswers(
  questions: ModuleQuestion[],
  axes: readonly string[],
  axis: string,
  direction: Direction,
): ModuleAnswers {
  return Object.fromEntries(
    questions.map((question) => {
      const options = moduleSignalOptions(question)
      const hasAxis = options.some((option) =>
        Object.hasOwn(option.signals, axis)
      )
      const selected = hasAxis
        ? chooseAxisOption(options, axis, direction, 4, false)
        : chooseNeutralOption(options, axes, 4)
      return [question.id, { primary: selected.id }]
    }),
  )
}

function buildAiStyleAnswers(
  cohort: AiCohort,
  axes: readonly string[],
  style: ResponseStyle,
): AiAnswers {
  const answers: AiAnswers = {}
  const random = makeRng(EVIDENCE_RANDOM_SEED)

  for (const [index, question] of cohort.likertQuestions.entries()) {
    answers[question.id] = responseStyleScalar(
      style,
      question.reverse,
      index,
      random,
    )
  }

  for (const [choiceIndex, scenario] of cohort.rootScenarios.entries()) {
    const options = aiSignalOptions(
      cohort.version.schema.getScenarioOptions(scenario, cohort.mode),
    )
    const selected = responseStyleOption({
      style,
      options,
      axes,
      midpoint: 0,
      questionId: scenario.id,
      choiceIndex,
      random,
    })
    answers[scenario.id] = selected.id as AiAnswers[string]
  }

  return answers
}

function buildAiAxisAnswers(
  cohort: AiCohort,
  axes: readonly string[],
  axis: AiAxisKey,
  direction: Direction,
): AiAnswers {
  const answers: AiAnswers = {}

  for (const question of cohort.likertQuestions) {
    answers[question.id] =
      question.axis === axis
        ? semanticScalar(direction, question.reverse)
        : 4
  }

  for (const scenario of cohort.rootScenarios) {
    const options = aiSignalOptions(
      cohort.version.schema.getScenarioOptions(scenario, cohort.mode),
    )
    const selected = options.some((option) =>
      Object.hasOwn(option.signals, axis)
    )
      ? chooseAxisOption(options, axis, direction, 0, false)
      : chooseNeutralOption(options, axes, 0)
    answers[scenario.id] = selected.id as AiAnswers[string]
  }

  return answers
}

type SecondaryChoiceConstruction = NonNullable<
  EvidenceFixtureRecord["secondaryChoiceConstruction"]
>

function buildFoundationSecondaryChoiceAnswers(
  questions: FoundationEvidenceQuestion[],
  strategy: SecondaryChoiceStrategy,
): {
  answers: Answers
  construction: SecondaryChoiceConstruction
} {
  const answers: Answers = {}
  const selections: SecondaryChoiceConstruction["selections"] = []

  for (const question of questions) {
    if (question.kind === "likert") {
      answers[question.id] = 4
      continue
    }

    const options = question.options ?? []
    if (options.length === 0) continue
    const primary = chooseNeutralOption(options, FOUNDATION_AXES, 4)
    if (!question.allowSecondChoiceInAnalyst) {
      answers[question.id] = primary.id
      continue
    }

    const selection = buildSecondaryChoiceSelection({
      questionId: question.id,
      options,
      axes: FOUNDATION_AXES,
      midpoint: 4,
      strategy,
    })
    answers[question.id] = {
      primary: selection.primaryOptionId,
      ...(selection.secondaryOptionId
        ? { secondary: selection.secondaryOptionId }
        : {}),
    } satisfies RankedChoiceAnswer
    selections.push(selection)
  }

  return {
    answers,
    construction: secondaryChoiceConstruction(strategy, selections),
  }
}

function buildModuleSecondaryChoiceAnswers(
  questions: ModuleQuestion[],
  axes: readonly string[],
  strategy: SecondaryChoiceStrategy,
): {
  answers: ModuleAnswers
  construction: SecondaryChoiceConstruction
} {
  const answers: ModuleAnswers = {}
  const selections: SecondaryChoiceConstruction["selections"] = []

  for (const question of questions) {
    const options = moduleSignalOptions(question)
    const primary = chooseNeutralOption(options, axes, 4)
    if (!question.allowSecondChoiceInAnalyst) {
      answers[question.id] = { primary: primary.id }
      continue
    }

    const selection = buildSecondaryChoiceSelection({
      questionId: question.id,
      options,
      axes,
      midpoint: 4,
      strategy,
    })
    answers[question.id] = {
      primary: selection.primaryOptionId,
      ...(selection.secondaryOptionId
        ? { secondary: selection.secondaryOptionId }
        : {}),
    }
    selections.push(selection)
  }

  return {
    answers,
    construction: secondaryChoiceConstruction(strategy, selections),
  }
}

function buildAiSecondaryChoiceAnswers(
  cohort: AiCohort,
  axes: readonly string[],
  strategy: SecondaryChoiceStrategy,
): {
  answers: AiAnswers
  construction: SecondaryChoiceConstruction
} {
  const answers: AiAnswers = {}
  const selections: SecondaryChoiceConstruction["selections"] = []

  for (const question of cohort.likertQuestions) {
    answers[question.id] = 4
  }

  let sequence = [...cohort.rootScenarios]
  while (true) {
    for (const scenario of sequence) {
      if (answers[scenario.id] !== undefined) continue
      const rawOptions = cohort.version.schema.getScenarioOptions(
        scenario,
        cohort.mode,
      )
      const options = aiSignalOptions(rawOptions)
      const primary = chooseNeutralOption(options, axes, 0)
      if (!scenario.allowBackupChoiceInAnalyst) {
        answers[scenario.id] = primary.id as AiAnswers[string]
        continue
      }

      const selection = buildSecondaryChoiceSelection({
        questionId: scenario.id,
        options,
        axes,
        midpoint: 0,
        strategy,
      })
      answers[scenario.id] = {
        primary: selection.primaryOptionId,
        ...(selection.secondaryOptionId
          ? { secondary: selection.secondaryOptionId }
          : {}),
      } as AiRankedChoiceAnswer
      selections.push(selection)
    }

    const nextSequence =
      cohort.version.scoring.getAiScenarioSequence(
        answers,
        cohort.mode,
      )
    if (
      nextSequence.every(
        (scenario) => answers[scenario.id] !== undefined,
      )
    ) {
      break
    }
    sequence = nextSequence
  }

  return {
    answers,
    construction: secondaryChoiceConstruction(strategy, selections),
  }
}

function buildSecondaryChoiceSelection({
  questionId,
  options,
  axes,
  midpoint,
  strategy,
}: {
  questionId: string
  options: SignalOption[]
  axes: readonly string[]
  midpoint: number
  strategy: SecondaryChoiceStrategy
}): SecondaryChoiceConstruction["selections"][number] {
  const plan = buildAlignedSecondaryChoicePlan(
    questionId,
    options,
    axes,
    midpoint,
  )
  const primary = plan.primary
  const presented = getSeededOptionOrder(
    options,
    EVIDENCE_STYLE_PRESENTATION_SEED,
    questionId,
  )
  requirePresentedId(presented, primary.id, questionId)
  requirePinnedOptionsLast(presented, questionId)

  if (strategy === "primary-only") {
    return {
      itemId: questionId,
      primaryOptionId: primary.id,
      similarityReview: plan.similarityReview,
    }
  }

  const selected =
    strategy === "reinforcing"
      ? plan.reinforcing
      : plan.competing
  if (!selected) {
    return {
      itemId: questionId,
      primaryOptionId: primary.id,
      similarityReview: plan.similarityReview,
    }
  }

  const secondary = selected.option
  requirePresentedId(presented, secondary.id, questionId)
  if (secondary.id === primary.id) {
    throw new Error(`${questionId} repeated its primary as secondary.`)
  }

  return {
    itemId: questionId,
    primaryOptionId: primary.id,
    secondaryOptionId: secondary.id,
    similarityReview: {
      ...plan.similarityReview,
      selectedSecondarySimilarity: roundSimilarity(
        selected.similarity,
      ),
      selectedRelationship:
        strategy === "reinforcing" ? "aligned" : "opposed",
    },
  }
}

const SECONDARY_SIMILARITY_EPSILON = 1e-9

type SecondarySimilarityCandidate = {
  option: SignalOption
  authoredIndex: number
  similarity: number
}

function buildAlignedSecondaryChoicePlan(
  questionId: string,
  options: SignalOption[],
  axes: readonly string[],
  midpoint: number,
) {
  const plans = options.flatMap((primary, primaryIndex) => {
    const candidates = options.flatMap((candidate, candidateIndex) => {
      if (candidateIndex === primaryIndex) return []
      const similarity = centeredCosineSimilarity(
        primary,
        candidate,
        axes,
        midpoint,
      )
      return similarity === null
        ? []
        : [{ option: candidate, authoredIndex: candidateIndex, similarity }]
    })
    const positive = candidates.filter(
      (candidate) =>
        candidate.similarity > SECONDARY_SIMILARITY_EPSILON,
    )
    const negative = candidates.filter(
      (candidate) =>
        candidate.similarity < -SECONDARY_SIMILARITY_EPSILON,
    )
    if (positive.length === 0) return []
    return [{
      primary,
      primaryIndex,
      primaryCenterDistance: centeredVectorSquaredNorm(
        primary,
        axes,
        midpoint,
      ),
      candidates,
      positive,
      negative,
      hasBothSigns: negative.length > 0,
    }]
  })
  const plansWithBothSigns = plans.filter((plan) => plan.hasBothSigns)
  const candidates =
    plansWithBothSigns.length > 0 ? plansWithBothSigns : plans
  const plan = [...candidates].sort(
    (left, right) =>
      left.primaryCenterDistance - right.primaryCenterDistance ||
      left.primaryIndex - right.primaryIndex,
  )[0]
  if (!plan) {
    throw new Error(
      `${questionId} has no primary with a positively aligned distinct option.`,
    )
  }

  const reinforcing = [...plan.positive].sort(
    (left, right) =>
      right.similarity - left.similarity ||
      left.authoredIndex - right.authoredIndex,
  )[0]
  const competing = [...plan.negative].sort(
    (left, right) =>
      left.similarity - right.similarity ||
      left.authoredIndex - right.authoredIndex,
  )[0]
  if (
    competing &&
    reinforcing.similarity <=
      competing.similarity + SECONDARY_SIMILARITY_EPSILON
  ) {
    throw new Error(
      `${questionId} did not produce strictly separated reinforcing and competing similarities.`,
    )
  }
  const similarityValues = plan.candidates.map(
    (candidate) => candidate.similarity,
  )

  return {
    primary: plan.primary,
    reinforcing,
    competing,
    similarityReview: {
      metric: "centered-cosine" as const,
      candidateMinimum: roundSimilarity(
        Math.min(...similarityValues),
      ),
      candidateMaximum: roundSimilarity(
        Math.max(...similarityValues),
      ),
      hasAlignedAndOpposedCandidates: plan.hasBothSigns,
    },
  }
}

function centeredCosineSimilarity(
  left: SignalOption,
  right: SignalOption,
  axes: readonly string[],
  midpoint: number,
): number | null {
  let dotProduct = 0
  let leftSquaredNorm = 0
  let rightSquaredNorm = 0

  for (const axis of axes) {
    const leftValue = (left.signals[axis] ?? midpoint) - midpoint
    const rightValue = (right.signals[axis] ?? midpoint) - midpoint
    dotProduct += leftValue * rightValue
    leftSquaredNorm += leftValue ** 2
    rightSquaredNorm += rightValue ** 2
  }
  if (leftSquaredNorm === 0 || rightSquaredNorm === 0) return null
  return dotProduct / Math.sqrt(leftSquaredNorm * rightSquaredNorm)
}

function centeredVectorSquaredNorm(
  option: SignalOption,
  axes: readonly string[],
  midpoint: number,
) {
  return axes.reduce((total, axis) => {
    const centered = (option.signals[axis] ?? midpoint) - midpoint
    return total + centered ** 2
  }, 0)
}

function roundSimilarity(value: number) {
  return Number(value.toFixed(6))
}

function secondaryChoiceConstruction(
  strategy: SecondaryChoiceStrategy,
  selections: SecondaryChoiceConstruction["selections"],
): SecondaryChoiceConstruction {
  const construction: SecondaryChoiceConstruction = {
    strategy,
    eligibleItemCount: selections.length,
    secondaryFieldCount: selections.filter(
      (selection) => selection.secondaryOptionId !== undefined,
    ).length,
    skippedSecondaryItems:
      strategy === "primary-only"
        ? []
        : selections
            .filter(
              (selection) =>
                selection.secondaryOptionId === undefined,
            )
            .map((selection) => ({
              itemId: selection.itemId,
              reason:
                strategy === "reinforcing"
                  ? "no-positively-aligned-candidate" as const
                  : "no-negatively-opposed-candidate" as const,
            })),
    selections,
  }
  if (
    strategy !== "primary-only" &&
    construction.secondaryFieldCount === 0
  ) {
    throw new Error(
      `${strategy} fixture has no qualified secondary choices.`,
    )
  }
  return construction
}

function responseStyleScalar(
  style: ResponseStyle,
  reverse: boolean,
  index: number,
  random: () => number,
): number {
  switch (style) {
    case "all-minimum":
      return semanticScalar("low", reverse)
    case "all-maximum":
      return semanticScalar("high", reverse)
    case "alternating":
      return semanticScalar(index % 2 === 0 ? "low" : "high", reverse)
    case "seeded-random-20260728":
      return 1 + Math.floor(random() * 7)
    case "midpoint":
    case "always-first":
    case "always-last":
      return 4
  }
}

function semanticScalar(
  direction: Direction,
  reverse: boolean,
): number {
  if (direction === "low") return reverse ? 7 : 1
  return reverse ? 1 : 7
}

function responseStyleOption({
  style,
  options,
  axes,
  midpoint,
  questionId,
  choiceIndex,
  random,
}: {
  style: ResponseStyle
  options: SignalOption[]
  axes: readonly string[]
  midpoint: number
  questionId: string
  choiceIndex: number
  random: () => number
}): SignalOption {
  if (style === "all-minimum") {
    return chooseOmnibusOption(options, axes, midpoint, "low")
  }
  if (style === "all-maximum") {
    return chooseOmnibusOption(options, axes, midpoint, "high")
  }
  if (style === "midpoint") {
    return chooseNeutralOption(options, axes, midpoint)
  }

  const presented = getSeededOptionOrder(
    options,
    EVIDENCE_STYLE_PRESENTATION_SEED,
    questionId,
  )
  if (style === "always-first") return presented[0]
  if (style === "always-last") return presented[presented.length - 1]
  if (style === "alternating") {
    return choiceIndex % 2 === 0
      ? presented[0]
      : presented[presented.length - 1]
  }

  return presented[Math.floor(random() * presented.length)]
}

function chooseOmnibusOption(
  options: SignalOption[],
  axes: readonly string[],
  midpoint: number,
  direction: Direction,
): SignalOption {
  return chooseByScore(
    options,
    (option) =>
      axes.reduce(
        (total, axis) =>
          total + ((option.signals[axis] ?? midpoint) - midpoint),
        0,
      ),
    direction,
  )
}

function chooseNeutralOption(
  options: SignalOption[],
  axes: readonly string[],
  midpoint: number,
): SignalOption {
  return chooseByScore(
    options,
    (option) =>
      axes.reduce((total, axis) => {
        const distance = (option.signals[axis] ?? midpoint) - midpoint
        return total + distance ** 2
      }, 0),
    "low",
  )
}

function chooseAxisOption(
  options: SignalOption[],
  axis: string,
  direction: Direction,
  midpoint: number,
  requireExplicitSignal: boolean,
): SignalOption {
  const explicit = options.filter(
    (option) => typeof option.signals[axis] === "number",
  )
  const candidates =
    requireExplicitSignal && explicit.length > 0 ? explicit : options
  return chooseByScore(
    candidates,
    (option) => option.signals[axis] ?? midpoint,
    direction,
  )
}

function chooseByScore(
  options: SignalOption[],
  score: (option: SignalOption) => number,
  direction: Direction,
): SignalOption {
  const first = options[0]
  if (!first) {
    throw new Error("Cannot select from an empty option set.")
  }

  return options.slice(1).reduce((selected, candidate) => {
    const selectedScore = score(selected)
    const candidateScore = score(candidate)
    const isBetter =
      direction === "low"
        ? candidateScore < selectedScore
        : candidateScore > selectedScore
    return isBetter ? candidate : selected
  }, first)
}

function buildFoundationInvariance(
  cohort: FoundationCohort,
): EvidencePresentationInvariance {
  const [firstSeed, secondSeed] =
    EVIDENCE_INVARIANCE_PRESENTATION_SEEDS
  const firstAnswers = buildFoundationSemanticAnswers(
    cohort.questions,
    cohort.mode,
    firstSeed,
  )
  const secondAnswers = buildFoundationSemanticAnswers(
    cohort.questions,
    cohort.mode,
    secondSeed,
  )
  const firstResult = foundationResultContract(
    cohort.scorer.generateResult(firstAnswers, cohort.mode),
  )
  const secondResult = foundationResultContract(
    cohort.scorer.generateResult(secondAnswers, cohort.mode),
  )
  const presentation = presentationDifference(
    cohort.questions.flatMap((question) =>
      question.options
        ? [{ id: question.id, options: question.options }]
        : []
    ),
    firstSeed,
    secondSeed,
  )

  assertSemanticInvariance(
    cohortKey(cohort),
    presentation,
    firstAnswers,
    secondAnswers,
    firstResult,
    secondResult,
  )

  return {
    cohortKey: cohortKey(cohort),
    instrument: cohort.instrument,
    bankVersion: cohort.bankVersion,
    scoringVersion: cohort.scoringVersion,
    legacy: cohort.legacy,
    mode: cohort.mode,
    seeds: [firstSeed, secondSeed],
    presentationQuestionCount: presentation.total,
    changedPresentationQuestions: presentation.changed,
    semanticAnswersDigests: [
      digest(firstAnswers),
      digest(secondAnswers),
    ],
    semanticSecondaryChoiceCounts: [
      countSecondaryChoices(firstAnswers),
      countSecondaryChoices(secondAnswers),
    ],
    resultContractDigests: [
      digest(firstResult),
      digest(secondResult),
    ],
  }
}

function buildModuleInvariance(
  cohort: ModuleCohort,
): EvidencePresentationInvariance {
  const [firstSeed, secondSeed] =
    EVIDENCE_INVARIANCE_PRESENTATION_SEEDS
  const firstAnswers = buildModuleSemanticAnswers(
    cohort.questions,
    cohort.mode,
    firstSeed,
  )
  const secondAnswers = buildModuleSemanticAnswers(
    cohort.questions,
    cohort.mode,
    secondSeed,
  )
  const firstResult = moduleResultContract(cohort, firstAnswers)
  const secondResult = moduleResultContract(cohort, secondAnswers)
  const presentation = presentationDifference(
    cohort.questions.map((question) => ({
      id: question.id,
      options: moduleSignalOptions(question),
    })),
    firstSeed,
    secondSeed,
  )

  assertSemanticInvariance(
    cohortKey(cohort),
    presentation,
    firstAnswers,
    secondAnswers,
    firstResult,
    secondResult,
  )

  return {
    cohortKey: cohortKey(cohort),
    instrument: cohort.instrument,
    bankVersion: cohort.bankVersion,
    scoringVersion: cohort.scoringVersion,
    legacy: cohort.legacy,
    mode: cohort.mode,
    seeds: [firstSeed, secondSeed],
    presentationQuestionCount: presentation.total,
    changedPresentationQuestions: presentation.changed,
    semanticAnswersDigests: [
      digest(firstAnswers),
      digest(secondAnswers),
    ],
    semanticSecondaryChoiceCounts: [
      countSecondaryChoices(firstAnswers),
      countSecondaryChoices(secondAnswers),
    ],
    resultContractDigests: [
      digest(firstResult),
      digest(secondResult),
    ],
  }
}

function buildAiInvariance(
  cohort: AiCohort,
): EvidencePresentationInvariance {
  const [firstSeed, secondSeed] =
    EVIDENCE_INVARIANCE_PRESENTATION_SEEDS
  const firstAnswers = buildAiSemanticAnswers(cohort, firstSeed)
  const secondAnswers = buildAiSemanticAnswers(cohort, secondSeed)
  const firstScored =
    cohort.version.scoring.generateAiGovernanceResult(
      firstAnswers,
      cohort.mode,
    )
  const secondScored =
    cohort.version.scoring.generateAiGovernanceResult(
      secondAnswers,
      cohort.mode,
    )
  const firstResult = aiResultContract(firstScored)
  const secondResult = aiResultContract(secondScored)
  const firstSequence =
    cohort.version.scoring.getAiScenarioSequence(
      firstAnswers,
      cohort.mode,
    ).map((scenario) => scenario.id)
  const secondSequence =
    cohort.version.scoring.getAiScenarioSequence(
      secondAnswers,
      cohort.mode,
    ).map((scenario) => scenario.id)
  const scenarios = uniqueAiScenarios(
    cohort,
    firstAnswers,
  )
  const presentation = presentationDifference(
    scenarios.map((scenario) => ({
      id: scenario.id,
      options: aiSignalOptions(
        cohort.version.schema.getScenarioOptions(
          scenario,
          cohort.mode,
        ),
      ),
    })),
    firstSeed,
    secondSeed,
  )

  assertSemanticInvariance(
    cohortKey(cohort),
    presentation,
    firstAnswers,
    secondAnswers,
    firstResult,
    secondResult,
  )
  if (stableJson(firstSequence) !== stableJson(secondSequence)) {
    throw new Error(
      `${cohortKey(cohort)} changed its semantic scenario sequence across presentation seeds.`,
    )
  }

  return {
    cohortKey: cohortKey(cohort),
    instrument: cohort.instrument,
    bankVersion: cohort.bankVersion,
    scoringVersion: cohort.scoringVersion,
    legacy: cohort.legacy,
    mode: cohort.mode,
    seeds: [firstSeed, secondSeed],
    presentationQuestionCount: presentation.total,
    changedPresentationQuestions: presentation.changed,
    semanticAnswersDigests: [
      digest(firstAnswers),
      digest(secondAnswers),
    ],
    semanticSecondaryChoiceCounts: [
      countSecondaryChoices(firstAnswers),
      countSecondaryChoices(secondAnswers),
    ],
    resultContractDigests: [
      digest(firstResult),
      digest(secondResult),
    ],
    scenarioSequences: [[...firstSequence], [...secondSequence]],
    scenarioSequenceDigests: [
      digest(firstSequence),
      digest(secondSequence),
    ],
  }
}

function buildFoundationSemanticAnswers(
  questions: FoundationEvidenceQuestion[],
  mode: QuizMode,
  presentationSeed: string,
): Answers {
  const answers: Answers = {}

  for (const [index, question] of questions.entries()) {
    if (question.kind === "likert") {
      answers[question.id] = (index % 7) + 1
      continue
    }
    const options = question.options ?? []
    if (options.length === 0) continue
    const primaryId = options[index % options.length].id
    const secondaryId = options[(index + 1) % options.length].id
    const presented = getSeededOptionOrder(
      options,
      presentationSeed,
      question.id,
    )
    requirePresentedId(presented, primaryId, question.id)
    requirePresentedId(presented, secondaryId, question.id)

    answers[question.id] =
      mode === "analyst" &&
      question.allowSecondChoiceInAnalyst &&
      secondaryId !== primaryId
        ? ({
            primary: primaryId,
            secondary: secondaryId,
          } satisfies RankedChoiceAnswer)
        : primaryId
  }

  return answers
}

function buildModuleSemanticAnswers(
  questions: ModuleQuestion[],
  mode: QuizMode,
  presentationSeed: string,
): ModuleAnswers {
  const answers: ModuleAnswers = {}

  for (const [index, question] of questions.entries()) {
    const options = moduleSignalOptions(question)
    const primaryId = options[index % options.length].id
    const secondaryId = options[(index + 1) % options.length].id
    const presented = getSeededOptionOrder(
      options,
      presentationSeed,
      question.id,
    )
    requirePresentedId(presented, primaryId, question.id)
    requirePresentedId(presented, secondaryId, question.id)
    answers[question.id] = {
      primary: primaryId,
      ...(mode === "analyst" &&
      question.allowSecondChoiceInAnalyst &&
      secondaryId !== primaryId
        ? { secondary: secondaryId }
        : {}),
    }
  }

  return answers
}

function buildAiSemanticAnswers(
  cohort: AiCohort,
  presentationSeed: string,
): AiAnswers {
  const answers: AiAnswers = {}

  for (const [index, question] of cohort.likertQuestions.entries()) {
    answers[question.id] = (index % 7) + 1
  }

  let previousSequenceSize = -1
  let sequence = [...cohort.rootScenarios]
  while (sequence.length !== previousSequenceSize) {
    previousSequenceSize = sequence.length
    for (const [index, scenario] of sequence.entries()) {
      if (answers[scenario.id] !== undefined) continue
      const options = cohort.version.schema.getScenarioOptions(
        scenario,
        cohort.mode,
      )
      const primary = options[index % options.length]
      const secondary = options[(index + 1) % options.length]
      const presented = getSeededOptionOrder(
        options,
        presentationSeed,
        scenario.id,
      )
      requirePresentedId(presented, primary.id, scenario.id)
      requirePresentedId(presented, secondary.id, scenario.id)
      answers[scenario.id] =
        cohort.mode === "analyst" &&
        scenario.allowBackupChoiceInAnalyst &&
        secondary.id !== primary.id
          ? ({
              primary: primary.id,
              secondary: secondary.id,
            } satisfies AiRankedChoiceAnswer)
          : primary.id
    }
    sequence = cohort.version.scoring.getAiScenarioSequence(
      answers,
      cohort.mode,
    )
  }

  return answers
}

function uniqueAiScenarios(
  cohort: AiCohort,
  answers: AiAnswers,
): AiScenarioQuestion[] {
  const sequence =
    cohort.version.scoring.getAiScenarioSequence(
      answers,
      cohort.mode,
    )
  return [
    ...new Map(
      [...cohort.rootScenarios, ...sequence].map((scenario) => [
        scenario.id,
        scenario,
      ]),
    ).values(),
  ]
}

function presentationDifference(
  questions: Array<{ id: string; options: SignalOption[] }>,
  firstSeed: string,
  secondSeed: string,
) {
  let changed = 0

  for (const question of questions) {
    const first = getSeededOptionOrder(
      question.options,
      firstSeed,
      question.id,
    ).map((option) => option.id)
    const second = getSeededOptionOrder(
      question.options,
      secondSeed,
      question.id,
    ).map((option) => option.id)
    if (stableJson(first) !== stableJson(second)) changed += 1
  }

  return { total: questions.length, changed }
}

function assertSemanticInvariance(
  key: string,
  presentation: { total: number; changed: number },
  firstAnswers: unknown,
  secondAnswers: unknown,
  firstResult: JsonObject,
  secondResult: JsonObject,
) {
  if (presentation.total === 0) {
    throw new Error(
      `${key} has no nominal option sets for presentation-invariance evidence.`,
    )
  }
  if (presentation.changed === 0) {
    throw new Error(
      `${key} fixture seeds did not change any presented option order.`,
    )
  }
  if (stableJson(firstAnswers) !== stableJson(secondAnswers)) {
    throw new Error(
      `${key} changed semantic answer IDs across presentation seeds.`,
    )
  }
  if (stableJson(firstResult) !== stableJson(secondResult)) {
    throw new Error(
      `${key} changed scores across presentation seeds.`,
    )
  }
}

function foundationResultContract(
  result: ReturnType<FoundationScoringVersion["generateResult"]>,
): JsonObject {
  return canonicalObject({
    familyKey: result.familyKey,
    runnerUpKey: result.runnerUpKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    nearestFitGap: result.nearestFitGap,
    dimensionScores: result.dimensionScores,
    familyScores: result.familyScores,
  })
}

function moduleResultContract(
  cohort: ModuleCohort,
  answers: ModuleAnswers,
): JsonObject {
  const analytics = cohort.runtime.buildModuleAnalytics(
    cohort.definition,
    cohort.mode,
    answers,
  )
  const result = cohort.runtime.buildModuleResult(
    cohort.definition,
    cohort.mode,
    answers,
  )

  return canonicalObject({
    headline: result.headline,
    scores: result.scores,
    laneScores: analytics.laneScores,
    cardTypeScores: result.cardTypeScores,
    overlayDeltas: result.overlayDeltas,
  })
}

function aiResultContract(
  result: ReturnType<AiVersion["scoring"]["generateAiGovernanceResult"]>,
): JsonObject {
  return canonicalObject({
    archetypeKey: result.archetypeKey,
    neighboringArchetypeKey:
      result.neighboringArchetypeKey ?? result.archetypeKey,
    riskLens: result.riskLens,
    paceModifier: result.paceModifier,
    geopoliticsModifier: result.geopoliticsModifier,
    axisScores: result.axisScores,
    archetypeScores: result.archetypeScores,
  })
}

function responseFixture(
  name: ResponseStyle,
  answers: Answers | ModuleAnswers | AiAnswers,
  result: JsonObject,
): EvidenceFixtureRecord {
  return {
    name,
    kind: "response-style",
    answeredItems: Object.keys(answers).length,
    answersDigest: digest(answers),
    result,
  }
}

function secondaryChoiceFixture(
  strategy: SecondaryChoiceStrategy,
  answers: Answers | ModuleAnswers | AiAnswers,
  result: JsonObject,
  construction: SecondaryChoiceConstruction,
): EvidenceFixtureRecord {
  return {
    name: `analyst-secondary-${strategy}`,
    kind: "secondary-choice",
    answeredItems: Object.keys(answers).length,
    answersDigest: digest(answers),
    secondaryChoiceConstruction: construction,
    result,
  }
}

function axisFixture(
  axis: string,
  direction: Direction,
  answers: Answers | ModuleAnswers | AiAnswers,
  result: JsonObject,
): EvidenceFixtureRecord {
  return {
    name: `${axis}-${direction}`,
    kind: "axis-direction",
    axis,
    direction,
    answeredItems: Object.keys(answers).length,
    answersDigest: digest(answers),
    result,
  }
}

function moduleSignalOptions(question: ModuleQuestion): SignalOption[] {
  return question.options.map((option) => ({
    id: option.id,
    signals: { ...option.signals },
    ...(option.pinned ? { pinned: option.pinned } : {}),
  }))
}

function aiSignalOptions(options: AiScenarioOption[]): SignalOption[] {
  return options.map((option) => ({
    id: option.id,
    signals: { ...option.weights },
    ...(option.pinned ? { pinned: option.pinned } : {}),
  }))
}

function requiredFoundationScorer(
  name: "v1" | "v2",
): FoundationScoringVersion {
  const scorer = getScoringVersion(name)
  if (!scorer) {
    throw new Error(`Missing supported Foundation scorer ${name}.`)
  }
  return scorer
}

function requirePresentedId<T extends { id: string }>(
  options: readonly T[],
  id: string,
  questionId: string,
) {
  if (!options.some((option) => option.id === id)) {
    throw new Error(
      `${questionId} lost semantic option ${id} during presentation ordering.`,
    )
  }
}

function requirePinnedOptionsLast(
  options: readonly SignalOption[],
  questionId: string,
) {
  const firstPinnedIndex = options.findIndex(
    (option) => option.pinned === "last",
  )
  if (
    firstPinnedIndex >= 0 &&
    options.slice(firstPinnedIndex).some(
      (option) => option.pinned !== "last",
    )
  ) {
    throw new Error(
      `${questionId} did not preserve its pinned-last option order.`,
    )
  }
}

function countSecondaryChoices(
  answers: Answers | ModuleAnswers | AiAnswers,
) {
  return Object.values(answers).filter(
    (answer) =>
      typeof answer === "object" &&
      answer !== null &&
      "secondary" in answer &&
      typeof answer.secondary === "string",
  ).length
}

function cohortKey(cohort: {
  instrument: string
  bankVersion: number | null
  scoringVersion: number
  mode: QuizMode
}): string {
  return (
    `${cohort.instrument}:` +
    `${cohort.bankVersion === null ? "bna" : `b${cohort.bankVersion}`}:` +
    `s${cohort.scoringVersion}:${cohort.mode}`
  )
}

function compareCohorts(
  left: EvidenceResponseCohort,
  right: EvidenceResponseCohort,
) {
  return (
    compareText(left.instrument, right.instrument) ||
    (left.bankVersion ?? -1) - (right.bankVersion ?? -1) ||
    left.scoringVersion - right.scoringVersion ||
    compareText(left.mode, right.mode)
  )
}

function compareFixtures(
  left: EvidenceFixtureRecord,
  right: EvidenceFixtureRecord,
) {
  return compareText(left.name, right.name)
}

function compareText(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0
}

function makeRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function digest(value: unknown): string {
  return createHash("sha256").update(stableJson(value)).digest("hex")
}

function stableJson(value: unknown): string {
  return JSON.stringify(canonicalize(value))
}

function canonicalObject(value: unknown): JsonObject {
  const canonical = canonicalize(value)
  if (
    canonical === null ||
    Array.isArray(canonical) ||
    typeof canonical !== "object"
  ) {
    throw new TypeError("Expected a JSON object.")
  }
  return canonical
}

function canonicalize(value: unknown): JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError("Evidence output cannot contain a non-finite number.")
    }
    return value
  }
  if (Array.isArray(value)) {
    return value.map(canonicalize)
  }
  if (typeof value === "object") {
    const source = value as Record<string, unknown>
    return Object.fromEntries(
      Object.keys(source)
        .sort(compareText)
        .filter((key) => source[key] !== undefined)
        .map((key) => [key, canonicalize(source[key])]),
    )
  }
  throw new TypeError(
    `Evidence output cannot contain ${typeof value}.`,
  )
}

function isMainModule() {
  const entryPoint = process.argv[1]
  return Boolean(
    entryPoint &&
    pathToFileURL(resolve(entryPoint)).href === import.meta.url
  )
}

if (isMainModule()) {
  process.stdout.write(
    `${JSON.stringify(buildEvidenceResponseFixtureReport(), null, 2)}\n`,
  )
}
