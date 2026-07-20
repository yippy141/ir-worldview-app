import type { DimensionKey } from "@/lib/types"
import type { Locale } from "@/i18n/routing"
import type { CurrentCaseReasoningTag } from "@/lib/current-cases/reasoning-tags"

export const CURRENT_CASE_SCHEMA_VERSION = 1 as const

export const CURRENT_CASE_PUBLICATION_STATUSES = [
  "draft",
  "pending-review",
  "published",
  "withdrawn",
] as const

export type CurrentCasePublicationStatus =
  (typeof CURRENT_CASE_PUBLICATION_STATUSES)[number]

export const CURRENT_CASE_LAUNCH_ROLES = ["launch", "archive"] as const
export type CurrentCaseLaunchRole = (typeof CURRENT_CASE_LAUNCH_ROLES)[number]

export const CURRENT_CASE_CATEGORIES = [
  "security",
  "economic-statecraft",
  "institutions-and-governance",
] as const

export type CurrentCaseCategory = (typeof CURRENT_CASE_CATEGORIES)[number]

export const CURRENT_CASE_SOURCE_KINDS = [
  "primary",
  "authoritative-research",
  "high-quality-reporting",
] as const

export type CurrentCaseSourceKind = (typeof CURRENT_CASE_SOURCE_KINDS)[number]

export type CurrentCaseEvidenceWindow = {
  start: string
  end: string
}

export type CurrentCaseClaim = {
  id: string
  text: string
}

/**
 * URLs and claimIds are kept exactly as recorded by research. Rendering code
 * may select from this ledger, but must never rewrite or infer either field.
 */
export type CurrentCaseSource = {
  id: string
  title: string
  publisher: string
  author?: string
  publishedAt: string | null
  accessedAt: string
  url: string
  kind: CurrentCaseSourceKind
  claimIds: string[]
}

export type CurrentCaseOption = {
  id: string
  label: string
  logic: string
  acceptedTradeoff: string
}

export type CurrentCaseDecision = {
  prompt: string
  options: CurrentCaseOption[]
}

export type CurrentCaseWorldviewReading = {
  /** Stable Atlas profile ID; never a new scored Foundation family. */
  profileId: string
  noticesFirst: string
  interpretation: string
  recommendation: string
  recommendedOptionIds: string[]
  strongestObjection: string
  updateCondition: string
}

export const CURRENT_CASE_CHALLENGE_RESPONSE_IDS = [
  "weakens",
  "priority",
  "strengthens",
  "unsure",
] as const

export type CurrentCaseChallengeResponseId =
  (typeof CURRENT_CASE_CHALLENGE_RESPONSE_IDS)[number]

export type CurrentCaseChallengeOption = {
  id: CurrentCaseChallengeResponseId
  label: string
}

export type CurrentCaseAssumptionChallenge = {
  newInformation: string
  prompt: string
  options: CurrentCaseChallengeOption[]
}

export type CurrentCasePerspectiveContext = {
  global: string
  counterparties: Array<{
    actor: string
    perspective: string
  }>
}

export type CurrentCaseDisputes = {
  factual: string[]
  interpretive: string[]
}

export type CurrentCaseSensitiveWording = {
  term: string
  guidance: string
}

export type CurrentCaseCorrectionRisk = {
  risk: string
  mitigation: string
}

export type CurrentCaseNextRoute = {
  href: string
  label: string
  reason: string
}

export type CurrentCaseEditorialReview = {
  researchReviewedAt: string
  sourceCheckedAt: string
  copyReviewedAt: string
  approvedAt: string
  reviewerIds: string[]
}

export type CurrentCaseRevisit = {
  publishedAt: string
  evidenceWindowEnd: string
  whatHappenedNext: string
  supportedAssumptions: string[]
  weakenedAssumptions: string[]
  unresolvedQuestions: string[]
  sourceIds: string[]
}

export type CurrentCase = {
  schemaVersion: typeof CURRENT_CASE_SCHEMA_VERSION
  id: string
  slug: string
  version: number
  publicationStatus: CurrentCasePublicationStatus
  launchRole: CurrentCaseLaunchRole
  title: string
  dek: string
  category: CurrentCaseCategory
  publishedAt: string | null
  updatedAt: string
  evidenceWindow: CurrentCaseEvidenceWindow
  /** The public case briefing. Publication requires 250–450 words. */
  briefing: string
  actors: string[]
  perspectives: CurrentCasePerspectiveContext
  factualClaims: CurrentCaseClaim[]
  knownUncertainties: string[]
  reasoningTags: CurrentCaseReasoningTag[]
  decision: CurrentCaseDecision
  worldviewReadings: CurrentCaseWorldviewReading[]
  assumptionChallenge: CurrentCaseAssumptionChallenge
  nextRoutes: CurrentCaseNextRoute[]
  sources: CurrentCaseSource[]
  disputes: CurrentCaseDisputes
  sensitiveWording: CurrentCaseSensitiveWording[]
  correctionRisks: CurrentCaseCorrectionRisk[]
  /** Internal commissioning note; publication requires a concise editorial memo. */
  editorialMemo: string
  editorialReview: CurrentCaseEditorialReview
  revisit?: CurrentCaseRevisit
}

export const CURRENT_CASE_RESPONSE_STORE_VERSION = 2 as const
export { CURRENT_CASE_RESPONSE_STORAGE_KEY } from "@/lib/storage-keys"

export type CurrentCaseConfidence = 1 | 2 | 3 | 4 | 5

export const CURRENT_CASE_CONFIDENCE_VALUES = [1, 2, 3, 4, 5] as const

export function isCurrentCaseConfidence(
  value: unknown,
): value is CurrentCaseConfidence {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    CURRENT_CASE_CONFIDENCE_VALUES.includes(value as CurrentCaseConfidence)
  )
}

export const CURRENT_CASE_STEP_IDS = [
  "brief",
  "initial",
  "reasoning",
  "readings",
  "challenge",
  "final",
  "result",
] as const

export type CurrentCaseStepId = (typeof CURRENT_CASE_STEP_IDS)[number]

export type CurrentCaseDraft = {
  caseId: string
  caseSlug: string
  caseVersion: number
  step: CurrentCaseStepId
  initialOptionId?: string
  initialConfidence?: CurrentCaseConfidence
  reasoningTagIds: string[]
  legacyReasoningTagLabels?: Record<string, string>
  challengeResponseId?: CurrentCaseChallengeResponseId
  openedReadingProfileIds: string[]
  finalOptionId?: string
  finalConfidence?: CurrentCaseConfidence
  updatedAt: string
}

export type CompletedCurrentCaseResponse = {
  caseId: string
  caseSlug: string
  caseVersion: number
  initialOptionId: string
  initialConfidence: CurrentCaseConfidence
  /** The reader's final option after the assumption challenge. */
  selectedOptionId: string
  /** The reader's final confidence after the assumption challenge. */
  confidence: CurrentCaseConfidence
  reasoningTagIds: string[]
  legacyReasoningTagLabels?: Record<string, string>
  challengeResponseId: CurrentCaseChallengeResponseId
  openedReadingProfileIds: string[]
  completedAt: string
  locale: Locale
  localeCopyVersion: number
}

export type CurrentCaseResponseStore = {
  v: typeof CURRENT_CASE_RESPONSE_STORE_VERSION
  /** Stable case ID to the reader's resumable in-progress judgment. */
  drafts: Record<string, CurrentCaseDraft>
  /** Stable case ID to chronological responses, preserving old content versions. */
  responses: Record<string, CompletedCurrentCaseResponse[]>
}

export type CurrentCaseFoundationConnectionKind =
  | "consistent"
  | "tension"
  | "not-covered"
  | "unavailable"

export type CurrentCaseFoundationConnection = {
  kind: CurrentCaseFoundationConnectionKind
  unavailableReason?: "missing-foundation" | "different-cohort"
  selectedOptionId: string
  foundationPatternId: string | null
  foundationPatternLabel: string | null
  readingProfileId: string | null
  dimensions: DimensionKey[]
  summary: string
}
