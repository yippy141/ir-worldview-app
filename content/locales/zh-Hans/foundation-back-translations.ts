import { zhHansFoundationAnalystBackTranslationsA } from "@/content/locales/zh-Hans/foundation-back-translations-analyst-a"
import { zhHansFoundationAnalystBackTranslationsB } from "@/content/locales/zh-Hans/foundation-back-translations-analyst-b"
import { zhHansFoundationStandardBackTranslations } from "@/content/locales/zh-Hans/foundation-back-translations-standard"
import type { FoundationBackTranslationRecord } from "@/content/locales/zh-Hans/foundation-types"

export const zhHansFoundationBackTranslations = [
  ...zhHansFoundationStandardBackTranslations,
  ...zhHansFoundationAnalystBackTranslationsA,
  ...zhHansFoundationAnalystBackTranslationsB,
] as const satisfies readonly FoundationBackTranslationRecord[]

export const zhHansFoundationBackTranslationByQuestionId = new Map<
  string,
  FoundationBackTranslationRecord
>(
  zhHansFoundationBackTranslations.map((record) => [record.questionId, record] as const),
)
