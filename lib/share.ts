import {
  buildCanonicalFoundationResult,
  familyDescriptions,
  foundationScoringCalibrationForForm,
  FOUNDATION_SCORING_VERSION,
  type CanonicalFoundationResult,
  type FoundationScoringCalibration,
} from "@/lib/scoring"
import { buildCanonicalFoundationResult as buildV1CanonicalFoundationResult } from "@/lib/scoring/v1"
import { completionProvenance } from "@/lib/locale-provenance"
import {
  FOUNDATION_INSTRUMENT_VERSION,
  FOUNDATION_STRUCTURAL_VERSION,
} from "@/lib/quiz-schema"
import type { Locale } from "@/i18n/routing"
import type {
  CompletionLocale,
  DimensionKey,
  DimensionScores,
  FamilyKey,
  FoundationQuestionSet,
  FoundationTier,
  NormativeModifier,
  SharePayload,
  SharePayloadV4,
  SharePayloadV5,
  StrategyModifier,
} from "@/lib/types"
import { decodeUrlPayload, encodeUrlPayload } from "@/lib/url-payload"
import { familyLabel, MODELED_FAMILY_KEYS } from "@/lib/worldview-config"

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
  questionSet: FoundationQuestionSet,
  targetedFamilyPair?: readonly [FamilyKey, FamilyKey],
): SharePayloadV5 {
  const provenance = completionProvenance("foundation", completionLocale)
  const normalizedPair = normalizeTargetedFamilyPair(targetedFamilyPair)
  const scoringCalibration = foundationScoringCalibrationForForm(
    questionSet,
    normalizedPair ?? undefined,
  )
  if (!scoringCalibration) {
    throw new Error("A targeted Foundation result requires its family pair.")
  }
  const canonicalResult = buildCanonicalFoundationResult(
    result.dimensionScores,
    scoringCalibration,
  )

  return {
    v: 5,
    ds: dimensionScoresToArray(canonicalResult.dimensionScores),
    fk: canonicalResult.familyKey,
    nk: canonicalResult.runnerUpKey,
    sm: canonicalResult.strategyModifier,
    nm: canonicalResult.normativeModifier,
    iv: FOUNDATION_STRUCTURAL_VERSION,
    bv: FOUNDATION_INSTRUMENT_VERSION,
    sv: FOUNDATION_SCORING_VERSION,
    cv: provenance.localeCopyVersion,
    cl: provenance.locale,
    qs: questionSet,
    ...(normalizedPair ? { tp: normalizedPair } : {}),
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
  resultTier: FoundationTier
  questionSet: FoundationQuestionSet | null
  scoringCalibration: FoundationScoringCalibration
  targetedFamilyPair?: [FamilyKey, FamilyKey]
}

export type FoundationCompletionRecord = {
  instrumentStructuralVersion: number
  instrumentVersion: number
  scoringVersion: number
  localeCopyVersion: number
  completionLocale: CompletionLocale
  resultTier: FoundationTier
  questionSet: FoundationQuestionSet | null
  targetedFamilyPair?: [FamilyKey, FamilyKey]
}

export function resolveFoundationPayload(encoded: string): ResolvedFoundationPayload | null {
  const payload = decodePayload(encoded)
  if (!payload) {
    return null
  }

  const dimensionScores = payloadToDimensionScores(payload)
  const questionSet = payloadQuestionSet(payload)
  const targetedFamilyPair =
    payload.v === 5 ? payload.tp : undefined
  const scoringCalibration =
    payload.v === 5
      ? foundationScoringCalibrationForForm(
          payload.qs,
          payload.tp,
        )
      : "extended"
  if (!scoringCalibration) return null

  const result =
    payload.v === 5
      ? buildCanonicalFoundationResult(
          dimensionScores,
          scoringCalibration,
        )
      : preserveEncodedIdentity(
          payload,
          buildLegacyCanonicalResult(payload, dimensionScores),
        )

  return {
    payload,
    dimensionScores,
    result,
    provenance: foundationCompletionRecord(payload),
    resultTier: questionSet === "core" || (payload.v === 4 && payload.rt === "core")
      ? "core"
      : "extended",
    questionSet,
    scoringCalibration,
    ...(targetedFamilyPair ? { targetedFamilyPair } : {}),
  }
}

export function foundationCompletionRecord(
  payload: SharePayload,
): FoundationCompletionRecord {
  if (payload.v === 3 || payload.v === 4 || payload.v === 5) {
    const questionSet = payloadQuestionSet(payload)
    return {
      instrumentStructuralVersion: payload.iv,
      instrumentVersion: payload.v === 5 ? payload.bv : 0,
      scoringVersion: payload.sv,
      localeCopyVersion: payload.cv,
      completionLocale: payload.cl,
      resultTier:
        questionSet === "core" || (payload.v === 4 && payload.rt === "core")
          ? "core"
          : "extended",
      questionSet,
      ...(payload.v === 5 && payload.tp
        ? { targetedFamilyPair: payload.tp }
        : {}),
    }
  }

  return {
    instrumentStructuralVersion: 0,
    instrumentVersion: 0,
    scoringVersion: 0,
    localeCopyVersion: 0,
    completionLocale: "en",
    resultTier: "extended",
    questionSet: null,
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

  const versionedFieldsAreValid =
    (candidate.v === 3 || candidate.v === 4 || candidate.v === 5) &&
    isPositiveVersion(candidate.iv) &&
    isPositiveVersion(candidate.sv) &&
    isCopyVersion(candidate.cv) &&
    isCompletionLocale(candidate.cl)

  if (!versionedFieldsAreValid) return false
  return (
    candidate.v === 3 ||
    (candidate.v === 4 &&
      isFoundationTier((candidate as Partial<SharePayloadV4>).rt)) ||
    (candidate.v === 5 &&
      isValidV5QuestionSetFields(candidate as Partial<SharePayloadV5>))
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

  if (value.v === 3) {
    return {
      v: 3,
      ...sharedFields,
      iv: value.iv,
      sv: value.sv,
      cv: value.cv,
      cl: value.cl,
    }
  }

  if (value.v === 4) {
    return {
      v: 4,
      ...sharedFields,
      iv: value.iv,
      sv: value.sv,
      cv: value.cv,
      cl: value.cl,
      rt: value.rt,
    }
  }

  return {
    v: 5,
    ...sharedFields,
    iv: value.iv,
    bv: value.bv,
    sv: value.sv,
    cv: value.cv,
    cl: value.cl,
    qs: value.qs,
    ...(value.tp ? { tp: value.tp } : {}),
  }
}

function payloadQuestionSet(payload: SharePayload): FoundationQuestionSet | null {
  if (payload.v === 5) return payload.qs
  if (payload.v === 4 && payload.rt === "core") return "core"
  return null
}

function buildLegacyCanonicalResult(
  payload: SharePayload,
  dimensionScores: DimensionScores,
): CanonicalFoundationResult {
  const scoringVersion =
    payload.v === 3 || payload.v === 4 ? payload.sv : 2

  return scoringVersion === 1
    ? buildV1CanonicalFoundationResult(dimensionScores)
    : buildCanonicalFoundationResult(dimensionScores)
}

function preserveEncodedIdentity(
  payload: SharePayload,
  result: CanonicalFoundationResult,
): CanonicalFoundationResult {
  return {
    ...result,
    familyKey: payload.fk,
    familyLabel: familyLabel(payload.fk),
    strategyModifier: payload.sm,
    normativeModifier: payload.nm,
    explanation: familyDescriptions[payload.fk],
    neighboringFamily: familyLabel(payload.nk),
    runnerUpKey: payload.nk,
    runnerUpLabel: familyLabel(payload.nk),
    nearestFitGap: Math.abs(
      result.familyScores[payload.fk] - result.familyScores[payload.nk],
    ),
  }
}

function normalizeTargetedFamilyPair(
  pair?: readonly [FamilyKey, FamilyKey],
): [FamilyKey, FamilyKey] | null {
  if (!pair || pair[0] === pair[1]) return null
  const ordered = [...pair].sort(
    (left, right) =>
      MODELED_FAMILY_KEYS.indexOf(left) - MODELED_FAMILY_KEYS.indexOf(right),
  )
  return [ordered[0], ordered[1]]
}

function isValidV5QuestionSetFields(
  payload: Partial<SharePayloadV5>,
): boolean {
  if (
    payload.iv !== FOUNDATION_STRUCTURAL_VERSION ||
    payload.bv !== FOUNDATION_INSTRUMENT_VERSION ||
    payload.sv !== FOUNDATION_SCORING_VERSION ||
    !isFoundationQuestionSet(payload.qs)
  ) {
    return false
  }

  if (payload.qs === "targetedExtended") {
    return isTargetedFamilyPair(payload.tp)
  }

  return payload.tp === undefined
}

function isTargetedFamilyPair(
  value: unknown,
): value is [FamilyKey, FamilyKey] {
  if (
    !Array.isArray(value) ||
    value.length !== 2 ||
    !isFamilyKey(value[0]) ||
    !isFamilyKey(value[1]) ||
    value[0] === value[1]
  ) {
    return false
  }

  return MODELED_FAMILY_KEYS.indexOf(value[0]) <
    MODELED_FAMILY_KEYS.indexOf(value[1])
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

function isFoundationTier(value: unknown): value is FoundationTier {
  return value === "core" || value === "extended"
}

function isFoundationQuestionSet(
  value: unknown,
): value is FoundationQuestionSet {
  return (
    value === "core" ||
    value === "targetedExtended" ||
    value === "fullExtended"
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
