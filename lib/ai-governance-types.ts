export type AiAxisKey =
  | "riskHorizon"
  | "deploymentPace"
  | "oversight"
  | "geopolitics"
  | "openness"
  | "militaryRole"
  | "legitimacy"
  | "humanFuture"

export type AiQuestionKind = "likert" | "scenario"
export type AiCardType = "explanation" | "decision" | "actorLens"

export type AiClarification = {
  title?: string
  whatItAsks: string
  whatItDoesNotAsk?: string
  terms?: Array<{
    term: string
    definition: string
  }>
}

export type AiLikertQuestion = {
  id: string
  kind: "likert"
  prompt: string
  axis: AiAxisKey
  reverse?: boolean
  helpText?: string
  clarification?: AiClarification
}

export type AiScenarioOption = {
  id: "A" | "B" | "C"
  label: string
  weights: Partial<Record<AiAxisKey, number>>
  followUpId?: string
}

export type AiScenarioQuestion = {
  id: string
  kind: "scenario"
  cardType: AiCardType
  prompt: string
  helpText?: string
  actorRole?: string
  tags?: string[]
  options: AiScenarioOption[]
}

export type AiQuestion = AiLikertQuestion | AiScenarioQuestion
export type AiAnswers = Record<string, number | "A" | "B" | "C" | undefined>
export type AiAxisScores = Record<AiAxisKey, number>

export type AiArchetypeKey =
  | "precautionarySteward"
  | "strategicCompetitor"
  | "coordinationArchitect"
  | "democraticGuardrailist"
  | "stateCapacityBuilder"
  | "openEcosystemBuilder"

export type RiskLens =
  | "Present-harms first"
  | "Mixed risk lens"
  | "Frontier-risk first"

export type PaceModifier =
  | "Deployment-first"
  | "Threshold guardrails"
  | "Precaution-first"

export type GeopoliticsModifier =
  | "Competition-first"
  | "Competitive hedger"
  | "Coordination-first"

export type AiResult = {
  archetypeKey: AiArchetypeKey
  archetypeLabel: string
  riskLens: RiskLens
  paceModifier: PaceModifier
  geopoliticsModifier: GeopoliticsModifier
  clarity: number
  axisScores: AiAxisScores
  archetypeScores: Record<AiArchetypeKey, number>
  explanation: string
  neighboringArchetype: string
}
