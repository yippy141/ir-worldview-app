import {
  WORLD_STAGE_SCENE_IDS,
  type CountryRole,
  type WorldStageFlowWeight,
} from "@/lib/world-stage/types"

// NEXT_PUBLIC_ tokens are intentionally visible in the browser. Restrict this
// token to production, preview, and local-development URL referrers in Mapbox.
// A missing or rejected token leaves the complete local SVG fallback visible.
export const WORLD_STAGE_MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() ?? ""

export const WORLD_STAGE_MAPBOX_STYLE =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE?.trim() || "mapbox://styles/mapbox/dark-v11"

/**
 * Runtime overrides for Mapbox Standard styles. Keeping these in the app means
 * a custom Studio style cannot reintroduce a gray field around the globe.
 * Styles without a `basemap` import simply ignore this configuration.
 */
export const WORLD_STAGE_BASEMAP_CONFIG = {
  theme: "default",
  lightPreset: "night",
  show3dObjects: false,
  showPlaceLabels: true,
  showPointOfInterestLabels: false,
  showTransitLabels: false,
  showRoadLabels: false,
  showAdminBoundaries: true,
  colorLand: "#18344f",
  colorWater: "#071522",
  colorAdminBoundaries: "#6f91af",
  colorPlaceLabels: "#c8d6e4",
} as const

export const WORLD_STAGE_SCENE_INTERVAL_MS = 8_000
export const WORLD_STAGE_SCENE_IDLE_RESUME_MS = 18_000
export const WORLD_STAGE_TRANSITION_MS = 900
export const WORLD_STAGE_DEFAULT_ZOOM_OFFSET = 0.2
export const WORLD_STAGE_SECONDS_PER_REVOLUTION = 240
export const WORLD_STAGE_GLOBE_IDLE_RESUME_MS = 4_000
export const WORLD_STAGE_MAX_SPIN_ZOOM = 3.5
export const WORLD_STAGE_SPIN_SEGMENT_MS = 1_000

export const WORLD_STAGE_ROLE_COLORS = {
  focus: "#f4cb63",
  partner: "#48aae6",
  competitor: "#e87962",
  hedging: "#e2ad47",
  exposed: "#b18bdb",
  contested: "#d77c8c",
  neutral: "#183c5b",
} as const satisfies Record<CountryRole, string>

export const WORLD_STAGE_FLOW_WIDTHS = {
  1: 1.15,
  2: 1.8,
  3: 2.5,
} as const satisfies Record<WorldStageFlowWeight, number>

type WorldStageSpinState = {
  longitude: number
  zoom: number
  reducedMotion: boolean
  motionPaused: boolean
  now: number
  idleResumeAt: number
  segmentDurationMs?: number
}

export function getWorldStageIdleResumeAt(interactionAt: number) {
  return interactionAt + WORLD_STAGE_GLOBE_IDLE_RESUME_MS
}

export function isWorldStageIdleResumeReady(now: number, idleResumeAt: number) {
  return now >= idleResumeAt
}

export function getNextWorldStageSpinLongitude({
  longitude,
  zoom,
  reducedMotion,
  motionPaused,
  now,
  idleResumeAt,
  segmentDurationMs = WORLD_STAGE_SPIN_SEGMENT_MS,
}: WorldStageSpinState) {
  if (
    reducedMotion ||
    motionPaused ||
    zoom >= WORLD_STAGE_MAX_SPIN_ZOOM ||
    !isWorldStageIdleResumeReady(now, idleResumeAt)
  ) {
    return null
  }

  const degreesPerMillisecond =
    360 / (WORLD_STAGE_SECONDS_PER_REVOLUTION * 1_000)
  const nextLongitude = longitude - degreesPerMillisecond * segmentDurationMs

  return ((nextLongitude + 540) % 360) - 180
}

export function getNextWorldStageSceneIndex(index: number) {
  return (index + 1 + WORLD_STAGE_SCENE_IDS.length) % WORLD_STAGE_SCENE_IDS.length
}
