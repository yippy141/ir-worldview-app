import {
  aiAxisLabels,
  aiCoreQuestions,
  aiRootScenarioOrder,
  aiScenarioQuestions,
  getAiCoreQuestions,
  getScenarioOptions,
} from "./ai-governance-schema"
import {
  AiAnswers,
  AiArchetypeKey,
  AiAxisKey,
  AiAxisScores,
  AiLikertQuestion,
  AiQuizMode,
  AiResult,
  AiScenarioQuestion,
  GeopoliticsModifier,
  PaceModifier,
  RiskLens,
} from "./ai-governance-types"

const AXES = Object.keys(aiAxisLabels) as AiAxisKey[]

const archetypeProfiles: Record<AiArchetypeKey, Partial<Record<AiAxisKey, number>>> = {
  precautionarySteward: {
    riskHorizon: 1,
    deploymentPace: 1,
    oversight: 0.6,
    geopolitics: -0.1,
    openness: 0.5,
    militaryRole: -0.7,
    legitimacy: 0.2,
    humanFuture: 0.6,
  },
  strategicCompetitor: {
    riskHorizon: 0.3,
    deploymentPace: 0.1,
    oversight: 0.2,
    geopolitics: 1,
    openness: 0.3,
    militaryRole: 0.9,
    legitimacy: -0.2,
    humanFuture: 0.1,
  },
  coordinationArchitect: {
    riskHorizon: 0.5,
    deploymentPace: 0.4,
    oversight: 0.4,
    geopolitics: -1,
    openness: 0.1,
    militaryRole: -0.3,
    legitimacy: 0.8,
    humanFuture: 0.2,
  },
  democraticGuardrailist: {
    riskHorizon: 0.2,
    deploymentPace: 0.6,
    oversight: 1,
    geopolitics: -0.2,
    openness: 0.2,
    militaryRole: -0.5,
    legitimacy: 1,
    humanFuture: 0.4,
  },
  stateCapacityBuilder: {
    riskHorizon: 0.1,
    deploymentPace: 0.1,
    oversight: 0.9,
    geopolitics: 0.3,
    openness: 0.1,
    militaryRole: 0.2,
    legitimacy: -0.5,
    humanFuture: 0,
  },
  openEcosystemBuilder: {
    riskHorizon: -0.5,
    deploymentPace: -1,
    oversight: -0.8,
    geopolitics: -0.2,
    openness: -1,
    militaryRole: -0.2,
    legitimacy: 0,
    humanFuture: -0.7,
  },
}

export const archetypeLabels: Record<AiArchetypeKey, string> = {
  precautionarySteward: "Precautionary Steward",
  strategicCompetitor: "Strategic Competitor",
  coordinationArchitect: "Coordination Architect",
  democraticGuardrailist: "Democratic Guardrailist",
  stateCapacityBuilder: "State Capacity Builder",
  openEcosystemBuilder: "Open Ecosystem Builder",
}

export const archetypeDescriptions: Record<AiArchetypeKey, string> = {
  precautionarySteward:
    "You center severe frontier risks, prefer threshold-based caution, and are comparatively willing to accept slower deployment in exchange for stronger control.",
  strategicCompetitor:
    "You see AI governance through a hard strategic lens: rivalry is durable, capability advantage matters, and safety measures have to work under competition rather than wish it away.",
  coordinationArchitect:
    "You think the hardest AI problems are fundamentally transnational and that durable legitimacy comes from coordination, shared standards, and institutions that can outlast one country's advantage.",
  democraticGuardrailist:
    "You want strong public rules, visible accountability, and governance that remains answerable to democratic and civic institutions rather than frontier labs alone.",
  stateCapacityBuilder:
    "You think the key governance bottleneck is not abstract principle but practical state capacity: who can supervise, procure, verify, and absorb AI without becoming dependent.",
  openEcosystemBuilder:
    "You worry that excessive control will entrench incumbents and choke off social value; you are more willing to back openness, diffusion, and iterative learning.",
}

export function scoreLikert(rawValue: number, reverse?: boolean): number {
  if (rawValue < 1 || rawValue > 7) {
    throw new Error(`Likert value must be between 1 and 7. Received: ${rawValue}`)
  }

  return reverse ? 8 - rawValue : rawValue
}

export function computeAiCoreAxisScores(
  answers: AiAnswers,
  questions?: AiLikertQuestion[],
): AiAxisScores {
  const buckets: Record<AiAxisKey, number[]> = {
    riskHorizon: [],
    deploymentPace: [],
    oversight: [],
    geopolitics: [],
    openness: [],
    militaryRole: [],
    legitimacy: [],
    humanFuture: [],
  }

  for (const question of questions ?? aiCoreQuestions) {
    const raw = answers[question.id]
    if (typeof raw !== "number") continue
    buckets[question.axis].push(scoreLikert(raw, question.reverse))
  }

  return AXES.reduce((accumulator, axis) => {
    const values = buckets[axis]
    const average = values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 4
    accumulator[axis] = Number(average.toFixed(2))
    return accumulator
  }, {} as AiAxisScores)
}

export function getAiScenarioSequence(answers: AiAnswers): AiScenarioQuestion[] {
  const sequence: AiScenarioQuestion[] = []
  const seen = new Set<string>()

  const addScenario = (scenarioId: string): void => {
    if (seen.has(scenarioId)) return
    const scenario = aiScenarioQuestions[scenarioId]
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

  for (const scenarioId of aiRootScenarioOrder) {
    addScenario(scenarioId)
  }

  return sequence
}

function applyScenarioWeights(
  baseScores: AiAxisScores,
  answers: AiAnswers,
  mode?: AiQuizMode,
): AiAxisScores {
  const adjustedScores: AiAxisScores = { ...baseScores }

  for (const scenario of getAiScenarioSequence(answers)) {
    const choice = answers[scenario.id]
    if (!choice || typeof choice === "number") continue

    const option = getScenarioOptions(scenario, mode ?? "standard").find(
      (candidate) => candidate.id === choice,
    )
    if (!option) continue

    for (const [axis, weight] of Object.entries(option.weights) as Array<[AiAxisKey, number]>) {
      adjustedScores[axis] = clamp(adjustedScores[axis] + weight, 1, 7)
    }
  }

  return AXES.reduce((accumulator, axis) => {
    accumulator[axis] = Number(adjustedScores[axis].toFixed(2))
    return accumulator
  }, {} as AiAxisScores)
}

function centerScore(score: number): number {
  return score - 4
}

export function scoreArchetypes(axisScores: AiAxisScores): Record<AiArchetypeKey, number> {
  return (Object.keys(archetypeProfiles) as AiArchetypeKey[]).reduce((accumulator, archetype) => {
    const weights = archetypeProfiles[archetype]
    const score = AXES.reduce((sum, axis) => {
      const weight = weights[axis] ?? 0
      return sum + centerScore(axisScores[axis]) * weight
    }, 0)

    accumulator[archetype] = Number(score.toFixed(2))
    return accumulator
  }, {} as Record<AiArchetypeKey, number>)
}

export function getRiskLens(axisScores: AiAxisScores): RiskLens {
  if (axisScores.riskHorizon >= 5.2) return "Frontier-risk first"
  if (axisScores.riskHorizon <= 3.8) return "Present-harms first"
  return "Mixed risk lens"
}

export function getPaceModifier(axisScores: AiAxisScores): PaceModifier {
  if (axisScores.deploymentPace >= 5.2) return "Precaution-first"
  if (axisScores.deploymentPace <= 3.8) return "Deployment-first"
  return "Threshold guardrails"
}

export function getGeopoliticsModifier(axisScores: AiAxisScores): GeopoliticsModifier {
  if (axisScores.geopolitics >= 5.2) return "Competition-first"
  if (axisScores.geopolitics <= 3.8) return "Coordination-first"
  return "Competitive hedger"
}

function computeClarity(archetypeScores: Record<AiArchetypeKey, number>): number {
  const sorted = Object.values(archetypeScores).sort((a, b) => b - a)
  const gap = sorted[0] - sorted[1]
  return Math.max(55, Math.min(95, Math.round(60 + gap * 8)))
}

export function getNeighboringArchetypeKey(
  archetypeKey: AiArchetypeKey,
  archetypeScores: Record<AiArchetypeKey, number>,
): AiArchetypeKey {
  const ordered = (Object.entries(archetypeScores) as Array<[AiArchetypeKey, number]>).sort(
    (a, b) => b[1] - a[1],
  )
  const runnerUp = ordered.find(([key]) => key !== archetypeKey)
  return runnerUp ? runnerUp[0] : archetypeKey
}

function getNeighboringArchetype(
  archetypeKey: AiArchetypeKey,
  archetypeScores: Record<AiArchetypeKey, number>,
): string {
  return archetypeLabels[getNeighboringArchetypeKey(archetypeKey, archetypeScores)]
}

export function generateAiGovernanceResult(answers: AiAnswers, mode?: AiQuizMode): AiResult {
  const coreQuestions = getAiCoreQuestions(mode ?? "standard")
  const coreScores = computeAiCoreAxisScores(answers, coreQuestions)
  const axisScores = applyScenarioWeights(coreScores, answers, mode)
  const archetypeScores = scoreArchetypes(axisScores)
  const orderedArchetypes = (Object.entries(archetypeScores) as Array<[AiArchetypeKey, number]>).sort(
    (a, b) => b[1] - a[1],
  )

  const archetypeKey = orderedArchetypes[0][0]
  const archetypeLabel = archetypeLabels[archetypeKey]
  const riskLens = getRiskLens(axisScores)
  const paceModifier = getPaceModifier(axisScores)
  const geopoliticsModifier = getGeopoliticsModifier(axisScores)
  const clarity = computeClarity(archetypeScores)
  const neighboringArchetype = getNeighboringArchetype(archetypeKey, archetypeScores)

  return {
    archetypeKey,
    archetypeLabel,
    riskLens,
    paceModifier,
    geopoliticsModifier,
    clarity,
    axisScores,
    archetypeScores,
    explanation: archetypeDescriptions[archetypeKey],
    neighboringArchetype,
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
