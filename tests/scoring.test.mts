import test from "node:test"
import assert from "node:assert/strict"
import { coreQuestions } from "@/lib/quiz-schema"
import { generateResult, getScenarioSequence, scoreFamilies, selectTieBreakerIds } from "@/lib/scoring"
import type { Answers } from "@/lib/types"

// Build a partial answers object covering only the first N core questions
function partialCoreAnswers(n: number): Answers {
  const answers: Answers = {}
  for (let i = 0; i < n; i++) {
    answers[coreQuestions[i].id] = 4 // neutral mid-point
  }
  return answers
}

// Build a complete answers object with all core questions answered.
function fullCoreAnswers(overrides: Answers = {}): Answers {
  const answers = partialCoreAnswers(coreQuestions.length)
  return { ...answers, ...overrides }
}

function topFamilyKey(scores: ReturnType<typeof scoreFamilies>) {
  return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0] ?? [undefined])[0]
}

test("getScenarioSequence returns empty until every core item is answered", () => {
  for (const n of [0, 1, 10, 20]) {
    const answers = partialCoreAnswers(n)
    const sequence = getScenarioSequence(answers)
    assert.strictEqual(
      sequence.length,
      0,
      `Expected empty sequence with ${n} core answers, got ${sequence.length}`,
    )
  }
})

test("getScenarioSequence returns scenarios when every core item is answered", () => {
  const answers = fullCoreAnswers()
  const sequence = getScenarioSequence(answers)
  assert.ok(sequence.length >= 3, `Expected at least 3 scenarios, got ${sequence.length}`)
  assert.ok(sequence.length <= 8, `Expected at most 8 scenarios (root + follow-ups), got ${sequence.length}`)
})

test("getScenarioSequence includes follow-up when root option triggers it", () => {
  // institutionalCapture option A triggers sanctionsBody follow-up
  const answers = fullCoreAnswers({ institutionalCapture: "A" })
  const sequence = getScenarioSequence(answers)

  // First check institutionalCapture is in the sequence
  const ids = sequence.map((q) => q.id)

  // If institutionalCapture was selected as a tie-breaker for this profile,
  // choosing A should add sanctionsBody to the sequence
  if (ids.includes("institutionalCapture")) {
    assert.ok(
      ids.includes("sanctionsBody"),
      `Expected sanctionsBody follow-up when institutionalCapture option A is chosen. Got: ${ids.join(", ")}`,
    )
  }
})

test("selectTieBreakerIds returns between 3 and 5 IDs", () => {
  const familyScores = {
    realist: 1.2,
    institutionalist: 1.0,
    constructivist: 0.3,
    criticalPoliticalEconomy: -0.2,
  }
  const dimensionScores = {
    securityCompetition: 5.5,
    institutions: 3.8,
    domesticFilters: 4.0,
    normsIdentity: 3.5,
    politicalEconomy: 3.0,
    restraint: 3.5,
    orderJustice: 4.2,
  }

  const ids = selectTieBreakerIds(familyScores, dimensionScores)
  assert.ok(ids.length >= 3, `Expected at least 3 tie-breaker IDs, got ${ids.length}`)
  assert.ok(ids.length <= 5, `Expected at most 5 tie-breaker IDs, got ${ids.length}`)
})

test("selectTieBreakerIds returns no duplicate IDs", () => {
  const familyScores = {
    realist: 0.8,
    institutionalist: 0.7,
    constructivist: 0.2,
    criticalPoliticalEconomy: -0.1,
  }
  const dimensionScores = {
    securityCompetition: 5.0,
    institutions: 4.8,
    domesticFilters: 4.5,
    normsIdentity: 3.8,
    politicalEconomy: 3.0,
    restraint: 4.0,
    orderJustice: 4.0,
  }

  const ids = selectTieBreakerIds(familyScores, dimensionScores)
  const unique = new Set(ids)
  assert.strictEqual(ids.length, unique.size, "Expected no duplicate IDs in tie-breaker selection")
})

test("scenario answers do not change the foundation result", () => {
  const answers = fullCoreAnswers({
    sc1: 6,
    sc2: 6,
    sc3: 5,
    in1: 3,
    in2: 3,
    in3: 6,
    df1: 5,
    df2: 5,
    df3: 3,
    ni1: 3,
    ni2: 3,
    ni3: 5,
    pe1: 6,
    pe2: 5,
    pe3: 2,
    rs1: 3,
    rs2: 3,
    rs3: 6,
    oj1: 5,
    oj2: 5,
    oj3: 2,
  })

  const baseline = generateResult(answers)
  const withScenarioAnswers = generateResult({
    ...answers,
    strategicTechnology: "C",
    humanitarianIntervention: "B",
    formerRivalTransforms: "A",
  })

  assert.deepStrictEqual(withScenarioAnswers.dimensionScores, baseline.dimensionScores)
  assert.deepStrictEqual(withScenarioAnswers.familyScores, baseline.familyScores)
  assert.strictEqual(withScenarioAnswers.familyKey, baseline.familyKey)
  assert.strictEqual(withScenarioAnswers.strategyModifier, baseline.strategyModifier)
  assert.strictEqual(withScenarioAnswers.normativeModifier, baseline.normativeModifier)
})

test("high political-economy salience alone does not force a CPE result", () => {
  const dimensionScores = {
    securityCompetition: 3.7,
    institutions: 6.1,
    domesticFilters: 5.1,
    normsIdentity: 4.2,
    politicalEconomy: 6.3,
    restraint: 4.8,
    orderJustice: 4.3,
  }

  const familyScores = scoreFamilies(dimensionScores)
  assert.strictEqual(topFamilyKey(familyScores), "institutionalist")
  assert.ok(
    familyScores.institutionalist > familyScores.criticalPoliticalEconomy,
    "Expected institutionalist to outrank CPE when political economy is high but critical/systemic critique is weak.",
  )
})

test("CPE remains available for a clearly critical-systemic profile", () => {
  const dimensionScores = {
    securityCompetition: 3.6,
    institutions: 2.4,
    domesticFilters: 5.6,
    normsIdentity: 4.2,
    politicalEconomy: 6.4,
    restraint: 4.4,
    orderJustice: 3.2,
  }

  const familyScores = scoreFamilies(dimensionScores)
  assert.strictEqual(topFamilyKey(familyScores), "criticalPoliticalEconomy")
  assert.ok(
    familyScores.criticalPoliticalEconomy > familyScores.institutionalist,
    "Expected a clearly critical-systemic profile to remain CPE-primary.",
  )
})
