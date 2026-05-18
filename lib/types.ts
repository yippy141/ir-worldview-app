export type DimensionKey =
  | "securityCompetition"
  | "institutions"
  | "domesticFilters"
  | "normsIdentity"
  | "politicalEconomy"
  | "restraint"
  | "orderJustice"

export type QuizMode = "standard" | "analyst"
export type FamiliarityLevel = "new" | "some" | "very"

export type QuestionKind = "likert" | "tradeoff" | "miniCase"
export type ChoiceCardType = "explanation" | "decision" | "actorLens" | "both"

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

export type ChoiceOption = {
  id: string
  title: string
  label: string
  signals: Partial<Record<DimensionKey, number>>
}

export type ChoiceQuestion = {
  id: string
  kind: "tradeoff" | "miniCase"
  prompt: string
  helpText?: string
  cardType: ChoiceCardType
  allowSecondChoiceInAnalyst?: boolean
  clarification?: Clarification
  options: ChoiceOption[]
}

export type Question = LikertQuestion | ChoiceQuestion

export type RankedChoiceAnswer = {
  primary: string
  secondary?: string
}

export type AnswerValue = number | string | RankedChoiceAnswer
export type Answers = Record<string, AnswerValue>

export type QuizSession = {
  v: 4
  familiarity?: FamiliarityLevel
  requestedDepth?: QuizMode
  recommendedMode?: QuizMode
  activeMode?: QuizMode
  contextAssist: boolean
  answers: Answers
  midpointAcknowledged?: boolean
}

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
