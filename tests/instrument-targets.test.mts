import test from "node:test"
import assert from "node:assert/strict"
import { getFoundationQuestions } from "@/lib/quiz-schema"
import {
  buildCanonicalFoundationResult,
  computeCoreDimensionScores,
} from "@/lib/scoring"
import type { Answers, QuizMode } from "@/lib/types"

const MODE: QuizMode = "analyst"
const RANDOM_N = 500

type AnyQuestion = ReturnType<typeof getFoundationQuestions>[number] & {
  options?: { id: string }[]
  allowSecondChoiceInAnalyst?: boolean
}

function makeRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function buildAnswers(
  likertValue: number | ((questionId: string) => number),
  pickOption: (options: { id: string }[], questionId: string) => number,
  secondaryOffset = 1,
): Answers {
  const answers: Answers = {}

  for (const raw of getFoundationQuestions(MODE)) {
    const question = raw as AnyQuestion

    if (question.kind === "likert") {
      answers[question.id] =
        typeof likertValue === "function"
          ? likertValue(question.id)
          : likertValue
      continue
    }

    const options = question.options ?? []
    if (options.length === 0) continue

    const primaryIndex = pickOption(options, question.id) % options.length
    const secondaryIndex = (primaryIndex + secondaryOffset) % options.length

    answers[question.id] = {
      primary: options[primaryIndex].id,
      secondary:
        options.length > 1 && secondaryIndex !== primaryIndex
          ? options[secondaryIndex].id
          : undefined,
    }
  }

  return answers
}

function scoreAnswers(answers: Answers) {
  return buildCanonicalFoundationResult(
    computeCoreDimensionScores(answers, MODE),
  )
}

function increment(counts: Record<string, number>, key: string) {
  counts[key] = (counts[key] ?? 0) + 1
}

function measureRandomRespondents() {
  const rng = makeRng(20260728)
  const familyCounts: Record<string, number> = {}
  const labelCounts: Record<string, number> = {}
  const strategyCounts: Record<string, number> = {}
  const normativeCounts: Record<string, number> = {}

  for (let i = 0; i < RANDOM_N; i += 1) {
    const answers = buildAnswers(
      () => 1 + Math.floor(rng() * 7),
      (options) => Math.floor(rng() * options.length),
    )
    const result = scoreAnswers(answers)
    const label =
      `${result.familyLabel} / ${result.strategyModifier} / ` +
      result.normativeModifier

    increment(familyCounts, result.familyLabel)
    increment(labelCounts, label)
    increment(strategyCounts, result.strategyModifier)
    increment(normativeCounts, result.normativeModifier)
  }

  return {
    familyCounts,
    labelCounts,
    strategyCounts,
    normativeCounts,
  }
}

const randomRespondents = measureRandomRespondents()

test(
  "no family exceeds 35% of seeded random respondents",
  () => {
    const largestFamilyCount = Math.max(
      ...Object.values(randomRespondents.familyCounts),
    )

    assert.ok(largestFamilyCount / RANDOM_N <= 0.35)
  },
)

test(
  "no three-part label exceeds 20% of seeded random respondents",
  () => {
    const largestLabelCount = Math.max(
      ...Object.values(randomRespondents.labelCounts),
    )

    assert.ok(largestLabelCount / RANDOM_N <= 0.2)
  },
)

test(
  "all four families each exceed 5% of seeded random respondents",
  () => {
    const familyCounts = Object.values(randomRespondents.familyCounts)

    assert.equal(familyCounts.length, 4)
    assert.ok(familyCounts.every((count) => count / RANDOM_N > 0.05))
  },
)

test("all modifier bands remain live in the seeded distribution", () => {
  for (const counts of [
    randomRespondents.strategyCounts,
    randomRespondents.normativeCounts,
  ]) {
    assert.equal(Object.keys(counts).length, 3)
    assert.ok(
      Object.values(counts).every(
        (count) => count / RANDOM_N >= 0.2 && count / RANDOM_N <= 0.45,
      ),
    )
  }
})
