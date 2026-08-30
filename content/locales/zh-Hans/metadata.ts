import {
  zhHansCurrentCases,
  zhHansCurrentCaseBySlug,
} from "@/content/locales/zh-Hans/current-cases/index"
import type { ZhHansMetadata } from "@/content/locales/zh-Hans/types"
import {
  zhHansWorldviewProfileById,
  zhHansWorldviewProfiles,
} from "@/content/locales/zh-Hans/worldview-profiles"

export const zhHansSiteMetadata = {
  publicTitle: "国际关系世界观清单",
  formalTitle: "国际关系世界观清单",
  socialShorthand: "IR Worldview Inventory",
  byline: "JinHua Yip 制作",
  author: "JinHua Yip",
  defaultDescription: "梳理你在世界政治问题上依赖的论证，检验具体判断，并比较不同国际关系传统与决策模式。",
} as const

export const zhHansRouteMetadata = {
  home: {
    title: "国际关系世界观清单",
    description: "梳理你的外交政策判断，在具体情境中检验它们，并比较不同传统与决策模式背后的论证。",
    openGraph: {
      type: "website",
      title: "国际关系世界观清单",
      description: "从一项当前判断或七维基础画像出发，比较你反复依赖的国际关系论证。",
    },
  },
  worldStage: {
    title: "世界舞台｜国际关系世界观清单",
    description: "打开完整地理地图，查阅已经审阅的来源与图层，并进入当前或近期案例。",
    openGraph: {
      type: "website",
      title: "世界舞台｜国际关系世界观清单",
      description: "在完整地图上查阅图层、来源与证据时间窗，并进入当前或近期案例。",
    },
  },
  about: {
    title: "关于｜国际关系世界观清单",
    description: "了解国际关系世界观清单的用途、使用路径和编辑边界。",
    openGraph: {
      type: "website",
      title: "关于国际关系世界观清单",
      description: "这是一项用于整理外交政策判断的编辑型互动工具，不是固定身份分类或人群排名。",
    },
  },
  methods: {
    title: "方法与局限｜国际关系世界观清单",
    description: "了解基础画像、议题专题、情境推演、世界观地图、公开立场编码及主要局限。",
    openGraph: {
      type: "website",
      title: "方法与局限｜国际关系世界观清单",
      description: "查看七维画像如何生成，哪些设置来自编辑判断，以及这项工具不能诚实主张什么。",
    },
  },
  privacy: {
    title: "隐私与数据使用｜国际关系世界观清单",
    description: "了解本工具如何处理本地结果、分享链接、粗粒度产品分析和研究数据。",
    openGraph: {
      type: "website",
      title: "隐私与数据使用｜国际关系世界观清单",
      description: "除非你主动分享，结果和判断历史只保存在当前浏览器。",
    },
  },
  corrections: {
    title: "勘误与联系｜国际关系世界观清单",
    description: "提交事实勘误、隐私问题或安全报告，同时避免发送结果数据。",
    openGraph: {
      type: "website",
      title: "勘误与联系｜国际关系世界观清单",
      description: "报告公开页面中的事实、隐私或安全问题。",
    },
  },
  cases: {
    title: "当前案例｜国际关系世界观清单",
    description: "先判断一项有来源依据的国际事务，再用相互竞争的世界观读法检验这项判断。",
    openGraph: {
      type: "website",
      title: "当前案例｜国际关系世界观清单",
      description: "阅读证据，作出初步判断，再用不同读法和一项假设变化检验它。",
    },
  },
  worldviewMap: {
    title: "世界观地图｜国际关系世界观清单",
    description: "在同一套投影上比较你的基线、编辑型决策模式、情境变化和按来源编码的公开立场。",
    openGraph: {
      type: "website",
      title: "世界观地图｜国际关系世界观清单",
      description: "把个人基线、编辑型决策模式和有来源的公开立场放在同一张地图上比较。",
    },
  },
  publicPositions: {
    title: "思想家与公开立场｜国际关系世界观清单",
    description: "浏览思想家、政策原则和治理思潮的公开立场；每条记录都根据有日期的来源编码。",
    openGraph: {
      type: "website",
      title: "思想家与公开立场｜国际关系世界观清单",
      description: "查看证据时间窗、各维度支持、原始来源、有争议的读法和修订记录。",
    },
  },
} as const satisfies Record<string, ZhHansMetadata>

export const zhHansCurrentCaseMetadata = Object.fromEntries(
  zhHansCurrentCases.map((record) => [
    record.slug,
    {
      title: `${record.title}｜当前案例`,
      description: record.dek,
      openGraph: {
        type: "article" as const,
        title: record.title,
        description: record.dek,
      },
      twitter: {
        card: "summary_large_image" as const,
        title: record.title,
        description: record.dek,
      },
    },
  ]),
)

export const zhHansWorldviewProfileMetadata = Object.fromEntries(
  zhHansWorldviewProfiles.map((profile) => [
    profile.id,
    {
      title: `${profile.publicName}｜决策模式｜国际关系世界观清单`,
      description: `${profile.decisionRule}${profile.cardSummary}`,
      openGraph: {
        type: "article" as const,
        title: `${profile.publicName}｜决策模式`,
        description: profile.cardSummary,
      },
    },
  ]),
)

export const zhHansOpenGraphImageCopy = {
  case: (slug: string) => {
    const record = zhHansCurrentCaseBySlug[slug]
    if (!record) {
      return {
        alt: "国际关系世界观清单当前案例",
        brand: "国际关系世界观清单",
        eyebrow: "当前案例 · 世界政治",
        title: "当前案例",
        decision: "先作出判断，再阅读比较。",
        footer: "先读证据，再作判断。",
        sourceCount: "编辑型互动",
      }
    }

    const category = {
      security: "安全",
      "economic-statecraft": "经济治国方略",
      "institutions-and-governance": "制度与治理",
    }[record.category]

    return {
      alt: `国际关系世界观清单当前案例：${record.title}`,
      brand: "国际关系世界观清单",
      eyebrow: `当前案例 · ${category}`,
      title: record.title,
      decision: record.decision.prompt,
      footer: "先读证据，再作判断。",
      sourceCount: `${record.sources.length} 个直接来源`,
    }
  },
  worldviewProfile: (id: string) => {
    const profile = zhHansWorldviewProfileById[id]
    return profile
      ? {
          alt: `决策模式：${profile.publicName}`,
          brand: "国际关系世界观清单",
          eyebrow: "决策模式",
          title: profile.publicName,
          description: profile.decisionRule,
          footer: "编辑型阅读辅助，不是个人身份。",
        }
      : null
  },
} as const
