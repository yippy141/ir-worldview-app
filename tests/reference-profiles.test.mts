import test from "node:test"
import assert from "node:assert/strict"
import {
  REFERENCE_PROFILE_CATALOG,
  getReferenceProfileById,
} from "@/lib/reference-profiles/catalog"
import type {
  AiGovernanceReferenceProfile,
  ReferenceCatalog,
  ReferenceMovement,
} from "@/lib/reference-profiles/types"
import {
  getReferenceProfileDimensionScores,
  getReferenceProfilePosition,
  hasReferenceValidationError,
  isReferenceProfileMappable,
  isReferenceProfilePublishable,
  validateReferenceCatalog,
} from "@/lib/reference-profiles/validation"
import { toMapPosition } from "@/lib/results/position"

test("the internal-review thinker catalog passes structural validation", () => {
  const validation = validateReferenceCatalog(REFERENCE_PROFILE_CATALOG)

  assert.equal(validation.ok, true, JSON.stringify(validation.errors, null, 2))
  assert.equal(REFERENCE_PROFILE_CATALOG.dataStatus, "internal-review")
  assert.equal(REFERENCE_PROFILE_CATALOG.movements.length, 0)
  assert.ok(REFERENCE_PROFILE_CATALOG.profiles.length >= 2)

  for (const profile of REFERENCE_PROFILE_CATALOG.profiles) {
    assert.equal(profile.entityType, "thinker")
    assert.equal(profile.public, false)
    assert.equal(profile.publicationStatus, "pending-review")
    assert.equal(isReferenceProfilePublishable(profile), false)
  }
})

test("mappable IR profiles use the canonical Foundation projection", () => {
  const mappable = REFERENCE_PROFILE_CATALOG.profiles.filter(isReferenceProfileMappable)
  assert.ok(mappable.length > 0)

  for (const profile of mappable) {
    const scores = getReferenceProfileDimensionScores(profile)
    assert.ok(scores)
    assert.deepEqual(getReferenceProfilePosition(profile), toMapPosition(scores))
    assert.equal("x" in profile, false)
    assert.equal("y" in profile, false)
    assert.equal("position" in profile, false)
  }
})

test("an incomplete IR draft remains a reading card without a map position", () => {
  const wendt = getReferenceProfileById("alexander-wendt")
  assert.ok(wendt)
  assert.equal(isReferenceProfileMappable(wendt), false)
  assert.equal(getReferenceProfileDimensionScores(wendt), null)
  assert.equal(getReferenceProfilePosition(wendt), null)
})

test("AI-governance estimates are never projected as Foundation dimensions", () => {
  const catalog = catalogWithSyntheticAiProfile()
  const validation = validateReferenceCatalog(catalog)
  assert.equal(validation.ok, true, JSON.stringify(validation.errors, null, 2))

  const aiProfile = catalog.profiles.at(-1)
  assert.ok(aiProfile)
  assert.equal(aiProfile.scope, "ai-governance")
  assert.equal(isReferenceProfileMappable(aiProfile), false)
  assert.equal(getReferenceProfilePosition(aiProfile), null)

  const malformed = cloneCatalog(catalog) as unknown as {
    profiles: Array<Record<string, unknown>>
  }
  malformed.profiles.at(-1)!.dimensionEstimates = {
    securityCompetition: {
      value: 4,
      support: "partial",
      sourceIds: ["S1"],
      evidenceIds: ["synthetic-ai-e1"],
      note: "Wrong instrument mapping.",
    },
  }
  const malformedValidation = validateReferenceCatalog(malformed)
  assert.equal(malformedValidation.ok, false)
  assert.equal(
    hasReferenceValidationError(malformedValidation, "profile.instrument-mismatch"),
    true,
  )
})

test("validation rejects weak strong-support coverage and broken evidence links", () => {
  const catalog = cloneCatalog()
  const profile = catalog.profiles[0]
  assert.equal(profile.scope, "foundation")

  profile.dimensionEstimates.securityCompetition!.sourceIds = ["S1"]
  profile.dimensionEstimates.securityCompetition!.evidenceIds = ["mearsheimer-e1"]
  profile.evidence[0].dimensionKeys = ["institutions", "domesticFilters"]

  const validation = validateReferenceCatalog(catalog)
  assert.equal(validation.ok, false)
  assert.equal(
    hasReferenceValidationError(validation, "estimate.strong-source-count"),
    true,
  )
  assert.equal(hasReferenceValidationError(validation, "estimate.evidence-link"), true)
})

test("validation rejects duplicate, missing, and uncovered source IDs", () => {
  const catalog = cloneCatalog()
  catalog.sources.push(structuredClone(catalog.sources[0]))
  const profile = catalog.profiles[0]
  profile.sourceIds.push("missing-source")

  if (profile.scope !== "ai-governance") {
    profile.dimensionEstimates.restraint!.sourceIds = ["missing-source"]
  }

  const validation = validateReferenceCatalog(catalog)
  assert.equal(validation.ok, false)
  assert.equal(hasReferenceValidationError(validation, "source.duplicate-id"), true)
  assert.equal(hasReferenceValidationError(validation, "profile.unknown-source"), true)
  assert.equal(hasReferenceValidationError(validation, "estimate.unknown-source"), true)
  assert.equal(hasReferenceValidationError(validation, "estimate.source-coverage"), true)
})

test("validation rejects impossible and reversed dates", () => {
  const catalog = cloneCatalog()
  catalog.sources[0].publishedAt = "2026-02-30"
  catalog.profiles[0].evidenceWindow = {
    start: "2021-01-02",
    end: "2021-01-01",
  }

  const validation = validateReferenceCatalog(catalog)
  assert.equal(validation.ok, false)
  assert.equal(hasReferenceValidationError(validation, "date.invalid"), true)
  assert.equal(hasReferenceValidationError(validation, "date.order"), true)
})

test("validation rejects estimates outside the shared 1 through 7 scale", () => {
  const catalog = cloneCatalog()
  const profile = catalog.profiles[0]
  assert.notEqual(profile.scope, "ai-governance")
  if (profile.scope === "ai-governance") return
  profile.dimensionEstimates.institutions!.value = 7.01

  const validation = validateReferenceCatalog(catalog)
  assert.equal(validation.ok, false)
  assert.equal(hasReferenceValidationError(validation, "estimate.bounds"), true)
})

test("review, publication, and version records are structurally enforced", () => {
  const catalog = cloneCatalog()
  const profile = catalog.profiles[0]
  profile.public = true
  profile.reviewers = []
  profile.version = 2

  const validation = validateReferenceCatalog(catalog)
  assert.equal(validation.ok, false)
  assert.equal(hasReferenceValidationError(validation, "publication.state"), true)
  assert.equal(
    hasReferenceValidationError(validation, "publication.non-public-catalog"),
    true,
  )
  assert.equal(hasReferenceValidationError(validation, "review.required"), true)
  assert.equal(hasReferenceValidationError(validation, "version.current"), true)
})

test("synthetic movements require existing same-scope members and a bounded scope", () => {
  const catalog = cloneCatalog()
  catalog.movements.push(syntheticMovement())

  const valid = validateReferenceCatalog(catalog)
  assert.equal(valid.ok, true, JSON.stringify(valid.errors, null, 2))

  const unknownMemberCatalog = cloneCatalog(catalog)
  unknownMemberCatalog.movements[0].memberProfileIds[1] = "missing-profile"
  const unknownMember = validateReferenceCatalog(unknownMemberCatalog)
  assert.equal(unknownMember.ok, false)
  assert.equal(hasReferenceValidationError(unknownMember, "movement.unknown-member"), true)

  const wrongScopeCatalog = cloneCatalog(catalog)
  wrongScopeCatalog.movements[0].scope = "security"
  const wrongScope = validateReferenceCatalog(wrongScopeCatalog)
  assert.equal(wrongScope.ok, false)
  assert.equal(hasReferenceValidationError(wrongScope, "movement.scope-mismatch"), true)

  const unboundedCatalog = cloneCatalog(catalog)
  unboundedCatalog.movements[0].scopeNote = ""
  unboundedCatalog.movements[0].internalDisagreements = []
  const unbounded = validateReferenceCatalog(unboundedCatalog)
  assert.equal(unbounded.ok, false)
  assert.equal(hasReferenceValidationError(unbounded, "field.string"), true)
  assert.equal(hasReferenceValidationError(unbounded, "field.string-array"), true)
})

function cloneCatalog(
  catalog: ReferenceCatalog = REFERENCE_PROFILE_CATALOG,
): ReferenceCatalog {
  return structuredClone(catalog)
}

function syntheticMovement(): ReferenceMovement {
  return {
    id: "synthetic-institutionalist-constellation",
    name: "Synthetic institutionalist constellation",
    shortName: "Synthetic constellation",
    entityType: "movement",
    scope: "foundation",
    memberProfileIds: ["robert-keohane", "alexander-wendt"],
    scopeNote: "Synthetic test fixture covering two nearby institutional and social accounts.",
    internalDisagreements: ["Members assign different causal weight to rules and identity."],
    public: false,
    publicationStatus: "pending-review",
    reviewedAt: "2026-07-12",
    reviewers: [
      {
        reviewerId: "synthetic-coder",
        role: "coder",
        reviewedAt: "2026-07-12",
      },
    ],
    version: 1,
    versionHistory: [
      {
        version: 1,
        changedAt: "2026-07-12",
        changeNote: "Created for movement validation tests.",
      },
    ],
  }
}

function catalogWithSyntheticAiProfile(): ReferenceCatalog {
  const catalog = cloneCatalog()
  const profile: AiGovernanceReferenceProfile = {
    id: "synthetic-ai-current",
    name: "Synthetic AI governance current",
    shortName: "Synthetic AI current",
    entityType: "ai-current",
    scope: "ai-governance",
    asOf: "2026-07-12",
    evidenceWindow: { start: "1994-01-01", end: "1994-01-01" },
    domain: "AI governance test fixture",
    scopeNote: "Synthetic fixture used to verify instrument separation.",
    summary: "A synthetic current with one coded AI-governance axis.",
    sourceIds: ["S1"],
    evidence: [
      {
        id: "synthetic-ai-e1",
        scope: "ai-governance",
        sourceId: "S1",
        axisKeys: ["riskHorizon"],
        note: "Synthetic evidence link for validator coverage.",
      },
    ],
    axisEstimates: {
      riskHorizon: {
        value: 4,
        support: "partial",
        sourceIds: ["S1"],
        evidenceIds: ["synthetic-ai-e1"],
        note: "Synthetic midpoint estimate.",
      },
    },
    disputes: ["Synthetic fixtures carry no substantive research claim."],
    public: false,
    publicationStatus: "pending-review",
    reviewedAt: "2026-07-12",
    reviewers: [
      {
        reviewerId: "synthetic-ai-coder",
        role: "coder",
        reviewedAt: "2026-07-12",
      },
    ],
    version: 1,
    versionHistory: [
      {
        version: 1,
        changedAt: "2026-07-12",
        changeNote: "Created for instrument-separation tests.",
      },
    ],
  }

  catalog.profiles.push(profile)
  return catalog
}
