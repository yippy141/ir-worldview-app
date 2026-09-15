import countries from "@/lib/world-stage/data/world-countries-110m.json" with { type: "json" }
import smallPlaces from "@/lib/world-stage/data/world-small-places-110m.json" with { type: "json" }
import ledger from "@/research/world-stage/scene-ledger.json" with { type: "json" }
import sources from "@/research/world-stage/source-ledger.json" with { type: "json" }

export type GlobeScene = {
  id: string
  question: string
  kind: "Geographic focus" | "Dated relationship"
  date: string
  groups: Array<{ label: string; color: "gold" | "blue" | "amber"; countries: string[] }>
  sources: Array<{ title: string; url: string }>
  note?: string
  places?: string[]
}
const geographicSource = { title: "Natural Earth 1:110m · geometry and small-place points", url: "https://www.naturalearthdata.com/downloads/110m-cultural-vectors/" }
const cited = (...ids: string[]) => sources.filter(source => ids.includes(source.sourceId)).map(({ title, url }) => ({ title, url }))
const treatyCountries = ledger.scenes.find(scene => scene.sceneId === "us_alliance_security_lens")!.countryRoles.filter(country => country.role === "formal treaty ally").map(country => country.iso3)
const geographic = (id: string, question: string, countries: string[], label: string): GlobeScene => ({
  id, question, kind: "Geographic focus", date: "Geometry: 14 Jul 2026; points: 16 Sep 2026",
  groups: [{ label, color: "gold", countries }], sources: [geographicSource],
})

/** Ordered along the visible longitudes of one slow revolution. These selections
 * are explicit questions, not a reclassification of World Stage's country roles. */
export const ROOT_GLOBE_SCENES: GlobeScene[] = [
  { id: "equipment", question: "Where does this chip network depend on European equipment?", kind: "Dated relationship", date: "2 Aug 2026",
    groups: [{ label: "ASML and ZEISS locations", color: "blue", countries: ["NLD", "DEU"] }], sources: cited("SRC33", "SRC51"), note: "Two supplier locations in the reviewed World Stage network; not a complete industry map." },
  geographic("east-africa", "Where do Ethiopia, Kenya and Tanzania sit along eastern Africa?", ["ETH", "KEN", "TZA"], "Selected geographic focus"),
  { id: "partnership", question: "Which partnership connects China and Pakistan in this record?", kind: "Dated relationship", date: "14 Jul 2026",
    groups: [{ label: "Declared strategic partnership", color: "blue", countries: ["CHN", "PAK"] }], sources: cited("SRC18"), note: "The joint statement calls this an all-weather strategic cooperative partnership." },
  geographic("southeast-asia", "How do Indonesia, Malaysia and Singapore meet around these waters?", ["IDN", "MYS", "SGP"], "Selected geographic focus"),
  { id: "treaties", question: "Which Indo-Pacific partners in this record have a U.S. defense treaty?", kind: "Dated relationship", date: "14 Jul 2026",
    groups: [{ label: "Treaty partners in this record", color: "blue", countries: treatyCountries }], sources: cited("SRC01", "SRC03", "SRC04", "SRC06"), note: "This is the reviewed Indo-Pacific selection, not a list of every U.S. treaty ally." },
  geographic("australasia", "Where are Australia and New Zealand relative to the Pacific islands?", ["AUS", "NZL", "VUT", "FJI"], "Selected geographic focus"),
  geographic("pacific-west", "Which small Pacific states need a point at this scale?", ["PLW", "FSM", "MHL", "NRU", "TUV", "KIR"], "Small-state locations"),
  geographic("pacific-central", "Where are Samoa and Tonga across the date line?", ["WSM", "TON", "FJI"], "Selected geographic focus"),
  geographic("pacific-east", "How much ocean lies between New Zealand and Chile?", ["NZL", "CHL"], "Two geographic reference points"),
  { id: "north-america", question: "Where does this record locate U.S. cloud and AI institutions?", kind: "Dated relationship", date: "14 Jul 2026",
    groups: [{ label: "U.S. institutions in this record", color: "blue", countries: ["USA"] }], sources: cited("SRC39", "SRC40", "SRC43"), note: "Country-level location only; the fill does not measure cloud capacity." },
  geographic("caribbean", "Where do Barbados and Trinidad and Tobago sit in the Caribbean?", ["BRB", "TTO"], "Small-state locations"),
  { id: "brazil", question: "Which country held the 2025 BRICS presidency?", kind: "Dated relationship", date: "1 Jan 2025",
    groups: [{ label: "2025 presidency", color: "gold", countries: ["BRA"] }], sources: cited("SRC28") },
  geographic("south-atlantic", "Where do Brazil and southern Africa face the South Atlantic?", ["BRA", "NAM", "ZAF"], "Selected geographic focus"),
  geographic("west-africa", "Where are Senegal, Ghana and Nigeria along western Africa?", ["SEN", "GHA", "NGA"], "Selected geographic focus"),
]

const placeNames = new Map([...countries.features, ...smallPlaces.features].map(feature => [feature.properties.iso3, feature.properties.name]))
for (const scene of ROOT_GLOBE_SCENES) scene.places = [...new Set(scene.groups.flatMap(group => group.countries))].map(code => placeNames.get(code) ?? code)

const chineseQuestions: Record<string, string> = {
  equipment: "这条芯片网络在哪些环节依赖欧洲设备？",
  "east-africa": "埃塞俄比亚、肯尼亚和坦桑尼亚位于东非的什么位置？",
  partnership: "这份记录中的哪种伙伴关系连接中国和巴基斯坦？",
  "southeast-asia": "印度尼西亚、马来西亚和新加坡如何在这些海域相邻？",
  treaties: "记录中的哪些印太伙伴与美国签有防务条约？",
  australasia: "澳大利亚和新西兰与太平洋岛屿的相对位置如何？",
  "pacific-west": "哪些太平洋小国在这个比例尺下需要用点表示？",
  "pacific-central": "萨摩亚和汤加位于日期变更线附近的什么位置？",
  "pacific-east": "新西兰与智利之间隔着多大的海域？",
  "north-america": "这份记录将美国的云计算与人工智能机构定位在哪里？",
  caribbean: "巴巴多斯和特立尼达和多巴哥位于加勒比海的什么位置？",
  brazil: "哪个国家担任了2025年金砖国家轮值主席国？",
  "south-atlantic": "巴西与非洲南部如何隔南大西洋相望？",
  "west-africa": "塞内加尔、加纳和尼日利亚位于西非的什么位置？",
}
const chineseLabels: Record<string, string> = {
  "ASML and ZEISS locations": "ASML与蔡司所在地", "Selected geographic focus": "选定的地理范围",
  "Declared strategic partnership": "声明中的战略伙伴关系", "Treaty partners in this record": "记录中的条约伙伴",
  "Small-state locations": "小国位置", "Two geographic reference points": "两个地理参照点",
  "U.S. institutions in this record": "记录中的美国机构", "2025 presidency": "2025年轮值主席国",
}
const chineseNotes: Record<string, string> = {
  equipment: "世界舞台已审阅网络中的两个设备供应商所在地，并非完整的产业地图。",
  partnership: "联合声明将其称为全天候战略合作伙伴关系。",
  treaties: "这是已审阅的印太范围，并非美国所有条约盟友的名单。",
  "north-america": "只标示国家层面的位置；填色不衡量云计算容量。",
}
export function getRootGlobeScenes(locale: "en" | "zh-Hans") {
  return locale === "en" ? ROOT_GLOBE_SCENES : ROOT_GLOBE_SCENES.map(scene => ({
    ...scene, question: chineseQuestions[scene.id], note: chineseNotes[scene.id],
    groups: scene.groups.map(group => ({ ...group, label: chineseLabels[group.label] })),
  }))
}
