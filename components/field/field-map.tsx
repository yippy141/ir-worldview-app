"use client"

import type { ReactNode } from "react"
import type { FieldItemKind } from "@/lib/field/items"
import type { MapPosition } from "@/lib/field/position"
import { AXIS_LABELS, TRADITION_ANCHORS } from "@/lib/results/position"
import type { ReferenceEntityType } from "@/lib/reference-profiles/types"
import { FAMILY_LABELS } from "@/lib/worldview-config"

// One field canvas for every V16 surface: the Foundation-result geometry
// (340x320 viewBox, square plot of half-extent R) with a marker vocabulary
// that separates the four object kinds by shape and ink. Brass stays reserved
// for the user's own marks; reference marks render in steel.

const VIEW_W = 340
const VIEW_H = 320
const CENTER_X = 170
const CENTER_Y = 150
const R = 100

export type FieldMapMarker = {
  key: string
  kind: FieldItemKind
  entityType?: ReferenceEntityType
  label: string
  position: MapPosition
  selected?: boolean
  labeled?: boolean
  draft?: boolean
}

export type FieldMapConnector = {
  from: MapPosition
  to: MapPosition
}

export type FieldMapHull = {
  id: string
  label: string
  points: MapPosition[]
}

type Props = {
  markers: FieldMapMarker[]
  connectors?: FieldMapConnector[]
  hulls?: FieldMapHull[]
  ariaLabel: string
  caption?: ReactNode
  showAnchors?: boolean
  onSelect?: (key: string) => void
  /** Anchor prefix for focusable marker links into the semantic list. */
  markerHrefPrefix?: string
}

function toSvg(position: MapPosition) {
  return {
    cx: CENTER_X + position.x * R,
    cy: CENTER_Y - position.y * R,
  }
}

function labelAnchor(cx: number): "start" | "middle" | "end" {
  if (cx < CENTER_X - R + 46) return "start"
  if (cx > CENTER_X + R - 46) return "end"
  return "middle"
}

export function FieldMap({
  markers,
  connectors = [],
  hulls = [],
  ariaLabel,
  caption,
  showAnchors = true,
  onSelect,
  markerHrefPrefix,
}: Props) {
  const interactive = Boolean(onSelect || markerHrefPrefix)

  return (
    <figure className="field-canvas">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role={interactive ? "group" : "img"}
        aria-label={ariaLabel}
        className="field-canvas__svg"
      >
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

        <text className="field-canvas__axis" x={CENTER_X} y={CENTER_Y - R - 12} textAnchor="middle">
          {AXIS_LABELS.top}
        </text>
        <text className="field-canvas__axis" x={CENTER_X} y={CENTER_Y + R + 22} textAnchor="middle">
          {AXIS_LABELS.bottom}
        </text>
        <text className="field-canvas__axis" x={8} y={CENTER_Y - 6} textAnchor="start">
          <tspan x={8} dy={0}>Power &amp;</tspan>
          <tspan x={8} dy={12}>competition</tspan>
        </text>
        <text className="field-canvas__axis" x={VIEW_W - 8} y={CENTER_Y - 6} textAnchor="end">
          <tspan x={VIEW_W - 8} dy={0}>Rules &amp;</tspan>
          <tspan x={VIEW_W - 8} dy={12}>institutions</tspan>
        </text>

        {showAnchors
          ? TRADITION_ANCHORS.map((anchor) => {
              const { cx, cy } = toSvg(anchor.position)
              const labelBelow = anchor.position.y < 0
              const labelY = labelBelow ? cy + 16 : cy - 12
              const color = `var(${anchor.colorVar})`
              return (
                <g key={anchor.key} className="field-canvas__anchor" aria-hidden="true">
                  <circle cx={cx} cy={cy} r={4.5} fill={color} stroke="var(--panel)" strokeWidth={1} opacity={0.8} />
                  <text
                    className="field-canvas__anchor-label"
                    x={cx}
                    y={labelY}
                    textAnchor="middle"
                    fill={color}
                  >
                    {FAMILY_LABELS[anchor.key]}
                  </text>
                </g>
              )
            })
          : null}

        {hulls.map((hull) => {
          if (hull.points.length < 2) return null
          const svgPoints = hull.points
            .map((point) => {
              const { cx, cy } = toSvg(point)
              return `${cx},${cy}`
            })
            .join(" ")
          const centroid = hull.points.reduce(
            (sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y }),
            { x: 0, y: 0 },
          )
          const center = toSvg({
            x: centroid.x / hull.points.length,
            y: centroid.y / hull.points.length,
          })
          return (
            <g key={hull.id} className="field-canvas__hull">
              <polygon
                points={svgPoints}
                fill="var(--steel)"
                fillOpacity={0.06}
                stroke="var(--steel)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                className="field-canvas__hull-label"
                x={center.cx}
                y={center.cy}
                textAnchor="middle"
              >
                {hull.label}
              </text>
            </g>
          )
        })}

        {connectors.map((connector, index) => {
          const from = toSvg(connector.from)
          const to = toSvg(connector.to)
          return (
            <line
              key={index}
              className="field-canvas__connector"
              x1={from.cx}
              y1={from.cy}
              x2={to.cx}
              y2={to.cy}
              stroke="var(--accent-dim)"
              strokeWidth={1.2}
              aria-hidden="true"
            />
          )
        })}

        {markers.map((marker) => {
          const { cx, cy } = toSvg(marker.position)
          const showLabel = Boolean(marker.labeled || marker.selected)
          const labelBelow = marker.position.y < -0.55
          const labelY = labelBelow ? cy + 18 : cy - 13
          const content = (
            <>
              {marker.selected ? (
                <circle
                  className="field-canvas__selection-ring"
                  cx={cx}
                  cy={cy}
                  r={10.5}
                  fill="none"
                  stroke="var(--accent-light)"
                  strokeWidth={1.5}
                />
              ) : null}
              <MarkerGlyph kind={marker.kind} entityType={marker.entityType} cx={cx} cy={cy} />
              {showLabel ? (
                <text
                  className={`field-canvas__marker-label${
                    marker.kind === "baseline" || marker.kind === "perspective-run"
                      ? " field-canvas__marker-label--own"
                      : ""
                  }`}
                  x={cx}
                  y={labelY}
                  textAnchor={labelAnchor(cx)}
                >
                  {marker.label}
                </text>
              ) : null}
            </>
          )

          if (!interactive) {
            return <g key={marker.key}>{content}</g>
          }

          return (
            <a
              key={marker.key}
              href={markerHrefPrefix ? `#${markerHrefPrefix}${marker.key}` : "#"}
              className="field-canvas__marker-link"
              aria-label={`${marker.label}${marker.draft ? " (research draft)" : ""}: open details`}
              aria-current={marker.selected ? "true" : undefined}
              onClick={(event) => {
                if (onSelect) {
                  event.preventDefault()
                  onSelect(marker.key)
                }
              }}
            >
              {content}
            </a>
          )
        })}
      </svg>
      {caption ? (
        <figcaption className="field-canvas__caption muted">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

function MarkerGlyph({
  kind,
  entityType,
  cx,
  cy,
}: {
  kind: FieldItemKind
  entityType?: ReferenceEntityType
  cx: number
  cy: number
}) {
  if (kind === "baseline") {
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill="var(--panel)" opacity={0.85} />
        <circle cx={cx} cy={cy} r={5} fill="var(--accent)" />
      </g>
    )
  }

  if (kind === "perspective-run") {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="var(--bg)"
        stroke="var(--accent)"
        strokeWidth={1.8}
      />
    )
  }

  if (kind === "atlas-pattern") {
    return (
      <g stroke="var(--faint)" strokeWidth={1.5}>
        <line x1={cx - 4} y1={cy} x2={cx + 4} y2={cy} />
        <line x1={cx} y1={cy - 4} x2={cx} y2={cy + 4} />
      </g>
    )
  }

  // Reference marks: shape by entity type, steel ink throughout.
  const stroke = "var(--steel)"
  if (entityType === "government") {
    return <rect x={cx - 4.5} y={cy - 4.5} width={9} height={9} fill={stroke} />
  }
  if (entityType === "leader") {
    return (
      <path
        d={`M ${cx} ${cy - 5.5} L ${cx + 5} ${cy + 4} L ${cx - 5} ${cy + 4} Z`}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
      />
    )
  }
  if (entityType === "doctrine") {
    return (
      <path
        d={`M ${cx} ${cy - 5.5} L ${cx + 5.5} ${cy} L ${cx} ${cy + 5.5} L ${cx - 5.5} ${cy} Z`}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
      />
    )
  }
  if (entityType === "institution") {
    return (
      <path
        d={`M ${cx - 2.75} ${cy - 4.75} L ${cx + 2.75} ${cy - 4.75} L ${cx + 5.5} ${cy} L ${cx + 2.75} ${cy + 4.75} L ${cx - 2.75} ${cy + 4.75} L ${cx - 5.5} ${cy} Z`}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
      />
    )
  }
  // Thinker (and any remaining reference type): open square.
  return (
    <rect
      x={cx - 4.5}
      y={cy - 4.5}
      width={9}
      height={9}
      fill="none"
      stroke={stroke}
      strokeWidth={1.5}
    />
  )
}

export function FieldMapKey({
  kinds,
}: {
  kinds: readonly ("baseline" | "perspective-run" | "atlas-pattern" | "reference")[]
}) {
  return (
    <dl className="field-key" aria-label="Map key">
      {kinds.includes("baseline") ? (
        <div className="field-key__row">
          <dt aria-hidden="true">
            <svg viewBox="0 0 16 16" className="field-key__glyph">
              <circle cx={8} cy={8} r={5} fill="var(--accent)" />
            </svg>
          </dt>
          <dd>My baseline</dd>
        </div>
      ) : null}
      {kinds.includes("perspective-run") ? (
        <div className="field-key__row">
          <dt aria-hidden="true">
            <svg viewBox="0 0 16 16" className="field-key__glyph">
              <circle cx={8} cy={8} r={5} fill="var(--bg)" stroke="var(--accent)" strokeWidth={1.8} />
            </svg>
          </dt>
          <dd>Perspective run</dd>
        </div>
      ) : null}
      {kinds.includes("atlas-pattern") ? (
        <div className="field-key__row">
          <dt aria-hidden="true">
            <svg viewBox="0 0 16 16" className="field-key__glyph">
              <g stroke="var(--faint)" strokeWidth={1.5}>
                <line x1={3.5} y1={8} x2={12.5} y2={8} />
                <line x1={8} y1={3.5} x2={8} y2={12.5} />
              </g>
            </svg>
          </dt>
          <dd>Atlas pattern</dd>
        </div>
      ) : null}
      {kinds.includes("reference") ? (
        <>
          <div className="field-key__row">
            <dt aria-hidden="true">
              <svg viewBox="0 0 16 16" className="field-key__glyph">
                <rect x={3.5} y={3.5} width={9} height={9} fill="none" stroke="var(--steel)" strokeWidth={1.5} />
              </svg>
            </dt>
            <dd>Thinker</dd>
          </div>
          <div className="field-key__row">
            <dt aria-hidden="true">
              <svg viewBox="0 0 16 16" className="field-key__glyph">
                <path d="M 8 2.5 L 13 12.5 L 3 12.5 Z" fill="none" stroke="var(--steel)" strokeWidth={1.5} />
              </svg>
            </dt>
            <dd>Leader</dd>
          </div>
          <div className="field-key__row">
            <dt aria-hidden="true">
              <svg viewBox="0 0 16 16" className="field-key__glyph">
                <rect x={3.5} y={3.5} width={9} height={9} fill="var(--steel)" />
              </svg>
            </dt>
            <dd>Government</dd>
          </div>
          <div className="field-key__row">
            <dt aria-hidden="true">
              <svg viewBox="0 0 16 16" className="field-key__glyph">
                <path d="M 8 2.5 L 13.5 8 L 8 13.5 L 2.5 8 Z" fill="none" stroke="var(--steel)" strokeWidth={1.5} />
              </svg>
            </dt>
            <dd>Doctrine</dd>
          </div>
          <div className="field-key__row">
            <dt aria-hidden="true">
              <svg viewBox="0 0 16 16" className="field-key__glyph">
                <path d="M 5.25 3.25 L 10.75 3.25 L 13.5 8 L 10.75 12.75 L 5.25 12.75 L 2.5 8 Z" fill="none" stroke="var(--steel)" strokeWidth={1.5} />
              </svg>
            </dt>
            <dd>Institution</dd>
          </div>
          <div className="field-key__row">
            <dt aria-hidden="true">
              <svg viewBox="0 0 16 16" className="field-key__glyph">
                <polygon points="3,12 6,4 13,6 11,13" fill="var(--steel)" fillOpacity={0.08} stroke="var(--steel)" strokeWidth={1} strokeDasharray="3 3" />
              </svg>
            </dt>
            <dd>Movement span</dd>
          </div>
        </>
      ) : null}
    </dl>
  )
}
