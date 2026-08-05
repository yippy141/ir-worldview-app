import { aiPayloadToAxisScores, decodeAiPayload } from "@/lib/ai-governance-share"
import { getModuleDefinition, resolveModulePayload } from "@/lib/modules/framework"
import { buildFoundationNarrative } from "@/lib/narrative/foundation"
import { getPerspectiveDefinition, isPerspectiveId } from "@/lib/perspectives/catalog"
import {
  perspectiveTupleToDimensionScores,
  resolvePerspectivePayload,
} from "@/lib/perspectives/share"
import type {
  PerspectiveDimensionTuple,
  PerspectiveRunSnapshot,
} from "@/lib/perspectives/types"
import type { ModuleLaneSummary, ModuleSlug } from "@/lib/modules/types"
import { buildProfileAssessment, type ProfileState } from "@/lib/profile-helpers"
import type { ProfileAssessment } from "@/lib/profile-helpers"
import { isValidProfileTimestamp, parseProfileStore } from "@/lib/profile-store"
import type {
  AiGovernanceSnapshot,
  FoundationSnapshot,
  ModuleSnapshot,
  ProfileStore,
} from "@/lib/profile-store"
import { getKeyDrivers, getStrongLenses } from "@/lib/result-helpers"
import { FIELD_PROJECTION_VERSION } from "@/lib/results/position"
import {
  dimensionScoresToArray,
  resolveFoundationPayload,
} from "@/lib/share"
import type { ChoiceCardType, DimensionKey, QuizMode } from "@/lib/types"
import type { Locale } from "@/i18n/routing"
import { publicPath } from "@/i18n/paths"
import {
  LEGACY_ENGLISH_PROVENANCE,
  isCompletionLocale,
  isLocaleCopyVersion,
} from "@/lib/locale-provenance"
import { decodeUrlPayload, encodeUrlPayload } from "@/lib/url-payload"

export type ProfileShareLane = {
  k: string
  sc: number
  su: string
  d?: string
}

export type ProfileShareModule = {
  s: ModuleSlug
  m: QuizMode
  h: string
  u: string
  ls: ProfileShareLane[]
  od: Partial<Record<DimensionKey, number>>
  cp?: string
  cr?: {
    h: string
    s: string
  }
  ct?: Partial<Record<ChoiceCardType, Record<string, number>>>
}

export type ProfileShareModuleV2 = ProfileShareModule & {
  t: number
}

export type ProfileSharePayloadV1 = {
  v: 1
  f: string
  ms: ProfileShareModule[]
  ps: ProfileState
}

export type ProfileShareAiV2 = {
  t: number
  p: string
  l: string
  s: string
  gi: string
}

export type ProfileSharePerspectiveRunV2 = {
  i: string
  t: number
  p: string
  sv: number
  ds: PerspectiveDimensionTuple
  bd: Partial<Record<DimensionKey, number>>
  sk: DimensionKey[]
  r: string
}

export type ProfileSharePayloadV2 = {
  v: 2
  f: string
  ft: number
  ms: ProfileShareModuleV2[]
  ps: ProfileState
  pv: number
  ai?: ProfileShareAiV2
  pr?: ProfileSharePerspectiveRunV2[]
}

export type ProfileShareProvenanceV3 = {
  l: Locale
  cv: number
}

export type ProfileShareFoundationV3 = ProfileShareProvenanceV3 & {
  t: number
  p: string
}

export type ProfileShareModuleV3 = ProfileShareProvenanceV3 & {
  t: number
  p: string
  s: ModuleSlug
  m: QuizMode
  sc: Record<string, number>
  ls: Record<string, Record<string, number>>
  od: Partial<Record<DimensionKey, number>>
  ct?: Partial<Record<ChoiceCardType, Record<string, number>>>
  fp?: string
  iv: number
}

export type ProfileShareAiV3 = ProfileShareProvenanceV3 & {
  t: number
  p: string
}

export type ProfileSharePerspectiveRunV3 = ProfileShareProvenanceV3 & {
  i: string
  t: number
  pi: string
  sv: number
  p: string
  ds: PerspectiveDimensionTuple
  bd: Partial<Record<DimensionKey, number>>
  sk: DimensionKey[]
}

export type ProfileSharePayloadV3 = {
  v: 3
  f: ProfileShareFoundationV3
  ms: ProfileShareModuleV3[]
  pv: number
  ai?: ProfileShareAiV3
  pr?: ProfileSharePerspectiveRunV3[]
}

export type ProfileSharePayload =
  | ProfileSharePayloadV1
  | ProfileSharePayloadV2
  | ProfileSharePayloadV3

export type ResolvedProfileShare = {
  payload: ProfileSharePayload
  profile: ProfileStore
  assessment: ProfileAssessment
}

const PROFILE_SHARE_PATH_PATTERN = /\/profile\/share\/([A-Za-z0-9\-_]+)/i
const MODULE_ORDER: ModuleSlug[] = ["security", "technology"]
const MAX_V2_PAYLOAD_TOKEN_LENGTH = 50_000
const MAX_SHARED_PERSPECTIVE_RUNS = 50
const RUN_ID_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9._:-]{0,127})$/

export function buildProfileSharePayload(profile: ProfileStore): ProfileSharePayloadV3 | null {
  if (!profile.foundation) return null

  const modules = MODULE_ORDER.map((slug) => profile.modules[slug])
    .filter((snapshot): snapshot is ModuleSnapshot => Boolean(snapshot?.payload))
    .map((snapshot) => toSharedModuleV3(snapshot))
    .filter((snapshot): snapshot is ProfileShareModuleV3 => snapshot !== null)
  const ai = profile.aiGovernance && decodeAiPayload(profile.aiGovernance.payload)
    ? {
        t: profile.aiGovernance.timestamp,
        p: profile.aiGovernance.payload,
        l: profile.aiGovernance.locale,
        cv: profile.aiGovernance.localeCopyVersion,
      }
    : undefined
  const perspectiveRuns = profile.perspectiveRuns
    .slice()
    .sort((left, right) => left.timestamp - right.timestamp)
    .slice(-MAX_SHARED_PERSPECTIVE_RUNS)
    .map(toSharedPerspectiveRunV3)
    .filter((run): run is ProfileSharePerspectiveRunV3 => run !== null)

  return {
    v: 3,
    f: {
      t: profile.foundation.timestamp,
      p: profile.foundation.payload,
      l: profile.foundation.locale,
      cv: profile.foundation.localeCopyVersion,
    },
    ms: modules,
    pv: FIELD_PROJECTION_VERSION,
    ...(ai ? { ai } : {}),
    ...(perspectiveRuns.length > 0 ? { pr: perspectiveRuns } : {}),
  }
}

export function buildProfileSharePayloadV2(profile: ProfileStore): ProfileSharePayloadV2 | null {
  if (!profile.foundation) return null

  const aiCandidate = profile.aiGovernance
    ? {
        t: profile.aiGovernance.timestamp,
        p: profile.aiGovernance.payload,
        l: profile.aiGovernance.archetypeLabel,
        s: profile.aiGovernance.summary,
        gi: profile.aiGovernance.governingInstinct,
      }
    : undefined
  const ai = aiCandidate && isProfileShareAiV2(aiCandidate) ? aiCandidate : undefined
  const perspectiveRuns = profile.perspectiveRuns
    .slice()
    .sort((left, right) => left.timestamp - right.timestamp)
    .slice(-MAX_SHARED_PERSPECTIVE_RUNS)
    .map(toSharedPerspectiveRun)
    .filter((run): run is ProfileSharePerspectiveRunV2 => run !== null)

  return {
    v: 2,
    f: profile.foundation.payload,
    ft: profile.foundation.timestamp,
    ms: buildSharedModules(profile, true) as ProfileShareModuleV2[],
    ps: buildProfileAssessment(profile).state,
    pv: FIELD_PROJECTION_VERSION,
    ...(ai ? { ai } : {}),
    ...(perspectiveRuns.length > 0 ? { pr: perspectiveRuns } : {}),
  }
}

export function buildProfileSharePayloadV1(profile: ProfileStore): ProfileSharePayloadV1 | null {
  if (!profile.foundation) return null
  return {
    v: 1,
    f: profile.foundation.payload,
    ms: buildSharedModules(profile, false) as ProfileShareModule[],
    ps: buildProfileAssessment(profile).state,
  }
}

function buildSharedModules(profile: ProfileStore, includeTimestamp: boolean) {
  return MODULE_ORDER.map((slug) => profile.modules[slug])
    .filter((snapshot): snapshot is ModuleSnapshot => Boolean(snapshot))
    .map((snapshot) => ({
      ...(includeTimestamp ? { t: snapshot.timestamp } : {}),
      s: snapshot.slug,
      m: snapshot.mode,
      h: snapshot.headline,
      u: snapshot.summary,
      ls: snapshot.laneSummaries.map((lane) => ({
        k: lane.key,
        sc: Number(lane.score.toFixed(2)),
        su: lane.summary,
        ...(lane.delta ? { d: lane.delta } : {}),
      })),
      od: snapshot.overlayDeltas,
      ...(snapshot.comparison ? { cp: snapshot.comparison } : {}),
      ...(snapshot.cardTypeRead
        ? { cr: { h: snapshot.cardTypeRead.headline, s: snapshot.cardTypeRead.summary } }
        : {}),
      ...(snapshot.cardTypeScores ? { ct: snapshot.cardTypeScores } : {}),
    }))
}

function toSharedModuleV3(snapshot: ModuleSnapshot): ProfileShareModuleV3 | null {
  if (!snapshot.payload) return null
  const resolved = resolveModulePayload(snapshot.payload)
  if (
    !resolved ||
    resolved.payload.slug !== snapshot.slug ||
    resolved.payload.mode !== snapshot.mode
  ) return null

  return {
    t: snapshot.timestamp,
    p: snapshot.payload,
    s: snapshot.slug,
    m: snapshot.mode,
    sc: snapshot.scores,
    ls: snapshot.laneScores,
    od: snapshot.overlayDeltas,
    ...(snapshot.cardTypeScores ? { ct: snapshot.cardTypeScores } : {}),
    ...(snapshot.foundationPayload ? { fp: snapshot.foundationPayload } : {}),
    iv: resolved.bankVersion,
    l: snapshot.locale,
    cv: snapshot.localeCopyVersion,
  }
}

function toSharedPerspectiveRun(
  snapshot: PerspectiveRunSnapshot,
): ProfileSharePerspectiveRunV2 | null {
  const shared = {
    i: snapshot.id,
    t: snapshot.timestamp,
    p: snapshot.perspectiveId,
    sv: snapshot.scenarioSetVersion,
    ds: dimensionScoresToArray(snapshot.dimensionScores),
    bd: snapshot.baselineDeltas,
    sk: snapshot.strongestShiftKeys,
    r: snapshot.resultPath,
  }
  return isProfileSharePerspectiveRunV2(shared) ? shared : null
}

function toSharedPerspectiveRunV3(
  snapshot: PerspectiveRunSnapshot,
): ProfileSharePerspectiveRunV3 | null {
  if (!snapshot.payload) return null
  const shared = {
    i: snapshot.id,
    t: snapshot.timestamp,
    pi: snapshot.perspectiveId,
    sv: snapshot.scenarioSetVersion,
    p: snapshot.payload,
    ds: dimensionScoresToArray(snapshot.dimensionScores),
    bd: snapshot.baselineDeltas,
    sk: snapshot.strongestShiftKeys,
    l: snapshot.locale,
    cv: snapshot.localeCopyVersion,
  }
  return isProfileSharePerspectiveRunV3(shared) ? shared : null
}

export function encodeProfileSharePayload(payload: ProfileSharePayload): string {
  if (
    !isProfileSharePayloadV1(payload) &&
    !isProfileSharePayloadV2(payload) &&
    !isProfileSharePayloadV3(payload)
  ) {
    throw new TypeError("Cannot encode an invalid Profile Share payload.")
  }
  return encodeUrlPayload(payload)
}

export function decodeProfileSharePayload(encoded: string): ProfileSharePayload | null {
  const parsed = decodeUrlPayload(encoded)
  if (
    isProfileSharePayloadV1(parsed) ||
    isProfileSharePayloadV2(parsed) ||
    isProfileSharePayloadV3(parsed)
  ) return parsed
  return null
}

export function resolveProfileSharePayload(
  encoded: string,
  locale: Locale = "en",
): ResolvedProfileShare | null {
  const payload = decodeProfileSharePayload(encoded)
  if (!payload) return null

  if (payload.v === 3) {
    const profile = resolveProfileSharePayloadV3(payload, locale)
    if (!profile.foundation) return null
    return {
      payload,
      profile,
      assessment: buildProfileAssessment(profile),
    }
  }

  const foundation = buildFoundationSnapshot(
    payload.f,
    payload.v === 2 ? payload.ft : 1,
    locale,
  )
  if (!foundation) return null

  const modules = Object.fromEntries(
    payload.ms
      .map((sharedModule, index) => {
        const timestamp =
          payload.v === 2 && "t" in sharedModule ? sharedModule.t : index + 2
        const snapshot = buildModuleSnapshot(sharedModule, timestamp, locale)
        return snapshot ? [snapshot.slug, snapshot] : null
      })
      .filter((entry): entry is [ModuleSlug, ModuleSnapshot] => Boolean(entry)),
  ) as ProfileStore["modules"]

  const aiGovernance = payload.v === 2 && payload.ai
    ? buildAiGovernanceSnapshot(payload.ai, locale)
    : null
  if (payload.v === 2 && payload.ai && !aiGovernance) return null

  const perspectiveRuns = payload.v === 2 && payload.pr
    ? payload.pr.map((run) => buildPerspectiveRunSnapshot(run, locale))
    : []
  if (perspectiveRuns.some((run) => run === null)) return null

  const validPerspectiveRuns = perspectiveRuns.filter(
    (run): run is PerspectiveRunSnapshot => run !== null,
  )
  const moduleHistory = MODULE_ORDER.map((slug) => modules[slug]).filter(
    (snapshot): snapshot is ModuleSnapshot => Boolean(snapshot),
  )

  const profile: ProfileStore = {
    v: 5,
    foundation,
    foundationHistory: [foundation],
    modules,
    moduleHistory,
    aiGovernance,
    aiHistory: aiGovernance ? [aiGovernance] : [],
    perspectiveRuns: validPerspectiveRuns,
  }

  return {
    payload,
    profile,
    assessment: buildProfileAssessment(profile),
  }
}

function resolveProfileSharePayloadV3(
  payload: ProfileSharePayloadV3,
  locale: Locale,
): ProfileStore {
  const foundationResolved = resolveFoundationPayload(payload.f.p)
  if (!foundationResolved) return emptyResolvedProfile()
  const { result, dimensionScores } = foundationResolved
  const aiDecoded = payload.ai ? decodeAiPayload(payload.ai.p) : null

  const persisted = {
    v: 5,
    foundation: {
      timestamp: payload.f.t,
      payload: payload.f.p,
      familyKey: result.familyKey,
      runnerUpKey: result.runnerUpKey,
      dimensionScores,
      strategyModifier: result.strategyModifier,
      normativeModifier: result.normativeModifier,
      locale: payload.f.l,
      localeCopyVersion: payload.f.cv,
    },
    foundationHistory: [],
    modules: Object.fromEntries(
      payload.ms.map((module) => [
        module.s,
        {
          timestamp: module.t,
          slug: module.s,
          mode: module.m,
          payload: module.p,
          ...(module.fp ? { foundationPayload: module.fp } : {}),
          scores: module.sc,
          laneScores: module.ls,
          ...(module.ct ? { cardTypeScores: module.ct } : {}),
          overlayDeltas: module.od,
          instrumentVersion: module.iv,
          locale: module.l,
          localeCopyVersion: module.cv,
        },
      ]),
    ),
    moduleHistory: [],
    aiGovernance: payload.ai && aiDecoded
      ? {
          timestamp: payload.ai.t,
          payload: payload.ai.p,
          archetypeKey: aiDecoded.ak,
          riskLens: aiDecoded.rl,
          paceModifier: aiDecoded.pm,
          geopoliticsModifier: aiDecoded.gm,
          axisScores: aiPayloadToAxisScores(aiDecoded),
          locale: payload.ai.l,
          localeCopyVersion: payload.ai.cv,
        }
      : null,
    aiHistory: [],
    perspectiveRuns: payload.pr?.map((run) => ({
      id: run.i,
      timestamp: run.t,
      perspectiveId: run.pi,
      scenarioSetVersion: run.sv,
      payload: run.p,
      dimensionScores: perspectiveTupleToDimensionScores(run.ds),
      baselineDeltas: run.bd,
      strongestShiftKeys: run.sk,
      locale: run.l,
      localeCopyVersion: run.cv,
    })) ?? [],
  }

  const profile = parseProfileStore(JSON.stringify(persisted), locale)
  if (profile.foundation) profile.foundationHistory = [profile.foundation]
  profile.moduleHistory = MODULE_ORDER.map((slug) => profile.modules[slug]).filter(
    (snapshot): snapshot is ModuleSnapshot => Boolean(snapshot),
  )
  if (profile.aiGovernance) profile.aiHistory = [profile.aiGovernance]
  return profile
}

function emptyResolvedProfile(): ProfileStore {
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

export function normalizeProfileShareInput(raw: string): string | null {
  const trimmed = decodeURIComponentSafe(raw.trim())
  if (!trimmed) return null
  if (isPayloadToken(trimmed)) return trimmed

  const matchedPath = extractPayloadFromPath(trimmed)
  if (matchedPath) return matchedPath

  try {
    const url = trimmed.startsWith("/")
      ? new URL(trimmed, "https://inventory.local")
      : new URL(trimmed)
    return extractPayloadFromPath(url.pathname)
  } catch {
    return null
  }
}

function buildFoundationSnapshot(
  payload: string,
  timestamp: number,
  locale: Locale,
): FoundationSnapshot | null {
  const resolved = resolveFoundationPayload(payload)
  if (!resolved) return null

  const { dimensionScores, result } = resolved
  const foundationNarrative = buildFoundationNarrative({
    familyKey: result.familyKey,
    runnerUpKey: result.runnerUpKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    dimensionScores,
  })

  return {
    timestamp,
    payload,
    instrumentStructuralVersion: resolved.provenance.instrumentStructuralVersion,
    scoringVersion: resolved.provenance.scoringVersion,
    resultPath: publicPath(locale, `/results/${payload}`),
    familyKey: result.familyKey,
    familyLabel: result.familyLabel,
    runnerUpKey: result.runnerUpKey,
    runnerUpLabel: result.runnerUpLabel,
    summary: foundationNarrative.summary,
    dimensionScores,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    keyDrivers: getKeyDrivers(dimensionScores).map((driver) => ({
      type: driver.type,
      label: driver.label,
      description: driver.description,
    })),
    strongLenses: getStrongLenses(dimensionScores).map((lens) => ({
      label: lens.label,
      description: lens.description,
    })),
    locale: resolved.provenance.completionLocale,
    localeCopyVersion: resolved.provenance.localeCopyVersion,
  }
}

function buildModuleSnapshot(
  sharedModule: ProfileShareModule,
  timestamp: number,
  _locale: Locale,
): ModuleSnapshot | null {
  const moduleDefinition = getModuleDefinition(sharedModule.s)
  if (!moduleDefinition) return null

  const laneSummaries = sharedModule.ls
    .map((lane) => mapLaneSummary(moduleDefinition.slug, lane))
    .filter((lane): lane is ModuleLaneSummary => Boolean(lane))

  const legacyEnglishCopy = {
    title: moduleDefinition.title,
    subtitle: moduleDefinition.subtitle,
    shorthand: moduleDefinition.shorthand,
    headline: sharedModule.h,
    summary: sharedModule.u,
    resultPath: "",
    instincts: [] as string[],
    ...(sharedModule.cp ? { comparison: sharedModule.cp } : {}),
    challenge: "",
    measures: [] as string[],
    doesNotClaim: [] as string[],
    evidence: [] as ModuleSnapshot["evidence"],
    laneSummaries,
    ...(sharedModule.cr
      ? { cardTypeRead: { headline: sharedModule.cr.h, summary: sharedModule.cr.s } }
      : {}),
  }

  return {
    timestamp,
    slug: moduleDefinition.slug,
    title: moduleDefinition.title,
    subtitle: moduleDefinition.subtitle,
    shorthand: moduleDefinition.shorthand,
    mode: sharedModule.m,
    headline: sharedModule.h,
    summary: sharedModule.u,
    resultPath: "",
    scores: {},
    instincts: [],
    ...(sharedModule.cp ? { comparison: sharedModule.cp } : {}),
    challenge: "",
    measures: [],
    doesNotClaim: [],
    evidence: [],
    laneSummaries,
    ...(sharedModule.cr
      ? { cardTypeRead: { headline: sharedModule.cr.h, summary: sharedModule.cr.s } }
      : {}),
    ...(sharedModule.ct ? { cardTypeScores: sharedModule.ct } : {}),
    overlayDeltas: sharedModule.od,
    laneScores: {},
    instrumentVersion: 1,
    ...LEGACY_ENGLISH_PROVENANCE,
    legacyEnglishCopy,
  }
}

function buildAiGovernanceSnapshot(
  shared: ProfileShareAiV2,
  locale: Locale,
): AiGovernanceSnapshot | null {
  const decoded = decodeAiPayload(shared.p)
  if (!decoded) return null
  return {
    timestamp: shared.t,
    payload: shared.p,
    resultPath: publicPath(locale, `/ai/results/${shared.p}`),
    archetypeKey: decoded.ak,
    archetypeLabel: shared.l,
    riskLens: decoded.rl,
    paceModifier: decoded.pm,
    geopoliticsModifier: decoded.gm,
    axisScores: aiPayloadToAxisScores(decoded),
    summary: shared.s,
    governingInstinct: shared.gi,
    ...LEGACY_ENGLISH_PROVENANCE,
    legacyEnglishCopy: {
      resultPath: `/ai/results/${shared.p}`,
      archetypeLabel: shared.l,
      summary: shared.s,
      governingInstinct: shared.gi,
    },
  }
}

function buildPerspectiveRunSnapshot(
  shared: ProfileSharePerspectiveRunV2,
  locale: Locale,
): PerspectiveRunSnapshot | null {
  const perspective = getPerspectiveDefinition(shared.p)
  if (!perspective || perspective.scenarioSetVersion !== shared.sv) return null

  const resultPayload = shared.r.slice(
    `/perspectives/${perspective.id}/result/`.length,
  )

  return {
    id: shared.i,
    timestamp: shared.t,
    perspectiveId: perspective.id,
    perspectiveLabel: perspective.label,
    scenarioSetVersion: shared.sv,
    dimensionScores: perspectiveTupleToDimensionScores(shared.ds),
    baselineDeltas: shared.bd,
    strongestShiftKeys: shared.sk,
    resultPath: publicPath(locale, shared.r),
    payload: resultPayload,
    ...LEGACY_ENGLISH_PROVENANCE,
    legacyEnglishCopy: {
      perspectiveLabel: perspective.label,
      resultPath: shared.r,
    },
  }
}

function mapLaneSummary(slug: ModuleSlug, lane: ProfileShareLane): ModuleLaneSummary | null {
  const moduleDefinition = getModuleDefinition(slug)
  const definitionLane = moduleDefinition?.lanes.find((candidate) => candidate.key === lane.k)
  if (!definitionLane) return null

  return {
    key: lane.k,
    label: definitionLane.label,
    score: lane.sc,
    summary: lane.su,
    lowLabel: definitionLane.lowLabel,
    highLabel: definitionLane.highLabel,
    ...(lane.d ? { delta: lane.d } : {}),
  }
}

function extractPayloadFromPath(value: string) {
  const match = value.match(PROFILE_SHARE_PATH_PATTERN)
  return match?.[1] && isPayloadToken(match[1]) ? match[1] : null
}

function decodeURIComponentSafe(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function isPayloadToken(value: string) {
  return value.length > 0 && /^[A-Za-z0-9\-_]+$/.test(value)
}

function isBoundedV2PayloadToken(value: string) {
  return value.length <= MAX_V2_PAYLOAD_TOKEN_LENGTH && isPayloadToken(value)
}

function isProfileSharePayloadV1(value: unknown): value is ProfileSharePayloadV1 {
  if (!isRecord(value)) return false
  return (
    value.v === 1 &&
    typeof value.f === "string" &&
    isPayloadToken(value.f) &&
    Array.isArray(value.ms) &&
    value.ms.every((module) => isProfileShareModule(module, false)) &&
    isProfileState(value.ps)
  )
}

function isProfileSharePayloadV2(value: unknown): value is ProfileSharePayloadV2 {
  if (!isRecord(value)) return false
  if (!hasOnlyKeys(value, ["v", "f", "ft", "ms", "ps", "pv", "ai", "pr"])) return false
  if (
    value.v !== 2 ||
    typeof value.f !== "string" ||
    !isBoundedV2PayloadToken(value.f) ||
    !isTimestamp(value.ft) ||
    value.pv !== FIELD_PROJECTION_VERSION ||
    !isProfileState(value.ps) ||
    !Array.isArray(value.ms) ||
    value.ms.length > MODULE_ORDER.length ||
    !value.ms.every((module) => isProfileShareModule(module, true)) ||
    hasDuplicateModuleSlugs(value.ms)
  ) {
    return false
  }

  if (value.ai !== undefined && !isProfileShareAiV2(value.ai)) return false
  if (
    value.pr !== undefined &&
    (!Array.isArray(value.pr) ||
      value.pr.length > MAX_SHARED_PERSPECTIVE_RUNS ||
      !value.pr.every(isProfileSharePerspectiveRunV2) ||
      new Set(value.pr.map((run) => run.i)).size !== value.pr.length)
  ) {
    return false
  }

  return true
}

function isProfileSharePayloadV3(value: unknown): value is ProfileSharePayloadV3 {
  if (!isRecord(value)) return false
  if (!hasOnlyKeys(value, ["v", "f", "ms", "pv", "ai", "pr"])) return false
  if (
    value.v !== 3 ||
    value.pv !== FIELD_PROJECTION_VERSION ||
    !isProfileShareFoundationV3(value.f) ||
    !Array.isArray(value.ms) ||
    value.ms.length > MODULE_ORDER.length ||
    !value.ms.every(isProfileShareModuleV3) ||
    hasDuplicateModuleSlugs(value.ms)
  ) {
    return false
  }

  if (value.ai !== undefined && !isProfileShareAiV3(value.ai)) return false
  if (
    value.pr !== undefined &&
    (!Array.isArray(value.pr) ||
      value.pr.length > MAX_SHARED_PERSPECTIVE_RUNS ||
      !value.pr.every(isProfileSharePerspectiveRunV3) ||
      new Set(value.pr.map((run) => run.i)).size !== value.pr.length)
  ) {
    return false
  }

  return true
}

function isProfileShareFoundationV3(value: unknown): value is ProfileShareFoundationV3 {
  return (
    isRecord(value) &&
    hasExactRequiredKeys(value, ["t", "p", "l", "cv"], []) &&
    isTimestamp(value.t) &&
    typeof value.p === "string" &&
    isBoundedV2PayloadToken(value.p) &&
    resolveFoundationPayload(value.p) !== null &&
    isProfileShareProvenanceV3(value)
  )
}

function isProfileShareModuleV3(value: unknown): value is ProfileShareModuleV3 {
  if (
    !isRecord(value) ||
    !hasExactRequiredKeys(
      value,
      ["t", "p", "s", "m", "sc", "ls", "od", "iv", "l", "cv"],
      ["ct", "fp"],
    ) ||
    !isTimestamp(value.t) ||
    typeof value.p !== "string" ||
    !isBoundedV2PayloadToken(value.p) ||
    !isModuleSlug(value.s) ||
    !isQuizMode(value.m) ||
    !isNumberRecord(value.sc, true) ||
    !isLaneScoreRecord(value.ls) ||
    !isDimensionDeltaRecord(value.od, true) ||
    !Number.isInteger(value.iv) ||
    (value.iv as number) < 1 ||
    !isProfileShareProvenanceV3(value) ||
    (value.ct !== undefined && !isCardTypeScores(value.ct, true)) ||
    (value.fp !== undefined &&
      (typeof value.fp !== "string" || resolveFoundationPayload(value.fp) === null))
  ) {
    return false
  }

  const resolved = resolveModulePayload(value.p)
  return (
    resolved !== null &&
    resolved.payload.slug === value.s &&
    resolved.payload.mode === value.m &&
    resolved.bankVersion === value.iv
  )
}

function isProfileShareAiV3(value: unknown): value is ProfileShareAiV3 {
  return (
    isRecord(value) &&
    hasExactRequiredKeys(value, ["t", "p", "l", "cv"], []) &&
    isTimestamp(value.t) &&
    typeof value.p === "string" &&
    isBoundedV2PayloadToken(value.p) &&
    decodeAiPayload(value.p) !== null &&
    isProfileShareProvenanceV3(value)
  )
}

function isProfileSharePerspectiveRunV3(
  value: unknown,
): value is ProfileSharePerspectiveRunV3 {
  if (
    !isRecord(value) ||
    !hasExactRequiredKeys(
      value,
      ["i", "t", "pi", "sv", "p", "ds", "bd", "sk", "l", "cv"],
      [],
    ) ||
    typeof value.i !== "string" ||
    !RUN_ID_PATTERN.test(value.i) ||
    !isTimestamp(value.t) ||
    !isPerspectiveId(value.pi) ||
    !Number.isInteger(value.sv) ||
    typeof value.p !== "string" ||
    !isBoundedV2PayloadToken(value.p) ||
    !isDimensionScoreTuple(value.ds) ||
    !isDimensionDeltaRecord(value.bd, true) ||
    !isDimensionKeyArray(value.sk) ||
    !isProfileShareProvenanceV3(value)
  ) {
    return false
  }

  const definition = getPerspectiveDefinition(value.pi)
  if (!definition || value.sv !== definition.scenarioSetVersion) return false
  if (!resolvePerspectivePayload(value.p, value.pi)) return false
  const deltas = value.bd as Partial<Record<DimensionKey, number>>
  return value.sk.every((key) => Object.hasOwn(deltas, key))
}

function isProfileShareProvenanceV3(
  value: Record<string, unknown>,
): value is Record<string, unknown> & ProfileShareProvenanceV3 {
  return isCompletionLocale(value.l) && isLocaleCopyVersion(value.cv)
}

function isLaneScoreRecord(value: unknown) {
  return (
    isRecord(value) &&
    Object.keys(value).length > 0 &&
    Object.values(value).every((scores) => isNumberRecord(scores, true))
  )
}

function isProfileShareModule(value: unknown, strictV2: boolean): value is ProfileShareModuleV2 {
  if (!isRecord(value)) return false
  if (
    strictV2 &&
    (!hasExactRequiredKeys(value, ["t", "s", "m", "h", "u", "ls", "od"], ["cp", "cr", "ct"]) ||
      !isTimestamp(value.t))
  ) {
    return false
  }

  if (
    !isModuleSlug(value.s) ||
    !isQuizMode(value.m) ||
    typeof value.h !== "string" ||
    typeof value.u !== "string" ||
    !Array.isArray(value.ls) ||
    !value.ls.every((lane) => isProfileShareLane(lane, strictV2)) ||
    !isDimensionDeltaRecord(value.od, strictV2) ||
    (value.cp !== undefined && typeof value.cp !== "string") ||
    (value.cr !== undefined && !isSharedCardTypeRead(value.cr)) ||
    (value.ct !== undefined && !isCardTypeScores(value.ct, strictV2))
  ) {
    return false
  }

  if (strictV2) {
    const definition = getModuleDefinition(value.s)
    const laneKeys = new Set(definition?.lanes.map((lane) => lane.key) ?? [])
    if (value.ls.some((lane) => !laneKeys.has(lane.k))) return false
  }

  return true
}

function isProfileShareLane(value: unknown, strictV2: boolean): value is ProfileShareLane {
  if (!isRecord(value)) return false
  if (strictV2 && !hasExactRequiredKeys(value, ["k", "sc", "su"], ["d"])) return false
  return (
    typeof value.k === "string" &&
    isFiniteNumber(value.sc) &&
    (!strictV2 || (value.sc >= 1 && value.sc <= 7)) &&
    typeof value.su === "string" &&
    (value.d === undefined || typeof value.d === "string")
  )
}

function isProfileShareAiV2(value: unknown): value is ProfileShareAiV2 {
  return (
    isRecord(value) &&
    hasExactRequiredKeys(value, ["t", "p", "l", "s", "gi"], []) &&
    isTimestamp(value.t) &&
    typeof value.p === "string" &&
    isBoundedV2PayloadToken(value.p) &&
    typeof value.l === "string" &&
    value.l.length > 0 &&
    typeof value.s === "string" &&
    typeof value.gi === "string" &&
    decodeAiPayload(value.p) !== null
  )
}

function isProfileSharePerspectiveRunV2(
  value: unknown,
): value is ProfileSharePerspectiveRunV2 {
  if (
    !isRecord(value) ||
    !hasExactRequiredKeys(value, ["i", "t", "p", "sv", "ds", "bd", "sk", "r"], []) ||
    typeof value.i !== "string" ||
    !RUN_ID_PATTERN.test(value.i) ||
    !isTimestamp(value.t) ||
    !isPerspectiveId(value.p) ||
    !Number.isInteger(value.sv) ||
    !isDimensionScoreTuple(value.ds) ||
    !isDimensionDeltaRecord(value.bd, true) ||
    !isDimensionKeyArray(value.sk) ||
    typeof value.r !== "string"
  ) {
    return false
  }

  const definition = getPerspectiveDefinition(value.p)
  if (!definition || value.sv !== definition.scenarioSetVersion) return false
  if (!isPerspectiveResultPath(value.r, value.p)) return false
  const deltas = value.bd as Partial<Record<DimensionKey, number>>
  return value.sk.every((key) => Object.hasOwn(deltas, key))
}

function isPerspectiveResultPath(value: string, perspectiveId: string) {
  const prefix = `/perspectives/${perspectiveId}/result/`
  return value.startsWith(prefix) && isBoundedV2PayloadToken(value.slice(prefix.length))
}

function isSharedCardTypeRead(value: unknown) {
  return (
    isRecord(value) &&
    hasExactRequiredKeys(value, ["h", "s"], []) &&
    typeof value.h === "string" &&
    typeof value.s === "string"
  )
}

function isDimensionScoreTuple(value: unknown): value is PerspectiveDimensionTuple {
  return (
    Array.isArray(value) &&
    value.length === 7 &&
    value.every((score) => isFiniteNumber(score) && score >= 1 && score <= 7)
  )
}

function isDimensionDeltaRecord(
  value: unknown,
  scaleBounded: boolean,
): value is Partial<Record<DimensionKey, number>> {
  if (!isRecord(value)) return false
  return Object.entries(value).every(
    ([key, raw]) =>
      isDimensionKey(key) &&
      isFiniteNumber(raw) &&
      (!scaleBounded || (raw >= -6 && raw <= 6)),
  )
}

function isDimensionKeyArray(value: unknown): value is DimensionKey[] {
  return (
    Array.isArray(value) &&
    value.length <= 3 &&
    value.every((key) => typeof key === "string" && isDimensionKey(key)) &&
    new Set(value).size === value.length
  )
}

function isCardTypeScores(
  value: unknown,
  strictV2: boolean,
): value is Partial<Record<ChoiceCardType, Record<string, number>>> {
  if (!isRecord(value)) return false
  return Object.entries(value).every(
    ([key, record]) =>
      isChoiceCardType(key) &&
      isNumberRecord(record, strictV2),
  )
}

function isNumberRecord(value: unknown, scaleBounded: boolean): value is Record<string, number> {
  return (
    isRecord(value) &&
    Object.values(value).every(
      (entry) =>
        isFiniteNumber(entry) && (!scaleBounded || (entry >= 1 && entry <= 7)),
    )
  )
}

function hasDuplicateModuleSlugs(modules: unknown[]) {
  const slugs = modules.map((module) => (module as { s: ModuleSlug }).s)
  return new Set(slugs).size !== slugs.length
}

function hasOnlyKeys(value: Record<string, unknown>, allowed: readonly string[]) {
  return Object.keys(value).every((key) => allowed.includes(key))
}

function hasExactRequiredKeys(
  value: Record<string, unknown>,
  required: readonly string[],
  optional: readonly string[],
) {
  return required.every((key) => Object.hasOwn(value, key)) &&
    hasOnlyKeys(value, [...required, ...optional])
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

function isTimestamp(value: unknown): value is number {
  return isValidProfileTimestamp(value)
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

function isModuleSlug(value: unknown): value is ModuleSlug {
  return value === "security" || value === "technology"
}

function isQuizMode(value: unknown): value is QuizMode {
  return value === "standard" || value === "analyst"
}

function isChoiceCardType(value: string): value is ChoiceCardType {
  return value === "explanation" || value === "decision" || value === "actorLens" || value === "both"
}

function isProfileState(value: unknown): value is ProfileState {
  return (
    value === "lowDifferentiation" ||
    value === "stableModeration" ||
    value === "sharplyDifferentiatedBaseline" ||
    value === "domainConditionedShift" ||
    value === "trueTension"
  )
}
