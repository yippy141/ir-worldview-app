import type { DimensionKey, DimensionScores } from "@/lib/types"

export type PerspectiveId =
  | "incumbent-great-power"
  | "rising-peer-competitor"
  | "exposed-ally"
  | "middle-power-hedger"
  | "capacity-constrained-state"
  | "protection-authority"

export type PerspectiveSignals = Partial<Record<DimensionKey, number>>
export type PerspectiveDimensionWeights = Partial<Record<DimensionKey, number>>

export type PerspectiveOption = {
  id: string
  title: string
  response: string
  /** Directional scale-point shifts from the Foundation baseline. */
  signals: PerspectiveSignals
}

export type PerspectiveScenario = {
  id: string
  mirrorPairId?: string
  actor: string
  objective: string
  constraint: string
  uncertainty: string
  task: string
  dimensionWeights: PerspectiveDimensionWeights
  options: readonly PerspectiveOption[]
}

export type PerspectiveDefinition = {
  id: PerspectiveId
  label: string
  shortLabel: string
  description: string
  scenarioSetVersion: number
  scenarios: readonly PerspectiveScenario[]
}

export type PerspectiveAnswers = Record<string, string>

export type PerspectiveScenarioMovement = {
  scenarioId: string
  optionId: string
  deltas: Partial<Record<DimensionKey, number>>
  movement: number
}

export type PerspectiveRunResult = {
  perspectiveId: PerspectiveId
  perspectiveLabel: string
  scenarioSetVersion: number
  baselineScores: DimensionScores
  dimensionScores: DimensionScores
  baselineDeltas: Record<DimensionKey, number>
  strongestShiftKeys: DimensionKey[]
  stableDimensionKeys: DimensionKey[]
  scenarioMovements: PerspectiveScenarioMovement[]
  largestMovement: PerspectiveScenarioMovement | null
}

/**
 * Stored Perspective Run contract from the V16 Perspective Field spec.
 * Keep this shape stable because ProfileStore migrations and profile shares use it.
 */
export type PerspectiveRunSnapshot = {
  id: string
  timestamp: number
  perspectiveId: string
  perspectiveLabel: string
  scenarioSetVersion: number
  dimensionScores: DimensionScores
  baselineDeltas: Partial<Record<DimensionKey, number>>
  strongestShiftKeys: DimensionKey[]
  resultPath: string
}

export type PerspectiveDimensionTuple = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]

export type PerspectiveSharePayloadV1 = {
  v: 1
  perspectiveId: PerspectiveId
  scenarioSetVersion: number
  baselineScores: PerspectiveDimensionTuple
  answers: PerspectiveAnswers
}

export type PerspectiveSharePayload = PerspectiveSharePayloadV1

export type ResolvedPerspectivePayload = {
  payload: PerspectiveSharePayloadV1
  perspective: PerspectiveDefinition
  result: PerspectiveRunResult
}
