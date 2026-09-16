import { geoDistance, geoGraticule10, geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo"
import countries from "@/lib/world-stage/data/world-countries-110m.json"
import points from "@/lib/world-stage/data/world-small-places-110m.json"
import type { GlobeScene } from "@/lib/root/globe-scenes"

const colors = { gold: "#cea857", blue: "#86abd2", amber: "#d98a5a" }
export function createGlobePainter(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d")
  if (!context) return null
  const projection = geoOrthographic().translate([500, 500]).scale(445).clipAngle(90).precision(.6)
  const path = geoPath(projection, context)
  const graticule = geoGraticule10()
  const draw = (shape: GeoPermissibleObjects, fill: string, stroke?: string) => {
    context.beginPath(); path(shape); context.fillStyle = fill; context.fill()
    if (stroke) { context.strokeStyle = stroke; context.lineWidth = .7; context.stroke() }
  }
  return (longitude: number, scene: GlobeScene) => {
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr))
    if (canvas.width !== width) { canvas.width = width; canvas.height = width }
    context.setTransform(width / 1000, 0, 0, width / 1000, 0, 0)
    context.clearRect(0, 0, 1000, 1000)
    projection.rotate([-longitude, -8, 0])
    draw({ type: "Sphere" }, "#0e1a2e", "#304563")
    context.beginPath(); path(graticule); context.strokeStyle = "#22344f"; context.lineWidth = .65; context.stroke()
    for (const feature of countries.features) draw(feature as GeoPermissibleObjects, "#293b50", "#0e1a2e")
    for (const group of scene.groups) {
      for (const feature of countries.features) if (group.countries.includes(feature.properties.iso3)) draw(feature as GeoPermissibleObjects, colors[group.color], "#0e1a2e")
      for (const feature of points.features) {
        if (!group.countries.includes(feature.properties.iso3)) continue
        const coordinates = feature.geometry.coordinates as [number, number]
        if (geoDistance(coordinates, [longitude, 8]) >= Math.PI / 2) continue
        const position = projection(coordinates)
        if (!position) continue
        context.beginPath(); context.arc(position[0], position[1], 5, 0, 2 * Math.PI)
        context.fillStyle = colors[group.color]; context.fill()
        context.lineWidth = 1.5; context.strokeStyle = "#0a1322"; context.stroke()
      }
    }
  }
}
