import test from "node:test"
import assert from "node:assert/strict"
import {
  clearModuleDraft,
  createModuleDraft,
  getModuleDraftKey,
  loadModuleDraft,
  loadSelectedModuleMode,
  normalizeModuleDraft,
  saveModuleDraft,
  type ModuleDraftContext,
} from "@/lib/modules/drafts"
import { getModuleDefinition, getModuleQuestions, moduleAllowsSecondChoice } from "@/lib/modules/framework"
import { getCurrentModuleVersion } from "@/lib/modules/versions"

const now = Date.UTC(2026, 7, 24)
const moduleDefinition = getModuleDefinition("security")
if (!moduleDefinition) throw new Error("security module is required for draft tests")
const version = getCurrentModuleVersion("security")

function context(mode: "standard" | "analyst" = "standard"): ModuleDraftContext {
  return {
    slug: "security",
    locale: "en",
    mode,
    bankVersion: version.bankVersion,
    scoringVersion: version.scoringVersion,
    questions: getModuleQuestions(moduleDefinition!, mode),
    allowsSecondChoice: (question) => mode === "analyst" && moduleAllowsSecondChoice(question),
  }
}

function memoryStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  }
}

test("module drafts fail closed on malformed or mismatched tuples", () => {
  const draft = createModuleDraft(context(), "seed", now)
  assert.equal(normalizeModuleDraft({ nope: true }, context(), now), null)
  assert.equal(
    normalizeModuleDraft({ ...draft, bankVersion: draft.bankVersion + 1 }, context(), now),
    null,
  )
  assert.equal(
    normalizeModuleDraft({ ...draft, updatedAt: now - 181 * 24 * 60 * 60 * 1000 }, context(), now),
    null,
  )
})

test("normalization filters unknown questions, invalid options, and unsupported second choices", () => {
  const standard = context("standard")
  const first = standard.questions[0]
  const second = standard.questions[1]
  const draft = createModuleDraft(standard, "seed", now)
  const normalized = normalizeModuleDraft({
    ...draft,
    answers: {
      [first.id]: {
        primary: first.options[0].id,
        secondary: first.options[1].id,
      },
      [second.id]: { primary: "not-an-option" },
      removed_question: { primary: "anything" },
    },
    currentQuestionId: "removed_question",
  }, standard, now)

  assert.ok(normalized)
  assert.deepEqual(normalized.answers, {
    [first.id]: { primary: first.options[0].id },
  })
  assert.equal(normalized.currentQuestionId, second.id)
})

test("review stage requires a complete draft", () => {
  const standard = context()
  const draft = createModuleDraft(standard, "seed", now)
  const incomplete = normalizeModuleDraft({ ...draft, stage: "review" }, standard, now)
  assert.equal(incomplete?.stage, "questions")

  const answers = Object.fromEntries(
    standard.questions.map((question) => [
      question.id,
      { primary: question.options[0].id },
    ]),
  )
  const complete = normalizeModuleDraft({ ...draft, stage: "review", answers }, standard, now)
  assert.equal(complete?.stage, "review")
  assert.equal(complete?.currentQuestionId, null)
})

test("standard and Advanced drafts persist independently and clearing is mode-scoped", () => {
  const storage = memoryStorage()
  const standard = context("standard")
  const analyst = context("analyst")
  const standardDraft = createModuleDraft(standard, "standard-seed", now)
  const analystDraft = createModuleDraft(analyst, "analyst-seed", now)

  assert.equal(saveModuleDraft(storage, standardDraft), true)
  assert.equal(saveModuleDraft(storage, analystDraft), true)
  assert.equal(loadSelectedModuleMode(storage, "security", "en"), "analyst")
  assert.equal(loadModuleDraft(storage, standard, now)?.orderSeed, "standard-seed")
  assert.equal(loadModuleDraft(storage, analyst, now)?.orderSeed, "analyst-seed")

  assert.equal(clearModuleDraft(storage, analyst), true)
  assert.equal(loadModuleDraft(storage, analyst, now), null)
  assert.equal(loadModuleDraft(storage, standard, now)?.orderSeed, "standard-seed")
  assert.notEqual(getModuleDraftKey(standard), getModuleDraftKey(analyst))
})
