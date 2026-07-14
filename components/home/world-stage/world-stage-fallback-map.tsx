import type { CSSProperties, PointerEvent } from "react"
import {
  WORLD_STAGE_COUNTRY_PATHS,
  WORLD_STAGE_GRATICULE_ELLIPSES,
  WORLD_STAGE_GRATICULE_PATHS,
  WORLD_STAGE_MAP_HEIGHT,
  WORLD_STAGE_MAP_WIDTH,
  projectWorldStagePoint,
  worldStageRoutePath,
} from "@/lib/world-stage/fallback-geometry"
import {
  getWorldStageFallbackFlows,
  getWorldStageFallbackNodes,
  getWorldStageRoleLabel,
} from "@/lib/world-stage/map-data"
import {
  WORLD_STAGE_FLOW_WIDTHS,
  WORLD_STAGE_ROLE_COLORS,
} from "@/lib/world-stage/map-config"
import type {
  WorldStageScene,
  WorldStageTooltipItem,
} from "@/lib/world-stage/types"
import styles from "./world-stage.module.css"

export type WorldStageInspectionPosition = { x: number; y: number }

type WorldStageFallbackMapProps = {
  scene: WorldStageScene
  onInspect: (item: WorldStageTooltipItem, position: WorldStageInspectionPosition) => void
  onClearInspection: () => void
}

function pointerPosition(event: PointerEvent<SVGElement>): WorldStageInspectionPosition {
  const svg = event.currentTarget.ownerSVGElement
  if (!svg) return { x: 0, y: 0 }
  const bounds = svg.getBoundingClientRect()

  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  }
}

export function WorldStageFallbackMap({
  scene,
  onInspect,
  onClearInspection,
}: WorldStageFallbackMapProps) {
  const countryRoles = new Map(scene.countryRoles.map((country) => [country.iso3, country]))
  const nodes = getWorldStageFallbackNodes(scene)
  const nodeById = new Map(scene.nodes.map((node) => [node.id, node]))
  const flows = getWorldStageFallbackFlows(scene)

  return (
    <svg
      className={styles.mapSvg}
      viewBox={`0 0 ${WORLD_STAGE_MAP_WIDTH} ${WORLD_STAGE_MAP_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g className={styles.graticule}>
        {WORLD_STAGE_GRATICULE_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
        {WORLD_STAGE_GRATICULE_ELLIPSES.map((ellipse) => (
          <ellipse key={`${ellipse.rx}-${ellipse.ry}`} {...ellipse} />
        ))}
      </g>

      <g className={styles.fallbackCountries}>
        {WORLD_STAGE_COUNTRY_PATHS.map((country) => {
          const assigned = countryRoles.get(country.iso3)
          const role = assigned?.role ?? "neutral"
          const item: WorldStageTooltipItem | null = assigned
            ? {
                id: assigned.iso3,
                kind: "country",
                label: `${country.name} · ${getWorldStageRoleLabel(assigned.role)}`,
                meaning: assigned.rationale,
                asOf: scene.asOf,
                sourceCount: assigned.sourceRefs.length,
              }
            : null
          const roleStyle = {
            "--world-stage-country-fill": WORLD_STAGE_ROLE_COLORS[role],
          } as CSSProperties

          return (
            <path
              key={country.iso3}
              d={country.d}
              data-iso3={country.iso3}
              data-role={role}
              className={`${styles.fallbackCountry} ${
                assigned ? styles.fallbackCountryAssigned : ""
              } ${role === "contested" ? styles.fallbackCountryContested : ""}`}
              style={roleStyle}
              onPointerEnter={
                item ? (event) => onInspect(item, pointerPosition(event)) : undefined
              }
              onPointerMove={
                item ? (event) => onInspect(item, pointerPosition(event)) : undefined
              }
              onPointerLeave={item ? onClearInspection : undefined}
              onPointerDown={
                item ? (event) => onInspect(item, pointerPosition(event)) : undefined
              }
            />
          )
        })}
      </g>

      <g className={styles.fallbackFlows}>
        {flows.map((flow, index) => {
          const from = nodeById.get(flow.fromNodeId)
          const to = nodeById.get(flow.toNodeId)
          if (!from || !to) return null
          const d = worldStageRoutePath(from.coordinates, to.coordinates, index)
          const item: WorldStageTooltipItem = {
            id: flow.id,
            kind: "flow",
            label: flow.label,
            meaning: flow.meaning,
            asOf: flow.asOf,
            sourceCount: flow.sourceRefs.length,
          }

          return (
            <g key={flow.id}>
              <path
                d={d}
                className={styles.fallbackFlow}
                style={{ strokeWidth: WORLD_STAGE_FLOW_WIDTHS[flow.weight] }}
                data-flow-id={flow.id}
              />
              <path
                d={d}
                className={styles.fallbackFlowHitArea}
                onPointerEnter={(event) => onInspect(item, pointerPosition(event))}
                onPointerMove={(event) => onInspect(item, pointerPosition(event))}
                onPointerLeave={onClearInspection}
                onPointerDown={(event) => onInspect(item, pointerPosition(event))}
              />
            </g>
          )
        })}
      </g>

      <g className={styles.fallbackNodes}>
        {nodes.map((node) => {
          const point = projectWorldStagePoint(node.coordinates)
          const item: WorldStageTooltipItem = {
            id: node.id,
            kind: "node",
            label: node.label,
            meaning: node.whyItMatters,
            asOf: scene.asOf,
            sourceCount: node.sourceRefs.length,
          }

          return (
            <g
              key={node.id}
              transform={`translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`}
              className={styles.fallbackNode}
              data-node-kind={node.kind}
              onPointerEnter={(event) => onInspect(item, pointerPosition(event))}
              onPointerMove={(event) => onInspect(item, pointerPosition(event))}
              onPointerLeave={onClearInspection}
              onPointerDown={(event) => onInspect(item, pointerPosition(event))}
            >
              <circle className={styles.fallbackNodeHalo} r="8" />
              <circle className={styles.fallbackNodeCore} r="3.2" />
            </g>
          )
        })}
      </g>
    </svg>
  )
}
