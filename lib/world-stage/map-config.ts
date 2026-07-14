import { WORLD_STAGE_REVIEWED_ISO3_KEYS } from "@/lib/world-stage/scenes"
import {
  WORLD_STAGE_MENU_IDS,
  type WorldStageMenuId,
  type WorldStageSceneId,
} from "@/lib/world-stage/types"

export type WorldStageLngLat = readonly [longitude: number, latitude: number]

export type WorldStageMapCamera = {
  center: WorldStageLngLat
  zoom: number
  pitch: number
  bearing: number
}

type WorldStageReviewedIso3Key = (typeof WORLD_STAGE_REVIEWED_ISO3_KEYS)[number]

// NEXT_PUBLIC_ tokens are intentionally visible in the browser. Restrict this
// token to the production, preview, and local-development URL referrers in the
// Mapbox dashboard. An empty or rejected token leaves the local SVG map visible.
export const WORLD_STAGE_MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() ?? ""

export const WORLD_STAGE_MAPBOX_STYLE = "mapbox://styles/mapbox/dark-v11"
export const WORLD_STAGE_IDLE_INTERVAL_MS = 10_000
export const WORLD_STAGE_TRANSITION_MS = 900

/**
 * Display coordinates only. They place the reviewed editorial-demo nodes and
 * never participate in worldview scoring, matching, or profile persistence.
 */
export const WORLD_STAGE_ISO3_COORDINATES = {
  AUS: [133.7751, -25.2744],
  BRA: [-51.9253, -14.235],
  CAN: [-106.3468, 56.1304],
  DEU: [10.4515, 51.1657],
  IND: [78.9629, 20.5937],
  JPN: [138.2529, 36.2048],
  KEN: [37.9062, -0.0236],
  SGP: [103.8198, 1.3521],
  USA: [-98.5795, 39.8283],
} as const satisfies Record<WorldStageReviewedIso3Key, WorldStageLngLat>

/** Distinct framing for every menu lens, including items that share a scene. */
export const WORLD_STAGE_CAMERAS = {
  foundation: {
    center: [18, 17],
    zoom: 1.32,
    pitch: 10,
    bearing: -7,
  },
  "focus-areas": {
    center: [70, 27],
    zoom: 1.58,
    pitch: 18,
    bearing: 5,
  },
  "perspective-runs": {
    center: [-14, 24],
    zoom: 1.25,
    pitch: 12,
    bearing: -12,
  },
  "worldview-map": {
    center: [48, 13],
    zoom: 1.48,
    pitch: 20,
    bearing: 9,
  },
  "ai-futures": {
    center: [-171, 13],
    zoom: 1.18,
    pitch: 16,
    bearing: 12,
  },
  profile: {
    center: [-42, 10],
    zoom: 1.38,
    pitch: 8,
    bearing: -3,
  },
} as const satisfies Record<WorldStageMenuId, WorldStageMapCamera>

export const WORLD_STAGE_SCENE_COLORS = {
  foundation: "#d7b465",
  perspectives: "#91b8df",
  futures: "#d9855d",
} as const satisfies Record<WorldStageSceneId, string>

export function getNextWorldStageMenuIndex(index: number) {
  return (index + 1 + WORLD_STAGE_MENU_IDS.length) % WORLD_STAGE_MENU_IDS.length
}
