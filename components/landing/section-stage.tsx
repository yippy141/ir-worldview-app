import {
  WORLD_STAGE_GRATICULE_ELLIPSES,
  WORLD_STAGE_GRATICULE_PATHS,
  WORLD_STAGE_LANDMASS_PATHS,
  WORLD_STAGE_MAP_HEIGHT,
  WORLD_STAGE_MAP_WIDTH,
  projectWorldStagePoint,
  worldStageRoutePath,
} from "@/lib/world-stage/fallback-geometry"
import {
  WORLD_STAGE_ISO3_COORDINATES,
  type WorldStageLngLat,
} from "@/lib/world-stage/map-config"
import type { SectionStageDefinition } from "@/lib/world-stage/section-stages"
import styles from "./section-stage.module.css"

type SectionStageProps = {
  stage: SectionStageDefinition
  /**
   * When set, only this group renders at full strength; the others recede.
   * Used by the Focus Areas theatres. Omit to show every group.
   */
  activeGroupId?: string
  /** Frame height in the crop. "band" is shallow, "panel" is taller. */
  variant?: "band" | "panel"
  className?: string
}

const FRAME_PADDING_X = 190
const FRAME_PADDING_Y = 130
const MIN_FRAME_WIDTH = 660

function coordinatesFor(iso3Key: string): WorldStageLngLat | null {
  if (!(iso3Key in WORLD_STAGE_ISO3_COORDINATES)) return null

  return WORLD_STAGE_ISO3_COORDINATES[
    iso3Key as keyof typeof WORLD_STAGE_ISO3_COORDINATES
  ]
}

/** Crop window framing every node in the stage, clamped to the map bounds. */
function stageFrame(stage: SectionStageDefinition, variant: "band" | "panel") {
  const points = stage.groups.flatMap((group) =>
    group.nodes
      .map((node) => coordinatesFor(node.iso3Key))
      .filter((point): point is WorldStageLngLat => point !== null)
      .map(projectWorldStagePoint),
  )

  if (points.length === 0) {
    return { x: 0, y: 0, width: WORLD_STAGE_MAP_WIDTH, height: WORLD_STAGE_MAP_HEIGHT }
  }

  const xs = points.map((point) => point.x)
  const ys = points.map((point) => point.y)
  const minX = Math.min(...xs) - FRAME_PADDING_X
  const maxX = Math.max(...xs) + FRAME_PADDING_X
  const minY = Math.min(...ys) - FRAME_PADDING_Y
  const maxY = Math.max(...ys) + FRAME_PADDING_Y

  let width = Math.max(maxX - minX, MIN_FRAME_WIDTH)
  const ratio = variant === "band" ? 0.42 : 0.62
  let height = Math.max(maxY - minY, width * ratio)
  width = Math.min(width, WORLD_STAGE_MAP_WIDTH)
  height = Math.min(height, WORLD_STAGE_MAP_HEIGHT)

  const x = Math.min(Math.max(minX, 0), WORLD_STAGE_MAP_WIDTH - width)
  const y = Math.min(Math.max((minY + maxY - height) / 2, 0), WORLD_STAGE_MAP_HEIGHT - height)

  return { x, y, width, height }
}

export function SectionStage({ stage, activeGroupId, variant = "band", className }: SectionStageProps) {
  const frame = stageFrame(stage, variant)

  return (
    <figure className={`${styles.stage} ${className ?? ""}`} data-variant={variant}>
      <svg
        className={styles.mapSvg}
        viewBox={`${frame.x.toFixed(0)} ${frame.y.toFixed(0)} ${frame.width.toFixed(0)} ${frame.height.toFixed(0)}`}
        preserveAspectRatio="xMidYMid slice"
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

        <g className={styles.landmass}>
          {WORLD_STAGE_LANDMASS_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        {stage.groups.map((group) => {
          const nodesById = new Map(group.nodes.map((node) => [node.id, node]))
          const isActive = activeGroupId === undefined || activeGroupId === group.id

          return (
            <g
              key={group.id}
              className={styles.group}
              data-tone={group.tone}
              data-active={isActive ? "true" : "false"}
            >
              <g className={styles.groupRoutes}>
                {group.routes.map((route, index) => {
                  const from = nodesById.get(route.fromNodeId)
                  const to = nodesById.get(route.toNodeId)
                  const fromCoordinates = from ? coordinatesFor(from.iso3Key) : null
                  const toCoordinates = to ? coordinatesFor(to.iso3Key) : null

                  if (!fromCoordinates || !toCoordinates) return null

                  return (
                    <path
                      key={route.id}
                      d={worldStageRoutePath(fromCoordinates, toCoordinates, index)}
                    />
                  )
                })}
              </g>

              <g>
                {group.nodes.map((node) => {
                  const coordinates = coordinatesFor(node.iso3Key)
                  if (!coordinates) return null
                  const point = projectWorldStagePoint(coordinates)

                  return (
                    <g key={node.id} transform={`translate(${point.x} ${point.y})`}>
                      <circle className={styles.nodeHalo} r="13" />
                      <circle className={styles.nodeCore} r="4.5" />
                    </g>
                  )
                })}
              </g>
            </g>
          )
        })}
      </svg>

      <figcaption className={styles.caption}>
        <span className={styles.lens}>
          <span className={styles.lensKicker}>Lens</span>
          {stage.lens}
        </span>
        <span className={styles.qualification}>{stage.qualification}</span>
        {/* Semantic parity for the aria-hidden map: name what the scene shows. */}
        <span className="sr-only">
          {stage.groups
            .map(
              (group) =>
                `${group.label}: ${group.nodes.map((node) => node.label).join(", ")}.`,
            )
            .join(" ")}
        </span>
      </figcaption>
    </figure>
  )
}
