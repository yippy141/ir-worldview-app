import { getAtlasLitePattern } from "@/lib/atlas-lite"
import {
  CURRENT_CASE_CATEGORIES,
  CURRENT_CASE_CHALLENGE_RESPONSE_IDS,
  CURRENT_CASE_LAUNCH_ROLES,
  CURRENT_CASE_SCHEMA_VERSION,
  CURRENT_CASE_SOURCE_KINDS,
  type CurrentCase,
  type CurrentCaseOption,
} from "@/lib/current-cases/types"
import { isReasoningTagId } from "@/lib/current-cases/reasoning-tags"

export type CurrentCaseValidationCode =
  | "record.invalid"
  | "schema.invalid"
  | "field.missing"
  | "field.invalid"
  | "date.invalid"
  | "briefing.length"
  | "claim.count"
  | "claim.duplicate"
  | "claim.uncovered"
  | "source.count"
  | "source.duplicate"
  | "source.url"
  | "source.claim-unknown"
  | "source.claim-empty"
  | "option.count"
  | "option.duplicate-id"
  | "option.duplicate-label"
  | "option.duplicate-logic"
  | "option.duplicate-tradeoff"
  | "reading.count"
  | "reading.duplicate"
  | "reading.profile-unknown"
  | "reading.option-unknown"
  | "reading.option-narrow"
  | "challenge.options"
  | "route.invalid"
  | "review.incomplete"
  | "publication.status"

export type CurrentCaseValidationError = {
  code: CurrentCaseValidationCode
  path: string
  message: string
}

export type CurrentCaseValidationResult =
  | { ok: true; errors: readonly [] }
  | { ok: false; errors: readonly CurrentCaseValidationError[] }

export type CurrentCaseOptionDifferentiationIssue = Pick<
  CurrentCaseValidationError,
  "code" | "path" | "message"
>

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function isStringArray(value: unknown, minimum = 0): value is string[] {
  return (
    Array.isArray(value) &&
    value.length >= minimum &&
    value.every((item) => isNonEmptyString(item))
  )
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value
}

function normalizeDifferentiator(value: string) {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ")
}

export function countCurrentCaseWords(value: string) {
  const words = value.trim().match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)
  return words?.length ?? 0
}

export function getCurrentCaseOptionDifferentiationIssues(
  options: readonly CurrentCaseOption[],
): CurrentCaseOptionDifferentiationIssue[] {
  const issues: CurrentCaseOptionDifferentiationIssue[] = []
  const ids = new Set<string>()
  const labels = new Set<string>()
  const logics = new Set<string>()
  const tradeoffs = new Set<string>()

  options.forEach((option, index) => {
    const path = `decision.options[${index}]`
    const id = normalizeDifferentiator(option.id)
    const label = normalizeDifferentiator(option.label)
    const logic = normalizeDifferentiator(option.logic)
    const tradeoff = normalizeDifferentiator(option.acceptedTradeoff)

    if (ids.has(id)) {
      issues.push({
        code: "option.duplicate-id",
        path: `${path}.id`,
        message: "Decision option IDs must be unique.",
      })
    }
    if (labels.has(label)) {
      issues.push({
        code: "option.duplicate-label",
        path: `${path}.label`,
        message: "Decision options must make materially different choices.",
      })
    }
    if (logics.has(logic)) {
      issues.push({
        code: "option.duplicate-logic",
        path: `${path}.logic`,
        message: "Each option must represent a distinct decision logic.",
      })
    }
    if (tradeoffs.has(tradeoff)) {
      issues.push({
        code: "option.duplicate-tradeoff",
        path: `${path}.acceptedTradeoff`,
        message: "Each option must accept a distinct tradeoff.",
      })
    }

    ids.add(id)
    labels.add(label)
    logics.add(logic)
    tradeoffs.add(tradeoff)
  })

  return issues
}

export function hasDifferentiatedCurrentCaseOptions(
  options: readonly CurrentCaseOption[],
) {
  return (
    options.length >= 3 &&
    options.length <= 4 &&
    getCurrentCaseOptionDifferentiationIssues(options).length === 0
  )
}

export function validateCurrentCaseForPublication(
  value: unknown,
): CurrentCaseValidationResult {
  const errors: CurrentCaseValidationError[] = []
  const add = (
    code: CurrentCaseValidationCode,
    path: string,
    message: string,
  ) => errors.push({ code, path, message })

  if (!isRecord(value)) {
    return {
      ok: false,
      errors: [{ code: "record.invalid", path: "case", message: "Case must be an object." }],
    }
  }

  if (value.schemaVersion !== CURRENT_CASE_SCHEMA_VERSION) {
    add("schema.invalid", "schemaVersion", "Current Case schemaVersion must be 1.")
  }
  for (const field of ["id", "slug", "title", "dek", "briefing", "editorialMemo"] as const) {
    if (!isNonEmptyString(value[field])) {
      add("field.missing", field, `${field} is required.`)
    }
  }
  if (typeof value.slug === "string" && !SLUG.test(value.slug)) {
    add("field.invalid", "slug", "Slug must use lowercase words separated by hyphens.")
  }
  if (!Number.isInteger(value.version) || Number(value.version) < 1) {
    add("field.invalid", "version", "Version must be a positive integer.")
  }
  if (value.publicationStatus !== "published") {
    add(
      "publication.status",
      "publicationStatus",
      "Only records explicitly marked published may enter the public catalog.",
    )
  }
  if (!CURRENT_CASE_LAUNCH_ROLES.includes(value.launchRole as never)) {
    add("field.invalid", "launchRole", "Launch role must be launch or archive.")
  }
  if (!CURRENT_CASE_CATEGORIES.includes(value.category as never)) {
    add("field.invalid", "category", "Category is outside the Current Case vocabulary.")
  }
  if (!isIsoDate(value.publishedAt)) {
    add("date.invalid", "publishedAt", "Published cases require an ISO publication date.")
  }
  if (!isIsoDate(value.updatedAt)) {
    add("date.invalid", "updatedAt", "updatedAt must be an ISO date.")
  }

  if (!isRecord(value.evidenceWindow)) {
    add("field.invalid", "evidenceWindow", "Evidence window must be an object.")
  } else {
    const { start, end } = value.evidenceWindow
    if (!isIsoDate(start)) add("date.invalid", "evidenceWindow.start", "Start must be an ISO date.")
    if (!isIsoDate(end)) add("date.invalid", "evidenceWindow.end", "End must be an ISO date.")
    if (isIsoDate(start) && isIsoDate(end) && start > end) {
      add("date.invalid", "evidenceWindow", "Evidence window cannot end before it starts.")
    }
  }

  if (typeof value.briefing === "string") {
    const words = countCurrentCaseWords(value.briefing)
    if (words < 250 || words > 450) {
      add("briefing.length", "briefing", "The public briefing must contain 250–450 words.")
    }
  }
  if (typeof value.editorialMemo === "string") {
    const words = countCurrentCaseWords(value.editorialMemo)
    if (words < 120 || words > 180) {
      add(
        "field.invalid",
        "editorialMemo",
        "The internal editorial memo must stay close to the 150-word commission.",
      )
    }
  }

  if (!isStringArray(value.actors, 2)) {
    add("field.invalid", "actors", "At least two relevant actors are required.")
  }
  validatePerspectiveContext(value.perspectives, add)

  const claimIds = validateClaims(value.factualClaims, add)
  const sourceIds = validateSources(value.sources, claimIds, add)
  validateClaimCoverage(value.factualClaims, value.sources, add)

  if (!isStringArray(value.knownUncertainties, 1)) {
    add(
      "field.invalid",
      "knownUncertainties",
      "At least one known uncertainty must be stated.",
    )
  }
  if (
    !isReasoningTagArray(value.reasoningTags) ||
    value.reasoningTags.length > 8 ||
    new Set(value.reasoningTags.map((tag) => tag.id)).size !== value.reasoningTags.length ||
    new Set(value.reasoningTags.map((tag) => normalizeDifferentiator(tag.label))).size !==
      value.reasoningTags.length
  ) {
    add(
      "field.invalid",
      "reasoningTags",
      "Published cases require 3–8 distinct reasoning tags.",
    )
  }

  const optionIds = validateDecision(value.decision, add)
  validateWorldviewReadings(value.worldviewReadings, optionIds, add)
  validateChallenge(value.assumptionChallenge, add)
  validateNextRoutes(value.nextRoutes, add)

  if (!isRecord(value.disputes)) {
    add("field.invalid", "disputes", "Factual and interpretive dispute lists are required.")
  } else {
    if (!isStringArray(value.disputes.factual)) {
      add("field.invalid", "disputes.factual", "Factual disputes must be an explicit list.")
    }
    if (!isStringArray(value.disputes.interpretive)) {
      add(
        "field.invalid",
        "disputes.interpretive",
        "Interpretive disputes must be an explicit list.",
      )
    }
  }

  validateStringPairList(value.sensitiveWording, "term", "guidance", "sensitiveWording", add)
  validateStringPairList(value.correctionRisks, "risk", "mitigation", "correctionRisks", add)
  validateEditorialReview(value.editorialReview, add)
  validateRevisit(value.revisit, sourceIds, add)

  return errors.length === 0 ? { ok: true, errors: [] } : { ok: false, errors }
}

function isReasoningTagArray(
  value: unknown,
): value is Array<{ id: string; label: string }> {
  return (
    Array.isArray(value) &&
    value.length >= 3 &&
    value.every(
      (tag) =>
        isRecord(tag) &&
        isReasoningTagId(tag.id) &&
        isNonEmptyString(tag.label),
    )
  )
}

/** Publication validation is the only public type guard: invalid records stay private. */
export function isCurrentCasePublishable(value: unknown): value is CurrentCase {
  return validateCurrentCaseForPublication(value).ok
}

export const validateCurrentCase = validateCurrentCaseForPublication

function validatePerspectiveContext(
  value: unknown,
  add: (code: CurrentCaseValidationCode, path: string, message: string) => void,
) {
  if (!isRecord(value) || !isNonEmptyString(value.global)) {
    add("field.invalid", "perspectives.global", "A global perspective is required.")
  }
  const counterparties = isRecord(value) ? value.counterparties : null
  if (
    !Array.isArray(counterparties) ||
    counterparties.length === 0 ||
    counterparties.some(
      (item) => !isRecord(item) || !isNonEmptyString(item.actor) || !isNonEmptyString(item.perspective),
    )
  ) {
    add(
      "field.invalid",
      "perspectives.counterparties",
      "At least one named counterparty perspective is required.",
    )
  }
}

function validateClaims(
  value: unknown,
  add: (code: CurrentCaseValidationCode, path: string, message: string) => void,
) {
  const ids = new Set<string>()
  if (!Array.isArray(value) || value.length < 4 || value.length > 8) {
    add("claim.count", "factualClaims", "Published cases require 4–8 factual claims.")
  }
  if (!Array.isArray(value)) return ids

  value.forEach((claim, index) => {
    if (!isRecord(claim) || !isNonEmptyString(claim.id) || !isNonEmptyString(claim.text)) {
      add("field.invalid", `factualClaims[${index}]`, "Claims require an ID and factual text.")
      return
    }
    if (ids.has(claim.id)) {
      add("claim.duplicate", `factualClaims[${index}].id`, "Claim IDs must be unique.")
    }
    ids.add(claim.id)
  })
  return ids
}

function validateSources(
  value: unknown,
  claimIds: Set<string>,
  add: (code: CurrentCaseValidationCode, path: string, message: string) => void,
) {
  const ids = new Set<string>()
  if (!Array.isArray(value) || value.length === 0) {
    add("source.count", "sources", "Published cases require a source ledger.")
  }
  if (!Array.isArray(value)) return ids

  value.forEach((source, index) => {
    const path = `sources[${index}]`
    if (!isRecord(source)) {
      add("field.invalid", path, "Source records must be objects.")
      return
    }
    for (const field of ["id", "title", "publisher"] as const) {
      if (!isNonEmptyString(source[field])) {
        add("field.missing", `${path}.${field}`, `Source ${field} is required.`)
      }
    }
    if (typeof source.id === "string") {
      if (ids.has(source.id)) add("source.duplicate", `${path}.id`, "Source IDs must be unique.")
      ids.add(source.id)
    }
    if (source.publishedAt !== null && !isIsoDate(source.publishedAt)) {
      add("date.invalid", `${path}.publishedAt`, "Source date must be ISO or null.")
    }
    if (!isIsoDate(source.accessedAt)) {
      add("date.invalid", `${path}.accessedAt`, "Source access date must be ISO.")
    }
    if (!CURRENT_CASE_SOURCE_KINDS.includes(source.kind as never)) {
      add("field.invalid", `${path}.kind`, "Source kind is outside the hierarchy.")
    }
    try {
      const url = new URL(String(source.url))
      if (url.protocol !== "https:") throw new Error("HTTPS required")
    } catch {
      add("source.url", `${path}.url`, "Source URL must be a direct HTTPS URL.")
    }
    if (!isStringArray(source.claimIds, 1)) {
      add("source.claim-empty", `${path}.claimIds`, "Every source must declare claim coverage.")
    } else {
      for (const claimId of source.claimIds) {
        if (!claimIds.has(claimId)) {
          add(
            "source.claim-unknown",
            `${path}.claimIds`,
            `Source references unknown claim ${claimId}.`,
          )
        }
      }
    }
  })
  return ids
}

function validateClaimCoverage(
  claims: unknown,
  sources: unknown,
  add: (code: CurrentCaseValidationCode, path: string, message: string) => void,
) {
  if (!Array.isArray(claims) || !Array.isArray(sources)) return
  const covered = new Set(
    sources.flatMap((source) =>
      isRecord(source) && Array.isArray(source.claimIds)
        ? source.claimIds.filter((id): id is string => typeof id === "string")
        : [],
    ),
  )
  claims.forEach((claim, index) => {
    if (isRecord(claim) && typeof claim.id === "string" && !covered.has(claim.id)) {
      add(
        "claim.uncovered",
        `factualClaims[${index}].id`,
        `Factual claim ${claim.id} has no source coverage.`,
      )
    }
  })
}

function validateDecision(
  value: unknown,
  add: (code: CurrentCaseValidationCode, path: string, message: string) => void,
) {
  const optionIds = new Set<string>()
  if (!isRecord(value) || !isNonEmptyString(value.prompt)) {
    add("field.invalid", "decision.prompt", "A decision or threshold prompt is required.")
  }
  const options = isRecord(value) ? value.options : null
  if (!Array.isArray(options) || options.length < 3 || options.length > 4) {
    add("option.count", "decision.options", "Published cases require 3–4 decision options.")
    return optionIds
  }

  const typedOptions: CurrentCaseOption[] = []
  options.forEach((option, index) => {
    if (
      !isRecord(option) ||
      !isNonEmptyString(option.id) ||
      !isNonEmptyString(option.label) ||
      !isNonEmptyString(option.logic) ||
      !isNonEmptyString(option.acceptedTradeoff)
    ) {
      add(
        "field.invalid",
        `decision.options[${index}]`,
        "Each option requires an ID, choice, logic, and accepted tradeoff.",
      )
      return
    }
    optionIds.add(option.id)
    typedOptions.push(option as CurrentCaseOption)
  })
  getCurrentCaseOptionDifferentiationIssues(typedOptions).forEach((issue) =>
    add(issue.code, issue.path, issue.message),
  )
  return optionIds
}

function validateWorldviewReadings(
  value: unknown,
  optionIds: Set<string>,
  add: (code: CurrentCaseValidationCode, path: string, message: string) => void,
) {
  if (!Array.isArray(value) || value.length < 3 || value.length > 4) {
    add("reading.count", "worldviewReadings", "Published cases require 3–4 relevant readings.")
    return
  }
  const profileIds = new Set<string>()
  const recommendedOptions = new Set<string>()
  value.forEach((reading, index) => {
    const path = `worldviewReadings[${index}]`
    if (!isRecord(reading)) {
      add("field.invalid", path, "Worldview readings must be objects.")
      return
    }
    for (const field of [
      "profileId",
      "noticesFirst",
      "interpretation",
      "recommendation",
      "strongestObjection",
      "updateCondition",
    ] as const) {
      if (!isNonEmptyString(reading[field])) {
        add("field.missing", `${path}.${field}`, `Reading ${field} is required.`)
      }
    }
    if (typeof reading.profileId === "string") {
      if (profileIds.has(reading.profileId)) {
        add("reading.duplicate", `${path}.profileId`, "Profile readings must be unique.")
      }
      profileIds.add(reading.profileId)
      if (!getAtlasLitePattern(reading.profileId)) {
        add(
          "reading.profile-unknown",
          `${path}.profileId`,
          "Reading must resolve through a stable Atlas profile ID.",
        )
      }
    }
    if (!isStringArray(reading.recommendedOptionIds, 1)) {
      add("field.invalid", `${path}.recommendedOptionIds`, "A reading must connect to an option.")
    } else {
      for (const optionId of reading.recommendedOptionIds) {
        recommendedOptions.add(optionId)
        if (!optionIds.has(optionId)) {
          add(
            "reading.option-unknown",
            `${path}.recommendedOptionIds`,
            `Reading references unknown option ${optionId}.`,
          )
        }
      }
    }
  })

  if (recommendedOptions.size < 2) {
    add(
      "reading.option-narrow",
      "worldviewReadings",
      "The selected readings must illuminate at least two different courses.",
    )
  }
}

function validateChallenge(
  value: unknown,
  add: (code: CurrentCaseValidationCode, path: string, message: string) => void,
) {
  if (
    !isRecord(value) ||
    !isNonEmptyString(value.newInformation) ||
    !isNonEmptyString(value.prompt) ||
    !Array.isArray(value.options)
  ) {
    add("field.invalid", "assumptionChallenge", "A complete assumption challenge is required.")
    return
  }
  const ids = value.options.map((option) =>
    isRecord(option) && typeof option.id === "string" ? option.id : "",
  )
  const labelsValid = value.options.every(
    (option) => isRecord(option) && isNonEmptyString(option.label),
  )
  if (
    !labelsValid ||
    ids.length !== CURRENT_CASE_CHALLENGE_RESPONSE_IDS.length ||
    new Set(ids).size !== ids.length ||
    CURRENT_CASE_CHALLENGE_RESPONSE_IDS.some((id) => !ids.includes(id))
  ) {
    add(
      "challenge.options",
      "assumptionChallenge.options",
      "The four stable assumption-challenge responses are required exactly once.",
    )
  }
}

function validateNextRoutes(
  value: unknown,
  add: (code: CurrentCaseValidationCode, path: string, message: string) => void,
) {
  if (!Array.isArray(value) || value.length === 0) {
    add("route.invalid", "nextRoutes", "At least one next-route recommendation is required.")
    return
  }
  value.forEach((route, index) => {
    if (
      !isRecord(route) ||
      !isNonEmptyString(route.href) ||
      !String(route.href).startsWith("/") ||
      String(route.href).startsWith("//") ||
      !isNonEmptyString(route.label) ||
      !isNonEmptyString(route.reason)
    ) {
      add(
        "route.invalid",
        `nextRoutes[${index}]`,
        "Next routes require a safe internal path, label, and rationale.",
      )
    }
  })
}

function validateStringPairList(
  value: unknown,
  first: string,
  second: string,
  path: string,
  add: (code: CurrentCaseValidationCode, path: string, message: string) => void,
) {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some(
      (item) => !isRecord(item) || !isNonEmptyString(item[first]) || !isNonEmptyString(item[second]),
    )
  ) {
    add("field.invalid", path, `${path} must contain explicit ${first} and ${second} records.`)
  }
}

function validateEditorialReview(
  value: unknown,
  add: (code: CurrentCaseValidationCode, path: string, message: string) => void,
) {
  if (!isRecord(value)) {
    add("review.incomplete", "editorialReview", "Published cases require editorial review.")
    return
  }
  const datesValid = [
    value.researchReviewedAt,
    value.sourceCheckedAt,
    value.copyReviewedAt,
    value.approvedAt,
  ].every(isIsoDate)
  if (!datesValid || !isStringArray(value.reviewerIds, 2)) {
    add(
      "review.incomplete",
      "editorialReview",
      "Research, source, copy, and approval dates plus two reviewers are required.",
    )
  }
}

function validateRevisit(
  value: unknown,
  sourceIds: Set<string>,
  add: (code: CurrentCaseValidationCode, path: string, message: string) => void,
) {
  if (value === undefined) return
  if (!isRecord(value)) {
    add("field.invalid", "revisit", "Revisit must be a complete object when present.")
    return
  }
  if (!isIsoDate(value.publishedAt) || !isIsoDate(value.evidenceWindowEnd)) {
    add("date.invalid", "revisit", "Revisit publication and evidence dates must be ISO dates.")
  }
  if (!isNonEmptyString(value.whatHappenedNext)) {
    add("field.missing", "revisit.whatHappenedNext", "Revisit outcome text is required.")
  }
  for (const field of [
    "supportedAssumptions",
    "weakenedAssumptions",
    "unresolvedQuestions",
  ] as const) {
    if (!isStringArray(value[field])) {
      add("field.invalid", `revisit.${field}`, `Revisit ${field} must be an explicit list.`)
    }
  }
  if (!isStringArray(value.sourceIds, 1)) {
    add("field.invalid", "revisit.sourceIds", "Revisit source coverage is required.")
  } else {
    for (const sourceId of value.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        add("field.invalid", "revisit.sourceIds", `Unknown revisit source ${sourceId}.`)
      }
    }
  }
}
