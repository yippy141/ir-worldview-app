export type AiQuizMode = "standard" | "analyst"

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
  id: "A" | "B" | "C" | "D"
  label: string
  weights: Partial<Record<AiAxisKey, number>>
  followUpId?: string
}

export type AiScenarioQuestion = {
  id: string
  kind: "scenario"
  cardType: AiCardType
  prompt: string
  /** Alternative prompt shown in analyst mode when the framing differs from standard. */
  analystPrompt?: string
  helpText?: string
  actorRole?: string
  tags?: string[]
  /** Standard-mode options (3 scored choices). */
  options: AiScenarioOption[]
  /** Analyst-mode options (4 scored choices). When present, replaces options in analyst mode. */
  analystOptions?: AiScenarioOption[]
  /** When true, analyst mode shows an optional backup-choice selector on this scenario. */
  allowBackupChoiceInAnalyst?: boolean
}

export type AiQuestion = AiLikertQuestion | AiScenarioQuestion
export type AiRankedChoiceAnswer = {
  primary: "A" | "B" | "C" | "D"
  secondary?: "A" | "B" | "C" | "D"
}

export function isAiRankedChoiceAnswer(value: unknown): value is AiRankedChoiceAnswer {
  if (typeof value !== "object" || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.primary === "string" &&
    ["A", "B", "C", "D"].includes(v.primary) &&
    (v.secondary === undefined ||
      (typeof v.secondary === "string" && ["A", "B", "C", "D"].includes(v.secondary)))
  )
}

export type AiAnswers = Record<string, number | "A" | "B" | "C" | "D" | AiRankedChoiceAnswer | undefined>
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
