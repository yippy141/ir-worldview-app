import test from "node:test"
import assert from "node:assert/strict"
import { currentCaseCatalog } from "@/lib/current-cases/catalog"
import {
  CURRENT_CASE_RELATION_POLICY,
  CURRENT_CASE_RELATION_SCHEMA_VERSION,
  currentCaseRelationCatalog,
  getCurrentCaseRelationSubjectId,
  getPublishedCurrentCaseRelations,
  validateCurrentCaseRelationCatalog,
  type CurrentCaseRelationDefinition,
  type CurrentCaseRelationValidationResult,
} from "@/lib/current-cases/relations"
import { STABLE_AUTHORING_ID_PATTERN } from "@/lib/modules/authoring-contract"

const sampleCase = currentCaseCatalog[0]

function authoredRelation(): CurrentCaseRelationDefinition {
  return {
    id: "current-case.security.activism.qualifies.v1",
    caseRef: {
      caseId: sampleCase.id,
      caseVersion: sampleCase.version,
    },
    subject: {
      kind: "decision-option",
      optionId: sampleCase.decision.options[0].id,
    },
    target: {
      kind: "module-axis",
      moduleSlug: "security",
      axisKey: "activism",
    },
    relation: "qualifies",
    rationale: "An authored test rationale for a direct Current Case-to-axis relation.",
    status: "authored",
    contentVersion: 1,
    sourceIds: [sampleCase.sources[0].id],
    publication: "internal",
  }
}

function catalogWith(...relations: readonly unknown[]) {
  return {
    schemaVersion: CURRENT_CASE_RELATION_SCHEMA_VERSION,
    contentVersion: 1,
    publication: "withheld",
    relations,
  }
}

function hasError(
  result: CurrentCaseRelationValidationResult,
  code: string,
) {
  return !result.ok && result.errors.some((error) => error.code === code)
}

test("schema-v1 Current Case relation catalog is empty, withheld, and valid", () => {
  assert.deepEqual(currentCaseRelationCatalog, {
    schemaVersion: 1,
    contentVersion: 1,
    publication: "withheld",
    relations: [],
  })
  assert.equal(CURRENT_CASE_RELATION_POLICY.defaultRelation, "not-comparable")
  assert.equal(CURRENT_CASE_RELATION_POLICY.defaultRead, "separate-domain-read")
  assert.equal(CURRENT_CASE_RELATION_POLICY.transitiveInference, "forbidden")
  assert.deepEqual(validateCurrentCaseRelationCatalog(), { ok: true, errors: [] })
  assert.deepEqual(getPublishedCurrentCaseRelations(), [])
})

test("subject identities are stable and scoped by exact case ID and version", () => {
  const subject = authoredRelation().subject
  const first = getCurrentCaseRelationSubjectId(
    { caseId: sampleCase.id, caseVersion: sampleCase.version },
    subject,
  )
  const otherCase = getCurrentCaseRelationSubjectId(
    {
      caseId: currentCaseCatalog[1].id,
      caseVersion: currentCaseCatalog[1].version,
    },
    subject,
  )
  const otherVersion = getCurrentCaseRelationSubjectId(
    { caseId: sampleCase.id, caseVersion: sampleCase.version + 1 },
    subject,
  )

  assert.equal(STABLE_AUTHORING_ID_PATTERN.test(first), true)
  assert.notEqual(first, otherCase)
  assert.notEqual(first, otherVersion)
  assert.equal(validateCurrentCaseRelationCatalog(catalogWith(authoredRelation())).ok, true)

  const wrongVersion = {
    ...authoredRelation(),
    caseRef: {
      caseId: sampleCase.id,
      caseVersion: sampleCase.version + 1,
    },
  }
  assert.equal(
    hasError(validateCurrentCaseRelationCatalog(catalogWith(wrongVersion)), "reference.case"),
    true,
  )

  const unknownLocalSubject = {
    ...authoredRelation(),
    subject: { kind: "decision-option", optionId: "missing-option" },
  }
  assert.equal(
    hasError(
      validateCurrentCaseRelationCatalog(catalogWith(unknownLocalSubject)),
      "reference.subject",
    ),
    true,
  )
})

test("validator rejects invalid targets, statuses, and unresolved evidence", () => {
  const reviewed = {
    ...authoredRelation(),
    status: "expert-reviewed",
    sourceIds: [sampleCase.sources[0].id],
    reviewIds: [sampleCase.editorialReview.reviewerIds[0]],
  }
  assert.equal(validateCurrentCaseRelationCatalog(catalogWith(reviewed)).ok, true)

  const badTarget = {
    ...authoredRelation(),
    target: { kind: "module-axis", moduleSlug: "security", axisKey: "industrial" },
  }
  assert.equal(
    hasError(validateCurrentCaseRelationCatalog(catalogWith(badTarget)), "reference.target"),
    true,
  )

  const badStatus = { ...authoredRelation(), status: "reviewed" }
  assert.equal(
    hasError(validateCurrentCaseRelationCatalog(catalogWith(badStatus)), "field.invalid"),
    true,
  )

  const missingReviewedEvidence = {
    ...authoredRelation(),
    status: "expert-reviewed",
    sourceIds: [],
    reviewIds: [],
  }
  assert.equal(
    hasError(
      validateCurrentCaseRelationCatalog(catalogWith(missingReviewedEvidence)),
      "evidence.required",
    ),
    true,
  )

  const unresolvedEvidence = {
    ...reviewed,
    sourceIds: ["missing-source"],
    reviewIds: ["missing-review"],
  }
  const unresolved = validateCurrentCaseRelationCatalog(
    catalogWith(unresolvedEvidence),
  )
  assert.equal(hasError(unresolved, "evidence.source"), true)
  assert.equal(hasError(unresolved, "evidence.review"), true)

  const unreviewedPublic = {
    ...authoredRelation(),
    sourceIds: [],
    publication: "public",
  }
  const publicValidation = validateCurrentCaseRelationCatalog(
    catalogWith(unreviewedPublic),
  )
  assert.equal(hasError(publicValidation, "publication.forbidden"), true)
  assert.equal(hasError(publicValidation, "publication.ineligible"), true)
})

test("Foundation, legacy-pattern, score, and transitive relation paths fail closed", () => {
  const directFoundation = {
    ...authoredRelation(),
    target: {
      kind: "foundation-dimension",
      dimensionKey: "institutions",
    },
  }
  assert.equal(
    hasError(
      validateCurrentCaseRelationCatalog(catalogWith(directFoundation)),
      "field.invalid",
    ),
    true,
  )

  const transitiveHint = {
    ...authoredRelation(),
    target: {
      ...authoredRelation().target,
      foundationDimension: "institutions",
    },
  }
  assert.equal(
    hasError(
      validateCurrentCaseRelationCatalog(catalogWith(transitiveHint)),
      "field.invalid",
    ),
    true,
  )

  const legacyPattern = {
    ...authoredRelation(),
    subject: {
      kind: "worldview-reading",
      profileId: sampleCase.worldviewReadings[0].profileId,
    },
  }
  assert.equal(
    hasError(
      validateCurrentCaseRelationCatalog(catalogWith(legacyPattern)),
      "field.invalid",
    ),
    true,
  )

  const rawScore = { ...authoredRelation(), score: 7 }
  assert.equal(
    hasError(validateCurrentCaseRelationCatalog(catalogWith(rawScore)), "field.invalid"),
    true,
  )

  // Even a valid, reviewed direct axis record remains private. The selector
  // cannot follow that axis onward to a Foundation bridge or infer a relation.
  const reviewedInternal = {
    ...authoredRelation(),
    status: "expert-reviewed",
    sourceIds: [sampleCase.sources[0].id],
    reviewIds: [sampleCase.editorialReview.reviewerIds[0]],
  }
  assert.equal(
    validateCurrentCaseRelationCatalog(catalogWith(reviewedInternal)).ok,
    true,
  )
  assert.deepEqual(
    getPublishedCurrentCaseRelations(catalogWith(reviewedInternal)),
    [],
  )

  const accidentallyPublicCatalog = {
    ...catalogWith(),
    publication: "public",
  }
  assert.equal(
    hasError(
      validateCurrentCaseRelationCatalog(accidentallyPublicCatalog),
      "catalog.publication",
    ),
    true,
  )
  assert.deepEqual(getPublishedCurrentCaseRelations(accidentallyPublicCatalog), [])
})
