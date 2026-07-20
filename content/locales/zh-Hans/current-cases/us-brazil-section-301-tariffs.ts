import type { ZhHansCurrentCaseRecord } from "@/content/locales/zh-Hans/types"

export const zhHansUsBrazilTariffsCase = {
  schemaVersion: 1,
  id: "economic-statecraft-us-brazil-section301-2026-07",
  slug: "us-brazil-section-301-tariffs",
  version: 1,
  publicationStatus: "published",
  launchRole: "archive",
  originalTitle: "U.S. Section 301 tariffs on Brazil and Brazil’s calibrated retaliation debate",
  title: "美国对巴西加征 301 条款关税：巴西如何权衡有限反制",
  dek: "美国一揽子选择性关税措施迫使巴西在反制、国内纾困、谈判和更广泛的规则回应之间作出选择。",
  category: "economic-statecraft",
  publishedAt: "2026-07-17",
  updatedAt: "2026-07-17",
  evidenceWindow: { start: "2026-06-26", end: "2026-07-17" },
  briefing:
    "2026 年 7 月 15 日至 16 日，美国推进了对巴西长达一年的 301 条款调查，公布对部分巴西进口商品加征 25% 关税的新方案，定于 7 月 22 日生效。美国贸易代表办公室的正式文件把行动与数字贸易、电子支付、优惠关税、反腐执法、知识产权、乙醇市场准入和非法毁林等问题相连。路透社和美联社报道显示，关税范围较大但具有选择性：牛肉、咖啡和飞机相关产品等主要出口品获得豁免，乙醇、糖、机械和家具等多类产品则受到影响。\n\n行动的时点很重要。美国政府此前在更广泛的紧急关税诉讼中受挫，正重新建立关税杠杆；布鲁金斯学会指出，301 条款提供了一条范围更窄、但在司法上可能更持久的路径。巴西称美方措施缺乏正当理由且带有政治动机，表示可能依据本国互惠法采取反制。据报道，巴西曾考虑限制美国视听企业经营或暂停部分专利，同时避免全面提高进口关税，以免直接推高巴西消费者成本。与此同时，巴西已通过国家开发银行支持的“巴西主权计划”扩大紧急融资。巴西必须判断：有限反制、谈判、联合其他国家或贸易多元化，能否在不推高国内成本、也不认可华盛顿做法的情况下遏制压力。\n\n巴西的回应必须兼顾国内成本、谈判可信度，以及选择性 301 条款压力所形成的更广泛先例。范围较窄的措施可能以有限通胀代价提高对方的政治成本；纾困、谈判或多边行动则各自保留不同形式的回旋空间，同时接受更慢或不那么显眼的缓解。",
  actors: [
    { canonical: "Brazil", display: "巴西" },
    { canonical: "United States", display: "美国" },
    {
      canonical: "Office of the U.S. Trade Representative",
      display: "美国贸易代表办公室",
    },
    { canonical: "Brazilian exporters", display: "巴西出口商" },
    { canonical: "Brazilian consumers", display: "巴西消费者" },
  ],
  perspectives: {
    global:
      "这场争端检验的是：选择性贸易压力会不会成为持久的经济治国工具，以及承压国家能否在不加重自身经济成本的情况下回应。",
    counterparties: [
      {
        actor: { canonical: "United States", display: "美国" },
        perspective:
          "华盛顿称所列巴西做法加重美国商业负担，并把 301 条款视为推动对方改变政策的合法路径。",
      },
      {
        actor: { canonical: "Brazil", display: "巴西" },
        perspective:
          "巴西利亚称关税方案缺乏正当理由且带有政治动机，同时试图保留政策空间，限制国内企业和消费者承担的损失。",
      },
    ],
  },
  factualClaims: [
    {
      id: "c1",
      text: "美国贸易代表办公室 2026 年 7 月 15 日的行动称，一项为期一年的 301 条款调查认定巴西部分做法“不合理并加重美国商业负担”。",
    },
    {
      id: "c2",
      text: "美国贸易代表办公室列出的范围包括数字贸易和电子支付服务、不公平优惠关税、反腐执法、知识产权保护、乙醇市场准入和非法毁林。",
    },
    {
      id: "c3",
      text: "路透社和美联社报道，美国新关税税率为 25%，定于 2026 年 7 月 22 日生效，咖啡、牛肉和飞机相关产品等获得豁免。",
    },
    {
      id: "c4",
      text: "路透社报道，该方案影响巴西对美出口的大约 18%。",
    },
    {
      id: "c5",
      text: "路透社报道，巴西正准备依据互惠法采取反制，并考虑针对视听企业和部分专利等措施，而不是全面提高进口关税。",
    },
    {
      id: "c6",
      text: "巴西国家开发银行的官方材料显示，巴西已重新启动“巴西主权计划”2026 年融资支持，面向受关税和更广泛国际不稳定影响的企业。",
    },
  ],
  knownUncertainties: [
    "豁免清单或海关执行细节会不会在 7 月 22 日前变化。",
    "美国后续 301 条款措施，包括与强迫劳动有关的措施，会不会显著扩大对巴西方案。",
    "巴西会选择法律与监管反制、关税反制，还是两者结合；市场会如何反映这一选择。",
    "这场对抗有多少只是与巴西选举相连的谈判姿态，又有多少代表长期贸易关系重置。",
  ],
  reasoningTags: [
    { id: "economic-leverage", label: "经济杠杆" },
    { id: "domestic-costs", label: "国内成本" },
    { id: "policy-autonomy", label: "政策自主" },
    { id: "negotiating-room", label: "谈判空间" },
    { id: "rules-and-precedent", label: "规则与先例" },
    { id: "coalition-support", label: "伙伴支持" },
  ],
  decision: {
    prompt: "巴西应如何回应美国的新关税方案？",
    options: [
      {
        id: "o1",
        label: "采取范围有限但不对称的反制",
        logic:
          "依据互惠法针对在政治上重要的美国利益采取措施，同时避免全面提高进口关税，控制巴西消费者成本。",
        acceptedTradeoff: "以更高的法律与外交升级风险，换取较低的国内通胀代价。",
      },
      {
        id: "o2",
        label: "加强国内纾困和贸易多元化，反制保持有限",
        logic:
          "扩大对受影响行业的国内支持，调整贸易流向，以多元化回应关税，而不是正面对抗。",
        acceptedTradeoff: "现在承受更多短期压力，以换取未来更大的战略灵活性。",
      },
      {
        id: "o3",
        label: "谈判分阶段的行业豁免",
        logic:
          "与华盛顿就具体行业让步、监督或技术安排展开谈判，缩小关税范围，同时保留核心主权立场。",
        acceptedTradeoff: "局势可部分降温，但要承担在压力下公开妥协的政治代价。",
      },
      {
        id: "o4",
        label: "把争端带入多边渠道",
        logic:
          "通过世界贸易组织和伙伴协调渠道处理争端，提高扩大使用 301 条款的声誉和法律成本。",
        acceptedTradeoff: "救济更慢、结果更不确定，但基于规则的反驳更有力。",
      },
    ],
  },
  worldviewReadings: [
    {
      profileId: "competitive-balancer",
      noticesFirst: "华盛顿正在用更有针对性、也更持久的法律工具重建谈判杠杆。",
      interpretation:
        "本案是一次杠杆运用：华盛顿用比已经受挫的紧急关税更有针对性、在法律上也可能更持久的工具，重新建立谈判实力。",
      recommendation: "针对在政治上重要的美国利益采取有限反制，恢复谈判杠杆，同时避免巴西国内承受广泛损失。",
      recommendedOptionIds: ["o1"],
      strongestObjection:
        "这种读法可能高估胁迫杠杆，低估豁免、目标方适应以及过度使用工具带来的政治风险。",
      updateCondition:
        "巴西作出少量让步后局势迅速降温；或有证据显示关税影响有限，却促使巴西转向其他伙伴。",
    },
    {
      profileId: "development-sovereignty-builder",
      noticesFirst: "巴西的核心问题是保留政策空间，减少未来暴露。",
      interpretation:
        "巴西最重要的问题是维护政策空间：回应既要降低脆弱性、保护国内产业，也要避免采取伤害自身更大的反制措施。",
      recommendation: "为受影响行业提供纾困，推进贸易多元化，同时建设更多国内谈判能力。",
      recommendedOptionIds: ["o2"],
      strongestObjection:
        "这种读法可能低估通过谈判获得市场准入的价值，也可能在金融和贸易现实仍有约束时夸大自主空间。",
      updateCondition:
        "在没有大规模反制的情况下达成保留巴西政策空间的协议；或有证据显示多元化工具太慢，无法抵消冲击。",
    },
    {
      profileId: "coalition-pragmatist",
      noticesFirst: "巴西需要把谈判、国内支持和外部伙伴结合成一套有分寸的回应。",
      interpretation:
        "可行的回应需要同时包括谈判、支持受影响行业，以及与其他承压经济体建立合作。",
      recommendation: "争取分阶段的行业豁免；如果谈判失败，同时组织伙伴支持更广泛的回应。",
      recommendedOptionIds: ["o3", "o4"],
      strongestObjection:
        "折中可能让各方都不满意；如果华盛顿继续升级，巴西仍可能显得软弱。",
      updateCondition:
        "第三国伙伴加入巴西的行动；或巴西保持克制后，美国仍决定扩大关税方案。",
    },
    {
      profileId: "structural-inequality-critic",
      noticesFirst: "强国可以选择性使用贸易法，同时保留符合自身国内利益的豁免。",
      interpretation:
        "更深层的机制是等级关系：强国选择性使用贸易法约束其他国家，却按本国需要保留豁免。",
      recommendation: "把争端带入多边渠道，使回应不仅针对即时关税负担，也针对这种做法形成的先例。",
      recommendedOptionIds: ["o4"],
      strongestObjection:
        "这种读法可能把巴西内部真实的政策争议过度简化，也可能忽视巴西部分做法确实给外国市场准入造成摩擦。",
      updateCondition:
        "双方在中立监督下开展透明、对等的谈判；或有证据显示巴西措施才是争端的主要经济原因。",
    },
  ],
  assumptionChallenge: {
    newInformation: "任何足以产生效果的非关税反制，给巴西企业和消费者造成的成本都可能高于最初预期。",
    prompt: "这会怎样影响你的初步判断？",
    options: [
      { id: "weakens", label: "它削弱了我的初步判断。" },
      { id: "priority", label: "它改变了方案排序，但我的结论不变。" },
      { id: "strengthens", label: "它加强了我的初步判断。" },
      { id: "unsure", label: "我仍无法确定。" },
    ],
  },
  nextRoutes: [
    {
      href: "/modules/technology",
      label: "技术与地缘经济专题",
      reason: "检验你如何权衡贸易杠杆、依赖和国内政策空间。",
    },
    {
      href: "/explore/atlas",
      label: "世界观地图",
      reason: "比较杠杆优先、自主优先、伙伴协调和等级结构四种读法。",
    },
    {
      href: "/profile",
      label: "我的画像",
      reason: "返回已保存的基线和此前的当前案例判断。",
    },
  ],
  sources: [
    {
      id: "S1",
      originalTitle:
        "USTR Section 301 Action on Brazil’s Unreasonable Acts, Policies, and Practices",
      displayTitle: "美国贸易代表办公室就巴西“不合理的法令、政策和做法”采取 301 条款行动",
      publisher: "USTR",
      publishedAt: "2026-07-15",
      accessedAt: "2026-07-17",
      url: "https://ustr.gov/about/policy-offices/press-office/press-releases/2026/july/ustr-section-301-action-brazils-unreasonable-acts-policies-and-practices",
      kind: "primary",
      claimIds: ["c1", "c2"],
    },
    {
      id: "S2",
      originalTitle:
        "Section 301 – Brazil’s Acts, Policies, and Practices Related to Digital Trade and Electronic Payment Services; Unfair, Preferential Tariffs; Anti-Corruption Enforcement; Intellectual Property Protection; Ethanol Market Access; and Illegal Deforestation",
      displayTitle:
        "301 条款调查：巴西在数字贸易与电子支付服务、不公平优惠关税、反腐执法、知识产权保护、乙醇市场准入和非法毁林方面的法令、政策与做法",
      publisher: "USTR",
      publishedAt: "2026-07-15",
      accessedAt: "2026-07-17",
      url: "https://ustr.gov/trade-topics/enforcement/section-301-investigations/section-301-brazils-acts-policies-and-practices-related-digital-trade-and-electronic-payment",
      kind: "primary",
      claimIds: ["c1", "c2"],
    },
    {
      id: "S3",
      originalTitle: "US imposes new 25% tariffs on Brazil, expands exemptions list",
      displayTitle: "美国对巴西部分商品加征 25% 关税，并扩大豁免清单",
      publisher: "Reuters",
      publishedAt: "2026-07-16",
      accessedAt: "2026-07-17",
      url: "https://www.reuters.com/world/americas/us-imposes-25-tariff-some-goods-brazil-2026-07-16/",
      kind: "high-quality-reporting",
      claimIds: ["c3", "c4"],
    },
    {
      id: "S4",
      originalTitle:
        "US imposing a 25% tariff on some Brazilian imports starting July 22, citing unfair trade practices",
      displayTitle: "美国以“不公平贸易做法”为由，自 7 月 22 日起对部分巴西进口商品征收 25% 关税",
      publisher: "AP",
      publishedAt: "2026-07-16",
      accessedAt: "2026-07-17",
      url: "https://apnews.com/article/99e8c52a44c75f31c343d7ebad41f614",
      kind: "high-quality-reporting",
      claimIds: ["c3"],
    },
    {
      id: "S5",
      originalTitle: "Brazil readies 'tough' response to new Trump tariffs, sources say",
      displayTitle: "消息人士称，巴西准备对特朗普政府新关税作出“强硬”回应",
      publisher: "Reuters",
      publishedAt: "2026-07-16",
      accessedAt: "2026-07-17",
      url: "https://www.reuters.com/world/americas/brazil-readies-tough-retaliation-new-trump-tariffs-sources-say-2026-07-16/",
      kind: "high-quality-reporting",
      claimIds: ["c5"],
    },
    {
      id: "S6",
      originalTitle:
        "Plano Brasil Soberano 2026 - medidas do BNDES frente à instabilidade internacional",
      displayTitle: "“巴西主权计划”2026：巴西国家开发银行应对国际不稳定的措施",
      publisher: "BNDES",
      publishedAt: "2026-07-15",
      accessedAt: "2026-07-17",
      url: "https://www.bndes.gov.br/wps/portal/site/home/emergenciais/brasil-soberano",
      kind: "primary",
      claimIds: ["c6"],
    },
  ],
  disputes: {
    factual: [
      "华盛顿称巴西相关做法不合理并扭曲贸易；巴西称美方行动缺乏依据且带有政治动机。",
    ],
    interpretive: [
      "一些分析把关税方案视为范围较窄的谈判工具；另一些分析认为，它是美国在 IEEPA 关税受挫后重建更广泛关税政策的模板。",
      "巴西采取不对称反制，既可能被理解为审慎的经济治国方略，也可能被理解为其杠杆有限的表现。",
    ],
  },
  sensitiveWording: [
    {
      term: "trade war",
      displayTerm: "贸易战",
      guidance: "除非升级范围显著扩大，否则使用“依据互惠法采取反制”或“反制措施”。",
      alternatives: ["关税争端", "贸易摩擦升级"],
    },
    {
      term: "USTR findings",
      displayTerm: "美国贸易代表办公室的认定",
      guidance:
        "把所列类别表述为美方认定和巴西有争议的指控；不得把每一项类别都写成已经确定的事实。",
      alternatives: ["美方调查结论", "美方提出的问题类别"],
    },
    {
      term: "election politics",
      displayTerm: "选举政治",
      guidance: "把选举政治作为本案的一个因素，同时保留法律和经济机制，避免用动机推断替代证据。",
    },
  ],
  correctionRisks: [
    {
      risk: "关税覆盖范围和豁免项目仍可能在执行前调整。",
      mitigation: "修订前，对照官方海关材料核实生效税目和豁免清单。",
    },
    {
      risk: "巴西正在考虑的反制措施可能与正式公布的措施不同。",
      mitigation: "在正式文件发布前，明确标注相关选项仍处于考虑阶段。",
    },
    {
      risk: "后续 301 条款行动可能实质改变总关税暴露。",
      mitigation: "每当新的美国贸易代表办公室行动进入记录，重新计算并说明影响范围。",
    },
  ],
  editorialMemo:
    "本案适合作为存档案例，因为它呈现美国经济治国手段正在发生的一项变化。重要的不只是关税标题，还有法律与政策工具的转换：美国更广泛的紧急关税路径受挫后，301 条款成为更有针对性、也可能更持久的施压工具。巴西既不是小型经济体，也不是同级超级大国；它有能力抵制，也会承受压力，并希望回应而不造成明显的自我伤害。因此，本案提供了真实的战略选项，而不是一个显而易见的答案。不同世界观画像可以分别强调胁迫杠杆、政策空间、伙伴协调和结构性等级。",
  editorialReview: {
    researchReviewedAt: "2026-07-17",
    sourceCheckedAt: "2026-07-17",
    copyReviewedAt: "2026-07-17",
    approvedAt: "2026-07-17",
    reviewerIds: ["research-editor", "approving-editor"],
  },
  correctionHistory: {
    status: "none-recorded",
    statusCopy: "目前没有公开更正记录。",
    lastEditorialUpdate: "2026-07-17",
    evidenceThrough: "2026-07-17",
    entries: [],
  },
} as const satisfies ZhHansCurrentCaseRecord
