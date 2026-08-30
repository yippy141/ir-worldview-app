import type { FoundationQuestionSet, FoundationTier } from "@/lib/types"

export type ZhHansFoundationResultHeadingInput = {
  resultTier: FoundationTier
  questionSet: FoundationQuestionSet | null
  legacy: boolean
  lowDifferentiation: boolean
  primaryLabel: string
  runnerUpLabel: string
}

export type ZhHansFoundationResultHeading = {
  eyebrow: string
  title: string
  lead: string
}

/**
 * Chinese result headings follow the same model-status distinctions as the
 * English result, but use independently edited Chinese rather than a runtime
 * translation or English fallback.
 */
export function buildZhHansFoundationResultHeading({
  resultTier,
  questionSet,
  legacy,
  lowDifferentiation,
  primaryLabel,
  runnerUpLabel,
}: ZhHansFoundationResultHeadingInput): ZhHansFoundationResultHeading {
  const formLabel = zhHansFoundationFormLabel(questionSet, resultTier)

  if (legacy) {
    return {
      eyebrow: "较早版本保存的基础结果",
      title: `较早版本的基础读法：${primaryLabel}`,
      lead:
        "此链接保留当时发布的读法。由于无法确认其完整题组与校准元组，本页不会根据汇总分数重建精确的分类贡献。",
    }
  }

  if (lowDifferentiation && resultTier === "core") {
    return {
      eyebrow: `来自${formLabel}的初步基础读法`,
      title: `初步基础读法：${primaryLabel}与${runnerUpLabel}`,
      lead:
        "在当前题组中，这两种读法都仍然成立。下方的注册名称只是模型输出的次要简写；五道定向跟进题可继续检验两者之间的边界。",
    }
  }

  if (lowDifferentiation) {
    return {
      eyebrow: `来自${formLabel}的基础结果`,
      title: `${primaryLabel}与${runnerUpLabel}仍然接近`,
      lead:
        "当前题组没有让其中一种读法形成清楚的模型领先。下方的注册名称只是对这组相邻结果的解释性简写。",
    }
  }

  return {
    eyebrow: `来自${formLabel}的基础结果`,
    title: `${primaryLabel}在这次基础读法中领先`,
    lead:
      `这种领先只在当前题组中较为清楚。${runnerUpLabel}仍是最近的替代读法。这是模型结果，不代表持久不变的个人特质。`,
  }
}

function zhHansFoundationFormLabel(
  questionSet: FoundationQuestionSet | null,
  resultTier: FoundationTier,
) {
  if (questionSet === "core" || resultTier === "core") return "十四道核心题"
  if (questionSet === "targetedExtended") return "定向扩展题组"
  if (questionSet === "fullExtended") return "完整扩展题组"
  return "较早版本基础题组"
}
