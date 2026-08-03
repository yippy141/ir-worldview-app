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
  getWorldStageTooltipItems,
  type WorldStageMapFilters,
  type WorldStageMapPresentation,
} from "@/lib/world-stage/map-data"
import {
  WORLD_STAGE_FLOW_RELATION_COLORS,
  WORLD_STAGE_FLOW_WIDTHS,
  WORLD_STAGE_ROLE_COLORS,
  WORLD_STAGE_SEMICONDUCTOR_ROLE_COLORS,
} from "@/lib/world-stage/map-config"
import type {
  WorldStageScene,
  WorldStageTooltipItem,
} from "@/lib/world-stage/types"
import styles from "./world-stage.module.css"

export type WorldStageInspectionPosition = { x: number; y: number }

type WorldStageFallbackMapProps = {
  scene: WorldStageScene
  filters: WorldStageMapFilters
  zoom: number
  onInspect: (
    item: WorldStageTooltipItem,
    position: WorldStageInspectionPosition,
    pinned?: boolean,
  ) => void
  onClearInspection: () => void
  onInteraction: () => void
  presentation?: WorldStageMapPresentation
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
  filters,
  zoom,
  onInspect,
  onClearInspection,
  onInteraction,
  presentation,
}: WorldStageFallbackMapProps) {
  const countryRoles = new Map(scene.countryRoles.map((country) => [country.iso3, country]))
  const nodes = getWorldStageFallbackNodes(scene, filters)
  const nodeById = new Map(scene.nodes.map((node) => [node.id, node]))
  const flows = getWorldStageFallbackFlows(scene, filters)
  const tooltipById = new Map(
    getWorldStageTooltipItems(scene, presentation).map((item) => [
      `${item.kind}:${item.id}`,
      item,
    ]),
  )
  const cameraCenter = projectWorldStagePoint(scene.camera.center)
  const effectiveZoom = Math.max(1, scene.camera.zoom * zoom)
  const viewWidth = WORLD_STAGE_MAP_WIDTH / effectiveZoom
  const viewHeight = WORLD_STAGE_MAP_HEIGHT / effectiveZoom
  const viewX = Math.max(
    0,
    Math.min(WORLD_STAGE_MAP_WIDTH - viewWidth, cameraCenter.x - viewWidth / 2),
  )
  const viewY = Math.max(
    0,
    Math.min(WORLD_STAGE_MAP_HEIGHT - viewHeight, cameraCenter.y - viewHeight / 2),
  )

  return (
    <svg
      className={styles.mapSvg}
      viewBox={`${viewX.toFixed(1)} ${viewY.toFixed(1)} ${viewWidth.toFixed(
        1,
      )} ${viewHeight.toFixed(1)}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      onPointerDown={onInteraction}
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
          const item = assigned
            ? tooltipById.get(`country:${assigned.iso3}`) ?? null
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
                item ? (event) => onInspect(item, pointerPosition(event), true) : undefined
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
          const item = tooltipById.get(`flow:${flow.id}`)
          if (!item) return null
          const relationColor = flow.relation
            ? WORLD_STAGE_FLOW_RELATION_COLORS[flow.relation]
            : undefined

          return (
            <g key={flow.id}>
              <path
                d={d}
                className={styles.fallbackFlow}
                style={{
                  strokeWidth: WORLD_STAGE_FLOW_WIDTHS[flow.weight],
                  stroke: relationColor,
                }}
                data-flow-id={flow.id}
              />
              <path
                d={d}
                className={styles.fallbackFlowHitArea}
                onPointerEnter={(event) => onInspect(item, pointerPosition(event))}
                onPointerMove={(event) => onInspect(item, pointerPosition(event))}
                onPointerLeave={onClearInspection}
                onPointerDown={(event) => onInspect(item, pointerPosition(event), true)}
              />
            </g>
          )
        })}
      </g>

      <g className={styles.fallbackNodes}>
        {nodes.map((node) => {
          const point = projectWorldStagePoint(node.coordinates)
          const item = tooltipById.get(`node:${node.id}`)
          if (!item) return null
          const nodeColor = node.semiconductorRole
            ? WORLD_STAGE_SEMICONDUCTOR_ROLE_COLORS[node.semiconductorRole]
            : undefined

          return (
            <g
              key={node.id}
              transform={`translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`}
              className={styles.fallbackNode}
              data-node-id={node.id}
              data-node-kind={node.kind}
              style={{ "--world-stage-node-color": nodeColor } as CSSProperties}
              onPointerEnter={(event) => onInspect(item, pointerPosition(event))}
              onPointerMove={(event) => onInspect(item, pointerPosition(event))}
              onPointerLeave={onClearInspection}
              onPointerDown={(event) => onInspect(item, pointerPosition(event), true)}
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
