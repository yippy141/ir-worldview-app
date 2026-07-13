import test from "node:test"
import assert from "node:assert/strict"
import {
  isValidWorldStageIso3Key,
  validateWorldStageCatalog,
  worldStageMenuItems,
  worldStageScenes,
} from "@/lib/world-stage/scenes"
import { WORLD_STAGE_MENU_IDS, WORLD_STAGE_SCENE_IDS } from "@/lib/world-stage/types"
import type {
  WorldStageMenuItem,
  WorldStageScene,
  WorldStageValidationCode,
} from "@/lib/world-stage/types"

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

test("the reviewed World Stage catalog and complete menu mapping are valid", () => {
  const validation = validateWorldStageCatalog()

  assert.deepEqual(validation, { ok: true, errors: [] })
  assert.deepEqual(
    worldStageScenes.map((scene) => scene.id),
    WORLD_STAGE_SCENE_IDS,
  )
  assert.deepEqual(
    worldStageMenuItems.map((item) => item.id),
    WORLD_STAGE_MENU_IDS,
  )

  for (const scene of worldStageScenes) {
    assert.equal(scene.dataStatus, "editorial-demo")
    assert.match(scene.qualification, /illustrative/i)
    assert.match(scene.qualification, /not live intelligence/i)
  }
})

test("scene nodes accept only reviewed valid ISO-3 geometry keys", () => {
  assert.equal(isValidWorldStageIso3Key("USA"), true)
  assert.equal(isValidWorldStageIso3Key("JPN"), true)
  assert.equal(isValidWorldStageIso3Key("usa"), false)
  assert.equal(isValidWorldStageIso3Key("US"), false)
  assert.equal(isValidWorldStageIso3Key("ZZZ"), false)

  const scenes = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  scenes[0].nodes[0].iso3Key = "ZZZ"

  hasCode(validationCodes(scenes), "node.iso3.invalid")
})

test("scene, node, and route IDs remain globally unique", () => {
  const duplicateScenes = [worldStageScenes[0], worldStageScenes[0]]
  hasCode(
    validationCodes(duplicateScenes as unknown as readonly WorldStageScene[]),
    "scene.id.duplicate",
  )

  const duplicateNodes = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  duplicateNodes[1].nodes[0].id = duplicateNodes[0].nodes[0].id
  hasCode(validationCodes(duplicateNodes), "node.id.duplicate")

  const duplicateRoutes = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  duplicateRoutes[1].routes[0].id = duplicateRoutes[0].routes[0].id
  hasCode(validationCodes(duplicateRoutes), "route.id.duplicate")

  const crossKindCollision = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  crossKindCollision[0].routes[0].id = crossKindCollision[0].nodes[0].id
  hasCode(validationCodes(crossKindCollision), "entity.id.collision")
})

test("routes resolve both endpoints within their own scene", () => {
  const scenes = structuredClone(worldStageScenes) as unknown as WorldStageScene[]
  scenes[0].routes[0].toNodeId = scenes[1].nodes[0].id

  hasCode(validationCodes(scenes), "route.endpoint.missing")
})

test("menu validation requires every known item exactly once and every scene reachable", () => {
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

  const unknownMenu = structuredClone(worldStageMenuItems) as unknown as WorldStageMenuItem[]
  unknownMenu[0].id = "unknown" as WorldStageMenuItem["id"]
  hasCode(validationCodes(worldStageScenes, unknownMenu), "menu.id.unknown")

  const missingScene = structuredClone(worldStageMenuItems) as unknown as WorldStageMenuItem[]
  missingScene[0].sceneId = "missing" as WorldStageMenuItem["sceneId"]
  hasCode(validationCodes(worldStageScenes, missingScene), "menu.scene.missing")

  const unreachableScene = structuredClone(worldStageMenuItems) as unknown as WorldStageMenuItem[]
  for (const item of unreachableScene) {
    if (item.sceneId === "futures") item.sceneId = "foundation"
  }
  hasCode(validationCodes(worldStageScenes, unreachableScene), "scene.menu.unmapped")
})
