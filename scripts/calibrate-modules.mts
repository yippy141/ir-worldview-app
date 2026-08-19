import assert from "node:assert/strict"
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import {
  MODULE_CALIBRATION_SOURCE,
  MODULE_CLASSIFICATION_AXES,
  type ModuleAxisCalibration,
  type ModuleModeCalibration,
} from "@/lib/modules/calibration"
import { modules } from "@/lib/modules/framework"
import { getCurrentModuleVersion } from "@/lib/modules/versions"
import {
  buildModuleAnalytics,
  getModuleQuestions,
} from "@/lib/modules/runtime-v2"
import type {
  ModuleAnswers,
  ModuleAxisKey,
  ModuleDefinition,
  ModuleSlug,
} from "@/lib/modules/types"
import type { QuizMode } from "@/lib/types"

const DATA_PATH = fileURLToPath(
  new URL("../lib/modules/calibration-data.ts", import.meta.url),
)
const WRITE = process.argv.includes("--write")
const CHECK = process.argv.includes("--check")

if (WRITE === CHECK) {
  throw new Error("Pass exactly one of --write or --check.")
}

const generated = generateModuleCalibrations()
const rendered = renderCalibrationData(generated)

if (CHECK) {
  assert.equal(
    readFileSync(DATA_PATH, "utf8"),
    rendered,
    "Module calibration data has drifted. Run `npm run calibrate:modules -- --write`.",
  )
  console.log("Module calibration data is current.")
} else {
  writeFileSync(DATA_PATH, rendered)
  console.log(`Wrote ${DATA_PATH}`)
}

type GeneratedCalibrations = Record<
  ModuleSlug,
  Record<QuizMode, ModuleModeCalibration>
>

function generateModuleCalibrations(): GeneratedCalibrations {
  return Object.fromEntries(
    modules.map((moduleDefinition) => {
      const currentVersion = getCurrentModuleVersion(moduleDefinition.slug)
      assert.equal(
        currentVersion.bankVersion,
        MODULE_CALIBRATION_SOURCE.bankVersions[moduleDefinition.slug],
        `${moduleDefinition.slug} calibration bank version is stale.`,
      )
      assert.equal(
        currentVersion.scoringVersion,
        MODULE_CALIBRATION_SOURCE.scoringVersions[moduleDefinition.slug],
        `${moduleDefinition.slug} calibration scoring version is stale.`,
      )

      return [
        moduleDefinition.slug,
        Object.fromEntries(
          MODULE_CALIBRATION_SOURCE.modes.map((mode) => [
            mode,
            generateModeCalibration(moduleDefinition, mode),
          ]),
        ),
      ]
    }),
  ) as GeneratedCalibrations
}

function generateModeCalibration(
  moduleDefinition: ModuleDefinition,
  mode: QuizMode,
): ModuleModeCalibration {
  const questions = getModuleQuestions(moduleDefinition, mode)
  const scoredQuestions = questions.filter(
    (question) => question.cardType !== "actorLens",
  )
  const sampledQuestions =
    moduleDefinition.slug === "security" ? scoredQuestions : questions
  const rng = makeRng(
    MODULE_CALIBRATION_SOURCE.instrumentSeeds[moduleDefinition.slug],
  )
  const analytics = Array.from(
    { length: MODULE_CALIBRATION_SOURCE.respondentCount },
    () => {
      const answers: ModuleAnswers = {}
      for (const question of sampledQuestions) {
        const option =
          question.options[Math.floor(rng() * question.options.length)]
        answers[question.id] = { primary: option.id }
      }
      return buildModuleAnalytics(moduleDefinition, mode, answers)
    },
  )
  const classificationAxes =
    MODULE_CLASSIFICATION_AXES[moduleDefinition.slug]
  const laneClassificationAxes: Record<
    string,
    readonly ModuleAxisKey[]
  > = classificationAxes.lanes

  const headline = Object.fromEntries(
    classificationAxes.headline.map((axis) => [
      axis,
      calibrateAxis(
        analytics.map((row) => row.scores[axis]),
        scoredQuestions,
        axis,
      ),
    ]),
  )

  const lanes = Object.fromEntries(
    Object.entries(laneClassificationAxes).map(([laneKey, axes]) => {
      const laneQuestions = scoredQuestions.filter(
        (question) => question.lane === laneKey,
      )
      return [
        laneKey,
        Object.fromEntries(
          axes.map((axis) => [
            axis,
            calibrateAxis(
              analytics.map((row) => row.laneScores[laneKey][axis]),
              laneQuestions,
              axis,
            ),
          ]),
        ),
      ]
    }),
  )

  return { headline, lanes }
}

function calibrateAxis(
  values: number[],
  questions: ReturnType<typeof getModuleQuestions>,
  axis: ModuleAxisKey,
): ModuleAxisCalibration {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const sd = Math.sqrt(
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
      values.length,
  )
  const minimumSignals = questions.map((question) =>
    Math.min(...question.options.map((option) => readSignal(option, axis))),
  )
  const maximumSignals = questions.map((question) =>
    Math.max(...question.options.map((option) => readSignal(option, axis))),
  )

  return {
    mean,
    sd,
    attainable: {
      minimum: roundedMean(minimumSignals),
      maximum: roundedMean(maximumSignals),
    },
    cuts: {
      lower: {
        percentile: 0.33,
        raw: percentile(values, 0.33),
      },
      upper: {
        percentile: 0.67,
        raw: percentile(values, 0.67),
      },
    },
  }
}

function readSignal(
  option: ReturnType<typeof getModuleQuestions>[number]["options"][number],
  axis: ModuleAxisKey,
) {
  const value = option.signals[axis]
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Expected a finite dense signal for axis ${axis}.`)
  }
  return value
}

function roundedMean(values: number[]) {
  if (values.length === 0) return 4
  return Number(
    (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(
      2,
    ),
  )
}

function percentile(values: number[], probability: number) {
  const sorted = [...values].sort((left, right) => left - right)
  const rank = (sorted.length - 1) * probability
  const lowerIndex = Math.floor(rank)
  const upperIndex = Math.ceil(rank)
  const lower = sorted[lowerIndex]
  const upper = sorted[upperIndex]
  return lower + (upper - lower) * (rank - lowerIndex)
}

function makeRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function renderCalibrationData(calibrations: GeneratedCalibrations) {
  return (
    'import type { ModuleModeCalibration } from "@/lib/modules/calibration"\n' +
    'import type { ModuleSlug } from "@/lib/modules/types"\n' +
    'import type { QuizMode } from "@/lib/types"\n\n' +
    `export const MODULE_CALIBRATIONS = ${JSON.stringify(
      calibrations,
      null,
      2,
    )} as const satisfies Record<\n` +
    "  ModuleSlug,\n" +
    "  Record<QuizMode, ModuleModeCalibration>\n" +
    ">\n"
  )
}
