"use client"

import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useRef, useState } from "react"
import {
  WORLD_STAGE_CAMERAS,
  WORLD_STAGE_ISO3_COORDINATES,
  WORLD_STAGE_MAPBOX_STYLE,
  WORLD_STAGE_MAPBOX_TOKEN,
  WORLD_STAGE_SCENE_COLORS,
  WORLD_STAGE_TRANSITION_MS,
  type WorldStageLngLat,
} from "@/lib/world-stage/map-config"
import { worldStageScenes } from "@/lib/world-stage/scenes"
import type { WorldStageMenuItem, WorldStageScene } from "@/lib/world-stage/types"
import { WorldStageFallbackMap } from "./world-stage-fallback-map"
import styles from "./world-stage.module.css"

type MapboxModule = typeof import("mapbox-gl")
type MapboxMap = import("mapbox-gl").Map
type MapboxGeoJsonSource = import("mapbox-gl").GeoJSONSource
type MapboxGeoJsonData = Exclude<
  import("mapbox-gl").GeoJSONSourceSpecification["data"],
  string | undefined
>

type WorldStageMapProps = {
  activeItem: WorldStageMenuItem
  idlePaused: boolean
  reducedMotion: boolean
  onDirectInteraction: () => void
}

type SceneMapData = {
  nodes: MapboxGeoJsonData
  routes: MapboxGeoJsonData
}

type MapDiagnosticState =
  | "live-map"
  | "missing-token"
  | "reduced-motion-static"
  | "no-webgl"
  | "load-error"

const LAYER_SLOTS = ["a", "b"] as const
type LayerSlot = (typeof LAYER_SLOTS)[number]

function hasWebGlSupport() {
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}

function coordinatesFor(iso3Key: string): WorldStageLngLat | null {
  if (!(iso3Key in WORLD_STAGE_ISO3_COORDINATES)) return null

  return WORLD_STAGE_ISO3_COORDINATES[
    iso3Key as keyof typeof WORLD_STAGE_ISO3_COORDINATES
  ]
}

function routeCoordinates(from: WorldStageLngLat, to: WorldStageLngLat) {
  let longitudeDelta = to[0] - from[0]
  if (longitudeDelta > 180) longitudeDelta -= 360
  if (longitudeDelta < -180) longitudeDelta += 360

  return Array.from({ length: 25 }, (_, index) => {
    const progress = index / 24
    const latitudeLift = Math.sin(Math.PI * progress) * 9

    return [
      from[0] + longitudeDelta * progress,
      from[1] + (to[1] - from[1]) * progress + latitudeLift,
    ]
  })
}

function createSceneMapData(scene: WorldStageScene): SceneMapData {
  const nodeById = new Map(scene.nodes.map((node) => [node.id, node]))

  return {
    nodes: {
      type: "FeatureCollection",
      features: scene.nodes.flatMap((node) => {
        const coordinates = coordinatesFor(node.iso3Key)
        if (!coordinates) return []

        return [
          {
            type: "Feature" as const,
            properties: { id: node.id, label: node.label, sceneId: scene.id },
            geometry: {
              type: "Point" as const,
              coordinates: [...coordinates],
            },
          },
        ]
      }),
    },
    routes: {
      type: "FeatureCollection",
      features: scene.routes.flatMap((route) => {
        const fromNode = nodeById.get(route.fromNodeId)
        const toNode = nodeById.get(route.toNodeId)
        const from = fromNode ? coordinatesFor(fromNode.iso3Key) : null
        const to = toNode ? coordinatesFor(toNode.iso3Key) : null

        if (!from || !to) return []

        return [
          {
            type: "Feature" as const,
            properties: { id: route.id, label: route.label, sceneId: scene.id },
            geometry: {
              type: "LineString" as const,
              coordinates: routeCoordinates(from, to),
            },
          },
        ]
      }),
    },
  }
}

function sourceId(kind: "nodes" | "routes", slot: LayerSlot) {
  return `world-stage-${kind}-${slot}`
}

function layerId(kind: "nodes" | "routes", slot: LayerSlot) {
  return `world-stage-${kind}-layer-${slot}`
}

function emptyGeoJson(): MapboxGeoJsonData {
  return { type: "FeatureCollection", features: [] }
}

function addSceneLayers(map: MapboxMap, transitionDuration: number) {
  const firstLabelLayer = map.getStyle().layers?.find((layer) => layer.type === "symbol")?.id

  for (const slot of LAYER_SLOTS) {
    map.addSource(sourceId("routes", slot), {
      type: "geojson",
      data: emptyGeoJson(),
      lineMetrics: true,
    })
    map.addSource(sourceId("nodes", slot), {
      type: "geojson",
      data: emptyGeoJson(),
    })

    map.addLayer(
      {
        id: layerId("routes", slot),
        type: "line",
        source: sourceId("routes", slot),
        paint: {
          "line-color": WORLD_STAGE_SCENE_COLORS.foundation,
          "line-opacity": 0,
          "line-width": ["interpolate", ["linear"], ["zoom"], 0, 1, 4, 2.2],
          "line-dasharray": [2, 2.4],
          "line-opacity-transition": {
            duration: transitionDuration,
            delay: 0,
          },
        },
      },
      firstLabelLayer,
    )

    map.addLayer(
      {
        id: layerId("nodes", slot),
        type: "circle",
        source: sourceId("nodes", slot),
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 0, 3.5, 4, 6],
          "circle-color": WORLD_STAGE_SCENE_COLORS.foundation,
          "circle-opacity": 0,
          "circle-stroke-color": "#07111f",
          "circle-stroke-width": 2,
          "circle-stroke-opacity": 0,
          "circle-opacity-transition": {
            duration: transitionDuration,
            delay: 0,
          },
          "circle-stroke-opacity-transition": {
            duration: transitionDuration,
            delay: 0,
          },
        },
      },
      firstLabelLayer,
    )
  }
}

function updateSceneLayers(
  map: MapboxMap,
  item: WorldStageMenuItem,
  currentSlot: LayerSlot,
) {
  const nextSlot: LayerSlot = currentSlot === "a" ? "b" : "a"
  const scene = worldStageScenes.find((candidate) => candidate.id === item.sceneId)
  if (!scene) return currentSlot

  const data = createSceneMapData(scene)
  const color = WORLD_STAGE_SCENE_COLORS[scene.id]
  const routeSource = map.getSource(sourceId("routes", nextSlot)) as
    | MapboxGeoJsonSource
    | undefined
  const nodeSource = map.getSource(sourceId("nodes", nextSlot)) as
    | MapboxGeoJsonSource
    | undefined

  routeSource?.setData(data.routes)
  nodeSource?.setData(data.nodes)

  map.setPaintProperty(layerId("routes", nextSlot), "line-color", color)
  map.setPaintProperty(layerId("nodes", nextSlot), "circle-color", color)
  map.setPaintProperty(layerId("routes", currentSlot), "line-opacity", 0)
  map.setPaintProperty(layerId("nodes", currentSlot), "circle-opacity", 0)
  map.setPaintProperty(layerId("nodes", currentSlot), "circle-stroke-opacity", 0)
  map.setPaintProperty(layerId("routes", nextSlot), "line-opacity", 0.76)
  map.setPaintProperty(layerId("nodes", nextSlot), "circle-opacity", 0.96)
  map.setPaintProperty(layerId("nodes", nextSlot), "circle-stroke-opacity", 0.9)

  return nextSlot
}

function cameraFor(item: WorldStageMenuItem) {
  const camera = WORLD_STAGE_CAMERAS[item.id]
  const mobile = window.matchMedia("(max-width: 640px)").matches

  return {
    center: [...camera.center] as [number, number],
    zoom: camera.zoom - (mobile ? 0.42 : 0),
    pitch: mobile ? 0 : camera.pitch,
    bearing: camera.bearing,
  }
}

export function WorldStageMap({
  activeItem,
  idlePaused,
  reducedMotion,
  onDirectInteraction,
}: WorldStageMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const activeItemRef = useRef(activeItem)
  const onDirectInteractionRef = useRef(onDirectInteraction)
  const currentSlotRef = useRef<LayerSlot>("a")
  const renderedItemIdRef = useRef<WorldStageMenuItem["id"] | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [showDiagnostic, setShowDiagnostic] = useState(false)
  const [diagnostic, setDiagnostic] = useState<MapDiagnosticState>("live-map")

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return
    setShowDiagnostic(new URLSearchParams(window.location.search).get("mapDebug") === "1")
  }, [])

  useEffect(() => {
    activeItemRef.current = activeItem
  }, [activeItem])

  useEffect(() => {
    onDirectInteractionRef.current = onDirectInteraction
  }, [onDirectInteraction])

  useEffect(() => {
    if (idlePaused) mapRef.current?.stop()
  }, [idlePaused])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.loaded() || renderedItemIdRef.current === activeItem.id) return

    map.stop()
    if (!reducedMotion) {
      map.easeTo({
        ...cameraFor(activeItem),
        duration: WORLD_STAGE_TRANSITION_MS,
        easing: (progress) => 1 - Math.pow(1 - progress, 4),
        essential: false,
      })
    }
    currentSlotRef.current = updateSceneLayers(map, activeItem, currentSlotRef.current)
    renderedItemIdRef.current = activeItem.id
  }, [activeItem, reducedMotion])

  useEffect(() => {
    const container = mapContainerRef.current
    setMapReady(false)

    if (!container) return
    if (!WORLD_STAGE_MAPBOX_TOKEN) {
      setDiagnostic("missing-token")
      return
    }
    if (!hasWebGlSupport()) {
      setDiagnostic("no-webgl")
      return
    }

    setDiagnostic(reducedMotion ? "reduced-motion-static" : "live-map")

    const mapHost = container
    let cancelled = false
    let map: MapboxMap | null = null
    let canvas: HTMLCanvasElement | null = null
    let loaded = false

    function markDirectInteraction() {
      map?.stop()
      onDirectInteractionRef.current()
    }

    function cleanupMap() {
      if (canvas) canvas.removeEventListener("webglcontextlost", handleContextLost)
      mapHost.removeEventListener("pointerdown", markDirectInteraction, true)
      mapHost.removeEventListener("wheel", markDirectInteraction, true)
      mapRef.current = null

      if (map) {
        try {
          map.off("error", handleMapError)
          map.stop()
          map.remove()
        } catch {
          // The WebGL context may already be gone. The SVG is still present.
        }
      }
      map = null
    }

    function handleContextLost(event: Event) {
      event.preventDefault()
      setDiagnostic("load-error")
      setMapReady(false)
      cleanupMap()
    }

    function handleMapError() {
      if (cancelled || loaded) return
      setDiagnostic("load-error")
      setMapReady(false)
      cleanupMap()
    }

    void import("mapbox-gl")
      .then((module: MapboxModule) => {
        if (cancelled || !mapContainerRef.current) return

        const mapboxgl = module.default
        mapboxgl.accessToken = WORLD_STAGE_MAPBOX_TOKEN
        const initialCamera = cameraFor(activeItemRef.current)
        const mobile = window.matchMedia("(max-width: 640px)").matches

        try {
          map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: WORLD_STAGE_MAPBOX_STYLE,
            ...initialCamera,
            projection: "globe",
            attributionControl: false,
            interactive: !reducedMotion,
            keyboard: false,
            boxZoom: false,
            doubleClickZoom: false,
            dragRotate: false,
            pitchWithRotate: false,
            touchPitch: false,
            scrollZoom: !mobile && !reducedMotion,
            touchZoomRotate: !reducedMotion,
            cooperativeGestures: false,
            fadeDuration: reducedMotion ? 0 : WORLD_STAGE_TRANSITION_MS,
          })
        } catch {
          setDiagnostic("load-error")
          return
        }

        mapRef.current = map
        canvas = map.getCanvas()
        canvas.tabIndex = -1
        canvas.setAttribute("aria-hidden", "true")
        canvas.addEventListener("webglcontextlost", handleContextLost)
        map.on("error", handleMapError)
        if (!reducedMotion) {
          mapHost.addEventListener("pointerdown", markDirectInteraction, {
            capture: true,
            passive: true,
          })
          mapHost.addEventListener("wheel", markDirectInteraction, {
            capture: true,
            passive: true,
          })
        }

        map.once("load", () => {
          if (cancelled || !map) return

          try {
            loaded = true
            map.setFog({
              color: "#0a1728",
              "high-color": "#182d47",
              "space-color": "#050c16",
              "horizon-blend": 0.08,
              "star-intensity": 0.05,
            })
            addSceneLayers(map, reducedMotion ? 0 : WORLD_STAGE_TRANSITION_MS)
            currentSlotRef.current = updateSceneLayers(
              map,
              activeItemRef.current,
              currentSlotRef.current,
            )
            renderedItemIdRef.current = activeItemRef.current.id
            setDiagnostic(reducedMotion ? "reduced-motion-static" : "live-map")
            setMapReady(true)
          } catch {
            setDiagnostic("load-error")
            setMapReady(false)
            cleanupMap()
          }
        })
      })
      .catch(() => {
        if (!cancelled) {
          setDiagnostic("load-error")
          setMapReady(false)
        }
      })

    return () => {
      cancelled = true
      setMapReady(false)
      cleanupMap()
    }
  }, [reducedMotion])

  return (
    <div className={styles.mapFrame}>
      <div
        className={`${styles.fallbackMap} ${mapReady ? styles.fallbackMapDimmed : ""}`}
      >
        <WorldStageFallbackMap activeScene={activeItem.sceneId} />
      </div>

      <div
        ref={mapContainerRef}
        className={`${styles.mapboxHost} ${mapReady ? styles.mapboxHostReady : ""} ${
          reducedMotion ? styles.mapboxHostStatic : ""
        }`}
        aria-hidden="true"
      />

      {showDiagnostic ? (
        <output className={styles.mapDiagnostic} aria-label="Map diagnostic state">
          {diagnostic}
        </output>
      ) : null}

      {mapReady ? (
        <div className={`${styles.mapAttribution} ${styles.mapAttributionVisible}`}>
          © <a href="https://www.mapbox.com/about/maps/">Mapbox</a> ©{" "}
          <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>{" "}
          <a href="https://apps.mapbox.com/feedback/">Improve this map</a>
        </div>
      ) : null}
    </div>
  )
}
