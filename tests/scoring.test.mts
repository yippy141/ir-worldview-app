import test from "node:test"
import assert from "node:assert/strict"
import { getFoundationQuestions, questionCountsByMode } from "@/lib/quiz-schema"
import {
  analyzeScoreShape,
  computeCoreDimensionAudit,
  computeCoreDimensionScores,
  generateResult,
  scoreFamilies,
} from "@/lib/scoring"
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

const syntheticProfiles = {
  realist: {
    securityCompetition: 6.2,
    institutions: 2.5,
    domesticFilters: 3.0,
    normsIdentity: 2.8,
    politicalEconomy: 3.4,
    restraint: 3.0,
    orderJustice: 4.7,
  },
  institutionalist: {
    securityCompetition: 3.2,
    institutions: 6.2,
    domesticFilters: 5.6,
    normsIdentity: 4.8,
    politicalEconomy: 4.7,
    restraint: 5.4,
    orderJustice: 4.6,
  },
  constructivist: {
    securityCompetition: 3.1,
    institutions: 4.6,
    domesticFilters: 4.2,
    normsIdentity: 6.3,
    politicalEconomy: 4.2,
    restraint: 4.8,
    orderJustice: 4.6,
  },
  criticalPoliticalEconomy: {
    securityCompetition: 3.3,
    institutions: 2.6,
    domesticFilters: 5.7,
    normsIdentity: 4.5,
    politicalEconomy: 6.4,
    restraint: 4.4,
    orderJustice: 3.2,
  },
} as const

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

test("deep-dive foundation cards accept a softer second choice", () => {
  const answers: Answers = {
    tradeoff_alliances: {
      primary: "power",
      secondary: "rules",
    },
  }

  const scores = computeCoreDimensionScores(answers, "analyst")
  const expectedSecurityCompetition = (6.3 + 3.5 * 0.45) / (1 + 0.45)
  const expectedInstitutions = (2.8 + 6.4 * 0.45) / (1 + 0.45)

  assert.equal(scores.securityCompetition, Number(expectedSecurityCompetition.toFixed(2)))
  assert.equal(scores.institutions, Number(expectedInstitutions.toFixed(2)))
})

test("dimension audit preserves raw averages before display rounding", () => {
  const audit = computeCoreDimensionAudit(
    {
      tradeoff_alliances: {
        primary: "power",
        secondary: "rules",
      },
    },
    "analyst",
  )

  const expectedSecurityCompetition = (6.3 + 3.5 * 0.45) / (1 + 0.45)
  assert.equal(audit.weights.securityCompetition, 1.45)
  assert.equal(audit.rawAverages.securityCompetition, expectedSecurityCompetition)
  assert.equal(
    audit.roundedAverages.securityCompetition,
    Number(expectedSecurityCompetition.toFixed(2)),
  )
})

test("standard foundation scoring ignores second-choice structure", () => {
  const scores = computeCoreDimensionScores(
    {
      tradeoff_alliances: {
        primary: "power",
        secondary: "rules",
      },
    },
    "standard",
  )

  assert.equal(scores.securityCompetition, 6.3)
  assert.equal(scores.institutions, 2.8)
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

test("flat midpoint profiles remain visibly broad-spectrum in score-shape analysis", () => {
  const analysis = analyzeScoreShape({
    securityCompetition: 4,
    institutions: 4,
    domesticFilters: 4,
    normsIdentity: 4,
    politicalEconomy: 4,
    restraint: 4,
    orderJustice: 4,
  })

  assert.equal(analysis.nearestFitGap, 0)
  assert.equal(analysis.averageDistanceFromCenter, 0)
  assert.equal(analysis.sharpDimensionCount, 0)
})

test("clearly differentiated synthetic profiles do not collapse into the same midpoint-like shape", () => {
  const expectations = [
    ["realist", syntheticProfiles.realist],
    ["institutionalist", syntheticProfiles.institutionalist],
    ["constructivist", syntheticProfiles.constructivist],
    ["criticalPoliticalEconomy", syntheticProfiles.criticalPoliticalEconomy],
  ] as const

  for (const [expectedFamily, profile] of expectations) {
    const analysis = analyzeScoreShape(profile)

    assert.equal(topFamilyKey(analysis.familyScores), expectedFamily)
    assert.ok(
      analysis.nearestFitGap >= 0.35,
      `Expected a visible family gap for ${expectedFamily}, got ${analysis.nearestFitGap}.`,
    )
    assert.ok(
      analysis.averageDistanceFromCenter >= 0.75,
      `Expected ${expectedFamily} to sit away from a flat midpoint profile, got ${analysis.averageDistanceFromCenter}.`,
    )
  }
})
