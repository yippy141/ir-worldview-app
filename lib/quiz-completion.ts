import { getFoundationQuestionsForSet, getFoundationResultQuestions } from "@/lib/quiz-schema"
import type { QuizSession } from "@/lib/types"

/** The review's existing completeness rule includes the carried-forward core. */
export function hasCompleteFoundationAnswers(
  session: Pick<QuizSession, "questionSet" | "targetedFamilyPair" | "answers">,
): boolean {
  return getFoundationQuestionsForSet(session.questionSet, session.targetedFamilyPair).length > 0
    && getFoundationResultQuestions(session.questionSet, session.targetedFamilyPair).every(
      question => session.answers[question.id] !== undefined,
    )
}
