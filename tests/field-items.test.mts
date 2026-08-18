import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { atlasLitePatterns } from "@/lib/atlas-lite"
import { zhHansWorldviewProfileById } from "@/content/locales/zh-Hans/worldview-profiles"
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
import { resolveFoundationPayload } from "@/lib/share"
import type { DimensionScores } from "@/lib/types"
import { traditionNounLabel } from "@/lib/worldview-config"

const frozenV2FoundationPayload =
  "eyJ2IjoyLCJkcyI6WzYuMjUsMi41LDQsMy43NSw1LjUsNC4yNSwyLjc1XSwiZmsiOiJyZWFsaXN0IiwibmsiOiJpbnN0aXR1dGlvbmFsaXN0Iiwic20iOiJIZWRnZXIiLCJubSI6IkNvbmRpdGlvbmFsIFNvbGlkYXJpc3QifQ"

const baselineScores: DimensionScores = {
  securityCompetition: 6.25,
  institutions: 2.5,
  domesticFilters: 4,
  normsIdentity: 3.75,
  politicalEconomy: 5.5,
  restraint: 4.25,
  orderJustice: 2.75,
}

const foundationSnapshot: FoundationSnapshot = {
  timestamp: 1720000000000,
  payload: frozenV2FoundationPayload,
  instrumentStructuralVersion: 3,
  scoringVersion: 1,
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
  locale: "en",
  localeCopyVersion: 1,
}

const runSnapshot: PerspectiveRunSnapshot = {
  locale: "en",
  localeCopyVersion: 1,
  id: "run-1",
  timestamp: 1720000001000,
  perspectiveId: "exposed-ally",
  perspectiveLabel: "Exposed ally",
  scenarioSetVersion: 1,
  dimensionScores: { ...baselineScores, securityCompetition: 6.0 },
  baselineDeltas: { securityCompetition: 0.8 },
  strongestShiftKeys: ["securityCompetition"],
  resultPath: "/perspectives/exposed-ally/result/abc",
  payload: "abc",
}

test("baseline field item projects through the shared projection", () => {
  const item = buildBaselineFieldItem(foundationSnapshot)
  assert.ok(item)
  assert.deepEqual(item.position, toMapPosition(baselineScores))
  assert.equal(item.layerId, "my-profile")
  assert.equal(buildBaselineFieldItem(null), null)
})

test("baseline field item fails closed when its exact Foundation payload is invalid", () => {
  const cachedButInvalid = {
    ...foundationSnapshot,
    payload: "not-a-foundation-payload",
    familyKey: "criticalPoliticalEconomy" as const,
    familyLabel: "Conflicting cached family",
    dimensionScores: {
      ...baselineScores,
      securityCompetition: 1,
      institutions: 7,
    },
  }

  assert.equal(buildBaselineFieldItem(cachedButInvalid), null)
})

test("legacy baseline position and summary follow decoded payload data, not cached fields", () => {
  const resolved = resolveFoundationPayload(frozenV2FoundationPayload)
  assert.ok(resolved)

  const conflictingSnapshot: FoundationSnapshot = {
    ...foundationSnapshot,
    payload: frozenV2FoundationPayload,
    resultPath: `/results/${frozenV2FoundationPayload}`,
    familyKey: "criticalPoliticalEconomy",
    familyLabel: "Conflicting cached family",
    runnerUpKey: "constructivist",
    runnerUpLabel: "Conflicting cached runner-up",
    dimensionScores: {
      securityCompetition: 1,
      institutions: 7,
      domesticFilters: 7,
      normsIdentity: 7,
      politicalEconomy: 7,
      restraint: 1,
      orderJustice: 7,
    },
    strategyModifier: "Maximizer",
    normativeModifier: "Universalist",
  }
  const item = buildBaselineFieldItem(conflictingSnapshot)

  assert.ok(item)
  assert.deepEqual(item.position, toMapPosition(resolved.dimensionScores))
  assert.equal(item.familyKey, resolved.result.familyKey)
  assert.equal(
    item.summary,
    `Foundation baseline · closest to ${traditionNounLabel(resolved.result.familyKey)}.`,
  )
  assert.doesNotMatch(item.summary, /Conflicting cached family/u)
})

test("localized saved-result paths stay locale-neutral inside Field items", () => {
  const baseline = buildBaselineFieldItem({
    ...foundationSnapshot,
    resultPath: "/zh/results/payload",
  }, "zh-Hans")
  const [run] = buildPerspectiveRunFieldItems([{
    ...runSnapshot,
    resultPath: "/zh/perspectives/exposed-ally/result/abc",
  }], "zh-Hans")

  assert.equal(baseline?.href, "/results/payload")
  assert.equal(run.href, "/perspectives/exposed-ally/result/abc")
})

test("perspective run items keep run positions on the shared projection", () => {
  const [item] = buildPerspectiveRunFieldItems([runSnapshot])
  assert.deepEqual(item.position, toMapPosition(runSnapshot.dimensionScores))
  assert.equal(item.layerId, "perspective-runs")
  assert.equal(item.href, runSnapshot.resultPath)
})

test("an unapproved Chinese Perspective Run never exposes its English label", () => {
  const englishLabel = "Unapproved future perspective"
  const [item] = buildPerspectiveRunFieldItems(
    [
      {
        ...runSnapshot,
        perspectiveId: "future-unapproved-perspective",
        perspectiveLabel: englishLabel,
      },
    ],
    "zh-Hans",
  )

  assert.notEqual(item.label, englishLabel)
  assert.doesNotMatch(JSON.stringify(item), new RegExp(englishLabel, "u"))
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

test("Chinese catalog rendering fails closed before any English Pattern fallback", () => {
  const source = readFileSync(
    new URL("../lib/field/items.ts", import.meta.url),
    "utf8",
  )

  assert.doesNotMatch(source, /\?\?\s*pattern\.cardSummary/u)
  assert.match(source, /if \(zh && !localized\) return \[\]/u)
  assert.equal(
    buildAtlasPatternFieldItems("zh-Hans").length,
    Object.keys(zhHansWorldviewProfileById).length,
  )
})

test("reference field items reuse the canonical reference projection", () => {
  const items = buildReferenceFieldItems()
  assert.equal(items.length, 4)

  for (const profile of REFERENCE_PROFILE_CATALOG.profiles) {
    const item = items.find((candidate) => candidate.id === profile.id)
    assert.ok(item)
    assert.deepEqual(item.position, getReferenceProfilePosition(profile))
  }

  assert.equal(items.find((item) => item.id === "alexander-wendt")?.position, null)
  assert.equal(items.filter((item) => item.position !== null).length, 3)
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
  const catalog = internalReviewCatalog()
  const entities = getVisibleReferenceEntities(catalog, {
    includeInternalReview: true,
  })
  assert.ok(entities.length > 0)
  for (const entity of entities) {
    assert.notEqual(entity.publicationStatus, "withdrawn")
    assert.equal(isReferenceEntityDraft(entity), true)
  }
})

test("internal-review entries require an explicit preview outside catalog editing", () => {
  const catalog = internalReviewCatalog()
  assert.deepEqual(
    getVisibleReferenceEntities(catalog, {
      includeInternalReview: false,
    }),
    [],
  )
  assert.deepEqual(
    buildReferenceFieldItems(catalog, {
      includeInternalReview: false,
    }),
    [],
  )
})

test("invalid catalogs fail closed before entries reach the Field", () => {
  const invalidCatalog: ReferenceCatalog = {
    ...REFERENCE_PROFILE_CATALOG,
    profiles: [
      ...REFERENCE_PROFILE_CATALOG.profiles,
      REFERENCE_PROFILE_CATALOG.profiles[0],
    ],
  }

  assert.deepEqual(
    getVisibleReferenceEntities(invalidCatalog, { includeInternalReview: true }),
    [],
  )
  assert.deepEqual(
    buildReferenceFieldItems(invalidCatalog, { includeInternalReview: true }),
    [],
  )
})

test("public catalogs surface only publishable entries", () => {
  const publicCatalog = structuredClone(REFERENCE_PROFILE_CATALOG)
  publicCatalog.profiles[0].public = false
  publicCatalog.profiles[0].publicationStatus = "pending-review"

  const visible = getVisibleReferenceEntities(publicCatalog)
  assert.equal(visible.length, 3)
  assert.equal(
    visible.some((entity) => entity.id === publicCatalog.profiles[0].id),
    false,
  )
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

function internalReviewCatalog(): ReferenceCatalog {
  const catalog = structuredClone(REFERENCE_PROFILE_CATALOG)
  catalog.dataStatus = "internal-review"
  for (const profile of catalog.profiles) {
    profile.public = false
    profile.publicationStatus = "pending-review"
  }
  return catalog
}
