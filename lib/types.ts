export type DimensionKey =
  | "securityCompetition"
  | "institutions"
  | "domesticFilters"
  | "normsIdentity"
  | "politicalEconomy"
  | "restraint"
  | "orderJustice"

export type QuestionKind = "likert" | "scenario"

export type Clarification = {
  title?: string
  whatItAsks: string
  whatItDoesNotAsk?: string
  terms?: { term: string; definition: string }[]
}

export type LikertQuestion = {
  id: string
  kind: "likert"
  prompt: string
  helpText?: string
  dimension: DimensionKey
  reverse?: boolean
  clarification?: Clarification
}

export type ScenarioOption = {
  id: "A" | "B" | "C"
  label: string
  weights: Partial<Record<DimensionKey, number>>
  followUpId?: string
}

export type ScenarioQuestion = {
  id: string
  kind: "scenario"
  prompt: string
  helpText?: string
  options: ScenarioOption[]
}

export type Question = LikertQuestion | ScenarioQuestion

export type Answers = Record<string, number | "A" | "B" | "C">

export type DimensionScores = Record<DimensionKey, number>

export type FamilyKey =
  | "realist"
  | "institutionalist"
  | "constructivist"
  | "criticalPoliticalEconomy"

export type StrategyModifier = "Restrainer" | "Hedger" | "Maximizer"
export type NormativeModifier = "Pluralist" | "Conditional Solidarist" | "Universalist"

export type QuizResult = {
  familyKey: FamilyKey
  familyLabel: string
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
  clarity: number
  dimensionScores: DimensionScores
  familyScores: Record<FamilyKey, number>
  explanation: string
  neighboringFamily: string
}

// Fixed-order dimension array for the share payload.
// Order: securityCompetition, institutions, domesticFilters, normsIdentity,
//        politicalEconomy, restraint, orderJustice
export type SharePayload = {
  v: 2
  ds: [number, number, number, number, number, number, number]
  fk: FamilyKey
  nk: FamilyKey
  sm: StrategyModifier
  nm: NormativeModifier
}
