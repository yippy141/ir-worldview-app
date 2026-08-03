import { zhHansFoundationAnalystBackTranslationsA } from "@/content/locales/zh-Hans/foundation-back-translations-analyst-a"
import { zhHansFoundationAnalystBackTranslationsB } from "@/content/locales/zh-Hans/foundation-back-translations-analyst-b"
import { zhHansFoundationStandardBackTranslations } from "@/content/locales/zh-Hans/foundation-back-translations-standard"
import { zhHansFoundationV21BackTranslations } from "@/content/locales/zh-Hans/foundation-v21-additions"
import type { FoundationBackTranslationRecord } from "@/content/locales/zh-Hans/foundation-types"
import { getFoundationQuestions } from "@/lib/quiz-schema"

const unorderedBackTranslations: readonly FoundationBackTranslationRecord[] = [
  ...zhHansFoundationStandardBackTranslations,
  ...zhHansFoundationV21BackTranslations,
  ...zhHansFoundationAnalystBackTranslationsA,
  ...zhHansFoundationAnalystBackTranslationsB,
]

const unorderedBackTranslationsByQuestionId = new Map(
  unorderedBackTranslations.map((record) => [record.questionId, record] as const),
)

export const zhHansFoundationBackTranslations =
  getFoundationQuestions("analyst").map((question) => {
    const record = unorderedBackTranslationsByQuestionId.get(question.id)
    if (!record) {
      throw new Error(`Missing zh-Hans Foundation back translation: ${question.id}`)
    }
    return record
  })

export const zhHansFoundationBackTranslationByQuestionId = new Map<
  string,
  FoundationBackTranslationRecord
>(
  zhHansFoundationBackTranslations.map((record) => [record.questionId, record] as const),
)
