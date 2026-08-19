import test from "node:test"
import assert from "node:assert/strict"
import { currentCaseRelationCatalog } from "@/lib/current-cases/relations"
import {
  validateDomainModuleManifest,
  validateModuleAuthoringRecord,
} from "@/lib/modules/authoring-validation"
import {
  MODULE_AUTHORING_RECORDS,
  MODULE_AUTHORING_MANIFESTS,
  getModuleAuthoringRecord,
} from "@/lib/modules/manifests"
import { modules } from "@/lib/modules/framework"
import { MODULE_SLUGS } from "@/lib/modules/types"
import { getCurrentModuleVersion } from "@/lib/modules/versions"
// Node's strip-types runtime requires the explicit .mts extension.
// @ts-expect-error TypeScript's bundler resolver disallows that runtime form.
import { validateRegisteredModuleAuthoring } from "@/scripts/validate-module-authoring.mts"

test("Security and Technology are the only shipping authoring manifests", () => {
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
      validateModuleAuthoringRecord(record, current),
      { ok: true, issues: [] },
    )
    assert.equal(record.manifest.releaseState, "shipping")
    assert.equal(record.manifest.versions.questionBank, current.bankVersion)
    assert.equal(record.manifest.versions.scoring, current.scoringVersion)
    assert.deepEqual(record.manifest.axes, record.definition.axes)
    assert.deepEqual(record.manifest.lanes, record.definition.lanes)
    assert.notStrictEqual(record.manifest.axes, record.definition.axes)
    assert.notStrictEqual(record.manifest.axes[0], record.definition.axes[0])
    assert.notStrictEqual(record.manifest.lanes, record.definition.lanes)
    assert.notStrictEqual(record.manifest.lanes[0], record.definition.lanes[0])
    assert.notStrictEqual(
      record.manifest.resultCopy.timeEstimate,
      record.definition.timeEstimate,
    )
    assert.notStrictEqual(
      record.manifest.resultCopy.measures,
      record.definition.measures,
    )
    assert.notStrictEqual(
      record.manifest.resultCopy.doesNotClaim,
      record.definition.doesNotClaim,
    )
    assert.deepEqual(record.manifest.bridges, [])
    assert.deepEqual(record.manifest.questionTypes, ["case"])
    assert.deepEqual(
      record.manifest.cardTypes,
      ["explanation", "decision", "actorLens"],
    )
  }
})

test("registered manifests expose complete copy, locale, calibration, and audit hooks", () => {
  for (const { manifest, definition } of MODULE_AUTHORING_RECORDS) {
    assert.equal(manifest.resultCopy.defaultHeadline, definition.defaultHeadline)
    assert.equal(manifest.resultCopy.title, definition.title)
    assert.equal(manifest.resultCopy.shortTitle, definition.shortTitle)
    assert.deepEqual(manifest.resultCopy.timeEstimate, definition.timeEstimate)
    assert.deepEqual(manifest.resultCopy.measures, definition.measures)
    assert.deepEqual(manifest.resultCopy.doesNotClaim, definition.doesNotClaim)

    assert.equal(manifest.calibration.status, "synthetic-diagnostic")
    assert.deepEqual(manifest.calibration.modes, ["standard", "analyst"])
    assert.ok(manifest.calibration.method.length > 0)
    assert.ok(manifest.evidenceAuditHooks.evidence.length > 0)
    assert.ok(manifest.evidenceAuditHooks.reviews.length > 0)
    assert.ok(manifest.evidenceAuditHooks.audits.length > 0)
    assert.deepEqual(manifest.localeStatus.locales, [
      { locale: "en", status: "source-complete", contentVersion: 1 },
      { locale: "zh-Hans", status: "not-authored" },
    ])
  }

  assert.deepEqual(validateRegisteredModuleAuthoring().issues, [])
})

test("registered authoring gate enforces the exact empty V23.4 Current Case catalog", () => {
  const driftedCatalog = {
    ...currentCaseRelationCatalog,
    contentVersion: 2,
    relations: [{}],
  }
  const report = validateRegisteredModuleAuthoring(
    process.cwd(),
    driftedCatalog,
  )

  assert.equal(report.ok, false)
  assert.equal(
    report.issues.some((issue) =>
      issue.startsWith("current-case-relations:relations[0]"),
    ),
    true,
  )
  assert.equal(
    report.issues.includes(
      "current-case-relations:contentVersion: the V23.4 shipping catalog must remain at content version 1.",
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

test("manifest validation fails closed on drift and non-shipping registration", () => {
  const source = MODULE_AUTHORING_RECORDS[0]
  const brokenManifest = structuredClone(source.manifest) as unknown as Record<
    string,
    unknown
  >
  const lanes = brokenManifest.lanes as Array<Record<string, unknown>>
  lanes[0].scoreKey = "missing-axis"
  const result = validateDomainModuleManifest(brokenManifest)
  assert.equal(result.ok, false)
  assert.equal(
    !result.ok && result.issues.some((issue) => issue.code === "manifest.lane-axis"),
    true,
  )

  const templateRecord = {
    definition: source.definition,
    manifest: {
      ...source.manifest,
      releaseState: "template" as const,
    },
  }
  const registered = validateModuleAuthoringRecord(
    templateRecord,
    getCurrentModuleVersion(source.definition.slug),
  )
  assert.equal(registered.ok, false)
  assert.equal(
    !registered.ok &&
      registered.issues.some((issue) => issue.code === "registration.non-shipping"),
    true,
  )
})

test("manifest registration detects copy and version divergence without changing runtime", () => {
  const source = MODULE_AUTHORING_RECORDS[1]
  const drifted = {
    definition: source.definition,
    manifest: {
      ...source.manifest,
      versions: {
        ...source.manifest.versions,
        questionBank: source.manifest.versions.questionBank + 1,
      },
      resultCopy: {
        ...source.manifest.resultCopy,
        title: "Drifted title",
      },
    },
  }
  const result = validateModuleAuthoringRecord(
    drifted,
    getCurrentModuleVersion(source.definition.slug),
  )
  assert.equal(result.ok, false)
  assert.equal(
    !result.ok && result.issues.some((issue) => issue.code === "registration.version"),
    true,
  )
  assert.equal(
    !result.ok &&
      result.issues.some((issue) => issue.code === "registration.result-copy"),
    true,
  )
})

test("detached manifest mutation is rejected without mutating the shipping definition", () => {
  const source = MODULE_AUTHORING_RECORDS[0]
  const originalAxisLabel = source.definition.axes[0].label
  const originalTimeEstimate = source.definition.timeEstimate.standard
  const originalMeasure = source.definition.measures[0]
  const driftedManifest = structuredClone(source.manifest)

  driftedManifest.axes[0].label = "Mutated authoring label"
  driftedManifest.resultCopy.timeEstimate.standard = "Mutated estimate"
  driftedManifest.resultCopy.measures[0] = "Mutated result claim"

  assert.equal(source.definition.axes[0].label, originalAxisLabel)
  assert.equal(source.definition.timeEstimate.standard, originalTimeEstimate)
  assert.equal(source.definition.measures[0], originalMeasure)

  const result = validateModuleAuthoringRecord(
    { manifest: driftedManifest, definition: source.definition },
    getCurrentModuleVersion(source.definition.slug),
  )
  assert.equal(result.ok, false)
  if (result.ok) return
  assert.equal(
    result.issues.some((issue) => issue.code === "registration.axes"),
    true,
  )
  assert.equal(
    result.issues.some((issue) => issue.code === "registration.result-copy"),
    true,
  )
})
