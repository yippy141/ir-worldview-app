#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises"
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
): { format: EvidenceAuditFormat; help: boolean } {
  const supported = new Set(["--format=json", "--help"])
  const unknown = args.find((argument) => !supported.has(argument))
  if (unknown) {
    throw new Error(`Unsupported evidence-audit argument: ${unknown}`)
  }

  return {
    format: args.includes("--format=json") ? "json" : "text",
    help: args.includes("--help"),
  }
}

export async function writeEvidenceArtifacts(
  report: EvidenceAuditReport,
  projectRoot = process.cwd(),
): Promise<{ markdownPath: string; jsonPath: string }> {
  const outputDirectory = resolve(projectRoot, "artifacts/evidence")
  const markdownPath = resolve(outputDirectory, "current-summary.md")
  const jsonPath = resolve(outputDirectory, "current-summary.json")

  await mkdir(outputDirectory, { recursive: true })
  await Promise.all([
    writeFile(markdownPath, renderEvidenceMarkdown(report), "utf8"),
    writeFile(jsonPath, stableJson(report), "utf8"),
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
      "Usage: npm run evidence:audit [-- --format=json]\n\n" +
        "Reads checked-in instrument and scoring evidence, writes the current " +
        "Markdown and JSON summaries, and uses no network, model, or database.\n",
    )
    return
  }

  const report = await buildEvidenceAuditReport(projectRoot)
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
