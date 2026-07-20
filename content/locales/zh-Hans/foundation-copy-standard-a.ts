import type { ZhHansFoundationDraftRecord } from "@/content/locales/zh-Hans/foundation-types"

export const zhHansFoundationStandardDraftsA = [
  {
    questionId: "sc1",
    chineseDraftA: {
      prompt: "当权力平衡正在变化时，大国之间的和平仍然很脆弱。",
      clarification: {
        whatItAsks: "权力格局的变化是否会使和平关系更难维持？",
        terms: [
          {
            term: "权力平衡",
            definition: "最强国家之间军事、经济与战略能力的分布状况。",
          },
        ],
      },
    },
    chineseDraftB: {
      prompt: "大国实力对比发生变化时，彼此间的和平往往难以稳固。",
      clarification: {
        whatItAsks: "大国实力对比变化，是否会增加维持和平关系的难度？",
        terms: [
          {
            term: "实力对比",
            definition: "主要大国之间军事、经济和战略能力的相对分布。",
          },
        ],
      },
    },
    reconciledChinese: {
      prompt: "大国实力对比发生变化时，彼此间的和平往往难以稳固。",
      clarification: {
        whatItAsks: "大国实力对比变化，是否会增加维持和平关系的难度？",
        terms: [
          {
            term: "实力对比",
            definition: "主要大国之间军事、经济和战略能力的相对分布。",
          },
        ],
      },
    },
  },
  {
    questionId: "in1",
    chineseDraftA: {
      prompt: "即使没有世界政府，共同规则也能让合作持续下去。",
      clarification: {
        whatItAsks: "没有更高权威强制执行时，共同规则能否帮助国家持续合作？",
      },
    },
    chineseDraftB: {
      prompt: "即便不存在世界政府，各方共同遵循的规则仍可使合作更持久。",
      clarification: {
        whatItAsks: "在没有凌驾于国家之上的执行者时，共同规则能否维系合作？",
      },
    },
    reconciledChinese: {
      prompt: "即便不存在世界政府，各方共同遵循的规则仍可使合作更持久。",
      clarification: {
        whatItAsks: "在没有凌驾于国家之上的权威强制执行时，共同规则能否维系合作？",
      },
    },
  },
  {
    questionId: "df1",
    chineseDraftA: {
      prompt: "谁执政、执政者向谁负责的变化，往往和外部威胁一样能改变外交政策。",
      clarification: {
        whatItAsks: "选举、领导层更替和国内联盟，能否像外部事件一样显著改变外交政策？",
      },
    },
    chineseDraftB: {
      prompt: "执政者及其问责对象的变化，对外交政策的影响往往不亚于外部威胁。",
      clarification: {
        whatItAsks: "选举、领导人更替和国内政治联盟，能否像国外事态一样推动外交政策转向？",
      },
    },
    reconciledChinese: {
      prompt: "执政者及其问责对象的变化，对外交政策的影响往往不亚于外部威胁。",
      clarification: {
        whatItAsks: "选举、领导层更替和国内政治联盟，能否像外部事态一样推动外交政策转向？",
      },
    },
  },
  {
    questionId: "ni1",
    chineseDraftA: {
      prompt: "一次军事扩张意味着什么，更多取决于相关国家的历史和相互信任，而不是兵力规模。",
      clarification: {
        whatItAsks: "国家判断一项军事行动时，既往关系与信任是否比兵力规模更有解释力？",
      },
    },
    chineseDraftB: {
      prompt: "判断一国扩充军力的含义，国家间的历史关系与互信比军力规模更重要。",
      clarification: {
        whatItAsks: "判断军事动向时，关系史与互信是否比部队规模更能说明其含义？",
      },
    },
    reconciledChinese: {
      prompt: "判断一国扩充军力的含义，国家间的历史关系与互信比军力规模更重要。",
      clarification: {
        whatItAsks: "判断军事动向时，关系史与互信是否比部队规模更能说明其含义？",
      },
    },
  },
  {
    questionId: "pe1",
    chineseDraftA: {
      prompt: "危机中，对信贷、生产和供应链咽喉的控制，比单纯的军事实力更能左右国家选择。",
      clarification: {
        whatItAsks: "金融和供应链依赖，对国家的约束是否超过军事实力差异？",
      },
    },
    chineseDraftB: {
      prompt: "在危机中，谁掌握信贷、产能和供应链关键节点，往往比军事实力本身更能影响国家如何选择。",
      clarification: {
        whatItAsks: "金融与供应链依赖，是否比军事能力差距更能限制国家的选择？",
      },
    },
    reconciledChinese: {
      prompt: "在危机中，谁掌握信贷、产能和供应链关键节点，往往比军事实力本身更能影响国家如何选择。",
      clarification: {
        whatItAsks: "金融与供应链依赖，是否比军事能力差距更能限制国家的选择？",
      },
    },
  },
  {
    questionId: "rs1",
    chineseDraftA: {
      prompt: "一国若不断追求超出防卫所需的收益，往往会引发对手和旁观国家的反应，反而使自己更不安全。",
      clarification: {
        whatItAsks: "谋求超出防卫需要的收益，是否通常会招致抵制并降低自身安全？",
      },
    },
    chineseDraftB: {
      prompt: "一国持续争取超出自卫所需的优势时，竞争对手与其他国家往往会作出反应，最终使其安全处境恶化。",
      clarification: {
        whatItAsks: "追求防卫以外的额外优势，是否通常会触发反制并让本国更不安全？",
      },
    },
    reconciledChinese: {
      prompt: "一国持续争取超出自卫所需的优势时，竞争对手与其他国家往往会作出反应，最终使其安全处境恶化。",
      clarification: {
        whatItAsks: "追求防卫以外的额外优势，是否通常会触发反制并让本国更不安全？",
      },
    },
  },
  {
    questionId: "oj1",
    chineseDraftA: {
      prompt: "即使严重的不公仍未解决，稳定的国际秩序往往也值得维护。",
      clarification: {
        whatItAsks: "稳定与正义发生冲突时，通常是否应优先维护秩序？",
      },
    },
    chineseDraftB: {
      prompt: "即便重大不公一时无法解决，维持国际局势的基本稳定往往仍有必要。",
      clarification: {
        whatItAsks: "当稳定与纠正不公不能兼得时，是否通常应先守住国际秩序？",
      },
    },
    reconciledChinese: {
      prompt: "即使重大不公仍未解决，维持稳定的国际秩序往往仍有必要。",
      clarification: {
        whatItAsks: "当稳定与纠正不公不能兼得时，是否通常应先维护国际秩序？",
      },
    },
  },
  {
    questionId: "tradeoff_alliances",
    chineseDraftA: {
      prompt: "在真正承受压力时，通常是什么最能维系同盟？",
      helpText: "选择你首先会采用的解释。",
      options: [
        {
          id: "power",
          title: "物质支撑",
          label: "当成员相信主导国有能力、也有意愿承担防务成本时，同盟才能维持。",
        },
        {
          id: "rules",
          title: "规则与惯例",
          label: "规划机制、常设承诺和反复协调，会让同盟承诺更可信。",
        },
        {
          id: "domestic",
          title: "国内持续力",
          label: "国内政治联盟、预算和公众承受力能够长期支撑时，同盟才会延续。",
        },
        {
          id: "meaning",
          title: "政治意义",
          label: "同盟被视为具有正当性、并与成员的身份认同相符时，才不只是一次有效率的交易。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "同盟在严峻压力下仍能维持，最常见的原因是什么？",
      helpText: "请选择你会优先采用的解释。",
      options: [
        {
          id: "power",
          title: "实力与投入",
          label: "成员相信核心盟国既能、也愿承担共同防卫的代价，同盟才站得住。",
        },
        {
          id: "rules",
          title: "制度化协作",
          label: "常设规划、明确承诺与持续协调，使同盟保证更具可信度。",
        },
        {
          id: "domestic",
          title: "国内支撑",
          label: "国内联盟、财政投入与民意承受力能够长期维持，同盟才会持久。",
        },
        {
          id: "meaning",
          title: "共同的政治认同",
          label: "同盟被成员视为正当、且符合自身身份认同时，维系力不只来自利益交换。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "同盟在严峻压力下仍能维持，最常见的原因是什么？",
      helpText: "请选择你会优先采用的解释。",
      options: [
        {
          id: "power",
          title: "实力与投入",
          label: "成员相信主导国既有能力、也愿意承担共同防卫的代价，同盟才站得住。",
        },
        {
          id: "rules",
          title: "规则与协作机制",
          label: "常设规划、明确承诺与持续协调，使同盟保证更具可信度。",
        },
        {
          id: "domestic",
          title: "国内支撑",
          label: "国内政治联盟、财政投入与公众承受力能够长期维持，同盟才会持久。",
        },
        {
          id: "meaning",
          title: "共同的政治认同",
          label: "同盟被成员视为具有正当性、且符合自身身份认同时，维系力就不只来自利益交换。",
        },
      ],
    },
  },
  {
    questionId: "sc2",
    chineseDraftA: {
      prompt: "国家常常会为危险作准备，因为无法确定其他国家会一直保持善意。",
      clarification: {
        whatItAsks: "对他国未来行为的不确定，是否会推动国家为冲突作准备？",
      },
    },
    chineseDraftB: {
      prompt: "由于无法确信他国今后仍无敌意，各国往往会预先防范风险。",
      clarification: {
        whatItAsks: "无法判断他国未来是否仍无敌意，是否会促使国家准备应对冲突？",
      },
    },
    reconciledChinese: {
      prompt: "由于无法确信他国今后仍无敌意，各国往往会预先防范风险。",
      clarification: {
        whatItAsks: "无法判断他国未来是否仍无敌意，是否会促使国家准备应对冲突？",
      },
    },
  },
  {
    questionId: "in2",
    chineseDraftA: {
      prompt: "即使互信薄弱，监督和反复接触也能让国际协议继续运作。",
      clarification: {
        whatItAsks: "在各方互不信任时，监督和定期接触能否维持协议？",
      },
    },
    chineseDraftB: {
      prompt: "即便各方互信有限，核查机制与经常性沟通仍可维系国际协议。",
      clarification: {
        whatItAsks: "当各方缺乏信任时，核查与持续沟通能否使协议继续执行？",
      },
    },
    reconciledChinese: {
      prompt: "即便各方互信有限，核查机制与经常性沟通仍可维系国际协议。",
      clarification: {
        whatItAsks: "当各方缺乏信任时，核查与持续沟通能否使协议继续执行？",
      },
    },
  },
] as const satisfies readonly ZhHansFoundationDraftRecord[]
