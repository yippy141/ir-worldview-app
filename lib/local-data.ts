import {
  AI_GOVERNANCE_STORAGE_KEY,
  ANALYTICS_FIRST_SEEN_STORAGE_KEY,
  CURRENT_CASE_RESPONSE_STORAGE_KEY,
  MODULE_DRAFT_STORAGE_KEY,
  PERSPECTIVE_DRAFT_STORAGE_KEY,
  PROFILE_SAVE_INTENT_KEY,
  PROFILE_STORAGE_KEY,
  QUIZ_STORAGE_KEY,
  RESULT_HISTORY_STORAGE_KEY,
  TIER1_SUBMITTED_RESULTS_STORAGE_KEY,
} from "@/lib/storage-keys"

export const LOCAL_HISTORY_STORAGE_KEYS = [
  PROFILE_STORAGE_KEY,
  QUIZ_STORAGE_KEY,
  AI_GOVERNANCE_STORAGE_KEY,
  CURRENT_CASE_RESPONSE_STORAGE_KEY,
  PERSPECTIVE_DRAFT_STORAGE_KEY,
  MODULE_DRAFT_STORAGE_KEY,
  RESULT_HISTORY_STORAGE_KEY,
  ANALYTICS_FIRST_SEEN_STORAGE_KEY,
  TIER1_SUBMITTED_RESULTS_STORAGE_KEY,
] as const

export const SESSION_HISTORY_STORAGE_KEYS = [PROFILE_SAVE_INTENT_KEY] as const

type StorageLike = Pick<Storage, "removeItem">

export type ClearLocalHistoryResult = {
  removed: number
  failed: string[]
}

/** Clear app-owned results, drafts, and history while preserving analytics opt-out. */
export function clearLocalWorldviewHistory(
  localStorage: StorageLike,
  sessionStorage: StorageLike,
): ClearLocalHistoryResult {
  let removed = 0
  const failed: string[] = []

  for (const [storage, keys] of [
    [localStorage, LOCAL_HISTORY_STORAGE_KEYS],
    [sessionStorage, SESSION_HISTORY_STORAGE_KEYS],
  ] as const) {
    for (const key of keys) {
      try {
        storage.removeItem(key)
        removed += 1
      } catch {
        failed.push(key)
      }
    }
  }

  return { removed, failed }
}
