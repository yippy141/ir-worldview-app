import { geoGraticule10, geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo"
import countries from "@/lib/world-stage/data/world-countries-110m.json" with { type: "json" }
import points from "@/lib/world-stage/data/world-small-places-110m.json" with { type: "json" }
import { ROOT_GLOBE_SCENES } from "@/lib/root/globe-scenes"

/** Complete, correctly limb-clipped server rendering; also the no-JS fallback. */
export type RootGlobeVisual = Readonly<{ land: string; graticule: string; groups: Array<{ color: string; fill: string; path: string }> }>
const projection = geoOrthographic().translate([500, 500]).scale(445).rotate([-15, -8]).clipAngle(90)
const path = geoPath(projection)
export const ROOT_GLOBE_VISUAL: RootGlobeVisual = {
  land: countries.features.map(feature => path(feature as GeoPermissibleObjects) ?? "").join(""),
  graticule: path(geoGraticule10()) ?? "",
  groups: ROOT_GLOBE_SCENES[0].groups.map(group => ({
    color: group.color,
    fill: { blue: "#86abd2", amber: "#d98a5a", gold: "#cea857" }[group.color],
    path: [...countries.features, ...points.features].filter(feature => group.countries.includes(feature.properties.iso3))
      .map(feature => path(feature as GeoPermissibleObjects) ?? "").join(""),
  })),
}
