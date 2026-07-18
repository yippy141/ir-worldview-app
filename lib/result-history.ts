import type { DimensionScores, FamilyKey, StrategyModifier, NormativeModifier } from "@/lib/types"
import { SCHEMA_VERSION } from "@/lib/quiz-schema"
import { RESULT_HISTORY_STORAGE_KEY } from "@/lib/storage-keys"

export { RESULT_HISTORY_STORAGE_KEY } from "@/lib/storage-keys"

export type ResultSnapshot = {
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
    return parsed as ResultSnapshot[]
  } catch {
    return []
  }
}

export function getLastSnapshot(): ResultSnapshot | null {
  const history = loadHistory()
  return history[0] ?? null
}
