import type { DimensionScores } from "@/lib/types"
import { FAMILY_LABELS } from "@/lib/worldview-config"
import {
  AXIS_LABELS,
  TRADITION_ANCHORS,
  spreadRingFraction,
  toDisplayPosition,
  type MapPosition,
} from "@/lib/results/position"

type Props = {
  dimensionScores: DimensionScores
  lowDifferentiation?: boolean
}

// Plot geometry in viewBox units. The plot is a square of half-extent R
// centered at (CENTER_X, CENTER_Y); margins hold the axis labels.
const VIEW_W = 340
const VIEW_H = 320
const CENTER_X = 170
const CENTER_Y = 150
const R = 100

// Math space (+Y up) to SVG space (+Y down).
function toSvg(position: MapPosition) {
  return {
    cx: CENTER_X + position.x * R,
    cy: CENTER_Y - position.y * R,
  }
}

export function DimensionFieldMap({ dimensionScores, lowDifferentiation = false }: Props) {
  const position = toDisplayPosition(dimensionScores, lowDifferentiation)
  const marker = toSvg(position)
  const ringRadius = spreadRingFraction(dimensionScores, lowDifferentiation) * R

  return (
    <div className="field-map">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label="Field map placing this profile among the four modeled traditions, with a ring showing how loosely the reading is determined"
        className="field-map__svg"
      >
        {/* Plot frame and center axes */}
        <rect
          x={CENTER_X - R}
          y={CENTER_Y - R}
          width={R * 2}
          height={R * 2}
          fill="none"
          stroke="var(--border)"
          strokeWidth={1}
        />
        <line
          x1={CENTER_X - R}
          y1={CENTER_Y}
          x2={CENTER_X + R}
          y2={CENTER_Y}
          stroke="var(--border)"
          strokeWidth={1}
          strokeDasharray="3 4"
        />
        <line
          x1={CENTER_X}
          y1={CENTER_Y - R}
          x2={CENTER_X}
          y2={CENTER_Y + R}
          stroke="var(--border)"
          strokeWidth={1}
          strokeDasharray="3 4"
        />

        {/* Axis labels — plain language, one per edge */}
        <text className="field-map__axis" x={CENTER_X} y={CENTER_Y - R - 12} textAnchor="middle">
          {AXIS_LABELS.top}
        </text>
        <text className="field-map__axis" x={CENTER_X} y={CENTER_Y + R + 22} textAnchor="middle">
          {AXIS_LABELS.bottom}
        </text>
        <text className="field-map__axis" x={8} y={CENTER_Y - 6} textAnchor="start">
          <tspan x={8} dy={0}>Power &amp;</tspan>
          <tspan x={8} dy={12}>competition</tspan>
        </text>
        <text className="field-map__axis" x={VIEW_W - 8} y={CENTER_Y - 6} textAnchor="end">
          <tspan x={VIEW_W - 8} dy={0}>Rules &amp;</tspan>
          <tspan x={VIEW_W - 8} dy={12}>institutions</tspan>
        </text>

        {/* Tradition anchors — encoded by BOTH color and text label */}
        {TRADITION_ANCHORS.map((anchor) => {
          const { cx, cy } = toSvg(anchor.position)
          const labelBelow = anchor.position.y < 0
          const labelY = labelBelow ? cy + 16 : cy - 12
          const color = `var(${anchor.colorVar})`
          return (
            <g key={anchor.key} className="field-map__anchor">
              <circle cx={cx} cy={cy} r={5.5} fill={color} stroke="var(--panel)" strokeWidth={1} />
              <text
                className="field-map__anchor-label"
                x={cx}
                y={labelY}
                textAnchor="middle"
                fill={color}
              >
                {FAMILY_LABELS[anchor.key]}
              </text>
            </g>
          )
        })}

        {/* Spread ring — dashed; wide when the reading is loosely determined */}
        <circle
          cx={marker.cx}
          cy={marker.cy}
          r={ringRadius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.5}
          strokeDasharray="4 5"
          opacity={0.7}
        />

        {/* Respondent position */}
        <circle cx={marker.cx} cy={marker.cy} r={8} fill="var(--panel)" opacity={0.85} />
        <circle cx={marker.cx} cy={marker.cy} r={5} fill="var(--accent)" />
        <text className="field-map__you" x={marker.cx} y={marker.cy - 12} textAnchor="middle">
          You
        </text>
      </svg>

      <p className="field-map__caption muted">
        Dot: your position. Ring: how loosely it is fixed.
      </p>
    </div>
  )
}
