"use client"

import { useId, useMemo, useState, type CSSProperties, type ReactNode } from "react"
import type { FieldItemKind } from "@/lib/field/items"
import { zhHansWorldviewMapUi } from "@/content/locales/zh-Hans/worldview-map"
import {
  calculateFieldMarkerFanOffset,
  groupOverlappingMapItems,
  type MapPosition,
} from "@/lib/field/position"
import { AXIS_LABELS, TRADITION_ANCHORS } from "@/lib/results/position"
import type { ReferenceEntityType } from "@/lib/reference-profiles/types"
import { FAMILY_LABELS } from "@/lib/worldview-config"
import styles from "./worldview-map.module.css"

// The shared projection remains the Foundation-result geometry. Overlap groups
// change only transient display coordinates; every marker retains its canonical
// MapPosition for selection, URLs, connectors, and semantic-list parity.
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
  /** Retained for compact, non-interactive maps outside the workspace. */
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
  copy?: typeof zhHansWorldviewMapUi
}

type RenderedMarker = {
  marker: FieldMapMarker
  cx: number
  cy: number
  groupKey: string
  fanned: boolean
}

type TooltipTarget = {
  targetId: string
  cx: number
  cy: number
  label: string
  secondary?: string
  own?: boolean
}

function toSvg(position: MapPosition) {
  return {
    cx: CENTER_X + position.x * R,
    cy: CENTER_Y - position.y * R,
  }
}

function targetId(kind: "marker" | "group", key: string) {
  return `${kind}:${key}`
}

function labelPlacement(cx: number, cy: number) {
  return {
    horizontal: cx < 62 ? "left" : cx > VIEW_W - 62 ? "right" : "center",
    vertical: cy < 52 ? "below" : "above",
  }
}

function labelStyle(cx: number, cy: number): CSSProperties {
  return {
    left: `${(cx / VIEW_W) * 100}%`,
    top: `${(cy / VIEW_H) * 100}%`,
  }
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
  copy,
}: Props) {
  const tooltipId = useId()
  const interactive = Boolean(onSelect || markerHrefPrefix)
  const [expandedGroupKey, setExpandedGroupKey] = useState<string | null>(null)
  const [hoveredTargetId, setHoveredTargetId] = useState<string | null>(null)
  const [focusedTargetId, setFocusedTargetId] = useState<string | null>(null)

  const overlapGroups = useMemo(
    () =>
      interactive
        ? groupOverlappingMapItems(markers)
        : markers.map((marker) => ({
            key: marker.key,
            position: marker.position,
            items: [marker],
          })),
    [interactive, markers],
  )

  const renderedMarkers = useMemo<RenderedMarker[]>(() => {
    return overlapGroups.flatMap((group) => {
      const anchor = toSvg(group.position)
      const selectedMember = group.items.some((marker) => marker.selected)
      const expanded =
        group.items.length > 1 &&
        (expandedGroupKey === group.key || selectedMember)

      if (group.items.length > 1 && !expanded) return []

      return group.items.map((marker, index) => {
        const offset = expanded
          ? calculateFieldMarkerFanOffset(index, group.items.length)
          : { x: 0, y: 0 }
        const canonical = toSvg(marker.position)
        return {
          marker,
          cx: expanded ? anchor.cx + offset.x : canonical.cx,
          cy: expanded ? anchor.cy + offset.y : canonical.cy,
          groupKey: group.key,
          fanned: expanded,
        }
      })
    })
  }, [expandedGroupKey, overlapGroups])

  const activeTargetId = hoveredTargetId ?? focusedTargetId
  const tooltipTarget = useMemo<TooltipTarget | null>(() => {
    if (activeTargetId?.startsWith("marker:")) {
      const key = activeTargetId.slice("marker:".length)
      const rendered = renderedMarkers.find((entry) => entry.marker.key === key)
      if (rendered) {
        return {
          targetId: activeTargetId,
          cx: rendered.cx,
          cy: rendered.cy,
          label: rendered.marker.label,
          secondary: rendered.marker.draft
            ? copy?.detail.draft ?? "Research draft"
            : undefined,
          own:
            rendered.marker.kind === "baseline" ||
            rendered.marker.kind === "perspective-run",
        }
      }
    }

    if (activeTargetId?.startsWith("group:")) {
      const key = activeTargetId.slice("group:".length)
      const group = overlapGroups.find((entry) => entry.key === key)
      if (group) {
        const anchor = toSvg(group.position)
        return {
          targetId: activeTargetId,
          cx: anchor.cx,
          cy: anchor.cy,
          label: copy?.key.overlappingItems(group.items.length)
            ?? `${group.items.length} overlapping items`,
          secondary: group.items.map((marker) => marker.label).join(" · "),
        }
      }
    }

    const selected = renderedMarkers.find((entry) => entry.marker.selected)
    if (!selected) return null
    return {
      targetId: targetId("marker", selected.marker.key),
      cx: selected.cx,
      cy: selected.cy,
      label: selected.marker.label,
      secondary: selected.marker.draft ? copy?.detail.draft ?? "Research draft" : undefined,
      own:
        selected.marker.kind === "baseline" ||
        selected.marker.kind === "perspective-run",
    }
  }, [activeTargetId, copy, overlapGroups, renderedMarkers])

  const staticLabels = interactive
    ? []
    : renderedMarkers.filter(
        ({ marker }) => marker.labeled || marker.selected,
      )

  return (
    <figure className={`${styles.canvas} field-canvas`}>
      <div className={styles.plot}>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role={interactive ? "group" : "img"}
          aria-label={ariaLabel}
          className={styles.canvasSvg}
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
            className={styles.guideLine}
          />
          <line
            x1={CENTER_X}
            y1={CENTER_Y - R}
            x2={CENTER_X}
            y2={CENTER_Y + R}
            className={styles.guideLine}
          />

          <text className={styles.axisLabel} x={CENTER_X} y={CENTER_Y - R - 12} textAnchor="middle">
            {copy?.axes.top ?? AXIS_LABELS.top}
          </text>
          <text className={styles.axisLabel} x={CENTER_X} y={CENTER_Y + R + 22} textAnchor="middle">
            {copy?.axes.bottom ?? AXIS_LABELS.bottom}
          </text>
          <text className={styles.axisLabel} x={8} y={CENTER_Y - 6} textAnchor="start">
            {copy ? (
              <tspan x={8} dy={0}>{copy.axes.left}</tspan>
            ) : (
              <><tspan x={8} dy={0}>Power &amp;</tspan><tspan x={8} dy={12}>competition</tspan></>
            )}
          </text>
          <text className={styles.axisLabel} x={VIEW_W - 8} y={CENTER_Y - 6} textAnchor="end">
            {copy ? (
              <tspan x={VIEW_W - 8} dy={0}>{copy.axes.right}</tspan>
            ) : (
              <><tspan x={VIEW_W - 8} dy={0}>Rules &amp;</tspan><tspan x={VIEW_W - 8} dy={12}>institutions</tspan></>
            )}
          </text>

          {showAnchors
            ? TRADITION_ANCHORS.map((anchor) => {
                const { cx, cy } = toSvg(anchor.position)
                const labelY = anchor.position.y < 0 ? cy + 15 : cy - 11
                const color = `var(${anchor.colorVar})`
                return (
                  <g key={anchor.key} className={styles.traditionAnchor} aria-hidden="true">
                    <circle cx={cx} cy={cy} r={3.5} fill={color} />
                    <text
                      className={styles.anchorLabel}
                      x={cx}
                      y={labelY}
                      textAnchor="middle"
                      fill={color}
                    >
                      {copy?.familyAnchors[anchor.key] ?? FAMILY_LABELS[anchor.key]}
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
              <g key={hull.id}>
                <polygon
                  points={svgPoints}
                  fill="var(--steel)"
                  fillOpacity={0.06}
                  stroke="var(--steel)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <text className={styles.hullLabel} x={center.cx} y={center.cy} textAnchor="middle">
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
                className={styles.connector}
                x1={from.cx}
                y1={from.cy}
                x2={to.cx}
                y2={to.cy}
                aria-hidden="true"
              />
            )
          })}

          {renderedMarkers
            .filter((entry) => entry.fanned)
            .map((entry) => {
              const group = overlapGroups.find((candidate) => candidate.key === entry.groupKey)
              if (!group) return null
              const anchor = toSvg(group.position)
              return (
                <line
                  key={`fan-${entry.marker.key}`}
                  className={styles.fanLine}
                  x1={anchor.cx}
                  y1={anchor.cy}
                  x2={entry.cx}
                  y2={entry.cy}
                  aria-hidden="true"
                />
              )
            })}

          {overlapGroups
            .filter((group) => group.items.length > 1)
            .map((group) => {
              const anchor = toSvg(group.position)
              const expanded =
                expandedGroupKey === group.key ||
                group.items.some((marker) => marker.selected)
              if (expanded) return null
              const id = targetId("group", group.key)
              const describedBy = tooltipTarget?.targetId === id ? tooltipId : undefined
              return (
                <a
                  key={`group-${group.key}`}
                  href={markerHrefPrefix ? `#${markerHrefPrefix}${group.items[0].key}` : "#"}
                  className={styles.clusterLink}
                  data-field-cluster-key={group.key}
                  aria-expanded={false}
                  aria-describedby={describedBy}
                  aria-label={copy
                    ? `${copy.key.overlappingItems(group.items.length)}：${group.items.map((marker) => marker.label).join("、")}`
                    : `Show ${group.items.length} overlapping items: ${group.items.map((marker) => marker.label).join(", ")}`}
                  onClick={(event) => {
                    event.preventDefault()
                    setExpandedGroupKey(group.key)
                    window.requestAnimationFrame(() => {
                      const firstKey = group.items[0].key
                      Array.from(
                        document.querySelectorAll<HTMLElement>("[data-field-marker-key]"),
                      )
                        .find((element) => element.dataset.fieldMarkerKey === firstKey)
                        ?.focus()
                    })
                  }}
                  onPointerEnter={() => setHoveredTargetId(id)}
                  onPointerLeave={() => setHoveredTargetId(null)}
                  onFocus={() => setFocusedTargetId(id)}
                  onBlur={() => setFocusedTargetId(null)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setExpandedGroupKey(null)
                      setFocusedTargetId(null)
                    }
                  }}
                >
                  <circle className={styles.clusterHit} cx={anchor.cx} cy={anchor.cy} r={18} />
                  <circle className={styles.clusterMarker} cx={anchor.cx} cy={anchor.cy} r={9} />
                  <text className={styles.clusterCount} x={anchor.cx} y={anchor.cy + 3.2} textAnchor="middle">
                    {group.items.length}
                  </text>
                </a>
              )
            })}

          {renderedMarkers.map(({ marker, cx, cy, groupKey }) => {
            const id = targetId("marker", marker.key)
            const describedBy = tooltipTarget?.targetId === id ? tooltipId : undefined
            const content = (
              <>
                {interactive ? (
                  <circle className={styles.markerHit} cx={cx} cy={cy} r={16} aria-hidden="true" />
                ) : null}
                {marker.selected ? (
                  <circle className={styles.selectionRing} cx={cx} cy={cy} r={10.5} />
                ) : null}
                <MarkerGlyph kind={marker.kind} entityType={marker.entityType} cx={cx} cy={cy} />
              </>
            )

            if (!interactive) return <g key={marker.key}>{content}</g>

            return (
              <a
                key={marker.key}
                href={markerHrefPrefix ? `#${markerHrefPrefix}${marker.key}` : "#"}
                className={styles.markerLink}
                data-field-marker-key={marker.key}
                aria-label={copy
                  ? `${marker.label}${marker.draft ? `（${copy.detail.draft}）` : ""}：${copy.list.open}`
                  : `${marker.label}${marker.draft ? " (research draft)" : ""}: open details`}
                aria-describedby={describedBy}
                aria-current={marker.selected ? "true" : undefined}
                onClick={(event) => {
                  if (onSelect) {
                    event.preventDefault()
                    if (
                      (overlapGroups.find((group) => group.key === groupKey)?.items
                        .length ?? 0) > 1
                    ) {
                      setExpandedGroupKey(groupKey)
                    }
                    onSelect(marker.key)
                  }
                }}
                onPointerEnter={() => setHoveredTargetId(id)}
                onPointerLeave={() => setHoveredTargetId(null)}
                onFocus={() => setFocusedTargetId(id)}
                onBlur={() => setFocusedTargetId(null)}
                onKeyDown={(event) => {
                  if (event.key !== "Escape") return
                  setFocusedTargetId(null)
                  if (expandedGroupKey !== groupKey || marker.selected) return
                  setExpandedGroupKey(null)
                  window.requestAnimationFrame(() => {
                    Array.from(
                      document.querySelectorAll<HTMLElement>("[data-field-cluster-key]"),
                    )
                      .find((element) => element.dataset.fieldClusterKey === groupKey)
                      ?.focus()
                  })
                }}
              >
                {content}
              </a>
            )
          })}
        </svg>

        {staticLabels.map(({ marker, cx, cy }) => {
          const placement = labelPlacement(cx, cy)
          return (
            <div
              key={`label-${marker.key}`}
              className={`${styles.mapLabel}${marker.kind === "baseline" || marker.kind === "perspective-run" ? ` ${styles.mapLabelOwn}` : ""}`}
              data-horizontal={placement.horizontal}
              data-vertical={placement.vertical}
              style={labelStyle(cx, cy)}
              aria-hidden="true"
            >
              {marker.label}
            </div>
          )
        })}

        {interactive && tooltipTarget ? (
          <div
            id={tooltipId}
            role="tooltip"
            className={`${styles.mapTooltip}${tooltipTarget.own ? ` ${styles.mapTooltipOwn}` : ""}`}
            data-horizontal={labelPlacement(tooltipTarget.cx, tooltipTarget.cy).horizontal}
            data-vertical={labelPlacement(tooltipTarget.cx, tooltipTarget.cy).vertical}
            style={labelStyle(tooltipTarget.cx, tooltipTarget.cy)}
          >
            <strong>{tooltipTarget.label}</strong>
            {tooltipTarget.secondary ? <span>{tooltipTarget.secondary}</span> : null}
          </div>
        ) : null}
      </div>
      {caption ? <figcaption className={styles.canvasCaption}>{caption}</figcaption> : null}
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
        <circle cx={cx} cy={cy} r={8} fill="var(--panel)" opacity={0.9} />
        <circle cx={cx} cy={cy} r={5} fill="var(--accent)" />
      </g>
    )
  }

  if (kind === "perspective-run") {
    return <circle cx={cx} cy={cy} r={5} fill="var(--bg)" stroke="var(--accent)" strokeWidth={1.8} />
  }

  if (kind === "atlas-pattern") {
    return (
      <g stroke="var(--muted)" strokeWidth={1.5}>
        <line x1={cx - 4} y1={cy} x2={cx + 4} y2={cy} />
        <line x1={cx} y1={cy - 4} x2={cx} y2={cy + 4} />
      </g>
    )
  }

  const stroke = "var(--steel)"
  if (entityType === "government") {
    return <rect x={cx - 4.5} y={cy - 4.5} width={9} height={9} fill={stroke} />
  }
  if (entityType === "leader") {
    return <path d={`M ${cx} ${cy - 5.5} L ${cx + 5} ${cy + 4} L ${cx - 5} ${cy + 4} Z`} fill="none" stroke={stroke} strokeWidth={1.5} />
  }
  if (entityType === "doctrine") {
    return <path d={`M ${cx} ${cy - 5.5} L ${cx + 5.5} ${cy} L ${cx} ${cy + 5.5} L ${cx - 5.5} ${cy} Z`} fill="none" stroke={stroke} strokeWidth={1.5} />
  }
  if (entityType === "institution") {
    return <path d={`M ${cx - 2.75} ${cy - 4.75} L ${cx + 2.75} ${cy - 4.75} L ${cx + 5.5} ${cy} L ${cx + 2.75} ${cy + 4.75} L ${cx - 2.75} ${cy + 4.75} L ${cx - 5.5} ${cy} Z`} fill="none" stroke={stroke} strokeWidth={1.5} />
  }
  return <rect x={cx - 4.5} y={cy - 4.5} width={9} height={9} fill="none" stroke={stroke} strokeWidth={1.5} />
}

export function FieldMapKey({
  kinds,
  copy,
}: {
  kinds: readonly ("baseline" | "perspective-run" | "atlas-pattern" | "reference")[]
  copy?: typeof zhHansWorldviewMapUi
}) {
  return (
    <dl className={styles.mapKey} aria-label={copy?.map.mapKey ?? "Map key"}>
      {kinds.includes("baseline") ? (
        <KeyRow label={copy?.key.myBaseline ?? "My baseline"}>
          <circle cx={8} cy={8} r={5} fill="var(--accent)" />
        </KeyRow>
      ) : null}
      {kinds.includes("perspective-run") ? (
        <KeyRow label={copy?.key.perspectiveShift ?? "My perspective shift"}>
          <circle cx={8} cy={8} r={5} fill="var(--bg)" stroke="var(--accent)" strokeWidth={1.8} />
        </KeyRow>
      ) : null}
      {kinds.includes("atlas-pattern") ? (
        <KeyRow label={copy?.key.worldviewProfile ?? "Worldview profile"}>
          <g stroke="var(--muted)" strokeWidth={1.5}>
            <line x1={3.5} y1={8} x2={12.5} y2={8} />
            <line x1={8} y1={3.5} x2={8} y2={12.5} />
          </g>
        </KeyRow>
      ) : null}
      {kinds.includes("reference") ? (
        <>
          <KeyRow label={copy?.key.thinker ?? "Thinker"}><rect x={3.5} y={3.5} width={9} height={9} fill="none" stroke="var(--steel)" strokeWidth={1.5} /></KeyRow>
          <KeyRow label={copy?.key.leader ?? "Leader"}><path d="M 8 2.5 L 13 12.5 L 3 12.5 Z" fill="none" stroke="var(--steel)" strokeWidth={1.5} /></KeyRow>
          <KeyRow label={copy?.key.government ?? "Government"}><rect x={3.5} y={3.5} width={9} height={9} fill="var(--steel)" /></KeyRow>
          <KeyRow label={copy?.key.doctrine ?? "Doctrine"}><path d="M 8 2.5 L 13.5 8 L 8 13.5 L 2.5 8 Z" fill="none" stroke="var(--steel)" strokeWidth={1.5} /></KeyRow>
          <KeyRow label={copy?.key.institution ?? "Institution"}><path d="M 5.25 3.25 L 10.75 3.25 L 13.5 8 L 10.75 12.75 L 5.25 12.75 L 2.5 8 Z" fill="none" stroke="var(--steel)" strokeWidth={1.5} /></KeyRow>
          <KeyRow label={copy?.key.movementSpan ?? "Movement span"}><polygon points="3,12 6,4 13,6 11,13" fill="var(--steel)" fillOpacity={0.08} stroke="var(--steel)" strokeWidth={1} strokeDasharray="3 3" /></KeyRow>
        </>
      ) : null}
    </dl>
  )
}

function KeyRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.keyRow}>
      <dt aria-hidden="true"><svg viewBox="0 0 16 16" className={styles.keyGlyph}>{children}</svg></dt>
      <dd>{label}</dd>
    </div>
  )
}
