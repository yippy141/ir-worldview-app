import test from "node:test"
import assert from "node:assert/strict"
import {
  getNextWorldStageMenuIndex,
  WORLD_STAGE_CAMERAS,
  WORLD_STAGE_IDLE_INTERVAL_MS,
  WORLD_STAGE_ISO3_COORDINATES,
  WORLD_STAGE_TRANSITION_MS,
} from "@/lib/world-stage/map-config"
import {
  isValidWorldStageIso3Key,
  validateWorldStageCatalog,
  worldStageMenuItems,
  worldStageScenes,
} from "@/lib/world-stage/scenes"
import { isImmersiveRoute } from "@/lib/site-shell"
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

test("the six production menu rows keep their reviewed order, lenses, and routes", () => {
  assert.deepEqual(
    worldStageMenuItems.map(({ index, id, label, sceneId, lens, href }) => ({
      index,
      id,
      label,
      sceneId,
      lens,
      href,
    })),
    [
      {
        index: "01",
        id: "foundation",
        label: "Foundation",
        sceneId: "foundation",
        lens: "Baseline judgments",
        href: "/quiz",
      },
      {
        index: "02",
        id: "focus-areas",
        label: "Focus Areas",
        sceneId: "foundation",
        lens: "Issue-specific pressure",
        href: "/modules",
      },
      {
        index: "03",
        id: "perspective-runs",
        label: "My perspective shifts",
        sceneId: "perspectives",
        lens: "Judgment under context",
        href: "/perspectives",
      },
      {
        index: "04",
        id: "worldview-map",
        label: "Worldview Map",
        sceneId: "perspectives",
        lens: "Modeled positions",
        href: "/explore/atlas",
      },
      {
        index: "05",
        id: "ai-futures",
        label: "AI & Futures",
        sceneId: "futures",
        lens: "Technology and order",
        href: "/ai",
      },
      {
        index: "06",
        id: "profile",
        label: "My Profile",
        sceneId: "foundation",
        lens: "Your saved layers",
        href: "/profile",
      },
    ],
  )

  for (const item of worldStageMenuItems) {
    assert.ok(item.description.trim().length > 0)
    assert.ok(item.action.trim().length > 0)
  }
})

test("every reviewed map node and menu lens has finite display framing", () => {
  for (const scene of worldStageScenes) {
    for (const node of scene.nodes) {
      const coordinates =
        WORLD_STAGE_ISO3_COORDINATES[
          node.iso3Key as keyof typeof WORLD_STAGE_ISO3_COORDINATES
        ]
      assert.ok(coordinates, `missing display coordinates for ${node.iso3Key}`)
      assert.equal(coordinates.every(Number.isFinite), true)
    }
  }

  for (const item of worldStageMenuItems) {
    const camera = WORLD_STAGE_CAMERAS[item.id]
    assert.ok(camera, `missing camera for ${item.id}`)
    assert.equal(
      [...camera.center, camera.zoom, camera.pitch, camera.bearing].every(Number.isFinite),
      true,
    )
  }
})

test("the idle sequence and scene transitions stay within the production timing window", () => {
  assert.ok(WORLD_STAGE_IDLE_INTERVAL_MS >= 8_000)
  assert.ok(WORLD_STAGE_IDLE_INTERVAL_MS <= 12_000)
  assert.ok(WORLD_STAGE_TRANSITION_MS >= 600)
  assert.ok(WORLD_STAGE_TRANSITION_MS <= 1_200)

  assert.deepEqual(
    Array.from({ length: worldStageMenuItems.length }, (_, index) =>
      getNextWorldStageMenuIndex(index),
    ),
    [1, 2, 3, 4, 5, 0],
  )
})

test("only the root and prototype use the immersive shell", () => {
  assert.equal(isImmersiveRoute("/"), true)
  assert.equal(isImmersiveRoute("/world-stage-prototype"), true)
  assert.equal(isImmersiveRoute("/about"), false)
  assert.equal(isImmersiveRoute("/quiz"), false)
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
