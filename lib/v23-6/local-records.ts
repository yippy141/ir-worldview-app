import { parseProfileStore, type ProfileStore } from "@/lib/profile-store"
import { parseQuizSession, QUIZ_SESSION_EVENT } from "@/lib/quiz-session"
import { PROFILE_STORAGE_KEY, QUIZ_STORAGE_KEY } from "@/lib/storage-keys"
import type { QuizSession } from "@/lib/types"

/**
 * A cached external store over the two browser slots the prototypes read.
 *
 * `useSyncExternalStore` needs a referentially stable snapshot, so the parsed
 * value is recomputed only when the stored text itself changes. The server
 * snapshot is empty, which is also the honest first paint: the server cannot
 * know what a given browser holds.
 */
export type LocalRecords = Readonly<{
  store: ProfileStore | null
  session: QuizSession | null
}>

export const EMPTY_LOCAL_RECORDS: LocalRecords = { store: null, session: null }

let cachedProfileRaw: string | null | undefined
let cachedQuizRaw: string | null | undefined
let cachedRecords: LocalRecords = EMPTY_LOCAL_RECORDS

export function subscribeLocalRecords(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange)
  window.addEventListener(QUIZ_SESSION_EVENT, onStoreChange)
  return () => {
    window.removeEventListener("storage", onStoreChange)
    window.removeEventListener(QUIZ_SESSION_EVENT, onStoreChange)
  }
}

export function getLocalRecordsSnapshot(): LocalRecords {
  let profileRaw: string | null = null
  let quizRaw: string | null = null

  try {
    profileRaw = localStorage.getItem(PROFILE_STORAGE_KEY)
    quizRaw = localStorage.getItem(QUIZ_STORAGE_KEY)
  } catch {
    return EMPTY_LOCAL_RECORDS
  }

  if (cachedProfileRaw === profileRaw && cachedQuizRaw === quizRaw) {
    return cachedRecords
  }

  cachedProfileRaw = profileRaw
  cachedQuizRaw = quizRaw
  cachedRecords = {
    store: parseProfileStore(profileRaw),
    session: parseQuizSession(quizRaw),
  }
  return cachedRecords
}

export function getLocalRecordsServerSnapshot(): LocalRecords {
  return EMPTY_LOCAL_RECORDS
}
