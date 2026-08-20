#!/usr/bin/env node

/**
 * Deterministic, read-only diagnostics for Security bank v4.
 *
 * Choices are keyed independently by respondent and question ID. Unscored
 * actor-lens cards therefore cannot advance a shared RNG or perturb the finite
 * headline/calibration sample.
 */

import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import {
  getModuleAxisCalibration,
  MODULE_CLASSIFICATION_AXES,
} from "@/lib/modules/calibration"
import {
  getModuleVersion,
  SECURITY_V4_TUPLE,
  type ModuleVersionTuple,
} from "@/lib/modules/versions"
import type {
  ModuleAnswers,
  ModuleAxisKey,
  ModuleQuestion,
} from "@/lib/modules/types"
import type { QuizMode } from "@/lib/types"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { buildSecurityV4ValidationReport, type SecurityV4ValidationReport } from "@/scripts/validate-security-v4.mts"

export const SECURITY_V4_DIAGNOSTIC_VERSION = 1
export const SECURITY_V4_DIAGNOSTIC_SEED = 20260819
export const SECURITY_V4_DIAGNOSTIC_RESPONDENTS = 500
export const SECURITY_V3_BANK_SHA256 =
  "4ada4a5625952dcdce6113414e5796295625939d2ad18341d8451898a6b923ea"
export const SECURITY_V3_REPLAY_DIGEST =
  "85b5577ca5a809b709fa50e6522366eff5e1d35745d3620c29a8a342745a607a"

const MODES = ["standard", "analyst"] as const
const AXES = ["activism", "escalation", "alliance", "legitimacy"] as const

type SecurityAxis = (typeof AXES)[number]

type CalibrationRow = {
  mode: QuizMode
  context: "headline" | `lane:${string}`
  axis: ModuleAxisKey
  mean: number
  sd: number
  attainable: { minimum: number; maximum: number }
  cuts: {
    lower: { percentile: 0.33; raw: number }
    upper: { percentile: 0.67; raw: number }
  }
}

type DistributionReport = {
  respondentCount: number
  headlineCounts: Record<string, number>
  headlineShares: Record<string, number>
  sampledRanges: Record<SecurityAxis, { minimum: number; maximum: number }>
  meanScores: Record<SecurityAxis, number>
}

export type SecurityV4DiagnosticReport = {
  diagnosticVersion: 1
  deterministicMethod: {
    seed: number
    respondentCount: number
    randomization: "respondent-question-keyed-fnv1a-lcg"
    actorLensRngIsolation: true
    timestamps: "omitted"
    network: "not-used"
    writes: "none"
  }
  versions: {
    v4: {
      bankVersion: 4
      scoringVersion: 2
      runtimeVersion: number
      rawBankSha256: string
      balanceLedgerSha256: string
    }
    v3: {
      bankVersion: 3
      scoringVersion: 2
      runtimeVersion: number
      rawBankSha256: string
      deterministicReplayDigest: string
    }
  }
  validation: SecurityV4ValidationReport
  calibration: CalibrationRow[]
  attainableRanges: Record<
    QuizMode,
    Record<SecurityAxis, { minimum: number; maximum: number }>
  >
  primaryOnly: Record<QuizMode, DistributionReport>
  analystSecondarySensitivity: {
    primaryOnlyHeadlineCounts: Record<string, number>
    withSecondaryHeadlineCounts: Record<string, number>
    changedHeadlineCount: number
    meanAbsoluteScoreDelta: Record<SecurityAxis, number>
    maximumAbsoluteScoreDelta: Record<SecurityAxis, number>
  }
  actorLensExclusion: Record<
    QuizMode,
    {
      lensCount: number
      mainScoresEqual: boolean
      laneScoresEqual: boolean
      headlineEqual: boolean
      laneSummariesEqual: boolean
      actorLensAnalyticsChanged: boolean
    }
  >
}

export async function buildSecurityV4DiagnosticReport(
  projectRoot = process.cwd(),
): Promise<SecurityV4DiagnosticReport> {
  const validation = await buildSecurityV4ValidationReport(projectRoot)
  const v4 = getModuleVersion(
    "security",
    SECURITY_V4_TUPLE.bankVersion,
    SECURITY_V4_TUPLE.scoringVersion,
  )
  const v3 = getModuleVersion("security", 3, 2)
  if (!v4 || !v3) throw new Error("Security v3/v4 tuples must both be registered.")

  const calibration = buildCalibrationRows(SECURITY_V4_TUPLE)
  const attainableRanges = Object.fromEntries(
    MODES.map((mode) => [
      mode,
      deriveAttainableRanges(
        v4.runtime.getModuleQuestions(v4.definition, mode),
      ),
    ]),
  ) as SecurityV4DiagnosticReport["attainableRanges"]
  const primaryOnly = Object.fromEntries(
    MODES.map((mode) => [mode, sampleDistribution(v4, mode, false)]),
  ) as SecurityV4DiagnosticReport["primaryOnly"]
  const analystSecondarySensitivity = sampleAnalystSecondarySensitivity(v4)
  const actorLensExclusion = Object.fromEntries(
    MODES.map((mode) => [mode, proveActorLensExclusion(v4, mode)]),
  ) as SecurityV4DiagnosticReport["actorLensExclusion"]

  const v3Bank = await readFile(resolve(projectRoot, "content/instrument/security.v3.json"))
  const v3Answers = buildAuthoredOrderAnswers(
    v3.runtime.getModuleQuestions(v3.definition, "analyst"),
    "analyst",
  )
  const v3Replay = v3.runtime.buildModuleResult(
    v3.definition,
    "analyst",
    v3Answers,
  )
  const v3BankSha256 = createHash("sha256").update(v3Bank).digest("hex")
  const v3ReplayDigest = hashJson({
    answers: v3Answers,
    headline: v3Replay.headline,
    scores: v3Replay.scores,
    laneSummaries: v3Replay.laneSummaries,
    cardTypeScores: v3Replay.cardTypeScores,
  })
  if (v3BankSha256 !== SECURITY_V3_BANK_SHA256) {
    throw new Error(
      `Security v3 bank drifted: expected ${SECURITY_V3_BANK_SHA256}; ` +
        `received ${v3BankSha256}.`,
    )
  }
  if (v3ReplayDigest !== SECURITY_V3_REPLAY_DIGEST) {
    throw new Error(
      `Security v3 replay drifted: expected ${SECURITY_V3_REPLAY_DIGEST}; ` +
        `received ${v3ReplayDigest}.`,
    )
  }

  return {
    diagnosticVersion: SECURITY_V4_DIAGNOSTIC_VERSION,
    deterministicMethod: {
      seed: SECURITY_V4_DIAGNOSTIC_SEED,
      respondentCount: SECURITY_V4_DIAGNOSTIC_RESPONDENTS,
      randomization: "respondent-question-keyed-fnv1a-lcg",
      actorLensRngIsolation: true,
      timestamps: "omitted",
      network: "not-used",
      writes: "none",
    },
    versions: {
      v4: {
        bankVersion: 4,
        scoringVersion: 2,
        runtimeVersion: v4.runtime.MODULE_SCORING_VERSION,
        rawBankSha256: validation.bankSha256,
        balanceLedgerSha256: validation.ledgerSha256,
      },
      v3: {
        bankVersion: 3,
        scoringVersion: 2,
        runtimeVersion: v3.runtime.MODULE_SCORING_VERSION,
        rawBankSha256: v3BankSha256,
        deterministicReplayDigest: v3ReplayDigest,
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

export function buildCalibrationRows(
  version: ModuleVersionTuple,
): CalibrationRow[] {
  const rows: CalibrationRow[] = []
  const contexts = MODULE_CLASSIFICATION_AXES.security

  for (const mode of MODES) {
    for (const axis of contexts.headline) {
      const calibration = getModuleAxisCalibration(
        "security",
        mode,
        { kind: "headline" },
        axis,
        version,
      )
      rows.push({ mode, context: "headline", axis, ...calibration })
    }
    for (const [laneKey, axes] of Object.entries(contexts.lanes)) {
      for (const axis of axes) {
        const calibration = getModuleAxisCalibration(
          "security",
          mode,
          { kind: "lane", laneKey },
          axis,
          version,
        )
        rows.push({ mode, context: `lane:${laneKey}`, axis, ...calibration })
      }
    }
  }
  return rows
}

export function deriveAttainableRanges(questions: readonly ModuleQuestion[]) {
  const scored = questions.filter((question) => question.cardType !== "actorLens")
  return Object.fromEntries(
    AXES.map((axis) => {
      const minima = scored.map((question) =>
        Math.min(...question.options.map((option) => option.signals[axis])),
      )
      const maxima = scored.map((question) =>
        Math.max(...question.options.map((option) => option.signals[axis])),
      )
      return [
        axis,
        {
          minimum: roundedMean(minima),
          maximum: roundedMean(maxima),
        },
      ]
    }),
  ) as Record<SecurityAxis, { minimum: number; maximum: number }>
}

export function sampleDistribution(
  version: NonNullable<ReturnType<typeof getModuleVersion>>,
  mode: QuizMode,
  includeSecondary: boolean,
): DistributionReport {
  const questions = version.runtime.getModuleQuestions(version.definition, mode)
  const headlineCounts: Record<string, number> = {}
  const sums = Object.fromEntries(AXES.map((axis) => [axis, 0])) as Record<
    SecurityAxis,
    number
  >
  const minima = Object.fromEntries(
    AXES.map((axis) => [axis, Number.POSITIVE_INFINITY]),
  ) as Record<SecurityAxis, number>
  const maxima = Object.fromEntries(
    AXES.map((axis) => [axis, Number.NEGATIVE_INFINITY]),
  ) as Record<SecurityAxis, number>

  for (
    let respondent = 0;
    respondent < SECURITY_V4_DIAGNOSTIC_RESPONDENTS;
    respondent += 1
  ) {
    const answers = buildKeyedAnswers(questions, mode, respondent, includeSecondary)
    const result = version.runtime.buildModuleResult(
      version.definition,
      mode,
      answers,
    )
    headlineCounts[result.headline] = (headlineCounts[result.headline] ?? 0) + 1
    for (const axis of AXES) {
      const value = result.scores[axis]
      sums[axis] += value
      minima[axis] = Math.min(minima[axis], value)
      maxima[axis] = Math.max(maxima[axis], value)
    }
  }

  return {
    respondentCount: SECURITY_V4_DIAGNOSTIC_RESPONDENTS,
    headlineCounts: sortNumberRecord(headlineCounts),
    headlineShares: Object.fromEntries(
      Object.entries(headlineCounts)
        .sort(([left], [right]) => compareText(left, right))
        .map(([headline, count]) => [
          headline,
          Number((count / SECURITY_V4_DIAGNOSTIC_RESPONDENTS).toFixed(6)),
        ]),
    ),
    sampledRanges: Object.fromEntries(
      AXES.map((axis) => [
        axis,
        { minimum: minima[axis], maximum: maxima[axis] },
      ]),
    ) as DistributionReport["sampledRanges"],
    meanScores: Object.fromEntries(
      AXES.map((axis) => [
        axis,
        Number((sums[axis] / SECURITY_V4_DIAGNOSTIC_RESPONDENTS).toFixed(6)),
      ]),
    ) as DistributionReport["meanScores"],
  }
}

export function sampleAnalystSecondarySensitivity(
  version: NonNullable<ReturnType<typeof getModuleVersion>>,
) {
  const questions = version.runtime.getModuleQuestions(
    version.definition,
    "analyst",
  )
  const primaryHeadlineCounts: Record<string, number> = {}
  const secondaryHeadlineCounts: Record<string, number> = {}
  const sums = Object.fromEntries(AXES.map((axis) => [axis, 0])) as Record<
    SecurityAxis,
    number
  >
  const maxima = Object.fromEntries(AXES.map((axis) => [axis, 0])) as Record<
    SecurityAxis,
    number
  >
  let changedHeadlineCount = 0

  for (
    let respondent = 0;
    respondent < SECURITY_V4_DIAGNOSTIC_RESPONDENTS;
    respondent += 1
  ) {
    const primaryAnswers = buildKeyedAnswers(
      questions,
      "analyst",
      respondent,
      false,
    )
    const secondaryAnswers = buildKeyedAnswers(
      questions,
      "analyst",
      respondent,
      true,
    )
    const primary = version.runtime.buildModuleResult(
      version.definition,
      "analyst",
      primaryAnswers,
    )
    const secondary = version.runtime.buildModuleResult(
      version.definition,
      "analyst",
      secondaryAnswers,
    )
    primaryHeadlineCounts[primary.headline] =
      (primaryHeadlineCounts[primary.headline] ?? 0) + 1
    secondaryHeadlineCounts[secondary.headline] =
      (secondaryHeadlineCounts[secondary.headline] ?? 0) + 1
    if (primary.headline !== secondary.headline) changedHeadlineCount += 1
    for (const axis of AXES) {
      const delta = Math.abs(primary.scores[axis] - secondary.scores[axis])
      sums[axis] += delta
      maxima[axis] = Math.max(maxima[axis], delta)
    }
  }

  return {
    primaryOnlyHeadlineCounts: sortNumberRecord(primaryHeadlineCounts),
    withSecondaryHeadlineCounts: sortNumberRecord(secondaryHeadlineCounts),
    changedHeadlineCount,
    meanAbsoluteScoreDelta: Object.fromEntries(
      AXES.map((axis) => [
        axis,
        Number((sums[axis] / SECURITY_V4_DIAGNOSTIC_RESPONDENTS).toFixed(6)),
      ]),
    ) as Record<SecurityAxis, number>,
    maximumAbsoluteScoreDelta: Object.fromEntries(
      AXES.map((axis) => [axis, Number(maxima[axis].toFixed(6))]),
    ) as Record<SecurityAxis, number>,
  }
}

export function proveActorLensExclusion(
  version: NonNullable<ReturnType<typeof getModuleVersion>>,
  mode: QuizMode,
) {
  const questions = version.runtime.getModuleQuestions(version.definition, mode)
  const baseline = buildAuthoredOrderAnswers(questions, mode)
  const variant = structuredClone(baseline)
  const lensQuestions = questions.filter(
    (question) => question.cardType === "actorLens",
  )
  for (const question of lensQuestions) {
    const primary = question.options.at(-1)
    const secondary = question.options.at(-2)
    if (!primary) continue
    variant[question.id] = {
      primary: primary.id,
      ...(mode === "analyst" && question.allowSecondChoiceInAnalyst && secondary
        ? { secondary: secondary.id }
        : {}),
    }
  }

  const baselineAnalytics = version.runtime.buildModuleAnalytics(
    version.definition,
    mode,
    baseline,
  )
  const variantAnalytics = version.runtime.buildModuleAnalytics(
    version.definition,
    mode,
    variant,
  )
  const baselineResult = version.runtime.buildModuleResult(
    version.definition,
    mode,
    baseline,
  )
  const variantResult = version.runtime.buildModuleResult(
    version.definition,
    mode,
    variant,
  )

  return {
    lensCount: lensQuestions.length,
    mainScoresEqual: equalJson(baselineAnalytics.scores, variantAnalytics.scores),
    laneScoresEqual: equalJson(
      baselineAnalytics.laneScores,
      variantAnalytics.laneScores,
    ),
    headlineEqual: baselineResult.headline === variantResult.headline,
    laneSummariesEqual: equalJson(
      baselineResult.laneSummaries,
      variantResult.laneSummaries,
    ),
    actorLensAnalyticsChanged: !equalJson(
      baselineAnalytics.cardTypeScores.actorLens,
      variantAnalytics.cardTypeScores.actorLens,
    ),
  }
}

function buildKeyedAnswers(
  questions: readonly ModuleQuestion[],
  mode: QuizMode,
  respondent: number,
  includeSecondary: boolean,
): ModuleAnswers {
  return Object.fromEntries(
    questions.map((question) => {
      const optionCount = question.options.length
      const primaryIndex = keyedIndex(
        optionCount,
        `${SECURITY_V4_DIAGNOSTIC_SEED}:${mode}:${respondent}:${question.id}:primary`,
      )
      const primary = question.options[primaryIndex]
      const secondaryOffset =
        optionCount > 1
          ? 1 +
            keyedIndex(
              optionCount - 1,
              `${SECURITY_V4_DIAGNOSTIC_SEED}:${mode}:${respondent}:${question.id}:secondary`,
            )
          : 0
      const secondary = question.options[
        (primaryIndex + secondaryOffset) % optionCount
      ]
      return [
        question.id,
        {
          primary: primary.id,
          ...(includeSecondary &&
          mode === "analyst" &&
          question.allowSecondChoiceInAnalyst &&
          secondary.id !== primary.id
            ? { secondary: secondary.id }
            : {}),
        },
      ]
    }),
  )
}

function buildAuthoredOrderAnswers(
  questions: readonly ModuleQuestion[],
  mode: QuizMode,
): ModuleAnswers {
  return Object.fromEntries(
    questions.map((question) => [
      question.id,
      {
        primary: question.options[0].id,
        ...(mode === "analyst" &&
        question.allowSecondChoiceInAnalyst &&
        question.options[1]
          ? { secondary: question.options[1].id }
          : {}),
      },
    ]),
  )
}

function keyedIndex(length: number, key: string) {
  if (length <= 0) throw new Error(`Cannot choose from ${length} options.`)
  let state = 2166136261
  for (let index = 0; index < key.length; index += 1) {
    state ^= key.charCodeAt(index)
    state = Math.imul(state, 16777619)
  }
  state >>>= 0
  state = (state * 1664525 + 1013904223) >>> 0
  return Math.floor((state / 0x100000000) * length)
}

function roundedMean(values: readonly number[]) {
  return Number(
    (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2),
  )
}

function sortNumberRecord(record: Record<string, number>) {
  return Object.fromEntries(
    Object.entries(record).sort(([left], [right]) => compareText(left, right)),
  )
}

function equalJson(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right)
}

function hashJson(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex")
}

function compareText(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0
}

export function renderSecurityV4DiagnosticReport(
  report: SecurityV4DiagnosticReport,
) {
  const lines = [
    `Security v4 deterministic diagnostic v${report.diagnosticVersion}`,
    `bank=${report.versions.v4.bankVersion} scorer=${report.versions.v4.scoringVersion} ` +
      `runtime=${report.versions.v4.runtimeVersion}`,
    `N=${report.deterministicMethod.respondentCount} seed=${report.deterministicMethod.seed}`,
    `v4 raw bank SHA-256: ${report.versions.v4.rawBankSha256}`,
    `v4 balance-ledger SHA-256: ${report.versions.v4.balanceLedgerSha256}`,
  ]

  for (const mode of MODES) {
    lines.push(
      `${mode} counts: ${report.validation.modes[mode].total} total / ` +
        `${report.validation.modes[mode].mainScored} main / ` +
        `${report.validation.modes[mode].actorLens} actor lens`,
    )
    lines.push(
      `${mode} headline distribution: ${Object.entries(
        report.primaryOnly[mode].headlineShares,
      )
        .map(([headline, share]) => `${headline}=${(share * 100).toFixed(1)}%`)
        .join(" | ")}`,
    )
    const proof = report.actorLensExclusion[mode]
    lines.push(
      `${mode} actor-lens exclusion: main=${proof.mainScoresEqual} ` +
        `lanes=${proof.laneScoresEqual} headline=${proof.headlineEqual} ` +
        `actor-analysis-changed=${proof.actorLensAnalyticsChanged}`,
    )
  }

  lines.push(
    `Analyst secondary sensitivity: ${report.analystSecondarySensitivity.changedHeadlineCount}/` +
      `${report.deterministicMethod.respondentCount} headlines changed.`,
    `v3 raw bank SHA-256: ${report.versions.v3.rawBankSha256}`,
    `v3 deterministic replay digest: ${report.versions.v3.deterministicReplayDigest}`,
  )
  return lines.join("\n")
}

async function run() {
  const report = await buildSecurityV4DiagnosticReport()
  if (process.argv.includes("--json")) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
  } else {
    process.stdout.write(`${renderSecurityV4DiagnosticReport(report)}\n`)
  }
}

const entryPoint = process.argv[1]
if (entryPoint && pathToFileURL(resolve(entryPoint)).href === import.meta.url) {
  run().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
