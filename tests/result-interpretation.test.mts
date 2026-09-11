import test from "node:test"
import assert from "node:assert/strict"
import { aiAnswers, foundationAnswers, makeSyntheticRecord, qualifyRecord } from "@/experiments/result-payoff/fixtures"
import { SUPPORTED_AI_GOVERNANCE_VERSIONS, getCurrentAiGovernanceVersion } from "@/lib/ai-governance-versions"
import { aiAxisScoresToArray, encodeAiPayload, resolveAiPayload } from "@/lib/ai-governance-share"
import { buildAiInterpretation, aiAxisReading, aiComparisonTerms } from "@/lib/results/ai-interpretation"
import { buildFoundationInterpretation, foundationAxisReading } from "@/lib/results/foundation-interpretation"
import { buildFoundationInterpretationZh } from "@/lib/results/foundation-interpretation-zh"
import { buildFoundationPayoff } from "@/lib/results/foundation-payoff"
import { buildModuleInterpretation } from "@/lib/results/module-interpretation"
import { qualifyAiCompletion, handoffAiCompletion, takeAiCompletion } from "@/lib/results/ai-completion-evidence"
import { syntheticAnswers } from "@/tests/decision-exercises/fixtures"
import { generateResult } from "@/lib/scoring"
import { SUPPORTED_MODULE_VERSIONS } from "@/lib/modules/versions"
import type { AiAnswers, AiQuizMode } from "@/lib/ai-governance-types"
import type { Answers } from "@/lib/types"
import type { ModuleAnswers } from "@/lib/modules/types"

function aiFixture(answers: AiAnswers, mode: AiQuizMode = "standard", version = getCurrentAiGovernanceVersion()) {
  const result = version.scoring.generateAiGovernanceResult(answers, mode)
  const payload = encodeAiPayload({ v: 2, bv: version.bankVersion, sv: version.scoringVersion, as: aiAxisScoresToArray(result.axisScores), ak: result.archetypeKey,
    nk: version.scoring.getNeighboringArchetypeKey(result.archetypeKey, result.archetypeScores), rl: result.riskLens, pm: result.paceModifier, gm: result.geopoliticsModifier })
  return { result, payload, resolved: resolveAiPayload(payload)! }
}

test("complete same-label AI counterexamples get different combinations without inheriting item claims", () => {
  const readings = new Map<string, Set<string>>()
  const version = getCurrentAiGovernanceVersion()
  for (let seed = 1; seed <= 1600; seed++) {
    let state = seed
    const next = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state }
    const answers: AiAnswers = Object.fromEntries(version.schema.getAiCoreQuestions("standard").map(q => [q.id, 1 + next() % 7]))
    for (const q of version.scoring.getAiScenarioSequence(answers, "standard")) answers[q.id] = version.schema.getScenarioOptions(q, "standard")[next() % version.schema.getScenarioOptions(q, "standard").length].id
    const record = makeSyntheticRecord("ai-governance", answers)
    assert.ok(qualifyRecord(record))
    const fixture = aiFixture(answers)
    const reading = buildAiInterpretation(fixture.resolved)
    const summaries = readings.get(fixture.result.archetypeKey) ?? new Set<string>()
    summaries.add(reading.summary); readings.set(fixture.result.archetypeKey, summaries)
    assert.equal(reading.kind, "model-interpretation")
    assert.equal(reading.example.kind, "illustrative-implication")
    assert.equal(reading.followUp.kind, "follow-up")
    assert.doesNotMatch(reading.summary, /you (?:selected|answered|chose)|will choose|percentile/i)
  }
  assert.equal(readings.size, 6)
  for (const [key, summaries] of readings) assert.ok(summaries.size > 1, `${key} must vary within the same label`)
})

test("score-identical completed gp witnesses retain different exact selections only through an explicit handoff", () => {
  const fixtures = [7, 1, 4].map(n => {
    const answers = { ...aiAnswers, gp1: n, gp2: n }
    const record = makeSyntheticRecord("ai-governance", answers)
    assert.ok(qualifyRecord(record))
    const fixture = aiFixture(answers)
    handoffAiCompletion(fixture.payload, answers, "standard")
    answers.gp1 = 2 // Later draft edits cannot mutate derived completion evidence.
    const evidence = takeAiCompletion(fixture.payload)!
    assert.ok(evidence)
    assert.equal(takeAiCompletion(fixture.payload), null)
    return { ...fixture, evidence }
  })
  assert.equal(new Set(fixtures.map(f => f.payload)).size, 1)
  assert.equal(new Set(fixtures.map(f => buildAiInterpretation(f.resolved).summary)).size, 1)
  assert.equal(new Set(fixtures.map(f => f.evidence.observations.find(row => row.id === "gp1")!.selection)).size, 3)
  const fixture = aiFixture(aiAnswers)
  assert.equal(qualifyAiCompletion(fixture.payload, { ...aiAnswers, rh1: undefined }, "standard"), null)
  assert.equal(qualifyAiCompletion(fixture.payload, { ...aiAnswers, rh1: 1 }, "standard"), null)
  handoffAiCompletion(fixture.payload, aiAnswers, "standard")
  assert.equal(takeAiCompletion("unrelated"), null)
  assert.equal(takeAiCompletion(fixture.payload), null)
})

test("exact AI terms reconcile every registered scorer, rounding and six-way ties", () => {
  for (const version of SUPPORTED_AI_GOVERNANCE_VERSIONS) {
    const fixture = aiFixture(aiAnswers, "standard", version)
    const comparison = aiComparisonTerms(fixture.resolved)
    assert.ok(Math.abs(comparison.rows.reduce((sum, row) => sum + row.term, 0) + comparison.residual - comparison.difference) < 1e-10)
    assert.ok(comparison.rows.some(row => row.term < 0), "Divergent terms must survive")
    const tie = resolveAiPayload(encodeAiPayload({ ...fixture.resolved.payload, as: [4,4,4,4,4,4,4,4] }))!
    assert.equal(new Set(Object.values(tie.scoring.scoreArchetypes(Object.fromEntries(Object.keys(version.schema.aiAxisLabels).map(k => [k, 4])) as typeof fixture.result.axisScores))).size, 1)
    assert.match(buildAiInterpretation(tie).summary, /does not establish|unsettled|does not resolve/)
  }
  assert.match(aiAxisReading("humanFuture", 1), /cannot identify a preferred future/)
  assert.doesNotMatch(aiAxisReading("humanFuture", 1), /you would|upload|leave Earth/)
})

test("Foundation synthesis varies within families and respects the direction of a low institution score", () => {
  const readings = new Map<string, Set<string>>()
  for (let seed = 1; seed <= 500; seed++) {
    const answers = syntheticAnswers(seed, "core")
    const result = generateResult(answers, "analyst", "core")
    const reading = buildFoundationInterpretation(result.dimensionScores)
    const summaries = readings.get(result.familyKey) ?? new Set<string>()
    summaries.add(reading.summary); readings.set(result.familyKey, summaries)
    assert.ok(reading.example.rival && reading.example.change)
    const zh = buildFoundationInterpretationZh(result.dimensionScores)
    assert.doesNotMatch(zh.summary, /undefined|[a-z]{4}/i)
  }
  assert.equal(readings.size, 4)
  for (const summaries of readings.values()) assert.ok(summaries.size > 1)
  assert.match(foundationAxisReading("institutions", 1), /power more weight/)
  assert.doesNotMatch(foundationAxisReading("institutions", 1), /give rules real weight/)
  const comparison = buildFoundationPayoff({
    dimensionScores: { securityCompetition: 6, institutions: 1, domesticFilters: 4, normsIdentity: 4, politicalEconomy: 5, restraint: 5, orderJustice: 4 },
    familyKey: "realist", familyLabel: "Realism", runnerUpKey: "criticalPoliticalEconomy", runnerUpLabel: "Critical political economy",
    strategyModifier: "Restrainer", normativeModifier: "Conditional Solidarist",
  })
  assert.match(comparison.mainTension.rivalArgument, /political-economy challenge/)
  assert.notEqual(comparison.mainTension.rivalArgument, comparison.interpretation.example.rival,
    "The modeled runner-up must not inherit a different rival from the illustrative case")
  for (const id of ["sc2", "in2", "rs2"]) {
    const record = makeSyntheticRecord("foundation", { ...foundationAnswers, [id]: 1 })
    assert.ok(qualifyRecord(record))
    const result = generateResult(record.answers as Answers, "analyst", "core")
    assert.doesNotMatch(buildFoundationInterpretation(result.dimensionScores).summary, /you selected|you answered/i)
  }
})

test("all module versions keep their issued calculation while examples vary with complete responses", () => {
  for (const versions of Object.values(SUPPORTED_MODULE_VERSIONS)) for (const version of versions) for (const mode of ["standard", "analyst"] as const) {
    const summaries = new Set<string>()
    // Include score-directed, complete counterexamples. Option position is not
    // a worldview: v4 deliberately distributes logics across its option order.
    for (let pick = 0; pick < 6; pick++) {
      const questions = version.runtime.getModuleQuestions(version.definition, mode)
      const axis = version.definition.axes[0].key
      const answers: ModuleAnswers = Object.fromEntries(questions.map(q => [q.id, { primary: pick < 4 ? q.options[pick % q.options.length].id : [...q.options].sort((a, b) => (pick === 4 ? -1 : 1) * ((b.signals[axis] ?? 4) - (a.signals[axis] ?? 4)))[0].id }]))
      const result = version.runtime.buildModuleResult(version.definition, mode, answers)
      const before = JSON.stringify(result)
      const reading = buildModuleInterpretation(version.definition, result, questions.filter(q => q.cardType !== "actorLens").length, { ...version, mode })
      assert.equal(JSON.stringify(result), before)
      summaries.add(reading.summary)
      assert.ok(reading.example.facts && reading.example.application && reading.example.rival && reading.example.change)
    }
    assert.ok(summaries.size > 1, `${version.definition.slug}/${version.bankVersion}/${mode}`)
    const empty = version.runtime.buildModuleResult(version.definition, mode, {})
    assert.match(buildModuleInterpretation(version.definition, empty, 0, { ...version, mode }).summary, /No scored selections/)
  }
})
