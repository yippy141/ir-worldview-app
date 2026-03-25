import type { DimensionScores, FamilyKey, StrategyModifier, NormativeModifier } from "@/lib/types"
import { SCHEMA_VERSION } from "@/lib/quiz-schema"

export type ResultSnapshot = {
  timestamp: number
  schemaVersion: number
  familyKey: FamilyKey
  neighborKey: FamilyKey
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
  dimensionScores: DimensionScores
}

const STORAGE_KEY = "ir-worldview-history"
const MAX_SNAPSHOTS = 5

export function saveSnapshot(snapshot: ResultSnapshot): void {
  if (typeof window === "undefined") return
  const history = loadHistory()
  const updated = [snapshot, ...history].slice(0, MAX_SNAPSHOTS)
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // localStorage unavailable or full — skip silently
  }
}

export function loadHistory(): ResultSnapshot[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
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
