import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { validateSupportedInstrumentBank } from "@/scripts/evidence-bank-validation.mts"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { analyzeInstrumentEvidence, loadEvidenceBankDescriptors, type InstrumentEvidenceAnalysis, type InstrumentEvidenceReport } from "@/scripts/evidence-instrument-analysis.mts"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { buildEvidenceResponseFixtureReport, EVIDENCE_RANDOM_SEED, type EvidenceFixtureRecord, type EvidenceResponseCohort, type EvidenceResponseFixtureReport } from "@/scripts/evidence-response-fixtures.mts"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { buildCopyAuditDelta, readEvidenceAuditBaseline, runPublicCopyAudit, type CopyAuditDelta } from "@/scripts/evidence-copy-delta.mts"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { compareEvidenceStrings, hashJson, hashText, stableCompactJson } from "@/scripts/evidence-utils.mts"

type SourceCategory =
  | "instrument-bank"
  | "scoring-runtime"
  | "calibration"
  | "diagnostic"
  | "copy-audit"
  | "compatibility-test"
  | "evidence-baseline"

type SourceSpec = {
  path: string
  category: SourceCategory
}

export type EvidenceSourceManifestEntry = SourceSpec & {
  sha256: string
}

export type EvidenceAuditReport = {
  schemaVersion: 1
  command: "npm run evidence:audit"
  deterministicMethod: {
    randomSeed: number
    timestamps: "omitted"
    absolutePaths: "omitted"
    network: "not-used"
    externalModels: "not-used"
    database: "not-used"
    writes: [
      "artifacts/evidence/current-summary.md",
      "artifacts/evidence/current-summary.json",
    ]
  }
  sources: EvidenceSourceManifestEntry[]
  instrumentEvidence: InstrumentEvidenceReport
  responseEvidence: EvidenceResponseFixtureReport
  fixtureBaseline: {
    fixtureScope: "response cohorts and presentation invariance"
    expectedDigest: string
    actualDigest: string
    matches: boolean
    expectedResponseRecordCount: number
    actualResponseRecordCount: number
    expectedInvarianceRecordCount: number
    actualInvarianceRecordCount: number
  }
  copyAudit: CopyAuditDelta
}

const SOURCE_SPECS: readonly SourceSpec[] = [
  { path: "content/instrument/schema.json", category: "instrument-bank" },
  {
    path: "content/instrument/foundation.scoring.v1.json",
    category: "instrument-bank",
  },
  {
    path: "content/instrument/foundation.v2.json",
    category: "instrument-bank",
  },
  {
    path: "content/instrument/security.v2.json",
    category: "instrument-bank",
  },
  {
    path: "content/instrument/security.v3.json",
    category: "instrument-bank",
  },
  {
    path: "content/instrument/technology.v2.json",
    category: "instrument-bank",
  },
  {
    path: "content/instrument/technology.v3.json",
    category: "instrument-bank",
  },
  {
    path: "content/instrument/ai-governance.v2.json",
    category: "instrument-bank",
  },
  {
    path: "content/instrument/ai-governance.v3.json",
    category: "instrument-bank",
  },
  { path: "lib/scoring/v1.ts", category: "scoring-runtime" },
  { path: "lib/scoring/v2.ts", category: "scoring-runtime" },
  { path: "lib/scoring/versions.ts", category: "scoring-runtime" },
  { path: "lib/modules/runtime-v1.ts", category: "scoring-runtime" },
  { path: "lib/modules/runtime-v2.ts", category: "scoring-runtime" },
  { path: "lib/modules/versions.ts", category: "scoring-runtime" },
  { path: "lib/modules/security-v21.ts", category: "scoring-runtime" },
  { path: "lib/modules/security.ts", category: "scoring-runtime" },
  { path: "lib/modules/technology-v21.ts", category: "scoring-runtime" },
  { path: "lib/modules/technology.ts", category: "scoring-runtime" },
  {
    path: "lib/ai-governance-schema-v21.ts",
    category: "scoring-runtime",
  },
  { path: "lib/ai-governance-schema.ts", category: "scoring-runtime" },
  {
    path: "lib/ai-governance-scoring-v21.ts",
    category: "scoring-runtime",
  },
  { path: "lib/ai-governance-scoring.ts", category: "scoring-runtime" },
  {
    path: "lib/ai-governance-versions.ts",
    category: "scoring-runtime",
  },
  { path: "lib/option-order.ts", category: "scoring-runtime" },
  { path: "lib/scoring/v2-calibration.ts", category: "calibration" },
  { path: "lib/scoring-calibration.ts", category: "calibration" },
  { path: "lib/modules/calibration.ts", category: "calibration" },
  { path: "lib/modules/calibration-data.ts", category: "calibration" },
  { path: "scripts/calibrate-targeted-forms.mts", category: "calibration" },
  { path: "scripts/calibrate-modules.mts", category: "calibration" },
  { path: "scripts/calibrate-modules-bootstrap.mjs", category: "calibration" },
  { path: "scripts/diagnose-instrument.mts", category: "diagnostic" },
  { path: "scripts/validate-instrument.mts", category: "diagnostic" },
  { path: "scripts/audit-public-copy.mjs", category: "copy-audit" },
  {
    path: "tests/instrument-version-compatibility.test.mts",
    category: "compatibility-test",
  },
  {
    path: "tests/instrument-measurement-gates.test.mts",
    category: "compatibility-test",
  },
  {
    path: "tests/public-copy-audit.test.mts",
    category: "compatibility-test",
  },
  { path: "tests/option-order.test.mts", category: "compatibility-test" },
  {
    path: "tests/fixtures/instrument-version-golden.json",
    category: "compatibility-test",
  },
  {
    path: "tests/fixtures/evidence-audit-baseline.json",
    category: "evidence-baseline",
  },
] as const

export async function buildEvidenceAuditReport(
  projectRoot = process.cwd(),
): Promise<EvidenceAuditReport> {
  const [descriptors, baseline, publicCopyReport, sources] = await Promise.all([
    loadEvidenceBankDescriptors(projectRoot),
    readEvidenceAuditBaseline(projectRoot),
    Promise.resolve(runPublicCopyAudit(projectRoot)),
    buildSourceManifest(projectRoot),
  ])

  for (const descriptor of descriptors) {
    const identity = validateSupportedInstrumentBank(
      descriptor.bank,
      descriptor.sourcePath,
    )
    if (
      identity.key !== descriptor.key ||
      identity.instrument !== descriptor.instrument ||
      identity.release !== descriptor.generation ||
      identity.bankVersion !== descriptor.bankVersion ||
      identity.scoringVersion !== descriptor.scoringVersion
    ) {
      throw new Error(
        `${descriptor.sourcePath} has inconsistent evidence registry identity.`,
      )
    }
  }

  const instrumentEvidence = analyzeInstrumentEvidence(descriptors)
  const responseEvidence = buildEvidenceResponseFixtureReport()
  const responseRecordCount = responseEvidence.cohorts.reduce(
    (sum, cohort) => sum + cohort.fixtures.length,
    0,
  )
  const fixtureDigest = hashJson({
    cohorts: responseEvidence.cohorts,
    presentationInvariance: responseEvidence.presentationInvariance,
  })

  return {
    schemaVersion: 1,
    command: "npm run evidence:audit",
    deterministicMethod: {
      randomSeed: EVIDENCE_RANDOM_SEED,
      timestamps: "omitted",
      absolutePaths: "omitted",
      network: "not-used",
      externalModels: "not-used",
      database: "not-used",
      writes: [
        "artifacts/evidence/current-summary.md",
        "artifacts/evidence/current-summary.json",
      ],
    },
    sources,
    instrumentEvidence,
    responseEvidence,
    fixtureBaseline: {
      fixtureScope: "response cohorts and presentation invariance",
      expectedDigest: baseline.responseFixture.digest,
      actualDigest: fixtureDigest,
      matches: fixtureDigest === baseline.responseFixture.digest,
      expectedResponseRecordCount:
        baseline.responseFixture.responseRecordCount,
      actualResponseRecordCount: responseRecordCount,
      expectedInvarianceRecordCount:
        baseline.responseFixture.invarianceRecordCount,
      actualInvarianceRecordCount:
        responseEvidence.presentationInvariance.length,
    },
    copyAudit: buildCopyAuditDelta(publicCopyReport, baseline),
  }
}

export async function buildSourceManifest(
  projectRoot: string,
): Promise<EvidenceSourceManifestEntry[]> {
  return Promise.all(
    [...SOURCE_SPECS]
      .sort((left, right) =>
        compareEvidenceStrings(left.path, right.path),
      )
      .map(async ({ path, category }) => ({
        path,
        category,
        sha256: hashText(await readFile(resolve(projectRoot, path), "utf8")),
      })),
  )
}

export function renderEvidenceMarkdown(report: EvidenceAuditReport): string {
  const lines: string[] = [
    "# Deterministic evidence audit",
    "",
    "This report characterizes the checked-in instruments and scorers. " +
      "It does not estimate population prevalence or create new psychometric " +
      "pass thresholds. Concentrations and wording asymmetries are review evidence.",
    "",
    "The audit is local and deterministic: it omits time and absolute paths, " +
      "uses no network, external model, or database, and writes only the two " +
      "requested files under `artifacts/evidence/`.",
    "",
    "## Source manifest",
    "",
    markdownTable(
      ["Category", "Path", "SHA-256"],
      report.sources.map((source) => [
        source.category,
        source.path,
        source.sha256,
      ]),
    ),
    "",
  ]

  appendCoverageSections(lines, report.instrumentEvidence)
  appendShareSection(lines, report.instrumentEvidence)
  appendOptionTextSection(lines, report.instrumentEvidence)
  appendSeparationSection(lines, report.instrumentEvidence)
  appendConcentrationSection(lines, report.instrumentEvidence)
  appendResponseSection(lines, report.responseEvidence)
  appendInvarianceSection(lines, report)
  appendCopyAuditSection(lines, report.copyAudit)

  lines.push(
    "## Method notes",
    "",
    "- Foundation validation-block items are counted as research-validation scored but not primary-result scored; both shares are shown.",
    "- Module actor-lens items contribute card-type evidence but are excluded from aggregate and lane scores, so both any-scored and primary-scored shares are shown.",
    "- Actor roles come only from explicit `actorRole` metadata or the repository's controlled perspective-tag matrix.",
    "- No bank declares theater metadata. The audit records `undeclared`; it does not infer theater from prose, place names, tags, or IDs.",
    "- Declared-axis separation reuses the checked-in V22 measurement contracts: a 2.0 spread around 4 for module signals and a 0.5 spread around 0 for AI scenario deltas.",
    "- Near-duplicate text is an advisory string heuristic, not a measurement gate.",
    "- Always-first, always-last, and alternating fixtures use a fixed presentation seed. Presentation invariance separately holds semantic answer IDs constant across two different seeds.",
    "",
  )

  return `${lines.join("\n").trimEnd()}\n`
}

export function renderEvidenceConsoleSummary(
  report: EvidenceAuditReport,
): string {
  const separationCount = report.instrumentEvidence.instruments.reduce(
    (sum, instrument) =>
      sum +
      instrument.axisSeparation.itemsNotMeaningfullySeparated.length,
    0,
  )
  const invariance = report.responseEvidence.presentationInvariance
  const copy = report.copyAudit.advisory

  return [
    "Deterministic evidence audit complete.",
    `Instrument banks: ${report.instrumentEvidence.instruments.length} ` +
      `(${report.instrumentEvidence.instruments.filter((entry) => entry.descriptor.generation === "current").length} current, ` +
      `${report.instrumentEvidence.instruments.filter((entry) => entry.descriptor.generation === "legacy").length} legacy).`,
    `Declared-axis review findings: ${separationCount}.`,
    `Response fixtures: ${report.fixtureBaseline.actualResponseRecordCount}; ` +
      `baseline ${report.fixtureBaseline.matches ? "matches" : "DIFFERS"}.`,
    `Presentation invariance: ${invariance.filter((entry) => entry.passed).length}/${invariance.length}.`,
    `Copy P2 delta: ${copy.newCount} new, ${copy.resolvedCount} resolved, ` +
      `${copy.unchangedCount} unchanged.`,
    "Wrote artifacts/evidence/current-summary.md",
    "Wrote artifacts/evidence/current-summary.json",
  ].join("\n")
}

function appendCoverageSections(
  lines: string[],
  evidence: InstrumentEvidenceReport,
) {
  for (const generation of ["current", "legacy"] as const) {
    lines.push(
      `## ${generation === "current" ? "Current" : "Legacy"} bank coverage`,
      "",
      markdownTable(
        [
          "Bank",
          "Items",
          "Mode",
          "Axes",
          "Lane",
          "Question type",
          "Scoring block",
          "Actor role",
          "Theater",
          "Perspective tag",
          "Knowledge load",
        ],
        evidence.instruments
          .filter(
            (instrument) =>
              instrument.descriptor.generation === generation,
          )
          .map((instrument) => [
            instrument.descriptor.key,
            instrument.coverage.totalItems,
            formatCountSummary(instrument.coverage.byMode),
            formatCountSummary(instrument.coverage.byAxis),
            formatCountSummary(instrument.coverage.byLane),
            formatCountSummary(instrument.coverage.byQuestionType),
            formatCountSummary(instrument.coverage.byScoringBlock),
            formatCountSummary(instrument.coverage.byActorRole),
            formatCountSummary(instrument.coverage.byTheater),
            formatCountSummary(instrument.coverage.byPerspectiveTag),
            formatCountSummary(instrument.coverage.byKnowledgeLoad),
          ]),
      ),
      "",
      ...evidence.instruments
        .filter(
          (instrument) =>
            instrument.descriptor.generation === generation,
        )
        .flatMap((instrument) => [
          `- **${instrument.descriptor.key}:** ${instrument.descriptor.modeNote}`,
        ]),
      "",
    )
  }
}

function appendShareSection(
  lines: string[],
  evidence: InstrumentEvidenceReport,
) {
  lines.push(
    "## Reverse-coded and scored-item shares",
    "",
    markdownTable(
      [
        "Bank",
        "Generation",
        "Reverse / Likert",
        "Reverse / any-scored Likert",
        "Reverse / primary-scored Likert",
        "Any-scored items",
        "Primary-scored items",
        "Reverse by mode",
        "Reverse by axis",
        "Primary-scored by mode",
      ],
      evidence.instruments.map((instrument) => [
        instrument.descriptor.key,
        instrument.descriptor.generation,
        formatShare(instrument.shares.reverseCodedAll),
        formatShare(instrument.shares.reverseCodedScored),
        formatShare(instrument.shares.reverseCodedPrimaryScored),
        formatShare(instrument.shares.scoredItems),
        formatShare(instrument.shares.primaryScoredItems),
        formatShareMap(instrument.shares.reverseCodedByMode),
        formatShareMap(instrument.shares.reverseCodedByAxis),
        formatShareMap(instrument.shares.primaryScoredItemsByMode),
      ]),
    ),
    "",
  )
}

function appendOptionTextSection(
  lines: string[],
  evidence: InstrumentEvidenceReport,
) {
  lines.push(
    "## Option wording asymmetry",
    "",
    "The JSON artifact contains every option and option-set distribution. " +
      "This table identifies each bank's widest observed option-length spread " +
      "and counts sets with unequal modal-verb or absolutism counts.",
    "",
    markdownTable(
      [
        "Bank",
        "Option sets",
        "Widest word spread",
        "Item / source",
        "Modal-asymmetric sets",
        "Absolutism-asymmetric sets",
      ],
      evidence.instruments.map((instrument) => {
        const widest = maxAsymmetry(
          instrument.optionText.asymmetry,
          (entry) => entry.wordCount.spread,
        )
        return [
          instrument.descriptor.key,
          instrument.optionText.asymmetry.length,
          widest?.wordCount.spread ?? 0,
          widest ? `${widest.itemId} / ${widest.source}` : "n/a",
          instrument.optionText.asymmetry.filter(
            (entry) => entry.modalVerbCount.spread > 0,
          ).length,
          instrument.optionText.asymmetry.filter(
            (entry) => entry.absolutismCount.spread > 0,
          ).length,
        ]
      }),
    ),
    "",
    "### Repeated and near-duplicate option text",
    "",
  )

  for (const generation of ["current", "legacy"] as const) {
    const reuse = evidence.textReuseByGeneration[generation]
    lines.push(
      `#### ${generation === "current" ? "Current" : "Legacy"}`,
      "",
      `Exact repeated groups: ${reuse.exact.length}. Near-duplicate pairs: ${reuse.near.length}.`,
      "",
    )
    if (reuse.exact.length > 0) {
      lines.push(
        markdownTable(
          ["Normalized text", "Locations"],
          reuse.exact.map((group) => [
            group.normalizedText,
            group.locations
              .map(optionLocationLabel)
              .join("; "),
          ]),
        ),
        "",
      )
    }
    if (reuse.near.length > 0) {
      lines.push(
        markdownTable(
          ["Similarity", "Left", "Right"],
          reuse.near.map((pair) => [
            pair.similarity,
            optionLocationLabel(pair.left),
            optionLocationLabel(pair.right),
          ]),
        ),
        "",
      )
    }
  }
}

function appendSeparationSection(
  lines: string[],
  evidence: InstrumentEvidenceReport,
) {
  lines.push(
    "## Declared-axis option-signal separation",
    "",
    markdownTable(
      ["Bank", "Policy", "Reviewed items", "Not meaningfully separated"],
      evidence.instruments.map((instrument) => [
        instrument.descriptor.key,
        instrument.axisSeparation.policy
          ? `midpoint ${instrument.axisSeparation.policy.midpoint}; spread ${instrument.axisSeparation.policy.minimumSpread}`
          : "not declared / not applicable",
        instrument.axisSeparation.items.filter(
          (item) =>
            item.status === "reviewed-option-signals" ||
            item.status === "direct-likert-scale",
        ).length,
        instrument.axisSeparation.itemsNotMeaningfullySeparated.join(", ") ||
          "none",
      ]),
    ),
    "",
  )
}

function appendConcentrationSection(
  lines: string[],
  evidence: InstrumentEvidenceReport,
) {
  lines.push(
    "## Actor, theater, tag, and knowledge-load concentration",
    "",
    "Shares are raw item coverage for review, not population estimates or pass/fail gates.",
    "",
    markdownTable(
      [
        "Bank",
        "Actor-role leader",
        "Actor undeclared",
        "Theater leader",
        "Theater undeclared",
        "Perspective-tag leader",
        "Knowledge-load leader",
      ],
      evidence.instruments.map((instrument) => [
        instrument.descriptor.key,
        formatConcentration(instrument.concentrations.actorRole),
        `${instrument.concentrations.actorRole.undeclaredItems}/${instrument.concentrations.actorRole.denominatorItems}`,
        formatConcentration(instrument.concentrations.theater),
        `${instrument.concentrations.theater.undeclaredItems}/${instrument.concentrations.theater.denominatorItems}`,
        formatConcentration(instrument.concentrations.perspectiveTag),
        formatConcentration(instrument.concentrations.knowledgeLoad),
      ]),
    ),
    "",
  )
}

function appendResponseSection(
  lines: string[],
  response: EvidenceResponseFixtureReport,
) {
  const responseRows: Array<Array<string | number>> = []
  const directionalRows: Array<Array<string | number>> = []

  for (const cohort of response.cohorts) {
    for (const fixture of cohort.fixtures) {
      const row = [
        cohort.key,
        cohort.legacy ? "legacy" : "current",
        fixture.name,
        outcomeLabel(cohort, fixture),
        scoreRange(fixture),
      ]
      if (fixture.kind === "response-style") {
        responseRows.push(row)
      } else {
        directionalRows.push(row)
      }
    }
  }

  lines.push(
    "## Response-style results",
    "",
    markdownTable(
      ["Cohort", "Generation", "Fixture", "Outcome", "Score range"],
      responseRows,
    ),
    "",
    "### Named directional fixtures",
    "",
    markdownTable(
      ["Cohort", "Generation", "Fixture", "Outcome", "Score range"],
      directionalRows,
    ),
    "",
  )
}

function appendInvarianceSection(
  lines: string[],
  report: EvidenceAuditReport,
) {
  const baseline = report.fixtureBaseline
  lines.push(
    "## Presentation-seed invariance",
    "",
    `Fixture baseline digest: \`${baseline.actualDigest}\` — ` +
      `${baseline.matches ? "matches" : "does not match"} the checked-in baseline.`,
    "",
    markdownTable(
      [
        "Cohort",
        "Generation",
        "Option sets",
        "Changed orders",
        "Semantic result invariant",
      ],
      report.responseEvidence.presentationInvariance.map((entry) => [
        entry.cohortKey,
        entry.legacy ? "legacy" : "current",
        entry.presentationQuestionCount,
        entry.changedPresentationQuestions,
        entry.passed ? "yes" : "no",
      ]),
    ),
    "",
  )
}

function appendCopyAuditSection(
  lines: string[],
  copyAudit: CopyAuditDelta,
) {
  const advisory = copyAudit.advisory
  lines.push(
    "## Public-copy audit delta",
    "",
    `P2 advisory baseline: ${advisory.baselineCount}. Current: ` +
      `${advisory.currentCount}. Unchanged and suppressed: ` +
      `${advisory.unchangedCount}. New: ${advisory.newCount}. ` +
      `Resolved: ${advisory.resolvedCount}.`,
    "",
    "Higher-priority findings remain visible regardless of the P2 baseline.",
    "",
    markdownTable(
      ["Priority", "Count"],
      copyAudit.priorityCounts.map((entry) => [
        entry.priority,
        entry.count,
      ]),
    ),
    "",
  )

  if (copyAudit.higherPriorityFindings.length > 0) {
    lines.push(
      "### P0 and P1 findings",
      "",
      markdownTable(
        ["Priority", "Rule", "Audience", "Location", "Matched"],
        copyAudit.higherPriorityFindings.map((finding) => [
          finding.priority,
          finding.rule,
          finding.audience,
          `${finding.file}:${finding.line} (${finding.context})`,
          finding.matched,
        ]),
      ),
      "",
    )
  }

  lines.push(
    "### New P2 findings",
    "",
    advisory.newFindings.length > 0
      ? markdownTable(
          ["Count", "Rule", "Audience", "Location", "Matched"],
          advisory.newFindings.map((finding) => [
            finding.count,
            finding.rule,
            finding.audience,
            `${finding.file} (${finding.context})`,
            finding.matched,
          ]),
        )
      : "None.",
    "",
    "### Resolved P2 findings",
    "",
    advisory.resolvedFindings.length > 0
      ? markdownTable(
          ["Count", "Baseline fingerprint"],
          advisory.resolvedFindings.map((finding) => [
            finding.count,
            finding.fingerprint,
          ]),
        )
      : "None.",
    "",
  )
}

function maxAsymmetry(
  values: InstrumentEvidenceAnalysis["optionText"]["asymmetry"],
  score: (
    entry: InstrumentEvidenceAnalysis["optionText"]["asymmetry"][number],
  ) => number,
) {
  return [...values].sort(
    (left, right) =>
      score(right) - score(left) ||
      compareEvidenceStrings(left.itemId, right.itemId) ||
      compareEvidenceStrings(left.source, right.source),
  )[0]
}

function formatShare(value: {
  numerator: number
  denominator: number
  share: number | null
}) {
  return value.share === null
    ? `n/a (${value.numerator}/${value.denominator})`
    : `${(value.share * 100).toFixed(1)}% (${value.numerator}/${value.denominator})`
}

function formatCountSummary(counts: Record<string, number>) {
  const values = Object.entries(counts)
    .sort(([left], [right]) => compareEvidenceStrings(left, right))
    .map(([key, count]) => `${key} ${count}`)
  return values.length > 0 ? values.join("; ") : "none"
}

function formatShareMap(
  shares: Record<
    string,
    { numerator: number; denominator: number; share: number | null }
  >,
) {
  const values = Object.entries(shares)
    .sort(([left], [right]) => compareEvidenceStrings(left, right))
    .map(([key, value]) => `${key} ${formatShare(value)}`)
  return values.length > 0 ? values.join("; ") : "none"
}

function formatConcentration(value: {
  leaders: string[]
  leaderItemCount: number
  leaderShareOfItems: number | null
}) {
  if (value.leaderShareOfItems === null) return "n/a"
  return (
    `${value.leaders.join(", ")} ${value.leaderItemCount} ` +
    `(${(value.leaderShareOfItems * 100).toFixed(1)}%)`
  )
}

function optionLocationLabel(location: {
  descriptorKey: string
  itemId: string
  source: string
  optionId: string
}) {
  return (
    `${location.descriptorKey}/${location.itemId}/` +
    `${location.source}/${location.optionId}`
  )
}

function outcomeLabel(
  cohort: EvidenceResponseCohort,
  fixture: EvidenceFixtureRecord,
) {
  const result = fixture.result
  if (typeof result.familyKey === "string") {
    return [
      result.familyKey,
      result.strategyModifier,
      result.normativeModifier,
    ].filter((value) => typeof value === "string").join(" / ")
  }
  if (typeof result.headline === "string") return result.headline
  if (typeof result.archetypeKey === "string") {
    return [
      result.archetypeKey,
      result.riskLens,
      result.paceModifier,
      result.geopoliticsModifier,
    ].filter((value) => typeof value === "string").join(" / ")
  }
  return `${cohort.instrument} result`
}

function scoreRange(fixture: EvidenceFixtureRecord) {
  const result = fixture.result
  for (const field of ["dimensionScores", "scores", "axisScores"]) {
    const value = result[field]
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      continue
    }
    const numbers = Object.values(value).filter(
      (entry): entry is number => typeof entry === "number",
    )
    if (numbers.length > 0) {
      return `${Math.min(...numbers).toFixed(2)}–${Math.max(...numbers).toFixed(2)}`
    }
  }
  return "n/a"
}

function markdownTable(
  headers: readonly string[],
  rows: ReadonlyArray<
    ReadonlyArray<string | number | boolean | null>
  >,
) {
  const renderRow = (
    cells: readonly (string | number | boolean | null)[],
  ) => `| ${cells.map(markdownCell).join(" | ")} |`
  return [
    renderRow(headers),
    renderRow(headers.map(() => "---")),
    ...rows.map(renderRow),
  ].join("\n")
}

function markdownCell(value: string | number | boolean | null) {
  return String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ")
}

export function evidenceFixtureDigest(report: EvidenceAuditReport): string {
  return hashJson({
    cohorts: report.responseEvidence.cohorts,
    presentationInvariance:
      report.responseEvidence.presentationInvariance,
  })
}

export function compactEvidenceResult(value: unknown): string {
  return stableCompactJson(value)
}
