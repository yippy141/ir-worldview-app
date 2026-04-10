import test from "node:test"
import assert from "node:assert/strict"
import {
  buildModuleResult,
  decodeModulePayload,
  encodeModulePayload,
  getModuleQuestions,
  modules,
  scoreModule,
  SECOND_CHOICE_WEIGHT,
} from "@/lib/modules/framework"
import type { ModuleAnswers, ModulePayload } from "@/lib/modules/types"

function answersFor(moduleDefinition: (typeof modules)[number]) {
  return Object.fromEntries(
    getModuleQuestions(moduleDefinition, "standard").map((question) => [
      question.id,
      { primary: question.options[0].id },
    ]),
  )
}

test("module payloads roundtrip through URL-safe base64 encoding", () => {
  const payloads: ModulePayload[] = modules.map((moduleDefinition) => ({
    v: 2,
    slug: moduleDefinition.slug,
    mode: "standard",
    answers: answersFor(moduleDefinition),
  }))

  for (const payload of payloads) {
    const encoded = encodeModulePayload(payload)
    assert.ok(!encoded.includes("="), "module payload should strip padding")
    assert.deepStrictEqual(decodeModulePayload(encoded), payload)
  }
})

test("each flagship module produces a stable result shape", () => {
  for (const moduleDefinition of modules) {
    const result = buildModuleResult(moduleDefinition, "standard", answersFor(moduleDefinition))

    assert.ok(result.headline.length > 0)
    assert.ok(result.summary.length > 0)
    assert.ok(result.instincts.length >= 2)
    assert.equal(result.laneSummaries.length, moduleDefinition.lanes.length)
    assert.ok(Object.keys(result.cardTypeScores).length >= 2)

    for (const axis of moduleDefinition.axes) {
      assert.ok(result.scores[axis.key] >= 1 && result.scores[axis.key] <= 7)
    }
  }
})

test("analyst second choice contributes at reduced weight", () => {
  const moduleDefinition = modules.find((module) => module.slug === "security")
  assert.ok(moduleDefinition, "expected security module to exist")

  const analystQuestions = getModuleQuestions(moduleDefinition, "analyst")
  const targetQuestion = analystQuestions.find((question) => question.id === "sanctions_enforcement")
  assert.ok(targetQuestion, "expected analyst-only sanctions question to exist")

  const answers: ModuleAnswers = {
    sanctions_enforcement: {
      primary: targetQuestion.options[0].id,
      secondary: targetQuestion.options[1].id,
    },
  }

  const scores = scoreModule(moduleDefinition, "analyst", answers)
  const expectedAlliance =
    (
      targetQuestion.options[0].signals.alliance +
      targetQuestion.options[1].signals.alliance * SECOND_CHOICE_WEIGHT
    ) /
    (1 + SECOND_CHOICE_WEIGHT)

  assert.equal(scores.alliance, Number(expectedAlliance.toFixed(2)))
})
