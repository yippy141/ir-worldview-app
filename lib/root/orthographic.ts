import { geoGraticule10, geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo"
import countries from "@/lib/world-stage/data/world-countries-110m.json" with { type: "json" }
import points from "@/lib/world-stage/data/world-small-places-110m.json" with { type: "json" }
import { ROOT_GLOBE_SCENES, SUPPORTED_PLACES } from "@/lib/root/globe-scenes"
import { ALIGNMENT_COLORS } from "@/lib/root/globe-types"
import { DOCUMENTED_GLOBE_SCENES } from "@/lib/world-stage/documented-globe-scenes"

/** The complete server still is limb-clipped with the same projection as Canvas. */
export type RootGlobeVisual = Readonly<{ land: string; graticule: string; groups: Array<{ color: string; fill: string; path: string }>; places: typeof SUPPORTED_PLACES }>
const projection = geoOrthographic().translate([500, 500]).scale(445).rotate([-15, -8]).clipAngle(90)
const path = geoPath(projection).pointRadius(3.8)
const polygonCodes = new Set(countries.features.map(feature => feature.properties.iso3))
const features = [...countries.features, ...points.features.filter(feature => !polygonCodes.has(feature.properties.iso3))]
function still(groups: Array<{ color: string; countries: string[] }>, colors: Record<string, string>): RootGlobeVisual {
  return {
    land: features.map(feature => path(feature as GeoPermissibleObjects) ?? "").join(""),
    graticule: path(geoGraticule10()) ?? "",
    places: SUPPORTED_PLACES,
    groups: groups.filter(group => group.color !== "muted").map(group => ({
      color: group.color, fill: colors[group.color],
      path: features.filter(feature => group.countries.includes(feature.properties.iso3)).map(feature => path(feature as GeoPermissibleObjects) ?? "").join(""),
    })),
  }
}
export const ROOT_GLOBE_VISUAL = still(ROOT_GLOBE_SCENES[0].groups, ALIGNMENT_COLORS)
export const DOCUMENTED_GLOBE_VISUAL = still(DOCUMENTED_GLOBE_SCENES[0].groups, { blue: "#86abd2", amber: "#d98a5a", gold: "#cea857" })
