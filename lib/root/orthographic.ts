import countryGeometryJson from "@/lib/world-stage/data/world-countries-110m.json" with {
  type: "json",
}
import type { RootDestinationId } from "@/lib/root/destinations"
import { ROOT_DESTINATIONS } from "@/lib/root/destinations"

/**
 * A server-only orthographic rendering of the checked-in Natural Earth 1:110m
 * geography. This module imports no scene ledger, map component, token, or
 * Mapbox runtime.
 */

export const ROOT_GLOBE_VIEW_SIZE = 1000
export const ROOT_GLOBE_CENTER = ROOT_GLOBE_VIEW_SIZE / 2
export const ROOT_GLOBE_RADIUS = 370

type CountryGeometry = {
  type: "Polygon" | "MultiPolygon"
  coordinates: number[][][] | number[][][][]
}

type CountryCollection = {
  type: "FeatureCollection"
  features: Array<{
    geometry: CountryGeometry
  }>
}

type Vector = readonly [number, number, number]
type Point = Readonly<{ x: number; y: number; visible: boolean }>
type View = Readonly<{ rotation: number; centerLatitude: number }>

export type RootGlobeVisualState = Readonly<{
  front: string
  back: string
}>

export type RootGlobeVisual = Readonly<{
  land: string
  graticule: string
  states: Readonly<Record<RootDestinationId, RootGlobeVisualState>>
}>

const geometry = countryGeometryJson as unknown as CountryCollection
const RADIANS = Math.PI / 180
const ROOT_VIEW: View = { rotation: 18, centerLatitude: 18 }

function toVector(longitude: number, latitude: number): Vector {
  const lambda = longitude * RADIANS
  const phi = latitude * RADIANS
  const cosPhi = Math.cos(phi)
  return [cosPhi * Math.cos(lambda), cosPhi * Math.sin(lambda), Math.sin(phi)]
}

function toViewSpace([x, y, z]: Vector, view: View): Vector {
  const lambda = view.rotation * RADIANS
  const phi = view.centerLatitude * RADIANS
  const xz = x * Math.cos(lambda) + y * Math.sin(lambda)
  const yz = -x * Math.sin(lambda) + y * Math.cos(lambda)

  return [
    xz * Math.cos(phi) + z * Math.sin(phi),
    yz,
    -xz * Math.sin(phi) + z * Math.cos(phi),
  ]
}

function project(vector: Vector, view: View, radiusScale = 1): Point {
  const [depth, right, up] = toViewSpace(vector, view)
  const radius = ROOT_GLOBE_RADIUS * radiusScale
  return {
    x: ROOT_GLOBE_CENTER + right * radius,
    y: ROOT_GLOBE_CENTER - up * radius,
    visible: depth >= 0,
  }
}

function projectLngLat(longitude: number, latitude: number, view: View): Point {
  return project(toVector(longitude, latitude), view)
}

function visibleRuns(points: readonly Point[]): Point[][] {
  const runs: Point[][] = []
  let current: Point[] = []

  for (const point of points) {
    if (point.visible) {
      current.push(point)
    } else {
      if (current.length > 1) runs.push(current)
      current = []
    }
  }
  if (current.length > 1) runs.push(current)
  return runs
}

function pathFromRuns(runs: readonly Point[][], close = false): string {
  return runs
    .map((run) => {
      const points = run
        .map((point, index) =>
          `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
        )
        .join("")
      return close ? `${points}Z` : points
    })
    .join("")
}

function buildLand(): string {
  const paths: string[] = []

  for (const feature of geometry.features) {
    const polygons = feature.geometry.type === "Polygon"
      ? [feature.geometry.coordinates as number[][][]]
      : feature.geometry.coordinates as number[][][][]

    for (const polygon of polygons) {
      for (const ring of polygon) {
        const points = ring.map(([longitude, latitude]) =>
          projectLngLat(longitude, latitude, ROOT_VIEW),
        )
        const path = pathFromRuns(visibleRuns(points), true)
        if (path) paths.push(path)
      }
    }
  }

  return paths.join("")
}

function buildGraticule(): string {
  const paths: string[] = []

  for (let longitude = -180; longitude < 180; longitude += 30) {
    const points: Point[] = []
    for (let latitude = -90; latitude <= 90; latitude += 3) {
      points.push(projectLngLat(longitude, latitude, ROOT_VIEW))
    }
    paths.push(pathFromRuns(visibleRuns(points)))
  }

  for (let latitude = -60; latitude <= 60; latitude += 30) {
    const points: Point[] = []
    for (let longitude = -180; longitude <= 180; longitude += 3) {
      points.push(projectLngLat(longitude, latitude, ROOT_VIEW))
    }
    paths.push(pathFromRuns(visibleRuns(points)))
  }

  return paths.join("")
}

function buildGreatCircle(tiltDegrees: number, azimuthDegrees: number) {
  const tilt = tiltDegrees * RADIANS
  const azimuth = azimuthDegrees * RADIANS
  const front: Point[] = []
  const back: Point[] = []

  for (let angleDegrees = 0; angleDegrees <= 360; angleDegrees += 2) {
    const angle = angleDegrees * RADIANS
    const base: Vector = [
      Math.cos(angle),
      Math.sin(angle) * Math.cos(tilt),
      Math.sin(angle) * Math.sin(tilt),
    ]
    const vector: Vector = [
      base[0] * Math.cos(azimuth) - base[1] * Math.sin(azimuth),
      base[0] * Math.sin(azimuth) + base[1] * Math.cos(azimuth),
      base[2],
    ]
    const point = project(vector, ROOT_VIEW, 1.065)
    front.push(point)
    back.push({ ...point, visible: !point.visible })
  }

  return {
    front: pathFromRuns(visibleRuns(front)),
    back: pathFromRuns(visibleRuns(back)),
  }
}

export const ROOT_GLOBE_VISUAL: RootGlobeVisual = {
  land: buildLand(),
  graticule: buildGraticule(),
  states: Object.fromEntries(
    ROOT_DESTINATIONS.map((destination) => [
      destination.id,
      buildGreatCircle(
        destination.greatCircle.tilt,
        destination.greatCircle.azimuth,
      ),
    ]),
  ) as Record<RootDestinationId, RootGlobeVisualState>,
}
