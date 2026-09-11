import type { ResolvedAiPayload } from "@/lib/ai-governance-share"
import type { AiResult } from "@/lib/ai-governance-types"
import { aiAxisReading, interpretAiPositions, buildAiInterpretation } from "@/lib/results/ai-interpretation"
import type { AiAxisKey } from "@/lib/ai-governance-types"

export type AiGovernancePayoff = {
  governingInstinct: string
  shortRead: string
  mainSignal: string
  mainTension: {
    title: string
    text: string
  }
  policyDebates: Array<{
    title: string
    question: string
    text: string
  }>
  pressureTest: {
    title: string
    text: string
  }
}

const debateQuestions: Record<string, string> = {
  "Frontier release thresholds":
    "What evidence should trigger release, delay, staged access, or a stronger stop?",
  "Oversight and enforcement":
    "Who should have authority when frontier developers, agencies, and outside evaluators disagree?",
  "International order":
    "When should cooperation be pursued despite rivalry, and when does verification need to come first?",
  "Openness and diffusion":
    "Where does broader access reduce dependence, and where does it outrun governance?",
  "Defense and security use":
    "Which security uses are genuinely bounded, and which would normalize a harder-to-govern frontier?",
  "Human future":
    "How much institutional control is needed before transformative capability becomes politically legitimate?",
}

export function buildAiGovernancePayoff(result: AiResult, version?: ResolvedAiPayload): AiGovernancePayoff {
  const interpretation = version ? buildAiInterpretation(version) : interpretAiPositions(result.axisScores)
  const axes: Array<{ title: string; axes: AiAxisKey[] }> = [
    { title: "Frontier release thresholds", axes: ["deploymentPace", "riskHorizon"] },
    { title: "Oversight and enforcement", axes: ["oversight", "legitimacy"] },
    { title: "International order", axes: ["geopolitics"] },
    { title: "Openness and diffusion", axes: ["openness"] },
  ]
  return {
    governingInstinct: interpretation.summary,
    shortRead: interpretation.summary,
    mainSignal: interpretation.summary,
    mainTension: { title: "A rival argument to examine", text: interpretation.example.rival },
    policyDebates: axes.map(({ title, axes }) => ({ title, question: debateQuestions[title], text: axes.map(axis => aiAxisReading(axis, result.axisScores[axis])).join(" ") })),
    pressureTest: { title: "Question to examine next", text: interpretation.followUp.question },
  }
}
