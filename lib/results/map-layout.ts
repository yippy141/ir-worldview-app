import type { MapPosition } from "@/lib/results/position"

// ---------------------------------------------------------------------------
// Shared map layout
// ---------------------------------------------------------------------------
//
// Every worldview-map surface (Foundation result, Worldview Map, Perspective
// result, Profile) draws the SAME projection into the same square viewBox.
// This module owns the geometry and the label placement rules only; the
// projection itself lives in lib/results/position.ts and is not touched here.
//
// One viewBox unit is one CSS pixel at the reference desktop render width, so
// stroke widths and dot radii below are readable as pixel sizes. Surfaces cap
// their rendered width near MAP_VIEW_SIZE, which keeps the drawn scale close
// to 1 and the hierarchy between marks stable across breakpoints.

/** Square viewBox edge. Surfaces cap their rendered width here, so scale <= 1. */
export const MAP_VIEW_SIZE = 620
/** Centre of the plot in viewBox units. */
export const MAP_CENTER = MAP_VIEW_SIZE / 2
/**
 * Half-extent of the plot square. The margin that remains carries only label
 * overflow, because the axis labels now sit inside the frame.
 */
export const MAP_PLOT_RADIUS = 265

/**
 * Share of the container the plot square occupies. The redesign brief requires
 * at least 0.70; the margin that remains holds only overflow from labels that
 * cannot sit inside the frame.
 */
export const MAP_PLOT_FRACTION = (MAP_PLOT_RADIUS * 2) / MAP_VIEW_SIZE

/** Tradition anchors recede; the respondent mark is the thing to find. */
export const MAP_ANCHOR_DOT_RADIUS = 2.5
export const MAP_RESPONDENT_DOT_RADIUS = 4.5
export const MAP_RESPONDENT_RING_RADIUS = 7.5

export const MAP_PLOT_MIN_PX = 420

export type MapPoint = { cx: number; cy: number }

/** Math space (+Y up) to SVG space (+Y down), in viewBox units. */
export function toMapPoint(position: MapPosition): MapPoint {
  return {
    cx: MAP_CENTER + position.x * MAP_PLOT_RADIUS,
    cy: MAP_CENTER - position.y * MAP_PLOT_RADIUS,
  }
}

/** Percent coordinates for an HTML overlay placed above the same viewBox. */
export function toOverlayPercent(value: number): number {
  return (value / MAP_VIEW_SIZE) * 100
}

// ---------------------------------------------------------------------------
// Label boxes
// ---------------------------------------------------------------------------
//
// Labels render as HTML above the SVG so their type stays at a fixed rem size
// instead of scaling with the viewBox. Collision avoidance therefore works on
// ESTIMATED boxes: wide (CJK) glyphs count as one em, everything else as a
// little over half an em. The estimate is deliberately generous so a label that
// renders slightly wider than predicted still clears its neighbour.

export type MapLabelBox = {
  x: number
  y: number
  width: number
  height: number
}

export type MapLabelSide =
  | "below"
  | "above"
  | "right"
  | "left"
  | "below-right"
  | "below-left"
  | "above-right"
  | "above-left"

export type MapLabelCandidateOrder = readonly MapLabelSide[]

export type MapLabelRequest = {
  key: string
  /** Point the label describes, in viewBox units. */
  point: MapPoint
  text: string
  /** Rendered font size in CSS pixels; one viewBox unit at reference scale. */
  fontSize: number
  /** Extra tracking per character, as a share of the font size. */
  tracking?: number
  /** Wrap width in viewBox units. Omit for a single line. */
  maxWidth?: number
  /** Radius of the mark the label belongs to; the label starts outside it. */
  clearance?: number
  candidates?: MapLabelCandidateOrder
}

export type MapLabelPlacement = {
  key: string
  side: MapLabelSide
  box: MapLabelBox
  /** Horizontal centre of the box; overlay labels translate(-50%) from it. */
  centerX: number
  /** Wrapped lines. Callers render these verbatim so the box estimate holds. */
  lines: string[]
}

const DEFAULT_CANDIDATES: MapLabelCandidateOrder = [
  "below",
  "above",
  "right",
  "left",
  "below-right",
  "below-left",
  "above-right",
  "above-left",
]

/** Clearance between a mark and its label, and between two label boxes. */
const LABEL_GAP = 9
const DIAGONAL_GAP = 6
/**
 * Successive stand-off rings. A crowded label steps further from its mark
 * before it is allowed to sit on top of anything.
 */
const CANDIDATE_RINGS = [1, 1.9, 2.9] as const
const BOX_PADDING = 3
const BOUNDS_PADDING = 2
/** Safety factor: rendered text may exceed the character-width estimate. */
const WIDTH_SAFETY = 1.12
const LINE_HEIGHT_RATIO = 1.3

const NARROW_GLYPH_EM = 0.58

/** Wrap width for tradition and marker labels: roughly a third of the plot. */
export const MAP_LABEL_MAX_WIDTH = 170

function isWideGlyph(codePoint: number): boolean {
  return (
    (codePoint >= 0x1100 && codePoint <= 0x115f) ||
    (codePoint >= 0x2e80 && codePoint <= 0xa4cf) ||
    (codePoint >= 0xac00 && codePoint <= 0xd7a3) ||
    (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
    (codePoint >= 0xfe30 && codePoint <= 0xfe6f) ||
    (codePoint >= 0xff00 && codePoint <= 0xff60) ||
    (codePoint >= 0xffe0 && codePoint <= 0xffe6)
  )
}

function measureRun(text: string, fontSize: number, tracking: number): number {
  let ems = 0
  let characters = 0
  for (const character of text) {
    const codePoint = character.codePointAt(0) ?? 0
    ems += isWideGlyph(codePoint) ? 1 : NARROW_GLYPH_EM
    characters += 1
  }

  return (ems + characters * tracking) * fontSize * WIDTH_SAFETY
}

function breakLongRun(
  run: string,
  fontSize: number,
  tracking: number,
  maxWidth: number,
): string[] {
  const pieces: string[] = []
  let current = ""

  for (const character of run) {
    const next = current + character
    if (current !== "" && measureRun(next, fontSize, tracking) > maxWidth) {
      pieces.push(current)
      current = character
      continue
    }
    current = next
  }

  if (current !== "") pieces.push(current)
  return pieces
}

/**
 * Wrap a label to a width and estimate its rendered box, in viewBox units.
 *
 * The returned lines are what the caller must render: keeping the wrap here
 * rather than in CSS is what makes the collision boxes match the page. Latin
 * text wraps on spaces; runs without a break point (including CJK) wrap per
 * character. Exported so tests can pin the estimate placement depends on.
 */
export function estimateMapLabelSize(
  text: string,
  fontSize: number,
  tracking = 0,
  maxWidth?: number,
): { width: number; height: number; lines: string[] } {
  const words = text.split(/\s+/).filter((word) => word !== "")
  const limit = maxWidth ?? Number.POSITIVE_INFINITY
  const lines: string[] = []
  let current = ""

  for (const word of words) {
    const candidate = current === "" ? word : `${current} ${word}`
    if (current !== "" && measureRun(candidate, fontSize, tracking) > limit) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }

    if (measureRun(current, fontSize, tracking) > limit) {
      const pieces = breakLongRun(current, fontSize, tracking, limit)
      lines.push(...pieces.slice(0, -1))
      current = pieces[pieces.length - 1] ?? ""
    }
  }

  if (current !== "") lines.push(current)
  if (lines.length === 0) lines.push("")

  return {
    width: Math.max(...lines.map((line) => measureRun(line, fontSize, tracking))),
    height: lines.length * fontSize * LINE_HEIGHT_RATIO,
    lines,
  }
}

function candidateBox(
  point: MapPoint,
  size: { width: number; height: number },
  side: MapLabelSide,
  ring: number,
  clearance: number,
): MapLabelBox {
  const { width, height } = size
  const halfWidth = width / 2
  const halfHeight = height / 2
  // The mark's own radius is cleared once; only the stand-off grows by ring.
  const gap = clearance + LABEL_GAP * ring
  const diagonal = clearance * 0.7 + DIAGONAL_GAP * ring

  switch (side) {
    case "below":
      return { x: point.cx - halfWidth, y: point.cy + gap, width, height }
    case "above":
      return { x: point.cx - halfWidth, y: point.cy - gap - height, width, height }
    case "right":
      return { x: point.cx + gap, y: point.cy - halfHeight, width, height }
    case "left":
      return { x: point.cx - gap - width, y: point.cy - halfHeight, width, height }
    case "below-right":
      return { x: point.cx + diagonal, y: point.cy + diagonal, width, height }
    case "below-left":
      return { x: point.cx - diagonal - width, y: point.cy + diagonal, width, height }
    case "above-right":
      return { x: point.cx + diagonal, y: point.cy - diagonal - height, width, height }
    case "above-left":
      return {
        x: point.cx - diagonal - width,
        y: point.cy - diagonal - height,
        width,
        height,
      }
  }
}

function overlapArea(left: MapLabelBox, right: MapLabelBox): number {
  const horizontal =
    Math.min(left.x + left.width, right.x + right.width) -
    Math.max(left.x, right.x) +
    BOX_PADDING * 2
  const vertical =
    Math.min(left.y + left.height, right.y + right.height) -
    Math.max(left.y, right.y) +
    BOX_PADDING * 2

  if (horizontal <= 0 || vertical <= 0) return 0
  return horizontal * vertical
}

function outOfBoundsArea(box: MapLabelBox, viewSize: number): number {
  const overshootLeft = Math.max(0, BOUNDS_PADDING - box.x)
  const overshootTop = Math.max(0, BOUNDS_PADDING - box.y)
  const overshootRight = Math.max(0, box.x + box.width - (viewSize - BOUNDS_PADDING))
  const overshootBottom = Math.max(0, box.y + box.height - (viewSize - BOUNDS_PADDING))

  return (
    (overshootLeft + overshootRight) * box.height +
    (overshootTop + overshootBottom) * box.width
  )
}

/**
 * Place labels around their marks without fixed offsets.
 *
 * Requests are honoured in the order given, so callers control precedence.
 * Each label takes the first candidate side that clears the viewBox, every
 * obstacle, and every label already placed. When no side is clear the least
 * obstructed candidate wins, with earlier candidates breaking ties — the result
 * is fully deterministic for a given input.
 */
export function resolveMapLabelPlacements(
  requests: readonly MapLabelRequest[],
  options: {
    obstacles?: readonly MapLabelBox[]
    viewSize?: number
  } = {},
): MapLabelPlacement[] {
  const viewSize = options.viewSize ?? MAP_VIEW_SIZE
  const blocked: MapLabelBox[] = [...(options.obstacles ?? [])]
  const placements: MapLabelPlacement[] = []

  for (const request of requests) {
    const size = estimateMapLabelSize(
      request.text,
      request.fontSize,
      request.tracking,
      request.maxWidth,
    )
    const candidates = request.candidates ?? DEFAULT_CANDIDATES

    const clearance = request.clearance ?? 0

    let best: { side: MapLabelSide; box: MapLabelBox; cost: number } | null = null
    search: for (const ring of CANDIDATE_RINGS) {
      for (const side of candidates) {
        const box = candidateBox(request.point, size, side, ring, clearance)
        const cost =
          outOfBoundsArea(box, viewSize) +
          blocked.reduce((sum, other) => sum + overlapArea(box, other), 0)

        if (cost === 0) {
          best = { side, box, cost }
          break search
        }
        if (!best || cost < best.cost) best = { side, box, cost }
      }
    }

    // candidates is never empty for a well-formed request; keep the guard so a
    // caller passing an empty list degrades to a centred label instead of a crash.
    const resolved = best ?? {
      side: "below" as MapLabelSide,
      box: candidateBox(request.point, size, "below", 1, clearance),
      cost: 0,
    }

    blocked.push(resolved.box)
    placements.push({
      key: request.key,
      side: resolved.side,
      box: resolved.box,
      centerX: resolved.box.x + resolved.box.width / 2,
      lines: size.lines,
    })
  }

  return placements
}

// ---------------------------------------------------------------------------
// Axis labels
// ---------------------------------------------------------------------------
//
// Axis labels sit ALONG the plot edges rather than floating in the margin, so
// the frame reads as a chart rather than a diagram with captions. They are
// fixed by construction and act as obstacles for the tradition labels.

export type MapAxisEdge = "top" | "bottom" | "left" | "right"

export type MapAxisLabelPlacement = {
  edge: MapAxisEdge
  /** Horizontal centre of the box; overlay labels translate(-50%) from it. */
  centerX: number
  box: MapLabelBox
  lines: string[]
}

/** Distance from the plot edge to the axis label box. */
const AXIS_INSET = 7

export function resolveAxisLabelPlacements(
  labels: Record<MapAxisEdge, string>,
  fontSize: number,
  tracking = 0,
): MapAxisLabelPlacement[] {
  const plotLeft = MAP_CENTER - MAP_PLOT_RADIUS
  const plotRight = MAP_CENTER + MAP_PLOT_RADIUS
  const plotTop = MAP_CENTER - MAP_PLOT_RADIUS
  const plotBottom = MAP_CENTER + MAP_PLOT_RADIUS

  return (["top", "bottom", "left", "right"] as const).map((edge) => {
    const { width, height, lines } = estimateMapLabelSize(
      labels[edge],
      fontSize,
      tracking,
      // Half the plot for the side labels so the two never meet on the midline.
      edge === "left" || edge === "right"
        ? MAP_PLOT_RADIUS - AXIS_INSET * 2
        : MAP_PLOT_RADIUS * 2 - AXIS_INSET * 2,
    )
    const box: MapLabelBox =
      edge === "top"
        ? { x: MAP_CENTER - width / 2, y: plotTop + AXIS_INSET, width, height }
        : edge === "bottom"
          ? {
              x: MAP_CENTER - width / 2,
              y: plotBottom - AXIS_INSET - height,
              width,
              height,
            }
          : edge === "left"
            ? {
                x: plotLeft + AXIS_INSET,
                y: MAP_CENTER - AXIS_INSET - height,
                width,
                height,
              }
            : {
                x: plotRight - AXIS_INSET - width,
                y: MAP_CENTER - AXIS_INSET - height,
                width,
                height,
              }

    return { edge, centerX: box.x + box.width / 2, box, lines }
  })
}

/** Reserve the area a mark itself occupies so labels never land on top of it. */
export function markObstacleBox(point: MapPoint, radius: number): MapLabelBox {
  return {
    x: point.cx - radius,
    y: point.cy - radius,
    width: radius * 2,
    height: radius * 2,
  }
}
