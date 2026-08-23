import { MODULE_SLUGS } from "@/lib/modules/types"
import type {
  ModuleAnalytics,
  ModuleAxisKey,
  ModuleClassificationContext,
  ModuleSlug,
} from "@/lib/modules/types"
import { MODULE_CALIBRATIONS } from "@/lib/modules/calibration-data"
import { SECURITY_V22_CALIBRATION } from "@/lib/modules/calibration-data-v22"
import { SECURITY_V4_CALIBRATION } from "@/lib/modules/calibration-data-v4"
import type { QuizMode } from "@/lib/types"

export const MODULE_CALIBRATION_VERSION =
  "v23.4-security-bank5-technology-bank3-scorer2-uniform-primary-2026-08-21"

export const MODULE_CALIBRATION_SOURCE = {
  method: "seeded independent-uniform primary option responses",
  securityMethod:
    "scored primary-only option responses; actor-lens cards are not drawn and cannot advance the calibration RNG",
  respondentCount: 500,
  seed: 20260728,
  instrumentSeeds: {
    security: 20261728,
    technology: 20261729,
  },
  modes: ["standard", "analyst"],
  bankVersions: {
    security: 5,
    technology: 3,
  },
  scoringVersions: {
    security: 2,
    technology: 2,
  },
  generatedOn: "2026-08-19",
  percentileMethod: "linear interpolation at rank (N - 1) × p",
} as const

export const SECURITY_V22_CALIBRATION_VERSION =
  "v22-module-bank3-scorer2-uniform-primary-2026-08-05"

export const SECURITY_V22_CALIBRATION_SOURCE = {
  method: "seeded independent-uniform primary option responses",
  respondentCount: 500,
  seed: 20260728,
  instrumentSeed: 20261728,
  modes: ["standard", "analyst"],
  bankVersion: 3,
  scoringVersion: 2,
  generatedOn: "2026-08-05",
  percentileMethod: "linear interpolation at rank (N - 1) × p",
} as const

export type ModuleCalibrationVersion = {
  bankVersion: number
  scoringVersion: number
}

export const CURRENT_MODULE_CALIBRATION_VERSIONS = {
  security: {
    bankVersion: MODULE_CALIBRATION_SOURCE.bankVersions.security,
    scoringVersion: MODULE_CALIBRATION_SOURCE.scoringVersions.security,
  },
  technology: {
    bankVersion: MODULE_CALIBRATION_SOURCE.bankVersions.technology,
    scoringVersion: MODULE_CALIBRATION_SOURCE.scoringVersions.technology,
  },
} as const satisfies Record<ModuleSlug, ModuleCalibrationVersion>

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
  version: ModuleCalibrationVersion =
    CURRENT_MODULE_CALIBRATION_VERSIONS[slug],
): ModuleAxisCalibration {
  const modeCalibration = getModuleModeCalibration(slug, mode, version)
  const calibration =
    context.kind === "headline"
      ? modeCalibration.headline[axis]
      : modeCalibration.lanes[context.laneKey]?.[axis]

  if (!calibration) {
    const contextLabel =
      context.kind === "headline" ? "headline" : `lane:${context.laneKey}`
    throw new Error(
      `Missing module calibration for ${slug}.bank${version.bankVersion}.` +
        `scorer${version.scoringVersion}.${mode}.${contextLabel}.${axis}.`,
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
  version: ModuleCalibrationVersion =
    CURRENT_MODULE_CALIBRATION_VERSIONS[slug],
): StandardizedModuleAxis {
  const calibration = getModuleAxisCalibration(
    slug,
    mode,
    context,
    axis,
    version,
  )
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
  bankVersion: number
  scoringVersion: number
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

  for (const slug of MODULE_SLUGS) {
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
  const version = CURRENT_MODULE_CALIBRATION_VERSIONS[slug]
  const calibration = getModuleAxisCalibration(
    slug,
    mode,
    context,
    axis,
    version,
  )
  for (const tail of ["lower", "upper"] as const) {
    target.push({
      slug,
      bankVersion: version.bankVersion,
      scoringVersion: version.scoringVersion,
      mode,
      context,
      axis,
      tail,
      raw: calibration.cuts[tail].raw,
      attainable: calibration.attainable,
    })
  }
}

function getModuleModeCalibration(
  slug: ModuleSlug,
  mode: QuizMode,
  version: ModuleCalibrationVersion,
): ModuleModeCalibration {
  if (
    slug === "security" &&
    version.bankVersion === 3 &&
    version.scoringVersion === 2
  ) {
    return SECURITY_V22_CALIBRATION[mode]
  }

  if (
    slug === "security" &&
    version.bankVersion === 4 &&
    version.scoringVersion === 2
  ) {
    return SECURITY_V4_CALIBRATION[mode]
  }

  const currentVersion = CURRENT_MODULE_CALIBRATION_VERSIONS[slug]
  if (
    version.bankVersion !== currentVersion.bankVersion ||
    version.scoringVersion !== currentVersion.scoringVersion
  ) {
    throw new Error(
      `Unsupported module calibration tuple for ${slug}: ` +
        `bank ${version.bankVersion}, scorer ${version.scoringVersion}.`,
    )
  }

  return MODULE_CALIBRATIONS[slug][mode]
}
