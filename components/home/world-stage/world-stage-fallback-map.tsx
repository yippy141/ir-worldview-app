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

const MAP_WIDTH = 1200
const MAP_HEIGHT = 620

function coordinatesFor(iso3Key: string): WorldStageLngLat | null {
  if (!(iso3Key in WORLD_STAGE_ISO3_COORDINATES)) return null

  return WORLD_STAGE_ISO3_COORDINATES[
    iso3Key as keyof typeof WORLD_STAGE_ISO3_COORDINATES
  ]
}

function project([longitude, latitude]: WorldStageLngLat) {
  return {
    x: 50 + ((longitude + 180) / 360) * (MAP_WIDTH - 100),
    y: 44 + ((90 - latitude) / 180) * (MAP_HEIGHT - 88),
  }
}

function routePath(from: WorldStageLngLat, to: WorldStageLngLat, index: number) {
  const start = project(from)
  const end = project(to)
  const distance = Math.abs(end.x - start.x)
  const lift = Math.min(76, 30 + distance * 0.08) * (index % 2 === 0 ? 1 : -1)

  return `M${start.x.toFixed(1)} ${start.y.toFixed(1)} Q${(
    (start.x + end.x) /
    2
  ).toFixed(1)} ${((start.y + end.y) / 2 - lift).toFixed(1)} ${end.x.toFixed(
    1,
  )} ${end.y.toFixed(1)}`
}

export function WorldStageFallbackMap({ activeScene }: WorldStageFallbackMapProps) {
  return (
    <svg
      className={styles.mapSvg}
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g className={styles.graticule}>
        <path d="M55 155H1145M35 310H1165M55 465H1145" />
        <path d="M205 45V575M400 24V596M600 14V606M800 24V596M995 45V575" />
        <ellipse cx="600" cy="310" rx="565" ry="274" />
        <ellipse cx="600" cy="310" rx="565" ry="160" />
      </g>

      <g className={styles.landmass}>
        <path d="M105 162l44-52 63-31 87-3 46 29 47 8 30 35-28 31-46-7-21 31-43 1-18 38-42 13-31-31-63-6-42-26z" />
        <path d="M281 255l52 17 28 46-5 69-26 77-36 75-30-25 2-65-25-47 14-49-28-54 31-14z" />
        <path d="M451 119l57-39 71 8 45 26 71-10 46 27 75-16 75 23 45 42-33 35-60 3-29 33-54 7-25-21-43 18-31-21-55 11-34-30-56-8-35-39-48-8z" />
        <path d="M527 247l67-14 63 31 21 63-25 58-24 91-45 31-31-55-17-62-36-50 6-59z" />
        <path d="M749 259l43-14 43 22 11 35-39 16-28-23-31-3z" />
        <path d="M888 392l59-30 55 20 36 46-24 42-68 6-53-37z" />
        <path d="M304 77l34-45 57 13 20 43-49 29-45-10z" />
        <path d="M1032 298l26-11 23 15-20 20z" />
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
                    d={routePath(fromCoordinates, toCoordinates, index)}
                  />
                )
              })}
            </g>

            <g className={styles.sceneNodes}>
              {scene.nodes.map((node) => {
                const coordinates = coordinatesFor(node.iso3Key)
                if (!coordinates) return null
                const point = project(coordinates)

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
