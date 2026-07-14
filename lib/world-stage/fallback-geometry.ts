/**
 * Shared geometry for the local SVG world map used by the homepage fallback
 * and the section-landing stage excerpts. Display geometry only: it never
 * participates in scoring, matching, or profile persistence.
 */
import type { WorldStageLngLat } from "@/lib/world-stage/map-config"

export const WORLD_STAGE_MAP_WIDTH = 1200
export const WORLD_STAGE_MAP_HEIGHT = 620

/** Stylized graticule strokes drawn behind the landmasses. */
export const WORLD_STAGE_GRATICULE_PATHS = [
  "M55 155H1145M35 310H1165M55 465H1145",
  "M205 45V575M400 24V596M600 14V606M800 24V596M995 45V575",
] as const

export const WORLD_STAGE_GRATICULE_ELLIPSES = [
  { cx: 600, cy: 310, rx: 565, ry: 274 },
  { cx: 600, cy: 310, rx: 565, ry: 160 },
] as const

/** Abstracted editorial landmasses. Not a boundary-accurate basemap. */
export const WORLD_STAGE_LANDMASS_PATHS = [
  "M105 162l44-52 63-31 87-3 46 29 47 8 30 35-28 31-46-7-21 31-43 1-18 38-42 13-31-31-63-6-42-26z",
  "M281 255l52 17 28 46-5 69-26 77-36 75-30-25 2-65-25-47 14-49-28-54 31-14z",
  "M451 119l57-39 71 8 45 26 71-10 46 27 75-16 75 23 45 42-33 35-60 3-29 33-54 7-25-21-43 18-31-21-55 11-34-30-56-8-35-39-48-8z",
  "M527 247l67-14 63 31 21 63-25 58-24 91-45 31-31-55-17-62-36-50 6-59z",
  "M749 259l43-14 43 22 11 35-39 16-28-23-31-3z",
  "M888 392l59-30 55 20 36 46-24 42-68 6-53-37z",
  "M304 77l34-45 57 13 20 43-49 29-45-10z",
  "M1032 298l26-11 23 15-20 20z",
] as const

export function projectWorldStagePoint([longitude, latitude]: WorldStageLngLat) {
  return {
    x: 50 + ((longitude + 180) / 360) * (WORLD_STAGE_MAP_WIDTH - 100),
    y: 44 + ((90 - latitude) / 180) * (WORLD_STAGE_MAP_HEIGHT - 88),
  }
}

export function worldStageRoutePath(
  from: WorldStageLngLat,
  to: WorldStageLngLat,
  index: number,
) {
  const start = projectWorldStagePoint(from)
  const end = projectWorldStagePoint(to)
  const distance = Math.abs(end.x - start.x)
  const lift = Math.min(76, 30 + distance * 0.08) * (index % 2 === 0 ? 1 : -1)

  return `M${start.x.toFixed(1)} ${start.y.toFixed(1)} Q${(
    (start.x + end.x) /
    2
  ).toFixed(1)} ${((start.y + end.y) / 2 - lift).toFixed(1)} ${end.x.toFixed(
    1,
  )} ${end.y.toFixed(1)}`
}
