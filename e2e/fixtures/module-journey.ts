import { encodeModulePayload } from "@/lib/modules/framework"
import { createModuleDraft, createEmptyModuleDraftStore, getModuleDraftKey, getModuleModeKey } from "@/lib/modules/drafts"
import { getCurrentModuleVersion } from "@/lib/modules/versions"
import type { ModuleAnswers, ModuleSlug } from "@/lib/modules/types"
import type { QuizMode } from "@/lib/types"

/** Synthetic choices only. Shared by journey checks and before/after captures. */
export function moduleJourneyFixture(slug: ModuleSlug, mode: QuizMode) {
  const version = getCurrentModuleVersion(slug)
  const questions = version.runtime.getModuleQuestions(version.definition, mode)
  const answers: ModuleAnswers = Object.fromEntries(questions.map((question, index) => [
    question.id, { primary: question.options[index % question.options.length].id },
  ]))
  const context = { slug, mode, locale: "en", ...version, questions, allowsSecondChoice: () => mode === "analyst" }
  const draft = createModuleDraft(context, "module-journey-synthetic")
  draft.answers = answers
  draft.currentQuestionId = questions[1].id
  const store = createEmptyModuleDraftStore()
  store.selectedMode[getModuleModeKey(slug, "en")] = mode
  store.drafts[getModuleDraftKey(context)] = draft
  const payload = encodeModulePayload({ v: 3, bv: version.bankVersion, sv: version.scoringVersion, slug, mode, answers })
  return { version, questions, answers, context, draft, store, payload, resultPath: `/modules/${slug}/results/${payload}` }
}
