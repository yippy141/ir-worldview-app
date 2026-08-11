#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { buildEvidenceAuditReport, renderEvidenceConsoleSummary, renderEvidenceMarkdown, type EvidenceAuditReport } from "@/scripts/evidence-report.mts"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { stableJson } from "@/scripts/evidence-utils.mts"

type EvidenceAuditFormat = "text" | "json"

export function parseEvidenceAuditArguments(
  args: readonly string[],
): { format: EvidenceAuditFormat; help: boolean; check: boolean } {
  const supported = new Set(["--format=json", "--check", "--help"])
  const unknown = args.find((argument) => !supported.has(argument))
  if (unknown) {
    throw new Error(`Unsupported evidence-audit argument: ${unknown}`)
  }

  return {
    format: args.includes("--format=json") ? "json" : "text",
    help: args.includes("--help"),
    check: args.includes("--check"),
  }
}

export type EvidenceArtifactBytes = {
  markdown: Buffer
  json: Buffer
}

export type EvidenceArtifactCheck = {
  matches: boolean
  mismatches: Array<{
    path: "artifacts/evidence/current-summary.md" | "artifacts/evidence/current-summary.json"
    reason: "missing" | "stale"
  }>
}

export function generateEvidenceArtifactBytes(
  report: EvidenceAuditReport,
): EvidenceArtifactBytes {
  return {
    markdown: Buffer.from(renderEvidenceMarkdown(report), "utf8"),
    json: Buffer.from(stableJson(report), "utf8"),
  }
}

export async function checkEvidenceArtifactBytes(
  expected: EvidenceArtifactBytes,
  projectRoot = process.cwd(),
): Promise<EvidenceArtifactCheck> {
  const specs = [
    {
      path: "artifacts/evidence/current-summary.md" as const,
      expected: expected.markdown,
    },
    {
      path: "artifacts/evidence/current-summary.json" as const,
      expected: expected.json,
    },
  ]
  const mismatches: EvidenceArtifactCheck["mismatches"] = []

  for (const spec of specs) {
    let actual: Buffer
    try {
      actual = await readFile(resolve(projectRoot, spec.path))
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        mismatches.push({ path: spec.path, reason: "missing" })
        continue
      }
      throw error
    }
    if (!actual.equals(spec.expected)) {
      mismatches.push({ path: spec.path, reason: "stale" })
    }
  }

  return { matches: mismatches.length === 0, mismatches }
}

export async function checkEvidenceArtifacts(
  report: EvidenceAuditReport,
  projectRoot = process.cwd(),
) {
  return checkEvidenceArtifactBytes(
    generateEvidenceArtifactBytes(report),
    projectRoot,
  )
}

export async function writeEvidenceArtifacts(
  report: EvidenceAuditReport,
  projectRoot = process.cwd(),
): Promise<{ markdownPath: string; jsonPath: string }> {
  const outputDirectory = resolve(projectRoot, "artifacts/evidence")
  const markdownPath = resolve(outputDirectory, "current-summary.md")
  const jsonPath = resolve(outputDirectory, "current-summary.json")

  const generated = generateEvidenceArtifactBytes(report)
  await mkdir(outputDirectory, { recursive: true })
  await Promise.all([
    writeFile(markdownPath, generated.markdown),
    writeFile(jsonPath, generated.json),
  ])

  return { markdownPath, jsonPath }
}

export async function runEvidenceAudit(
  args = process.argv.slice(2),
  projectRoot = process.cwd(),
) {
  const options = parseEvidenceAuditArguments(args)
  if (options.help) {
    process.stdout.write(
      "Usage: npm run evidence:audit [-- --format=json]\n" +
        "       npm run evidence:audit:check\n\n" +
        "Reads checked-in instrument and scoring evidence, writes the current " +
        "Markdown and JSON summaries in audit mode, and uses no network, model, or database. " +
        "Check mode compares exact UTF-8 bytes and writes nothing.\n",
    )
    return
  }

  const report = await buildEvidenceAuditReport(projectRoot)
  if (options.check) {
    const checked = await checkEvidenceArtifacts(report, projectRoot)
    if (!checked.matches) {
      throw new Error(
        checked.mismatches
          .map(
            (mismatch) =>
              `${mismatch.path}: ${mismatch.reason}`,
          )
          .join("\n"),
      )
    }
    process.stdout.write(
      "Evidence artifacts match freshly generated UTF-8 bytes.\n",
    )
    return
  }
  await writeEvidenceArtifacts(report, projectRoot)
  process.stdout.write(
    options.format === "json"
      ? stableJson(report)
      : `${renderEvidenceConsoleSummary(report)}\n`,
  )
}

function isMainModule() {
  const entryPoint = process.argv[1]
  return Boolean(
    entryPoint &&
      pathToFileURL(resolve(entryPoint)).href === import.meta.url,
  )
}

if (isMainModule()) {
  runEvidenceAudit().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
