import type { AiAxisKey } from "@/lib/ai-governance-types"
import type { DimensionKey } from "@/lib/types"

export const REFERENCE_ENTITY_TYPES = [
  "thinker",
  "leader",
  "government",
  "movement",
  "institution",
  "doctrine",
  "ai-current",
] as const

export type ReferenceEntityType = (typeof REFERENCE_ENTITY_TYPES)[number]

export const IR_REFERENCE_SCOPES = ["foundation", "security", "technology"] as const
export type IrReferenceScope = (typeof IR_REFERENCE_SCOPES)[number]

export const REFERENCE_SCOPES = [...IR_REFERENCE_SCOPES, "ai-governance"] as const
export type ReferenceScope = (typeof REFERENCE_SCOPES)[number]

export const EVIDENCE_SUPPORT_LEVELS = ["sparse", "partial", "strong"] as const
export type EvidenceSupport = (typeof EVIDENCE_SUPPORT_LEVELS)[number]

export const REFERENCE_SOURCE_KINDS = [
  "enacted-policy",
  "official-statement",
  "canonical-work",
  "documented-reporting",
  "expert-dataset",
  "analyst-interpretation",
] as const
export type ReferenceSourceKind = (typeof REFERENCE_SOURCE_KINDS)[number]

export type ReferenceSource = {
  id: string
  title: string
  author?: string
  publisher: string
  publishedAt: string
  url: string
  kind: ReferenceSourceKind
  /** Source-hierarchy tier from the V16 method, where 1 carries the most weight. */
  tier: 1 | 2 | 3 | 4 | 5 | 6
}

export type IrReferenceEvidence = {
  id: string
  scope: "ir"
  sourceId: string
  dimensionKeys: DimensionKey[]
  note: string
  axisKeys?: never
}

export type AiReferenceEvidence = {
  id: string
  scope: "ai-governance"
  sourceId: string
  axisKeys: AiAxisKey[]
  note: string
  dimensionKeys?: never
}

export type ReferenceEvidence = IrReferenceEvidence | AiReferenceEvidence

export type CodedEstimate = {
  value: number
  support: EvidenceSupport
  sourceIds: string[]
  evidenceIds: string[]
  note: string
}

export type DimensionEstimate = CodedEstimate
export type AiAxisEstimate = CodedEstimate

export const REFERENCE_REVIEW_ROLES = ["coder", "second-reader", "editor"] as const
export type ReferenceReviewRole = (typeof REFERENCE_REVIEW_ROLES)[number]

export type ReferenceReview = {
  reviewerId: string
  role: ReferenceReviewRole
  reviewedAt: string
}

export const REFERENCE_PUBLICATION_STATUSES = [
  "draft",
  "pending-review",
  "published",
  "withdrawn",
] as const
export type ReferencePublicationStatus =
  (typeof REFERENCE_PUBLICATION_STATUSES)[number]

export type ReferenceVersionRecord = {
  version: number
  changedAt: string
  changeNote: string
}

type ReferenceEditorialState = {
  public: boolean
  publicationStatus: ReferencePublicationStatus
  reviewedAt: string
  reviewers: ReferenceReview[]
  version: number
  versionHistory: ReferenceVersionRecord[]
}

type ReferenceProfileBase = ReferenceEditorialState & {
  id: string
  name: string
  shortName: string
  entityType: Exclude<ReferenceEntityType, "movement">
  asOf: string
  evidenceWindow: {
    start?: string
    end: string
  }
  domain: string
  scopeNote: string
  summary: string
  sourceIds: string[]
  disputes: string[]
}

export type IrReferenceProfile = ReferenceProfileBase & {
  scope: IrReferenceScope
  evidence: IrReferenceEvidence[]
  dimensionEstimates: Partial<Record<DimensionKey, DimensionEstimate>>
  axisEstimates?: never
}

export type AiGovernanceReferenceProfile = ReferenceProfileBase & {
  scope: "ai-governance"
  evidence: AiReferenceEvidence[]
  axisEstimates: Partial<Record<AiAxisKey, AiAxisEstimate>>
  dimensionEstimates?: never
}

export type ReferenceProfile =
  | IrReferenceProfile
  | AiGovernanceReferenceProfile

export type ReferenceMovement = ReferenceEditorialState & {
  id: string
  name: string
  shortName: string
  entityType: "movement"
  scope: ReferenceScope
  memberProfileIds: string[]
  scopeNote: string
  internalDisagreements: string[]
}

export type ReferenceEntity = ReferenceProfile | ReferenceMovement

export const REFERENCE_CATALOG_DATA_STATUSES = [
  "non-public-demo",
  "internal-review",
  "public",
] as const
export type ReferenceCatalogDataStatus =
  (typeof REFERENCE_CATALOG_DATA_STATUSES)[number]

export type ReferenceCatalog = {
  schemaVersion: number
  catalogVersion: number
  generatedAt: string
  dataStatus: ReferenceCatalogDataStatus
  notice: string
  sources: ReferenceSource[]
  profiles: ReferenceProfile[]
  movements: ReferenceMovement[]
}

export function isReferenceEntityType(value: unknown): value is ReferenceEntityType {
  return REFERENCE_ENTITY_TYPES.includes(value as ReferenceEntityType)
}

export function isReferenceScope(value: unknown): value is ReferenceScope {
  return REFERENCE_SCOPES.includes(value as ReferenceScope)
}

export function isIrReferenceScope(value: unknown): value is IrReferenceScope {
  return IR_REFERENCE_SCOPES.includes(value as IrReferenceScope)
}
