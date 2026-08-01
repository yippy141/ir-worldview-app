import test from "node:test"
import assert from "node:assert/strict"
import {
  foundationCoreQuestions,
  foundationFamilyPairKey,
  getFoundationQuestionsForSet,
  selectFoundationAnswersForSet,
} from "@/lib/quiz-schema"
import {
  buildCanonicalFoundationResult,
  computeCoreDimensionAudit,
  foundationScoringCalibrationForForm,
  generateResult,
  getV2ScoringCalibration,
} from "@/lib/scoring"
import {
  buildFoundationSharePayload,
  encodePayload,
  resolveFoundationPayload,
} from "@/lib/share"
import type {
  Answers,
  DimensionScores,
  FamilyKey,
  Question,
} from "@/lib/types"

const CENTERED: DimensionScores = {
  securityCompetition: 4,
  institutions: 4,
  domesticFilters: 4,
  normsIdentity: 4,
  politicalEconomy: 4,
  restraint: 4,
  orderJustice: 4,
}

test("the live core audit scores every displayed reverse item", () => {
  const audit = computeCoreDimensionAudit(
    { v21_sc_rev_02: 1 },
    "analyst",
  )

  assert.equal(audit.weights.securityCompetition, 1)
  assert.equal(audit.roundedAverages.securityCompetition, 7)
})

test("core result filtering excludes stale answers from legacy and other extension forms", () => {
  const coreAnswers = Object.fromEntries(
    foundationCoreQuestions.map((question) => [question.id, 4]),
  )
  const contaminated = {
    ...coreAnswers,
    sc1: 7,
    in1: 1,
    an_pe3: 7,
    case_semiconductors: "edge",
  } satisfies Answers
  const filtered = selectFoundationAnswersForSet(contaminated, "core")

  assert.deepEqual(filtered, coreAnswers)
  assert.deepEqual(
    generateResult(filtered, "analyst", "core"),
    generateResult(coreAnswers, "analyst", "core"),
  )
})

test("all three core strategy and normative modifiers are reachable", () => {
  const centered = buildCanonicalFoundationResult(CENTERED, "core")
  const lower = buildCanonicalFoundationResult(
    { ...CENTERED, restraint: 2, orderJustice: 2 },
    "core",
  )
  const upper = buildCanonicalFoundationResult(
    { ...CENTERED, restraint: 6, orderJustice: 6 },
    "core",
  )

  assert.equal(centered.strategyModifier, "Hedger")
  assert.equal(centered.normativeModifier, "Conditional Solidarist")
  assert.equal(lower.strategyModifier, "Maximizer")
  assert.equal(lower.normativeModifier, "Universalist")
  assert.equal(upper.strategyModifier, "Restrainer")
  assert.equal(upper.normativeModifier, "Pluralist")
})

test("seeded independent core responses remain distributed and make targeted follow-up live", () => {
  const random = makeRng(20260728)
  const { lowDifferentiationThreshold } =
    getV2ScoringCalibration("core")
  const familyCounts = new Map<string, number>()
  let targetedEligible = 0

  for (let respondent = 0; respondent < 500; respondent += 1) {
    const answers = Object.fromEntries(
      foundationCoreQuestions.map((question) => [
        question.id,
        1 + Math.floor(random() * 7),
      ]),
    )
    const result = generateResult(answers, "analyst", "core")
    familyCounts.set(
      result.familyKey,
      (familyCounts.get(result.familyKey) ?? 0) + 1,
    )
    if (result.nearestFitGap < lowDifferentiationThreshold) {
      targetedEligible += 1
    }
  }

  assert.equal(familyCounts.size, 4)
  assert.ok(Math.max(...familyCounts.values()) / 500 <= 0.35)
  assert.ok(targetedEligible / 500 >= 0.15)
  assert.ok(targetedEligible / 500 <= 0.35)
})

test("every targeted pair uses its exact calibration and keeps all modifier bands live", () => {
  const targetPerPair = 120
  const coreRandom = makeRng(20260728)
  const extensionRandom = makeRng(20260729)
  const coreCalibration = getV2ScoringCalibration("core")
  const samples = new Map<
    string,
    {
      pair: [FamilyKey, FamilyKey]
      count: number
      retained: number
      strategies: Set<string>
      norms: Set<string>
    }
  >()

  for (const pair of TARGETED_PAIRS) {
    samples.set(foundationFamilyPairKey(...pair), {
      pair,
      count: 0,
      retained: 0,
      strategies: new Set(),
      norms: new Set(),
    })
  }

  for (
    let candidate = 0;
    candidate < 30_000 &&
    [...samples.values()].some((sample) => sample.count < targetPerPair);
    candidate += 1
  ) {
    const coreAnswers = buildRandomAnswers(
      foundationCoreQuestions,
      coreRandom,
    )
    const coreResult = generateResult(coreAnswers, "analyst", "core")
    if (
      coreResult.nearestFitGap >=
      coreCalibration.lowDifferentiationThreshold
    ) {
      continue
    }

    const pair = canonicalPair(
      coreResult.familyKey,
      coreResult.runnerUpKey,
    )
    const pairKey = foundationFamilyPairKey(...pair)
    const sample = samples.get(pairKey)
    if (!sample || sample.count >= targetPerPair) continue

    const extensionAnswers = buildRandomAnswers(
      getFoundationQuestionsForSet("targetedExtended", pair),
      extensionRandom,
    )
    const answers = { ...coreAnswers, ...extensionAnswers }
    const calibration = foundationScoringCalibrationForForm(
      "targetedExtended",
      pair,
    )
    assert.ok(calibration)
    const result = generateResult(answers, "analyst", calibration)
    const encoded = encodePayload(
      buildFoundationSharePayload(
        result,
        "en",
        "targetedExtended",
        pair,
      ),
    )
    const resolved = resolveFoundationPayload(encoded)

    assert.ok(resolved)
    assert.equal(resolved.scoringCalibration, calibration)
    assert.deepEqual(resolved.result, result)

    sample.count += 1
    sample.strategies.add(result.strategyModifier)
    sample.norms.add(result.normativeModifier)
    if (pair.includes(result.familyKey)) {
      sample.retained += 1
    }
  }

  for (const sample of samples.values()) {
    assert.equal(sample.count, targetPerPair)
    assert.equal(sample.strategies.size, 3)
    assert.equal(sample.norms.size, 3)
    assert.ok(
      sample.retained / sample.count >= 0.65,
      `${foundationFamilyPairKey(...sample.pair)} retained only ` +
        `${sample.retained}/${sample.count}`,
    )
  }
})

const TARGETED_PAIRS: Array<[FamilyKey, FamilyKey]> = [
  ["realist", "institutionalist"],
  ["realist", "constructivist"],
  ["realist", "criticalPoliticalEconomy"],
  ["institutionalist", "constructivist"],
  ["institutionalist", "criticalPoliticalEconomy"],
  ["constructivist", "criticalPoliticalEconomy"],
]

function canonicalPair(
  first: FamilyKey,
  second: FamilyKey,
): [FamilyKey, FamilyKey] {
  return TARGETED_PAIRS.find(
    (pair) =>
      pair.includes(first) &&
      pair.includes(second),
  ) ?? [first, second]
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
    const secondaryIndex =
      (primaryIndex + 1) % question.options.length
    answers[question.id] = {
      primary: question.options[primaryIndex].id,
      secondary: question.options[secondaryIndex].id,
    }
  }

  return answers
}

function makeRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 0x100000000
  }
}
