import type { ZhHansFoundationDraftRecord } from "@/content/locales/zh-Hans/foundation-types"

export const zhHansFoundationStandardDraftsB = [
  {
    questionId: "tradeoff_interdependence",
    chineseDraftA: {
      prompt: "经济相互依赖变得危险时，更深层的问题通常是什么？",
      helpText: "选择原因，而不是政策应对。",
      options: [
        {
          id: "rivalry",
          title: "竞争把联系变成杠杆",
          label: "危险主要出现在战略竞争加剧、各国开始把经济敞口视为安全风险之时。",
        },
        {
          id: "rules",
          title: "规则没有跟上",
          label: "问题在于防护规则薄弱。更好的多边规则可以保留开放，同时降低被胁迫的风险。",
        },
        {
          id: "domestic",
          title: "国内依赖已经固化",
          label: "真正的弱点是政治性的：国内企业、地区和利益集团牵涉过深，风险上升时难以及时调整。",
        },
        {
          id: "structure",
          title: "结构从一开始就不平等",
          label: "脆弱性来自谁掌握信贷、生产和关键节点。胁迫开始前，双方的敞口看起来似乎对等。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "当经济相互依存带来危险时，根本症结通常在哪里？",
      helpText: "请选择成因，而非你主张的对策。",
      options: [
        {
          id: "rivalry",
          title: "战略竞争使依存关系武器化",
          label: "随着战略竞争升温，各国把对外经济依赖当作安全隐患，原有联系才主要转化为风险。",
        },
        {
          id: "rules",
          title: "多边约束不足",
          label: "症结是规则缺少防线；若多边约束更完备，开放可以延续，受制于人的程度也可降低。",
        },
        {
          id: "domestic",
          title: "国内利益被依赖锁定",
          label: "企业、地方与利益集团同既有关系绑定过深，风险上升后国内政治无法迅速调整。",
        },
        {
          id: "structure",
          title: "依存结构并不对称",
          label: "关键在于信贷、产能和瓶颈由谁控制；施压发生之前，表面的相互依存掩盖了不对称。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "当经济相互依存带来危险时，更深层的症结通常在哪里？",
      helpText: "请选择成因，而不是你主张的政策对策。",
      options: [
        {
          id: "rivalry",
          title: "战略竞争把联系变成杠杆",
          label: "随着战略竞争升温，各国开始把对外经济依赖视为安全风险，原有联系才主要转化为施压杠杆。",
        },
        {
          id: "rules",
          title: "多边规则没有跟上",
          label: "症结是约束规则薄弱；更完备的多边规则可以维持开放，同时降低受胁迫的风险。",
        },
        {
          id: "domestic",
          title: "国内依赖已经固化",
          label: "企业、地区与利益集团同既有关系绑定过深，风险上升后国内政治难以及时调整。",
        },
        {
          id: "structure",
          title: "依存结构并不对称",
          label: "关键在于信贷、产能和供应瓶颈由谁控制；施压发生之前，表面的相互依存掩盖了这种不对称。",
        },
      ],
    },
  },
  {
    questionId: "df2",
    chineseDraftA: {
      prompt: "面对相似的外部压力，国家仍可能因内部政治不同而采取截然不同的行动。",
      clarification: {
        whatItAsks: "不同政治制度和国内联盟，是否会让承受同样压力的国家作出不同反应？",
      },
    },
    chineseDraftB: {
      prompt: "即便承受相近的外部压力，各国内部政治的差异仍会造成很不一样的政策反应。",
      clarification: {
        whatItAsks: "政治制度与执政联盟的差异，是否会改变国家对同一外部压力的回应？",
      },
    },
    reconciledChinese: {
      prompt: "即便承受相近的外部压力，各国内部政治的差异仍会造成很不一样的政策反应。",
      clarification: {
        whatItAsks: "政治制度与国内政治联盟的差异，是否会改变国家对同一外部压力的回应？",
      },
    },
  },
  {
    questionId: "ni2",
    chineseDraftA: {
      prompt: "地位、承认和正当性会塑造国家想要什么，而不只是影响它如何追求既定利益。",
      clarification: {
        whatItAsks: "国家利益是否也会受到地位、身份与外界承认的塑造？",
      },
    },
    chineseDraftB: {
      prompt: "国际地位、他国承认与政治正当性，不仅影响国家实现利益的方式，也会改变国家如何界定自身利益。",
      clarification: {
        whatItAsks: "国家如何理解自身利益，是否部分取决于地位、身份认同和他国承认？",
      },
    },
    reconciledChinese: {
      prompt: "国际地位、他国承认与政治正当性，不仅影响国家追求利益的方式，也会改变国家如何界定自身利益。",
      clarification: {
        whatItAsks: "国家如何理解自身利益，是否部分取决于地位、身份认同和他国承认？",
      },
    },
  },
  {
    questionId: "pe2",
    chineseDraftA: {
      prompt: "经济规则常常为强国带来持久的结构性优势，弱国只能设法适应。",
      clarification: {
        whatItAsks: "全球经济规则是否让部分国家拥有内置的相对优势？",
        terms: [
          {
            term: "结构性优势",
            definition: "由规则或制度安排持续产生的优势，而不是一次谈判取得的好处。",
          },
        ],
      },
    },
    chineseDraftB: {
      prompt: "国际经济规则往往把长期优势固化给实力更强的国家，实力较弱的国家不得不绕开这些限制。",
      clarification: {
        whatItAsks: "全球经济规则是否会使某些国家长期占据制度内生的优势？",
        terms: [
          {
            term: "结构性优势",
            definition: "规则或组织安排本身带来的持续便利，不同于一次性的谈判收益。",
          },
        ],
      },
    },
    reconciledChinese: {
      prompt: "国际经济规则往往把长期的结构性优势固化给实力更强的国家，实力较弱的国家只能设法应对。",
      clarification: {
        whatItAsks: "全球经济规则是否会使某些国家长期占据由制度安排产生的优势？",
        terms: [
          {
            term: "结构性优势",
            definition: "由规则或制度安排持续产生的优势，而不是一次谈判取得的好处。",
          },
        ],
      },
    },
  },
  {
    questionId: "rs2",
    chineseDraftA: {
      prompt: "避免过度扩张，通常比抓住每一个机会谋求持久优势更重要。",
      clarification: {
        whatItAsks: "与利用每次机会扩大优势相比，限制承诺通常是否更安全？",
      },
    },
    chineseDraftB: {
      prompt: "避免承担超出能力的战略负担，通常比把每个机会都转化为长期优势更重要。",
      clarification: {
        whatItAsks: "相较于不断争取优势，控制承诺范围是否通常更能保障安全？",
      },
    },
    reconciledChinese: {
      prompt: "避免承担超出能力的战略负担，通常比把每个机会都转化为长期优势更重要。",
      clarification: {
        whatItAsks: "相较于不断争取优势，控制承诺范围是否通常更能保障安全？",
      },
    },
  },
  {
    questionId: "oj2",
    chineseDraftA: {
      prompt: "当大规模暴行严重到一定程度时，外部力量为制止暴行而越过一国主权，可能具有正当理由。",
      clarification: {
        whatItAsks: "对平民造成的极端伤害，能否成为在未经该国政府同意时采取军事行动的正当理由？",
        whatItDoesNotAsk: "本题只讨论极端紧急情形，不是一般性干预或没有期限的政权更迭。",
        terms: [
          {
            term: "主权",
            definition: "一国通常有权决定其领土内事务的原则。",
          },
        ],
      },
    },
    chineseDraftB: {
      prompt: "若大规模暴行达到极端程度，外部国家可以正当地突破该国的主权屏障，以制止暴行。",
      clarification: {
        whatItAsks: "平民遭受极端伤害时，能否在当事国政府不同意的情况下正当化军事介入？",
        whatItDoesNotAsk: "这里限定于极端紧急情况，不涉及普通争端中的干预，也不涉及无限期的政权更替。",
        terms: [
          {
            term: "主权",
            definition: "国家原则上对本国领土内事务拥有管辖权。",
          },
        ],
      },
    },
    reconciledChinese: {
      prompt: "当大规模暴行达到极端程度时，外部国家为制止暴行而突破该国通常享有的主权保护，可能具有正当理由。",
      clarification: {
        whatItAsks: "平民遭受极端伤害时，能否在当事国政府不同意的情况下正当化军事行动？",
        whatItDoesNotAsk: "本题只讨论极端紧急情形，不涉及一般性干预或没有期限的政权更迭。",
        terms: [
          {
            term: "主权",
            definition: "国家原则上对本国领土内事务拥有管辖权。",
          },
        ],
      },
    },
  },
  {
    questionId: "tradeoff_strategy",
    chineseDraftA: {
      prompt: "一个对手正在扩大优势。哪项关切应当优先？",
      options: [
        {
          id: "press",
          title: "抓住窗口",
          label: "如果现在有机会取得持久战略优势，不加以利用，日后看来会是不负责任。",
        },
        {
          id: "limit",
          title: "防止过度扩张",
          label: "首要危险来自自身：过多承诺与局势升级造成的损害，可能超过对手取得有限进展的影响。",
        },
        {
          id: "base",
          title: "先看国内基础",
          label: "真正的问题是，国内政治联盟、公众承受力与财政能力究竟能否支撑这项战略。",
        },
        {
          id: "industrial",
          title: "掌握生产基础",
          label: "长期优势较少取决于战术姿态，更多取决于谁控制技术、产业和供应链。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "对手正逐步占据上风。此时最先应考虑什么？",
      options: [
        {
          id: "press",
          title: "乘势扩大优势",
          label: "眼下若能形成持久的战略领先却不行动，事后很可能被视为错失良机。",
        },
        {
          id: "limit",
          title: "警惕战略透支",
          label: "更大的风险可能是自身承诺过度或推动升级，其代价会超过对手有限得势。",
        },
        {
          id: "base",
          title: "评估国内承载力",
          label: "首先要判断国内联盟、社会支持和财政空间能否长期承担这套战略。",
        },
        {
          id: "industrial",
          title: "巩固技术与产业基础",
          label: "决定长期实力的，不是短期姿态，而是谁掌握技术、产业能力与供应链。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "对手正逐步占据上风。此时最先应考虑什么？",
      options: [
        {
          id: "press",
          title: "乘势扩大优势",
          label: "眼下若能形成持久的战略领先却不行动，日后很可能被视为错失良机。",
        },
        {
          id: "limit",
          title: "警惕战略透支",
          label: "更大的风险可能来自自身：承诺过度或推动升级造成的损害，会超过对手取得有限进展的影响。",
        },
        {
          id: "base",
          title: "评估国内承载力",
          label: "首先要判断国内政治联盟、公众承受力与财政空间能否长期承担这套战略。",
        },
        {
          id: "industrial",
          title: "巩固技术与产业基础",
          label: "决定长期实力的，与其说是短期姿态，不如说是谁掌握技术、产业能力与供应链。",
        },
      ],
    },
  },
  {
    questionId: "tradeoff_intervention",
    chineseDraftA: {
      prompt: "一国政府正在实施大规模暴行。军事行动或可挽救生命，却也会削弱今后限制干预的法律规则。应由什么主导这项决定？",
      clarification: {
        whatItAsks: "当法律、保护平民、行动授权和预期后果指向不同方向时，应以哪一项为主要依据？",
        whatItDoesNotAsk: "本题仅限于严重的大规模暴行，不涉及一般争端或没有期限的政权更迭。",
        terms: [
          {
            term: "授权范围",
            definition: "公开说明且范围有限的行动许可，用于界定一项干预可以做什么。",
          },
        ],
      },
      options: [
        {
          id: "precedent",
          title: "维护不干预先例",
          label: "如果干预门槛过于容易松动，日后滥用造成的广泛损害将超过本案可以证明合理的范围。",
        },
        {
          id: "protection",
          title: "保护受害者",
          label: "当平民伤亡超过极端门槛，道义理由可以压过通常反对干预的预设。",
        },
        {
          id: "mandate",
          title: "判断授权是否成立",
          label: "关键在于是否存在范围狭窄、具有正当性的授权。紧急行动有明确边界并由集体提出时，理由最充分。",
        },
        {
          id: "consequences",
          title: "判断可能后果",
          label: "第一项检验是，行动是否有望保护民众，而不是扩大战争或造成更严重的灾难。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "某国政府正在犯下大规模暴行。动武可能救人，但也可能冲击未来约束外部干预的法律边界。决策时应以什么为准？",
      clarification: {
        whatItAsks: "当法律规则、平民保护、授权正当性与实际效果相互冲突时，哪一项应居于首位？",
        whatItDoesNotAsk: "情境限定于严重暴行，不讨论一般性介入，也不讨论无限期推翻政权。",
        terms: [
          {
            term: "行动授权",
            definition: "对行动目的和范围作出公开、有限界定的正式许可。",
          },
        ],
      },
      options: [
        {
          id: "precedent",
          title: "守住干预门槛",
          label: "若本案轻易突破不干预界线，未来借此先例行事所造成的损害可能更大。",
        },
        {
          id: "protection",
          title: "先保护平民",
          label: "平民伤害达到极端程度时，救人的道义责任可以超过通常不应干预的原则。",
        },
        {
          id: "mandate",
          title: "审查授权依据",
          label: "决定性问题是有无范围明确且被广泛承认的授权；目标受限、集体作出的紧急行动理由更强。",
        },
        {
          id: "consequences",
          title: "先看实际效果",
          label: "应先判断动武是否确实可能保护平民，而非扩大冲突或制造更大的灾难。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "某国政府正在实施大规模暴行。动武可能挽救生命，但也可能冲击今后约束外部干预的法律边界。决策时应以什么为主要依据？",
      clarification: {
        whatItAsks: "当法律规则、平民保护、行动授权与预期效果指向不同方向时，哪一项应居于首位？",
        whatItDoesNotAsk: "情境限定于严重的大规模暴行，不讨论一般性干预，也不讨论没有期限的政权更迭。",
        terms: [
          {
            term: "行动授权",
            definition: "对行动目的和范围作出公开、有限界定的正式许可。",
          },
        ],
      },
      options: [
        {
          id: "precedent",
          title: "守住干预门槛",
          label: "若本案轻易突破不干预的界线，未来借此先例滥用干预所造成的损害可能更大。",
        },
        {
          id: "protection",
          title: "先保护平民",
          label: "平民伤害达到极端程度时，救人的道义理由可以超过通常反对干预的原则预设。",
        },
        {
          id: "mandate",
          title: "审查授权依据",
          label: "决定性问题是有无范围明确且具有正当性的授权；目标受限、由集体提出的紧急行动理由更强。",
        },
        {
          id: "consequences",
          title: "先看实际效果",
          label: "应先判断动武是否确实可能保护平民，而不是扩大冲突或制造更大的灾难。",
        },
      ],
    },
  },
  {
    questionId: "case_semiconductors",
    chineseDraftA: {
      prompt: "一个竞争对手正在先进半导体领域追赶，而本国企业又依赖其供应链。应以什么指导应对？",
      helpText: "选择应对行动的主要目标。",
      options: [
        {
          id: "edge",
          title: "保持战略领先",
          label: "现在就实施广泛限制。能力差距缩小本身就是威胁，贸易代价次于维持优势。",
        },
        {
          id: "dependence",
          title: "降低结构性依赖",
          label: "更深层的竞争在于生产瓶颈与依赖关系。应建设国内能力，并逐步解除单向敞口。",
        },
        {
          id: "coalition",
          title: "协调有限管制",
          label: "只限制风险最高的技术，并与盟友共同行动。广泛的单边管制会破坏仍然需要的国际体系。",
        },
        {
          id: "framing",
          title: "避免把一切安全化",
          label: "把每项技术差距都当作安全紧急事件，会固化竞争并压缩未来合作空间。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "竞争对手正在先进芯片领域缩小差距，本国企业却依赖对方供应链。应对时最应坚持什么目标？",
      helpText: "请选择应对的首要目标。",
      options: [
        {
          id: "edge",
          title: "保住战略优势",
          label: "应立即扩大限制；对手缩小能力差距本身就是威胁，贸易损失应让位于战略领先。",
        },
        {
          id: "dependence",
          title: "摆脱关键依赖",
          label: "核心较量是谁掌握生产瓶颈。应扩大本国产能，逐步解除对单一来源的过度暴露。",
        },
        {
          id: "coalition",
          title: "与盟友精准设限",
          label: "只管制最高风险技术并同盟友协调；广泛单边限制会撕裂仍有必要维持的国际秩序。",
        },
        {
          id: "framing",
          title: "不要把所有差距都安全化",
          label: "把每一项技术差距都定义为安全危机，会使对抗自我强化，也会关闭今后的合作余地。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "竞争对手正在先进半导体领域缩小差距，本国企业却依赖对方供应链。应对时最应坚持什么目标？",
      helpText: "请选择应对的首要目标。",
      options: [
        {
          id: "edge",
          title: "保住战略优势",
          label: "应立即实施广泛限制；对手缩小能力差距本身就是威胁，贸易代价应让位于维持战略领先。",
        },
        {
          id: "dependence",
          title: "降低结构性依赖",
          label: "核心较量是谁掌握生产瓶颈。应扩大本国产能，并逐步解除单向依赖。",
        },
        {
          id: "coalition",
          title: "与盟友精准设限",
          label: "只管制风险最高的技术，并同盟友协调；广泛的单边限制会撕裂仍有必要维持的国际秩序。",
        },
        {
          id: "framing",
          title: "避免把一切都安全化",
          label: "把每一项技术差距都定义为安全危机，会使竞争固化，也会压缩今后的合作空间。",
        },
      ],
    },
  },
  {
    questionId: "case_protection",
    chineseDraftA: {
      prompt: "大规模杀戮正在发生。安理会否决阻止了联合国授权，但一个地区组织支持有限行动。应以什么指导应对？",
      helpText: "选择应当指导应对的原则。",
      clarification: {
        whatItAsks: "联合国授权、制止杀戮、地区支持与事态恶化风险，哪一项应占最大权重？",
        whatItDoesNotAsk: "地区组织支持不等同于联合国授权。",
        terms: [
          {
            term: "正式授权",
            definition: "联合国安理会等国际组织依程序给予的正式批准。",
          },
        ],
      },
      options: [
        {
          id: "law",
          title: "合法性优先",
          label: "未经安理会授权的行动，会削弱在未来更困难案件中保护弱国的法律框架。",
        },
        {
          id: "moral",
          title: "保护优先",
          label: "极端的人道伤害可以压过通常的程序异议；暴行规模改变了一般判断规则。",
        },
        {
          id: "bounded",
          title: "有限的紧急正当性",
          label: "地区支持加上严格受限的行动授权，可以为紧急行动提供正当理由，而不把它变成普遍许可。",
        },
        {
          id: "prudence",
          title: "升级风险与战后局面",
          label: "首先要问外部行动是否可能保护平民，而不是扩大战争并留下更糟的政治真空。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "大规模杀戮仍在继续。安理会否决使联合国无法授权，但地区组织支持范围有限的行动。决策时最应以什么为准？",
      helpText: "请选择应当居于首位的原则。",
      clarification: {
        whatItAsks: "联合国程序、制止杀戮、地区组织支持与行动后果，哪一项应最具决定性？",
        whatItDoesNotAsk: "地区组织的支持并不构成联合国授权。",
        terms: [
          {
            term: "正式授权",
            definition: "由安理会等有权限的国际机构依程序作出的正式批准。",
          },
        ],
      },
      options: [
        {
          id: "law",
          title: "先守住法律程序",
          label: "绕开安理会采取行动，会动摇今后弱国赖以抵御干预的国际法框架。",
        },
        {
          id: "moral",
          title: "先制止极端伤害",
          label: "人道灾难达到极端程度时，可以超过通常的程序性反对；情势规模改变一般原则的适用。",
        },
        {
          id: "bounded",
          title: "以地区支持限定紧急行动",
          label: "地区组织支持与严格有限的授权结合，可以正当化紧急行动，同时避免形成普遍通行证。",
        },
        {
          id: "prudence",
          title: "评估升级与善后",
          label: "首要问题是外部行动能否实际保护平民，而非扩大冲突并造成更严重的权力真空。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "大规模杀戮仍在继续。安理会否决使联合国无法授权，但地区组织支持范围有限的行动。决策时最应以什么为准？",
      helpText: "请选择应当居于首位的原则。",
      clarification: {
        whatItAsks: "联合国授权、制止杀戮、地区组织支持与事态恶化风险，哪一项应最具决定性？",
        whatItDoesNotAsk: "地区组织的支持并不等同于联合国授权。",
        terms: [
          {
            term: "正式授权",
            definition: "由联合国安理会等有权限的国际机构依程序作出的正式批准。",
          },
        ],
      },
      options: [
        {
          id: "law",
          title: "先守住法律程序",
          label: "绕开安理会采取行动，会削弱今后弱国赖以抵御干预的国际法框架。",
        },
        {
          id: "moral",
          title: "先制止极端伤害",
          label: "人道伤害达到极端程度时，可以超过通常的程序性反对；暴行规模会改变一般原则的适用。",
        },
        {
          id: "bounded",
          title: "有限的紧急正当性",
          label: "地区组织支持与严格受限的行动授权相结合，可以正当化紧急行动，同时避免形成普遍许可。",
        },
        {
          id: "prudence",
          title: "评估升级与善后",
          label: "首要问题是外部行动能否实际保护平民，而不是扩大冲突并留下更严重的政治真空。",
        },
      ],
    },
  },
] as const satisfies readonly ZhHansFoundationDraftRecord[]
