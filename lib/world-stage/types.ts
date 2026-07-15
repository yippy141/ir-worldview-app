export const WORLD_STAGE_SCENE_IDS = [
  "foundation",
  "focus-areas",
  "perspectives",
  "worldview-map",
  "futures",
  "profile",
] as const

export type WorldStageSceneId = (typeof WORLD_STAGE_SCENE_IDS)[number]

export const WORLD_STAGE_MENU_IDS = [
  "foundation",
  "focus-areas",
  "perspective-runs",
  "worldview-map",
  "ai-futures",
  "profile",
] as const

export type WorldStageMenuId = (typeof WORLD_STAGE_MENU_IDS)[number]

export const WORLD_STAGE_COUNTRY_ROLES = [
  "focus",
  "partner",
  "competitor",
  "hedging",
  "exposed",
  "contested",
  "neutral",
] as const

export type CountryRole = (typeof WORLD_STAGE_COUNTRY_ROLES)[number]

export const WORLD_STAGE_NODE_KINDS = [
  "capital",
  "base",
  "fleet",
  "port",
  "factory",
  "fab",
  "compute",
  "finance",
  "energy",
  "research",
  "governance",
] as const

export type StrategicNodeKind = (typeof WORLD_STAGE_NODE_KINDS)[number]

export const WORLD_STAGE_FLOW_KINDS = [
  "trade",
  "finance",
  "energy",
  "data",
  "military",
  "technology",
  "supply-chain",
  "governance",
] as const

export type StrategicFlowKind = (typeof WORLD_STAGE_FLOW_KINDS)[number]

export const WORLD_STAGE_CONFIDENCE_LEVELS = ["high", "medium", "low"] as const

export type WorldStageConfidence = (typeof WORLD_STAGE_CONFIDENCE_LEVELS)[number]
export type WorldStageDataStatus = "reviewed-editorial"
export type WorldStageFlowDirection = "one-way" | "two-way"
export type WorldStageFlowWeight = 1 | 2 | 3
export type WorldStageLngLat = readonly [longitude: number, latitude: number]

export type WorldStageMapCamera = {
  center: WorldStageLngLat
  zoom: number
  pitch: number
  bearing: number
}

export type WorldStageCountryRole = {
  iso3: string
  role: CountryRole
  rationale: string
  confidence: WorldStageConfidence
  sourceRefs: readonly string[]
}

export type WorldStageNode = {
  /** Stable scene-specific display ID. It never participates in scoring. */
  id: string
  /** ID of the reviewed research record from which this display node was compiled. */
  researchId: string
  kind: StrategicNodeKind
  label: string
  coordinates: WorldStageLngLat
  whyItMatters: string
  confidence: WorldStageConfidence
  sourceRefs: readonly string[]
}

export type WorldStageFlow = {
  /** Stable scene-specific display ID. */
  id: string
  /** ID of the reviewed research record from which this display flow was compiled. */
  researchId: string
  kind: StrategicFlowKind
  label: string
  fromNodeId: string
  toNodeId: string
  meaning: string
  direction: WorldStageFlowDirection
  /** Editorial ordinal only: 1 = supporting, 2 = material, 3 = structural. */
  weight: WorldStageFlowWeight
  confidence: WorldStageConfidence
  asOf: string
  sourceRefs: readonly string[]
}

export type WorldStageScene = {
  id: WorldStageSceneId
  /** The reviewed record in research/world-stage/scene-ledger.json. */
  researchSceneId: string
  /** Set when a sixth menu state deliberately reuses a reviewed research scene. */
  variantOf: WorldStageSceneId | null
  publicLabel: string
  caption: string
  lensOwner: string
  asOf: string
  dataStatus: WorldStageDataStatus
  sourceRefs: readonly string[]
  countryRoles: readonly WorldStageCountryRole[]
  nodes: readonly WorldStageNode[]
  flows: readonly WorldStageFlow[]
  caveats: readonly string[]
  camera: WorldStageMapCamera
}

export type WorldStageMenuItem = {
  id: WorldStageMenuId
  index: string
  label: string
  sceneId: WorldStageSceneId
  lens: string
  description: string
  href: string
  action: string
}

export type WorldStageSceneOption = {
  sceneId: WorldStageSceneId
  label: string
}

export type WorldStageTooltipItem = {
  id: string
  kind: "country" | "node" | "flow"
  label: string
  meaning: string
  asOf: string
  sourceCount: number
}

export type WorldStageValidationCode =
  | "scene.id.duplicate"
  | "scene.id.missing"
  | "scene.id.unknown"
  | "scene.research-id.missing"
  | "scene.field.missing"
  | "scene.as-of.invalid"
  | "scene.data-status.invalid"
  | "scene.source-ref.incomplete"
  | "source-ref.missing"
  | "source-ref.invalid"
  | "confidence.invalid"
  | "country.iso3.duplicate"
  | "country.iso3.invalid"
  | "country.role.invalid"
  | "country.field.missing"
  | "node.id.duplicate"
  | "node.field.missing"
  | "node.kind.invalid"
  | "node.coordinates.invalid"
  | "flow.id.duplicate"
  | "flow.field.missing"
  | "flow.kind.invalid"
  | "flow.direction.invalid"
  | "flow.weight.invalid"
  | "flow.endpoint.missing"
  | "entity.id.collision"
  | "camera.invalid"
  | "menu.id.duplicate"
  | "menu.id.missing"
  | "menu.id.unknown"
  | "menu.scene.missing"
  | "scene.menu.unmapped"

export type WorldStageValidationError = {
  code: WorldStageValidationCode
  path: string
  message: string
}

export type WorldStageValidationResult =
  | { ok: true; errors: readonly [] }
  | { ok: false; errors: readonly WorldStageValidationError[] }
