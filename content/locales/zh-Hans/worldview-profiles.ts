import type { ZhHansWorldviewProfileCopy } from "@/content/locales/zh-Hans/types"

export const zhHansWorldviewProfilePageUi = {
  eyebrow: "世界观画像",
  decisionRule: "判断规则",
  readingAria: "阅读提示",
  howToRead: "如何阅读",
  continuousTitle: "连续画像，不是固定类型",
  continuousBody: "名称用于概括一组相邻判断，不表示人口类别、置信度或永久身份。",
  methods: "阅读方法与局限",
  decides: "这份画像如何作出判断",
  neighbors: "相邻画像",
  neighborsNote: "相邻关系来自同一份规范画像目录；中文名称不会改变匹配规则或坐标。",
  compare: (name: string) => `比较${name}`,
  methodStatus: "方法与编辑状态",
  methodBody: [
    "世界观画像是对多维匹配的编辑型摘要。它们是连续、解释性的画像，不是人群类型或固定身份。",
    "本页只使用已经审校的中文核心说明。尚未审校的英文案例、类比和压力测试不会在中文路线中静默出现。",
  ],
  openMap: "打开世界观地图",
  readMethods: "阅读方法",
} as const

/**
 * Public names and the two core descriptions for the ten V19.1 profiles.
 * Technical descriptors remain available in English as canonical editorial
 * references; these names do not add or alter scored worldview families.
 */
export const zhHansWorldviewProfiles = [
  {
    id: "broad-spectrum-bridge-builder",
    originalPublicName: "Several Lenses",
    publicName: "多重视角",
    originalTechnicalDescriptor: "Bridge Builder",
    decisionRule: "先保留几种解释，等案例明显支持其中一种再作取舍。",
    cardSummary:
      "这种画像会同时保留几种相邻论证，先寻找可行的交集，再决定是否转向更鲜明的立场。",
    detailSummary:
      "这不只是犹豫，而是有意识地同时保留几条解释路径。读者通常希望看到更多证据，才会把某一传统当作默认视角。",
  },
  {
    id: "constraint-first-realist",
    originalPublicName: "Power with Limits",
    publicName: "权力与边界",
    originalTechnicalDescriptor: "Constraint-First Realist",
    decisionRule: "维护战略位置，同时为升级和过度扩张设定明确边界。",
    cardSummary:
      "这种画像从竞争与约束出发，但警惕过度扩张；在主张更强硬的政策前，会先寻找可以守住的上限。",
    detailSummary:
      "这种现实主义读法把竞争视为持久条件，但不把每一场竞争都当作进一步施压的理由。首要倾向是守住位置，同时避免承担代价高昂、难以维持或难以逆转的承诺。",
  },
  {
    id: "competitive-balancer",
    originalPublicName: "Power and Leverage",
    publicName: "权力与杠杆",
    originalTechnicalDescriptor: "Competitive Balancer",
    decisionRule: "在压力能够把优势转化为持久位置时，使用可信的杠杆。",
    cardSummary:
      "这种画像会很快回到竞争、杠杆和可信的战略定位；一旦机会真实存在，也更愿意扩大优势。",
    detailSummary:
      "这种画像把竞争视为大国政治的常态。与“权力与边界”相比，它更愿意检验机会、提高对手成本，并把暂时优势转化为持久位置。",
  },
  {
    id: "coalition-pragmatist",
    originalPublicName: "Coalitions First",
    publicName: "伙伴协调优先",
    originalTechnicalDescriptor: "Coalition Pragmatist",
    decisionRule: "选择伙伴能够共同承担并长期维持的方案。",
    cardSummary:
      "这种画像重视可行的协调和持久的伙伴一致，更少依赖僵硬的阵营纪律，也不把单独行动的自主性置于一切之上。",
    detailSummary:
      "这种画像并不理想化制度。只有当制度能够维持伙伴合作，并让政策长期可用时，它才会信任制度安排。",
  },
  {
    id: "institution-builder",
    originalPublicName: "Rules and Cooperation",
    publicName: "规则与合作",
    originalTechnicalDescriptor: "Institution Builder",
    decisionRule: "在放弃制度路径之前，先尝试规则、监督和反复合作。",
    cardSummary:
      "这种画像把规则、监督和反复合作视为长期维持秩序的首要路径。",
    detailSummary:
      "这种画像认为设计良好的制度能够产生真实作用：规则和监督本身可以帮助稳定合作，同时伙伴协调仍然重要。",
  },
  {
    id: "legitimacy-attuned-reader",
    originalPublicName: "Meaning and Legitimacy",
    publicName: "意义与正当性",
    originalTechnicalDescriptor: "Legitimacy Reader",
    decisionRule: "判断一项行动时，考察身份、历史和正当性如何塑造它的意义。",
    cardSummary:
      "这种画像不断追问：身份、承认和正当性如何改变人们对权力、威胁与合作的理解。",
    detailSummary:
      "这种画像不把物质事实视为不言自明。它会继续追问各方如何理解彼此、哪些主张被认为正当，以及历史关系如何改变同一项行动的意义。",
  },
  {
    id: "justice-forward-solidarist",
    originalPublicName: "Justice and Protection",
    publicName: "正义与保护",
    originalTechnicalDescriptor: "Justice-Forward Solidarist",
    decisionRule: "只有当行动具有正当依据并受到约束时，才让对人的严重风险压过主权原则。",
    cardSummary:
      "这种画像认为，在严重的道义风险面前，严格的不干涉原则有时可以让位，尤其是正当性与保护责任相互支持时。",
    detailSummary:
      "这种画像真正重视人道保护和更广泛的道义主张。它仍关注授权和先例，但更愿意主张：在极端情况下，这些护栏应当允许有限调整。",
  },
  {
    id: "structural-inequality-critic",
    originalPublicName: "Power Behind the Rules",
    publicName: "规则背后的权力",
    originalTechnicalDescriptor: "Structural Inequality Critic",
    decisionRule: "在正式规则背后追问：谁制定条件，谁获益，谁承担成本。",
    cardSummary:
      "这种画像通过杠杆、依赖，以及对金融、生产和规则制定权的不平等控制来理解世界政治。",
    detailSummary:
      "这种画像怀疑看似中性的秩序叙事。它首先考察谁控制交换条件、谁吸收冲击，以及谁的依赖正在被他人管理。",
  },
  {
    id: "development-sovereignty-builder",
    originalPublicName: "Capacity and Autonomy",
    publicName: "能力与自主",
    originalTechnicalDescriptor: "Development-Sovereignty Builder",
    decisionRule: "优先选择能够建设能力并保留未来回旋空间的方案。",
    cardSummary:
      "这种画像从政策空间和生产能力出发，警惕会封闭未来选择的依赖关系。",
    detailSummary:
      "这种画像不太在意眼前声望，更关心一国能否长期保留回旋空间。产业能力、融资条件和战略依赖，都被视为主权的一部分。",
  },
  {
    id: "cross-pressured-synthesizer",
    originalPublicName: "Different by Domain",
    publicName: "因议题而异",
    originalTechnicalDescriptor: "Cross-Pressured Synthesizer",
    decisionRule: "让判断逻辑服从具体议题，不把同一规则强加给所有案例。",
    cardSummary:
      "这种画像不会归入一套整齐的主张：不同议题或题型会把判断明显拉向不同方向。",
    detailSummary:
      "这不是简单的意见重叠。读者会在一些条件下明显转向某种逻辑，又在另一些条件下改变重点。更准确的读法，是把结果视为有结构的张力，而不是模糊的中间位置。",
  },
] as const satisfies readonly ZhHansWorldviewProfileCopy[]

export const zhHansWorldviewProfileById = Object.fromEntries(
  zhHansWorldviewProfiles.map((profile) => [profile.id, profile]),
)
