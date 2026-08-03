import { zhHansFoundationAnalystItemAnalysisA } from "@/content/locales/zh-Hans/foundation-item-analysis-analyst-a"
import { zhHansFoundationAnalystItemAnalysisB } from "@/content/locales/zh-Hans/foundation-item-analysis-analyst-b"
import { zhHansFoundationStandardItemAnalysis } from "@/content/locales/zh-Hans/foundation-item-analysis-standard"
import { zhHansFoundationV21ItemAnalysis } from "@/content/locales/zh-Hans/foundation-v21-additions"
import { zhHansFoundationBackTranslationByQuestionId } from "@/content/locales/zh-Hans/foundation-back-translations"
import { zhHansFoundationDraftByQuestionId } from "@/content/locales/zh-Hans/foundation-copy"
import type {
  FoundationItemAnalysis,
  FoundationItemIntentRow,
} from "@/content/locales/zh-Hans/foundation-types"
import { getFoundationQuestions } from "@/lib/quiz-schema"

export const zhHansFoundationItemAnalysis = [
  ...zhHansFoundationStandardItemAnalysis,
  ...zhHansFoundationV21ItemAnalysis,
  ...zhHansFoundationAnalystItemAnalysisA,
  ...zhHansFoundationAnalystItemAnalysisB,
] as const satisfies readonly FoundationItemAnalysis[]

const analysisByQuestionId = new Map<string, FoundationItemAnalysis>(
  zhHansFoundationItemAnalysis.map((record) => [record.questionId, record] as const),
)

/**
 * Complete item-intent sheet in canonical Standard-then-Analyst order.
 * `englishSource` is the live canonical question object, so the sheet cannot
 * silently preserve an obsolete English prompt or a duplicate scoring table.
 */
export const zhHansFoundationItemIntentSheet = getFoundationQuestions("analyst").map(
  (englishSource): FoundationItemIntentRow => {
    const drafts = zhHansFoundationDraftByQuestionId.get(englishSource.id)
    const backTranslation = zhHansFoundationBackTranslationByQuestionId.get(englishSource.id)
    const analysis = analysisByQuestionId.get(englishSource.id)

    if (!drafts || !backTranslation || !analysis) {
      throw new Error(`Incomplete zh-Hans Foundation editorial record: ${englishSource.id}`)
    }

    return {
      ...analysis,
      ...drafts,
      ...backTranslation,
      englishSource,
    }
  },
)
