import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"
import test from "node:test"

const projectRoot = resolve(import.meta.dirname, "..")
const evidenceDirectory = resolve(
  projectRoot,
  "docs/research/v23-6-foundation-robustness",
)
const manifestPath = resolve(evidenceDirectory, "current-run.json")
const diagnosticScript = resolve(
  projectRoot,
  "scripts/diagnose-foundation-robustness.mts",
)
const aliasLoader = resolve(projectRoot, "tests/register-alias-loader.mjs")
const protectedPaths = [
  "content/instrument",
  "lib/scoring.ts",
  "lib/scoring",
  "lib/scoring-calibration.ts",
  "lib/archetypes.ts",
  "lib/share.ts",
  "lib/url-payload.ts",
  "package-lock.json",
] as const

type EvidenceManifest = {
  sourceSha: string
  totals: {
    baseVectors: number
    answerPerturbationTrials: number
    postureDimensionTrials: number
  }
  protectedFileDigests: Record<string, string>
  interpretationBoundary: string
}

function sha256(value: Buffer) {
  return createHash("sha256").update(value).digest("hex")
}

function readManifest() {
  return JSON.parse(readFileSync(manifestPath, "utf8")) as EvidenceManifest
}

function evidenceSnapshot() {
  return Object.fromEntries(
    readdirSync(evidenceDirectory)
      .sort()
      .map((file) => [file, sha256(readFileSync(resolve(evidenceDirectory, file)))]),
  )
}

test("package scripts expose writer and read-only Foundation robustness checks", () => {
  const packageJson = JSON.parse(
    readFileSync(resolve(projectRoot, "package.json"), "utf8"),
  ) as { scripts?: Record<string, string> }
  assert.equal(
    packageJson.scripts?.["diagnose:foundation-robustness"],
    "node --experimental-strip-types --import ./tests/register-alias-loader.mjs scripts/diagnose-foundation-robustness.mts",
  )
  assert.equal(
    packageJson.scripts?.["diagnose:foundation-robustness:check"],
    "node --experimental-strip-types --import ./tests/register-alias-loader.mjs scripts/diagnose-foundation-robustness.mts --check",
  )
})

test("accepted manifest pins sample sizes and interpretation boundaries", () => {
  const manifest = readManifest()
  assert.deepEqual(manifest.totals, {
    baseVectors: 3372,
    answerPerturbationTrials: 266177,
    postureDimensionTrials: 6744,
  })
  assert.equal(
    manifest.interpretationBoundary,
    "Structural sensitivity only; no reliability, validity, prevalence, or population inference.",
  )
})

test("protected files match both their recorded digests and the evidence source commit", () => {
  const manifest = readManifest()
  for (const [path, digest] of Object.entries(manifest.protectedFileDigests)) {
    assert.equal(sha256(readFileSync(resolve(projectRoot, path))), digest, path)
  }

  const result = spawnSync(
    "git",
    ["diff", "--exit-code", manifest.sourceSha, "--", ...protectedPaths],
    {
      cwd: projectRoot,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    },
  )
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})

test(
  "check mode regenerates accepted CSV and JSON bytes without rewriting evidence",
  { timeout: 90_000 },
  () => {
    const before = evidenceSnapshot()
    const result = spawnSync(
      process.execPath,
      [
        "--experimental-strip-types",
        "--import",
        aliasLoader,
        diagnosticScript,
        "--check",
      ],
      {
        cwd: projectRoot,
        encoding: "utf8",
        maxBuffer: 8 * 1024 * 1024,
        timeout: 80_000,
      },
    )

    assert.equal(result.status, 0, result.stderr)
    assert.match(
      result.stdout,
      /All 6 generated CSV\/JSON artifacts match accepted bytes/u,
    )
    assert.deepEqual(evidenceSnapshot(), before)
  },
)
