import type { ZhHansFoundationDraftRecord } from "@/content/locales/zh-Hans/foundation-types"

export const zhHansFoundationAnalystDraftsC = [
  {
    questionId: "an_case_maritime_crisis",
    chineseDraftA: {
      prompt: "一个盟友在争议水域进行高风险试探，并要求公开支持。最应权衡什么？",
      helpText: "选择应当指导回应的首要考虑。",
      options: [
        {
          id: "deter",
          title: "守住威慑底线",
          label: "公开支持可以阻止对手进行更多试探。",
        },
        {
          id: "entrapment",
          title: "避免被盟友拖入冲突",
          label: "更大的危险是因盟友的局部冒险而被卷入升级螺旋。",
        },
        {
          id: "offramp",
          title: "建立降级出口",
          label: "优先建立监测、危机规则和非公开磋商，让双方都有后退空间。",
        },
        {
          id: "ally_politics",
          title: "先看盟友国内政治",
          label: "支持之前，应判断这次试探是否由盟友国内的政治弱势或精英竞争推动。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "盟国在有主权争议的海域采取冒险试探，并要求本国公开背书。回应时哪项因素最重要？",
      helpText: "请选择政策回应的首要依据。",
      options: [
        {
          id: "deter",
          title: "维持威慑可信度",
          label: "公开站在盟友一边，才能阻止对手继续测试同盟承诺。",
        },
        {
          id: "entrapment",
          title: "防止同盟牵连",
          label: "首要风险是盟国的局部赌博把本国拖进不断升级的冲突。",
        },
        {
          id: "offramp",
          title: "为双方安排退路",
          label: "应优先强化监测、危机沟通规则与低调谈判，让局势能够降温。",
        },
        {
          id: "ally_politics",
          title: "判断盟国内政动机",
          label: "在背书前，应先查明这次行动是否服务于盟国内部的权力竞争。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "盟国在有争议的海域采取冒险试探，并要求本国公开背书。回应时哪项因素最重要？",
      helpText: "请选择政策回应的首要依据。",
      options: [
        {
          id: "deter",
          title: "维持威慑可信度",
          label: "公开站在盟友一边，可以阻止对手继续试探同盟承诺。",
        },
        {
          id: "entrapment",
          title: "避免被盟友拖入冲突",
          label: "更大的风险是盟友的局部冒险把本国卷入不断升级的冲突。",
        },
        {
          id: "offramp",
          title: "为双方安排降级出口",
          label: "应优先强化监测、危机沟通规则与低调谈判，让双方都有后退空间。",
        },
        {
          id: "ally_politics",
          title: "判断盟友的国内政治动机",
          label: "在背书前，应先查明这次试探是否由盟友国内的政治弱势或精英竞争推动。",
        },
      ],
    },
  },
  {
    questionId: "an_case_digital_stack",
    chineseDraftA: {
      prompt: "一个政府必须在廉价的外国数字技术栈和较贵的盟友方案之间选择。什么应推动这项选择？",
      helpText: "考虑长期敞口，而不只是前期价格。",
      clarification: {
        whatItAsks: "安全暴露、长期依赖、盟友协调与自主性损失，哪项风险应居首？",
        terms: [
          { term: "数字技术栈", definition: "一个数字系统运行所依赖的硬件、软件、云服务和技术标准组合。" },
          { term: "互操作性", definition: "不同国家或企业的系统能够可靠协同工作的能力。" },
        ],
      },
      options: [
        {
          id: "security",
          title: "安全暴露",
          label: "如果较贵方案能降低竞争对手日后胁迫或瘫痪关键系统的风险，就应选择它。",
        },
        {
          id: "dependence",
          title: "依赖与标准控制",
          label: "核心问题是系统一旦难以替换，标准、维护和关键节点由谁控制。",
        },
        {
          id: "interoperability",
          title: "与伙伴的互操作性",
          label: "最佳选择应能适配可信伙伴之间的共同规则与技术协作。",
        },
        {
          id: "autonomy",
          title: "避免被锁入阵营",
          label: "把每项数字选择都当作选边，会压缩自主性并固化分裂的国际秩序。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "政府要在价格低廉的外国整套数字基础设施与成本更高的盟友方案之间作出选择。最应依据什么？",
      helpText: "请看长期风险，不要只比较采购价格。",
      clarification: {
        whatItAsks: "应优先防范系统安全风险、难以摆脱的依赖、与伙伴不兼容，还是自主空间被阵营选择限制？",
        terms: [
          { term: "数字基础技术体系", definition: "支撑数字系统的硬件、软件、云服务与技术标准的整体组合。" },
          { term: "系统兼容协作能力", definition: "不同国家或供应商的系统可以稳定连接并协同运行。" },
        ],
      },
      options: [
        {
          id: "security",
          title: "关键系统安全",
          label: "若盟友方案能减少竞争对手未来控制或中断关键系统的可能，额外成本值得承担。",
        },
        {
          id: "dependence",
          title: "长期依赖与规则控制",
          label: "应看系统铺开后，谁掌握维护、标准和不可替代的关键环节。",
        },
        {
          id: "interoperability",
          title: "能否与可信伙伴顺畅协同",
          label: "选择应符合伙伴间共同规则，并保证跨系统的技术协作。",
        },
        {
          id: "autonomy",
          title: "不要让技术采购变成永久选边",
          label: "若每个数字决定都被视为阵营标签，国家自主空间会收窄，分裂格局也会加深。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "政府要在价格低廉的外国整套数字基础设施与成本更高的盟友方案之间作出选择。最应依据什么？",
      helpText: "请看长期风险，不要只比较前期采购价格。",
      clarification: {
        whatItAsks: "应优先防范系统安全风险、难以摆脱的依赖、与伙伴不兼容，还是自主空间被阵营选择限制？",
        terms: [
          { term: "数字技术栈", definition: "支撑数字系统的硬件、软件、云服务与技术标准的整体组合。" },
          { term: "互操作性", definition: "不同国家或供应商的系统可以稳定连接并协同运行的能力。" },
        ],
      },
      options: [
        {
          id: "security",
          title: "关键系统安全",
          label: "若盟友方案能减少竞争对手未来胁迫或瘫痪关键系统的可能，额外成本就值得承担。",
        },
        {
          id: "dependence",
          title: "长期依赖与标准控制",
          label: "应看系统一旦难以替换，谁掌握维护、标准和不可替代的关键环节。",
        },
        {
          id: "interoperability",
          title: "与伙伴的互操作性",
          label: "选择应符合可信伙伴间的共同规则，并保证跨系统的技术协作。",
        },
        {
          id: "autonomy",
          title: "避免被锁入阵营",
          label: "若每项数字选择都被视为阵营标签，国家自主空间会收窄，分裂格局也会加深。",
        },
      ],
    },
  },
  {
    questionId: "an_tradeoff_parallel_order",
    chineseDraftA: {
      prompt: "新兴大国开始建立替代性的银行、支付系统和发展论坛。更深层的问题是什么？",
      helpText: "选择这些替代安排为何具有吸引力，而不是你偏好的改革方案。",
      options: [
        {
          id: "reform",
          title: "旧有治理停止调整",
          label: "现有国际机构不再给新兴国家足够的发言权、保障或议程设置权。",
        },
        {
          id: "power",
          title: "权力率先转移",
          label: "制度冲突是物质实力变化的结果；规则之争反映的是更艰难的战略过渡。",
        },
        {
          id: "hierarchy",
          title: "国家希望摆脱等级控制",
          label: "替代性机构让国家不必完全依赖由他国控制的信贷、支付和贷款体系。",
        },
        {
          id: "legitimation",
          title: "领导人需要展现自主",
          label: "替代机构也帮助领导人向国内公众和伙伴表明，本国并非永远受困于他国主导的体系。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "新兴力量另建银行、支付网络和发展合作平台。为什么这些平行安排会受到欢迎？",
      helpText: "请选择吸引力的来源，而非你认为应该如何改革。",
      options: [
        {
          id: "reform",
          title: "原有制度没有继续分享权力",
          label: "现行机构未能让新兴国家获得与实力相称的代表权、保护和议程影响力。",
        },
        {
          id: "power",
          title: "实力格局改变后才出现制度竞争",
          label: "围绕规则的冲突，是更深层力量转移在制度层面的表现。",
        },
        {
          id: "hierarchy",
          title: "获得不受既有金融体系控制的选择",
          label: "新机构让国家能够绕开由他国主导的信贷、支付与发展融资渠道。",
        },
        {
          id: "legitimation",
          title: "对内对外展示独立地位",
          label: "另建机构让领导人证明，本国并不必然服从他国占主导的安排。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "新兴大国另建银行、支付系统和发展合作平台。为什么这些替代安排会受到欢迎？",
      helpText: "请选择吸引力的来源，而不是你认为应该如何改革。",
      options: [
        {
          id: "reform",
          title: "原有治理机制停止调整",
          label: "现有国际机构未能让新兴国家获得足够的发言权、保障和议程设置权。",
        },
        {
          id: "power",
          title: "实力格局率先改变",
          label: "围绕制度与规则的冲突，是更深层力量转移在国际安排中的表现。",
        },
        {
          id: "hierarchy",
          title: "获得不受既有等级体系控制的选择",
          label: "替代性机构让国家能够绕开由他国主导的信贷、支付与发展融资渠道。",
        },
        {
          id: "legitimation",
          title: "对内对外展示自主地位",
          label: "另建机构让领导人向国内公众和伙伴表明，本国并非永远受困于他国主导的体系。",
        },
      ],
    },
  },
  {
    questionId: "an_case_sanctions_alignment",
    chineseDraftA: {
      prompt: "一个不结盟国家谴责侵略，却依赖侵略国提供廉价能源和化肥。从它的立场看，哪种逻辑最有力？",
      helpText: "请从这个不结盟国家的处境作答。",
      options: [
        {
          id: "norm",
          title: "即使付出代价也要捍卫规则",
          label: "如果国家要可信地维护反对征服的规则，就可能必须承受真实损失。",
        },
        {
          id: "stability",
          title: "优先保护国内稳定",
          label: "先保住能源、粮食和国内政治联盟；破坏国内基础的路线无法持续。",
        },
        {
          id: "diversify",
          title: "借危机推动多元化",
          label: "更有力的办法是逐步降低结构性依赖，而不是立即转入另一种依赖。",
        },
        {
          id: "hedge",
          title: "谴责侵略，但保留战略对冲空间",
          label: "国家应反对破坏规则，却不应成为他国更广泛战略的执行工具。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "某不结盟国家反对侵略，但廉价能源和化肥主要来自侵略方。站在该国角度，最合理的考虑是什么？",
      helpText: "请代入该国的政策约束。",
      options: [
        {
          id: "norm",
          title: "承担成本，维护禁止武力征服的原则",
          label: "若想让反对侵略的立场可信，就不能在成本出现时放弃共同规则。",
        },
        {
          id: "stability",
          title: "先守住能源、粮食与国内稳定",
          label: "政府无法长期执行一条摧毁国内支持基础的外交路线。",
        },
        {
          id: "diversify",
          title: "逐步摆脱单一来源",
          label: "应趁机分散长期依赖，同时避免仓促落入新的单边依赖。",
        },
        {
          id: "hedge",
          title: "反对侵略，但不完全跟随制裁阵营",
          label: "国家可谴责破坏规则，同时不把自己变成他国整体战略的执行端。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "某个不结盟国家反对侵略，但廉价能源和化肥主要来自侵略方。站在该国角度，最合理的考虑是什么？",
      helpText: "请代入该国的政策约束。",
      options: [
        {
          id: "norm",
          title: "承担成本，捍卫反对武力征服的规则",
          label: "若想让反对侵略的立场可信，就可能必须在成本出现时仍维护共同规则。",
        },
        {
          id: "stability",
          title: "先守住国内稳定",
          label: "应先保障能源、粮食和国内政治联盟；政府无法长期执行一条破坏国内支持基础的外交路线。",
        },
        {
          id: "diversify",
          title: "借危机推动来源多元化",
          label: "应逐步降低结构性依赖，同时避免仓促落入新的单边依赖。",
        },
        {
          id: "hedge",
          title: "谴责侵略，但保留战略对冲空间",
          label: "国家可反对破坏规则，同时不把自己变成他国更广泛战略的执行端。",
        },
      ],
    },
  },
  {
    questionId: "an_case_intervention_memory",
    chineseDraftA: {
      prompt: "严重镇压发生后，一个后殖民国家看到邻国出现军事干预呼声。从该国立场看，哪种论点最有力？",
      helpText: "请从该国政府的处境作答。",
      options: [
        {
          id: "shield",
          title: "维持较高的干预门槛",
          label: "由于干预总是选择性适用，弱国不能把它当作中立规则。",
        },
        {
          id: "threshold",
          title: "极端伤害仍可成为行动理由",
          label: "即使高度重视主权，面对压倒性的大规模杀戮，也可能接受真正的例外。",
        },
        {
          id: "regional",
          title: "地区支持是关键检验",
          label: "由邻近国家界定目标与边界，比由远方大国单独设定框架更能为例外提供理由。",
        },
        {
          id: "aftermath",
          title: "先问干预之后会怎样",
          label: "核心是外部武力会真正保护民众，还是会加深崩溃与外部控制。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "邻国发生严重镇压，国际上出现动武干预的要求。一个有殖民经历的国家会怎样看这件事？",
      helpText: "请选择从该国政府角度最有说服力的判断。",
      options: [
        {
          id: "shield",
          title: "不能轻易降低动武门槛",
          label: "干预从来不是一视同仁地适用，弱国无法把它视为不偏不倚的规则。",
        },
        {
          id: "threshold",
          title: "大规模杀戮可能构成真正例外",
          label: "保护主权并不意味着面对极端暴行时永远拒绝外部行动。",
        },
        {
          id: "regional",
          title: "由本地区国家确认目标与限制",
          label: "如果例外由邻近国家共同界定，而非远方力量单方面包装，理由会更充分。",
        },
        {
          id: "aftermath",
          title: "评估保护效果与外部控制风险",
          label: "要看干预究竟能救人，还是会让国家进一步崩解并受外部支配。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "邻国发生严重镇压，国际上出现动武干预的要求。一个有殖民经历的国家会怎样看这件事？",
      helpText: "请选择从该国政府角度最有说服力的判断。",
      options: [
        {
          id: "shield",
          title: "不能轻易降低干预门槛",
          label: "干预从来不是一视同仁地适用，弱国无法把它视为不偏不倚的规则。",
        },
        {
          id: "threshold",
          title: "大规模杀戮可能构成真正例外",
          label: "高度重视主权，并不意味着面对极端暴行时永远拒绝外部行动。",
        },
        {
          id: "regional",
          title: "地区支持是关键检验",
          label: "如果例外由邻近国家共同界定目标与限制，而不是由远方大国单独包装，理由会更充分。",
        },
        {
          id: "aftermath",
          title: "评估干预之后会怎样",
          label: "要看外部武力究竟能保护民众，还是会加深崩溃与外部控制。",
        },
      ],
    },
  },
  {
    questionId: "an_case_rising_power_voice",
    chineseDraftA: {
      prompt: "一个新兴大国要求在全球规则中有更大发言权，同时扩大军事影响范围。哪种解读最有说服力？",
      helpText: "选择解释，而不是你偏好的政策回应。",
      options: [
        {
          id: "security_transition",
          title: "这主要是权力转移",
          label: "随着实力变化，新兴国家会在军事和制度层面更积极，因为旧秩序不再同样符合其利益。",
        },
        {
          id: "status_recognition",
          title: "承认其地位是核心问题",
          label: "该国既要求物质空间，也要求自身的地位与权威主张被视为具有正当性。",
        },
        {
          id: "representation",
          title: "代表权调整滞后",
          label: "更尖锐的问题是现有规则和领导结构没有充分适应新的实力分量。",
        },
        {
          id: "hierarchy_contest",
          title: "它在挑战等级体系",
          label: "争议不只涉及发言权，也涉及谁控制更广泛国际秩序中的金融、技术和议程设置。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "新兴力量一面要求改写全球规则、增加代表权，一面扩大军事存在。应如何理解这两项行动？",
      helpText: "请选择最有解释力的判断，不要选择你希望采取的对策。",
      options: [
        {
          id: "security_transition",
          title: "实力上升必然带来更广泛竞争",
          label: "旧有安排越来越不利于新兴国家，它便会同时在军事和制度领域提出更多要求。",
        },
        {
          id: "status_recognition",
          title: "它要求其他国家承认其身份与权威",
          label: "除实际利益外，该国也在争取自身地位诉求获得政治承认。",
        },
        {
          id: "representation",
          title: "现有制度未能吸纳新的实力",
          label: "问题在于规则和领导职位仍未给予该国与其分量相称的参与空间。",
        },
        {
          id: "hierarchy_contest",
          title: "争的是国际体系中的控制权",
          label: "冲突不仅是代表权问题，也涉及金融、技术与议程设置由谁主导。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "一个新兴大国一面要求在全球规则中有更大发言权，一面扩大军事影响范围。哪种解读最有说服力？",
      helpText: "请选择最有解释力的判断，而不是你希望采取的对策。",
      options: [
        {
          id: "security_transition",
          title: "这主要是权力转移",
          label: "旧有安排越来越不利于新兴国家，它便会同时在军事与制度领域提出更多要求。",
        },
        {
          id: "status_recognition",
          title: "地位获得承认是核心问题",
          label: "除实际利益外，该国也要求自身的地位与权威主张被视为具有正当性。",
        },
        {
          id: "representation",
          title: "代表权调整滞后",
          label: "现有规则和领导结构仍未给予该国与其新分量相称的参与空间。",
        },
        {
          id: "hierarchy_contest",
          title: "它在挑战国际等级体系",
          label: "冲突不仅涉及发言权，也涉及金融、技术与议程设置由谁主导。",
        },
      ],
    },
  },
  {
    questionId: "an_tradeoff_energy_alignment",
    chineseDraftA: {
      prompt: "一个政府谴责国外侵略，但迅速切断经济联系会在国内造成严重价格冲击。什么应主导其路线？",
      helpText: "选择优先事项，而不是最站得住脚的公开说法。",
      options: [
        {
          id: "defend_rule",
          title: "迅速捍卫规则",
          label: "承担真实代价，是防止侵略与夺取领土被逐渐正常化的一部分。",
        },
        {
          id: "protect_home",
          title: "保护国内稳定",
          label: "一项迅速摧毁国内政治联盟的外交政策，不会长期保持可信。",
        },
        {
          id: "phase_reduction",
          title: "分阶段减少敞口",
          label: "更有力的路线是逐步削减依赖，同时避免价格冲击强化国内强硬派。",
        },
        {
          id: "hedge_diplomatically",
          title: "保留外交空间",
          label: "谴责破坏规则，但不要让经济痛苦自动转化为追随他国更广泛的战略。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "政府反对一场对外侵略，但若立即脱钩，国内物价将剧烈上涨。政策底线应由什么决定？",
      helpText: "请选择真正的政策优先项，不要按哪种表态最好听来作答。",
      options: [
        {
          id: "defend_rule",
          title: "尽快以实际行动维护反侵略原则",
          label: "若不愿承担成本，侵略和领土兼并就更容易被视为可接受。",
        },
        {
          id: "protect_home",
          title: "先稳住国内社会与政治支持",
          label: "破坏国内联盟的外交政策无法长期执行，也就谈不上可信。",
        },
        {
          id: "phase_reduction",
          title: "有步骤地降低依赖",
          label: "逐步调整可以减少外部暴露，也能避免一次性冲击助长国内激进力量。",
        },
        {
          id: "hedge_diplomatically",
          title: "反对侵略，同时保持外交回旋",
          label: "不应让本国承受的经济代价，自动把国家锁入他国的整体战略。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "政府反对一场对外侵略，但若迅速切断经济联系，国内物价将受到严重冲击。政策路线应由什么主导？",
      helpText: "请选择真正的政策优先项，不要按哪种公开表态最容易辩护来作答。",
      options: [
        {
          id: "defend_rule",
          title: "尽快以实际行动捍卫规则",
          label: "承担真实代价，是防止侵略与夺取领土逐渐被正常化的一部分。",
        },
        {
          id: "protect_home",
          title: "先稳住国内社会与政治支持",
          label: "一项迅速破坏国内政治联盟的外交政策无法长期执行，也就难以保持可信。",
        },
        {
          id: "phase_reduction",
          title: "分阶段降低依赖",
          label: "逐步调整可以减少外部依赖，也能避免一次性冲击强化国内强硬派。",
        },
        {
          id: "hedge_diplomatically",
          title: "反对侵略，同时保持外交回旋",
          label: "不应让本国承受的经济代价，自动把国家锁入他国的更广泛战略。",
        },
      ],
    },
  },
  {
    questionId: "an_tradeoff_ceasefire_settlement",
    chineseDraftA: {
      prompt: "一场残酷战争也许只有在外部力量推迟追责、接受不平等和解时才能结束。更深层的问题是什么？",
      helpText: "选择核心取舍，而不是你希望出现的结果。",
      options: [
        {
          id: "stop_harm_now",
          title: "先停止眼前伤害",
          label: "如果不完美的和平能大幅减少杀戮并为政治修复争取时间，它仍可能具有正当理由。",
        },
        {
          id: "hold_accountability_line",
          title: "守住追责底线",
          label: "如果最残酷的战争总能让正义暂停，规范恰恰会在未来施害者最关注时被削弱。",
        },
        {
          id: "sequence_peace_and_justice",
          title: "为和平与追责安排先后顺序",
          label: "最有力的做法是以受监督的和解立即停战，同时保留日后可信追责的路径。",
        },
        {
          id: "read_the_power_distribution",
          title: "看清条款背后的权力分配",
          label: "真正的问题是谁有能力界定和平与正义；和解措辞只是这种不平衡的结果。",
        },
      ],
    },
    chineseDraftB: {
      prompt: "若要结束一场惨烈战争，外部国家可能必须暂缓问责，并接受明显不平等的停战安排。这里最根本的取舍是什么？",
      helpText: "请选择冲突的核心，不要选择你最希望实现的结局。",
      options: [
        {
          id: "stop_harm_now",
          title: "先让杀戮停下来",
          label: "只要能够显著减少伤亡、给政治修复留下时间，不公正的和平也可能值得接受。",
        },
        {
          id: "hold_accountability_line",
          title: "不能因战争艰难而放弃问责",
          label: "如果重大暴行总能以停战为由免于正义约束，未来施害者就会据此行事。",
        },
        {
          id: "sequence_peace_and_justice",
          title: "先停战，再按可信程序追责",
          label: "可用监督机制保证停火，同时明确保留后续追责通道。",
        },
        {
          id: "read_the_power_distribution",
          title: "决定和平与正义的是谈判实力",
          label: "谁掌握筹码，谁就能定义停战与问责；原则性措辞反映了力量不对称。",
        },
      ],
    },
    reconciledChinese: {
      prompt: "若要结束一场惨烈战争，外部国家可能必须暂缓问责，并接受明显不平等的停战安排。这里最根本的取舍是什么？",
      helpText: "请选择冲突的核心，而不是你最希望实现的结局。",
      options: [
        {
          id: "stop_harm_now",
          title: "先让杀戮停下来",
          label: "只要能够显著减少伤亡，并为政治修复争取时间，不完美的和平仍可能具有正当理由。",
        },
        {
          id: "hold_accountability_line",
          title: "守住追责底线",
          label: "如果最残酷的战争总能让正义暂停，相关规范恰恰会在未来施害者最关注时被削弱。",
        },
        {
          id: "sequence_peace_and_justice",
          title: "为停战与追责安排先后顺序",
          label: "可以通过受监督的安排立即停战，同时明确保留日后可信追责的路径。",
        },
        {
          id: "read_the_power_distribution",
          title: "看清条款背后的力量分布",
          label: "谁掌握筹码，谁就能界定和平与正义；和解措辞反映了这种不平衡。",
        },
      ],
    },
  },
] as const satisfies readonly ZhHansFoundationDraftRecord[]
