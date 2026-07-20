import {
  buildModuleAnalytics,
  decodeModulePayload,
  getModuleDefinition,
  getSelectedModuleOptions,
} from "@/lib/modules/framework"
import type {
  ModuleCardTypeRead,
  ModuleLaneSummary,
  ModuleSlug,
} from "@/lib/modules/types"
import type { PerspectiveRunSnapshot } from "@/lib/perspectives/types"
import { getPerspectiveDefinition } from "@/lib/perspectives/catalog"
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
import type { Locale } from "@/i18n/routing"
import { publicPath } from "@/i18n/paths"
import {
  LEGACY_ENGLISH_PROVENANCE,
  isCompletionLocale,
  isLocaleCopyVersion,
  type CompletionProvenance,
} from "@/lib/locale-provenance"
import { resolveFoundationPayload } from "@/lib/share"
import { buildFoundationNarrative } from "@/lib/narrative/foundation"
import {
  familyLabelFromKey,
  getKeyDrivers,
  getStrongLenses,
} from "@/lib/result-helpers"
import { decodeAiPayload, aiPayloadToAxisScores } from "@/lib/ai-governance-share"
import {
  archetypeLabelFromKey,
  buildAiGovernanceSummary,
} from "@/lib/ai-governance-results"
import {
  buildAiGovernanceDeepDive,
  buildAiGovernanceResultFromSharePayload,
} from "@/lib/ai-governance-results-v2"
import { PROFILE_STORAGE_KEY } from "@/lib/storage-keys"

export { PROFILE_STORAGE_KEY } from "@/lib/storage-keys"

// The key is intentionally stable. Its suffix predates the schema version and
// changing it would strand existing profiles in a different localStorage slot.
export type ProfileKeyDriver = {
  label: string
  description: string
  type: string
}

export type ProfileLens = {
  label: string
  description: string
}

export type FoundationLegacyEnglishCopy = {
  resultPath: string
  familyLabel: string
  runnerUpLabel: string
  summary: string
  keyDrivers: ProfileKeyDriver[]
  strongLenses: ProfileLens[]
}

export type FoundationSnapshot = {
  timestamp: number
  mode?: QuizMode
  payload: string
  instrumentStructuralVersion: number
  scoringVersion: number
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
  locale: Locale
  localeCopyVersion: number
  legacyEnglishCopy?: FoundationLegacyEnglishCopy
}

export type ModuleEvidenceItem = {
  question: string
  primary: string
  secondary?: string
}

export type ModuleLegacyEnglishCopy = {
  title: string
  subtitle?: string
  shorthand?: string
  headline: string
  summary: string
  resultPath: string
  instincts: string[]
  comparison?: string
  challenge: string
  measures: string[]
  doesNotClaim: string[]
  evidence: ModuleEvidenceItem[]
  laneSummaries: ModuleLaneSummary[]
  cardTypeRead?: ModuleCardTypeRead
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
  /** Canonical module result token. Legacy records may not have a decodable token. */
  payload?: string
  /** Foundation token used for the comparison at completion time. */
  foundationPayload?: string
  laneScores: Record<string, Record<string, number>>
  instrumentVersion: number
  locale: Locale
  localeCopyVersion: number
  legacyEnglishCopy?: ModuleLegacyEnglishCopy
}

export type AiGovernanceLegacyEnglishCopy = {
  resultPath: string
  archetypeLabel: string
  summary: string
  governingInstinct: string
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
  locale: Locale
  localeCopyVersion: number
  legacyEnglishCopy?: AiGovernanceLegacyEnglishCopy
}

export type ProfileStore = {
  v: 5
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
    v: 5,
    foundation: null,
    foundationHistory: [],
    modules: {},
    moduleHistory: [],
    aiGovernance: null,
    aiHistory: [],
    perspectiveRuns: [],
  }
}

export function parseProfileStore(raw: string | null, locale: Locale = "en"): ProfileStore {
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
    if (
      parsed.v !== 1 &&
      parsed.v !== 2 &&
      parsed.v !== 3 &&
      parsed.v !== 4 &&
      parsed.v !== 5
    ) {
      return emptyProfileStore()
    }

    const legacy = parsed.v !== 5
    const foundation = normalizeFoundationSnapshot(parsed.foundation, locale, legacy)
    const modules = normalizeModuleSnapshots(parsed.modules, locale, legacy)
    const aiGovernance = normalizeAiGovernanceSnapshot(parsed.aiGovernance, locale, legacy)

    if (parsed.v !== 4) {
      if (parsed.v === 5) {
        return {
          v: 5,
          foundation,
          foundationHistory: Array.isArray(parsed.foundationHistory)
            ? normalizeHistory(parsed.foundationHistory, (value) =>
                normalizeFoundationSnapshot(value, locale, false))
            : foundation
              ? [foundation]
              : [],
          modules,
          moduleHistory: normalizeHistory(parsed.moduleHistory, (value) =>
            normalizeModuleHistorySnapshot(value, locale, false)),
          aiGovernance,
          aiHistory: normalizeHistory(parsed.aiHistory, (value) =>
            normalizeAiGovernanceSnapshot(value, locale, false)),
          perspectiveRuns: normalizeHistory(parsed.perspectiveRuns, (value) =>
            normalizePerspectiveRunSnapshot(value, locale, false)),
        }
      }

      return {
        v: 5,
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
      v: 5,
      foundation,
      foundationHistory: Array.isArray(parsed.foundationHistory)
        ? normalizeHistory(parsed.foundationHistory, (value) =>
            normalizeFoundationSnapshot(value, locale, true))
        : foundation
          ? [foundation]
          : [],
      modules,
      moduleHistory: normalizeHistory(parsed.moduleHistory, (value) =>
        normalizeModuleHistorySnapshot(value, locale, true)),
      aiGovernance,
      aiHistory: normalizeHistory(parsed.aiHistory, (value) =>
        normalizeAiGovernanceSnapshot(value, locale, true)),
      perspectiveRuns: normalizeHistory(
        parsed.perspectiveRuns,
        (value) => normalizePerspectiveRunSnapshot(value, locale, true),
      ),
    }
  } catch {
    return emptyProfileStore()
  }
}

export function loadProfileStore(locale: Locale = "en"): ProfileStore {
  if (typeof window === "undefined") return emptyProfileStore()
  try {
    return parseProfileStore(window.localStorage.getItem(PROFILE_STORAGE_KEY), locale)
  } catch {
    return emptyProfileStore()
  }
}

export function saveProfileStore(store: ProfileStore): boolean {
  if (typeof window === "undefined") return false
  try {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, serializeProfileStore(store))
    return true
  } catch {
    // Blocked or full local storage must not crash a canonical result page.
    return false
  }
}

export function serializeProfileStore(store: ProfileStore): string {
  return JSON.stringify({
    v: 5,
    foundation: store.foundation ? persistFoundationSnapshot(store.foundation) : null,
    foundationHistory: store.foundationHistory.map(persistFoundationSnapshot),
    modules: Object.fromEntries(
      Object.entries(store.modules).map(([slug, snapshot]) => [
        slug,
        persistModuleSnapshot(snapshot),
      ]),
    ),
    moduleHistory: store.moduleHistory.map(persistModuleSnapshot),
    aiGovernance: store.aiGovernance ? persistAiGovernanceSnapshot(store.aiGovernance) : null,
    aiHistory: store.aiHistory.map(persistAiGovernanceSnapshot),
    perspectiveRuns: store.perspectiveRuns.map(persistPerspectiveRunSnapshot),
  })
}

export function addFoundationSnapshot(
  store: ProfileStore,
  snapshot: FoundationSnapshot,
): ProfileStore {
  return {
    ...store,
    v: 5,
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
    v: 5,
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
    v: 5,
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
    v: 5,
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
    v: 5,
    perspectiveRuns: store.perspectiveRuns.filter((run) => run.id !== id),
  }
}

export function saveFoundationSnapshot(snapshot: FoundationSnapshot): boolean {
  return saveProfileStore(addFoundationSnapshot(loadProfileStore(snapshot.locale), snapshot))
}

export function saveModuleSnapshot(snapshot: ModuleSnapshot): boolean {
  return saveProfileStore(addModuleSnapshot(loadProfileStore(snapshot.locale), snapshot))
}

export function saveAiGovernanceSnapshot(snapshot: AiGovernanceSnapshot): boolean {
  return saveProfileStore(addAiGovernanceSnapshot(loadProfileStore(snapshot.locale), snapshot))
}

export function savePerspectiveRunSnapshot(snapshot: PerspectiveRunSnapshot): boolean {
  return saveProfileStore(addPerspectiveRunSnapshot(loadProfileStore(snapshot.locale), snapshot))
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
  locale: Locale,
  legacy: boolean,
): Partial<Record<ModuleSlug, ModuleSnapshot>> {
  if (typeof value !== "object" || value === null) return {}

  const normalized: Partial<Record<ModuleSlug, ModuleSnapshot>> = {}
  for (const [key, candidate] of Object.entries(value)) {
    if (key !== "security" && key !== "technology") continue
    const snapshot = normalizeModuleSnapshot(candidate, key, locale, legacy)
    if (snapshot) normalized[key] = snapshot
  }
  return normalized
}

function normalizeModuleHistorySnapshot(
  value: unknown,
  locale: Locale,
  legacy: boolean,
): ModuleSnapshot | null {
  if (typeof value !== "object" || value === null) return null
  const slug = (value as { slug?: unknown }).slug
  return slug === "security" || slug === "technology"
    ? normalizeModuleSnapshot(value, slug, locale, legacy)
    : null
}

function normalizeModuleSnapshot(
  value: unknown,
  slug: ModuleSlug,
  renderLocale: Locale,
  legacy: boolean,
): ModuleSnapshot | null {
  if (typeof value !== "object" || value === null) return null

  const candidate = value as Partial<ModuleSnapshot> & {
    laneSummaries?: unknown
    overlayDeltas?: unknown
    cardTypeRead?: unknown
    cardTypeScores?: unknown
    laneScores?: unknown
    legacyEnglishCopy?: unknown
  }

  if (
    !isTimestamp(candidate.timestamp) ||
    candidate.slug !== slug ||
    !isQuizMode(candidate.mode) ||
    !isNumberRecord(candidate.scores) ||
    (legacy && !isLegacyModuleDisplay(candidate))
  ) {
    return null
  }

  const provenance = normalizeProvenance(candidate, legacy)
  if (!provenance) return null

  const pathTokens = legacy && typeof candidate.resultPath === "string"
    ? extractModuleResultTokens(candidate.resultPath, slug)
    : null
  const payload = typeof candidate.payload === "string"
    ? candidate.payload
    : pathTokens?.payload
  const foundationPayload = typeof candidate.foundationPayload === "string"
    ? candidate.foundationPayload
    : pathTokens?.foundationPayload
  const decoded = payload ? decodeModulePayload(payload) : null
  const moduleDefinition = getModuleDefinition(slug)
  const decodedAnalytics = decoded && moduleDefinition && decoded.slug === slug
    ? buildModuleAnalytics(moduleDefinition, decoded.mode, decoded.answers)
    : null
  const laneScores = normalizeLaneScores(candidate.laneScores) ?? decodedAnalytics?.laneScores ?? {}
  const cardTypeScores = normalizeCardTypeScores(candidate.cardTypeScores)
    ?? decodedAnalytics?.cardTypeScores
    ?? null
  const overlayDeltas = normalizeOverlayDeltas(candidate.overlayDeltas)
  const legacyEnglishCopy = legacy
    ? moduleLegacyEnglishCopy(candidate)
    : normalizeModuleLegacyEnglishCopy(candidate.legacyEnglishCopy)
  const display = buildModuleDisplay({
    slug,
    mode: candidate.mode,
    payload,
    foundationPayload,
    scores: candidate.scores,
    laneScores,
    cardTypeScores: cardTypeScores ?? {},
    overlayDeltas,
    renderLocale,
    fallback: legacyEnglishCopy,
  })
  if (!display) return null

  return {
    timestamp: candidate.timestamp,
    slug,
    mode: candidate.mode,
    ...display,
    scores: candidate.scores,
    ...(cardTypeScores ? { cardTypeScores } : {}),
    overlayDeltas,
    ...(payload ? { payload } : {}),
    ...(foundationPayload ? { foundationPayload } : {}),
    laneScores,
    instrumentVersion:
      typeof candidate.instrumentVersion === "number" &&
      Number.isInteger(candidate.instrumentVersion) &&
      candidate.instrumentVersion >= 1
        ? candidate.instrumentVersion
        : decoded?.v ?? 1,
    ...provenance,
    ...(legacyEnglishCopy ? { legacyEnglishCopy } : {}),
  }
}

function normalizeFoundationSnapshot(
  value: unknown,
  renderLocale: Locale,
  legacy: boolean,
): FoundationSnapshot | null {
  if (typeof value !== "object" || value === null) return null
  const candidate = value as Partial<FoundationSnapshot> & { legacyEnglishCopy?: unknown }

  if (
    !isTimestamp(candidate.timestamp) ||
    (candidate.mode !== undefined && !isQuizMode(candidate.mode)) ||
    typeof candidate.payload !== "string" ||
    !isFamilyKey(candidate.familyKey) ||
    !isFamilyKey(candidate.runnerUpKey) ||
    !isStrategyModifier(candidate.strategyModifier) ||
    !isNormativeModifier(candidate.normativeModifier) ||
    !isDimensionScores(candidate.dimensionScores) ||
    (legacy && !isLegacyFoundationDisplay(candidate))
  ) {
    return null
  }

  const provenance = normalizeProvenance(candidate, legacy)
  if (!provenance) return null
  const payloadRecord = resolveFoundationPayload(candidate.payload)?.provenance
  const legacyEnglishCopy = legacy
    ? foundationLegacyEnglishCopy(candidate)
    : normalizeFoundationLegacyEnglishCopy(candidate.legacyEnglishCopy)
  const familyLabel = familyLabelFromKey(candidate.familyKey)
  const runnerUpLabel = familyLabelFromKey(candidate.runnerUpKey)
  const narrative = buildFoundationNarrative({
    familyKey: candidate.familyKey,
    runnerUpKey: candidate.runnerUpKey,
    strategyModifier: candidate.strategyModifier,
    normativeModifier: candidate.normativeModifier,
    dimensionScores: candidate.dimensionScores,
  })

  return {
    timestamp: candidate.timestamp,
    ...(candidate.mode ? { mode: candidate.mode } : {}),
    payload: candidate.payload,
    instrumentStructuralVersion:
      isNonNegativeVersion(candidate.instrumentStructuralVersion)
        ? candidate.instrumentStructuralVersion
        : payloadRecord?.instrumentStructuralVersion ?? 0,
    scoringVersion:
      isNonNegativeVersion(candidate.scoringVersion)
        ? candidate.scoringVersion
        : payloadRecord?.scoringVersion ?? 0,
    resultPath: publicPath(renderLocale, `/results/${candidate.payload}`),
    familyKey: candidate.familyKey,
    familyLabel,
    runnerUpKey: candidate.runnerUpKey,
    runnerUpLabel,
    summary: narrative.summary,
    dimensionScores: candidate.dimensionScores,
    strategyModifier: candidate.strategyModifier,
    normativeModifier: candidate.normativeModifier,
    keyDrivers: getKeyDrivers(candidate.dimensionScores).map((driver) => ({
      type: driver.type,
      label: driver.label,
      description: driver.description,
    })),
    strongLenses: getStrongLenses(candidate.dimensionScores).map((lens) => ({
      label: lens.label,
      description: lens.description,
    })),
    ...provenance,
    ...(legacyEnglishCopy ? { legacyEnglishCopy } : {}),
  }
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

function normalizeAiGovernanceSnapshot(
  value: unknown,
  renderLocale: Locale,
  legacy: boolean,
): AiGovernanceSnapshot | null {
  if (typeof value !== "object" || value === null) return null
  const candidate = value as Partial<AiGovernanceSnapshot> & { legacyEnglishCopy?: unknown }

  if (
    !isTimestamp(candidate.timestamp) ||
    typeof candidate.payload !== "string" ||
    !isAiArchetypeKey(candidate.archetypeKey) ||
    !isRiskLens(candidate.riskLens) ||
    !isPaceModifier(candidate.paceModifier) ||
    !isGeopoliticsModifier(candidate.geopoliticsModifier) ||
    !isAiAxisScores(candidate.axisScores) ||
    (legacy && !isLegacyAiDisplay(candidate))
  ) {
    return null
  }

  const provenance = normalizeProvenance(candidate, legacy)
  if (!provenance) return null
  const legacyEnglishCopy = legacy
    ? aiLegacyEnglishCopy(candidate)
    : normalizeAiLegacyEnglishCopy(candidate.legacyEnglishCopy)
  const decoded = decodeAiPayload(candidate.payload)
  const archetypeLabel = archetypeLabelFromKey(candidate.archetypeKey)
  const summary = buildAiGovernanceSummary(
    candidate.archetypeKey,
    candidate.axisScores,
    candidate.riskLens,
    candidate.paceModifier,
  )
  const governingInstinct = decoded
    ? buildAiGovernanceDeepDive(
        buildAiGovernanceResultFromSharePayload(decoded),
      ).governingInstinct
    : legacyEnglishCopy?.governingInstinct ?? ""

  return {
    timestamp: candidate.timestamp,
    payload: candidate.payload,
    resultPath: publicPath(renderLocale, `/ai/results/${candidate.payload}`),
    archetypeKey: candidate.archetypeKey,
    archetypeLabel,
    riskLens: candidate.riskLens,
    paceModifier: candidate.paceModifier,
    geopoliticsModifier: candidate.geopoliticsModifier,
    axisScores: candidate.axisScores,
    summary,
    governingInstinct,
    ...provenance,
    ...(legacyEnglishCopy ? { legacyEnglishCopy } : {}),
  }
}

function normalizePerspectiveRunSnapshot(
  value: unknown,
  renderLocale: Locale,
  legacy: boolean,
): PerspectiveRunSnapshot | null {
  if (typeof value !== "object" || value === null) return null
  const candidate = value as Partial<PerspectiveRunSnapshot> & {
    baselineDeltas?: unknown
    strongestShiftKeys?: unknown
    legacyEnglishCopy?: unknown
  }

  if (
    typeof candidate.id !== "string" ||
    candidate.id.length === 0 ||
    !isTimestamp(candidate.timestamp) ||
    typeof candidate.perspectiveId !== "string" ||
    candidate.perspectiveId.length === 0 ||
    !Number.isInteger(candidate.scenarioSetVersion) ||
    (candidate.scenarioSetVersion ?? 0) < 1 ||
    !isDimensionScores(candidate.dimensionScores) ||
    !isDimensionDeltaRecord(candidate.baselineDeltas) ||
    !isDimensionKeyArray(candidate.strongestShiftKeys) ||
    (legacy &&
      (typeof candidate.perspectiveLabel !== "string" ||
        typeof candidate.resultPath !== "string"))
  ) {
    return null
  }

  const provenance = normalizeProvenance(candidate, legacy)
  if (!provenance) return null
  const legacyCopy = legacy
    ? {
        perspectiveLabel: candidate.perspectiveLabel as string,
        resultPath: candidate.resultPath as string,
      }
    : normalizePerspectiveLegacyEnglishCopy(candidate.legacyEnglishCopy)
  const payload = typeof candidate.payload === "string"
    ? candidate.payload
    : legacyCopy
      ? extractPerspectivePayload(legacyCopy.resultPath, candidate.perspectiveId)
      : undefined
  const definition = getPerspectiveDefinition(candidate.perspectiveId)
  const perspectiveLabel = definition?.label ?? legacyCopy?.perspectiveLabel
  if (!perspectiveLabel) return null

  return {
    id: candidate.id,
    timestamp: candidate.timestamp,
    perspectiveId: candidate.perspectiveId,
    perspectiveLabel,
    scenarioSetVersion: candidate.scenarioSetVersion as number,
    dimensionScores: candidate.dimensionScores,
    baselineDeltas: candidate.baselineDeltas,
    strongestShiftKeys: candidate.strongestShiftKeys,
    resultPath: payload
      ? publicPath(
          renderLocale,
          `/perspectives/${candidate.perspectiveId}/result/${payload}`,
        )
      : legacyCopy?.resultPath ?? "",
    ...(payload ? { payload } : {}),
    ...provenance,
    ...(legacyCopy ? { legacyEnglishCopy: legacyCopy } : {}),
  }
}

function persistFoundationSnapshot(snapshot: FoundationSnapshot) {
  return {
    timestamp: snapshot.timestamp,
    ...(snapshot.mode ? { mode: snapshot.mode } : {}),
    payload: snapshot.payload,
    instrumentStructuralVersion: snapshot.instrumentStructuralVersion,
    scoringVersion: snapshot.scoringVersion,
    familyKey: snapshot.familyKey,
    runnerUpKey: snapshot.runnerUpKey,
    dimensionScores: snapshot.dimensionScores,
    strategyModifier: snapshot.strategyModifier,
    normativeModifier: snapshot.normativeModifier,
    locale: snapshot.locale,
    localeCopyVersion: snapshot.localeCopyVersion,
    ...(snapshot.legacyEnglishCopy
      ? { legacyEnglishCopy: snapshot.legacyEnglishCopy }
      : {}),
  }
}

function persistModuleSnapshot(snapshot: ModuleSnapshot) {
  return {
    timestamp: snapshot.timestamp,
    slug: snapshot.slug,
    mode: snapshot.mode,
    ...(snapshot.payload ? { payload: snapshot.payload } : {}),
    ...(snapshot.foundationPayload
      ? { foundationPayload: snapshot.foundationPayload }
      : {}),
    scores: snapshot.scores,
    laneScores: snapshot.laneScores,
    ...(snapshot.cardTypeScores ? { cardTypeScores: snapshot.cardTypeScores } : {}),
    overlayDeltas: snapshot.overlayDeltas,
    instrumentVersion: snapshot.instrumentVersion,
    locale: snapshot.locale,
    localeCopyVersion: snapshot.localeCopyVersion,
    ...(snapshot.legacyEnglishCopy
      ? { legacyEnglishCopy: snapshot.legacyEnglishCopy }
      : {}),
  }
}

function persistAiGovernanceSnapshot(snapshot: AiGovernanceSnapshot) {
  return {
    timestamp: snapshot.timestamp,
    payload: snapshot.payload,
    archetypeKey: snapshot.archetypeKey,
    riskLens: snapshot.riskLens,
    paceModifier: snapshot.paceModifier,
    geopoliticsModifier: snapshot.geopoliticsModifier,
    axisScores: snapshot.axisScores,
    locale: snapshot.locale,
    localeCopyVersion: snapshot.localeCopyVersion,
    ...(snapshot.legacyEnglishCopy
      ? { legacyEnglishCopy: snapshot.legacyEnglishCopy }
      : {}),
  }
}

function persistPerspectiveRunSnapshot(snapshot: PerspectiveRunSnapshot) {
  return {
    id: snapshot.id,
    timestamp: snapshot.timestamp,
    perspectiveId: snapshot.perspectiveId,
    scenarioSetVersion: snapshot.scenarioSetVersion,
    dimensionScores: snapshot.dimensionScores,
    baselineDeltas: snapshot.baselineDeltas,
    strongestShiftKeys: snapshot.strongestShiftKeys,
    ...(snapshot.payload ? { payload: snapshot.payload } : {}),
    locale: snapshot.locale,
    localeCopyVersion: snapshot.localeCopyVersion,
    ...(snapshot.legacyEnglishCopy
      ? { legacyEnglishCopy: snapshot.legacyEnglishCopy }
      : {}),
  }
}

function normalizeProvenance(
  candidate: Partial<CompletionProvenance>,
  legacy: boolean,
): CompletionProvenance | null {
  if (legacy) return { ...LEGACY_ENGLISH_PROVENANCE }
  return isCompletionLocale(candidate.locale) &&
    isLocaleCopyVersion(candidate.localeCopyVersion)
    ? {
        locale: candidate.locale,
        localeCopyVersion: candidate.localeCopyVersion,
      }
    : null
}

function isNonNegativeVersion(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0
}

function isLegacyFoundationDisplay(
  candidate: Partial<FoundationSnapshot>,
): candidate is Partial<FoundationSnapshot> & FoundationLegacyEnglishCopy {
  return (
    typeof candidate.resultPath === "string" &&
    typeof candidate.familyLabel === "string" &&
    typeof candidate.runnerUpLabel === "string" &&
    typeof candidate.summary === "string" &&
    isKeyDriverArray(candidate.keyDrivers) &&
    isLensArray(candidate.strongLenses)
  )
}

function foundationLegacyEnglishCopy(
  candidate: Partial<FoundationSnapshot>,
): FoundationLegacyEnglishCopy | null {
  if (!isLegacyFoundationDisplay(candidate)) return null
  return {
    resultPath: candidate.resultPath,
    familyLabel: candidate.familyLabel,
    runnerUpLabel: candidate.runnerUpLabel,
    summary: candidate.summary,
    keyDrivers: candidate.keyDrivers,
    strongLenses: candidate.strongLenses,
  }
}

function normalizeFoundationLegacyEnglishCopy(
  value: unknown,
): FoundationLegacyEnglishCopy | null {
  return typeof value === "object" && value !== null
    ? foundationLegacyEnglishCopy(value as Partial<FoundationSnapshot>)
    : null
}

function isLegacyModuleDisplay(candidate: Partial<ModuleSnapshot>) {
  return (
    typeof candidate.title === "string" &&
    typeof candidate.headline === "string" &&
    typeof candidate.summary === "string" &&
    typeof candidate.resultPath === "string" &&
    isStringArray(candidate.instincts) &&
    typeof candidate.challenge === "string" &&
    isStringArray(candidate.measures) &&
    isStringArray(candidate.doesNotClaim) &&
    Array.isArray(candidate.evidence)
  )
}

function moduleLegacyEnglishCopy(
  candidate: Partial<ModuleSnapshot> & {
    laneSummaries?: unknown
    cardTypeRead?: unknown
  },
): ModuleLegacyEnglishCopy | null {
  if (!isLegacyModuleDisplay(candidate)) return null
  return {
    title: candidate.title as string,
    ...(typeof candidate.subtitle === "string" ? { subtitle: candidate.subtitle } : {}),
    ...(typeof candidate.shorthand === "string" ? { shorthand: candidate.shorthand } : {}),
    headline: candidate.headline as string,
    summary: candidate.summary as string,
    resultPath: candidate.resultPath as string,
    instincts: candidate.instincts as string[],
    ...(typeof candidate.comparison === "string"
      ? { comparison: candidate.comparison }
      : {}),
    challenge: candidate.challenge as string,
    measures: candidate.measures as string[],
    doesNotClaim: candidate.doesNotClaim as string[],
    evidence: normalizeEvidence(candidate.evidence),
    laneSummaries: normalizeLaneSummaries(candidate.laneSummaries),
    ...(isCardTypeRead(candidate.cardTypeRead)
      ? { cardTypeRead: candidate.cardTypeRead }
      : {}),
  }
}

function normalizeModuleLegacyEnglishCopy(
  value: unknown,
): ModuleLegacyEnglishCopy | null {
  return typeof value === "object" && value !== null
    ? moduleLegacyEnglishCopy(value as Partial<ModuleSnapshot>)
    : null
}

function isLegacyAiDisplay(candidate: Partial<AiGovernanceSnapshot>) {
  return (
    typeof candidate.resultPath === "string" &&
    typeof candidate.archetypeLabel === "string" &&
    typeof candidate.summary === "string" &&
    typeof candidate.governingInstinct === "string"
  )
}

function aiLegacyEnglishCopy(
  candidate: Partial<AiGovernanceSnapshot>,
): AiGovernanceLegacyEnglishCopy | null {
  if (!isLegacyAiDisplay(candidate)) return null
  return {
    resultPath: candidate.resultPath as string,
    archetypeLabel: candidate.archetypeLabel as string,
    summary: candidate.summary as string,
    governingInstinct: candidate.governingInstinct as string,
  }
}

function normalizeAiLegacyEnglishCopy(
  value: unknown,
): AiGovernanceLegacyEnglishCopy | null {
  return typeof value === "object" && value !== null
    ? aiLegacyEnglishCopy(value as Partial<AiGovernanceSnapshot>)
    : null
}

function normalizePerspectiveLegacyEnglishCopy(value: unknown) {
  if (typeof value !== "object" || value === null) return null
  const candidate = value as { perspectiveLabel?: unknown; resultPath?: unknown }
  return typeof candidate.perspectiveLabel === "string" &&
    typeof candidate.resultPath === "string"
    ? {
        perspectiveLabel: candidate.perspectiveLabel,
        resultPath: candidate.resultPath,
      }
    : null
}

type ModuleDisplay = Pick<
  ModuleSnapshot,
  | "title"
  | "subtitle"
  | "shorthand"
  | "headline"
  | "summary"
  | "resultPath"
  | "instincts"
  | "comparison"
  | "challenge"
  | "measures"
  | "doesNotClaim"
  | "evidence"
  | "laneSummaries"
  | "cardTypeRead"
>

function buildModuleDisplay({
  slug,
  mode,
  payload,
  foundationPayload,
  scores,
  laneScores,
  cardTypeScores,
  overlayDeltas: _overlayDeltas,
  renderLocale,
  fallback,
}: {
  slug: ModuleSlug
  mode: QuizMode
  payload?: string
  foundationPayload?: string
  scores: Record<string, number>
  laneScores: Record<string, Record<string, number>>
  cardTypeScores: Partial<Record<ChoiceCardType, Record<string, number>>>
  overlayDeltas: Partial<Record<DimensionKey, number>>
  renderLocale: Locale
  fallback: ModuleLegacyEnglishCopy | null
}): ModuleDisplay | null {
  const definition = getModuleDefinition(slug)
  if (!definition) return fallback
  const hasScores = definition.axes.every((axis) => isFiniteNumber(scores[axis.key]))
  const hasLaneScores = definition.lanes.every((lane) => isNumberRecord(laneScores[lane.key]))
  const analytics = { scores, laneScores, cardTypeScores }
  const foundation = foundationPayload
    ? resolveFoundationPayload(foundationPayload)?.dimensionScores
    : undefined
  const interpretation = hasScores ? definition.interpret(analytics) : null
  const laneSummaries = hasLaneScores
    ? definition.summarizeLanes(analytics, foundation)
    : fallback?.laneSummaries ?? []
  const cardTypeRead = definition.summarizeCardTypes?.(analytics)
    ?? fallback?.cardTypeRead
  const decoded = payload ? decodeModulePayload(payload) : null
  const evidence = decoded && decoded.slug === slug
    ? getSelectedModuleOptions(definition, decoded.mode, decoded.answers).map(
        ({ question, primary, secondary }) => ({
          question: question.title,
          primary: primary?.title ?? "No selection",
          ...(secondary?.title ? { secondary: secondary.title } : {}),
        }),
      )
    : fallback?.evidence ?? []
  const resultPath = payload
    ? `${publicPath(renderLocale, `/modules/${slug}/results/${payload}`)}${
        foundationPayload
          ? `?foundation=${encodeURIComponent(foundationPayload)}`
          : ""
      }`
    : fallback?.resultPath ?? ""

  if (!interpretation && !fallback) return null

  return {
    title: definition.shortTitle,
    subtitle: definition.subtitle,
    shorthand: definition.shorthand,
    headline: interpretation?.headline ?? fallback?.headline ?? "",
    summary: interpretation?.summary ?? fallback?.summary ?? "",
    resultPath,
    instincts: interpretation?.instincts ?? fallback?.instincts ?? [],
    ...(foundation && definition.compareToFoundation
      ? { comparison: definition.compareToFoundation(analytics, foundation) }
      : fallback?.comparison
        ? { comparison: fallback.comparison }
        : {}),
    challenge: interpretation?.challenge ?? fallback?.challenge ?? "",
    measures: definition.measures,
    doesNotClaim: definition.doesNotClaim,
    evidence,
    laneSummaries,
    ...(cardTypeRead ? { cardTypeRead } : {}),
  }
}

function extractModuleResultTokens(resultPath: string, slug: ModuleSlug) {
  try {
    const url = new URL(resultPath, "https://inventory.local")
    const pathname = url.pathname.replace(/^\/zh(?=\/)/, "")
    const prefix = `/modules/${slug}/results/`
    if (!pathname.startsWith(prefix)) return null
    const payload = pathname.slice(prefix.length)
    const decoded = decodeModulePayload(payload)
    if (!decoded || decoded.slug !== slug) return null
    const foundationPayload = url.searchParams.get("foundation") ?? undefined
    return {
      payload,
      ...(foundationPayload && resolveFoundationPayload(foundationPayload)
        ? { foundationPayload }
        : {}),
    }
  } catch {
    return null
  }
}

function extractPerspectivePayload(resultPath: string, perspectiveId: string) {
  try {
    const url = new URL(resultPath, "https://inventory.local")
    const pathname = url.pathname.replace(/^\/zh(?=\/)/, "")
    const prefix = `/perspectives/${perspectiveId}/result/`
    return pathname.startsWith(prefix) ? pathname.slice(prefix.length) : undefined
  } catch {
    return undefined
  }
}

function normalizeLaneScores(
  value: unknown,
): Record<string, Record<string, number>> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null
  const normalized: Record<string, Record<string, number>> = {}
  for (const [lane, scores] of Object.entries(value)) {
    if (!lane || !isNumberRecord(scores)) return null
    normalized[lane] = scores
  }
  return normalized
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
