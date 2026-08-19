import type { ChoiceCardType, DimensionKey, QuizMode } from "@/lib/types"

export const DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION = 1 as const

export const DOMAIN_RELATIONS = [
  "reinforces",
  "qualifies",
  "pulls-against",
  "not-comparable",
] as const
export type DomainRelation = (typeof DOMAIN_RELATIONS)[number]

export const DOMAIN_RELATION_STATUSES = [
  "authored",
  "expert-reviewed",
  "pilot-supported",
] as const
export type DomainRelationStatus =
  (typeof DOMAIN_RELATION_STATUSES)[number]

export const DOMAIN_BRIDGE_PUBLICATION_STATES = [
  "internal",
  "public",
] as const
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
  "source-complete",
  "reviewed",
  "partial",
  "not-authored",
] as const
export type ModuleLocaleStatus = (typeof MODULE_LOCALE_STATUSES)[number]

export const MODULE_RELEASE_STATES = ["template", "shipping"] as const
export type ModuleReleaseState = (typeof MODULE_RELEASE_STATES)[number]

export const DEFAULT_DOMAIN_RELATION_POLICY = {
  defaultRelation: "not-comparable",
  defaultRead: "separate-domain-read",
  rawScoreComparison: "forbidden",
  masterScore: "forbidden",
  publicRelations: "explicit-reviewed-bridge-only",
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
}

export type DomainEvidenceAuditHooks = {
  evidence: DomainEvidenceHook[]
  reviews: DomainEvidenceHook[]
  audits: DomainAuditHook[]
}

/**
 * Direction is authored semantic metadata. It deliberately contains no score,
 * threshold, coefficient, transform, or cross-scale arithmetic.
 */
export type DomainBridgeDirection = {
  modulePole: DomainDirectionPole
  foundationPole?: DomainDirectionPole
  semantics: string
}

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
  status: DomainRelationStatus
  contentVersion: number
  sourceIds?: string[]
  reviewIds?: string[]
  publication: DomainBridgePublicationState
}

export type DomainModuleManifest<
  Slug extends string = string,
  AxisKey extends string = string,
  LaneKey extends string = string,
> = {
  schemaVersion: typeof DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION
  releaseState: ModuleReleaseState
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

export type PublishedDomainBridgeRead<
  Slug extends string = string,
  AxisKey extends string = string,
> = {
  kind: "reviewed-bridge"
  relation: Exclude<DomainRelation, "not-comparable"> | "not-comparable"
  bridge: DomainBridgeDefinition<Slug, AxisKey>
  numericBridge: "none"
  masterScore: "none"
}

export type SeparateDomainRead = typeof DEFAULT_DOMAIN_RELATION_READ

export type DomainBridgeSelector<AxisKey extends string = string> = {
  id: string
  contentVersion: number
  moduleAxis: AxisKey
  foundationDimension?: DimensionKey
}

export function isReviewedDomainRelationStatus(
  status: DomainRelationStatus,
): status is Exclude<DomainRelationStatus, "authored"> {
  return status === "expert-reviewed" || status === "pilot-supported"
}

/**
 * A bridge is eligible for public use only when the bridge itself opts into
 * publication and carries a reviewed status plus stable review and evidence
 * IDs. Callers must never infer a relation from scores when this returns false.
 */
const PUBLIC_BRIDGE_KEYS = [
  "id",
  "moduleSlug",
  "moduleAxis",
  "foundationDimension",
  "relation",
  "rationale",
  "direction",
  "status",
  "contentVersion",
  "sourceIds",
  "reviewIds",
  "publication",
] as const

const PUBLIC_BRIDGE_DIRECTION_KEYS = [
  "modulePole",
  "foundationPole",
  "semantics",
] as const

const PUBLIC_BRIDGE_SELECTOR_KEYS = [
  "id",
  "contentVersion",
  "moduleAxis",
  "foundationDimension",
] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]) {
  return Object.keys(value).every((key) => keys.includes(key))
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0
}

function isSafeRepoPath(value: unknown): value is string {
  return (
    isNonEmptyString(value) &&
    !value.startsWith("/") &&
    !value.split("/").includes("..") &&
    !value.startsWith("tmp/")
  )
}

function hasDefaultRelationPolicy(value: unknown) {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, Object.keys(DEFAULT_DOMAIN_RELATION_POLICY)) &&
    value.defaultRelation === DEFAULT_DOMAIN_RELATION_POLICY.defaultRelation &&
    value.defaultRead === DEFAULT_DOMAIN_RELATION_POLICY.defaultRead &&
    value.rawScoreComparison ===
      DEFAULT_DOMAIN_RELATION_POLICY.rawScoreComparison &&
    value.masterScore === DEFAULT_DOMAIN_RELATION_POLICY.masterScore &&
    value.publicRelations === DEFAULT_DOMAIN_RELATION_POLICY.publicRelations
  )
}

function isStableIdArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (id) =>
        typeof id === "string" && STABLE_AUTHORING_ID_PATTERN.test(id),
    ) &&
    new Set(value).size === value.length
  )
}

function hasExactResolvedHookIds(
  ids: unknown,
  hooks: unknown,
): ids is string[] {
  if (!isStableIdArray(ids) || !Array.isArray(hooks)) return false

  return ids.every(
    (id) =>
      hooks.filter(
        (hook) =>
          isRecord(hook) &&
          hasOnlyKeys(hook, ["id", "path"]) &&
          hook.id === id &&
          isSafeRepoPath(hook.path),
      ).length === 1,
  )
}

/**
 * This is the runtime publication boundary, not merely a status check. Every
 * selected record is revalidated against its manifest so callers cannot bypass
 * the authoring validator with cast or decoded data.
 */
export function isDomainBridgePubliclyEligible(
  manifest: DomainModuleManifest<string, string, string>,
  bridge: unknown,
): bridge is DomainBridgeDefinition {
  if (
    !isRecord(manifest) ||
    !Array.isArray(manifest.axes) ||
    manifest.schemaVersion !== DOMAIN_MODULE_MANIFEST_SCHEMA_VERSION ||
    manifest.releaseState !== "shipping" ||
    !hasDefaultRelationPolicy(manifest.relationPolicy) ||
    !isRecord(bridge) ||
    !hasOnlyKeys(bridge, PUBLIC_BRIDGE_KEYS)
  ) {
    return false
  }
  if (
    !isNonEmptyString(manifest.slug) ||
    bridge.moduleSlug !== manifest.slug ||
    !isNonEmptyString(bridge.moduleAxis) ||
    manifest.axes.filter(
      (axis) => isRecord(axis) && axis.key === bridge.moduleAxis,
    ).length !== 1 ||
    !isNonEmptyString(bridge.id) ||
    !STABLE_AUTHORING_ID_PATTERN.test(bridge.id) ||
    !DOMAIN_RELATIONS.includes(bridge.relation as DomainRelation) ||
    !isNonEmptyString(bridge.rationale) ||
    !DOMAIN_RELATION_STATUSES.includes(bridge.status as DomainRelationStatus) ||
    !isReviewedDomainRelationStatus(bridge.status as DomainRelationStatus) ||
    bridge.publication !== "public" ||
    !isPositiveInteger(bridge.contentVersion)
  ) {
    return false
  }

  if (
    bridge.foundationDimension !== undefined &&
    !isFoundationDimensionKey(bridge.foundationDimension)
  ) {
    return false
  }
  if (
    bridge.relation !== "not-comparable" &&
    bridge.foundationDimension === undefined
  ) {
    return false
  }

  if (
    !isRecord(bridge.direction) ||
    !hasOnlyKeys(bridge.direction, PUBLIC_BRIDGE_DIRECTION_KEYS) ||
    !DOMAIN_DIRECTION_POLES.includes(
      bridge.direction.modulePole as DomainDirectionPole,
    ) ||
    !isNonEmptyString(bridge.direction.semantics)
  ) {
    return false
  }
  if (
    bridge.direction.foundationPole !== undefined &&
    !DOMAIN_DIRECTION_POLES.includes(
      bridge.direction.foundationPole as DomainDirectionPole,
    )
  ) {
    return false
  }
  if (
    (bridge.foundationDimension === undefined) !==
    (bridge.direction.foundationPole === undefined)
  ) {
    return false
  }

  const hooks = manifest.evidenceAuditHooks
  return (
    isRecord(hooks) &&
    hasExactResolvedHookIds(bridge.sourceIds, hooks.evidence) &&
    hasExactResolvedHookIds(bridge.reviewIds, hooks.reviews)
  )
}

export function getPublishedDomainBridges<
  Slug extends string,
  AxisKey extends string,
  LaneKey extends string,
>(
  manifest: DomainModuleManifest<Slug, AxisKey, LaneKey>,
  moduleAxis?: AxisKey,
): DomainBridgeDefinition<Slug, AxisKey>[] {
  if (!isRecord(manifest) || !Array.isArray(manifest.bridges)) return []

  return manifest.bridges.filter(
    (bridge) =>
      isDomainBridgePubliclyEligible(manifest, bridge) &&
      (!moduleAxis || bridge.moduleAxis === moduleAxis),
  )
}

export function resolveDomainRelationRead<
  Slug extends string,
  AxisKey extends string,
  LaneKey extends string,
>(
  manifest: DomainModuleManifest<Slug, AxisKey, LaneKey>,
  selector: DomainBridgeSelector<AxisKey>,
): PublishedDomainBridgeRead<Slug, AxisKey> | SeparateDomainRead {
  if (
    !isRecord(manifest) ||
    !Array.isArray(manifest.axes) ||
    !Array.isArray(manifest.bridges) ||
    !isRecord(selector) ||
    !hasOnlyKeys(selector, PUBLIC_BRIDGE_SELECTOR_KEYS) ||
    typeof selector.id !== "string" ||
    !STABLE_AUTHORING_ID_PATTERN.test(selector.id) ||
    !isPositiveInteger(selector.contentVersion) ||
    typeof selector.moduleAxis !== "string" ||
    !manifest.axes.some(
      (axis) => isRecord(axis) && axis.key === selector.moduleAxis,
    ) ||
    (selector.foundationDimension !== undefined &&
      !isFoundationDimensionKey(selector.foundationDimension))
  ) {
    return DEFAULT_DOMAIN_RELATION_READ
  }

  const bridges = manifest.bridges.filter(
    (bridge) =>
      isRecord(bridge) &&
      bridge.id === selector.id &&
      bridge.contentVersion === selector.contentVersion &&
      bridge.moduleAxis === selector.moduleAxis &&
      bridge.foundationDimension === selector.foundationDimension,
  )

  // Duplicate exact records and invalid contextual metadata both fail closed.
  if (
    bridges.length !== 1 ||
    !isDomainBridgePubliclyEligible(manifest, bridges[0])
  ) {
    return DEFAULT_DOMAIN_RELATION_READ
  }

  return {
    kind: "reviewed-bridge",
    relation: bridges[0].relation,
    bridge: bridges[0],
    numericBridge: "none",
    masterScore: "none",
  }
}

export function isFoundationDimensionKey(
  value: unknown,
): value is DimensionKey {
  return (
    typeof value === "string" &&
    (FOUNDATION_DIMENSION_KEYS as readonly string[]).includes(value)
  )
}
