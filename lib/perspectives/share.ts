import { getPerspectiveDefinition, isPerspectiveId } from "@/lib/perspectives/catalog"
import {
  isValidDimensionScores,
  PERSPECTIVE_DIMENSIONS,
  scorePerspectiveRun,
  validatePerspectiveAnswers,
} from "@/lib/perspectives/scoring"
import type {
  PerspectiveDimensionTuple,
  PerspectiveId,
  PerspectiveSharePayloadV1,
  ResolvedPerspectivePayload,
} from "@/lib/perspectives/types"
import type { DimensionScores } from "@/lib/types"
import { decodeUrlPayload, encodeUrlPayload } from "@/lib/url-payload"

const PAYLOAD_KEYS = [
  "v",
  "perspectiveId",
  "scenarioSetVersion",
  "baselineScores",
  "answers",
] as const

export function encodePerspectivePayload(payload: PerspectiveSharePayloadV1): string {
  if (!isPerspectiveSharePayload(payload)) {
    throw new TypeError("Cannot encode an invalid Perspective payload.")
  }

  return encodeUrlPayload(payload)
}

export function decodePerspectivePayload(encoded: string): PerspectiveSharePayloadV1 | null {
  const parsed = decodeUrlPayload(encoded)
  return isPerspectiveSharePayload(parsed) ? parsed : null
}

export function resolvePerspectivePayload(
  encoded: string,
  expectedPerspectiveId?: PerspectiveId,
): ResolvedPerspectivePayload | null {
  const payload = decodePerspectivePayload(encoded)
  if (!payload) return null
  if (expectedPerspectiveId && payload.perspectiveId !== expectedPerspectiveId) return null

  const perspective = getPerspectiveDefinition(payload.perspectiveId)
  if (!perspective) return null

  try {
    const result = scorePerspectiveRun(
      perspective,
      perspectiveTupleToDimensionScores(payload.baselineScores),
      payload.answers,
    )

    return { payload, perspective, result }
  } catch {
    return null
  }
}

export function perspectiveDimensionScoresToTuple(
  scores: DimensionScores,
): PerspectiveDimensionTuple {
  if (!isValidDimensionScores(scores)) {
    throw new TypeError("Perspective baseline scores must contain seven values from 1 through 7.")
  }

  return PERSPECTIVE_DIMENSIONS.map((dimension) =>
    Number(scores[dimension].toFixed(2)),
  ) as PerspectiveDimensionTuple
}

export function perspectiveTupleToDimensionScores(
  tuple: PerspectiveDimensionTuple,
): DimensionScores {
  return PERSPECTIVE_DIMENSIONS.reduce((scores, dimension, index) => {
    scores[dimension] = tuple[index]
    return scores
  }, {} as DimensionScores)
}

export const encodePerspectiveSharePayload = encodePerspectivePayload
export const decodePerspectiveSharePayload = decodePerspectivePayload
export const resolvePerspectiveSharePayload = resolvePerspectivePayload

function isPerspectiveSharePayload(value: unknown): value is PerspectiveSharePayloadV1 {
  if (!isRecord(value) || !hasExactKeys(value, PAYLOAD_KEYS)) return false
  if (value.v !== 1 || !isPerspectiveId(value.perspectiveId)) return false

  const perspective = getPerspectiveDefinition(value.perspectiveId)
  if (!perspective) return false

  if (
    typeof value.scenarioSetVersion !== "number" ||
    !Number.isInteger(value.scenarioSetVersion) ||
    value.scenarioSetVersion !== perspective.scenarioSetVersion
  ) {
    return false
  }

  return (
    isPerspectiveDimensionTuple(value.baselineScores) &&
    validatePerspectiveAnswers(perspective, value.answers)
  )
}

function isPerspectiveDimensionTuple(value: unknown): value is PerspectiveDimensionTuple {
  return (
    Array.isArray(value) &&
    value.length === PERSPECTIVE_DIMENSIONS.length &&
    value.every(
      (score) =>
        typeof score === "number" &&
        Number.isFinite(score) &&
        score >= 1 &&
        score <= 7,
    )
  )
}

function hasExactKeys(
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
) {
  const keys = Object.keys(value)
  return keys.length === expectedKeys.length && keys.every((key) => expectedKeys.includes(key))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
