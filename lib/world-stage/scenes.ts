import {
  WORLD_STAGE_MENU_IDS,
  WORLD_STAGE_SCENE_IDS,
  type WorldStageMenuItem,
  type WorldStageScene,
  type WorldStageValidationError,
  type WorldStageValidationResult,
} from "@/lib/world-stage/types"

/**
 * ISO-3 geometry keys reviewed for the initial scene set. Keeping this explicit
 * prevents a plausible-looking but unsupported map key from silently rendering.
 */
export const WORLD_STAGE_REVIEWED_ISO3_KEYS = [
  "AUS",
  "BRA",
  "CAN",
  "DEU",
  "IND",
  "JPN",
  "KEN",
  "SGP",
  "USA",
] as const

const reviewedIso3Keys = new Set<string>(WORLD_STAGE_REVIEWED_ISO3_KEYS)
const expectedSceneIds = new Set<string>(WORLD_STAGE_SCENE_IDS)
const expectedMenuIds = new Set<string>(WORLD_STAGE_MENU_IDS)

const editorialDemoQualification =
  "Illustrative editorial demo for product navigation; map placement does not describe current policy and is not live intelligence."

export const worldStageScenes = [
  {
    id: "foundation",
    title: "Foundation",
    summary: "A visual entry point to the seven recurring dimensions in the baseline inventory.",
    dataStatus: "editorial-demo",
    qualification: editorialDemoQualification,
    nodes: [
      { id: "foundation-bra", iso3Key: "BRA", label: "Brazil · illustrative anchor" },
      { id: "foundation-deu", iso3Key: "DEU", label: "Germany · illustrative anchor" },
      { id: "foundation-ind", iso3Key: "IND", label: "India · illustrative anchor" },
    ],
    routes: [
      {
        id: "foundation-route-one",
        fromNodeId: "foundation-bra",
        toNodeId: "foundation-deu",
        label: "Illustrative baseline route",
      },
      {
        id: "foundation-route-two",
        fromNodeId: "foundation-deu",
        toNodeId: "foundation-ind",
        label: "Illustrative baseline route",
      },
    ],
  },
  {
    id: "perspectives",
    title: "My perspective shifts",
    summary: "A visual entry point for revisiting the baseline from a defined situation.",
    dataStatus: "editorial-demo",
    qualification: editorialDemoQualification,
    nodes: [
      { id: "perspectives-can", iso3Key: "CAN", label: "Canada · illustrative anchor" },
      { id: "perspectives-ken", iso3Key: "KEN", label: "Kenya · illustrative anchor" },
      { id: "perspectives-sgp", iso3Key: "SGP", label: "Singapore · illustrative anchor" },
    ],
    routes: [
      {
        id: "perspectives-route-one",
        fromNodeId: "perspectives-can",
        toNodeId: "perspectives-ken",
        label: "Illustrative context route",
      },
      {
        id: "perspectives-route-two",
        fromNodeId: "perspectives-ken",
        toNodeId: "perspectives-sgp",
        label: "Illustrative context route",
      },
    ],
  },
  {
    id: "futures",
    title: "AI & Futures",
    summary: "A visual entry point to AI-governance choices and longer-run trajectories.",
    dataStatus: "editorial-demo",
    qualification: editorialDemoQualification,
    nodes: [
      { id: "futures-usa", iso3Key: "USA", label: "United States · illustrative anchor" },
      { id: "futures-jpn", iso3Key: "JPN", label: "Japan · illustrative anchor" },
      { id: "futures-aus", iso3Key: "AUS", label: "Australia · illustrative anchor" },
    ],
    routes: [
      {
        id: "futures-route-one",
        fromNodeId: "futures-usa",
        toNodeId: "futures-jpn",
        label: "Illustrative futures route",
      },
      {
        id: "futures-route-two",
        fromNodeId: "futures-jpn",
        toNodeId: "futures-aus",
        label: "Illustrative futures route",
      },
    ],
  },
] as const satisfies readonly WorldStageScene[]

export const worldStageMenuItems = [
  {
    id: "foundation",
    index: "01",
    label: "Foundation",
    sceneId: "foundation",
    lens: "Baseline judgments",
    description: "Build a baseline across seven recurring foreign-policy tradeoffs.",
    href: "/quiz",
    action: "Open Foundation",
  },
  {
    id: "focus-areas",
    index: "02",
    label: "Focus Areas",
    sceneId: "foundation",
    lens: "Issue-specific pressure",
    description: "Test how security, technology, and geoeconomics change the argument.",
    href: "/modules",
    action: "Open Focus Areas",
  },
  {
    id: "perspective-runs",
    index: "03",
    label: "My perspective shifts",
    sceneId: "perspectives",
    lens: "Judgment under context",
    description: "Revisit the same dimensions from a defined strategic situation.",
    href: "/perspectives",
    action: "Open my perspective shifts",
  },
  {
    id: "worldview-map",
    index: "04",
    label: "Worldview Map",
    sceneId: "perspectives",
    lens: "Modeled positions",
    description: "Browse nearby profiles, contextual movement, and the model’s limits.",
    href: "/explore/atlas",
    action: "Open Worldview Map",
  },
  {
    id: "ai-futures",
    index: "05",
    label: "AI & Futures",
    sceneId: "futures",
    lens: "Technology and order",
    description: "Examine AI governance choices and the futures those choices could shape.",
    href: "/ai",
    action: "Open AI Governance",
  },
  {
    id: "profile",
    index: "06",
    label: "My Profile",
    sceneId: "foundation",
    lens: "Your saved layers",
    description: "Return to your baseline, issue results, and contextual shifts on this device.",
    href: "/profile",
    action: "Open My Profile",
  },
] as const satisfies readonly WorldStageMenuItem[]

export function isValidWorldStageIso3Key(value: unknown): value is string {
  return typeof value === "string" && reviewedIso3Keys.has(value)
}

export function validateWorldStageCatalog(
  scenes: readonly WorldStageScene[] = worldStageScenes,
  menuItems: readonly WorldStageMenuItem[] = worldStageMenuItems,
): WorldStageValidationResult {
  const errors: WorldStageValidationError[] = []
  const sceneIds = new Set<string>()
  const nodeIds = new Set<string>()
  const routeIds = new Set<string>()

  function addError(error: WorldStageValidationError) {
    errors.push(error)
  }

  scenes.forEach((scene, sceneIndex) => {
    const scenePath = `scenes[${sceneIndex}]`

    if (!expectedSceneIds.has(scene.id)) {
      addError({
        code: "scene.id.unknown",
        path: `${scenePath}.id`,
        message: `Unknown World Stage scene ID: ${scene.id}.`,
      })
    }

    if (sceneIds.has(scene.id)) {
      addError({
        code: "scene.id.duplicate",
        path: `${scenePath}.id`,
        message: `Scene ID must be unique: ${scene.id}.`,
      })
    }
    sceneIds.add(scene.id)

    if (scene.dataStatus !== "editorial-demo") {
      addError({
        code: "scene.data-status.invalid",
        path: `${scenePath}.dataStatus`,
        message: "Initial World Stage scenes must be marked editorial-demo.",
      })
    }

    if (!scene.qualification.trim()) {
      addError({
        code: "scene.qualification.missing",
        path: `${scenePath}.qualification`,
        message: "Editorial demo scenes require a visible qualification.",
      })
    }

    const localNodeIds = new Set<string>()

    scene.nodes.forEach((node, nodeIndex) => {
      const nodePath = `${scenePath}.nodes[${nodeIndex}]`

      if (nodeIds.has(node.id)) {
        addError({
          code: "node.id.duplicate",
          path: `${nodePath}.id`,
          message: `Node ID must be globally unique: ${node.id}.`,
        })
      }
      nodeIds.add(node.id)
      localNodeIds.add(node.id)

      if (routeIds.has(node.id)) {
        addError({
          code: "entity.id.collision",
          path: `${nodePath}.id`,
          message: `Node and route IDs share one namespace: ${node.id}.`,
        })
      }

      if (!isValidWorldStageIso3Key(node.iso3Key)) {
        addError({
          code: "node.iso3.invalid",
          path: `${nodePath}.iso3Key`,
          message: `ISO-3 key is not in the reviewed scene allowlist: ${node.iso3Key}.`,
        })
      }
    })

    scene.routes.forEach((route, routeIndex) => {
      const routePath = `${scenePath}.routes[${routeIndex}]`

      if (routeIds.has(route.id)) {
        addError({
          code: "route.id.duplicate",
          path: `${routePath}.id`,
          message: `Route ID must be globally unique: ${route.id}.`,
        })
      }
      routeIds.add(route.id)

      if (nodeIds.has(route.id)) {
        addError({
          code: "entity.id.collision",
          path: `${routePath}.id`,
          message: `Node and route IDs share one namespace: ${route.id}.`,
        })
      }

      for (const [endpoint, nodeId] of [
        ["fromNodeId", route.fromNodeId],
        ["toNodeId", route.toNodeId],
      ] as const) {
        if (!localNodeIds.has(nodeId)) {
          addError({
            code: "route.endpoint.missing",
            path: `${routePath}.${endpoint}`,
            message: `Route endpoint must resolve inside scene ${scene.id}: ${nodeId}.`,
          })
        }
      }
    })
  })

  const menuIds = new Set<string>()
  const mappedSceneIds = new Set<string>()

  menuItems.forEach((item, menuIndex) => {
    const menuPath = `menuItems[${menuIndex}]`

    if (!expectedMenuIds.has(item.id)) {
      addError({
        code: "menu.id.unknown",
        path: `${menuPath}.id`,
        message: `Unknown World Stage menu ID: ${item.id}.`,
      })
    }

    if (menuIds.has(item.id)) {
      addError({
        code: "menu.id.duplicate",
        path: `${menuPath}.id`,
        message: `Menu ID must map exactly once: ${item.id}.`,
      })
    }
    menuIds.add(item.id)

    if (!sceneIds.has(item.sceneId)) {
      addError({
        code: "menu.scene.missing",
        path: `${menuPath}.sceneId`,
        message: `Menu item references an unknown scene: ${item.sceneId}.`,
      })
    } else {
      mappedSceneIds.add(item.sceneId)
    }
  })

  for (const menuId of WORLD_STAGE_MENU_IDS) {
    if (!menuIds.has(menuId)) {
      addError({
        code: "menu.id.missing",
        path: "menuItems",
        message: `Menu-to-scene mapping is missing: ${menuId}.`,
      })
    }
  }

  for (const sceneId of sceneIds) {
    if (!mappedSceneIds.has(sceneId)) {
      addError({
        code: "scene.menu.unmapped",
        path: "menuItems",
        message: `Scene is not reachable from the menu: ${sceneId}.`,
      })
    }
  }

  return errors.length === 0 ? { ok: true, errors: [] } : { ok: false, errors }
}

const shippedCatalogValidation = validateWorldStageCatalog()

if (!shippedCatalogValidation.ok) {
  throw new Error(
    `Invalid shipped World Stage catalog: ${JSON.stringify(shippedCatalogValidation.errors)}`,
  )
}
