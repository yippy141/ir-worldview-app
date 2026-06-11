import { buildCanonicalFoundationResult, type CanonicalFoundationResult } from "@/lib/scoring"
import type {
  DimensionKey,
  DimensionScores,
  FamilyKey,
  NormativeModifier,
  SharePayload,
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
  return encodeUrlPayload(payload)
}

export function decodePayload(encoded: string): SharePayload | null {
  const parsed = decodeUrlPayload(encoded)

  if (!isSharePayload(parsed)) {
    return null
  }

  return parsed
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
  }
}

function isSharePayload(value: unknown): value is SharePayload {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const candidate = value as Partial<SharePayload>

  return (
    candidate.v === 2 &&
    isDimensionScoreTuple(candidate.ds) &&
    isFamilyKey(candidate.fk) &&
    isFamilyKey(candidate.nk) &&
    isStrategyModifier(candidate.sm) &&
    isNormativeModifier(candidate.nm)
  )
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
