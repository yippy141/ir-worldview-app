import {
  FIELD_PROJECTION_VERSION,
  toMapPosition,
  type MapPosition,
} from "@/lib/results/position"

// The Field and Foundation result must share one projection. Re-exporting the
// canonical helper gives Field consumers a local entry point without copying
// the authored coefficients.
export { FIELD_PROJECTION_VERSION, toMapPosition }
export type { MapPosition }

const DEFAULT_GEOMETRY_EPSILON = 1e-9

function normalizeZero(value: number): number {
  return Object.is(value, -0) ? 0 : value
}

function assertFinitePoint(point: MapPosition): void {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new TypeError("Movement hull points must have finite coordinates")
  }
}

function comparePoints(left: MapPosition, right: MapPosition): number {
  if (left.x !== right.x) return left.x < right.x ? -1 : 1
  if (left.y !== right.y) return left.y < right.y ? -1 : 1
  return 0
}

function cross(
  origin: MapPosition,
  first: MapPosition,
  second: MapPosition,
): number {
  return (
    (first.x - origin.x) * (second.y - origin.y) -
    (first.y - origin.y) * (second.x - origin.x)
  )
}

function squaredDistance(left: MapPosition, right: MapPosition): number {
  const x = left.x - right.x
  const y = left.y - right.y
  return x * x + y * y
}

function isPointOnSegment(
  point: MapPosition,
  start: MapPosition,
  end: MapPosition,
  epsilon: number,
): boolean {
  const segmentLength = Math.sqrt(squaredDistance(start, end))
  const scale = Math.max(1, segmentLength)

  if (Math.abs(cross(start, end, point)) > epsilon * scale) return false

  return (
    point.x >= Math.min(start.x, end.x) - epsilon &&
    point.x <= Math.max(start.x, end.x) + epsilon &&
    point.y >= Math.min(start.y, end.y) - epsilon &&
    point.y <= Math.max(start.y, end.y) + epsilon
  )
}

/**
 * Return the convex display hull for a movement's member positions.
 *
 * The result is deterministic: duplicate positions are removed, vertices run
 * counter-clockwise from the lexicographically smallest point, and the first
 * point is not repeated at the end. Degenerate inputs stay useful to callers:
 * zero points return [], one point returns [point], and collinear inputs return
 * their two endpoints.
 */
export function calculateMovementHull(
  memberPositions: readonly MapPosition[],
): MapPosition[] {
  const uniqueByCoordinate = new Map<string, MapPosition>()

  for (const point of memberPositions) {
    assertFinitePoint(point)
    const normalized = {
      x: normalizeZero(point.x),
      y: normalizeZero(point.y),
    }
    uniqueByCoordinate.set(`${normalized.x}:${normalized.y}`, normalized)
  }

  const points = [...uniqueByCoordinate.values()].sort(comparePoints)
  if (points.length <= 2) return points

  const lower: MapPosition[] = []
  for (const point of points) {
    while (
      lower.length >= 2 &&
      cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0
    ) {
      lower.pop()
    }
    lower.push(point)
  }

  const upper: MapPosition[] = []
  for (let index = points.length - 1; index >= 0; index -= 1) {
    const point = points[index]
    while (
      upper.length >= 2 &&
      cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0
    ) {
      upper.pop()
    }
    upper.push(point)
  }

  // The last point of each half is the first point of the other half.
  lower.pop()
  upper.pop()
  return [...lower, ...upper]
}

/**
 * Test whether a position is inside a movement hull or on its boundary.
 * The hull may be open or closed and may contain redundant/collinear points.
 */
export function isPointInOrOnMovementHull(
  point: MapPosition,
  hull: readonly MapPosition[],
  epsilon = DEFAULT_GEOMETRY_EPSILON,
): boolean {
  assertFinitePoint(point)
  if (!Number.isFinite(epsilon) || epsilon < 0) {
    throw new TypeError("Hull epsilon must be a finite non-negative number")
  }

  const canonicalHull = calculateMovementHull(hull)
  if (canonicalHull.length === 0) return false

  if (canonicalHull.length === 1) {
    return squaredDistance(point, canonicalHull[0]) <= epsilon * epsilon
  }

  if (canonicalHull.length === 2) {
    return isPointOnSegment(point, canonicalHull[0], canonicalHull[1], epsilon)
  }

  let sawClockwise = false
  let sawCounterClockwise = false

  for (let index = 0; index < canonicalHull.length; index += 1) {
    const start = canonicalHull[index]
    const end = canonicalHull[(index + 1) % canonicalHull.length]
    const orientation = cross(start, end, point)
    const edgeLength = Math.sqrt(squaredDistance(start, end))
    const tolerance = epsilon * Math.max(1, edgeLength)

    if (Math.abs(orientation) <= tolerance) {
      if (isPointOnSegment(point, start, end, epsilon)) return true
      continue
    }

    if (orientation < 0) sawClockwise = true
    if (orientation > 0) sawCounterClockwise = true
    if (sawClockwise && sawCounterClockwise) return false
  }

  return true
}
