import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { aiAnswers, makeSyntheticRecord, qualifyRecord, foundationExample, aiExample } from "@/experiments/result-payoff/fixtures"
import { compareAi, rankExact } from "@/experiments/result-payoff/evidence"
import { episodes, completeEpisode, syntheticPrior } from "@/experiments/result-payoff/episodes"
import { getCurrentAiGovernanceVersion, SUPPORTED_AI_GOVERNANCE_VERSIONS } from "@/lib/ai-governance-versions"
import { getAiAxisPush } from "@/lib/ai-governance-results"
import { getCurrentModuleVersion } from "@/lib/modules/versions"
import securityBank from "@/content/instrument/security.v5.json" with { type: "json" }
import type { AiAnswers, AiAxisKey, AiAxisScores } from "@/lib/ai-governance-types"

const ai = getCurrentAiGovernanceVersion()

test("payoff characterization: three complete Standard gp pairs lose different information into identical results", () => {
  assert.deepEqual([ai.bankVersion, ai.scoringVersion], [3, 2])
  const gp = ai.schema.getAiCoreQuestions("standard").filter(q => q.axis === "geopolitics")
  assert.deepEqual(gp.map(q => [q.id, q.reverse]), [["gp1", false], ["gp2", true]])
  const results = [7, 1, 4].map(value => {
    const answers: AiAnswers = { ...aiAnswers, gp1: value, gp2: value }
    assertCompleteStandard(answers)
    assert.equal(ai.scoring.computeAiCoreAxisScores(answers).geopolitics, 4)
    return ai.scoring.generateAiGovernanceResult(answers, "standard")
  })
  assert.deepEqual(results[0], results[1])
  assert.deepEqual(results[0], results[2])
  assert.equal(results[0].axisScores.geopolitics, 3.7)
})

test("payoff characterization: complete reachable Standard path has order-sensitive final axis, same archetype", () => {
  const answers: AiAnswers = Object.fromEntries(ai.schema.getAiCoreQuestions("standard").map(q => [q.id, q.reverse ? 1 : 7]))
  Object.assign(answers, { capabilityThreshold: "C", rivalBreakthrough: "A", openWeights: "A", militaryIntegration: "A", multilateralVerification: "A", futureSociety: "A" })
  assertCompleteStandard(answers)
  const sequence = ai.scoring.getAiScenarioSequence(answers, "standard")
  // These are independent roots. Never permute branching narratives in this test.
  assert.ok(sequence.every(q => q.options.every(o => !o.followUpId)))
  assert.deepEqual(sequence.map(q => q.id), ai.schema.getAiScenarioOrder("standard"))
  // Narrow diagnostic replay of the inspected incremental clamp; unchanged official
  // generation is the equality oracle for the original complete path.
  function replay(order: typeof sequence): AiAxisScores {
    const scores = ai.scoring.computeAiCoreAxisScores(answers)
    for (const question of order) {
      const option = ai.schema.getScenarioOptions(question, "standard").find(o => o.id === answers[question.id])!
      for (const [axis, weight] of Object.entries(option.weights) as [AiAxisKey, number][]) {
        scores[axis] = Math.max(1, Math.min(7, scores[axis] + weight))
      }
    }
    return Object.fromEntries(Object.entries(scores).map(([key, value]) => [key, Number(value.toFixed(2))])) as AiAxisScores
  }
  const original = ai.scoring.generateAiGovernanceResult(answers, "standard")
  assert.deepEqual(replay(sequence), original.axisScores)
  const permuted = replay([sequence[1], sequence[0], ...sequence.slice(2)])
  assert.equal(original.axisScores.geopolitics, 5.5)
  assert.equal(permuted.geopolitics, 5.9)
  assert.deepEqual(Object.keys(permuted).filter(key => permuted[key as AiAxisKey] !== original.axisScores[key as AiAxisKey]), ["geopolitics"])
  assert.equal(rankExact(ai.scoring.scoreArchetypes(permuted)).ordered[0][0], original.archetypeKey)
  assert.equal(original.archetypeKey, "precautionarySteward")
})

test("payoff characterization: midpoint extremity differs from exact version-specific comparison", () => {
  const result = ai.scoring.generateAiGovernanceResult(aiAnswers, "standard")
  const push = getAiAxisPush(result.axisScores)
  assert.equal(push[0].key, "oversight")
  assert.equal(push[0].deviation, 1)
  for (const version of SUPPORTED_AI_GOVERNANCE_VERSIONS) {
    const comparison = compareAi(result.axisScores, version.bankVersion, version.scoringVersion)!
    const termSum = comparison.terms.reduce((sum, row) => sum + row.term, 0)
    assert.ok(Math.abs(termSum + comparison.residual - (comparison.primaryScore - comparison.alternativeScore)) < 1e-12)
    assert.equal(comparison.terms.find(row => row.axis === "Public oversight")!.term, -1.2000000000000002)
    assert.equal(comparison.terms.find(row => row.axis === "Risk horizon")!.term, 2.16)
  }
  assert.equal(compareAi(result.axisScores, 99, 99), null)
})

test("payoff characterization: Security explanation prompt still contains policy-action options", () => {
  assert.equal(getCurrentModuleVersion("security").bankVersion, 5)
  const question = securityBank.items.find(q => q.id === "gray_zone_sabotage")!
  assert.equal(question.cardType, "explanation")
  assert.equal(question.prompt, "What is the most persuasive reading of what the rival is testing?")
  assert.deepEqual(question.options.map(o => o.label.split(" ")[0]), ["Publish", "Create", "Prioritize", "Hold"])
})

test("payoff evidence: complete synthetic bindings qualify; missing, stale and mismatched evidence fails closed", () => {
  for (const instrument of ["foundation", "ai-governance"] as const) {
    const original = makeSyntheticRecord(instrument)
    assert.ok(qualifyRecord(original))
    for (const change of ["missing", "bank", "scorer", "form", "copy", "result", "response"] as const) {
      const candidate = structuredClone(original)
      if (change === "missing") delete candidate.answers
      else if (change === "result") candidate.result = {}
      else if (change === "response") candidate.answers![Object.keys(candidate.answers!)[0]] = 4
      else if (change === "form") candidate.provenance.form = "legacy"
      else candidate.provenance[change] = 99
      assert.equal(qualifyRecord(candidate), false, `${instrument}/${change}`)
    }
  }
  // Deliberately score-identical responses still cannot masquerade as the bound item evidence.
  const equal = makeSyntheticRecord("ai-governance")
  equal.answers!.gp1 = 1; equal.answers!.gp2 = 1
  assert.deepEqual(ai.scoring.generateAiGovernanceResult(equal.answers as AiAnswers, "standard"), equal.result)
  assert.equal(qualifyRecord(equal), false)
  assert.equal(foundationExample({ ...makeSyntheticRecord("foundation"), answers: undefined }), null)
  assert.equal(aiExample({ ...makeSyntheticRecord("ai-governance"), answers: undefined }), null)
})

test("payoff evidence: low separation retains two readings and all exact ties stay ties", () => {
  const example = foundationExample()!
  assert.equal(example.archetype.code, "P/R-")
  assert.ok(Math.abs(example.result.nearestFitGap - 0.3) < 1e-12)
  assert.deepEqual(example.evidence.map(e => e.id), ["sc2", "in2", "rs2"])
  assert.deepEqual(rankExact({ first: 0, second: 0, third: -1 }).tied, ["first", "second"])
  const neutral = Object.fromEntries(Object.keys(ai.schema.aiAxisLabels).map(key => [key, 4])) as AiAxisScores
  assert.equal(compareAi(neutral, 3, 2)!.tied.length, 6)
})

test("payoff episodes: every actual option/reason combination drives changed and unchanged readbacks", () => {
  for (const episode of Object.values(episodes)) {
    for (const first of episode.options) for (const second of episode.options) for (const reason of episode.reasons) {
      const result = completeEpisode(episode, { option: first.id, reason: reason.id }, { option: second.id, reason: reason.id })!
      assert.ok(result.observation.text.includes(first.label))
      assert.ok(result.observation.text.includes(second.label))
      assert.ok(result.observation.text.includes(episode.condition.before))
      assert.ok(result.observation.text.includes(episode.condition.after))
      assert.equal(result.interpretation.text, first.id === second.id ? episode.outcome.unchanged : episode.outcome.changed)
      assert.ok(result.observation.refs.every(ref => ref.text.includes(reason.text)))
    }
    assert.equal(completeEpisode(episode, { option: "missing", reason: "missing" }, { option: "", reason: "" }), null)
    assert.ok(episode.options.every(option => option.acceptedTradeoff))
  }
  assert.ok(completeEpisode(episodes.verify, syntheticPrior.first, syntheticPrior.second))
})

test("payoff isolation: one episode player, no telemetry, storage, payload URL or production navigation registration", () => {
  const files = ["episode-player.tsx", "followups.tsx", "experiment.tsx", "result-reading.tsx"]
  for (const file of files) {
    const source = readFileSync(`experiments/result-payoff/${file}`, "utf8")
    assert.doesNotMatch(source, /localStorage|sessionStorage|fetch\(|sendBeacon|trackProductEvent|\/results\/\$\{/)
  }
  const page = readFileSync("app/dev/result-payoff/page.tsx", "utf8")
  assert.match(page, /process\.env\.NODE_ENV === "production"\) notFound\(\)/)
  assert.equal(readFileSync("experiments/result-payoff/experiment.tsx", "utf8").match(/<EpisodePlayer /g)!.length, 1)
  assert.doesNotMatch(readFileSync("app/sitemap.ts", "utf8"), /result-payoff/)
})
function assertCompleteStandard(answers: AiAnswers) {
  const core = ai.schema.getAiCoreQuestions("standard")
  const sequence = ai.scoring.getAiScenarioSequence(answers, "standard")
  assert.equal(Object.keys(answers).length, core.length + sequence.length)
  for (const q of core) assert.ok(typeof answers[q.id] === "number" && Number(answers[q.id]) >= 1 && Number(answers[q.id]) <= 7)
  for (const q of sequence) assert.ok(ai.schema.getScenarioOptions(q, "standard").some(o => o.id === answers[q.id]))
}
