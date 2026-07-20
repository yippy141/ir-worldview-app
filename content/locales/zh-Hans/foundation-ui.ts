import type { ChoiceCardType, DimensionKey, QuestionKind, QuizMode } from "@/lib/types"

export type FoundationQuizUiCopy = {
  loading: string
  eyebrow: string
  title: string
  adaptedBeta: string
  modeSummary: Readonly<Record<QuizMode, string>>
  modeLabels: Readonly<Record<QuizMode, string>>
  answered: (answered: number, total: number) => string
  progressAria: string
  contextAssistOn: string
  contextAssistOff: string
  startOver: string
  switchToAnalyst: string
  switchToStandard: string
  confirmAnalyst: string
  confirmStandard: string
  returnToReview: string
  part: (index: number, total: number, title: string) => string
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
  midpointComplete: (section: string) => string
  midpointTitle: string
  midpointLead: (first: string, second: string) => string
  midpointNote: string
  continue: string
  hideExplainer: string
  plainLanguageExplanation: string
  quickExplainer: string
  quickGlossary: string
  questionKinds: Readonly<Record<QuestionKind, string>>
  cardTypes: Readonly<Record<ChoiceCardType, string>>
  choiceInstructions: Readonly<Record<ChoiceCardType, string>>
  dimensionLabels: Readonly<Record<DimensionKey, string>>
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
  upgradeEyebrow: string
  upgradeTitle: string
  upgradeBody: string
  upgradeAction: string
  upgradeConfirm: string
  edit: string
  likertLabels: Readonly<Record<number, string>>
  mostPersuasive: (title: string, label: string) => string
  rankedPersuasive: (primary: string, secondary: string) => string
  questionKinds: Readonly<Record<QuestionKind, string>>
  cardTypes: Readonly<Record<ChoiceCardType, string>>
  modeLabels: Readonly<Record<QuizMode, string>>
}

export const zhHansFoundationQuizUi = {
  loading: "正在读取草稿…",
  eyebrow: "国际关系世界观清单",
  title: "基础问卷",
  adaptedBeta: "简体中文改编测试版",
  modeSummary: {
    standard: "20 道题 · 约需 12 至 16 分钟",
    analyst: "44 道题 · 约需 30 至 40 分钟 · 增加具体取舍情境与指定行为方视角题",
  },
  modeLabels: {
    standard: "标准模式",
    analyst: "分析模式",
  },
  answered: (answered, total) => `已回答 ${answered} / ${total}`,
  progressAria: "问卷进度",
  contextAssistOn: "解释辅助：开",
  contextAssistOff: "解释辅助：关",
  startOver: "重新开始",
  switchToAnalyst: "切换至分析模式 →",
  switchToStandard: "← 返回标准模式",
  confirmAnalyst: "切换至分析模式会清除当前答案。是否继续？",
  confirmStandard: "返回标准模式会清除当前分析模式答案。是否继续？",
  returnToReview: "← 返回复核页",
  part: (index, total, title) => `第 ${index} 部分，共 ${total} 部分 · ${title}`,
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
  midpointComplete: (section) => `${section}已完成`,
  midpointTitle: "你的基础画像开始显现。",
  midpointLead: (first, second) => `目前较明显的两条线索是“${first}”和“${second}”。`,
  midpointNote: "这只是根据首批答案生成的阶段性读法。剩余题目会继续检验和调整这组线索。",
  continue: "继续",
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
  localProcessing: "只有在你点击“生成”后，系统才会计算结果。所有处理都在当前浏览器中完成。",
  upgradeEyebrow: "希望增加更多情境？",
  upgradeTitle: "你已完成标准模式。",
  upgradeBody: "分析模式使用相同计分方法，并增加具体取舍情境与指定行为方视角题。",
  upgradeAction: "尝试分析模式",
  upgradeConfirm: "分析模式会重新开始基础问卷并清除当前标准模式答案。是否继续？",
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
  modeLabels: zhHansFoundationQuizUi.modeLabels,
} satisfies FoundationReviewUiCopy
