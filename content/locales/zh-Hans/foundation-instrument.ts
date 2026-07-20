import { zhHansFoundationDraftByQuestionId } from "@/content/locales/zh-Hans/foundation-copy"
import {
  toMutableClarification,
  type ZhHansFoundationInstrumentManifest,
  type ZhHansFoundationQuestionCopy,
} from "@/content/locales/zh-Hans/foundation-types"
import {
  FOUNDATION_STRUCTURAL_VERSION,
  SCHEMA_VERSION,
  foundationStandardSections,
  getFoundationQuestions,
} from "@/lib/quiz-schema"
import { FOUNDATION_SCORING_VERSION } from "@/lib/scoring"
import { INSTRUMENT_COPY_VERSIONS } from "@/lib/locale-provenance"
import type { ChoiceQuestion, Question, QuizMode } from "@/lib/types"

export const zhHansFoundationInstrumentManifest = {
  locale: "zh-Hans",
  status: "adapted-beta",
  validationClaim: "not-validated-or-equivalent",
  canonicalSchemaVersion: SCHEMA_VERSION,
  scoringVersion: FOUNDATION_SCORING_VERSION,
  localeCopyVersion: INSTRUMENT_COPY_VERSIONS.foundation["zh-Hans"],
  sourceLocale: "en",
  modes: ["standard", "analyst"],
  preserves: [
    "question IDs",
    "answer-option IDs",
    "question kinds",
    "scoring weights",
    "section order",
    "review behavior",
  ],
  runtimeEnabled: true,
} as const satisfies ZhHansFoundationInstrumentManifest

if (zhHansFoundationInstrumentManifest.canonicalSchemaVersion !== FOUNDATION_STRUCTURAL_VERSION) {
  throw new Error("Foundation structural version is out of sync with the canonical schema")
}

const zhHansSectionTitles = [
  "国际关系判断基线",
  "同盟与相互依存",
  "国内政治与身份",
  "战略与价值取舍",
  "应用情境",
] as const

export const zhHansFoundationStandardSections = foundationStandardSections.map(
  (section, index) => ({
    ...section,
    title: zhHansSectionTitles[index],
    questionIds: [...section.questionIds],
  }),
)

export function getZhHansFoundationQuestions(mode: QuizMode): Question[] {
  return getFoundationQuestions(mode).map((question) => {
    const record = zhHansFoundationDraftByQuestionId.get(question.id)
    if (!record) {
      throw new Error(`Missing zh-Hans Foundation copy: ${question.id}`)
    }

    return localizeQuestion(question, record.reconciledChinese)
  })
}

function localizeQuestion(
  question: Question,
  copy: ZhHansFoundationQuestionCopy,
): Question {
  const displayFields = {
    prompt: copy.prompt,
    ...(copy.helpText ? { helpText: copy.helpText } : {}),
    ...(copy.clarification
      ? { clarification: toMutableClarification(copy.clarification) }
      : {}),
  }

  if (question.kind === "likert") {
    return {
      ...question,
      ...displayFields,
    }
  }

  const copyOptions = new Map(
    (copy.options ?? []).map((option) => [option.id, option] as const),
  )

  return {
    ...question,
    ...displayFields,
    options: question.options.map((option) => {
      const optionCopy = copyOptions.get(option.id)
      if (!optionCopy) {
        throw new Error(`Missing zh-Hans Foundation option copy: ${question.id}.${option.id}`)
      }

      return {
        ...option,
        title: optionCopy.title,
        label: optionCopy.label,
      }
    }),
  } satisfies ChoiceQuestion
}
