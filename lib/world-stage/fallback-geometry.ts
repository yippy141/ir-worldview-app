import {
  WORLD_STAGE_COUNTRY_GEOMETRY,
  type WorldStageCountryFeature,
} from "@/lib/world-stage/map-data"
import type { WorldStageLngLat } from "@/lib/world-stage/types"

export const WORLD_STAGE_MAP_WIDTH = 1200
export const WORLD_STAGE_MAP_HEIGHT = 620

export const WORLD_STAGE_GRATICULE_PATHS = [
  "M55 155H1145M35 310H1165M55 465H1145",
  "M205 45V575M400 24V596M600 14V606M800 24V596M995 45V575",
] as const

export const WORLD_STAGE_GRATICULE_ELLIPSES = [
  { cx: 600, cy: 310, rx: 565, ry: 274 },
  { cx: 600, cy: 310, rx: 565, ry: 160 },
] as const

export function projectWorldStagePoint([longitude, latitude]: WorldStageLngLat) {
  return {
    x: 50 + ((longitude + 180) / 360) * (WORLD_STAGE_MAP_WIDTH - 100),
    y: 44 + ((90 - latitude) / 180) * (WORLD_STAGE_MAP_HEIGHT - 88),
  }
}

function ringPath(ring: number[][]) {
  return ring
    .map((coordinate, index) => {
      const point = projectWorldStagePoint(coordinate as unknown as WorldStageLngLat)
      return `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`
    })
    .join("")
    .concat("Z")
}

function countryPath(feature: (typeof WORLD_STAGE_COUNTRY_GEOMETRY.features)[number]) {
  if (feature.geometry.type === "Polygon") {
    return (feature.geometry.coordinates as number[][][]).map(ringPath).join("")
  }

  return (feature.geometry.coordinates as number[][][][])
    .flatMap((polygon) => polygon.map(ringPath))
    .join("")
}

export const WORLD_STAGE_COUNTRY_PATHS = WORLD_STAGE_COUNTRY_GEOMETRY.features.map(
  (feature) => ({
    iso3: feature.properties.iso3,
    name: feature.properties.name,
    d: countryPath(feature),
  }),
)

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

export function worldStageRouteMidpoint(
  from: WorldStageLngLat,
  to: WorldStageLngLat,
  index: number,
) {
  const start = projectWorldStagePoint(from)
  const end = projectWorldStagePoint(to)
  const distance = Math.abs(end.x - start.x)
  const lift = Math.min(76, 30 + distance * 0.08) * (index % 2 === 0 ? 1 : -1)

  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2 - lift / 2,
  }
}

export function isWorldStageCountryFeature(
  feature: WorldStageCountryFeature | undefined,
): feature is WorldStageCountryFeature {
  return Boolean(feature)
}
