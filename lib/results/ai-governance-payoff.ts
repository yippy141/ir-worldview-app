import type { AiResult } from "@/lib/ai-governance-types"
import {
  buildAiGovernanceDeepDive,
  getPrimaryAxisSummary,
  type PolicySignal,
} from "@/lib/ai-governance-results-v2"

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

export function buildAiGovernancePayoff(result: AiResult): AiGovernancePayoff {
  const deepDive = buildAiGovernanceDeepDive(result)
  const mainTension = deepDive.tensions[0] ?? {
    title: "Tradeoffs you resolve case by case",
    text:
      "Your answers do not collapse into a single doctrine. The useful test is where your default changes when the stakes become concrete.",
  }

  return {
    governingInstinct: deepDive.governingInstinct,
    shortRead: deepDive.shareBlurb,
    mainSignal: getPrimaryAxisSummary(result.axisScores),
    mainTension,
    policyDebates: deepDive.policySignals.slice(0, 4).map(toPolicyDebate),
    pressureTest: {
      title: "Question to pressure-test next",
      text: deepDive.questionToSitWith,
    },
  }
}

function toPolicyDebate(signal: PolicySignal): AiGovernancePayoff["policyDebates"][number] {
  return {
    title: signal.title,
    question: debateQuestions[signal.title] ?? "What tradeoff should decide the policy line here?",
    text: `${signal.stance}. ${signal.explanation}`,
  }
}
