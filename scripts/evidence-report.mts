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
import { compareEvidenceStrings, EVIDENCE_ARTIFACT_SCHEMA_VERSION, hashJson, hashText, stableCompactJson } from "@/scripts/evidence-utils.mts"

type SourceCategory =
  | "instrument-bank"
  | "design-source"
  | "scoring-runtime"
  | "calibration"
  | "diagnostic"
  | "copy-audit"
  | "compatibility-test"
  | "evidence-baseline"
  | "evidence-bank-validation"
  | "evidence-canonicalization"
  | "evidence-copy-delta"
  | "evidence-entrypoint"
  | "evidence-instrument-analysis"
  | "evidence-renderer"
  | "evidence-response-fixtures"

type SourceSpec = {
  path: string
  category: SourceCategory
}

export type EvidenceSourceManifestEntry = SourceSpec & {
  sha256: string
}

export type EvidenceAuditReport = {
  schemaVersion: typeof EVIDENCE_ARTIFACT_SCHEMA_VERSION
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
    path: "content/instrument/security.v4.json",
    category: "instrument-bank",
  },
  {
    path: "content/instrument/security.v5.json",
    category: "instrument-bank",
  },
  {
    path: "docs/v23/security/V23_3_SECURITY_ACTOR_BALANCE_LEDGER.csv",
    category: "design-source",
  },
  {
    path: "docs/v23/security/V23_3_SECURITY_ITEM_REVIEW.md",
    category: "design-source",
  },
  {
    path: "docs/v23/security/V23_3_SECURITY_SOURCE_LEDGER.md",
    category: "design-source",
  },
  {
    path: "docs/v23/security/V23_3_SECURITY_V4_CONTRACT.md",
    category: "design-source",
  },
  {
    path: "docs/v23/security/V23_3_SECURITY_V5_ACTOR_BALANCE_LEDGER.csv",
    category: "design-source",
  },
  {
    path: "docs/v23/security/V23_3_SECURITY_V5_SOURCE_LEDGER.md",
    category: "design-source",
  },
  {
    path: "docs/v23/security/V23_3_SECURITY_V5_ITEM_REVIEW.md",
    category: "design-source",
  },
  {
    path: "docs/v23/security/V23_3_SECURITY_V5_BETA_RELEASE_DECISION.md",
    category: "design-source",
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
  { path: "lib/modules/security-v22.ts", category: "scoring-runtime" },
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
  {
    path: "lib/modules/calibration-data-v22.ts",
    category: "calibration",
  },
  { path: "scripts/calibrate-targeted-forms.mts", category: "calibration" },
  { path: "scripts/calibrate-modules.mts", category: "calibration" },
  { path: "scripts/calibrate-modules-bootstrap.mjs", category: "calibration" },
  { path: "scripts/diagnose-instrument.mts", category: "diagnostic" },
  { path: "scripts/diagnose-security-v4.mts", category: "diagnostic" },
  {
    path: "scripts/evidence-audit.mts",
    category: "evidence-entrypoint",
  },
  {
    path: "scripts/evidence-bank-validation.mts",
    category: "evidence-bank-validation",
  },
  {
    path: "scripts/evidence-copy-delta.mts",
    category: "evidence-copy-delta",
  },
  {
    path: "scripts/evidence-instrument-analysis.mts",
    category: "evidence-instrument-analysis",
  },
  {
    path: "scripts/evidence-report.mts",
    category: "evidence-renderer",
  },
  {
    path: "scripts/evidence-response-fixtures.mts",
    category: "evidence-response-fixtures",
  },
  {
    path: "scripts/evidence-utils.mts",
    category: "evidence-canonicalization",
  },
  { path: "scripts/validate-instrument.mts", category: "diagnostic" },
  { path: "scripts/validate-security-v4.mts", category: "diagnostic" },
  { path: "scripts/code-unit-order.mjs", category: "copy-audit" },
  { path: "scripts/audit-public-copy.mjs", category: "copy-audit" },
  {
    path: "tests/instrument-version-compatibility.test.mts",
    category: "compatibility-test",
  },
  {
    path: "tests/security-v4.test.mts",
    category: "compatibility-test",
  },
  {
    path: "tests/instrument-measurement-gates.test.mts",
    category: "compatibility-test",
  },
  {
    path: "tests/evidence-instrument-analysis.test.mts",
    category: "compatibility-test",
  },
  {
    path: "tests/evidence-audit.test.mts",
    category: "compatibility-test",
  },
  {
    path: "tests/public-copy-audit.test.mts",
    category: "compatibility-test",
  },
  {
    path: "tests/v21-module-copy.test.mts",
    category: "compatibility-test",
  },
  { path: "tests/option-order.test.mts", category: "compatibility-test" },
  {
    path: "tests/fixtures/instrument-version-golden.json",
    category: "compatibility-test",
  },
  {
    path: "tests/fixtures/v21-module-copy-golden.json",
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
    schemaVersion: EVIDENCE_ARTIFACT_SCHEMA_VERSION,
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
      ["Source role", "Path", "SHA-256"],
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
    `- Public evidence artifact schema version: ${EVIDENCE_ARTIFACT_SCHEMA_VERSION}. The nested instrument-evidence and response-fixture reports use the same schema version.`,
    "- Foundation validation-block items are counted as research-validation scored but not primary-result scored; both shares are shown.",
    "- Module actor-lens items contribute card-type evidence but are excluded from aggregate and lane scores, so both any-scored and primary-scored shares are shown.",
    "- Actor roles come only from explicit `actorRole` metadata or the repository's controlled perspective-tag matrix.",
    "- No bank declares theater metadata. The audit records `undeclared`; it does not infer theater from prose, place names, tags, or IDs.",
    "- The declared-axis midpoint/range gate reuses the checked-in V22 measurement contracts: minimum total range 2.0 with policy midpoint 4 for module signals, and minimum total range 0.5 with policy midpoint 0 for AI scenario deltas.",
    "- Option-geometry fields and duplicate-vector groups are descriptive review aids, not new pass/fail thresholds or psychometric evidence.",
    "- Near-duplicate text is an advisory string heuristic, not a measurement gate.",
    "- Always-first, always-last, and alternating fixtures use a fixed presentation seed. Presentation invariance separately holds semantic answer IDs constant across two different seeds.",
    "",
  )

  return `${lines.join("\n").trimEnd()}\n`
}

export function renderEvidenceConsoleSummary(
  report: EvidenceAuditReport,
): string {
  const midpointRangeFailureCount = report.instrumentEvidence.instruments.reduce(
    (sum, instrument) =>
      sum +
      instrument.axisSeparation.itemsFailingMidpointRangeGate.length,
    0,
  )
  const invariance = report.responseEvidence.presentationInvariance
  const copy = report.copyAudit.advisory

  return [
    "Deterministic evidence audit complete.",
    `Instrument banks: ${report.instrumentEvidence.instruments.length} ` +
      `(${report.instrumentEvidence.instruments.filter((entry) => entry.descriptor.generation === "current").length} current, ` +
      `${report.instrumentEvidence.instruments.filter((entry) => entry.descriptor.generation === "legacy").length} legacy).`,
    `Items failing the declared-axis midpoint/range gate: ${midpointRangeFailureCount}.`,
    `Response fixtures: ${report.fixtureBaseline.actualResponseRecordCount}; ` +
      `baseline ${report.fixtureBaseline.matches ? "matches" : "DIFFERS"}.`,
    `Presentation-invariance records: ${invariance.length}; generation fails closed on any semantic-answer, result-contract, or scenario-order mismatch.`,
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
        "Generation",
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
          instrument.descriptor.generation,
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
  const geometryRows: Array<Array<string | number>> = []
  const duplicateVectorRows: Array<Array<string | number>> = []

  for (const instrument of evidence.instruments) {
    for (const item of instrument.axisSeparation.items) {
      for (const optionSet of item.optionSets) {
        const optionSetLabel =
          `${optionSet.source} (${optionSet.effectiveModes.join(", ")})`
        duplicateVectorRows.push([
          instrument.descriptor.key,
          instrument.descriptor.generation,
          item.itemId,
          optionSetLabel,
          optionSet.duplicateCompleteOptionVectors.length > 0
            ? optionSet.duplicateCompleteOptionVectors
                .map(
                  (group) =>
                    `${group.optionIds.join(", ")} => ${stableCompactJson(group.signals)}`,
                )
                .join("; ")
            : "none",
        ])
        for (const axis of optionSet.axes) {
          geometryRows.push([
            instrument.descriptor.key,
            instrument.descriptor.generation,
            item.itemId,
            optionSetLabel,
            axis.axis,
            axis.optionCount,
            axis.distinctSignalValueCount,
            axis.nonMidpointOptionCount,
            axis.missingSignalCount,
            axis.duplicateSignalValueCount,
            axis.soleMinimum ? "yes" : "no",
            axis.soleMaximum ? "yes" : "no",
            axis.passesMidpointRangeGate ? "passes" : "fails",
          ])
        }
      }
    }
  }

  lines.push(
    "## Declared-axis midpoint/range gate",
    "",
    "The Foundation bank is outside this gate because it does not declare item-level discriminating axes under the current instrument contract.",
    "",
    "For every declared axis in every effective option set, the authored gate checks only:",
    "",
    "- at least one signal strictly below the policy midpoint;",
    "- at least one signal strictly above the policy midpoint; and",
    "- total range at least the authored minimum.",
    "",
    "An item appears in the failure column when any declared axis in any effective option set fails midpoint straddle or minimum range. Passing does not establish validity, reliability, or psychometric discrimination.",
    "",
    markdownTable(
      [
        "Bank",
        "Generation",
        "Policy",
        "Reviewed items",
        "Items failing midpoint-straddle or minimum-range requirements",
      ],
      evidence.instruments.map((instrument) => [
        instrument.descriptor.key,
        instrument.descriptor.generation,
        instrument.axisSeparation.policy
          ? `midpoint ${instrument.axisSeparation.policy.midpoint}; minimum range ${instrument.axisSeparation.policy.minimumSpread}`
          : "not declared / not applicable",
        instrument.axisSeparation.items.filter(
          (item) =>
            item.status === "reviewed-option-signals" ||
            item.status === "direct-likert-scale",
        ).length,
        instrument.axisSeparation.itemsFailingMidpointRangeGate.join(", ") ||
          "none",
      ]),
    ),
    "",
    "### Descriptive declared-axis option geometry",
    "",
    "Missing signals are counted explicitly and use the policy midpoint for the gate and geometry summaries. Duplicate signal values count options beyond the first occurrence of each exact value. Sole minimum/maximum flags identify whether one option alone occupies that extreme. These are non-blocking review aids.",
    "",
    markdownTable(
      [
        "Bank",
        "Generation",
        "Item",
        "Effective option set",
        "Axis",
        "Options",
        "Distinct signal values",
        "Non-midpoint options",
        "Missing signals",
        "Duplicate signal values",
        "Sole minimum",
        "Sole maximum",
        "Midpoint/range gate",
      ],
      geometryRows,
    ),
    "",
    "### Duplicate complete option vectors",
    "",
    "Complete vectors cover every axis in the instrument axis universe; missing components use the policy midpoint. Exact duplicate groups are reported descriptively and do not create a new gate.",
    "",
    markdownTable(
      [
        "Bank",
        "Generation",
        "Item",
        "Effective option set",
        "Duplicate complete-vector groups",
      ],
      duplicateVectorRows,
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
        "Generation",
        "Actor-role leader",
        "Actor undeclared",
        "Theater leader",
        "Theater undeclared",
        "Perspective-tag leader",
        "Knowledge-load leader",
      ],
      evidence.instruments.map((instrument) => [
        instrument.descriptor.key,
        instrument.descriptor.generation,
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
  const secondaryChoiceRows: Array<Array<string | number>> = []

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
      } else if (fixture.kind === "axis-direction") {
        directionalRows.push(row)
      } else {
        const construction = fixture.secondaryChoiceConstruction
        secondaryChoiceRows.push([
          ...row,
          construction?.eligibleItemCount ?? 0,
          construction?.secondaryFieldCount ?? 0,
          construction?.skippedSecondaryItems.length
            ? construction.skippedSecondaryItems
                .map(({ itemId, reason }) => `${itemId}: ${reason}`)
                .join("; ")
            : "none",
        ])
      }
    }
  }

  lines.push(
    "## Response-style results",
    "",
    "These rows come from deterministic mechanical fixtures; no human respondent data is used. They test scorer behavior under constructed answer patterns. They do not establish validity, reliability, prevalence, or representativeness.",
    "",
    markdownTable(
      [
        "Instrument tuple",
        "Generation",
        "Fixture",
        "Outcome",
        "Score range",
      ],
      responseRows,
    ),
    "",
    "### Analyst secondary/backup-choice stress fixtures",
    "",
    "Eligible analyst tuples add three structural fixtures over complete vectors centered at the instrument midpoint. A fixed primary is chosen from options with both positive and negative cosine-similarity partners where possible. The reinforcing fixture uses the most positively aligned distinct option; the competing fixture uses the most negatively opposed distinct option. If a sign is unavailable, that item's secondary is omitted and disclosed rather than mislabeled. Ties follow authored option order. The JSON artifact records each semantic ID, similarity review, and omission reason. Standard-mode tuples remain primary-only.",
    "",
    markdownTable(
      [
        "Instrument tuple",
        "Generation",
        "Fixture",
        "Outcome",
        "Score range",
        "Eligible items",
        "Secondary fields",
        "Skipped secondary/backup items",
      ],
      secondaryChoiceRows,
    ),
    "",
    "### Named directional fixtures",
    "",
    markdownTable(
      [
        "Instrument tuple",
        "Generation",
        "Fixture",
        "Outcome",
        "Score range",
      ],
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
    "For analyst tuples, matching semantic answer-ID digests and secondary-choice counts indicate that the same semantic secondary IDs were preserved across both presentation seeds.",
    "",
    `Fixture baseline digest: \`${baseline.actualDigest}\` — ` +
      `${baseline.matches ? "matches" : "does not match"} the checked-in baseline.`,
    "",
    markdownTable(
      [
        "Generation",
        "Instrument",
        "Mode",
        "Bank / scorer",
        "Seed A",
        "Seed B",
        "Changed option sets / total option sets",
        "Semantic secondary-choice count",
        "Semantic answer-ID digests",
        "Result-contract digests",
        "Scenario-order digests",
      ],
      report.responseEvidence.presentationInvariance.map((entry) => [
        entry.legacy ? "legacy" : "current",
        entry.instrument,
        entry.mode,
        `${entry.bankVersion === null ? "bank n/a" : `bank ${entry.bankVersion}`} / scorer ${entry.scoringVersion}`,
        entry.seeds[0],
        entry.seeds[1],
        `${entry.changedPresentationQuestions} of ${entry.presentationQuestionCount} option sets changed visible order`,
        formatSemanticSecondaryChoiceCount(entry),
        formatDigestEquality(entry.semanticAnswersDigests),
        formatDigestEquality(entry.resultContractDigests),
        entry.scenarioSequenceDigests
          ? formatDigestEquality(entry.scenarioSequenceDigests)
          : "not applicable",
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

export function formatDigestEquality(digests: readonly [string, string]) {
  const operator = digests[0] === digests[1] ? "=" : "≠"
  return `\`${digests[0]}\` ${operator} \`${digests[1]}\``
}

function formatSemanticSecondaryChoiceCount(
  entry: EvidenceResponseFixtureReport["presentationInvariance"][number],
) {
  if (entry.mode !== "analyst") return "not applicable"
  const [first, second] = entry.semanticSecondaryChoiceCounts
  if (first !== second) return `${first} ≠ ${second}`
  if (entry.semanticAnswersDigests[0] !== entry.semanticAnswersDigests[1]) {
    return `${first}; preservation not established`
  }
  return `${first} preserved`
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
