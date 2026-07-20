import type { ZhHansFoundationDraftRecord } from "@/content/locales/zh-Hans/foundation-types"

export const zhHansFoundationAnalystDraftsA = [
  {
    questionId: "an_sc3",
    chineseDraftA: {
      prompt: "大国之间长期和平，通常取决于一些可能削弱或消失的条件。",
      clarification: {
        whatItAsks: "和平是否只有在支撑条件继续存在时才能维持？",
      },
    },
    chineseDraftB: {
      prompt: "大国和平能够长期延续，往往是因为某些条件暂时成立，而这些条件可能衰退或不复存在。",
      clarification: {
        whatItAsks: "大国和平是否依赖于并不永久可靠的支撑条件？",
      },
    },
    reconciledChinese: {
      prompt: "大国和平能够长期延续，往往取决于一些可能削弱或消失的条件。",
      clarification: {
        whatItAsks: "大国和平是否依赖于并不永久可靠的支撑条件？",
      },
    },
  },
  {
    questionId: "an_in3",
    chineseDraftA: {
      prompt: "许多国际机构主要反映强国原本就想要的结果。",
      clarification: {
        whatItAsks: "国际机构能否独立塑造行为，还是主要体现强国偏好？",
      },
    },
    chineseDraftB: {
      prompt: "不少国际制度安排，大体只是把强国已有的意愿体现出来。",
      clarification: {
        whatItAsks: "国际制度本身会改变国家行为，还是主要映射强国的既定选择？",
      },
    },
    reconciledChinese: {
      prompt: "许多国际制度安排，主要只是把强国已有的意愿体现出来。",
      clarification: {
        whatItAsks: "国际制度本身会改变国家行为，还是主要反映强国的既定偏好？",
      },
    },
  },
  {
    questionId: "an_pe3",
    chineseDraftA: {
      prompt: "对多数国际危机而言，谁控制信贷、生产或市场准入，次于眼前的安全与外交事实。",
      clarification: {
        whatItAsks: "在快速发展的危机中，安全和外交是否通常比经济依赖更有解释力？",
      },
    },
    chineseDraftB: {
      prompt: "在多数国际危机中，信贷、产能和市场准入由谁掌握，通常没有当下的安全与外交态势重要。",
      clarification: {
        whatItAsks: "危机迅速演变时，安全与外交因素是否通常比经济依存关系更能说明局势？",
      },
    },
    reconciledChinese: {
      prompt: "在多数国际危机中，信贷、产能和市场准入由谁掌握，通常没有当下的安全与外交态势重要。",
      clarification: {
        whatItAsks: "危机迅速演变时，安全与外交因素是否通常比经济依存关系更能说明局势？",
      },
    },
  },
  {
    questionId: "an_oj3",
    chineseDraftA: {
      prompt: "通常应有一项强有力的默认规则，反对外部力量干预他国内政。",
      clarification: {
        whatItAsks: "即使面对道德上棘手的情形，不干预是否仍应是通常规则？",
        terms: [
          {
            term: "不干预原则",
            definition: "外部国家通常不应在另一国领土内使用武力或胁迫手段的原则。",
          },
        ],
      },
    },
    chineseDraftB: {
      prompt: "对于他国内部事务，国际关系通常应以不受外部干预为一项有力的基本原则。",
      clarification: {
        whatItAsks: "包括道义上十分困难的案件在内，不干预是否应构成通常立场？",
        terms: [
          {
            term: "不干预原则",
            definition: "原则上，外部国家不应在他国境内动用武力或强制手段。",
          },
        ],
      },
    },
    reconciledChinese: {
      prompt: "对于他国内部事务，国际关系通常应以不受外部干预为一项有力的基本原则。",
      clarification: {
        whatItAsks: "包括道义上十分困难的案件在内，不干预是否应构成通常立场？",
        terms: [
          {
            term: "不干预原则",
            definition: "原则上，外部国家不应在他国境内动用武力或强制手段。",
          },
        ],
      },
    },
  },
  {
    questionId: "an_sc4",
    chineseDraftA: {
      prompt: "当国家说的话与实际部署指向不同方向时，部署通常是更安全的判断依据。",
      clarification: {
        whatItAsks: "言辞与军事部署相互冲突时，哪一项更可靠？",
      },
    },
    chineseDraftB: {
      prompt: "一国的公开表态与实际兵力部署不一致时，以部署判断其意图通常更稳妥。",
      clarification: {
        whatItAsks: "政治言辞同军力部署冲突时，是否应更相信实际部署？",
      },
    },
    reconciledChinese: {
      prompt: "一国的公开表态与实际兵力部署不一致时，以部署判断其走向通常更稳妥。",
      clarification: {
        whatItAsks: "政治言辞同军力部署冲突时，是否应更相信实际部署？",
      },
    },
  },
  {
    questionId: "an_ni3",
    chineseDraftA: {
      prompt: "地位主张和承认争议，能够揭示对手未来行为的真实信息，而不只是修饰其言辞。",
      clarification: {
        whatItAsks: "围绕地位与承认的争议，能否帮助预测对手将如何行动？",
      },
    },
    chineseDraftB: {
      prompt: "国家之间对地位与承认的争执，不只是话语包装，也可能真实预示对手今后的行为。",
      clarification: {
        whatItAsks: "地位与承认之争，是否包含可用于判断对手未来行动的信息？",
      },
    },
    reconciledChinese: {
      prompt: "国家之间对地位与承认的争执，不只是话语包装，也可能真实预示对手今后的行为。",
      clarification: {
        whatItAsks: "地位与承认之争，是否包含可用于判断对手未来行动的信息？",
      },
    },
  },
  {
    questionId: "an_pe4",
    chineseDraftA: {
      prompt: "对技术标准、平台和数据的控制，将比单纯的军事或领土争夺更深刻地塑造地缘政治权力。",
      clarification: {
        whatItAsks: "掌握标准、平台和数据，是否会比领土与军力更深刻地塑造权力？",
      },
    },
    chineseDraftB: {
      prompt: "未来地缘政治力量的形成，更深层地取决于谁控制技术标准、数字平台和数据，而不只是军事与领土竞争。",
      clarification: {
        whatItAsks: "技术规则、平台与数据控制权，是否会比军事力量和领土更深地影响国际权力？",
      },
    },
    reconciledChinese: {
      prompt: "未来地缘政治力量的形成，将更深层地取决于谁控制技术标准、数字平台和数据，而不只是军事与领土竞争。",
      clarification: {
        whatItAsks: "技术标准、平台与数据控制权，是否会比军事力量和领土更深地影响国际权力？",
      },
    },
  },
  {
    questionId: "an_in4",
    chineseDraftA: {
      prompt: "当少数强国为其他所有国家制定规则时，国际机构会更快失去正当性。",
      clarification: {
        whatItAsks: "多数国家几乎没有参与规则制定却必须遵守时，国际机构是否会更快弱化？",
      },
    },
    chineseDraftB: {
      prompt: "若规则主要由少数强国制定、其他国家只能接受，国际制度的认受基础会更快流失。",
      clarification: {
        whatItAsks: "当多数国家对规则形成缺少发言权时，相关制度是否更容易失去支持？",
      },
    },
    reconciledChinese: {
      prompt: "若规则主要由少数强国制定、其他国家只能接受，国际制度的正当性会更快流失。",
      clarification: {
        whatItAsks: "当多数国家对规则形成缺少发言权时，相关制度是否更容易失去支持与服从？",
      },
    },
  },
] as const satisfies readonly ZhHansFoundationDraftRecord[]
