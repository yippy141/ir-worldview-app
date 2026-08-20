import type { ChoiceCardType, DimensionKey, QuizMode } from "@/lib/types"

export const DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION = 1 as const

export const DOMAIN_RELATIONS = [
  "reinforces",
  "qualifies",
  "pulls-against",
  "not-comparable",
] as const
export type DomainRelation = (typeof DOMAIN_RELATIONS)[number]

export const DOMAIN_BRIDGE_AUTHORING_STATUSES = ["draft", "authored"] as const
export type DomainBridgeAuthoringStatus =
  (typeof DOMAIN_BRIDGE_AUTHORING_STATUSES)[number]

export const DOMAIN_BRIDGE_REVIEW_STATUSES = [
  "unreviewed",
  "expert-reviewed",
] as const
export type DomainBridgeReviewStatus =
  (typeof DOMAIN_BRIDGE_REVIEW_STATUSES)[number]

export const DOMAIN_BRIDGE_EVIDENCE_STATUSES = [
  "untested",
  "pilot-supported",
] as const
export type DomainBridgeEvidenceStatus =
  (typeof DOMAIN_BRIDGE_EVIDENCE_STATUSES)[number]

export const DOMAIN_BRIDGE_PUBLICATION_STATES = ["internal"] as const
export type DomainBridgePublicationState =
  (typeof DOMAIN_BRIDGE_PUBLICATION_STATES)[number]

export const DOMAIN_DIRECTION_POLES = ["low", "high"] as const
export type DomainDirectionPole = (typeof DOMAIN_DIRECTION_POLES)[number]

export const FOUNDATION_DIMENSION_KEYS = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
] as const satisfies readonly DimensionKey[]

export const MODULE_QUESTION_TYPES = ["case", "synthesis"] as const
export type ModuleQuestionType = (typeof MODULE_QUESTION_TYPES)[number]

export const MODULE_CARD_TYPES = [
  "explanation",
  "decision",
  "actorLens",
  "both",
] as const satisfies readonly ChoiceCardType[]

export const MODULE_CALIBRATION_STATUSES = [
  "not-calibrated",
  "synthetic-diagnostic",
  "pilot-calibrated",
] as const
export type ModuleCalibrationStatus =
  (typeof MODULE_CALIBRATION_STATUSES)[number]

export const MODULE_LOCALE_STATUSES = [
  "authored-complete",
  "reviewed",
  "partial",
  "not-authored",
] as const
export type ModuleLocaleStatus = (typeof MODULE_LOCALE_STATUSES)[number]

export const MODULE_EVIDENCE_STATUSES = [
  "unrecorded",
  "provenance-recorded",
  "reviewed",
] as const
export type ModuleEvidenceStatus = (typeof MODULE_EVIDENCE_STATUSES)[number]

export const MODULE_RELEASE_STATES = [
  "template",
  "candidate",
  "public-beta",
  "shipping",
] as const
export type ModuleReleaseState = (typeof MODULE_RELEASE_STATES)[number]

export const MODULE_MANIFEST_ORIGINS = [
  "derived-legacy-adapter",
  "authored-manifest",
] as const
export type ModuleManifestOrigin = (typeof MODULE_MANIFEST_ORIGINS)[number]

export const MODULE_RELEASE_DECISION_STATUSES = [
  "approved-public-beta",
  "approved-shipping",
] as const
export type ModuleReleaseDecisionStatus =
  (typeof MODULE_RELEASE_DECISION_STATUSES)[number]

export const DEFAULT_DOMAIN_RELATION_POLICY = {
  defaultRelation: "not-comparable",
  defaultRead: "separate-domain-read",
  rawScoreComparison: "forbidden",
  masterScore: "forbidden",
  publicRelations: "forbidden-in-schema-v1",
} as const

export const DEFAULT_DOMAIN_RELATION_READ = {
  kind: DEFAULT_DOMAIN_RELATION_POLICY.defaultRead,
  relation: DEFAULT_DOMAIN_RELATION_POLICY.defaultRelation,
  numericBridge: "none",
  masterScore: "none",
} as const

export const STABLE_AUTHORING_ID_PATTERN =
  /^[a-z0-9]+(?:[._:-][a-z0-9]+)*$/
export const MODULE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export type DomainModuleAxis<AxisKey extends string = string> = {
  key: AxisKey
  label: string
  lowLabel: string
  highLabel: string
}

export type DomainModuleLane<
  AxisKey extends string = string,
  LaneKey extends string = string,
> = {
  key: LaneKey
  label: string
  description: string
  scoreKey: AxisKey
  lowLabel: string
  highLabel: string
}

export type DomainModuleResultCopy = {
  defaultHeadline: string
  title: string
  shortTitle: string
  subtitle: string
  shorthand: string
  timeEstimate: Record<QuizMode, string>
  description: string
  measures: string[]
  doesNotClaim: string[]
}

export type DomainModuleVersions = {
  manifest: number
  questionBank: number
  scoring: number
  resultCopy: number
}

export type DomainModuleCalibration = {
  status: ModuleCalibrationStatus
  id: string
  questionBankVersion: number
  scoringVersion: number
  modes: QuizMode[]
  method: string
  artifactPath?: string
}

export type DomainModuleLocaleRecord = {
  locale: string
  status: ModuleLocaleStatus
  contentVersion?: number
  reviewIds?: string[]
}

export type DomainModuleLocaleStatus = {
  sourceLocale: string
  locales: DomainModuleLocaleRecord[]
}

export type DomainEvidenceHook = {
  id: string
  path: string
}

export type DomainAuditHook = {
  id: string
  packageScript: string
  path: string
}

export type DomainEvidenceAuditHooks = {
  evidence: DomainEvidenceHook[]
  reviews: DomainEvidenceHook[]
  audits: DomainAuditHook[]
}

export type DomainReleaseDecisionReference = {
  decisionId: string
  decisionPath: string
  approvedQuestionBankVersion: number
  approvedScoringVersion: number
  approvedResultCopyVersion: number
  approvedManifestVersion: number
  decisionStatus: ModuleReleaseDecisionStatus
  reviewDueAt: string
}

/** Direction is authored semantics; it contains no arithmetic. */
export type DomainBridgeDirection = {
  modulePole: DomainDirectionPole
  foundationPole?: DomainDirectionPole
  semantics: string
}

export type FoundationBridgeContext =
  | {
      semanticContractId: string
      scoringVersion?: never
      calibrationVersion?: never
    }
  | {
      semanticContractId?: never
      scoringVersion: number
      calibrationVersion: string
    }

export type DomainBridgeVersionContext = {
  moduleManifestVersion: number
  moduleQuestionBankVersion: number
  moduleScoringVersion: number
  moduleResultCopyVersion: number
  foundation: FoundationBridgeContext
  bridgeContentVersion: number
  reviewDueAt: string
}

/**
 * Schema-v1 bridge proposals are internal authoring records. Authorship,
 * review, and pilot evidence are independent facts; none implies publication.
 */
export type DomainBridgeDefinition<
  Slug extends string = string,
  AxisKey extends string = string,
> = {
  id: string
  moduleSlug: Slug
  moduleAxis: AxisKey
  foundationDimension?: DimensionKey
  relation: DomainRelation
  rationale: string
  direction: DomainBridgeDirection
  authoringStatus: DomainBridgeAuthoringStatus
  reviewStatus: DomainBridgeReviewStatus
  evidenceStatus: DomainBridgeEvidenceStatus
  publication: "internal"
  versionContext: DomainBridgeVersionContext
  sourceIds?: string[]
  reviewIds?: string[]
}

export type DomainModuleManifest<
  Slug extends string = string,
  AxisKey extends string = string,
  LaneKey extends string = string,
> = {
  schemaVersion: typeof DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION
  manifestOrigin: ModuleManifestOrigin
  releaseState: ModuleReleaseState
  releaseDecision?: DomainReleaseDecisionReference
  evidenceStatus: ModuleEvidenceStatus
  manifestFingerprint: string
  slug: Slug
  versions: DomainModuleVersions
  axes: DomainModuleAxis<AxisKey>[]
  lanes: DomainModuleLane<AxisKey, LaneKey>[]
  questionTypes: ModuleQuestionType[]
  cardTypes: ChoiceCardType[]
  calibration: DomainModuleCalibration
  resultCopy: DomainModuleResultCopy
  localeStatus: DomainModuleLocaleStatus
  evidenceAuditHooks: DomainEvidenceAuditHooks
  relationPolicy: typeof DEFAULT_DOMAIN_RELATION_POLICY
  bridges: DomainBridgeDefinition<Slug, AxisKey>[]
}

export type SeparateDomainRead = typeof DEFAULT_DOMAIN_RELATION_READ

export type DomainBridgeSelector<AxisKey extends string = string> = {
  id: string
  bridgeContentVersion: number
  moduleAxis: AxisKey
  foundationDimension?: DimensionKey
}

/** Public bridges are categorically unavailable in schema v1. */
export function isDomainBridgePubliclyEligible(
  _manifest: DomainModuleManifest<string, string, string>,
  _bridge: unknown,
): false {
  return false
}

/** Public bridges are categorically unavailable in schema v1. */
export function getPublishedDomainBridges<
  Slug extends string,
  AxisKey extends string,
  LaneKey extends string,
>(
  _manifest: DomainModuleManifest<Slug, AxisKey, LaneKey>,
  _moduleAxis?: AxisKey,
): DomainBridgeDefinition<Slug, AxisKey>[] {
  return []
}

/** Schema v1 always resolves to two separate domain reads. */
export function resolveDomainRelationRead<
  Slug extends string,
  AxisKey extends string,
  LaneKey extends string,
>(
  _manifest: DomainModuleManifest<Slug, AxisKey, LaneKey>,
  _selector: DomainBridgeSelector<AxisKey>,
): SeparateDomainRead {
  return DEFAULT_DOMAIN_RELATION_READ
}

export function isFoundationDimensionKey(
  value: unknown,
): value is DimensionKey {
  return (
    typeof value === "string" &&
    (FOUNDATION_DIMENSION_KEYS as readonly string[]).includes(value)
  )
}
