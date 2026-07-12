import { getPerspectiveDefinition } from "@/lib/perspectives/catalog"
import { PERSPECTIVE_DIMENSIONS } from "@/lib/perspectives/scoring"
import type {
  PerspectiveRunResult,
  PerspectiveRunSnapshot,
  PerspectiveScenarioMovement,
} from "@/lib/perspectives/types"
import type { DimensionKey } from "@/lib/types"

export const perspectiveDimensionLabels: Record<DimensionKey, string> = {
  securityCompetition: "Security rivalry",
  institutions: "Institutions and rules",
  domesticFilters: "Domestic politics",
  normsIdentity: "Identity and legitimacy",
  politicalEconomy: "Markets and dependence",
  restraint: "Restraint and advantage",
  orderJustice: "Order and justice",
}

const shiftPhrases: Record<
  DimensionKey,
  { positive: string; negative: string }
> = {
  securityCompetition: {
    positive: "greater weight on rivalry and readiness",
    negative: "greater weight on reassurance and contingent rivalry",
  },
  institutions: {
    positive: "greater reliance on institutions and shared rules",
    negative: "greater reliance on independent state discretion",
  },
  domesticFilters: {
    positive: "greater attention to domestic coalitions and capacity",
    negative: "greater attention to external strategic pressure",
  },
  normsIdentity: {
    positive: "greater weight on legitimacy and identity",
    negative: "greater weight on material incentives and capability",
  },
  politicalEconomy: {
    positive: "greater attention to dependence and economic leverage",
    negative: "greater attention to security and diplomatic bargaining",
  },
  restraint: {
    positive: "greater caution about escalation and overextension",
    negative: "greater willingness to press a temporary advantage",
  },
  orderJustice: {
    positive: "greater weight on order, sovereignty, and precedent",
    negative: "greater weight on protection and corrective justice",
  },
}

export type PerspectiveShiftRow = {
  dimension: DimensionKey
  label: string
  baseline: number
  contextual: number
  delta: number
  direction: string
}

export type PerspectiveResultCopy = {
  headline: string
  summary: string
  stableThread: string
  largestMovement: string
}

export type PerspectiveSnapshotMetadata = {
  id: string
  timestamp: number
  resultPath: string
}

export function getPerspectiveShiftRows(result: PerspectiveRunResult): PerspectiveShiftRow[] {
  return PERSPECTIVE_DIMENSIONS.map((dimension) => ({
    dimension,
    label: perspectiveDimensionLabels[dimension],
    baseline: result.baselineScores[dimension],
    contextual: result.dimensionScores[dimension],
    delta: result.baselineDeltas[dimension],
    direction: getPerspectiveShiftDirection(dimension, result.baselineDeltas[dimension]),
  }))
}

export function getStrongestPerspectiveShifts(
  result: PerspectiveRunResult,
  limit = 3,
): PerspectiveShiftRow[] {
  const rows = getPerspectiveShiftRows(result)
  const rowByDimension = new Map(rows.map((row) => [row.dimension, row]))
  return result.strongestShiftKeys
    .slice(0, Math.max(0, limit))
    .map((dimension) => rowByDimension.get(dimension)!)
}

export function getPerspectiveShiftDirection(dimension: DimensionKey, delta: number) {
  if (Math.abs(delta) < 0.01) return "close to the Foundation baseline"
  return delta > 0 ? shiftPhrases[dimension].positive : shiftPhrases[dimension].negative
}

export function buildPerspectiveResultCopy(result: PerspectiveRunResult): PerspectiveResultCopy {
  const perspective = getPerspectiveDefinition(result.perspectiveId)
  const roleLabel = perspective?.shortLabel ?? result.perspectiveLabel
  const strongest = getStrongestPerspectiveShifts(result, 3)

  if (strongest.length === 0) {
    return {
      headline: `${roleLabel} kept your baseline steady`,
      summary: "This run stayed close to your Foundation baseline across all seven dimensions.",
      stableThread: buildStableThread(result),
      largestMovement: buildLargestMovementLine(result),
    }
  }

  const lead = strongest[0]
  const supportingLabels = strongest.slice(1).map((row) => row.label.toLowerCase())
  const supportingText = formatList(supportingLabels)

  return {
    headline: `${roleLabel} shifted your emphasis on ${lead.label.toLowerCase()}`,
    summary: supportingText
      ? `The role moved you toward ${lead.direction}. ${supportingText} also shifted.`
      : `The role moved you toward ${lead.direction}.`,
    stableThread: buildStableThread(result),
    largestMovement: buildLargestMovementLine(result),
  }
}

export function buildPerspectiveRunSnapshot(
  result: PerspectiveRunResult,
  metadata: PerspectiveSnapshotMetadata,
): PerspectiveRunSnapshot {
  return {
    id: metadata.id,
    timestamp: metadata.timestamp,
    perspectiveId: result.perspectiveId,
    perspectiveLabel: result.perspectiveLabel,
    scenarioSetVersion: result.scenarioSetVersion,
    dimensionScores: { ...result.dimensionScores },
    baselineDeltas: { ...result.baselineDeltas },
    strongestShiftKeys: [...result.strongestShiftKeys],
    resultPath: metadata.resultPath,
  }
}

export function getLargestScenarioMovement(
  result: PerspectiveRunResult,
): PerspectiveScenarioMovement | null {
  return result.largestMovement
}

function buildStableThread(result: PerspectiveRunResult) {
  const dimension = result.stableDimensionKeys[0]
  if (!dimension) {
    return "Every dimension registered some movement in this run."
  }

  return `Your view of ${perspectiveDimensionLabels[dimension].toLowerCase()} changed least.`
}

function buildLargestMovementLine(result: PerspectiveRunResult) {
  const movement = result.largestMovement
  const perspective = getPerspectiveDefinition(result.perspectiveId)
  const scenario = perspective?.scenarios.find((candidate) => candidate.id === movement?.scenarioId)
  const option = scenario?.options.find((candidate) => candidate.id === movement?.optionId)

  if (!movement || !scenario || !option || movement.movement < 0.01) {
    return "No single scenario pulled the profile away from the baseline."
  }

  return `The largest movement came from “${option.title}” in the task: ${scenario.task}`
}

function formatList(values: string[]) {
  if (values.length === 0) return ""
  if (values.length === 1) return values[0]
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`
}
