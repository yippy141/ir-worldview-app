import countries from "@/lib/world-stage/data/world-countries-110m.json" with { type: "json" }
import smallPlaces from "@/lib/world-stage/data/world-small-places-110m.json" with { type: "json" }
import type { Locale } from "@/i18n/routing"

import type { AlignmentScene } from "./globe-types"
export type { AlignmentScene } from "./globe-types"
type AuthoredScene = AlignmentScene & { titleZh: string; rationale: string }

const codes = (value: string) => value.split(" ").filter(Boolean)
export const SUPPORTED_PLACES = [...new Map([...countries.features, ...smallPlaces.features]
  .map(feature => [feature.properties.iso3, feature.properties.name])).entries()]
  .map(([code, name]) => ({ code, name })).sort((a, b) => a.name.localeCompare(b.name, "en"))

// These lists are authored fiction. They deliberately do not import treaty lists,
// evidence dates, user answers, nationality, or any questionnaire's scoring data.
const europe = codes("AUT BEL BGR HRV CYP CZE DNK EST FIN FRA DEU GRC HUN IRL ITA LVA LTU LUX MLT NLD POL PRT ROU SVK SVN ESP SWE NOR ISL CAN")
const atlantic = [...europe, ...codes("USA GBR TUR ALB MNE MKD JPN KOR AUS NZL PHL")]
const continental = codes("CHN RUS BLR IRN PRK PAK")
const independent = codes("IND IDN BRA ZAF MEX NGA KEN ETH EGY SAU ARE ARG CHL COL PER BGD LKA VNM MYS THA SGP FJI VUT WSM TON")
const without = (list: string[], excluded: string[]) => list.filter(code => !excluded.includes(code))
function shot(id: string, title: string, titleZh: string, blue: string[], red: string[], outside: string[], rationale: string): AuthoredScene {
  const assigned = new Set([...blue, ...red, ...outside])
  return { kind: "imagined", id, title, titleZh, rationale, groups: [
    { color: "blue", countries: blue }, { color: "red", countries: red }, { color: "gold", countries: outside },
    { color: "muted", countries: SUPPORTED_PLACES.map(place => place.code).filter(code => !assigned.has(code)) },
  ] }
}

/** Private editorial rationale stays in this authoring module; route props use
 * getRootGlobeScenes, which sends only the titled, complete fictional states. */
export const AUTHORED_ALIGNMENTS: readonly AuthoredScene[] = [
  shot("atlantic-pacific", "Atlantic / Pacific", "大西洋与太平洋", atlantic, continental, independent,
    "A familiar visual starting point for fiction: a transatlantic and Pacific grouping faces a continental grouping. These are invented selections, not a present treaty inventory."),
  shot("european-autonomy", "European autonomy", "欧洲自主", without(atlantic, europe), continental, [...independent, ...europe],
    "European states and Canada leave the original grouping to pursue separate arrangements. Yellow places share no implied organization; the UK remains in blue for this shot."),
  shot("british-reassessment", "Britain reconsiders", "英国重新选择", without(atlantic, [...europe, "GBR"]), continental, [...independent, ...europe, "GBR"],
    "Britain follows the earlier European and Canadian departures after a separate political decision. The grouping changes in an institutional sequence, not all at once."),
  shot("continental-pivot", "A continental pivot", "转向大陆", without(atlantic, [...europe, "GBR", "TUR"]), [...continental, "TUR"], [...independent, ...europe, "GBR"],
    "Türkiye joins the continental grouping in a fictional bargain over energy access and regional security. This is a discrete authored policy choice, not a forecast."),
  shot("turkish-realignment", "Türkiye re-aligns", "土耳其再次调整", without(atlantic, [...europe, "GBR"]), continental, [...independent, ...europe, "GBR"],
    "The bargain fails to meet Türkiye's security requirements; it returns to the blue grouping through a new access agreement. This follows a full scene of the earlier alignment."),
  shot("pacific-compact", "Pacific compact", "太平洋协约", codes("CHN KOR IDN MYS SGP THA VNM AUS NZL PAK"), codes("USA GBR RUS BLR IRN PRK PHL"), [...europe, ...codes("JPN TUR ALB MNE MKD IND BRA ZAF MEX NGA KEN ETH EGY SAU ARE ARG CHL COL PER BGD LKA FJI VUT WSM TON")],
    "A different Pacific order pairs China with a regional compact while the US belongs to the red grouping and Japan stays outside both. It deliberately reverses the familiar opening."),
  shot("middle-power-arrangements", "Middle-power arrangements", "中等强国的安排", codes("IND BGD LKA IDN KEN TZA ZAF BRA ARG CHL MEX"), codes("CHN PAK NGA ETH EGY DZA COL PER VEN"), [...europe, ...codes("USA GBR JPN KOR AUS NZL RUS TUR IRN SAU ARE MYS SGP THA VNM FJI VUT WSM TON")],
    "One fictional arrangement links South Asian industrial access, East and Southern African transport, and Latin American food and minerals. A competing arrangement pursues different financing and procurement terms. It gives these regions choices with consequences rather than leaving them as scenery."),
  shot("fragmentation", "Fragmented arrangements", "分散的安排", codes("IND KEN BRA AUS"), codes("CHN PAK ETH PER"), without(SUPPORTED_PLACES.map(p => p.code), codes("IND KEN BRA AUS CHN PAK ETH PER GRL ATA FLK NCL PRI")),
    "The broad arrangements dissolve into a few narrower commitments. Most displayed places remain outside either grouping; yellow does not turn them into a single third bloc."),
  shot("renewed-commitments", "Renewed commitments", "重新作出的承诺", without(atlantic, codes("CAN GBR JPN KOR AUS NZL PHL")), continental, [...independent, ...codes("CAN GBR JPN KOR AUS NZL PHL")],
    "A European and US core reassembles before Canada, Britain and Pacific partners rejoin at the opening. This provides a staged return instead of an unexplained reset."),
]

export function getRootGlobeScenes(locale: Locale): AlignmentScene[] {
  return AUTHORED_ALIGNMENTS.map(({ kind, id, title, titleZh, groups }) => ({ kind, id, title: locale === "zh-Hans" ? titleZh : title, groups }))
}
export const ROOT_GLOBE_SCENES = getRootGlobeScenes("en")
