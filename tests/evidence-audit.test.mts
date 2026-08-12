import test from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import {
  cpSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readlinkSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { resolve } from "node:path"
import { spawnSync } from "node:child_process"
import securityBank from "@/content/instrument/security.v3.json" with {
  type: "json",
}
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { validateSupportedInstrumentBank } from "@/scripts/evidence-bank-validation.mts"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { buildEvidenceResponseFixtureReport, EVIDENCE_RANDOM_SEED } from "@/scripts/evidence-response-fixtures.mts"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { EVIDENCE_ARTIFACT_SCHEMA_VERSION, hashJson } from "@/scripts/evidence-utils.mts"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { buildEvidenceAuditReport, formatDigestEquality, renderEvidenceMarkdown } from "@/scripts/evidence-report.mts"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { checkEvidenceArtifactBytes, generateEvidenceArtifactBytes } from "@/scripts/evidence-audit.mts"

const projectRoot = resolve(import.meta.dirname, "..")
const auditScript = resolve(projectRoot, "scripts/evidence-audit.mts")
const aliasLoader = resolve(projectRoot, "tests/register-alias-loader.mjs")
const artifactJsonPath = resolve(
  projectRoot,
  "artifacts/evidence/current-summary.json",
)
const artifactMarkdownPath = resolve(
  projectRoot,
  "artifacts/evidence/current-summary.md",
)
const baselinePath = resolve(
  projectRoot,
  "tests/fixtures/evidence-audit-baseline.json",
)

type BuiltEvidenceReport = Awaited<
  ReturnType<typeof buildEvidenceAuditReport>
>
let freshReportsPromise: Promise<
  [BuiltEvidenceReport, BuiltEvidenceReport]
> | undefined

function buildTwoFreshReports() {
  freshReportsPromise ??= Promise.all([
    buildEvidenceAuditReport(projectRoot),
    buildEvidenceAuditReport(projectRoot),
  ])
  return freshReportsPromise
}

type Baseline = {
  schemaVersion: number
  advisoryCopyAudit: {
    priority: string
    entries: Array<{ fingerprint: string; count: number }>
  }
  responseFixture: {
    seed: number
    digest: string
    responseRecordCount: number
    invarianceRecordCount: number
  }
}

type ArtifactReport = {
  schemaVersion: number
  deterministicMethod: {
    absolutePaths: string
    network: string
    externalModels: string
    database: string
    randomSeed: number
    timestamps: string
    writes: string[]
  }
  instrumentEvidence: {
    schemaVersion: number
    instruments: Array<{
      descriptor: {
        key: string
        generation: "current" | "legacy"
        bankVersion: number | null
      }
    }>
    textReuseByGeneration: {
      current: unknown
      legacy: unknown
    }
  }
  responseEvidence: ReturnType<
    typeof buildEvidenceResponseFixtureReport
  >
  fixtureBaseline: {
    matches: boolean
  }
  copyAudit: {
    advisory: {
      baselineCount: number
      unchangedCount: number
      newCount: number
      newFindings: unknown[]
    }
  }
}

test("evidence audit exposes separate writer and read-only check commands", () => {
  const packageJson = JSON.parse(
    readFileSync(resolve(projectRoot, "package.json"), "utf8"),
  ) as { scripts?: Record<string, string> }
  assert.equal(
    packageJson.scripts?.["evidence:audit"],
    "node --experimental-strip-types --import ./tests/register-alias-loader.mjs scripts/evidence-audit.mts",
  )
  assert.equal(
    packageJson.scripts?.["evidence:audit:check"],
    "node --experimental-strip-types --import ./tests/register-alias-loader.mjs scripts/evidence-audit.mts --check",
  )
})

test("committed evidence artifacts exactly equal two consecutive in-memory generations", async () => {
  const [firstReport, secondReport] = await buildTwoFreshReports()
  const first = generateEvidenceArtifactBytes(firstReport)
  const second = generateEvidenceArtifactBytes(secondReport)

  assert.ok(first.markdown.equals(second.markdown))
  assert.ok(first.json.equals(second.json))
  assert.ok(
    first.markdown.equals(readFileSync(artifactMarkdownPath)),
    "committed Markdown evidence is stale",
  )
  assert.ok(
    first.json.equals(readFileSync(artifactJsonPath)),
    "committed JSON evidence is stale",
  )
})

test("public evidence schemas are pinned to version 2", async () => {
  const [report] = await buildTwoFreshReports()
  const artifact = JSON.parse(
    readFileSync(artifactJsonPath, "utf8"),
  ) as ArtifactReport

  assert.equal(EVIDENCE_ARTIFACT_SCHEMA_VERSION, 2)
  assert.equal(report.schemaVersion, 2)
  assert.equal(report.instrumentEvidence.schemaVersion, 2)
  assert.equal(report.responseEvidence.schemaVersion, 2)
  assert.equal(artifact.schemaVersion, 2)
  assert.equal(artifact.instrumentEvidence.schemaVersion, 2)
  assert.equal(artifact.responseEvidence.schemaVersion, 2)
  assert.equal(readBaseline().schemaVersion, 2)
})

test("check mode writes neither evidence artifacts nor the evidence baseline", () => {
  const beforeProtected = snapshotProtectedInputs()
  const beforeArtifacts = snapshotFiles([
    artifactMarkdownPath,
    artifactJsonPath,
    baselinePath,
  ])

  const result = spawnSync(
    process.execPath,
    [
      "--experimental-strip-types",
      "--import",
      aliasLoader,
      auditScript,
      "--check",
    ],
    {
      cwd: projectRoot,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
      timeout: 60_000,
    },
  )

  assert.deepEqual(snapshotProtectedInputs(), beforeProtected)
  assert.deepEqual(
    snapshotFiles([
      artifactMarkdownPath,
      artifactJsonPath,
      baselinePath,
    ]),
    beforeArtifacts,
  )
  assert.equal(result.status, 0, result.stderr)
  assert.match(
    result.stdout,
    /match freshly generated UTF-8 bytes/u,
  )
})

test("an intentionally altered scratch evidence artifact is detected as stale", async () => {
  const scratchRoot = mkdtempSync(
    resolve(tmpdir(), "ir-evidence-audit-check-"),
  )
  try {
    const outputDirectory = resolve(scratchRoot, "artifacts/evidence")
    mkdirSync(outputDirectory, { recursive: true })
    const [report] = await buildTwoFreshReports()
    const generated = generateEvidenceArtifactBytes(
      report,
    )
    writeFileSync(
      resolve(outputDirectory, "current-summary.md"),
      generated.markdown,
    )
    writeFileSync(
      resolve(outputDirectory, "current-summary.json"),
      generated.json,
    )

    assert.deepEqual(
      await checkEvidenceArtifactBytes(generated, scratchRoot),
      { matches: true, mismatches: [] },
    )
    writeFileSync(
      resolve(outputDirectory, "current-summary.md"),
      Buffer.concat([
        generated.markdown,
        Buffer.from("scratch alteration\n", "utf8"),
      ]),
    )
    assert.deepEqual(
      await checkEvidenceArtifactBytes(generated, scratchRoot),
      {
        matches: false,
        mismatches: [
          {
            path: "artifacts/evidence/current-summary.md",
            reason: "stale",
          },
        ],
      },
    )
  } finally {
    rmSync(scratchRoot, { recursive: true, force: true })
  }
})

test("CI check command is read-only and rejects stale or missing scratch artifacts", () => {
  const scratchRoot = mkdtempSync(
    resolve(tmpdir(), "ir-evidence-audit-cli-check-"),
  )
  const realEvidenceBefore = snapshotFiles([
    artifactMarkdownPath,
    artifactJsonPath,
    baselinePath,
  ])

  try {
    for (const directory of [
      "app",
      "artifacts",
      "components",
      "content",
      "i18n",
      "lib",
      "messages",
      "scripts",
      "tests",
    ]) {
      cpSync(resolve(projectRoot, directory), resolve(scratchRoot, directory), {
        recursive: true,
      })
    }
    cpSync(
      resolve(projectRoot, "package.json"),
      resolve(scratchRoot, "package.json"),
    )
    symlinkSync(
      resolve(projectRoot, "node_modules"),
      resolve(scratchRoot, "node_modules"),
    )

    const scratchMarkdown = resolve(
      scratchRoot,
      "artifacts/evidence/current-summary.md",
    )
    const scratchJson = resolve(
      scratchRoot,
      "artifacts/evidence/current-summary.json",
    )
    const cleanMarkdown = readFileSync(scratchMarkdown)

    const cleanBefore = snapshotTree(scratchRoot)
    const clean = runEvidenceAuditCheckCommand(scratchRoot)
    assert.equal(clean.status, 0, clean.stderr)
    assert.match(clean.stdout, /match freshly generated UTF-8 bytes/u)
    assert.deepEqual(snapshotTree(scratchRoot), cleanBefore)

    writeFileSync(
      scratchMarkdown,
      Buffer.concat([
        cleanMarkdown,
        Buffer.from("scratch alteration\n", "utf8"),
      ]),
    )
    const staleBefore = snapshotTree(scratchRoot)
    const stale = runEvidenceAuditCheckCommand(scratchRoot)
    assert.notEqual(stale.status, 0)
    assert.match(
      `${stale.stdout}\n${stale.stderr}`,
      /artifacts\/evidence\/current-summary\.md: stale/u,
    )
    assert.deepEqual(snapshotTree(scratchRoot), staleBefore)

    writeFileSync(scratchMarkdown, cleanMarkdown)
    rmSync(scratchJson)
    const missingBefore = snapshotTree(scratchRoot)
    const missing = runEvidenceAuditCheckCommand(scratchRoot)
    assert.notEqual(missing.status, 0)
    assert.match(
      `${missing.stdout}\n${missing.stderr}`,
      /artifacts\/evidence\/current-summary\.json: missing/u,
    )
    assert.deepEqual(snapshotTree(scratchRoot), missingBefore)

    assert.deepEqual(
      snapshotFiles([
        artifactMarkdownPath,
        artifactJsonPath,
        baselinePath,
      ]),
      realEvidenceBefore,
    )
  } finally {
    rmSync(scratchRoot, { recursive: true, force: true })
  }
})

test("evidence report declares its bounded deterministic method", async () => {
  const [report] = await buildTwoFreshReports()
  assert.deepEqual(report.deterministicMethod, {
    absolutePaths: "omitted",
    database: "not-used",
    externalModels: "not-used",
    network: "not-used",
    randomSeed: EVIDENCE_RANDOM_SEED,
    timestamps: "omitted",
    writes: [
      "artifacts/evidence/current-summary.md",
      "artifacts/evidence/current-summary.json",
    ],
  })
  assert.equal(report.copyAudit.advisory.unchangedCount > 0, true)
  assert.ok(
    report.copyAudit.advisory.unchangedCount <=
      report.copyAudit.advisory.baselineCount,
  )
  assert.ok(
    report.copyAudit.advisory.newFindings.length <=
      report.copyAudit.advisory.newCount,
  )
})

test("every core evidence-generator module appears in the source manifest exactly once", async () => {
  const [report] = await buildTwoFreshReports()
  const expectedRoles = {
    "lib/option-order.ts": "scoring-runtime",
    "scripts/code-unit-order.mjs": "copy-audit",
    "scripts/evidence-audit.mts": "evidence-entrypoint",
    "scripts/evidence-bank-validation.mts": "evidence-bank-validation",
    "scripts/evidence-copy-delta.mts": "evidence-copy-delta",
    "scripts/evidence-instrument-analysis.mts":
      "evidence-instrument-analysis",
    "scripts/evidence-report.mts": "evidence-renderer",
    "scripts/evidence-response-fixtures.mts":
      "evidence-response-fixtures",
    "scripts/evidence-utils.mts": "evidence-canonicalization",
  } as const
  const paths = report.sources.map(({ path }) => path)

  assert.equal(new Set(paths).size, paths.length)
  for (const [path, category] of Object.entries(expectedRoles)) {
    const matches = report.sources.filter((source) => source.path === path)
    assert.equal(matches.length, 1, `${path} must appear exactly once`)
    assert.equal(matches[0]?.category, category)
  }
})

test("digest equality rendering is truthful for equal and unequal inputs", () => {
  assert.equal(
    formatDigestEquality(["same", "same"]),
    "`same` = `same`",
  )
  const unequal = formatDigestEquality(["left", "right"])
  assert.equal(unequal, "`left` ≠ `right`")
  assert.doesNotMatch(unequal, / = /u)
})

test("Markdown uses precise gate, generation, invariance, and synthetic-fixture language", async () => {
  const [report] = await buildTwoFreshReports()
  const markdown = renderEvidenceMarkdown(report)
  const artifactFacing = JSON.stringify(report)

  assert.match(markdown, /## Declared-axis midpoint\/range gate/u)
  assert.match(
    markdown,
    /at least one signal strictly below the policy midpoint/u,
  )
  assert.match(
    markdown,
    /any declared axis in any effective option set fails/u,
  )
  assert.doesNotMatch(markdown, /meaningfully separated/iu)
  assert.doesNotMatch(artifactFacing, /MeaningfullySeparated/u)
  assert.match(markdown, /\| Bank \| Generation \| Option sets \|/u)
  assert.match(markdown, /\| Bank \| Generation \| Policy \|/u)
  assert.match(
    markdown,
    /\| Bank \| Generation \| Actor-role leader \|/u,
  )
  assert.match(markdown, /no human respondent data is used/u)
  assert.match(
    markdown,
    /They do not establish validity, reliability, prevalence, or representativeness/u,
  )
  assert.doesNotMatch(markdown, /\| Cohort \|/u)
  assert.match(markdown, /Semantic answer-ID digests/u)
  assert.match(markdown, /Result-contract digests/u)
  assert.match(markdown, /Scenario-order digests/u)
  assert.doesNotMatch(markdown, /digests A = B/u)
  assert.doesNotMatch(artifactFacing, /"passed":/u)
})

test("Markdown restores the invariance denominator and analyst secondary-choice evidence", async () => {
  const [report] = await buildTwoFreshReports()
  const markdown = renderEvidenceMarkdown(report)

  assert.match(
    markdown,
    /14 of 15 option sets changed visible order/u,
  )
  assert.match(markdown, /Semantic secondary-choice count/u)
  assert.match(markdown, /\| analyst \|[^\n]*\| 15 preserved \|/u)
  assert.match(markdown, /\| standard \|[^\n]*\| not applicable \|/u)
  assert.doesNotMatch(markdown, /always-yes pass/iu)
})

test("Markdown states why Foundation is outside the declared-axis gate", async () => {
  const [report] = await buildTwoFreshReports()
  const markdown = renderEvidenceMarkdown(report)

  assert.match(
    markdown,
    /The Foundation bank is outside this gate because it does not declare item-level discriminating axes under the current instrument contract\./u,
  )
})

test("response fixture output is deterministic and matches its checked-in baseline", () => {
  const first = buildEvidenceResponseFixtureReport()
  const second = buildEvidenceResponseFixtureReport()
  const baseline = readBaseline()
  const payload = {
    cohorts: first.cohorts,
    presentationInvariance: first.presentationInvariance,
  }
  const responseRecordCount = first.cohorts.reduce(
    (sum, cohort) => sum + cohort.fixtures.length,
    0,
  )

  assert.deepEqual(second, first)
  assert.equal(first.randomSeed, EVIDENCE_RANDOM_SEED)
  assert.equal(responseRecordCount, 320)
  assert.equal(hashJson(payload), baseline.responseFixture.digest)
  assert.equal(
    responseRecordCount,
    baseline.responseFixture.responseRecordCount,
  )
  assert.equal(
    first.presentationInvariance.length,
    baseline.responseFixture.invarianceRecordCount,
  )

  for (const cohort of first.cohorts) {
    const names = new Set(cohort.fixtures.map((fixture) => fixture.name))
    for (const name of [
      "all-minimum",
      "all-maximum",
      "midpoint",
      "always-first",
      "always-last",
      "alternating",
      "seeded-random-20260728",
    ]) {
      assert.ok(names.has(name), `${cohort.key} missing ${name}`)
    }
    assert.ok(
      cohort.fixtures.some((fixture) => fixture.kind === "axis-direction"),
      `${cohort.key} has no named directional fixture`,
    )
  }
})

test("unsupported instrument item fields fail closed before analysis", () => {
  const mutated = structuredClone(securityBank) as unknown as {
    items: Array<Record<string, unknown>>
  }
  mutated.items[0].unsupportedEvidenceField = true

  assert.throws(
    () =>
      validateSupportedInstrumentBank(
        mutated,
        "synthetic security bank",
      ),
    /unsupported field: "unsupportedEvidenceField"/u,
  )
})

test("presentation order cannot change scores for any current or legacy runtime", () => {
  const response = buildEvidenceResponseFixtureReport()

  assert.equal(response.presentationInvariance.length, 16)
  for (const evidence of response.presentationInvariance) {
    assert.equal("passed" in evidence, false, evidence.cohortKey)
    assert.ok(
      evidence.changedPresentationQuestions > 0,
      `${evidence.cohortKey} did not exercise a changed order`,
    )
    assert.deepEqual(
      evidence.semanticAnswersDigests[0],
      evidence.semanticAnswersDigests[1],
      `${evidence.cohortKey} changed semantic primary/secondary IDs`,
    )
    assert.deepEqual(
      evidence.semanticSecondaryChoiceCounts[0],
      evidence.semanticSecondaryChoiceCounts[1],
      `${evidence.cohortKey} changed its secondary-field count`,
    )
    assert.deepEqual(
      evidence.resultContractDigests[0],
      evidence.resultContractDigests[1],
      `${evidence.cohortKey} changed its result contract`,
    )
    for (const digest of [
      ...evidence.semanticAnswersDigests,
      ...evidence.resultContractDigests,
      ...(evidence.scenarioSequenceDigests ?? []),
    ]) {
      assert.match(digest, /^[0-9a-f]{64}$/u)
    }
    if (evidence.scenarioSequenceDigests) {
      assert.equal(
        evidence.scenarioSequenceDigests[0],
        evidence.scenarioSequenceDigests[1],
        `${evidence.cohortKey} changed scenario order`,
      )
      assert.deepEqual(
        evidence.scenarioSequences?.[0],
        evidence.scenarioSequences?.[1],
      )
    }
  }
})

test("every eligible analyst tuple has primary-only, reinforcing, and competing secondary-choice fixtures", () => {
  const response = buildEvidenceResponseFixtureReport()
  const eligibleAnalystTuples = response.cohorts.filter((cohort) =>
    cohort.fixtures.some(
      (fixture) => fixture.kind === "secondary-choice",
    ),
  )

  assert.equal(eligibleAnalystTuples.length, 8)
  assert.equal(
    eligibleAnalystTuples.filter((cohort) => cohort.legacy).length,
    4,
  )
  assert.equal(
    eligibleAnalystTuples.filter((cohort) => !cohort.legacy).length,
    4,
  )

  let eligibleSelectionCount = 0
  let reinforcingSecondaryCount = 0
  let competingSecondaryCount = 0

  for (const cohort of eligibleAnalystTuples) {
    assert.equal(cohort.mode, "analyst", cohort.key)
    const fixtures = cohort.fixtures.filter(
      (fixture) => fixture.kind === "secondary-choice",
    )
    assert.deepEqual(
      fixtures.map(
        (fixture) => fixture.secondaryChoiceConstruction?.strategy,
      ).sort(),
      ["competing", "primary-only", "reinforcing"],
      cohort.key,
    )
    const fixtureByStrategy = Object.fromEntries(
      fixtures.map((fixture) => [
        fixture.secondaryChoiceConstruction?.strategy,
        fixture,
      ]),
    )
    const primaryOnly = fixtureByStrategy["primary-only"]
      .secondaryChoiceConstruction
    const reinforcing = fixtureByStrategy.reinforcing
      .secondaryChoiceConstruction
    const competing = fixtureByStrategy.competing
      .secondaryChoiceConstruction
    assert.ok(primaryOnly)
    assert.ok(reinforcing)
    assert.ok(competing)
    eligibleSelectionCount += primaryOnly.eligibleItemCount
    reinforcingSecondaryCount += reinforcing.secondaryFieldCount
    competingSecondaryCount += competing.secondaryFieldCount

    for (const fixture of fixtures) {
      const construction = fixture.secondaryChoiceConstruction
      assert.ok(construction, `${cohort.key}/${fixture.name}`)
      assert.ok(construction.eligibleItemCount > 0)
      assert.equal(
        construction.selections.length,
        construction.eligibleItemCount,
      )
      if (construction.strategy === "primary-only") {
        assert.equal(construction.secondaryFieldCount, 0)
        assert.deepEqual(construction.skippedSecondaryItems, [])
      } else {
        assert.ok(construction.secondaryFieldCount > 0)
        assert.equal(
          construction.skippedSecondaryItems.length,
          construction.eligibleItemCount -
            construction.secondaryFieldCount,
        )
      }
      for (const selection of construction.selections) {
        assert.ok(selection.primaryOptionId)
        assert.equal(
          selection.similarityReview.metric,
          "centered-cosine",
        )
        if (construction.strategy === "primary-only") {
          assert.equal(selection.secondaryOptionId, undefined)
          assert.equal(
            selection.similarityReview.selectedSecondarySimilarity,
            undefined,
          )
        } else {
          if (selection.secondaryOptionId) {
            assert.notEqual(
              selection.primaryOptionId,
              selection.secondaryOptionId,
            )
            const similarity =
              selection.similarityReview.selectedSecondarySimilarity
            assert.equal(typeof similarity, "number")
            if (construction.strategy === "reinforcing") {
              assert.ok((similarity ?? 0) > 0)
              assert.equal(
                similarity,
                selection.similarityReview.candidateMaximum,
              )
              assert.equal(
                selection.similarityReview.selectedRelationship,
                "aligned",
              )
            } else {
              assert.ok((similarity ?? 0) < 0)
              assert.equal(
                similarity,
                selection.similarityReview.candidateMinimum,
              )
              assert.equal(
                selection.similarityReview.selectedRelationship,
                "opposed",
              )
            }
          } else {
            assert.equal(construction.strategy, "competing")
            assert.equal(
              selection.similarityReview.hasAlignedAndOpposedCandidates,
              false,
            )
            assert.ok(
              construction.skippedSecondaryItems.some(
                ({ itemId, reason }) =>
                  itemId === selection.itemId &&
                  reason === "no-negatively-opposed-candidate",
              ),
            )
          }
        }
      }
    }

    for (const [index, primarySelection] of
      primaryOnly.selections.entries()) {
      const reinforcingSelection = reinforcing.selections[index]
      const competingSelection = competing.selections[index]
      assert.equal(
        reinforcingSelection.itemId,
        primarySelection.itemId,
      )
      assert.equal(
        competingSelection.itemId,
        primarySelection.itemId,
      )
      assert.equal(
        reinforcingSelection.primaryOptionId,
        primarySelection.primaryOptionId,
      )
      assert.equal(
        competingSelection.primaryOptionId,
        primarySelection.primaryOptionId,
      )
      if (
        reinforcingSelection.secondaryOptionId &&
        competingSelection.secondaryOptionId
      ) {
        assert.ok(
          (reinforcingSelection.similarityReview
            .selectedSecondarySimilarity ?? -1) >
            (competingSelection.similarityReview
              .selectedSecondarySimilarity ?? 1),
        )
      }
    }
  }

  assert.equal(eligibleSelectionCount, 110)
  assert.equal(reinforcingSecondaryCount, 110)
  assert.equal(competingSecondaryCount, 108)

  const legacySecurity = eligibleAnalystTuples.find(
    (cohort) => cohort.key === "security:b2:s1:analyst",
  )
  const legacySecurityCompeting = legacySecurity?.fixtures.find(
    (fixture) =>
      fixture.secondaryChoiceConstruction?.strategy === "competing",
  )?.secondaryChoiceConstruction
  assert.equal(legacySecurityCompeting?.secondaryFieldCount, 13)
  assert.deepEqual(
    legacySecurityCompeting?.skippedSecondaryItems.map(
      ({ itemId }) => itemId,
    ),
    ["nuclear_hedging", "selective_enforcement_memory"],
  )

  for (const cohort of response.cohorts.filter(
    (entry) => entry.mode === "standard",
  )) {
    assert.equal(
      cohort.fixtures.some(
        (fixture) => fixture.kind === "secondary-choice",
      ),
      false,
      cohort.key,
    )
    const invariance = response.presentationInvariance.find(
      (entry) => entry.cohortKey === cohort.key,
    )
    assert.deepEqual(invariance?.semanticSecondaryChoiceCounts, [0, 0])
  }
})

test("a known eligible runtime scores the secondary field and changes its result digest", () => {
  const response = buildEvidenceResponseFixtureReport()
  const cohort = response.cohorts.find(
    (entry) => entry.key === "security:b3:s2:analyst",
  )
  assert.ok(cohort)
  const primaryOnly = cohort.fixtures.find(
    (fixture) =>
      fixture.secondaryChoiceConstruction?.strategy === "primary-only",
  )
  const competing = cohort.fixtures.find(
    (fixture) =>
      fixture.secondaryChoiceConstruction?.strategy === "competing",
  )
  assert.ok(primaryOnly)
  assert.ok(competing)
  assert.equal(
    primaryOnly.secondaryChoiceConstruction?.secondaryFieldCount,
    0,
  )
  assert.ok(
    (competing.secondaryChoiceConstruction?.secondaryFieldCount ?? 0) > 0,
  )
  assert.deepEqual(
    competing.secondaryChoiceConstruction?.selections.map(
      ({ itemId, primaryOptionId }) => ({ itemId, primaryOptionId }),
    ),
    primaryOnly.secondaryChoiceConstruction?.selections.map(
      ({ itemId, primaryOptionId }) => ({ itemId, primaryOptionId }),
    ),
    "primary IDs must stay fixed so the result change is attributable to secondary fields",
  )
  assert.notEqual(primaryOnly.answersDigest, competing.answersDigest)
  assert.notEqual(hashJson(primaryOnly.result), hashJson(competing.result))

  const invariance = response.presentationInvariance.find(
    (entry) => entry.cohortKey === cohort.key,
  )
  assert.ok((invariance?.semanticSecondaryChoiceCounts[0] ?? 0) > 0)
  assert.equal(
    invariance?.semanticAnswersDigests[0],
    invariance?.semanticAnswersDigests[1],
  )
})

test("legacy banks remain separate from current-bank evidence", () => {
  const report = JSON.parse(
    readFileSync(artifactJsonPath, "utf8"),
  ) as ArtifactReport
  const current = report.instrumentEvidence.instruments
    .filter(({ descriptor }) => descriptor.generation === "current")
    .map(({ descriptor }) => descriptor.key)
    .sort()
  const legacy = report.instrumentEvidence.instruments
    .filter(({ descriptor }) => descriptor.generation === "legacy")
    .map(({ descriptor }) => descriptor.key)
    .sort()

  assert.deepEqual(current, [
    "ai-governance-bank-v3",
    "foundation-bank-v2",
    "security-bank-v3",
    "technology-bank-v3",
  ])
  assert.deepEqual(legacy, [
    "ai-governance-bank-v2",
    "foundation-scoring-v1",
    "security-bank-v2",
    "technology-bank-v2",
  ])
  assert.equal(
    report.instrumentEvidence.instruments.find(
      ({ descriptor }) => descriptor.key === "foundation-scoring-v1",
    )?.descriptor.bankVersion,
    null,
  )
  assert.ok(report.instrumentEvidence.textReuseByGeneration.current)
  assert.ok(report.instrumentEvidence.textReuseByGeneration.legacy)

  const response = report.responseEvidence
  assert.equal(response.cohorts.filter((cohort) => cohort.legacy).length, 8)
  assert.equal(response.cohorts.filter((cohort) => !cohort.legacy).length, 8)
  assert.equal(report.fixtureBaseline.matches, true)
})

function readBaseline(): Baseline {
  return JSON.parse(readFileSync(baselinePath, "utf8")) as Baseline
}

function snapshotProtectedInputs(): Record<string, string> {
  const files = [
    ...collectFiles(resolve(projectRoot, "app")),
    ...collectFiles(resolve(projectRoot, "components")),
    ...collectFiles(resolve(projectRoot, "content")),
    ...collectFiles(resolve(projectRoot, "i18n")),
    ...collectFiles(resolve(projectRoot, "lib")),
    ...collectFiles(resolve(projectRoot, "messages")),
    ...collectFiles(resolve(projectRoot, "scripts")),
    ...collectFiles(resolve(projectRoot, "tests/fixtures")),
    resolve(projectRoot, "package.json"),
    resolve(projectRoot, "package-lock.json"),
  ].sort()

  return Object.fromEntries(
    files.map((file) => [
      file.slice(projectRoot.length + 1),
      createHash("sha256").update(readFileSync(file)).digest("hex"),
    ]),
  )
}

function snapshotFiles(files: readonly string[]) {
  return Object.fromEntries(
    files.map((file) => {
      const contents = readFileSync(file)
      const stat = statSync(file)
      return [
        file,
        {
          sha256: createHash("sha256").update(contents).digest("hex"),
          size: stat.size,
          mtimeMs: stat.mtimeMs,
        },
      ]
    }),
  )
}

function runEvidenceAuditCheckCommand(projectDirectory: string) {
  return spawnSync("npm", ["run", "evidence:audit:check"], {
    cwd: projectDirectory,
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
    timeout: 120_000,
  })
}

function snapshotTree(root: string): Record<string, unknown> {
  const snapshot: Record<string, unknown> = {}

  function visit(directory: string) {
    const entries = readdirSync(directory, { withFileTypes: true }).sort(
      (left, right) =>
        left.name < right.name ? -1 : left.name > right.name ? 1 : 0,
    )
    for (const entry of entries) {
      const path = resolve(directory, entry.name)
      const relativePath = path.slice(root.length + 1)
      const stat = lstatSync(path)
      if (stat.isSymbolicLink()) {
        snapshot[relativePath] = {
          kind: "symlink",
          target: readlinkSync(path),
        }
      } else if (stat.isDirectory()) {
        snapshot[relativePath] = {
          kind: "directory",
          mtimeMs: stat.mtimeMs,
        }
        visit(path)
      } else {
        const contents = readFileSync(path)
        snapshot[relativePath] = {
          kind: "file",
          sha256: createHash("sha256").update(contents).digest("hex"),
          size: stat.size,
          mtimeMs: stat.mtimeMs,
        }
      }
    }
  }

  visit(root)
  return snapshot
}

function collectFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name)
    return entry.isDirectory() ? collectFiles(path) : [path]
  })
}
