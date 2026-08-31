import { PROFILE_STORAGE_KEY, QUIZ_STORAGE_KEY } from "@/lib/storage-keys"

/**
 * Prototype-only read of the existing local records. It never writes, never
 * migrates, and never sends anything. The full store parser stays out of this
 * bundle so the prototype route reads the same keys without importing locale
 * copy or the Profile schema.
 */
export type PrototypeLocalRecord = Readonly<{
  foundationLabel: string | null
  security: boolean
  technology: boolean
  aiGovernance: boolean
  draftAnswered: number
  draftIsCore: boolean
}>

export const EMPTY_PROTOTYPE_LOCAL_RECORD: PrototypeLocalRecord = {
  foundationLabel: null,
  security: false,
  technology: false,
  aiGovernance: false,
  draftAnswered: 0,
  draftIsCore: false,
}

function objectRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function parseObject(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null
  try {
    return objectRecord(JSON.parse(raw))
  } catch {
    return null
  }
}

function nonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null
}

export function readPrototypeLocalRecord(
  storage: Pick<Storage, "getItem">,
  coreQuestionIds: readonly string[],
): PrototypeLocalRecord {
  const profile = parseObject(storage.getItem(PROFILE_STORAGE_KEY))
  const quiz = parseObject(storage.getItem(QUIZ_STORAGE_KEY))
  const modules = objectRecord(profile?.modules)
  const answers = objectRecord(quiz?.answers)
  const draftIsCore = quiz?.questionSet === "core"
  const answeredIds = new Set(Object.keys(answers ?? {}))

  return {
    foundationLabel: nonEmptyString(objectRecord(profile?.foundation)?.familyLabel),
    security: objectRecord(modules?.security) !== null,
    technology: objectRecord(modules?.technology) !== null,
    aiGovernance: objectRecord(profile?.aiGovernance) !== null,
    draftAnswered: draftIsCore
      ? coreQuestionIds.filter((id) => answeredIds.has(id)).length
      : answeredIds.size,
    draftIsCore,
  }
}

export function hasAnyPrototypeRecord(record: PrototypeLocalRecord): boolean {
  return Boolean(
    record.foundationLabel ||
      record.security ||
      record.technology ||
      record.aiGovernance ||
      record.draftAnswered > 0,
  )
}
