/**
 * This is a characterization test recording the calibrated state on 29 July 2026.
 *
 * It passes today and is expected to fail the moment scoring changes. When a
 * scoring change makes it fail, update the numbers in the same PR as the
 * scoring change and record the before-and-after in the PR description.
 *
 * It is not a quality gate and it does not assert anything good.
 */

import test from "node:test"
import assert from "node:assert/strict"
import { assessFoundationNarrative } from "@/lib/narrative/foundation"
import { getFoundationQuestions } from "@/lib/quiz-schema"
import {
  buildCanonicalFoundationResult,
  computeCoreDimensionScores,
} from "@/lib/scoring"
import type {
  Answers,
  NormativeModifier,
  QuizMode,
  StrategyModifier,
} from "@/lib/types"

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
  const strategyCounts: Record<StrategyModifier, number> = {
    Restrainer: 0,
    Hedger: 0,
    Maximizer: 0,
  }
  const normativeCounts: Record<NormativeModifier, number> = {
    Pluralist: 0,
    "Conditional Solidarist": 0,
    Universalist: 0,
  }
  const labelCounts: Record<string, number> = {}
  const narrativeStateCounts = {
    lowDifferentiation: 0,
    stableModeration: 0,
    sharplyDifferentiated: 0,
  }

  for (let i = 0; i < RANDOM_N; i += 1) {
    const likert = 1 + Math.floor(rng() * 7)
    const answers = buildAnswers(
      likert,
      (options) => Math.floor(rng() * options.length),
    )
    const result = scoreAnswers(answers)
    const narrativeAssessment = assessFoundationNarrative(result.dimensionScores)
    const label =
      `${result.familyLabel} / ${result.strategyModifier} / ` +
      result.normativeModifier

    increment(familyCounts, result.familyLabel)
    strategyCounts[result.strategyModifier] += 1
    normativeCounts[result.normativeModifier] += 1
    increment(labelCounts, label)
    narrativeStateCounts[narrativeAssessment.state] += 1
  }

  return {
    familyCounts,
    strategyCounts,
    normativeCounts,
    labelCounts,
    narrativeStateCounts,
  }
}

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

test("seeded random respondents match the 29 July 2026 calibration characterization", () => {
  const {
    familyCounts,
    strategyCounts,
    normativeCounts,
    labelCounts,
  } = measureRandomRespondents()
  const topLabel = Object.entries(labelCounts).sort((a, b) => b[1] - a[1])[0]

  assert.deepStrictEqual(familyCounts, {
    "Strategic Realist": 129,
    "Liberal Institutionalist": 144,
    "Social Constructivist": 96,
    "Critical Political Economist": 131,
  })
  assert.deepStrictEqual(strategyCounts, {
    Restrainer: 169,
    Hedger: 163,
    Maximizer: 168,
  })
  assert.deepStrictEqual(normativeCounts, {
    Pluralist: 169,
    "Conditional Solidarist": 165,
    Universalist: 166,
  })
  assert.deepStrictEqual(topLabel, [
    "Liberal Institutionalist / Maximizer / Universalist",
    35,
  ])
})

test("narrative differentiation states stay aligned with the seeded gap calibration", () => {
  const { narrativeStateCounts } = measureRandomRespondents()

  // This intentionally fails whenever the calibration and item bank drift out
  // of sync: each tail should contain roughly the calibrated 25% of respondents.
  for (const state of ["lowDifferentiation", "sharplyDifferentiated"] as const) {
    const share = narrativeStateCounts[state] / RANDOM_N
    assert.ok(
      share >= 0.17 && share <= 0.33,
      `Expected ${state} near 25% (±8 pp), got ${(share * 100).toFixed(1)}%.`,
    )
  }
})

test("response-style respondents match the 29 July 2026 calibration characterization", () => {
  const [yeaSayer, naySayer] = responseStyleResults

  assert.equal(yeaSayer.familyKey, "realist")
  assert.equal(naySayer.familyKey, "realist")
  assert.deepStrictEqual(
    responseStyleResults.map((result) => [
      result.strategyModifier,
      result.normativeModifier,
    ]),
    [
      ["Maximizer", "Pluralist"],
      ["Maximizer", "Pluralist"],
      ["Maximizer", "Pluralist"],
      ["Restrainer", "Pluralist"],
      ["Maximizer", "Pluralist"],
      ["Maximizer", "Pluralist"],
    ],
  )
})
