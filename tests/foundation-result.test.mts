import test from "node:test"
import assert from "node:assert/strict"
import { getFoundationQuestions } from "@/lib/quiz-schema"
import { buildFoundationNarrative } from "@/lib/narrative/foundation"
import { buildFoundationPayoff } from "@/lib/results/foundation-payoff"
import {
  familyProfiles,
  generateResult,
  getNeighboringFamilyKey,
} from "@/lib/scoring"
import { dimensionScoresToArray, encodePayload, resolveFoundationPayload } from "@/lib/share"
import type { Answers, FamilyKey, Question } from "@/lib/types"

const standardQuestions = getFoundationQuestions("standard")

const lowDifferentiationChoices = {
  tradeoff_alliances: "rules",
  tradeoff_interdependence: "rivalry",
  tradeoff_strategy: "limit",
  tradeoff_intervention: "precedent",
  case_semiconductors: "edge",
  case_protection: "moral",
} as const satisfies Record<string, string>

const mixedChoices = {
  tradeoff_alliances: "domestic",
  tradeoff_interdependence: "rules",
  tradeoff_strategy: "press",
  tradeoff_intervention: "mandate",
  case_semiconductors: "edge",
  case_protection: "bounded",
} as const satisfies Record<string, string>

test("distinct foundation fixtures stay distinct through payload reconstruction", () => {
  const fixtures = [
    {
      name: "hard realist",
      answers: buildAlignedAnswers("realist"),
      expectedFamily: "realist",
      expectedState: "sharplyDifferentiated",
    },
    {
      name: "hard institutionalist",
      answers: buildAlignedAnswers("institutionalist"),
      expectedFamily: "institutionalist",
      expectedState: "sharplyDifferentiated",
    },
    {
      name: "legitimacy-forward constructivist",
      answers: buildAlignedAnswers("constructivist"),
      expectedFamily: "constructivist",
      expectedState: "sharplyDifferentiated",
    },
    {
      name: "critical-systemic CPE",
      answers: buildAlignedAnswers("criticalPoliticalEconomy"),
      expectedFamily: "criticalPoliticalEconomy",
      expectedState: "sharplyDifferentiated",
    },
    {
      name: "broad-spectrum moderate",
      answers: buildLowDifferentiationAnswers(),
      expectedState: "lowDifferentiation",
    },
    {
      name: "cross-pressured mixed",
      answers: buildMixedAnswers(),
      expectedState: "stableModeration",
    },
  ] as const

  const summaries = new Set<string>()
  const dimensions = new Set<string>()

  for (const fixture of fixtures) {
    const generated = generateResult(fixture.answers, "standard")
    const payload = encodePayload({
      v: 2,
      ds: dimensionScoresToArray(generated.dimensionScores),
      fk: generated.familyKey,
      nk: getNeighboringFamilyKey(generated.familyKey, generated.familyScores),
      sm: generated.strategyModifier,
      nm: generated.normativeModifier,
    })
    const resolved = resolveFoundationPayload(payload)

    assert.ok(resolved, `Expected ${fixture.name} payload to resolve.`)
    assert.deepEqual(resolved.dimensionScores, generated.dimensionScores)
    assert.equal(resolved.result.familyKey, generated.familyKey)
    assert.equal(resolved.result.runnerUpKey, generated.runnerUpKey)
    assert.equal(resolved.result.strategyModifier, generated.strategyModifier)
    assert.equal(resolved.result.normativeModifier, generated.normativeModifier)

    const narrative = buildFoundationNarrative({
      familyKey: resolved.result.familyKey,
      runnerUpKey: resolved.result.runnerUpKey,
      strategyModifier: resolved.result.strategyModifier,
      normativeModifier: resolved.result.normativeModifier,
      dimensionScores: resolved.dimensionScores,
    })

    if ("expectedFamily" in fixture) {
      assert.equal(resolved.result.familyKey, fixture.expectedFamily)
    }

    assert.equal(
      narrative.state,
      fixture.expectedState,
      `Expected ${fixture.name} to resolve as ${fixture.expectedState}.`,
    )

    summaries.add(narrative.summary)
    dimensions.add(JSON.stringify(resolved.dimensionScores))
  }

  assert.equal(
    summaries.size,
    fixtures.length,
    "Expected each fixture to produce a distinct top-of-page summary.",
  )
  assert.equal(
    dimensions.size,
    fixtures.length,
    "Expected each fixture to preserve a distinct dimension profile.",
  )
})

test("canonical foundation reconstruction ignores stale payload labels and uses the encoded scores", () => {
  const generated = generateResult(buildAlignedAnswers("realist"), "standard")
  const tamperedPayload = encodePayload({
    v: 2,
    ds: dimensionScoresToArray(generated.dimensionScores),
    fk: "constructivist",
    nk: "institutionalist",
    sm: "Restrainer",
    nm: "Pluralist",
  })

  const resolved = resolveFoundationPayload(tamperedPayload)
  assert.ok(resolved)
  assert.equal(resolved.result.familyKey, generated.familyKey)
  assert.equal(resolved.result.runnerUpKey, generated.runnerUpKey)
  assert.equal(resolved.result.strategyModifier, generated.strategyModifier)
  assert.equal(resolved.result.normativeModifier, generated.normativeModifier)
})

test("foundation payoff derives from decoded share-link result data", () => {
  const realistPayoff = buildShareSafePayoff(buildAlignedAnswers("realist"))
  const institutionalistPayoff = buildShareSafePayoff(buildAlignedAnswers("institutionalist"))
  const broadPayoff = buildShareSafePayoff(buildLowDifferentiationAnswers())

  for (const payoff of [realistPayoff, institutionalistPayoff, broadPayoff]) {
    assert.equal(payoff.liveDebates.length, 4)
    assert.ok(payoff.corePattern.noticeFirst.length > 0)
    assert.ok(payoff.corePattern.distrust.length > 0)
    assert.ok(payoff.corePattern.underweight.length > 0)
    assert.ok(payoff.mainTension.title.length > 0)
    assert.ok(payoff.mainTension.body.length > 0)
    assert.ok(payoff.mainTension.rivalArgument.length > 0)
    assert.ok(payoff.nextStep.href.startsWith("/"))
  }

  assert.notEqual(realistPayoff.corePattern.noticeFirst, institutionalistPayoff.corePattern.noticeFirst)
  assert.equal(broadPayoff.mainTension.title, "A broad map, not a hard center")
  assert.equal(broadPayoff.nextStep.href, "/explore/atlas")
})

function buildAlignedAnswers(family: FamilyKey): Answers {
  return Object.fromEntries(
    standardQuestions.map((question) => [question.id, chooseForFamily(question, family)]),
  )
}

function buildShareSafePayoff(answers: Answers) {
  const generated = generateResult(answers, "standard")
  const payload = encodePayload({
    v: 2,
    ds: dimensionScoresToArray(generated.dimensionScores),
    fk: generated.familyKey,
    nk: getNeighboringFamilyKey(generated.familyKey, generated.familyScores),
    sm: generated.strategyModifier,
    nm: generated.normativeModifier,
  })
  const resolved = resolveFoundationPayload(payload)

  assert.ok(resolved)

  return buildFoundationPayoff({
    dimensionScores: resolved.dimensionScores,
    familyKey: resolved.result.familyKey,
    familyLabel: resolved.result.familyLabel,
    runnerUpKey: resolved.result.runnerUpKey,
    runnerUpLabel: resolved.result.runnerUpLabel,
    strategyModifier: resolved.result.strategyModifier,
    normativeModifier: resolved.result.normativeModifier,
  })
}

function buildLowDifferentiationAnswers(): Answers {
  return Object.fromEntries(
    standardQuestions.map((question) => {
      if (question.kind === "likert") {
        return [question.id, 4]
      }

      return [question.id, lowDifferentiationChoices[question.id as keyof typeof lowDifferentiationChoices]]
    }),
  )
}

function buildMixedAnswers(): Answers {
  return Object.fromEntries(
    standardQuestions.map((question) => {
      if (question.kind === "likert") {
        return [question.id, 4]
      }

      return [question.id, mixedChoices[question.id as keyof typeof mixedChoices]]
    }),
  )
}

function chooseForFamily(question: Question, family: FamilyKey) {
  if (question.kind === "likert") {
    const weight = familyProfiles[family][question.dimension] ?? 0

    if (weight >= 0.3) return 7
    if (weight <= -0.3) return 1
    return 4
  }

  let bestOption = question.options[0]
  let bestScore = -Infinity

  for (const option of question.options) {
    const score = Object.entries(option.signals).reduce((sum, [dimension, value]) => {
      const weight = familyProfiles[family][dimension as keyof typeof familyProfiles[typeof family]] ?? 0
      return sum + (value - 4) * weight
    }, 0)

    if (score > bestScore) {
      bestScore = score
      bestOption = option
    }
  }

  return bestOption.id
}
