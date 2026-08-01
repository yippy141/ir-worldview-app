import test from "node:test"
import assert from "node:assert/strict"
import { buildFoundationResearchResponseRecord } from "@/lib/research/foundation-response"
import {
  foundationStandardSections,
  getFoundationQuestions,
} from "@/lib/quiz-schema"
import { generateResult } from "@/lib/scoring"
import { computeValidationScales } from "@/lib/validation-scales"
import type { Answers, Question, QuizMode } from "@/lib/types"

const validationItems = getFoundationQuestions("standard").filter(
  (question) => question.scoringBlock === "validation",
)

test("the Foundation contains twelve cited validation items interleaved with core items", () => {
  assert.equal(validationItems.length, 12)

  const counts = {
    militantInternationalism: 0,
    cooperativeInternationalism: 0,
    isolationism: 0,
  }

  for (const item of validationItems) {
    assert.equal(item.kind, "likert")
    assert.ok(item.citation.includes("10.1017/S0022381614000073"))
    assert.deepEqual(
      getFoundationQuestions("standard")
        .filter((question) => question.id === item.id)
        .map((question) => question.id),
      [item.id],
    )
    counts[item.validationScale] += 1
  }

  assert.deepEqual(counts, {
    militantInternationalism: 4,
    cooperativeInternationalism: 4,
    isolationism: 4,
  })

  const standardQuestions = getFoundationQuestions("standard")
  const sectionIds = foundationStandardSections.flatMap(
    (section) => section.questionIds,
  )
  assert.deepEqual(
    sectionIds,
    standardQuestions.map((question) => question.id),
  )

  for (const item of validationItems) {
    const index = standardQuestions.findIndex(
      (question) => question.id === item.id,
    )
    assert.equal(standardQuestions[index - 1]?.scoringBlock, "core")
    assert.equal(standardQuestions[index + 1]?.scoringBlock, "core")
  }
})

test("computeValidationScales returns reverse-keyed means on the published 1–7 scale", () => {
  assert.deepEqual(
    computeValidationScales({
      val_mi_1: 7,
      val_mi_2: 5,
      val_mi_3: 1,
      val_mi_4: 3,
      val_ci_1: 1,
      val_ci_2: 2,
      val_ci_3: 3,
      val_ci_4: 4,
      val_iso_1: 7,
      val_iso_2: 6,
      val_iso_3: 7,
      val_iso_4: 2,
    }),
    {
      militantInternationalism: 5.5,
      cooperativeInternationalism: 2.5,
      isolationism: 4,
    },
  )
})

test("validation answers cannot move Foundation dimensions or family scores", () => {
  for (const mode of ["standard", "analyst"] as const) {
    const coreAnswers = completeCoreAnswers(mode)
    const lowValidationAnswers = validationAnswers(1)
    const highValidationAnswers = validationAnswers(7)

    const baseline = generateResult(coreAnswers, mode)
    const withLowValidation = generateResult(
      { ...coreAnswers, ...lowValidationAnswers },
      mode,
    )
    const withHighValidation = generateResult(
      { ...coreAnswers, ...highValidationAnswers },
      mode,
    )

    assert.deepEqual(withLowValidation.dimensionScores, baseline.dimensionScores)
    assert.deepEqual(withLowValidation.familyScores, baseline.familyScores)
    assert.equal(withLowValidation.familyKey, baseline.familyKey)
    assert.deepEqual(withHighValidation.dimensionScores, baseline.dimensionScores)
    assert.deepEqual(withHighValidation.familyScores, baseline.familyScores)
    assert.equal(withHighValidation.familyKey, baseline.familyKey)
  }
})

test("the research response record stores validation means with raw answers", () => {
  const answers = validationAnswers(6)
  const record = buildFoundationResearchResponseRecord(answers)

  assert.notEqual(record.answers, answers)
  assert.deepEqual(record.answers, answers)
  assert.deepEqual(record.validationScales, {
    militantInternationalism: 5,
    cooperativeInternationalism: 6,
    isolationism: 5,
  })
})

test("validation means reject incomplete research responses", () => {
  assert.throws(
    () => computeValidationScales({ val_mi_1: 4 }),
    /requires an integer answer from 1 to 7/,
  )
})

function completeCoreAnswers(mode: QuizMode): Answers {
  return Object.fromEntries(
    getFoundationQuestions(mode)
      .filter((question) => question.scoringBlock === "core")
      .map((question, index) => [question.id, defaultAnswer(question, index)]),
  )
}

function defaultAnswer(question: Question, index: number) {
  if (question.kind === "likert") return (index % 7) + 1
  return question.options[index % question.options.length].id
}

function validationAnswers(value: number): Answers {
  return Object.fromEntries(
    validationItems.map((question) => [question.id, value]),
  )
}
