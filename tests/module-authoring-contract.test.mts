import assert from "node:assert/strict"
import { symlink, unlink } from "node:fs/promises"
import { resolve } from "node:path"
import test from "node:test"
import { currentCaseRelationCatalog } from "@/lib/current-cases/relations"
import {
  computeManifestFingerprint,
  validateDomainModuleManifest,
  validateDomainModuleManifestPaths,
  validateModuleAuthoringRecord,
} from "@/lib/modules/authoring-validation"
import {
  MODULE_AUTHORING_MANIFESTS,
  MODULE_AUTHORING_RECORDS,
  getModuleAuthoringRecord,
} from "@/lib/modules/manifests"
import { modules } from "@/lib/modules/framework"
import { MODULE_SLUGS } from "@/lib/modules/types"
import { getCurrentModuleVersion } from "@/lib/modules/versions"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { matchesCanonicalManifestFingerprint, validateRegisteredModuleAuthoring } from "@/scripts/validate-module-authoring.mts"

const referenceDate = "2026-08-21T00:00:00Z"

test("Security and Technology are public-beta legacy adapters with exact decisions", () => {
  assert.deepEqual(
    MODULE_AUTHORING_MANIFESTS.map((manifest) => manifest.slug),
    [...MODULE_SLUGS],
  )
  assert.deepEqual(
    MODULE_AUTHORING_RECORDS.map((record) => record.definition),
    modules,
  )
  assert.equal(getModuleAuthoringRecord("economic-statecraft"), null)
  assert.equal(getModuleAuthoringRecord("toString"), null)
  assert.equal(getModuleAuthoringRecord("constructor"), null)
  assert.equal(getModuleAuthoringRecord("__proto__"), null)

  for (const record of MODULE_AUTHORING_RECORDS) {
    const current = getCurrentModuleVersion(record.definition.slug)
    assert.deepEqual(
      validateModuleAuthoringRecord(record, current, { referenceDate }),
      { ok: true, issues: [] },
    )
    assert.equal(record.manifest.releaseState, "public-beta")
    assert.equal(record.manifest.manifestOrigin, "derived-legacy-adapter")
    assert.equal(record.manifest.versions.manifest, 2)
    assert.equal(
      record.manifest.releaseDecision?.approvedQuestionBankVersion,
      current.bankVersion,
    )
    assert.equal(
      record.manifest.releaseDecision?.approvedScoringVersion,
      current.scoringVersion,
    )
    assert.equal(
      record.manifest.releaseDecision?.approvedResultCopyVersion,
      record.manifest.versions.resultCopy,
    )
    assert.equal(
      record.manifest.releaseDecision?.approvedManifestVersion,
      record.manifest.versions.manifest,
    )
    assert.equal(record.manifest.releaseDecision?.decisionStatus, "approved-public-beta")
    assert.equal(record.manifest.localeStatus.locales[0].status, "authored-complete")
    assert.equal(record.manifest.evidenceStatus, "provenance-recorded")
    assert.deepEqual(record.manifest.bridges, [])
    assert.equal(matchesCanonicalManifestFingerprint(record.manifest), true)
  }

  assert.equal(
    MODULE_AUTHORING_RECORDS[0].manifest.releaseDecision?.decisionPath.includes(
      "V5_BETA_RELEASE_DECISION",
    ),
    true,
  )
  assert.equal(
    JSON.stringify(MODULE_AUTHORING_RECORDS[0].manifest.releaseDecision).includes(
      "V4_CONTRACT",
    ),
    false,
  )
})

test("legacy-adapter equality proves compatibility but keeps detached metadata", () => {
  for (const { manifest, definition } of MODULE_AUTHORING_RECORDS) {
    assert.deepEqual(manifest.axes, definition.axes)
    assert.deepEqual(manifest.lanes, definition.lanes)
    assert.equal(manifest.resultCopy.title, definition.title)
    assert.deepEqual(manifest.resultCopy.timeEstimate, definition.timeEstimate)
    assert.deepEqual(manifest.resultCopy.measures, definition.measures)
    assert.deepEqual(manifest.resultCopy.doesNotClaim, definition.doesNotClaim)
    assert.notStrictEqual(manifest.axes, definition.axes)
    assert.notStrictEqual(manifest.axes[0], definition.axes[0])
    assert.notStrictEqual(manifest.lanes, definition.lanes)
    assert.notStrictEqual(manifest.resultCopy.measures, definition.measures)
  }
})

test("registered manifest files, scripts, calibration, and decisions are real contained files", () => {
  for (const { manifest } of MODULE_AUTHORING_RECORDS) {
    assert.deepEqual(validateDomainModuleManifestPaths(manifest, process.cwd()), {
      ok: true,
      issues: [],
    })
  }
  assert.deepEqual(validateRegisteredModuleAuthoring().issues, [])
})

test("public release validation requires a recognized, exact, unexpired decision", () => {
  const source = MODULE_AUTHORING_RECORDS[0].manifest
  for (const mutate of [
    (manifest: Record<string, unknown>) => delete manifest.releaseDecision,
    (manifest: Record<string, unknown>) => {
      const decision = manifest.releaseDecision as Record<string, unknown>
      decision.decisionId = "made-up-markdown-decision"
      decision.decisionPath =
        "docs/v23/security/V23_3_SECURITY_V4_CONTRACT.md"
    },
    (manifest: Record<string, unknown>) => {
      const decision = manifest.releaseDecision as Record<string, unknown>
      decision.approvedQuestionBankVersion = 4
    },
  ]) {
    const manifest = structuredClone(source) as unknown as Record<string, unknown>
    mutate(manifest)
    const result = validateDomainModuleManifest(manifest, { referenceDate })
    assert.equal(result.ok, false)
    assert.equal(
      !result.ok &&
        result.issues.some((issue) => issue.code.startsWith("release-decision")),
      true,
    )
  }

  const expired = validateDomainModuleManifest(source, {
    referenceDate: "2026-11-22T00:00:00Z",
  })
  assert.equal(expired.ok, false)
  assert.equal(
    !expired.ok && expired.issues.some((issue) => issue.code === "date.overdue"),
    true,
  )
})

test("public-beta and shipping states reject placeholders and incomplete gates", () => {
  const source = MODULE_AUTHORING_RECORDS[1].manifest
  const mutations = [
    (manifest: Record<string, unknown>) => {
      ;(manifest.resultCopy as Record<string, unknown>).title = "Draft title"
    },
    (manifest: Record<string, unknown>) => {
      ;(manifest.calibration as Record<string, unknown>).status = "not-calibrated"
    },
    (manifest: Record<string, unknown>) => {
      const localeStatus = manifest.localeStatus as {
        locales: Array<Record<string, unknown>>
      }
      localeStatus.locales[0].status = "partial"
    },
    (manifest: Record<string, unknown>) => {
      const hooks = manifest.evidenceAuditHooks as Record<string, unknown>
      hooks.reviews = []
    },
  ]
  for (const mutate of mutations) {
    const manifest = structuredClone(source) as unknown as Record<string, unknown>
    mutate(manifest)
    const result = validateDomainModuleManifest(manifest, { referenceDate })
    assert.equal(result.ok, false)
  }
})

test("manifest claim drift fails its digest and cannot silently update the fixture", () => {
  const source = MODULE_AUTHORING_RECORDS[1].manifest
  const drifted = structuredClone(source)
  drifted.axes[0].label = "Semantically drifted label"
  assert.notEqual(computeManifestFingerprint(drifted), source.manifestFingerprint)
  assert.equal(validateDomainModuleManifest(drifted, { referenceDate }).ok, false)

  drifted.manifestFingerprint = computeManifestFingerprint(drifted)
  assert.equal(
    validateDomainModuleManifest(drifted, { referenceDate }).ok,
    true,
    "the internal digest is self-consistent",
  )
  assert.equal(
    matchesCanonicalManifestFingerprint(drifted),
    false,
    "the canonical fixture requires a manifest/result-copy version bump",
  )
})

test("hook symlinks and paths outside the repository fail filesystem validation", async () => {
  const symlinkPath = resolve(
    process.cwd(),
    "docs/module-authoring",
    `hook-symlink-${process.pid}`,
  )
  await symlink(
    resolve(process.cwd(), "docs/v23/security/V23_3_SECURITY_V5_SOURCE_LEDGER.md"),
    symlinkPath,
  )
  try {
    const symlinked = structuredClone(MODULE_AUTHORING_RECORDS[0].manifest)
    symlinked.evidenceAuditHooks.evidence[0].path =
      `docs/module-authoring/hook-symlink-${process.pid}`
    const symlinkResult = validateDomainModuleManifestPaths(
      symlinked,
      process.cwd(),
    )
    assert.equal(symlinkResult.ok, false)
    assert.equal(
      !symlinkResult.ok &&
        symlinkResult.issues.some((issue) => /symlink/u.test(issue.message)),
      true,
    )

    const escaped = structuredClone(MODULE_AUTHORING_RECORDS[0].manifest)
    escaped.evidenceAuditHooks.reviews[0].path = "/tmp/outside-review.md"
    assert.equal(
      validateDomainModuleManifestPaths(escaped, process.cwd()).ok,
      false,
    )
  } finally {
    await unlink(symlinkPath)
  }
})

test("registration rejects template/candidate manifests and runtime divergence", () => {
  const source = MODULE_AUTHORING_RECORDS[0]
  for (const releaseState of ["template", "candidate"] as const) {
    const result = validateModuleAuthoringRecord(
      {
        definition: source.definition,
        manifest: { ...source.manifest, releaseState },
      },
      getCurrentModuleVersion(source.definition.slug),
      { referenceDate },
    )
    assert.equal(result.ok, false)
    assert.equal(
      !result.ok &&
        result.issues.some((issue) => issue.code === "registration.non-public"),
      true,
    )
  }

  const drifted = structuredClone(source.manifest)
  drifted.lanes[0].scoreKey = "missing-axis"
  const result = validateModuleAuthoringRecord(
    { definition: source.definition, manifest: drifted },
    getCurrentModuleVersion(source.definition.slug),
    { referenceDate },
  )
  assert.equal(result.ok, false)
  assert.equal(
    !result.ok &&
      result.issues.some((issue) => issue.code === "manifest.lane-axis"),
    true,
  )
})

test("registered gate preserves the exact empty Current Case catalog", () => {
  const driftedCatalog = {
    ...currentCaseRelationCatalog,
    contentVersion: 2,
    relations: [{}],
  }
  const report = validateRegisteredModuleAuthoring(process.cwd(), driftedCatalog)
  assert.equal(report.ok, false)
  assert.equal(
    report.issues.some((issue) =>
      issue.startsWith("current-case-relations:relations[0]"),
    ),
    true,
  )
  assert.equal(
    report.issues.includes(
      "current-case-relations:relations: the V23.4 shipping catalog must remain empty.",
    ),
    true,
  )
})
