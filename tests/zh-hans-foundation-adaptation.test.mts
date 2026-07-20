import test from "node:test"
import assert from "node:assert/strict"
import { zhHansFoundationBackTranslations } from "@/content/locales/zh-Hans/foundation-back-translations"
import { zhHansFoundationDrafts } from "@/content/locales/zh-Hans/foundation-copy"
import { zhHansFoundationGlossaryAdditions } from "@/content/locales/zh-Hans/foundation-glossary"
import {
  getZhHansFoundationQuestions,
  zhHansFoundationInstrumentManifest,
  zhHansFoundationStandardSections,
} from "@/content/locales/zh-Hans/foundation-instrument"
import { zhHansFoundationItemIntentSheet } from "@/content/locales/zh-Hans/foundation-item-intent"
import { zhHansCopyDeckManifest } from "@/content/locales/zh-Hans/manifest"
import {
  foundationStandardSections,
  getFoundationQuestions,
  questionCountsByMode,
} from "@/lib/quiz-schema"
import { computeCoreDimensionScores, generateResult } from "@/lib/scoring"
import type { Answers, Question } from "@/lib/types"

const cjk = /[\u3400-\u9fff]/u

function structuralFingerprint(question: Question) {
  if (question.kind === "likert") {
    return {
      id: question.id,
      kind: question.kind,
      dimension: question.dimension,
      reverse: question.reverse ?? false,
      optionIds: [],
      signals: [],
    }
  }

  return {
    id: question.id,
    kind: question.kind,
    cardType: question.cardType,
    allowSecondChoiceInAnalyst: question.allowSecondChoiceInAnalyst ?? false,
    optionIds: question.options.map((option) => option.id),
    signals: question.options.map((option) => option.signals),
  }
}

function displayOptionIds(copy: { options?: readonly { id: string }[] }) {
  return copy.options?.map((option) => option.id) ?? []
}

test("the owner-approved Foundation adaptation is an explicit, non-equivalent beta", () => {
  assert.equal(zhHansFoundationInstrumentManifest.status, "adapted-beta")
  assert.equal(
    zhHansFoundationInstrumentManifest.validationClaim,
    "not-validated-or-equivalent",
  )
  assert.equal(zhHansFoundationInstrumentManifest.runtimeEnabled, true)
  assert.equal(zhHansFoundationInstrumentManifest.canonicalSchemaVersion, 3)
  assert.equal(zhHansFoundationInstrumentManifest.scoringVersion, 1)
  assert.equal(zhHansFoundationInstrumentManifest.localeCopyVersion, 1)
  assert.ok(zhHansCopyDeckManifest.includes.includes("foundation-instrument"))
  assert.ok(!(zhHansCopyDeckManifest.excludes as readonly string[]).includes("foundation-instrument"))
})

test("all 44 canonical items have complete bilingual editorial records in canonical order", () => {
  const canonical = getFoundationQuestions("analyst")

  assert.equal(questionCountsByMode.standard, 20)
  assert.equal(questionCountsByMode.analyst, 44)
  assert.equal(zhHansFoundationDrafts.length, canonical.length)
  assert.equal(zhHansFoundationBackTranslations.length, canonical.length)
  assert.equal(zhHansFoundationItemIntentSheet.length, canonical.length)
  assert.deepEqual(
    zhHansFoundationItemIntentSheet.map((row) => row.questionId),
    canonical.map((question) => question.id),
  )

  for (const [index, row] of zhHansFoundationItemIntentSheet.entries()) {
    const question = canonical[index]
    assert.equal(row.englishSource, question)
    assert.ok(row.construct.trim().length > 0, `${row.questionId}: construct`)
    assert.ok(row.intendedDistinction.trim().length > 0, `${row.questionId}: distinction`)
    assert.ok(row.adjudicationNote.trim().length > 0, `${row.questionId}: adjudication`)
    assert.ok(row.termsRequiringGlossaryApproval.length > 0, `${row.questionId}: glossary`)
    assert.ok(row.cognitiveInterviewProbes.length >= 2, `${row.questionId}: probes`)
    assert.match(row.chineseDraftA.prompt, cjk)
    assert.match(row.chineseDraftB.prompt, cjk)
    assert.match(row.reconciledChinese.prompt, cjk)
    assert.doesNotMatch(row.backTranslation.prompt, cjk)
    assert.notDeepEqual(
      row.chineseDraftA,
      row.chineseDraftB,
      `${row.questionId}: draft A and B must be independently reviewable`,
    )

    const expectedOptionIds = question.kind === "likert"
      ? []
      : question.options.map((option) => option.id)
    assert.deepEqual(displayOptionIds(row.chineseDraftA), expectedOptionIds)
    assert.deepEqual(displayOptionIds(row.chineseDraftB), expectedOptionIds)
    assert.deepEqual(displayOptionIds(row.reconciledChinese), expectedOptionIds)
    assert.deepEqual(displayOptionIds(row.backTranslation), expectedOptionIds)

    const editorialOptionIds = row.optionLevelNotes.map((note) => note.optionId)
    assert.deepEqual(
      editorialOptionIds,
      question.kind === "likert" ? ["1", "4", "7"] : expectedOptionIds,
    )
  }
})

test("localized questions inherit every scoring and structural field from the canonical schema", () => {
  for (const mode of ["standard", "analyst"] as const) {
    const canonical = getFoundationQuestions(mode)
    const localized = getZhHansFoundationQuestions(mode)

    assert.deepEqual(
      localized.map(structuralFingerprint),
      canonical.map(structuralFingerprint),
    )

    for (const question of localized) {
      assert.match(question.prompt, cjk)
      if (question.kind !== "likert") {
        assert.ok(question.options.every((option) => cjk.test(option.title) && cjk.test(option.label)))
      }
    }
  }
})

test("every choice item preserves canonical option IDs in canonical order", () => {
  const canonical = getFoundationQuestions("analyst")
  const localized = getZhHansFoundationQuestions("analyst")

  for (const [index, question] of canonical.entries()) {
    const localizedQuestion = localized[index]
    assert.equal(localizedQuestion.id, question.id)
    if (question.kind === "likert") {
      assert.equal(localizedQuestion.kind, "likert")
      continue
    }
    assert.notEqual(localizedQuestion.kind, "likert")
    if (localizedQuestion.kind !== "likert") {
      assert.deepEqual(
        localizedQuestion.options.map((option) => option.id),
        question.options.map((option) => option.id),
        question.id,
      )
    }
  }
})

test("English and Chinese selections produce identical dimension and family results", () => {
  for (const mode of ["standard", "analyst"] as const) {
    const canonicalAnswers = buildDeterministicAnswers(getFoundationQuestions(mode))
    const localizedAnswers = buildDeterministicAnswers(getZhHansFoundationQuestions(mode))

    assert.deepEqual(localizedAnswers, canonicalAnswers)
    assert.deepEqual(
      computeCoreDimensionScores(localizedAnswers, mode),
      computeCoreDimensionScores(canonicalAnswers, mode),
    )
    assert.deepEqual(
      generateResult(localizedAnswers, mode),
      generateResult(canonicalAnswers, mode),
    )
  }
})

test("localized display fields are exhaustive instead of falling back to English", () => {
  const canonical = getFoundationQuestions("analyst")
  const localized = getZhHansFoundationQuestions("analyst")

  for (const [index, question] of canonical.entries()) {
    const copy = localized[index]
    assert.notEqual(copy.prompt, question.prompt, `${question.id}: prompt fallback`)
    assert.equal(Boolean(copy.helpText), Boolean(question.helpText), `${question.id}: helpText`)
    assert.equal(Boolean(copy.clarification), Boolean(question.clarification), `${question.id}: clarification`)

    if (copy.helpText) {
      assert.match(copy.helpText, cjk)
      assert.notEqual(copy.helpText, question.helpText, `${question.id}: helpText fallback`)
    }
    if (copy.clarification) {
      assert.match(copy.clarification.whatItAsks, cjk)
      assert.notEqual(
        copy.clarification.whatItAsks,
        question.clarification?.whatItAsks,
        `${question.id}: clarification fallback`,
      )
      if (copy.clarification.whatItDoesNotAsk) {
        assert.match(copy.clarification.whatItDoesNotAsk, cjk)
      }
      for (const term of copy.clarification.terms ?? []) {
        assert.match(term.term, cjk)
        assert.match(term.definition, cjk)
      }
    }

    if (question.kind !== "likert" && copy.kind !== "likert") {
      for (const [optionIndex, option] of copy.options.entries()) {
        assert.notEqual(
          option.title,
          question.options[optionIndex].title,
          `${question.id}.${option.id}: option title fallback`,
        )
        assert.notEqual(
          option.label,
          question.options[optionIndex].label,
          `${question.id}.${option.id}: option label fallback`,
        )
      }
    }
  }
})

test("Standard section and review edit order remain canonical", () => {
  assert.deepEqual(
    zhHansFoundationStandardSections.map((section) => ({
      index: section.index,
      questionIds: section.questionIds,
    })),
    foundationStandardSections.map((section) => ({
      index: section.index,
      questionIds: section.questionIds,
    })),
  )
  assert.ok(zhHansFoundationStandardSections.every((section) => cjk.test(section.title)))

  const localized = getZhHansFoundationQuestions("analyst")
  assert.deepEqual(
    localized.map((question, index) => ({ id: question.id, reviewEditIndex: index })),
    getFoundationQuestions("analyst").map((question, index) => ({
      id: question.id,
      reviewEditIndex: index,
    })),
  )
})

test("the Foundation glossary records contextual decisions for the eight protected terms", () => {
  const protectedTerms = [
    "institution",
    "legitimacy",
    "restraint",
    "order",
    "justice",
    "deterrence",
    "hedging",
    "solidarity",
  ]

  for (const term of protectedTerms) {
    const entry = zhHansFoundationGlossaryAdditions.find((candidate) =>
      candidate.english.split(" / ").includes(term),
    )
    assert.ok(entry, `missing contextual glossary entry: ${term}`)
    assert.equal(entry.status, "approved-for-beta")
    assert.ok(entry.contexts.length > 0)
    assert.ok(entry.avoid.length > 0)
  }
})

function buildDeterministicAnswers(questions: Question[]): Answers {
  return Object.fromEntries(
    questions.map((question, index) => {
      if (question.kind === "likert") {
        return [question.id, (index % 7) + 1]
      }

      const primary = question.options[index % question.options.length].id
      const secondary = question.allowSecondChoiceInAnalyst
        ? question.options[(index + 1) % question.options.length].id
        : undefined
      return [
        question.id,
        secondary && secondary !== primary
          ? { primary, secondary }
          : { primary },
      ]
    }),
  )
}
