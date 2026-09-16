import { sectionLabel } from "@/lib/navigation"
import type { Locale } from "@/i18n/routing"
import type { RootDestinationId } from "@/lib/root/destinations"

type DestinationCopy = Readonly<{
  label: string
  explanation: string
}>

export type RootCopy = Readonly<{
  brand: string
  brandAriaLabel: string
  heading: string
  introduction: string
  enter: string
  menu: string
  map: string
  independent: string
  primaryNavigationLabel: string
  destinationCopy: Readonly<Record<RootDestinationId, DestinationCopy>>
  localState: Readonly<{
    heading: string
    newDevice: string
    foundationOnly: string
    draftOnly: string
    returningTemplate: string
    separator: string
    foundationRecord: string
    domainRecords: string
    perspectiveRuns: string
    unfinishedDraft: string
  }>
  utilityLinks: ReadonlyArray<Readonly<{ label: string; href: string }>>
}>

const englishRootCopy: RootCopy = {
  brand: "IR Worldview Inventory",
  brandAriaLabel: "IR Worldview Inventory home",
  heading: "Choose where to start.",
  introduction: "Explore your views on international politics, technology and possible futures.",
  enter: "Enter", menu: "Main menu", map: "Explore the map", independent: "Every questionnaire is independent.",
  primaryNavigationLabel: "Primary destinations",
  destinationCopy: {
    questionnaires: { label: sectionLabel("questionnaires"), explanation: "Foundation covers international politics. Security, Technology and AI Governance examine specific policy choices." },
    futures: { label: sectionLabel("futures"), explanation: "Browse scenarios, answer preferences and compare possible worlds." },
    cases: { label: sectionLabel("cases"), explanation: "Examine a case, make a decision, or answer from another actor’s position." },
    library: { label: sectionLabel("library"), explanation: "Explore traditions, thinkers and the arguments behind the results." },
    profile: { label: sectionLabel("profile"), explanation: "Open your saved results." },
  },
  localState: {
    heading: "On this device",
    newDevice: "Nothing is saved on this device yet.",
    foundationOnly: "A Foundation result is saved on this device.",
    draftOnly: "An unfinished Foundation draft has {{count}} {{answerLabel}} on this device.",
    returningTemplate: "This device has {{items}}.",
    separator: ", ",
    foundationRecord: "a saved Foundation result",
    domainRecords: "{{count}} saved Security, Technology or AI {{recordLabel}}",
    perspectiveRuns: "{{count}} saved Perspective {{runLabel}}",
    unfinishedDraft: "an unfinished draft with {{count}} answers",
  },
  utilityLinks: [
    { label: "Method", href: "/method" },
    { label: "About", href: "/about" },
    { label: "Privacy", href: "/privacy" },
  ],
}

const chineseRootCopy: RootCopy = {
  brand: "国际关系世界观清单",
  brandAriaLabel: "返回国际关系世界观清单首页",
  heading: "选择一个起点。",
  introduction: "探索你对国际政治、技术与可能未来的看法。",
  enter: "进入", menu: "主菜单", map: "探索地图", independent: "每份问卷都可独立完成。",
  primaryNavigationLabel: "主要入口",
  destinationCopy: {
    questionnaires: { label: sectionLabel("questionnaires", "zh-Hans"), explanation: "基础问卷探讨国际政治。安全、技术与人工智能治理问卷考察具体的政策选择。" },
    futures: { label: sectionLabel("futures", "zh-Hans"), explanation: "浏览情景、回答偏好问题，并比较不同的可能世界。" },
    cases: { label: sectionLabel("cases", "zh-Hans"), explanation: "研究案例、作出决定，或从另一行动者的立场回答问题。" },
    library: { label: sectionLabel("library", "zh-Hans"), explanation: "探索不同传统、思想家和结果背后的论点。" },
    profile: { label: sectionLabel("profile", "zh-Hans"), explanation: "查看已保存的结果。" },
  },
  localState: {
    heading: "此设备上的记录",
    newDevice: "此设备尚未保存基础画像、领域记录或情境推演。",
    foundationOnly: "此设备已保存一份基础画像。",
    draftOnly: "此设备上有一份尚未完成的基础问卷，已回答 {{count}} 题。",
    returningTemplate: "此设备保存了{{items}}。",
    separator: "、",
    foundationRecord: "一份基础画像",
    domainRecords: "{{count}} 份领域记录",
    perspectiveRuns: "{{count}} 份情境推演",
    unfinishedDraft: "一份已回答 {{count}} 题的未完成问卷",
  },
  utilityLinks: [
    { label: "方法", href: "/method" },
    { label: "关于", href: "/about" },
    { label: "隐私", href: "/privacy" },
  ],
}

export const ROOT_COPY_BY_LOCALE = {
  en: englishRootCopy,
  "zh-Hans": chineseRootCopy,
} as const satisfies Record<Locale, RootCopy>

export function getRootCopy(locale: Locale): RootCopy {
  return ROOT_COPY_BY_LOCALE[locale]
}

export function getGlobeCopy(locale: Locale) {
  return locale === "zh-Hans" ? {
    label: "想象中的阵营", drag: "拖动以旋转", pause: "暂停", play: "播放", reset: "重置视角", zoomIn: "放大地图", zoomOut: "缩小地图",
    previous: "上一场景", next: "下一场景", globe: "可旋转的想象阵营地球仪", instructions: "方向键旋转，加减键缩放，Home重置。Tab离开地图。滚轮仅在地图获得焦点时缩放。",
    about: "关于这张地图", inspect: "查看地点", choose: "选择地点", ocean: "此处未标示地点", mapLink: "有来源的地图与记录",
    explanation: "这是创作的可能阵营。名称标识各项安排；不同场景的配色可以变化。标为安排之外的地区并不因此结盟。“一个地球”设想一个全球共同当局。",
    geometry: "Natural Earth底图包含174个多边形要素，并以点补充部分小型地域。仍有领土与岛屿缺失；点的大小不代表影响力。边界沿用底图，不表达主权立场。",
    attribution: "地理数据与边界说明", reduced: "已启用减少动态效果；可使用手动控制。",
    groups: { blue: "蓝色阵营", red: "红色阵营", gold: "不属于任一阵营", muted: "此场景未分配" },
    west: "向西旋转", east: "向东旋转", north: "向北旋转", south: "向南旋转",
  } : {
    label: "Imagined alignments", drag: "Drag to rotate", pause: "Pause", play: "Play", reset: "Reset view", zoomIn: "Zoom globe in", zoomOut: "Zoom globe out",
    previous: "Previous globe scene", next: "Next globe scene", globe: "Rotatable globe of imagined alignments", instructions: "Arrow keys rotate, plus and minus zoom, Home resets. Tab leaves the globe. Wheel zoom works only while the globe is focused.",
    about: "About this map", inspect: "Inspect a place", choose: "Choose a place", ocean: "No place is marked here", mapLink: "Documented maps and sources",
    explanation: "Authored possible alignments. Names identify each arrangement; colors can change between scenes. Places marked outside share no implied alliance. One Earth imagines a single worldwide authority.",
    geometry: "The Natural Earth basemap has 174 polygon features, with points for some small places. Some territories and islands are absent. Point size does not encode influence. Boundaries follow the basemap and express no position on sovereignty.",
    attribution: "Geometry and boundary notes", reduced: "Reduced motion is on; manual controls are available.",
    groups: { blue: "Blue grouping", red: "Red grouping", gold: "Outside either", muted: "Unassigned in this scene" },
    west: "Rotate west", east: "Rotate east", north: "Rotate north", south: "Rotate south",
  }
}
