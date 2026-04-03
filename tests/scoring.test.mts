import test from "node:test"
import assert from "node:assert/strict"
import { getFoundationQuestions, questionCountsByMode } from "@/lib/quiz-schema"
import { computeCoreDimensionScores, generateResult, scoreFamilies } from "@/lib/scoring"
import type { Answers, Question, QuizMode } from "@/lib/types"

function completeAnswers(mode: QuizMode): Answers {
  const answers: Answers = {}

  for (const question of getFoundationQuestions(mode)) {
    answers[question.id] = defaultAnswer(question)
  }

  return answers
}

function defaultAnswer(question: Question) {
  if (question.kind === "likert") return 4
  return question.options[0]?.id ?? ""
}

function topFamilyKey(scores: ReturnType<typeof scoreFamilies>) {
  return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0] ?? [undefined])[0]
}

test("analyst mode includes additional foundation questions", () => {
  assert.ok(questionCountsByMode.analyst > questionCountsByMode.standard)
  assert.equal(getFoundationQuestions("standard").length, questionCountsByMode.standard)
  assert.equal(getFoundationQuestions("analyst").length, questionCountsByMode.analyst)
})

test("standard scoring ignores analyst-only answers", () => {
  const standardAnswers = completeAnswers("standard")
  const analystOnlyQuestions = getFoundationQuestions("analyst").slice(questionCountsByMode.standard)
  const analystOnlyAnswers = Object.fromEntries(
    analystOnlyQuestions.map((question) => [question.id, question.kind === "likert" ? 7 : question.options[0].id]),
  )

  const baseline = generateResult(standardAnswers, "standard")
  const withAnalystExtras = generateResult(
    { ...standardAnswers, ...analystOnlyAnswers },
    "standard",
  )

  assert.deepStrictEqual(withAnalystExtras.dimensionScores, baseline.dimensionScores)
  assert.deepStrictEqual(withAnalystExtras.familyScores, baseline.familyScores)
  assert.strictEqual(withAnalystExtras.familyKey, baseline.familyKey)
})

test("foundation scores stay on the 1 to 7 scale in both modes", () => {
  for (const mode of ["standard", "analyst"] as const) {
    const scores = computeCoreDimensionScores(completeAnswers(mode), mode)

    for (const value of Object.values(scores)) {
      assert.ok(value >= 1 && value <= 7, `Expected ${mode} score within 1-7, got ${value}`)
    }
  }
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
