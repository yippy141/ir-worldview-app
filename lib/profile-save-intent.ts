import type { QuizMode } from "@/lib/types"
import { PROFILE_SAVE_INTENT_KEY } from "@/lib/storage-keys"

export { PROFILE_SAVE_INTENT_KEY } from "@/lib/storage-keys"

export type ProfileSaveIntentKind = "foundation" | "module" | "ai-governance"

export type ProfileSaveIntent = {
  identity: string
  mode?: QuizMode
  localEvidenceId?: string
}

type ProfileSaveIntents = Partial<Record<ProfileSaveIntentKind, ProfileSaveIntent>>

// A completion can still reach its result when session storage is unavailable.
// This fallback lives only for the current page navigation, never in a share URL.
const memoryIntents: ProfileSaveIntents = {}

function readProfileSaveIntents(): ProfileSaveIntents {
  if (typeof window === "undefined") return {}

  try {
    const raw = window.sessionStorage.getItem(PROFILE_SAVE_INTENT_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : null
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {}

    const record = parsed as Record<string, unknown>
    return Object.fromEntries(
      (["foundation", "module", "ai-governance"] as const)
        .map((kind) => [kind, normalizeIntent(record[kind])])
        .filter((entry): entry is [ProfileSaveIntentKind, ProfileSaveIntent] => Boolean(entry[1])),
    )
  } catch {
    return {}
  }
}

function writeProfileSaveIntents(intents: ProfileSaveIntents): boolean {
  if (typeof window === "undefined") return false

  try {
    if (Object.keys(intents).length === 0) {
      try {
        window.sessionStorage.removeItem(PROFILE_SAVE_INTENT_KEY)
      } catch {
        window.sessionStorage.setItem(PROFILE_SAVE_INTENT_KEY, "{}")
      }
    } else {
      window.sessionStorage.setItem(PROFILE_SAVE_INTENT_KEY, JSON.stringify(intents))
    }
    return true
  } catch {
    // A blocked or full session store must not prevent result navigation.
    return false
  }
}

/** Mark a result created in this tab as eligible for the local Profile. */
export function markProfileSaveIntent(
  kind: ProfileSaveIntentKind,
  identity: string,
  metadata: { mode?: QuizMode; localEvidenceId?: string } = {},
): boolean {
  if (!identity) return false
  const intent = {
    identity,
    ...(metadata.mode ? { mode: metadata.mode } : {}),
    ...(metadata.localEvidenceId
      ? { localEvidenceId: metadata.localEvidenceId }
      : {}),
  }
  const written = writeProfileSaveIntents({
    ...readProfileSaveIntents(),
    [kind]: intent,
  })
  // Do not let an older in-memory completion supersede a new marker.
  delete memoryIntents[kind]
  if (!written && typeof window !== "undefined") memoryIntents[kind] = intent
  return written
}

/**
 * Consume a matching generation marker once. Canonical result URLs opened as
 * shares or history links carry no marker and therefore remain read-only.
 */
export function consumeProfileSaveIntent(
  kind: ProfileSaveIntentKind,
  identity: string,
  onStorageFailure?: () => void,
): ProfileSaveIntent | null {
  if (!identity) return null
  const intents = readProfileSaveIntents()
  const intent = memoryIntents[kind] ?? intents[kind]
  if (intent?.identity !== identity) return null

  // Persisted markers must be cleared before authorizing a save. Otherwise a
  // reload could replay an old completion and replace the local Profile again.
  const persisted = intents[kind]
  delete intents[kind]
  if (persisted && !writeProfileSaveIntents(intents)) {
    delete memoryIntents[kind]
    onStorageFailure?.()
    return null
  }
  delete memoryIntents[kind]
  return intent
}

function normalizeIntent(value: unknown): ProfileSaveIntent | null {
  // Read the short-lived string shape used during V16 development so hot
  // reloads do not strand a result that was just generated.
  if (typeof value === "string" && value.length > 0) return { identity: value }
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null

  const record = value as Record<string, unknown>
  if (typeof record.identity !== "string" || record.identity.length === 0) return null
  const mode = record.mode === "standard" || record.mode === "analyst" ? record.mode : undefined
  const localEvidenceId =
    typeof record.localEvidenceId === "string" && record.localEvidenceId.length > 0
      ? record.localEvidenceId
      : undefined
  return {
    identity: record.identity,
    ...(mode ? { mode } : {}),
    ...(localEvidenceId ? { localEvidenceId } : {}),
  }
}
