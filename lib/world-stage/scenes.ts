import sceneLedgerJson from "@/research/world-stage/scene-ledger.json" with {
  type: "json",
}
import sourceLedgerJson from "@/research/world-stage/source-ledger.json" with {
  type: "json",
}
import {
  WORLD_STAGE_CONFIDENCE_LEVELS,
  WORLD_STAGE_COUNTRY_ROLES,
  WORLD_STAGE_FLOW_KINDS,
  WORLD_STAGE_MENU_IDS,
  WORLD_STAGE_NODE_KINDS,
  WORLD_STAGE_SCENE_IDS,
  type CountryRole,
  type WorldStageConfidence,
  type WorldStageCountryRole,
  type WorldStageFlow,
  type WorldStageFlowDirection,
  type WorldStageFlowWeight,
  type WorldStageMenuItem,
  type WorldStageNode,
  type WorldStageScene,
  type WorldStageSceneId,
  type WorldStageSceneOption,
  type WorldStageValidationError,
  type WorldStageValidationResult,
} from "@/lib/world-stage/types"

type RawCountryRole = {
  iso3: string
  role: string
  rationale: string
  confidence: string
  sourceIds: string[]
}

type RawNode = {
  id: string
  kind: string
  label: string
  /** Research ledger convention: [latitude, longitude]. */
  coordinates: [number, number]
  importance: number
  whyItMatters: string
  confidence: string
  sourceIds: string[]
}

type RawFlow = {
  id: string
  kind: string
  label: string
  from: string
  to: string
  direction: string
  weight: number
  "plain-language meaning": string
  confidence: string
  sourceIds: string[]
}

type RawScene = {
  sceneId: string
  publicLabel: string
  oneSentencePurpose: string
  lensOwner: string
  evidenceWindow: string
  countryRoles: RawCountryRole[]
  nodes: RawNode[]
  flows: RawFlow[]
  caveats: string[]
  sensitiveOrDisputedClassifications: string[]
  missingEvidence: string[]
}

type RawSceneLedger = {
  researchRunDate: string
  scenes: RawScene[]
}

const sceneLedger = sceneLedgerJson as unknown as RawSceneLedger
const rawScenes = sceneLedger.scenes
const knownSourceRefs = new Set(
  (sourceLedgerJson as Array<{ sourceId: string }>).map((source) => source.sourceId),
)
const expectedSceneIds = new Set<string>(WORLD_STAGE_SCENE_IDS)
const expectedMenuIds = new Set<string>(WORLD_STAGE_MENU_IDS)

const rawRoleMap: Record<string, CountryRole> = {
  "lens owner": "focus",
  "formal treaty ally": "partner",
  "strategic partner": "partner",
  competitor: "competitor",
  "hedging actor": "hedging",
  "exposed or dependent actor": "exposed",
  "contested relationship": "contested",
}

/**
 * These records describe a bottleneck that other actors depend on. Rendering
 * them as `exposed` would reverse the rationale, so the map uses the
 * non-relational `focus` role while preserving the ledger text and evidence.
 */
export const WORLD_STAGE_ROLE_ADJUSTMENTS = {
  "semiconductor_advanced_manufacturing_networks:NLD": "focus",
  "frontier_ai_compute_chips_cloud_governance:TWN": "focus",
  "frontier_ai_compute_chips_cloud_governance:NLD": "focus",
} as const satisfies Record<string, CountryRole>

/** Flow claims intentionally withheld because the cited records are parallel, not bilateral. */
export const WORLD_STAGE_OMITTED_FLOW_IDS = {
  f_us_uk_governance:
    "SRC41 and SRC43 document separate national institutions, not a direct Washington-London flow.",
} as const

type SceneBinding = {
  id: WorldStageSceneId
  researchSceneId: string
  variantOf: WorldStageSceneId | null
  captionSuffix?: string
  camera: WorldStageScene["camera"]
}

const sceneBindings = [
  {
    id: "foundation",
    researchSceneId: "us_alliance_security_lens",
    variantOf: null,
    camera: { center: [123, 23], zoom: 1.28, pitch: 10, bearing: -7 },
  },
  {
    id: "focus-areas",
    researchSceneId: "semiconductor_advanced_manufacturing_networks",
    variantOf: null,
    camera: { center: [112, 29], zoom: 1.58, pitch: 18, bearing: 5 },
  },
  {
    id: "perspectives",
    researchSceneId: "beijing_regional_security_lens",
    variantOf: null,
    camera: { center: [103, 30], zoom: 1.42, pitch: 12, bearing: -10 },
  },
  {
    id: "worldview-map",
    researchSceneId: "middle_power_hedging_nonalignment",
    variantOf: null,
    captionSuffix:
      " This geographic lens is separate from the app’s conceptual Worldview Map.",
    camera: { center: [54, 11], zoom: 1.16, pitch: 16, bearing: 8 },
  },
  {
    id: "futures",
    researchSceneId: "frontier_ai_compute_chips_cloud_governance",
    variantOf: null,
    camera: { center: [-22, 31], zoom: 1.12, pitch: 14, bearing: 12 },
  },
] as const satisfies readonly SceneBinding[]

export const WORLD_STAGE_RESEARCH_SCENE_IDS = rawScenes.map((scene) => scene.sceneId)

export const WORLD_STAGE_REVIEWED_ISO3_KEYS = Array.from(
  new Set(rawScenes.flatMap((scene) => scene.countryRoles.map((role) => role.iso3))),
).sort()

const reviewedIso3Keys = new Set<string>(WORLD_STAGE_REVIEWED_ISO3_KEYS)

function uniqueSourceRefs(refs: readonly string[]) {
  return Array.from(new Set(refs)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

function parseAsOf(evidenceWindow: string) {
  return evidenceWindow.match(/\basOf\s+(\d{4}-\d{2}-\d{2})\b/)?.[1] ?? ""
}

function normalizeConfidence(value: string): WorldStageConfidence {
  return WORLD_STAGE_CONFIDENCE_LEVELS.includes(value as WorldStageConfidence)
    ? (value as WorldStageConfidence)
    : (value as WorldStageConfidence)
}

function normalizeCountryRole(rawSceneId: string, role: RawCountryRole): CountryRole {
  const adjustmentKey = `${rawSceneId}:${role.iso3}`
  const adjusted = WORLD_STAGE_ROLE_ADJUSTMENTS[
    adjustmentKey as keyof typeof WORLD_STAGE_ROLE_ADJUSTMENTS
  ]

  return adjusted ?? rawRoleMap[role.role] ?? (role.role as CountryRole)
}

function compileScene(binding: SceneBinding): WorldStageScene {
  const rawScene = rawScenes.find((scene) => scene.sceneId === binding.researchSceneId)

  if (!rawScene) {
    throw new Error(`Missing reviewed World Stage research scene: ${binding.researchSceneId}.`)
  }

  const asOf = parseAsOf(rawScene.evidenceWindow)
  const nodeId = (researchId: string) => `${binding.id}--${researchId}`
  const countryRoles: WorldStageCountryRole[] = rawScene.countryRoles.map((role) => ({
    iso3: role.iso3,
    role: normalizeCountryRole(rawScene.sceneId, role),
    rationale: role.rationale,
    confidence: normalizeConfidence(role.confidence),
    sourceRefs: uniqueSourceRefs(role.sourceIds),
  }))
  const nodes: WorldStageNode[] = rawScene.nodes.map((node) => ({
    id: nodeId(node.id),
    researchId: node.id,
    kind: node.kind as WorldStageNode["kind"],
    label: node.label,
    coordinates: [node.coordinates[1], node.coordinates[0]],
    whyItMatters: node.whyItMatters,
    confidence: normalizeConfidence(node.confidence),
    sourceRefs: uniqueSourceRefs(node.sourceIds),
  }))
  const flows: WorldStageFlow[] = rawScene.flows
    .filter(
      (flow) =>
        !(flow.id in WORLD_STAGE_OMITTED_FLOW_IDS),
    )
    .map((flow) => ({
      id: nodeId(flow.id),
      researchId: flow.id,
      kind: flow.kind as WorldStageFlow["kind"],
      label: flow.label,
      fromNodeId: nodeId(flow.from),
      toNodeId: nodeId(flow.to),
      meaning: flow["plain-language meaning"],
      direction: flow.direction as WorldStageFlowDirection,
      weight: flow.weight as WorldStageFlowWeight,
      confidence: normalizeConfidence(flow.confidence),
      asOf,
      sourceRefs: uniqueSourceRefs(flow.sourceIds),
    }))
  const sourceRefs = uniqueSourceRefs([
    ...countryRoles.flatMap((role) => role.sourceRefs),
    ...nodes.flatMap((node) => node.sourceRefs),
    ...flows.flatMap((flow) => flow.sourceRefs),
  ])

  return {
    id: binding.id,
    researchSceneId: rawScene.sceneId,
    variantOf: binding.variantOf,
    publicLabel: rawScene.publicLabel,
    caption: `${rawScene.oneSentencePurpose}${binding.captionSuffix ?? ""}`,
    lensOwner: rawScene.lensOwner,
    asOf,
    dataStatus: "reviewed-editorial",
    sourceRefs,
    countryRoles,
    nodes,
    flows,
    caveats: [...rawScene.caveats],
    camera: binding.camera,
  }
}

export const worldStageScenes = sceneBindings.map(compileScene)

export const worldStageSceneOptions = [
  { sceneId: "foundation", label: "Pacific alliances" },
  { sceneId: "focus-areas", label: "Chip networks" },
  { sceneId: "perspectives", label: "Regional security" },
  { sceneId: "worldview-map", label: "Hedging states" },
  { sceneId: "futures", label: "AI infrastructure" },
] as const satisfies readonly WorldStageSceneOption[]

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
    sceneId: "focus-areas",
    lens: "Issue-specific pressure",
    description: "Test how security, technology, and geoeconomics change the argument.",
    href: "/modules",
    action: "Open Focus Areas",
  },
  {
    id: "perspective-runs",
    index: "03",
    label: "Perspective Runs",
    sceneId: "perspectives",
    lens: "Judgment under context",
    description: "Revisit the same dimensions from a defined strategic situation.",
    href: "/perspectives",
    action: "Open Perspective Runs",
  },
  {
    id: "worldview-map",
    index: "04",
    label: "Worldview Map",
    sceneId: "worldview-map",
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
  return typeof value === "string" && /^[A-Z]{3}$/.test(value) && reviewedIso3Keys.has(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function hasValidSourceRefs(value: unknown) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((ref) => typeof ref === "string" && /^SRC\d{2}$/.test(ref))
  )
}

function hasValidConfidence(value: unknown) {
  return WORLD_STAGE_CONFIDENCE_LEVELS.includes(value as WorldStageConfidence)
}

export function validateWorldStageCatalog(
  scenes: readonly WorldStageScene[] = worldStageScenes,
  menuItems: readonly WorldStageMenuItem[] = worldStageMenuItems,
): WorldStageValidationResult {
  const errors: WorldStageValidationError[] = []
  const sceneIds = new Set<string>()
  const entityIds = new Map<string, "node" | "flow">()

  function addError(code: WorldStageValidationError["code"], path: string, message: string) {
    errors.push({ code, path, message })
  }

  function validateSourceRefs(value: unknown, path: string) {
    if (!Array.isArray(value) || value.length === 0) {
      addError("source-ref.missing", path, "At least one source reference is required.")
      return
    }

    value.forEach((ref, index) => {
      if (
        typeof ref !== "string" ||
        !/^SRC\d{2}$/.test(ref) ||
        !knownSourceRefs.has(ref)
      ) {
        addError(
          "source-ref.invalid",
          `${path}[${index}]`,
          `Invalid World Stage source reference: ${String(ref)}.`,
        )
      }
    })
  }

  scenes.forEach((scene, sceneIndex) => {
    const scenePath = `scenes[${sceneIndex}]`

    if (!isNonEmptyString(scene.id)) {
      addError("scene.field.missing", `${scenePath}.id`, "Scene ID is required.")
    } else if (!expectedSceneIds.has(scene.id)) {
      addError("scene.id.unknown", `${scenePath}.id`, `Unknown World Stage scene ID: ${scene.id}.`)
    }

    if (sceneIds.has(scene.id)) {
      addError("scene.id.duplicate", `${scenePath}.id`, `Scene ID must be unique: ${scene.id}.`)
    }
    sceneIds.add(scene.id)

    if (!isNonEmptyString(scene.researchSceneId)) {
      addError(
        "scene.research-id.missing",
        `${scenePath}.researchSceneId`,
        "A reviewed research-scene ID is required.",
      )
    }

    for (const field of ["publicLabel", "caption", "lensOwner"] as const) {
      if (!isNonEmptyString(scene[field])) {
        addError("scene.field.missing", `${scenePath}.${field}`, `Scene ${field} is required.`)
      }
    }

    if (!isNonEmptyString(scene.asOf) || !/^\d{4}-\d{2}-\d{2}$/.test(scene.asOf)) {
      addError("scene.as-of.invalid", `${scenePath}.asOf`, "Scene asOf must be an ISO date.")
    }

    if (scene.dataStatus !== "reviewed-editorial") {
      addError(
        "scene.data-status.invalid",
        `${scenePath}.dataStatus`,
        "World Stage scenes must be marked reviewed-editorial.",
      )
    }

    validateSourceRefs(scene.sourceRefs, `${scenePath}.sourceRefs`)

    if (!Array.isArray(scene.caveats) || scene.caveats.length === 0) {
      addError("scene.field.missing", `${scenePath}.caveats`, "Scene caveats are required.")
    }

    const camera = scene.camera
    if (
      !camera ||
      !Array.isArray(camera.center) ||
      camera.center.length !== 2 ||
      !Number.isFinite(camera.center[0]) ||
      !Number.isFinite(camera.center[1]) ||
      camera.center[0] < -180 ||
      camera.center[0] > 180 ||
      camera.center[1] < -90 ||
      camera.center[1] > 90 ||
      !Number.isFinite(camera.zoom) ||
      camera.zoom < 0 ||
      camera.zoom > 22 ||
      !Number.isFinite(camera.pitch) ||
      camera.pitch < 0 ||
      camera.pitch > 85 ||
      !Number.isFinite(camera.bearing) ||
      camera.bearing < -180 ||
      camera.bearing > 180
    ) {
      addError("camera.invalid", `${scenePath}.camera`, "Scene camera is incomplete or invalid.")
    }

    const localNodeIds = new Set<string>()
    const childSourceRefs = new Set<string>()
    const countryIso3Keys = new Set<string>()
    const countryRoles = Array.isArray(scene.countryRoles) ? scene.countryRoles : []

    if (!Array.isArray(scene.countryRoles) || scene.countryRoles.length === 0) {
      addError(
        "scene.field.missing",
        `${scenePath}.countryRoles`,
        "Scene country roles are required.",
      )
    }

    countryRoles.forEach((country, countryIndex) => {
      const countryPath = `${scenePath}.countryRoles[${countryIndex}]`

      if (!isValidWorldStageIso3Key(country.iso3)) {
        addError(
          "country.iso3.invalid",
          `${countryPath}.iso3`,
          `ISO-3 key is not in the reviewed scene set: ${country.iso3}.`,
        )
      }
      if (countryIso3Keys.has(country.iso3)) {
        addError(
          "country.iso3.duplicate",
          `${countryPath}.iso3`,
          `Country role must be unique inside the scene: ${country.iso3}.`,
        )
      }
      countryIso3Keys.add(country.iso3)

      if (!WORLD_STAGE_COUNTRY_ROLES.includes(country.role)) {
        addError(
          "country.role.invalid",
          `${countryPath}.role`,
          `Unsupported country role: ${country.role}.`,
        )
      }
      if (!isNonEmptyString(country.rationale)) {
        addError(
          "country.field.missing",
          `${countryPath}.rationale`,
          "Country-role rationale is required.",
        )
      }
      if (!hasValidConfidence(country.confidence)) {
        addError(
          "confidence.invalid",
          `${countryPath}.confidence`,
          "Country-role confidence is invalid.",
        )
      }
      validateSourceRefs(country.sourceRefs, `${countryPath}.sourceRefs`)
      if (Array.isArray(country.sourceRefs)) {
        country.sourceRefs.forEach((ref: string) => childSourceRefs.add(ref))
      }
    })

    const nodes = Array.isArray(scene.nodes) ? scene.nodes : []
    if (!Array.isArray(scene.nodes) || scene.nodes.length === 0) {
      addError("scene.field.missing", `${scenePath}.nodes`, "Scene nodes are required.")
    }

    nodes.forEach((node, nodeIndex) => {
      const nodePath = `${scenePath}.nodes[${nodeIndex}]`

      for (const field of ["id", "researchId", "label", "whyItMatters"] as const) {
        if (!isNonEmptyString(node[field])) {
          addError("node.field.missing", `${nodePath}.${field}`, `Node ${field} is required.`)
        }
      }

      if (entityIds.has(node.id)) {
        addError(
          entityIds.get(node.id) === "node" ? "node.id.duplicate" : "entity.id.collision",
          `${nodePath}.id`,
          `World Stage entity ID must be globally unique: ${node.id}.`,
        )
      }
      entityIds.set(node.id, "node")
      localNodeIds.add(node.id)

      if (!WORLD_STAGE_NODE_KINDS.includes(node.kind)) {
        addError("node.kind.invalid", `${nodePath}.kind`, `Unsupported node kind: ${node.kind}.`)
      }
      if (
        !Array.isArray(node.coordinates) ||
        node.coordinates.length !== 2 ||
        !Number.isFinite(node.coordinates[0]) ||
        !Number.isFinite(node.coordinates[1]) ||
        node.coordinates[0] < -180 ||
        node.coordinates[0] > 180 ||
        node.coordinates[1] < -90 ||
        node.coordinates[1] > 90
      ) {
        addError(
          "node.coordinates.invalid",
          `${nodePath}.coordinates`,
          "Node coordinates must be [longitude, latitude].",
        )
      }
      if (!hasValidConfidence(node.confidence)) {
        addError("confidence.invalid", `${nodePath}.confidence`, "Node confidence is invalid.")
      }
      validateSourceRefs(node.sourceRefs, `${nodePath}.sourceRefs`)
      if (Array.isArray(node.sourceRefs)) {
        node.sourceRefs.forEach((ref: string) => childSourceRefs.add(ref))
      }
    })

    const flows = Array.isArray(scene.flows) ? scene.flows : []
    if (!Array.isArray(scene.flows)) {
      addError("scene.field.missing", `${scenePath}.flows`, "Scene flows are required.")
    }

    flows.forEach((flow, flowIndex) => {
      const flowPath = `${scenePath}.flows[${flowIndex}]`

      for (const field of ["id", "researchId", "label", "meaning", "asOf"] as const) {
        if (!isNonEmptyString(flow[field])) {
          addError("flow.field.missing", `${flowPath}.${field}`, `Flow ${field} is required.`)
        }
      }

      if (entityIds.has(flow.id)) {
        addError(
          entityIds.get(flow.id) === "flow" ? "flow.id.duplicate" : "entity.id.collision",
          `${flowPath}.id`,
          `World Stage entity ID must be globally unique: ${flow.id}.`,
        )
      }
      entityIds.set(flow.id, "flow")

      if (!WORLD_STAGE_FLOW_KINDS.includes(flow.kind)) {
        addError("flow.kind.invalid", `${flowPath}.kind`, `Unsupported flow kind: ${flow.kind}.`)
      }
      if (!(flow.direction === "one-way" || flow.direction === "two-way")) {
        addError(
          "flow.direction.invalid",
          `${flowPath}.direction`,
          `Unsupported flow direction: ${flow.direction}.`,
        )
      }
      if (!(flow.weight === 1 || flow.weight === 2 || flow.weight === 3)) {
        addError(
          "flow.weight.invalid",
          `${flowPath}.weight`,
          `Flow weight must be the editorial ordinal 1, 2, or 3: ${flow.weight}.`,
        )
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(flow.asOf)) {
        addError("flow.field.missing", `${flowPath}.asOf`, "Flow asOf must be an ISO date.")
      }
      if (!hasValidConfidence(flow.confidence)) {
        addError("confidence.invalid", `${flowPath}.confidence`, "Flow confidence is invalid.")
      }
      validateSourceRefs(flow.sourceRefs, `${flowPath}.sourceRefs`)
      if (Array.isArray(flow.sourceRefs)) {
        flow.sourceRefs.forEach((ref: string) => childSourceRefs.add(ref))
      }

      for (const [endpoint, nodeId] of [
        ["fromNodeId", flow.fromNodeId],
        ["toNodeId", flow.toNodeId],
      ] as const) {
        if (!isNonEmptyString(nodeId) || !localNodeIds.has(nodeId)) {
          addError(
            "flow.endpoint.missing",
            `${flowPath}.${endpoint}`,
            `Flow endpoint must resolve inside scene ${scene.id}: ${String(nodeId)}.`,
          )
        }
      }
    })

    if (
      hasValidSourceRefs(scene.sourceRefs) &&
      Array.from(childSourceRefs).some((ref) => !scene.sourceRefs.includes(ref))
    ) {
      addError(
        "scene.source-ref.incomplete",
        `${scenePath}.sourceRefs`,
        "Scene sourceRefs must include every visible child reference.",
      )
    }
  })

  for (const sceneId of WORLD_STAGE_SCENE_IDS) {
    if (!sceneIds.has(sceneId)) {
      addError("scene.id.missing", "scenes", `World Stage scene is missing: ${sceneId}.`)
    }
  }

  const menuIds = new Set<string>()
  const mappedSceneIds = new Set<string>()

  menuItems.forEach((item, menuIndex) => {
    const menuPath = `menuItems[${menuIndex}]`

    if (!expectedMenuIds.has(item.id)) {
      addError("menu.id.unknown", `${menuPath}.id`, `Unknown World Stage menu ID: ${item.id}.`)
    }
    if (menuIds.has(item.id)) {
      addError("menu.id.duplicate", `${menuPath}.id`, `Menu ID must map exactly once: ${item.id}.`)
    }
    menuIds.add(item.id)

    if (!sceneIds.has(item.sceneId)) {
      addError(
        "menu.scene.missing",
        `${menuPath}.sceneId`,
        `Menu item references an unknown scene: ${item.sceneId}.`,
      )
    } else {
      mappedSceneIds.add(item.sceneId)
    }
  })

  for (const menuId of WORLD_STAGE_MENU_IDS) {
    if (!menuIds.has(menuId)) {
      addError("menu.id.missing", "menuItems", `Menu-to-scene mapping is missing: ${menuId}.`)
    }
  }

  for (const sceneId of sceneIds) {
    if (!mappedSceneIds.has(sceneId)) {
      addError("scene.menu.unmapped", "menuItems", `Scene is not reachable from the menu: ${sceneId}.`)
    }
  }

  return errors.length === 0 ? { ok: true, errors: [] } : { ok: false, errors }
}

export function getWorldStageScene(sceneId: string) {
  return worldStageScenes.find((scene) => scene.id === sceneId) ?? null
}

const shippedCatalogValidation = validateWorldStageCatalog()

if (!shippedCatalogValidation.ok) {
  throw new Error(
    `Invalid shipped World Stage catalog: ${JSON.stringify(shippedCatalogValidation.errors)}`,
  )
}
