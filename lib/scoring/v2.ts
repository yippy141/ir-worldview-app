/** Immutable Foundation scoring implementation v2. */

import foundationBankJson from "@/content/instrument/foundation.v2.json" with {
  type: "json",
}
import {
  getV2ScoringCalibration,
  type FoundationScoringCalibration,
} from "@/lib/scoring/v2-calibration"
export {
  CORE_NEUTRAL_BASELINE,
  CORE_NORMATIVE_LOWER_THRESHOLD,
  CORE_NORMATIVE_UPPER_THRESHOLD,
  CORE_STRATEGY_LOWER_THRESHOLD,
  CORE_STRATEGY_UPPER_THRESHOLD,
  foundationScoringCalibrationForForm,
  getV2ScoringCalibration,
  NORMATIVE_LOWER_THRESHOLD,
  NORMATIVE_UPPER_THRESHOLD,
  STRATEGY_LOWER_THRESHOLD,
  STRATEGY_UPPER_THRESHOLD,
} from "@/lib/scoring/v2-calibration"
export type { FoundationScoringCalibration } from "@/lib/scoring/v2-calibration"
import type {
  Answers,
  AnswerValue,
  ChoiceQuestion,
  CoreLikertQuestion,
  DimensionKey,
  DimensionScores,
  FamilyKey,
  Question,
  QuizMode,
  QuizResult,
  StrategyModifier,
  NormativeModifier,
  RankedChoiceAnswer,
} from "@/lib/types"

export const FOUNDATION_SCORING_VERSION = 2

type FoundationDataItem = Question & { modes: QuizMode[] }

const FOUNDATION_ITEMS =
  foundationBankJson.items as unknown as FoundationDataItem[]
const DIMENSIONS: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]
const SECOND_CHOICE_WEIGHT = 0.45
const MIN_CALIBRATION_SD = 1e-9

export const familyProfiles: Record<FamilyKey, Partial<Record<DimensionKey, number>>> = {
  realist: {
    securityCompetition: 0.9174195544554454,
    institutions: -0.4186881188118812,
    domesticFilters: -0.1600866336633663,
    normsIdentity: -0.33248762376237617,
    politicalEconomy: 0.09851485148514853,
    restraint: -0.33248762376237617,
    orderJustice: 0.22781559405940596,
  },
  institutionalist: {
    securityCompetition: -0.5973273026315788,
    institutions: 0.7773437499999998,
    domesticFilters: 0.31912006578947355,
    normsIdentity: -0.1963815789473684,
    politicalEconomy: -0.1963815789473684,
    restraint: 0.14728618421052625,
    orderJustice: -0.25365953947368414,
  },
  constructivist: {
    securityCompetition: -0.6960435779816515,
    institutions: 0.022821100917431204,
    domesticFilters: -0.21680045871559633,
    normsIdentity: 1.2209288990825689,
    politicalEconomy: -0.21680045871559633,
    restraint: -0.05705275229357796,
    orderJustice: -0.05705275229357796,
  },
  criticalPoliticalEconomy: {
    securityCompetition: -0.2551282051282051,
    institutions: -0.5899839743589743,
    domesticFilters: 0.4703926282051282,
    normsIdentity: 0.023918269230769205,
    politicalEconomy: 0.7494391025641026,
    restraint: -0.03189102564102565,
    orderJustice: -0.3667467948717949,
  },
}

const familyLabels: Record<FamilyKey, string> = {
  realist: "Strategic Realist",
  institutionalist: "Liberal Institutionalist",
  constructivist: "Social Constructivist",
  criticalPoliticalEconomy: "Critical Political Economist",
}

export const familyDescriptions: Record<FamilyKey, string> = {
  realist:
    "You treat uncertainty, rivalry, and positional advantage as durable constraints, and you are comparatively skeptical that institutions or norms can fully tame them.",
  institutionalist:
    "You think institutions, domestic filters, and strategic restraint matter a great deal, but you are not naive about power or capture.",
  constructivist:
    "You give major causal weight to identity, recognition, and legitimacy, and you think the meaning of rivalry is shaped socially rather than fixed in advance.",
  criticalPoliticalEconomy:
    "You read world politics less as a neutral arena than as a hierarchy shaped by leverage, dependence, and unequal control over production and finance.",
}

export type CoreDimensionAudit = {
  sums: Record<DimensionKey, number>
  weights: Record<DimensionKey, number>
  rawAverages: Record<DimensionKey, number>
  roundedAverages: DimensionScores
}

export type ScoreShapeAnalysis = {
  familyScores: Record<FamilyKey, number>
  orderedFamilies: [FamilyKey, number][]
  nearestFitGap: number
  averageDistanceFromCenter: number
  maxDistanceFromCenter: number
  sharpDimensionCount: number
}

export function scoreLikert(rawValue: number, reverse?: boolean): number {
  if (rawValue < 1 || rawValue > 7) {
    throw new Error(`Likert value must be between 1 and 7. Received: ${rawValue}`)
  }

  return reverse ? 8 - rawValue : rawValue
}

function collectLikertSignal(question: CoreLikertQuestion, raw: number) {
  return { dimension: question.dimension, value: scoreLikert(raw, question.reverse), weight: 1 }
}

function collectChoiceSignals(question: ChoiceQuestion, answer: string) {
  const option = question.options.find((candidate) => candidate.id === answer)
  if (!option) return []

  return (Object.entries(option.signals) as [DimensionKey, number][])
    .filter(([, value]) => typeof value === "number")
    .map(([dimension, value]) => ({ dimension, value }))
}

function collectQuestionSignals(
  question: Question,
  answer: AnswerValue | undefined,
  mode: QuizMode,
) {
  if (question.scoringBlock !== "core") {
    return []
  }

  if (question.kind === "likert") {
    return typeof answer === "number" ? [collectLikertSignal(question, answer)] : []
  }

  if (typeof answer === "string") {
    return collectChoiceSignals(question, answer).map((signal) => ({ ...signal, weight: 1 }))
  }

  if (!isRankedChoiceAnswer(answer)) {
    return []
  }

  const signals = collectChoiceSignals(question, answer.primary).map((signal) => ({
    ...signal,
    weight: 1,
  }))

  if (
    mode === "analyst" &&
    question.allowSecondChoiceInAnalyst &&
    answer.secondary &&
    answer.secondary !== answer.primary
  ) {
    signals.push(
      ...collectChoiceSignals(question, answer.secondary).map((signal) => ({
        ...signal,
        weight: SECOND_CHOICE_WEIGHT,
      })),
    )
  }

  return signals
}

function createEmptyDimensionMap() {
  return {
    securityCompetition: 0,
    institutions: 0,
    domesticFilters: 0,
    normsIdentity: 0,
    politicalEconomy: 0,
    restraint: 0,
    orderJustice: 0,
  } as Record<DimensionKey, number>
}

function computeDimensionAggregates(
  answers: Answers,
  mode: QuizMode = "standard",
) {
  const sums = createEmptyDimensionMap()
  const weights = createEmptyDimensionMap()

  for (const question of getFoundationQuestions(mode)) {
    for (const signal of collectQuestionSignals(question, answers[question.id], mode)) {
      sums[signal.dimension] += signal.value * signal.weight
      weights[signal.dimension] += signal.weight
    }
  }

  return { sums, weights }
}

function getFoundationQuestions(mode: QuizMode): Question[] {
  const items = mode === "standard"
    ? FOUNDATION_ITEMS.filter((item) => item.modes.includes("standard"))
    : [
        ...FOUNDATION_ITEMS.filter((item) => item.modes.includes("standard")),
        ...FOUNDATION_ITEMS.filter(
          (item) =>
            item.modes.includes("analyst") &&
            !item.modes.includes("standard"),
        ),
      ]

  return items.map((item) => {
    const { modes, ...question } = item
    void modes
    return question
  })
}

function getRawDimensionAverages({
  sums,
  weights,
}: ReturnType<typeof computeDimensionAggregates>) {
  return DIMENSIONS.reduce((accumulator, dimension) => {
    accumulator[dimension] = weights[dimension] > 0
      ? sums[dimension] / weights[dimension]
      : 4
    return accumulator
  }, {} as Record<DimensionKey, number>)
}

export function computeCoreDimensionScores(
  answers: Answers,
  mode: QuizMode = "standard",
): DimensionScores {
  const rawAverages = getRawDimensionAverages(computeDimensionAggregates(answers, mode))
  return DIMENSIONS.reduce((accumulator, dimension) => {
    accumulator[dimension] = Number(rawAverages[dimension].toFixed(2))
    return accumulator
  }, {} as DimensionScores)
}

export function computeCoreDimensionAudit(
  answers: Answers,
  mode: QuizMode = "standard",
): CoreDimensionAudit {
  const aggregates = computeDimensionAggregates(answers, mode)
  const rawAverages = getRawDimensionAverages(aggregates)
  const roundedAverages = DIMENSIONS.reduce((accumulator, dimension) => {
    accumulator[dimension] = Number(rawAverages[dimension].toFixed(2))
    return accumulator
  }, {} as DimensionScores)

  return {
    sums: aggregates.sums,
    weights: aggregates.weights,
    rawAverages,
    roundedAverages,
  }
}

function standardise(
  score: number,
  dimension: DimensionKey,
  calibration: FoundationScoringCalibration,
): number {
  const { mean, sd } =
    getV2ScoringCalibration(calibration).neutralBaseline[dimension]

  if (Math.abs(sd) < MIN_CALIBRATION_SD) {
    console.warn(
      `[scoring] Calibration standard deviation for ${dimension} is near zero; falling back to 1.`,
    )
    return score - mean
  }

  return (score - mean) / sd
}

export function scoreFamilies(
  dimensionScores: DimensionScores,
  calibration: FoundationScoringCalibration = "extended",
): Record<FamilyKey, number> {
  return (Object.keys(familyProfiles) as FamilyKey[]).reduce((accumulator, family) => {
    const weights = familyProfiles[family]
    const score = DIMENSIONS.reduce((sum, dimension) => {
      const weight = weights[dimension] ?? 0
      return sum +
        standardise(dimensionScores[dimension], dimension, calibration) *
          weight
    }, 0)

    accumulator[family] = Number(score.toFixed(2))
    return accumulator
  }, {} as Record<FamilyKey, number>)
}

export function analyzeScoreShape(
  dimensionScores: DimensionScores,
  calibration: FoundationScoringCalibration = "extended",
): ScoreShapeAnalysis {
  const familyScores = scoreFamilies(dimensionScores, calibration)
  const orderedFamilies = (Object.entries(familyScores) as [FamilyKey, number][])
    .sort((a, b) => b[1] - a[1])
  const distances = Object.values(dimensionScores).map((score) => Math.abs(score - 4))
  const nearestFitGap = orderedFamilies[0][1] - orderedFamilies[1][1]
  const maxDistanceFromCenter = Math.max(...distances)
  const sharpDimensionCount = distances.filter((distance) => distance >= 1.15).length

  return {
    familyScores,
    orderedFamilies,
    nearestFitGap,
    averageDistanceFromCenter: distances.reduce((sum, distance) => sum + distance, 0) / distances.length,
    maxDistanceFromCenter,
    sharpDimensionCount,
  }
}

function getStrategyModifier(
  dimensionScores: DimensionScores,
  calibration: FoundationScoringCalibration,
): StrategyModifier {
  const restraint = dimensionScores.restraint
  const {
    strategyLowerThreshold: lowerThreshold,
    strategyUpperThreshold: upperThreshold,
  } = getV2ScoringCalibration(calibration)

  if (restraint >= upperThreshold) {
    return "Restrainer"
  }

  if (restraint <= lowerThreshold) {
    return "Maximizer"
  }

  return "Hedger"
}

function getNormativeModifier(
  dimensionScores: DimensionScores,
  calibration: FoundationScoringCalibration,
): NormativeModifier {
  const orderJustice = dimensionScores.orderJustice
  const {
    normativeLowerThreshold: lowerThreshold,
    normativeUpperThreshold: upperThreshold,
  } = getV2ScoringCalibration(calibration)

  if (orderJustice >= upperThreshold) {
    return "Pluralist"
  }

  if (orderJustice <= lowerThreshold) {
    return "Universalist"
  }

  return "Conditional Solidarist"
}

function getNeighboringFamily(familyKey: FamilyKey, familyScores: Record<FamilyKey, number>): string {
  const ordered = Object.entries(familyScores).sort((a, b) => b[1] - a[1]) as [FamilyKey, number][]
  const runnerUp = ordered.find(([key]) => key !== familyKey)
  return runnerUp ? familyLabels[runnerUp[0]] : familyLabels[familyKey]
}

export type CanonicalFoundationResult = QuizResult & {
  runnerUpKey: FamilyKey
  runnerUpLabel: string
  nearestFitGap: number
}

export function buildCanonicalFoundationResult(
  dimensionScores: DimensionScores,
  calibration: FoundationScoringCalibration = "extended",
): CanonicalFoundationResult {
  const familyScores = scoreFamilies(dimensionScores, calibration)
  const orderedFamilies = (Object.entries(familyScores) as [FamilyKey, number][])
    .sort((a, b) => b[1] - a[1])
  const familyKey = orderedFamilies[0][0]
  const runnerUpKey = orderedFamilies.find(([key]) => key !== familyKey)?.[0] ?? familyKey
  const familyLabel = familyLabels[familyKey]
  const strategyModifier = getStrategyModifier(dimensionScores, calibration)
  const normativeModifier = getNormativeModifier(dimensionScores, calibration)
  const neighboringFamily = getNeighboringFamily(familyKey, familyScores)

  return {
    familyKey,
    familyLabel,
    strategyModifier,
    normativeModifier,
    dimensionScores,
    familyScores,
    explanation: familyDescriptions[familyKey],
    neighboringFamily,
    runnerUpKey,
    runnerUpLabel: familyLabels[runnerUpKey],
    nearestFitGap: orderedFamilies[0][1] - orderedFamilies[1][1],
  }
}

export function generateResult(
  answers: Answers,
  mode: QuizMode = "standard",
  calibration: FoundationScoringCalibration = "extended",
): CanonicalFoundationResult {
  return buildCanonicalFoundationResult(
    computeCoreDimensionScores(answers, mode),
    calibration,
  )
}

export function getNeighboringFamilyKey(
  familyKey: FamilyKey,
  familyScores: Record<FamilyKey, number>,
): FamilyKey {
  const ordered = (Object.entries(familyScores) as [FamilyKey, number][])
    .sort((a, b) => b[1] - a[1])
  return ordered.find(([key]) => key !== familyKey)?.[0] ?? familyKey
}

function isRankedChoiceAnswer(value: AnswerValue | undefined): value is RankedChoiceAnswer {
  return typeof value === "object" && value !== null && typeof value.primary === "string"
}
