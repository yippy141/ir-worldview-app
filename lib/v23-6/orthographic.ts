import { WORLD_STAGE_COUNTRY_GEOMETRY } from "@/lib/world-stage/map-data"

/**
 * Orthographic geometry for the study roots.
 *
 * Every coordinate here comes from the checked-in Natural Earth 1:110m
 * boundaries already used by the World Stage fallback map. Nothing is
 * invented, and no coordinate is drawn as a reader-facing figure. The
 * silhouettes exist so the object stays recognisably Earth.
 */

export const ORTHO_VIEW_SIZE = 1000
export const ORTHO_CENTER = ORTHO_VIEW_SIZE / 2
export const ORTHO_RADIUS = 372

/** Obliquity of the ecliptic, in degrees. */
export const ECLIPTIC_TILT = 23.44

export type OrthoVector = readonly [number, number, number]

export type OrthoView = Readonly<{
  /** Longitude placed at the centre of the visible hemisphere. */
  rotation: number
  /** Latitude placed at the centre of the visible hemisphere. */
  centerLatitude: number
}>

export type OrthoPoint = Readonly<{ x: number; y: number; visible: boolean }>

const RADIANS = Math.PI / 180

export function toVector(longitude: number, latitude: number): OrthoVector {
  const lambda = longitude * RADIANS
  const phi = latitude * RADIANS
  const cosPhi = Math.cos(phi)
  return [cosPhi * Math.cos(lambda), cosPhi * Math.sin(lambda), Math.sin(phi)]
}

/** Rotate a world vector into view space, where +x points at the viewer. */
export function toViewSpace(vector: OrthoVector, view: OrthoView): OrthoVector {
  const lambda0 = view.rotation * RADIANS
  const phi0 = view.centerLatitude * RADIANS
  const [x, y, z] = vector

  const xz = x * Math.cos(lambda0) + y * Math.sin(lambda0)
  const yz = -x * Math.sin(lambda0) + y * Math.cos(lambda0)

  return [
    xz * Math.cos(phi0) + z * Math.sin(phi0),
    yz,
    -xz * Math.sin(phi0) + z * Math.cos(phi0),
  ]
}

export function projectVector(
  vector: OrthoVector,
  view: OrthoView,
  radiusScale = 1,
): OrthoPoint {
  const [depth, right, up] = toViewSpace(vector, view)
  const radius = ORTHO_RADIUS * radiusScale
  return {
    x: ORTHO_CENTER + right * radius,
    y: ORTHO_CENTER - up * radius,
    visible: depth >= 0,
  }
}

export function projectLngLat(
  longitude: number,
  latitude: number,
  view: OrthoView,
): OrthoPoint {
  return projectVector(toVector(longitude, latitude), view)
}

function formatPoint(point: OrthoPoint) {
  return `${point.x.toFixed(1)} ${point.y.toFixed(1)}`
}

/**
 * Split a projected sequence into the runs that face the viewer.
 *
 * A run is emitted as its own subpath. Closed runs are shut along their chord
 * rather than along the limb arc. At hairline weight and 110m generalisation
 * that difference is under a pixel, and it keeps the routine free of the
 * horizon intersection maths a decorative silhouette does not need.
 */
export function visibleRuns(points: readonly OrthoPoint[]): OrthoPoint[][] {
  const runs: OrthoPoint[][] = []
  let current: OrthoPoint[] = []

  for (const point of points) {
    if (point.visible) {
      current.push(point)
      continue
    }
    if (current.length > 1) runs.push(current)
    current = []
  }
  if (current.length > 1) runs.push(current)

  return runs
}

export function runsToPath(runs: readonly OrthoPoint[][], close: boolean) {
  return runs
    .map((run) => {
      const body = run
        .map((point, index) => `${index === 0 ? "M" : "L"}${formatPoint(point)}`)
        .join("")
      return close ? `${body}Z` : body
    })
    .join("")
}

function ringPoints(ring: readonly (readonly number[])[], view: OrthoView) {
  return ring.map(([longitude, latitude]) =>
    projectLngLat(longitude as number, latitude as number, view),
  )
}

/** Coastline silhouettes for the hemisphere facing the viewer. */
export function buildLandPath(view: OrthoView): string {
  const parts: string[] = []

  for (const feature of WORLD_STAGE_COUNTRY_GEOMETRY.features) {
    const geometry = feature.geometry
    const polygons =
      geometry.type === "Polygon"
        ? [geometry.coordinates as unknown as number[][][]]
        : (geometry.coordinates as unknown as number[][][][])

    for (const polygon of polygons) {
      for (const ring of polygon) {
        const runs = visibleRuns(ringPoints(ring, view))
        if (runs.length === 0) continue
        parts.push(runsToPath(runs, true))
      }
    }
  }

  return parts.join("")
}

/** Meridians and parallels at 30 degree spacing. */
export function buildGraticulePath(view: OrthoView): string {
  const parts: string[] = []

  for (let longitude = -180; longitude < 180; longitude += 30) {
    const points: OrthoPoint[] = []
    for (let latitude = -90; latitude <= 90; latitude += 3) {
      points.push(projectLngLat(longitude, latitude, view))
    }
    parts.push(runsToPath(visibleRuns(points), false))
  }

  for (let latitude = -60; latitude <= 60; latitude += 30) {
    const points: OrthoPoint[] = []
    for (let longitude = -180; longitude <= 180; longitude += 3) {
      points.push(projectLngLat(longitude, latitude, view))
    }
    parts.push(runsToPath(visibleRuns(points), false))
  }

  return parts.filter(Boolean).join("")
}

/** One path per country, keyed by the reviewed ISO 3166-1 alpha-3 code. */
export function buildCountryPaths(view: OrthoView): ReadonlyMap<string, string> {
  const paths = new Map<string, string>()

  for (const feature of WORLD_STAGE_COUNTRY_GEOMETRY.features) {
    const geometry = feature.geometry
    const polygons =
      geometry.type === "Polygon"
        ? [geometry.coordinates as unknown as number[][][]]
        : (geometry.coordinates as unknown as number[][][][])

    const parts: string[] = []
    for (const polygon of polygons) {
      for (const ring of polygon) {
        const runs = visibleRuns(ringPoints(ring, view))
        if (runs.length === 0) continue
        parts.push(runsToPath(runs, true))
      }
    }

    const iso3 = feature.properties?.iso3
    if (typeof iso3 === "string" && parts.length > 0) {
      paths.set(iso3, parts.join(""))
    }
  }

  return paths
}

export type ArmillaryRing = "equator" | "ecliptic" | "meridian" | "polar"

function inclinedCircle(angle: number, tiltDegrees: number): OrthoVector {
  const tilt = tiltDegrees * RADIANS
  return [
    Math.cos(angle),
    Math.sin(angle) * Math.cos(tilt),
    Math.sin(angle) * Math.sin(tilt),
  ]
}

/**
 * The meridian ring is placed relative to the current view rather than to a
 * fixed longitude. A polar great circle at the centre longitude projects to a
 * straight line and one at ninety degrees hides inside the limb, so a ring
 * anchored to a fixed longitude would collapse at some rotations.
 */
const ringGenerators: Record<
  ArmillaryRing,
  (angle: number, view: OrthoView) => OrthoVector
> = {
  equator: (angle) => inclinedCircle(angle, 0),
  ecliptic: (angle) => inclinedCircle(angle, ECLIPTIC_TILT),
  polar: (angle) => inclinedCircle(angle, 66.56),
  meridian: (angle, view) => {
    const longitude = (view.rotation + 52) * RADIANS
    return [
      Math.cos(angle) * Math.cos(longitude),
      Math.cos(angle) * Math.sin(longitude),
      Math.sin(angle),
    ]
  },
}

export type RingPaths = Readonly<{ front: string; back: string }>

export type RingOptions = Readonly<{
  /** Rings sit slightly outside the sphere so they read as encircling it. */
  radiusScale?: number
  fromDegrees?: number
  toDegrees?: number
  stepDegrees?: number
}>

/**
 * A great circle split into the half in front of the sphere and the half
 * behind it, so the ring can be drawn as an instrument around the globe
 * rather than a line across it.
 */
export function buildRingPaths(
  ring: ArmillaryRing,
  view: OrthoView,
  {
    radiusScale = 1.06,
    fromDegrees = 0,
    toDegrees = 360,
    stepDegrees = 2,
  }: RingOptions = {},
): RingPaths {
  const generator = ringGenerators[ring]
  const front: OrthoPoint[] = []
  const back: OrthoPoint[] = []

  for (let angle = fromDegrees; angle <= toDegrees + 1e-9; angle += stepDegrees) {
    const point = projectVector(generator(angle * RADIANS, view), view, radiusScale)
    front.push(point)
    back.push({ ...point, visible: !point.visible })
  }

  return {
    front: runsToPath(visibleRuns(front), false),
    back: runsToPath(visibleRuns(back), false),
  }
}

/** The angle on this ring that points most directly at the viewer. */
export function frontFacingAngle(ring: ArmillaryRing, view: OrthoView): number {
  const generator = ringGenerators[ring]
  let bestAngle = 0
  let bestDepth = -Infinity

  for (let angle = 0; angle < 360; angle += 1) {
    const [depth] = toViewSpace(generator(angle * RADIANS, view), view)
    if (depth > bestDepth) {
      bestDepth = depth
      bestAngle = angle
    }
  }

  return bestAngle
}

/**
 * Centre the highlighted arc on the part of the ring that faces the viewer,
 * offset by the destination's own value so each destination reads differently
 * without any of them landing behind the sphere.
 */
export function frontFacingArc(
  ring: ArmillaryRing,
  view: OrthoView,
  offsetDegrees: number,
  sweepDegrees: number,
) {
  const sweep = Math.max(8, Math.min(150, sweepDegrees))
  const centre = frontFacingAngle(ring, view) + offsetDegrees
  return { fromDegrees: centre - sweep / 2, toDegrees: centre + sweep / 2 }
}
