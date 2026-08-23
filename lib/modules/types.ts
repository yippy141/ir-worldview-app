import type { ChoiceCardType, DimensionKey, DimensionScores, QuizMode } from "@/lib/types"
import type { PinnedOptionPosition } from "@/lib/option-order"

export const MODULE_SLUGS = ["security", "technology"] as const
export type ModuleSlug = (typeof MODULE_SLUGS)[number]

export type ModuleAxisKey =
  | "activism"
  | "escalation"
  | "alliance"
  | "legitimacy"
  | "control"
  | "governance"
  | "industrial"
  | "safety"

export type ModuleAxis = {
  key: ModuleAxisKey
  label: string
  lowLabel: string
  highLabel: string
}

export type ModuleOption = {
  id: string
  title: string
  label: string
  signals: Record<string, number>
  pinned?: PinnedOptionPosition
}

export type ModuleLane = {
  key: string
  label: string
  description: string
  scoreKey: string
  lowLabel: string
  highLabel: string
}

export type ModuleContextBullet = {
  label: string
  text: string
}

export type ModuleKnowledgeLoad = "low" | "medium" | "high"

export type ModuleQuestion = {
  id: string
  kind?: "case" | "synthesis"
  lane: string
  cardType: ChoiceCardType
  title: string
  prompt: string
  scene: string
  whyHard: string
  contextBullets?: ModuleContextBullet[]
  perspectiveTags: string[]
  knowledgeLoad: ModuleKnowledgeLoad
  mirrorPairId?: string
  discriminatingAxes: ModuleAxisKey[]
  options: ModuleOption[]
  allowSecondChoiceInAnalyst?: boolean
}

export type ModuleSelection = {
  primary: string
  secondary?: string
}

export type ModuleAnswers = Record<string, ModuleSelection>

export type ModulePayloadV2 = {
  v: 2
  slug: ModuleSlug
  mode: QuizMode
  answers: ModuleAnswers
}

export type ModulePayloadV3 = {
  v: 3
  /** Item-bank/content version. */
  bv: number
  /** Scoring implementation version. */
  sv: number
  slug: ModuleSlug
  mode: QuizMode
  answers: ModuleAnswers
}

export type ModulePayload = ModulePayloadV2 | ModulePayloadV3

export type ModuleInterpretation = {
  headline: string
  summary: string
  instincts: string[]
  challenge: string
}

export type ModuleLaneSummary = {
  key: string
  label: string
  summary: string
  score: number
  lowLabel: string
  highLabel: string
  /** @deprecated Legacy display/decode copy only; never author a live bridge from this field. */
  delta?: string
}

export type ModuleCardTypeRead = {
  headline: string
  summary: string
}

export const ACTIVE_MODULE_COMPARISON_STATUS = {
  kind: "separate-domain-read",
  numericBridge: "none",
  masterScore: "none",
} as const

export type ModuleComparisonStatus =
  typeof ACTIVE_MODULE_COMPARISON_STATUS

export type ModuleAnalytics = {
  mode?: QuizMode
  scores: Record<string, number>
  laneScores: Record<string, Record<string, number>>
  cardTypeScores: Partial<Record<ChoiceCardType, Record<string, number>>>
}

export type ModuleClassificationContext = {
  mode: QuizMode
}

export type ModuleResult = ModuleInterpretation & {
  scores: Record<string, number>
  laneSummaries: ModuleLaneSummary[]
  cardTypeRead?: ModuleCardTypeRead
  cardTypeScores: Partial<Record<ChoiceCardType, Record<string, number>>>
  /** @deprecated Frozen replay output only; active module saves must write an empty object. */
  overlayDeltas: Partial<Record<DimensionKey, number>>
  /** @deprecated Frozen replay/display copy only; not a reviewed domain bridge. */
  comparison?: string
}

export type ModuleDefinition = {
  slug: ModuleSlug
  defaultHeadline?: string
  title: string
  shortTitle: string
  subtitle: string
  shorthand: string
  timeEstimate: Record<QuizMode, string>
  description: string
  measures: string[]
  doesNotClaim: string[]
  axes: ModuleAxis[]
  lanes: ModuleLane[]
  questionsByMode: Record<QuizMode, ModuleQuestion[]>
  interpret: (
    analytics: ModuleAnalytics,
    context?: ModuleClassificationContext,
  ) => ModuleInterpretation
  summarizeLanes: (
    analytics: ModuleAnalytics,
    foundation?: DimensionScores,
    context?: ModuleClassificationContext,
  ) => ModuleLaneSummary[]
  summarizeCardTypes?: (analytics: ModuleAnalytics) => ModuleCardTypeRead | undefined
  /** @deprecated Frozen version replay only; excluded from the V23.4 authoring contract. */
  buildOverlayDeltas: (analytics: ModuleAnalytics) => Partial<Record<DimensionKey, number>>
  /** @deprecated Frozen version replay only; excluded from the V23.4 authoring contract. */
  compareToFoundation?: (
    analytics: ModuleAnalytics,
    foundation: DimensionScores,
  ) => string
}
