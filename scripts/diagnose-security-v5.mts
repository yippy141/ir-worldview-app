#!/usr/bin/env node

import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { SECURITY_V4_DIAGNOSTIC_RESPONDENTS, SECURITY_V4_DIAGNOSTIC_SEED, buildCalibrationRows, deriveAttainableRanges, proveActorLensExclusion, sampleAnalystSecondarySensitivity, sampleDistribution } from "@/scripts/diagnose-security-v4.mts"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { SECURITY_V5_CALIBRATION_SHA256, buildSecurityV5ValidationReport } from "@/scripts/validate-security-v5.mts"
import {
  SECURITY_V4_TUPLE,
  SECURITY_V5_TUPLE,
  getModuleVersion,
} from "@/lib/modules/versions"
import type { QuizMode } from "@/lib/types"

const MODES = ["standard", "analyst"] as const

export const SECURITY_V5_DIAGNOSTIC_VERSION = 1

export async function buildSecurityV5DiagnosticReport(
  projectRoot = process.cwd(),
) {
  const validation = await buildSecurityV5ValidationReport(projectRoot)
  const v5 = getModuleVersion(
    "security",
    SECURITY_V5_TUPLE.bankVersion,
    SECURITY_V5_TUPLE.scoringVersion,
  )
  const v4 = getModuleVersion(
    "security",
    SECURITY_V4_TUPLE.bankVersion,
    SECURITY_V4_TUPLE.scoringVersion,
  )
  if (!v5 || !v4) {
    throw new Error("Security v4 and v5 tuples must both be registered.")
  }

  const calibration = buildCalibrationRows(SECURITY_V5_TUPLE)
  const attainableRanges = Object.fromEntries(
    MODES.map((mode) => [
      mode,
      deriveAttainableRanges(
        v5.runtime.getModuleQuestions(v5.definition, mode),
      ),
    ]),
  )
  const primaryOnly = Object.fromEntries(
    MODES.map((mode) => [mode, sampleDistribution(v5, mode, false)]),
  )
  const analystSecondarySensitivity = sampleAnalystSecondarySensitivity(v5)
  const actorLensExclusion = Object.fromEntries(
    MODES.map((mode) => [mode, proveActorLensExclusion(v5, mode)]),
  ) as Record<QuizMode, ReturnType<typeof proveActorLensExclusion>>

  return {
    diagnosticVersion: SECURITY_V5_DIAGNOSTIC_VERSION,
    deterministicMethod: {
      seed: SECURITY_V4_DIAGNOSTIC_SEED,
      respondentCount: SECURITY_V4_DIAGNOSTIC_RESPONDENTS,
      randomization: "respondent-question-keyed-fnv1a-lcg" as const,
      actorLensRngIsolation: true as const,
      timestamps: "omitted" as const,
      network: "not-used" as const,
      writes: "none" as const,
    },
    versions: {
      v5: {
        bankVersion: SECURITY_V5_TUPLE.bankVersion,
        scoringVersion: SECURITY_V5_TUPLE.scoringVersion,
        runtimeVersion: v5.runtime.MODULE_SCORING_VERSION,
        rawBankSha256: validation.bankSha256,
        balanceLedgerSha256: validation.ledgerSha256,
        calibrationSha256: SECURITY_V5_CALIBRATION_SHA256,
      },
      frozenV4: {
        bankVersion: SECURITY_V4_TUPLE.bankVersion,
        scoringVersion: SECURITY_V4_TUPLE.scoringVersion,
        runtimeVersion: v4.runtime.MODULE_SCORING_VERSION,
      },
    },
    validation,
    calibration,
    attainableRanges,
    primaryOnly,
    analystSecondarySensitivity,
    actorLensExclusion,
  }
}

async function run() {
  const report = await buildSecurityV5DiagnosticReport()
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
}

const entryPoint = process.argv[1]
if (
  entryPoint &&
  pathToFileURL(resolve(entryPoint)).href === import.meta.url
) {
  run().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
