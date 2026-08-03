"use client"

import { useId, useMemo, useState, type CSSProperties, type ReactNode } from "react"
import type { FieldItemKind } from "@/lib/field/items"
import { zhHansWorldviewMapUi } from "@/content/locales/zh-Hans/worldview-map"
import {
  calculateFieldMarkerFanOffset,
  groupOverlappingMapItems,
  type MapPosition,
} from "@/lib/field/position"
import {
  MAP_ANCHOR_DOT_RADIUS,
  MAP_LABEL_MAX_WIDTH,
  MAP_CENTER,
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
} from "@/lib/results/map-layout"
import { AXIS_LABELS, TRADITION_ANCHORS } from "@/lib/results/position"
import type { ReferenceEntityType } from "@/lib/reference-profiles/types"
import { FAMILY_LABELS } from "@/lib/worldview-config"
import styles from "./worldview-map.module.css"

// The shared projection remains the Foundation-result geometry. Overlap groups
// change only transient display coordinates; every marker retains its canonical
// MapPosition for selection, URLs, connectors, and semantic-list parity.
const PLOT_LEFT = MAP_CENTER - MAP_PLOT_RADIUS
const PLOT_SIDE = MAP_PLOT_RADIUS * 2

// Rendered type sizes in CSS pixels; labels are HTML above the SVG.
const ANCHOR_LABEL_PX = 12
const AXIS_LABEL_PX = 11
const ANCHOR_TRACKING = 0.09
const AXIS_TRACKING = 0.05

/**
 * The fan offsets are authored against the original 100-unit half-extent.
 * Scaling here keeps the geometry helper and its tests untouched.
 */
const FAN_SCALE = MAP_PLOT_RADIUS / 100

/** Foreground glyph size for thinkers, public positions, and profiles. */
const MARKER_GLYPH_RADIUS = 5.5
const MARKER_HALO_RADIUS = 7.5
const MARKER_HIT_RADIUS = 20
const CLUSTER_HIT_RADIUS = 22

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
  return toMapPoint(position)
}

function targetId(kind: "marker" | "group", key: string) {
  return `${kind}:${key}`
}

function labelPlacement(cx: number, cy: number) {
  const edge = MAP_VIEW_SIZE * 0.18
  return {
    horizontal: cx < edge ? "left" : cx > MAP_VIEW_SIZE - edge ? "right" : "center",
    vertical: cy < MAP_VIEW_SIZE * 0.16 ? "below" : "above",
  }
}

function labelStyle(cx: number, cy: number): CSSProperties {
  return {
    left: `${toOverlayPercent(cx)}%`,
    top: `${toOverlayPercent(cy)}%`,
  }
}

function overlayStyle(box: MapLabelBox, centerX: number): CSSProperties {
  return {
    left: `${toOverlayPercent(centerX)}%`,
    top: `${toOverlayPercent(box.y)}%`,
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
  const [hoveredGroupKey, setHoveredGroupKey] = useState<string | null>(null)
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
        (expandedGroupKey === group.key ||
          hoveredGroupKey === group.key ||
          selectedMember)

      if (group.items.length > 1 && !expanded) return []

      return group.items.map((marker, index) => {
        const offset = expanded
          ? calculateFieldMarkerFanOffset(index, group.items.length)
          : { x: 0, y: 0 }
        const canonical = toSvg(marker.position)
        return {
          marker,
          cx: expanded ? anchor.cx + offset.x * FAN_SCALE : canonical.cx,
          cy: expanded ? anchor.cy + offset.y * FAN_SCALE : canonical.cy,
          groupKey: group.key,
          fanned: expanded,
        }
      })
    })
  }, [expandedGroupKey, hoveredGroupKey, overlapGroups])

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

  const axisLabels = useMemo(
    () =>
      resolveAxisLabelPlacements(
        {
          top: copy?.axes.top ?? AXIS_LABELS.top,
          bottom: copy?.axes.bottom ?? AXIS_LABELS.bottom,
          left: copy?.axes.left ?? AXIS_LABELS.left,
          right: copy?.axes.right ?? AXIS_LABELS.right,
        },
        AXIS_LABEL_PX,
        AXIS_TRACKING,
      ),
    [copy],
  )

  // Tradition labels give way to the axis labels and to every plotted mark, so
  // the recessive background layer never sits on top of the data.
  const anchorLabels = useMemo(() => {
    if (!showAnchors) return []
    const anchorPoints = TRADITION_ANCHORS.map((anchor) => ({
      anchor,
      point: toSvg(anchor.position),
    }))

    return resolveMapLabelPlacements(
      anchorPoints.map(({ anchor, point }) => ({
        key: anchor.key,
        point,
        text: copy?.familyAnchors[anchor.key] ?? FAMILY_LABELS[anchor.key],
        fontSize: ANCHOR_LABEL_PX,
        tracking: ANCHOR_TRACKING,
        maxWidth: MAP_LABEL_MAX_WIDTH,
        clearance: MAP_ANCHOR_DOT_RADIUS + 3,
      })),
      {
        obstacles: [
          ...axisLabels.map((label) => label.box),
          ...anchorPoints.map(({ point }) =>
            markObstacleBox(point, MAP_ANCHOR_DOT_RADIUS + 3),
          ),
          ...markers.map((marker) =>
            markObstacleBox(toSvg(marker.position), MARKER_HALO_RADIUS + 2),
          ),
        ],
      },
    ).map((placement, index) => ({
      placement,
      anchor: anchorPoints[index].anchor,
    }))
  }, [axisLabels, copy, markers, showAnchors])

  function clearHover() {
    setHoveredTargetId(null)
    setHoveredGroupKey(null)
  }

  // A hover-expanded cluster stays open while the pointer is anywhere on the
  // plot, so the pointer can travel out to a fanned member without the group
  // collapsing under it. Leaving the plot closes it.
  return (
    <figure className={`${styles.canvas} field-canvas`}>
      <div className={styles.plot} onPointerLeave={clearHover}>
        <svg
          viewBox={`0 0 ${MAP_VIEW_SIZE} ${MAP_VIEW_SIZE}`}
          role={interactive ? "group" : "img"}
          aria-label={ariaLabel}
          className={styles.canvasSvg}
        >
          <rect
            x={PLOT_LEFT}
            y={PLOT_LEFT}
            width={PLOT_SIDE}
            height={PLOT_SIDE}
            className={styles.plotFrame}
          />
          <line
            x1={PLOT_LEFT}
            y1={MAP_CENTER}
            x2={PLOT_LEFT + PLOT_SIDE}
            y2={MAP_CENTER}
            className={styles.guideLine}
          />
          <line
            x1={MAP_CENTER}
            y1={PLOT_LEFT}
            x2={MAP_CENTER}
            y2={PLOT_LEFT + PLOT_SIDE}
            className={styles.guideLine}
          />

          {showAnchors
            ? TRADITION_ANCHORS.map((anchor) => {
                const { cx, cy } = toSvg(anchor.position)
                return (
                  <circle
                    key={anchor.key}
                    className={styles.traditionAnchor}
                    cx={cx}
                    cy={cy}
                    r={MAP_ANCHOR_DOT_RADIUS}
                    fill={`var(${anchor.colorVar})`}
                    aria-hidden="true"
                  />
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
                  strokeDasharray="5 5"
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
                hoveredGroupKey === group.key ||
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
                  onPointerEnter={() => {
                    setHoveredTargetId(id)
                    setHoveredGroupKey(group.key)
                  }}
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
                  <circle className={styles.clusterHit} cx={anchor.cx} cy={anchor.cy} r={CLUSTER_HIT_RADIUS} />
                  <ClusterGlyph cx={anchor.cx} cy={anchor.cy} />
                </a>
              )
            })}

          {renderedMarkers.map(({ marker, cx, cy, groupKey }) => {
            const id = targetId("marker", marker.key)
            const describedBy = tooltipTarget?.targetId === id ? tooltipId : undefined
            const content = (
              <>
                <circle
                  className={styles.markerHit}
                  cx={cx}
                  cy={cy}
                  r={MARKER_HIT_RADIUS}
                  aria-hidden="true"
                />
                {marker.selected ? (
                  <circle className={styles.selectionRing} cx={cx} cy={cy} r={12} />
                ) : null}
                <MarkerGlyph kind={marker.kind} entityType={marker.entityType} cx={cx} cy={cy} />
              </>
            )

            if (!interactive) {
              // Non-interactive maps still name their marks on hover.
              return (
                <g
                  key={marker.key}
                  className={styles.markerStatic}
                  onPointerEnter={() => setHoveredTargetId(id)}
                  onPointerLeave={() => setHoveredTargetId(null)}
                >
                  {content}
                </g>
              )
            }

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
                onPointerEnter={() => {
                  setHoveredTargetId(id)
                  const size =
                    overlapGroups.find((group) => group.key === groupKey)?.items.length ?? 0
                  setHoveredGroupKey(size > 1 ? groupKey : null)
                }}
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

        <div className={styles.mapOverlay} aria-hidden="true">
          {axisLabels.map((label) => (
            <span
              key={label.edge}
              className={styles.axisLabel}
              data-edge={label.edge}
              style={overlayStyle(label.box, label.centerX)}
            >
              {label.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          ))}

          {anchorLabels.map(({ placement, anchor }) => (
            <span
              key={anchor.key}
              className={styles.anchorLabel}
              style={{
                ...overlayStyle(placement.box, placement.centerX),
                color: `var(${anchor.colorVar})`,
              }}
            >
              {placement.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          ))}
        </div>

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

        {tooltipTarget ? (
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

/**
 * An overlap cluster reads as several marks stacked, not as a data value.
 * The count stays in the accessible name; the glyph carries no number so it is
 * never mistaken for a magnitude on the plot.
 */
function ClusterGlyph({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g className={styles.clusterGlyph}>
      <circle className={styles.clusterHalo} cx={cx} cy={cy} r={9.5} />
      <circle className={styles.clusterEdge} cx={cx - 2.8} cy={cy - 2} r={4.2} />
      <circle className={styles.clusterEdge} cx={cx + 2.8} cy={cy - 2} r={4.2} />
      <circle className={styles.clusterEdge} cx={cx} cy={cy + 2.8} r={4.2} />
    </g>
  )
}

/**
 * Marks that carry data sit in the foreground: each gets a halo disc so it
 * reads above the gridlines and the recessive tradition anchors, which are
 * plain 5px dots in tradition colour. Thinkers and public positions keep the
 * steel hue and an outlined entity shape; authored worldview profiles are the
 * muted cross; the reader's own marks are the only filled accent marks.
 */
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
        <circle
          cx={cx}
          cy={cy}
          r={MAP_RESPONDENT_RING_RADIUS}
          className={styles.baselineRing}
        />
        <circle cx={cx} cy={cy} r={MAP_RESPONDENT_DOT_RADIUS} className={styles.baselineDot} />
      </g>
    )
  }

  if (kind === "perspective-run") {
    return (
      <g>
        <circle className={styles.markerHalo} cx={cx} cy={cy} r={MARKER_HALO_RADIUS} />
        <circle cx={cx} cy={cy} r={MAP_RESPONDENT_DOT_RADIUS} className={styles.runDot} />
      </g>
    )
  }

  const r = MARKER_GLYPH_RADIUS

  if (kind === "atlas-pattern") {
    return (
      <g>
        <circle className={styles.markerHalo} cx={cx} cy={cy} r={MARKER_HALO_RADIUS} />
        <g className={styles.patternGlyph}>
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} />
          <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} />
        </g>
      </g>
    )
  }

  const shape =
    entityType === "government" ? (
      <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} className={styles.referenceFilled} />
    ) : entityType === "leader" ? (
      <path
        d={`M ${cx} ${cy - r * 1.15} L ${cx + r * 1.05} ${cy + r * 0.8} L ${cx - r * 1.05} ${cy + r * 0.8} Z`}
        className={styles.referenceGlyph}
      />
    ) : entityType === "doctrine" ? (
      <path
        d={`M ${cx} ${cy - r * 1.15} L ${cx + r * 1.15} ${cy} L ${cx} ${cy + r * 1.15} L ${cx - r * 1.15} ${cy} Z`}
        className={styles.referenceGlyph}
      />
    ) : entityType === "institution" ? (
      <path
        d={`M ${cx - r * 0.6} ${cy - r} L ${cx + r * 0.6} ${cy - r} L ${cx + r * 1.15} ${cy} L ${cx + r * 0.6} ${cy + r} L ${cx - r * 0.6} ${cy + r} L ${cx - r * 1.15} ${cy} Z`}
        className={styles.referenceGlyph}
      />
    ) : (
      <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} className={styles.referenceGlyph} />
    )

  return (
    <g>
      <circle className={styles.markerHalo} cx={cx} cy={cy} r={MARKER_HALO_RADIUS} />
      {shape}
    </g>
  )
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
          <circle cx={8} cy={8} r={6} fill="var(--panel)" stroke="var(--accent)" strokeWidth={1.5} />
          <circle cx={8} cy={8} r={3.5} fill="var(--accent)" />
        </KeyRow>
      ) : null}
      {kinds.includes("perspective-run") ? (
        <KeyRow label={copy?.key.perspectiveShift ?? "My perspective shift"}>
          <circle cx={8} cy={8} r={5} fill="var(--bg)" stroke="var(--accent)" strokeWidth={1.8} />
        </KeyRow>
      ) : null}
      {kinds.includes("atlas-pattern") ? (
        <KeyRow label={copy?.key.worldviewProfile ?? "Worldview profile"}>
          <g stroke="var(--text-2)" strokeWidth={1.6}>
            <line x1={3} y1={8} x2={13} y2={8} />
            <line x1={8} y1={3} x2={8} y2={13} />
          </g>
        </KeyRow>
      ) : null}
      {kinds.includes("reference") ? (
        <>
          <KeyRow label={copy?.key.thinker ?? "Thinker"}><rect x={3.5} y={3.5} width={9} height={9} fill="none" stroke="var(--steel)" strokeWidth={1.6} /></KeyRow>
          <KeyRow label={copy?.key.leader ?? "Leader"}><path d="M 8 2.5 L 13 12.5 L 3 12.5 Z" fill="none" stroke="var(--steel)" strokeWidth={1.6} /></KeyRow>
          <KeyRow label={copy?.key.government ?? "Government"}><rect x={3.5} y={3.5} width={9} height={9} fill="var(--steel)" /></KeyRow>
          <KeyRow label={copy?.key.doctrine ?? "Doctrine"}><path d="M 8 2.5 L 13.5 8 L 8 13.5 L 2.5 8 Z" fill="none" stroke="var(--steel)" strokeWidth={1.6} /></KeyRow>
          <KeyRow label={copy?.key.institution ?? "Institution"}><path d="M 5.25 3.25 L 10.75 3.25 L 13.5 8 L 10.75 12.75 L 5.25 12.75 L 2.5 8 Z" fill="none" stroke="var(--steel)" strokeWidth={1.6} /></KeyRow>
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
