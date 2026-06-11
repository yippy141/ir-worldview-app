import { dimensionLabels, getFoundationQuestions } from "@/lib/quiz-schema"
import type {
  Answers,
  AnswerValue,
  ChoiceQuestion,
  DimensionKey,
  DimensionScores,
  FamilyKey,
  LikertQuestion,
  Question,
  QuizMode,
  QuizResult,
  StrategyModifier,
  NormativeModifier,
  RankedChoiceAnswer,
} from "@/lib/types"

const DIMENSIONS = Object.keys(dimensionLabels) as DimensionKey[]
const SECOND_CHOICE_WEIGHT = 0.45

export const familyProfiles: Record<FamilyKey, Partial<Record<DimensionKey, number>>> = {
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

export function scoreLikert(rawValue: number, reverse?: boolean): number {
  if (rawValue < 1 || rawValue > 7) {
    throw new Error(`Likert value must be between 1 and 7. Received: ${rawValue}`)
  }

  return reverse ? 8 - rawValue : rawValue
}

function collectLikertSignal(question: LikertQuestion, raw: number) {
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

function centerScore(score: number): number {
  return score - 4
}

function computeCriticalSystemicSignal(dimensionScores: DimensionScores): number {
  return Number(
    (
      centerScore(dimensionScores.politicalEconomy) * 0.55 +
      centerScore(dimensionScores.domesticFilters) * 0.25 -
      centerScore(dimensionScores.institutions) * 0.35 -
      centerScore(dimensionScores.orderJustice) * 0.15
    ).toFixed(2),
  )
}

export function scoreFamilies(dimensionScores: DimensionScores): Record<FamilyKey, number> {
  const scores = (Object.keys(familyProfiles) as FamilyKey[]).reduce((accumulator, family) => {
    const weights = familyProfiles[family]
    const score = DIMENSIONS.reduce((sum, dimension) => {
      const weight = weights[dimension] ?? 0
      return sum + centerScore(dimensionScores[dimension]) * weight
    }, 0)

    accumulator[family] = Number(score.toFixed(2))
    return accumulator
  }, {} as Record<FamilyKey, number>)

  const criticalSignal = computeCriticalSystemicSignal(dimensionScores)
  const runnerUp = Math.max(scores.realist, scores.institutionalist, scores.constructivist)
  const cpeLead = scores.criticalPoliticalEconomy - runnerUp

  if (scores.criticalPoliticalEconomy > runnerUp && (criticalSignal < 1.8 || cpeLead < 0.75)) {
    scores.criticalPoliticalEconomy = Number((runnerUp - 0.05).toFixed(2))
  }

  return scores
}

export function analyzeScoreShape(dimensionScores: DimensionScores): ScoreShapeAnalysis {
  const familyScores = scoreFamilies(dimensionScores)
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

function getStrategyModifier(dimensionScores: DimensionScores): StrategyModifier {
  const restraint = dimensionScores.restraint

  if (restraint >= 5.15) {
    return "Restrainer"
  }

  if (restraint <= 3.85) {
    return "Maximizer"
  }

  return "Hedger"
}

function getNormativeModifier(dimensionScores: DimensionScores): NormativeModifier {
  const orderJustice = dimensionScores.orderJustice

  if (orderJustice >= 5.15) {
    return "Pluralist"
  }

  if (orderJustice <= 3.85) {
    return "Universalist"
  }

  return "Conditional Solidarist"
}

function computeClarity(familyScores: Record<FamilyKey, number>): number {
  const sorted = Object.values(familyScores).sort((a, b) => b - a)
  const gap = sorted[0] - sorted[1]

  return Math.max(55, Math.min(95, Math.round(60 + gap * 8)))
}

function getNeighboringFamily(familyKey: FamilyKey, familyScores: Record<FamilyKey, number>): string {
  const ordered = Object.entries(familyScores).sort((a, b) => b[1] - a[1]) as [FamilyKey, number][]
  const runnerUp = ordered.find(([key]) => key !== familyKey)
  return runnerUp ? familyLabels[runnerUp[0]] : familyLabels[familyKey]
}

export type CanonicalFoundationResult = QuizResult & {
  runnerUpKey: FamilyKey
  runnerUpLabel: string
}

export function buildCanonicalFoundationResult(
  dimensionScores: DimensionScores,
): CanonicalFoundationResult {
  const familyScores = scoreFamilies(dimensionScores)
  const orderedFamilies = (Object.entries(familyScores) as [FamilyKey, number][])
    .sort((a, b) => b[1] - a[1])
  const familyKey = orderedFamilies[0][0]
  const runnerUpKey = orderedFamilies.find(([key]) => key !== familyKey)?.[0] ?? familyKey
  const familyLabel = familyLabels[familyKey]
  const strategyModifier = getStrategyModifier(dimensionScores)
  const normativeModifier = getNormativeModifier(dimensionScores)
  const clarity = computeClarity(familyScores)
  const neighboringFamily = getNeighboringFamily(familyKey, familyScores)

  return {
    familyKey,
    familyLabel,
    strategyModifier,
    normativeModifier,
    clarity,
    dimensionScores,
    familyScores,
    explanation: familyDescriptions[familyKey],
    neighboringFamily,
    runnerUpKey,
    runnerUpLabel: familyLabels[runnerUpKey],
  }
}

export function generateResult(
  answers: Answers,
  mode: QuizMode = "standard",
): CanonicalFoundationResult {
  return buildCanonicalFoundationResult(computeCoreDimensionScores(answers, mode))
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
