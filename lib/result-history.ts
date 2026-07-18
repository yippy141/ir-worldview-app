import type { DimensionScores, FamilyKey, StrategyModifier, NormativeModifier } from "@/lib/types"
import { SCHEMA_VERSION } from "@/lib/quiz-schema"
import { RESULT_HISTORY_STORAGE_KEY } from "@/lib/storage-keys"
import type { CompletionProvenance } from "@/lib/locale-provenance"
import {
  LEGACY_ENGLISH_PROVENANCE,
  isCompletionLocale,
  isLocaleCopyVersion,
  sameResearchEquivalenceCohort,
} from "@/lib/locale-provenance"

export { RESULT_HISTORY_STORAGE_KEY } from "@/lib/storage-keys"

export type ResultSnapshot = CompletionProvenance & {
  timestamp: number
  schemaVersion: number
  familyKey: FamilyKey
  neighborKey: FamilyKey
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
  dimensionScores: DimensionScores
}

const MAX_SNAPSHOTS = 5

export function saveSnapshot(snapshot: ResultSnapshot): void {
  if (typeof window === "undefined") return
  const history = loadHistory()
  const updated = [snapshot, ...history].slice(0, MAX_SNAPSHOTS)
  try {
    window.localStorage.setItem(RESULT_HISTORY_STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // localStorage unavailable or full — skip silently
  }
}

export function loadHistory(): ResultSnapshot[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(RESULT_HISTORY_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((value): ResultSnapshot[] => {
      if (typeof value !== "object" || value === null) return []
      const candidate = value as Partial<ResultSnapshot>
      if (
        typeof candidate.timestamp !== "number" ||
        typeof candidate.schemaVersion !== "number" ||
        typeof candidate.familyKey !== "string" ||
        typeof candidate.neighborKey !== "string" ||
        typeof candidate.strategyModifier !== "string" ||
        typeof candidate.normativeModifier !== "string" ||
        typeof candidate.dimensionScores !== "object" ||
        candidate.dimensionScores === null
      ) return []

      return [{
        ...(candidate as Omit<ResultSnapshot, "locale" | "localeCopyVersion">),
        ...(isCompletionLocale(candidate.locale) &&
        isLocaleCopyVersion(candidate.localeCopyVersion)
          ? {
              locale: candidate.locale,
              localeCopyVersion: candidate.localeCopyVersion,
            }
          : LEGACY_ENGLISH_PROVENANCE),
      }]
    })
  } catch {
    return []
  }
}

export function getLastSnapshot(): ResultSnapshot | null {
  const history = loadHistory()
  return history[0] ?? null
}

export function getLastComparableSnapshot(
  provenance: CompletionProvenance,
): ResultSnapshot | null {
  return loadHistory().find((snapshot) =>
    sameResearchEquivalenceCohort(snapshot, provenance)) ?? null
}
