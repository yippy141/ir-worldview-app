import test from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const projectRoot = resolve(import.meta.dirname, "..")
const auditScript = resolve(projectRoot, "scripts/audit-public-copy.mjs")

type AuditFinding = {
  audience: string
  context: string
  matched: string
  reason: string
  action: string
  strict: boolean
}

type AuditReport = {
  targets: string[]
  findings: AuditFinding[]
}

test("public-copy audit covers active content roots and emits editorial context", () => {
  const result = spawnSync(
    process.execPath,
    [auditScript, "--format=json"],
    { cwd: projectRoot, encoding: "utf8" },
  )

  assert.equal(result.status, 0, result.stderr)
  const report = JSON.parse(result.stdout) as AuditReport

  for (const target of [
    "app",
    "components",
    "lib",
    "content/instrument",
    "content/current-cases",
    "content/archetypes.json",
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
  const result = spawnSync(
    process.execPath,
    [auditScript, "--format=json"],
    { cwd: projectRoot, encoding: "utf8" },
  )

  assert.equal(result.status, 0, result.stderr)
  const report = JSON.parse(result.stdout) as AuditReport
  const betaReleaseFindings = report.findings.filter((finding) =>
    finding.reason.startsWith("Release and schema-era labels") &&
    (
      finding.context.includes("beta") ||
      finding.matched.toLowerCase() === "beta"
    ),
  )

  assert.deepEqual(betaReleaseFindings, [])
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
