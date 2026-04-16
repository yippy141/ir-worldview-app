import type { ModuleCardTypeRead, ModuleLaneSummary, ModuleSlug } from "@/lib/modules/types"
import type {
  AiArchetypeKey,
  AiAxisKey,
  AiAxisScores,
  GeopoliticsModifier,
  PaceModifier,
  RiskLens,
} from "@/lib/ai-governance-types"
import type {
  ChoiceCardType,
  DimensionKey,
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
  subtitle?: string
  shorthand?: string
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
  laneSummaries: ModuleLaneSummary[]
  cardTypeRead?: ModuleCardTypeRead
  cardTypeScores?: Partial<Record<ChoiceCardType, Record<string, number>>>
  overlayDeltas: Partial<Record<DimensionKey, number>>
}

export type AiGovernanceSnapshot = {
  timestamp: number
  payload: string
  resultPath: string
  archetypeKey: AiArchetypeKey
  archetypeLabel: string
  riskLens: RiskLens
  paceModifier: PaceModifier
  geopoliticsModifier: GeopoliticsModifier
  axisScores: AiAxisScores
  summary: string
  governingInstinct: string
}

export type ProfileStore = {
  v: 2 | 3
  foundation: FoundationSnapshot | null
  modules: Partial<Record<ModuleSlug, ModuleSnapshot>>
  aiGovernance: AiGovernanceSnapshot | null
}

export function emptyProfileStore(): ProfileStore {
  return {
    v: 3,
    foundation: null,
    modules: {},
    aiGovernance: null,
  }
}

export function parseProfileStore(raw: string | null): ProfileStore {
  if (!raw) {
    return emptyProfileStore()
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ProfileStore> & { v?: number }

    if (typeof parsed !== "object" || parsed === null) {
      return emptyProfileStore()
    }

    if (parsed.v !== 1 && parsed.v !== 2 && parsed.v !== 3) {
      return emptyProfileStore()
    }

    return {
      v: 3,
      foundation: isFoundationSnapshot(parsed.foundation) ? parsed.foundation : null,
      modules: normalizeModuleSnapshots(parsed.modules),
      aiGovernance: isAiGovernanceSnapshot(parsed.aiGovernance)
        ? parsed.aiGovernance
        : null,
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

export function saveAiGovernanceSnapshot(snapshot: AiGovernanceSnapshot): void {
  const store = loadProfileStore()
  saveProfileStore({
    ...store,
    aiGovernance: snapshot,
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
    if (key === "security" || key === "technology") {
      const snapshot = normalizeModuleSnapshot(candidate, key)
      if (snapshot) {
        normalized[key] = snapshot
      }
    }
  }

  return normalized
}

function normalizeModuleSnapshot(
  value: unknown,
  slug: ModuleSlug,
): ModuleSnapshot | null {
  if (typeof value !== "object" || value === null) return null

  const candidate = value as Partial<ModuleSnapshot> & {
    laneSummaries?: unknown
    overlayDeltas?: unknown
    cardTypeRead?: unknown
  }

  if (
    typeof candidate.timestamp !== "number" ||
    candidate.slug !== slug ||
    typeof candidate.title !== "string" ||
    (candidate.mode !== "standard" && candidate.mode !== "analyst") ||
    typeof candidate.headline !== "string" ||
    typeof candidate.summary !== "string" ||
    typeof candidate.resultPath !== "string" ||
    typeof candidate.scores !== "object" ||
    candidate.scores === null ||
    !Array.isArray(candidate.instincts) ||
    typeof candidate.challenge !== "string" ||
    !Array.isArray(candidate.measures) ||
    !Array.isArray(candidate.doesNotClaim) ||
    !Array.isArray(candidate.evidence)
  ) {
    return null
  }

  return {
    timestamp: candidate.timestamp,
    slug,
    title: candidate.title,
    ...(typeof candidate.subtitle === "string" ? { subtitle: candidate.subtitle } : {}),
    ...(typeof candidate.shorthand === "string" ? { shorthand: candidate.shorthand } : {}),
    mode: candidate.mode,
    headline: candidate.headline,
    summary: candidate.summary,
    resultPath: candidate.resultPath,
    scores: candidate.scores as Record<string, number>,
    instincts: candidate.instincts as string[],
    ...(typeof candidate.comparison === "string" ? { comparison: candidate.comparison } : {}),
    challenge: candidate.challenge,
    measures: candidate.measures as string[],
    doesNotClaim: candidate.doesNotClaim as string[],
    evidence: normalizeEvidence(candidate.evidence),
    laneSummaries: normalizeLaneSummaries(candidate.laneSummaries),
    ...(isCardTypeRead(candidate.cardTypeRead) ? { cardTypeRead: candidate.cardTypeRead } : {}),
    ...(normalizeCardTypeScores(candidate.cardTypeScores)
      ? { cardTypeScores: normalizeCardTypeScores(candidate.cardTypeScores) }
      : {}),
    overlayDeltas: normalizeOverlayDeltas(candidate.overlayDeltas),
  }
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

const AI_AXIS_KEYS: AiAxisKey[] = [
  "riskHorizon",
  "deploymentPace",
  "oversight",
  "geopolitics",
  "openness",
  "militaryRole",
  "legitimacy",
  "humanFuture",
]

function isAiGovernanceSnapshot(value: unknown): value is AiGovernanceSnapshot {
  if (typeof value !== "object" || value === null) return false

  const candidate = value as Partial<AiGovernanceSnapshot>
  return (
    typeof candidate.timestamp === "number" &&
    typeof candidate.payload === "string" &&
    typeof candidate.resultPath === "string" &&
    typeof candidate.archetypeKey === "string" &&
    typeof candidate.archetypeLabel === "string" &&
    typeof candidate.riskLens === "string" &&
    typeof candidate.paceModifier === "string" &&
    typeof candidate.geopoliticsModifier === "string" &&
    typeof candidate.summary === "string" &&
    typeof candidate.governingInstinct === "string" &&
    isAiAxisScores(candidate.axisScores)
  )
}

function isAiAxisScores(value: unknown): value is AiAxisScores {
  if (typeof value !== "object" || value === null) return false

  return AI_AXIS_KEYS.every((axis) => typeof (value as Record<AiAxisKey, unknown>)[axis] === "number")
}

function normalizeEvidence(value: unknown): ModuleEvidenceItem[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => typeof item === "object" && item !== null)
    .map((item) => item as Partial<ModuleEvidenceItem>)
    .filter((item) => typeof item.question === "string" && typeof item.primary === "string")
    .map((item) => ({
      question: item.question as string,
      primary: item.primary as string,
      ...(typeof item.secondary === "string" ? { secondary: item.secondary } : {}),
    }))
}

function normalizeLaneSummaries(value: unknown): ModuleLaneSummary[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => typeof item === "object" && item !== null)
    .map((item) => item as Partial<ModuleLaneSummary>)
    .filter(
      (item) =>
        typeof item.key === "string" &&
        typeof item.label === "string" &&
        typeof item.summary === "string" &&
        typeof item.score === "number" &&
        typeof item.lowLabel === "string" &&
        typeof item.highLabel === "string",
    )
    .map((item) => ({
      key: item.key as string,
      label: item.label as string,
      summary: item.summary as string,
      score: item.score as number,
      lowLabel: item.lowLabel as string,
      highLabel: item.highLabel as string,
      ...(typeof item.delta === "string" ? { delta: item.delta } : {}),
    }))
}

function isCardTypeRead(value: unknown): value is ModuleCardTypeRead {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as ModuleCardTypeRead).headline === "string" &&
    typeof (value as ModuleCardTypeRead).summary === "string"
  )
}

function normalizeOverlayDeltas(value: unknown): Partial<Record<DimensionKey, number>> {
  if (typeof value !== "object" || value === null) {
    return {}
  }

  const normalized: Partial<Record<DimensionKey, number>> = {}

  for (const [key, raw] of Object.entries(value)) {
    if (isDimensionKey(key) && typeof raw === "number") {
      normalized[key] = raw
    }
  }

  return normalized
}

function normalizeCardTypeScores(
  value: unknown,
): Partial<Record<ChoiceCardType, Record<string, number>>> | null {
  if (typeof value !== "object" || value === null) {
    return null
  }

  const normalized: Partial<Record<ChoiceCardType, Record<string, number>>> = {}

  for (const [key, raw] of Object.entries(value)) {
    if (
      (key === "explanation" || key === "decision" || key === "actorLens" || key === "both") &&
      isNumberRecord(raw)
    ) {
      normalized[key] = raw
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : null
}

function isNumberRecord(value: unknown): value is Record<string, number> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every((entry) => typeof entry === "number")
  )
}

function isDimensionKey(value: string): value is DimensionKey {
  return (
    value === "securityCompetition" ||
    value === "institutions" ||
    value === "domesticFilters" ||
    value === "normsIdentity" ||
    value === "politicalEconomy" ||
    value === "restraint" ||
    value === "orderJustice"
  )
}
