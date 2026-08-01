import { chineseShellContent } from "@/content/locales"
import { zhHansFoundationQuizUi } from "@/content/locales/zh-Hans/foundation-ui"
import { assessFoundationNarrative } from "@/lib/narrative/foundation"
import type { FoundationScoringCalibration } from "@/lib/scoring"
import type {
  DimensionKey,
  DimensionScores,
  FamilyKey,
  NormativeModifier,
  StrategyModifier,
} from "@/lib/types"

type FoundationNarrativeInput = {
  familyKey: FamilyKey
  runnerUpKey: FamilyKey
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
  dimensionScores: DimensionScores
  scoringCalibration?: FoundationScoringCalibration
}

export type ZhHansFoundationNarrative = {
  state: ReturnType<typeof assessFoundationNarrative>["state"]
  familyLabel: string
  runnerUpLabel: string
  strategyLabel: string
  normativeLabel: string
  headline: string
  summary: string
  sections: Array<{ title: string; text: string }>
}

const FAMILY_LABELS = chineseShellContent.profileShare.familyLabels
const STRATEGY_LABELS = chineseShellContent.profileShare.strategyLabels
const NORMATIVE_LABELS = chineseShellContent.profileShare.normativeLabels

const FAMILY_MEANINGS: Record<FamilyKey, string> = {
  realist: "这组基线首先回到权力、竞争和承诺能否真正兑现。它不会把公开善意本身当作足够的安全保证。",
  institutionalist: "这组基线首先考察规则、监督和重复合作能否改变行为方的激励。它也会追问制度在强国施压时是否仍然有效。",
  constructivist: "这组基线首先考察身份、历史关系和正当性如何改变威胁与利益的含义。它不会把行为方的偏好预先当作固定不变。",
  criticalPoliticalEconomy: "这组基线首先考察杠杆、依赖，以及金融、生产和规则制定权如何分配。它会追问正式平等背后的结构性成本由谁承担。",
}

const STRATEGY_MEANINGS: Record<StrategyModifier, string> = {
  Restrainer: "战略上，你较常把过度扩张、承诺负担和升级风险放在前面。",
  Hedger: "战略上，你倾向同时保留竞争与克制两种考虑，根据情境决定哪一项更重要。",
  Maximizer: "战略上，当持久优势看起来可以获得时，你较愿意承受更强的施压与竞争。",
}

const NORMATIVE_MEANINGS: Record<NormativeModifier, string> = {
  Pluralist: "规范上，你为主权、秩序和不干预设定了较高权重。",
  "Conditional Solidarist": "规范上，你把秩序与纠正严重伤害视为需要继续判断的真实取舍。",
  Universalist: "规范上，在极端伤害情境中，你较愿意让更广泛的道义责任突破通常的主权边界。",
}

const DIMENSION_FRAMES: Record<DimensionKey, { high: string; low: string; middle: string }> = {
  securityCompetition: {
    high: "持久竞争与意图不确定",
    low: "竞争之外仍有较大合作空间",
    middle: "安全竞争是否构成首要约束仍未定",
  },
  institutions: {
    high: "规则、监督与制度设计",
    low: "制度背后的权力关系",
    middle: "制度能否独立改变行为仍未定",
  },
  domesticFilters: {
    high: "国内联盟、政治能力与政策传导",
    low: "外部压力对国内差异的压倒作用",
    middle: "国内政治与外部压力的相对作用仍未定",
  },
  normsIdentity: {
    high: "身份、承认与正当性",
    low: "物质利益对规范语言的优先作用",
    middle: "观念与物质条件的相对作用仍未定",
  },
  politicalEconomy: {
    high: "依赖、杠杆与政治经济结构",
    low: "安全与外交对经济结构的优先作用",
    middle: "经济结构是否应当优先解释仍未定",
  },
  restraint: {
    high: "控制成本、承诺范围与过度扩张风险",
    low: "在机会出现时扩大优势",
    middle: "克制与扩大优势之间仍保持平衡",
  },
  orderJustice: {
    high: "秩序、主权与先例",
    low: "在严重伤害面前突破主权边界",
    middle: "秩序与纠正严重不公之间仍保持张力",
  },
}

export function buildZhHansFoundationNarrative(
  input: FoundationNarrativeInput,
): ZhHansFoundationNarrative {
  const assessment = assessFoundationNarrative(
    input.dimensionScores,
    input.scoringCalibration,
  )
  const familyLabel = FAMILY_LABELS[input.familyKey]
  const runnerUpLabel = FAMILY_LABELS[input.runnerUpKey]
  const strongestSignals = assessment.topDimensions
    .map((key) => describeDimension(key, input.dimensionScores[key]))
    .join("、")

  const headline = assessment.state === "lowDifferentiation"
    ? "你的答案让几种理解世界政治的方式同时保持开放。"
    : `这组画像最先关注${describeDimension(
        assessment.topDimensions[0],
        input.dimensionScores[assessment.topDimensions[0]],
      )}。`

  const summary = assessment.state === "lowDifferentiation"
    ? `${familyLabel}是当前最接近的起点，但与${runnerUpLabel}的间距较小。更有用的信号，是哪些取舍仍会随着具体情境改变。`
    : assessment.state === "sharplyDifferentiated"
      ? `${familyLabel}是这组七维画像最清楚的简写。最明显的线索集中在${strongestSignals}。`
      : `${familyLabel}是这组基线最接近的简写，${runnerUpLabel}保留了最相邻的另一套论证。主要线索是${strongestSignals}。`

  return {
    state: assessment.state,
    familyLabel,
    runnerUpLabel,
    strategyLabel: STRATEGY_LABELS[input.strategyModifier],
    normativeLabel: NORMATIVE_LABELS[input.normativeModifier],
    headline,
    summary,
    sections: [
      {
        title: "这组画像如何理解世界政治",
        text: FAMILY_MEANINGS[input.familyKey],
      },
      {
        title: "模型为什么把它放在这里",
        text: assessment.state === "lowDifferentiation"
          ? `七个维度中，没有一组信号形成明显压倒性的中心。${familyLabel}只是较近的起点，${runnerUpLabel}仍然参与解释。`
          : `偏离量尺中点最明显的判断集中在${strongestSignals}。这些信号共同把画像拉向${familyLabel}，但名称仍只是多维结果的摘要。`,
      },
      {
        title: "这通常会怎样影响判断",
        text: `${STRATEGY_MEANINGS[input.strategyModifier]}${NORMATIVE_MEANINGS[input.normativeModifier]}`,
      },
      {
        title: "下一步最值得检验什么",
        text: `阅读${runnerUpLabel}的论证，找出它对同一事实提出了什么不同解释。再用一个具体案例检验：当成本、合法授权或依赖关系改变时，你是否仍会保留当前判断。`,
      },
    ],
  }
}

export function zhHansFoundationDimensionRows(scores: DimensionScores) {
  return (Object.keys(scores) as DimensionKey[]).map((key) => ({
    key,
    label: zhHansFoundationQuizUi.dimensionLabels[key],
    score: scores[key],
    reading: describeDimension(key, scores[key]),
  }))
}

function describeDimension(key: DimensionKey, score: number) {
  if (score >= 4.75) return DIMENSION_FRAMES[key].high
  if (score <= 3.25) return DIMENSION_FRAMES[key].low
  return DIMENSION_FRAMES[key].middle
}
