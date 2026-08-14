import test from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { compareEvidenceStrings } from "@/scripts/evidence-utils.mts"
import { compareCodeUnitStrings } from "@/scripts/code-unit-order.mjs"

const projectRoot = resolve(import.meta.dirname, "..")
const auditScript = resolve(projectRoot, "scripts/audit-public-copy.mjs")

type AuditFinding = {
  priority: string
  audience: string
  rule: string
  file: string
  line: number
  context: string
  matched: string
  reason: string
  action: string
  strict: boolean
}

function runAudit(): AuditReport {
  const result = spawnSync(
    process.execPath,
    [auditScript, "--format=json"],
    { cwd: projectRoot, encoding: "utf8" },
  )

  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout) as AuditReport
}

type AuditReport = {
  targets: string[]
  findings: AuditFinding[]
}

test("public-copy audit covers active content roots and emits editorial context", () => {
  const report = runAudit()

  for (const target of [
    "app",
    "components",
    "lib",
    "content/instrument",
    "content/current-cases",
    "content/archetypes.json",
    "content/archetype-evidence.json",
    "content/explore",
    "content/locales",
    "messages",
    "i18n",
  ]) {
    assert.ok(report.targets.includes(target), `missing copy-audit target: ${target}`)
  }

  for (const finding of report.findings) {
    assert.match(finding.context, /^(?:route|content-key|frozen-compatibility):/)
    assert.ok(finding.matched.length > 0)
    assert.ok(finding.reason.length > 0)
    assert.ok(finding.action.length > 0)
  }
})

test("operational and frozen compatibility findings cannot fail strict mode", () => {
  const result = spawnSync(
    process.execPath,
    [auditScript, "--strict", "--format=json"],
    { cwd: projectRoot, encoding: "utf8" },
  )

  assert.equal(result.status, 0, result.stderr)
  const report = JSON.parse(result.stdout) as AuditReport
  const nonPublic = report.findings.filter((finding) =>
    ["operational", "frozen", "editorial-source"].includes(finding.audience),
  )

  assert.ok(nonPublic.length > 0)
  assert.ok(nonPublic.every((finding) => finding.strict === false))
})

test("active controlled-beta language is not mistaken for stale release history", () => {
  const report = runAudit()
  const betaReleaseFindings = report.findings.filter((finding) =>
    finding.reason.startsWith("Release and schema-era labels") &&
    (
      finding.context.includes("beta") ||
      finding.matched.toLowerCase() === "beta"
    ),
  )

  assert.deepEqual(betaReleaseFindings, [])
})

test("reader-facing copy makes no unsupported population-frequency claims", () => {
  const report = runAudit()
  const unsupported = report.findings.filter(
    (finding) =>
      finding.audience === "public" &&
      finding.rule === "unsupported-prevalence-language",
  )

  assert.deepEqual(
    unsupported.map((finding) => `${finding.file}: ${finding.matched}`),
    [],
  )

  const readerVisibleCompatibilityCopy = [
    "lib/futures/trajectories.ts",
    "lib/atlas-lite.ts",
    "lib/modules/security-v21.ts",
    "lib/modules/technology-v21.ts",
  ]
    .map((file) => readFileSync(resolve(projectRoot, file), "utf8"))
    .join("\n")

  assert.doesNotMatch(
    readerVisibleCompatibilityCopy,
    /\bmost (?:people|cases|answer patterns)\b/i,
  )
})

test("public-copy audit is read-only and keeps every required advisory detector", () => {
  const source = readFileSync(auditScript, "utf8")

  assert.doesNotMatch(
    source,
    /\b(?:writeFile|appendFile|rename|unlink|rm|copyFile)\b/,
  )

  for (const rule of [
    "sits-between-template",
    "keeps-in-play-template",
    "pulls-clear-template",
    "what-matters-most-template",
    "you-generally-believe-template",
    "deeper-danger-template",
    "stronger-path-template",
    "unsupported-prevalence-language",
    "general-prevalence-language-review",
    "repeated-abstract-map-language",
    "repeated-sentence-opening",
    "repeated-adjacent-opening",
    "repeated-three-part-list",
    "repeated-adjacent-three-part-list",
  ]) {
    assert.match(source, new RegExp(`id: "${rule}"`), `missing detector: ${rule}`)
  }
})

test("public-copy ordering matches the evidence code-unit comparator", () => {
  const values = [
    "é",
    "alpha_beta",
    "z",
    "😀",
    "a",
    "ä",
    "alpha-beta",
    "Z",
    "e\u0301",
    "A",
  ]

  assert.deepEqual(
    [...values].sort(compareCodeUnitStrings),
    [...values].sort(compareEvidenceStrings),
  )
  assert.deepEqual(
    [...values].sort(compareCodeUnitStrings),
    [
      "A",
      "Z",
      "a",
      "alpha-beta",
      "alpha_beta",
      "e\u0301",
      "z",
      "ä",
      "é",
      "😀",
    ],
  )
  assert.doesNotMatch(readFileSync(auditScript, "utf8"), /localeCompare/)
})

test("public-copy audit output is byte-stable and code-unit sorted", () => {
  const run = () => spawnSync(
    process.execPath,
    [auditScript, "--format=json"],
    { cwd: projectRoot, encoding: "utf8" },
  )
  const first = run()
  const second = run()

  assert.equal(first.status, 0, first.stderr)
  assert.equal(second.status, 0, second.stderr)
  assert.equal(second.stdout, first.stdout)

  const report = JSON.parse(first.stdout) as AuditReport
  const findingKey = (finding: AuditFinding) =>
    `${finding.priority}\0${finding.file}\0${finding.line}\0${finding.rule}`
  const expected = [...report.findings].sort((left, right) =>
    compareCodeUnitStrings(left.priority, right.priority) ||
    compareCodeUnitStrings(left.file, right.file) ||
    left.line - right.line ||
    compareCodeUnitStrings(left.rule, right.rule),
  )

  assert.deepEqual(
    report.findings.map(findingKey),
    expected.map(findingKey),
  )
})
