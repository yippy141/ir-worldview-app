import type { AiAxisKey } from "@/lib/ai-governance-types"
import { dimensionLabels } from "@/lib/quiz-schema"
import { toMapPosition, type MapPosition } from "@/lib/results/position"
import {
  EVIDENCE_SUPPORT_LEVELS,
  REFERENCE_CATALOG_DATA_STATUSES,
  REFERENCE_ENTITY_TYPES,
  REFERENCE_PUBLICATION_STATUSES,
  REFERENCE_REVIEW_ROLES,
  REFERENCE_SOURCE_KINDS,
  isIrReferenceScope,
  isReferenceScope,
  type CodedEstimate,
  type IrReferenceProfile,
  type ReferenceCatalog,
  type ReferenceProfile,
} from "@/lib/reference-profiles/types"
import type { DimensionKey, DimensionScores } from "@/lib/types"

export const REFERENCE_DIMENSION_KEYS = Object.keys(dimensionLabels) as DimensionKey[]
export const REFERENCE_AI_AXIS_KEYS = [
  "riskHorizon",
  "deploymentPace",
  "oversight",
  "geopolitics",
  "openness",
  "militaryRole",
  "legitimacy",
  "humanFuture",
] as const satisfies readonly AiAxisKey[]

const DIMENSION_KEY_SET = new Set<string>(REFERENCE_DIMENSION_KEYS)
const AI_AXIS_KEY_SET = new Set<string>(REFERENCE_AI_AXIS_KEYS)

export type ReferenceValidationError = {
  code: string
  path: string
  message: string
}

export type ReferenceValidationResult = {
  ok: boolean
  valid: boolean
  errors: ReferenceValidationError[]
}

type JsonRecord = Record<string, unknown>

/**
 * Validate the complete static catalog and its cross-record links. Validation
 * accumulates errors so editorial source packs can be repaired in one pass.
 */
export function validateReferenceCatalog(value: unknown): ReferenceValidationResult {
  const errors: ReferenceValidationError[] = []
  const add = (code: string, path: string, message: string) => {
    errors.push({ code, path, message })
  }

  if (!isRecord(value)) {
    add("catalog.shape", "catalog", "Reference catalog must be an object.")
    return result(errors)
  }

  validatePositiveInteger(value.schemaVersion, "catalog.schemaVersion", add)
  validatePositiveInteger(value.catalogVersion, "catalog.catalogVersion", add)
  validateIsoDate(value.generatedAt, "catalog.generatedAt", add)
  validateNonEmptyString(value.notice, "catalog.notice", add)

  if (!REFERENCE_CATALOG_DATA_STATUSES.includes(value.dataStatus as never)) {
    add("catalog.data-status", "catalog.dataStatus", "Catalog data status is invalid.")
  }

  const sourceRecords = Array.isArray(value.sources) ? value.sources : []
  if (!Array.isArray(value.sources)) {
    add("catalog.sources", "catalog.sources", "Catalog sources must be an array.")
  }

  const sourceById = new Map<string, JsonRecord>()
  sourceRecords.forEach((source, index) => {
    const path = `catalog.sources[${index}]`
    if (!isRecord(source)) {
      add("source.shape", path, "Source must be an object.")
      return
    }

    validateSource(source, path, add)
    if (typeof source.id !== "string" || source.id.length === 0) return
    if (sourceById.has(source.id)) {
      add("source.duplicate-id", `${path}.id`, `Duplicate source ID: ${source.id}.`)
      return
    }
    sourceById.set(source.id, source)
  })

  const profileRecords = Array.isArray(value.profiles) ? value.profiles : []
  if (!Array.isArray(value.profiles)) {
    add("catalog.profiles", "catalog.profiles", "Catalog profiles must be an array.")
  }

  const movementRecords = Array.isArray(value.movements) ? value.movements : []
  if (!Array.isArray(value.movements)) {
    add("catalog.movements", "catalog.movements", "Catalog movements must be an array.")
  }

  const entityById = new Map<string, JsonRecord>()
  const evidenceIds = new Set<string>()

  profileRecords.forEach((profile, index) => {
    const path = `catalog.profiles[${index}]`
    if (!isRecord(profile)) {
      add("profile.shape", path, "Reference profile must be an object.")
      return
    }
    registerEntityId(profile, path, entityById, add)
  })

  movementRecords.forEach((movement, index) => {
    const path = `catalog.movements[${index}]`
    if (!isRecord(movement)) {
      add("movement.shape", path, "Reference movement must be an object.")
      return
    }
    registerEntityId(movement, path, entityById, add)
  })

  profileRecords.forEach((profile, index) => {
    if (!isRecord(profile)) return
    validateProfile(
      profile,
      `catalog.profiles[${index}]`,
      sourceById,
      evidenceIds,
      value.generatedAt,
      value.dataStatus,
      add,
    )
  })

  movementRecords.forEach((movement, index) => {
    if (!isRecord(movement)) return
    validateMovement(
      movement,
      `catalog.movements[${index}]`,
      entityById,
      value.generatedAt,
      value.dataStatus,
      add,
    )
  })

  return result(errors)
}

export function assertValidReferenceCatalog(
  value: unknown,
): asserts value is ReferenceCatalog {
  const validation = validateReferenceCatalog(value)
  if (!validation.ok) {
    const summary = validation.errors
      .map((error) => `${error.path}: ${error.message}`)
      .join("\n")
    throw new Error(`Invalid Reference Profile catalog:\n${summary}`)
  }
}

export function isReferenceProfileMappable(
  profile: ReferenceProfile,
): profile is IrReferenceProfile & {
  dimensionEstimates: Record<DimensionKey, CodedEstimate>
} {
  if (profile.scope === "ai-governance" || !isReferenceProfilePublishable(profile)) {
    return false
  }

  if (
    !isIsoDate(profile.asOf) ||
    !isIsoDate(profile.reviewedAt) ||
    !isIsoDate(profile.evidenceWindow.end)
  ) {
    return false
  }

  const profileSourceIds = new Set(profile.sourceIds)

  return REFERENCE_DIMENSION_KEYS.every((key) => {
    const estimate = profile.dimensionEstimates[key]
    if (
      !estimate ||
      typeof estimate.value !== "number" ||
      !Number.isFinite(estimate.value) ||
      estimate.value < 1 ||
      estimate.value > 7 ||
      !EVIDENCE_SUPPORT_LEVELS.includes(estimate.support) ||
      estimate.sourceIds.length === 0 ||
      estimate.evidenceIds.length === 0
    ) {
      return false
    }

    const sourceIds = new Set(estimate.sourceIds)
    const evidenceIds = new Set(estimate.evidenceIds)
    if (
      sourceIds.size !== estimate.sourceIds.length ||
      evidenceIds.size !== estimate.evidenceIds.length ||
      [...sourceIds].some((sourceId) => !profileSourceIds.has(sourceId)) ||
      (estimate.support === "strong" && (sourceIds.size < 2 || evidenceIds.size < 2))
    ) {
      return false
    }

    const linkedEvidence = estimate.evidenceIds
      .map((evidenceId) =>
        profile.evidence.find(
          (evidence) =>
            evidence.id === evidenceId &&
            evidence.dimensionKeys.includes(key) &&
            sourceIds.has(evidence.sourceId),
        ),
      )
      .filter((evidence): evidence is IrReferenceProfile["evidence"][number] =>
        Boolean(evidence),
      )

    return (
      linkedEvidence.length === estimate.evidenceIds.length &&
      new Set(linkedEvidence.map((evidence) => evidence.sourceId)).size === sourceIds.size
    )
  })
}

export function getReferenceProfileDimensionScores(
  profile: ReferenceProfile,
): DimensionScores | null {
  if (!isReferenceProfileMappable(profile)) return null

  return Object.fromEntries(
    REFERENCE_DIMENSION_KEYS.map((key) => [key, profile.dimensionEstimates[key].value]),
  ) as DimensionScores
}

/**
 * Reference coordinates always pass through the same authored projection as
 * Foundation results. AI-governance axes and incomplete IR profiles return
 * null and are never coerced into Foundation coordinates.
 */
export function getReferenceProfilePosition(
  profile: ReferenceProfile,
): MapPosition | null {
  const scores = getReferenceProfileDimensionScores(profile)
  return scores ? toMapPosition(scores) : null
}

export function isReferenceProfilePublishable(profile: ReferenceProfile): boolean {
  const supportedDimensionCount =
    profile.scope === "ai-governance"
      ? Object.keys(profile.axisEstimates).length
      : Object.keys(profile.dimensionEstimates).length

  return (
    profile.public === true &&
    profile.publicationStatus === "published" &&
    profile.reviewers.some(
      (review) =>
        review.role === "second-reader" &&
        review.reviewedAt === profile.reviewedAt &&
        isIsoDate(review.reviewedAt),
    ) &&
    supportedDimensionCount >= 5 &&
    profile.disputes.length > 0
  )
}

export function hasReferenceValidationError(
  validation: ReferenceValidationResult,
  code: string,
): boolean {
  return validation.errors.some((error) => error.code === code)
}

function validateSource(
  source: JsonRecord,
  path: string,
  add: AddError,
) {
  validateId(source.id, `${path}.id`, add)
  validateNonEmptyString(source.title, `${path}.title`, add)
  if (source.author !== undefined) {
    validateNonEmptyString(source.author, `${path}.author`, add)
  }
  validateNonEmptyString(source.publisher, `${path}.publisher`, add)
  validateIsoDate(source.publishedAt, `${path}.publishedAt`, add)

  if (!REFERENCE_SOURCE_KINDS.includes(source.kind as never)) {
    add("source.kind", `${path}.kind`, "Source kind is invalid.")
  }

  if (!Number.isInteger(source.tier) || Number(source.tier) < 1 || Number(source.tier) > 6) {
    add("source.tier", `${path}.tier`, "Source tier must be an integer from 1 through 6.")
  }

  if (typeof source.url !== "string" || !isHttpUrl(source.url)) {
    add("source.url", `${path}.url`, "Source URL must be an HTTP or HTTPS URL.")
  }
}

function validateProfile(
  profile: JsonRecord,
  path: string,
  sourceById: Map<string, JsonRecord>,
  globalEvidenceIds: Set<string>,
  catalogGeneratedAt: unknown,
  catalogDataStatus: unknown,
  add: AddError,
) {
  validateId(profile.id, `${path}.id`, add)
  validateNonEmptyString(profile.name, `${path}.name`, add)
  validateNonEmptyString(profile.shortName, `${path}.shortName`, add)
  validateNonEmptyString(profile.domain, `${path}.domain`, add)
  validateNonEmptyString(profile.scopeNote, `${path}.scopeNote`, add)
  validateNonEmptyString(profile.summary, `${path}.summary`, add)

  if (
    !REFERENCE_ENTITY_TYPES.includes(profile.entityType as never) ||
    profile.entityType === "movement"
  ) {
    add("profile.entity-type", `${path}.entityType`, "Profile entity type is invalid.")
  }

  if (!isReferenceScope(profile.scope)) {
    add("profile.scope", `${path}.scope`, "Profile scope is invalid.")
  }

  validateEditorialState(
    profile,
    path,
    catalogGeneratedAt,
    catalogDataStatus,
    add,
  )
  validateNonEmptyStringArray(profile.disputes, `${path}.disputes`, add, true)
  validateIsoDate(profile.asOf, `${path}.asOf`, add)

  let windowStart: unknown
  let windowEnd: unknown
  if (!isRecord(profile.evidenceWindow)) {
    add("profile.evidence-window", `${path}.evidenceWindow`, "Evidence window must be an object.")
  } else {
    windowStart = profile.evidenceWindow.start
    windowEnd = profile.evidenceWindow.end
    if (windowStart !== undefined) {
      validateIsoDate(windowStart, `${path}.evidenceWindow.start`, add)
    }
    validateIsoDate(windowEnd, `${path}.evidenceWindow.end`, add)
    if (isIsoDate(windowStart) && isIsoDate(windowEnd) && windowStart > windowEnd) {
      add(
        "date.order",
        `${path}.evidenceWindow`,
        "Evidence-window start must fall on or before its end.",
      )
    }
    if (isIsoDate(windowEnd) && isIsoDate(profile.asOf) && windowEnd > profile.asOf) {
      add("date.order", `${path}.asOf`, "Profile as-of date must follow its evidence window.")
    }
  }

  if (
    isIsoDate(profile.asOf) &&
    isIsoDate(profile.reviewedAt) &&
    profile.asOf > profile.reviewedAt
  ) {
    add("date.order", `${path}.reviewedAt`, "Review date must follow the profile as-of date.")
  }

  const profileSourceIds = validateIdArray(
    profile.sourceIds,
    `${path}.sourceIds`,
    "profile.source-id",
    add,
    true,
  )
  for (const sourceId of profileSourceIds) {
    if (!sourceById.has(sourceId)) {
      add(
        "profile.unknown-source",
        `${path}.sourceIds`,
        `Profile references unknown source ID: ${sourceId}.`,
      )
    }
  }

  const evidenceRecords = Array.isArray(profile.evidence) ? profile.evidence : []
  if (!Array.isArray(profile.evidence) || evidenceRecords.length === 0) {
    add("evidence.required", `${path}.evidence`, "Profile evidence must be a non-empty array.")
  }

  const evidenceById = new Map<string, JsonRecord>()
  const usedProfileSourceIds = new Set<string>()
  const isAiProfile = profile.scope === "ai-governance"
  const validKeySet = isAiProfile ? AI_AXIS_KEY_SET : DIMENSION_KEY_SET
  const keyField = isAiProfile ? "axisKeys" : "dimensionKeys"

  evidenceRecords.forEach((evidence, index) => {
    const evidencePath = `${path}.evidence[${index}]`
    if (!isRecord(evidence)) {
      add("evidence.shape", evidencePath, "Evidence item must be an object.")
      return
    }

    validateId(evidence.id, `${evidencePath}.id`, add)
    if (typeof evidence.id === "string" && evidence.id.length > 0) {
      if (globalEvidenceIds.has(evidence.id)) {
        add(
          "evidence.duplicate-id",
          `${evidencePath}.id`,
          `Duplicate evidence ID: ${evidence.id}.`,
        )
      } else {
        globalEvidenceIds.add(evidence.id)
        evidenceById.set(evidence.id, evidence)
      }
    }

    const expectedEvidenceScope = isAiProfile ? "ai-governance" : "ir"
    if (evidence.scope !== expectedEvidenceScope) {
      add(
        "evidence.scope",
        `${evidencePath}.scope`,
        "Evidence scope must match its profile instrument.",
      )
    }

    validateNonEmptyString(evidence.note, `${evidencePath}.note`, add)
    if (typeof evidence.sourceId !== "string" || evidence.sourceId.length === 0) {
      add("evidence.source-id", `${evidencePath}.sourceId`, "Evidence source ID is required.")
    } else {
      if (!sourceById.has(evidence.sourceId)) {
        add(
          "evidence.unknown-source",
          `${evidencePath}.sourceId`,
          `Evidence references unknown source ID: ${evidence.sourceId}.`,
        )
      }
      if (!profileSourceIds.includes(evidence.sourceId)) {
        add(
          "evidence.unlisted-source",
          `${evidencePath}.sourceId`,
          "Evidence source must appear in the profile source ledger.",
        )
      }
      usedProfileSourceIds.add(evidence.sourceId)

      const sourceDate = sourceById.get(evidence.sourceId)?.publishedAt
      if (
        isIsoDate(sourceDate) &&
        ((isIsoDate(windowStart) && sourceDate < windowStart) ||
          (isIsoDate(windowEnd) && sourceDate > windowEnd))
      ) {
        add(
          "evidence.date-window",
          `${evidencePath}.sourceId`,
          "Evidence source date falls outside the profile evidence window.",
        )
      }
    }

    validateKeyArray(evidence[keyField], `${evidencePath}.${keyField}`, validKeySet, add)
    const incompatibleField = isAiProfile ? "dimensionKeys" : "axisKeys"
    if (evidence[incompatibleField] !== undefined) {
      add(
        "evidence.instrument-mismatch",
        `${evidencePath}.${incompatibleField}`,
        "Evidence cannot link dimensions from a different instrument.",
      )
    }
  })

  for (const sourceId of profileSourceIds) {
    if (!usedProfileSourceIds.has(sourceId)) {
      add(
        "profile.unused-source",
        `${path}.sourceIds`,
        `Profile source has no evidence item: ${sourceId}.`,
      )
    }
  }

  if (isAiProfile) {
    if (profile.dimensionEstimates !== undefined) {
      add(
        "profile.instrument-mismatch",
        `${path}.dimensionEstimates`,
        "AI-governance profiles cannot contain Foundation dimension estimates.",
      )
    }
    validateEstimates(
      profile.axisEstimates,
      `${path}.axisEstimates`,
      AI_AXIS_KEY_SET,
      "axisKeys",
      evidenceById,
      profileSourceIds,
      sourceById,
      add,
    )
  } else {
    if (profile.axisEstimates !== undefined) {
      add(
        "profile.instrument-mismatch",
        `${path}.axisEstimates`,
        "IR profiles cannot contain AI-governance axis estimates.",
      )
    }
    if (!isIrReferenceScope(profile.scope)) {
      add("profile.scope", `${path}.scope`, "IR profile scope is invalid.")
    }
    validateEstimates(
      profile.dimensionEstimates,
      `${path}.dimensionEstimates`,
      DIMENSION_KEY_SET,
      "dimensionKeys",
      evidenceById,
      profileSourceIds,
      sourceById,
      add,
    )
  }
}

function validateEstimates(
  estimatesValue: unknown,
  path: string,
  validKeySet: Set<string>,
  evidenceKeyField: "dimensionKeys" | "axisKeys",
  evidenceById: Map<string, JsonRecord>,
  profileSourceIds: string[],
  sourceById: Map<string, JsonRecord>,
  add: AddError,
) {
  if (!isRecord(estimatesValue) || Object.keys(estimatesValue).length === 0) {
    add("estimate.required", path, "Profile estimates must be a non-empty object.")
    return
  }

  const estimatedKeys = new Set<string>()
  for (const [key, estimateValue] of Object.entries(estimatesValue)) {
    const estimatePath = `${path}.${key}`
    if (!validKeySet.has(key)) {
      add("estimate.unknown-key", estimatePath, `Unknown estimate key: ${key}.`)
      continue
    }
    estimatedKeys.add(key)

    if (!isRecord(estimateValue)) {
      add("estimate.shape", estimatePath, "Dimension estimate must be an object.")
      continue
    }

    if (
      typeof estimateValue.value !== "number" ||
      !Number.isFinite(estimateValue.value) ||
      estimateValue.value < 1 ||
      estimateValue.value > 7
    ) {
      add("estimate.bounds", `${estimatePath}.value`, "Estimate value must be between 1 and 7.")
    }
    if (!EVIDENCE_SUPPORT_LEVELS.includes(estimateValue.support as never)) {
      add("estimate.support", `${estimatePath}.support`, "Evidence support level is invalid.")
    }
    validateNonEmptyString(estimateValue.note, `${estimatePath}.note`, add)

    const sourceIds = validateIdArray(
      estimateValue.sourceIds,
      `${estimatePath}.sourceIds`,
      "estimate.source-id",
      add,
      true,
    )
    if (estimateValue.support === "strong" && sourceIds.length < 2) {
      add(
        "estimate.strong-source-count",
        `${estimatePath}.sourceIds`,
        "Strong support requires at least two source IDs.",
      )
    }
    for (const sourceId of sourceIds) {
      if (!sourceById.has(sourceId)) {
        add(
          "estimate.unknown-source",
          `${estimatePath}.sourceIds`,
          `Estimate references unknown source ID: ${sourceId}.`,
        )
      }
      if (!profileSourceIds.includes(sourceId)) {
        add(
          "estimate.unlisted-source",
          `${estimatePath}.sourceIds`,
          "Estimate source must appear in the profile source ledger.",
        )
      }
    }

    const evidenceIds = validateIdArray(
      estimateValue.evidenceIds,
      `${estimatePath}.evidenceIds`,
      "estimate.evidence-id",
      add,
      true,
    )
    const evidenceSourceIds = new Set<string>()
    for (const evidenceId of evidenceIds) {
      const evidence = evidenceById.get(evidenceId)
      if (!evidence) {
        add(
          "estimate.unknown-evidence",
          `${estimatePath}.evidenceIds`,
          `Estimate references unknown evidence ID: ${evidenceId}.`,
        )
        continue
      }

      const linkedKeys = evidence[evidenceKeyField]
      if (!Array.isArray(linkedKeys) || !linkedKeys.includes(key)) {
        add(
          "estimate.evidence-link",
          `${estimatePath}.evidenceIds`,
          `Evidence ${evidenceId} does not link to ${key}.`,
        )
      }
      if (typeof evidence.sourceId === "string") {
        evidenceSourceIds.add(evidence.sourceId)
        if (!sourceIds.includes(evidence.sourceId)) {
          add(
            "estimate.evidence-source",
            `${estimatePath}.evidenceIds`,
            `Evidence ${evidenceId} uses a source omitted from the estimate source IDs.`,
          )
        }
      }
    }

    for (const sourceId of sourceIds) {
      if (!evidenceSourceIds.has(sourceId)) {
        add(
          "estimate.source-coverage",
          `${estimatePath}.sourceIds`,
          `Estimate source lacks linked evidence: ${sourceId}.`,
        )
      }
    }
  }

  for (const evidence of evidenceById.values()) {
    const linkedKeys = evidence[evidenceKeyField]
    if (!Array.isArray(linkedKeys)) continue
    for (const key of linkedKeys) {
      if (typeof key === "string" && validKeySet.has(key) && !estimatedKeys.has(key)) {
        add(
          "evidence.unestimated-key",
          path,
          `Evidence links to ${key}, which has no estimate.`,
        )
      }
    }
  }
}

function validateMovement(
  movement: JsonRecord,
  path: string,
  entityById: Map<string, JsonRecord>,
  catalogGeneratedAt: unknown,
  catalogDataStatus: unknown,
  add: AddError,
) {
  validateId(movement.id, `${path}.id`, add)
  validateNonEmptyString(movement.name, `${path}.name`, add)
  validateNonEmptyString(movement.shortName, `${path}.shortName`, add)
  validateNonEmptyString(movement.scopeNote, `${path}.scopeNote`, add)
  validateNonEmptyStringArray(
    movement.internalDisagreements,
    `${path}.internalDisagreements`,
    add,
    true,
  )

  if (movement.entityType !== "movement") {
    add("movement.entity-type", `${path}.entityType`, "Movement entity type must be movement.")
  }
  if (!isReferenceScope(movement.scope)) {
    add("movement.scope", `${path}.scope`, "Movement scope is invalid.")
  }

  validateEditorialState(
    movement,
    path,
    catalogGeneratedAt,
    catalogDataStatus,
    add,
  )

  const memberIds = validateIdArray(
    movement.memberProfileIds,
    `${path}.memberProfileIds`,
    "movement.member-id",
    add,
    true,
  )
  if (memberIds.length < 2) {
    add(
      "movement.member-count",
      `${path}.memberProfileIds`,
      "Movement requires at least two member profiles.",
    )
  }

  for (const memberId of memberIds) {
    const member = entityById.get(memberId)
    if (!member || member.entityType === "movement") {
      add(
        "movement.unknown-member",
        `${path}.memberProfileIds`,
        `Movement member must identify an existing profile: ${memberId}.`,
      )
      continue
    }
    if (member.scope !== movement.scope) {
      add(
        "movement.scope-mismatch",
        `${path}.memberProfileIds`,
        `Movement member ${memberId} has a different scope.`,
      )
    }
  }
}

function validateEditorialState(
  record: JsonRecord,
  path: string,
  catalogGeneratedAt: unknown,
  catalogDataStatus: unknown,
  add: AddError,
) {
  if (typeof record.public !== "boolean") {
    add("publication.public", `${path}.public`, "Public flag must be boolean.")
  }
  if (!REFERENCE_PUBLICATION_STATUSES.includes(record.publicationStatus as never)) {
    add(
      "publication.status",
      `${path}.publicationStatus`,
      "Publication status is invalid.",
    )
  }
  if (record.public === true && record.publicationStatus !== "published") {
    add(
      "publication.state",
      `${path}.publicationStatus`,
      "Public records must carry published status.",
    )
  }
  if (record.publicationStatus === "published" && record.public !== true) {
    add(
      "publication.state",
      `${path}.public`,
      "Published records must carry a public flag.",
    )
  }
  if (catalogDataStatus !== "public" && record.public === true) {
    add(
      "publication.non-public-catalog",
      `${path}.public`,
      "A non-public catalog cannot contain public records.",
    )
  }

  validateIsoDate(record.reviewedAt, `${path}.reviewedAt`, add)
  if (
    isIsoDate(record.reviewedAt) &&
    isIsoDate(catalogGeneratedAt) &&
    record.reviewedAt > catalogGeneratedAt
  ) {
    add("date.order", `${path}.reviewedAt`, "Review date cannot follow catalog generation.")
  }

  const reviewerRecords = Array.isArray(record.reviewers) ? record.reviewers : []
  if (!Array.isArray(record.reviewers) || reviewerRecords.length === 0) {
    add("review.required", `${path}.reviewers`, "At least one coding or review record is required.")
  }
  const reviewerIds = new Set<string>()
  let hasReviewAtCurrentDate = false
  reviewerRecords.forEach((review, index) => {
    const reviewPath = `${path}.reviewers[${index}]`
    if (!isRecord(review)) {
      add("review.shape", reviewPath, "Review must be an object.")
      return
    }
    validateId(review.reviewerId, `${reviewPath}.reviewerId`, add)
    if (typeof review.reviewerId === "string") {
      if (reviewerIds.has(review.reviewerId)) {
        add("review.duplicate-reviewer", `${reviewPath}.reviewerId`, "Reviewer IDs must be unique.")
      }
      reviewerIds.add(review.reviewerId)
    }
    if (!REFERENCE_REVIEW_ROLES.includes(review.role as never)) {
      add("review.role", `${reviewPath}.role`, "Review role is invalid.")
    }
    validateIsoDate(review.reviewedAt, `${reviewPath}.reviewedAt`, add)
    if (
      isIsoDate(review.reviewedAt) &&
      isIsoDate(record.reviewedAt) &&
      review.reviewedAt > record.reviewedAt
    ) {
      add("date.order", `${reviewPath}.reviewedAt`, "Reviewer date cannot follow record review date.")
    }
    if (review.reviewedAt === record.reviewedAt) hasReviewAtCurrentDate = true
  })
  if (isIsoDate(record.reviewedAt) && reviewerRecords.length > 0 && !hasReviewAtCurrentDate) {
    add(
      "review.current-date",
      `${path}.reviewers`,
      "A reviewer record must support the current review date.",
    )
  }
  if (
    record.publicationStatus === "published" &&
    !reviewerRecords.some(
      (review) =>
        isRecord(review) &&
        review.role === "second-reader" &&
        review.reviewedAt === record.reviewedAt,
    )
  ) {
    add(
      "review.second-reader",
      `${path}.reviewers`,
      "Published records require a second-reader review at the current review date.",
    )
  }

  validatePositiveInteger(record.version, `${path}.version`, add)
  const history = Array.isArray(record.versionHistory) ? record.versionHistory : []
  if (!Array.isArray(record.versionHistory) || history.length === 0) {
    add("version.history", `${path}.versionHistory`, "Version history must be a non-empty array.")
    return
  }

  let previousVersion = 0
  let previousDate = ""
  history.forEach((entry, index) => {
    const entryPath = `${path}.versionHistory[${index}]`
    if (!isRecord(entry)) {
      add("version.shape", entryPath, "Version record must be an object.")
      return
    }
    validatePositiveInteger(entry.version, `${entryPath}.version`, add)
    validateIsoDate(entry.changedAt, `${entryPath}.changedAt`, add)
    validateNonEmptyString(entry.changeNote, `${entryPath}.changeNote`, add)

    if (typeof entry.version === "number" && entry.version <= previousVersion) {
      add("version.order", `${entryPath}.version`, "Version numbers must increase.")
    }
    if (isIsoDate(entry.changedAt) && previousDate && entry.changedAt < previousDate) {
      add("date.order", `${entryPath}.changedAt`, "Version dates must be chronological.")
    }
    if (
      isIsoDate(entry.changedAt) &&
      isIsoDate(record.reviewedAt) &&
      entry.changedAt > record.reviewedAt
    ) {
      add("date.order", `${entryPath}.changedAt`, "Version date cannot follow review date.")
    }
    if (typeof entry.version === "number") previousVersion = entry.version
    if (isIsoDate(entry.changedAt)) previousDate = entry.changedAt
  })

  const latest = history.at(-1)
  if (isRecord(latest) && latest.version !== record.version) {
    add(
      "version.current",
      `${path}.versionHistory`,
      "Latest version-history entry must match the current version.",
    )
  }
}

function registerEntityId(
  record: JsonRecord,
  path: string,
  entityById: Map<string, JsonRecord>,
  add: AddError,
) {
  if (typeof record.id !== "string" || record.id.length === 0) return
  if (entityById.has(record.id)) {
    add("entity.duplicate-id", `${path}.id`, `Duplicate entity ID: ${record.id}.`)
    return
  }
  entityById.set(record.id, record)
}

function validateIdArray(
  value: unknown,
  path: string,
  code: string,
  add: AddError,
  requireNonEmpty: boolean,
): string[] {
  if (!Array.isArray(value) || (requireNonEmpty && value.length === 0)) {
    add(code, path, "Expected a non-empty array of IDs.")
    return []
  }

  const ids: string[] = []
  const seen = new Set<string>()
  value.forEach((id, index) => {
    if (typeof id !== "string" || !isIdentifier(id)) {
      add(code, `${path}[${index}]`, "ID has an invalid format.")
      return
    }
    if (seen.has(id)) {
      add(`${code}.duplicate`, `${path}[${index}]`, `Duplicate ID: ${id}.`)
      return
    }
    seen.add(id)
    ids.push(id)
  })
  return ids
}

function validateKeyArray(
  value: unknown,
  path: string,
  validKeySet: Set<string>,
  add: AddError,
) {
  if (!Array.isArray(value) || value.length === 0) {
    add("evidence.keys", path, "Evidence must link at least one coded key.")
    return
  }

  const seen = new Set<string>()
  value.forEach((key, index) => {
    if (typeof key !== "string" || !validKeySet.has(key)) {
      add("evidence.unknown-key", `${path}[${index}]`, "Evidence key is invalid.")
      return
    }
    if (seen.has(key)) {
      add("evidence.duplicate-key", `${path}[${index}]`, `Duplicate evidence key: ${key}.`)
    }
    seen.add(key)
  })
}

function validateNonEmptyStringArray(
  value: unknown,
  path: string,
  add: AddError,
  requireNonEmpty: boolean,
) {
  if (!Array.isArray(value) || (requireNonEmpty && value.length === 0)) {
    add("field.string-array", path, "Expected a non-empty array of strings.")
    return
  }
  value.forEach((item, index) => validateNonEmptyString(item, `${path}[${index}]`, add))
}

function validatePositiveInteger(value: unknown, path: string, add: AddError) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    add("field.positive-integer", path, "Value must be a positive integer.")
  }
}

function validateId(value: unknown, path: string, add: AddError) {
  if (typeof value !== "string" || !isIdentifier(value)) {
    add("field.id", path, "ID must use letters, numbers, dots, colons, underscores, or hyphens.")
  }
}

function validateNonEmptyString(value: unknown, path: string, add: AddError) {
  if (typeof value !== "string" || value.trim().length === 0) {
    add("field.string", path, "Value must be a non-empty string.")
  }
}

function validateIsoDate(value: unknown, path: string, add: AddError) {
  if (!isIsoDate(value)) {
    add("date.invalid", path, "Date must be a real ISO calendar date in YYYY-MM-DD form.")
  }
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function isIdentifier(value: string): boolean {
  return /^[a-z0-9][a-z0-9._:-]*$/i.test(value)
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function result(errors: ReferenceValidationError[]): ReferenceValidationResult {
  const ok = errors.length === 0
  return { ok, valid: ok, errors }
}

type AddError = (code: string, path: string, message: string) => void
