import { buildCanonicalFoundationResult, type CanonicalFoundationResult } from "@/lib/scoring"
import { FOUNDATION_SCORING_VERSION } from "@/lib/scoring"
import { completionProvenance } from "@/lib/locale-provenance"
import { FOUNDATION_STRUCTURAL_VERSION } from "@/lib/quiz-schema"
import type { Locale } from "@/i18n/routing"
import type {
  CompletionLocale,
  DimensionKey,
  DimensionScores,
  FamilyKey,
  NormativeModifier,
  SharePayload,
  SharePayloadV3,
  StrategyModifier,
} from "@/lib/types"
import { decodeUrlPayload, encodeUrlPayload } from "@/lib/url-payload"

// Fixed dimension order for the payload array.
// This order must never change — it is part of the v2 payload contract.
export const PAYLOAD_DIMENSION_ORDER: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

export function encodePayload(payload: SharePayload): string {
  const normalized = normalizeSharePayload(payload)
  if (!normalized) {
    throw new Error("Invalid Foundation share payload")
  }
  return encodeUrlPayload(normalized)
}

export function buildFoundationSharePayload(
  result: CanonicalFoundationResult,
  completionLocale: Locale,
): SharePayloadV3 {
  const provenance = completionProvenance("foundation", completionLocale)

  return {
    v: 3,
    ds: dimensionScoresToArray(result.dimensionScores),
    fk: result.familyKey,
    nk: result.runnerUpKey,
    sm: result.strategyModifier,
    nm: result.normativeModifier,
    iv: FOUNDATION_STRUCTURAL_VERSION,
    sv: FOUNDATION_SCORING_VERSION,
    cv: provenance.localeCopyVersion,
    cl: provenance.locale,
  }
}

export function decodePayload(encoded: string): SharePayload | null {
  return normalizeSharePayload(decodeUrlPayload(encoded))
}

export function payloadToDimensionScores(payload: SharePayload): DimensionScores {
  const [sc, i, df, ni, pe, re, oj] = payload.ds
  return {
    securityCompetition: sc,
    institutions: i,
    domesticFilters: df,
    normsIdentity: ni,
    politicalEconomy: pe,
    restraint: re,
    orderJustice: oj,
  }
}

export function dimensionScoresToArray(
  scores: DimensionScores,
): [number, number, number, number, number, number, number] {
  return PAYLOAD_DIMENSION_ORDER.map((key) =>
    Number(scores[key].toFixed(2)),
  ) as [number, number, number, number, number, number, number]
}

export type ResolvedFoundationPayload = {
  payload: SharePayload
  dimensionScores: DimensionScores
  result: CanonicalFoundationResult
  provenance: FoundationCompletionRecord
}

export type FoundationCompletionRecord = {
  instrumentStructuralVersion: number
  scoringVersion: number
  localeCopyVersion: number
  completionLocale: CompletionLocale
}

export function resolveFoundationPayload(encoded: string): ResolvedFoundationPayload | null {
  const payload = decodePayload(encoded)
  if (!payload) {
    return null
  }

  const dimensionScores = payloadToDimensionScores(payload)

  return {
    payload,
    dimensionScores,
    result: buildCanonicalFoundationResult(dimensionScores),
    provenance: foundationCompletionRecord(payload),
  }
}

export function foundationCompletionRecord(
  payload: SharePayload,
): FoundationCompletionRecord {
  if (payload.v === 3) {
    return {
      instrumentStructuralVersion: payload.iv,
      scoringVersion: payload.sv,
      localeCopyVersion: payload.cv,
      completionLocale: payload.cl,
    }
  }

  return {
    instrumentStructuralVersion: 0,
    scoringVersion: 0,
    localeCopyVersion: 0,
    completionLocale: "en",
  }
}

function isSharePayload(value: unknown): value is SharePayload {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const candidate = value as Partial<SharePayload>

  const sharedFieldsAreValid =
    isDimensionScoreTuple(candidate.ds) &&
    isFamilyKey(candidate.fk) &&
    isFamilyKey(candidate.nk) &&
    isStrategyModifier(candidate.sm) &&
    isNormativeModifier(candidate.nm)

  if (!sharedFieldsAreValid) return false
  if (candidate.v === 2) return true

  return (
    candidate.v === 3 &&
    isPositiveVersion(candidate.iv) &&
    isPositiveVersion(candidate.sv) &&
    isCopyVersion(candidate.cv) &&
    isCompletionLocale(candidate.cl)
  )
}

function normalizeSharePayload(value: unknown): SharePayload | null {
  if (!isSharePayload(value)) return null

  const sharedFields = {
    ds: value.ds,
    fk: value.fk,
    nk: value.nk,
    sm: value.sm,
    nm: value.nm,
  }

  if (value.v === 2) {
    return {
      v: 2,
      ...sharedFields,
    }
  }

  return {
    v: 3,
    ...sharedFields,
    iv: value.iv,
    sv: value.sv,
    cv: value.cv,
    cl: value.cl,
  }
}

function isPositiveVersion(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1
}

function isCopyVersion(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0
}

function isCompletionLocale(value: unknown): value is CompletionLocale {
  return value === "en" || value === "zh-Hans"
}

function isDimensionScoreTuple(value: unknown): value is SharePayload["ds"] {
  return (
    Array.isArray(value) &&
    value.length === PAYLOAD_DIMENSION_ORDER.length &&
    value.every((score) => typeof score === "number" && Number.isFinite(score) && score >= 1 && score <= 7)
  )
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
