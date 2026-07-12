import { getPerspectiveDefinition } from "@/lib/perspectives/catalog"
import type {
  PerspectiveAnswers,
  PerspectiveDefinition,
  PerspectiveId,
  PerspectiveRunResult,
  PerspectiveScenario,
  PerspectiveScenarioMovement,
} from "@/lib/perspectives/types"
import type { DimensionKey, DimensionScores } from "@/lib/types"

export const PERSPECTIVE_DIMENSIONS: readonly DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

export const MAX_PERSPECTIVE_SIGNAL = 3
export const STABLE_SHIFT_THRESHOLD = 0.25
export const MEANINGFUL_SHIFT_THRESHOLD = 0.01
export const MAX_STRONGEST_SHIFT_KEYS = 3

export function scorePerspectiveRun(
  perspective: PerspectiveDefinition | PerspectiveId,
  baselineScores: DimensionScores,
  answers: PerspectiveAnswers,
): PerspectiveRunResult {
  const definition = resolveDefinition(perspective)

  if (!isValidDimensionScores(baselineScores)) {
    throw new Error("Perspective scoring requires seven Foundation scores from 1 through 7.")
  }

  if (!validatePerspectiveAnswers(definition, answers)) {
    throw new Error("Perspective scoring requires one valid answer for every scenario in the pack.")
  }

  validateScoringDefinition(definition)

  const baseline = copyDimensionScores(baselineScores)
  const sums = createDimensionRecord(0)
  const weights = createDimensionRecord(0)
  const scenarioMovements: PerspectiveScenarioMovement[] = []

  for (const scenario of definition.scenarios) {
    const optionId = answers[scenario.id]
    const option = scenario.options.find((candidate) => candidate.id === optionId)!
    const deltas: Partial<Record<DimensionKey, number>> = {}
    let weightedSquareSum = 0
    let scenarioWeight = 0

    for (const dimension of PERSPECTIVE_DIMENSIONS) {
      const signal = option.signals[dimension]
      if (signal === undefined) continue

      const weight = scenario.dimensionWeights[dimension]!
      const appliedDelta = roundScore(
        clampScore(baseline[dimension] + signal) - baseline[dimension],
      )

      deltas[dimension] = appliedDelta
      sums[dimension] += signal * weight
      weights[dimension] += weight
      weightedSquareSum += appliedDelta ** 2 * weight
      scenarioWeight += weight
    }

    scenarioMovements.push({
      scenarioId: scenario.id,
      optionId,
      deltas,
      movement: roundScore(
        scenarioWeight > 0 ? Math.sqrt(weightedSquareSum / scenarioWeight) : 0,
      ),
    })
  }

  const dimensionScores = createDimensionRecord(4)
  const baselineDeltas = createDimensionRecord(0)

  for (const dimension of PERSPECTIVE_DIMENSIONS) {
    const rawDelta = weights[dimension] > 0 ? sums[dimension] / weights[dimension] : 0
    const contextualScore = roundScore(clampScore(baseline[dimension] + rawDelta))
    dimensionScores[dimension] = contextualScore
    baselineDeltas[dimension] = roundScore(contextualScore - baseline[dimension])
  }

  const strongestShiftKeys = [...PERSPECTIVE_DIMENSIONS]
    .filter((dimension) => Math.abs(baselineDeltas[dimension]) >= MEANINGFUL_SHIFT_THRESHOLD)
    .sort((left, right) => compareByAbsoluteDelta(left, right, baselineDeltas))
    .slice(0, MAX_STRONGEST_SHIFT_KEYS)

  const stabilityOrder = [...PERSPECTIVE_DIMENSIONS].sort((left, right) => {
    const difference = Math.abs(baselineDeltas[left]) - Math.abs(baselineDeltas[right])
    if (difference !== 0) return difference
    return PERSPECTIVE_DIMENSIONS.indexOf(left) - PERSPECTIVE_DIMENSIONS.indexOf(right)
  })
  const stableWithinThreshold = stabilityOrder.filter(
    (dimension) => Math.abs(baselineDeltas[dimension]) <= STABLE_SHIFT_THRESHOLD,
  )
  const stableDimensionKeys = stableWithinThreshold.length > 0
    ? stableWithinThreshold
    : stabilityOrder.slice(0, 1)

  const largestMovement = scenarioMovements.reduce<PerspectiveScenarioMovement | null>(
    (largest, movement) => {
      if (!largest || movement.movement > largest.movement) return movement
      return largest
    },
    null,
  )

  return {
    perspectiveId: definition.id,
    perspectiveLabel: definition.label,
    scenarioSetVersion: definition.scenarioSetVersion,
    baselineScores: baseline,
    dimensionScores,
    baselineDeltas,
    strongestShiftKeys,
    stableDimensionKeys,
    scenarioMovements,
    largestMovement,
  }
}

export function validatePerspectiveAnswers(
  perspective: PerspectiveDefinition,
  value: unknown,
): value is PerspectiveAnswers {
  if (!isRecord(value)) return false

  const expectedIds = new Set(perspective.scenarios.map((scenario) => scenario.id))
  const answerEntries = Object.entries(value)
  if (answerEntries.length !== expectedIds.size) return false

  for (const [scenarioId, optionId] of answerEntries) {
    const scenario = perspective.scenarios.find((candidate) => candidate.id === scenarioId)
    if (!scenario || typeof optionId !== "string") return false
    if (!scenario.options.some((option) => option.id === optionId)) return false
  }

  return true
}

export function isValidDimensionScores(value: unknown): value is DimensionScores {
  if (!isRecord(value)) return false
  if (Object.keys(value).length !== PERSPECTIVE_DIMENSIONS.length) return false

  return PERSPECTIVE_DIMENSIONS.every((dimension) => {
    const score = value[dimension]
    return typeof score === "number" && Number.isFinite(score) && score >= 1 && score <= 7
  })
}

export function getPerspectiveScenario(
  perspective: PerspectiveDefinition,
  scenarioId: string,
): PerspectiveScenario | null {
  return perspective.scenarios.find((scenario) => scenario.id === scenarioId) ?? null
}

function resolveDefinition(perspective: PerspectiveDefinition | PerspectiveId) {
  if (typeof perspective !== "string") return perspective

  const definition = getPerspectiveDefinition(perspective)
  if (!definition) {
    throw new Error(`Unknown Perspective pack: ${perspective}`)
  }
  return definition
}

function validateScoringDefinition(perspective: PerspectiveDefinition) {
  for (const scenario of perspective.scenarios) {
    if (scenario.options.length < 2) {
      throw new Error(`Perspective scenario ${scenario.id} requires at least two options.`)
    }

    for (const option of scenario.options) {
      const signalEntries = Object.entries(option.signals) as [DimensionKey, number][]
      if (signalEntries.length === 0) {
        throw new Error(`Perspective option ${option.id} requires at least one signal.`)
      }

      for (const [dimension, signal] of signalEntries) {
        const weight = scenario.dimensionWeights[dimension]
        if (
          !PERSPECTIVE_DIMENSIONS.includes(dimension) ||
          !Number.isFinite(signal) ||
          Math.abs(signal) > MAX_PERSPECTIVE_SIGNAL ||
          typeof weight !== "number" ||
          !Number.isFinite(weight) ||
          weight <= 0
        ) {
          throw new Error(`Perspective option ${option.id} has an invalid ${dimension} signal.`)
        }
      }
    }
  }
}

function compareByAbsoluteDelta(
  left: DimensionKey,
  right: DimensionKey,
  deltas: Record<DimensionKey, number>,
) {
  const difference = Math.abs(deltas[right]) - Math.abs(deltas[left])
  if (difference !== 0) return difference
  return PERSPECTIVE_DIMENSIONS.indexOf(left) - PERSPECTIVE_DIMENSIONS.indexOf(right)
}

function copyDimensionScores(scores: DimensionScores): DimensionScores {
  return PERSPECTIVE_DIMENSIONS.reduce((copy, dimension) => {
    copy[dimension] = scores[dimension]
    return copy
  }, {} as DimensionScores)
}

function createDimensionRecord(value: number): Record<DimensionKey, number> {
  return PERSPECTIVE_DIMENSIONS.reduce((record, dimension) => {
    record[dimension] = value
    return record
  }, {} as Record<DimensionKey, number>)
}

function clampScore(value: number) {
  return Math.max(1, Math.min(7, value))
}

function roundScore(value: number) {
  const rounded = Number(value.toFixed(2))
  return Object.is(rounded, -0) ? 0 : rounded
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
