import { geoGraticule10, geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo"
import countries from "@/lib/world-stage/data/world-countries-110m.json" with { type: "json" }

/** Complete, correctly limb-clipped server rendering; also the no-JS fallback. */
export type RootGlobeVisual = Readonly<{ land: string; graticule: string; focus: string }>
const projection = geoOrthographic().translate([500, 500]).scale(445).rotate([-15, -8]).clipAngle(90)
const path = geoPath(projection)
export const ROOT_GLOBE_VISUAL: RootGlobeVisual = {
  land: countries.features.map(feature => path(feature as GeoPermissibleObjects) ?? "").join(""),
  graticule: path(geoGraticule10()) ?? "",
  focus: countries.features.filter(feature => ["NLD", "DEU"].includes(feature.properties.iso3)).map(feature => path(feature as GeoPermissibleObjects) ?? "").join(""),
}
