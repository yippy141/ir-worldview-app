import countries from "@/lib/world-stage/data/world-countries-110m.json" with { type: "json" }
import smallPlaces from "@/lib/world-stage/data/world-small-places-110m.json" with { type: "json" }
import ledger from "@/research/world-stage/scene-ledger.json" with { type: "json" }
import sources from "@/research/world-stage/source-ledger.json" with { type: "json" }

export type GlobeScene = {
  id: string
  question: string
  kind: "Geographic focus" | "Dated relationship"
  date?: string
  groups: Array<{ label: string; color: "gold" | "blue" | "amber"; countries: string[] }>
  sources: Array<{ title: string; url: string }>
  note?: string
  places?: string[]
}
const geographicSource = { title: "Natural Earth 1:110m · geometry and small-place points", url: "https://www.naturalearthdata.com/downloads/110m-cultural-vectors/" }
const cited = (...ids: string[]) => sources.filter(source => ids.includes(source.sourceId)).map(({ title, url }) => ({ title, url }))
const treatyCountries = ledger.scenes.find(scene => scene.sceneId === "us_alliance_security_lens")!.countryRoles.filter(country => country.role === "formal treaty ally").map(country => country.iso3)
const geographic = (id: string, question: string, countries: string[], label: string): GlobeScene => ({
  id, question, kind: "Geographic focus",
  groups: [{ label, color: "gold", countries }], sources: [geographicSource],
  note: "The named places are a geographic selection. Polygon geometry retrieved 14 July 2026; small-place points retrieved 16 September 2026, from the same pinned Natural Earth revision.",
})

/** Membership lists checked against the linked official directories on
 * 16 September 2026. Derive the disjoint display groups from these two sets. */
export const EU_MEMBERS = "AUT BEL BGR HRV CYP CZE DNK EST FIN FRA DEU GRC HUN IRL ITA LVA LTU LUX MLT NLD POL PRT ROU SVK SVN ESP SWE".split(" ")
export const NATO_MEMBERS = "ALB BEL BGR CAN HRV CZE DNK EST FIN FRA DEU GRC HUN ISL ITA LVA LTU LUX MNE NLD MKD NOR POL PRT ROU SVK SVN ESP SWE TUR GBR USA".split(" ")
export const RCEP_SIGNATORIES = "AUS BRN KHM CHN IDN JPN KOR LAO MYS MMR NZL PHL SGP THA VNM".split(" ")
const eu = new Set(EU_MEMBERS), nato = new Set(NATO_MEMBERS)

/** Ordered along the visible longitudes of one slow revolution. These selections
 * are explicit questions, not a reclassification of World Stage's country roles. */
export const ROOT_GLOBE_SCENES: GlobeScene[] = [
  { id: "eu-nato", question: "Where do EU and NATO memberships overlap?", kind: "Dated relationship", date: "Membership snapshot: 16 Sep 2026",
    groups: [
      { label: "Both EU and NATO", color: "blue", countries: EU_MEMBERS.filter(code => nato.has(code)) },
      { label: "EU only", color: "amber", countries: EU_MEMBERS.filter(code => !nato.has(code)) },
      { label: "NATO only", color: "gold", countries: NATO_MEMBERS.filter(code => !eu.has(code)) },
    ],
    sources: [
      { title: "NATO member countries · page updated 11 March 2024", url: "https://www.nato.int/en/about-us/organization/nato-member-countries" },
      { title: "European Union · EU country directory", url: "https://european-union.europa.eu/principles-countries-history/eu-countries_en" },
      { title: "Government of the Netherlands · complete EU membership list", url: "https://www.rijksoverheid.nl/vraag-en-antwoord/europese-unie/welke-landen-horen-bij-de-europese-unie-eu" },
    ],
    note: "Official lists checked 16 September 2026: 27 EU members and 32 NATO members; 23 belong to both, four to the EU only and nine to NATO only. Fills identify countries by the basemap’s ISO3 features, including any combined polygons; they do not map the territorial application of either treaty. Separately coded dependencies do not inherit a member’s color. Malta uses a point. This is a membership snapshot, not a global alliance database.",
  },
  geographic("east-africa", "Where do Ethiopia, Kenya and Tanzania sit along eastern Africa?", ["ETH", "KEN", "TZA"], "Locations shown"),
  { id: "partnership", question: "What strategic partnership connects China and Pakistan?", kind: "Dated relationship", date: "14 Jul 2026",
    groups: [{ label: "Declared strategic partnership", color: "blue", countries: ["CHN", "PAK"] }], sources: cited("SRC18"), note: "The joint statement calls this an all-weather strategic cooperative partnership." },
  { id: "treaties", question: "Which of these Indo-Pacific partners have a U.S. defense treaty?", kind: "Dated relationship", date: "14 Jul 2026",
    groups: [{ label: "U.S. treaty partners shown", color: "blue", countries: treatyCountries }], sources: cited("SRC01", "SRC03", "SRC04", "SRC06"), note: "This is the reviewed Indo-Pacific selection, not a list of every U.S. treaty ally." },
  { id: "rcep-signing", question: "Which governments signed RCEP in 2020?", kind: "Dated relationship", date: "Signed: 15 Nov 2020",
    groups: [{ label: "RCEP signatories", color: "blue", countries: RCEP_SIGNATORIES }],
    sources: [
      { title: "Australian Border Force · RCEP signing and entry into force", url: "https://www.abf.gov.au/importing-exporting-and-manufacturing/fta/free-trade-agreements/regional-comprehensive-economic-partnership-agreement" },
      { title: "Australian Department of Foreign Affairs and Trade · RCEP", url: "https://www.dfat.gov.au/trade/agreements/in-force/rcep" },
    ],
    note: "All fifteen governments signed the Regional Comprehensive Economic Partnership on 15 November 2020. This records signing, not simultaneous entry into force or present ASEAN membership. Myanmar’s signing does not establish implementation in any particular trading relationship. Sources checked 16 September 2026. Singapore uses a point.",
  },
  geographic("australasia", "Where are Australia and New Zealand relative to the Pacific islands?", ["AUS", "NZL", "VUT", "FJI"], "Locations shown"),
  geographic("pacific-west", "Which small Pacific states need a point at this scale?", ["PLW", "FSM", "MHL", "NRU", "TUV", "KIR"], "Small-state locations"),
  geographic("pacific-central", "Where are Samoa and Tonga across the date line?", ["WSM", "TON", "FJI"], "Locations shown"),
  geographic("pacific-east", "How much ocean lies between New Zealand and Chile?", ["NZL", "CHL"], "Two geographic reference points"),
  { id: "north-america", question: "Where are the U.S. cloud and AI institutions shown here?", kind: "Dated relationship", date: "14 Jul 2026",
    groups: [{ label: "U.S. institutions shown", color: "blue", countries: ["USA"] }], sources: cited("SRC39", "SRC40", "SRC43"), note: "Selected institutions in the reviewed World Stage network. Country-level location only; the fill does not measure cloud capacity." },
  geographic("caribbean", "Where do Barbados and Trinidad and Tobago sit in the Caribbean?", ["BRB", "TTO"], "Small-state locations"),
  { id: "brazil", question: "Which country held the 2025 BRICS presidency?", kind: "Dated relationship", date: "1 Jan 2025",
    groups: [{ label: "2025 presidency", color: "gold", countries: ["BRA"] }], sources: cited("SRC28") },
  geographic("south-atlantic", "Where do Brazil and southern Africa face the South Atlantic?", ["BRA", "NAM", "ZAF"], "Locations shown"),
  geographic("west-africa", "Where are Senegal, Ghana and Nigeria along western Africa?", ["SEN", "GHA", "NGA"], "Locations shown"),
]

const placeNames = new Map([...countries.features, ...smallPlaces.features].map(feature => [feature.properties.iso3, feature.properties.name]))
for (const scene of ROOT_GLOBE_SCENES) scene.places = [...new Set(scene.groups.flatMap(group => group.countries))].map(code => placeNames.get(code) ?? code)

const chineseQuestions: Record<string, string> = {
  "eu-nato": "哪些国家同时加入欧盟和北约？",
  "east-africa": "埃塞俄比亚、肯尼亚和坦桑尼亚位于东非的什么位置？",
  partnership: "中国和巴基斯坦建立了怎样的战略伙伴关系？",
  "rcep-signing": "哪些政府在2020年签署了RCEP？",
  treaties: "这里展示的哪些印太伙伴与美国签有防务条约？",
  australasia: "澳大利亚和新西兰与太平洋岛屿的相对位置如何？",
  "pacific-west": "哪些太平洋小国在这个比例尺下需要用点表示？",
  "pacific-central": "萨摩亚和汤加位于日期变更线附近的什么位置？",
  "pacific-east": "新西兰与智利之间隔着多大的海域？",
  "north-america": "这里展示的美国云计算与人工智能机构位于哪里？",
  caribbean: "巴巴多斯和特立尼达和多巴哥位于加勒比海的什么位置？",
  brazil: "哪个国家担任了2025年金砖国家轮值主席国？",
  "south-atlantic": "巴西与非洲南部如何隔南大西洋相望？",
  "west-africa": "塞内加尔、加纳和尼日利亚位于西非的什么位置？",
}
const chineseLabels: Record<string, string> = {
  "Both EU and NATO": "欧盟和北约成员", "EU only": "仅欧盟成员", "NATO only": "仅北约成员",
  "RCEP signatories": "RCEP签署国", "Locations shown": "所示地点",
  "Declared strategic partnership": "声明中的战略伙伴关系", "U.S. treaty partners shown": "所示的美国条约伙伴",
  "Small-state locations": "小国位置", "Two geographic reference points": "两个地理参照点",
  "U.S. institutions shown": "所示的美国机构", "2025 presidency": "2025年轮值主席国",
}
const chineseNotes: Record<string, string> = {
  "eu-nato": "2026年9月16日核对官方名单：欧盟有27个成员国，北约有32个；23国同时加入两者，4国仅加入欧盟，9国仅加入北约。填色按底图的ISO3国家要素（含合并的多边形）标识成员国，不表示条约在各领土的适用范围。具有独立代码的属地不继承成员国的颜色。马耳他以点表示。这是成员资格的日期快照，并非全球联盟数据库。",
  "rcep-signing": "15国政府于2020年11月15日签署《区域全面经济伙伴关系协定》。这里记录签署情况，不表示同时生效，也不是当前东盟成员名单。缅甸签署协定不代表协定已在某一具体双边贸易关系中实施。来源于2026年9月16日核对。新加坡以点表示。",
  partnership: "联合声明将其称为全天候战略合作伙伴关系。",
  treaties: "这是已审阅的印太范围，并非美国所有条约盟友的名单。",
  "north-america": "选自世界舞台已审阅网络的机构。只标示国家层面的位置；填色不衡量云计算容量。",
}
export function getRootGlobeScenes(locale: "en" | "zh-Hans") {
  return locale === "en" ? ROOT_GLOBE_SCENES : ROOT_GLOBE_SCENES.map(scene => ({
    ...scene, question: chineseQuestions[scene.id],
    date: scene.id === "eu-nato" ? "成员资格快照：2026年9月16日" : scene.id === "rcep-signing" ? "签署日期：2020年11月15日" : scene.date,
    note: chineseNotes[scene.id] ?? (scene.kind === "Geographic focus" ? "所列地点为地理选取范围。多边形数据于2026年7月14日获取，小型地域点于2026年9月16日获取，均来自同一固定版本的Natural Earth数据。" : scene.note),
    groups: scene.groups.map(group => ({ ...group, label: chineseLabels[group.label] })),
  }))
}
