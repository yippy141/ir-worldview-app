import type { CSSProperties } from "react"
import type { DimensionScores } from "@/lib/types"
import { FAMILY_LABELS } from "@/lib/worldview-config"
import {
  MAP_ANCHOR_DOT_RADIUS,
  MAP_CENTER,
  MAP_LABEL_MAX_WIDTH,
  MAP_PLOT_RADIUS,
  MAP_RESPONDENT_DOT_RADIUS,
  MAP_RESPONDENT_RING_RADIUS,
  MAP_VIEW_SIZE,
  markObstacleBox,
  resolveAxisLabelPlacements,
  resolveMapLabelPlacements,
  toMapPoint,
  toOverlayPercent,
  type MapLabelBox,
  type MapLabelRequest,
} from "@/lib/results/map-layout"
import { AXIS_LABELS, TRADITION_ANCHORS, toDisplayPosition } from "@/lib/results/position"

type Props = {
  dimensionScores: DimensionScores
  lowDifferentiation?: boolean
}

// Rendered type sizes, in CSS pixels. Labels are HTML above the SVG so these
// hold at every breakpoint instead of scaling with the viewBox.
const TRADITION_LABEL_PX = 12 // 0.75rem
const AXIS_LABEL_PX = 11 // 0.6875rem
const TRADITION_TRACKING = 0.09
const AXIS_TRACKING = 0.05

const PLOT_LEFT = MAP_CENTER - MAP_PLOT_RADIUS
const PLOT_SIDE = MAP_PLOT_RADIUS * 2

function overlayStyle(box: MapLabelBox, centerX: number): CSSProperties {
  return {
    left: `${toOverlayPercent(centerX)}%`,
    top: `${toOverlayPercent(box.y)}%`,
  }
}

export function DimensionFieldMap({ dimensionScores, lowDifferentiation = false }: Props) {
  const position = toDisplayPosition(dimensionScores, lowDifferentiation)
  const marker = toMapPoint(position)

  const axisLabels = resolveAxisLabelPlacements(AXIS_LABELS, AXIS_LABEL_PX, AXIS_TRACKING)
  const anchorPoints = TRADITION_ANCHORS.map((anchor) => ({
    anchor,
    point: toMapPoint(anchor.position),
  }))

  const respondentClearance = MAP_RESPONDENT_RING_RADIUS + 3
  const anchorClearance = MAP_ANCHOR_DOT_RADIUS + 3

  // The respondent label is placed first so the tradition labels give way to
  // it, then every mark is reserved so no label lands on a dot.
  const labelRequests: MapLabelRequest[] = [
    {
      key: "respondent",
      point: marker,
      text: "You",
      fontSize: TRADITION_LABEL_PX,
      tracking: TRADITION_TRACKING,
      clearance: respondentClearance,
    },
    ...anchorPoints.map(({ anchor, point }) => ({
      key: anchor.key,
      point,
      text: FAMILY_LABELS[anchor.key],
      fontSize: TRADITION_LABEL_PX,
      tracking: TRADITION_TRACKING,
      maxWidth: MAP_LABEL_MAX_WIDTH,
      clearance: anchorClearance,
    })),
  ]

  const placements = resolveMapLabelPlacements(labelRequests, {
    obstacles: [
      ...axisLabels.map((label) => label.box),
      markObstacleBox(marker, respondentClearance),
      ...anchorPoints.map(({ point }) => markObstacleBox(point, anchorClearance)),
    ],
  })

  const placementByKey = new Map(placements.map((placement) => [placement.key, placement]))
  const respondentLabel = placementByKey.get("respondent")

  return (
    <div className="field-map">
      <div className="field-map__frame">
        <svg
          viewBox={`0 0 ${MAP_VIEW_SIZE} ${MAP_VIEW_SIZE}`}
          role="img"
          aria-label={`Field map placing this profile among the four modeled traditions — ${TRADITION_ANCHORS.map((anchor) => FAMILY_LABELS[anchor.key]).join(", ")}`}
          className="field-map__svg"
        >
          {/* Plot frame and centre axes */}
          <rect
            x={PLOT_LEFT}
            y={PLOT_LEFT}
            width={PLOT_SIDE}
            height={PLOT_SIDE}
            className="field-map__frame-rect"
          />
          <line
            x1={PLOT_LEFT}
            y1={MAP_CENTER}
            x2={PLOT_LEFT + PLOT_SIDE}
            y2={MAP_CENTER}
            className="field-map__guide"
          />
          <line
            x1={MAP_CENTER}
            y1={PLOT_LEFT}
            x2={MAP_CENTER}
            y2={PLOT_LEFT + PLOT_SIDE}
            className="field-map__guide"
          />

          {/* Tradition anchors — encoded by BOTH colour and text label */}
          {anchorPoints.map(({ anchor, point }) => (
            <circle
              key={anchor.key}
              cx={point.cx}
              cy={point.cy}
              r={MAP_ANCHOR_DOT_RADIUS}
              fill={`var(${anchor.colorVar})`}
              className="field-map__anchor-dot"
            />
          ))}

          {/* Respondent position — the element the reader came to find */}
          <circle
            cx={marker.cx}
            cy={marker.cy}
            r={MAP_RESPONDENT_RING_RADIUS}
            className="field-map__you-ring"
          />
          <circle
            cx={marker.cx}
            cy={marker.cy}
            r={MAP_RESPONDENT_DOT_RADIUS}
            className="field-map__you-dot"
          />
        </svg>

        <div className="field-map__overlay" aria-hidden="true">
          {axisLabels.map((label) => (
            <span
              key={label.edge}
              className="field-map__axis"
              data-edge={label.edge}
              style={overlayStyle(label.box, label.centerX)}
            >
              {label.lines.join("\n")}
            </span>
          ))}

          {anchorPoints.map(({ anchor }) => {
            const placement = placementByKey.get(anchor.key)
            if (!placement) return null
            return (
              <span
                key={anchor.key}
                className="field-map__anchor-label"
                style={{
                  ...overlayStyle(placement.box, placement.centerX),
                  color: `var(${anchor.colorVar})`,
                }}
              >
                {placement.lines.join("\n")}
              </span>
            )
          })}

          {respondentLabel ? (
            <span
              className="field-map__you-label"
              style={overlayStyle(respondentLabel.box, respondentLabel.centerX)}
            >
              You
            </span>
          ) : null}
        </div>
      </div>

      <p className="field-map__caption muted">
        The dot is where your answers place you. The vertical axis separates
        realism, institutionalism, and critical political economy only weakly,
        because all three read world politics through material forces — so
        distance between those three says less than distance to constructivism.
      </p>
    </div>
  )
}
