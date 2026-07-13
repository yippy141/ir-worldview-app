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

/** Roughly one marker diameter in the shared 200-unit plot. */
export const FIELD_MARKER_OVERLAP_DISTANCE = 0.105

export type FieldMapPositionedItem = {
  key: string
  position: MapPosition
}

export type FieldMapOverlapGroup<T extends FieldMapPositionedItem> = {
  key: string
  position: MapPosition
  items: T[]
}

export type FieldMarkerFanOffset = {
  x: number
  y: number
}

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

/**
 * Group marks whose glyphs would collide without changing any source position.
 *
 * Groups and members are canonical by key, so URL selection and semantic-list
 * order never depend on source array order. The group position is display-only;
 * every member retains its original projected coordinate.
 */
export function groupOverlappingMapItems<T extends FieldMapPositionedItem>(
  sourceItems: readonly T[],
  threshold = FIELD_MARKER_OVERLAP_DISTANCE,
): FieldMapOverlapGroup<T>[] {
  if (!Number.isFinite(threshold) || threshold < 0) {
    throw new TypeError("Overlap threshold must be a finite non-negative number")
  }

  const items = [...sourceItems].sort((left, right) =>
    left.key.localeCompare(right.key),
  )
  for (const item of items) assertFinitePoint(item.position)
  if (items.length === 0) return []

  const parents = items.map((_, index) => index)
  const find = (index: number): number => {
    let root = index
    while (parents[root] !== root) root = parents[root]
    while (parents[index] !== index) {
      const next = parents[index]
      parents[index] = root
      index = next
    }
    return root
  }
  const union = (leftIndex: number, rightIndex: number) => {
    const leftRoot = find(leftIndex)
    const rightRoot = find(rightIndex)
    if (leftRoot === rightRoot) return
    parents[Math.max(leftRoot, rightRoot)] = Math.min(leftRoot, rightRoot)
  }

  const thresholdSquared = threshold * threshold
  for (let leftIndex = 0; leftIndex < items.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < items.length;
      rightIndex += 1
    ) {
      if (
        squaredDistance(items[leftIndex].position, items[rightIndex].position) <=
        thresholdSquared
      ) {
        union(leftIndex, rightIndex)
      }
    }
  }

  const membersByRoot = new Map<number, T[]>()
  items.forEach((item, index) => {
    const root = find(index)
    const members = membersByRoot.get(root) ?? []
    members.push(item)
    membersByRoot.set(root, members)
  })

  return [...membersByRoot.values()]
    .map((members) => {
      const position = members.reduce(
        (sum, item) => ({
          x: sum.x + item.position.x / members.length,
          y: sum.y + item.position.y / members.length,
        }),
        { x: 0, y: 0 },
      )
      return {
        key: members.map((item) => item.key).join("|"),
        position: {
          x: normalizeZero(position.x),
          y: normalizeZero(position.y),
        },
        items: members,
      }
    })
    .sort((left, right) => left.key.localeCompare(right.key))
}

/** Deterministic SVG-space offsets used when an overlap count is fanned open. */
export function calculateFieldMarkerFanOffset(
  index: number,
  count: number,
): FieldMarkerFanOffset {
  if (!Number.isInteger(count) || count < 1) {
    throw new TypeError("Fan count must be a positive integer")
  }
  if (!Number.isInteger(index) || index < 0 || index >= count) {
    throw new RangeError("Fan index must identify a member")
  }
  if (count === 1) return { x: 0, y: 0 }

  const ring = Math.floor(index / 8)
  const slot = index % 8
  const priorMembers = ring * 8
  const membersInRing = Math.min(8, count - priorMembers)
  const radius = 15 + ring * 12
  const angle =
    -Math.PI / 2 +
    (slot * Math.PI * 2) / membersInRing +
    (ring % 2 === 0 ? 0 : Math.PI / 8)

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }
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
