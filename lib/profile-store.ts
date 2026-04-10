import type { ModuleSlug } from "@/lib/modules/types"
import type {
  DimensionScores,
  FamilyKey,
  NormativeModifier,
  QuizMode,
  StrategyModifier,
} from "@/lib/types"

export const PROFILE_STORAGE_KEY = "ir-worldview-profile-v1"

export type ProfileKeyDriver = {
  label: string
  description: string
  type: string
}

export type ProfileLens = {
  label: string
  description: string
}

export type FoundationSnapshot = {
  timestamp: number
  mode?: QuizMode
  payload: string
  resultPath: string
  familyKey: FamilyKey
  familyLabel: string
  runnerUpKey: FamilyKey
  runnerUpLabel: string
  summary: string
  dimensionScores: DimensionScores
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
  keyDrivers: ProfileKeyDriver[]
  strongLenses: ProfileLens[]
}

export type ModuleEvidenceItem = {
  question: string
  primary: string
  secondary?: string
}

export type ModuleSnapshot = {
  timestamp: number
  slug: ModuleSlug
  title: string
  mode: QuizMode
  headline: string
  summary: string
  resultPath: string
  scores: Record<string, number>
  instincts: string[]
  comparison?: string
  challenge: string
  measures: string[]
  doesNotClaim: string[]
  evidence: ModuleEvidenceItem[]
}

export type ProfileStore = {
  v: 1
  foundation: FoundationSnapshot | null
  modules: Partial<Record<ModuleSlug, ModuleSnapshot>>
}

export function emptyProfileStore(): ProfileStore {
  return {
    v: 1,
    foundation: null,
    modules: {},
  }
}

export function parseProfileStore(raw: string | null): ProfileStore {
  if (!raw) {
    return emptyProfileStore()
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ProfileStore>
    if (parsed.v !== 1 || typeof parsed !== "object" || parsed === null) {
      return emptyProfileStore()
    }

    return {
      v: 1,
      foundation: isFoundationSnapshot(parsed.foundation) ? parsed.foundation : null,
      modules: normalizeModuleSnapshots(parsed.modules),
    }
  } catch {
    return emptyProfileStore()
  }
}

export function loadProfileStore(): ProfileStore {
  if (typeof window === "undefined") {
    return emptyProfileStore()
  }

  return parseProfileStore(window.localStorage.getItem(PROFILE_STORAGE_KEY))
}

export function saveProfileStore(store: ProfileStore): void {
  if (typeof window === "undefined") return

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(store))
}

export function saveFoundationSnapshot(snapshot: FoundationSnapshot): void {
  const store = loadProfileStore()
  saveProfileStore({
    ...store,
    foundation: snapshot,
  })
}

export function saveModuleSnapshot(snapshot: ModuleSnapshot): void {
  const store = loadProfileStore()
  saveProfileStore({
    ...store,
    modules: {
      ...store.modules,
      [snapshot.slug]: snapshot,
    },
  })
}

function normalizeModuleSnapshots(
  value: unknown,
): Partial<Record<ModuleSlug, ModuleSnapshot>> {
  if (typeof value !== "object" || value === null) {
    return {}
  }

  const normalized: Partial<Record<ModuleSlug, ModuleSnapshot>> = {}

  for (const [key, candidate] of Object.entries(value)) {
    if ((key === "security" || key === "technology") && isModuleSnapshot(candidate)) {
      normalized[key] = candidate
    }
  }

  return normalized
}

function isFoundationSnapshot(value: unknown): value is FoundationSnapshot {
  if (typeof value !== "object" || value === null) return false

  const candidate = value as Partial<FoundationSnapshot>
  return (
    typeof candidate.timestamp === "number" &&
    (candidate.mode === undefined || candidate.mode === "standard" || candidate.mode === "analyst") &&
    typeof candidate.payload === "string" &&
    typeof candidate.resultPath === "string" &&
    typeof candidate.familyLabel === "string" &&
    typeof candidate.runnerUpLabel === "string" &&
    typeof candidate.summary === "string" &&
    typeof candidate.strategyModifier === "string" &&
    typeof candidate.normativeModifier === "string" &&
    typeof candidate.dimensionScores === "object" &&
    candidate.dimensionScores !== null &&
    Array.isArray(candidate.keyDrivers) &&
    Array.isArray(candidate.strongLenses)
  )
}

function isModuleSnapshot(value: unknown): value is ModuleSnapshot {
  if (typeof value !== "object" || value === null) return false

  const candidate = value as Partial<ModuleSnapshot>
  return (
    typeof candidate.timestamp === "number" &&
    (candidate.slug === "security" || candidate.slug === "technology") &&
    typeof candidate.title === "string" &&
    (candidate.mode === "standard" || candidate.mode === "analyst") &&
    typeof candidate.headline === "string" &&
    typeof candidate.summary === "string" &&
    typeof candidate.resultPath === "string" &&
    typeof candidate.scores === "object" &&
    candidate.scores !== null &&
    Array.isArray(candidate.instincts) &&
    typeof candidate.challenge === "string" &&
    Array.isArray(candidate.measures) &&
    Array.isArray(candidate.doesNotClaim) &&
    Array.isArray(candidate.evidence)
  )
}
