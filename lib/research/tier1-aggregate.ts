import {
  FOUNDATION_INSTRUMENT_VERSION,
  foundationCoreQuestions,
  foundationExtendedQuestions,
  questionCountsBySet,
} from "@/lib/quiz-schema"
import {
  buildCanonicalFoundationResult,
  FOUNDATION_SCORING_VERSION,
  type CanonicalFoundationResult,
} from "@/lib/scoring"
import { PAYLOAD_DIMENSION_ORDER } from "@/lib/share"
import type {
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
  itemLatencies: Tier1ItemLatency[]
}

export type Tier1AggregateValidation =
  | { ok: true; result: Tier1AggregateResult }
  | { ok: false; error: string }

export type Tier1CompletionStep = {
  tier: FoundationQuestionSet
  stepIndex: number
}

export type Tier1CompletionValidation =
  | { ok: true; completion: Tier1CompletionStep }
  | { ok: false; error: string }

export function buildTier1AggregateResult(
  result: CanonicalFoundationResult,
  itemLatencyBuckets: ItemLatencyBuckets = {},
): Tier1AggregateResult {
  return {
    instrumentVersion: FOUNDATION_INSTRUMENT_VERSION,
    scoringVersion: FOUNDATION_SCORING_VERSION,
    dimensionScores: result.dimensionScores,
    family: result.familyKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    itemLatencies: serializeItemLatencies(itemLatencyBuckets),
  }
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
  const itemLatencies = validateItemLatencies(value.itemLatencies)
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
    itemLatencies: itemLatencies.items,
  }
  const canonical = buildCanonicalFoundationResult(result.dimensionScores)

  if (
    result.family !== canonical.familyKey ||
    result.strategyModifier !== canonical.strategyModifier ||
    result.normativeModifier !== canonical.normativeModifier
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
    Object.keys(value).length !== 2 ||
    !Object.hasOwn(value, "tier") ||
    !Object.hasOwn(value, "stepIndex")
  ) {
    return invalid("Aggregate completion contains forbidden fields.")
  }
  if (
    typeof value.tier !== "string" ||
    !ALLOWED_COMPLETION_TIERS.has(value.tier as FoundationQuestionSet)
  ) {
    return invalid("Unknown aggregate completion tier.")
  }

  const tier = value.tier as FoundationQuestionSet
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
      tier,
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
  itemLatencyBuckets: ItemLatencyBuckets = {},
): Promise<void> {
  if (typeof window === "undefined" || typeof window.fetch !== "function") {
    return
  }

  try {
    await window.fetch("/api/aggregate/result", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(
        buildTier1AggregateResult(result, itemLatencyBuckets),
      ),
      credentials: "omit",
      keepalive: true,
      referrerPolicy: "no-referrer",
    })
  } catch {
    // Aggregate collection must never block or alter result generation.
  }
}

export async function submitTier1CompletionStep(
  tier: FoundationQuestionSet,
  stepIndex: number,
): Promise<void> {
  if (typeof window === "undefined" || typeof window.fetch !== "function") {
    return
  }

  try {
    await window.fetch("/api/aggregate/result", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tier, stepIndex } satisfies Tier1CompletionStep),
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
      !ALLOWED_ITEM_IDS.has(item.itemId) ||
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
