import { createGlobePainter } from "./globe-runtime"
import type { DocumentedGlobeScene } from "@/lib/world-stage/documented-globe-scenes"

/** Evidence mode shares geographic drawing, but owns its factual clock and key. */
export function createDocumentedGlobePainter(canvas: HTMLCanvasElement) {
  const painter = createGlobePainter(canvas)
  if (!painter) return null
  return (longitude: number, scene: DocumentedGlobeScene) => painter.paint(
    { longitude, latitude: 8, zoom: 1 }, scene, { blue: "#86abd2", amber: "#d98a5a", gold: "#cea857" },
  )
}
