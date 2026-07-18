import {
  CURRENT_CASE_CHALLENGE_RESPONSE_IDS,
  CURRENT_CASE_RESPONSE_STORAGE_KEY,
  CURRENT_CASE_RESPONSE_STORE_VERSION,
  CURRENT_CASE_STEP_IDS,
  isCurrentCaseConfidence,
  type CompletedCurrentCaseResponse,
  type CurrentCase,
  type CurrentCaseDraft,
  type CurrentCaseResponseStore,
} from "@/lib/current-cases/types"
import {
  isReasoningTagId,
  migrateLegacyReasoningTag,
} from "@/lib/current-cases/reasoning-tags"
import {
  LEGACY_ENGLISH_PROVENANCE,
  isCompletionLocale,
  isLocaleCopyVersion,
} from "@/lib/locale-provenance"

export function emptyCurrentCaseResponseStore(): CurrentCaseResponseStore {
  return {
    v: CURRENT_CASE_RESPONSE_STORE_VERSION,
    drafts: {},
    responses: {},
  }
}

/**
 * V1 stored Current Case reasoning labels as identity. V2 migrates those
 * labels through a frozen alias registry and adds completion provenance.
 */
export function parseCurrentCaseResponseStore(
  raw: string | null,
): CurrentCaseResponseStore {
  if (!raw) return emptyCurrentCaseResponseStore()

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!isRecord(parsed) || (parsed.v !== 1 && parsed.v !== 2)) {
      return emptyCurrentCaseResponseStore()
    }
    const legacy = parsed.v === 1
    if (!isRecord(parsed.responses)) return emptyCurrentCaseResponseStore()

    const drafts: Record<string, CurrentCaseDraft> = {}
    if (isRecord(parsed.drafts)) {
      for (const [caseId, value] of Object.entries(parsed.drafts)) {
        const draft = normalizeCurrentCaseDraft(value, legacy)
        if (draft && draft.caseId === caseId) drafts[caseId] = draft
      }
    }

    const responses: Record<string, CompletedCurrentCaseResponse[]> = {}
    for (const [caseId, history] of Object.entries(parsed.responses)) {
      if (!Array.isArray(history)) continue
      const normalized = history
        .map((response) => normalizeCompletedCurrentCaseResponse(response, legacy))
        .filter(
          (response): response is CompletedCurrentCaseResponse =>
            response !== null && response.caseId === caseId,
        )
      const deduplicated = deduplicateVersions(normalized)
      if (deduplicated.length > 0) responses[caseId] = deduplicated
    }

    return {
      v: CURRENT_CASE_RESPONSE_STORE_VERSION,
      drafts,
      responses,
    }
  } catch {
    return emptyCurrentCaseResponseStore()
  }
}

export function addCompletedCurrentCaseResponse(
  store: CurrentCaseResponseStore,
  response: CompletedCurrentCaseResponse,
): CurrentCaseResponseStore {
  const normalized = normalizeCompletedCurrentCaseResponse(response, false)
  if (!normalized) return store

  const existing = store.responses[normalized.caseId] ?? []
  return {
    v: CURRENT_CASE_RESPONSE_STORE_VERSION,
    drafts: store.drafts,
    responses: {
      ...store.responses,
      [normalized.caseId]: deduplicateVersions([...existing, normalized]),
    },
  }
}

export function saveCurrentCaseDraft(
  store: CurrentCaseResponseStore,
  draft: CurrentCaseDraft,
): CurrentCaseResponseStore {
  const normalized = normalizeCurrentCaseDraft(draft, false)
  if (!normalized) return store

  return {
    v: CURRENT_CASE_RESPONSE_STORE_VERSION,
    drafts: {
      ...store.drafts,
      [normalized.caseId]: normalized,
    },
    responses: store.responses,
  }
}

export function clearCurrentCaseDraft(
  store: CurrentCaseResponseStore,
  caseId: string,
): CurrentCaseResponseStore {
  const drafts = { ...store.drafts }
  delete drafts[caseId]
  return {
    v: CURRENT_CASE_RESPONSE_STORE_VERSION,
    drafts,
    responses: store.responses,
  }
}

export function getCurrentCaseDraft(store: CurrentCaseResponseStore, caseId: string) {
  return store.drafts[caseId] ?? null
}

export function getLatestCurrentCaseResponse(
  store: CurrentCaseResponseStore,
  caseId: string,
) {
  return store.responses[caseId]?.at(-1) ?? null
}

export function isResponseForCurrentCase(
  response: CompletedCurrentCaseResponse,
  record: Pick<
    CurrentCase,
    "id" | "slug" | "version" | "decision" | "worldviewReadings" | "reasoningTags"
  >,
) {
  const optionIds = new Set(record.decision.options.map((option) => option.id))
  const readingIds = new Set(record.worldviewReadings.map((reading) => reading.profileId))
  const reasoningTagIds = new Set(record.reasoningTags.map((tag) => tag.id))

  return (
    response.caseId === record.id &&
    response.caseSlug === record.slug &&
    response.caseVersion === record.version &&
    optionIds.has(response.initialOptionId) &&
    optionIds.has(response.selectedOptionId) &&
    response.reasoningTagIds.every(
      (tagId) =>
        reasoningTagIds.has(tagId) ||
        Object.hasOwn(response.legacyReasoningTagLabels ?? {}, tagId),
    ) &&
    response.openedReadingProfileIds.every((profileId) => readingIds.has(profileId))
  )
}

export function isDraftForCurrentCase(
  draft: CurrentCaseDraft,
  record: Pick<
    CurrentCase,
    "id" | "slug" | "version" | "decision" | "worldviewReadings" | "reasoningTags"
  >,
) {
  const optionIds = new Set(record.decision.options.map((option) => option.id))
  const readingIds = new Set(record.worldviewReadings.map((reading) => reading.profileId))
  const reasoningTagIds = new Set(record.reasoningTags.map((tag) => tag.id))

  return (
    draft.caseId === record.id &&
    draft.caseSlug === record.slug &&
    draft.caseVersion === record.version &&
    (draft.initialOptionId === undefined || optionIds.has(draft.initialOptionId)) &&
    (draft.finalOptionId === undefined || optionIds.has(draft.finalOptionId)) &&
    draft.reasoningTagIds.every(
      (tagId) =>
        reasoningTagIds.has(tagId) ||
        Object.hasOwn(draft.legacyReasoningTagLabels ?? {}, tagId),
    ) &&
    draft.openedReadingProfileIds.every((profileId) => readingIds.has(profileId))
  )
}

export function loadCurrentCaseResponseStore() {
  if (typeof window === "undefined") return emptyCurrentCaseResponseStore()
  return parseCurrentCaseResponseStore(
    window.localStorage.getItem(CURRENT_CASE_RESPONSE_STORAGE_KEY),
  )
}

export function saveCurrentCaseResponseStore(store: CurrentCaseResponseStore) {
  if (typeof window === "undefined") return false
  try {
    window.localStorage.setItem(CURRENT_CASE_RESPONSE_STORAGE_KEY, JSON.stringify(store))
    return true
  } catch {
    return false
  }
}

export function recordCompletedCurrentCaseResponse(
  response: CompletedCurrentCaseResponse,
) {
  const store = loadCurrentCaseResponseStore()
  return saveCurrentCaseResponseStore(
    clearCurrentCaseDraft(addCompletedCurrentCaseResponse(store, response), response.caseId),
  )
}

export function recordCurrentCaseDraft(draft: CurrentCaseDraft) {
  return saveCurrentCaseResponseStore(
    saveCurrentCaseDraft(loadCurrentCaseResponseStore(), draft),
  )
}

function normalizeCompletedCurrentCaseResponse(
  value: unknown,
  legacy: boolean,
): CompletedCurrentCaseResponse | null {
  if (!isRecord(value)) return null
  const reasoning = normalizeReasoningTags(value, legacy)
  if (
    !isNonEmptyString(value.caseId) ||
    !isNonEmptyString(value.caseSlug) ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.caseSlug) ||
    !isPositiveInteger(value.caseVersion) ||
    !isNonEmptyString(value.initialOptionId) ||
    !isCurrentCaseConfidence(value.initialConfidence) ||
    !isNonEmptyString(value.selectedOptionId) ||
    !isCurrentCaseConfidence(value.confidence) ||
    !reasoning ||
    !CURRENT_CASE_CHALLENGE_RESPONSE_IDS.includes(value.challengeResponseId as never) ||
    !isStringArray(value.openedReadingProfileIds) ||
    !isIsoTimestamp(value.completedAt) ||
    (!legacy &&
      (!isCompletionLocale(value.locale) ||
        !isLocaleCopyVersion(value.localeCopyVersion)))
  ) {
    return null
  }

  return {
    caseId: value.caseId,
    caseSlug: value.caseSlug,
    caseVersion: value.caseVersion,
    initialOptionId: value.initialOptionId,
    initialConfidence: value.initialConfidence,
    selectedOptionId: value.selectedOptionId,
    confidence: value.confidence,
    reasoningTagIds: reasoning.ids,
    ...(Object.keys(reasoning.legacyLabels).length > 0
      ? { legacyReasoningTagLabels: reasoning.legacyLabels }
      : {}),
    challengeResponseId:
      value.challengeResponseId as CompletedCurrentCaseResponse["challengeResponseId"],
    openedReadingProfileIds: unique(value.openedReadingProfileIds),
    completedAt: value.completedAt,
    ...(legacy
      ? LEGACY_ENGLISH_PROVENANCE
      : {
          locale: value.locale as CompletedCurrentCaseResponse["locale"],
          localeCopyVersion: value.localeCopyVersion as number,
        }),
  }
}

function normalizeCurrentCaseDraft(
  value: unknown,
  legacy: boolean,
): CurrentCaseDraft | null {
  if (!isRecord(value)) return null
  const reasoning = normalizeReasoningTags(value, legacy)
  if (
    !isNonEmptyString(value.caseId) ||
    !isNonEmptyString(value.caseSlug) ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.caseSlug) ||
    !isPositiveInteger(value.caseVersion) ||
    !CURRENT_CASE_STEP_IDS.includes(value.step as never) ||
    !reasoning ||
    !isStringArray(value.openedReadingProfileIds) ||
    !isIsoTimestamp(value.updatedAt) ||
    (value.initialOptionId !== undefined && !isNonEmptyString(value.initialOptionId)) ||
    (value.initialConfidence !== undefined && !isCurrentCaseConfidence(value.initialConfidence)) ||
    (value.challengeResponseId !== undefined &&
      !CURRENT_CASE_CHALLENGE_RESPONSE_IDS.includes(value.challengeResponseId as never)) ||
    (value.finalOptionId !== undefined && !isNonEmptyString(value.finalOptionId)) ||
    (value.finalConfidence !== undefined && !isCurrentCaseConfidence(value.finalConfidence))
  ) {
    return null
  }

  return {
    caseId: value.caseId,
    caseSlug: value.caseSlug,
    caseVersion: value.caseVersion,
    step: value.step as CurrentCaseDraft["step"],
    ...(value.initialOptionId ? { initialOptionId: value.initialOptionId } : {}),
    ...(value.initialConfidence
      ? { initialConfidence: value.initialConfidence }
      : {}),
    reasoningTagIds: reasoning.ids,
    ...(Object.keys(reasoning.legacyLabels).length > 0
      ? { legacyReasoningTagLabels: reasoning.legacyLabels }
      : {}),
    ...(value.challengeResponseId
      ? {
          challengeResponseId:
            value.challengeResponseId as CurrentCaseDraft["challengeResponseId"],
        }
      : {}),
    openedReadingProfileIds: unique(value.openedReadingProfileIds),
    ...(value.finalOptionId ? { finalOptionId: value.finalOptionId } : {}),
    ...(value.finalConfidence ? { finalConfidence: value.finalConfidence } : {}),
    updatedAt: value.updatedAt,
  }
}

function normalizeReasoningTags(
  value: Record<string, unknown>,
  legacy: boolean,
): { ids: string[]; legacyLabels: Record<string, string> } | null {
  const raw = legacy ? value.reasoningTags : value.reasoningTagIds
  if (!Array.isArray(raw)) return null

  const ids: string[] = []
  const legacyLabels: Record<string, string> = {}
  if (legacy) {
    if (!raw.every(isNonEmptyString)) return null
    for (const label of raw) {
      const migrated = migrateLegacyReasoningTag(label)
      ids.push(migrated.id)
      if (migrated.legacyLabel) legacyLabels[migrated.id] = migrated.legacyLabel
    }
  } else {
    if (!raw.every(isReasoningTagId)) return null
    ids.push(...raw)
    if (isRecord(value.legacyReasoningTagLabels)) {
      for (const [id, label] of Object.entries(value.legacyReasoningTagLabels)) {
        if (ids.includes(id) && isNonEmptyString(label)) legacyLabels[id] = label
      }
    }
  }

  return { ids: unique(ids), legacyLabels }
}

function deduplicateVersions(history: CompletedCurrentCaseResponse[]) {
  const byVersion = new Map<number, CompletedCurrentCaseResponse>()
  for (const response of history) {
    const current = byVersion.get(response.caseVersion)
    if (!current || current.completedAt <= response.completedAt) {
      byVersion.set(response.caseVersion, response)
    }
  }
  return Array.from(byVersion.values()).sort(
    (left, right) =>
      left.caseVersion - right.caseVersion || left.completedAt.localeCompare(right.completedAt),
  )
}

function unique(values: string[]) {
  return Array.from(new Set(values))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString)
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1
}

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string") return false
  const timestamp = Date.parse(value)
  return Number.isFinite(timestamp) && value.includes("T")
}
