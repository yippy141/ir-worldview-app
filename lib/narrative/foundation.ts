import { blindSpotsData } from "@/lib/result-content"
import {
  analyzeScoreShape,
  getV2ScoringCalibration,
  type FoundationScoringCalibration,
} from "@/lib/scoring"
import { traditionNounLabel } from "@/lib/worldview-config"
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
    "Power and rivalry set the starting point; reassurance alone does not resolve strategic uncertainty.",
  institutionalist:
    "Rules matter when they alter incentives and make commitments more credible.",
  constructivist:
    "Legitimacy and identity shape how actors define threats and interests.",
  criticalPoliticalEconomy:
    "Leverage and dependence expose the uneven structures beneath formal international order.",
}

const FAMILY_DEBATE_FRAMES: Record<FamilyKey, string> = {
  realist:
    "Across the Foundation items, your answers gave early weight to imposed costs and credible deterrence. Institutional promises carried more weight when powerful states retained reasons to honor them.",
  institutionalist:
    "Across the Foundation items, your answers gave weight to rules that change incentives, monitoring that detects violations, and agreements that reduce uncertainty.",
  constructivist:
    "Across the Foundation items, your answers gave weight to legitimacy, memory, and identity when interpreting what actors see as possible or threatening.",
  criticalPoliticalEconomy:
    "Across the Foundation items, your answers gave weight to control over finance, production, and supply chains, including who bears the costs of dependence.",
}

const STRATEGY_FRAMES: Record<StrategyModifier, string> = {
  Restrainer:
    "On strategy items, your answers favored narrower objectives and room to disengage when commitments risked outrunning capacity.",
  Hedger:
    "On strategy items, your answers kept both escalation and restraint available until the harder-to-reverse risk became clearer.",
  Maximizer:
    "On strategy items, your answers gave more weight to using durable advantages to change the terms of a bargain.",
}

const NORMATIVE_FRAMES: Record<NormativeModifier, string> = {
  Pluralist:
    "On normative items, your answers required exceptional evidence before overriding sovereignty because the precedent could outlive the crisis.",
  "Conditional Solidarist":
    "On normative items, your answers weighed the harm of intervention against the harm of leaving an abuse unanswered.",
  Universalist:
    "On normative items, your answers accepted some cost to sovereignty when threats to people became severe enough.",
}

export function assessFoundationNarrative(
  dimensionScores: DimensionScores,
  calibration: FoundationScoringCalibration = "extended",
) {
  const analysis = analyzeScoreShape(dimensionScores, calibration)
  const {
    lowDifferentiationThreshold,
    sharplyDifferentiatedThreshold,
  } = getV2ScoringCalibration(calibration)
  const topDimensions = getTopDimensions(dimensionScores, 3)

  let state: FoundationNarrativeState = "stableModeration"
  if (
    analysis.nearestFitGap <= lowDifferentiationThreshold &&
    analysis.averageDistanceFromCenter <= 1.05
  ) {
    state = "lowDifferentiation"
  } else if (analysis.nearestFitGap >= sharplyDifferentiatedThreshold) {
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
  scoringCalibration = "extended",
}: {
  familyKey: FamilyKey
  runnerUpKey: FamilyKey
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
  dimensionScores: DimensionScores
  scoringCalibration?: FoundationScoringCalibration
}): FoundationNarrative {
  const assessment = assessFoundationNarrative(
    dimensionScores,
    scoringCalibration,
  )
  const familyLabelValue = traditionNounLabel(familyKey)
  const runnerUpLabel = traditionNounLabel(runnerUpKey)
  const [topDim, secondDim, thirdDim] = assessment.topDimensions
  const strongestSignals = joinList([
    describeDimensionFrame(topDim, dimensionScores[topDim]),
    describeDimensionFrame(secondDim, dimensionScores[secondDim]),
    describeDimensionFrame(thirdDim, dimensionScores[thirdDim]),
  ])
  const blindSpot = blindSpotsData[familyKey]

  return {
    state: assessment.state,
    summary: buildSummaryLine(
      assessment.state,
      familyLabelValue,
      runnerUpLabel,
      strongestSignals,
    ),
    sections: [
      {
        title: "How this profile reads world politics",
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
        title: "How this affects the reading",
        text: `${FAMILY_DEBATE_FRAMES[familyKey]} ${STRATEGY_FRAMES[strategyModifier]} ${NORMATIVE_FRAMES[normativeModifier]}`,
      },
      {
        title: "What to examine next",
        text: buildPressureTestText(
          assessment.state,
          runnerUpLabel,
          traditionNounLabel(blindSpot.rivalFamily),
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
  strongestSignals: string,
) {
  if (state === "lowDifferentiation") {
    return `${familyLabelValue} and ${runnerUpLabel} are the two nearest modeled traditions, separated by a narrow gap. The strongest dimension results concern ${strongestSignals}.`
  }

  if (state === "sharplyDifferentiated") {
    return `${familyLabelValue} has a clearer modeled lead over ${runnerUpLabel}. The strongest dimension results concern ${strongestSignals}.`
  }

  return `The nearest modeled tradition is ${familyLabelValue}, followed by ${runnerUpLabel}. The strongest dimension results concern ${strongestSignals}.`
}

function buildMeaningText(
  state: FoundationNarrativeState,
  familyKey: FamilyKey,
  familyLabelValue: string,
  runnerUpLabel: string,
) {
  if (state === "lowDifferentiation") {
    return `${FAMILY_MEANINGS[familyKey]} Several dimensions remain near the midpoint. ${familyLabelValue} and ${runnerUpLabel} are the nearest traditions, and their gap is narrow.`
  }

  if (state === "sharplyDifferentiated") {
    return `${FAMILY_MEANINGS[familyKey]} The dimension results point in a compatible direction and produce a clearer tradition-level result. ${familyLabelValue} still summarizes seven separate dimensions.`
  }

  return `${FAMILY_MEANINGS[familyKey]} ${familyLabelValue} is the nearest modeled tradition, while ${runnerUpLabel} supplies the closest alternative explanation.`
}

function buildWhyText(
  state: FoundationNarrativeState,
  familyLabelValue: string,
  runnerUpLabel: string,
  strongestSignals: string,
) {
  if (state === "lowDifferentiation") {
    return `The largest distances from the midpoint occur in ${strongestSignals}, but the two nearest traditions remain close. The result therefore supports a qualified reading and does not warrant a hard classification.`
  }

  if (state === "sharplyDifferentiated") {
    return `Compatible dimension results create a clearer lead for ${familyLabelValue}: ${strongestSignals}. The gap from ${runnerUpLabel} is wide enough to produce a clearer tradition-level result.`
  }

  return `The dimension results in ${strongestSignals} place ${familyLabelValue} first. ${runnerUpLabel} remains close enough to explain part of the result.`
}

function buildPressureTestText(
  state: FoundationNarrativeState,
  runnerUpLabel: string,
  rivalFamilyLabel: string,
  tendsMiss: string,
  rivalArgument: string,
) {
  if (state === "lowDifferentiation") {
    return `Next, read focused domain questions on their own terms. Security and Technology can add separate issue records without narrowing or rescoring this Foundation result. ${runnerUpLabel} remains the closest Foundation comparison.`
  }

  return `Next, examine what this baseline is prone to discount. ${tendsMiss} The authored rival challenge comes from ${rivalFamilyLabel}: ${rivalArgument} If that objection survives your first explanation, treat the Foundation result as one account of the case with clear limits.`
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
      ? `an unresolved balance involving ${frame.high}`
      : `near-midpoint uncertainty about ${frame.low}`
  }

  return score >= 4 ? frame.high : frame.low
}

function joinList(parts: string[]) {
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`
  return `${parts[0]}, ${parts[1]}, and ${parts[2]}`
}
