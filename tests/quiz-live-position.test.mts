import test from "node:test"
import assert from "node:assert/strict"
import { getFoundationQuestions } from "@/lib/quiz-schema"
import {
  MIN_ANSWERS_FOR_LIVE_POSITION,
  X_AXIS_DIMENSIONS,
  Y_AXIS_DIMENSIONS,
  canPlaceLivePosition,
  describeMapPosition,
  toMapPosition,
} from "@/lib/results/position"
import { computeCoreDimensionAudit } from "@/lib/scoring"
import { FAMILY_LABELS } from "@/lib/worldview-config"
import type { Answers, DimensionKey } from "@/lib/types"

const standardQuestions = getFoundationQuestions("standard")

/** Answers for the first `count` Standard questions, in the order asked. */
function answerFirst(count: number): Answers {
  return Object.fromEntries(
    standardQuestions.slice(0, count).map((question) => [
      question.id,
      question.kind === "likert" ? 6 : question.options[0].id,
    ]),
  )
}

function auditFor(answers: Answers) {
  const { roundedAverages, weights } = computeCoreDimensionAudit(answers, "standard")
  return {
    position: toMapPosition(roundedAverages),
    weights: weights as Record<DimensionKey, number>,
    answeredCount: Object.keys(answers).length,
  }
}

test("the live map withholds a point until enough answers exist to place one", () => {
  for (let count = 0; count < MIN_ANSWERS_FOR_LIVE_POSITION; count += 1) {
    const { weights, answeredCount } = auditFor(answerFirst(count))

    assert.equal(
      canPlaceLivePosition({ answeredCount, dimensionWeights: weights }),
      false,
      `Expected no plotted point after ${count} answers.`,
    )
  }
})

test("the live map places a point once both axes carry evidence", () => {
  const { weights, answeredCount } = auditFor(answerFirst(MIN_ANSWERS_FOR_LIVE_POSITION))

  assert.equal(canPlaceLivePosition({ answeredCount, dimensionWeights: weights }), true)
  assert.ok(X_AXIS_DIMENSIONS.some((key) => weights[key] > 0))
  assert.ok(Y_AXIS_DIMENSIONS.some((key) => weights[key] > 0))
})

test("answer volume alone does not place a point when one axis has no evidence", () => {
  // Every answered item feeds the horizontal axis only.
  const horizontalOnly: Answers = Object.fromEntries(
    standardQuestions
      .filter(
        (question) =>
          question.kind === "likert" &&
          question.scoringBlock === "core" &&
          X_AXIS_DIMENSIONS.includes(question.dimension) &&
          !Y_AXIS_DIMENSIONS.includes(question.dimension),
      )
      .map((question) => [question.id, 6]),
  )
  const { weights, answeredCount } = auditFor(horizontalOnly)

  assert.ok(answeredCount >= MIN_ANSWERS_FOR_LIVE_POSITION - 1)
  assert.ok(Y_AXIS_DIMENSIONS.every((key) => weights[key] === 0))
  assert.equal(canPlaceLivePosition({ answeredCount, dimensionWeights: weights }), false)
})

test("a partial profile projects through the same function as the result page", () => {
  const answers = answerFirst(standardQuestions.length)
  const { roundedAverages } = computeCoreDimensionAudit(answers, "standard")

  assert.deepEqual(toMapPosition(roundedAverages), auditFor(answers).position)
})

test("the position readout names axes and poles, never a worldview family", () => {
  const familyNames = Object.values(FAMILY_LABELS)

  for (const count of [4, 8, 12, standardQuestions.length]) {
    const { position } = auditFor(answerFirst(count))
    const readings = describeMapPosition(position)

    assert.equal(readings.length, 2, "Expected one reading per axis.")

    for (const reading of readings) {
      assert.ok(reading.name.length > 0)
      assert.ok(reading.reading.length > 0)

      const text = `${reading.name} ${reading.reading}`
      for (const family of familyNames) {
        assert.ok(
          !text.includes(family),
          `Live position copy must not name ${family}: ${text}`,
        )
      }
    }
  }
})

test("a centered profile reads as centered instead of leaning", () => {
  const [horizontal, vertical] = describeMapPosition({ x: 0, y: 0 })

  assert.equal(horizontal.reading, "Near the center")
  assert.equal(vertical.reading, "Near the center")
  assert.notEqual(horizontal.name, vertical.name)
})

test("readout wording firms up as the position moves away from the centre", () => {
  const wordings = [0.2, 0.5, 0.9].map(
    (x) => describeMapPosition({ x, y: 0 })[0].reading,
  )

  assert.equal(new Set(wordings).size, 3, "Expected distinct wording per band.")
  assert.match(wordings[0], /^Slightly toward/)
  assert.match(wordings[1], /^Toward/)
  assert.match(wordings[2], /^Clearly toward/)
})
