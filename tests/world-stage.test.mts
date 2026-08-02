import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import {
  WORLD_STAGE_COUNTRY_PATHS,
  projectWorldStagePoint,
} from "@/lib/world-stage/fallback-geometry"
import {
  buildWorldStageCountryData,
  buildWorldStageFlowData,
  buildWorldStageNodeData,
  getWorldStageFallbackFlows,
  getWorldStageFallbackNodes,
  getWorldStageTooltipItems,
  WORLD_STAGE_COUNTRY_GEOMETRY,
  WORLD_STAGE_FALLBACK_FLOW_LIMIT,
  WORLD_STAGE_FALLBACK_NODE_LIMIT,
} from "@/lib/world-stage/map-data"
import {
  getNextWorldStageSceneIndex,
  getNextWorldStageSpinLongitude,
  getWorldStageIdleResumeAt,
  isWorldStageIdleResumeReady,
  WORLD_STAGE_GLOBE_IDLE_RESUME_MS,
  WORLD_STAGE_MAPBOX_STYLE,
  WORLD_STAGE_MAX_SPIN_ZOOM,
} from "@/lib/world-stage/map-config"
import {
  validateWorldStageCatalog,
  WORLD_STAGE_OMITTED_FLOW_IDS,
  WORLD_STAGE_RESEARCH_SCENE_IDS,
  WORLD_STAGE_REVIEWED_ISO3_KEYS,
  worldStageMenuItems,
  worldStageSceneOptions,
  worldStageScenes,
} from "@/lib/world-stage/scenes"
import {
  WORLD_STAGE_COUNTRY_ROLES,
  WORLD_STAGE_FLOW_KINDS,
  WORLD_STAGE_FLOW_RELATIONS,
  WORLD_STAGE_MENU_IDS,
  WORLD_STAGE_NODE_KINDS,
  WORLD_STAGE_SCENE_IDS,
  WORLD_STAGE_SEMICONDUCTOR_ROLES,
} from "@/lib/world-stage/types"
import type {
  WorldStageMenuItem,
  WorldStageScene,
  WorldStageValidationCode,
} from "@/lib/world-stage/types"

type ResearchScene = {
  sceneId: string
  publicLabel: string
  oneSentencePurpose: string
  lensOwner: string
  evidenceWindow: string
  countryRoles: Array<{
    iso3: string
    role: string
    rationale: string
    confidence: string
    sourceIds: string[]
  }>
  nodes: Array<{
    id: string
    kind: string
    semiconductorRole?: string
    label: string
    coordinates: [number, number]
    whyItMatters: string
    confidence: string
    sourceIds: string[]
  }>
  flows: Array<{
    id: string
    kind: string
    relation?: string
    label: string
    from: string
    to: string
    direction: string
    weight: number
    "plain-language meaning": string
    confidence: string
    sourceIds: string[]
  }>
  caveats: string[]
}

type ResearchLedger = {
  researchRunDate: string
  scenes: ResearchScene[]
}

type SourceRecord = {
  sourceId: string
  title: string
  publisher: string
  date: string
  url: string
  claimCoverage: string
}

const researchLedger = JSON.parse(
  readFileSync(new URL("../research/world-stage/scene-ledger.json", import.meta.url), "utf8"),
) as ResearchLedger
const sourceLedger = JSON.parse(
  readFileSync(new URL("../research/world-stage/source-ledger.json", import.meta.url), "utf8"),
) as SourceRecord[]
const sourceIds = new Set(sourceLedger.map((source) => source.sourceId))

function validationCodes(
  scenes: readonly WorldStageScene[],
  menuItems: readonly WorldStageMenuItem[] = worldStageMenuItems,
) {
  const result = validateWorldStageCatalog(scenes, menuItems)
  return new Set(result.errors.map((error) => error.code))
}

function hasCode(codes: Set<WorldStageValidationCode>, code: WorldStageValidationCode) {
  assert.equal(codes.has(code), true, `expected validation error ${code}`)
}

function childSourceRefs(scene: WorldStageScene) {
  return Array.from(
    new Set([
      ...scene.countryRoles.flatMap((country) => country.sourceRefs),
      ...scene.nodes.flatMap((node) => node.sourceRefs),
      ...scene.flows.flatMap((flow) => flow.sourceRefs),
    ]),
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

test("the reviewed World Stage catalog and complete six-menu mapping are valid", () => {
  assert.deepEqual(validateWorldStageCatalog(), { ok: true, errors: [] })
  assert.deepEqual(
    worldStageScenes.map((scene) => scene.id),
    WORLD_STAGE_SCENE_IDS,
  )
  assert.deepEqual(
    worldStageMenuItems.map((item) => item.id),
    WORLD_STAGE_MENU_IDS,
  )
  assert.equal(worldStageScenes.length, 5)

  for (const scene of worldStageScenes) {
    assert.equal(scene.dataStatus, "reviewed-editorial")
    assert.ok(scene.publicLabel.length > 0)
    assert.ok(scene.caption.length > 0)
    assert.ok(scene.lensOwner.length > 0)
    assert.match(scene.asOf, /^\d{4}-\d{2}-\d{2}$/)
    assert.ok(scene.caveats.length > 0)
  }
})

test("the six menu contracts keep five reviewed map routes plus the Current Case destination", () => {
  assert.deepEqual(
    worldStageMenuItems.map(({ id, sceneId, href }) => ({ id, sceneId, href })),
    [
      { id: "current-case", sceneId: "foundation", href: "/current" },
      { id: "foundation", sceneId: "foundation", href: "/quiz" },
      { id: "focus-areas", sceneId: "focus-areas", href: "/modules" },
      { id: "perspective-runs", sceneId: "perspectives", href: "/perspectives" },
      { id: "worldview-map", sceneId: "worldview-map", href: "/explore/atlas" },
      { id: "ai-futures", sceneId: "futures", href: "/ai" },
    ],
  )
  assert.equal(new Set(worldStageMenuItems.map((item) => item.sceneId)).size, 5)
  assert.equal(worldStageScenes.some((scene) => scene.id === ("current-case" as string)), false)
})

test("map controls expose the five independent public map views", () => {
  assert.deepEqual(
    worldStageSceneOptions.map((option) => option.sceneId),
    WORLD_STAGE_SCENE_IDS,
  )
  assert.deepEqual(
    worldStageSceneOptions.map((option) => option.label),
    [
      "Pacific alliances",
      "Chip networks",
      "Regional security",
      "Hedging states",
      "AI infrastructure",
    ],
  )
  assert.equal(new Set(worldStageSceneOptions.map((option) => option.label)).size, 5)

  const navigationLabels = new Set<string>(worldStageMenuItems.map((item) => item.label))
  for (const option of worldStageSceneOptions) {
    assert.equal(navigationLabels.has(option.label), false)
  }

  assert.equal(getNextWorldStageSceneIndex(0), 1)
  assert.equal(getNextWorldStageSceneIndex(worldStageSceneOptions.length - 1), 0)
})

test("every scene has a valid, scene-specific camera", () => {
  const cameras = new Set<string>()

  for (const scene of worldStageScenes) {
    const { center, zoom, pitch, bearing } = scene.camera
    assert.equal(center.length, 2)
    assert.ok(center[0] >= -180 && center[0] <= 180)
    assert.ok(center[1] >= -90 && center[1] <= 90)
    assert.ok(zoom >= 0 && zoom <= 22)
    assert.ok(pitch >= 0 && pitch <= 85)
    assert.ok(bearing >= -180 && bearing <= 180)
    cameras.add(JSON.stringify(scene.camera))
  }

  assert.equal(cameras.size, worldStageScenes.length)
})

test("all source references resolve and scene references cover visible children", () => {
  assert.equal(new Set(sourceLedger.map((source) => source.sourceId)).size, sourceLedger.length)
  for (const source of sourceLedger) {
    assert.match(source.sourceId, /^SRC\d{2}$/)
    assert.ok(source.title.length > 0)
    assert.ok(source.publisher.length > 0)
    assert.ok(source.date.length > 0)
    assert.doesNotThrow(() => new URL(source.url))
    assert.ok(source.claimCoverage.length > 0)
  }

  for (const scene of worldStageScenes) {
    assert.deepEqual(scene.sourceRefs, childSourceRefs(scene))
    for (const ref of scene.sourceRefs) assert.equal(sourceIds.has(ref), true, ref)

    for (const record of [...scene.countryRoles, ...scene.nodes, ...scene.flows]) {
      assert.ok(record.sourceRefs.length > 0)
      for (const ref of record.sourceRefs) assert.equal(sourceIds.has(ref), true, ref)
    }
  }
})

test("country roles use the closed vocabulary and valid geometry-backed ISO-3 keys", () => {
  const validRoles = new Set<string>(WORLD_STAGE_COUNTRY_ROLES)
  const geometryIso3 = new Set<string>()

  for (const feature of WORLD_STAGE_COUNTRY_GEOMETRY.features) {
    assert.match(feature.properties.iso3, /^[A-Z]{3}$/)
    assert.equal(feature.id, feature.properties.iso3)
    assert.equal(geometryIso3.has(feature.properties.iso3), false)
    geometryIso3.add(feature.properties.iso3)
  }

  for (const scene of worldStageScenes) {
    const localIso3 = new Set<string>()
    for (const country of scene.countryRoles) {
      assert.equal(validRoles.has(country.role), true)
      assert.match(country.iso3, /^[A-Z]{3}$/)
      assert.equal(geometryIso3.has(country.iso3), true, country.iso3)
      assert.equal(localIso3.has(country.iso3), false, country.iso3)
      localIso3.add(country.iso3)
      assert.ok(country.rationale.length > 0)
      assert.ok(country.sourceRefs.length > 0)
    }
  }

  assert.deepEqual(
    WORLD_STAGE_REVIEWED_ISO3_KEYS,
    Array.from(new Set(worldStageScenes.flatMap((scene) => scene.countryRoles.map((c) => c.iso3)))).sort(),
  )
})

test("node and flow IDs are unique, coordinates are valid, and vocabularies are closed", () => {
  const entityIds = new Set<string>()
  const nodeKinds = new Set<string>(WORLD_STAGE_NODE_KINDS)
  const flowKinds = new Set<string>(WORLD_STAGE_FLOW_KINDS)

  for (const scene of worldStageScenes) {
    const localNodeIds = new Set(scene.nodes.map((node) => node.id))
    for (const node of scene.nodes) {
      assert.equal(entityIds.has(node.id), false, node.id)
      entityIds.add(node.id)
      assert.equal(nodeKinds.has(node.kind), true, node.kind)
      assert.ok(node.coordinates[0] >= -180 && node.coordinates[0] <= 180)
      assert.ok(node.coordinates[1] >= -90 && node.coordinates[1] <= 90)
      assert.ok(node.whyItMatters.length > 0)
      assert.ok(node.sourceRefs.length > 0)
      const point = projectWorldStagePoint(node.coordinates)
      assert.equal(Number.isFinite(point.x) && Number.isFinite(point.y), true)
    }

    for (const flow of scene.flows) {
      assert.equal(entityIds.has(flow.id), false, flow.id)
      entityIds.add(flow.id)
      assert.equal(flowKinds.has(flow.kind), true, flow.kind)
      assert.equal(localNodeIds.has(flow.fromNodeId), true, flow.fromNodeId)
      assert.equal(localNodeIds.has(flow.toNodeId), true, flow.toNodeId)
      assert.equal(["one-way", "two-way"].includes(flow.direction), true)
      assert.equal([1, 2, 3].includes(flow.weight), true)
    }
  }
})

test("chip-network roles and infrastructure relations are explicit, filterable, and sourced", () => {
  const chipScene = worldStageScenes.find((scene) => scene.id === "focus-areas")
  const aiScene = worldStageScenes.find((scene) => scene.id === "futures")
  assert.ok(chipScene)
  assert.ok(aiScene)

  const validRoles = new Set<string>(WORLD_STAGE_SEMICONDUCTOR_ROLES)
  const validRelations = new Set<string>(WORLD_STAGE_FLOW_RELATIONS)
  for (const node of chipScene.nodes) {
    assert.equal(validRoles.has(node.semiconductorRole ?? ""), true, node.researchId)
  }
  for (const flow of [...chipScene.flows, ...aiScene.flows]) {
    assert.equal(validRelations.has(flow.relation ?? ""), true, flow.researchId)
  }

  assert.deepEqual(
    chipScene.nodes
      .filter((node) => node.semiconductorRole === "sme")
      .map((node) => node.researchId)
      .sort(),
    [
      "n_de_zeiss_oberkochen",
      "n_jp_tel_yamanashi",
      "n_nl_veldhoven",
      "n_us_applied_santaclara",
      "n_us_kla_milpitas",
      "n_us_lam_fremont",
    ],
  )
  assert.deepEqual(
    chipScene.nodes
      .filter((node) => node.semiconductorRole === "materials")
      .map((node) => node.researchId)
      .sort(),
    [
      "n_jp_jsr_yokkaichi",
      "n_jp_shinetsu_shirakawa",
      "n_jp_sumco_imari",
      "n_jp_tok_koriyama",
    ],
  )

  const materials = buildWorldStageNodeData(chipScene, {
    semiconductorRole: "materials",
  })
  assert.equal(materials.features.length, 4)
  assert.equal(
    materials.features.every(
      (feature) => feature.properties.semiconductorRole === "materials",
    ),
    true,
  )

  const supply = buildWorldStageFlowData(chipScene, { relation: "supply" })
  assert.equal(supply.features.length, 3)
  assert.equal(
    supply.features.every((feature) => feature.properties.relation === "supply"),
    true,
  )

  const tooltipItems = getWorldStageTooltipItems(chipScene)
  for (const item of tooltipItems.filter((candidate) => candidate.kind !== "country")) {
    assert.equal(item.sources.length, item.sourceCount)
    for (const source of item.sources) {
      assert.ok(source.url.length > 0)
      assert.ok(source.date.length > 0)
      assert.doesNotThrow(() => new URL(source.url))
    }
  }

  assert.equal(chipScene.flows.some((flow) => flow.researchId === "f_tw_my_backend"), false)
  assert.equal(aiScene.flows.some((flow) => flow.researchId === "f_kr_us_memory"), false)
})

test("no visible flow lacks meaning, date, direction, confidence, or evidence", () => {
  for (const scene of worldStageScenes) {
    const flowData = buildWorldStageFlowData(scene)
    assert.equal(flowData.features.length, scene.flows.length)

    for (const flow of scene.flows) {
      assert.ok(flow.meaning.trim().length > 0)
      assert.match(flow.asOf, /^\d{4}-\d{2}-\d{2}$/)
      assert.equal(["one-way", "two-way"].includes(flow.direction), true)
      assert.equal(["high", "medium", "low"].includes(flow.confidence), true)
      assert.ok(flow.sourceRefs.length > 0)

      const feature = flowData.features.find((candidate) => candidate.id === flow.id)
      assert.equal(feature?.properties.meaning, flow.meaning)
      assert.equal(feature?.properties.sourceCount, flow.sourceRefs.length)
      assert.equal(feature?.properties.direction, flow.direction)
    }
  }
})

test("compiled scene records preserve research-ledger parity", () => {
  assert.deepEqual(WORLD_STAGE_RESEARCH_SCENE_IDS, researchLedger.scenes.map((scene) => scene.sceneId))
  assert.deepEqual(
    Array.from(new Set(worldStageScenes.map((scene) => scene.researchSceneId))).sort(),
    researchLedger.scenes.map((scene) => scene.sceneId).sort(),
  )

  for (const scene of worldStageScenes) {
    const raw = researchLedger.scenes.find(
      (candidate) => candidate.sceneId === scene.researchSceneId,
    )
    assert.ok(raw)
    assert.equal(scene.publicLabel, raw.publicLabel)
    assert.equal(scene.caption.startsWith(raw.oneSentencePurpose), true)
    assert.equal(scene.lensOwner, raw.lensOwner)
    assert.equal(scene.asOf, raw.evidenceWindow.match(/\d{4}-\d{2}-\d{2}/)?.[0])
    assert.deepEqual(scene.caveats, raw.caveats)
    assert.deepEqual(
      scene.countryRoles.map((country) => country.iso3),
      raw.countryRoles.map((country) => country.iso3),
    )
    assert.deepEqual(
      scene.nodes.map((node) => node.researchId),
      raw.nodes.map((node) => node.id),
    )

    for (const node of scene.nodes) {
      const rawNode: ResearchScene["nodes"][number] | undefined = raw.nodes.find(
        (candidate) => candidate.id === node.researchId,
      )
      assert.ok(rawNode)
      assert.deepEqual(node.coordinates, [rawNode.coordinates[1], rawNode.coordinates[0]])
      assert.equal(node.whyItMatters, rawNode.whyItMatters)
      assert.deepEqual(node.sourceRefs, rawNode.sourceIds)
    }

    const visibleAndOmittedFlowIds = [
      ...scene.flows.map((flow) => flow.researchId),
      ...raw.flows
        .map((flow) => flow.id)
        .filter((id) => id in WORLD_STAGE_OMITTED_FLOW_IDS),
    ]
    assert.deepEqual(visibleAndOmittedFlowIds.sort(), raw.flows.map((flow) => flow.id).sort())

    for (const flow of scene.flows) {
      const rawFlow: ResearchScene["flows"][number] | undefined = raw.flows.find(
        (candidate) => candidate.id === flow.researchId,
      )
      assert.ok(rawFlow)
      assert.equal(flow.meaning, rawFlow["plain-language meaning"])
      assert.equal(flow.direction, rawFlow.direction)
      assert.equal(flow.weight, rawFlow.weight)
      assert.deepEqual([...flow.sourceRefs].sort(), [...rawFlow.sourceIds].sort())
    }
  }
})

test("Mapbox data and the bounded SVG fallback remain in parity", () => {
  assert.equal(WORLD_STAGE_COUNTRY_PATHS.length, WORLD_STAGE_COUNTRY_GEOMETRY.features.length)
  assert.deepEqual(
    WORLD_STAGE_COUNTRY_PATHS.map((country) => country.iso3).sort(),
    WORLD_STAGE_COUNTRY_GEOMETRY.features
      .map((feature) => feature.properties.iso3)
      .sort(),
  )

  for (const scene of worldStageScenes) {
    const countryData = buildWorldStageCountryData(scene)
    const assigned = countryData.features.filter((feature) => feature.properties.role !== "neutral")
    assert.equal(assigned.length, scene.countryRoles.length)
    assert.deepEqual(
      assigned.map((feature) => feature.properties.iso3).sort(),
      scene.countryRoles.map((country) => country.iso3).sort(),
    )

    const fallbackNodes = getWorldStageFallbackNodes(scene)
    const fallbackFlows = getWorldStageFallbackFlows(scene)
    assert.deepEqual(
      fallbackNodes.map((node) => node.id),
      scene.nodes.slice(0, WORLD_STAGE_FALLBACK_NODE_LIMIT).map((node) => node.id),
    )
    assert.deepEqual(
      fallbackFlows.map((flow) => flow.id),
      scene.flows.slice(0, WORLD_STAGE_FALLBACK_FLOW_LIMIT).map((flow) => flow.id),
    )

    const tooltipItems = getWorldStageTooltipItems(scene)
    assert.equal(
      tooltipItems.length,
      scene.countryRoles.length + scene.nodes.length + scene.flows.length,
    )
  }
})

test("validation fails closed when required scene, role, node, flow, or camera fields are missing", () => {
  const missingSceneField = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  delete (missingSceneField[0] as unknown as Record<string, unknown>).caption
  hasCode(validationCodes(missingSceneField), "scene.field.missing")

  const missingRoleEvidence = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  missingRoleEvidence[0].countryRoles[0].sourceRefs = []
  hasCode(validationCodes(missingRoleEvidence), "source-ref.missing")

  const unknownRoleEvidence = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  unknownRoleEvidence[0].countryRoles[0].sourceRefs = ["SRC99"]
  hasCode(validationCodes(unknownRoleEvidence), "source-ref.invalid")

  const invalidRole = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  invalidRole[0].countryRoles[0].role = "ally" as WorldStageScene["countryRoles"][number]["role"]
  hasCode(validationCodes(invalidRole), "country.role.invalid")

  const missingNodeCoordinates = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  delete (missingNodeCoordinates[0].nodes[0] as unknown as Record<string, unknown>).coordinates
  hasCode(validationCodes(missingNodeCoordinates), "node.coordinates.invalid")

  const missingFlowMeaning = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  delete (missingFlowMeaning[0].flows[0] as unknown as Record<string, unknown>).meaning
  hasCode(validationCodes(missingFlowMeaning), "flow.field.missing")

  const missingFlowEvidence = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  missingFlowEvidence[0].flows[0].sourceRefs = []
  hasCode(validationCodes(missingFlowEvidence), "source-ref.missing")

  const invalidCamera = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  invalidCamera[0].camera.center = [181, 0]
  hasCode(validationCodes(invalidCamera), "camera.invalid")

  const missingChipRole = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  delete (missingChipRole[1].nodes[0] as unknown as Record<string, unknown>)
    .semiconductorRole
  hasCode(validationCodes(missingChipRole), "node.semiconductor-role.missing")

  const missingNetworkRelation = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  delete (missingNetworkRelation[1].flows[0] as unknown as Record<string, unknown>).relation
  hasCode(validationCodes(missingNetworkRelation), "flow.relation.missing")
})

test("scene and entity uniqueness validation rejects duplicate records", () => {
  const duplicateScene = [worldStageScenes[0], worldStageScenes[0]]
  hasCode(
    validationCodes(duplicateScene as unknown as readonly WorldStageScene[]),
    "scene.id.duplicate",
  )

  const duplicateNodeId = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  duplicateNodeId[1].nodes[0].id = duplicateNodeId[0].nodes[0].id
  hasCode(validationCodes(duplicateNodeId), "node.id.duplicate")

  const duplicateFlowId = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  duplicateFlowId[1].flows[0].id = duplicateFlowId[0].flows[0].id
  hasCode(validationCodes(duplicateFlowId), "flow.id.duplicate")
})

test("menu validation requires every known item and keeps every public scene reachable", () => {
  const missingMenuItem = worldStageMenuItems.slice(0, -1)
  hasCode(
    validationCodes(worldStageScenes, missingMenuItem as readonly WorldStageMenuItem[]),
    "menu.id.missing",
  )

  const duplicateMenuItem = [...worldStageMenuItems, worldStageMenuItems[0]]
  hasCode(
    validationCodes(worldStageScenes, duplicateMenuItem as readonly WorldStageMenuItem[]),
    "menu.id.duplicate",
  )

  const missingScene = structuredClone(worldStageMenuItems) as unknown as WorldStageMenuItem[]
  missingScene[0].sceneId = "missing" as WorldStageMenuItem["sceneId"]
  hasCode(validationCodes(worldStageScenes, missingScene), "menu.scene.missing")

  const unreachableScene = structuredClone(worldStageMenuItems) as unknown as WorldStageMenuItem[]
  unreachableScene[2].sceneId = "foundation"
  hasCode(validationCodes(worldStageScenes, unreachableScene), "scene.menu.unmapped")
})

test("the Mapbox style supports an environment override with the required dark fallback", () => {
  assert.ok(WORLD_STAGE_MAPBOX_STYLE.length > 0)
  if (!process.env.NEXT_PUBLIC_MAPBOX_STYLE?.trim()) {
    assert.equal(WORLD_STAGE_MAPBOX_STYLE, "mapbox://styles/mapbox/dark-v11")
  }
})

test("auto-spin advances by one second at the configured revolution speed", () => {
  assert.equal(
    getNextWorldStageSpinLongitude({
      longitude: 10,
      zoom: 1.5,
      reducedMotion: false,
      motionPaused: false,
      now: 8_000,
      idleResumeAt: 8_000,
    }),
    8.5,
  )
})

test("auto-spin stops at the maximum zoom and under reduced motion or pause", () => {
  assert.equal(
    getNextWorldStageSpinLongitude({
      longitude: 10,
      zoom: WORLD_STAGE_MAX_SPIN_ZOOM,
      reducedMotion: false,
      motionPaused: false,
      now: 8_000,
      idleResumeAt: 8_000,
    }),
    null,
  )
  assert.equal(
    getNextWorldStageSpinLongitude({
      longitude: 10,
      zoom: 1.5,
      reducedMotion: true,
      motionPaused: false,
      now: 8_000,
      idleResumeAt: 8_000,
    }),
    null,
  )
  assert.equal(
    getNextWorldStageSpinLongitude({
      longitude: 10,
      zoom: 1.5,
      reducedMotion: false,
      motionPaused: true,
      now: 12_000,
      idleResumeAt: 8_000,
    }),
    null,
  )
})

test("idle resume becomes eligible four seconds after the final interaction", () => {
  const interactionAt = 10_000
  const resumeAt = getWorldStageIdleResumeAt(interactionAt)

  assert.equal(resumeAt, interactionAt + WORLD_STAGE_GLOBE_IDLE_RESUME_MS)
  assert.equal(isWorldStageIdleResumeReady(resumeAt - 1, resumeAt), false)
  assert.equal(isWorldStageIdleResumeReady(resumeAt, resumeAt), true)
})
