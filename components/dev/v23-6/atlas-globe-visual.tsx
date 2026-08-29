"use client"

import { useEffect, useRef, useState } from "react"
import type { GeoJSONSource } from "mapbox-gl"
import { formatLocalizedDate } from "@/i18n/format"
import {
  WORLD_STAGE_BASEMAP_CONFIG,
  WORLD_STAGE_MAPBOX_STYLE,
  WORLD_STAGE_MAPBOX_TOKEN,
  WORLD_STAGE_ROLE_COLORS,
} from "@/lib/world-stage/map-config"
import { buildWorldStageCountryData } from "@/lib/world-stage/map-data"
import { getWorldStageScene } from "@/lib/world-stage/scenes"
import { getRootDestination } from "@/lib/v23-6/root-menu"
import {
  ORTHO_CENTER,
  ORTHO_RADIUS,
  ORTHO_VIEW_SIZE,
  buildCountryPaths,
  buildGraticulePath,
  buildLandPath,
} from "@/lib/v23-6/orthographic"
import type { RootVisualState } from "./root-shell"
import styles from "./atlas-globe-visual.module.css"

type MapboxMap = import("mapbox-gl").Map

const COUNTRY_SOURCE_ID = "study-root-countries"
const COUNTRY_FILL_LAYER_ID = "study-root-country-fill"
const COUNTRY_LINE_LAYER_ID = "study-root-country-line"
const CAMERA_MS = 900

function hasWebGlSupport() {
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}

/**
 * The quiet root state of the existing globe.
 *
 * Ordinary basemap labels are off, there are no zoom controls, no layer
 * panel, no tooltips, and no scene cycling. At most one reviewed overlay is
 * shown, and only while World Stage is the selected destination, because
 * World Stage is the destination that owns the map. Mapbox attribution stays
 * on the page whenever a Mapbox tile is drawn.
 */
export function AtlasGlobeVisual({ destinationId, reducedMotion }: RootVisualState) {
  const destination = getRootDestination(destinationId)
  const overlaySceneId = destination.globe.overlaySceneId
  const overlayScene = overlaySceneId ? getWorldStageScene(overlaySceneId) : null

  const hostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const [mapReady, setMapReady] = useState(false)

  const view = { rotation: destination.globe.center[0], centerLatitude: 18 }
  const land = buildLandPath(view)
  const graticule = buildGraticulePath(view)
  // The drawn base carries the same single overlay, so the caption never
  // names a reviewed layer that is missing when Mapbox does not load.
  const overlayShapes = overlayScene
    ? (() => {
        const countryPaths = buildCountryPaths(view)
        return overlayScene.countryRoles.flatMap((country) => {
          const d = countryPaths.get(country.iso3)
          return d ? [{ iso3: country.iso3, role: country.role, d }] : []
        })
      })()
    : []

  useEffect(() => {
    const host = hostRef.current
    if (!host || !WORLD_STAGE_MAPBOX_TOKEN || !hasWebGlSupport()) return

    let cancelled = false
    let map: MapboxMap | null = null

    function teardown() {
      mapRef.current = null
      if (!map) return
      try {
        map.remove()
      } catch {
        // The WebGL context may already be gone. The drawn base stays complete.
      }
      map = null
    }

    void import("@/components/home/world-stage/mapbox-runtime")
      .then((runtime) => {
        if (cancelled || !hostRef.current) return
        const mapboxgl = runtime.default
        mapboxgl.accessToken = WORLD_STAGE_MAPBOX_TOKEN

        map = new mapboxgl.Map({
          container: hostRef.current,
          style: WORLD_STAGE_MAPBOX_STYLE,
          center: [...destination.globe.center] as [number, number],
          zoom: destination.globe.zoom,
          projection: "globe",
          attributionControl: false,
          interactive: false,
          fadeDuration: reducedMotion ? 0 : CAMERA_MS,
        })
        mapRef.current = map

        map.once("load", () => {
          if (cancelled || !map) return
          const loaded = map

          // Each cosmetic step is isolated. A style that rejects one of them
          // must not leave the prototype stuck on its drawn fallback.
          const quietly = (step: () => void) => {
            try {
              step()
            } catch {
              // The drawn base stays complete if a style rejects a property.
            }
          }

          const hasStandardBasemap = Boolean(
            loaded.getStyle().imports?.some((styleImport) => styleImport.id === "basemap"),
          )

          if (hasStandardBasemap) {
            for (const [property, value] of Object.entries({
              ...WORLD_STAGE_BASEMAP_CONFIG,
              showPlaceLabels: false,
            })) {
              quietly(() => loaded.setConfigProperty("basemap", property, value))
            }
          } else {
            for (const layer of loaded.getStyle().layers ?? []) {
              if (layer.type !== "symbol") continue
              quietly(() => loaded.setLayoutProperty(layer.id, "visibility", "none"))
            }
          }

          quietly(() => {
            const background = loaded
              .getStyle()
              .layers?.find((layer) => layer.type === "background")
            if (background) {
              loaded.setPaintProperty(background.id, "background-color", "#07111f")
            }
          })

          quietly(() =>
            loaded.setFog({
              color: "#07111f",
              "high-color": "#16354f",
              "space-color": "#07111f",
              "horizon-blend": 0.02,
              "star-intensity": 0,
            }),
          )

          setMapReady(true)
        })

        map.on("error", () => {
          if (cancelled) return
          setMapReady(false)
        })
      })
      .catch(() => {
        if (!cancelled) setMapReady(false)
      })

    return () => {
      cancelled = true
      setMapReady(false)
      teardown()
    }
    // The map is built once. Camera and overlay updates run in their own
    // effects so a destination change never reloads the tiles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    map.easeTo({
      center: [...destination.globe.center] as [number, number],
      zoom: destination.globe.zoom,
      duration: reducedMotion ? 0 : CAMERA_MS,
      essential: false,
    })
  }, [destination, mapReady, reducedMotion])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    const data = overlayScene
      ? (buildWorldStageCountryData(overlayScene) as unknown as Parameters<
          GeoJSONSource["setData"]
        >[0])
      : ({ type: "FeatureCollection", features: [] } as unknown as Parameters<
          GeoJSONSource["setData"]
        >[0])

    const existing = map.getSource(COUNTRY_SOURCE_ID) as GeoJSONSource | undefined
    if (existing) {
      existing.setData(data)
      return
    }

    map.addSource(COUNTRY_SOURCE_ID, { type: "geojson", data })
    map.addLayer({
      id: COUNTRY_FILL_LAYER_ID,
      type: "fill",
      source: COUNTRY_SOURCE_ID,
      filter: ["!=", ["get", "role"], "neutral"],
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
        "fill-opacity": 0.62,
        "fill-emissive-strength": 0.7,
      },
    })
    map.addLayer({
      id: COUNTRY_LINE_LAYER_ID,
      type: "line",
      source: COUNTRY_SOURCE_ID,
      filter: ["!=", ["get", "role"], "neutral"],
      paint: {
        "line-color": "#a9c4dc",
        "line-width": 0.7,
        "line-opacity": 0.7,
        "line-emissive-strength": 0.7,
      },
    })
  }, [mapReady, overlayScene])

  return (
    <figure className={styles.frame} data-map-ready={mapReady ? "true" : "false"}>
      <div className={styles.stack}>
        <svg
          className={styles.base}
          viewBox={`0 0 ${ORTHO_VIEW_SIZE} ${ORTHO_VIEW_SIZE}`}
          role="presentation"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            className={styles.limb}
            cx={ORTHO_CENTER}
            cy={ORTHO_CENTER}
            r={ORTHO_RADIUS}
          />
          <path className={styles.graticule} d={graticule} />
          <path className={styles.land} d={land} />
          {overlayShapes.map((shape) => (
            <path
              className={styles.overlayShape}
              d={shape.d}
              key={shape.iso3}
              style={{
                fill: WORLD_STAGE_ROLE_COLORS[shape.role],
                stroke: WORLD_STAGE_ROLE_COLORS[shape.role],
              }}
            />
          ))}
        </svg>
        <div ref={hostRef} className={styles.mapHost} aria-hidden="true" />
      </div>

      <figcaption className={styles.caption}>
        {overlayScene ? (
          <span className={styles.overlayNote}>
            {overlayScene.publicLabel}. Reviewed through{" "}
            <time dateTime={overlayScene.asOf}>
              {formatLocalizedDate(overlayScene.asOf, "en", "medium")}
            </time>
            .
          </span>
        ) : null}
        {mapReady ? (
          <span className={styles.attribution}>
            &copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy;{" "}
            <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>{" "}
            <a href="https://apps.mapbox.com/feedback/">Improve this map</a>
          </span>
        ) : null}
      </figcaption>
    </figure>
  )
}
