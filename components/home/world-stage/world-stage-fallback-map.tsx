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
import { worldStageScenes } from "@/lib/world-stage/scenes"
import type { WorldStageSceneId } from "@/lib/world-stage/types"
import styles from "./world-stage.module.css"

type WorldStageFallbackMapProps = {
  activeScene: WorldStageSceneId
}

function coordinatesFor(iso3Key: string): WorldStageLngLat | null {
  if (!(iso3Key in WORLD_STAGE_ISO3_COORDINATES)) return null

  return WORLD_STAGE_ISO3_COORDINATES[
    iso3Key as keyof typeof WORLD_STAGE_ISO3_COORDINATES
  ]
}

export function WorldStageFallbackMap({ activeScene }: WorldStageFallbackMapProps) {
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

      <g className={styles.landmass}>
        {WORLD_STAGE_LANDMASS_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {worldStageScenes.map((scene) => {
        const nodes = new Map(scene.nodes.map((node) => [node.id, node]))

        return (
          <g
            key={scene.id}
            className={`${styles.scene} ${
              activeScene === scene.id ? styles.sceneActive : ""
            }`}
            data-scene={scene.id}
          >
            <g className={styles.sceneRoutes}>
              {scene.routes.map((route, index) => {
                const from = nodes.get(route.fromNodeId)
                const to = nodes.get(route.toNodeId)
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

            <g className={styles.sceneNodes}>
              {scene.nodes.map((node) => {
                const coordinates = coordinatesFor(node.iso3Key)
                if (!coordinates) return null
                const point = projectWorldStagePoint(coordinates)

                return (
                  <g key={node.id} transform={`translate(${point.x} ${point.y})`}>
                    <circle className={styles.nodeHalo} r="14" />
                    <circle className={styles.nodeCore} r="5" />
                  </g>
                )
              })}
            </g>
          </g>
        )
      })}
    </svg>
  )
}
