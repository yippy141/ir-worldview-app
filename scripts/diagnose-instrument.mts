/**
 * Instrument diagnostics.
 *
 * Run with:
 *   node --experimental-strip-types --import ./tests/register-alias-loader.mjs scripts/diagnose-instrument.mts
 *
 * Or add to package.json scripts:
 *   "diagnose": "node --experimental-strip-types --import ./tests/register-alias-loader.mjs scripts/diagnose-instrument.mts"
 *   then: npm run diagnose
 *
 * This script does not change any product code. It only reads the scoring
 * functions and reports how the instrument behaves under controlled inputs.
 *
 * What it answers:
 *   1. Does a respondent who agrees with everything get a distinctive result?
 *   2. What is the actual usable range of each dimension score?
 *   3. What proportion of random respondents get each family / modifier / label?
 *   4. Is any family effectively unreachable?
 */

import { getFoundationQuestions } from "@/lib/quiz-schema"
import {
  computeCoreDimensionScores,
  buildCanonicalFoundationResult,
  scoreFamilies,
} from "@/lib/scoring"
import type { Answers, DimensionKey, FamilyKey, QuizMode } from "@/lib/types"

const MODE: QuizMode = "analyst"
const RANDOM_N = 500

const DIMENSION_KEYS: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

// ---------------------------------------------------------------- helpers

type AnyQuestion = ReturnType<typeof getFoundationQuestions>[number] & {
  options?: { id: string }[]
  allowSecondChoiceInAnalyst?: boolean
}

/** Deterministic pseudo-random so runs are reproducible. */
function makeRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

/**
 * Build a full answer set.
 * @param likertValue  value 1..7 to give every Likert item
 * @param pickOption   given the option list, return the index to choose
 * @param secondaryOffset  how far down the list to place the second choice
 */
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

function pad(value: string | number, width: number) {
  return String(value).padEnd(width)
}

function padLeft(value: string | number, width: number) {
  return String(value).padStart(width)
}

function pct(count: number, total: number) {
  return `${((count / total) * 100).toFixed(1)}%`
}

function bar(fraction: number, width = 30) {
  const filled = Math.round(fraction * width)
  return "█".repeat(filled) + "·".repeat(width - filled)
}

function summarise(label: string, answers: Answers) {
  const scores = computeCoreDimensionScores(answers, MODE)
  const result = buildCanonicalFoundationResult(scores)
  const families = scoreFamilies(scores)

  console.log(`\n--- ${label} ---`)
  for (const key of DIMENSION_KEYS) {
    console.log(`  ${pad(key, 22)} ${padLeft(scores[key].toFixed(2), 6)}`)
  }
  console.log(
    `  => ${result.familyLabel} / ${result.strategyModifier} / ${result.normativeModifier}`,
  )
  console.log(
    `     family scores: ${(Object.entries(families) as [FamilyKey, number][])
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}=${v.toFixed(2)}`)
      .join("  ")}`,
  )
  return { scores, result }
}

// ---------------------------------------------------------------- part 1

console.log("=".repeat(74))
console.log("PART 1  Response-style respondents")
console.log("=".repeat(74))
console.log(
  "\nIf the yea-sayer produces a confident, distinctive family label, the\n" +
  "instrument is measuring agreeableness rather than worldview.",
)

const alwaysFirst = () => 0
const alwaysLast = (options: { id: string }[]) => options.length - 1

summarise("YEA-SAYER  (Likert 6, always first option)", buildAnswers(6, alwaysFirst))
summarise("NAY-SAYER  (Likert 2, always first option)", buildAnswers(2, alwaysFirst))
summarise("MIDPOINTER (Likert 4, always first option)", buildAnswers(4, alwaysFirst))
summarise("YEA + LAST (Likert 6, always last option)", buildAnswers(6, alwaysLast))
summarise("EXTREME AGREE (Likert 7, always first option)", buildAnswers(7, alwaysFirst))
summarise("EXTREME DISAGREE (Likert 1, always first option)", buildAnswers(1, alwaysFirst))

// ---------------------------------------------------------------- part 2

console.log("\n" + "=".repeat(74))
console.log(`PART 2  ${RANDOM_N} random respondents`)
console.log("=".repeat(74))

const rng = makeRng(20260728)

const familyCounts: Record<string, number> = {}
const strategyCounts: Record<string, number> = {}
const normCounts: Record<string, number> = {}
const labelCounts: Record<string, number> = {}
const dimMin: Record<string, number> = {}
const dimMax: Record<string, number> = {}
const dimSum: Record<string, number> = {}

for (const key of DIMENSION_KEYS) {
  dimMin[key] = Infinity
  dimMax[key] = -Infinity
  dimSum[key] = 0
}

for (let i = 0; i < RANDOM_N; i += 1) {
  const likert = 1 + Math.floor(rng() * 7)
  const answers = buildAnswers(likert, (options) => Math.floor(rng() * options.length))
  const scores = computeCoreDimensionScores(answers, MODE)
  const result = buildCanonicalFoundationResult(scores)

  familyCounts[result.familyLabel] = (familyCounts[result.familyLabel] ?? 0) + 1
  strategyCounts[result.strategyModifier] = (strategyCounts[result.strategyModifier] ?? 0) + 1
  normCounts[result.normativeModifier] = (normCounts[result.normativeModifier] ?? 0) + 1

  const label = `${result.familyLabel} / ${result.strategyModifier} / ${result.normativeModifier}`
  labelCounts[label] = (labelCounts[label] ?? 0) + 1

  for (const key of DIMENSION_KEYS) {
    dimMin[key] = Math.min(dimMin[key], scores[key])
    dimMax[key] = Math.max(dimMax[key], scores[key])
    dimSum[key] += scores[key]
  }
}

function report(title: string, counts: Record<string, number>) {
  console.log(`\n${title}`)
  for (const [key, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${pad(key, 46)} ${padLeft(pct(count, RANDOM_N), 7)}  ${bar(count / RANDOM_N)}`)
  }
}

report("Family distribution", familyCounts)
report("Strategy modifier distribution", strategyCounts)
report("Normative modifier distribution", normCounts)
report("Full three-part label distribution (top rows)", labelCounts)

console.log("\nObserved dimension range across random respondents")
console.log(`  ${pad("dimension", 22)} ${padLeft("min", 6)} ${padLeft("max", 6)} ${padLeft("mean", 6)} ${padLeft("span", 6)}`)
for (const key of DIMENSION_KEYS) {
  const span = dimMax[key] - dimMin[key]
  console.log(
    `  ${pad(key, 22)} ${padLeft(dimMin[key].toFixed(2), 6)} ${padLeft(dimMax[key].toFixed(2), 6)} ` +
    `${padLeft((dimSum[key] / RANDOM_N).toFixed(2), 6)} ${padLeft(span.toFixed(2), 6)}`,
  )
}

// ---------------------------------------------------------------- part 3

console.log("\n" + "=".repeat(74))
console.log("PART 3  Reachability of each family")
console.log("=".repeat(74))
console.log(
  "\nDirectly constructs the ideal dimension profile for each family and checks\n" +
  "whether the scorer actually returns that family.",
)

const idealProfiles: Record<FamilyKey, Partial<Record<DimensionKey, number>>> = {
  realist: {
    securityCompetition: 7, institutions: 1, domesticFilters: 2,
    normsIdentity: 1, politicalEconomy: 4, restraint: 1, orderJustice: 6,
  },
  institutionalist: {
    securityCompetition: 2, institutions: 7, domesticFilters: 6,
    normsIdentity: 5, politicalEconomy: 4, restraint: 6, orderJustice: 5,
  },
  constructivist: {
    securityCompetition: 3, institutions: 5, domesticFilters: 4,
    normsIdentity: 7, politicalEconomy: 4, restraint: 5, orderJustice: 5,
  },
  criticalPoliticalEconomy: {
    securityCompetition: 3, institutions: 1, domesticFilters: 6,
    normsIdentity: 4, politicalEconomy: 7, restraint: 4, orderJustice: 2,
  },
}

for (const [family, profile] of Object.entries(idealProfiles) as [FamilyKey, Record<DimensionKey, number>][]) {
  const scores = DIMENSION_KEYS.reduce((acc, key) => {
    acc[key] = profile[key] ?? 4
    return acc
  }, {} as Record<DimensionKey, number>)

  const result = buildCanonicalFoundationResult(scores as never)
  const match = result.familyKey === family ? "REACHABLE" : "*** NOT REACHABLE ***"
  console.log(`\n  target: ${pad(family, 26)} got: ${pad(result.familyKey, 26)} ${match}`)
  console.log(
    `    scores: ${(Object.entries(result.familyScores) as [FamilyKey, number][])
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}=${v.toFixed(2)}`)
      .join("  ")}`,
  )
}

console.log("\n" + "=".repeat(74))
console.log("Interpretation guide")
console.log("=".repeat(74))
console.log(`
  Part 1: if YEA-SAYER and NAY-SAYER produce different families, the
          instrument has some real signal. If they produce the same
          family, or if YEA-SAYER produces a confident institutionalist
          reading, acquiescence bias is driving the result.

  Part 2: if any single family exceeds 40% of random respondents, the
          family weight matrix is skewed. If any single three-part label
          exceeds 25%, the label is close to constant across users and
          is not carrying information.

          The "span" column is the real usable range of each score. If
          span is well under 6.00, the 1-7 presentation is misleading and
          band descriptors need recalibrating against the real range.

  Part 3: any family marked NOT REACHABLE cannot be produced even by a
          respondent with the textbook profile for it. That is a scoring
          bug, not a finding about respondents.
`)
