import { aiPayloadToAxisScores, AiSharePayload } from "./ai-governance-share"
import { aiArchetypeDeepProfiles } from "./ai-governance-profile-copy"
import { getActiveAiGovernanceTensions } from "./ai-governance-results"
import { aiAxisLabels } from "./ai-governance-schema"
import {
  archetypeDescriptions,
  archetypeLabels,
  scoreArchetypes,
} from "./ai-governance-scoring"
import {
  AiArchetypeKey,
  AiAxisKey,
  AiAxisScores,
  AiResult,
} from "./ai-governance-types"

export type PolicySignal = {
  title: string
  stance: string
  explanation: string
}

export type TensionCard = {
  title: string
  text: string
}

export type ComparisonCard = {
  runnerUpKey: AiArchetypeKey
  runnerUpLabel: string
  farthestKey: AiArchetypeKey
  farthestLabel: string
  hybridLabel: string | null
  contrastText: string
  farthestText: string
}

export type AiGovernanceDeepDive = {
  clarityLabel: string
  governingInstinct: string
  shareBlurb: string
  questionToSitWith: string
  policySignals: PolicySignal[]
  internationalOrder: string[]
  tensions: TensionCard[]
  comparison: ComparisonCard
  evidenceShift: string[]
  strongestCritique: string
}

const archetypeSignatures: Record<AiArchetypeKey, Partial<Record<AiAxisKey, number>>> = {
  precautionarySteward: {
    riskHorizon: 1,
    deploymentPace: 1,
    oversight: 0.6,
    geopolitics: -0.1,
    openness: 0.5,
    militaryRole: -0.7,
    legitimacy: 0.2,
    humanFuture: 0.6,
  },
  strategicCompetitor: {
    riskHorizon: 0.3,
    deploymentPace: 0.1,
    oversight: 0.2,
    geopolitics: 1,
    openness: 0.3,
    militaryRole: 0.9,
    legitimacy: -0.2,
    humanFuture: 0.1,
  },
  coordinationArchitect: {
    riskHorizon: 0.5,
    deploymentPace: 0.4,
    oversight: 0.4,
    geopolitics: -1,
    openness: 0.1,
    militaryRole: -0.3,
    legitimacy: 0.8,
    humanFuture: 0.2,
  },
  democraticGuardrailist: {
    riskHorizon: 0.2,
    deploymentPace: 0.6,
    oversight: 1,
    geopolitics: -0.2,
    openness: 0.2,
    militaryRole: -0.5,
    legitimacy: 1,
    humanFuture: 0.4,
  },
  stateCapacityBuilder: {
    riskHorizon: 0.1,
    deploymentPace: 0.1,
    oversight: 0.9,
    geopolitics: 0.3,
    openness: 0.1,
    militaryRole: 0.2,
    legitimacy: -0.5,
    humanFuture: 0,
  },
  openEcosystemBuilder: {
    riskHorizon: -0.5,
    deploymentPace: -1,
    oversight: -0.8,
    geopolitics: -0.2,
    openness: -1,
    militaryRole: -0.2,
    legitimacy: 0,
    humanFuture: -0.7,
  },
}

const additionalTensionRules: Array<{
  key: string
  title: string
  condition: (scores: AiAxisScores) => boolean
  text: string
}> = [
  {
    key: "high-risk-open",
    title: "Open diffusion under high-risk assumptions",
    condition: (scores) => scores.riskHorizon >= 5 && scores.openness <= 3.5,
    text:
      "You give real weight to severe frontier risk while staying relatively open to diffusion. The hard question is where you would start to draw real limits.",
  },
  {
    key: "competition-with-restraint",
    title: "Competition with restraint",
    condition: (scores) => scores.geopolitics >= 5 && scores.deploymentPace >= 5,
    text:
      "You treat rivalry as durable but still favor caution. The real test is whether restraint survives once competitive pressure sharpens.",
  },
  {
    key: "public-legitimacy-vs-speed",
    title: "Legitimacy versus speed",
    condition: (scores) => scores.legitimacy >= 5 && scores.deploymentPace <= 3.5,
    text:
      "You want governance that stays publicly legible without giving up the speed of iterative learning. The design problem is how slow institutions supervise fast systems.",
  },
  {
    key: "transformative-but-supervised",
    title: "Transformation under supervision",
    condition: (scores) => scores.humanFuture <= 3.5 && scores.oversight >= 5,
    text:
      "You are more open to transformative futures, but only under stronger public supervision. The question is whether institutions can govern futures they barely understand.",
  },
  {
    key: "middle-way-open-control",
    title: "No universal default on openness",
    condition: (scores) => scores.openness > 3.5 && scores.openness < 5.2,
    text:
      "You do not treat openness or control as a standing default. That can be wise, but it puts pressure on you to say where your default changes.",
  },
  {
    key: "sovereignty-vs-broad-legitimacy",
    title: "Sovereignty versus broad legitimacy",
    condition: (scores) => scores.geopolitics >= 5 && scores.legitimacy >= 5,
    text:
      "You want stronger rules with broader legitimacy while also taking rivalry seriously. Those goals collide when rivals do not trust the same institutions.",
  },
  {
    key: "human-control-vs-defense-use",
    title: "Human control versus defense integration",
    condition: (scores) => scores.militaryRole >= 5 && scores.humanFuture >= 5,
    text:
      "You see a case for bounded defense use while still wanting human control to remain central. The test is whether those lines hold once operational incentives intensify.",
  },
]

export function buildAiGovernanceResultFromSharePayload(
  payload: AiSharePayload,
): AiResult {
  const axisScores = aiPayloadToAxisScores(payload)
  const archetypeScores = scoreArchetypes(axisScores)

  return {
    archetypeKey: payload.ak,
    archetypeLabel: archetypeLabels[payload.ak],
    riskLens: payload.rl,
    paceModifier: payload.pm,
    geopoliticsModifier: payload.gm,
    clarity: computeClarity(archetypeScores),
    axisScores,
    archetypeScores,
    explanation: archetypeDescriptions[payload.ak],
    neighboringArchetype: archetypeLabels[payload.nk],
  }
}

export function buildAiGovernanceDeepDive(result: AiResult): AiGovernanceDeepDive {
  const profile = aiArchetypeDeepProfiles[result.archetypeKey]

  return {
    clarityLabel: getClarityLabel(result.clarity),
    governingInstinct: profile.governingInstinct,
    shareBlurb: profile.shareBlurb,
    questionToSitWith: profile.questionToSitWith,
    policySignals: getPolicySignals(result.axisScores),
    internationalOrder: profile.internationalOrder,
    tensions: getExpandedTensionCards(result.axisScores),
    comparison: buildComparisonCard(result),
    evidenceShift: profile.evidenceShift,
    strongestCritique: profile.strongestCritique,
  }
}

export function getClarityLabel(clarity: number): string {
  if (clarity >= 84) return "Clear lead"
  if (clarity >= 72) return "Mostly settled"
  if (clarity >= 64) return "Mixed profile"
  return "Hybrid zone"
}

export function getHybridLabel(result: AiResult): string | null {
  const runnerUpKey = getRunnerUpKey(result)

  if (runnerUpKey === result.archetypeKey) return null
  if (result.clarity >= 72) return null

  return `${archetypeLabels[result.archetypeKey]} / ${archetypeLabels[runnerUpKey]}`
}

export function getOrderedArchetypeEntries(
  result: AiResult,
): Array<[AiArchetypeKey, number]> {
  return (Object.entries(result.archetypeScores) as Array<[AiArchetypeKey, number]>).sort(
    (a, b) => b[1] - a[1],
  )
}

export function getRunnerUpKey(result: AiResult): AiArchetypeKey {
  const ordered = getOrderedArchetypeEntries(result)
  return ordered.find(([key]) => key !== result.archetypeKey)?.[0] ?? result.archetypeKey
}

export function getMostDistantArchetypeKey(result: AiResult): AiArchetypeKey {
  const ordered = getOrderedArchetypeEntries(result)
  return [...ordered]
    .reverse()
    .find(([key]) => key !== result.archetypeKey)?.[0] ?? result.archetypeKey
}

export function getPolicySignals(axisScores: AiAxisScores): PolicySignal[] {
  return [
    {
      title: "Frontier release thresholds",
      stance: getFrontierReleaseStance(axisScores),
      explanation:
        axisScores.deploymentPace >= 5
          ? "You are more willing to accept delay, stronger evaluation, and narrower release when capabilities begin to look dangerous."
          : axisScores.deploymentPace <= 3.5
            ? "You are more likely to treat deployment and iterative learning as part of the safety strategy, not as its opposite."
            : "You look for thresholds and triggers rather than a simple speed-first or pause-first line.",
    },
    {
      title: "Oversight and enforcement",
      stance: getOversightStance(axisScores),
      explanation:
        axisScores.oversight >= 5
          ? "You want more outside authority over frontier development and are less satisfied with voluntary internal governance alone."
          : axisScores.oversight <= 3.5
            ? "You are more willing to let technically informed actors move first and rely less on deep state intervention."
            : "You want oversight, but you do not assume that more state involvement is automatically better.",
    },
    {
      title: "International order",
      stance: getInternationalOrderStance(axisScores),
      explanation:
        axisScores.geopolitics >= 5
          ? "You treat rivalry as a durable constraint on governance design. That makes verification and reciprocity more important than rhetoric."
          : axisScores.geopolitics <= 3.5
            ? "You think coordination has to outrank rivalry more often than current politics allows, especially at the frontier."
            : "You see real competition and real coordination needs, so your instinct is selective rather than doctrinal.",
    },
    {
      title: "Openness and diffusion",
      stance: getOpennessStance(axisScores),
      explanation:
        axisScores.openness >= 5
          ? "You are more comfortable with staged access and release controls when you think diffusion would outrun governance."
          : axisScores.openness <= 3.5
            ? "You are more likely to see broad access and lower barriers as protection against capture and dependence, not just as a risk."
            : "You do not treat open release or closed control as a standing answer. Context matters.",
    },
    {
      title: "Defense and security use",
      stance: getDefenseUseStance(axisScores),
      explanation:
        axisScores.militaryRole >= 5
          ? "You see a stronger case for tightly bounded military and intelligence use if the alternative is serious strategic vulnerability."
          : axisScores.militaryRole <= 3.5
            ? "You worry that normalizing defense integration erodes safety and governance boundaries faster than institutions can rebuild them."
            : "You draw a line between narrow defensive use and broader military normalization.",
    },
    {
      title: "Human future",
      stance: getHumanFutureStance(axisScores),
      explanation:
        axisScores.humanFuture >= 5
          ? "You want governance to preserve meaningful human control and political agency as AI becomes more capable."
          : axisScores.humanFuture <= 3.5
            ? "You are more open to transformative futures if the upside is large enough and the governance case still holds."
            : "You are open to transformation, but only if institutions can absorb it without losing legitimacy or agency.",
    },
  ]
}

export function getExpandedTensionCards(axisScores: AiAxisScores): TensionCard[] {
  const baseTensions = getActiveAiGovernanceTensions(axisScores).map((item) => ({
    title: sentenceToTitle(item.text),
    text: item.text,
  }))

  const extras = additionalTensionRules
    .filter((rule) => rule.condition(axisScores))
    .map((rule) => ({ title: rule.title, text: rule.text }))

  const combined = [...baseTensions, ...extras]

  if (combined.length > 0) {
    return combined.slice(0, 3)
  }

  return [
    {
      title: "Tradeoffs you resolve case by case",
      text:
        "Your scores are mixed across several axes. That usually means you are less ideological than threshold-driven. The hard part is saying where your default would change.",
    },
  ]
}

export function buildComparisonCard(result: AiResult): ComparisonCard {
  const primaryKey = result.archetypeKey
  const runnerUpKey = getRunnerUpKey(result)
  const farthestKey = getMostDistantArchetypeKey(result)
  const contrastAxes = getTopContrastAxes(primaryKey, runnerUpKey)
  const farthestAxes = getTopContrastAxes(primaryKey, farthestKey)

  return {
    runnerUpKey,
    runnerUpLabel: archetypeLabels[runnerUpKey],
    farthestKey,
    farthestLabel: archetypeLabels[farthestKey],
    hybridLabel: getHybridLabel(result),
    contrastText: buildContrastText(primaryKey, runnerUpKey, contrastAxes, result.axisScores),
    farthestText: buildFarthestText(primaryKey, farthestKey, farthestAxes, result.axisScores),
  }
}

function computeClarity(
  archetypeScores: Record<AiArchetypeKey, number>,
): number {
  const sorted = Object.values(archetypeScores).sort((a, b) => b - a)
  const gap = sorted[0] - sorted[1]
  return Math.max(55, Math.min(95, Math.round(60 + gap * 8)))
}

function getTopContrastAxes(
  primary: AiArchetypeKey,
  secondary: AiArchetypeKey,
): AiAxisKey[] {
  const primaryWeights = archetypeSignatures[primary]
  const secondaryWeights = archetypeSignatures[secondary]

  return (Object.keys(aiAxisLabels) as AiAxisKey[])
    .map((axis) => ({
      axis,
      delta: Math.abs((primaryWeights[axis] ?? 0) - (secondaryWeights[axis] ?? 0)),
    }))
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 2)
    .map((item) => item.axis)
}

function buildContrastText(
  primary: AiArchetypeKey,
  runnerUp: AiArchetypeKey,
  axes: AiAxisKey[],
  axisScores: AiAxisScores,
): string {
  const first = axisLabelWithPole(axes[0], axisScores[axes[0]])
  const second = axisLabelWithPole(axes[1], axisScores[axes[1]])

  return `Compared with ${archetypeLabels[runnerUp]}, your result separated most on ${first} and ${second}. That is why you landed in ${archetypeLabels[primary]} rather than next door.`
}

function buildFarthestText(
  primary: AiArchetypeKey,
  farthest: AiArchetypeKey,
  axes: AiAxisKey[],
  axisScores: AiAxisScores,
): string {
  const first = axisLabelWithPole(axes[0], axisScores[axes[0]])
  const second = axisLabelWithPole(axes[1], axisScores[axes[1]])

  return `Your profile is farthest from ${archetypeLabels[farthest]} because your instincts on ${first} and ${second} point in a different direction.`
}

function axisLabelWithPole(axis: AiAxisKey, score: number): string {
  const high = score >= 4

  switch (axis) {
    case "riskHorizon":
      return high ? "frontier-risk weighting" : "present-harms weighting"
    case "deploymentPace":
      return high ? "precaution and threshold-setting" : "iterative deployment"
    case "oversight":
      return high ? "external public oversight" : "lab- and expert-led governance"
    case "geopolitics":
      return high ? "competition-first assumptions" : "coordination-first assumptions"
    case "openness":
      return high ? "controlled access" : "open diffusion"
    case "militaryRole":
      return high ? "bounded defense integration" : "civilian restraint"
    case "legitimacy":
      return high ? "public and multilateral legitimacy" : "technocratic speed and discretion"
    case "humanFuture":
      return high ? "meaningful human control" : "transformative futures"
  }
}

function getFrontierReleaseStance(axisScores: AiAxisScores): string {
  if (axisScores.deploymentPace >= 5.2) return "Thresholds before scale"
  if (axisScores.deploymentPace <= 3.8) return "Iterate through deployment"
  return "Conditional release"
}

function getOversightStance(axisScores: AiAxisScores): string {
  if (axisScores.oversight >= 5.2) return "Stronger external supervision"
  if (axisScores.oversight <= 3.8) return "Expert- and lab-led first"
  return "Mixed oversight model"
}

function getInternationalOrderStance(axisScores: AiAxisScores): string {
  if (axisScores.geopolitics >= 5.2) return "Rivalry-aware governance"
  if (axisScores.geopolitics <= 3.8) return "Coordination-first governance"
  return "Selective coordination under rivalry"
}

function getOpennessStance(axisScores: AiAxisScores): string {
  if (axisScores.openness >= 5.2) return "Controlled and staged access"
  if (axisScores.openness <= 3.8) return "Openness as default bias"
  return "Case-by-case release logic"
}

function getDefenseUseStance(axisScores: AiAxisScores): string {
  if (axisScores.militaryRole >= 5.2) return "Bounded defense integration"
  if (axisScores.militaryRole <= 3.8) return "Civilian restraint first"
  return "Bright-line partial use"
}

function getHumanFutureStance(axisScores: AiAxisScores): string {
  if (axisScores.humanFuture >= 5.2) return "Preserve human control"
  if (axisScores.humanFuture <= 3.8) return "Allow transformative upside"
  return "Managed transformation"
}

function sentenceToTitle(text: string): string {
  if (text.includes("competition")) return "Competition and legitimacy"
  if (text.includes("open") || text.includes("diffusion")) return "Openness and thresholds"
  if (text.includes("public oversight") || text.includes("sovereignty")) {
    return "State capacity and coordination"
  }
  if (text.includes("military")) return "Military use under constraint"
  return "Internal tension"
}

export function getPrimaryAxisSummary(axisScores: AiAxisScores): string {
  const ordered = (Object.entries(axisScores) as Array<[AiAxisKey, number]>)
    .sort((a, b) => Math.abs(b[1] - 4) - Math.abs(a[1] - 4))
    .slice(0, 3)
    .map(([axis, score]) => `${aiAxisLabels[axis]} (${score.toFixed(1)})`)

  return ordered.join(" - ")
}

export function buildResultLead(result: AiResult): string {
  const profile = aiArchetypeDeepProfiles[result.archetypeKey]
  return `${archetypeDescriptions[result.archetypeKey]} ${profile.shareBlurb}`
}
