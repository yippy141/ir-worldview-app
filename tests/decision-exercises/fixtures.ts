/** Deterministic synthetic fixtures for browser verification. Never imported by production. */
import { getFoundationResultQuestions } from "@/lib/quiz-schema"
import { generateResult } from "@/lib/scoring"
import { buildFoundationSharePayload, encodePayload, resolveFoundationPayload } from "@/lib/share"
import { resolveArchetype } from "@/lib/archetypes"
import { getCurrentAiGovernanceVersion } from "@/lib/ai-governance-versions"
import { aiAxisScoresToArray, encodeAiPayload } from "@/lib/ai-governance-share"
import type { Answers } from "@/lib/types"
import type { AiAnswers } from "@/lib/ai-governance-types"

export function syntheticAnswers(seed: number, questionSet: "core" | "baselineExtended" = "baselineExtended"): Answers {
  let state = seed >>> 0
  const next = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state }
  return Object.fromEntries(getFoundationResultQuestions(questionSet).map(question => {
    if (question.kind === "likert") return [question.id, 1 + next() % 7]
    const primary = next() % question.options.length
    return [question.id, question.allowSecondChoiceInAnalyst && next() % 2 === 0
      ? { primary: question.options[primary].id, secondary: question.options[(primary + 1) % question.options.length].id }
      : question.options[primary].id]
  }))
}
export function resultFixtures() {
  const foundation: Record<string, { payload: string; name: string; code: string; answers: Answers; low: boolean }> = {}
  for (let seed = 1; seed <= 4000; seed++) {
    const answers = syntheticAnswers(seed, "core")
    const raw = generateResult(answers, "analyst", "core")
    const payload = encodePayload(buildFoundationSharePayload(raw, "en", "core"))
    const resolved = resolveFoundationPayload(payload)!
    const archetype = resolveArchetype(resolved.result)
    if (!foundation[archetype.code]) foundation[archetype.code] = { payload, name: archetype.name, code: archetype.code, answers, low: resolved.result.nearestFitGap < .3675 }
    if (Object.keys(foundation).length >= 20) break
  }
  const ai = getCurrentAiGovernanceVersion()
  const governance: Record<string, { payload: string; name: string }> = {}
  for (let seed = 1; seed <= 4000; seed++) {
    let state = seed
    const next = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state }
    const answers: AiAnswers = Object.fromEntries(ai.schema.getAiCoreQuestions("standard").map(q => [q.id, 1 + next() % 7]))
    for (const question of ai.scoring.getAiScenarioSequence(answers, "standard")) {
      const options = ai.schema.getScenarioOptions(question, "standard")
      answers[question.id] = options[next() % options.length].id
    }
    const result = ai.scoring.generateAiGovernanceResult(answers, "standard")
    if (!governance[result.archetypeKey]) governance[result.archetypeKey] = { name: result.archetypeLabel, payload: encodeAiPayload({ v: 2, bv: ai.bankVersion, sv: ai.scoringVersion, as: aiAxisScoresToArray(result.axisScores), ak: result.archetypeKey, nk: result.neighboringArchetypeKey!, rl: result.riskLens, pm: result.paceModifier, gm: result.geopoliticsModifier }) }
    if (Object.keys(governance).length === 6) break
  }
  const sample = JSON.parse(Buffer.from(Object.values(governance)[0].payload, "base64url").toString())
  const tie = encodeAiPayload({ ...sample, as: [4,4,4,4,4,4,4,4] })
  return { synthetic: true, foundation, governance, tie }
}
