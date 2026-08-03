import assert from "node:assert/strict"
import { test } from "node:test"

import {
  MAP_ANCHOR_DOT_RADIUS,
  MAP_CENTER,
  MAP_LABEL_MAX_WIDTH,
  MAP_PLOT_FRACTION,
  MAP_PLOT_RADIUS,
  MAP_RESPONDENT_DOT_RADIUS,
  MAP_VIEW_SIZE,
  estimateMapLabelSize,
  markObstacleBox,
  resolveAxisLabelPlacements,
  resolveMapLabelPlacements,
  toMapPoint,
  toOverlayPercent,
  type MapLabelBox,
  type MapLabelRequest,
} from "@/lib/results/map-layout"
import { TRADITION_ANCHORS } from "@/lib/results/position"
import { FAMILY_LABELS } from "@/lib/worldview-config"

const ANCHOR_FONT_SIZE = 12
const ANCHOR_TRACKING = 0.08

function boxesOverlap(left: MapLabelBox, right: MapLabelBox): boolean {
  return (
    left.x < right.x + right.width &&
    right.x < left.x + left.width &&
    left.y < right.y + right.height &&
    right.y < left.y + left.height
  )
}

test("the plot square takes at least 70 percent of the container width", () => {
  assert.equal(MAP_PLOT_FRACTION >= 0.7, true)
  assert.equal(MAP_CENTER, MAP_VIEW_SIZE / 2)
  assert.equal(MAP_PLOT_RADIUS * 2 <= MAP_VIEW_SIZE, true)
})

test("the respondent dot is clearly larger than a tradition anchor", () => {
  assert.equal(MAP_RESPONDENT_DOT_RADIUS / MAP_ANCHOR_DOT_RADIUS >= 1.6, true)
})

test("projection corners map to the plot corners and the centre to the middle", () => {
  assert.deepEqual(toMapPoint({ x: 0, y: 0 }), { cx: MAP_CENTER, cy: MAP_CENTER })
  assert.deepEqual(toMapPoint({ x: -1, y: 1 }), {
    cx: MAP_CENTER - MAP_PLOT_RADIUS,
    cy: MAP_CENTER - MAP_PLOT_RADIUS,
  })
  assert.deepEqual(toMapPoint({ x: 1, y: -1 }), {
    cx: MAP_CENTER + MAP_PLOT_RADIUS,
    cy: MAP_CENTER + MAP_PLOT_RADIUS,
  })
  assert.equal(toOverlayPercent(MAP_CENTER), 50)
})

test("wide CJK glyphs are measured wider than Latin ones", () => {
  const latin = estimateMapLabelSize("Realist", ANCHOR_FONT_SIZE)
  const chinese = estimateMapLabelSize("战略现实主义", ANCHOR_FONT_SIZE)

  assert.equal(chinese.width > latin.width, true)
  assert.equal(latin.height, chinese.height)
  assert.deepEqual(latin.lines, ["Realist"])
  assert.equal(
    estimateMapLabelSize("Realist", ANCHOR_FONT_SIZE, ANCHOR_TRACKING).width >
      latin.width,
    true,
  )
})

test("long labels wrap to the requested width and grow the box height", () => {
  const single = estimateMapLabelSize(
    "Critical Political Economist",
    ANCHOR_FONT_SIZE,
    ANCHOR_TRACKING,
  )
  const wrapped = estimateMapLabelSize(
    "Critical Political Economist",
    ANCHOR_FONT_SIZE,
    ANCHOR_TRACKING,
    MAP_LABEL_MAX_WIDTH,
  )

  assert.deepEqual(single.lines, ["Critical Political Economist"])
  assert.equal(wrapped.lines.length > 1, true)
  assert.equal(wrapped.lines.join(" "), "Critical Political Economist")
  assert.equal(wrapped.width <= MAP_LABEL_MAX_WIDTH, true)
  assert.equal(wrapped.height > single.height, true)
})

test("a run without spaces still wraps to the requested width", () => {
  const wrapped = estimateMapLabelSize("批判政治经济学", ANCHOR_FONT_SIZE, 0, 40)

  assert.equal(wrapped.lines.length > 1, true)
  assert.equal(wrapped.lines.join(""), "批判政治经济学")
  assert.equal(wrapped.width <= 40, true)
})

test("tradition labels avoid each other, the axis labels, and the respondent mark", () => {
  const axisLabels = resolveAxisLabelPlacements(
    {
      top: "Ideas, norms & legitimacy",
      bottom: "Material & economic structure",
      left: "Power & competition",
      right: "Rules & institutions",
    },
    11,
    0.04,
  )
  // The respondent sits almost exactly on the realist anchor: the worst case
  // the placement rules have to survive on a real profile.
  const respondent = toMapPoint({ x: -0.6, y: 0.28 })
  const obstacles = [
    ...axisLabels.map((label) => label.box),
    markObstacleBox(respondent, 12),
    ...TRADITION_ANCHORS.map((anchor) => markObstacleBox(toMapPoint(anchor.position), 6)),
  ]

  const requests: MapLabelRequest[] = TRADITION_ANCHORS.map((anchor) => ({
    key: anchor.key,
    point: toMapPoint(anchor.position),
    text: FAMILY_LABELS[anchor.key],
    fontSize: ANCHOR_FONT_SIZE,
    tracking: ANCHOR_TRACKING,
    maxWidth: MAP_LABEL_MAX_WIDTH,
    clearance: MAP_ANCHOR_DOT_RADIUS + 3,
  }))

  const placements = resolveMapLabelPlacements(requests, { obstacles })

  assert.equal(placements.length, TRADITION_ANCHORS.length)
  assert.deepEqual(
    placements.map((placement) => placement.key),
    TRADITION_ANCHORS.map((anchor) => anchor.key),
  )

  for (const placement of placements) {
    for (const obstacle of obstacles) {
      assert.equal(
        boxesOverlap(placement.box, obstacle),
        false,
        `${placement.key} overlaps a reserved box`,
      )
    }
  }

  for (let left = 0; left < placements.length; left += 1) {
    for (let right = left + 1; right < placements.length; right += 1) {
      assert.equal(
        boxesOverlap(placements[left].box, placements[right].box),
        false,
        `${placements[left].key} overlaps ${placements[right].key}`,
      )
    }
  }
})

test("a crowded point still resolves to a single deterministic placement", () => {
  const point = toMapPoint({ x: 0, y: 0 })
  const crowded: MapLabelRequest[] = ["a", "b", "c", "d", "e"].map((key) => ({
    key,
    point,
    text: "Structural inequality critic",
    fontSize: ANCHOR_FONT_SIZE,
  }))

  const first = resolveMapLabelPlacements(crowded)
  const second = resolveMapLabelPlacements(crowded)

  assert.equal(first.length, crowded.length)
  assert.deepEqual(first, second)
})

test("a label clears the mark it belongs to before anything else", () => {
  const point = toMapPoint({ x: 0, y: 0 })
  const [tight] = resolveMapLabelPlacements([
    { key: "tight", point, text: "Realist", fontSize: ANCHOR_FONT_SIZE },
  ])
  const [cleared] = resolveMapLabelPlacements([
    { key: "cleared", point, text: "Realist", fontSize: ANCHOR_FONT_SIZE, clearance: 12 },
  ])

  assert.equal(tight.side, cleared.side)
  assert.equal(cleared.box.y - tight.box.y, 12)
})

test("labels are pulled back inside the viewBox near the rim", () => {
  const placements = resolveMapLabelPlacements([
    {
      key: "rim",
      point: toMapPoint({ x: 1, y: -1 }),
      text: "Rules and cooperation",
      fontSize: ANCHOR_FONT_SIZE,
      tracking: ANCHOR_TRACKING,
    },
  ])

  const { box } = placements[0]
  assert.equal(box.x >= 0, true)
  assert.equal(box.y >= 0, true)
  assert.equal(box.x + box.width <= MAP_VIEW_SIZE, true)
  assert.equal(box.y + box.height <= MAP_VIEW_SIZE, true)
})

test("axis labels hug the plot edges instead of floating in the margin", () => {
  const plotTop = MAP_CENTER - MAP_PLOT_RADIUS
  const plotBottom = MAP_CENTER + MAP_PLOT_RADIUS
  const placements = resolveAxisLabelPlacements(
    {
      top: "Ideas, norms & legitimacy",
      bottom: "Material & economic structure",
      left: "Power & competition",
      right: "Rules & institutions",
    },
    11,
  )

  const byEdge = Object.fromEntries(
    placements.map((placement) => [placement.edge, placement.box]),
  )

  assert.equal(byEdge.top.y >= plotTop, true)
  assert.equal(byEdge.top.y < plotTop + 20, true)
  assert.equal(byEdge.bottom.y + byEdge.bottom.height <= plotBottom, true)
  assert.equal(byEdge.left.x >= MAP_CENTER - MAP_PLOT_RADIUS, true)
  assert.equal(
    byEdge.right.x + byEdge.right.width <= MAP_CENTER + MAP_PLOT_RADIUS,
    true,
  )
})
