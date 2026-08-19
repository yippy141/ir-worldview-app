/**
 * Instrument diagnostics.
 *
 * Run with:
 *   node --experimental-strip-types --import ./tests/register-alias-loader.mjs scripts/diagnose-instrument.mts
 *
 * Or add to package.json scripts:
 *   "diagnose": "node --experimental-strip-types --import ./tests/register-alias-loader.mjs scripts/diagnose-instrument.mts"
 *   then: npm run diagnose
 *
 * This script does not change any product code. It only reads the scoring
 * functions and reports how the instrument behaves under controlled inputs.
 *
 * What it answers:
 *   1. Does a respondent who agrees with everything get a distinctive result?
 *   2. What is the actual usable range of each dimension score?
 *   3. What proportion of random respondents get each family / modifier / label?
 *   4. Is any family effectively unreachable?
 *   5. How often do labels change under small, deterministic answer perturbations?
 */

import { getFoundationQuestions } from "@/lib/quiz-schema"
import {
  buildModuleResult,
  getModuleQuestions,
  modules,
  scoreModule,
} from "@/lib/modules/framework"
import {
  enumerateModuleCalibrationCuts,
} from "@/lib/modules/calibration"
import {
  aiAxisLabels,
  aiScenarioQuestions,
  getAiCoreQuestions,
  getAiScenarioOrder,
  getScenarioOptions,
} from "@/lib/ai-governance-schema"
import {
  generateAiGovernanceResult,
  scoreLikert,
} from "@/lib/ai-governance-scoring"
import {
  findAttainableRangeFindings,
  findCompromiseReviewFindings,
  findConcentrationFindings,
  findDeclaredAxisFindings,
  findDiscriminatingCoverageFindings,
  findMissingDeclaredAxisFindings,
  findNoQualifyingAxisFindings,
  findPoleAccessFindings,
  findReverseCodingFindings,
  findSaturationFindings,
  findThresholdRangeFindings,
  findUniformMeanCenteringFindings,
  evaluateDeclaredAxis,
  getAxisOptionStats,
  getTopHalfQualifyingAxes,
  MEASUREMENT_GATES_BLOCKING,
  type MeasurementFinding,
  type MeasurementOption,
} from "@/lib/instrument/measurement-gates"
import { assessFoundationNarrative } from "@/lib/narrative/foundation"
import { NEUTRAL_BASELINE } from "@/lib/scoring-calibration"
import { getSeededOptionOrder } from "@/lib/option-order"
import {
  computeCoreDimensionScores,
  buildCanonicalFoundationResult,
  scoreFamilies,
} from "@/lib/scoring"
import type {
  Answers,
  DimensionKey,
  DimensionScores,
  FamilyKey,
  QuizMode,
} from "@/lib/types"
import type {
  ModuleAnswers,
  ModuleAxisKey,
  ModuleDefinition,
} from "@/lib/modules/types"
import type {
  AiAnswers,
  AiAxisKey,
  AiLikertQuestion,
  AiQuizMode,
  AiScenarioOption,
  AiScenarioQuestion,
} from "@/lib/ai-governance-types"

const MODE: QuizMode = "analyst"
const RANDOM_N = 500
const RANDOM_SEED = 20260728
const STABILITY_SEED = 20260729
const SHOW_CALIBRATION = process.argv.includes("--calibration")
const SHOW_GAPS = process.argv.includes("--gaps")
const SHOW_PERCENTILES = process.argv.includes("--percentiles")
const SHOW_SENSITIVITY = process.argv.includes("--sensitivity")
const SHOW_STABILITY = process.argv.includes("--stability")
const SHOW_ORDER_BIAS = process.argv.includes("--order-bias")
const SHOW_MODULES = process.argv.includes("--modules")
const SHOW_AI = process.argv.includes("--ai")
const measurementGateFindings: MeasurementFinding[] = []
const qualificationFindings: MeasurementFinding[] = []
const compromiseReviewFindings: MeasurementFinding[] = []

const DIMENSION_KEYS: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

// ---------------------------------------------------------------- helpers

type AnyQuestion = ReturnType<typeof getFoundationQuestions>[number] & {
  options?: { id: string }[]
  allowSecondChoiceInAnalyst?: boolean
}

const FOUNDATION_QUESTIONS = getFoundationQuestions(MODE) as AnyQuestion[]

/** Deterministic pseudo-random so runs are reproducible. */
function makeRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

/**
 * Build a full answer set.
 * @param likertValue  value 1..7 to give every Likert item
 * @param pickOption   given the option list, return the index to choose
 * @param secondaryOffset  how far down the list to place the second choice
 * @param orderSeed    when present, choose by position after seeded presentation ordering
 */
function buildAnswers(
  likertValue: number | ((questionId: string) => number),
  pickOption: (options: { id: string }[], questionId: string) => number,
  secondaryOffset = 1,
  orderSeed?: string,
): Answers {
  const answers: Answers = {}

  for (const question of FOUNDATION_QUESTIONS) {

    if (question.kind === "likert") {
      answers[question.id] =
        typeof likertValue === "function"
          ? likertValue(question.id)
          : likertValue
      continue
    }

    const canonicalOptions = question.options ?? []
    const options = orderSeed
      ? getSeededOptionOrder(canonicalOptions, orderSeed, question.id)
      : canonicalOptions
    if (options.length === 0) continue

    const primaryIndex = pickOption(options, question.id) % options.length
    const secondaryIndex = (primaryIndex + secondaryOffset) % options.length

    answers[question.id] = {
      primary: options[primaryIndex].id,
      secondary:
        options.length > 1 && secondaryIndex !== primaryIndex
          ? options[secondaryIndex].id
          : undefined,
    }
  }

  return answers
}

function cloneAnswers(answers: Answers): Answers {
  return Object.fromEntries(
    Object.entries(answers).map(([questionId, answer]) => [
      questionId,
      typeof answer === "object" ? { ...answer } : answer,
    ]),
  )
}

function perturbAnswers(
  answers: Answers,
  changeCount: number,
  rng: ReturnType<typeof makeRng>,
): Answers {
  if (changeCount > FOUNDATION_QUESTIONS.length) {
    throw new Error(
      `Cannot change ${changeCount} answers in a ${FOUNDATION_QUESTIONS.length}-item instrument.`,
    )
  }

  const perturbed = cloneAnswers(answers)
  const questions = [...FOUNDATION_QUESTIONS]

  for (let i = 0; i < changeCount; i += 1) {
    const swapIndex = i + Math.floor(rng() * (questions.length - i))
    ;[questions[i], questions[swapIndex]] = [questions[swapIndex], questions[i]]

    const question = questions[i]
    const currentAnswer = perturbed[question.id]

    if (question.kind === "likert") {
      if (typeof currentAnswer !== "number") {
        throw new Error(`Expected a Likert answer for ${question.id}.`)
      }

      const direction = rng() < 0.5 ? -1 : 1
      perturbed[question.id] =
        currentAnswer + direction < 1 || currentAnswer + direction > 7
          ? currentAnswer - direction
          : currentAnswer + direction
      continue
    }

    const options = question.options ?? []
    const currentPrimary =
      typeof currentAnswer === "string"
        ? currentAnswer
        : typeof currentAnswer === "object"
          ? currentAnswer.primary
          : undefined

    if (!currentPrimary || options.length < 2) {
      throw new Error(`Expected at least two choice options for ${question.id}.`)
    }

    const alternatives = options.filter((option) => option.id !== currentPrimary)
    const nextPrimary = alternatives[Math.floor(rng() * alternatives.length)].id

    if (typeof currentAnswer === "string") {
      perturbed[question.id] = nextPrimary
      continue
    }

    if (typeof currentAnswer !== "object" || currentAnswer === null) {
      throw new Error(`Expected a ranked choice answer for ${question.id}.`)
    }

    perturbed[question.id] = {
      primary: nextPrimary,
      secondary:
        currentAnswer.secondary === nextPrimary
          ? currentPrimary
          : currentAnswer.secondary,
    }
  }

  return perturbed
}

type StabilitySnapshot = {
  familyLabel: string
  strategyModifier: string
  normativeModifier: string
  fullLabel: string
  narrativeState: string
}

function getStabilitySnapshot(answers: Answers): StabilitySnapshot {
  const scores = computeCoreDimensionScores(answers, MODE)
  const result = buildCanonicalFoundationResult(scores)

  return {
    familyLabel: result.familyLabel,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    fullLabel:
      `${result.familyLabel} / ${result.strategyModifier} / ` +
      result.normativeModifier,
    narrativeState: assessFoundationNarrative(scores).state,
  }
}

function pad(value: string | number, width: number) {
  return String(value).padEnd(width)
}

function padLeft(value: string | number, width: number) {
  return String(value).padStart(width)
}

function pct(count: number, total: number) {
  return `${((count / total) * 100).toFixed(1)}%`
}

function bar(fraction: number, width = 30) {
  const filled = Math.round(fraction * width)
  return "█".repeat(filled) + "·".repeat(width - filled)
}

function populationStandardDeviation(sum: number, sumSquares: number, count: number) {
  const mean = sum / count
  const variance = sumSquares / count - mean ** 2
  return Math.sqrt(Math.max(variance, 0))
}

function percentile(values: number[], probability: number) {
  const sorted = [...values].sort((a, b) => a - b)
  const rank = (sorted.length - 1) * probability
  const lowerIndex = Math.floor(rank)
  const upperIndex = Math.ceil(rank)
  const lower = sorted[lowerIndex]
  const upper = sorted[upperIndex]

  return lower + (upper - lower) * (rank - lowerIndex)
}

function summarise(label: string, answers: Answers) {
  const scores = computeCoreDimensionScores(answers, MODE)
  const result = buildCanonicalFoundationResult(scores)
  const families = scoreFamilies(scores)

  console.log(`\n--- ${label} ---`)
  for (const key of DIMENSION_KEYS) {
    console.log(`  ${pad(key, 22)} ${padLeft(scores[key].toFixed(2), 6)}`)
  }
  console.log(
    `  => ${result.familyLabel} / ${result.strategyModifier} / ${result.normativeModifier}`,
  )
  console.log(
    `     family scores: ${(Object.entries(families) as [FamilyKey, number][])
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}=${v.toFixed(2)}`)
      .join("  ")}`,
  )
  return { scores, result }
}

type OptionSignalStats = {
  minimum: number
  maximum: number
  mean: number
  spread: number
  straddles: boolean
}

function getOptionSignalStats<T>(
  options: T[],
  readSignal: (option: T) => number,
  midpoint: number,
): OptionSignalStats {
  const values = options.map(readSignal)
  const minimum = Math.min(...values)
  const maximum = Math.max(...values)
  return {
    minimum,
    maximum,
    mean: values.reduce((sum, value) => sum + value, 0) / values.length,
    spread: maximum - minimum,
    straddles: minimum < midpoint && maximum > midpoint,
  }
}

function printSignalTableHeader(midpoint: number) {
  console.log(
    "| Item | Axis | Options | Min | Max | Spread | Mean | " +
      `Straddles ${midpoint.toFixed(1)}? |`,
  )
  console.log("| --- | --- | ---: | ---: | ---: | ---: | ---: | :---: |")
}

const DIAGNOSTIC_MODES: QuizMode[] = ["standard", "analyst"]

function modeLabel(mode: QuizMode | AiQuizMode) {
  return mode === "standard" ? "Standard" : "Advanced"
}

function toModuleMeasurementOptions(
  question: ReturnType<typeof getModuleQuestions>[number],
): MeasurementOption<ModuleAxisKey>[] {
  return question.options.map((option) => ({
    id: option.id,
    signals: option.signals,
  }))
}

function toAiMeasurementOptions(
  options: AiScenarioOption[],
): MeasurementOption<AiAxisKey>[] {
  return options.map((option) => ({
    id: option.id,
    signals: option.weights,
  }))
}

function collectModuleItemFindings() {
  for (const moduleDefinition of modules) {
    const axes = moduleDefinition.axes.map((axis) => axis.key)
    const questions = new Map(
      DIAGNOSTIC_MODES.flatMap((mode) =>
        getModuleQuestions(moduleDefinition, mode).map(
          (question) => [question.id, question] as const,
        ),
      ),
    )

    for (const question of questions.values()) {
      const subject = `${moduleDefinition.slug}.${question.id}.options`
      const options = toModuleMeasurementOptions(question)
      const qualifiers = getTopHalfQualifyingAxes(
        getAxisOptionStats(options, axes, 4),
        1.5,
      )
      qualificationFindings.push(
        ...findMissingDeclaredAxisFindings(
          `${moduleDefinition.slug}.${question.id}`,
          question.discriminatingAxes,
        ),
        ...findNoQualifyingAxisFindings(
          `${moduleDefinition.slug}.${question.id}`,
          qualifiers,
        ),
      )
      measurementGateFindings.push(
        ...findDeclaredAxisFindings({
          subject,
          declaredAxes: question.discriminatingAxes,
          options,
          midpoint: 4,
          minimumSpread: 2,
        }),
      )
      compromiseReviewFindings.push(
        ...findCompromiseReviewFindings({
          subject,
          axes,
          options,
          midpoint: 4,
        }),
      )
    }
  }
}

function collectAiItemFindings() {
  const axes = Object.keys(aiAxisLabels) as AiAxisKey[]
  const standardIds = new Set<string>(getAiScenarioOrder("standard"))
  const analystIds = new Set<string>(getAiScenarioOrder("analyst"))

  for (const scenario of Object.values(aiScenarioQuestions)) {
    const optionSets: Array<{
      source: "options" | "analystOptions"
      options: AiScenarioOption[]
    }> = []
    if (standardIds.has(scenario.id)) {
      optionSets.push({ source: "options", options: scenario.options })
    }
    if (analystIds.has(scenario.id)) {
      const source = scenario.analystOptions ? "analystOptions" : "options"
      if (!optionSets.some((optionSet) => optionSet.source === source)) {
        optionSets.push({
          source,
          options: scenario.analystOptions ?? scenario.options,
        })
      }
    }

    let sharedQualifiers = [...axes]
    for (const optionSet of optionSets) {
      const options = toAiMeasurementOptions(optionSet.options)
      const modeQualifiers = new Set(
        getTopHalfQualifyingAxes(
          getAxisOptionStats(options, axes, 0),
          0.5,
        ),
      )
      sharedQualifiers = sharedQualifiers.filter((axis) =>
        modeQualifiers.has(axis),
      )
      const subject =
        `ai-governance.${scenario.id}.${optionSet.source}`
      measurementGateFindings.push(
        ...findDeclaredAxisFindings({
          subject,
          declaredAxes: scenario.discriminatingAxes,
          options,
          midpoint: 0,
          minimumSpread: 0.5,
        }),
      )
      compromiseReviewFindings.push(
        ...findCompromiseReviewFindings({
          subject,
          axes,
          options,
          midpoint: 0,
        }),
      )
    }
    qualificationFindings.push(
      ...findMissingDeclaredAxisFindings(
        `ai-governance.${scenario.id}`,
        scenario.discriminatingAxes,
      ),
      ...findNoQualifyingAxisFindings(
        `ai-governance.${scenario.id}`,
        sharedQualifiers,
      ),
    )
  }
}

function runModuleDiagnostics() {
  for (const [moduleIndex, moduleDefinition] of modules.entries()) {
    for (const mode of DIAGNOSTIC_MODES) {
      const questions = getModuleQuestions(moduleDefinition, mode)
      const scoredQuestions = questions.filter(
        (question) => question.cardType !== "actorLens",
      )
      const sampledQuestions =
        moduleDefinition.slug === "security" ? scoredQuestions : questions
      // Reinitialize per mode so the existing Advanced seed remains unchanged.
      const moduleRng = makeRng(RANDOM_SEED + 1000 + moduleIndex)
      const axisSums = Object.fromEntries(
        moduleDefinition.axes.map((axis) => [axis.key, 0]),
      ) as Record<string, number>
      const headlineCounts: Record<string, number> = {}
      const laneSummaryCounts: Record<string, Record<string, number>> =
        Object.fromEntries(
          moduleDefinition.lanes.map((lane) => [lane.key, {}]),
        )

      for (let respondentIndex = 0; respondentIndex < RANDOM_N; respondentIndex += 1) {
        const answers: ModuleAnswers = {}
        for (const question of sampledQuestions) {
          const option = question.options[
            Math.floor(moduleRng() * question.options.length)
          ]
          answers[question.id] = { primary: option.id }
        }

        const result = buildModuleResult(moduleDefinition, mode, answers)
        headlineCounts[result.headline] = (headlineCounts[result.headline] ?? 0) + 1
        for (const axis of moduleDefinition.axes) {
          axisSums[axis.key] += result.scores[axis.key]
        }
        for (const laneSummary of result.laneSummaries) {
          const counts = laneSummaryCounts[laneSummary.key] ?? {}
          counts[laneSummary.summary] = (counts[laneSummary.summary] ?? 0) + 1
          laneSummaryCounts[laneSummary.key] = counts
        }
      }

      console.log("\n" + "=".repeat(74))
      console.log(
        `MODULE DIAGNOSTIC  ${moduleDefinition.title} · ${modeLabel(mode)} ` +
          `(${RANDOM_N} seeded primary-only respondents)`,
      )
      console.log("=".repeat(74))
      console.log(
        "\nOverall-score calculations follow the product scorer. Actor-lens cards " +
          "are reported below but do not contribute to the overall score. Optional " +
          "backup choices are left blank in this primary-only baseline.",
      )
      console.log(
        "\n| Axis | Qualifying discriminating items | Meets minimum 4? |",
      )
      console.log("| --- | ---: | :---: |")
      for (const axis of moduleDefinition.axes) {
        const discriminatingCount = scoredQuestions.filter(
          (question) =>
            question.discriminatingAxes.includes(axis.key) &&
            evaluateDeclaredAxis(
              question.options.map((option) => option.signals[axis.key] ?? 4),
              4,
              2,
            ).passes,
        ).length
        console.log(
          `| ${axis.key} | ${discriminatingCount} | ` +
            `${discriminatingCount >= 4 ? "yes" : "NO"} |`,
        )
        measurementGateFindings.push(
          ...findDiscriminatingCoverageFindings(
            `${moduleDefinition.slug}.${mode}.${axis.key}`,
            discriminatingCount,
            4,
          ),
        )
      }
      console.log(
        "\n| Axis | Exact uniform-choice mean | Seeded random mean | " +
          "Lowest attainable | Highest attainable | Range | " +
          "Exact floor | Exact ceiling |",
      )
      console.log("| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |")

      for (const axis of moduleDefinition.axes) {
        const minimizingAnswers = buildModuleExtremeAnswers(
          moduleDefinition,
          scoredQuestions,
          axis.key,
          "minimum",
        )
        const maximizingAnswers = buildModuleExtremeAnswers(
          moduleDefinition,
          scoredQuestions,
          axis.key,
          "maximum",
        )
        const minimum = scoreModule(
          moduleDefinition,
          mode,
          minimizingAnswers,
        )[axis.key]
        const maximum = scoreModule(
          moduleDefinition,
          mode,
          maximizingAnswers,
        )[axis.key]
        const exactDistribution = getExactModuleAxisDistribution(
          scoredQuestions,
          axis.key,
        )
        const exactMean = exactDistribution.mean
        console.log(
          `| ${axis.key} | ${exactMean.toFixed(3)} | ` +
            `${(axisSums[axis.key] / RANDOM_N).toFixed(3)} | ` +
            `${minimum.toFixed(2)} | ${maximum.toFixed(2)} | ` +
            `${(maximum - minimum).toFixed(2)} | ` +
            `${(exactDistribution.floorShare * 100).toFixed(1)}% | ` +
            `${(exactDistribution.ceilingShare * 100).toFixed(1)}% |`,
        )
        const subject =
          `${moduleDefinition.slug}.${mode}.${axis.key}`
        measurementGateFindings.push(
          ...findPoleAccessFindings(subject, minimum, maximum, 4),
          ...findUniformMeanCenteringFindings(
            subject,
            exactMean,
            minimum,
            maximum,
            0.3,
          ),
          ...findSaturationFindings(
            subject,
            exactDistribution.floorShare,
            exactDistribution.ceilingShare,
            0.1,
          ),
        )
      }

      report(
        `${modeLabel(mode)} primary-only result-headline distribution`,
        headlineCounts,
      )
      if (!moduleDefinition.defaultHeadline) {
        throw new Error(
          `${moduleDefinition.slug} must declare its default headline.`,
        )
      }
      const defaultHeadlineShare =
        (headlineCounts[moduleDefinition.defaultHeadline] ?? 0) / RANDOM_N
      measurementGateFindings.push(
        ...findConcentrationFindings(
          `${moduleDefinition.slug}.${mode}.default-headline`,
          defaultHeadlineShare,
          0.4,
          "default headline",
        ),
      )

      console.log(`\nPer-card ${modeLabel(mode)} option-set audit`)
      printSignalTableHeader(4)
      for (const question of questions) {
        for (const axisKey of question.discriminatingAxes) {
          const stats = getOptionSignalStats(
            question.options,
            (option) => option.signals[axisKey] ?? 4,
            4,
          )
          const itemLabel =
            question.cardType === "actorLens"
              ? `${question.id} (actor lens)`
              : question.id
          console.log(
            `| ${itemLabel} | ${axisKey} | ${question.options.length} | ` +
              `${stats.minimum.toFixed(2)} | ${stats.maximum.toFixed(2)} | ` +
              `${stats.spread.toFixed(2)} | ${stats.mean.toFixed(2)} | ` +
              `${stats.straddles ? "yes" : "NO"} |`,
          )
        }
      }

      for (const lane of moduleDefinition.lanes) {
        report(
          `${modeLabel(mode)} primary-only lane-summary distribution: ${lane.label}`,
          laneSummaryCounts[lane.key],
        )
      }
    }
  }

  for (const cut of enumerateModuleCalibrationCuts()) {
    const context =
      cut.context.kind === "headline"
        ? "headline"
        : `lane:${cut.context.laneKey}`
    const liveAttainable = getLiveModuleCalibrationRange(cut)
    measurementGateFindings.push(
      ...findThresholdRangeFindings(
        `${cut.slug}.${cut.mode}.${context}.${cut.axis}.${cut.tail}`,
        cut.raw,
        liveAttainable.minimum,
        liveAttainable.maximum,
      ),
    )
  }
}

function getLiveModuleCalibrationRange(
  cut: ReturnType<typeof enumerateModuleCalibrationCuts>[number],
) {
  const moduleDefinition = modules.find(
    (candidate) => candidate.slug === cut.slug,
  )
  if (!moduleDefinition) {
    throw new Error(`Missing module definition for ${cut.slug}.`)
  }

  const scoredQuestions = getModuleQuestions(
    moduleDefinition,
    cut.mode,
  ).filter((question) => question.cardType !== "actorLens")
  let questions = scoredQuestions
  if (cut.context.kind === "lane") {
    const { laneKey } = cut.context
    questions = scoredQuestions.filter(
      (question) => question.lane === laneKey,
    )
  }
  const minima = questions.map((question) =>
    Math.min(...question.options.map((option) => option.signals[cut.axis] ?? 4)),
  )
  const maxima = questions.map((question) =>
    Math.max(...question.options.map((option) => option.signals[cut.axis] ?? 4)),
  )

  return {
    minimum: roundedModuleMean(minima),
    maximum: roundedModuleMean(maxima),
  }
}

function roundedModuleMean(values: number[]) {
  if (values.length === 0) return 4
  return Number(
    (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(
      2,
    ),
  )
}

type ExactAxisDistribution = {
  mean: number
  minimum: number
  maximum: number
  floorShare: number
  ceilingShare: number
}

function getExactModuleAxisDistribution(
  scoredQuestions: ReturnType<typeof getModuleQuestions>,
  axisKey: ModuleAxisKey,
): ExactAxisDistribution {
  let sumDistribution = new Map<number, number>([[0, 1]])

  for (const question of scoredQuestions) {
    const values = question.options.map((option) => option.signals[axisKey])
    if (!values.every((value) => typeof value === "number" && Number.isFinite(value))) {
      throw new Error(
        `Exact module expectation requires dense signals; ${question.id}.${axisKey} is sparse.`,
      )
    }

    const next = new Map<number, number>()
    for (const [sum, probability] of sumDistribution) {
      for (const value of values) {
        addProbability(next, sum + value, probability / values.length)
      }
    }
    sumDistribution = next
  }

  const scoreDistribution = new Map<number, number>()
  if (scoredQuestions.length === 0) {
    scoreDistribution.set(4, 1)
  } else {
    for (const [sum, probability] of sumDistribution) {
      addProbability(
        scoreDistribution,
        Number((sum / scoredQuestions.length).toFixed(2)),
        probability,
      )
    }
  }

  return summariseExactDistribution(scoreDistribution)
}

function buildModuleExtremeAnswers(
  moduleDefinition: ModuleDefinition,
  scoredQuestions: ReturnType<typeof getModuleQuestions>,
  axisKey: ModuleAxisKey,
  direction: "minimum" | "maximum",
): ModuleAnswers {
  const answers: ModuleAnswers = {}
  for (const question of scoredQuestions) {
    const ordered = [...question.options].sort((left, right) => {
      const leftValue = left.signals[axisKey] ?? 4
      const rightValue = right.signals[axisKey] ?? 4
      return direction === "minimum"
        ? leftValue - rightValue
        : rightValue - leftValue
    })
    answers[question.id] = { primary: ordered[0].id }
  }
  return answers
}

function getAiOptionSignal(
  option: AiScenarioOption,
  axis: AiAxisKey,
): number {
  return option.weights[axis] ?? 0
}

function runAiDiagnostics() {
  const axes = Object.keys(aiAxisLabels) as AiAxisKey[]
  for (const mode of DIAGNOSTIC_MODES as AiQuizMode[]) {
    const scenarios = getAiScenarioOrder(mode).map(
      (scenarioId) => aiScenarioQuestions[scenarioId],
    )
    const likertQuestions = getAiCoreQuestions(mode)
    // Reinitialize per mode so the existing Advanced seed remains unchanged.
    const aiRng = makeRng(RANDOM_SEED + 2000)
    const archetypeCounts: Record<string, number> = {}
    const finalAxisSums = Object.fromEntries(axes.map((axis) => [axis, 0])) as Record<
      AiAxisKey,
      number
    >
    const finalAxisMin = Object.fromEntries(
      axes.map((axis) => [axis, Infinity]),
    ) as Record<AiAxisKey, number>
    const finalAxisMax = Object.fromEntries(
      axes.map((axis) => [axis, -Infinity]),
    ) as Record<AiAxisKey, number>
    const floorCounts = Object.fromEntries(
      axes.map((axis) => [axis, 0]),
    ) as Record<AiAxisKey, number>
    const ceilingCounts = Object.fromEntries(
      axes.map((axis) => [axis, 0]),
    ) as Record<AiAxisKey, number>

    for (let respondentIndex = 0; respondentIndex < RANDOM_N; respondentIndex += 1) {
      const answers: AiAnswers = {}
      for (const question of likertQuestions) {
        answers[question.id] = 1 + Math.floor(aiRng() * 7)
      }
      for (const scenario of scenarios) {
        const options = getScenarioOptions(scenario, mode)
        const option = options[Math.floor(aiRng() * options.length)]
        answers[scenario.id] = option.id
      }

      const result = generateAiGovernanceResult(answers, mode)
      archetypeCounts[result.archetypeLabel] =
        (archetypeCounts[result.archetypeLabel] ?? 0) + 1
      for (const axis of axes) {
        const score = result.axisScores[axis]
        finalAxisSums[axis] += score
        finalAxisMin[axis] = Math.min(finalAxisMin[axis], score)
        finalAxisMax[axis] = Math.max(finalAxisMax[axis], score)
        if (score === 1) floorCounts[axis] += 1
        if (score === 7) ceilingCounts[axis] += 1
      }
    }

    console.log("\n" + "=".repeat(74))
    console.log(
      `AI GOVERNANCE DIAGNOSTIC  ${modeLabel(mode)} ` +
        `(${RANDOM_N} seeded primary-only respondents)`,
    )
    console.log("=".repeat(74))
    console.log(
      "\nOmitted scenario signals are zero in the product scorer and are treated as " +
        `zero here. ${modeLabel(mode)} uses the same option set as the runtime. ` +
        "Optional backup choices are left blank in this primary-only baseline.",
    )
    console.log(
      "\n| Axis | Exact scenario delta / card | Exact scenario delta total | " +
        "Scenario delta min | Scenario delta max | Exact final mean | " +
        "Seeded final mean | Observed min | Observed max | Exact floor | " +
        "Exact ceiling | Seeded floor | Seeded ceiling |",
    )
    console.log(
      "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | " +
        "---: | ---: | ---: | ---: |",
    )
    for (const axis of axes) {
      const extrema = getAiScenarioExtrema(scenarios, mode, axis)
      const exactDelta = getExactAiScenarioDelta(scenarios, mode, axis)
      const exactFinal = getExactAiFinalDistribution(
        likertQuestions,
        scenarios,
        mode,
        axis,
      )
      console.log(
        `| ${axis} | ${(exactDelta / scenarios.length).toFixed(3)} | ` +
          `${exactDelta.toFixed(3)} | ${extrema.minimum.toFixed(2)} | ` +
          `${extrema.maximum.toFixed(2)} | ${exactFinal.mean.toFixed(3)} | ` +
          `${(finalAxisSums[axis] / RANDOM_N).toFixed(3)} | ` +
          `${finalAxisMin[axis].toFixed(2)} | ${finalAxisMax[axis].toFixed(2)} | ` +
          `${(exactFinal.floorShare * 100).toFixed(1)}% | ` +
          `${(exactFinal.ceilingShare * 100).toFixed(1)}% | ` +
          `${pct(floorCounts[axis], RANDOM_N)} | ` +
          `${pct(ceilingCounts[axis], RANDOM_N)} |`,
      )
      const subject = `ai-governance.${mode}.${axis}`
      measurementGateFindings.push(
        ...findAttainableRangeFindings(
          `${subject}.final`,
          exactFinal.minimum,
          exactFinal.maximum,
          3,
        ),
        ...findAttainableRangeFindings(
          `${subject}.scenario-delta`,
          extrema.minimum,
          extrema.maximum,
          0.8,
        ),
        ...findPoleAccessFindings(
          `${subject}.scenario-delta`,
          extrema.minimum,
          extrema.maximum,
          0,
        ),
        ...findUniformMeanCenteringFindings(
          `${subject}.final`,
          exactFinal.mean,
          exactFinal.minimum,
          exactFinal.maximum,
          0.3,
        ),
        ...findSaturationFindings(
          `${subject}.final`,
          exactFinal.floorShare,
          exactFinal.ceilingShare,
          0.1,
        ),
      )
    }

    console.log(`\nPer-card ${modeLabel(mode)} option-set audit`)
    printSignalTableHeader(0)
    for (const scenario of scenarios) {
      const options = getScenarioOptions(scenario, mode)
      for (const axis of scenario.discriminatingAxes) {
        const stats = getOptionSignalStats(
          options,
          (option) => getAiOptionSignal(option, axis),
          0,
        )
        console.log(
          `| ${scenario.id} | ${axis} | ${options.length} | ` +
            `${stats.minimum.toFixed(2)} | ${stats.maximum.toFixed(2)} | ` +
            `${stats.spread.toFixed(2)} | ${stats.mean.toFixed(2)} | ` +
            `${stats.straddles ? "yes" : "NO"} |`,
        )
      }
    }

    console.log(`\n${modeLabel(mode)} Likert reverse-coding ratios`)
    console.log("| Axis | Reverse-coded | Total | Ratio | Meets 40%? |")
    console.log("| --- | ---: | ---: | ---: | :---: |")
    for (const axis of axes) {
      const questions = likertQuestions.filter((question) => question.axis === axis)
      const reversed = questions.filter((question) => question.reverse === true).length
      const ratio = questions.length === 0 ? 0 : reversed / questions.length
      console.log(
        `| ${axis} | ${reversed} | ${questions.length} | ` +
          `${(ratio * 100).toFixed(1)}% | ${ratio >= 0.4 ? "yes" : "NO"} |`,
      )
      measurementGateFindings.push(
        ...findReverseCodingFindings(
          `ai-governance.${mode}.${axis}`,
          ratio,
          0.4,
        ),
      )
    }

    report(
      `${modeLabel(mode)} primary-only AI archetype distribution`,
      archetypeCounts,
    )
    const [modalArchetype, modalCount] = Object.entries(archetypeCounts).sort(
      (left, right) => right[1] - left[1],
    )[0]
    console.log(
      `\nModal ${modeLabel(mode)} primary-only AI archetype: ` +
        `${modalArchetype} (${pct(modalCount, RANDOM_N)}).`,
    )
    measurementGateFindings.push(
      ...findConcentrationFindings(
        `ai-governance.${mode}.archetype`,
        modalCount / RANDOM_N,
        0.4,
      ),
    )
  }
}

function getAiScenarioExtrema(
  scenarios: AiScenarioQuestion[],
  mode: AiQuizMode,
  axis: AiAxisKey,
) {
  return scenarios.reduce(
    (accumulator, scenario) => {
      const values = getScenarioOptions(scenario, mode)
        .map((option) => getAiOptionSignal(option, axis))
      accumulator.minimum += Math.min(...values)
      accumulator.maximum += Math.max(...values)
      return accumulator
    },
    { minimum: 0, maximum: 0 },
  )
}

function getExactAiScenarioDelta(
  scenarios: AiScenarioQuestion[],
  mode: AiQuizMode,
  axis: AiAxisKey,
) {
  return scenarios.reduce((total, scenario) => {
    const options = getScenarioOptions(scenario, mode)
    const mean = options.reduce(
      (sum, option) => sum + getAiOptionSignal(option, axis),
      0,
    ) / options.length
    return total + mean
  }, 0)
}

function addProbability(
  distribution: Map<number, number>,
  value: number,
  probability: number,
) {
  const key = Number(value.toFixed(10))
  distribution.set(key, (distribution.get(key) ?? 0) + probability)
}

function summariseExactDistribution(
  distribution: Map<number, number>,
): ExactAxisDistribution {
  const entries = [...distribution.entries()]
  const scores = entries.map(([score]) => score)
  return {
    mean: entries.reduce(
      (mean, [score, probability]) => mean + score * probability,
      0,
    ),
    minimum: Math.min(...scores),
    maximum: Math.max(...scores),
    floorShare: distribution.get(1) ?? 0,
    ceilingShare: distribution.get(7) ?? 0,
  }
}

function getExactAiFinalDistribution(
  likertQuestions: AiLikertQuestion[],
  scenarios: AiScenarioQuestion[],
  mode: AiQuizMode,
  axis: AiAxisKey,
): ExactAxisDistribution {
  const axisQuestions = likertQuestions.filter((question) => question.axis === axis)
  let sumDistribution = new Map<number, number>([[0, 1]])

  for (const question of axisQuestions) {
    const next = new Map<number, number>()
    for (const [sum, probability] of sumDistribution) {
      for (let rawValue = 1; rawValue <= 7; rawValue += 1) {
        addProbability(
          next,
          sum + scoreLikert(rawValue, question.reverse),
          probability / 7,
        )
      }
    }
    sumDistribution = next
  }

  let scoreDistribution = new Map<number, number>()
  if (axisQuestions.length === 0) {
    scoreDistribution.set(4, 1)
  } else {
    for (const [sum, probability] of sumDistribution) {
      addProbability(
        scoreDistribution,
        Number((sum / axisQuestions.length).toFixed(2)),
        probability,
      )
    }
  }

  for (const scenario of scenarios) {
    const options = getScenarioOptions(scenario, mode)
    const next = new Map<number, number>()
    for (const [score, probability] of scoreDistribution) {
      for (const option of options) {
        const adjusted = Math.min(
          Math.max(score + getAiOptionSignal(option, axis), 1),
          7,
        )
        addProbability(next, adjusted, probability / options.length)
      }
    }
    scoreDistribution = next
  }

  return summariseExactDistribution(scoreDistribution)
}

function printMeasurementGateFindings() {
  const findings = [
    ...new Map(
      measurementGateFindings.map((finding) => [finding.message, finding]),
    ).values(),
  ]
  const qualifications = [
    ...new Map(
      qualificationFindings.map((finding) => [finding.message, finding]),
    ).values(),
  ]
  const reviews = [
    ...new Map(
      compromiseReviewFindings.map((finding) => [finding.message, finding]),
    ).values(),
  ]

  console.log("\n" + "=".repeat(74))
  console.log(
    MEASUREMENT_GATES_BLOCKING
      ? "V22 MEASUREMENT GATE FINDINGS · BLOCKING"
      : "V22 MEASUREMENT GATE FINDINGS · REPORTING ONLY UNTIL END OF 2C",
  )
  console.log("=".repeat(74))
  console.log(`\nCurrent failures: ${findings.length}`)
  if (findings.length === 0) {
    console.log("- none")
  } else {
    for (const finding of findings) {
      console.log(`- [${finding.code}] ${finding.message}`)
    }
  }
  console.log(
    `\nItems with no qualifying discriminating axis: ` +
      `${qualifications.length}`,
  )
  for (const finding of qualifications) {
    console.log(`- [${finding.code}] ${finding.message}`)
  }
  console.log(
    `\nGeometric-compromise review findings (permanently non-blocking): ` +
      `${reviews.length}`,
  )
  for (const finding of reviews) {
    console.log(`- [${finding.code}] ${finding.message}`)
  }

  if (
    MEASUREMENT_GATES_BLOCKING &&
    (findings.length > 0 || qualifications.length > 0)
  ) {
    process.exitCode = 1
  }
}

if (SHOW_MODULES) {
  collectModuleItemFindings()
  runModuleDiagnostics()
}
if (SHOW_AI) {
  collectAiItemFindings()
  runAiDiagnostics()
}
if (SHOW_MODULES || SHOW_AI) printMeasurementGateFindings()

const foundationSpecificFlagRequested =
  SHOW_CALIBRATION ||
  SHOW_GAPS ||
  SHOW_PERCENTILES ||
  SHOW_SENSITIVITY ||
  SHOW_STABILITY ||
  SHOW_ORDER_BIAS

if ((SHOW_MODULES || SHOW_AI) && !foundationSpecificFlagRequested) {
  process.exit(process.exitCode ?? 0)
}

// ---------------------------------------------------------------- part 1

console.log("=".repeat(74))
console.log("PART 1  Response-style respondents")
console.log("=".repeat(74))
console.log(
  "\nFlat response styles should be family-invariant across Likert levels.\n" +
  "Changing the choice-profile shape should still be able to change family.",
)

const alwaysFirst = () => 0
const alwaysLast = (options: { id: string }[]) => options.length - 1

summarise("YEA-SAYER  (Likert 6, always first option)", buildAnswers(6, alwaysFirst))
summarise("NAY-SAYER  (Likert 2, always first option)", buildAnswers(2, alwaysFirst))
summarise("MIDPOINTER (Likert 4, always first option)", buildAnswers(4, alwaysFirst))
summarise("YEA + LAST (Likert 6, always last option)", buildAnswers(6, alwaysLast))
summarise("EXTREME AGREE (Likert 7, always first option)", buildAnswers(7, alwaysFirst))
summarise("EXTREME DISAGREE (Likert 1, always first option)", buildAnswers(1, alwaysFirst))

// ---------------------------------------------------------------- part 2

console.log("\n" + "=".repeat(74))
console.log(`PART 2  ${RANDOM_N} random respondents`)
console.log("=".repeat(74))

const rng = makeRng(RANDOM_SEED)

const familyCounts: Record<string, number> = {}
const strategyCounts: Record<string, number> = {}
const normCounts: Record<string, number> = {}
const labelCounts: Record<string, number> = {}
const dimMin: Record<string, number> = {}
const dimMax: Record<string, number> = {}
const dimSum: Record<string, number> = {}
const dimSumSquares: Record<string, number> = {}
const familyScoreGaps: number[] = []
const narrativeStateCounts: Record<string, number> = {}
const randomDimensionScores: DimensionScores[] = []
const randomRespondentAnswers: Answers[] = []
const randomRespondentPlans: Array<{
  likertValues: Record<string, number>
  positions: Record<string, number>
}> = []

for (const key of DIMENSION_KEYS) {
  dimMin[key] = Infinity
  dimMax[key] = -Infinity
  dimSum[key] = 0
  dimSumSquares[key] = 0
}

for (let i = 0; i < RANDOM_N; i += 1) {
  const likertValues: Record<string, number> = {}
  const positions: Record<string, number> = {}
  const answers = buildAnswers(
    (questionId) => {
      const value = 1 + Math.floor(rng() * 7)
      likertValues[questionId] = value
      return value
    },
    (options, questionId) => {
      const position = Math.floor(rng() * options.length)
      positions[questionId] = position
      return position
    },
  )
  randomRespondentPlans.push({ likertValues, positions })
  randomRespondentAnswers.push(answers)
  const scores = computeCoreDimensionScores(answers, MODE)
  const result = buildCanonicalFoundationResult(scores)
  const narrativeAssessment = assessFoundationNarrative(scores)
  const orderedFamilyScores = Object.values(result.familyScores).sort((a, b) => b - a)
  randomDimensionScores.push(scores)
  familyScoreGaps.push(orderedFamilyScores[0] - orderedFamilyScores[1])
  narrativeStateCounts[narrativeAssessment.state] =
    (narrativeStateCounts[narrativeAssessment.state] ?? 0) + 1

  familyCounts[result.familyLabel] = (familyCounts[result.familyLabel] ?? 0) + 1
  strategyCounts[result.strategyModifier] = (strategyCounts[result.strategyModifier] ?? 0) + 1
  normCounts[result.normativeModifier] = (normCounts[result.normativeModifier] ?? 0) + 1

  const label = `${result.familyLabel} / ${result.strategyModifier} / ${result.normativeModifier}`
  labelCounts[label] = (labelCounts[label] ?? 0) + 1

  for (const key of DIMENSION_KEYS) {
    dimMin[key] = Math.min(dimMin[key], scores[key])
    dimMax[key] = Math.max(dimMax[key], scores[key])
    dimSum[key] += scores[key]
    dimSumSquares[key] += scores[key] ** 2
  }
}

function report(title: string, counts: Record<string, number>) {
  console.log(`\n${title}`)
  for (const [key, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${pad(key, 46)} ${padLeft(pct(count, RANDOM_N), 7)}  ${bar(count / RANDOM_N)}`)
  }
}

report("Family distribution", familyCounts)
report("Strategy modifier distribution", strategyCounts)
report("Normative modifier distribution", normCounts)
report("Full three-part label distribution (top rows)", labelCounts)

if (SHOW_ORDER_BIAS) {
  const randomisedFamilyCounts: Record<string, number> = {}

  for (const [respondentIndex, plan] of randomRespondentPlans.entries()) {
    const answers = buildAnswers(
      (questionId) => plan.likertValues[questionId] ?? 4,
      (_options, questionId) => plan.positions[questionId] ?? 0,
      1,
      `order-bias-${RANDOM_SEED}-${respondentIndex}`,
    )
    const result = buildCanonicalFoundationResult(
      computeCoreDimensionScores(answers, MODE),
    )
    randomisedFamilyCounts[result.familyLabel] =
      (randomisedFamilyCounts[result.familyLabel] ?? 0) + 1
  }

  console.log("\n" + "=".repeat(74))
  console.log("ORDER BIAS  Fixed versus seeded-randomised option presentation")
  console.log("=".repeat(74))
  console.log(
    `\nN=${RANDOM_N}, respondent seed=${RANDOM_SEED}, mode=${MODE}. ` +
    "Each paired respondent keeps the same Likert values and choice positions.\n",
  )
  report("Fixed-order family distribution", familyCounts)
  report("Randomised-order family distribution", randomisedFamilyCounts)

  console.log("\nResponse-style respondents under randomised option order")
  const randomisedStyles = [
    { label: "YEA-SAYER  (Likert 6, always first position)", likert: 6, pick: alwaysFirst },
    { label: "NAY-SAYER  (Likert 2, always first position)", likert: 2, pick: alwaysFirst },
    { label: "MIDPOINTER (Likert 4, always first position)", likert: 4, pick: alwaysFirst },
    { label: "YEA + LAST (Likert 6, always last position)", likert: 6, pick: alwaysLast },
    { label: "EXTREME AGREE (Likert 7, always first position)", likert: 7, pick: alwaysFirst },
    { label: "EXTREME DISAGREE (Likert 1, always first position)", likert: 1, pick: alwaysFirst },
  ]

  for (const [styleIndex, style] of randomisedStyles.entries()) {
    summarise(
      `${style.label}; order seed ${styleIndex + 1}`,
      buildAnswers(
        style.likert,
        style.pick,
        1,
        `order-bias-style-${RANDOM_SEED}-${styleIndex}`,
      ),
    )
  }
}

console.log("\nObserved dimension range across random respondents")
console.log(
  `  ${pad("dimension", 22)} ${padLeft("min", 6)} ${padLeft("max", 6)} ` +
  `${padLeft("mean", 6)} ${padLeft("sd", 6)} ${padLeft("span", 6)}`,
)
for (const key of DIMENSION_KEYS) {
  const span = dimMax[key] - dimMin[key]
  const sd = populationStandardDeviation(dimSum[key], dimSumSquares[key], RANDOM_N)
  console.log(
    `  ${pad(key, 22)} ${padLeft(dimMin[key].toFixed(2), 6)} ${padLeft(dimMax[key].toFixed(2), 6)} ` +
    `${padLeft((dimSum[key] / RANDOM_N).toFixed(2), 6)} ${padLeft(sd.toFixed(2), 6)} ` +
    `${padLeft(span.toFixed(2), 6)}`,
  )
}

if (SHOW_GAPS) {
  const gapSum = familyScoreGaps.reduce((sum, gap) => sum + gap, 0)
  const gapSumSquares = familyScoreGaps.reduce((sum, gap) => sum + gap ** 2, 0)

  console.log("\nTop-two family-score gap distribution")
  console.log(`  Sample: N=${RANDOM_N}, seed=${RANDOM_SEED}, mode=${MODE}`)
  console.log("  Linear interpolation at rank (N - 1) × p")
  console.log(`  ${pad("statistic", 12)} ${padLeft("gap", 10)}`)
  for (const [label, value] of [
    ["min", Math.min(...familyScoreGaps)],
    ["max", Math.max(...familyScoreGaps)],
    ["mean", gapSum / RANDOM_N],
    [
      "sd",
      populationStandardDeviation(gapSum, gapSumSquares, RANDOM_N),
    ],
    ["p10", percentile(familyScoreGaps, 0.1)],
    ["p25", percentile(familyScoreGaps, 0.25)],
    ["p50", percentile(familyScoreGaps, 0.5)],
    ["p75", percentile(familyScoreGaps, 0.75)],
    ["p90", percentile(familyScoreGaps, 0.9)],
  ] as const) {
    console.log(`  ${pad(label, 12)} ${padLeft(value.toFixed(6), 10)}`)
  }

  report("Foundation narrative-state distribution", narrativeStateCounts)
}

if (SHOW_CALIBRATION) {
  console.log("\nCalibration object")
  console.log("export const NEUTRAL_BASELINE = {")
  for (const key of DIMENSION_KEYS) {
    const mean = dimSum[key] / RANDOM_N
    const sd = populationStandardDeviation(dimSum[key], dimSumSquares[key], RANDOM_N)
    console.log(`  ${key}: { mean: ${mean}, sd: ${sd} },`)
  }
  console.log("} as const")
}

if (SHOW_PERCENTILES) {
  console.log("\nDimension percentiles across seeded random respondents")
  console.log("  Linear interpolation at rank (N - 1) × p")
  console.log(
    `  ${pad("dimension", 22)} ${padLeft("p33", 10)} ${padLeft("p67", 10)}`,
  )
  for (const key of DIMENSION_KEYS) {
    const values = randomDimensionScores.map((scores) => scores[key])
    console.log(
      `  ${pad(key, 22)} ${padLeft(percentile(values, 0.33).toFixed(6), 10)} ` +
      `${padLeft(percentile(values, 0.67).toFixed(6), 10)}`,
    )
  }
}

if (SHOW_SENSITIVITY) {
  console.log("\n" + "=".repeat(74))
  console.log("SENSITIVITY SWEEP  One dimension held at its neutral baseline")
  console.log("=".repeat(74))

  const [baselineTopFamily, baselineTopCount] = Object.entries(familyCounts)
    .sort((a, b) => b[1] - a[1])[0]
  const sensitivityRows: {
    dimension: DimensionKey
    resultingTopFamily: string
    resultingTopShare: number
    baselineTopShare: number
    changePercentagePoints: number
  }[] = []

  for (const dimension of DIMENSION_KEYS) {
    const counts: Record<string, number> = {}

    for (const dimensionScores of randomDimensionScores) {
      const neutralisedScores = {
        ...dimensionScores,
        [dimension]: NEUTRAL_BASELINE[dimension].mean,
      }
      const result = buildCanonicalFoundationResult(neutralisedScores)
      counts[result.familyLabel] = (counts[result.familyLabel] ?? 0) + 1
    }

    report(`Family distribution with ${dimension} neutralised`, counts)

    const [resultingTopFamily, resultingTopCount] = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])[0]
    const neutralisedBaselineTopCount = counts[baselineTopFamily] ?? 0

    sensitivityRows.push({
      dimension,
      resultingTopFamily,
      resultingTopShare: resultingTopCount / RANDOM_N,
      baselineTopShare: neutralisedBaselineTopCount / RANDOM_N,
      changePercentagePoints:
        ((neutralisedBaselineTopCount - baselineTopCount) / RANDOM_N) * 100,
    })
  }

  console.log(`\nBaseline top family: ${baselineTopFamily} (${pct(baselineTopCount, RANDOM_N)})`)
  console.log(
    `  ${pad("neutralised dimension", 24)} ${pad("resulting leader", 32)} ` +
    `${padLeft("leader", 8)} ${padLeft(`${baselineTopFamily} share`, 32)} ${padLeft("move", 9)}`,
  )
  for (const row of sensitivityRows) {
    const signedMove = `${row.changePercentagePoints >= 0 ? "+" : ""}` +
      `${row.changePercentagePoints.toFixed(1)} pp`
    console.log(
      `  ${pad(row.dimension, 24)} ${pad(row.resultingTopFamily, 32)} ` +
      `${padLeft(pct(row.resultingTopShare * RANDOM_N, RANDOM_N), 8)} ` +
      `${padLeft(pct(row.baselineTopShare * RANDOM_N, RANDOM_N), 32)} ` +
      `${padLeft(signedMove, 9)}`,
    )
  }
}

if (SHOW_STABILITY) {
  const stabilityRng = makeRng(STABILITY_SEED)
  const levels = [
    { label: "light", changeCount: 2 },
    { label: "moderate", changeCount: 5 },
    { label: "heavy", changeCount: 10 },
  ] as const
  const outcomeColumns: {
    key: keyof StabilitySnapshot
    label: string
  }[] = [
    { key: "familyLabel", label: "Family label" },
    { key: "strategyModifier", label: "Strategy modifier" },
    { key: "normativeModifier", label: "Normative modifier" },
    { key: "fullLabel", label: "Full three-part label" },
    { key: "narrativeState", label: "Narrative differentiation state" },
  ]
  const rows = levels.map((level) => {
    const changedCounts = Object.fromEntries(
      outcomeColumns.map(({ key }) => [key, 0]),
    ) as Record<keyof StabilitySnapshot, number>

    for (const answers of randomRespondentAnswers) {
      const baseline = getStabilitySnapshot(answers)
      const perturbed = getStabilitySnapshot(
        perturbAnswers(answers, level.changeCount, stabilityRng),
      )

      for (const { key } of outcomeColumns) {
        if (baseline[key] !== perturbed[key]) {
          changedCounts[key] += 1
        }
      }
    }

    return { ...level, changedCounts }
  })

  console.log("\n" + "=".repeat(74))
  console.log("STABILITY  Test-retest label changes under answer perturbation")
  console.log("=".repeat(74))
  console.log(
    `\nN=${RANDOM_N}, respondent seed=${RANDOM_SEED}, perturbation seed=${STABILITY_SEED}, ` +
    `${FOUNDATION_QUESTIONS.length} answers per respondent\n`,
  )
  console.log(
    `| Perturbation level | ${outcomeColumns.map(({ label }) => label).join(" | ")} |`,
  )
  console.log(
    `| --- | ${outcomeColumns.map(() => "---:").join(" | ")} |`,
  )
  for (const row of rows) {
    console.log(
      `| ${row.label} (${row.changeCount} answers) | ` +
      `${outcomeColumns
        .map(({ key }) => pct(row.changedCounts[key], RANDOM_N))
        .join(" | ")} |`,
    )
  }

  console.log(`
Interpretation
  A label flipping on a 2-answer change out of ${FOUNDATION_QUESTIONS.length} is not stable
  enough to present as a discrete type. Family should be more stable than the
  modifiers because it aggregates seven dimensions, while each modifier reads one.
`)
}

// ---------------------------------------------------------------- part 3

console.log("\n" + "=".repeat(74))
console.log("PART 3  Reachability of each family")
console.log("=".repeat(74))
console.log(
  "\nDirectly constructs the ideal dimension profile for each family and checks\n" +
  "whether the scorer actually returns that family.",
)

const idealProfiles: Record<FamilyKey, Partial<Record<DimensionKey, number>>> = {
  realist: {
    securityCompetition: 7, institutions: 1, domesticFilters: 2,
    normsIdentity: 1, politicalEconomy: 4, restraint: 1, orderJustice: 6,
  },
  institutionalist: {
    securityCompetition: 2, institutions: 7, domesticFilters: 6,
    normsIdentity: 5, politicalEconomy: 4, restraint: 6, orderJustice: 5,
  },
  constructivist: {
    securityCompetition: 3, institutions: 5, domesticFilters: 4,
    normsIdentity: 7, politicalEconomy: 4, restraint: 5, orderJustice: 5,
  },
  criticalPoliticalEconomy: {
    securityCompetition: 3, institutions: 1, domesticFilters: 6,
    normsIdentity: 4, politicalEconomy: 7, restraint: 4, orderJustice: 2,
  },
}

for (const [family, profile] of Object.entries(idealProfiles) as [FamilyKey, Record<DimensionKey, number>][]) {
  const scores = DIMENSION_KEYS.reduce((acc, key) => {
    acc[key] = profile[key] ?? 4
    return acc
  }, {} as Record<DimensionKey, number>)

  const result = buildCanonicalFoundationResult(scores as never)
  const match = result.familyKey === family ? "REACHABLE" : "*** NOT REACHABLE ***"
  console.log(`\n  target: ${pad(family, 26)} got: ${pad(result.familyKey, 26)} ${match}`)
  console.log(
    `    scores: ${(Object.entries(result.familyScores) as [FamilyKey, number][])
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}=${v.toFixed(2)}`)
      .join("  ")}`,
  )
}

console.log("\n" + "=".repeat(74))
console.log("Interpretation guide")
console.log("=".repeat(74))
console.log(`
  Part 1: YEA-SAYER, NAY-SAYER, MIDPOINTER, and the two extreme flat
          styles should return the same family because they differ only
          in response level. YEA + LAST should differ when the changed
          choice profile creates a different cross-dimension shape.

  Part 2: if any single family exceeds 40% of random respondents, the
          family weight matrix is skewed. If any single three-part label
          exceeds 25%, the label is close to constant across users and
          is not carrying information.

          The "span" column is the real usable range of each score. If
          span is well under 6.00, the 1-7 presentation is misleading and
          band descriptors need recalibrating against the real range.

  Part 3: any family marked NOT REACHABLE cannot be produced even by a
          respondent with the textbook profile for it. That is a scoring
          bug, not a finding about respondents.
`)
