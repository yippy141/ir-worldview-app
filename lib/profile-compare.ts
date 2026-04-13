import { dimensionLabels } from "@/lib/quiz-schema"
import type { ModuleSlug } from "@/lib/modules/types"
import type { ModuleSnapshot, ProfileStore } from "@/lib/profile-store"
import type { DimensionKey } from "@/lib/types"

export type FoundationComparisonRow = {
  dimension: DimensionKey
  label: string
  left: number
  right: number
  diff: number
}

export type DomainDifference = {
  slug: ModuleSlug
  laneKey: string
  laneLabel: string
  leftScore: number
  rightScore: number
  summary: string
} | null

export type ProfileComparison = {
  foundationRows: FoundationComparisonRow[]
  sharedStableTrait: string
  biggestDivergence: string
  biggestSecurityDifference: DomainDifference
  biggestTechnologyDifference: DomainDifference
}

const FOUNDATION_SIDE_TEXT: Record<
  DimensionKey,
  { high: string; low: string; sharedHigh: string; sharedLow: string }
> = {
  securityCompetition: {
    high: "a more rivalry-centered baseline",
    low: "a less rivalry-centered baseline",
    sharedHigh: "a rivalry-centered reading of the international system",
    sharedLow: "a less rivalry-first reading of international politics",
  },
  institutions: {
    high: "a stronger institutional baseline",
    low: "a more institution-skeptical baseline",
    sharedHigh: "institutions as meaningful tools of order",
    sharedLow: "institutions as limited unless power supports them",
  },
  domesticFilters: {
    high: "a more domestic-politics-aware baseline",
    low: "a more system-pressure-first baseline",
    sharedHigh: "domestic coalitions and state capacity as part of the story",
    sharedLow: "system pressure over domestic variation",
  },
  normsIdentity: {
    high: "a more legitimacy-aware baseline",
    low: "a more norm-skeptical baseline",
    sharedHigh: "legitimacy and identity as part of the causal picture",
    sharedLow: "norms as secondary to harder material pressures",
  },
  politicalEconomy: {
    high: "a more political-economy-centered baseline",
    low: "a less political-economy-centered baseline",
    sharedHigh: "dependence and leverage as core parts of the case",
    sharedLow: "security and diplomacy before deeper structural economics",
  },
  restraint: {
    high: "a more restraint-minded baseline",
    low: "a more pressure-forward baseline",
    sharedHigh: "strategic ceilings and overextension risk",
    sharedLow: "pressing harder when advantage looks available",
  },
  orderJustice: {
    high: "a more order-first baseline",
    low: "a more justice-sensitive baseline",
    sharedHigh: "order, sovereignty, and precedent carrying real weight",
    sharedLow: "severe harm sometimes outweighing sovereignty-first rules",
  },
}

export function buildProfileComparison(left: ProfileStore, right: ProfileStore): ProfileComparison {
  const foundationRows = buildFoundationComparisonRows(left, right)

  return {
    foundationRows,
    sharedStableTrait: buildSharedStableTrait(foundationRows),
    biggestDivergence: buildBiggestDivergence(foundationRows),
    biggestSecurityDifference: buildDomainDifference(left, right, "security"),
    biggestTechnologyDifference: buildDomainDifference(left, right, "technology"),
  }
}

export function buildFoundationComparisonRows(left: ProfileStore, right: ProfileStore) {
  if (!left.foundation || !right.foundation) {
    return []
  }

  return (Object.keys(left.foundation.dimensionScores) as DimensionKey[]).map((dimension) => ({
    dimension,
    label: dimensionLabels[dimension],
    left: left.foundation!.dimensionScores[dimension],
    right: right.foundation!.dimensionScores[dimension],
    diff: Number((left.foundation!.dimensionScores[dimension] - right.foundation!.dimensionScores[dimension]).toFixed(2)),
  }))
}

function buildSharedStableTrait(rows: FoundationComparisonRow[]) {
  const aligned = rows
    .filter((row) => onSameSideOfCenter(row.left, row.right))
    .map((row) => ({
      ...row,
      stability:
        Math.min(Math.abs(row.left - 4), Math.abs(row.right - 4)) - Math.abs(row.left - row.right) * 0.35,
    }))
    .sort((a, b) => b.stability - a.stability)[0]

  if (aligned && aligned.stability >= 0.2) {
    const side = average(aligned.left, aligned.right) >= 4 ? "high" : "low"
    return `Both usually start with ${FOUNDATION_SIDE_TEXT[aligned.dimension][side === "high" ? "sharedHigh" : "sharedLow"]}.`
  }

  const closest = rows
    .slice()
    .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))[0]

  if (!closest) {
    return "Both profiles are readable, but there is not enough shared structure to name one especially stable overlap."
  }

  return `Both stay relatively close on ${closest.label.toLowerCase()}, even if they emphasize different things elsewhere.`
}

function buildBiggestDivergence(rows: FoundationComparisonRow[]) {
  const widest = rows
    .slice()
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))[0]

  if (!widest) {
    return "No meaningful baseline divergence could be derived."
  }

  const leftSide = widest.left >= 4 ? "high" : "low"
  const rightSide = widest.right >= 4 ? "high" : "low"

  return `The clearest baseline gap is on ${widest.label}: left starts from ${FOUNDATION_SIDE_TEXT[widest.dimension][leftSide]}, while right starts from ${FOUNDATION_SIDE_TEXT[widest.dimension][rightSide]}.`
}

function buildDomainDifference(
  left: ProfileStore,
  right: ProfileStore,
  slug: ModuleSlug,
): DomainDifference {
  const leftModule = left.modules[slug]
  const rightModule = right.modules[slug]

  if (!leftModule || !rightModule) {
    return null
  }

  const leftLanes = new Map(leftModule.laneSummaries.map((lane) => [lane.key, lane]))
  const rightLanes = new Map(rightModule.laneSummaries.map((lane) => [lane.key, lane]))

  const sharedLaneKeys = Array.from(leftLanes.keys()).filter((key) => rightLanes.has(key))

  const widest = sharedLaneKeys
    .map((key) => {
      const leftLane = leftLanes.get(key)!
      const rightLane = rightLanes.get(key)!

      return {
        laneKey: key,
        laneLabel: leftLane.label,
        leftScore: leftLane.score,
        rightScore: rightLane.score,
        diff: Math.abs(leftLane.score - rightLane.score),
        summary: buildLaneDifferenceSummary(slug, leftLane.label, leftLane, rightLane),
      }
    })
    .sort((a, b) => b.diff - a.diff)[0]

  if (!widest || widest.diff < 0.35) {
    return null
  }

  return {
    slug,
    laneKey: widest.laneKey,
    laneLabel: widest.laneLabel,
    leftScore: widest.leftScore,
    rightScore: widest.rightScore,
    summary: widest.summary,
  }
}

function buildLaneDifferenceSummary(
  slug: ModuleSlug,
  laneLabel: string,
  leftLane: ModuleSnapshot["laneSummaries"][number],
  rightLane: ModuleSnapshot["laneSummaries"][number],
) {
  return `${moduleLabel(slug)} differs most on ${laneLabel}: left reads more ${describeLanePosition(leftLane)}, while right reads more ${describeLanePosition(rightLane)}.`
}

function describeLanePosition(lane: ModuleSnapshot["laneSummaries"][number]) {
  if (lane.score >= 4.35) {
    return lane.highLabel.toLowerCase()
  }

  if (lane.score <= 3.65) {
    return lane.lowLabel.toLowerCase()
  }

  return "middle-range"
}

function moduleLabel(slug: ModuleSlug) {
  return slug === "security" ? "Security" : "Technology"
}

function onSameSideOfCenter(left: number, right: number) {
  return (left >= 4 && right >= 4) || (left < 4 && right < 4)
}

function average(left: number, right: number) {
  return (left + right) / 2
}
