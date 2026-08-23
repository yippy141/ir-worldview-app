import { currentCaseCatalog } from "@/lib/current-cases/catalog"
import type { CurrentCase } from "@/lib/current-cases/types"
import {
  STABLE_AUTHORING_ID_PATTERN,
} from "@/lib/modules/authoring-contract"
import { getModuleDefinition } from "@/lib/modules/framework"
import type { ModuleAxisKey, ModuleSlug } from "@/lib/modules/types"

export const CURRENT_CASE_RELATION_SCHEMA_VERSION = 1 as const

export const CURRENT_CASE_RELATIONS = [
  "exercises",
  "illustrates",
  "challenges",
  "contextualizes",
  "not-mapped",
] as const
export type CurrentCaseRelation = (typeof CURRENT_CASE_RELATIONS)[number]

export const CURRENT_CASE_AUTHORING_STATUSES = ["draft", "authored"] as const
export type CurrentCaseAuthoringStatus =
  (typeof CURRENT_CASE_AUTHORING_STATUSES)[number]

export const CURRENT_CASE_REVIEW_STATUSES = [
  "unreviewed",
  "expert-reviewed",
] as const
export type CurrentCaseReviewStatus =
  (typeof CURRENT_CASE_REVIEW_STATUSES)[number]

/**
 * V23.4 defines an authoring contract, not a publication surface. Current Case
 * relations remain withheld until a later release explicitly changes the
 * catalog schema and publication policy.
 */
export const CURRENT_CASE_RELATION_POLICY = {
  catalogPublication: "withheld",
  defaultRelation: "not-mapped",
  defaultRead: "separate-case-link",
  publicRelations: "forbidden-in-schema-v1",
  directFoundationTargets: "forbidden",
  transitiveInference: "forbidden",
  legacyDecisionPatternInference: "forbidden",
} as const

export type CurrentCaseRelationCaseRef = {
  caseId: string
  caseVersion: number
}

/**
 * Option and reasoning-tag IDs are local to a versioned case. They are never
 * valid relation identities without the accompanying caseRef.
 */
export type CurrentCaseRelationSubject =
  | { kind: "case" }
  | { kind: "decision-option"; optionId: string }
  | { kind: "reasoning-tag"; reasoningTagId: string }

/**
 * Current Case metadata may point only to a named module axis. Foundation
 * dimensions are deliberately absent, preventing both direct and transitive
 * case-to-Foundation relations.
 */
export type CurrentCaseRelationTarget = {
  kind: "module-axis"
  moduleSlug: ModuleSlug
  axisKey: ModuleAxisKey
}

export type CurrentCaseRelationDefinition = {
  id: string
  caseRef: CurrentCaseRelationCaseRef
  subject: CurrentCaseRelationSubject
  target: CurrentCaseRelationTarget
  relation: CurrentCaseRelation
  rationale: string
  authoringStatus: CurrentCaseAuthoringStatus
  reviewStatus: CurrentCaseReviewStatus
  contentVersion: number
  factualSourceIds?: readonly string[]
  constructReviewIds?: readonly string[]
  publication: "internal"
}

export type CurrentCaseRelationCatalog = {
  schemaVersion: typeof CURRENT_CASE_RELATION_SCHEMA_VERSION
  contentVersion: number
  publication: typeof CURRENT_CASE_RELATION_POLICY.catalogPublication
  relations: readonly CurrentCaseRelationDefinition[]
}

export const currentCaseRelationCatalog = {
  schemaVersion: CURRENT_CASE_RELATION_SCHEMA_VERSION,
  contentVersion: 1,
  publication: CURRENT_CASE_RELATION_POLICY.catalogPublication,
  relations: [],
} as const satisfies CurrentCaseRelationCatalog

export type CurrentCaseRelationValidationError = {
  code:
    | "catalog.invalid"
    | "catalog.schema-version"
    | "catalog.publication"
    | "field.invalid"
    | "field.duplicate"
    | "reference.case"
    | "reference.subject"
    | "reference.target"
    | "evidence.source"
    | "evidence.review"
    | "evidence.required"
    | "publication.forbidden"
    | "publication.ineligible"
  path: string
  message: string
}

export type CurrentCaseRelationValidationResult =
  | { ok: true; errors: readonly [] }
  | { ok: false; errors: readonly CurrentCaseRelationValidationError[] }

/** A stable display/audit key for a subject; local IDs are always case-scoped. */
export function getCurrentCaseRelationSubjectId(
  caseRef: CurrentCaseRelationCaseRef,
  subject: CurrentCaseRelationSubject,
): string {
  const scope = `${caseRef.caseId}:v${caseRef.caseVersion}`
  if (subject.kind === "case") return `${scope}:case`
  if (subject.kind === "decision-option") {
    return `${scope}:decision-option:${subject.optionId}`
  }
  return `${scope}:reasoning-tag:${subject.reasoningTagId}`
}

export function validateCurrentCaseRelationCatalog(
  value: unknown = currentCaseRelationCatalog,
  cases: readonly CurrentCase[] = currentCaseCatalog,
): CurrentCaseRelationValidationResult {
  const errors: CurrentCaseRelationValidationError[] = []
  const catalog = asRecord(value)

  if (!catalog) {
    return {
      ok: false,
      errors: [
        {
          code: "catalog.invalid",
          path: "catalog",
          message: "The Current Case relation catalog must be an object.",
        },
      ],
    }
  }

  if (!hasOnlyKeys(catalog, ["schemaVersion", "contentVersion", "publication", "relations"])) {
    addError(
      errors,
      "field.invalid",
      "catalog",
      "The relation catalog contains an unsupported field.",
    )
  }
  if (catalog.schemaVersion !== CURRENT_CASE_RELATION_SCHEMA_VERSION) {
    addError(
      errors,
      "catalog.schema-version",
      "schemaVersion",
      `Current Case relation catalogs must use schema version ${CURRENT_CASE_RELATION_SCHEMA_VERSION}.`,
    )
  }
  if (!isPositiveInteger(catalog.contentVersion)) {
    addError(
      errors,
      "field.invalid",
      "contentVersion",
      "contentVersion must be a positive integer.",
    )
  }
  if (catalog.publication !== CURRENT_CASE_RELATION_POLICY.catalogPublication) {
    addError(
      errors,
      "catalog.publication",
      "publication",
      "Current Case relation catalogs must remain withheld.",
    )
  }
  if (!Array.isArray(catalog.relations)) {
    addError(
      errors,
      "field.invalid",
      "relations",
      "relations must be an array.",
    )
    return validationResult(errors)
  }

  const casesByVersionedId = new Map(
    cases.map((record) => [caseRefKey(record.id, record.version), record]),
  )
  const relationIds = new Set<string>()

  catalog.relations.forEach((value, index) => {
    const path = `relations[${index}]`
    const relation = asRecord(value)
    if (!relation) {
      addError(errors, "field.invalid", path, "Each relation must be an object.")
      return
    }

    if (
      !hasOnlyKeys(relation, [
        "id",
        "caseRef",
        "subject",
        "target",
        "relation",
        "rationale",
        "authoringStatus",
        "reviewStatus",
        "contentVersion",
        "factualSourceIds",
        "constructReviewIds",
        "publication",
      ])
    ) {
      addError(
        errors,
        "field.invalid",
        path,
        "The relation contains an unsupported field; scores and Foundation targets are not allowed.",
      )
    }

    if (!isStableId(relation.id)) {
      addError(
        errors,
        "field.invalid",
        `${path}.id`,
        "Relation IDs must be stable lowercase authoring IDs.",
      )
    } else if (relationIds.has(relation.id)) {
      addError(
        errors,
        "field.duplicate",
        `${path}.id`,
        "Relation IDs must be unique.",
      )
    } else {
      relationIds.add(relation.id)
    }

    const caseRef = validateCaseRef(relation.caseRef, `${path}.caseRef`, errors)
    const currentCase = caseRef
      ? casesByVersionedId.get(caseRefKey(caseRef.caseId, caseRef.caseVersion))
      : undefined
    if (caseRef && !currentCase) {
      addError(
        errors,
        "reference.case",
        `${path}.caseRef`,
        "caseRef must resolve to the exact authored case ID and content version.",
      )
    }

    validateSubject(relation.subject, currentCase, `${path}.subject`, errors)
    validateTarget(relation.target, `${path}.target`, errors)

    if (!(CURRENT_CASE_RELATIONS as readonly unknown[]).includes(relation.relation)) {
      addError(
        errors,
        "field.invalid",
        `${path}.relation`,
        `relation must be one of: ${CURRENT_CASE_RELATIONS.join(", ")}.`,
      )
    }
    if (!isNonEmptyString(relation.rationale)) {
      addError(
        errors,
        "field.invalid",
        `${path}.rationale`,
        "rationale must be a non-empty authored explanation.",
      )
    }
    if (!(CURRENT_CASE_AUTHORING_STATUSES as readonly unknown[]).includes(relation.authoringStatus)) {
      addError(
        errors,
        "field.invalid",
        `${path}.authoringStatus`,
        `authoringStatus must be one of: ${CURRENT_CASE_AUTHORING_STATUSES.join(", ")}.`,
      )
    }
    if (!(CURRENT_CASE_REVIEW_STATUSES as readonly unknown[]).includes(relation.reviewStatus)) {
      addError(
        errors,
        "field.invalid",
        `${path}.reviewStatus`,
        `reviewStatus must be one of: ${CURRENT_CASE_REVIEW_STATUSES.join(", ")}.`,
      )
    }
    if (!isPositiveInteger(relation.contentVersion)) {
      addError(
        errors,
        "field.invalid",
        `${path}.contentVersion`,
        "contentVersion must be a positive integer.",
      )
    }

    const sourceIds = validateEvidenceIds(
      relation.factualSourceIds,
      `${path}.factualSourceIds`,
      "evidence.source",
      currentCase?.sources.map((source) => source.id),
      errors,
    )
    const reviewIds = validateEvidenceIds(
      relation.constructReviewIds,
      `${path}.constructReviewIds`,
      "evidence.review",
      currentCase?.editorialReview.reviewerIds,
      errors,
    )

    if (
      relation.publication !== "internal"
    ) {
      addError(
        errors,
        "field.invalid",
        `${path}.publication`,
        "publication must remain internal under the current contract.",
      )
    }

    const reviewedStatus = relation.reviewStatus === "expert-reviewed"

    if (reviewedStatus && (!sourceIds.length || !reviewIds.length)) {
      addError(
        errors,
        "evidence.required",
        path,
        "Expert-reviewed case links require factual source IDs and construct-link review IDs.",
      )
    }

    if (relation.publication === "public") {
      addError(
        errors,
        "publication.forbidden",
        `${path}.publication`,
        "Current Case relations cannot be published by this contract.",
      )
      if (!reviewedStatus || !sourceIds.length || !reviewIds.length) {
        addError(
          errors,
          "publication.ineligible",
          `${path}.publication`,
          "A public relation would also require reviewed status plus source and review evidence.",
        )
      }
    }
  })

  return validationResult(errors)
}

/**
 * Public selection is intentionally fail-closed in schema v1. Validation still
 * runs so malformed or accidentally public records cannot create a side door.
 */
export function getPublishedCurrentCaseRelations(
  value: unknown = currentCaseRelationCatalog,
  cases: readonly CurrentCase[] = currentCaseCatalog,
): readonly CurrentCaseRelationDefinition[] {
  const validation = validateCurrentCaseRelationCatalog(value, cases)
  if (!validation.ok) return []
  return []
}

function validateCaseRef(
  value: unknown,
  path: string,
  errors: CurrentCaseRelationValidationError[],
): CurrentCaseRelationCaseRef | null {
  const caseRef = asRecord(value)
  if (!caseRef || !hasOnlyKeys(caseRef, ["caseId", "caseVersion"])) {
    addError(
      errors,
      "field.invalid",
      path,
      "caseRef must contain only caseId and caseVersion.",
    )
    return null
  }

  let valid = true
  if (!isStableId(caseRef.caseId)) {
    valid = false
    addError(
      errors,
      "field.invalid",
      `${path}.caseId`,
      "caseId must be a stable lowercase authoring ID.",
    )
  }
  if (!isPositiveInteger(caseRef.caseVersion)) {
    valid = false
    addError(
      errors,
      "field.invalid",
      `${path}.caseVersion`,
      "caseVersion must be a positive integer.",
    )
  }

  return valid
    ? {
        caseId: caseRef.caseId as string,
        caseVersion: caseRef.caseVersion as number,
      }
    : null
}

function validateSubject(
  value: unknown,
  currentCase: CurrentCase | undefined,
  path: string,
  errors: CurrentCaseRelationValidationError[],
) {
  const subject = asRecord(value)
  if (!subject || typeof subject.kind !== "string") {
    addError(errors, "field.invalid", path, "subject must be a supported object.")
    return
  }

  if (subject.kind === "case") {
    if (!hasOnlyKeys(subject, ["kind"])) {
      addError(errors, "field.invalid", path, "A case subject contains only kind.")
    }
    return
  }

  if (subject.kind === "decision-option") {
    if (!hasOnlyKeys(subject, ["kind", "optionId"]) || !isStableId(subject.optionId)) {
      addError(
        errors,
        "field.invalid",
        path,
        "A decision-option subject requires one stable optionId.",
      )
      return
    }
    if (
      currentCase &&
      !currentCase.decision.options.some((option) => option.id === subject.optionId)
    ) {
      addError(
        errors,
        "reference.subject",
        `${path}.optionId`,
        "optionId must belong to the versioned case in caseRef.",
      )
    }
    return
  }

  if (subject.kind === "reasoning-tag") {
    if (
      !hasOnlyKeys(subject, ["kind", "reasoningTagId"]) ||
      !isStableId(subject.reasoningTagId)
    ) {
      addError(
        errors,
        "field.invalid",
        path,
        "A reasoning-tag subject requires one stable reasoningTagId.",
      )
      return
    }
    if (
      currentCase &&
      !currentCase.reasoningTags.some((tag) => tag.id === subject.reasoningTagId)
    ) {
      addError(
        errors,
        "reference.subject",
        `${path}.reasoningTagId`,
        "reasoningTagId must belong to the versioned case in caseRef.",
      )
    }
    return
  }

  addError(
    errors,
    "field.invalid",
    `${path}.kind`,
    "subject.kind must be case, decision-option, or reasoning-tag; legacy Decision Pattern IDs are not relation subjects.",
  )
}

function validateTarget(
  value: unknown,
  path: string,
  errors: CurrentCaseRelationValidationError[],
) {
  const target = asRecord(value)
  if (
    !target ||
    !hasOnlyKeys(target, ["kind", "moduleSlug", "axisKey"]) ||
    target.kind !== "module-axis"
  ) {
    addError(
      errors,
      "field.invalid",
      path,
      "target must be exactly { kind: module-axis, moduleSlug, axisKey }; Foundation targets are forbidden.",
    )
    return
  }

  if (!isStableId(target.moduleSlug)) {
    addError(
      errors,
      "field.invalid",
      `${path}.moduleSlug`,
      "moduleSlug must be a stable module ID.",
    )
    return
  }

  const moduleDefinition = getModuleDefinition(target.moduleSlug)
  if (!moduleDefinition) {
    addError(
      errors,
      "reference.target",
      `${path}.moduleSlug`,
      "moduleSlug must resolve to a registered module.",
    )
    return
  }
  if (
    typeof target.axisKey !== "string" ||
    !moduleDefinition.axes.some((axis) => axis.key === target.axisKey)
  ) {
    addError(
      errors,
      "reference.target",
      `${path}.axisKey`,
      "axisKey must belong to the target module.",
    )
  }
}

function validateEvidenceIds(
  value: unknown,
  path: string,
  code: "evidence.source" | "evidence.review",
  allowedIds: readonly string[] | undefined,
  errors: CurrentCaseRelationValidationError[],
): string[] {
  if (value === undefined) return []
  if (!Array.isArray(value)) {
    addError(
      errors,
      "field.invalid",
      path,
      "This field must be an array of evidence IDs.",
    )
    return []
  }

  const validIds: string[] = []
  const seen = new Set<string>()
  value.forEach((id, index) => {
    // Current Case source ledgers predate the authoring-ID convention and use
    // stable uppercase IDs such as S1. Preserve those exact references; new
    // relation record IDs still use STABLE_AUTHORING_ID_PATTERN.
    if (!isNonEmptyString(id)) {
      addError(
        errors,
        "field.invalid",
        `${path}[${index}]`,
        "Each evidence reference must be a non-empty exact ledger ID.",
      )
      return
    }
    if (seen.has(id)) {
      addError(
        errors,
        "field.duplicate",
        `${path}[${index}]`,
        "Each relation may reference an evidence ID once.",
      )
      return
    }
    seen.add(id)
    validIds.push(id)
    if (allowedIds && !allowedIds.includes(id)) {
      addError(
        errors,
        code,
        `${path}[${index}]`,
        code === "evidence.source"
          ? "sourceId must resolve in the versioned case source ledger."
          : "reviewId must resolve in the versioned case editorial review.",
      )
    }
  })

  return validIds
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]) {
  const allowed = new Set(keys)
  return Object.keys(value).every((key) => allowed.has(key))
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function isStableId(value: unknown): value is string {
  return typeof value === "string" && STABLE_AUTHORING_ID_PATTERN.test(value)
}

function caseRefKey(caseId: string, caseVersion: number) {
  return `${caseId}\u0000${caseVersion}`
}

function addError(
  errors: CurrentCaseRelationValidationError[],
  code: CurrentCaseRelationValidationError["code"],
  path: string,
  message: string,
) {
  errors.push({ code, path, message })
}

function validationResult(
  errors: CurrentCaseRelationValidationError[],
): CurrentCaseRelationValidationResult {
  return errors.length === 0 ? { ok: true, errors: [] } : { ok: false, errors }
}
