export const WORLD_STAGE_SCENE_IDS = ["foundation", "perspectives", "futures"] as const

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

export type WorldStageDataStatus = "editorial-demo"

export type WorldStageNode = {
  /** Stable visual-selection ID. It is not a scoring or profile identifier. */
  id: string
  /** ISO 3166-1 alpha-3 geometry key. It must never alter scoring. */
  iso3Key: string
  label: string
}

export type WorldStageRoute = {
  /** Stable visual-selection ID. */
  id: string
  /** Endpoints resolve to node IDs within this route's scene. */
  fromNodeId: string
  toNodeId: string
  label: string
}

export type WorldStageScene = {
  id: WorldStageSceneId
  title: string
  summary: string
  dataStatus: WorldStageDataStatus
  /** Visible caveat for illustrative or non-current scene data. */
  qualification: string
  nodes: readonly WorldStageNode[]
  routes: readonly WorldStageRoute[]
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

export type WorldStageValidationCode =
  | "scene.id.duplicate"
  | "scene.id.unknown"
  | "scene.data-status.invalid"
  | "scene.qualification.missing"
  | "node.id.duplicate"
  | "node.iso3.invalid"
  | "route.id.duplicate"
  | "route.endpoint.missing"
  | "entity.id.collision"
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
