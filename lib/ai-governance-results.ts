import { aiAxisLabels } from "./ai-governance-schema"
import {
  archetypeDescriptions,
  archetypeLabels,
} from "./ai-governance-scoring"
import {
  AiArchetypeKey,
  AiAxisKey,
  AiAxisScores,
  PaceModifier,
  RiskLens,
} from "./ai-governance-types"

export function archetypeLabelFromKey(key: AiArchetypeKey): string {
  return archetypeLabels[key]
}

export { archetypeDescriptions }

const axisOneLiners: Record<AiAxisKey, (score: number) => string> = {
  riskHorizon: (score) =>
    score >= 5
      ? "You give substantial weight to severe frontier or catastrophic risks when thinking about governance."
      : score <= 3
        ? "You orient more toward already visible harms and practical present-day failures."
        : "You keep both frontier risks and current harms in the frame at the same time.",
  deploymentPace: (score) =>
    score >= 5
      ? "You are more willing to slow deployment when evidence turns concerning."
      : score <= 3
        ? "You are more inclined to learn through deployment and iteration."
        : "You look for threshold-based guardrails rather than either maximal speed or blanket slowdown.",
  oversight: (score) =>
    score >= 5
      ? "You prefer stronger public or state supervision over frontier AI development."
      : score <= 3
        ? "You are comparatively more willing to trust expert- and lab-led governance."
        : "You want oversight, but not a fully state-dominated governance model.",
  geopolitics: (score) =>
    score >= 5
      ? "You treat AI governance as operating under durable strategic competition."
      : score <= 3
        ? "You think coordination needs to outrank rivalry more often than current politics allows."
      : "You hedge: competition is real, but so is the need for selective coordination.",
  openness: (score) =>
    score >= 5
      ? "You are more comfortable with controlled access and staged release than open diffusion."
      : score <= 3
        ? "You are more willing to back openness and wider capability access."
        : "You do not treat either openness or control as a universal default.",
  militaryRole: (score) =>
    score >= 5
      ? "You see a stronger case for bounded defense use of frontier AI."
      : score <= 3
        ? "You are more worried that military normalization will make safety harder to preserve."
        : "You draw distinctions between limited use and broader military integration.",
  legitimacy: (score) =>
    score >= 5
      ? "You want rules to be visibly grounded in public institutions or international processes."
      : score <= 3
        ? "You are more accepting of expert-led or technocratic rule-setting when speed matters."
        : "You want legitimacy and expertise both present, even if the balance is unresolved.",
  humanFuture: (score) =>
    score >= 5
      ? "You want governance to preserve meaningful human control as systems become more capable."
      : score <= 3
        ? "You are more open to transformative AI-led futures if the upside is large enough."
        : "You are open to transformation, but you want institutions to absorb it in a more managed way.",
}

export type AxisCard = {
  axis: AiAxisKey
  label: string
  score: number
  description: string
}

export function getAxisCards(axisScores: AiAxisScores): AxisCard[] {
  return (Object.entries(axisScores) as Array<[AiAxisKey, number]>).map(([axis, score]) => ({
    axis,
    label: aiAxisLabels[axis],
    score,
    description: axisOneLiners[axis](score),
  }))
}

export function buildAiGovernanceSummary(
  archetypeKey: AiArchetypeKey,
  axisScores: AiAxisScores,
  riskLens: RiskLens,
  paceModifier: PaceModifier,
): string {
  const strongestAxes = (Object.entries(axisScores) as Array<[AiAxisKey, number]>)
    .sort((a, b) => Math.abs(b[1] - 4) - Math.abs(a[1] - 4))
    .slice(0, 2)
    .map(([axis]) => aiAxisLabels[axis].toLowerCase())

  return `You read AI governance mainly through ${archetypeLabels[archetypeKey].toLowerCase()} logic. Your strongest signals sit around ${strongestAxes[0]} and ${strongestAxes[1]}. In practical terms, you lean toward ${riskLens.toLowerCase()} and ${paceModifier.toLowerCase()} rather than treating AI as a simple pro- or anti-technology question.`
}

export type TensionRule = {
  key: string
  condition: (scores: AiAxisScores) => boolean
  text: string
}

export const aiGovernanceTensions: TensionRule[] = [
  {
    key: "compete-and-coordinate",
    condition: (scores) => scores.geopolitics >= 5 && scores.legitimacy >= 5,
    text: "You take strategic competition seriously, yet you also want rules with broader legitimacy. That combination is coherent, but it leaves a hard operational question: how much trust and reciprocity do you think real rivals will accept?",
  },
  {
    key: "open-and-cautious",
    condition: (scores) => scores.openness <= 3 && scores.deploymentPace >= 5,
    text: "You are relatively open to diffusion, but you still prefer caution under uncertainty. The unresolved issue is where you would draw a real threshold for slowing down once openness starts to amplify risk.",
  },
  {
    key: "state-and-global",
    condition: (scores) => scores.oversight >= 5 && scores.geopolitics <= 3,
    text: "You want stronger public oversight and stronger coordination at the same time. The difficult design problem is who should actually wield authority when national sovereignty and international governance collide.",
  },
  {
    key: "military-and-human-control",
    condition: (scores) => scores.militaryRole >= 5 && scores.humanFuture >= 5,
    text: "You see a case for bounded military use, but you also want human control to remain central. The key pressure-test is whether that line can stay bright once operational incentives intensify.",
  },
]

export function getActiveAiGovernanceTensions(axisScores: AiAxisScores): TensionRule[] {
  return aiGovernanceTensions.filter((rule) => rule.condition(axisScores))
}
