import assert from "node:assert/strict"
import test from "node:test"
import { evaluateDeclaredAxis } from "@/lib/instrument/measurement-gates"
import {
  enumerateModuleCalibrationCuts,
  getModuleAxisCalibration,
  MODULE_CALIBRATION_SOURCE,
  MODULE_CLASSIFICATION_AXES,
} from "@/lib/modules/calibration"
import { modules } from "@/lib/modules/framework"
import {
  buildModuleAnalytics,
  buildModuleResult,
  getModuleQuestions,
} from "@/lib/modules/runtime-v2"
import type {
  ModuleAnswers,
  ModuleAxisKey,
  ModuleDefinition,
} from "@/lib/modules/types"
import type { QuizMode } from "@/lib/types"

const MODES: QuizMode[] = ["standard", "analyst"]

test("every calibrated cut is finite, ordered, and inside the live attainable range", () => {
  for (const cut of enumerateModuleCalibrationCuts()) {
    const moduleDefinition = modules.find(
      (candidate) => candidate.slug === cut.slug,
    )
    assert.ok(moduleDefinition, `Missing module definition for ${cut.slug}.`)

    const questions = calibrationQuestions(
      moduleDefinition,
      cut.mode,
      cut.context,
    )
    const attainable = deriveAttainableRange(questions, cut.axis)
    assert.deepEqual(
      cut.attainable,
      attainable,
      `${cut.slug}.${cut.mode}.${contextLabel(cut.context)}.${cut.axis} attainable range drifted`,
    )
    assert.ok(
      Number.isFinite(cut.raw) &&
        cut.raw >= attainable.minimum &&
        cut.raw <= attainable.maximum,
      `${cut.slug}.${cut.mode}.${contextLabel(cut.context)}.${cut.axis}.${cut.tail} ` +
        `${cut.raw} must sit inside ${attainable.minimum}–${attainable.maximum}.`,
    )

    const calibration = getModuleAxisCalibration(
      cut.slug,
      cut.mode,
      cut.context,
      cut.axis,
    )
    assert.ok(Number.isFinite(calibration.mean))
    assert.ok(Number.isFinite(calibration.sd) && calibration.sd > 1e-9)
    assert.ok(calibration.cuts.lower.raw < calibration.cuts.upper.raw)
  }
})

test("the calibrated 500-response headline distribution meets the concentration gate", () => {
  for (const moduleDefinition of modules) {
    assert.ok(
      moduleDefinition.defaultHeadline,
      `${moduleDefinition.slug} must declare its default headline.`,
    )

    for (const mode of MODES) {
      const counts = sampleHeadlineCounts(moduleDefinition, mode)
      const defaultCount =
        counts[moduleDefinition.defaultHeadline as string] ?? 0
      const sampleSize = MODULE_CALIBRATION_SOURCE.respondentCount

      assert.ok(
        defaultCount / sampleSize < 0.4,
        `${moduleDefinition.slug}.${mode} default headline share was ` +
          `${((defaultCount / sampleSize) * 100).toFixed(1)}%.`,
      )
    }
  }
})

test("classification calibration leaves displayed module and lane scores raw", () => {
  for (const moduleDefinition of modules) {
    for (const mode of MODES) {
      const answers = buildFirstOptionAnswers(moduleDefinition, mode)
      const analytics = buildModuleAnalytics(moduleDefinition, mode, answers)
      const result = buildModuleResult(moduleDefinition, mode, answers)

      assert.equal(analytics.mode, mode)
      assert.deepEqual(result.scores, analytics.scores)
      for (const lane of moduleDefinition.lanes) {
        const summary = result.laneSummaries.find(
          (candidate) => candidate.key === lane.key,
        )
        assert.ok(summary, `Missing lane summary for ${lane.key}.`)
        assert.equal(
          summary.score,
          analytics.laneScores[lane.key][lane.scoreKey],
          `${moduleDefinition.slug}.${mode}.${lane.key} should render its raw score.`,
        )
      }
    }
  }
})

test("V22 module banks meet the non-negotiable coverage, centering, and saturation gates", () => {
  for (const moduleDefinition of modules) {
    for (const mode of MODES) {
      const questions = getModuleQuestions(moduleDefinition, mode)
      const scoredQuestions = questions.filter(
        (question) => question.cardType !== "actorLens",
      )

      for (const axis of moduleDefinition.axes) {
        const subject = `${moduleDefinition.slug}.${mode}.${axis.key}`
        const coverage = questions.filter(
          (question) =>
            question.discriminatingAxes.includes(axis.key) &&
            evaluateDeclaredAxis(
              question.options.map((option) => option.signals[axis.key] ?? 4),
              4,
              2,
            ).passes,
        ).length
        const attainable = deriveAttainableRange(scoredQuestions, axis.key)
        const distribution = deriveExactAxisDistribution(
          scoredQuestions,
          axis.key,
        )
        const attainableCenter =
          (attainable.minimum + attainable.maximum) / 2

        assert.ok(
          coverage >= 4,
          `${subject} has ${coverage} discriminating items; minimum 4.`,
        )
        assert.ok(
          Math.abs(distribution.mean - attainableCenter) <= 0.3 + 1e-9,
          `${subject} uniform mean ${distribution.mean.toFixed(3)} is more ` +
            `than 0.3 from attainable center ${attainableCenter.toFixed(3)}.`,
        )
        assert.ok(
          distribution.floorShare < 0.1,
          `${subject} floor saturation was ` +
            `${(distribution.floorShare * 100).toFixed(1)}%.`,
        )
        assert.ok(
          distribution.ceilingShare < 0.1,
          `${subject} ceiling saturation was ` +
            `${(distribution.ceilingShare * 100).toFixed(1)}%.`,
        )
      }
    }
  }
})

function sampleHeadlineCounts(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
) {
  const rng = makeRng(
    MODULE_CALIBRATION_SOURCE.instrumentSeeds[moduleDefinition.slug],
  )
  const questions = getModuleQuestions(moduleDefinition, mode)
  const counts: Record<string, number> = {}

  for (
    let respondent = 0;
    respondent < MODULE_CALIBRATION_SOURCE.respondentCount;
    respondent += 1
  ) {
    const answers: ModuleAnswers = {}
    for (const question of questions) {
      const option =
        question.options[Math.floor(rng() * question.options.length)]
      answers[question.id] = { primary: option.id }
    }
    const headline = buildModuleResult(
      moduleDefinition,
      mode,
      answers,
    ).headline
    counts[headline] = (counts[headline] ?? 0) + 1
  }

  return counts
}

function buildFirstOptionAnswers(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
): ModuleAnswers {
  return Object.fromEntries(
    getModuleQuestions(moduleDefinition, mode).map((question) => [
      question.id,
      { primary: question.options[0].id },
    ]),
  )
}

function calibrationQuestions(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
  context:
    | { kind: "headline" }
    | { kind: "lane"; laneKey: string },
) {
  const scoredQuestions = getModuleQuestions(moduleDefinition, mode).filter(
    (question) => question.cardType !== "actorLens",
  )
  return context.kind === "headline"
    ? scoredQuestions
    : scoredQuestions.filter((question) => question.lane === context.laneKey)
}

function deriveAttainableRange(
  questions: ReturnType<typeof getModuleQuestions>,
  axis: ModuleAxisKey,
) {
  const minima = questions.map((question) =>
    Math.min(...question.options.map((option) => readSignal(option, axis))),
  )
  const maxima = questions.map((question) =>
    Math.max(...question.options.map((option) => readSignal(option, axis))),
  )

  return {
    minimum: roundedMean(minima),
    maximum: roundedMean(maxima),
  }
}

function deriveExactAxisDistribution(
  questions: ReturnType<typeof getModuleQuestions>,
  axis: ModuleAxisKey,
) {
  let sumDistribution = new Map<number, number>([[0, 1]])

  for (const question of questions) {
    const next = new Map<number, number>()
    for (const [sum, probability] of sumDistribution) {
      for (const option of question.options) {
        const value = readSignal(option, axis)
        addProbability(
          next,
          sum + value,
          probability / question.options.length,
        )
      }
    }
    sumDistribution = next
  }

  const scoreDistribution = new Map<number, number>()
  for (const [sum, probability] of sumDistribution) {
    addProbability(
      scoreDistribution,
      questions.length === 0
        ? 4
        : Number((sum / questions.length).toFixed(2)),
      probability,
    )
  }

  return {
    mean: [...scoreDistribution].reduce(
      (total, [score, probability]) => total + score * probability,
      0,
    ),
    floorShare: scoreDistribution.get(1) ?? 0,
    ceilingShare: scoreDistribution.get(7) ?? 0,
  }
}

function addProbability(
  distribution: Map<number, number>,
  value: number,
  probability: number,
) {
  const key = Number(value.toFixed(10))
  distribution.set(key, (distribution.get(key) ?? 0) + probability)
}

function readSignal(
  option: ReturnType<typeof getModuleQuestions>[number]["options"][number],
  axis: ModuleAxisKey,
) {
  const value = option.signals[axis]
  assert.ok(
    typeof value === "number" && Number.isFinite(value),
    `Expected a finite dense signal for ${axis}.`,
  )
  return value
}

function roundedMean(values: number[]) {
  return Number(
    (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(
      2,
    ),
  )
}

function contextLabel(
  context:
    | { kind: "headline" }
    | { kind: "lane"; laneKey: string },
) {
  return context.kind === "headline" ? "headline" : `lane:${context.laneKey}`
}

function makeRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

test("all classification contexts have generated calibration axes", () => {
  for (const moduleDefinition of modules) {
    const contexts = MODULE_CLASSIFICATION_AXES[moduleDefinition.slug]
    assert.deepEqual(
      contexts.headline,
      moduleDefinition.axes.map((axis) => axis.key),
    )
    assert.deepEqual(
      Object.keys(contexts.lanes),
      moduleDefinition.lanes.map((lane) => lane.key),
    )
  }
})
