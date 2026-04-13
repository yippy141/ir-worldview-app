import { getModuleDefinition } from "@/lib/modules/framework"
import { buildFoundationNarrative } from "@/lib/narrative/foundation"
import type { ModuleLaneSummary, ModuleSlug } from "@/lib/modules/types"
import { buildProfileAssessment, type ProfileState } from "@/lib/profile-helpers"
import type { ProfileAssessment } from "@/lib/profile-helpers"
import type {
  FoundationSnapshot,
  ModuleSnapshot,
  ProfileStore,
} from "@/lib/profile-store"
import { getKeyDrivers, getStrongLenses } from "@/lib/result-helpers"
import { resolveFoundationPayload } from "@/lib/share"
import type { ChoiceCardType, DimensionKey, QuizMode } from "@/lib/types"
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

export type ProfileSharePayload = {
  v: 1
  f: string
  ms: ProfileShareModule[]
  ps: ProfileState
}

export type ResolvedProfileShare = {
  payload: ProfileSharePayload
  profile: ProfileStore
  assessment: ProfileAssessment
}

const PROFILE_SHARE_PATH_PATTERN = /\/profile\/share\/([A-Za-z0-9\-_]+)/i
const MODULE_ORDER: ModuleSlug[] = ["security", "technology"]

export function buildProfileSharePayload(profile: ProfileStore): ProfileSharePayload | null {
  if (!profile.foundation) {
    return null
  }

  return {
    v: 1,
    f: profile.foundation.payload,
    ms: MODULE_ORDER.map((slug) => profile.modules[slug])
      .filter((snapshot): snapshot is ModuleSnapshot => Boolean(snapshot))
      .map((snapshot) => ({
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
          ? {
              cr: {
                h: snapshot.cardTypeRead.headline,
                s: snapshot.cardTypeRead.summary,
              },
            }
          : {}),
        ...(snapshot.cardTypeScores ? { ct: snapshot.cardTypeScores } : {}),
      })),
    ps: buildProfileAssessment(profile).state,
  }
}

export function encodeProfileSharePayload(payload: ProfileSharePayload): string {
  return encodeUrlPayload(payload)
}

export function decodeProfileSharePayload(encoded: string): ProfileSharePayload | null {
  const parsed = decodeUrlPayload(encoded)

  if (!isProfileSharePayload(parsed)) {
    return null
  }

  return parsed
}

export function resolveProfileSharePayload(encoded: string): ResolvedProfileShare | null {
  const payload = decodeProfileSharePayload(encoded)
  if (!payload) {
    return null
  }

  const foundation = buildFoundationSnapshot(payload.f)
  if (!foundation) {
    return null
  }

  const modules = Object.fromEntries(
    payload.ms
      .map((sharedModule, index) => {
        const snapshot = buildModuleSnapshot(sharedModule, index + 2)
        return snapshot ? [snapshot.slug, snapshot] : null
      })
      .filter((entry): entry is [ModuleSlug, ModuleSnapshot] => Boolean(entry)),
  ) as ProfileStore["modules"]

  const profile: ProfileStore = {
    v: 2,
    foundation,
    modules,
  }

  return {
    payload,
    profile,
    assessment: buildProfileAssessment(profile),
  }
}

export function normalizeProfileShareInput(raw: string): string | null {
  const trimmed = decodeURIComponentSafe(raw.trim())
  if (!trimmed) {
    return null
  }

  if (isPayloadToken(trimmed)) {
    return trimmed
  }

  const matchedPath = extractPayloadFromPath(trimmed)
  if (matchedPath) {
    return matchedPath
  }

  try {
    const url = trimmed.startsWith("/")
      ? new URL(trimmed, "https://inventory.local")
      : new URL(trimmed)

    return extractPayloadFromPath(url.pathname)
  } catch {
    return null
  }
}

function buildFoundationSnapshot(payload: string): FoundationSnapshot | null {
  const resolved = resolveFoundationPayload(payload)
  if (!resolved) {
    return null
  }

  const { dimensionScores, result } = resolved
  const foundationNarrative = buildFoundationNarrative({
    familyKey: result.familyKey,
    runnerUpKey: result.runnerUpKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    dimensionScores,
  })

  return {
    timestamp: 1,
    payload,
    resultPath: `/results/${payload}`,
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
  }
}

function buildModuleSnapshot(
  sharedModule: ProfileShareModule,
  timestamp: number,
): ModuleSnapshot | null {
  const moduleDefinition = getModuleDefinition(sharedModule.s)
  if (!moduleDefinition) {
    return null
  }

  const laneSummaries = sharedModule.ls
    .map((lane) => mapLaneSummary(moduleDefinition.slug, lane))
    .filter((lane): lane is ModuleLaneSummary => Boolean(lane))

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
      ? {
          cardTypeRead: {
            headline: sharedModule.cr.h,
            summary: sharedModule.cr.s,
          },
        }
      : {}),
    ...(sharedModule.ct ? { cardTypeScores: sharedModule.ct } : {}),
    overlayDeltas: sharedModule.od,
  }
}

function mapLaneSummary(
  slug: ModuleSlug,
  lane: ProfileShareLane,
): ModuleLaneSummary | null {
  const moduleDefinition = getModuleDefinition(slug)
  const definitionLane = moduleDefinition?.lanes.find((candidate) => candidate.key === lane.k)

  if (!definitionLane) {
    return null
  }

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
  return /^[A-Za-z0-9\-_]+$/.test(value)
}

function isProfileSharePayload(value: unknown): value is ProfileSharePayload {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const candidate = value as Partial<ProfileSharePayload>

  return (
    candidate.v === 1 &&
    typeof candidate.f === "string" &&
    Array.isArray(candidate.ms) &&
    candidate.ms.every(isProfileShareModule) &&
    isProfileState(candidate.ps)
  )
}

function isProfileShareModule(value: unknown): value is ProfileShareModule {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const candidate = value as Partial<ProfileShareModule>

  return (
    isModuleSlug(candidate.s) &&
    isQuizMode(candidate.m) &&
    typeof candidate.h === "string" &&
    typeof candidate.u === "string" &&
    Array.isArray(candidate.ls) &&
    candidate.ls.every(isProfileShareLane) &&
    isDimensionDeltaRecord(candidate.od) &&
    (candidate.cp === undefined || typeof candidate.cp === "string") &&
    (candidate.cr === undefined ||
      (typeof candidate.cr === "object" &&
        candidate.cr !== null &&
        typeof candidate.cr.h === "string" &&
        typeof candidate.cr.s === "string")) &&
    (candidate.ct === undefined || isCardTypeScores(candidate.ct))
  )
}

function isProfileShareLane(value: unknown): value is ProfileShareLane {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const candidate = value as Partial<ProfileShareLane>

  return (
    typeof candidate.k === "string" &&
    typeof candidate.sc === "number" &&
    Number.isFinite(candidate.sc) &&
    typeof candidate.su === "string" &&
    (candidate.d === undefined || typeof candidate.d === "string")
  )
}

function isDimensionDeltaRecord(value: unknown): value is Partial<Record<DimensionKey, number>> {
  if (typeof value !== "object" || value === null) {
    return false
  }

  return Object.entries(value).every(
    ([key, raw]) => isDimensionKey(key) && typeof raw === "number" && Number.isFinite(raw),
  )
}

function isCardTypeScores(
  value: unknown,
): value is Partial<Record<ChoiceCardType, Record<string, number>>> {
  if (typeof value !== "object" || value === null) {
    return false
  }

  return Object.entries(value).every(
    ([key, record]) =>
      (key === "explanation" || key === "decision" || key === "both") && isNumberRecord(record),
  )
}

function isNumberRecord(value: unknown): value is Record<string, number> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every((entry) => typeof entry === "number" && Number.isFinite(entry))
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

function isModuleSlug(value: unknown): value is ModuleSlug {
  return value === "security" || value === "technology"
}

function isQuizMode(value: unknown): value is QuizMode {
  return value === "standard" || value === "analyst"
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
