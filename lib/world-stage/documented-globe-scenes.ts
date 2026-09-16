import countries from "@/lib/world-stage/data/world-countries-110m.json" with { type: "json" }
import smallPlaces from "@/lib/world-stage/data/world-small-places-110m.json" with { type: "json" }

export type DocumentedGlobeScene = {
  id: string
  question: string
  kind: "Geographic focus" | "Dated relationship"
  date?: string
  groups: Array<{ label: string; color: "gold" | "blue" | "amber"; countries: string[] }>
  sources: Array<{ title: string; url: string }>
  note?: string
  places?: string[]
}
/** Membership lists checked against the linked official directories on
 * 16 September 2026. Derive the disjoint display groups from these two sets. */
export const EU_MEMBERS = "AUT BEL BGR HRV CYP CZE DNK EST FIN FRA DEU GRC HUN IRL ITA LVA LTU LUX MLT NLD POL PRT ROU SVK SVN ESP SWE".split(" ")
export const NATO_MEMBERS = "ALB BEL BGR CAN HRV CZE DNK EST FIN FRA DEU GRC HUN ISL ITA LVA LTU LUX MNE NLD MKD NOR POL PRT ROU SVK SVN ESP SWE TUR GBR USA".split(" ")
export const RCEP_SIGNATORIES = "AUS BRN KHM CHN IDN JPN KOR LAO MYS MMR NZL PHL SGP THA VNM".split(" ")
const eu = new Set(EU_MEMBERS), nato = new Set(NATO_MEMBERS)

/** Literal evidence records, available only in documented-map mode. */
export const DOCUMENTED_GLOBE_SCENES: DocumentedGlobeScene[] = [
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
  { id: "rcep-signing", question: "Which governments signed RCEP in 2020?", kind: "Dated relationship", date: "Signed: 15 Nov 2020",
    groups: [{ label: "RCEP signatories", color: "blue", countries: RCEP_SIGNATORIES }],
    sources: [
      { title: "Australian Border Force · RCEP signing and entry into force", url: "https://www.abf.gov.au/importing-exporting-and-manufacturing/fta/free-trade-agreements/regional-comprehensive-economic-partnership-agreement" },
      { title: "Australian Department of Foreign Affairs and Trade · RCEP", url: "https://www.dfat.gov.au/trade/agreements/in-force/rcep" },
    ],
    note: "All fifteen governments signed the Regional Comprehensive Economic Partnership on 15 November 2020. This records signing, not simultaneous entry into force or present ASEAN membership. Myanmar’s signing does not establish implementation in any particular trading relationship. Sources checked 16 September 2026. Singapore uses a point.",
  },
]

const placeNames = new Map([...countries.features, ...smallPlaces.features].map(feature => [feature.properties.iso3, feature.properties.name]))
for (const scene of DOCUMENTED_GLOBE_SCENES) scene.places = [...new Set(scene.groups.flatMap(group => group.countries))].map(code => placeNames.get(code) ?? code)

const chineseQuestions: Record<string, string> = {
  "eu-nato": "哪些国家同时加入欧盟和北约？",
  "rcep-signing": "哪些政府在2020年签署了RCEP？",
}
const chineseLabels: Record<string, string> = {
  "Both EU and NATO": "欧盟和北约成员", "EU only": "仅欧盟成员", "NATO only": "仅北约成员",
  "RCEP signatories": "RCEP签署国",
}
const chineseNotes: Record<string, string> = {
  "eu-nato": "2026年9月16日核对官方名单：欧盟有27个成员国，北约有32个；23国同时加入两者，4国仅加入欧盟，9国仅加入北约。填色按底图的ISO3国家要素（含合并的多边形）标识成员国，不表示条约在各领土的适用范围。具有独立代码的属地不继承成员国的颜色。马耳他以点表示。这是成员资格的日期快照，并非全球联盟数据库。",
  "rcep-signing": "15国政府于2020年11月15日签署《区域全面经济伙伴关系协定》。这里记录签署情况，不表示同时生效，也不是当前东盟成员名单。缅甸签署协定不代表协定已在某一具体双边贸易关系中实施。来源于2026年9月16日核对。新加坡以点表示。",

}
export function getDocumentedGlobeScenes(locale: "en" | "zh-Hans") {
  return locale === "en" ? DOCUMENTED_GLOBE_SCENES : DOCUMENTED_GLOBE_SCENES.map(scene => ({
    ...scene, question: chineseQuestions[scene.id],
    date: scene.id === "eu-nato" ? "成员资格快照：2026年9月16日" : scene.id === "rcep-signing" ? "签署日期：2020年11月15日" : scene.date,
    note: chineseNotes[scene.id] ?? (scene.kind === "Geographic focus" ? "所列地点为地理选取范围。多边形数据于2026年7月14日获取，小型地域点于2026年9月16日获取，均来自同一固定版本的Natural Earth数据。" : scene.note),
    groups: scene.groups.map(group => ({ ...group, label: chineseLabels[group.label] })),
  }))
}
