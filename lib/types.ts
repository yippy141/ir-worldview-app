import type { PinnedOptionPosition } from "@/lib/option-order"

export type DimensionKey =
  | "securityCompetition"
  | "institutions"
  | "domesticFilters"
  | "normsIdentity"
  | "politicalEconomy"
  | "restraint"
  | "orderJustice"

export type QuizMode = "standard" | "analyst"
export type FoundationTier = "core" | "extended"
export type FoundationQuestionSet =
  | "core"
  | "targetedExtended"
  | "fullExtended"
export type FamiliarityLevel = "new" | "some" | "very"

export type QuestionKind = "likert" | "tradeoff" | "miniCase"
export type ChoiceCardType = "explanation" | "decision" | "actorLens" | "both"
export type ScoringBlock = "core" | "validation"
export type ValidationScaleKey =
  | "militantInternationalism"
  | "cooperativeInternationalism"
  | "isolationism"

export type Clarification = {
  title?: string
  whatItAsks: string
  whatItDoesNotAsk?: string
  terms?: { term: string; definition: string }[]
}

export type CoreLikertQuestion = {
  id: string
  kind: "likert"
  tier: FoundationTier
  scoringBlock: "core"
  prompt: string
  helpText?: string
  dimension: DimensionKey
  reverse: boolean
  clarification?: Clarification
}

export type ValidationLikertQuestion = {
  id: string
  kind: "likert"
  tier: FoundationTier
  scoringBlock: "validation"
  prompt: string
  helpText?: string
  validationScale: ValidationScaleKey
  citation: string
  reverse: boolean
  clarification?: Clarification
}

export type LikertQuestion = CoreLikertQuestion | ValidationLikertQuestion

export type ChoiceOption = {
  id: string
  title: string
  label: string
  signals: Partial<Record<DimensionKey, number>>
  pinned?: PinnedOptionPosition
}

export type ChoiceQuestion = {
  id: string
  kind: "tradeoff" | "miniCase"
  tier: FoundationTier
  scoringBlock: "core"
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

export type ItemLatencyBucketMs =
  | 0
  | 2_000
  | 5_000
  | 10_000
  | 30_000
  | 120_000
export type ItemLatencyBuckets = Partial<Record<string, ItemLatencyBucketMs>>

export type QuizSession = {
  v: 7
  orderSeed: string
  familiarity?: FamiliarityLevel
  requestedDepth?: QuizMode
  recommendedMode?: QuizMode
  activeMode?: QuizMode
  questionSet: FoundationQuestionSet
  targetedFamilyPair?: [FamilyKey, FamilyKey]
  contextAssist: boolean
  answers: Answers
  itemLatencyBuckets: ItemLatencyBuckets
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
  dimensionScores: DimensionScores
  familyScores: Record<FamilyKey, number>
  explanation: string
  neighboringFamily: string
}

export type CompletionLocale = "en" | "zh-Hans"

// Fixed-order dimension array for Foundation share payloads.
// Order: securityCompetition, institutions, domesticFilters, normsIdentity,
//        politicalEconomy, restraint, orderJustice
type FoundationShareFields = {
  ds: [number, number, number, number, number, number, number]
  fk: FamilyKey
  nk: FamilyKey
  sm: StrategyModifier
  nm: NormativeModifier
}

export type SharePayloadV2 = FoundationShareFields & {
  v: 2
}

export type SharePayloadV3 = FoundationShareFields & {
  v: 3
  /** Canonical Foundation structural version. */
  iv: number
  /** Scoring implementation version. */
  sv: number
  /** Completion-locale copy version. */
  cv: number
  /** Locale in which the respondent completed the instrument. */
  cl: CompletionLocale
}

export type SharePayloadV4 = FoundationShareFields & {
  v: 4
  /** Canonical Foundation structural version. */
  iv: number
  /** Scoring implementation version. */
  sv: number
  /** Completion-locale copy version. */
  cv: number
  /** Locale in which the respondent completed the instrument. */
  cl: CompletionLocale
  /** Whether the result used only core items or included extended items. */
  rt: FoundationTier
}

export type SharePayload = SharePayloadV2 | SharePayloadV3 | SharePayloadV4
