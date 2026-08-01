import type {
  ChoiceCardType,
  DimensionKey,
  FoundationQuestionSet,
  QuestionKind,
} from "@/lib/types"

export type FoundationQuizUiCopy = {
  loading: string
  eyebrow: string
  title: string
  adaptedBeta: string
  setSummary: Readonly<Record<FoundationQuestionSet, string>>
  setLabels: Readonly<Record<FoundationQuestionSet, string>>
  answered: (answered: number, total: number) => string
  progressAria: string
  contextAssistOn: string
  contextAssistOff: string
  startOver: string
  returnToReview: string
  questionProgress: (label: string, index: number, total: number) => string
  howToAnswer: string
  publicDefensibilityNote: string
  analystSecondChoiceNote: string
  stronglyDisagree: string
  stronglyAgree: string
  likertAria: (value: number) => string
  secondMostPersuasive: string
  secondChoiceHelp: string
  back: string
  next: string
  reviewAnswers: string
  hideExplainer: string
  plainLanguageExplanation: string
  quickExplainer: string
  quickGlossary: string
  questionKinds: Readonly<Record<QuestionKind, string>>
  cardTypes: Readonly<Record<ChoiceCardType, string>>
  choiceInstructions: Readonly<Record<ChoiceCardType, string>>
  dimensionLabels: Readonly<Record<DimensionKey, string>>
  /**
   * Copy for the live position map beside the question. Optional: a locale
   * shows the map once its own copy is approved. The axis readings the map
   * prints come from lib/results/position and are still English-only, so a
   * locale adding this key needs that surface reviewed at the same time.
   */
  positionMap?: {
    label: string
    pending: string
  }
}

export type FoundationReviewUiCopy = {
  loading: string
  eyebrow: string
  title: string
  intro: string
  progress: (mode: string, answered: number, total: number) => string
  questionsHeading: string
  incomplete: string
  complete: string
  generating: string
  generate: string
  back: string
  startOver: string
  localProcessing: string
  setLabels: Readonly<Record<FoundationQuestionSet, string>>
  edit: string
  likertLabels: Readonly<Record<number, string>>
  mostPersuasive: (title: string, label: string) => string
  rankedPersuasive: (primary: string, secondary: string) => string
  questionKinds: Readonly<Record<QuestionKind, string>>
  cardTypes: Readonly<Record<ChoiceCardType, string>>
}

export const zhHansFoundationQuizUi = {
  loading: "正在读取草稿…",
  eyebrow: "国际关系世界观清单",
  title: "基础问卷",
  adaptedBeta: "简体中文改编测试版",
  setSummary: {
    core: "14 道核心题 · 约需 6 至 8 分钟 · 完成后先生成暂定结果",
    targetedExtended: "5 道跟进题 · 根据最接近的两个模型家族定向选择",
    fullExtended: "54 道附加题 · 完整扩展题组",
  },
  setLabels: {
    core: "核心题组",
    targetedExtended: "定向扩展",
    fullExtended: "完整扩展",
  },
  answered: (answered, total) => `已回答 ${answered} / ${total}`,
  progressAria: "问卷进度",
  contextAssistOn: "解释辅助：开",
  contextAssistOff: "解释辅助：关",
  startOver: "重新开始",
  returnToReview: "← 返回复核页",
  questionProgress: (label, index, total) => `${label} · 第 ${index} 题，共 ${total} 题`,
  howToAnswer: "如何回答本题",
  publicDefensibilityNote:
    "请不要因为某个答案更适合公开表态、案例中的其他行为方可能偏好它，或官员目前这样说就选择它；除非这也确实是你自己的判断。",
  analystSecondChoiceNote: "分析模式中，如果另一个选项仍有一定说服力，你还可以标记第二顺位；它的计分权重较低。",
  stronglyDisagree: "完全不同意",
  stronglyAgree: "完全同意",
  likertAria: (value) => value === 1
    ? "1 — 完全不同意"
    : value === 7
      ? "7 — 完全同意"
      : `${value} / 7`,
  secondMostPersuasive: "第二顺位判断",
  secondChoiceHelp: "仅在另一个选项也能表达部分判断时使用。它的计分权重低于主要选择。",
  back: "返回",
  next: "下一题",
  reviewAnswers: "复核答案 →",
  hideExplainer: "收起说明",
  plainLanguageExplanation: "查看简明说明",
  quickExplainer: "查看答题说明",
  quickGlossary: "术语速查",
  questionKinds: {
    likert: "基础判断",
    tradeoff: "取舍题",
    miniCase: "情境题",
  },
  cardTypes: {
    explanation: "解释逻辑",
    decision: "决策判断",
    actorLens: "行为方视角",
    both: "综合判断",
  },
  choiceInstructions: {
    explanation: "请根据自己的分析判断，选择最能解释本案驱动因素的选项。",
    decision: "请根据自己的分析判断，选择在本案中最应优先考虑的因素。",
    actorLens: "请根据自己的分析判断，选择从指定行为方战略位置看最有说服力的逻辑，而不是你个人最偏好的政策。",
    both: "请根据自己的分析判断，选择总体上最有说服力的选项。",
  },
  dimensionLabels: {
    securityCompetition: "安全竞争",
    institutions: "制度与规则",
    domesticFilters: "国内政治",
    normsIdentity: "身份与正当性",
    politicalEconomy: "市场与依赖",
    restraint: "克制与优势",
    orderJustice: "秩序与正义",
  },
} satisfies FoundationQuizUiCopy

export const zhHansFoundationReviewUi = {
  loading: "正在读取答案…",
  eyebrow: "复核答案",
  title: "复核你的基础问卷答案",
  intro: "生成结果前，请逐项检查答案。之后仍可另行完成安全或技术专题；专题不会改写基础分数。",
  progress: (mode, answered, total) => `${mode} · 已回答 ${answered} / ${total}`,
  questionsHeading: "基础问卷题目",
  incomplete: "完成所有基础问卷题目后，才能生成结果。",
  complete: "你的基础结果已可生成。安全与技术专题会继续保持为单独读法。",
  generating: "正在生成…",
  generate: "生成我的结果 →",
  back: "返回基础问卷",
  startOver: "重新开始",
  localProcessing:
    "结果在当前浏览器中计算。仅当你允许粗粒度产品分析且汇总服务已启用时，第一方计数器才会接收问卷到达步骤；生成结果时，仅接收推导出的分数与标签，以及各题 ID 和粗粒度答题时长区间，不包含你的答案、原始时间戳、答题顺序或任何标识符。",
  setLabels: zhHansFoundationQuizUi.setLabels,
  edit: "修改",
  likertLabels: {
    1: "完全不同意",
    2: "不同意",
    3: "比较不同意",
    4: "既不同意也不反对",
    5: "比较同意",
    6: "同意",
    7: "完全同意",
  },
  mostPersuasive: (title, label) => `主要选择：${title} — ${label}`,
  rankedPersuasive: (primary, secondary) => `主要选择：${primary} · 第二顺位：${secondary}`,
  questionKinds: zhHansFoundationQuizUi.questionKinds,
  cardTypes: zhHansFoundationQuizUi.cardTypes,
} satisfies FoundationReviewUiCopy
