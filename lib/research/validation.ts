export const RESEARCH_BODY_LIMIT_BYTES = 64 * 1024
export const RESEARCH_DELETE_BODY_LIMIT_BYTES = 16 * 1024
export const RESEARCH_EVENT_BODY_LIMIT_BYTES = 12 * 1024

export const RESEARCH_CONSENT_VERSION = "v13-research-consent-2026-05-15"
export const DEFAULT_SCORING_VERSION = "v13-current"

const allowedInstruments = new Set([
  "foundation",
  "ai-governance",
  "module-security",
  "module-technology",
  "profile",
])

const submitTopLevelKeys = new Set([
  "respondentId",
  "sessionId",
  "instrument",
  "instrumentVersion",
  "scoringVersion",
  "consentVersion",
  "startedAt",
  "completedAt",
  "answers",
  "derivedResult",
  "contactEmail",
  "source",
  "mode",
  "appVersion",
])

const answerKeys = new Set([
  "questionId",
  "primaryAnswer",
  "secondaryAnswer",
  "rawNumeric",
  "rawJson",
])

const derivedResultKeys = new Set([
  "topLabel",
  "runnerUp",
  "profileState",
  "familyScores",
  "archetypeScores",
  "dimensionScores",
  "axisScores",
  "modifiers",
  "summary",
])

const deleteKeys = new Set([
  "respondentId",
  "sessionId",
  "contactEmail",
  "reason",
  "consentVersion",
])

const eventKeys = new Set([
  "eventName",
  "respondentId",
  "sessionId",
  "instrument",
  "route",
  "appVersion",
  "meta",
])

const forbiddenAnswerContactKeys = new Set([
  "email",
  "contact",
  "contactemail",
  "contact_email",
  "contactinfo",
  "contact_info",
  "phone",
  "phonenumber",
  "phone_number",
  "fullname",
  "full_name",
])

export type ResearchAnswerRecord = {
  questionId: string
  primaryAnswer?: string
  secondaryAnswer?: string
  rawNumeric?: number
  rawJson?: JsonRecord
}

export type ResearchSubmissionPayload = {
  respondentId: string
  sessionId: string
  instrument: string
  instrumentVersion: string
  scoringVersion: string
  consentVersion: string
  startedAt?: string
  completedAt?: string
  answers: ResearchAnswerRecord[]
  derivedResult?: {
    topLabel?: string
    runnerUp?: string
    profileState?: string
    familyScores?: JsonRecord
    archetypeScores?: JsonRecord
    dimensionScores?: JsonRecord
    axisScores?: JsonRecord
    modifiers?: JsonRecord
    summary?: string
  }
  contactEmail?: string
  source?: string
  mode?: string
  appVersion?: string
}

export type ResearchDeletionPayload = {
  respondentId?: string
  sessionId?: string
  contactEmail?: string
  reason?: string
  consentVersion?: string
}

export type ResearchEventPayload = {
  eventName: string
  respondentId?: string
  sessionId?: string
  instrument?: string
  route?: string
  appVersion?: string
  meta?: JsonRecord
}

type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }
type JsonRecord = { [key: string]: JsonValue }

export type ValidationResult<T> =
  | { ok: true; payload: T }
  | { ok: false; status: number; error: string }

type FieldResult<T> = { ok: true; value: T } | { ok: false; status: number; error: string }

export async function readLimitedJson<T>(
  request: Request,
  limitBytes: number,
  validate: (value: unknown) => ValidationResult<T>,
): Promise<ValidationResult<T>> {
  const contentLength = request.headers.get("content-length")
  if (contentLength && Number(contentLength) > limitBytes) {
    return {
      ok: false,
      status: 413,
      error: `Payload exceeds ${limitBytes} bytes.`,
    }
  }

  const body = await request.text()
  if (new TextEncoder().encode(body).byteLength > limitBytes) {
    return {
      ok: false,
      status: 413,
      error: `Payload exceeds ${limitBytes} bytes.`,
    }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(body)
  } catch {
    return { ok: false, status: 400, error: "Request body must be valid JSON." }
  }

  return validate(parsed)
}

export function validateResearchSubmission(value: unknown): ValidationResult<ResearchSubmissionPayload> {
  if (!isRecord(value)) return invalid("Submission must be a JSON object.")
  const unknownKey = firstUnknownKey(value, submitTopLevelKeys)
  if (unknownKey) return invalid(`Unknown field: ${unknownKey}.`)

  const instrument = requiredString(value.instrument, "instrument")
  if (!instrument.ok) return instrument
  if (!allowedInstruments.has(instrument.value)) return invalid("Unknown instrument.")

  const instrumentVersion = requiredString(value.instrumentVersion, "instrumentVersion")
  if (!instrumentVersion.ok) return instrumentVersion
  const scoringVersion = requiredString(value.scoringVersion, "scoringVersion")
  if (!scoringVersion.ok) return scoringVersion
  const consentVersion = optionalString(value.consentVersion, "consentVersion")
  if (!consentVersion.ok) return consentVersion

  if (!Array.isArray(value.answers) || value.answers.length === 0) {
    return invalid("answers must be a non-empty array.")
  }
  if (value.answers.length > 120) return invalid("answers contains too many records.", 413)

  const answers: ResearchAnswerRecord[] = []
  for (const record of value.answers) {
    const normalized = validateAnswerRecord(record)
    if (!normalized.ok) return normalized
    answers.push(normalized.payload)
  }

  const respondentId = optionalId(value.respondentId, "respondentId")
  if (!respondentId.ok) return respondentId
  const sessionId = optionalId(value.sessionId, "sessionId")
  if (!sessionId.ok) return sessionId
  const startedAt = optionalDate(value.startedAt, "startedAt")
  if (!startedAt.ok) return startedAt
  const completedAt = optionalDate(value.completedAt, "completedAt")
  if (!completedAt.ok) return completedAt
  const contactEmail = optionalEmail(value.contactEmail)
  if (!contactEmail.ok) return contactEmail

  const source = optionalShortString(value.source, "source")
  if (!source.ok) return source
  const mode = optionalShortString(value.mode, "mode")
  if (!mode.ok) return mode
  const appVersion = optionalShortString(value.appVersion, "appVersion")
  if (!appVersion.ok) return appVersion

  const derivedResult = validateDerivedResult(value.derivedResult)
  if (!derivedResult.ok) return derivedResult

  return {
    ok: true,
    payload: {
      respondentId: respondentId.value ?? createId(),
      sessionId: sessionId.value ?? createId(),
      instrument: instrument.value,
      instrumentVersion: instrumentVersion.value,
      scoringVersion: scoringVersion.value,
      consentVersion: consentVersion.value ?? RESEARCH_CONSENT_VERSION,
      startedAt: startedAt.value,
      completedAt: completedAt.value,
      answers,
      derivedResult: derivedResult.payload,
      contactEmail: contactEmail.value,
      source: source.value,
      mode: mode.value,
      appVersion: appVersion.value,
    },
  }
}

export function validateResearchDeletion(value: unknown): ValidationResult<ResearchDeletionPayload> {
  if (!isRecord(value)) return invalid("Deletion request must be a JSON object.")
  const unknownKey = firstUnknownKey(value, deleteKeys)
  if (unknownKey) return invalid(`Unknown field: ${unknownKey}.`)

  const respondentId = optionalId(value.respondentId, "respondentId")
  if (!respondentId.ok) return respondentId
  const sessionId = optionalId(value.sessionId, "sessionId")
  if (!sessionId.ok) return sessionId
  const contactEmail = optionalEmail(value.contactEmail)
  if (!contactEmail.ok) return contactEmail
  const reason = optionalShortString(value.reason, "reason")
  if (!reason.ok) return reason
  const consentVersion = optionalString(value.consentVersion, "consentVersion")
  if (!consentVersion.ok) return consentVersion

  if (!respondentId.value && !sessionId.value && !contactEmail.value) {
    return invalid("Provide respondentId, sessionId, or contactEmail for a deletion request.")
  }

  return {
    ok: true,
    payload: {
      respondentId: respondentId.value,
      sessionId: sessionId.value,
      contactEmail: contactEmail.value,
      reason: reason.value,
      consentVersion: consentVersion.value,
    },
  }
}

export function validateResearchEvent(value: unknown): ValidationResult<ResearchEventPayload> {
  if (!isRecord(value)) return invalid("Event must be a JSON object.")
  const unknownKey = firstUnknownKey(value, eventKeys)
  if (unknownKey) return invalid(`Unknown field: ${unknownKey}.`)

  const eventName = requiredString(value.eventName, "eventName")
  if (!eventName.ok) return eventName
  if (!/^[a-z][a-z0-9_.:-]{1,80}$/i.test(eventName.value)) {
    return invalid("eventName must be a short identifier.")
  }

  const respondentId = optionalId(value.respondentId, "respondentId")
  if (!respondentId.ok) return respondentId
  const sessionId = optionalId(value.sessionId, "sessionId")
  if (!sessionId.ok) return sessionId
  const instrument = optionalShortString(value.instrument, "instrument")
  if (!instrument.ok) return instrument
  if (instrument.value && !allowedInstruments.has(instrument.value)) return invalid("Unknown instrument.")
  const route = optionalShortString(value.route, "route")
  if (!route.ok) return route
  const appVersion = optionalShortString(value.appVersion, "appVersion")
  if (!appVersion.ok) return appVersion
  if (value.meta !== undefined && (!isJsonRecord(value.meta) || hasRawAnswerKey(value.meta))) {
    return invalid("Event metadata must not include raw answers.")
  }

  return {
    ok: true,
    payload: {
      eventName: eventName.value,
      respondentId: respondentId.value,
      sessionId: sessionId.value,
      instrument: instrument.value,
      route: route.value,
      appVersion: appVersion.value,
      meta: value.meta,
    },
  }
}

function validateAnswerRecord(value: unknown): ValidationResult<ResearchAnswerRecord> {
  if (!isRecord(value)) return invalid("Each answer must be an object.")
  const unknownKey = firstUnknownKey(value, answerKeys)
  if (unknownKey) return invalid(`Unknown answer field: ${unknownKey}.`)
  if (containsForbiddenContactField(value)) {
    return invalid("Answer records must not contain contact fields.")
  }

  const questionId = requiredString(value.questionId, "questionId")
  if (!questionId.ok) return questionId
  const primaryAnswer = optionalString(value.primaryAnswer, "primaryAnswer")
  if (!primaryAnswer.ok) return primaryAnswer
  const secondaryAnswer = optionalString(value.secondaryAnswer, "secondaryAnswer")
  if (!secondaryAnswer.ok) return secondaryAnswer
  const rawNumeric = optionalNumber(value.rawNumeric, "rawNumeric")
  if (!rawNumeric.ok) return rawNumeric
  if (value.rawJson !== undefined && !isJsonRecord(value.rawJson)) {
    return invalid("rawJson must be a JSON object.")
  }

  return {
    ok: true,
    payload: {
      questionId: questionId.value,
      primaryAnswer: primaryAnswer.value,
      secondaryAnswer: secondaryAnswer.value,
      rawNumeric: rawNumeric.value,
      rawJson: value.rawJson,
    },
  }
}

function validateDerivedResult(value: unknown): ValidationResult<ResearchSubmissionPayload["derivedResult"]> {
  if (value === undefined) return { ok: true, payload: undefined }
  if (!isRecord(value)) return invalid("derivedResult must be an object.")
  const unknownKey = firstUnknownKey(value, derivedResultKeys)
  if (unknownKey) return invalid(`Unknown derivedResult field: ${unknownKey}.`)

  const topLabel = optionalString(value.topLabel, "topLabel")
  if (!topLabel.ok) return topLabel
  const runnerUp = optionalString(value.runnerUp, "runnerUp")
  if (!runnerUp.ok) return runnerUp
  const profileState = optionalString(value.profileState, "profileState")
  if (!profileState.ok) return profileState
  const summary = optionalString(value.summary, "summary")
  if (!summary.ok) return summary

  for (const key of [
    "familyScores",
    "archetypeScores",
    "dimensionScores",
    "axisScores",
    "modifiers",
  ]) {
    if (value[key] !== undefined && !isJsonRecord(value[key])) {
      return invalid(`${key} must be a JSON object.`)
    }
  }

  return {
    ok: true,
    payload: {
      topLabel: topLabel.value,
      runnerUp: runnerUp.value,
      profileState: profileState.value,
      familyScores: value.familyScores as JsonRecord | undefined,
      archetypeScores: value.archetypeScores as JsonRecord | undefined,
      dimensionScores: value.dimensionScores as JsonRecord | undefined,
      axisScores: value.axisScores as JsonRecord | undefined,
      modifiers: value.modifiers as JsonRecord | undefined,
      summary: summary.value,
    },
  }
}

function requiredString(value: unknown, field: string): FieldResult<string> {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > 160) {
    return invalid(`${field} must be a non-empty short string.`)
  }
  return { ok: true, value: value.trim() }
}

function optionalString(value: unknown, field: string): FieldResult<string | undefined> {
  if (value === undefined) return { ok: true, value: undefined }
  if (typeof value !== "string" || value.length > 2000) {
    return invalid(`${field} must be a string.`)
  }
  return { ok: true, value: value.trim() || undefined }
}

function optionalShortString(value: unknown, field: string): FieldResult<string | undefined> {
  if (value === undefined) return { ok: true, value: undefined }
  if (typeof value !== "string" || value.length > 160) {
    return invalid(`${field} must be a short string.`)
  }
  return { ok: true, value: value.trim() || undefined }
}

function optionalNumber(value: unknown, field: string): FieldResult<number | undefined> {
  if (value === undefined) return { ok: true, value: undefined }
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return invalid(`${field} must be a finite number.`)
  }
  return { ok: true, value }
}

function optionalDate(value: unknown, field: string): FieldResult<string | undefined> {
  if (value === undefined) return { ok: true, value: undefined }
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    return invalid(`${field} must be an ISO-like date string.`)
  }
  return { ok: true, value }
}

function optionalEmail(value: unknown): FieldResult<string | undefined> {
  if (value === undefined) return { ok: true, value: undefined }
  if (
    typeof value !== "string" ||
    value.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  ) {
    return invalid("contactEmail must be a valid email address.")
  }
  return { ok: true, value: value.trim().toLowerCase() }
}

function optionalId(value: unknown, field: string): FieldResult<string | undefined> {
  if (value === undefined) return { ok: true, value: undefined }
  if (typeof value !== "string") {
    return invalid(`${field} must be a stable opaque identifier.`)
  }
  const trimmed = value.trim()
  if (!/^[a-zA-Z0-9_-]{8,80}$/.test(trimmed)) {
    return invalid(`${field} must be a stable opaque identifier.`)
  }
  return { ok: true, value: trimmed }
}

function createId() {
  return crypto.randomUUID()
}

function firstUnknownKey(record: Record<string, unknown>, allowedKeys: Set<string>) {
  return Object.keys(record).find((key) => !allowedKeys.has(key))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isJsonRecord(value: unknown): value is JsonRecord {
  return isJsonValue(value) && isRecord(value)
}

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null) return true
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return Number.isFinite(value as number) || typeof value !== "number"
  }
  if (Array.isArray(value)) return value.every(isJsonValue)
  if (isRecord(value)) return Object.values(value).every(isJsonValue)
  return false
}

function containsForbiddenContactField(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(containsForbiddenContactField)
  if (!isRecord(value)) return false
  for (const [key, nestedValue] of Object.entries(value)) {
    const normalized = key.toLowerCase().replace(/[-\s]/g, "_")
    if (forbiddenAnswerContactKeys.has(normalized)) return true
    if (containsForbiddenContactField(nestedValue)) return true
  }
  return false
}

function hasRawAnswerKey(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasRawAnswerKey)
  if (!isRecord(value)) return false
  for (const [key, nestedValue] of Object.entries(value)) {
    const normalized = key.toLowerCase().replace(/[-\s]/g, "_")
    if (
      normalized === "answers" ||
      normalized === "rawanswers" ||
      normalized === "raw_answers" ||
      normalized === "rawjson" ||
      normalized === "raw_json"
    ) {
      return true
    }
    if (hasRawAnswerKey(nestedValue)) return true
  }
  return false
}

function invalid(error: string, status = 400): { ok: false; status: number; error: string } {
  return { ok: false, status, error }
}
