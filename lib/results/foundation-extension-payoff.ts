import type { Locale } from "@/i18n/routing"
import { buildFoundationCopySharePayload } from "@/lib/foundation-copy-share"
import { parseQuizSession } from "@/lib/quiz-session"
import { dimensionLabels, foundationCoreQuestions, getFoundationResultQuestions, selectFoundationAnswersForSet } from "@/lib/quiz-schema"
import { generateResult, getV2ScoringCalibration } from "@/lib/scoring"
import { encodePayload, resolveFoundationPayload } from "@/lib/share"
import { traditionNounLabel } from "@/lib/worldview-config"
import { zhHansFoundationQuizUi } from "@/content/locales/zh-Hans/foundation-ui"
import { classifyFoundationPresentation, foundationLensSubtitle } from "@/lib/results/foundation-result-heading"
import type { FoundationLocalEvidenceSet } from "@/lib/results/local-evidence"

/** Extra-item counterfactuals use the completed form's own calibration. Never
 * subtract core and extended scores, or infer a personal history from a URL. */
export function buildFoundationExtensionPayoff(
  payload: string,
  evidence: FoundationLocalEvidenceSet | null,
  locale: Locale = "en",
  draftJson: string | null = null,
) {
  const resolved = resolveFoundationPayload(payload)
  if (!resolved || !resolved.questionSet || resolved.questionSet === "core") return null
  const zh = locale === "zh-Hans"
  const presentation = classifyFoundationPresentation(resolved.result,
    getV2ScoringCalibration(resolved.scoringCalibration).lowDifferentiationThreshold)
  const coreIds = new Set(foundationCoreQuestions.map(question => question.id))
  const extraRecords = evidence?.records.filter(record => !coreIds.has(record.itemId)) ?? []
  const dimensions = [...new Set(extraRecords.map(record => record.contribution.separatingDimension))]
    .map(key => zh ? zhHansFoundationQuizUi.dimensionLabels[key] : dimensionLabels[key]).join(zh ? "、" : ", ")
  const primary = zh ? foundationLensSubtitle([resolved.result.familyKey], locale) : traditionNounLabel(resolved.result.familyKey)
  const runner = zh ? foundationLensSubtitle([resolved.result.runnerUpKey], locale) : traditionNounLabel(resolved.result.runnerUpKey)
  const unresolved = presentation.kind !== "clear"
  let comparison: string | null = null
  const draft = parseQuizSession(draftJson)
  if (evidence && draft && draft.questionSet === resolved.questionSet
    && getFoundationResultQuestions(draft.questionSet, draft.targetedFamilyPair).every(q => draft.answers[q.id] !== undefined)) {
    const current = generateResult(selectFoundationAnswersForSet(draft.answers, draft.questionSet, draft.targetedFamilyPair), "analyst", resolved.scoringCalibration)
    const rebuilt = buildFoundationCopySharePayload(current, evidence.binding.completionLocale, draft.questionSet, draft.targetedFamilyPair, evidence.binding.copyVersion)
    // A matching URL alone never establishes local completion. The caller must
    // first supply exact, completion-bound evidence; only then inspect a draft.
    if (encodePayload(rebuilt) === encodePayload(resolved.payload)) {
      const core = generateResult(selectFoundationAnswersForSet(draft.answers, "core"), "analyst", "core")
      const coreView = classifyFoundationPresentation(core, getV2ScoringCalibration("core").lowDifferentiationThreshold)
      const coreName = zh ? foundationLensSubtitle([core.familyKey], locale) : traditionNounLabel(core.familyKey)
      comparison = unresolved
        ? zh ? "追加题组仍未分开相互竞争的解释。" : "The additional form leaves competing interpretations unresolved."
        : coreView.kind === "clear" && core.familyKey !== current.familyKey
          ? zh ? `核心部分以${coreName}领先，完成题组则以${primary}领先；追加题组使原先的解释复杂化了。` : `The core portion leads with ${coreName}, while the completed form leads with ${primary}; the additional form complicates the earlier interpretation.`
          : zh ? `完成题组支持${primary}。${coreView.kind === "clear" ? "这与核心部分的领先解释一致。" : "核心部分尚未形成清楚的单一领先解释。"}` : `The completed form supports ${primary}. ${coreView.kind === "clear" ? "This reinforces the leading interpretation of the core portion." : "The core portion did not establish a clear single-family lead."}`
    }
  }
  return {
    comparison,
    title: zh ? "追加题目带来了什么" : "What the additional questions contributed",
    summary: !presentation.showArchetype
      ? zh ? "完成追加题目后，领先传统仍未分开。当前维度分数比由排序生成的名称更有解释力。" : "After the additional questions, the leading traditions remain unresolved. The dimension scores are more informative than the name produced by their ordering."
      : extraRecords.length
        ? zh ? `保留的追加题目比较通过${dimensions}，支持${primary}相对于${runner}的解释。${unresolved ? "不过，完成题组后两种解释仍未明显分开。" : "这有助于说明当前领先解释获得了哪些支持。"}`
          : `The retained additional-answer comparisons reinforced ${primary} relative to ${runner} through ${dimensions}. ${unresolved ? "Even so, the completed form leaves these interpretations tied or close." : "These examples show where the current leading interpretation gained support."}`
        : zh ? `完成追加题目后，${unresolved ? `${primary}与${runner}仍然接近或并列` : `${primary}在当前题组中领先`}。当前页面没有可用的追加答案比较记录，无法指出哪些具体选择加强或复杂化了结果。`
          : `After the additional questions, ${unresolved ? `${primary} and ${runner} remain tied or close` : `${primary} leads within this form`}. No additional-answer comparison records are available here, so this page cannot identify which extra choices reinforced or complicated that result.`,
    note: zh ? "这里比较的是同一完成题组中保留答案与替代项的作用，不是核心题组与扩展题组之间的分数增减。各题组使用各自的校准。仅保留少量示例，不能代表所有追加答案。"
      : "This compares retained answers with alternatives within the same completed form, not score changes between core and extended forms. Each form uses its own calibration. Only a few examples are retained; they do not represent every additional answer.",
  }
}
