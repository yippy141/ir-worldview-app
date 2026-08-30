import { PROFILE_STORAGE_KEY, QUIZ_STORAGE_KEY } from "@/lib/storage-keys"

export type RootLocalStatus = Readonly<{
  foundation: boolean
  domains: number
  perspectives: number
  draft: number
}>

function objectRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
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

/** Read only the counts the root needs; full answers never leave storage. */
export function readRootLocalStatus(storage: Pick<Storage, "getItem">): RootLocalStatus {
  const profile = parseObject(storage.getItem(PROFILE_STORAGE_KEY))
  const quiz = parseObject(storage.getItem(QUIZ_STORAGE_KEY))
  const modules = objectRecord(profile?.modules)
  const answers = objectRecord(quiz?.answers)

  return {
    foundation: objectRecord(profile?.foundation) !== null,
    domains:
      Object.values(modules ?? {}).filter((value) => objectRecord(value) !== null).length
      + (objectRecord(profile?.aiGovernance) ? 1 : 0),
    perspectives: Array.isArray(profile?.perspectiveRuns)
      ? profile.perspectiveRuns.length
      : 0,
    draft: Object.keys(answers ?? {}).length,
  }
}
