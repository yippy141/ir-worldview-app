import { parseProfileStore } from "@/lib/profile-store"
import { resolveFoundationArchetypeFromSnapshot } from "@/lib/profile-foundation-identity"
import { parseQuizSession } from "@/lib/quiz-session"
import { getFoundationQuestionsForSet } from "@/lib/quiz-schema"
import { parseCurrentCaseResponseStore } from "@/lib/current-cases/response-store"
import { loadModuleDraft } from "@/lib/modules/drafts"
import { modules, getModuleQuestions, moduleAllowsSecondChoice } from "@/lib/modules/framework"
import { getCurrentModuleVersion } from "@/lib/modules/versions"
import { hasPerspectiveBankCapability } from "@/lib/modules/perspective-bank"
import { PROFILE_STORAGE_KEY, QUIZ_STORAGE_KEY, CURRENT_CASE_RESPONSE_STORAGE_KEY } from "@/lib/storage-keys"

export type LocalRecord = {
  foundationName: string | null
  savedAreas: string[]
  caseJudgments: number
  caseDrafts: number
  historyCount: number
  continuation: { label: string; href: string } | null
  unfinishedAreas: { label: string; href: string }[]
  hasSavedWork: boolean
  unavailable: boolean
}

export function emptyLocalRecord(): LocalRecord {
  return {
    foundationName: null, savedAreas: [], caseJudgments: 0, caseDrafts: 0,
    historyCount: 0, continuation: null, unfinishedAreas: [], hasSavedWork: false, unavailable: false,
  }
}

/** Read-only projection through existing parsers. Never repairs or writes storage. */
export function readLocalRecord(storage: Pick<Storage, "getItem">): LocalRecord {
  try {
    const profile = parseProfileStore(storage.getItem(PROFILE_STORAGE_KEY))
    const session = parseQuizSession(storage.getItem(QUIZ_STORAGE_KEY))
    const cases = parseCurrentCaseResponseStore(storage.getItem(CURRENT_CASE_RESPONSE_STORAGE_KEY))
    const foundationName = profile.foundation
      ? resolveFoundationArchetypeFromSnapshot(profile.foundation)?.name ?? null
      : null
    const questions = session
      ? getFoundationQuestionsForSet(session.questionSet, session.targetedFamilyPair)
      : []
    const answered = questions.filter((question) => {
      const answer = session?.answers[question.id]
      return question.kind === "likert"
        ? typeof answer === "number" && Number.isInteger(answer) && answer >= 1 && answer <= 7
        : answer !== undefined
    })
    const unfinished = answered.length > 0
    const readyForReview = unfinished && answered.length === questions.length
    const validIds = new Set(answered.map((question) => question.id))
    const nextIndex = questions.findIndex((question) => !validIds.has(question.id))
    const savedAreas = [
      profile.modules.security ? "Security" : null,
      profile.modules.technology ? "Technology" : null,
      profile.aiGovernance ? "AI Governance" : null,
    ].filter((label): label is string => label !== null)
    const caseJudgments = Object.values(cases.responses).reduce((count, records) => count + records.length, 0)
    const historyCount = profile.foundationHistory.length + profile.moduleHistory.length + profile.aiHistory.length + profile.perspectiveRuns.length
    const unfinishedAreas = modules.flatMap((definition) => {
      const version = getCurrentModuleVersion(definition.slug)
      return (["standard", "analyst"] as const).flatMap((mode) => {
        const draft = loadModuleDraft(storage, {
          slug: definition.slug, locale: "en", mode,
          bankVersion: version.bankVersion, scoringVersion: version.scoringVersion,
          questions: getModuleQuestions(definition, mode),
          allowsSecondChoice: (question) =>
            (!hasPerspectiveBankCapability({ slug: definition.slug, bankVersion: version.bankVersion }) || mode === "analyst") && moduleAllowsSecondChoice(question),
        })
        return draft && Object.keys(draft.answers).length ? [{
          label: `Continue ${definition.shortTitle}${mode === "analyst" ? " advanced" : ""}`,
          href: `/modules/${definition.slug}?mode=${mode}`,
        }] : []
      })
    })

    return {
      foundationName,
      savedAreas,
      caseJudgments,
      caseDrafts: Object.keys(cases.drafts).length,
      historyCount,
      unfinishedAreas,
      hasSavedWork: Boolean(profile.foundation || savedAreas.length || caseJudgments || historyCount),
      continuation: unfinished ? {
        label: `${readyForReview ? "Review" : "Continue"} First Principles${session?.questionSet === "core" ? "" : " extended"} · ${answered.length} of ${questions.length}`,
        href: readyForReview ? "/quiz/review" : `/quiz?q=${Math.max(0, nextIndex)}`,
      } : null,
      unavailable: false,
    }
  } catch {
    return { ...emptyLocalRecord(), unavailable: true }
  }
}
