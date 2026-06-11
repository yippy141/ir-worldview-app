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

export type ProbableArgument = {
  dimension: DimensionKey | null
  dimensionLabel: string
  summary: string
  leftStartsFrom: string
  rightStartsFrom: string
  caseThatExposesSplit: string
}

export type ProfileComparison = {
  foundationRows: FoundationComparisonRow[]
  probableArgument: ProbableArgument
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

const FOUNDATION_ARGUMENT_TEXT: Record<
  DimensionKey,
  {
    topic: string
    highStart: string
    lowStart: string
    caseTest: string
  }
> = {
  securityCompetition: {
    topic: "rivalry and threat assessment",
    highStart:
      "rivalry, uncertainty, and credible leverage have to be handled before reassurance can work",
    lowStart:
      "some rivalries are contingent enough that diplomacy, issue design, or restraint can change the stakes",
    caseTest: "a rival makes a partly cooperative offer while both sides still face security pressure",
  },
  institutions: {
    topic: "institutions and rules",
    highStart:
      "rules, monitoring, and repeated interaction can change incentives rather than merely decorate power",
    lowStart: "rules usually survive only when power and interests keep supporting them",
    caseTest: "a powerful actor has a clear incentive to defect from a bargain it once accepted",
  },
  domesticFilters: {
    topic: "domestic politics inside foreign policy",
    highStart:
      "regime politics, coalitions, and state capacity filter what the outside world means",
    lowStart: "external pressure and strategic position do more work than internal variation",
    caseTest: "two similarly placed states respond differently to the same outside pressure",
  },
  normsIdentity: {
    topic: "legitimacy and identity",
    highStart:
      "status, legitimacy, and social expectations shape what actors think they can do",
    lowStart: "norm language matters less than interests, coercion, and material costs",
    caseTest: "public legitimacy pulls against the materially efficient option",
  },
  politicalEconomy: {
    topic: "markets, hierarchy, and dependence",
    highStart: "ownership, finance, supply chains, and unequal dependence are part of the cause",
    lowStart: "security and diplomacy explain more than deeper economic structure",
    caseTest: "a policy creates winners, losers, and chokepoints beneath the official rationale",
  },
  restraint: {
    topic: "restraint versus pressing advantage",
    highStart: "overextension and unintended escalation are often the first danger to manage",
    lowStart: "openings should be pressed before opponents adapt or the advantage closes",
    caseTest: "action looks promising but could expand commitments or escalation risk",
  },
  orderJustice: {
    topic: "order, sovereignty, and justice",
    highStart: "order, sovereignty, and precedent carry weight even under moral pressure",
    lowStart: "severe harm can justify overriding sovereignty-first rules",
    caseTest: "stopping harm would weaken a rule that also protects wider order",
  },
}

export function buildProfileComparison(left: ProfileStore, right: ProfileStore): ProfileComparison {
  const foundationRows = buildFoundationComparisonRows(left, right)

  return {
    foundationRows,
    probableArgument: buildProbableArgument(foundationRows),
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

function buildProbableArgument(rows: FoundationComparisonRow[]): ProbableArgument {
  const widest = getWidestFoundationDifference(rows)

  if (!widest) {
    return {
      dimension: null,
      dimensionLabel: "the available profile data",
      summary:
        "You two do not mainly disagree about a label. The comparison needs two Foundation baselines before it can name the argument cleanly.",
      leftStartsFrom: "Left does not provide enough Foundation data to name a starting point.",
      rightStartsFrom: "Right does not provide enough Foundation data to name a starting point.",
      caseThatExposesSplit:
        "The split would become clearer after both profiles include the same baseline layer.",
    }
  }

  const frame = FOUNDATION_ARGUMENT_TEXT[widest.dimension]
  const leftSide = sideOfCenter(widest.left)
  const rightSide = sideOfCenter(widest.right)
  const sameDirection = leftSide === rightSide

  return {
    dimension: widest.dimension,
    dimensionLabel: widest.label,
    summary: sameDirection
      ? `You two do not mainly disagree about the label. You split on how much weight to give ${frame.topic}.`
      : `You two do not mainly disagree about the label. You split on ${frame.topic}.`,
    leftStartsFrom: `Left starts from ${frame[leftSide === "high" ? "highStart" : "lowStart"]}.`,
    rightStartsFrom: `Right starts from ${frame[rightSide === "high" ? "highStart" : "lowStart"]}.`,
    caseThatExposesSplit: `The split will show up most when ${frame.caseTest}.`,
  }
}

function buildBiggestDivergence(rows: FoundationComparisonRow[]) {
  const widest = getWidestFoundationDifference(rows)

  if (!widest) {
    return "No meaningful baseline divergence could be derived."
  }

  const leftSide = sideOfCenter(widest.left)
  const rightSide = sideOfCenter(widest.right)

  return `The clearest baseline gap is on ${widest.label}: left starts from ${FOUNDATION_SIDE_TEXT[widest.dimension][leftSide]}, while right starts from ${FOUNDATION_SIDE_TEXT[widest.dimension][rightSide]}.`
}

function getWidestFoundationDifference(rows: FoundationComparisonRow[]) {
  return rows
    .slice()
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))[0]
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

function sideOfCenter(score: number) {
  return score >= 4 ? "high" : "low"
}

function average(left: number, right: number) {
  return (left + right) / 2
}
