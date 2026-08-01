/**
 * Immutable Foundation scoring implementation v1.
 *
 * This preserves the production algorithm at tag pre-v21-20260728, including
 * its known CPE clamp. It exists only for historical link compatibility and
 * research replay; the current scorer must never import from this module.
 */

import foundationScoringV1Json from "@/content/instrument/foundation.scoring.v1.json" with {
  type: "json",
}
import type {
  AnswerValue,
  Answers,
  DimensionKey,
  DimensionScores,
  FamilyKey,
  NormativeModifier,
  QuizMode,
  QuizResult,
  RankedChoiceAnswer,
  StrategyModifier,
} from "@/lib/types"

export const FOUNDATION_SCORING_VERSION = 1

export const STRATEGY_LOWER_THRESHOLD = 3.85
export const STRATEGY_UPPER_THRESHOLD = 5.15
export const NORMATIVE_LOWER_THRESHOLD = 3.85
export const NORMATIVE_UPPER_THRESHOLD = 5.15

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
type V1LikertItem = {
  id: string
  kind: "likert"
  dimension: DimensionKey
  reverse: boolean
}
type V1ChoiceItem = {
  id: string
  kind: "tradeoff" | "miniCase"
  allowSecondChoiceInAnalyst: boolean
  options: Array<{
    id: string
    signals: Partial<Record<DimensionKey, number>>
  }>
}
type V1ScoringItem = V1LikertItem | V1ChoiceItem
const FOUNDATION_ITEMS =
  foundationScoringV1Json.items as unknown as V1ScoringItem[]
const SECOND_CHOICE_WEIGHT = 0.45

export const familyProfiles: Record<
  FamilyKey,
  Partial<Record<DimensionKey, number>>
> = {
  realist: {
    securityCompetition: 1,
    institutions: -0.55,
    domesticFilters: -0.25,
    normsIdentity: -0.45,
    politicalEconomy: 0.05,
    restraint: -0.45,
    orderJustice: 0.2,
  },
  institutionalist: {
    securityCompetition: -0.2,
    institutions: 1,
    domesticFilters: 0.6,
    normsIdentity: 0.15,
    politicalEconomy: 0.15,
    restraint: 0.45,
    orderJustice: 0.1,
  },
  constructivist: {
    securityCompetition: -0.2,
    institutions: 0.25,
    domesticFilters: 0.1,
    normsIdentity: 1,
    politicalEconomy: 0.1,
    restraint: 0.2,
    orderJustice: 0.2,
  },
  criticalPoliticalEconomy: {
    securityCompetition: -0.1,
    institutions: -0.4,
    domesticFilters: 0.55,
    normsIdentity: 0.15,
    politicalEconomy: 0.8,
    restraint: 0.1,
    orderJustice: -0.2,
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

export type CanonicalFoundationResult = QuizResult & {
  runnerUpKey: FamilyKey
  runnerUpLabel: string
  nearestFitGap: number
}

export function scoreLikert(rawValue: number, reverse?: boolean): number {
  if (rawValue < 1 || rawValue > 7) {
    throw new Error(
      `Likert value must be between 1 and 7. Received: ${rawValue}`,
    )
  }

  return reverse ? 8 - rawValue : rawValue
}

function collectLikertSignal(question: V1LikertItem, raw: number) {
  return {
    dimension: question.dimension,
    value: scoreLikert(raw, question.reverse),
    weight: 1,
  }
}

function collectChoiceSignals(question: V1ChoiceItem, answer: string) {
  const option = question.options.find((candidate) => candidate.id === answer)
  if (!option) return []

  return (Object.entries(option.signals) as [DimensionKey, number][])
    .filter(([, value]) => typeof value === "number")
    .map(([dimension, value]) => ({ dimension, value }))
}

function collectQuestionSignals(
  question: V1ScoringItem,
  answer: AnswerValue | undefined,
  mode: QuizMode,
) {
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

function getV1Questions(mode: QuizMode): V1ScoringItem[] {
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

function centerScore(score: number): number {
  return score - 4
}

function computeCriticalSystemicSignal(
  dimensionScores: DimensionScores,
): number {
  return Number(
    (
      centerScore(dimensionScores.politicalEconomy) * 0.55 +
      centerScore(dimensionScores.domesticFilters) * 0.25 -
      centerScore(dimensionScores.institutions) * 0.35 -
      centerScore(dimensionScores.orderJustice) * 0.15
    ).toFixed(2),
  )
}

export function scoreFamilies(
  dimensionScores: DimensionScores,
): Record<FamilyKey, number> {
  const scores = (Object.keys(familyProfiles) as FamilyKey[]).reduce(
    (accumulator, family) => {
      const weights = familyProfiles[family]
      const score = DIMENSIONS.reduce((sum, dimension) => {
        const weight = weights[dimension] ?? 0
        return sum + centerScore(dimensionScores[dimension]) * weight
      }, 0)

      accumulator[family] = Number(score.toFixed(2))
      return accumulator
    },
    {} as Record<FamilyKey, number>,
  )

  // Historical behavior only. V2 deliberately removed this suppression rule.
  const criticalSignal = computeCriticalSystemicSignal(dimensionScores)
  const runnerUp = Math.max(
    scores.realist,
    scores.institutionalist,
    scores.constructivist,
  )
  const cpeLead = scores.criticalPoliticalEconomy - runnerUp

  if (
    scores.criticalPoliticalEconomy > runnerUp &&
    (criticalSignal < 1.8 || cpeLead < 0.75)
  ) {
    scores.criticalPoliticalEconomy = Number((runnerUp - 0.05).toFixed(2))
  }

  return scores
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

export function getNeighboringFamilyKey(
  familyKey: FamilyKey,
  familyScores: Record<FamilyKey, number>,
): FamilyKey {
  const ordered = (
    Object.entries(familyScores) as [FamilyKey, number][]
  ).sort((a, b) => b[1] - a[1])

  return ordered.find(([key]) => key !== familyKey)?.[0] ?? familyKey
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
