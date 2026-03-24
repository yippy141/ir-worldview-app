import test from "node:test"
import assert from "node:assert/strict"
import { coreQuestions } from "@/lib/quiz-schema"
import { getScenarioSequence, selectTieBreakerIds } from "@/lib/scoring"
import type { Answers } from "@/lib/types"

// Build a partial answers object covering only the first N core questions
function partialCoreAnswers(n: number): Answers {
  const answers: Answers = {}
  for (let i = 0; i < n; i++) {
    answers[coreQuestions[i].id] = 4 // neutral mid-point
  }
  return answers
}

// Build a complete answers object with all 21 core questions answered
function fullCoreAnswers(overrides: Answers = {}): Answers {
  const answers = partialCoreAnswers(coreQuestions.length)
  return { ...answers, ...overrides }
}

test("getScenarioSequence returns empty when fewer than 21 core items answered", () => {
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

test("getScenarioSequence returns scenarios when all 21 core items answered", () => {
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
