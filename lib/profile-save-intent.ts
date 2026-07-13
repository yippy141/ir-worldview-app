import type { QuizMode } from "@/lib/types"

export type ProfileSaveIntentKind = "foundation" | "module" | "ai-governance"

const PROFILE_SAVE_INTENT_KEY = "ir-worldview-profile-save-intents-v1"

export type ProfileSaveIntent = {
  identity: string
  mode?: QuizMode
}

type ProfileSaveIntents = Partial<Record<ProfileSaveIntentKind, ProfileSaveIntent>>

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

function writeProfileSaveIntents(intents: ProfileSaveIntents): void {
  if (typeof window === "undefined") return

  try {
    if (Object.keys(intents).length === 0) {
      window.sessionStorage.removeItem(PROFILE_SAVE_INTENT_KEY)
    } else {
      window.sessionStorage.setItem(PROFILE_SAVE_INTENT_KEY, JSON.stringify(intents))
    }
  } catch {
    // A blocked or full session store must not prevent result navigation.
  }
}

/** Mark a result created in this tab as eligible for the local Profile. */
export function markProfileSaveIntent(
  kind: ProfileSaveIntentKind,
  identity: string,
  metadata: { mode?: QuizMode } = {},
): void {
  if (!identity) return
  writeProfileSaveIntents({
    ...readProfileSaveIntents(),
    [kind]: {
      identity,
      ...(metadata.mode ? { mode: metadata.mode } : {}),
    },
  })
}

/**
 * Consume a matching generation marker once. Canonical result URLs opened as
 * shares or history links carry no marker and therefore remain read-only.
 */
export function consumeProfileSaveIntent(
  kind: ProfileSaveIntentKind,
  identity: string,
): ProfileSaveIntent | null {
  if (!identity) return null
  const intents = readProfileSaveIntents()
  const intent = intents[kind]
  if (intent?.identity !== identity) return null

  delete intents[kind]
  writeProfileSaveIntents(intents)
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
  return { identity: record.identity, ...(mode ? { mode } : {}) }
}
