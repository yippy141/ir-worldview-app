import test from "node:test"
import assert from "node:assert/strict"
import { atlasLitePatterns } from "@/lib/atlas-lite"
import {
  applyExtendedFieldFilters,
  atlasFingerprintToDimensionScores,
  buildAtlasPatternFieldItems,
  buildBaselineFieldItem,
  buildPerspectiveRunFieldItems,
  buildReferenceFieldItems,
  getVisibleReferenceEntities,
  getVisibleReferenceEntityById,
  isReferenceEntityDraft,
  latestRunPerPerspective,
  type FieldItem,
} from "@/lib/field/items"
import { toMapPosition } from "@/lib/results/position"
import { REFERENCE_PROFILE_CATALOG } from "@/lib/reference-profiles/catalog"
import { getReferenceProfilePosition } from "@/lib/reference-profiles/validation"
import type { ReferenceCatalog } from "@/lib/reference-profiles/types"
import type { PerspectiveRunSnapshot } from "@/lib/perspectives/types"
import type { FoundationSnapshot } from "@/lib/profile-store"
import type { DimensionScores } from "@/lib/types"

const baselineScores: DimensionScores = {
  securityCompetition: 5.2,
  institutions: 3.4,
  domesticFilters: 4.1,
  normsIdentity: 4.4,
  politicalEconomy: 4.0,
  restraint: 4.6,
  orderJustice: 5.0,
}

const foundationSnapshot: FoundationSnapshot = {
  timestamp: 1720000000000,
  payload: "payload",
  resultPath: "/results/payload",
  familyKey: "realist",
  familyLabel: "Strategic Realist",
  runnerUpKey: "institutionalist",
  runnerUpLabel: "Liberal Institutionalist",
  summary: "summary",
  dimensionScores: baselineScores,
  strategyModifier: "Hedger",
  normativeModifier: "Pluralist",
  keyDrivers: [],
  strongLenses: [],
}

const runSnapshot: PerspectiveRunSnapshot = {
  id: "run-1",
  timestamp: 1720000001000,
  perspectiveId: "exposed-ally",
  perspectiveLabel: "Exposed ally",
  scenarioSetVersion: 1,
  dimensionScores: { ...baselineScores, securityCompetition: 6.0 },
  baselineDeltas: { securityCompetition: 0.8 },
  strongestShiftKeys: ["securityCompetition"],
  resultPath: "/perspectives/exposed-ally/result/abc",
}

test("baseline field item projects through the shared projection", () => {
  const item = buildBaselineFieldItem(foundationSnapshot)
  assert.ok(item)
  assert.deepEqual(item.position, toMapPosition(baselineScores))
  assert.equal(item.layerId, "my-profile")
  assert.equal(buildBaselineFieldItem(null), null)
})

test("perspective run items keep run positions on the shared projection", () => {
  const [item] = buildPerspectiveRunFieldItems([runSnapshot])
  assert.deepEqual(item.position, toMapPosition(runSnapshot.dimensionScores))
  assert.equal(item.layerId, "perspective-runs")
  assert.equal(item.href, runSnapshot.resultPath)
})

test("latestRunPerPerspective keeps one newest run per pack", () => {
  const older = { ...runSnapshot, id: "run-0", timestamp: 1 }
  const otherPack = {
    ...runSnapshot,
    id: "run-2",
    perspectiveId: "middle-power-hedger",
    perspectiveLabel: "Middle power",
  }
  const latest = latestRunPerPerspective([older, runSnapshot, otherPack])
  assert.deepEqual(
    latest.map((run) => run.id).sort(),
    ["run-1", "run-2"],
  )
})

test("atlas pattern positions come from the fingerprint mapping and shared projection", () => {
  const items = buildAtlasPatternFieldItems()
  assert.equal(items.length, atlasLitePatterns.length)

  for (const pattern of atlasLitePatterns) {
    const item = items.find((candidate) => candidate.id === pattern.id)
    assert.ok(item, `missing atlas item for ${pattern.id}`)
    assert.deepEqual(
      item.position,
      toMapPosition(atlasFingerprintToDimensionScores(pattern)),
    )
    assert.equal(item.familyKey, pattern.primaryFamily)
  }
})

test("atlas fingerprint mapping leaves unmapped dimensions at the midpoint", () => {
  const scores = atlasFingerprintToDimensionScores(atlasLitePatterns[0])
  assert.equal(scores.domesticFilters, 4)
  assert.equal(scores.orderJustice, 4)
})

test("reference field items reuse the canonical reference projection", () => {
  const items = buildReferenceFieldItems()
  for (const profile of REFERENCE_PROFILE_CATALOG.profiles) {
    const item = items.find((candidate) => candidate.id === profile.id)
    if (!item) continue
    assert.deepEqual(item.position, getReferenceProfilePosition(profile))
  }
})

test("non-public-demo catalogs are excluded from catalog views", () => {
  const demoCatalog: ReferenceCatalog = {
    ...REFERENCE_PROFILE_CATALOG,
    dataStatus: "non-public-demo",
  }
  assert.deepEqual(getVisibleReferenceEntities(demoCatalog), [])
  assert.equal(
    getVisibleReferenceEntityById(REFERENCE_PROFILE_CATALOG.profiles[0].id, demoCatalog),
    null,
  )
})

test("internal-review entries stay visible and are marked as drafts", () => {
  const entities = getVisibleReferenceEntities()
  assert.ok(entities.length > 0)
  for (const entity of entities) {
    assert.notEqual(entity.publicationStatus, "withdrawn")
    assert.equal(isReferenceEntityDraft(entity), true)
  }
})

test("public catalogs surface only publishable entries", () => {
  const publicCatalog: ReferenceCatalog = {
    ...REFERENCE_PROFILE_CATALOG,
    dataStatus: "public",
  }
  // Current entries are pending review, so a public catalog hides them all.
  assert.deepEqual(getVisibleReferenceEntities(publicCatalog), [])
})

test("extended facets narrow contextual items and never hide the baseline", () => {
  const baseline = buildBaselineFieldItem(foundationSnapshot) as FieldItem
  const atlasItems = buildAtlasPatternFieldItems()
  const referenceItems = buildReferenceFieldItems()
  const items = [baseline, ...atlasItems, ...referenceItems]

  const familyFiltered = applyExtendedFieldFilters(items, {
    familyKeys: ["institutionalist"],
  })
  assert.ok(familyFiltered.includes(baseline))
  assert.ok(
    familyFiltered
      .filter((item) => item.kind === "atlas-pattern")
      .every((item) => item.familyKey === "institutionalist"),
  )
  assert.ok(
    familyFiltered.every((item) => item.kind !== "reference-profile"),
  )

  const now = Date.parse("2026-07-12")
  const reviewFiltered = applyExtendedFieldFilters(
    items,
    { reviewedWithinMonths: 12 },
    now,
  )
  assert.ok(reviewFiltered.includes(baseline))
  assert.ok(
    reviewFiltered.every(
      (item) => item.kind === "baseline" || item.kind.startsWith("reference"),
    ),
  )

  const staleNow = Date.parse("2029-07-12")
  const staleFiltered = applyExtendedFieldFilters(
    items,
    { reviewedWithinMonths: 12 },
    staleNow,
  )
  assert.deepEqual(staleFiltered, [baseline])
})
