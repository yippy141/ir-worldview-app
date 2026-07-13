import type { ModuleCardTypeRead, ModuleLaneSummary, ModuleSlug } from "@/lib/modules/types"
import type { PerspectiveRunSnapshot } from "@/lib/perspectives/types"
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

// The key is intentionally stable. Its suffix predates the schema version and
// changing it would strand existing profiles in a different localStorage slot.
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
  v: 4
  foundation: FoundationSnapshot | null
  foundationHistory: FoundationSnapshot[]
  modules: Partial<Record<ModuleSlug, ModuleSnapshot>>
  moduleHistory: ModuleSnapshot[]
  aiGovernance: AiGovernanceSnapshot | null
  aiHistory: AiGovernanceSnapshot[]
  perspectiveRuns: PerspectiveRunSnapshot[]
}

export function emptyProfileStore(): ProfileStore {
  return {
    v: 4,
    foundation: null,
    foundationHistory: [],
    modules: {},
    moduleHistory: [],
    aiGovernance: null,
    aiHistory: [],
    perspectiveRuns: [],
  }
}

export function parseProfileStore(raw: string | null): ProfileStore {
  if (!raw) return emptyProfileStore()

  try {
    const parsed = JSON.parse(raw) as {
      v?: unknown
      foundation?: unknown
      foundationHistory?: unknown
      modules?: unknown
      moduleHistory?: unknown
      aiGovernance?: unknown
      aiHistory?: unknown
      perspectiveRuns?: unknown
    }

    if (typeof parsed !== "object" || parsed === null) return emptyProfileStore()
    if (parsed.v !== 1 && parsed.v !== 2 && parsed.v !== 3 && parsed.v !== 4) {
      return emptyProfileStore()
    }

    const foundation = normalizeFoundationSnapshot(parsed.foundation)
    const modules = normalizeModuleSnapshots(parsed.modules)
    const aiGovernance = normalizeAiGovernanceSnapshot(parsed.aiGovernance)

    if (parsed.v !== 4) {
      return {
        v: 4,
        foundation,
        foundationHistory: foundation ? [foundation] : [],
        modules,
        moduleHistory: [],
        aiGovernance,
        aiHistory: [],
        perspectiveRuns: [],
      }
    }

    return {
      v: 4,
      foundation,
      foundationHistory: Array.isArray(parsed.foundationHistory)
        ? normalizeHistory(parsed.foundationHistory, normalizeFoundationSnapshot)
        : foundation
          ? [foundation]
          : [],
      modules,
      moduleHistory: normalizeHistory(parsed.moduleHistory, normalizeModuleHistorySnapshot),
      aiGovernance,
      aiHistory: normalizeHistory(parsed.aiHistory, normalizeAiGovernanceSnapshot),
      perspectiveRuns: normalizeHistory(
        parsed.perspectiveRuns,
        normalizePerspectiveRunSnapshot,
      ),
    }
  } catch {
    return emptyProfileStore()
  }
}

export function loadProfileStore(): ProfileStore {
  if (typeof window === "undefined") return emptyProfileStore()
  try {
    return parseProfileStore(window.localStorage.getItem(PROFILE_STORAGE_KEY))
  } catch {
    return emptyProfileStore()
  }
}

export function saveProfileStore(store: ProfileStore): boolean {
  if (typeof window === "undefined") return false
  try {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(store))
    return true
  } catch {
    // Blocked or full local storage must not crash a canonical result page.
    return false
  }
}

export function addFoundationSnapshot(
  store: ProfileStore,
  snapshot: FoundationSnapshot,
): ProfileStore {
  return {
    ...store,
    v: 4,
    foundation: snapshot,
    foundationHistory: appendSnapshots(
      appendSnapshots(store.foundationHistory, store.foundation, foundationSnapshotKey),
      snapshot,
      foundationSnapshotKey,
    ),
  }
}

export function addModuleSnapshot(store: ProfileStore, snapshot: ModuleSnapshot): ProfileStore {
  return {
    ...store,
    v: 4,
    modules: { ...store.modules, [snapshot.slug]: snapshot },
    moduleHistory: appendSnapshots(
      appendSnapshots(store.moduleHistory, store.modules[snapshot.slug], moduleSnapshotKey),
      snapshot,
      moduleSnapshotKey,
    ),
  }
}

export function addAiGovernanceSnapshot(
  store: ProfileStore,
  snapshot: AiGovernanceSnapshot,
): ProfileStore {
  return {
    ...store,
    v: 4,
    aiGovernance: snapshot,
    aiHistory: appendSnapshots(
      appendSnapshots(store.aiHistory, store.aiGovernance, aiSnapshotKey),
      snapshot,
      aiSnapshotKey,
    ),
  }
}

export function addPerspectiveRunSnapshot(
  store: ProfileStore,
  snapshot: PerspectiveRunSnapshot,
): ProfileStore {
  return {
    ...store,
    v: 4,
    perspectiveRuns: appendSnapshots(
      store.perspectiveRuns,
      snapshot,
      perspectiveSnapshotKey,
    ),
  }
}

export function removePerspectiveRunSnapshot(store: ProfileStore, id: string): ProfileStore {
  return {
    ...store,
    v: 4,
    perspectiveRuns: store.perspectiveRuns.filter((run) => run.id !== id),
  }
}

export function saveFoundationSnapshot(snapshot: FoundationSnapshot): boolean {
  return saveProfileStore(addFoundationSnapshot(loadProfileStore(), snapshot))
}

export function saveModuleSnapshot(snapshot: ModuleSnapshot): boolean {
  return saveProfileStore(addModuleSnapshot(loadProfileStore(), snapshot))
}

export function saveAiGovernanceSnapshot(snapshot: AiGovernanceSnapshot): boolean {
  return saveProfileStore(addAiGovernanceSnapshot(loadProfileStore(), snapshot))
}

export function savePerspectiveRunSnapshot(snapshot: PerspectiveRunSnapshot): boolean {
  return saveProfileStore(addPerspectiveRunSnapshot(loadProfileStore(), snapshot))
}

export function removePerspectiveRun(id: string): boolean {
  return saveProfileStore(removePerspectiveRunSnapshot(loadProfileStore(), id))
}

/** JavaScript Date's inclusive millisecond limit. */
const MAX_PROFILE_TIMESTAMP = 8_640_000_000_000_000

export function isValidProfileTimestamp(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= MAX_PROFILE_TIMESTAMP
  )
}

function appendSnapshots<T>(
  history: T[],
  snapshot: T | null | undefined,
  keyFor: (value: T) => string,
): T[] {
  if (!snapshot) return history
  const key = keyFor(snapshot)
  return [...history.filter((entry) => keyFor(entry) !== key), snapshot]
}

function foundationSnapshotKey(snapshot: FoundationSnapshot) {
  return `${snapshot.timestamp}:${snapshot.payload}`
}

function moduleSnapshotKey(snapshot: ModuleSnapshot) {
  return `${snapshot.timestamp}:${snapshot.slug}:${snapshot.resultPath}`
}

function aiSnapshotKey(snapshot: AiGovernanceSnapshot) {
  return `${snapshot.timestamp}:${snapshot.payload}`
}

function perspectiveSnapshotKey(snapshot: PerspectiveRunSnapshot) {
  return snapshot.id
}

function normalizeHistory<T>(
  value: unknown,
  normalize: (candidate: unknown) => T | null,
): T[] {
  if (!Array.isArray(value)) return []
  return value.map(normalize).filter((candidate): candidate is T => candidate !== null)
}

function normalizeModuleSnapshots(
  value: unknown,
): Partial<Record<ModuleSlug, ModuleSnapshot>> {
  if (typeof value !== "object" || value === null) return {}

  const normalized: Partial<Record<ModuleSlug, ModuleSnapshot>> = {}
  for (const [key, candidate] of Object.entries(value)) {
    if (key !== "security" && key !== "technology") continue
    const snapshot = normalizeModuleSnapshot(candidate, key)
    if (snapshot) normalized[key] = snapshot
  }
  return normalized
}

function normalizeModuleHistorySnapshot(value: unknown): ModuleSnapshot | null {
  if (typeof value !== "object" || value === null) return null
  const slug = (value as { slug?: unknown }).slug
  return slug === "security" || slug === "technology"
    ? normalizeModuleSnapshot(value, slug)
    : null
}

function normalizeModuleSnapshot(value: unknown, slug: ModuleSlug): ModuleSnapshot | null {
  if (typeof value !== "object" || value === null) return null

  const candidate = value as Partial<ModuleSnapshot> & {
    laneSummaries?: unknown
    overlayDeltas?: unknown
    cardTypeRead?: unknown
    cardTypeScores?: unknown
  }

  if (
    !isTimestamp(candidate.timestamp) ||
    candidate.slug !== slug ||
    typeof candidate.title !== "string" ||
    !isQuizMode(candidate.mode) ||
    typeof candidate.headline !== "string" ||
    typeof candidate.summary !== "string" ||
    typeof candidate.resultPath !== "string" ||
    !isNumberRecord(candidate.scores) ||
    !isStringArray(candidate.instincts) ||
    typeof candidate.challenge !== "string" ||
    !isStringArray(candidate.measures) ||
    !isStringArray(candidate.doesNotClaim) ||
    !Array.isArray(candidate.evidence)
  ) {
    return null
  }

  const cardTypeScores = normalizeCardTypeScores(candidate.cardTypeScores)

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
    scores: candidate.scores,
    instincts: candidate.instincts,
    ...(typeof candidate.comparison === "string" ? { comparison: candidate.comparison } : {}),
    challenge: candidate.challenge,
    measures: candidate.measures,
    doesNotClaim: candidate.doesNotClaim,
    evidence: normalizeEvidence(candidate.evidence),
    laneSummaries: normalizeLaneSummaries(candidate.laneSummaries),
    ...(isCardTypeRead(candidate.cardTypeRead) ? { cardTypeRead: candidate.cardTypeRead } : {}),
    ...(cardTypeScores ? { cardTypeScores } : {}),
    overlayDeltas: normalizeOverlayDeltas(candidate.overlayDeltas),
  }
}

function normalizeFoundationSnapshot(value: unknown): FoundationSnapshot | null {
  if (typeof value !== "object" || value === null) return null
  const candidate = value as Partial<FoundationSnapshot>

  if (
    !isTimestamp(candidate.timestamp) ||
    (candidate.mode !== undefined && !isQuizMode(candidate.mode)) ||
    typeof candidate.payload !== "string" ||
    typeof candidate.resultPath !== "string" ||
    !isFamilyKey(candidate.familyKey) ||
    typeof candidate.familyLabel !== "string" ||
    !isFamilyKey(candidate.runnerUpKey) ||
    typeof candidate.runnerUpLabel !== "string" ||
    typeof candidate.summary !== "string" ||
    !isStrategyModifier(candidate.strategyModifier) ||
    !isNormativeModifier(candidate.normativeModifier) ||
    !isDimensionScores(candidate.dimensionScores) ||
    !isKeyDriverArray(candidate.keyDrivers) ||
    !isLensArray(candidate.strongLenses)
  ) {
    return null
  }

  return candidate as FoundationSnapshot
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

function normalizeAiGovernanceSnapshot(value: unknown): AiGovernanceSnapshot | null {
  if (typeof value !== "object" || value === null) return null
  const candidate = value as Partial<AiGovernanceSnapshot>

  if (
    !isTimestamp(candidate.timestamp) ||
    typeof candidate.payload !== "string" ||
    typeof candidate.resultPath !== "string" ||
    !isAiArchetypeKey(candidate.archetypeKey) ||
    typeof candidate.archetypeLabel !== "string" ||
    !isRiskLens(candidate.riskLens) ||
    !isPaceModifier(candidate.paceModifier) ||
    !isGeopoliticsModifier(candidate.geopoliticsModifier) ||
    typeof candidate.summary !== "string" ||
    typeof candidate.governingInstinct !== "string" ||
    !isAiAxisScores(candidate.axisScores)
  ) {
    return null
  }

  return candidate as AiGovernanceSnapshot
}

function normalizePerspectiveRunSnapshot(value: unknown): PerspectiveRunSnapshot | null {
  if (typeof value !== "object" || value === null) return null
  const candidate = value as Partial<PerspectiveRunSnapshot> & {
    baselineDeltas?: unknown
    strongestShiftKeys?: unknown
  }

  if (
    typeof candidate.id !== "string" ||
    candidate.id.length === 0 ||
    !isTimestamp(candidate.timestamp) ||
    typeof candidate.perspectiveId !== "string" ||
    candidate.perspectiveId.length === 0 ||
    typeof candidate.perspectiveLabel !== "string" ||
    !Number.isInteger(candidate.scenarioSetVersion) ||
    (candidate.scenarioSetVersion ?? 0) < 1 ||
    !isDimensionScores(candidate.dimensionScores) ||
    !isDimensionDeltaRecord(candidate.baselineDeltas) ||
    !isDimensionKeyArray(candidate.strongestShiftKeys) ||
    typeof candidate.resultPath !== "string"
  ) {
    return null
  }

  return candidate as PerspectiveRunSnapshot
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
        isFiniteNumber(item.score) &&
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
  if (typeof value !== "object" || value === null) return {}
  const normalized: Partial<Record<DimensionKey, number>> = {}
  for (const [key, raw] of Object.entries(value)) {
    if (isDimensionKey(key) && isFiniteNumber(raw) && raw >= -6 && raw <= 6) {
      normalized[key] = raw
    }
  }
  return normalized
}

function normalizeCardTypeScores(
  value: unknown,
): Partial<Record<ChoiceCardType, Record<string, number>>> | null {
  if (typeof value !== "object" || value === null) return null
  const normalized: Partial<Record<ChoiceCardType, Record<string, number>>> = {}
  for (const [key, raw] of Object.entries(value)) {
    if (isChoiceCardType(key) && isNumberRecord(raw)) normalized[key] = raw
  }
  return Object.keys(normalized).length > 0 ? normalized : null
}

function isDimensionScores(value: unknown): value is DimensionScores {
  if (typeof value !== "object" || value === null) return false
  const record = value as Record<string, unknown>
  return DIMENSION_KEYS.every((key) => isScaleScore(record[key]))
}

function isDimensionDeltaRecord(
  value: unknown,
): value is Partial<Record<DimensionKey, number>> {
  if (typeof value !== "object" || value === null) return false
  return Object.entries(value).every(
    ([key, raw]) => isDimensionKey(key) && isFiniteNumber(raw) && raw >= -6 && raw <= 6,
  )
}

function isDimensionKeyArray(value: unknown): value is DimensionKey[] {
  return (
    Array.isArray(value) &&
    value.every((key) => typeof key === "string" && isDimensionKey(key)) &&
    new Set(value).size === value.length
  )
}

function isAiAxisScores(value: unknown): value is AiAxisScores {
  if (typeof value !== "object" || value === null) return false
  return AI_AXIS_KEYS.every((axis) => isScaleScore((value as Record<AiAxisKey, unknown>)[axis]))
}

function isKeyDriverArray(value: unknown): value is ProfileKeyDriver[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as ProfileKeyDriver).label === "string" &&
        typeof (item as ProfileKeyDriver).description === "string" &&
        typeof (item as ProfileKeyDriver).type === "string",
    )
  )
}

function isLensArray(value: unknown): value is ProfileLens[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as ProfileLens).label === "string" &&
        typeof (item as ProfileLens).description === "string",
    )
  )
}

function isNumberRecord(value: unknown): value is Record<string, number> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every(isFiniteNumber)
  )
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string")
}

function isTimestamp(value: unknown): value is number {
  return isValidProfileTimestamp(value)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

function isScaleScore(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 1 && value <= 7
}

const DIMENSION_KEYS: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

function isDimensionKey(value: string): value is DimensionKey {
  return DIMENSION_KEYS.includes(value as DimensionKey)
}

function isQuizMode(value: unknown): value is QuizMode {
  return value === "standard" || value === "analyst"
}

function isFamilyKey(value: unknown): value is FamilyKey {
  return (
    value === "realist" ||
    value === "institutionalist" ||
    value === "constructivist" ||
    value === "criticalPoliticalEconomy"
  )
}

function isStrategyModifier(value: unknown): value is StrategyModifier {
  return value === "Restrainer" || value === "Hedger" || value === "Maximizer"
}

function isNormativeModifier(value: unknown): value is NormativeModifier {
  return (
    value === "Pluralist" ||
    value === "Conditional Solidarist" ||
    value === "Universalist"
  )
}

function isChoiceCardType(value: string): value is ChoiceCardType {
  return value === "explanation" || value === "decision" || value === "actorLens" || value === "both"
}

function isAiArchetypeKey(value: unknown): value is AiArchetypeKey {
  return (
    value === "precautionarySteward" ||
    value === "strategicCompetitor" ||
    value === "coordinationArchitect" ||
    value === "democraticGuardrailist" ||
    value === "stateCapacityBuilder" ||
    value === "openEcosystemBuilder"
  )
}

function isRiskLens(value: unknown): value is RiskLens {
  return (
    value === "Present-harms first" ||
    value === "Mixed risk lens" ||
    value === "Frontier-risk first"
  )
}

function isPaceModifier(value: unknown): value is PaceModifier {
  return (
    value === "Deployment-first" ||
    value === "Threshold guardrails" ||
    value === "Precaution-first"
  )
}

function isGeopoliticsModifier(value: unknown): value is GeopoliticsModifier {
  return (
    value === "Competition-first" ||
    value === "Competitive hedger" ||
    value === "Coordination-first"
  )
}
