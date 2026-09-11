import { aiAxisScoresToArray, encodeAiPayload, resolveAiPayload } from "@/lib/ai-governance-share"
import type { AiAnswers, AiQuizMode } from "@/lib/ai-governance-types"

export type AiObservation = { kind: "direct-observation"; id: string; prompt: string; selection: string; secondary?: string }
export type AiCompletionEvidence = { payload: string; mode: AiQuizMode; bank: number; scorer: number; locale: "en"; observations: AiObservation[] }

const likertLabels = ["", "Strongly disagree", "Disagree", "Somewhat disagree", "Neutral", "Somewhat agree", "Agree", "Strongly agree"]

/** Validates a complete administration against the exact frozen result before deriving wording. */
export function qualifyAiCompletion(payload: string, answers: AiAnswers, mode: AiQuizMode): AiCompletionEvidence | null {
  const version = resolveAiPayload(payload)
  if (!version) return null
  const questions = [...version.schema.getAiCoreQuestions(mode), ...version.scoring.getAiScenarioSequence(answers, mode)]
  const observations: AiObservation[] = []
  for (const question of questions) {
    const answer = answers[question.id]
    if (question.kind === "likert") {
      if (typeof answer !== "number" || !Number.isInteger(answer) || answer < 1 || answer > 7) return null
      observations.push({ kind: "direct-observation", id: question.id, prompt: question.prompt, selection: `${likertLabels[answer]} (${answer} of 7)` })
    } else {
      const primary = typeof answer === "object" ? answer.primary : answer
      const secondary = typeof answer === "object" ? answer.secondary : undefined
      const options = version.schema.getScenarioOptions(question, mode)
      const selected = options.find(option => option.id === primary)
      const backup = options.find(option => option.id === secondary)
      if (!selected || (secondary && (!backup || secondary === primary))) return null
      observations.push({ kind: "direct-observation", id: question.id, prompt: mode === "analyst" ? question.analystPrompt ?? question.prompt : question.prompt, selection: selected.label, ...(backup ? { secondary: backup.label } : {}) })
    }
  }
  const result = version.scoring.generateAiGovernanceResult(answers, mode)
  const issued = encodeAiPayload({ ...version.payload, as: aiAxisScoresToArray(result.axisScores), ak: result.archetypeKey,
    nk: version.scoring.getNeighboringArchetypeKey(result.archetypeKey, result.archetypeScores), rl: result.riskLens, pm: result.paceModifier, gm: result.geopoliticsModifier })
  if (issued !== payload) return null
  return { payload, mode, bank: version.bankVersion, scorer: version.scoringVersion, locale: "en", observations }
}

// Ephemeral, same-navigation handoff only. Never read a saved draft as completion evidence.
// No storage key, codec field, history field, API, telemetry or answer retention is added.
let pending: AiCompletionEvidence | null = null
export function handoffAiCompletion(payload: string, answers: AiAnswers, mode: AiQuizMode) {
  pending = qualifyAiCompletion(payload, answers, mode)
}
export function takeAiCompletion(payload: string): AiCompletionEvidence | null {
  const value = pending
  pending = null
  return value?.payload === payload ? value : null
}
