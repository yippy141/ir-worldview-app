/** Immutable Foundation scoring implementation v1. */

import foundationBankJson from "@/content/instrument/foundation.v2.json" with {
  type: "json",
}
import {
  familyDescriptions,
  familyProfiles,
  getNeighboringFamilyKey,
  type CanonicalFoundationResult,
  type CoreDimensionAudit,
  type ScoreShapeAnalysis,
} from "@/lib/scoring/v2"
import type {
  AnswerValue,
  Answers,
  ChoiceQuestion,
  CoreLikertQuestion,
  DimensionKey,
  DimensionScores,
  FamilyKey,
  NormativeModifier,
  Question,
  QuizMode,
  RankedChoiceAnswer,
  StrategyModifier,
} from "@/lib/types"

export const FOUNDATION_SCORING_VERSION = 1

export const STRATEGY_LOWER_THRESHOLD = 4.61
export const STRATEGY_UPPER_THRESHOLD = 4.85
export const NORMATIVE_LOWER_THRESHOLD = 4.12
export const NORMATIVE_UPPER_THRESHOLD = 4.42

const DIMENSIONS: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]
const V1_STANDARD_ITEM_IDS = new Set([
  "sc1",
  "in1",
  "df1",
  "ni1",
  "pe1",
  "rs1",
  "oj1",
  "tradeoff_alliances",
  "sc2",
  "in2",
  "tradeoff_interdependence",
  "df2",
  "ni2",
  "pe2",
  "rs2",
  "oj2",
  "tradeoff_strategy",
  "tradeoff_intervention",
  "case_semiconductors",
  "case_protection",
])
const V1_ANALYST_ITEM_IDS = new Set([
  "an_sc3",
  "an_in3",
  "an_pe3",
  "an_oj3",
  "an_sc4",
  "an_ni3",
  "an_pe4",
  "an_in4",
  "an_tradeoff_legitimacy",
  "an_tradeoff_rival",
  "an_case_finance",
  "an_case_burdens",
  "an_tradeoff_evidence",
  "an_tradeoff_tech_order",
  "an_case_middle_power",
  "an_case_green_finance",
  "an_case_maritime_crisis",
  "an_case_digital_stack",
  "an_tradeoff_parallel_order",
  "an_case_sanctions_alignment",
  "an_case_intervention_memory",
  "an_case_rising_power_voice",
  "an_tradeoff_energy_alignment",
  "an_tradeoff_ceasefire_settlement",
])
const FOUNDATION_ITEMS =
  foundationBankJson.items as unknown as Array<Question & { modes: QuizMode[] }>
const SECOND_CHOICE_WEIGHT = 0.45
const MIN_CALIBRATION_SD = 1e-9
const V1_NEUTRAL_BASELINE = {
  securityCompetition: { mean: 4.625600000000005, sd: 0.4968849363785998 },
  institutions: { mean: 4.627160000000002, sd: 0.20894098305496822 },
  domesticFilters: { mean: 5.225439999999994, sd: 0.3718542811372106 },
  normsIdentity: { mean: 4.728999999999997, sd: 0.49932975076598135 },
  politicalEconomy: { mean: 5.04672, sd: 0.307279093984641 },
  restraint: { mean: 4.736060000000002, sd: 0.24695966553259996 },
  orderJustice: { mean: 4.26404, sd: 0.298133658616421 },
} as const satisfies Record<DimensionKey, { mean: number; sd: number }>

const familyLabels: Record<FamilyKey, string> = {
  realist: "Strategic Realist",
  institutionalist: "Liberal Institutionalist",
  constructivist: "Social Constructivist",
  criticalPoliticalEconomy: "Critical Political Economist",
}

export {
  familyDescriptions,
  familyProfiles,
  getNeighboringFamilyKey,
}
export type {
  CanonicalFoundationResult,
  CoreDimensionAudit,
  ScoreShapeAnalysis,
}

export function scoreLikert(rawValue: number, reverse?: boolean): number {
  if (rawValue < 1 || rawValue > 7) {
    throw new Error(
      `Likert value must be between 1 and 7. Received: ${rawValue}`,
    )
  }

  return reverse ? 8 - rawValue : rawValue
}

function collectLikertSignal(question: CoreLikertQuestion, raw: number) {
  return {
    dimension: question.dimension,
    value: scoreLikert(raw, question.reverse),
    weight: 1,
  }
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
  if (question.scoringBlock !== "core") return []

  if (question.kind === "likert") {
    return typeof answer === "number"
      ? [collectLikertSignal(question, answer)]
      : []
  }

  if (typeof answer === "string") {
    return collectChoiceSignals(question, answer).map((signal) => ({
      ...signal,
      weight: 1,
    }))
  }

  if (!isRankedChoiceAnswer(answer)) return []

  const signals = collectChoiceSignals(question, answer.primary).map(
    (signal) => ({ ...signal, weight: 1 }),
  )

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

function getV1Questions(mode: QuizMode): Question[] {
  return FOUNDATION_ITEMS.filter((item) =>
    V1_STANDARD_ITEM_IDS.has(item.id) ||
    (mode === "analyst" && V1_ANALYST_ITEM_IDS.has(item.id)),
  )
}

function createEmptyDimensionMap() {
  return Object.fromEntries(
    DIMENSIONS.map((dimension) => [dimension, 0]),
  ) as Record<DimensionKey, number>
}

function computeDimensionAggregates(
  answers: Answers,
  mode: QuizMode = "standard",
) {
  const sums = createEmptyDimensionMap()
  const weights = createEmptyDimensionMap()

  for (const question of getV1Questions(mode)) {
    const signals = collectQuestionSignals(
      question,
      answers[question.id],
      mode,
    )
    for (const signal of signals) {
      sums[signal.dimension] += signal.value * signal.weight
      weights[signal.dimension] += signal.weight
    }
  }

  return { sums, weights }
}

function getRawDimensionAverages({
  sums,
  weights,
}: ReturnType<typeof computeDimensionAggregates>) {
  return DIMENSIONS.reduce((accumulator, dimension) => {
    accumulator[dimension] =
      weights[dimension] > 0 ? sums[dimension] / weights[dimension] : 4
    return accumulator
  }, {} as Record<DimensionKey, number>)
}

export function computeCoreDimensionScores(
  answers: Answers,
  mode: QuizMode = "standard",
): DimensionScores {
  const rawAverages = getRawDimensionAverages(
    computeDimensionAggregates(answers, mode),
  )
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

  return {
    sums: aggregates.sums,
    weights: aggregates.weights,
    rawAverages,
    roundedAverages: computeCoreDimensionScores(answers, mode),
  }
}

function standardise(score: number, dimension: DimensionKey): number {
  const { mean, sd } = V1_NEUTRAL_BASELINE[dimension]

  if (Math.abs(sd) < MIN_CALIBRATION_SD) {
    return score - mean
  }

  return (score - mean) / sd
}

export function scoreFamilies(
  dimensionScores: DimensionScores,
): Record<FamilyKey, number> {
  return (Object.keys(familyProfiles) as FamilyKey[]).reduce(
    (accumulator, family) => {
      const weights = familyProfiles[family]
      const score = DIMENSIONS.reduce((sum, dimension) => {
        const weight = weights[dimension] ?? 0
        return sum + standardise(dimensionScores[dimension], dimension) * weight
      }, 0)

      accumulator[family] = Number(score.toFixed(2))
      return accumulator
    },
    {} as Record<FamilyKey, number>,
  )
}

export function analyzeScoreShape(
  dimensionScores: DimensionScores,
): ScoreShapeAnalysis {
  const familyScores = scoreFamilies(dimensionScores)
  const orderedFamilies = (
    Object.entries(familyScores) as [FamilyKey, number][]
  ).sort((a, b) => b[1] - a[1])
  const distances = Object.values(dimensionScores).map((score) =>
    Math.abs(score - 4),
  )
  const nearestFitGap = orderedFamilies[0][1] - orderedFamilies[1][1]
  const maxDistanceFromCenter = Math.max(...distances)
  const sharpDimensionCount = distances.filter(
    (distance) => distance >= 1.15,
  ).length

  return {
    familyScores,
    orderedFamilies,
    nearestFitGap,
    averageDistanceFromCenter:
      distances.reduce((sum, distance) => sum + distance, 0) /
      distances.length,
    maxDistanceFromCenter,
    sharpDimensionCount,
  }
}

function getStrategyModifier(
  dimensionScores: DimensionScores,
): StrategyModifier {
  const restraint = dimensionScores.restraint

  if (restraint >= STRATEGY_UPPER_THRESHOLD) return "Restrainer"
  if (restraint <= STRATEGY_LOWER_THRESHOLD) return "Maximizer"
  return "Hedger"
}

function getNormativeModifier(
  dimensionScores: DimensionScores,
): NormativeModifier {
  const orderJustice = dimensionScores.orderJustice

  if (orderJustice >= NORMATIVE_UPPER_THRESHOLD) return "Pluralist"
  if (orderJustice <= NORMATIVE_LOWER_THRESHOLD) return "Universalist"
  return "Conditional Solidarist"
}

export function buildCanonicalFoundationResult(
  dimensionScores: DimensionScores,
): CanonicalFoundationResult {
  const familyScores = scoreFamilies(dimensionScores)
  const orderedFamilies = (
    Object.entries(familyScores) as [FamilyKey, number][]
  ).sort((a, b) => b[1] - a[1])
  const familyKey = orderedFamilies[0][0]
  const runnerUpKey =
    orderedFamilies.find(([key]) => key !== familyKey)?.[0] ?? familyKey
  const strategyModifier = getStrategyModifier(dimensionScores)
  const normativeModifier = getNormativeModifier(dimensionScores)

  return {
    familyKey,
    familyLabel: familyLabels[familyKey],
    strategyModifier,
    normativeModifier,
    dimensionScores,
    familyScores,
    explanation: familyDescriptions[familyKey],
    neighboringFamily: familyLabels[runnerUpKey],
    runnerUpKey,
    runnerUpLabel: familyLabels[runnerUpKey],
    nearestFitGap: orderedFamilies[0][1] - orderedFamilies[1][1],
  }
}

export function generateResult(
  answers: Answers,
  mode: QuizMode = "standard",
): CanonicalFoundationResult {
  return buildCanonicalFoundationResult(
    computeCoreDimensionScores(answers, mode),
  )
}

function isRankedChoiceAnswer(
  value: AnswerValue | undefined,
): value is RankedChoiceAnswer {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.primary === "string"
  )
}
