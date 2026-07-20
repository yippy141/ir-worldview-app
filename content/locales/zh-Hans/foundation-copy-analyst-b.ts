import type { ZhHansFoundationDraftRecord } from "@/content/locales/zh-Hans/foundation-types"

export const zhHansFoundationAnalystDraftsB = [
  {
    questionId: "an_tradeoff_legitimacy",
    chineseDraftA: {
      prompt: "一个全球机构运作得还算不错，但新兴大国越来越不承认其正当性。什么最能解释这个问题？",
      options: [
        {
          id: "governance",
          title: "治理结构已经过时",
          label: "投票权重、领导职位准入和透明度规则调整不足，机构因而难以继续获得信任。",
        },
        {
          id: "exclusion",
          title: "其社会基础受到质疑",
          label: "该机构体现了特定规范和声音，其他国家从未完全接受它们具有中立性或普遍性。",
        },
        {
          id: "power",
          title: "底层权力已经转移",
          label: "当机构不再像过去那样符合自身利益，国家便诉诸正当性话语；真正的变化在权力格局。",
        },
        {
          id: "hierarchy",
          title: "结构从一开始就不平等",
          label: "该机构嵌在金融、生产和议程设置的更广泛等级体系中，单靠程序改革无法纠正。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "某个全球性机构运行尚可，但新兴力量日益质疑其代表资格与正当基础。问题的最佳解释是什么？",
      options: [
        {
          id: "governance",
          title: "决策机制未能与时俱进",
          label: "表决权、领导层进入渠道和透明规则没有充分调整，机构的可信度因此下降。",
        },
        {
          id: "exclusion",
          title: "共同认同基础并不存在",
          label: "制度承载的是特定规范和群体的声音，其他参与者并未真正把它们视为中立或普遍。",
        },
        {
          id: "power",
          title: "权力变化先于制度争议",
          label: "所谓正当性争议，是国家发现旧制度不再有利后的表达；根本原因仍是实力变化。",
        },
        {
          id: "hierarchy",
          title: "制度本就置于不平等体系中",
          label: "金融、生产和议程控制上的等级关系构成了制度背景，仅修改程序不足以解决。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "某个全球性机构运行尚可，但新兴大国日益质疑其正当基础。问题的最佳解释是什么？",
      options: [
        {
          id: "governance",
          title: "治理机制未能与时俱进",
          label: "表决权重、领导层进入渠道和透明度规则没有充分调整，机构的可信度因此下降。",
        },
        {
          id: "exclusion",
          title: "共同认同基础受到质疑",
          label: "该机构承载的是特定规范和群体的声音，其他参与者并未真正把它们视为中立或普遍。",
        },
        {
          id: "power",
          title: "权力变化先于制度争议",
          label: "当旧制度不再像过去那样有利时，国家便诉诸正当性话语；根本变化仍是实力转移。",
        },
        {
          id: "hierarchy",
          title: "制度本就置于不平等体系中",
          label: "该机构嵌在金融、生产和议程设置的更广泛等级体系中，仅修改程序不足以解决。",
        },
      ],
    },
  },
  {
    questionId: "an_tradeoff_rival",
    chineseDraftA: {
      prompt: "一个长期对手实现民主化、加入主要国际机构，并开始使用更合作的语言。你应在多大程度上调整威胁评估？",
      options: [
        {
          id: "update",
          title: "大幅调整",
          label: "政体类型、精英话语和关系历史的变化，能够为未来行为提供真实证据。",
        },
        {
          id: "minimal",
          title: "只作谨慎调整",
          label: "能力与结构激励仍是主要因素，政治信号可能很快逆转。",
        },
        {
          id: "integration",
          title: "观察制度融入程度",
          label: "加入共同制度比价值宣示提供更强证据，因为它会改变激励并提高侵略成本。",
        },
        {
          id: "durability",
          title: "观察国内持续性",
          label: "关键是新路线是否扎根于足够强的国内政治联盟，能够延续到本届领导层之后。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "长期敌对的国家完成民主转型、加入重要国际组织，也释放更多合作信号。原有威胁判断应如何更新？",
      options: [
        {
          id: "update",
          title: "显著下调威胁判断",
          label: "政体变化、领导层话语和双方关系史的转向，都是判断今后行为的实质证据。",
        },
        {
          id: "minimal",
          title: "仅小幅、审慎更新",
          label: "军事实力与结构性激励仍更可靠，政治转向也可能迅速反复。",
        },
        {
          id: "integration",
          title: "看其是否真正受共同规则约束",
          label: "制度参与改变激励并提高动武代价，因此比口头价值承诺更能说明问题。",
        },
        {
          id: "durability",
          title: "看国内政治能否维持转向",
          label: "要点是新政策是否得到稳定的国内联盟支持，而不是只维持一个领导周期。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "一个长期对手完成民主转型、加入重要国际组织，也开始释放更多合作信号。原有威胁判断应在多大程度上更新？",
      options: [
        {
          id: "update",
          title: "显著调整威胁判断",
          label: "政体变化、精英话语和双方关系史的转向，都是判断今后行为的实质证据。",
        },
        {
          id: "minimal",
          title: "仅作谨慎调整",
          label: "能力与结构性激励仍更可靠，政治信号也可能迅速逆转。",
        },
        {
          id: "integration",
          title: "观察制度融入程度",
          label: "参与共同制度会改变激励并提高侵略成本，因此比口头价值宣示更能说明问题。",
        },
        {
          id: "durability",
          title: "观察国内政治能否延续转向",
          label: "关键是新路线是否扎根于稳定的国内政治联盟，而不是只维持一个领导周期。",
        },
      ],
    },
  },
  {
    questionId: "an_case_finance",
    chineseDraftA: {
      prompt: "一个中等收入国家在资本外逃、债权人施压要求紧缩后面临崩溃。哪种解读最有说服力？",
      helpText: "选择对这场危机最好的解释。",
      options: [
        {
          id: "credibility",
          title: "国内信誉失灵",
          label: "外部压力暴露了内部弱点。恢复政策信誉是复苏的首要条件。",
        },
        {
          id: "pragmatic",
          title: "危机成因混合，应对也应混合",
          label: "危机既有国内原因，也有结构原因。可暂时实施管制并重新谈判，但仍留在整体体系内。",
        },
        {
          id: "dependence",
          title: "结构性依赖暴露",
          label: "危机源于对外部资本和债权人杠杆的依赖。不改变这一结构，危机还会重演。",
        },
        {
          id: "coalitions",
          title: "国内分配冲突",
          label: "金融压力设定了约束，但由国内政治决定谁来承担调整成本。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "某中等收入国家遭遇资本外流，债权人又要求财政紧缩，经济濒临崩溃。应如何理解这场危机？",
      helpText: "请选择最有解释力的判断。",
      options: [
        {
          id: "credibility",
          title: "国内政策失去可信度",
          label: "外部冲击只是揭开了内部脆弱性；重建政策可信度，是走出危机的前提。",
        },
        {
          id: "pragmatic",
          title: "国内与结构问题交织",
          label: "应短期管制资本并重谈条件，同时继续在现有国际体系内寻求修复。",
        },
        {
          id: "dependence",
          title: "外部资本依赖的结果",
          label: "债权人能够利用资本依赖施压；除非改变这种结构，否则同类危机仍会发生。",
        },
        {
          id: "coalitions",
          title: "调整成本由国内政治分配",
          label: "外部金融压力规定了空间，国内力量关系则决定哪些群体承受代价。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "某个中等收入国家遭遇资本外流，债权人又施压要求财政紧缩，经济濒临崩溃。哪种解读最有说服力？",
      helpText: "请选择对这场危机最有解释力的判断。",
      options: [
        {
          id: "credibility",
          title: "国内政策失去可信度",
          label: "外部压力暴露了内部脆弱性；重建政策可信度，是走出危机的首要条件。",
        },
        {
          id: "pragmatic",
          title: "国内与结构问题交织",
          label: "危机既有国内原因，也有结构原因。可暂时实施管制并重谈条件，同时留在现有体系内寻求修复。",
        },
        {
          id: "dependence",
          title: "结构性依赖暴露",
          label: "危机源于对外部资本和债权人杠杆的依赖；除非改变这种结构，否则同类危机仍会发生。",
        },
        {
          id: "coalitions",
          title: "调整成本由国内政治分配",
          label: "外部金融压力限定了空间，国内政治则决定哪些群体承担调整代价。",
        },
      ],
    },
  },
  {
    questionId: "an_case_burdens",
    chineseDraftA: {
      prompt: "一个主要盟友长期国防投入不足，却依赖你的安全保证。哪种回应最有说服力？",
      helpText: "不论你对该盟友感觉如何，选择你认为应采取的回应。",
      options: [
        {
          id: "credibility",
          title: "搭便车会侵蚀可信度",
          label: "负担不均会损害集体防卫，最终也会削弱威慑本身。",
        },
        {
          id: "capacity",
          title: "衡量共同能力，不只看分摊比例",
          label: "真正的问题是同盟能否提供可用能力与协调，而不是每个成员是否支付相同比例。",
        },
        {
          id: "purpose",
          title: "同盟目标存在争议",
          label: "负担争执通常反映更深分歧：同盟究竟为了什么，又在服务谁的战略。",
        },
        {
          id: "rebalance",
          title: "保证国已经过度延伸",
          label: "首要修正是收窄承诺。依赖不可持续安全保证的同盟，本身设计不良。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "重要盟国长期少投入国防，却继续仰赖本国提供安全保障。最合理的应对是什么？",
      helpText: "请撇开对该盟国的好恶，选择政策回应。",
      options: [
        {
          id: "credibility",
          title: "不公平分担会动摇威慑",
          label: "成员长期搭便车会损害共同防卫，也会逐渐让安全承诺失去可信度。",
        },
        {
          id: "capacity",
          title: "看实际防卫能力而非支出比例",
          label: "应判断同盟是否仍能形成有效能力和协同，而不是要求每个成员缴纳同样份额。",
        },
        {
          id: "purpose",
          title: "各方对同盟用途并无共识",
          label: "表面的军费争执，往往源于各方不认同同盟的目标及其所服务的战略。",
        },
        {
          id: "rebalance",
          title: "安全保证国承担过多",
          label: "应先缩减承诺；若同盟只能靠不可持续的保证维持，其安排本身就有问题。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "一个重要盟国长期国防投入不足，却继续仰赖本国提供安全保障。最有说服力的应对是什么？",
      helpText: "请撇开对该盟国的好恶，选择政策回应。",
      options: [
        {
          id: "credibility",
          title: "搭便车会侵蚀威慑可信度",
          label: "负担长期失衡会损害共同防卫，最终也会削弱威慑本身。",
        },
        {
          id: "capacity",
          title: "看共同能力，不只看支出比例",
          label: "应判断同盟是否仍能形成可用能力与有效协调，而不是要求每个成员承担相同比例。",
        },
        {
          id: "purpose",
          title: "各方对同盟用途并无共识",
          label: "表面的负担争执，往往源于各方不认同同盟的目标及其所服务的战略。",
        },
        {
          id: "rebalance",
          title: "安全保证国已经过度延伸",
          label: "应先收窄承诺；若同盟只能靠不可持续的安全保证维持，其安排本身就有问题。",
        },
      ],
    },
  },
  {
    questionId: "an_tradeoff_evidence",
    chineseDraftA: {
      prompt: "危机中信号相互矛盾时，哪类证据应获得最大权重？",
      helpText: "选择你会首先信任的信号。",
      options: [
        {
          id: "capabilities",
          title: "能力与部署态势",
          label: "当军力部署、战备姿态和硬实力变化与较软信号冲突时，应以前者为重。",
        },
        {
          id: "commitments",
          title: "制度与承诺",
          label: "条约履行、核查与危机规则会改变激励并提高虚张声势的成本，因此更有说明力。",
        },
        {
          id: "coalitions",
          title: "国内持续力",
          label: "最好的线索是领导人是否拥有足够的政治联盟、预算和公众空间来维持当前路线。",
        },
        {
          id: "status",
          title: "地位与关系信号",
          label: "地位主张、承认争议和政治语言的变化，可能先于能力变化而改变行为的含义。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "危机信息彼此冲突时，应优先相信哪一类证据？",
      helpText: "请选择你最先采用的判断依据。",
      options: [
        {
          id: "capabilities",
          title: "实际能力与军事态势",
          label: "若部队部署和硬实力变化同其他信号相反，应把更大权重放在可观察的能力上。",
        },
        {
          id: "commitments",
          title: "制度约束与既有承诺",
          label: "条约行为、检查机制和危机规程会实质改变成本，因此比表态更难伪装。",
        },
        {
          id: "coalitions",
          title: "国内政治能否长期支撑",
          label: "应看领导层是否有联盟、财政和舆论条件，把当前政策坚持下去。",
        },
        {
          id: "status",
          title: "地位诉求与关系语言",
          label: "地位和承认争议可能先改变双方如何理解行动，早于物质能力出现明显变化。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "危机信息彼此冲突时，应优先相信哪一类证据？",
      helpText: "请选择你最先采用的判断依据。",
      options: [
        {
          id: "capabilities",
          title: "实际能力与军事态势",
          label: "若部队部署、战备态势和硬实力变化同其他信号相反，应把更大权重放在前者。",
        },
        {
          id: "commitments",
          title: "制度约束与既有承诺",
          label: "条约履行、核查机制和危机规则会改变激励并提高虚张声势的成本，因此更有说明力。",
        },
        {
          id: "coalitions",
          title: "国内政治能否长期支撑",
          label: "应看领导层是否有足够的政治联盟、财政与公众空间，把当前政策坚持下去。",
        },
        {
          id: "status",
          title: "地位诉求与关系信号",
          label: "地位主张、承认争议和政治语言的变化，可能先于能力变化而改变一项行动的含义。",
        },
      ],
    },
  },
  {
    questionId: "an_tradeoff_tech_order",
    chineseDraftA: {
      prompt: "一个联盟正在讨论针对竞争对手的出口管制、投资审查和共同技术标准。这套做法背后的主要问题是什么？",
      helpText: "选择最能解释整套政策的原因。",
      clarification: {
        whatItAsks: "整体政策主要是为了拖慢对手、控制关键节点、限制安全规则的范围，还是防止形成新的等级体系？",
        terms: [
          { term: "出口管制", definition: "限制向特定外国买方出售敏感商品或技术的规则。" },
          { term: "投资审查", definition: "政府对可能产生安全或战略风险的外国投资进行审查。" },
          { term: "共同标准小组", definition: "若干国家或企业不等待普遍共识，先在成员之间协调技术规则的安排。" },
        ],
      },
      options: [
        {
          id: "edge",
          title: "拖慢对手上升",
          label: "这套政策主要是为了拖慢对手在支撑军事与工业实力的领域发展。",
        },
        {
          id: "chokepoints",
          title: "控制关键节点",
          label: "更深层的问题是谁控制他国难以替代的瓶颈、数据和标准。",
        },
        {
          id: "narrow",
          title: "限制规则范围",
          label: "更有力的理由是制定范围狭窄的盟友规则，在保护安全的同时不破坏更广泛体系。",
        },
        {
          id: "hierarchy",
          title: "不要制造新的等级体系",
          label: "风险在于少数领先国家制定规则，其他国家则主要承担成本。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "一组国家拟以出口限制、外资安全审查和技术标准协调来应对竞争对手。这一揽子安排主要在解决什么问题？",
      helpText: "请选择最能概括整套安排的解释。",
      clarification: {
        whatItAsks: "它的核心是压低对手发展速度、掌握技术瓶颈、把安全限制控制在较窄范围，还是避免新的国际等级关系？",
        terms: [
          { term: "出口管制", definition: "限制敏感产品或技术出售给特定境外对象的政策规则。" },
          { term: "投资安全审查", definition: "政府审查可能带来安全或战略风险的境外投资交易。" },
          { term: "技术标准协调机制", definition: "部分国家或企业先行协调技术规则，而不等待全球一致同意。" },
        ],
      },
      options: [
        {
          id: "edge",
          title: "限制对手的产业升级",
          label: "措施的主轴是让竞争对手在军工和工业能力所依赖的关键领域放慢发展。",
        },
        {
          id: "chokepoints",
          title: "争夺不可替代的瓶颈",
          label: "根本问题是标准、数据和供应瓶颈掌握在谁手中，以及他国能否替代。",
        },
        {
          id: "narrow",
          title: "把安全措施限定在必要范围",
          label: "应以盟友间的精准规则保护安全，同时避免冲击整个开放体系。",
        },
        {
          id: "hierarchy",
          title: "防止由少数国家垄断规则制定",
          label: "最大的风险是领先国家决定规则，其他国家只能接受并承担代价。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "一组国家拟以出口管制、投资安全审查和技术标准协调来应对竞争对手。这一揽子安排主要在解决什么问题？",
      helpText: "请选择最能概括整套安排的解释。",
      clarification: {
        whatItAsks: "它的核心是拖慢对手、控制关键节点、把安全规则限定在必要范围，还是避免形成新的国际等级体系？",
        terms: [
          { term: "出口管制", definition: "限制敏感产品或技术出售给特定境外对象的政策规则。" },
          { term: "投资安全审查", definition: "政府审查可能带来安全或战略风险的境外投资交易。" },
          { term: "技术标准协调机制", definition: "部分国家或企业先行协调技术规则，而不等待全球一致同意。" },
        ],
      },
      options: [
        {
          id: "edge",
          title: "拖慢对手的产业升级",
          label: "措施的主轴是让竞争对手在支撑军事与工业实力的关键领域放慢发展。",
        },
        {
          id: "chokepoints",
          title: "控制不可替代的关键节点",
          label: "根本问题是他国难以替代的供应瓶颈、数据和标准由谁掌握。",
        },
        {
          id: "narrow",
          title: "把安全规则限定在必要范围",
          label: "应以盟友间范围狭窄的规则保护安全，同时避免破坏更广泛的国际体系。",
        },
        {
          id: "hierarchy",
          title: "不要制造新的等级体系",
          label: "风险是少数领先国家决定规则，其他国家只能接受并主要承担代价。",
        },
      ],
    },
  },
  {
    questionId: "an_case_middle_power",
    chineseDraftA: {
      prompt: "一个中等强国在安全上依赖一个阵营，在贸易上依赖另一个阵营。从它的立场看，哪种逻辑最有力？",
      helpText: "请从这个中等强国的处境作答。",
      options: [
        {
          id: "shield",
          title: "锁定安全保护",
          label: "在危机以更不利条件迫使它选择之前，明确站在安全提供方一边。",
        },
        {
          id: "hedge",
          title: "战略对冲并分散风险",
          label: "把风险分散到不同市场、伙伴和供应渠道，以保留行动空间。",
        },
        {
          id: "peers",
          title: "与同类国家共同制定规则",
          label: "同其他中等强国结成联盟，是扩大谈判空间、抵御集团压力的最佳办法。",
        },
        {
          id: "extract",
          title: "利用夹缝位置",
          label: "利用本国关键位置向双方争取让步，而不是过早选边。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "某个中等力量国家靠一方保障安全，却靠另一方维持贸易。站在该国角度，哪套做法最合理？",
      helpText: "请代入这个国家的战略位置作答。",
      options: [
        {
          id: "shield",
          title: "尽早确定安全归属",
          label: "应在危机以更差条件逼迫选择之前，明确依靠现有安全伙伴。",
        },
        {
          id: "hedge",
          title: "多向布局，降低单一依赖",
          label: "通过多元市场、伙伴和供应线分散风险，尽量保留自主选择余地。",
        },
        {
          id: "peers",
          title: "联合其他中等力量塑造规则",
          label: "同处境相近的国家协作，可以增加议价空间并抵消大国集团压力。",
        },
        {
          id: "extract",
          title: "把关键位置转化为筹码",
          label: "不急于选边，而是利用双方争取本国的局面换取条件。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "某个中等力量国家靠一方保障安全，却靠另一方维持贸易。站在该国角度，哪套做法最合理？",
      helpText: "请代入这个国家的战略位置作答。",
      options: [
        {
          id: "shield",
          title: "尽早锁定安全保障",
          label: "应在危机以更差条件逼迫选择之前，明确依靠现有安全伙伴。",
        },
        {
          id: "hedge",
          title: "战略对冲并分散风险",
          label: "通过多元市场、伙伴和供应线分散风险，尽量保留自主选择余地。",
        },
        {
          id: "peers",
          title: "联合其他中等力量塑造规则",
          label: "同处境相近的国家协作，可以增加议价空间并抵御大国集团压力。",
        },
        {
          id: "extract",
          title: "把关键位置转化为筹码",
          label: "不急于选边，而是利用双方都争取本国的局面换取让步。",
        },
      ],
    },
  },
  {
    questionId: "an_case_green_finance",
    chineseDraftA: {
      prompt: "一个低收入国家获得绿色金融，但资金附带采购和改革规则。从该国立场看，哪种逻辑最有力？",
      helpText: "请从借款国的立场作答。",
      options: [
        {
          id: "stabilize",
          title: "先稳定局势",
          label: "融资渠道和政策信誉最优先。财政压力很大时，谈判空间有限。",
        },
        {
          id: "space",
          title: "保护政策空间",
          label: "关键是协议是否把国家锁入依赖，并削弱本国产业。",
        },
        {
          id: "bloc",
          title: "与同类国家共同谈判",
          label: "同样面对这些条件的国家集体谈判，比逐一谈判更有杠杆。",
        },
        {
          id: "home",
          title: "关注国内政治联盟",
          label: "即使外部方案公平，如果国内得失分配使其在政治上不可持续，方案仍会失败。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "某个较低收入国家可获得绿色融资，但必须接受指定采购与改革条件。站在借款国角度，最应重视什么？",
      helpText: "请代入借款国的政策处境。",
      options: [
        {
          id: "stabilize",
          title: "先取得资金、稳定财政",
          label: "资金可得性和政策可信度应居首；财政紧张时，讨价还价的余地很小。",
        },
        {
          id: "space",
          title: "保留自主发展空间",
          label: "应判断附带条件是否造成长期依赖，并限制本地产业成长。",
        },
        {
          id: "bloc",
          title: "联合其他借款国议价",
          label: "面对相同条件的国家共同谈判，通常比各自接受条款更有力量。",
        },
        {
          id: "home",
          title: "先看国内得失如何分配",
          label: "外部方案即便表面公平，若国内赢家与输家使其无法获得持续支持，仍然执行不下去。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "某个较低收入国家可获得绿色融资，但必须接受指定采购与改革条件。站在借款国角度，最应重视什么？",
      helpText: "请代入借款国的政策处境。",
      options: [
        {
          id: "stabilize",
          title: "先取得资金、稳定财政",
          label: "资金可得性和政策可信度应居首；财政压力很大时，谈判空间有限。",
        },
        {
          id: "space",
          title: "保留政策与发展空间",
          label: "应判断附带条件是否造成长期依赖，并削弱本地产业。",
        },
        {
          id: "bloc",
          title: "联合其他借款国议价",
          label: "面对相同条件的国家共同谈判，通常比逐一接受条款更有杠杆。",
        },
        {
          id: "home",
          title: "先看国内得失如何分配",
          label: "外部方案即便公平，若国内赢家与输家的分布使其无法获得持续支持，仍然执行不下去。",
        },
      ],
    },
  },
] as const satisfies readonly ZhHansFoundationDraftRecord[]
