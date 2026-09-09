import type { ZhHansFoundationQuestionCopy } from "@/content/locales/zh-Hans/foundation-types"

/** Copy revision 2. Issued revision 1 remains in foundation-copy*.ts. */
export const zhHansFoundationCopyV2: Readonly<Record<string, ZhHansFoundationQuestionCopy>> = {
  sc2: {
    prompt: "由于无法确定他国的长期意图，即使双方持续合作，继续做好军事准备仍有必要。",
    clarification: { whatItAsks: "对他国未来行为的不确定，是否会促使国家准备应对冲突？" },
  },
  ni2: {
    prompt: "一个国家寻求他国承认的诉求，往往会改变其领导人认为重要的外交政策目标。",
    clarification: { whatItAsks: "国家利益是否部分由地位、身份认同和他国承认塑造？" },
  },
  v21_in_rev_03: {
    prompt: "当参与国保有足够力量执行约定时，国际协议就能延续。",
    clarification: { whatItAsks: "协议能够延续，是否因为参与国仍有力量维护并执行协议？" },
  },
  an_ni3: {
    prompt: "对手被排除在谈判之外、被拒绝给予外交承认，或被当作次等强国对待时的反应，有助于预测它接下来会怎么做。",
    clarification: { whatItAsks: "对手面对其所感受到的地位轻视时的反应，能否帮助预测它的下一步行动？", terms: [{ term: "地位", definition: "一个国家认为自己应当从其他国家获得的地位与承认。" }] },
  },
  an_pe4: {
    prompt: "未来十年，对技术规则和关键基础设施的控制，将成为足以与军事实力相匹敌的国际权力来源。",
    clarification: { whatItAsks: "这里比较的是军事与领土力量，以及对关键技术、网络和使其协同运作的规则的控制。" },
  },
  an_case_finance: {
    prompt: "一个中等收入国家将本币汇率盯住美元，银行和企业同时大量借入美元债务。全球利率上升，外国贷款方撤资，紧急贷款又要求该国在经济衰退期间削减支出。哪项因素最能解释这场危机为何如此难以遏止？",
    helpText: "请选择应当指导最初应对措施的解释。",
    options: [
      { id: "credibility", title: "国内政策可信度失灵", label: "固定汇率和外币借款放大了外部冲击。重建对国内政策的信任，是复苏的首要条件。" },
      { id: "pragmatic", title: "复合危机需要多方面修复", label: "国内政策选择和债权人的制约都在起作用。应采取临时管制并重谈条件，同时不放弃更广泛的金融体系。" },
      { id: "dependence", title: "结构性依赖暴露", label: "危机暴露了对外币融资和债权人条件的依赖。除非这种依赖发生变化，否则危机还会重演。" },
      { id: "coalitions", title: "国内分配冲突", label: "外部融资设定了约束，但国内政治决定哪些劳动者、企业和地区承担削减支出的代价。" },
    ],
  },
  an_tradeoff_evidence: {
    prompt: "边境冲突后，对手撤回部分部队并同意设立军事热线，但仍保留新部署的导弹，国内也面临民族主义压力。判断局势缓和能否持续时，应以哪项证据为主要依据？",
    helpText: "当信号指向不同方向时，请选择你会首先信任的证据。",
    options: [
      { id: "capabilities", title: "能力与军事态势", label: "导弹和剩余兵力的部署最重要，因为无论作出什么承诺或使用什么政治语言，这些力量都可以投入使用。" },
      { id: "commitments", title: "制度与承诺", label: "是否遵守撤军安排、是否使用热线最重要，因为可观察的履约行为比公开表态更难伪装。" },
      { id: "coalitions", title: "国内政治能否持续支撑", label: "最有用的线索是领导人能否遏制民族主义压力，并保持国内对缓和路线的支持。" },
      { id: "status", title: "地位与关系信号", label: "要看领导人是否不再把争端描述为对国家地位的考验；这种变化会改变剩余武器所传达的含义。" },
    ],
  },
  an_case_intervention_memory: {
    prompt: "一次重大叛乱袭击后，萨赫勒地区某国政府收到来自其前殖民宗主国的派兵援助提议。这支部队可能迅速提供帮助，但以往的行动留下了怨恨，当地能力也依然薄弱。最应看重什么？",
    helpText: "请站在这个萨赫勒国家政府的立场作答。",
    options: [
      { id: "shield", title: "保护主权和当地控制权", label: "拒绝任何给予外来部队无期限权限的安排；短期援助不值得以重新陷入依赖为代价。" },
      { id: "threshold", title: "紧迫危险可以成为接受援助的理由", label: "如果平民和国家存续面临极端危险，即使存在这段历史，受到严格限制的外来武力也可以有正当理由。" },
      { id: "regional", title: "由地区国家主导", label: "只有当行动目标、指挥和退出条件主要由邻国决定时，才接受这一行动提供的援助。" },
      { id: "aftermath", title: "不仅看如何进入，也看如何退出", label: "决定性的检验是行动结束后，当地部队和机构是否更强，而不是再次形成没有明确期限的安全依赖。" },
    ],
  },
  an_tradeoff_energy_alignment: {
    prompt: "一个条约盟国发现，其主要安全伙伴使用武力，明显违反了双方签署的协议。暂停基地使用权可以维护规则，却也会使该盟国更易受到邻近对手的威胁，并危及当地数千个就业岗位。应以什么原则指导回应？",
    helpText: "请选择应当主导决策的优先事项，而不是最容易作出的公开表态。",
    options: [
      { id: "defend_rule", title: "立即暂停使用权", label: "如果条约盟国继续为明显的违约行为提供条件，就无法使协议可信；即使要承担真实的安全和经济代价，也应暂停使用权。" },
      { id: "protect_home", title: "保障眼前的安全", label: "不要为了无法安全维持的回应，牺牲本国的威慑地位或国内政治联盟。" },
      { id: "phase_reduction", title: "分阶段降低依赖", label: "制定时间表，先使安全支持和当地经济更加多元，再将基地使用权作为施压手段。" },
      { id: "hedge_diplomatically", title: "将谴责与使用权分开处理", label: "谴责违约并推动解决争端，但只要违规行为没有扩大，就维持基地安排。" },
    ],
  },
}
