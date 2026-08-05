import type {
  ModuleAnalytics,
  ModuleAxisKey,
  ModuleClassificationContext,
  ModuleSlug,
} from "@/lib/modules/types"
import { MODULE_CALIBRATIONS } from "@/lib/modules/calibration-data"
import type { QuizMode } from "@/lib/types"

export const MODULE_CALIBRATION_VERSION =
  "v22-module-bank3-scorer2-uniform-primary-2026-08-05"

export const MODULE_CALIBRATION_SOURCE = {
  method: "seeded independent-uniform primary option responses",
  respondentCount: 500,
  seed: 20260728,
  instrumentSeeds: {
    security: 20261728,
    technology: 20261729,
  },
  modes: ["standard", "analyst"],
  bankVersion: 3,
  scoringVersion: 2,
  generatedOn: "2026-08-05",
  percentileMethod: "linear interpolation at rank (N - 1) × p",
} as const

export type ModuleCalibrationContext =
  | { kind: "headline" }
  | { kind: "lane"; laneKey: string }

export type ModuleAxisCalibration = {
  mean: number
  sd: number
  attainable: {
    minimum: number
    maximum: number
  }
  cuts: {
    lower: {
      percentile: 0.33
      raw: number
    }
    upper: {
      percentile: 0.67
      raw: number
    }
  }
}

export type ModuleModeCalibration = {
  headline: Partial<Record<ModuleAxisKey, ModuleAxisCalibration>>
  lanes: Record<
    string,
    Partial<Record<ModuleAxisKey, ModuleAxisCalibration>>
  >
}

export const MODULE_CLASSIFICATION_AXES = {
  security: {
    headline: ["activism", "escalation", "alliance", "legitimacy"],
    lanes: {
      deterrence: ["activism", "escalation"],
      alliances: ["alliance"],
      legitimacy: ["legitimacy"],
    },
  },
  technology: {
    headline: ["control", "governance", "industrial", "safety"],
    lanes: {
      controls: ["control"],
      capacity: ["industrial"],
      governance: ["governance", "safety"],
    },
  },
} as const satisfies Record<
  ModuleSlug,
  {
    headline: readonly ModuleAxisKey[]
    lanes: Record<string, readonly ModuleAxisKey[]>
  }
>

const MIN_CALIBRATION_SD = 1e-9

export function getModuleClassificationMode(
  analytics: ModuleAnalytics,
  context?: ModuleClassificationContext,
): QuizMode {
  // Direct editorial tests historically called the callbacks without runtime
  // context. Production V22 paths provide mode through both channels.
  return context?.mode ?? analytics.mode ?? "standard"
}

export function getModuleAxisCalibration(
  slug: ModuleSlug,
  mode: QuizMode,
  context: ModuleCalibrationContext,
  axis: ModuleAxisKey,
): ModuleAxisCalibration {
  const modeCalibration: ModuleModeCalibration =
    MODULE_CALIBRATIONS[slug][mode]
  const calibration =
    context.kind === "headline"
      ? modeCalibration.headline[axis]
      : modeCalibration.lanes[context.laneKey]?.[axis]

  if (!calibration) {
    const contextLabel =
      context.kind === "headline" ? "headline" : `lane:${context.laneKey}`
    throw new Error(
      `Missing module calibration for ${slug}.${mode}.${contextLabel}.${axis}.`,
    )
  }

  return calibration
}

export type StandardizedModuleAxis = {
  raw: number
  value: number
  lower: number
  upper: number
}

export function standardizeModuleAxis(
  slug: ModuleSlug,
  mode: QuizMode,
  context: ModuleCalibrationContext,
  axis: ModuleAxisKey,
  raw: number,
): StandardizedModuleAxis {
  const calibration = getModuleAxisCalibration(slug, mode, context, axis)
  if (Math.abs(calibration.sd) < MIN_CALIBRATION_SD) {
    throw new Error(
      `Module calibration SD is too small for ${slug}.${mode}.${axis}.`,
    )
  }

  const standardize = (value: number) =>
    (value - calibration.mean) / calibration.sd

  return {
    raw,
    value: standardize(raw),
    lower: standardize(calibration.cuts.lower.raw),
    upper: standardize(calibration.cuts.upper.raw),
  }
}

export type ModuleCalibrationCut = {
  slug: ModuleSlug
  mode: QuizMode
  context: ModuleCalibrationContext
  axis: ModuleAxisKey
  tail: "lower" | "upper"
  raw: number
  attainable: {
    minimum: number
    maximum: number
  }
}

export function enumerateModuleCalibrationCuts(): ModuleCalibrationCut[] {
  const cuts: ModuleCalibrationCut[] = []

  for (const slug of ["security", "technology"] as const) {
    for (const mode of ["standard", "analyst"] as const) {
      for (const axis of MODULE_CLASSIFICATION_AXES[slug].headline) {
        appendCalibrationCuts(cuts, slug, mode, { kind: "headline" }, axis)
      }
      for (const [laneKey, axes] of Object.entries(
        MODULE_CLASSIFICATION_AXES[slug].lanes,
      )) {
        for (const axis of axes) {
          appendCalibrationCuts(
            cuts,
            slug,
            mode,
            { kind: "lane", laneKey },
            axis,
          )
        }
      }
    }
  }

  return cuts
}

function appendCalibrationCuts(
  target: ModuleCalibrationCut[],
  slug: ModuleSlug,
  mode: QuizMode,
  context: ModuleCalibrationContext,
  axis: ModuleAxisKey,
) {
  const calibration = getModuleAxisCalibration(slug, mode, context, axis)
  for (const tail of ["lower", "upper"] as const) {
    target.push({
      slug,
      mode,
      context,
      axis,
      tail,
      raw: calibration.cuts[tail].raw,
      attainable: calibration.attainable,
    })
  }
}
