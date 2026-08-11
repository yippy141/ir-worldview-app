import { spawnSync } from "node:child_process"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { compareEvidenceStrings, EVIDENCE_ARTIFACT_SCHEMA_VERSION, hashJson } from "@/scripts/evidence-utils.mts"

export type PublicCopyFinding = {
  priority: "P0" | "P1" | "P2"
  rule: string
  kind: string
  audience: string
  file: string
  line: number
  context: string
  contentKey?: string | null
  matched: string
  source: string
  reason: string
  action: string
  strict: boolean
}

type PublicCopyAuditReport = {
  count: number
  findings: PublicCopyFinding[]
}

export type AdvisoryCopyBaselineEntry = {
  fingerprint: string
  count: number
}

export type AdvisoryCopyFindingEntry = AdvisoryCopyBaselineEntry & {
  rule: string
  audience: string
  file: string
  context: string
  matched: string
  source: string
}

export type EvidenceAuditBaseline = {
  schemaVersion: typeof EVIDENCE_ARTIFACT_SCHEMA_VERSION
  advisoryCopyAudit: {
    priority: "P2"
    entries: AdvisoryCopyBaselineEntry[]
  }
  responseFixture: {
    seed: number
    digest: string
    responseRecordCount: number
    invarianceRecordCount: number
  }
}

export type CopyAuditDelta = {
  priorityCounts: Array<{ priority: string; count: number }>
  higherPriorityFindings: PublicCopyFinding[]
  advisory: {
    priority: "P2"
    baselineCount: number
    currentCount: number
    unchangedCount: number
    newCount: number
    resolvedCount: number
    newFindings: AdvisoryCopyFindingEntry[]
    resolvedFindings: AdvisoryCopyBaselineEntry[]
  }
}

export function runPublicCopyAudit(projectRoot: string): PublicCopyAuditReport {
  const script = resolve(projectRoot, "scripts/audit-public-copy.mjs")
  const result = spawnSync(
    process.execPath,
    [script, "--format=json"],
    {
      cwd: projectRoot,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    },
  )

  if (result.error) {
    throw new Error(`Could not run public-copy audit: ${result.error.message}`)
  }
  if (result.status !== 0) {
    throw new Error(
      `Public-copy audit exited ${String(result.status)}: ${result.stderr.trim()}`,
    )
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(result.stdout)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Public-copy audit returned invalid JSON: ${message}`)
  }

  assertPublicCopyAuditReport(parsed)
  return parsed
}

export async function readEvidenceAuditBaseline(
  projectRoot: string,
): Promise<EvidenceAuditBaseline> {
  const path = resolve(
    projectRoot,
    "tests/fixtures/evidence-audit-baseline.json",
  )
  let parsed: unknown
  try {
    parsed = JSON.parse(await readFile(path, "utf8"))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Could not read evidence baseline: ${message}`)
  }

  assertEvidenceAuditBaseline(parsed)
  return parsed
}

export function buildAdvisoryCopyBaselineEntries(
  findings: readonly PublicCopyFinding[],
): AdvisoryCopyBaselineEntry[] {
  return buildCurrentAdvisoryEntries(findings).map(
    ({ fingerprint, count }) => ({ fingerprint, count }),
  )
}

function buildCurrentAdvisoryEntries(
  findings: readonly PublicCopyFinding[],
): AdvisoryCopyFindingEntry[] {
  const grouped = new Map<
    string,
    Omit<AdvisoryCopyFindingEntry, "count"> & { count: number }
  >()

  for (const finding of findings.filter(({ priority }) => priority === "P2")) {
    const entry = copyBaselineEntry(finding)
    const existing = grouped.get(entry.fingerprint)
    if (existing) {
      existing.count += 1
    } else {
      grouped.set(entry.fingerprint, { ...entry, count: 1 })
    }
  }

  return [...grouped.values()].sort((left, right) =>
    compareEvidenceStrings(left.fingerprint, right.fingerprint),
  )
}

export function buildCopyAuditDelta(
  report: PublicCopyAuditReport,
  baseline: EvidenceAuditBaseline,
): CopyAuditDelta {
  const currentEntries = buildCurrentAdvisoryEntries(report.findings)
  const baselineByFingerprint = new Map(
    baseline.advisoryCopyAudit.entries.map((entry) => [
      entry.fingerprint,
      entry,
    ]),
  )
  const currentByFingerprint = new Map(
    currentEntries.map((entry) => [entry.fingerprint, entry]),
  )
  const newFindings: AdvisoryCopyFindingEntry[] = []
  const resolvedFindings: AdvisoryCopyBaselineEntry[] = []
  let unchangedCount = 0

  for (const entry of currentEntries) {
    const baselineEntry = baselineByFingerprint.get(entry.fingerprint)
    const baselineCount = baselineEntry?.count ?? 0
    unchangedCount += Math.min(entry.count, baselineCount)
    if (entry.count > baselineCount) {
      newFindings.push({
        ...entry,
        count: entry.count - baselineCount,
      })
    }
  }

  for (const entry of baseline.advisoryCopyAudit.entries) {
    const currentCount = currentByFingerprint.get(entry.fingerprint)?.count ?? 0
    if (entry.count > currentCount) {
      resolvedFindings.push({
        ...entry,
        count: entry.count - currentCount,
      })
    }
  }

  const priorityCounts = (["P0", "P1", "P2"] as const).map((priority) => ({
    priority,
    count: report.findings.filter((finding) => finding.priority === priority)
      .length,
  }))
  const baselineCount = baseline.advisoryCopyAudit.entries.reduce(
    (sum, entry) => sum + entry.count,
    0,
  )
  const currentCount = currentEntries.reduce(
    (sum, entry) => sum + entry.count,
    0,
  )

  return {
    priorityCounts,
    higherPriorityFindings: report.findings.filter(
      ({ priority }) => priority !== "P2",
    ),
    advisory: {
      priority: "P2",
      baselineCount,
      currentCount,
      unchangedCount,
      newCount: currentCount - unchangedCount,
      resolvedCount: baselineCount - unchangedCount,
      newFindings,
      resolvedFindings,
    },
  }
}

function copyBaselineEntry(
  finding: PublicCopyFinding,
): Omit<AdvisoryCopyFindingEntry, "count"> {
  const identity = {
    rule: finding.rule,
    audience: finding.audience,
    file: finding.file,
    context: finding.context,
    matched: normalizeCopyIdentity(finding.matched),
    source: normalizeCopyIdentity(finding.source),
  }

  return {
    fingerprint: hashJson(identity),
    ...identity,
  }
}

function normalizeCopyIdentity(value: string): string {
  return value.normalize("NFKC").replace(/\s+/gu, " ").trim()
}

function assertPublicCopyAuditReport(
  value: unknown,
): asserts value is PublicCopyAuditReport {
  if (
    !isObject(value) ||
    !Number.isInteger(value.count) ||
    (value.count as number) < 0 ||
    !Array.isArray(value.findings) ||
    value.count !== value.findings.length
  ) {
    throw new TypeError("Public-copy audit JSON has an unsupported shape.")
  }

  for (const [index, finding] of value.findings.entries()) {
    if (
      !isObject(finding) ||
      !["P0", "P1", "P2"].includes(
        typeof finding.priority === "string" ? finding.priority : "",
      ) ||
      ![
        "rule",
        "kind",
        "audience",
        "file",
        "context",
        "matched",
        "source",
        "reason",
        "action",
      ].every((key) => typeof finding[key] === "string") ||
      !Number.isInteger(finding.line) ||
      (finding.line as number) < 1 ||
      typeof finding.strict !== "boolean"
    ) {
      throw new TypeError(
        `Public-copy audit finding ${index} has an unsupported shape.`,
      )
    }
  }
}

function assertEvidenceAuditBaseline(
  value: unknown,
): asserts value is EvidenceAuditBaseline {
  if (
    !isObject(value) ||
    value.schemaVersion !== EVIDENCE_ARTIFACT_SCHEMA_VERSION ||
    !isObject(value.advisoryCopyAudit) ||
    value.advisoryCopyAudit.priority !== "P2" ||
    !Array.isArray(value.advisoryCopyAudit.entries) ||
    !isObject(value.responseFixture) ||
    !Number.isSafeInteger(value.responseFixture.seed) ||
    typeof value.responseFixture.digest !== "string" ||
    !/^[0-9a-f]{64}$/u.test(value.responseFixture.digest) ||
    !Number.isSafeInteger(value.responseFixture.responseRecordCount) ||
    (value.responseFixture.responseRecordCount as number) < 0 ||
    !Number.isSafeInteger(value.responseFixture.invarianceRecordCount) ||
    (value.responseFixture.invarianceRecordCount as number) < 0
  ) {
    throw new TypeError("Evidence baseline has an unsupported shape.")
  }

  let previous = ""
  for (const [index, entry] of value.advisoryCopyAudit.entries.entries()) {
    if (
      !isObject(entry) ||
      typeof entry.fingerprint !== "string" ||
      !Number.isSafeInteger(entry.count) ||
      (entry.count as number) < 1
    ) {
      throw new TypeError(
        `Evidence baseline advisory entry ${index} has an unsupported shape.`,
      )
    }
    if (!/^[0-9a-f]{64}$/u.test(entry.fingerprint as string)) {
      throw new TypeError(
        `Evidence baseline advisory entry ${index} has an invalid fingerprint.`,
      )
    }
    if (
      compareEvidenceStrings(entry.fingerprint as string, previous) <= 0
    ) {
      throw new TypeError(
        "Evidence baseline advisory entries must be unique and sorted.",
      )
    }
    previous = entry.fingerprint as string
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
