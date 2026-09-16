import { geoContains, geoDistance, geoGraticule10, geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo"
import countries from "@/lib/world-stage/data/world-countries-110m.json"
import points from "@/lib/world-stage/data/world-small-places-110m.json"
import { ALIGNMENT_COLORS } from "@/lib/root/globe-types"
import type { GlobeCamera } from "@/lib/root/globe-camera"

export function createGlobePainter(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d")
  if (!context) return null
  const projection = geoOrthographic().translate([500, 500]).clipAngle(90).precision(.6)
  const path = geoPath(projection, context)
  const graticule = geoGraticule10()
  const polygonCodes = new Set(countries.features.map(feature => feature.properties.iso3))
  const small = points.features.filter(feature => !polygonCodes.has(feature.properties.iso3))
  const project = (camera: GlobeCamera) => projection.scale(445 * camera.zoom).rotate([-camera.longitude, -camera.latitude, 0])
  const draw = (shape: GeoPermissibleObjects, fill: string, stroke?: string) => {
    context.beginPath(); path(shape); context.fillStyle = fill; context.fill()
    if (stroke) { context.strokeStyle = stroke; context.lineWidth = .9; context.stroke() }
  }
  return {
    paint(camera: GlobeCamera, scene: { groups: Array<{ color: string; countries: string[] }>; internalBorders?: "faint" }, colors: Record<string, string> = ALIGNMENT_COLORS) {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      if (canvas.width !== width) { canvas.width = width; canvas.height = width }
      context.setTransform(width / 1000, 0, 0, width / 1000, 0, 0)
      context.clearRect(0, 0, 1000, 1000)
      project(camera)
      const fills = new Map(scene.groups.flatMap(group => group.countries.map(code => [code, colors[group.color]] as const)))
      draw({ type: "Sphere" }, "#0e1a2e", "#304563")
      context.beginPath(); path(graticule); context.strokeStyle = "#22344f"; context.lineWidth = .65; context.stroke()
      const border = scene.internalBorders === "faint" ? "rgba(14,26,46,.18)" : "#0e1a2e"
      for (const feature of countries.features) draw(feature as GeoPermissibleObjects, fills.get(feature.properties.iso3) ?? ALIGNMENT_COLORS.muted, border)
      for (const feature of small) {
        const coordinates = feature.geometry.coordinates as [number, number]
        if (geoDistance(coordinates, [camera.longitude, camera.latitude]) >= Math.PI / 2) continue
        const position = projection(coordinates)
        if (!position) continue
        context.beginPath(); context.arc(position[0], position[1], 3.8, 0, 2 * Math.PI)
        context.fillStyle = fills.get(feature.properties.iso3) ?? ALIGNMENT_COLORS.muted; context.fill()
        context.lineWidth = 1; context.strokeStyle = scene.internalBorders === "faint" ? border : "#0a1322"; context.stroke()
      }
    },
    inspect(camera: GlobeCamera, x: number, y: number) {
      project(camera)
      for (const feature of small) {
        const coordinates = feature.geometry.coordinates as [number, number]
        if (geoDistance(coordinates, [camera.longitude, camera.latitude]) >= Math.PI / 2) continue
        const position = projection(coordinates)
        if (position && Math.hypot(x - position[0], y - position[1]) < 10) return feature.properties.iso3
      }
      if (Math.hypot(x - 500, y - 500) > 445 * camera.zoom) return null
      const position = projection.invert?.([x, y])
      if (!position || !position.every(Number.isFinite)) return null
      return countries.features.find(feature => geoContains(feature as GeoPermissibleObjects, position))?.properties.iso3 ?? null
    },
  }
}
