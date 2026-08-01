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
 *   5. How often do labels change under small, deterministic answer perturbations?
 */

import { getFoundationQuestions } from "@/lib/quiz-schema"
import { assessFoundationNarrative } from "@/lib/narrative/foundation"
import { NEUTRAL_BASELINE } from "@/lib/scoring-calibration"
import { getSeededOptionOrder } from "@/lib/option-order"
import {
  computeCoreDimensionScores,
  buildCanonicalFoundationResult,
  scoreFamilies,
} from "@/lib/scoring"
import type {
  Answers,
  DimensionKey,
  DimensionScores,
  FamilyKey,
  QuizMode,
} from "@/lib/types"

const MODE: QuizMode = "analyst"
const RANDOM_N = 500
const RANDOM_SEED = 20260728
const STABILITY_SEED = 20260729
const SHOW_CALIBRATION = process.argv.includes("--calibration")
const SHOW_GAPS = process.argv.includes("--gaps")
const SHOW_PERCENTILES = process.argv.includes("--percentiles")
const SHOW_SENSITIVITY = process.argv.includes("--sensitivity")
const SHOW_STABILITY = process.argv.includes("--stability")
const SHOW_ORDER_BIAS = process.argv.includes("--order-bias")

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

const FOUNDATION_QUESTIONS = getFoundationQuestions(MODE) as AnyQuestion[]

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
 * @param orderSeed    when present, choose by position after seeded presentation ordering
 */
function buildAnswers(
  likertValue: number,
  pickOption: (options: { id: string }[], questionId: string) => number,
  secondaryOffset = 1,
  orderSeed?: string,
): Answers {
  const answers: Answers = {}

  for (const question of FOUNDATION_QUESTIONS) {

    if (question.kind === "likert") {
      answers[question.id] = likertValue
      continue
    }

    const canonicalOptions = question.options ?? []
    const options = orderSeed
      ? getSeededOptionOrder(canonicalOptions, orderSeed, question.id)
      : canonicalOptions
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

function cloneAnswers(answers: Answers): Answers {
  return Object.fromEntries(
    Object.entries(answers).map(([questionId, answer]) => [
      questionId,
      typeof answer === "object" ? { ...answer } : answer,
    ]),
  )
}

function perturbAnswers(
  answers: Answers,
  changeCount: number,
  rng: ReturnType<typeof makeRng>,
): Answers {
  if (changeCount > FOUNDATION_QUESTIONS.length) {
    throw new Error(
      `Cannot change ${changeCount} answers in a ${FOUNDATION_QUESTIONS.length}-item instrument.`,
    )
  }

  const perturbed = cloneAnswers(answers)
  const questions = [...FOUNDATION_QUESTIONS]

  for (let i = 0; i < changeCount; i += 1) {
    const swapIndex = i + Math.floor(rng() * (questions.length - i))
    ;[questions[i], questions[swapIndex]] = [questions[swapIndex], questions[i]]

    const question = questions[i]
    const currentAnswer = perturbed[question.id]

    if (question.kind === "likert") {
      if (typeof currentAnswer !== "number") {
        throw new Error(`Expected a Likert answer for ${question.id}.`)
      }

      const direction = rng() < 0.5 ? -1 : 1
      perturbed[question.id] =
        currentAnswer + direction < 1 || currentAnswer + direction > 7
          ? currentAnswer - direction
          : currentAnswer + direction
      continue
    }

    const options = question.options ?? []
    const currentPrimary =
      typeof currentAnswer === "string"
        ? currentAnswer
        : typeof currentAnswer === "object"
          ? currentAnswer.primary
          : undefined

    if (!currentPrimary || options.length < 2) {
      throw new Error(`Expected at least two choice options for ${question.id}.`)
    }

    const alternatives = options.filter((option) => option.id !== currentPrimary)
    const nextPrimary = alternatives[Math.floor(rng() * alternatives.length)].id

    if (typeof currentAnswer === "string") {
      perturbed[question.id] = nextPrimary
      continue
    }

    if (typeof currentAnswer !== "object" || currentAnswer === null) {
      throw new Error(`Expected a ranked choice answer for ${question.id}.`)
    }

    perturbed[question.id] = {
      primary: nextPrimary,
      secondary:
        currentAnswer.secondary === nextPrimary
          ? currentPrimary
          : currentAnswer.secondary,
    }
  }

  return perturbed
}

type StabilitySnapshot = {
  familyLabel: string
  strategyModifier: string
  normativeModifier: string
  fullLabel: string
  narrativeState: string
}

function getStabilitySnapshot(answers: Answers): StabilitySnapshot {
  const scores = computeCoreDimensionScores(answers, MODE)
  const result = buildCanonicalFoundationResult(scores)

  return {
    familyLabel: result.familyLabel,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    fullLabel:
      `${result.familyLabel} / ${result.strategyModifier} / ` +
      result.normativeModifier,
    narrativeState: assessFoundationNarrative(scores).state,
  }
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

function populationStandardDeviation(sum: number, sumSquares: number, count: number) {
  const mean = sum / count
  const variance = sumSquares / count - mean ** 2
  return Math.sqrt(Math.max(variance, 0))
}

function percentile(values: number[], probability: number) {
  const sorted = [...values].sort((a, b) => a - b)
  const rank = (sorted.length - 1) * probability
  const lowerIndex = Math.floor(rank)
  const upperIndex = Math.ceil(rank)
  const lower = sorted[lowerIndex]
  const upper = sorted[upperIndex]

  return lower + (upper - lower) * (rank - lowerIndex)
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
  "\nFlat response styles should be family-invariant across Likert levels.\n" +
  "Changing the choice-profile shape should still be able to change family.",
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

const rng = makeRng(RANDOM_SEED)

const familyCounts: Record<string, number> = {}
const strategyCounts: Record<string, number> = {}
const normCounts: Record<string, number> = {}
const labelCounts: Record<string, number> = {}
const dimMin: Record<string, number> = {}
const dimMax: Record<string, number> = {}
const dimSum: Record<string, number> = {}
const dimSumSquares: Record<string, number> = {}
const familyScoreGaps: number[] = []
const narrativeStateCounts: Record<string, number> = {}
const randomDimensionScores: DimensionScores[] = []
const randomRespondentAnswers: Answers[] = []
const randomRespondentPlans: Array<{
  likert: number
  positions: Record<string, number>
}> = []

for (const key of DIMENSION_KEYS) {
  dimMin[key] = Infinity
  dimMax[key] = -Infinity
  dimSum[key] = 0
  dimSumSquares[key] = 0
}

for (let i = 0; i < RANDOM_N; i += 1) {
  const likert = 1 + Math.floor(rng() * 7)
  const positions: Record<string, number> = {}
  const answers = buildAnswers(likert, (options, questionId) => {
    const position = Math.floor(rng() * options.length)
    positions[questionId] = position
    return position
  })
  randomRespondentPlans.push({ likert, positions })
  randomRespondentAnswers.push(answers)
  const scores = computeCoreDimensionScores(answers, MODE)
  const result = buildCanonicalFoundationResult(scores)
  const narrativeAssessment = assessFoundationNarrative(scores)
  const orderedFamilyScores = Object.values(result.familyScores).sort((a, b) => b - a)
  randomDimensionScores.push(scores)
  familyScoreGaps.push(orderedFamilyScores[0] - orderedFamilyScores[1])
  narrativeStateCounts[narrativeAssessment.state] =
    (narrativeStateCounts[narrativeAssessment.state] ?? 0) + 1

  familyCounts[result.familyLabel] = (familyCounts[result.familyLabel] ?? 0) + 1
  strategyCounts[result.strategyModifier] = (strategyCounts[result.strategyModifier] ?? 0) + 1
  normCounts[result.normativeModifier] = (normCounts[result.normativeModifier] ?? 0) + 1

  const label = `${result.familyLabel} / ${result.strategyModifier} / ${result.normativeModifier}`
  labelCounts[label] = (labelCounts[label] ?? 0) + 1

  for (const key of DIMENSION_KEYS) {
    dimMin[key] = Math.min(dimMin[key], scores[key])
    dimMax[key] = Math.max(dimMax[key], scores[key])
    dimSum[key] += scores[key]
    dimSumSquares[key] += scores[key] ** 2
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

if (SHOW_ORDER_BIAS) {
  const randomisedFamilyCounts: Record<string, number> = {}

  for (const [respondentIndex, plan] of randomRespondentPlans.entries()) {
    const answers = buildAnswers(
      plan.likert,
      (_options, questionId) => plan.positions[questionId] ?? 0,
      1,
      `order-bias-${RANDOM_SEED}-${respondentIndex}`,
    )
    const result = buildCanonicalFoundationResult(
      computeCoreDimensionScores(answers, MODE),
    )
    randomisedFamilyCounts[result.familyLabel] =
      (randomisedFamilyCounts[result.familyLabel] ?? 0) + 1
  }

  console.log("\n" + "=".repeat(74))
  console.log("ORDER BIAS  Fixed versus seeded-randomised option presentation")
  console.log("=".repeat(74))
  console.log(
    `\nN=${RANDOM_N}, respondent seed=${RANDOM_SEED}, mode=${MODE}. ` +
    "Each paired respondent keeps the same Likert values and choice positions.\n",
  )
  report("Fixed-order family distribution", familyCounts)
  report("Randomised-order family distribution", randomisedFamilyCounts)

  console.log("\nResponse-style respondents under randomised option order")
  const randomisedStyles = [
    { label: "YEA-SAYER  (Likert 6, always first position)", likert: 6, pick: alwaysFirst },
    { label: "NAY-SAYER  (Likert 2, always first position)", likert: 2, pick: alwaysFirst },
    { label: "MIDPOINTER (Likert 4, always first position)", likert: 4, pick: alwaysFirst },
    { label: "YEA + LAST (Likert 6, always last position)", likert: 6, pick: alwaysLast },
    { label: "EXTREME AGREE (Likert 7, always first position)", likert: 7, pick: alwaysFirst },
    { label: "EXTREME DISAGREE (Likert 1, always first position)", likert: 1, pick: alwaysFirst },
  ]

  for (const [styleIndex, style] of randomisedStyles.entries()) {
    summarise(
      `${style.label}; order seed ${styleIndex + 1}`,
      buildAnswers(
        style.likert,
        style.pick,
        1,
        `order-bias-style-${RANDOM_SEED}-${styleIndex}`,
      ),
    )
  }
}

console.log("\nObserved dimension range across random respondents")
console.log(
  `  ${pad("dimension", 22)} ${padLeft("min", 6)} ${padLeft("max", 6)} ` +
  `${padLeft("mean", 6)} ${padLeft("sd", 6)} ${padLeft("span", 6)}`,
)
for (const key of DIMENSION_KEYS) {
  const span = dimMax[key] - dimMin[key]
  const sd = populationStandardDeviation(dimSum[key], dimSumSquares[key], RANDOM_N)
  console.log(
    `  ${pad(key, 22)} ${padLeft(dimMin[key].toFixed(2), 6)} ${padLeft(dimMax[key].toFixed(2), 6)} ` +
    `${padLeft((dimSum[key] / RANDOM_N).toFixed(2), 6)} ${padLeft(sd.toFixed(2), 6)} ` +
    `${padLeft(span.toFixed(2), 6)}`,
  )
}

if (SHOW_GAPS) {
  const gapSum = familyScoreGaps.reduce((sum, gap) => sum + gap, 0)
  const gapSumSquares = familyScoreGaps.reduce((sum, gap) => sum + gap ** 2, 0)

  console.log("\nTop-two family-score gap distribution")
  console.log(`  Sample: N=${RANDOM_N}, seed=${RANDOM_SEED}, mode=${MODE}`)
  console.log("  Linear interpolation at rank (N - 1) × p")
  console.log(`  ${pad("statistic", 12)} ${padLeft("gap", 10)}`)
  for (const [label, value] of [
    ["min", Math.min(...familyScoreGaps)],
    ["max", Math.max(...familyScoreGaps)],
    ["mean", gapSum / RANDOM_N],
    [
      "sd",
      populationStandardDeviation(gapSum, gapSumSquares, RANDOM_N),
    ],
    ["p10", percentile(familyScoreGaps, 0.1)],
    ["p25", percentile(familyScoreGaps, 0.25)],
    ["p50", percentile(familyScoreGaps, 0.5)],
    ["p75", percentile(familyScoreGaps, 0.75)],
    ["p90", percentile(familyScoreGaps, 0.9)],
  ] as const) {
    console.log(`  ${pad(label, 12)} ${padLeft(value.toFixed(6), 10)}`)
  }

  report("Foundation narrative-state distribution", narrativeStateCounts)
}

if (SHOW_CALIBRATION) {
  console.log("\nCalibration object")
  console.log("export const NEUTRAL_BASELINE = {")
  for (const key of DIMENSION_KEYS) {
    const mean = dimSum[key] / RANDOM_N
    const sd = populationStandardDeviation(dimSum[key], dimSumSquares[key], RANDOM_N)
    console.log(`  ${key}: { mean: ${mean}, sd: ${sd} },`)
  }
  console.log("} as const")
}

if (SHOW_PERCENTILES) {
  console.log("\nDimension percentiles across seeded random respondents")
  console.log("  Linear interpolation at rank (N - 1) × p")
  console.log(
    `  ${pad("dimension", 22)} ${padLeft("p33", 10)} ${padLeft("p67", 10)}`,
  )
  for (const key of DIMENSION_KEYS) {
    const values = randomDimensionScores.map((scores) => scores[key])
    console.log(
      `  ${pad(key, 22)} ${padLeft(percentile(values, 0.33).toFixed(6), 10)} ` +
      `${padLeft(percentile(values, 0.67).toFixed(6), 10)}`,
    )
  }
}

if (SHOW_SENSITIVITY) {
  console.log("\n" + "=".repeat(74))
  console.log("SENSITIVITY SWEEP  One dimension held at its neutral baseline")
  console.log("=".repeat(74))

  const [baselineTopFamily, baselineTopCount] = Object.entries(familyCounts)
    .sort((a, b) => b[1] - a[1])[0]
  const sensitivityRows: {
    dimension: DimensionKey
    resultingTopFamily: string
    resultingTopShare: number
    baselineTopShare: number
    changePercentagePoints: number
  }[] = []

  for (const dimension of DIMENSION_KEYS) {
    const counts: Record<string, number> = {}

    for (const dimensionScores of randomDimensionScores) {
      const neutralisedScores = {
        ...dimensionScores,
        [dimension]: NEUTRAL_BASELINE[dimension].mean,
      }
      const result = buildCanonicalFoundationResult(neutralisedScores)
      counts[result.familyLabel] = (counts[result.familyLabel] ?? 0) + 1
    }

    report(`Family distribution with ${dimension} neutralised`, counts)

    const [resultingTopFamily, resultingTopCount] = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])[0]
    const neutralisedBaselineTopCount = counts[baselineTopFamily] ?? 0

    sensitivityRows.push({
      dimension,
      resultingTopFamily,
      resultingTopShare: resultingTopCount / RANDOM_N,
      baselineTopShare: neutralisedBaselineTopCount / RANDOM_N,
      changePercentagePoints:
        ((neutralisedBaselineTopCount - baselineTopCount) / RANDOM_N) * 100,
    })
  }

  console.log(`\nBaseline top family: ${baselineTopFamily} (${pct(baselineTopCount, RANDOM_N)})`)
  console.log(
    `  ${pad("neutralised dimension", 24)} ${pad("resulting leader", 32)} ` +
    `${padLeft("leader", 8)} ${padLeft(`${baselineTopFamily} share`, 32)} ${padLeft("move", 9)}`,
  )
  for (const row of sensitivityRows) {
    const signedMove = `${row.changePercentagePoints >= 0 ? "+" : ""}` +
      `${row.changePercentagePoints.toFixed(1)} pp`
    console.log(
      `  ${pad(row.dimension, 24)} ${pad(row.resultingTopFamily, 32)} ` +
      `${padLeft(pct(row.resultingTopShare * RANDOM_N, RANDOM_N), 8)} ` +
      `${padLeft(pct(row.baselineTopShare * RANDOM_N, RANDOM_N), 32)} ` +
      `${padLeft(signedMove, 9)}`,
    )
  }
}

if (SHOW_STABILITY) {
  const stabilityRng = makeRng(STABILITY_SEED)
  const levels = [
    { label: "light", changeCount: 2 },
    { label: "moderate", changeCount: 5 },
    { label: "heavy", changeCount: 10 },
  ] as const
  const outcomeColumns: {
    key: keyof StabilitySnapshot
    label: string
  }[] = [
    { key: "familyLabel", label: "Family label" },
    { key: "strategyModifier", label: "Strategy modifier" },
    { key: "normativeModifier", label: "Normative modifier" },
    { key: "fullLabel", label: "Full three-part label" },
    { key: "narrativeState", label: "Narrative differentiation state" },
  ]
  const rows = levels.map((level) => {
    const changedCounts = Object.fromEntries(
      outcomeColumns.map(({ key }) => [key, 0]),
    ) as Record<keyof StabilitySnapshot, number>

    for (const answers of randomRespondentAnswers) {
      const baseline = getStabilitySnapshot(answers)
      const perturbed = getStabilitySnapshot(
        perturbAnswers(answers, level.changeCount, stabilityRng),
      )

      for (const { key } of outcomeColumns) {
        if (baseline[key] !== perturbed[key]) {
          changedCounts[key] += 1
        }
      }
    }

    return { ...level, changedCounts }
  })

  console.log("\n" + "=".repeat(74))
  console.log("STABILITY  Test-retest label changes under answer perturbation")
  console.log("=".repeat(74))
  console.log(
    `\nN=${RANDOM_N}, respondent seed=${RANDOM_SEED}, perturbation seed=${STABILITY_SEED}, ` +
    `${FOUNDATION_QUESTIONS.length} answers per respondent\n`,
  )
  console.log(
    `| Perturbation level | ${outcomeColumns.map(({ label }) => label).join(" | ")} |`,
  )
  console.log(
    `| --- | ${outcomeColumns.map(() => "---:").join(" | ")} |`,
  )
  for (const row of rows) {
    console.log(
      `| ${row.label} (${row.changeCount} answers) | ` +
      `${outcomeColumns
        .map(({ key }) => pct(row.changedCounts[key], RANDOM_N))
        .join(" | ")} |`,
    )
  }

  console.log(`
Interpretation
  A label flipping on a 2-answer change out of ${FOUNDATION_QUESTIONS.length} is not stable
  enough to present as a discrete type. Family should be more stable than the
  modifiers because it aggregates seven dimensions, while each modifier reads one.
`)
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
  Part 1: YEA-SAYER, NAY-SAYER, MIDPOINTER, and the two extreme flat
          styles should return the same family because they differ only
          in response level. YEA + LAST should differ when the changed
          choice profile creates a different cross-dimension shape.

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
