import test from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import {
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs"
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
import { hashJson } from "@/scripts/evidence-utils.mts"

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

test("evidence audit leaves every production, calibration, and fixture input unchanged", () => {
  const packageJson = JSON.parse(
    readFileSync(resolve(projectRoot, "package.json"), "utf8"),
  ) as { scripts?: Record<string, string> }
  assert.equal(
    packageJson.scripts?.["evidence:audit"],
    "node --experimental-strip-types --import ./tests/register-alias-loader.mjs scripts/evidence-audit.mts",
  )

  const before = snapshotProtectedInputs()
  const result = spawnSync(
    process.execPath,
    [
      "--experimental-strip-types",
      "--import",
      aliasLoader,
      auditScript,
      "--format=json",
    ],
    {
      cwd: projectRoot,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
      timeout: 60_000,
    },
  )

  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(snapshotProtectedInputs(), before)
  assert.ok(statSync(artifactJsonPath).isFile())
  assert.ok(statSync(artifactMarkdownPath).isFile())
  assert.equal(readFileSync(artifactJsonPath, "utf8"), result.stdout)

  const report = JSON.parse(result.stdout) as ArtifactReport
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
    assert.equal(evidence.passed, true, evidence.cohortKey)
    assert.ok(
      evidence.changedPresentationQuestions > 0,
      `${evidence.cohortKey} did not exercise a changed order`,
    )
    assert.match(evidence.semanticAnswersDigest, /^[0-9a-f]{64}$/u)
    assert.match(evidence.resultDigest, /^[0-9a-f]{64}$/u)
  }
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

function collectFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name)
    return entry.isDirectory() ? collectFiles(path) : [path]
  })
}
