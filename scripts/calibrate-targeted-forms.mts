/**
 * Deterministically regenerate scoring-v2 calibration for all six targeted
 * Foundation forms.
 *
 * This script is deliberately read-only: it prints calibration evidence and
 * never updates the item bank or scoring constants.
 *
 * Method:
 *   1. For each exact 14-core + 5-extension form, estimate independent-null
 *      dimension means and population SDs over N=100,000.
 *   2. Replay N=500,000 core candidates. Candidates whose rounded core
 *      top-two gap is below 0.3675 receive the exact extension for that pair.
 *   3. Use the same rounded dimension and family scores as the product.
 *      Modifier cuts are p=.33/.67; gap cuts are p=.25/.75.
 *
 * Run with:
 *   npm run calibrate:targeted
 */

import {
  foundationCoreQuestions,
  foundationFamilyPairKey,
  getFoundationQuestionsForSet,
  getFoundationResultQuestions,
} from "@/lib/quiz-schema"
import {
  computeCoreDimensionScores,
  familyProfiles,
  generateResult,
  getV2ScoringCalibration,
} from "@/lib/scoring"
import type {
  Answers,
  DimensionKey,
  DimensionScores,
  FamilyKey,
  Question,
} from "@/lib/types"

const NEUTRAL_SAMPLE_SIZE = 100_000
const CONDITIONAL_CORE_SAMPLE_SIZE = 500_000
const CONDITIONAL_CORE_SEED = 20260728
const CONDITIONAL_EXTENSION_SEED = 20260729
const CORE_ELIGIBILITY_THRESHOLD = 0.3675
const MIN_CALIBRATION_SD = 1e-9

const DIMENSIONS: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

const TARGETED_FORMS: Array<{
  pair: [FamilyKey, FamilyKey]
  neutralSeed: number
}> = [
  {
    pair: ["realist", "institutionalist"],
    neutralSeed: 20260730,
  },
  {
    pair: ["realist", "constructivist"],
    neutralSeed: 20260731,
  },
  {
    pair: ["realist", "criticalPoliticalEconomy"],
    neutralSeed: 20260732,
  },
  {
    pair: ["institutionalist", "constructivist"],
    neutralSeed: 20260733,
  },
  {
    pair: ["institutionalist", "criticalPoliticalEconomy"],
    neutralSeed: 20260734,
  },
  {
    pair: ["constructivist", "criticalPoliticalEconomy"],
    neutralSeed: 20260735,
  },
]

type NeutralBaseline = Record<DimensionKey, { mean: number; sd: number }>

type ConditionalSample = {
  count: number
  retained: number
  restraint: number[]
  orderJustice: number[]
  gaps: number[]
}

function makeRng(seed: number) {
  let state = seed >>> 0

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function buildRandomAnswers(
  questions: readonly Question[],
  random: () => number,
): Answers {
  const answers: Answers = {}

  for (const question of questions) {
    if (question.kind === "likert") {
      answers[question.id] = 1 + Math.floor(random() * 7)
      continue
    }

    const primaryIndex = Math.floor(random() * question.options.length)
    const secondaryIndex = (primaryIndex + 1) % question.options.length
    answers[question.id] = {
      primary: question.options[primaryIndex].id,
      secondary: question.options[secondaryIndex].id,
    }
  }

  return answers
}

function round(value: number, digits: number) {
  return Number(value.toFixed(digits))
}

function percentile(sortedValues: readonly number[], probability: number) {
  if (sortedValues.length === 0) {
    throw new Error("Cannot calculate a percentile for an empty sample.")
  }

  const rank = (sortedValues.length - 1) * probability
  const lowerIndex = Math.floor(rank)
  const upperIndex = Math.ceil(rank)
  const lower = sortedValues[lowerIndex]
  const upper = sortedValues[upperIndex]

  return lower + (upper - lower) * (rank - lowerIndex)
}

function estimateNeutralBaseline(
  pair: readonly [FamilyKey, FamilyKey],
  seed: number,
): NeutralBaseline {
  const questions = getFoundationResultQuestions("targetedExtended", pair)
  if (questions.length !== 19) {
    throw new Error(
      `${foundationFamilyPairKey(...pair)} has ${questions.length} result items; expected 19.`,
    )
  }

  const random = makeRng(seed)
  const aggregates = Object.fromEntries(
    DIMENSIONS.map((dimension) => [
      dimension,
      { sum: 0, sumSquares: 0 },
    ]),
  ) as Record<DimensionKey, { sum: number; sumSquares: number }>

  for (let respondent = 0; respondent < NEUTRAL_SAMPLE_SIZE; respondent += 1) {
    const scores = computeCoreDimensionScores(
      buildRandomAnswers(questions, random),
      "analyst",
    )

    for (const dimension of DIMENSIONS) {
      aggregates[dimension].sum += scores[dimension]
      aggregates[dimension].sumSquares += scores[dimension] ** 2
    }
  }

  return Object.fromEntries(
    DIMENSIONS.map((dimension) => {
      const { sum, sumSquares } = aggregates[dimension]
      const mean = sum / NEUTRAL_SAMPLE_SIZE
      const variance = sumSquares / NEUTRAL_SAMPLE_SIZE - mean ** 2

      return [
        dimension,
        {
          mean: round(mean, 6),
          sd: round(Math.sqrt(Math.max(variance, 0)), 6),
        },
      ]
    }),
  ) as NeutralBaseline
}

function scoreFamiliesAgainstBaseline(
  dimensionScores: DimensionScores,
  baseline: NeutralBaseline,
) {
  return (Object.keys(familyProfiles) as FamilyKey[]).reduce(
    (familyScores, family) => {
      const weights = familyProfiles[family]
      const score = DIMENSIONS.reduce((sum, dimension) => {
        const { mean, sd } = baseline[dimension]
        const standardised =
          Math.abs(sd) < MIN_CALIBRATION_SD
            ? dimensionScores[dimension] - mean
            : (dimensionScores[dimension] - mean) / sd

        return sum + standardised * (weights[dimension] ?? 0)
      }, 0)

      // Match scoreFamilies: the product rounds every family score to 2dp
      // before it selects the winner or calculates the nearest-fit gap.
      familyScores[family] = round(score, 2)
      return familyScores
    },
    {} as Record<FamilyKey, number>,
  )
}

function canonicalTargetedPair(
  first: FamilyKey,
  second: FamilyKey,
): [FamilyKey, FamilyKey] {
  const form = TARGETED_FORMS.find(
    ({ pair }) => pair.includes(first) && pair.includes(second),
  )

  if (!form) {
    throw new Error(`No targeted form exists for ${first}|${second}.`)
  }

  return form.pair
}

function createConditionalSample(): ConditionalSample {
  return {
    count: 0,
    retained: 0,
    restraint: [],
    orderJustice: [],
    gaps: [],
  }
}

function estimateConditionalCuts(
  baselines: ReadonlyMap<string, NeutralBaseline>,
) {
  const coreCalibration = getV2ScoringCalibration("core")
  if (
    coreCalibration.lowDifferentiationThreshold !==
    CORE_ELIGIBILITY_THRESHOLD
  ) {
    throw new Error(
      "The live core eligibility threshold no longer matches the documented " +
        `${CORE_ELIGIBILITY_THRESHOLD}.`,
    )
  }

  if (foundationCoreQuestions.length !== 14) {
    throw new Error(
      `The core form has ${foundationCoreQuestions.length} items; expected 14.`,
    )
  }

  const samples = new Map(
    TARGETED_FORMS.map(({ pair }) => [
      foundationFamilyPairKey(...pair),
      createConditionalSample(),
    ]),
  )
  const coreRandom = makeRng(CONDITIONAL_CORE_SEED)
  const extensionRandom = makeRng(CONDITIONAL_EXTENSION_SEED)
  let eligible = 0

  for (
    let candidate = 0;
    candidate < CONDITIONAL_CORE_SAMPLE_SIZE;
    candidate += 1
  ) {
    const coreAnswers = buildRandomAnswers(
      foundationCoreQuestions,
      coreRandom,
    )
    const coreResult = generateResult(coreAnswers, "analyst", "core")
    if (coreResult.nearestFitGap >= CORE_ELIGIBILITY_THRESHOLD) {
      continue
    }

    eligible += 1
    const pair = canonicalTargetedPair(
      coreResult.familyKey,
      coreResult.runnerUpKey,
    )
    const pairKey = foundationFamilyPairKey(...pair)
    const extensionQuestions = getFoundationQuestionsForSet(
      "targetedExtended",
      pair,
    )
    if (extensionQuestions.length !== 5) {
      throw new Error(
        `${pairKey} has ${extensionQuestions.length} extension items; expected 5.`,
      )
    }

    const extensionAnswers = buildRandomAnswers(
      extensionQuestions,
      extensionRandom,
    )
    const dimensionScores = computeCoreDimensionScores(
      { ...coreAnswers, ...extensionAnswers },
      "analyst",
    )
    const baseline = baselines.get(pairKey)
    const sample = samples.get(pairKey)
    if (!baseline || !sample) {
      throw new Error(`Missing conditional calibration state for ${pairKey}.`)
    }

    const familyScores = scoreFamiliesAgainstBaseline(
      dimensionScores,
      baseline,
    )
    const orderedFamilies = (
      Object.entries(familyScores) as [FamilyKey, number][]
    ).sort((left, right) => right[1] - left[1])
    const familyKey = orderedFamilies[0][0]

    sample.count += 1
    sample.restraint.push(dimensionScores.restraint)
    sample.orderJustice.push(dimensionScores.orderJustice)
    sample.gaps.push(orderedFamilies[0][1] - orderedFamilies[1][1])
    if (pair.includes(familyKey)) {
      sample.retained += 1
    }
  }

  return {
    eligible,
    samples: new Map(
      [...samples].map(([pairKey, sample]) => {
        sample.restraint.sort((left, right) => left - right)
        sample.orderJustice.sort((left, right) => left - right)
        sample.gaps.sort((left, right) => left - right)

        return [pairKey, sample]
      }),
    ),
  }
}

function formatBaseline(baseline: NeutralBaseline) {
  return DIMENSIONS.map(
    (dimension) =>
      `    ${dimension}: { mean: ${baseline[dimension].mean.toFixed(6)}, ` +
      `sd: ${baseline[dimension].sd.toFixed(6)} },`,
  ).join("\n")
}

function main() {
  const baselines = new Map<string, NeutralBaseline>()

  for (const { pair, neutralSeed } of TARGETED_FORMS) {
    baselines.set(
      foundationFamilyPairKey(...pair),
      estimateNeutralBaseline(pair, neutralSeed),
    )
  }

  const { eligible, samples } = estimateConditionalCuts(baselines)

  console.log("Targeted Foundation calibration (read-only)")
  console.log(
    `neutral N=${NEUTRAL_SAMPLE_SIZE.toLocaleString("en-US")}; ` +
      `conditional core N=${CONDITIONAL_CORE_SAMPLE_SIZE.toLocaleString("en-US")}; ` +
      `eligible=${eligible.toLocaleString("en-US")} ` +
      `(${((eligible / CONDITIONAL_CORE_SAMPLE_SIZE) * 100).toFixed(4)}%)`,
  )
  console.log(
    `seeds: core=${CONDITIONAL_CORE_SEED}, ` +
      `extension=${CONDITIONAL_EXTENSION_SEED}; ` +
      "modifier p=.33/.67; gap p=.25/.75",
  )

  for (const { pair, neutralSeed } of TARGETED_FORMS) {
    const pairKey = foundationFamilyPairKey(...pair)
    const baseline = baselines.get(pairKey)
    const sample = samples.get(pairKey)
    if (!baseline || !sample) {
      throw new Error(`Missing report state for ${pairKey}.`)
    }

    const restraintLower = percentile(sample.restraint, 0.33)
    const restraintUpper = percentile(sample.restraint, 0.67)
    const orderJusticeLower = percentile(sample.orderJustice, 0.33)
    const orderJusticeUpper = percentile(sample.orderJustice, 0.67)
    const gapLower = percentile(sample.gaps, 0.25)
    const gapUpper = percentile(sample.gaps, 0.75)

    console.log(`\n${pairKey} (neutral seed ${neutralSeed})`)
    console.log("  neutralBaseline: {")
    console.log(formatBaseline(baseline))
    console.log("  }")
    console.log(
      `  restraint p33/p67: ${restraintLower.toFixed(2)} / ` +
        restraintUpper.toFixed(2),
    )
    console.log(
      `  orderJustice p33/p67: ${orderJusticeLower.toFixed(2)} / ` +
        orderJusticeUpper.toFixed(2),
    )
    console.log(
      `  gap p25/p75: ${gapLower.toFixed(2)} / ${gapUpper.toFixed(2)}`,
    )
    console.log(
      `  conditional sample: n=${sample.count.toLocaleString("en-US")}; ` +
        `retained=${sample.retained.toLocaleString("en-US")} ` +
        `(${((sample.retained / sample.count) * 100).toFixed(4)}%)`,
    )
  }
}

main()
