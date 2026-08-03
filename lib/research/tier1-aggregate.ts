import {
  FOUNDATION_INSTRUMENT_VERSION,
  foundationCoreQuestions,
  foundationExtendedQuestions,
  foundationFamilyPairKey,
  getFoundationResultQuestions,
  questionCountsBySet,
} from "@/lib/quiz-schema"
import {
  buildCanonicalFoundationResult,
  foundationScoringCalibrationForForm,
  FOUNDATION_SCORING_VERSION,
  getV2ScoringCalibration,
  type CanonicalFoundationResult,
} from "@/lib/scoring"
import {
  resolveArchetype,
} from "@/lib/archetypes"
import { analyticsOptedOut } from "@/lib/analytics/adapter"
import { completionProvenance } from "@/lib/locale-provenance"
import { PAYLOAD_DIMENSION_ORDER } from "@/lib/share"
import type { Locale } from "@/i18n/routing"
import type {
  CompletionLocale,
  DimensionKey,
  DimensionScores,
  FamilyKey,
  FoundationQuestionSet,
  ItemLatencyBucketMs,
  ItemLatencyBuckets,
  NormativeModifier,
  StrategyModifier,
} from "@/lib/types"
import { MODELED_FAMILY_KEYS } from "@/lib/worldview-config"
import { TIER1_SUBMITTED_RESULTS_STORAGE_KEY } from "@/lib/storage-keys"

const STRATEGY_MODIFIERS: StrategyModifier[] = [
  "Restrainer",
  "Hedger",
  "Maximizer",
]
const NORMATIVE_MODIFIERS: NormativeModifier[] = [
  "Pluralist",
  "Conditional Solidarist",
  "Universalist",
]
export const ITEM_LATENCY_BUCKETS_MS = [
  0,
  2_000,
  5_000,
  10_000,
  30_000,
  120_000,
] as const satisfies readonly ItemLatencyBucketMs[]
const ALLOWED_RESULT_KEYS = new Set([
  "instrumentVersion",
  "scoringVersion",
  "dimensionScores",
  "family",
  "strategyModifier",
  "normativeModifier",
  "archetypeCode",
  "questionSet",
  "targetedFamilyPair",
  "completionLocale",
  "localeCopyVersion",
  "itemLatencies",
])
const ALLOWED_ITEM_LATENCY_KEYS = new Set(["itemId", "bucket"])
const ALLOWED_DIMENSIONS = new Set<string>(PAYLOAD_DIMENSION_ORDER)
const ALLOWED_ITEM_IDS = new Set([
  ...foundationCoreQuestions.map((question) => question.id),
  ...foundationExtendedQuestions.map((question) => question.id),
])
const ALLOWED_COMPLETION_TIERS = new Set<FoundationQuestionSet>([
  "core",
  "targetedExtended",
  "fullExtended",
])

export const TIER1_RESULT_BODY_LIMIT_BYTES = 4 * 1024
const MAX_LOCAL_SUBMISSION_KEYS = 32

export type Tier1ItemLatency = {
  itemId: string
  bucket: ItemLatencyBucketMs
}

export type Tier1AggregateResult = {
  instrumentVersion: number
  scoringVersion: number
  dimensionScores: DimensionScores
  family: FamilyKey
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
  archetypeCode: string
  questionSet: FoundationQuestionSet
  targetedFamilyPair?: [FamilyKey, FamilyKey]
  completionLocale: CompletionLocale
  localeCopyVersion: number
  itemLatencies: Tier1ItemLatency[]
}

export type Tier1AggregateValidation =
  | { ok: true; result: Tier1AggregateResult }
  | { ok: false; error: string }

export type Tier1CompletionStep = {
  questionSet: FoundationQuestionSet
  targetedFamilyPair?: [FamilyKey, FamilyKey]
  completionLocale: CompletionLocale
  localeCopyVersion: number
  stepIndex: number
}

export type Tier1CompletionValidation =
  | { ok: true; completion: Tier1CompletionStep }
  | { ok: false; error: string }

export function buildTier1AggregateResult(
  result: CanonicalFoundationResult,
  cohort: Tier1Cohort,
  itemLatencyBuckets: ItemLatencyBuckets = {},
): Tier1AggregateResult {
  const targetedFamilyPair = normalizeTargetedFamilyPair(
    cohort.questionSet,
    cohort.targetedFamilyPair,
  )
  const scoringCalibration = foundationScoringCalibrationForForm(
    cohort.questionSet,
    targetedFamilyPair,
  )
  if (!scoringCalibration) {
    throw new Error("The aggregate cohort has no scoring calibration.")
  }
  const { lowDifferentiationThreshold } =
    getV2ScoringCalibration(scoringCalibration)

  return {
    instrumentVersion: FOUNDATION_INSTRUMENT_VERSION,
    scoringVersion: FOUNDATION_SCORING_VERSION,
    dimensionScores: result.dimensionScores,
    family: result.familyKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    archetypeCode: resolveArchetype(
      result,
      lowDifferentiationThreshold,
    ).code,
    questionSet: cohort.questionSet,
    ...(targetedFamilyPair ? { targetedFamilyPair } : {}),
    completionLocale: cohort.completionLocale,
    localeCopyVersion: cohort.localeCopyVersion,
    itemLatencies: serializeItemLatencies(itemLatencyBuckets),
  }
}

export type Tier1Cohort = {
  questionSet: FoundationQuestionSet
  targetedFamilyPair?: readonly [FamilyKey, FamilyKey]
  completionLocale: CompletionLocale
  localeCopyVersion: number
}

export function buildTier1Cohort(
  questionSet: FoundationQuestionSet,
  locale: Locale,
  targetedFamilyPair?: readonly [FamilyKey, FamilyKey],
): Tier1Cohort {
  const provenance = completionProvenance("foundation", locale)
  const normalizedPair = normalizeTargetedFamilyPair(
    questionSet,
    targetedFamilyPair,
  )

  return {
    questionSet,
    ...(normalizedPair ? { targetedFamilyPair: normalizedPair } : {}),
    completionLocale: provenance.locale,
    localeCopyVersion: provenance.localeCopyVersion,
  }
}

export function foundationAggregateFormKey(
  questionSet: FoundationQuestionSet,
  targetedFamilyPair?: readonly [FamilyKey, FamilyKey],
): string | null {
  if (questionSet !== "targetedExtended") return questionSet
  if (!targetedFamilyPair || targetedFamilyPair[0] === targetedFamilyPair[1]) {
    return null
  }
  return `targetedExtended:${foundationFamilyPairKey(...targetedFamilyPair)}`
}

export function validateTier1AggregateResult(
  value: unknown,
): Tier1AggregateValidation {
  if (!isRecord(value)) {
    return invalid("Aggregate result must be an object.")
  }

  const unknownResultKey = Object.keys(value).find(
    (key) => !ALLOWED_RESULT_KEYS.has(key),
  )
  if (unknownResultKey) {
    return invalid(`Forbidden aggregate result field: ${unknownResultKey}.`)
  }

  if (
    value.instrumentVersion !== FOUNDATION_INSTRUMENT_VERSION ||
    value.scoringVersion !== FOUNDATION_SCORING_VERSION
  ) {
    return invalid("Aggregate result version is not current.")
  }

  const dimensionScores = validateDimensionScores(value.dimensionScores)
  if (!dimensionScores.ok) {
    return dimensionScores
  }

  if (!isMember(value.family, MODELED_FAMILY_KEYS)) {
    return invalid("Unknown worldview family.")
  }
  if (!isMember(value.strategyModifier, STRATEGY_MODIFIERS)) {
    return invalid("Unknown strategy modifier.")
  }
  if (!isMember(value.normativeModifier, NORMATIVE_MODIFIERS)) {
    return invalid("Unknown normative modifier.")
  }
  const cohort = validateTier1Cohort(value)
  if (!cohort.ok) {
    return cohort
  }
  const allowedItemIds = new Set(
    getFoundationResultQuestions(
      cohort.cohort.questionSet,
      cohort.cohort.targetedFamilyPair,
    ).map((question) => question.id),
  )
  const itemLatencies = validateItemLatencies(
    value.itemLatencies,
    allowedItemIds,
  )
  if (!itemLatencies.ok) {
    return itemLatencies
  }

  const result: Tier1AggregateResult = {
    instrumentVersion: value.instrumentVersion,
    scoringVersion: value.scoringVersion,
    dimensionScores: dimensionScores.scores,
    family: value.family,
    strategyModifier: value.strategyModifier,
    normativeModifier: value.normativeModifier,
    archetypeCode: value.archetypeCode as string,
    questionSet: cohort.cohort.questionSet,
    ...(cohort.cohort.targetedFamilyPair
      ? { targetedFamilyPair: cohort.cohort.targetedFamilyPair }
      : {}),
    completionLocale: cohort.cohort.completionLocale,
    localeCopyVersion: cohort.cohort.localeCopyVersion,
    itemLatencies: itemLatencies.items,
  }
  const scoringCalibration = foundationScoringCalibrationForForm(
    result.questionSet,
    result.targetedFamilyPair,
  )
  if (!scoringCalibration) {
    return invalid("Aggregate form has no scoring calibration.")
  }
  const canonical = buildCanonicalFoundationResult(
    result.dimensionScores,
    scoringCalibration,
  )
  const { lowDifferentiationThreshold } =
    getV2ScoringCalibration(scoringCalibration)

  if (
    result.family !== canonical.familyKey ||
    result.strategyModifier !== canonical.strategyModifier ||
    result.normativeModifier !== canonical.normativeModifier ||
    result.archetypeCode !==
      resolveArchetype(canonical, lowDifferentiationThreshold).code
  ) {
    return invalid("Aggregate labels do not match the derived scores.")
  }

  return { ok: true, result }
}

export function validateTier1CompletionStep(
  value: unknown,
): Tier1CompletionValidation {
  if (!isRecord(value)) {
    return invalid("Aggregate completion must be an object.")
  }
  if (
    Object.keys(value).some(
      (key) =>
        ![
          "questionSet",
          "targetedFamilyPair",
          "completionLocale",
          "localeCopyVersion",
          "stepIndex",
        ].includes(key),
    ) ||
    !Object.hasOwn(value, "questionSet") ||
    !Object.hasOwn(value, "stepIndex")
  ) {
    return invalid("Aggregate completion contains forbidden fields.")
  }
  if (
    typeof value.questionSet !== "string" ||
    !ALLOWED_COMPLETION_TIERS.has(
      value.questionSet as FoundationQuestionSet,
    )
  ) {
    return invalid("Unknown aggregate completion tier.")
  }

  const cohort = validateTier1Cohort(value)
  if (!cohort.ok) {
    return cohort
  }
  const tier = cohort.cohort.questionSet
  if (
    !Number.isSafeInteger(value.stepIndex) ||
    (value.stepIndex as number) < 0 ||
    (value.stepIndex as number) >= questionCountsBySet[tier]
  ) {
    return invalid("Invalid aggregate completion step.")
  }

  return {
    ok: true,
    completion: {
      questionSet: tier,
      ...(cohort.cohort.targetedFamilyPair
        ? { targetedFamilyPair: cohort.cohort.targetedFamilyPair }
        : {}),
      completionLocale: cohort.cohort.completionLocale,
      localeCopyVersion: cohort.cohort.localeCopyVersion,
      stepIndex: value.stepIndex as number,
    },
  }
}

export function dimensionBuckets(
  scores: DimensionScores,
): Array<{ dimension: DimensionKey; bucket: number }> {
  return PAYLOAD_DIMENSION_ORDER.map((dimension) => ({
    dimension,
    bucket: Number(scores[dimension].toFixed(1)),
  }))
}

export function bucketItemResponseLatency(
  durationMs: number,
): ItemLatencyBucketMs {
  if (durationMs < 2_000) return 0
  if (durationMs < 5_000) return 2_000
  if (durationMs < 10_000) return 5_000
  if (durationMs < 30_000) return 10_000
  if (durationMs < 120_000) return 30_000
  return 120_000
}

export async function submitTier1AggregateResult(
  result: CanonicalFoundationResult,
  cohort: Tier1Cohort,
  itemLatencyBuckets: ItemLatencyBuckets = {},
): Promise<void> {
  if (
    typeof window === "undefined" ||
    typeof window.fetch !== "function" ||
    analyticsOptedOut()
  ) {
    return
  }

  const aggregate = buildTier1AggregateResult(
    result,
    cohort,
    itemLatencyBuckets,
  )
  const submissionKey = JSON.stringify({
    form: foundationAggregateFormKey(
      aggregate.questionSet,
      aggregate.targetedFamilyPair,
    ),
    locale: aggregate.completionLocale,
    copy: aggregate.localeCopyVersion,
    scores: dimensionBuckets(aggregate.dimensionScores),
  })
  if (hasLocalSubmissionKey(submissionKey)) return

  try {
    const response = await window.fetch("/api/aggregate/result", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(aggregate),
      credentials: "omit",
      keepalive: true,
      referrerPolicy: "no-referrer",
    })
    if (response.ok) {
      rememberLocalSubmissionKey(submissionKey)
    }
  } catch {
    // Aggregate collection must never block or alter result generation.
  }
}

export async function submitTier1CompletionStep(
  cohort: Tier1Cohort,
  stepIndex: number,
): Promise<void> {
  if (
    typeof window === "undefined" ||
    typeof window.fetch !== "function" ||
    analyticsOptedOut()
  ) {
    return
  }

  const normalizedPair = normalizeTargetedFamilyPair(
    cohort.questionSet,
    cohort.targetedFamilyPair,
  )
  try {
    await window.fetch("/api/aggregate/result", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        questionSet: cohort.questionSet,
        ...(normalizedPair ? { targetedFamilyPair: normalizedPair } : {}),
        completionLocale: cohort.completionLocale,
        localeCopyVersion: cohort.localeCopyVersion,
        stepIndex,
      } satisfies Tier1CompletionStep),
      credentials: "omit",
      keepalive: true,
      referrerPolicy: "no-referrer",
    })
  } catch {
    // Aggregate collection must never block quiz navigation.
  }
}

function serializeItemLatencies(
  buckets: ItemLatencyBuckets,
): Tier1ItemLatency[] {
  return Object.entries(buckets)
    .filter(
      (entry): entry is [string, ItemLatencyBucketMs] =>
        ALLOWED_ITEM_IDS.has(entry[0]) && isItemLatencyBucket(entry[1]),
    )
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([itemId, bucket]) => ({ itemId, bucket }))
}

function validateItemLatencies(
  value: unknown,
  allowedItemIds: ReadonlySet<string> = ALLOWED_ITEM_IDS,
):
  | { ok: true; items: Tier1ItemLatency[] }
  | { ok: false; error: string } {
  if (value === undefined) {
    return { ok: true, items: [] }
  }
  if (!Array.isArray(value) || value.length > ALLOWED_ITEM_IDS.size) {
    return invalid("Item latencies must be a bounded array.")
  }

  const seen = new Set<string>()
  const items: Tier1ItemLatency[] = []
  for (const item of value) {
    if (
      !isRecord(item) ||
      Object.keys(item).length !== 2 ||
      Object.keys(item).some((key) => !ALLOWED_ITEM_LATENCY_KEYS.has(key)) ||
      typeof item.itemId !== "string" ||
      !allowedItemIds.has(item.itemId) ||
      !isItemLatencyBucket(item.bucket) ||
      seen.has(item.itemId)
    ) {
      return invalid("Invalid item latency bucket.")
    }
    seen.add(item.itemId)
    items.push({ itemId: item.itemId, bucket: item.bucket })
  }

  items.sort((left, right) => left.itemId.localeCompare(right.itemId))
  return { ok: true, items }
}

function validateTier1Cohort(
  value: Record<string, unknown>,
):
  | { ok: true; cohort: Required<Omit<Tier1Cohort, "targetedFamilyPair">> & {
      targetedFamilyPair?: [FamilyKey, FamilyKey]
    } }
  | { ok: false; error: string } {
  if (
    typeof value.questionSet !== "string" ||
    !ALLOWED_COMPLETION_TIERS.has(
      value.questionSet as FoundationQuestionSet,
    ) ||
    !isCompletionLocale(value.completionLocale) ||
    !Number.isSafeInteger(value.localeCopyVersion) ||
    (value.localeCopyVersion as number) < 0
  ) {
    return invalid("Invalid aggregate cohort.")
  }

  const questionSet = value.questionSet as FoundationQuestionSet
  const targetedFamilyPair = normalizeTargetedFamilyPair(
    questionSet,
    value.targetedFamilyPair,
  )
  if (
    questionSet === "targetedExtended" !== Boolean(targetedFamilyPair) ||
    (questionSet !== "targetedExtended" &&
      value.targetedFamilyPair !== undefined)
  ) {
    return invalid("Invalid targeted aggregate form.")
  }

  const expectedCopyVersion = completionProvenance(
    "foundation",
    value.completionLocale,
  ).localeCopyVersion
  if (value.localeCopyVersion !== expectedCopyVersion) {
    return invalid("Aggregate locale copy version is not current.")
  }

  return {
    ok: true,
    cohort: {
      questionSet,
      ...(targetedFamilyPair ? { targetedFamilyPair } : {}),
      completionLocale: value.completionLocale,
      localeCopyVersion: value.localeCopyVersion as number,
    },
  }
}

function normalizeTargetedFamilyPair(
  questionSet: FoundationQuestionSet,
  value: unknown,
): [FamilyKey, FamilyKey] | undefined {
  if (
    questionSet !== "targetedExtended" ||
    !Array.isArray(value) ||
    value.length !== 2 ||
    !isMember(value[0], MODELED_FAMILY_KEYS) ||
    !isMember(value[1], MODELED_FAMILY_KEYS) ||
    value[0] === value[1]
  ) {
    return undefined
  }

  return [...value].sort(
    (left, right) =>
      MODELED_FAMILY_KEYS.indexOf(left) - MODELED_FAMILY_KEYS.indexOf(right),
  ) as [FamilyKey, FamilyKey]
}

function isCompletionLocale(value: unknown): value is CompletionLocale {
  return value === "en" || value === "zh-Hans"
}

function hasLocalSubmissionKey(key: string): boolean {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(TIER1_SUBMITTED_RESULTS_STORAGE_KEY) ?? "[]",
    )
    return Array.isArray(parsed) && parsed.includes(key)
  } catch {
    // Storage unavailable: collection remains best-effort.
    return false
  }
}

function rememberLocalSubmissionKey(key: string) {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(TIER1_SUBMITTED_RESULTS_STORAGE_KEY) ?? "[]",
    )
    const prior = Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : []
    window.localStorage.setItem(
      TIER1_SUBMITTED_RESULTS_STORAGE_KEY,
      JSON.stringify([...prior.filter((value) => value !== key), key].slice(
        -MAX_LOCAL_SUBMISSION_KEYS,
      )),
    )
  } catch {
    // Storage unavailable: the accepted aggregate has already been submitted.
  }
}

function validateDimensionScores(
  value: unknown,
):
  | { ok: true; scores: DimensionScores }
  | { ok: false; error: string } {
  if (!isRecord(value)) {
    return invalid("Dimension scores must be an object.")
  }

  const suppliedDimensions = Object.keys(value)
  if (
    suppliedDimensions.length !== PAYLOAD_DIMENSION_ORDER.length ||
    suppliedDimensions.some((key) => !ALLOWED_DIMENSIONS.has(key))
  ) {
    return invalid("Dimension scores must contain only the canonical dimensions.")
  }

  const scores = {} as DimensionScores
  for (const dimension of PAYLOAD_DIMENSION_ORDER) {
    const score = value[dimension]
    if (
      typeof score !== "number" ||
      !Number.isFinite(score) ||
      score < 1 ||
      score > 7
    ) {
      return invalid(`Invalid score for ${dimension}.`)
    }
    scores[dimension] = score
  }

  return { ok: true, scores }
}

function isItemLatencyBucket(value: unknown): value is ItemLatencyBucketMs {
  return ITEM_LATENCY_BUCKETS_MS.some((bucket) => bucket === value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isMember<Member extends string>(
  value: unknown,
  members: readonly Member[],
): value is Member {
  return typeof value === "string" && members.some((member) => member === value)
}

function invalid(error: string): { ok: false; error: string } {
  return { ok: false, error }
}
