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
  primaryNavigationLabel: "Primary destinations",
  destinationCopy: {
    inventory: {
      label: "Inventory",
      explanation:
        "Start with the Foundation when the site is new to you. It asks fourteen broad questions about recurring disputes in international politics. Security, Technology and AI Governance then test whether the same habits hold once the policy problem becomes more specific.",
    },
    "world-stage": {
      label: "World Stage",
      explanation:
        "The case library and full map sit here. Each case is tied to a defined evidence window and asks for one decision without pretending that the record is complete.",
    },
    atlas: {
      label: "Atlas",
      explanation:
        "Use the Atlas to compare the four traditions modeled by the Foundation with thinkers, Decision Patterns and dated public positions. These are reference points, not identities assigned to the reader.",
    },
    "perspective-runs": {
      label: "Perspective Runs",
      explanation:
        "Perspective Runs ask how the same baseline changes when the reader is placed inside another actor’s constraints. They remain separate from the Foundation.",
    },
    profile: {
      label: "Profile",
      explanation:
        "Saved results remain on this device. Profile keeps the Foundation, domain inventories and Perspective Runs as separate records and shows only relationships the project has reviewed.",
    },
  },
  localState: {
    heading: "On this device",
    newDevice: "No saved Foundation, domain record or Perspective Run is present on this device.",
    foundationOnly: "A Foundation read is saved on this device.",
    draftOnly: "An unfinished Foundation draft has {{count}} {{answerLabel}} on this device.",
    returningTemplate: "This device has {{items}}.",
    separator: ", ",
    foundationRecord: "a saved Foundation read",
    domainRecords: "{{count}} saved domain {{recordLabel}}",
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
  primaryNavigationLabel: "主要入口",
  destinationCopy: {
    inventory: {
      label: "问卷",
      explanation:
        "如果你第一次来到这里，请先完成基础问卷。十四道问题涵盖国际政治中反复出现的广泛争议。安全、技术与人工智能治理问卷则进一步检验：当政策问题变得更具体时，你是否仍会采用相近的判断方式。",
    },
    "world-stage": {
      label: "世界舞台",
      explanation:
        "案例库与完整地图都在这里。每个案例都有明确的证据时间窗，并要求你就一个具体问题作出判断，同时承认证据记录并不完整。",
    },
    atlas: {
      label: "图谱",
      explanation:
        "图谱把基础问卷所建模的四种传统，与思想家、决策模式和带日期的公开立场放在一起比较。这些内容是参照点，不是系统替读者指定的身份。",
    },
    "perspective-runs": {
      label: "情境推演",
      explanation:
        "情境推演把读者置于另一行动者的约束之中，观察同一条基线会如何变化。推演结果始终与基础画像分开保存。",
    },
    profile: {
      label: "档案",
      explanation:
        "已保存的结果只留在这台设备上。档案会分别保留基础画像、各领域问卷和情境推演，并且只展示本项目已经审阅过的关系。",
    },
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
