import test from "node:test"
import assert from "node:assert/strict"
import {
  REFERENCE_PROFILE_CATALOG,
  getReferenceProfileById,
} from "@/lib/reference-profiles/catalog"
import type {
  AiGovernanceReferenceProfile,
  CodedEstimate,
  IrReferenceProfile,
  ReferenceCatalog,
  ReferenceMovement,
} from "@/lib/reference-profiles/types"
import type { DimensionKey } from "@/lib/types"
import {
  getReferenceProfileDimensionScores,
  getReferenceProfilePosition,
  hasReferenceValidationError,
  isReferenceProfileMappable,
  isReferenceProfilePublishable,
  validateReferenceCatalog,
} from "@/lib/reference-profiles/validation"
import { toMapPosition } from "@/lib/results/position"

test("the four reviewed thinker profiles pass publication validation", () => {
  const validation = validateReferenceCatalog(REFERENCE_PROFILE_CATALOG)

  assert.equal(validation.ok, true, JSON.stringify(validation.errors, null, 2))
  assert.equal(REFERENCE_PROFILE_CATALOG.dataStatus, "public")
  assert.equal(REFERENCE_PROFILE_CATALOG.movements.length, 0)
  assert.equal(REFERENCE_PROFILE_CATALOG.profiles.length, 4)

  for (const profile of REFERENCE_PROFILE_CATALOG.profiles) {
    assert.equal(profile.entityType, "thinker")
    assert.equal(profile.public, true)
    assert.equal(profile.publicationStatus, "published")
    assert.equal(
      profile.reviewers.some(
        (review) =>
          review.role === "second-reader" && review.reviewedAt === profile.reviewedAt,
      ),
      true,
    )
    assert.equal(isReferenceProfilePublishable(profile), true)
  }
})

test("published thinker coding matches the approved source pack exactly", () => {
  const expected = {
    "john-mearsheimer": {
      sourceIds: ["S1", "S2", "S3", "S4"],
      estimates: {
        securityCompetition: [
          7,
          "strong",
          "Security competition is the core of his theory. Survival under anarchy pushes states to compete for power.",
        ],
        institutions: [
          1,
          "strong",
          "Institutions are treated as weak constraints relative to power and nationalism.",
        ],
        domesticFilters: [
          2,
          "partial",
          "Domestic politics can matter, but mainly outside the core realist baseline.",
        ],
        normsIdentity: [
          3,
          "partial",
          "Nationalism matters in later work, but identity is not his main constitutive variable.",
        ],
        politicalEconomy: [
          3,
          "partial",
          "He recognises the world economy, but places security competition above interdependence.",
        ],
        restraint: [
          4,
          "partial",
          "Theory leans advantage-seeking; later policy writing leans restraint through offshore balancing.",
        ],
        orderJustice: [
          6,
          "strong",
          "He favours stability and prudence over liberal-democratic transformation abroad.",
        ],
      },
    },
    "robert-keohane": {
      sourceIds: ["S5", "S6", "S7", "S8"],
      estimates: {
        securityCompetition: [
          3,
          "partial",
          "He takes anarchy and power seriously but not as the whole story.",
        ],
        institutions: [
          7,
          "strong",
          "Institutions, expectations and rules are central to cooperation.",
        ],
        domesticFilters: [
          5,
          "partial",
          "Later work gives visible weight to accountability and participation.",
        ],
        normsIdentity: [
          4,
          "partial",
          "Legitimacy and beliefs matter, though not in a full constructivist way.",
        ],
        politicalEconomy: [
          5,
          "strong",
          "World political economy and regime-managed interdependence are central terrain.",
        ],
        restraint: [
          4,
          "partial",
          "He prefers negotiated cooperation but does not elevate strategic restraint as a doctrine.",
        ],
        orderJustice: [
          4,
          "partial",
          "He wants effective governance with legitimacy and accountability, not mere order-preservation.",
        ],
      },
    },
    "alexander-wendt": {
      sourceIds: ["S9", "S10", "S11"],
      estimates: {
        securityCompetition: [2, "partial", "Rivalry is contingent, not inherent in anarchy."],
        institutions: [
          5,
          "partial",
          "Rules matter as part of social structure, though regime design is not the main concern.",
        ],
        domesticFilters: [2, "sparse", "The main framework is systemic, not domestic."],
        normsIdentity: [
          7,
          "strong",
          "Identities and interests are socially produced and reproduced in interaction.",
        ],
        restraint: [
          4,
          "sparse",
          "The score depends on which culture of anarchy is in view.",
        ],
        orderJustice: [
          3,
          "partial",
          "The work allows movement toward friendship, mutual aid and more solidaristic order forms.",
        ],
      },
    },
    "susan-strange": {
      sourceIds: ["S12", "S13", "S14"],
      estimates: {
        securityCompetition: [
          4,
          "partial",
          "Security is one structure of power, but not automatically the dominant one.",
        ],
        institutions: [
          2,
          "partial",
          "Formal rules matter less than structural power and non-state authority.",
        ],
        domesticFilters: [
          4,
          "sparse",
          "Domestic and international authority are entangled, though this is not her primary coding axis.",
        ],
        normsIdentity: [3, "sparse", "Not central to the framework used here."],
        politicalEconomy: [
          7,
          "strong",
          "Production, finance, knowledge and non-state structural power define her worldview.",
        ],
        restraint: [4, "sparse", "The framework is diagnostic rather than grand-strategic."],
        orderJustice: [
          3,
          "partial",
          "Her work is sensitive to hierarchy, volatility and who benefits from the system.",
        ],
      },
    },
  } as const

  for (const [id, expectedProfile] of Object.entries(expected)) {
    const profile = getReferenceProfileById(id)
    assert.ok(profile)
    if (profile.scope === "ai-governance") {
      assert.fail(`Expected an IR thinker profile for ${id}.`)
    }
    assert.deepEqual(profile.sourceIds, expectedProfile.sourceIds)
    assert.deepEqual(Object.keys(profile.dimensionEstimates), Object.keys(expectedProfile.estimates))

    for (const [key, [value, support, note]] of Object.entries(expectedProfile.estimates)) {
      const estimate: CodedEstimate | undefined =
        profile.dimensionEstimates[key as DimensionKey]
      assert.ok(estimate)
      assert.deepEqual(
        { value: estimate.value, support: estimate.support, note: estimate.note },
        { value, support, note },
      )
    }
  }
})

test("complete published thinker profiles use the canonical Foundation projection", () => {
  const mappableIds = ["john-mearsheimer", "robert-keohane", "susan-strange"]

  for (const id of mappableIds) {
    const profile = getReferenceProfileById(id)
    assert.ok(profile)
    const scores = getReferenceProfileDimensionScores(profile)

    assert.ok(scores)
    assert.equal(isReferenceProfileMappable(profile), true)
    assert.deepEqual(getReferenceProfilePosition(profile), toMapPosition(scores))
    assert.equal("x" in profile, false)
    assert.equal("y" in profile, false)
    assert.equal("position" in profile, false)
  }
})

test("map eligibility requires complete linked evidence and second-person review", () => {
  const noSecondReader = reviewedPublicIrProfile()
  noSecondReader.reviewers = noSecondReader.reviewers.filter(
    (review) => review.role !== "second-reader",
  )
  assert.equal(isReferenceProfileMappable(noSecondReader), false)

  const missingDimension = reviewedPublicIrProfile()
  delete missingDimension.dimensionEstimates.restraint
  assert.equal(isReferenceProfileMappable(missingDimension), false)

  const unlinkedEvidence = reviewedPublicIrProfile()
  unlinkedEvidence.dimensionEstimates.restraint!.evidenceIds = ["mearsheimer-e1"]
  assert.equal(isReferenceProfileMappable(unlinkedEvidence), false)
})

test("published Wendt remains a reading card with political economy uncoded", () => {
  const wendt = getReferenceProfileById("alexander-wendt")
  assert.ok(wendt)
  if (wendt.scope === "ai-governance") {
    assert.fail("Expected Wendt to use Foundation dimensions.")
  }
  assert.equal(isReferenceProfilePublishable(wendt), true)
  assert.equal(wendt.dimensionEstimates.politicalEconomy, undefined)
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

test("the thinker source ledger uses original-work dates for catalog windows", () => {
  const s1 = REFERENCE_PROFILE_CATALOG.sources.find((source) => source.id === "S1")
  const s12 = REFERENCE_PROFILE_CATALOG.sources.find((source) => source.id === "S12")
  const strange = getReferenceProfileById("susan-strange")

  assert.equal(s1?.title, "The False Promise of International Institutions")
  assert.equal(s12?.publishedAt, "1988-01-01")
  assert.equal(strange?.evidenceWindow.end, "1998-01-01")
})

test("review, publication, and version records are structurally enforced", () => {
  const catalog = cloneCatalog()
  const profile = catalog.profiles[0]
  catalog.dataStatus = "internal-review"
  profile.public = false
  profile.reviewers = []
  profile.version = 3

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

test("publication requires a second reader on the current reviewed version", () => {
  const catalog = cloneCatalog()
  const profile = catalog.profiles[0]
  profile.reviewers = profile.reviewers.filter((review) => review.role !== "second-reader")
  profile.reviewers.push({
    reviewerId: "stale-second-reader",
    role: "second-reader",
    reviewedAt: "2026-07-11",
  })

  const validation = validateReferenceCatalog(catalog)
  assert.equal(validation.ok, false)
  assert.equal(hasReferenceValidationError(validation, "review.second-reader"), true)
  assert.equal(isReferenceProfilePublishable(profile), false)
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

function reviewedPublicIrProfile(): IrReferenceProfile {
  const profile = getReferenceProfileById("john-mearsheimer")
  if (!profile || profile.scope === "ai-governance") {
    throw new Error("Expected a Foundation reference fixture.")
  }

  return structuredClone(profile)
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
