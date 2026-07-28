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
const BRANCH_C_SKIP_REASON =
  "unblocked by V21 Branch C item valence rebalance"

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
  likertValue: number,
  pickOption: (options: { id: string }[], questionId: string) => number,
  secondaryOffset = 1,
): Answers {
  const answers: Answers = {}

  for (const raw of getFoundationQuestions(MODE)) {
    const question = raw as AnyQuestion

    if (question.kind === "likert") {
      answers[question.id] = likertValue
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

  for (let i = 0; i < RANDOM_N; i += 1) {
    const likert = 1 + Math.floor(rng() * 7)
    const answers = buildAnswers(
      likert,
      (options) => Math.floor(rng() * options.length),
    )
    const result = scoreAnswers(answers)
    const label =
      `${result.familyLabel} / ${result.strategyModifier} / ` +
      result.normativeModifier

    increment(familyCounts, result.familyLabel)
    increment(labelCounts, label)
  }

  return { familyCounts, labelCounts }
}

const randomRespondents = measureRandomRespondents()
const alwaysFirst = () => 0
const alwaysLast = (options: { id: string }[]) => options.length - 1
const responseStyleResults = [
  scoreAnswers(buildAnswers(6, alwaysFirst)),
  scoreAnswers(buildAnswers(2, alwaysFirst)),
  scoreAnswers(buildAnswers(4, alwaysFirst)),
  scoreAnswers(buildAnswers(6, alwaysLast)),
  scoreAnswers(buildAnswers(7, alwaysFirst)),
  scoreAnswers(buildAnswers(1, alwaysFirst)),
]

test(
  "no family exceeds 35% of seeded random respondents",
  { skip: BRANCH_C_SKIP_REASON },
  () => {
    const largestFamilyCount = Math.max(
      ...Object.values(randomRespondents.familyCounts),
    )

    assert.ok(largestFamilyCount / RANDOM_N <= 0.35)
  },
)

test(
  "no three-part label exceeds 20% of seeded random respondents",
  { skip: BRANCH_C_SKIP_REASON },
  () => {
    const largestLabelCount = Math.max(
      ...Object.values(randomRespondents.labelCounts),
    )

    assert.ok(largestLabelCount / RANDOM_N <= 0.2)
  },
)

test(
  "all four families each exceed 5% of seeded random respondents",
  { skip: BRANCH_C_SKIP_REASON },
  () => {
    const familyCounts = Object.values(randomRespondents.familyCounts)

    assert.equal(familyCounts.length, 4)
    assert.ok(familyCounts.every((count) => count / RANDOM_N > 0.05))
  },
)

test(
  "response-style respondents return at least two values for each modifier",
  { skip: BRANCH_C_SKIP_REASON },
  () => {
    const strategyModifiers = new Set(
      responseStyleResults.map((result) => result.strategyModifier),
    )
    const normativeModifiers = new Set(
      responseStyleResults.map((result) => result.normativeModifier),
    )

    assert.ok(strategyModifiers.size >= 2)
    assert.ok(normativeModifiers.size >= 2)
  },
)

test(
  "yea-sayer and nay-sayer return different families",
  { skip: BRANCH_C_SKIP_REASON },
  () => {
    const [yeaSayer, naySayer] = responseStyleResults

    assert.notEqual(yeaSayer.familyKey, naySayer.familyKey)
  },
)
