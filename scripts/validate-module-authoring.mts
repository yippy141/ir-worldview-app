#!/usr/bin/env node

import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import {
  currentCaseRelationCatalog,
  validateCurrentCaseRelationCatalog,
} from "@/lib/current-cases/relations"
import {
  formatModuleAuthoringIssues,
  validateDomainModuleManifestPaths,
  validateModuleAuthoringRecord,
  type ModuleAuthoringValidationIssue,
} from "@/lib/modules/authoring-validation"
import { modules } from "@/lib/modules/framework"
import { MODULE_AUTHORING_RECORDS } from "@/lib/modules/manifests"
import { MODULE_SLUGS } from "@/lib/modules/types"
import { getCurrentModuleVersion } from "@/lib/modules/versions"
import manifestFingerprints from "@/tests/fixtures/module-manifest-fingerprints.json" with {
  type: "json",
}

export type RegisteredModuleAuthoringValidationReport = {
  ok: boolean
  manifests: Array<{
    slug: string
    manifestVersion: number
    questionBankVersion: number
    scoringVersion: number
    bridgeCount: number
  }>
  issues: string[]
}

type PackageJson = {
  scripts?: Record<string, string>
}

export function matchesCanonicalManifestFingerprint(
  manifest: {
    slug: string
    versions: { manifest: number; resultCopy: number }
    manifestFingerprint: string
  },
  fixtures: Record<
    string,
    {
      manifestVersion: number
      resultCopyVersion: number
      fingerprint: string
    }
  > = manifestFingerprints,
) {
  const expected = fixtures[manifest.slug]
  return Boolean(
    expected &&
      expected.manifestVersion === manifest.versions.manifest &&
      expected.resultCopyVersion === manifest.versions.resultCopy &&
      expected.fingerprint === manifest.manifestFingerprint,
  )
}

export function validateRegisteredModuleAuthoring(
  rootDirectory = process.cwd(),
  currentCaseRelations: unknown = currentCaseRelationCatalog,
): RegisteredModuleAuthoringValidationReport {
  const issues: string[] = []
  const packageJson = JSON.parse(
    readFileSync(resolve(rootDirectory, "package.json"), "utf8"),
  ) as PackageJson
  const packageScripts = packageJson.scripts ?? {}

  const currentCaseValidation = validateCurrentCaseRelationCatalog(
    currentCaseRelations,
  )
  if (!currentCaseValidation.ok) {
    issues.push(
      ...currentCaseValidation.errors.map(
        (error) =>
          `current-case-relations:${error.path}: ${error.message}`,
      ),
    )
  }
  if (typeof currentCaseRelations === "object" && currentCaseRelations !== null) {
    const candidate = currentCaseRelations as {
      contentVersion?: unknown
      relations?: unknown
    }
    if (
      candidate.contentVersion !== currentCaseRelationCatalog.contentVersion
    ) {
      issues.push(
        "current-case-relations:contentVersion: the V23.4 shipping catalog must remain at content version 1.",
      )
    }
    if (Array.isArray(candidate.relations) && candidate.relations.length !== 0) {
      issues.push(
        "current-case-relations:relations: the V23.4 shipping catalog must remain empty.",
      )
    }
  }

  const registeredSlugs = MODULE_AUTHORING_RECORDS.map(
    (record) => record.manifest.slug,
  )
  const runtimeSlugs = modules.map((definition) => definition.slug)
  if (JSON.stringify(registeredSlugs) !== JSON.stringify(runtimeSlugs)) {
    issues.push(
      "registry: authoring records must match the shipping module registry in canonical order.",
    )
  }
  if (JSON.stringify(registeredSlugs) !== JSON.stringify([...MODULE_SLUGS])) {
    issues.push(
      "registry: authoring records must cover every stable shipping module slug exactly once.",
    )
  }

  const manifests = MODULE_AUTHORING_RECORDS.map((record) => {
    const current = getCurrentModuleVersion(record.definition.slug)
    const result = validateModuleAuthoringRecord(record, current)
    if (!result.ok) {
      issues.push(
        ...formatModuleAuthoringIssues(record.manifest.slug, result.issues),
      )
    }

    const hookIssues: ModuleAuthoringValidationIssue[] = []
    const pathValidation = validateDomainModuleManifestPaths(
      record.manifest,
      rootDirectory,
    )
    if (!pathValidation.ok) hookIssues.push(...pathValidation.issues)
    for (const hook of record.manifest.evidenceAuditHooks.audits) {
      if (!packageScripts[hook.packageScript]) {
        hookIssues.push({
          code: "hook.script-missing",
          path: `package.json#scripts.${hook.packageScript}`,
          message: `Audit hook ${hook.id} does not resolve to a package script.`,
        })
      }
    }
    issues.push(
      ...formatModuleAuthoringIssues(
        record.manifest.slug,
        hookIssues,
      ),
    )

    if (!matchesCanonicalManifestFingerprint(record.manifest)) {
      issues.push(
        `${record.manifest.slug}: manifestFingerprint: canonical fingerprint fixture requires an explicit manifest/result-copy version bump.`,
      )
    }

    return {
      slug: record.manifest.slug,
      manifestVersion: record.manifest.versions.manifest,
      questionBankVersion: record.manifest.versions.questionBank,
      scoringVersion: record.manifest.versions.scoring,
      bridgeCount: record.manifest.bridges.length,
    }
  })

  return { ok: issues.length === 0, manifests, issues }
}

function main() {
  const report = validateRegisteredModuleAuthoring()
  if (!report.ok) {
    console.error("Module authoring validation failed:")
    for (const issue of report.issues) console.error(`- ${issue}`)
    process.exitCode = 1
    return
  }

  for (const manifest of report.manifests) {
    console.log(
      `${manifest.slug}: manifest ${manifest.manifestVersion}; ` +
        `bank ${manifest.questionBankVersion}; scorer ${manifest.scoringVersion}; ` +
        `${manifest.bridgeCount} authored bridges.`,
    )
  }
  console.log(
    "Module authoring contract valid; schema-v1 public relations are forbidden.",
  )
}

function isMainModule() {
  const entryPoint = process.argv[1]
  return Boolean(
    entryPoint && pathToFileURL(resolve(entryPoint)).href === import.meta.url,
  )
}

if (isMainModule()) main()
