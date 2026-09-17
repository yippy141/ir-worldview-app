import countries from "@/lib/world-stage/data/world-countries-110m.json" with { type: "json" }
import smallPlaces from "@/lib/world-stage/data/world-small-places-110m.json" with { type: "json" }
import type { Locale } from "@/i18n/routing"

import type { AlignmentColor, AlignmentScene } from "./globe-types"
export type { AlignmentScene } from "./globe-types"
type AuthoredScene = Omit<AlignmentScene, "groups"> & { titleZh: string; rationale: string; groups: Array<AlignmentScene["groups"][number] & { labelZh: string }> }

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
const arrangements = {
  maritime: ["Maritime accord", "海洋协约"], continental: ["Continental pact", "大陆协定"],
  pacific: ["Pacific compact", "太平洋协约"], counterweight: ["Counterweight pact", "制衡协定"],
  access: ["Trade-access accord", "贸易准入协约"], procurement: ["Procurement pact", "采购协定"],
  climate: ["Coastal resilience accord", "海岸韧性协约"], inland: ["Inland adaptation pact", "内陆适应协定"],
  energy: ["Energy-transition accord", "能源转型协约"], exporters: ["Producer compact", "生产国协约"],
  digital: ["Shared digital standards", "共同数字标准"], sovereign: ["National networks pact", "自主网络协定"],
  food: ["Food-security accord", "粮食安全协约"], water: ["Water-sharing pact", "水资源共享协定"],
  arctic: ["Arctic cooperation accord", "北极合作协约"], routes: ["Southern shipping pact", "南方航运协定"],
  localAccess: ["Access agreements", "准入协议"], localSupply: ["Supply agreements", "供应协议"],
} as const
type Arrangement = keyof typeof arrangements
function shot(id: string, title: string, titleZh: string, blue: string[], red: string[], outside: string[], rationale: string,
  identities: [Arrangement, Arrangement] = ["maritime", "continental"], palette: [AlignmentColor, AlignmentColor] = ["blue", "red"]): AuthoredScene {
  const assigned = new Set([...blue, ...red, ...outside])
  return { kind: "imagined", id, title, titleZh, rationale, groups: [
    ...[blue, red].map((members, index) => ({ id: identities[index], label: arrangements[identities[index]][0], labelZh: arrangements[identities[index]][1], color: palette[index], countries: members })),
    { id: "outside", label: "Outside these arrangements", labelZh: "在这些安排之外", color: "gold", countries: outside },
    { id: "unassigned", label: "Unassigned in this scene", labelZh: "此场景未分配", color: "muted", countries: SUPPORTED_PLACES.map(place => place.code).filter(code => !assigned.has(code)) },
  ] }
}

/** Private editorial rationale stays in this authoring module; route props use
 * getRootGlobeScenes, which sends only the titled, complete fictional states. */
export const AUTHORED_ALIGNMENTS: readonly AuthoredScene[] = [
  shot("atlantic-pacific", "Atlantic / Pacific", "大西洋与太平洋", atlantic, continental, independent,
    "A familiar visual starting point for fiction: a transatlantic and Pacific grouping faces a continental grouping. These are invented selections, not a present treaty inventory."),
  shot("european-autonomy", "European autonomy", "欧洲自主", without(atlantic, europe), continental, [...independent, ...europe],
    "European states and Canada pursue separate arrangements. The maritime accord is now red, and the continental pact blue; the named identities survive the palette reversal. Europe turning gold and Russia blue are visible early in the eastward camera view.", ["maritime", "continental"], ["red", "blue"]),
  { kind: "imagined", id: "one-earth", title: "One Earth", titleZh: "一个地球", internalBorders: "faint",
    rationale: "A single hypothetical worldwide authority includes every supported place. Faint internal borders distinguish subdivisions without inventing different sovereignties or changing the ocean. This premise implies no endorsement.",
    groups: [{ id: "worldwide-authority", label: "Worldwide authority", labelZh: "全球共同当局", color: "blue", countries: SUPPORTED_PLACES.map(place => place.code) }] },
  shot("pacific-compact", "Pacific compact", "太平洋协约", codes("CHN KOR IDN MYS SGP THA VNM AUS NZL PAK"), codes("USA GBR RUS BLR IRN PRK PHL"), [...europe, ...codes("JPN TUR ALB MNE MKD IND BRA ZAF MEX NGA KEN ETH EGY SAU ARE ARG CHL COL PER BGD LKA FJI VUT WSM TON")],
    "A Pacific compact includes China while the US belongs to a counterweight pact and Japan remains outside both. The changed Pacific arrangement appears early in the sequence; the camera clock is independent.", ["pacific", "counterweight"]),
  shot("british-reassessment", "Britain reconsiders", "英国重新选择", without(atlantic, [...europe, "GBR"]), continental, [...independent, ...europe, "GBR"],
    "Britain follows the European and Canadian departures after a separate political decision. The maritime accord remains red and the continental pact blue, as in European autonomy.", ["maritime", "continental"], ["red", "blue"]),
  shot("continental-pivot", "A continental pivot", "转向大陆", without(atlantic, [...europe, "GBR", "TUR"]), [...continental, "TUR"], [...independent, ...europe, "GBR"],
    "Türkiye joins the blue continental pact in a fictional bargain over energy access and regional security. This is a discrete authored policy choice, not a forecast.", ["maritime", "continental"], ["red", "blue"]),
  shot("turkish-realignment", "Türkiye re-aligns", "土耳其再次调整", without(atlantic, [...europe, "GBR"]), continental, [...independent, ...europe, "GBR"],
    "The continental bargain fails to meet Türkiye's security requirements; it returns to the red maritime accord through a new access agreement after a full scene of the earlier alignment.", ["maritime", "continental"], ["red", "blue"]),
  shot("middle-power-arrangements", "Middle-power arrangements", "中等强国的安排", codes("IND BGD LKA IDN KEN TZA ZAF BRA ARG CHL MEX"), codes("CHN PAK NGA ETH EGY DZA COL PER VEN"), [...europe, ...codes("USA GBR JPN KOR AUS NZL RUS TUR IRN SAU ARE MYS SGP THA VNM FJI VUT WSM TON")],
    "A trade-access accord links South Asian industry, East and Southern African transport, and Latin American food and minerals. A procurement pact pursues different financing terms. These regions make distinct institutional choices.", ["access", "procurement"]),
  shot("coastal-resilience", "Coasts in common", "海岸的共同选择", codes("GBR NLD BGD VNM IDN PHL JPN FJI VUT WSM TON"), codes("IND CHN KAZ MNG ETH BOL PRY"), without(SUPPORTED_PLACES.map(p => p.code), codes("GBR NLD BGD VNM IDN PHL JPN FJI VUT WSM TON IND CHN KAZ MNG ETH BOL PRY GRL ATA FLK")),
    "Coastal governments organize around flood protection while an inland group shares drought-resilient infrastructure. These invented memberships illustrate issue-specific cooperation.", ["climate", "inland"]),
  shot("energy-bargains", "New energy bargains", "新的能源交易", codes("DEU DNK ESP MAR CHL AUS KOR JPN"), codes("SAU ARE QAT NOR CAN BRA NGA DZA"), without(SUPPORTED_PLACES.map(p => p.code), codes("DEU DNK ESP MAR CHL AUS KOR JPN SAU ARE QAT NOR CAN BRA NGA DZA GRL ATA FLK")),
    "A renewable-energy agreement and a producer compact cross familiar security alignments. Neither grouping asserts current membership or a forecast.", ["energy", "exporters"]),
  shot("digital-borders", "Different digital rules", "不同的数字规则", codes("FRA DEU EST FIN IND KEN BRA JPN"), codes("USA CHN RUS IRN SAU VNM"), without(SUPPORTED_PLACES.map(p => p.code), codes("FRA DEU EST FIN IND KEN BRA JPN USA CHN RUS IRN SAU VNM GRL ATA FLK")),
    "Some states agree on shared digital standards; another fictional grouping prioritizes nationally controlled networks. The named arrangements do not describe present national policies.", ["digital", "sovereign"]),
  shot("food-and-water", "Food and water", "粮食与水", codes("ARG BRA CAN UKR AUS KEN EGY BGD"), codes("IND PAK CHN NPL BTN ETH SDN UGA"), without(SUPPORTED_PLACES.map(p => p.code), codes("ARG BRA CAN UKR AUS KEN EGY BGD IND PAK CHN NPL BTN ETH SDN UGA GRL ATA FLK")),
    "Food importers and exporters share reserve arrangements while another group bargains over water. Fictional agreements show dependencies that cut across military blocs.", ["food", "water"]),
  shot("polar-routes", "Routes across the poles", "穿越极地的航线", codes("CAN USA RUS NOR DNK ISL FIN SWE"), codes("CHL ARG ZAF AUS NZL SGP IDN"), without(SUPPORTED_PLACES.map(p => p.code), codes("CAN USA RUS NOR DNK ISL FIN SWE CHL ARG ZAF AUS NZL SGP IDN GRL ATA FLK")),
    "An invented Arctic navigation accord brings rival powers together; a southern shipping group develops alternatives. It is a geographic thought experiment, not a claim about legal control or current access.", ["arctic", "routes"]),
  shot("fragmentation", "Fragmented arrangements", "分散的安排", codes("IND KEN BRA AUS"), codes("CHN PAK ETH PER"), without(SUPPORTED_PLACES.map(p => p.code), codes("IND KEN BRA AUS CHN PAK ETH PER GRL ATA FLK NCL PRI")),
    "The broad arrangements dissolve into narrower access and supply agreements. Most places remain outside both; yellow does not turn them into a single third bloc.", ["localAccess", "localSupply"]),
  shot("renewed-commitments", "Renewed commitments", "重新作出的承诺", without(atlantic, codes("CAN GBR JPN KOR AUS NZL PHL")), continental, [...independent, ...codes("CAN GBR JPN KOR AUS NZL PHL")],
    "A European and US core reassembles before Canada, Britain and Pacific partners rejoin at the opening. This provides a staged return instead of an unexplained reset."),
]

export function getRootGlobeScenes(locale: Locale): AlignmentScene[] {
  return AUTHORED_ALIGNMENTS.map(({ kind, id, title, titleZh, groups, internalBorders }) => ({ kind, id, title: locale === "zh-Hans" ? titleZh : title,
    ...(internalBorders ? { internalBorders } : {}), groups: groups.map(({ labelZh, ...group }) => ({ ...group, label: locale === "zh-Hans" ? labelZh : group.label })) }))
}
export const ROOT_GLOBE_SCENES = getRootGlobeScenes("en")
