import { generateResult, buildCanonicalFoundationResult } from "@/lib/scoring"
import { buildFoundationSharePayload, encodePayload, PAYLOAD_DIMENSION_ORDER } from "@/lib/share"
import { getCurrentAiGovernanceVersion } from "@/lib/ai-governance-versions"
import { encodeAiPayload, aiAxisScoresToArray } from "@/lib/ai-governance-share"
import { encodeModulePayload, resolveModulePayload } from "@/lib/modules/framework"
import { getCurrentModuleVersion } from "@/lib/modules/versions"
import { parseProfileStore } from "@/lib/profile-store"
import { syntheticAnswers } from "@/tests/decision-exercises/fixtures"
import type { DimensionScores } from "@/lib/types"
import type { AiAnswers } from "@/lib/ai-governance-types"

export function foundationToken(values = [5.8, 5.5, 3.2, 2.7, 4.6, 5.3, 3.8]) {
  const scores = Object.fromEntries(PAYLOAD_DIMENSION_ORDER.map((k, i) => [k, values[i]])) as DimensionScores
  return encodePayload(buildFoundationSharePayload(buildCanonicalFoundationResult(scores, "core"), "en", "core"))
}
export function moduleToken(slug: "security" | "technology", offset = 0, mode: "standard" | "analyst" = "standard") {
  const v = getCurrentModuleVersion(slug)
  const answers = Object.fromEntries(v.runtime.getModuleQuestions(v.definition, mode).map((q, i) => [q.id, { primary: q.options[(i + offset) % q.options.length].id }]))
  return encodeModulePayload({ v: 3, bv: v.bankVersion, sv: v.scoringVersion, slug, mode, answers })
}
export function aiFixture(seed = 7) {
  const v = getCurrentAiGovernanceVersion()
  let state = seed
  const next = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state }
  const answers: AiAnswers = Object.fromEntries(v.schema.getAiCoreQuestions("standard").map(q => [q.id, 1 + next() % 7]))
  for (const q of v.scoring.getAiScenarioSequence(answers, "standard")) answers[q.id] = v.schema.getScenarioOptions(q, "standard")[next() % v.schema.getScenarioOptions(q, "standard").length].id
  const r = v.scoring.generateAiGovernanceResult(answers, "standard")
  const token = encodeAiPayload({ v: 2, bv: v.bankVersion, sv: v.scoringVersion, as: aiAxisScoresToArray(r.axisScores), ak: r.archetypeKey, nk: v.scoring.getNeighboringArchetypeKey(r.archetypeKey, r.archetypeScores), rl: r.riskLens, pm: r.paceModifier, gm: r.geopoliticsModifier })
  return { token, answers, result: r }
}
export function syntheticProfile() {
  const answers = syntheticAnswers(419, "core")
  const result = generateResult(answers, "analyst", "core")
  const token = encodePayload(buildFoundationSharePayload(result, "en", "core"))
  const ai = aiFixture()
  const base = { timestamp: 1800000000000, locale: "en", localeCopyVersion: 1 }
  return { answers, token, profile: parseProfileStore(JSON.stringify({ v: 5, foundation: { ...base, mode: "standard", payload: token, familyKey: result.familyKey, runnerUpKey: result.runnerUpKey, dimensionScores: result.dimensionScores, strategyModifier: result.strategyModifier, normativeModifier: result.normativeModifier }, modules: Object.fromEntries((["security", "technology"] as const).map(slug => [slug, { ...base, slug, payload: moduleToken(slug), mode: "standard", scores: resolveModulePayload(moduleToken(slug))!.runtime.buildModuleResult(getCurrentModuleVersion(slug).definition, "standard", resolveModulePayload(moduleToken(slug))!.payload.answers).scores, laneScores: resolveModulePayload(moduleToken(slug))!.runtime.buildModuleAnalytics(getCurrentModuleVersion(slug).definition, "standard", resolveModulePayload(moduleToken(slug))!.payload.answers).laneScores, overlayDeltas: {}, instrumentVersion: slug === "technology" ? 3 : 5 }])), aiGovernance: { ...base, payload: ai.token, archetypeKey: ai.result.archetypeKey, riskLens: ai.result.riskLens, paceModifier: ai.result.paceModifier, geopoliticsModifier: ai.result.geopoliticsModifier, axisScores: ai.result.axisScores } })) }
}
