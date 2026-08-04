import test from "node:test"
import assert from "node:assert/strict"
import {
  zhHansCopyDeckManifest,
  zhHansCurrentCases,
  zhHansProductGlossary,
  zhHansWorldStageScenes,
  zhHansWorldviewProfiles,
} from "@/content/locales/zh-Hans/index"
import { atlasLitePatterns } from "@/lib/atlas-lite"
import { getPublishedCurrentCases } from "@/lib/current-cases/catalog"
import { worldStageScenes } from "@/lib/world-stage/scenes"
import { zhHansWorldStageScenesWithSharedGeometry } from "@/lib/world-stage/zh-hans"
import { buildAtlasPatternFieldItems } from "@/lib/field/items"
import { toZhHansCurrentCasePublicRecord } from "@/lib/current-cases/zh-hans"

function ids<T extends { id: string }>(items: readonly T[]) {
  return items.map((item) => item.id)
}

function sourceShape(source: {
  id: string
  publishedAt: string | null
  accessedAt: string
  url: string
  kind: string
  claimIds: readonly string[]
}) {
  return {
    id: source.id,
    publishedAt: source.publishedAt,
    accessedAt: source.accessedAt,
    url: source.url,
    kind: source.kind,
    claimIds: source.claimIds,
  }
}

test("the zh-Hans deck includes only the owner-approved Foundation instrument", () => {
  assert.ok(zhHansCopyDeckManifest.includes.includes("foundation-instrument"))
  assert.deepEqual(zhHansCopyDeckManifest.excludes, [
    "ai-instrument",
    "module-instruments",
    "perspective-instruments",
    "archetype-layer",
  ])
})

test("Current Case translations preserve canonical records and source identity", () => {
  const canonicalCases = getPublishedCurrentCases()

  assert.equal(zhHansCurrentCases.length, 3)
  assert.deepEqual(
    zhHansCurrentCases.map((record) => record.slug),
    canonicalCases.map((record) => record.slug),
  )

  for (const canonical of canonicalCases) {
    const translated = zhHansCurrentCases.find((record) => record.id === canonical.id)
    assert.ok(translated, `missing Chinese case ${canonical.id}`)

    assert.deepEqual(
      {
        schemaVersion: translated.schemaVersion,
        id: translated.id,
        slug: translated.slug,
        version: translated.version,
        publicationStatus: translated.publicationStatus,
        launchRole: translated.launchRole,
        originalTitle: translated.originalTitle,
        category: translated.category,
        publishedAt: translated.publishedAt,
        updatedAt: translated.updatedAt,
        evidenceWindow: translated.evidenceWindow,
      },
      {
        schemaVersion: canonical.schemaVersion,
        id: canonical.id,
        slug: canonical.slug,
        version: canonical.version,
        publicationStatus: canonical.publicationStatus,
        launchRole: canonical.launchRole,
        originalTitle: canonical.title,
        category: canonical.category,
        publishedAt: canonical.publishedAt,
        updatedAt: canonical.updatedAt,
        evidenceWindow: canonical.evidenceWindow,
      },
    )

    assert.deepEqual(
      translated.actors.map((actor) => actor.canonical),
      canonical.actors,
    )
    assert.deepEqual(
      translated.perspectives.counterparties.map((entry) => entry.actor.canonical),
      canonical.perspectives.counterparties.map((entry) => entry.actor),
    )
    assert.deepEqual(ids(translated.factualClaims), ids(canonical.factualClaims))
    assert.deepEqual(ids(translated.reasoningTags), ids(canonical.reasoningTags))
    assert.deepEqual(ids(translated.decision.options), ids(canonical.decision.options))
    assert.deepEqual(
      ids(translated.assumptionChallenge.options),
      ids(canonical.assumptionChallenge.options),
    )
    assert.deepEqual(
      translated.nextRoutes.map((route) => route.href),
      canonical.nextRoutes.map((route) => route.href),
    )

    assert.deepEqual(
      translated.worldviewReadings.map((reading) => ({
        profileId: reading.profileId,
        recommendedOptionIds: reading.recommendedOptionIds,
      })),
      canonical.worldviewReadings.map((reading) => ({
        profileId: reading.profileId,
        recommendedOptionIds: reading.recommendedOptionIds,
      })),
    )

    assert.deepEqual(
      translated.sources.map(sourceShape),
      canonical.sources.map(sourceShape),
    )
    assert.deepEqual(
      translated.sources.map((source) => source.originalTitle),
      canonical.sources.map((source) => source.title),
    )
    for (const source of translated.sources) {
      assert.notEqual(source.displayTitle, source.originalTitle)
      assert.match(source.displayTitle, /[\u3400-\u9fff]/)
    }

    assert.deepEqual(
      translated.sensitiveWording.map((item) => item.term),
      canonical.sensitiveWording.map((item) => item.term),
    )
    assert.deepEqual(translated.editorialReview, canonical.editorialReview)
    assert.deepEqual(translated.correctionHistory, {
      status: "none-recorded",
      statusCopy: "目前没有公开更正记录。",
      lastEditorialUpdate: canonical.updatedAt,
      evidenceThrough: canonical.evidenceWindow.end,
      entries: [],
    })

    const publicRecord = toZhHansCurrentCasePublicRecord(translated)
    assert.deepEqual(ids(publicRecord.reasoningTags), ids(canonical.reasoningTags))
    assert.deepEqual(ids(publicRecord.decision.options), ids(canonical.decision.options))
    assert.deepEqual(
      ids(publicRecord.assumptionChallenge.options),
      ids(canonical.assumptionChallenge.options),
    )
  }
})

test("World Stage translations retain reviewed scene, entity, and source references", () => {
  assert.deepEqual(
    [...zhHansWorldStageScenes].map((scene) => scene.sceneId).sort(),
    worldStageScenes.map((scene) => scene.id).sort(),
  )

  for (const canonical of worldStageScenes) {
    const translated = zhHansWorldStageScenes.find(
      (scene) => scene.sceneId === canonical.id,
    )
    assert.ok(translated, `missing Chinese World Stage scene ${canonical.id}`)
    assert.equal(translated.researchSceneId, canonical.researchSceneId)
    assert.equal(translated.asOf, canonical.asOf)
    assert.deepEqual(
      translated.countryRoles.map((country) => ({
        iso3: country.iso3,
        role: country.role,
        confidence: country.confidence,
        sourceRefs: country.sourceRefs,
      })),
      canonical.countryRoles.map((country) => ({
        iso3: country.iso3,
        role: country.role,
        confidence: country.confidence,
        sourceRefs: country.sourceRefs,
      })),
    )
    assert.deepEqual(
      translated.nodes.map((node) => ({
        researchId: node.researchId,
        kind: node.kind,
        confidence: node.confidence,
        sourceRefs: node.sourceRefs,
      })),
      canonical.nodes.map((node) => ({
        researchId: node.researchId,
        kind: node.kind,
        confidence: node.confidence,
        sourceRefs: node.sourceRefs,
      })),
    )
    assert.deepEqual(
      translated.flows.map((flow) => ({
        researchId: flow.researchId,
        kind: flow.kind,
        direction: flow.direction,
        weight: flow.weight,
        confidence: flow.confidence,
        sourceRefs: flow.sourceRefs,
      })),
      canonical.flows.map((flow) => ({
        researchId: flow.researchId,
        kind: flow.kind,
        direction: flow.direction,
        weight: flow.weight,
        confidence: flow.confidence,
        sourceRefs: flow.sourceRefs,
      })),
    )
  }

  assert.deepEqual(
    zhHansWorldStageScenesWithSharedGeometry.map((scene) => ({
      id: scene.id,
      camera: scene.camera,
      countries: scene.countryRoles.map((country) => ({ iso3: country.iso3, role: country.role })),
      nodes: scene.nodes.map((node) => ({ researchId: node.researchId, coordinates: node.coordinates })),
      flows: scene.flows.map((flow) => ({ researchId: flow.researchId, from: flow.fromNodeId, to: flow.toNodeId })),
    })),
    worldStageScenes.map((scene) => ({
      id: scene.id,
      camera: scene.camera,
      countries: scene.countryRoles.map((country) => ({ iso3: country.iso3, role: country.role })),
      nodes: scene.nodes.map((node) => ({ researchId: node.researchId, coordinates: node.coordinates })),
      flows: scene.flows.map((flow) => ({ researchId: flow.researchId, from: flow.fromNodeId, to: flow.toNodeId })),
    })),
  )
})

test("the ten public profile translations keep canonical IDs and public names", () => {
  assert.equal(zhHansWorldviewProfiles.length, 10)
  assert.deepEqual(
    zhHansWorldviewProfiles.map((profile) => ({
      id: profile.id,
      originalPublicName: profile.originalPublicName,
    })),
    atlasLitePatterns.map((profile) => ({
      id: profile.id,
      originalPublicName: profile.publicName,
    })),
  )

  const englishItems = buildAtlasPatternFieldItems("en")
  const chineseItems = buildAtlasPatternFieldItems("zh-Hans")
  assert.deepEqual(
    chineseItems.map((item) => ({ id: item.id, position: item.position })),
    englishItems.map((item) => ({ id: item.id, position: item.position })),
  )
  assert.ok(chineseItems.every((item) => /[\u3400-\u9fff]/u.test(item.label)))
})

test("the glossary records ambiguous terms and bans the tooling mistranslation", () => {
  const flaggedTerms = zhHansProductGlossary.filter((term) => term.status === "flagged")
  assert.ok(flaggedTerms.length > 0)
  assert.ok(flaggedTerms.every((term) => term.alternatives?.length))
  assert.equal(
    zhHansProductGlossary.some((term) => term.zhHans.includes("工具链")),
    false,
  )
})
