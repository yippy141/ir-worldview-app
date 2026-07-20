"use client"

import "mapbox-gl/dist/mapbox-gl.css"
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type Ref,
} from "react"
import type { GeoJSONSource, MapLayerMouseEvent } from "mapbox-gl"
import {
  buildWorldStageCountryData,
  buildWorldStageFlowData,
  buildWorldStageNodeData,
  getWorldStageTooltipItems,
  type WorldStageMapPresentation,
} from "@/lib/world-stage/map-data"
import {
  getNextWorldStageSpinLongitude,
  getWorldStageIdleResumeAt,
  WORLD_STAGE_BASEMAP_CONFIG,
  WORLD_STAGE_DEFAULT_ZOOM_OFFSET,
  WORLD_STAGE_GLOBE_IDLE_RESUME_MS,
  WORLD_STAGE_MAPBOX_STYLE,
  WORLD_STAGE_MAPBOX_TOKEN,
  WORLD_STAGE_ROLE_COLORS,
  WORLD_STAGE_SPIN_SEGMENT_MS,
  WORLD_STAGE_TRANSITION_MS,
} from "@/lib/world-stage/map-config"
import type {
  WorldStageScene,
  WorldStageTooltipItem,
} from "@/lib/world-stage/types"
import {
  WorldStageFallbackMap,
  type WorldStageInspectionPosition,
} from "./world-stage-fallback-map"
import styles from "./world-stage.module.css"

type MapboxModule = typeof import("mapbox-gl")
type MapboxMap = import("mapbox-gl").Map
type AutomaticTransition = "scene" | "spin" | "zoom" | null

type WorldStageMapProps = {
  ref?: Ref<WorldStageMapHandle>
  scene: WorldStageScene | null
  motionPaused: boolean
  reducedMotion: boolean
  onInteraction: () => void
  copy?: WorldStageMapPresentation & {
    unavailableLabel: string
    tooltipReviewedThrough: string
    lensOwner: string
    asOf: string
    mapDiagnosticState: string
    improveMap: string
  }
}

export type WorldStageMapHandle = {
  zoomIn: () => void
  zoomOut: () => void
}

type MapDiagnosticState =
  | "live-map"
  | "missing-token"
  | "reduced-motion-static"
  | "no-webgl"
  | "load-error"

type Inspection = {
  item: WorldStageTooltipItem
  position: WorldStageInspectionPosition
}

const COUNTRY_SOURCE_ID = "world-stage-countries"
const FLOW_SOURCE_ID = "world-stage-flows"
const NODE_SOURCE_ID = "world-stage-nodes"
const COUNTRY_FILL_LAYER_ID = "world-stage-country-fill"
const COUNTRY_BOUNDARY_LAYER_ID = "world-stage-country-boundary"
const COUNTRY_CONTESTED_LAYER_ID = "world-stage-country-contested"
const COUNTRY_HOVER_LAYER_ID = "world-stage-country-hover"
const FLOW_LAYER_ID = "world-stage-flow"
const NODE_HALO_LAYER_ID = "world-stage-node-halo"
const NODE_LAYER_ID = "world-stage-node"
const FALLBACK_MIN_ZOOM = 0.5
const FALLBACK_MAX_ZOOM = 2
const FALLBACK_ZOOM_STEP = 0.25
const FALLBACK_INITIAL_ZOOM = 1.15
const LIVE_MIN_ZOOM = 0.65
const LIVE_MAX_ZOOM = 3.25

function hasWebGlSupport() {
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}

function cameraFor(scene: WorldStageScene) {
  const mobile = window.matchMedia("(max-width: 640px)").matches

  return {
    center: [...scene.camera.center] as [number, number],
    zoom: scene.camera.zoom + (mobile ? -0.42 : WORLD_STAGE_DEFAULT_ZOOM_OFFSET),
    pitch: mobile ? 0 : scene.camera.pitch,
    bearing: scene.camera.bearing,
  }
}

function sourceData(data: ReturnType<typeof buildWorldStageCountryData>) {
  return data as unknown as Parameters<GeoJSONSource["setData"]>[0]
}

function propertiesToTooltip(
  properties: Record<string, unknown> | null | undefined,
): WorldStageTooltipItem | null {
  if (!properties) return null
  const { id, entityKind, label, meaning, asOf, sourceCount, iso3, role } = properties
  if (role === "neutral") return null
  if (
    typeof entityKind !== "string" ||
    !["country", "node", "flow"].includes(entityKind) ||
    typeof label !== "string" ||
    typeof meaning !== "string" ||
    typeof asOf !== "string" ||
    typeof sourceCount !== "number"
  ) {
    return null
  }

  const featureId = typeof id === "string" ? id : typeof iso3 === "string" ? iso3 : ""
  if (!featureId) return null

  return {
    id: featureId,
    kind: entityKind as WorldStageTooltipItem["kind"],
    label,
    meaning,
    asOf,
    sourceCount,
  }
}

export function WorldStageMap({
  ref,
  scene,
  motionPaused,
  reducedMotion,
  onInteraction,
  copy,
}: WorldStageMapProps) {
  const mapFrameRef = useRef<HTMLDivElement>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const activeSceneRef = useRef(scene)
  const motionPausedRef = useRef(motionPaused)
  const reducedMotionRef = useRef(reducedMotion)
  const renderedSceneIdRef = useRef<WorldStageScene["id"] | null>(null)
  const spinTimerRef = useRef<number | null>(null)
  const idleResumeAtRef = useRef(0)
  const automaticTransitionRef = useRef<AutomaticTransition>(null)
  const scheduleSpinRef = useRef<(delayMs?: number) => void>(() => undefined)
  const transitionToSceneRef = useRef<(nextScene: WorldStageScene) => void>(
    () => undefined,
  )
  const syncMotionRef = useRef<() => void>(() => undefined)
  const zoomMapRef = useRef<((delta: number) => boolean) | null>(null)
  const onInteractionRef = useRef(onInteraction)
  const [mapReady, setMapReady] = useState(false)
  const [fallbackZoom, setFallbackZoom] = useState(FALLBACK_INITIAL_ZOOM)
  const [showDiagnostic, setShowDiagnostic] = useState(false)
  const [diagnostic, setDiagnostic] = useState<MapDiagnosticState>("live-map")
  const [inspection, setInspection] = useState<Inspection | null>(null)

  activeSceneRef.current = scene
  motionPausedRef.current = motionPaused
  reducedMotionRef.current = reducedMotion
  onInteractionRef.current = onInteraction

  const zoomBy = useCallback((delta: number) => {
    onInteractionRef.current()
    if (zoomMapRef.current?.(delta)) return

    setFallbackZoom((current) =>
      Math.max(
        FALLBACK_MIN_ZOOM,
        Math.min(FALLBACK_MAX_ZOOM, current + delta * FALLBACK_ZOOM_STEP),
      ),
    )
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => zoomBy(1),
      zoomOut: () => zoomBy(-1),
    }),
    [zoomBy],
  )

  function positionInspection(
    item: WorldStageTooltipItem,
    position: WorldStageInspectionPosition,
  ) {
    const bounds = mapFrameRef.current?.getBoundingClientRect()
    const gutter = 132
    const x = bounds
      ? Math.max(gutter, Math.min(bounds.width - gutter, position.x))
      : position.x
    const y = Math.max(104, position.y)
    setInspection({ item, position: { x, y } })
  }

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return
    setShowDiagnostic(new URLSearchParams(window.location.search).get("mapDebug") === "1")
  }, [])

  useEffect(() => {
    setInspection(null)
    setFallbackZoom(FALLBACK_INITIAL_ZOOM)
    if (scene) transitionToSceneRef.current(scene)
  }, [scene])

  useEffect(() => {
    syncMotionRef.current()
  }, [motionPaused, reducedMotion])

  useEffect(() => {
    const container = mapContainerRef.current
    setMapReady(false)
    renderedSceneIdRef.current = null

    if (!container || !activeSceneRef.current) return
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
    const passiveCapture = { capture: true, passive: true } as const
    let cancelled = false
    let map: MapboxMap | null = null
    let canvas: HTMLCanvasElement | null = null
    let loaded = false
    let hoveredIso3 = ""

    function clearSpinTimer() {
      if (spinTimerRef.current === null) return
      window.clearTimeout(spinTimerRef.current)
      spinTimerRef.current = null
    }

    function scheduleSpin(delayMs = 0) {
      clearSpinTimer()

      if (
        cancelled ||
        !map ||
        !loaded ||
        reducedMotionRef.current ||
        motionPausedRef.current ||
        automaticTransitionRef.current === "scene"
      ) {
        return
      }

      const remainingIdleDelay = Math.max(0, idleResumeAtRef.current - Date.now())
      spinTimerRef.current = window.setTimeout(
        startSpinSegment,
        Math.max(delayMs, remainingIdleDelay),
      )
    }

    function startSpinSegment() {
      spinTimerRef.current = null
      if (!map || cancelled || !loaded || automaticTransitionRef.current === "scene") return

      const center = map.getCenter()
      const nextLongitude = getNextWorldStageSpinLongitude({
        longitude: center.lng,
        zoom: map.getZoom(),
        reducedMotion: reducedMotionRef.current,
        motionPaused: motionPausedRef.current,
        now: Date.now(),
        idleResumeAt: idleResumeAtRef.current,
      })

      if (nextLongitude === null) return

      automaticTransitionRef.current = "spin"
      map.easeTo({
        center: [nextLongitude, center.lat],
        duration: WORLD_STAGE_SPIN_SEGMENT_MS,
        easing: (progress) => progress,
        essential: false,
      })
    }

    function handleMoveEnd() {
      const completedTransition = automaticTransitionRef.current
      automaticTransitionRef.current = null

      if (completedTransition === "scene" || completedTransition === "zoom") {
        idleResumeAtRef.current = getWorldStageIdleResumeAt(Date.now())
        scheduleSpin(WORLD_STAGE_GLOBE_IDLE_RESUME_MS)
        return
      }

      scheduleSpin()
    }

    function beginDirectInteraction() {
      if (!map || cancelled || !loaded) return

      onInteractionRef.current()
      clearSpinTimer()
      idleResumeAtRef.current = getWorldStageIdleResumeAt(Date.now())
      if (automaticTransitionRef.current !== null) {
        automaticTransitionRef.current = null
        map.stop()
      }
      scheduleSpin(WORLD_STAGE_GLOBE_IDLE_RESUME_MS)
    }

    function zoomMap(delta: number) {
      if (!map || cancelled || !loaded) return false

      clearSpinTimer()
      idleResumeAtRef.current = getWorldStageIdleResumeAt(Date.now())
      automaticTransitionRef.current = null
      map.stop()
      automaticTransitionRef.current = "zoom"
      map.easeTo({
        zoom: Math.max(
          LIVE_MIN_ZOOM,
          Math.min(LIVE_MAX_ZOOM, map.getZoom() + delta * 0.5),
        ),
        duration: reducedMotionRef.current ? 0 : 220,
        essential: false,
      })
      return true
    }

    function handlePointerDown() {
      beginDirectInteraction()
    }

    function finishDirectInteraction(event: { originalEvent?: unknown }) {
      if (!map || cancelled || !loaded || !event.originalEvent) return

      onInteractionRef.current()
      clearSpinTimer()
      idleResumeAtRef.current = getWorldStageIdleResumeAt(Date.now())
      scheduleSpin(WORLD_STAGE_GLOBE_IDLE_RESUME_MS)
    }

    function setSceneData(nextScene: WorldStageScene) {
      if (!map || !loaded) return
      const countrySource = map.getSource(COUNTRY_SOURCE_ID) as GeoJSONSource | undefined
      const flowSource = map.getSource(FLOW_SOURCE_ID) as GeoJSONSource | undefined
      const nodeSource = map.getSource(NODE_SOURCE_ID) as GeoJSONSource | undefined
      countrySource?.setData(sourceData(buildWorldStageCountryData(nextScene, copy)))
      flowSource?.setData(
        buildWorldStageFlowData(nextScene) as unknown as Parameters<
          GeoJSONSource["setData"]
        >[0],
      )
      nodeSource?.setData(
        buildWorldStageNodeData(nextScene) as unknown as Parameters<
          GeoJSONSource["setData"]
        >[0],
      )
      hoveredIso3 = ""
      map.setFilter(COUNTRY_HOVER_LAYER_ID, ["==", ["get", "iso3"], ""])
    }

    function transitionToScene(nextScene: WorldStageScene) {
      if (
        !map ||
        !loaded ||
        renderedSceneIdRef.current === nextScene.id ||
        cancelled
      ) {
        return
      }

      clearSpinTimer()
      automaticTransitionRef.current = null
      map.stop()
      setSceneData(nextScene)
      setInspection(null)
      automaticTransitionRef.current = "scene"
      renderedSceneIdRef.current = nextScene.id
      map.easeTo({
        ...cameraFor(nextScene),
        duration: reducedMotionRef.current ? 0 : WORLD_STAGE_TRANSITION_MS,
        easing: (progress) => 1 - Math.pow(1 - progress, 4),
        essential: false,
      })
    }

    function syncMotion() {
      if (!map || !loaded) return

      if (motionPausedRef.current || reducedMotionRef.current) {
        clearSpinTimer()
        if (automaticTransitionRef.current === "spin") {
          automaticTransitionRef.current = null
          map.stop()
        }
        return
      }

      scheduleSpin()
    }

    function inspectFeature(event: MapLayerMouseEvent) {
      const feature = event.features?.[0]
      const item = propertiesToTooltip(
        feature?.properties as Record<string, unknown> | null | undefined,
      )
      if (!item) return
      positionInspection(item, { x: event.point.x, y: event.point.y })
    }

    function handleCountryMove(event: MapLayerMouseEvent) {
      if (!map) return
      const feature = event.features?.[0]
      const properties = feature?.properties as Record<string, unknown> | undefined
      const iso3 = typeof properties?.iso3 === "string" ? properties.iso3 : ""
      const role = typeof properties?.role === "string" ? properties.role : "neutral"

      map.getCanvas().style.cursor = role === "neutral" ? "grab" : "pointer"
      if (iso3 !== hoveredIso3) {
        hoveredIso3 = iso3
        map.setFilter(COUNTRY_HOVER_LAYER_ID, ["==", ["get", "iso3"], iso3])
      }
      if (role === "neutral") {
        setInspection(null)
        return
      }
      inspectFeature(event)
    }

    function handleFeatureMove(event: MapLayerMouseEvent) {
      if (!map) return
      map.getCanvas().style.cursor = "pointer"
      inspectFeature(event)
    }

    function clearFeatureInspection() {
      if (!map) return
      map.getCanvas().style.cursor = "grab"
      setInspection(null)
    }

    function clearCountryInspection() {
      if (!map) return
      hoveredIso3 = ""
      map.setFilter(COUNTRY_HOVER_LAYER_ID, ["==", ["get", "iso3"], ""])
      clearFeatureInspection()
    }

    function addEditorialLayers(nextScene: WorldStageScene) {
      if (!map) return
      map.addSource(COUNTRY_SOURCE_ID, {
        type: "geojson",
        data: sourceData(buildWorldStageCountryData(nextScene, copy)),
      })
      map.addSource(FLOW_SOURCE_ID, {
        type: "geojson",
        data: buildWorldStageFlowData(nextScene) as unknown as Parameters<
          GeoJSONSource["setData"]
        >[0],
      })
      map.addSource(NODE_SOURCE_ID, {
        type: "geojson",
        data: buildWorldStageNodeData(nextScene) as unknown as Parameters<
          GeoJSONSource["setData"]
        >[0],
      })

      map.addLayer({
        id: COUNTRY_FILL_LAYER_ID,
        type: "fill",
        source: COUNTRY_SOURCE_ID,
        paint: {
          "fill-color": [
            "match",
            ["get", "role"],
            "focus",
            WORLD_STAGE_ROLE_COLORS.focus,
            "partner",
            WORLD_STAGE_ROLE_COLORS.partner,
            "competitor",
            WORLD_STAGE_ROLE_COLORS.competitor,
            "hedging",
            WORLD_STAGE_ROLE_COLORS.hedging,
            "exposed",
            WORLD_STAGE_ROLE_COLORS.exposed,
            "contested",
            WORLD_STAGE_ROLE_COLORS.contested,
            WORLD_STAGE_ROLE_COLORS.neutral,
          ],
          "fill-opacity": [
            "case",
            ["==", ["get", "role"], "neutral"],
            0.84,
            0.98,
          ],
          "fill-emissive-strength": 0.82,
        },
      })
      map.addLayer({
        id: COUNTRY_BOUNDARY_LAYER_ID,
        type: "line",
        source: COUNTRY_SOURCE_ID,
        paint: {
          "line-color": "#8db5d3",
          "line-width": 0.82,
          "line-opacity": 0.8,
          "line-emissive-strength": 0.72,
        },
      })
      map.addLayer({
        id: COUNTRY_CONTESTED_LAYER_ID,
        type: "line",
        source: COUNTRY_SOURCE_ID,
        filter: ["==", ["get", "role"], "contested"],
        paint: {
          "line-color": "#f0cf86",
          "line-width": 1.45,
          "line-opacity": 0.96,
          "line-dasharray": [1.2, 1.4],
          "line-emissive-strength": 0.9,
        },
      })
      map.addLayer({
        id: COUNTRY_HOVER_LAYER_ID,
        type: "line",
        source: COUNTRY_SOURCE_ID,
        filter: ["==", ["get", "iso3"], ""],
        paint: {
          "line-color": "#ffe2a1",
          "line-width": 2,
          "line-opacity": 0.95,
          "line-emissive-strength": 1,
        },
      })
      map.addLayer({
        id: FLOW_LAYER_ID,
        type: "line",
        source: FLOW_SOURCE_ID,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#87d5dd",
          "line-width": [
            "match",
            ["get", "weight"],
            1,
            1.35,
            2,
            2.1,
            2.8,
          ],
          "line-opacity": 0.96,
          "line-emissive-strength": 0.92,
        },
      })
      map.addLayer({
        id: NODE_HALO_LAYER_ID,
        type: "circle",
        source: NODE_SOURCE_ID,
        paint: {
          "circle-radius": 7.2,
          "circle-color": "#07111f",
          "circle-opacity": 0.94,
          "circle-stroke-color": "#f0c96f",
          "circle-stroke-width": 1.5,
          "circle-stroke-opacity": 1,
          "circle-emissive-strength": 0.94,
        },
      })
      map.addLayer({
        id: NODE_LAYER_ID,
        type: "circle",
        source: NODE_SOURCE_ID,
        paint: {
          "circle-radius": 3.3,
          "circle-color": "#ffe09a",
          "circle-opacity": 1,
          "circle-emissive-strength": 1,
        },
      })

      map.on("mousemove", COUNTRY_FILL_LAYER_ID, handleCountryMove)
      map.on("mouseleave", COUNTRY_FILL_LAYER_ID, clearCountryInspection)
      map.on("click", COUNTRY_FILL_LAYER_ID, handleCountryMove)
      map.on("mousemove", FLOW_LAYER_ID, handleFeatureMove)
      map.on("mouseleave", FLOW_LAYER_ID, clearFeatureInspection)
      map.on("click", FLOW_LAYER_ID, handleFeatureMove)
      map.on("mousemove", NODE_HALO_LAYER_ID, handleFeatureMove)
      map.on("mouseleave", NODE_HALO_LAYER_ID, clearFeatureInspection)
      map.on("click", NODE_HALO_LAYER_ID, handleFeatureMove)
    }

    function handleMapLoad() {
      if (cancelled || !map || !activeSceneRef.current) return

      try {
        loaded = true
        const hasStandardBasemap = map
          .getStyle()
          .imports?.some((styleImport) => styleImport.id === "basemap")
        if (hasStandardBasemap) {
          for (const [property, value] of Object.entries(
            WORLD_STAGE_BASEMAP_CONFIG,
          )) {
            map.setConfigProperty("basemap", property, value)
          }
        }
        const backgroundLayer = map
          .getStyle()
          .layers?.find((layer) => layer.type === "background")
        if (backgroundLayer) {
          map.setPaintProperty(backgroundLayer.id, "background-color", "#07111f")
          map.setPaintProperty(backgroundLayer.id, "background-opacity", 1)
        }
        map.setFog({
          color: "#07111f",
          "high-color": "#1c4568",
          "space-color": "#07111f",
          "horizon-blend": 0.025,
          "star-intensity": 0.12,
        })
        addEditorialLayers(activeSceneRef.current)
        renderedSceneIdRef.current = activeSceneRef.current.id
        setDiagnostic(reducedMotion ? "reduced-motion-static" : "live-map")
        setMapReady(true)
        scheduleSpin()
      } catch {
        setDiagnostic("load-error")
        setMapReady(false)
        cleanupMap()
      }
    }

    function cleanupMap() {
      clearSpinTimer()
      scheduleSpinRef.current = () => undefined
      transitionToSceneRef.current = () => undefined
      syncMotionRef.current = () => undefined
      zoomMapRef.current = null
      automaticTransitionRef.current = null

      if (canvas) canvas.removeEventListener("webglcontextlost", handleContextLost)
      mapHost.removeEventListener("pointerdown", handlePointerDown, true)
      mapRef.current = null

      if (map) {
        try {
          map.off("error", handleMapError)
          map.off("load", handleMapLoad)
          map.off("moveend", handleMoveEnd)
          map.off("dragend", finishDirectInteraction)
          map.off("rotateend", finishDirectInteraction)
          map.stop()
          map.remove()
        } catch {
          // The WebGL context may already be gone. The SVG remains complete.
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

    scheduleSpinRef.current = scheduleSpin
    transitionToSceneRef.current = transitionToScene
    syncMotionRef.current = syncMotion
    zoomMapRef.current = zoomMap

    void import("mapbox-gl")
      .then((module: MapboxModule) => {
        if (cancelled || !mapContainerRef.current || !activeSceneRef.current) return

        const mapboxgl = module.default
        mapboxgl.accessToken = WORLD_STAGE_MAPBOX_TOKEN
        const initialCamera = cameraFor(activeSceneRef.current)

        try {
          map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: WORLD_STAGE_MAPBOX_STYLE,
            ...initialCamera,
            projection: "globe",
            attributionControl: false,
            interactive: true,
            keyboard: false,
            boxZoom: false,
            doubleClickZoom: false,
            dragPan: true,
            dragRotate: true,
            pitchWithRotate: false,
            touchPitch: false,
            scrollZoom: false,
            touchZoomRotate: true,
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
        map.on("moveend", handleMoveEnd)
        map.on("dragend", finishDirectInteraction)
        map.on("rotateend", finishDirectInteraction)
        mapHost.addEventListener("pointerdown", handlePointerDown, passiveCapture)

        map.once("load", handleMapLoad)
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
  }, [copy, reducedMotion])

  if (!scene) {
    return (
      <div className={styles.mapFrame}>
        <p className={styles.mapUnavailable} role="status">
          {copy?.unavailableLabel ?? "Reviewed map layer unavailable."}
        </p>
      </div>
    )
  }

  const tooltipItems = getWorldStageTooltipItems(scene, copy)
  const tooltipStyle = inspection
    ? ({ left: inspection.position.x, top: inspection.position.y } as CSSProperties)
    : undefined

  return (
    <div
      className={styles.mapFrame}
      ref={mapFrameRef}
      role="group"
      aria-describedby={`world-stage-map-caption-${scene.id}`}
    >
      <div
        className={`${styles.fallbackMap} ${mapReady ? styles.fallbackMapDimmed : ""}`}
      >
        <WorldStageFallbackMap
          scene={scene}
          zoom={fallbackZoom}
          onInspect={positionInspection}
          onClearInspection={() => setInspection(null)}
          onInteraction={onInteraction}
          presentation={copy}
        />
      </div>

      <div
        ref={mapContainerRef}
        className={`${styles.mapboxHost} ${mapReady ? styles.mapboxHostReady : ""}`}
        aria-hidden="true"
      />

      {inspection ? (
        <div className={styles.mapTooltip} style={tooltipStyle} role="status">
          <p className={styles.mapTooltipLabel}>{inspection.item.label}</p>
          <p className={styles.mapTooltipMeaning}>{inspection.item.meaning}</p>
          <p className={styles.mapTooltipMeta}>
            {copy?.tooltipReviewedThrough ?? "Reviewed through"} {inspection.item.asOf}
          </p>
        </div>
      ) : null}

      <section className={styles.visuallyHidden}>
        <h2>{scene.publicLabel}</h2>
        <p id={`world-stage-map-caption-${scene.id}`}>
          {copy
            ? `${scene.caption} ${copy.lensOwner}：${scene.lensOwner}。${copy.asOf} ${scene.asOf}。`
            : `${scene.caption} Lens owner: ${scene.lensOwner}. As of ${scene.asOf}.`}
        </p>
        <ul>
          {tooltipItems.map((item) => (
            <li key={`${item.kind}-${item.id}`}>
              {item.label}{copy ? "：" : ": "}{item.meaning}
            </li>
          ))}
        </ul>
      </section>

      {showDiagnostic ? (
        <output
          className={styles.mapDiagnostic}
          aria-label={copy?.mapDiagnosticState ?? "Map diagnostic state"}
        >
          {diagnostic}
        </output>
      ) : null}

      {mapReady ? (
        <div className={`${styles.mapAttribution} ${styles.mapAttributionVisible}`}>
          © <a href="https://www.mapbox.com/about/maps/">Mapbox</a> ©{" "}
          <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>{" "}
          <a href="https://apps.mapbox.com/feedback/">
            {copy?.improveMap ?? "Improve this map"}
          </a>
        </div>
      ) : null}
    </div>
  )
}
