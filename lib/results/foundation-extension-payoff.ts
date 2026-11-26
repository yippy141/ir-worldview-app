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
  const receipt = draft && draftJson ? JSON.parse(draftJson) : null
  if (evidence && draft && receipt?.completed === true
    && receipt.localEvidenceId === evidence.binding.localCompletionId
    && draft.foundationCopy?.status === "single-copy"
    && draft.foundationCopy.version === evidence.binding.copyVersion
    && draft.foundationCopy.locale === evidence.binding.completionLocale
    && draft.questionSet === resolved.questionSet
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
        ? zh ? "追加题组仍未分开相互竞争的解释。" : "The extra questions still leave more than one interpretation open."
        : coreView.kind === "clear" && core.familyKey !== current.familyKey
          ? zh ? `核心部分以${coreName}领先，完成题组则以${primary}领先；追加题组使原先的解释复杂化了。` : `${coreName} led after the core questions. With the extra answers included, ${primary} leads.`
          : zh ? `完成题组支持${primary}。${coreView.kind === "clear" ? "这与核心部分的领先解释一致。" : "核心部分尚未形成清楚的单一领先解释。"}` : `${primary} leads after the extra questions. ${coreView.kind === "clear" ? "It also led after the core questions." : "The core questions alone left the lead open."}`
    }
  }
  return {
    comparison,
    title: zh ? "追加题目带来了什么" : "What the additional questions contributed",
    summary: !presentation.showArchetype
      ? zh ? "完成追加题目后，领先传统仍未分开。当前维度分数比由排序生成的名称更有解释力。" : "Several traditions still share the lead. The seven scales show where your answers fall."
      : extraRecords.length
        ? zh ? `保留的追加题目比较通过${dimensions}，支持${primary}相对于${runner}的解释。${unresolved ? "不过，完成题组后两种解释仍未明显分开。" : "这有助于说明当前领先解释获得了哪些支持。"}`
          : `In these selected questions about ${dimensions}, your choices favored ${primary} over ${runner}. ${unresolved ? "Even so, the completed form leaves these interpretations tied or close." : "These are the answers that most clearly distinguish the two in the saved examples."}`
        : zh ? `完成追加题目后，${unresolved ? `${primary}与${runner}仍然接近或并列` : `${primary}在当前题组中领先`}。当前页面没有可用的追加答案比较记录，无法指出哪些具体选择加强或复杂化了结果。`
          : `After the additional questions, ${unresolved ? `${primary} and ${runner} remain tied or close` : `${primary} leads within this form`}. The extra answers are unavailable here. The scores alone cannot identify which choices made the difference.`,
    note: zh ? "这里比较的是同一完成题组中保留答案与替代项的作用，不是核心题组与扩展题组之间的分数增减。各题组使用各自的校准。仅保留少量示例，不能代表所有追加答案。"
      : "Each form uses its own scoring scale. The examples compare answers within the extended form. Only a few are saved.",
  }
}
