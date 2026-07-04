"use client"

import { useState } from "react"
import { trajectories } from "@/lib/futures/trajectories"

// A 2D field map of the twelve trajectories. Position is editorial, not
// measured: mapX runs from control broadly distributed (left) to control held
// by a single actor (right); mapY runs from humans steering (top) to humans
// sidelined (bottom). Every point is a focusable link into its card below.

const VIEW_W = 720
const VIEW_H = 560

const PLOT_LEFT = 132
const PLOT_RIGHT = 588
const PLOT_TOP = 76
const PLOT_BOTTOM = 464
const PLOT_W = PLOT_RIGHT - PLOT_LEFT
const PLOT_H = PLOT_BOTTOM - PLOT_TOP
const CENTER_X = (PLOT_LEFT + PLOT_RIGHT) / 2
const CENTER_Y = (PLOT_TOP + PLOT_BOTTOM) / 2

function projectX(mapX: number) {
  return PLOT_LEFT + mapX * PLOT_W
}

function projectY(mapY: number) {
  return PLOT_TOP + mapY * PLOT_H
}

// Anchor the label so text grows inward from the edges and stays on-canvas.
function labelAnchor(cx: number): "start" | "middle" | "end" {
  if (cx < PLOT_LEFT + 70) return "start"
  if (cx > PLOT_RIGHT - 70) return "end"
  return "middle"
}

export function TrajectoryMap() {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <figure className="trajectory-map">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="trajectory-map__svg"
        role="group"
        aria-label="Field map of twelve advanced-AI trajectories, placed by how concentrated control is and how much humans still steer. Each point links to its description below."
      >
        {/* Plot frame and center guides */}
        <rect
          x={PLOT_LEFT}
          y={PLOT_TOP}
          width={PLOT_W}
          height={PLOT_H}
          fill="none"
          stroke="var(--border)"
          strokeWidth={1}
        />
        <line
          x1={PLOT_LEFT}
          y1={CENTER_Y}
          x2={PLOT_RIGHT}
          y2={CENTER_Y}
          stroke="var(--border)"
          strokeWidth={1}
          strokeDasharray="3 5"
        />
        <line
          x1={CENTER_X}
          y1={PLOT_TOP}
          x2={CENTER_X}
          y2={PLOT_BOTTOM}
          stroke="var(--border)"
          strokeWidth={1}
          strokeDasharray="3 5"
        />

        {/* Axis labels — plain language, one per edge */}
        <text className="trajectory-map__axis" x={CENTER_X} y={PLOT_TOP - 34} textAnchor="middle">
          Humans steer outcomes
        </text>
        <text
          className="trajectory-map__axis"
          x={CENTER_X}
          y={PLOT_BOTTOM + 42}
          textAnchor="middle"
        >
          Humans sidelined or absent
        </text>
        <text className="trajectory-map__axis" x={16} y={CENTER_Y - 6} textAnchor="start">
          <tspan x={16} dy={0}>Control broadly</tspan>
          <tspan x={16} dy={14}>distributed</tspan>
        </text>
        <text
          className="trajectory-map__axis"
          x={VIEW_W - 16}
          y={CENTER_Y - 6}
          textAnchor="end"
        >
          <tspan x={VIEW_W - 16} dy={0}>Control held by</tspan>
          <tspan x={VIEW_W - 16} dy={14}>a single actor</tspan>
        </text>

        {/* Trajectory points — focusable links into the cards below */}
        {trajectories.map((t) => {
          const cx = projectX(t.mapX)
          const cy = projectY(t.mapY)
          const anchor = labelAnchor(cx)
          const below = t.mapY < 0.4
          const labelY = below ? cy + 20 : cy - 14
          const isActive = activeId === t.id
          const dimmed = activeId !== null && !isActive

          return (
            <a
              key={t.id}
              href={`#trajectory-${t.id}`}
              aria-label={`${t.name}: jump to its description`}
              className={`trajectory-map__point${isActive ? " trajectory-map__point--active" : ""}${
                dimmed ? " trajectory-map__point--dimmed" : ""
              }`}
              onMouseEnter={() => setActiveId(t.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(t.id)}
              onBlur={() => setActiveId(null)}
            >
              <circle
                className="trajectory-map__dot"
                cx={cx}
                cy={cy}
                r={isActive ? 7 : 4.5}
              />
              <text className="trajectory-map__label" x={cx} y={labelY} textAnchor={anchor}>
                {t.name}
              </text>
            </a>
          )
        })}
      </svg>

      <figcaption className="trajectory-map__caption muted">
        Positions are an editorial placement for orientation, not a measurement. Hover, tap, or tab
        to a point to jump to its description.
      </figcaption>
    </figure>
  )
}
