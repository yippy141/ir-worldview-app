import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"
import archetypeCatalog from "@/content/archetypes.json" with { type: "json" }
import archetypeEvidenceCatalog from "@/content/archetype-evidence.json" with { type: "json" }
import { approvedChinesePaths } from "@/i18n/paths"
import {
  archetypeContentValidationErrors,
  countArchetypeContentStatuses,
  getArchetypeContentDraft,
  getPublishedArchetypeContent,
  getPublishedArchetypeStatus,
  selectArchetypeContentRecord,
  selectLegacyArchetypeEvidence,
  selectPublishedArchetypeStatus,
  validateArchetypeContentCatalog,
} from "@/lib/archetype-content"
import {
  archetypes,
  getArchetypeByCode,
  getArchetypePath,
} from "@/lib/archetypes"

const projectRoot = process.cwd()
const reviewLedger = readFileSync(
  join(projectRoot, "docs/v23/V23_1_ARCHETYPE_CONTENT_REVIEW_LEDGER.md"),
  "utf8",
)

const frozenIdentities = [
  {
    code: "P+",
    name: "Kairos",
    slug: "p-plus",
    gloss:
      "Your answers put power and timing first: a strategic opening is an opportunity to act.",
    familyKey: "realist",
    analogue: {
      label: "The Melian Dialogue",
      year: "416 BC",
      href: "https://en.wikipedia.org/wiki/Melian_dialogue",
    },
  },
  {
    code: "P-",
    name: "Shi (勢)",
    slug: "p-minus",
    gloss:
      "Power matters here as a position built over time; the priority is to establish leverage before forcing an outcome.",
    familyKey: "realist",
    analogue: {
      label: "The Art of War",
      year: "5th C. BC",
      href: "https://en.wikipedia.org/wiki/The_Art_of_War",
    },
  },
  {
    code: "R+",
    name: "Grotian",
    slug: "r-plus",
    gloss:
      "Your answers give rules force only when they are backed by credible enforcement.",
    familyKey: "institutionalist",
    analogue: {
      label: "Hugo Grotius / De Jure Belli ac Pacis",
      year: "1625",
      href: "https://en.wikipedia.org/wiki/De_jure_belli_ac_pacis",
    },
  },
  {
    code: "R-",
    name: "Concert",
    slug: "r-minus",
    gloss:
      "Durable cooperation here depends on powerful actors accepting rules and restraint.",
    familyKey: "institutionalist",
    analogue: {
      label: "The Congress of Vienna",
      year: "1815",
      href: "https://en.wikipedia.org/wiki/Congress_of_Vienna",
    },
  },
  {
    code: "M+",
    name: "Satyagraha",
    slug: "m-plus",
    gloss:
      "Your answers treat shared beliefs as politically decisive: changing the public narrative can change what power achieves.",
    familyKey: "constructivist",
    analogue: {
      label: "The Salt March",
      year: "1930",
      href: "https://en.wikipedia.org/wiki/Salt_March",
    },
  },
  {
    code: "M-",
    name: "Musyawarah",
    slug: "m-minus",
    gloss:
      "Legitimacy here grows through patient consensus and cannot be secured by demand alone.",
    familyKey: "constructivist",
    analogue: {
      label: "The ASEAN Way",
      year: "1967",
      href: "https://en.wikipedia.org/wiki/ASEAN#The_ASEAN_Way",
    },
  },
  {
    code: "S+",
    name: "Dirigisme",
    slug: "s-plus",
    gloss:
      "Your answers give production and finance a leading role, with the state actively shaping the dependencies they create.",
    familyKey: "criticalPoliticalEconomy",
    analogue: {
      label: "The Monnet Plan",
      year: "1946",
      href: "https://en.wikipedia.org/wiki/Monnet_Plan",
    },
  },
  {
    code: "S-",
    name: "Dependencia",
    slug: "s-minus",
    gloss: "Reducing external dependence is central to resilience in this result.",
    familyKey: "criticalPoliticalEconomy",
    analogue: {
      label: "Raúl Prebisch",
      year: "1950",
      href: "https://en.wikipedia.org/wiki/Ra%C3%BAl_Prebisch",
    },
  },
] as const

function object(value: unknown): Record<string, unknown> {
  assert.ok(value && typeof value === "object" && !Array.isArray(value))
  return value as Record<string, unknown>
}

function array(value: unknown): unknown[] {
  assert.ok(Array.isArray(value))
  return value
}

function firstContent(catalog: unknown): Record<string, unknown> {
  const records = array(object(catalog).records)
  return object(object(records[0]).content)
}

function firstDraftClaim(catalog: unknown): {
  field: Record<string, unknown>
  claim: Record<string, unknown>
} {
  const notices = object(firstContent(catalog).noticesFirst)
  const field = object(array(notices.value)[0])
  return { field, claim: object(field.value) }
}

function visit(value: unknown, callback: (record: Record<string, unknown>) => void) {
  if (Array.isArray(value)) {
    value.forEach((item) => visit(item, callback))
    return
  }
  if (!value || typeof value !== "object") return
  const record = value as Record<string, unknown>
  callback(record)
  Object.values(record).forEach((item) => visit(item, callback))
}

function occurrences(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1
}

test("V23.1 freezes exactly eight identity projections independently of rich content", () => {
  assert.deepEqual(
    archetypes.map(({ code, name, slug, gloss, familyKey, analogue }) => ({
      code,
      name,
      slug,
      gloss,
      familyKey,
      analogue,
    })),
    frozenIdentities,
  )
  assert.deepEqual(
    archetypeCatalog.records.map(({ identity }) => identity),
    frozenIdentities,
  )
  assert.equal(archetypeCatalog.schemaVersion, 1)
  assert.equal(archetypeCatalog.locale, "en")
  assert.equal(archetypeEvidenceCatalog.schemaVersion, 2)
  assert.equal(archetypeCatalog.contentVersion, archetypeEvidenceCatalog.contentVersion)
  assert.equal(
    archetypeCatalog.evidenceCatalogVersion,
    archetypeEvidenceCatalog.evidenceCatalogVersion,
  )
  assert.equal(archetypeCatalog.records.length, 8)
  assert.equal(archetypeEvidenceCatalog.records.length, 8)
})

test("the eight approved cores satisfy field, variant, relation, and publication rules", () => {
  assert.deepEqual(archetypeContentValidationErrors, [])
  assert.deepEqual(countArchetypeContentStatuses(), {
    reviewed: 144,
    partial: 18,
    "research-required": 8,
    withheld: 16,
  })

  for (const record of archetypeCatalog.records) {
    const { content } = record
    const code = record.identity.code as (typeof archetypes)[number]["code"]
    assert.equal(content.publicationState, "published")
    assert.equal(content.noticesFirst.value.length, 1)
    assert.equal(content.likelyPolicyInstincts.value.length, 3)
    assert.equal(content.evidenceThatWouldWeakenFit.value.length >= 2, true)
    assert.equal(content.acceptedTradeoff.status, "reviewed")
    assert.equal(content.strongestCaseForReading.status, "reviewed")
    assert.equal(content.strongestObjection.status, "reviewed")
    assert.equal(content.commonFailureMode.status, "reviewed")
    assert.deepEqual(
      content.normativeVariants.map(({ state, publicLabel }) => ({
        state,
        publicLabel,
      })),
      [
        { state: "o", publicLabel: "Order-first" },
        { state: "c", publicLabel: "Conditional" },
        { state: "j", publicLabel: "Justice-first" },
      ],
    )
    assert.equal(content.nearestNeighbors.status, "research-required")
    assert.equal(content.commonBlends.status, "withheld")
    assert.equal(content.commonBlends.value, null)
    assert.equal(content.likelyDomainExpressions.status, "withheld")
    assert.equal(content.likelyDomainExpressions.value, null)
    assert.deepEqual(content.relatedCurrentCases.value, [])
    assert.equal(content.relatedCurrentCases.status, "reviewed")
    assert.deepEqual(content.relatedDecisionPatterns.value, [])
    assert.equal(content.relatedDecisionPatterns.status, "reviewed")
    assert.ok(getArchetypeContentDraft(code))
    assert.ok(getPublishedArchetypeContent(code))
    assert.deepEqual(getPublishedArchetypeStatus(code), {
      reviewerId: "product-owner",
      reviewedAt: "2026-08-14",
      evidenceStatus: "legacy-v1-provisional",
    })
  }
})

test("all 104 owner-approved authored sentences appear verbatim once in the ledger", () => {
  const authored: Array<{ id: string; text: string }> = []
  visit(archetypeCatalog, (record) => {
    if (
      typeof record.id === "string" &&
      !record.id.startsWith("legacy-") &&
      record.kind === "authored-interpretation" &&
      typeof record.text === "string"
    ) {
      authored.push({ id: record.id, text: record.text })
    }
  })

  assert.equal(authored.length, 104)
  assert.equal(new Set(authored.map(({ id }) => id)).size, 104)
  for (const claim of authored) {
    assert.equal(occurrences(reviewLedger, claim.id), 1, claim.id)
    assert.equal(occurrences(reviewLedger, claim.text), 1, claim.id)
  }
  assert.match(reviewLedger, /approved all 104 sentences for English publication/iu)
  assert.match(reviewLedger, /Neither constitutes external expert review or empirical validation/iu)
  assert.match(reviewLedger, /product-owner editorial and methodology approval only/iu)
  assert.doesNotMatch(reviewLedger, /approved external expert/iu)
  assert.doesNotMatch(
    reviewLedger,
    /No newly authored interpretation[^.]*is approved/iu,
  )
})

test("published status metadata fails closed without dated owner role approvals", () => {
  const malformedEvidence = structuredClone(archetypeEvidenceCatalog) as unknown
  const reviews = array(object(malformedEvidence).reviews)
  const ownerEditorial = reviews.find((review) =>
    object(review).id === "review-owner-v23-1-content-editorial"
  )
  assert.ok(ownerEditorial)
  object(ownerEditorial).reviewedAt = "date unavailable"

  assert.equal(
    selectPublishedArchetypeStatus(
      archetypeCatalog,
      malformedEvidence,
      "P+",
    ),
    null,
  )
  assert.deepEqual(getArchetypeByCode("P+"), archetypes[0])
})

test("semantic rich-content failures fail closed without changing identity, blends, or legacy paths", () => {
  const malformed = structuredClone(archetypeCatalog) as unknown
  firstDraftClaim(malformed).claim.text = ""

  assert.equal(
    selectArchetypeContentRecord(
      malformed,
      archetypeEvidenceCatalog,
      "P+",
      false,
    ),
    null,
  )
  assert.deepEqual(getArchetypeByCode("P+"), archetypes[0])
  assert.equal(getArchetypeByCode("P/M+")?.code, "P/M+")
  assert.equal(getArchetypeByCode("P/M+")?.analogue, null)
  assert.equal(getArchetypePath("P+"), "/archetypes/p-plus")
  assert.ok(selectLegacyArchetypeEvidence(malformed, archetypeEvidenceCatalog, "P+"))

  const malformedHistory = structuredClone(archetypeCatalog) as unknown
  const history = object(firstContent(malformedHistory).historicalAnalogue)
  object(history.whyItFits).status = "withheld"
  assert.equal(
    selectLegacyArchetypeEvidence(
      malformedHistory,
      archetypeEvidenceCatalog,
      "P+",
    ),
    null,
  )
  assert.equal(getArchetypePath("P+"), "/archetypes/p-plus")

  const identitySource = readFileSync(join(projectRoot, "lib/archetypes.ts"), "utf8")
  assert.doesNotMatch(identitySource, /archetype-content/u)
  for (const relativePath of [
    "lib/share.ts",
    "lib/profile-share.ts",
    "lib/profile-store.ts",
    "lib/profile-foundation-identity.ts",
    "components/profile/profile-compare.tsx",
  ]) {
    assert.doesNotMatch(
      readFileSync(join(projectRoot, relativePath), "utf8"),
      /archetype-content/u,
      relativePath,
    )
  }
})

test("publication and claim-class rules reject unreviewed or under-sourced claims", () => {
  const published = structuredClone(archetypeCatalog) as unknown
  const publishedContent = firstContent(published)
  publishedContent.publicationState = "published"
  const notices = object(publishedContent.noticesFirst)
  notices.status = "reviewed"
  notices.qualification = null
  notices.reviewIds = [
    "review-owner-v23-1-relations-editorial",
    "review-owner-v23-1-relations-methodology",
  ]
  const firstNotice = object(array(notices.value)[0])
  firstNotice.status = "partial"
  firstNotice.qualification = "Draft interpretation pending owner review."
  firstNotice.reviewIds = []
  assert.ok(
    validateArchetypeContentCatalog(published, archetypeEvidenceCatalog).some(
      (error) => error.includes("noticesFirst claims must be reviewed"),
    ),
  )

  const authored = structuredClone(archetypeCatalog) as unknown
  const authoredField = firstDraftClaim(authored).field
  authoredField.status = "reviewed"
  authoredField.qualification = null
  authoredField.reviewIds = ["review-owner-v23-1-relations-editorial"]
  const authoredErrors = validateArchetypeContentCatalog(
    authored,
    archetypeEvidenceCatalog,
  )
  assert.ok(authoredErrors.some((error) => error.includes("editorial review")))
  assert.ok(authoredErrors.some((error) => error.includes("methodology review")))

  for (const [kind, expected] of [
    ["historical-fact", "reviewed source"],
    ["scholarly-interpretation", "reviewed scholarly source"],
    ["current-policy-claim", "current-official"],
  ] as const) {
    const candidate = structuredClone(archetypeCatalog) as unknown
    const claim = firstDraftClaim(candidate).claim
    claim.kind = kind
    claim.sourceIds = []
    const errors = validateArchetypeContentCatalog(
      candidate,
      archetypeEvidenceCatalog,
    )
    assert.ok(errors.some((error) => error.includes(expected)), kind)
  }

  const falseReview = structuredClone(archetypeEvidenceCatalog) as unknown
  object(array(object(falseReview).sources)[0]).status = "reviewed"
  assert.ok(
    validateArchetypeContentCatalog(archetypeCatalog, falseReview).some(
      (error) => error.includes("approved research review"),
    ),
  )
})

test("source IDs, review subjects, and legacy metadata remain honest and resolvable", () => {
  const sourceIds = new Set(archetypeEvidenceCatalog.sources.map(({ id }) => id))
  const reviewIds = new Set(archetypeEvidenceCatalog.reviews.map(({ id }) => id))
  assert.equal(sourceIds.size, archetypeEvidenceCatalog.sources.length)
  assert.equal(reviewIds.size, archetypeEvidenceCatalog.reviews.length)

  for (const record of archetypeEvidenceCatalog.records) {
    for (const sourceId of [...record.legacySourceIds, ...record.researchSourceIds]) {
      assert.equal(sourceIds.has(sourceId), true, `${record.code}:${sourceId}`)
    }
  }
  for (const source of archetypeEvidenceCatalog.sources) {
    assert.doesNotMatch(new URL(source.href).hostname, /wikipedia\.org$/iu)
    assert.equal(source.status, "provisional")
    if (source.metadataStatus === "legacy-minimal") {
      assert.equal(source.authorOrInstitution, null)
      assert.equal(source.publisher, null)
      assert.equal(source.publishedAt, null)
      assert.equal(source.accessedAt, null)
    }
  }
  visit(archetypeCatalog, (record) => {
    if (Array.isArray(record.sourceIds)) {
      record.sourceIds.forEach((sourceId) => {
        assert.equal(typeof sourceId, "string")
        assert.equal(sourceIds.has(sourceId as string), true, sourceId as string)
      })
    }
    if (Array.isArray(record.reviewIds)) {
      record.reviewIds.forEach((reviewId) => {
        assert.equal(typeof reviewId, "string")
        assert.equal(reviewIds.has(reviewId as string), true, reviewId as string)
      })
    }
  })

  const unresolvedReview = structuredClone(archetypeEvidenceCatalog) as unknown
  object(array(object(unresolvedReview).reviews)[0]).subjectIds = ["unknown-subject"]
  assert.ok(
    validateArchetypeContentCatalog(archetypeCatalog, unresolvedReview).some(
      (error) => error.includes("subject does not resolve"),
    ),
  )

  const rejectedLocators = [
    "THU-2013",
    "LEBOW-KELLY-2001",
    "JAMES-2024",
    "AMES-1993",
    "RAPHALS-2016",
    "CAC-2025",
  ]
  rejectedLocators.forEach((sourceId) => assert.equal(sourceIds.has(sourceId), false))
})

test("catalog prose makes no assignment, psychometric, prevalence, or Chinese fallback claim", () => {
  const claimText: string[] = []
  visit(archetypeCatalog, (record) => {
    if (
      record.kind === "authored-interpretation" &&
      typeof record.text === "string"
    ) {
      claimText.push(record.text)
    }
  })
  const joined = claimText.join("\n")
  assert.doesNotMatch(
    joined,
    /\b(?:validity|reliability|representative(?:ness)?|cross-cultural equivalence|prevalence|percentile|percent of (?:people|respondents|users))\b/iu,
  )
  assert.doesNotMatch(
    joined,
    /\b(?:person|organization|government|party|movement)\b[^.!?]{0,60}\b(?:is|was|matches|belongs to)\b/iu,
  )

  const forbiddenAssignmentKeys = new Set([
    "people",
    "organizations",
    "associatedThinkers",
    "assignedActors",
    "decisionPatternIds",
  ])
  visit(archetypeCatalog, (record) => {
    Object.keys(record).forEach((key) => {
      assert.equal(forbiddenAssignmentKeys.has(key), false, key)
    })
  })
  assert.equal(joined.includes("Decision Pattern"), false)

  for (const path of ["/zh/explore", "/zh/archetypes", "/zh/archetypes/p-plus"]) {
    assert.equal(approvedChinesePaths.includes(path as never), false, path)
  }
  for (const relativePath of [
    "app/[locale]/results/[payload]/page.tsx",
    "components/profile/zh-hans-profile-dashboard.tsx",
  ]) {
    const source = readFileSync(join(projectRoot, relativePath), "utf8")
    assert.doesNotMatch(source, /archetype-content/u, relativePath)
    assert.doesNotMatch(source, /\.gloss|\.analogue/u, relativePath)
  }
})
