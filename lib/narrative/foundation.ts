import { blindSpotsData } from "@/lib/result-content"
import { analyzeScoreShape } from "@/lib/scoring"
import { familyLabel } from "@/lib/worldview-config"
import type {
  DimensionKey,
  DimensionScores,
  FamilyKey,
  NormativeModifier,
  StrategyModifier,
} from "@/lib/types"

export type FoundationNarrativeState =
  | "lowDifferentiation"
  | "stableModeration"
  | "sharplyDifferentiated"

export type FoundationNarrativeAssessment = ReturnType<typeof assessFoundationNarrative>

export type FoundationNarrativeSection = {
  title: string
  text: string
}

export type FoundationNarrative = {
  state: FoundationNarrativeState
  summary: string
  sections: FoundationNarrativeSection[]
}

const DIMENSION_FRAMES: Record<DimensionKey, { high: string; low: string }> = {
  securityCompetition: {
    high: "persistent rivalry and strategic competition",
    low: "a less rivalry-first reading of world politics",
  },
  institutions: {
    high: "rules, monitoring, and institutional design",
    low: "skepticism that institutions operate independently of power",
  },
  domesticFilters: {
    high: "domestic coalitions, state capacity, and political transmission belts",
    low: "system pressure over domestic variation",
  },
  normsIdentity: {
    high: "legitimacy, recognition, and identity",
    low: "skepticism toward norms as primary causes",
  },
  politicalEconomy: {
    high: "dependence, leverage, and political economy",
    low: "security and diplomacy over structural economics",
  },
  restraint: {
    high: "cost discipline and overextension risk",
    low: "a greater willingness to press advantage",
  },
  orderJustice: {
    high: "order, sovereignty, and precedent",
    low: "justice claims that can override sovereignty",
  },
}

const FAMILY_MEANINGS: Record<FamilyKey, string> = {
  realist:
    "This baseline returns first to power, rivalry, and the difficulty of treating reassurance as self-executing.",
  institutionalist:
    "This baseline returns first to rules, incentives, and the conditions under which cooperation can hold.",
  constructivist:
    "This baseline returns first to legitimacy, framing, and the way identities shape what threats and interests mean.",
  criticalPoliticalEconomy:
    "This baseline returns first to leverage, dependence, and the uneven structures underneath formal international order.",
}

const FAMILY_DEBATE_FRAMES: Record<FamilyKey, string> = {
  realist:
    "In live debates, this profile tends to attend first to power shifts, deterrence credibility, and whether an institution can survive strategic pressure.",
  institutionalist:
    "In live debates, this profile tends to attend first to rule credibility, monitoring, and whether institutions can actually change incentives.",
  constructivist:
    "In live debates, this profile tends to attend first to framing, legitimacy, and the historical relationship shaping the case.",
  criticalPoliticalEconomy:
    "In live debates, this profile tends to attend first to leverage, dependence, and who controls the economic architecture of the issue.",
}

const STRATEGY_FRAMES: Record<StrategyModifier, string> = {
  Restrainer:
    "Strategically, it keeps returning to overextension risk and the costs of locking in too many commitments.",
  Hedger:
    "Strategically, it keeps restraint and competition live at the same time rather than settling the question in advance.",
  Maximizer:
    "Strategically, it is more willing to tolerate hard bargaining when a durable advantage looks attainable.",
}

const NORMATIVE_FRAMES: Record<NormativeModifier, string> = {
  Pluralist:
    "Normatively, it gives sovereignty and order a high threshold before outside actors should override them.",
  "Conditional Solidarist":
    "Normatively, it treats order and justice as a live tradeoff rather than an already solved hierarchy.",
  Universalist:
    "Normatively, it keeps open the possibility that severe moral stakes can override sovereignty in hard cases.",
}

export function assessFoundationNarrative(dimensionScores: DimensionScores) {
  const analysis = analyzeScoreShape(dimensionScores)
  const topDimensions = getTopDimensions(dimensionScores, 3)

  let state: FoundationNarrativeState = "stableModeration"
  if (analysis.nearestFitGap <= 0.45 && analysis.averageDistanceFromCenter <= 1.05) {
    state = "lowDifferentiation"
  } else if (
    analysis.nearestFitGap >= 0.9 ||
    analysis.sharpDimensionCount >= 3 ||
    analysis.maxDistanceFromCenter >= 1.65
  ) {
    state = "sharplyDifferentiated"
  }

  return {
    state,
    topDimensions,
    ...analysis,
  }
}

export function buildFoundationNarrative({
  familyKey,
  runnerUpKey,
  strategyModifier,
  normativeModifier,
  dimensionScores,
}: {
  familyKey: FamilyKey
  runnerUpKey: FamilyKey
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
  dimensionScores: DimensionScores
}): FoundationNarrative {
  const assessment = assessFoundationNarrative(dimensionScores)
  const familyLabelValue = familyLabel(familyKey)
  const runnerUpLabel = familyLabel(runnerUpKey)
  const [topDim, secondDim, thirdDim] = assessment.topDimensions
  const strongestSignals = joinList([
    describeDimensionFrame(topDim, dimensionScores[topDim]),
    describeDimensionFrame(secondDim, dimensionScores[secondDim]),
    describeDimensionFrame(thirdDim, dimensionScores[thirdDim]),
  ])
  const blindSpot = blindSpotsData[familyKey]

  return {
    state: assessment.state,
    summary: buildSummaryLine(assessment.state, familyLabelValue, runnerUpLabel),
    sections: [
      {
        title: "What this means",
        text: buildMeaningText(assessment.state, familyKey, familyLabelValue, runnerUpLabel),
      },
      {
        title: "Why the model landed here",
        text: buildWhyText(
          assessment.state,
          familyLabelValue,
          runnerUpLabel,
          strongestSignals,
        ),
      },
      {
        title: "What this tends to imply in live debates",
        text: `${FAMILY_DEBATE_FRAMES[familyKey]} ${STRATEGY_FRAMES[strategyModifier]} ${NORMATIVE_FRAMES[normativeModifier]}`,
      },
      {
        title: "What to pressure-test",
        text: buildPressureTestText(
          assessment.state,
          runnerUpLabel,
          familyLabel(blindSpot.rivalFamily),
          blindSpot.tendsMiss,
          blindSpot.rivalArgument,
        ),
      },
    ],
  }
}

function buildSummaryLine(
  state: FoundationNarrativeState,
  familyLabelValue: string,
  runnerUpLabel: string,
) {
  if (state === "lowDifferentiation") {
    return `Broad-spectrum baseline. ${familyLabelValue} is the nearest fit, with ${runnerUpLabel} close enough that the overlap matters.`
  }

  if (state === "sharplyDifferentiated") {
    return `Sharply differentiated ${familyLabelValue.toLowerCase()} baseline with a clear center of gravity.`
  }

  return `${familyLabelValue} is the closest shorthand for a moderately differentiated foundation profile.`
}

function buildMeaningText(
  state: FoundationNarrativeState,
  familyKey: FamilyKey,
  familyLabelValue: string,
  runnerUpLabel: string,
) {
  if (state === "lowDifferentiation") {
    return `${FAMILY_MEANINGS[familyKey]} The model is not seeing a narrow doctrinal camp, though. Your answers stay comparatively close to the middle across several dimensions, which is why ${familyLabelValue} should be read as nearest-fit shorthand rather than a hard identity claim. ${runnerUpLabel} remains close because the profile is carrying more than one live logic at once.`
  }

  if (state === "sharplyDifferentiated") {
    return `${FAMILY_MEANINGS[familyKey]} Here the label is doing real interpretive work rather than merely winning a technical tiebreak. Several dimensions reinforce one another strongly enough that the Foundation reads as a coherent lens with a clearer center of gravity, even though the result still remains a shorthand summary of a multidimensional profile.`
  }

  return `${FAMILY_MEANINGS[familyKey]} The baseline leans clearly enough to name a usable default lens, but not so cleanly that neighboring arguments disappear. ${familyLabelValue} is the best shorthand for where the profile tends to start, while ${runnerUpLabel} still captures some of the nearby logic you have not fully set aside.`
}

function buildWhyText(
  state: FoundationNarrativeState,
  familyLabelValue: string,
  runnerUpLabel: string,
  strongestSignals: string,
) {
  if (state === "lowDifferentiation") {
    return `The main movement away from the midpoint shows up in ${strongestSignals}, but the gap between the two closest traditions remains narrow. That is why the result is better read as a nearest fit than as a crisp classification. The informative part is not that the model found a hidden camp; it is which considerations you return to slightly more often when the questions get harder.`
  }

  if (state === "sharplyDifferentiated") {
    return `The model landed on ${familyLabelValue} because the profile is not merely centered with a few stylistic modifiers attached. The strongest signals point in a compatible direction: ${strongestSignals}. That widens the separation from ${runnerUpLabel} enough that the baseline reads as a clearer tradition-level pattern rather than a narrow nearest-fit edge.`
  }

  return `The model landed on ${familyLabelValue} because the strongest pull in the profile comes from ${strongestSignals}, even though the overall pattern still leaves ${runnerUpLabel} close enough to matter. In other words, there is a real baseline tilt here, but not a sealed box. The runner-up remains part of the explanation, not background noise.`
}

function buildPressureTestText(
  state: FoundationNarrativeState,
  runnerUpLabel: string,
  rivalFamilyLabel: string,
  tendsMiss: string,
  rivalArgument: string,
) {
  if (state === "lowDifferentiation") {
    return `The next pressure test is not to force a harder label. It is to see whether focused domain pressure sharpens the pattern at all. If Security or Technology consistently pushes the same way, the broad-spectrum reading may narrow. If the modules diverge instead, that is informative in its own right. The nearest-fit bridge to ${runnerUpLabel} is part of what still needs testing.`
  }

  return `The main pressure test is what this baseline is still prone to discount. ${tendsMiss} The strongest rival challenge often comes from ${rivalFamilyLabel}: ${rivalArgument} If that objection keeps surviving contact with your first-pass explanation, it is a sign the Foundation result should be held with some discipline rather than treated as a total theory of the case.`
}

function getTopDimensions(scores: DimensionScores, n: number) {
  return (Object.entries(scores) as [DimensionKey, number][])
    .sort((a, b) => Math.abs(b[1] - 4) - Math.abs(a[1] - 4))
    .slice(0, n)
    .map(([dimension]) => dimension)
}

function describeDimensionFrame(dimension: DimensionKey, score: number) {
  const frame = DIMENSION_FRAMES[dimension]
  if (Math.abs(score - 4) < 0.25) {
    return dimension === "restraint" || dimension === "orderJustice"
      ? `a still-open question around ${frame.high}`
      : `a still-open question around ${frame.low}`
  }

  return score >= 4 ? frame.high : frame.low
}

function joinList(parts: string[]) {
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`
  return `${parts[0]}, ${parts[1]}, and ${parts[2]}`
}
