import { coreQuestions, dimensionLabels, tieBreakerClusters, FALLBACK_SCENARIO_IDS, scenarioQuestions } from "@/lib/quiz-schema"
import type {
  Answers,
  DimensionKey,
  DimensionScores,
  FamilyKey,
  QuizResult,
  ScenarioQuestion,
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

export function computeCoreDimensionScores(answers: Answers): DimensionScores {
  const buckets: Record<DimensionKey, number[]> = {
    securityCompetition: [],
    institutions: [],
    domesticFilters: [],
    normsIdentity: [],
    politicalEconomy: [],
    restraint: [],
    orderJustice: [],
  }

  for (const question of coreQuestions) {
    const raw = answers[question.id]

    if (typeof raw !== "number") continue

    buckets[question.dimension].push(scoreLikert(raw, question.reverse))
  }

  return DIMENSIONS.reduce((accumulator, dimension) => {
    const values = buckets[dimension]
    const average = values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 4
    accumulator[dimension] = Number(average.toFixed(2))
    return accumulator
  }, {} as DimensionScores)
}

// Select 3–5 tie-breaker scenario IDs based on the two closest family scores.
export function selectTieBreakerIds(
  familyScores: Record<FamilyKey, number>,
  dimensionScores: DimensionScores,
): string[] {
  const ordered = (Object.entries(familyScores) as [FamilyKey, number][]).sort((a, b) => b[1] - a[1])
  const topFamily = ordered[0][0]
  const runnerUpFamily = ordered[1][0]
  const gap = ordered[0][1] - ordered[1][1]

  const ids = new Set<string>()

  // If top two are close, add the cluster for that pair
  if (gap < 1.5) {
    const cluster = tieBreakerClusters.find(
      (c) =>
        (c.pair[0] === topFamily && c.pair[1] === runnerUpFamily) ||
        (c.pair[0] === runnerUpFamily && c.pair[1] === topFamily),
    )
    if (cluster) cluster.scenarioIds.forEach((id) => ids.add(id))
  }

  // If orderJustice is near neutral, add the humanitarian intervention item
  if (dimensionScores.orderJustice >= 3.4 && dimensionScores.orderJustice <= 4.6) {
    ids.add("humanitarianIntervention")
  }

  // Ensure at least 3 scenarios via fallback
  for (const id of FALLBACK_SCENARIO_IDS) {
    if (ids.size >= 3) break
    ids.add(id)
  }

  return [...ids].slice(0, 5)
}

export function getScenarioSequence(answers: Answers): ScenarioQuestion[] {
  // Gate scenarios behind every core item being answered.
  const allCoreAnswered = coreQuestions.every((q) => answers[q.id] !== undefined)
  if (!allCoreAnswered) return []

  // Compute scores to select adaptive tie-breakers
  const coreScores = computeCoreDimensionScores(answers)
  const fScores = scoreFamilies(coreScores)
  const rootIds = selectTieBreakerIds(fScores, coreScores)

  const sequence: ScenarioQuestion[] = []
  const seen = new Set<string>()

  const addScenario = (scenarioId: string) => {
    if (seen.has(scenarioId)) return
    const scenario = scenarioQuestions[scenarioId]
    if (!scenario) return
    sequence.push(scenario)
    seen.add(scenarioId)

    const choice = answers[scenarioId]
    if (!choice || typeof choice === "number") return

    const chosenOption = scenario.options.find((option) => option.id === choice)
    if (chosenOption?.followUpId) {
      addScenario(chosenOption.followUpId)
    }
  }

  for (const scenarioId of rootIds) {
    addScenario(scenarioId)
  }

  return sequence
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

export function generateResult(answers: Answers): QuizResult {
  const coreScores = computeCoreDimensionScores(answers)
  const dimensionScores = coreScores
  const familyScores = scoreFamilies(dimensionScores)
  const orderedFamilies = (Object.entries(familyScores) as [FamilyKey, number][]).sort((a, b) => b[1] - a[1])
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
  const ordered = (Object.entries(familyScores) as [FamilyKey, number][]).sort(
    (a, b) => b[1] - a[1],
  )
  return ordered.find(([key]) => key !== familyKey)?.[0] ?? familyKey
}
