import { englishFoundationCopyV2 } from "@/content/locales/en/foundation-copy-v2"
import { CURRENT_FOUNDATION_COPY_VERSIONS, isSupportedFoundationCopyVersion } from "@/lib/foundation-copy-versions"
import { getFoundationQuestions, getFoundationQuestionsForSet } from "@/lib/quiz-schema"
import type { FamilyKey, FoundationQuestionSet, Question, QuizMode } from "@/lib/types"

/** Display accessor. The issued quiz-schema accessors remain historical bank copy 1. */
export function getEnglishFoundationQuestions(mode: QuizMode, copyVersion: number = CURRENT_FOUNDATION_COPY_VERSIONS.en): Question[] {
  return applyCopy(getFoundationQuestions(mode), copyVersion)
}
export function getEnglishFoundationQuestionsForSet(
  questionSet: FoundationQuestionSet,
  targetedFamilyPair?: readonly [FamilyKey, FamilyKey],
  copyVersion: number = CURRENT_FOUNDATION_COPY_VERSIONS.en,
): Question[] {
  return applyCopy(getFoundationQuestionsForSet(questionSet, targetedFamilyPair), copyVersion)
}
function applyCopy(questions: Question[], copyVersion: number): Question[] {
  if (!isSupportedFoundationCopyVersion("en", copyVersion)) throw new Error("Unsupported English Foundation copy revision")
  return questions.map(question => copyVersion === 2 && question.id === "df1"
    ? { ...question, clarification: { ...question.clarification, ...englishFoundationCopyV2.df1.clarification } }
    : question)
}
