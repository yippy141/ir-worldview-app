import { zhHansFoundationAnalystDraftsA } from "@/content/locales/zh-Hans/foundation-copy-analyst-a"
import { zhHansFoundationAnalystDraftsB } from "@/content/locales/zh-Hans/foundation-copy-analyst-b"
import { zhHansFoundationAnalystDraftsC } from "@/content/locales/zh-Hans/foundation-copy-analyst-c"
import { zhHansFoundationStandardDraftsA } from "@/content/locales/zh-Hans/foundation-copy-standard-a"
import { zhHansFoundationStandardDraftsB } from "@/content/locales/zh-Hans/foundation-copy-standard-b"
import { zhHansFoundationV21Drafts } from "@/content/locales/zh-Hans/foundation-v21-additions"
import type { ZhHansFoundationDraftRecord } from "@/content/locales/zh-Hans/foundation-types"
import { getFoundationQuestions } from "@/lib/quiz-schema"

const unorderedDrafts: readonly ZhHansFoundationDraftRecord[] = [
  ...zhHansFoundationStandardDraftsA,
  ...zhHansFoundationStandardDraftsB,
  ...zhHansFoundationV21Drafts,
  ...zhHansFoundationAnalystDraftsA,
  ...zhHansFoundationAnalystDraftsB,
  ...zhHansFoundationAnalystDraftsC,
]

const unorderedDraftsByQuestionId = new Map(
  unorderedDrafts.map((record) => [record.questionId, record] as const),
)

export const zhHansFoundationDrafts = getFoundationQuestions("analyst").map(
  (question) => {
    const record = unorderedDraftsByQuestionId.get(question.id)
    if (!record) {
      throw new Error(`Missing zh-Hans Foundation draft: ${question.id}`)
    }
    return record
  },
)

export const zhHansFoundationDraftByQuestionId = new Map<string, ZhHansFoundationDraftRecord>(
  zhHansFoundationDrafts.map((record) => [record.questionId, record] as const),
)
