import test from "node:test"
import assert from "node:assert/strict"
import { getSeededOptionOrder } from "@/lib/option-order"
import { getFoundationQuestions } from "@/lib/quiz-schema"
import { computeCoreDimensionScores } from "@/lib/scoring"
import { parseQuizSession } from "@/lib/quiz-session"
import type { Answers, RankedChoiceAnswer } from "@/lib/types"

const MODE = "analyst"
const QUESTIONS = getFoundationQuestions(MODE)

function buildSemanticAnswers(orderSeed: string): Answers {
  const answers: Answers = {}

  for (const [questionIndex, question] of QUESTIONS.entries()) {
    if (question.kind === "likert") {
      answers[question.id] = (questionIndex % 7) + 1
      continue
    }

    const targetPrimary = question.options[questionIndex % question.options.length].id
    const targetSecondary =
      question.options[(questionIndex + 1) % question.options.length].id
    const presented = getSeededOptionOrder(
      question.options,
      orderSeed,
      question.id,
    )
    const primary = presented.find((option) => option.id === targetPrimary)
    const secondary = presented.find((option) => option.id === targetSecondary)

    assert.ok(primary)
    assert.ok(secondary)
    answers[question.id] = {
      primary: primary.id,
      secondary: secondary.id,
    } satisfies RankedChoiceAnswer
  }

  return answers
}

test("a given set of answer IDs scores identically under different presentation seeds", () => {
  const firstSeedAnswers = buildSemanticAnswers("respondent-seed-one")
  const secondSeedAnswers = buildSemanticAnswers("respondent-seed-two")
  const choiceQuestions = QUESTIONS.filter((question) => question.kind !== "likert")

  assert.ok(
    choiceQuestions.some((question) => {
      const firstOrder = getSeededOptionOrder(
        question.options,
        "respondent-seed-one",
        question.id,
      ).map((option) => option.id)
      const secondOrder = getSeededOptionOrder(
        question.options,
        "respondent-seed-two",
        question.id,
      ).map((option) => option.id)
      return firstOrder.join(",") !== secondOrder.join(",")
    }),
    "the fixture seeds should produce at least one different presentation order",
  )
  assert.deepEqual(secondSeedAnswers, firstSeedAnswers)
  assert.deepEqual(
    computeCoreDimensionScores(secondSeedAnswers, MODE),
    computeCoreDimensionScores(firstSeedAnswers, MODE),
  )
})

test("seeded option order is stable and keeps explicitly pinned options last", () => {
  const options = [
    { id: "a" },
    { id: "escape", pinned: "last" as const },
    { id: "b" },
    { id: "c" },
  ]
  const first = getSeededOptionOrder(options, "stable-seed", "question")
  const resumed = getSeededOptionOrder(options, "stable-seed", "question")

  assert.deepEqual(resumed, first)
  assert.equal(first.at(-1)?.id, "escape")
  assert.deepEqual(options.map((option) => option.id), ["a", "escape", "b", "c"])
})

test("Foundation draft parsing preserves an existing order seed and migrates older drafts", () => {
  const resumed = parseQuizSession(JSON.stringify({
    v: 5,
    orderSeed: "persisted-draft-seed",
    activeMode: "standard",
    contextAssist: false,
    answers: { tradeoff_alliances: { primary: "power" } },
  }))
  const migrated = parseQuizSession(JSON.stringify({
    v: 4,
    activeMode: "standard",
    contextAssist: false,
    answers: {},
  }))

  assert.equal(resumed?.orderSeed, "persisted-draft-seed")
  assert.equal(resumed?.answers.tradeoff_alliances instanceof Object, true)
  assert.ok(migrated?.orderSeed)
  assert.deepEqual(migrated?.itemLatencyBuckets, {})
})

test("Foundation drafts retain only latency buckets, never raw timing values", () => {
  const resumed = parseQuizSession(JSON.stringify({
    v: 7,
    orderSeed: "persisted-draft-seed",
    activeMode: "standard",
    questionSet: "core",
    contextAssist: false,
    answers: { df1: 4 },
    itemLatencyBuckets: {
      df1: 2_000,
      oj1: 120_000,
      sc2: 2_314,
    },
    itemVisibleAt: 12_345,
  }))

  assert.deepEqual(resumed?.itemLatencyBuckets, {
    df1: 2_000,
    oj1: 120_000,
  })
  assert.equal("itemVisibleAt" in (resumed ?? {}), false)
})
