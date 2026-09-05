import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { foundationAnswers, authoredClaimApplies, authoredReadingUnavailable, aiAnswers, makeSyntheticRecord, qualifyRecord, foundationExample, aiExample } from "@/experiments/result-payoff/fixtures"
import { compareAi, rankExact } from "@/experiments/result-payoff/evidence"
import { episodes, completeEpisode, syntheticPrior, deferredDecision } from "@/experiments/result-payoff/episodes"
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

test("payoff applicability: valid complete rebound counterexamples do not inherit authored claims", () => {
  for (const id of ["sc2", "in2", "rs2"]) {
    const record = makeSyntheticRecord("foundation", { ...foundationAnswers, [id]: 1 })
    assert.ok(qualifyRecord(record), id)
    assert.equal(authoredClaimApplies.foundationPreparation(record.answers!), false)
    assert.equal(foundationExample(record), null)
  }
  for (const change of [{ rh1: 1 }, { capabilityThreshold: "C" }, { openWeights: "A" }] as AiAnswers[]) {
    const record = makeSyntheticRecord("ai-governance", { ...aiAnswers, ...change })
    assert.ok(qualifyRecord(record))
    assert.equal(aiExample(record), null)
  }
  assert.match(authoredReadingUnavailable, /complete answers do not support/)
  const pairs = [7, 1, 4].map(n => makeSyntheticRecord("ai-governance", { ...aiAnswers, gp1: n, gp2: n }))
  pairs.forEach(record => assert.ok(qualifyRecord(record)))
  assert.deepEqual(pairs[0].result, pairs[1].result)
  assert.deepEqual(pairs[0].result, pairs[2].result)
  assert.equal(new Set(pairs.map(record => record.binding)).size, 3)
  assert.ok(aiExample(pairs[0])!.pairClaim)
  assert.equal(aiExample(pairs[1])!.pairClaim, null)
  assert.equal(aiExample(pairs[2])!.pairClaim, null)
  assert.deepEqual(pairs.map(r => aiExample(r)!.pair.map(p => p.answer)), [[7, 7], [1, 1], [4, 4]])
})

test("payoff authored AI scope excludes a different rival and exact ties; pair text does not invent an average", () => {
  const differentRival = makeSyntheticRecord("ai-governance", { ...aiAnswers, rh2: 3, dp1: 7, dp2: 5, ov1: 4, ov2: 6, gp1: 5, gp2: 6, op1: 2, op2: 7, mr1: 6, mr2: 4, lg1: 1, lg2: 5, hf1: 3, hf2: 4 })
  assert.ok(qualifyRecord(differentRival))
  const r = ai.scoring.generateAiGovernanceResult(differentRival.answers as AiAnswers, "standard")
  assert.equal(r.archetypeKey, "precautionarySteward")
  assert.equal(compareAi(r.axisScores, 3, 2)!.alternative, "Strategic Competitor")
  assert.equal(aiExample(differentRival), null)
  const tie = makeSyntheticRecord("ai-governance", { ...aiAnswers, rh2: 1, dp1: 5, dp2: 4, ov1: 6, ov2: 1, gp1: 7, gp2: 6, op1: 7, op2: 3, mr1: 6, mr2: 1, lg1: 7, lg2: 7, hf1: 6, hf2: 3 })
  assert.ok(qualifyRecord(tie))
  const t = ai.scoring.generateAiGovernanceResult(tie.answers as AiAnswers, "standard")
  assert.deepEqual(compareAi(t.axisScores, 3, 2)!.tied, ["Precautionary Steward", "Democratic Guardrailist"])
  assert.equal(aiExample(tie), null)
  const uneven = makeSyntheticRecord("ai-governance", { ...aiAnswers, gp1: 6, gp2: 7 })
  assert.ok(qualifyRecord(uneven))
  assert.equal(ai.scoring.computeAiCoreAxisScores(uneven.answers as AiAnswers).geopolitics, 3.5)
  assert.ok(aiExample(uneven)!.pairClaim)
  assert.doesNotMatch(aiExample(uneven)!.pairClaim!.supports, /average is 4/)
  const otherScenario = makeSyntheticRecord("ai-governance", { ...aiAnswers, rivalBreakthrough: "A" })
  assert.ok(qualifyRecord(otherScenario))
  assert.deepEqual(aiExample(otherScenario)!.pairDiagnostic, { identical: true, finalGeopolitics: 3.2 })
  assert.deepEqual(aiExample()!.pairDiagnostic, { identical: true, finalGeopolitics: 3.7 })
})

test("payoff episodes: full option × option × independent reason × reason coverage", () => {
  let covered = 0
  const relations = new Set<string>()
  for (const episode of Object.values(episodes)) {
    for (const first of [...episode.options, deferredDecision]) for (const second of [...episode.options, deferredDecision]) {
      for (const firstReason of episode.reasons) for (const secondReason of episode.reasons) {
        const result = completeEpisode(episode, { option: first.id, reason: firstReason.id }, { option: second.id, reason: secondReason.id })!
        assert.ok(result)
        assert.ok(result.observation.text.includes(first.label))
        assert.ok(result.observation.text.includes(second.label))
        assert.ok(result.observation.text.includes(episode.condition.before))
        assert.ok(result.observation.text.includes(episode.condition.after))
        assert.ok(result.observation.refs[0].text.includes(firstReason.text))
        assert.ok(result.observation.refs[1].text.includes(secondReason.text))
        assert.doesNotMatch(result.interpretation.text, /undefined|null|this proves|your personality/)
        assert.ok(result.interpretation.text.length > 60)
        assert.ok(result.interpretation.doesNotSupport.length > 30)
        relations.add(result.relation)
        covered++
      }
    }
    assert.equal(completeEpisode(episode, { option: "missing", reason: "none" }, { option: "defer", reason: "none" }), null)
    assert.equal(completeEpisode(episode, { option: "defer", reason: "unregistered" }, { option: "defer", reason: "none" }), null)
    assert.ok(episode.options.every(option => option.acceptedTradeoff))
    assert.equal(episode.options.length, 3)
  }
  assert.equal(covered, 800)
  assert.deepEqual([...relations].sort(), ["changed-arrangement-changed-reason", "changed-arrangement-same-reason", "decision-deferred", "reason-needs-clarification", "same-arrangement-changed-reason", "same-arrangement-same-reason", "unexpressed-reason"].sort())
})

test("payoff authored transitions: independently specified institutional and reason expectations", () => {
  const verify = completeEpisode(episodes.verify, syntheticPrior.first, syntheticPrior.second)!
  assert.match(verify.interpretation.text, /retained an external check while abandoning asymmetric national inspection/)
  assert.match(verify.interpretation.text, /from timely, first-hand evidence to reciprocal inspection rights/)
  assert.match(verify.interpretation.doesNotSupport, /does not establish a permanent egalitarian trait/)
  const custodian = completeEpisode(episodes.verify, { option: "custodian", reason: "equal" }, { option: "custodian", reason: "equal" })!
  assert.match(custodian.interpretation.text, /custodian's access remains reciprocal in both conditions/)
  assert.match(custodian.interpretation.text, /does not accept one-sided national inspection rights/)
  assert.deepEqual(custodian.affected, { original: false, revised: false })
  const hosted = completeEpisode(episodes.access, { option: "enclave", reason: "scrutiny" }, { option: "hosted", reason: "contain" })!
  assert.match(hosted.interpretation.text, /withdrew support for this form of outside access/)
  assert.match(hosted.interpretation.text, /not a blanket rejection of outside criticism/)
  assert.match(hosted.interpretation.text, /from criticism the developer cannot veto to retaining the ability to limit access/)
  const weights = completeEpisode(episodes.access, { option: "enclave", reason: "scrutiny" }, { option: "weights", reason: "reproduce" })!
  assert.match(weights.interpretation.text, /outside the developer's admission control/)
  assert.match(weights.interpretation.text, /cannot recall copies/)
  assert.match(weights.interpretation.text, /to independent reproduction and modification/)
  const newReason = completeEpisode(episodes.access, { option: "enclave", reason: "contain" }, { option: "enclave", reason: "scrutiny" })!
  assert.match(newReason.interpretation.text, /decision stayed the same, while your stated rationale moved/)
  assert.match(newReason.interpretation.text, /from retaining the ability to limit access to criticism the developer cannot veto/)
  assert.match(newReason.interpretation.text, /retain the same research and publication rights/)
  const sameReason = completeEpisode(episodes.access, { option: "enclave", reason: "scrutiny" }, { option: "weights", reason: "scrutiny" })!
  assert.equal(sameReason.relation, "changed-arrangement-same-reason")
  assert.match(sameReason.interpretation.text, /named criticism the developer cannot veto in both decisions/)
  const unexpressed = completeEpisode(episodes.access, { option: "enclave", reason: "none" }, { option: "hosted", reason: "none" })!
  assert.equal(unexpressed.relation, "unexpressed-reason")
  assert.match(unexpressed.interpretation.text, /choices alone do not supply that missing rationale/)
  const unsupported = completeEpisode(episodes.access, { option: "weights", reason: "contain" }, { option: "weights", reason: "contain" })!
  assert.equal(unsupported.relation, "reason-needs-clarification")
  assert.match(unsupported.interpretation.doesNotSupport, /cannot be recalled or access revoked/)
  const deferred = completeEpisode(episodes.verify, { option: "defer", reason: "none" }, { option: "defer", reason: "none" })!
  assert.equal(deferred.relation, "decision-deferred")
  assert.match(deferred.interpretation.text, /does not locate you between the three policies/)
})

test("payoff isolation: one episode player, no telemetry, storage, payload URL or production navigation registration", () => {
  const files = ["episode-player.tsx", "followups.tsx", "experiment.tsx", "result-reading.tsx", "hero-marks.tsx", "episode-readbacks.ts"]
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
