import type {
  ChoiceCardType,
  Clarification,
  DimensionKey,
  FoundationTier,
  Question,
  QuestionKind,
  QuizMode,
  ScoringBlock,
  ValidationScaleKey,
} from "@/lib/types"

export type FoundationEditorialRisk = "low" | "medium" | "high"

export type ZhHansFoundationTermCopy = {
  term: string
  definition: string
}

export type ZhHansFoundationClarificationCopy = {
  title?: string
  whatItAsks: string
  whatItDoesNotAsk?: string
  terms?: readonly ZhHansFoundationTermCopy[]
}

export type ZhHansFoundationOptionCopy = {
  id: string
  title: string
  label: string
}

/**
 * Display copy only. Scoring signals, reverse coding, dimensions, card types,
 * and second-choice behavior stay in the canonical Foundation schema.
 */
export type ZhHansFoundationQuestionCopy = {
  prompt: string
  helpText?: string
  clarification?: ZhHansFoundationClarificationCopy
  options?: readonly ZhHansFoundationOptionCopy[]
}

export type ZhHansFoundationDraftRecord = {
  questionId: string
  chineseDraftA: ZhHansFoundationQuestionCopy
  chineseDraftB: ZhHansFoundationQuestionCopy
  reconciledChinese: ZhHansFoundationQuestionCopy
}

export type FoundationBackTranslationRecord = {
  questionId: string
  backTranslation: ZhHansFoundationQuestionCopy
}

export type FoundationOptionEditorialNote = {
  optionId: string
  note: string
}

export type FoundationBiasAssessment = {
  risk: FoundationEditorialRisk
  note: string
}

export type FoundationItemAnalysis = {
  questionId: string
  construct: string
  intendedDistinction: string
  adjudicationNote: string
  optionLevelNotes: readonly FoundationOptionEditorialNote[]
  termsRequiringGlossaryApproval: readonly string[]
  socialDesirabilityBias: FoundationBiasAssessment
  moderateOrRespectableOptionBias: FoundationBiasAssessment
  cognitiveInterviewProbes: readonly string[]
}

export type FoundationItemIntentRow = FoundationItemAnalysis &
  ZhHansFoundationDraftRecord &
  FoundationBackTranslationRecord & {
    englishSource: Question
  }

export type ZhHansFoundationGlossaryEntry = {
  id: string
  english: string
  preferredZhHans: string
  contexts: readonly string[]
  rationale: string
  avoid: readonly string[]
  status: "proposed" | "requires-approval" | "approved-for-beta"
}

export type ZhHansFoundationInstrumentManifest = {
  locale: "zh-Hans"
  status: "adapted-beta"
  validationClaim: "not-validated-or-equivalent"
  canonicalSchemaVersion: number
  scoringVersion: number
  localeCopyVersion: number
  sourceLocale: "en"
  modes: readonly QuizMode[]
  preserves: readonly [
    "question IDs",
    "answer-option IDs",
    "question kinds",
    "tier assignments",
    "scoring weights",
    "section order",
    "review behavior",
  ]
  runtimeEnabled: true
}

export type FoundationStructuralFingerprint = {
  id: string
  kind: QuestionKind
  tier: FoundationTier
  scoringBlock: ScoringBlock
  dimension?: DimensionKey
  validationScale?: ValidationScaleKey
  reverse?: boolean
  cardType?: ChoiceCardType
  allowSecondChoiceInAnalyst?: boolean
  optionIds: readonly string[]
  signals: readonly Record<string, number>[]
}

export function toMutableClarification(
  clarification: ZhHansFoundationClarificationCopy | undefined,
): Clarification | undefined {
  if (!clarification) return undefined

  const { terms, ...copy } = clarification

  return {
    ...copy,
    ...(terms
      ? { terms: terms.map((term) => ({ ...term })) }
      : {}),
  }
}
