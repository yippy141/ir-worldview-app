import archetypeCatalogData from "@/content/archetypes.json" with { type: "json" }
import archetypeEvidenceData from "@/content/archetype-evidence.json" with { type: "json" }
import type {
  Archetype,
  ArchetypeSlug,
  LensCode,
  PostureSign,
} from "@/lib/archetypes"
import type { FamilyKey } from "@/lib/types"

export const archetypeContentSchemaVersion = 1 as const
export const archetypeEvidenceSchemaVersion = 2 as const

export const LEGACY_COMPARISON_QUALIFICATION =
  "This historical comparison uses provisional source metadata and remains pending research review."

export const DRAFT_INTERPRETATION_QUALIFICATION =
  "Draft interpretation pending owner review."

export type ContentStatus =
  | "reviewed"
  | "partial"
  | "research-required"
  | "withheld"

export type FieldState<T> =
  | {
      status: "reviewed"
      value: T
      qualification: null
      reviewIds: string[]
    }
  | {
      status: "partial"
      value: T
      qualification: string
      reviewIds: string[]
    }
  | {
      status: "research-required" | "withheld"
      value: null
      qualification: string | null
      reviewIds: string[]
    }

export type ClaimKind =
  | "authored-interpretation"
  | "historical-fact"
  | "scholarly-interpretation"
  | "current-policy-claim"

export type ClaimValue = {
  id: string
  kind: ClaimKind
  text: string
  sourceIds: string[]
  scope: string | null
  asOf: string | null
  evidenceWindow: { start: string; end: string } | null
  reviewDue: string | null
}

export type Claim = FieldState<ClaimValue>

export type NormativeVariant = {
  state: "o" | "c" | "j"
  publicLabel: "Order-first" | "Conditional" | "Justice-first"
  interpretation: Claim
}

export type SourceRecord = {
  id: string
  title: string
  authorOrInstitution: string | null
  publisher: string | null
  href: string
  publishedAt: string | null
  accessedAt: string | null
  sourceKind: "primary" | "scholarly" | "reference" | "current-official"
  metadataStatus: "complete" | "legacy-minimal" | "research-required"
  status: "reviewed" | "provisional" | "superseded"
}

export type ReviewRecord = {
  id: string
  subjectIds: string[]
  contentVersion: string | null
  evidenceCatalogVersion: string
  reviewerId: string
  reviewedAt: string
  reviewerRole: "editorial" | "research" | "methodology" | "localization"
  outcome: "approved" | "changes-required" | "blocked"
  note: string
}

export type ArchetypeIdentityProjection = {
  code: Archetype["code"]
  name: string
  slug: ArchetypeSlug
  gloss: string
  familyKey: FamilyKey
  analogue: {
    label: string
    year: string
    href: string
  }
}

export type HistoricalAnalogueContent = {
  label: string
  displayDate: string
  normalizedDate: { startYear: number | null; endYear: number | null } | null
  overviewHref: string
  whyItFits: Claim
  whereItBreaks: Claim
  nameNote: Claim | null
}

export type ArchetypeRichContent = {
  lens: LensCode
  posture: PostureSign
  noticesFirst: FieldState<Claim[]>
  likelyPolicyInstincts: FieldState<Claim[]>
  acceptedTradeoff: Claim
  strongestCaseForReading: Claim
  strongestObjection: Claim
  commonFailureMode: Claim
  evidenceThatWouldWeakenFit: FieldState<Claim[]>
  nearestNeighbors: FieldState<unknown[]>
  normativeVariants: [NormativeVariant, NormativeVariant, NormativeVariant]
  commonBlends: FieldState<unknown[]>
  likelyDomainExpressions: FieldState<unknown[]>
  historicalAnalogue: HistoricalAnalogueContent
  evidenceStatus: "legacy-v1-provisional"
  relatedCurrentCases: FieldState<unknown[]>
  relatedDecisionPatterns: FieldState<unknown[]>
  publicationState: "draft" | "published" | "withheld"
  recordReviewIds: string[]
}

export type ArchetypeContentRecord = {
  identity: ArchetypeIdentityProjection
  content: ArchetypeRichContent
}

export type LegacyArchetypeEvidence = {
  whyItFits: string
  whereItBreaks: string
  nameNote?: string
  qualification: string
  sources: Array<{ label: string; href: string }>
}

type ValidationContext = {
  contentVersion: string
  evidenceCatalogVersion: string
  sources: Map<string, SourceRecord>
  reviews: Map<string, ReviewRecord>
  claimIds: Set<string>
}

const rawCatalog: unknown = archetypeCatalogData
const rawEvidence: unknown = archetypeEvidenceData

export const archetypeContentVersion = readRootString(
  rawCatalog,
  "contentVersion",
)
export const archetypeEvidenceCatalogVersion = readRootString(
  rawEvidence,
  "evidenceCatalogVersion",
)

/**
 * Full diagnostics for editorial and CI use. The module never throws for a
 * semantic rich-content failure; identity resolution reads its own frozen
 * projection directly from the catalog.
 */
export const archetypeContentValidationErrors =
  validateArchetypeContentCatalog(rawCatalog, rawEvidence)

export function validateArchetypeContentCatalog(
  catalog: unknown,
  evidence: unknown,
): string[] {
  const errors: string[] = []
  const context = buildEvidenceContext(evidence, errors)

  if (!isRecord(catalog)) {
    return [...errors, "catalog must be an object."]
  }
  if (catalog.schemaVersion !== archetypeContentSchemaVersion) {
    errors.push(
      `catalog.schemaVersion must be ${archetypeContentSchemaVersion}.`,
    )
  }
  if (!isNonEmptyString(catalog.contentVersion)) {
    errors.push("catalog.contentVersion is required.")
  }
  if (!isNonEmptyString(catalog.evidenceCatalogVersion)) {
    errors.push("catalog.evidenceCatalogVersion is required.")
  }
  if (catalog.locale !== "en") {
    errors.push("catalog.locale must be en.")
  }
  if (
    isNonEmptyString(catalog.contentVersion) &&
    context.contentVersion &&
    catalog.contentVersion !== context.contentVersion
  ) {
    errors.push("catalog and evidence content versions must match.")
  }
  if (
    isNonEmptyString(catalog.evidenceCatalogVersion) &&
    context.evidenceCatalogVersion &&
    catalog.evidenceCatalogVersion !== context.evidenceCatalogVersion
  ) {
    errors.push("catalog and evidence catalog versions must match.")
  }

  if (!Array.isArray(catalog.records)) {
    errors.push("catalog.records must be an array.")
    return errors
  }

  validateEightRecordCoverage(
    catalog.records,
    "catalog.records",
    (record) =>
      isRecord(record) && isRecord(record.identity)
        ? record.identity.code
        : null,
    errors,
  )

  const localContext: ValidationContext = {
    ...context,
    contentVersion: isNonEmptyString(catalog.contentVersion)
      ? catalog.contentVersion
      : context.contentVersion,
    claimIds: new Set<string>(),
  }
  catalog.records.forEach((record, index) => {
    validateContentRecord(
      record,
      `catalog.records[${index}]`,
      localContext,
      errors,
    )
  })
  validateReviewSubjectResolution(catalog.records, localContext, errors)

  return errors
}

/**
 * Returns a structurally valid record for editorial tooling. Draft status is
 * preserved and does not make the record publicly renderable.
 */
export function getArchetypeContentDraft(
  code: Archetype["code"],
): ArchetypeContentRecord | null {
  return selectArchetypeContentRecord(rawCatalog, rawEvidence, code, false)
}

/**
 * Public selector. A record fails closed unless it is explicitly published
 * and every required authored core has the review state required by contract.
 */
export function getPublishedArchetypeContent(
  code: Archetype["code"],
): ArchetypeContentRecord | null {
  return selectArchetypeContentRecord(rawCatalog, rawEvidence, code, true)
}

export function selectArchetypeContentRecord(
  catalog: unknown,
  evidence: unknown,
  code: Archetype["code"],
  publishedOnly = true,
): ArchetypeContentRecord | null {
  if (!isRecord(catalog) || !Array.isArray(catalog.records)) return null
  if (
    catalog.schemaVersion !== archetypeContentSchemaVersion ||
    catalog.locale !== "en" ||
    !isNonEmptyString(catalog.contentVersion) ||
    !isNonEmptyString(catalog.evidenceCatalogVersion)
  ) {
    return null
  }

  const evidenceErrors: string[] = []
  const evidenceContext = buildEvidenceContext(evidence, evidenceErrors)
  if (
    evidenceErrors.length > 0 ||
    evidenceContext.contentVersion !== catalog.contentVersion ||
    evidenceContext.evidenceCatalogVersion !== catalog.evidenceCatalogVersion
  ) {
    return null
  }

  const candidates = catalog.records.filter(
    (record) =>
      isRecord(record) &&
      isRecord(record.identity) &&
      record.identity.code === code,
  )
  if (candidates.length !== 1) return null

  const errors: string[] = []
  validateContentRecord(
    candidates[0],
    `catalog.records.${code}`,
    {
      ...evidenceContext,
      contentVersion: catalog.contentVersion,
      claimIds: new Set<string>(),
    },
    errors,
  )
  if (errors.length > 0) return null

  const record = candidates[0] as unknown as ArchetypeContentRecord
  if (publishedOnly && record.content.publicationState !== "published") {
    return null
  }
  return record
}

/**
 * Narrow grandfather adapter for the already-public v1 historical comparison.
 * It validates only the comparison and referenced legacy source metadata, so
 * a malformed draft instinct or variant cannot remove a stable legacy link.
 */
export function getLegacyArchetypeEvidence(
  code: Archetype["code"],
): LegacyArchetypeEvidence | null {
  return selectLegacyArchetypeEvidence(rawCatalog, rawEvidence, code)
}

export function selectLegacyArchetypeEvidence(
  catalog: unknown,
  evidence: unknown,
  code: Archetype["code"],
): LegacyArchetypeEvidence | null {
  if (!isRecord(catalog) || !Array.isArray(catalog.records)) return null
  if (!isRecord(evidence) || !Array.isArray(evidence.sources)) return null

  const candidates = catalog.records.filter(
    (record) =>
      isRecord(record) &&
      isRecord(record.identity) &&
      record.identity.code === code,
  )
  if (candidates.length !== 1) return null
  const record = candidates[0]
  if (!isRecord(record) || !isRecord(record.content)) return null
  if (record.content.evidenceStatus !== "legacy-v1-provisional") return null
  if (!isRecord(record.content.historicalAnalogue)) return null
  const historical = record.content.historicalAnalogue

  const sourceMap = new Map<string, SourceRecord>()
  const duplicateSourceIds = new Set<string>()
  for (const candidate of evidence.sources) {
    if (!isValidSourceRecord(candidate)) continue
    if (sourceMap.has(candidate.id)) duplicateSourceIds.add(candidate.id)
    sourceMap.set(candidate.id, candidate)
  }

  const whyItFits = readLegacyClaim(historical.whyItFits, sourceMap)
  const whereItBreaks = readLegacyClaim(historical.whereItBreaks, sourceMap)
  if (!whyItFits || !whereItBreaks) return null
  const sourceIds = unique([
    ...whyItFits.sourceIds,
    ...whereItBreaks.sourceIds,
  ])
  if (
    sourceIds.length === 0 ||
    sourceIds.some((sourceId) => duplicateSourceIds.has(sourceId))
  ) {
    return null
  }

  const nameNote = historical.nameNote === null
    ? null
    : readLegacyClaim(historical.nameNote, sourceMap)
  const allSourceIds = unique([
    ...sourceIds,
    ...(nameNote?.sourceIds ?? []),
  ])
  const sources = allSourceIds.flatMap((sourceId) => {
    const source = sourceMap.get(sourceId)
    return source
      ? [{ label: source.title, href: source.href }]
      : []
  })
  if (sources.length !== allSourceIds.length) return null

  return {
    whyItFits: whyItFits.text,
    whereItBreaks: whereItBreaks.text,
    ...(nameNote ? { nameNote: nameNote.text } : {}),
    qualification: LEGACY_COMPARISON_QUALIFICATION,
    sources,
  }
}

export function countArchetypeContentStatuses(
  catalog: unknown = rawCatalog,
): Record<ContentStatus, number> {
  const counts: Record<ContentStatus, number> = {
    reviewed: 0,
    partial: 0,
    "research-required": 0,
    withheld: 0,
  }
  if (!isRecord(catalog) || !Array.isArray(catalog.records)) return counts

  for (const record of catalog.records) {
    if (!isRecord(record) || !isRecord(record.content)) continue
    visitStatusObjects(record.content, (status) => {
      counts[status] += 1
    })
  }
  return counts
}

function buildEvidenceContext(
  evidence: unknown,
  errors: string[],
): Omit<ValidationContext, "claimIds"> {
  const sources = new Map<string, SourceRecord>()
  const reviews = new Map<string, ReviewRecord>()
  let contentVersion = ""
  let evidenceCatalogVersion = ""

  if (!isRecord(evidence)) {
    errors.push("evidence must be an object.")
    return { contentVersion, evidenceCatalogVersion, sources, reviews }
  }
  if (evidence.schemaVersion !== archetypeEvidenceSchemaVersion) {
    errors.push(
      `evidence.schemaVersion must be ${archetypeEvidenceSchemaVersion}.`,
    )
  }
  if (isNonEmptyString(evidence.contentVersion)) {
    contentVersion = evidence.contentVersion
  } else {
    errors.push("evidence.contentVersion is required.")
  }
  if (isNonEmptyString(evidence.evidenceCatalogVersion)) {
    evidenceCatalogVersion = evidence.evidenceCatalogVersion
  } else {
    errors.push("evidence.evidenceCatalogVersion is required.")
  }

  if (!Array.isArray(evidence.records)) {
    errors.push("evidence.records must be an array.")
  } else {
    validateEightRecordCoverage(
      evidence.records,
      "evidence.records",
      (record) => isRecord(record) ? record.code : null,
      errors,
    )
    evidence.records.forEach((record, index) => {
      validateEvidenceRecord(record, `evidence.records[${index}]`, errors)
    })
  }

  if (!Array.isArray(evidence.sources)) {
    errors.push("evidence.sources must be an array.")
  } else {
    evidence.sources.forEach((source, index) => {
      const path = `evidence.sources[${index}]`
      const sourceErrors: string[] = []
      validateSourceRecord(source, path, sourceErrors)
      errors.push(...sourceErrors)
      if (sourceErrors.length === 0 && isRecord(source)) {
        const typed = source as unknown as SourceRecord
        if (sources.has(typed.id)) {
          errors.push(`${path}.id duplicates ${typed.id}.`)
        } else {
          sources.set(typed.id, typed)
        }
      }
    })
  }

  if (!Array.isArray(evidence.reviews)) {
    errors.push("evidence.reviews must be an array.")
  } else {
    evidence.reviews.forEach((review, index) => {
      const path = `evidence.reviews[${index}]`
      const reviewErrors: string[] = []
      validateReviewRecord(
        review,
        path,
        contentVersion,
        evidenceCatalogVersion,
        reviewErrors,
      )
      errors.push(...reviewErrors)
      if (reviewErrors.length === 0 && isRecord(review)) {
        const typed = review as unknown as ReviewRecord
        if (reviews.has(typed.id)) {
          errors.push(`${path}.id duplicates ${typed.id}.`)
        } else {
          reviews.set(typed.id, typed)
        }
      }
    })
  }

  if (Array.isArray(evidence.records)) {
    evidence.records.forEach((record, index) => {
      if (!isRecord(record)) return
      for (const key of ["legacySourceIds", "researchSourceIds"] as const) {
        if (!Array.isArray(record[key])) continue
        record[key].forEach((sourceId, sourceIndex) => {
          if (typeof sourceId !== "string" || !sources.has(sourceId)) {
            errors.push(
              `evidence.records[${index}].${key}[${sourceIndex}] does not resolve.`,
            )
          }
        })
      }
    })
  }

  for (const source of sources.values()) {
    if (source.status !== "reviewed") continue
    const hasResearchReview = [...reviews.values()].some(
      (review) =>
        review.reviewerRole === "research" &&
        review.outcome === "approved" &&
        review.evidenceCatalogVersion === evidenceCatalogVersion &&
        review.subjectIds.includes(source.id),
    )
    if (!hasResearchReview) {
      errors.push(
        `evidence source ${source.id} cannot be reviewed without an approved research review.`,
      )
    }
  }

  return { contentVersion, evidenceCatalogVersion, sources, reviews }
}

function validateReviewSubjectResolution(
  records: unknown[],
  context: ValidationContext,
  errors: string[],
): void {
  const subjectIds = new Set<string>([
    ...context.claimIds,
    ...context.sources.keys(),
  ])
  for (const record of records) {
    if (!isRecord(record) || !isRecord(record.identity)) continue
    const { code, slug } = record.identity
    if (isNonEmptyString(code)) subjectIds.add(code)
    if (!isNonEmptyString(slug)) continue
    subjectIds.add(slug)
    subjectIds.add(`${slug}.relatedCurrentCases`)
    subjectIds.add(`${slug}.relatedDecisionPatterns`)
  }
  for (const review of context.reviews.values()) {
    for (const subjectId of review.subjectIds) {
      if (!subjectIds.has(subjectId)) {
        errors.push(`review ${review.id} subject does not resolve ${subjectId}.`)
      }
    }
  }
}

function validateContentRecord(
  value: unknown,
  path: string,
  context: ValidationContext,
  errors: string[],
): void {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`)
    return
  }
  if (!isRecord(value.identity)) {
    errors.push(`${path}.identity must be an object.`)
    return
  }
  validateIdentity(value.identity, `${path}.identity`, errors)
  if (!isRecord(value.content)) {
    errors.push(`${path}.content must be an object.`)
    return
  }
  const content = value.content
  const code = isPureCode(value.identity.code) ? value.identity.code : null
  if (!code) return
  if (content.lens !== code[0]) {
    errors.push(`${path}.content.lens must match ${code}.`)
  }
  if (content.posture !== code[1]) {
    errors.push(`${path}.content.posture must match ${code}.`)
  }

  validateClaimListField(
    content.noticesFirst,
    `${path}.content.noticesFirst`,
    context,
    errors,
    { exactLength: 1 },
  )
  validateClaimListField(
    content.likelyPolicyInstincts,
    `${path}.content.likelyPolicyInstincts`,
    context,
    errors,
    { exactLength: 3 },
  )
  for (const key of [
    "acceptedTradeoff",
    "strongestCaseForReading",
    "strongestObjection",
    "commonFailureMode",
  ] as const) {
    validateClaim(content[key], `${path}.content.${key}`, context, errors)
  }
  validateClaimListField(
    content.evidenceThatWouldWeakenFit,
    `${path}.content.evidenceThatWouldWeakenFit`,
    context,
    errors,
    { minimumLength: 2 },
  )
  validateUnresolvedField(
    content.nearestNeighbors,
    `${path}.content.nearestNeighbors`,
    errors,
    ["research-required", "withheld"],
  )
  validateNormativeVariants(
    content.normativeVariants,
    `${path}.content.normativeVariants`,
    context,
    errors,
  )
  validateUnresolvedField(
    content.commonBlends,
    `${path}.content.commonBlends`,
    errors,
    ["withheld"],
  )
  validateUnresolvedField(
    content.likelyDomainExpressions,
    `${path}.content.likelyDomainExpressions`,
    errors,
    ["withheld"],
  )
  validateHistoricalAnalogue(
    content.historicalAnalogue,
    `${path}.content.historicalAnalogue`,
    value.identity,
    context,
    errors,
  )
  if (content.evidenceStatus !== "legacy-v1-provisional") {
    errors.push(`${path}.content.evidenceStatus must be legacy-v1-provisional.`)
  }
  validateReviewedEmptyRelation(
    content.relatedCurrentCases,
    `${path}.content.relatedCurrentCases`,
    context,
    errors,
  )
  validateReviewedEmptyRelation(
    content.relatedDecisionPatterns,
    `${path}.content.relatedDecisionPatterns`,
    context,
    errors,
  )
  if (!isOneOf(content.publicationState, ["draft", "published", "withheld"])) {
    errors.push(`${path}.content.publicationState is invalid.`)
  }
  validateReviewIds(
    content.recordReviewIds,
    `${path}.content.recordReviewIds`,
    context,
    errors,
    false,
  )

  if (content.publicationState === "published") {
    validatePublishedCore(content, `${path}.content`, errors)
  }
}

function validateIdentity(
  identity: Record<string, unknown>,
  path: string,
  errors: string[],
): void {
  if (!isPureCode(identity.code)) errors.push(`${path}.code is invalid.`)
  if (!isNonEmptyString(identity.name)) errors.push(`${path}.name is required.`)
  if (!isNonEmptyString(identity.slug)) {
    errors.push(`${path}.slug is required.`)
  } else if (
    isPureCode(identity.code) &&
    identity.slug !== expectedSlug(identity.code)
  ) {
    errors.push(`${path}.slug does not match its code.`)
  }
  if (!isNonEmptyString(identity.gloss)) errors.push(`${path}.gloss is required.`)
  if (!isFamilyKey(identity.familyKey)) {
    errors.push(`${path}.familyKey is invalid.`)
  } else if (
    isPureCode(identity.code) &&
    familyLens(identity.familyKey) !== identity.code[0]
  ) {
    errors.push(`${path}.familyKey does not match its code.`)
  }
  if (!isRecord(identity.analogue)) {
    errors.push(`${path}.analogue must be an object.`)
  } else {
    if (!isNonEmptyString(identity.analogue.label)) {
      errors.push(`${path}.analogue.label is required.`)
    }
    if (!isNonEmptyString(identity.analogue.year)) {
      errors.push(`${path}.analogue.year is required.`)
    }
    if (!isHttps(identity.analogue.href)) {
      errors.push(`${path}.analogue.href must be HTTPS.`)
    }
  }
}

function validateClaimListField(
  value: unknown,
  path: string,
  context: ValidationContext,
  errors: string[],
  length: { exactLength?: number; minimumLength?: number },
): void {
  const field = validateFieldState(value, path, context, errors)
  if (!field || field.value === null) return
  if (!Array.isArray(field.value)) {
    errors.push(`${path}.value must be an array.`)
    return
  }
  if (
    length.exactLength !== undefined &&
    field.value.length !== length.exactLength
  ) {
    errors.push(`${path}.value must contain exactly ${length.exactLength} claims.`)
  }
  if (
    length.minimumLength !== undefined &&
    field.value.length < length.minimumLength
  ) {
    errors.push(`${path}.value must contain at least ${length.minimumLength} claims.`)
  }
  field.value.forEach((claim, index) => {
    validateClaim(claim, `${path}.value[${index}]`, context, errors)
  })
}

function validateClaim(
  value: unknown,
  path: string,
  context: ValidationContext,
  errors: string[],
  options: { legacy?: boolean } = {},
): void {
  const field = validateFieldState(value, path, context, errors, {
    allowEmptyReviewedReviews: false,
    legacy: options.legacy,
  })
  if (!field || field.value === null) return
  if (!isRecord(field.value)) {
    errors.push(`${path}.value must be a claim object.`)
    return
  }
  const claim = field.value
  if (!isNonEmptyString(claim.id)) {
    errors.push(`${path}.value.id is required.`)
  } else if (context.claimIds.has(claim.id)) {
    errors.push(`${path}.value.id duplicates ${claim.id}.`)
  } else {
    context.claimIds.add(claim.id)
  }
  if (!isOneOf(claim.kind, [
    "authored-interpretation",
    "historical-fact",
    "scholarly-interpretation",
    "current-policy-claim",
  ])) {
    errors.push(`${path}.value.kind is invalid.`)
  }
  if (!isNonEmptyString(claim.text)) {
    errors.push(`${path}.value.text is required.`)
  }
  const sourceIds = validateStringArray(
    claim.sourceIds,
    `${path}.value.sourceIds`,
    errors,
  )
  for (const sourceId of sourceIds) {
    if (!context.sources.has(sourceId)) {
      errors.push(`${path}.value.sourceIds does not resolve ${sourceId}.`)
    }
  }
  for (const key of ["scope", "asOf", "reviewDue"] as const) {
    if (claim[key] !== null && !isNonEmptyString(claim[key])) {
      errors.push(`${path}.value.${key} must be a string or null.`)
    }
  }
  if (claim.evidenceWindow !== null) {
    if (
      !isRecord(claim.evidenceWindow) ||
      !isNonEmptyString(claim.evidenceWindow.start) ||
      !isNonEmptyString(claim.evidenceWindow.end)
    ) {
      errors.push(`${path}.value.evidenceWindow is invalid.`)
    }
  }

  if (options.legacy) {
    if (
      field.status !== "partial" ||
      field.qualification !== LEGACY_COMPARISON_QUALIFICATION
    ) {
      errors.push(`${path} must use the qualified legacy partial state.`)
    }
    return
  }

  const claimReviewIds = validateStringArray(
    field.reviewIds,
    `${path}.reviewIds`,
    errors,
  )
  if (field.status === "reviewed" && isNonEmptyString(claim.id)) {
    const hasApprovedClaimReview = claimReviewIds.some((reviewId) => {
      const review = context.reviews.get(reviewId)
      return Boolean(
        review &&
        review.outcome === "approved" &&
        review.contentVersion === context.contentVersion &&
        review.subjectIds.includes(claim.id as string),
      )
    })
    if (!hasApprovedClaimReview) {
      errors.push(`${path} requires an approved review tied to its claim.`)
    }
  }
  if (claim.kind === "authored-interpretation" && field.status === "reviewed") {
    requireApprovedReviewRoles(
      claimReviewIds,
      ["editorial", "methodology"],
      claim.id as string,
      path,
      context,
      errors,
    )
  }
  if (claim.kind === "historical-fact") {
    requireReviewedSource(sourceIds, null, path, context, errors)
  }
  if (claim.kind === "scholarly-interpretation") {
    requireReviewedSource(sourceIds, "scholarly", path, context, errors)
    if (!isNonEmptyString(claim.scope)) {
      errors.push(`${path}.value.scope is required for scholarly interpretation.`)
    }
  }
  if (claim.kind === "current-policy-claim") {
    requireReviewedSource(sourceIds, ["primary", "current-official"], path, context, errors)
    if (!isNonEmptyString(claim.scope)) {
      errors.push(`${path}.value.scope is required for a current-policy claim.`)
    }
    if (!isNonEmptyString(claim.asOf)) {
      errors.push(`${path}.value.asOf is required for a current-policy claim.`)
    }
    if (!isNonEmptyString(claim.reviewDue)) {
      errors.push(`${path}.value.reviewDue is required for a current-policy claim.`)
    }
    if (!isRecord(claim.evidenceWindow)) {
      errors.push(`${path}.value.evidenceWindow is required for a current-policy claim.`)
    }
  }
}

function validateFieldState(
  value: unknown,
  path: string,
  context: ValidationContext,
  errors: string[],
  options: {
    allowEmptyReviewedReviews?: boolean
    legacy?: boolean
  } = {},
): Record<string, unknown> | null {
  if (!isRecord(value)) {
    errors.push(`${path} must be a field state.`)
    return null
  }
  if (!isContentStatus(value.status)) {
    errors.push(`${path}.status is invalid.`)
    return null
  }
  const reviewIds = validateReviewIds(
    value.reviewIds,
    `${path}.reviewIds`,
    context,
    errors,
    value.status === "reviewed" &&
      !options.allowEmptyReviewedReviews &&
      !options.legacy,
  )
  if (value.status === "reviewed") {
    if (value.value === null || value.value === undefined) {
      errors.push(`${path}.value is required when reviewed.`)
    }
    if (value.qualification !== null) {
      errors.push(`${path}.qualification must be null when reviewed.`)
    }
    if (!options.allowEmptyReviewedReviews && reviewIds.length === 0) {
      errors.push(`${path}.reviewIds requires an approved review.`)
    }
  } else if (value.status === "partial") {
    if (value.value === null || value.value === undefined) {
      errors.push(`${path}.value is required when partial.`)
    }
    if (!isNonEmptyString(value.qualification)) {
      errors.push(`${path}.qualification is required when partial.`)
    }
  } else {
    if (value.value !== null) {
      errors.push(`${path}.value must be null when ${value.status}.`)
    }
    if (value.qualification !== null && !isNonEmptyString(value.qualification)) {
      errors.push(`${path}.qualification must be a string or null.`)
    }
  }
  return value
}

function validateNormativeVariants(
  value: unknown,
  path: string,
  context: ValidationContext,
  errors: string[],
): void {
  if (!Array.isArray(value) || value.length !== 3) {
    errors.push(`${path} must contain exactly three variants.`)
    return
  }
  const expected = [
    ["o", "Order-first"],
    ["c", "Conditional"],
    ["j", "Justice-first"],
  ] as const
  value.forEach((variant, index) => {
    const variantPath = `${path}[${index}]`
    if (!isRecord(variant)) {
      errors.push(`${variantPath} must be an object.`)
      return
    }
    if (
      variant.state !== expected[index][0] ||
      variant.publicLabel !== expected[index][1]
    ) {
      errors.push(`${variantPath} must use the equal-weight o/c/j alias order.`)
    }
    for (const forbidden of ["rank", "weight", "priority", "score"]) {
      if (Object.hasOwn(variant, forbidden)) {
        errors.push(`${variantPath}.${forbidden} is not allowed.`)
      }
    }
    validateClaim(
      variant.interpretation,
      `${variantPath}.interpretation`,
      context,
      errors,
    )
  })
}

function validateHistoricalAnalogue(
  value: unknown,
  path: string,
  identity: Record<string, unknown>,
  context: ValidationContext,
  errors: string[],
): void {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`)
    return
  }
  if (!isRecord(identity.analogue)) return
  if (value.label !== identity.analogue.label) {
    errors.push(`${path}.label must preserve the frozen display value.`)
  }
  if (value.displayDate !== identity.analogue.year) {
    errors.push(`${path}.displayDate must preserve the frozen display value.`)
  }
  if (value.overviewHref !== identity.analogue.href) {
    errors.push(`${path}.overviewHref must preserve the frozen display value.`)
  }
  if (value.normalizedDate !== null) {
    if (
      !isRecord(value.normalizedDate) ||
      !isNullableNumber(value.normalizedDate.startYear) ||
      !isNullableNumber(value.normalizedDate.endYear)
    ) {
      errors.push(`${path}.normalizedDate is invalid.`)
    }
  }
  validateClaim(value.whyItFits, `${path}.whyItFits`, context, errors, {
    legacy: true,
  })
  validateClaim(value.whereItBreaks, `${path}.whereItBreaks`, context, errors, {
    legacy: true,
  })
  if (value.nameNote !== null) {
    validateClaim(value.nameNote, `${path}.nameNote`, context, errors, {
      legacy: true,
    })
  }
}

function validateReviewedEmptyRelation(
  value: unknown,
  path: string,
  context: ValidationContext,
  errors: string[],
): void {
  const field = validateFieldState(value, path, context, errors)
  if (!field) return
  if (field.status !== "reviewed") {
    errors.push(`${path}.status must be reviewed.`)
  }
  if (!Array.isArray(field.value) || field.value.length !== 0) {
    errors.push(`${path}.value must be the reviewed empty array.`)
  }
  requireApprovedReviewRoles(
    validateStringArray(field.reviewIds, `${path}.reviewIds`, errors),
    ["editorial", "methodology"],
    path.slice(path.indexOf("content.") + "content.".length),
    path,
    context,
    errors,
    true,
  )
}

function validateUnresolvedField(
  value: unknown,
  path: string,
  errors: string[],
  allowed: Array<"research-required" | "withheld">,
): void {
  if (!isRecord(value) || !allowed.includes(value.status as never)) {
    errors.push(`${path}.status must be ${allowed.join(" or ")}.`)
    return
  }
  if (value.value !== null) errors.push(`${path}.value must be null.`)
  if (!Array.isArray(value.reviewIds)) errors.push(`${path}.reviewIds must be an array.`)
  if (value.qualification !== null && !isNonEmptyString(value.qualification)) {
    errors.push(`${path}.qualification must be a string or null.`)
  }
}

function validatePublishedCore(
  content: Record<string, unknown>,
  path: string,
  errors: string[],
): void {
  for (const key of [
    "noticesFirst",
    "likelyPolicyInstincts",
    "evidenceThatWouldWeakenFit",
  ]) {
    const field = content[key]
    if (!isRecord(field) || field.status !== "reviewed") {
      errors.push(`${path}.${key} must be reviewed before publication.`)
      continue
    }
    if (
      !Array.isArray(field.value) ||
      field.value.some(
        (claim) => !isRecord(claim) || claim.status !== "reviewed",
      )
    ) {
      errors.push(
        `${path}.${key} claims must be reviewed before publication.`,
      )
    }
  }
  for (const key of [
    "acceptedTradeoff",
    "strongestCaseForReading",
    "strongestObjection",
    "commonFailureMode",
  ]) {
    if (!isRecord(content[key]) || content[key].status !== "reviewed") {
      errors.push(`${path}.${key} must be reviewed before publication.`)
    }
  }
  if (Array.isArray(content.normativeVariants)) {
    content.normativeVariants.forEach((variant, index) => {
      if (
        !isRecord(variant) ||
        !isRecord(variant.interpretation) ||
        variant.interpretation.status !== "reviewed"
      ) {
        errors.push(
          `${path}.normativeVariants[${index}] must be reviewed before publication.`,
        )
      }
    })
  }
}

function validateEvidenceRecord(
  value: unknown,
  path: string,
  errors: string[],
): void {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`)
    return
  }
  if (!isPureCode(value.code)) errors.push(`${path}.code is invalid.`)
  validateStringArray(value.legacySourceIds, `${path}.legacySourceIds`, errors)
  validateStringArray(value.researchSourceIds, `${path}.researchSourceIds`, errors)
  if (!Array.isArray(value.unresolvedFields)) {
    errors.push(`${path}.unresolvedFields must be an array.`)
    return
  }
  value.unresolvedFields.forEach((field, index) => {
    const fieldPath = `${path}.unresolvedFields[${index}]`
    if (
      !isRecord(field) ||
      !isNonEmptyString(field.field) ||
      !isOneOf(field.status, ["research-required", "withheld"]) ||
      !isNonEmptyString(field.reason)
    ) {
      errors.push(`${fieldPath} is invalid.`)
    }
  })
}

function validateSourceRecord(
  value: unknown,
  path: string,
  errors: string[],
): void {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`)
    return
  }
  for (const key of ["id", "title"] as const) {
    if (!isNonEmptyString(value[key])) errors.push(`${path}.${key} is required.`)
  }
  for (const key of [
    "authorOrInstitution",
    "publisher",
    "publishedAt",
    "accessedAt",
  ] as const) {
    if (value[key] !== null && !isNonEmptyString(value[key])) {
      errors.push(`${path}.${key} must be a string or null.`)
    }
  }
  if (!isHttps(value.href)) errors.push(`${path}.href must be HTTPS.`)
  if (
    typeof value.href === "string" &&
    /(?:^|\.)wikipedia\.org$/iu.test(safeHostname(value.href))
  ) {
    errors.push(`${path}.href cannot use Wikipedia as substantive evidence.`)
  }
  if (!isOneOf(value.sourceKind, [
    "primary",
    "scholarly",
    "reference",
    "current-official",
  ])) {
    errors.push(`${path}.sourceKind is invalid.`)
  }
  if (!isOneOf(value.metadataStatus, [
    "complete",
    "legacy-minimal",
    "research-required",
  ])) {
    errors.push(`${path}.metadataStatus is invalid.`)
  }
  if (!isOneOf(value.status, ["reviewed", "provisional", "superseded"])) {
    errors.push(`${path}.status is invalid.`)
  }
  if (value.metadataStatus === "legacy-minimal") {
    for (const key of [
      "authorOrInstitution",
      "publisher",
      "publishedAt",
      "accessedAt",
    ] as const) {
      if (value[key] !== null) {
        errors.push(`${path}.${key} must remain null for legacy-minimal metadata.`)
      }
    }
  }
}

function validateReviewRecord(
  value: unknown,
  path: string,
  contentVersion: string,
  evidenceCatalogVersion: string,
  errors: string[],
): void {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`)
    return
  }
  for (const key of ["id", "reviewerId", "reviewedAt", "note"] as const) {
    if (!isNonEmptyString(value[key])) errors.push(`${path}.${key} is required.`)
  }
  const subjectIds = validateStringArray(
    value.subjectIds,
    `${path}.subjectIds`,
    errors,
  )
  if (subjectIds.length === 0) errors.push(`${path}.subjectIds cannot be empty.`)
  if (value.contentVersion !== null && value.contentVersion !== contentVersion) {
    errors.push(`${path}.contentVersion does not match the evidence root.`)
  }
  if (value.evidenceCatalogVersion !== evidenceCatalogVersion) {
    errors.push(`${path}.evidenceCatalogVersion does not match the evidence root.`)
  }
  if (!isOneOf(value.reviewerRole, [
    "editorial",
    "research",
    "methodology",
    "localization",
  ])) {
    errors.push(`${path}.reviewerRole is invalid.`)
  }
  if (!isOneOf(value.outcome, ["approved", "changes-required", "blocked"])) {
    errors.push(`${path}.outcome is invalid.`)
  }
}

function validateEightRecordCoverage(
  records: unknown[],
  path: string,
  readCode: (record: unknown) => unknown,
  errors: string[],
): void {
  const codes = records.map(readCode).filter(isPureCode)
  const uniqueCodes = new Set(codes)
  if (records.length !== 8 || codes.length !== 8 || uniqueCodes.size !== 8) {
    errors.push(`${path} must contain exactly eight unique pure codes.`)
    return
  }
  for (const lens of ["P", "R", "M", "S"] as const) {
    for (const posture of ["+", "-"] as const) {
      if (!uniqueCodes.has(`${lens}${posture}`)) {
        errors.push(`${path} is missing ${lens}${posture}.`)
      }
    }
  }
}

function validateReviewIds(
  value: unknown,
  path: string,
  context: ValidationContext,
  errors: string[],
  requireOne: boolean,
): string[] {
  const ids = validateStringArray(value, path, errors)
  if (requireOne && ids.length === 0) errors.push(`${path} cannot be empty.`)
  for (const id of ids) {
    const review = context.reviews.get(id)
    if (!review) {
      errors.push(`${path} does not resolve ${id}.`)
    } else if (requireOne && review.outcome !== "approved") {
      errors.push(`${path} references a review that is not approved: ${id}.`)
    }
  }
  return ids
}

function requireApprovedReviewRoles(
  reviewIds: string[],
  roles: ReviewRecord["reviewerRole"][],
  subjectId: string,
  path: string,
  context: ValidationContext,
  errors: string[],
  subjectMayEndWith = false,
): void {
  for (const role of roles) {
    const accepted = reviewIds.some((id) => {
      const review = context.reviews.get(id)
      if (!review || review.reviewerRole !== role || review.outcome !== "approved") {
        return false
      }
      if (review.contentVersion !== context.contentVersion) return false
      return review.subjectIds.some((candidate) =>
        subjectMayEndWith
          ? candidate.endsWith(subjectId)
          : candidate === subjectId,
      )
    })
    if (!accepted) {
      errors.push(`${path} requires an approved ${role} review.`)
    }
  }
}

function requireReviewedSource(
  sourceIds: string[],
  kind: SourceRecord["sourceKind"] | SourceRecord["sourceKind"][] | null,
  path: string,
  context: ValidationContext,
  errors: string[],
): void {
  const kinds = kind === null ? null : Array.isArray(kind) ? kind : [kind]
  const accepted = sourceIds.some((sourceId) => {
    const source = context.sources.get(sourceId)
    return Boolean(
      source &&
      source.status === "reviewed" &&
      (!kinds || kinds.includes(source.sourceKind)),
    )
  })
  if (!accepted) {
    errors.push(`${path} requires a reviewed${kinds ? ` ${kinds.join("/")}` : ""} source.`)
  }
}

function readLegacyClaim(
  value: unknown,
  sources: Map<string, SourceRecord>,
): { text: string; sourceIds: string[] } | null {
  if (
    !isRecord(value) ||
    value.status !== "partial" ||
    value.qualification !== LEGACY_COMPARISON_QUALIFICATION ||
    !isRecord(value.value) ||
    value.value.kind !== "authored-interpretation" ||
    !isNonEmptyString(value.value.text) ||
    !Array.isArray(value.value.sourceIds) ||
    value.value.sourceIds.length === 0 ||
    value.value.sourceIds.some(
      (sourceId) =>
        typeof sourceId !== "string" ||
        !sources.has(sourceId) ||
        sources.get(sourceId)?.status !== "provisional",
    )
  ) {
    return null
  }
  return {
    text: value.value.text,
    sourceIds: value.value.sourceIds as string[],
  }
}

function isValidSourceRecord(value: unknown): value is SourceRecord {
  const errors: string[] = []
  validateSourceRecord(value, "source", errors)
  return errors.length === 0
}

function visitStatusObjects(
  value: unknown,
  onStatus: (status: ContentStatus) => void,
): void {
  if (Array.isArray(value)) {
    value.forEach((item) => visitStatusObjects(item, onStatus))
    return
  }
  if (!isRecord(value)) return
  if (isContentStatus(value.status)) onStatus(value.status)
  Object.values(value).forEach((item) => visitStatusObjects(item, onStatus))
}

function validateStringArray(
  value: unknown,
  path: string,
  errors: string[],
): string[] {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array.`)
    return []
  }
  const strings = value.filter(isNonEmptyString)
  if (strings.length !== value.length) {
    errors.push(`${path} must contain only non-empty strings.`)
  }
  if (new Set(strings).size !== strings.length) {
    errors.push(`${path} cannot contain duplicates.`)
  }
  return strings
}

function readRootString(value: unknown, key: string): string {
  return isRecord(value) && isNonEmptyString(value[key]) ? value[key] : ""
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function isContentStatus(value: unknown): value is ContentStatus {
  return isOneOf(value, [
    "reviewed",
    "partial",
    "research-required",
    "withheld",
  ])
}

function isPureCode(value: unknown): value is Archetype["code"] {
  return typeof value === "string" && /^[PRMS][+-]$/u.test(value)
}

function isFamilyKey(value: unknown): value is FamilyKey {
  return isOneOf(value, [
    "realist",
    "institutionalist",
    "constructivist",
    "criticalPoliticalEconomy",
  ])
}

function familyLens(value: FamilyKey): LensCode {
  switch (value) {
    case "realist": return "P"
    case "institutionalist": return "R"
    case "constructivist": return "M"
    case "criticalPoliticalEconomy": return "S"
  }
}

function expectedSlug(code: Archetype["code"]): ArchetypeSlug {
  return `${code[0].toLowerCase() as Lowercase<LensCode>}-${code[1] === "+" ? "plus" : "minus"}`
}

function isHttps(value: unknown): value is string {
  if (typeof value !== "string") return false
  try {
    return new URL(value).protocol === "https:"
  } catch {
    return false
  }
}

function safeHostname(value: string): string {
  try {
    return new URL(value).hostname
  } catch {
    return ""
  }
}

function isNullableNumber(value: unknown): boolean {
  return value === null || typeof value === "number"
}

function isOneOf<const T extends readonly unknown[]>(
  value: unknown,
  allowed: T,
): value is T[number] {
  return allowed.includes(value)
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}
