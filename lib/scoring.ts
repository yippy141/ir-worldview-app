import { dimensionLabels, getFoundationQuestions } from "@/lib/quiz-schema"
import type {
  Answers,
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
} from "@/lib/types"

const DIMENSIONS = Object.keys(dimensionLabels) as DimensionKey[]

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

export function scoreLikert(rawValue: number, reverse?: boolean): number {
  if (rawValue < 1 || rawValue > 7) {
    throw new Error(`Likert value must be between 1 and 7. Received: ${rawValue}`)
  }

  return reverse ? 8 - rawValue : rawValue
}

function collectLikertSignal(question: LikertQuestion, raw: number) {
  return { dimension: question.dimension, value: scoreLikert(raw, question.reverse) }
}

function collectChoiceSignals(question: ChoiceQuestion, answer: string) {
  const option = question.options.find((candidate) => candidate.id === answer)
  if (!option) return []

  return (Object.entries(option.signals) as [DimensionKey, number][])
    .filter(([, value]) => typeof value === "number")
    .map(([dimension, value]) => ({ dimension, value }))
}

function collectQuestionSignals(question: Question, answer: Answers[string]) {
  if (question.kind === "likert") {
    return typeof answer === "number" ? [collectLikertSignal(question, answer)] : []
  }

  return typeof answer === "string" ? collectChoiceSignals(question, answer) : []
}

export function computeCoreDimensionScores(
  answers: Answers,
  mode: QuizMode = "standard",
): DimensionScores {
  const buckets: Record<DimensionKey, number[]> = {
    securityCompetition: [],
    institutions: [],
    domesticFilters: [],
    normsIdentity: [],
    politicalEconomy: [],
    restraint: [],
    orderJustice: [],
  }

  for (const question of getFoundationQuestions(mode)) {
    for (const signal of collectQuestionSignals(question, answers[question.id])) {
      buckets[signal.dimension].push(signal.value)
    }
  }

  return DIMENSIONS.reduce((accumulator, dimension) => {
    const values = buckets[dimension]
    const average =
      values.length > 0
        ? values.reduce((sum, value) => sum + value, 0) / values.length
        : 4
    accumulator[dimension] = Number(average.toFixed(2))
    return accumulator
  }, {} as DimensionScores)
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

export function generateResult(
  answers: Answers,
  mode: QuizMode = "standard",
): QuizResult {
  const dimensionScores = computeCoreDimensionScores(answers, mode)
  const familyScores = scoreFamilies(dimensionScores)
  const orderedFamilies = (Object.entries(familyScores) as [FamilyKey, number][])
    .sort((a, b) => b[1] - a[1])
  const familyKey = orderedFamilies[0][0]
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
  }
}

export function getNeighboringFamilyKey(
  familyKey: FamilyKey,
  familyScores: Record<FamilyKey, number>,
): FamilyKey {
  const ordered = (Object.entries(familyScores) as [FamilyKey, number][])
    .sort((a, b) => b[1] - a[1])
  return ordered.find(([key]) => key !== familyKey)?.[0] ?? familyKey
}
