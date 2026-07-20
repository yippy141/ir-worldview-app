import { zhHansFoundationAnalystDraftsA } from "@/content/locales/zh-Hans/foundation-copy-analyst-a"
import { zhHansFoundationAnalystDraftsB } from "@/content/locales/zh-Hans/foundation-copy-analyst-b"
import { zhHansFoundationAnalystDraftsC } from "@/content/locales/zh-Hans/foundation-copy-analyst-c"
import { zhHansFoundationStandardDraftsA } from "@/content/locales/zh-Hans/foundation-copy-standard-a"
import { zhHansFoundationStandardDraftsB } from "@/content/locales/zh-Hans/foundation-copy-standard-b"
import type { ZhHansFoundationDraftRecord } from "@/content/locales/zh-Hans/foundation-types"

export const zhHansFoundationDrafts = [
  ...zhHansFoundationStandardDraftsA,
  ...zhHansFoundationStandardDraftsB,
  ...zhHansFoundationAnalystDraftsA,
  ...zhHansFoundationAnalystDraftsB,
  ...zhHansFoundationAnalystDraftsC,
] as const satisfies readonly ZhHansFoundationDraftRecord[]

export const zhHansFoundationDraftByQuestionId = new Map<string, ZhHansFoundationDraftRecord>(
  zhHansFoundationDrafts.map((record) => [record.questionId, record] as const),
)
