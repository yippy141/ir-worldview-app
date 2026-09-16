/** Synthetic answers and real review submission. Never used by the public runtime. */
import type { Page } from "@playwright/test"
import { syntheticAnswers } from "@/tests/decision-exercises/fixtures"
import { moduleJourneyFixture } from "@/e2e/fixtures/module-journey"
import { getCurrentAiGovernanceVersion } from "@/lib/ai-governance-versions"
import { QUIZ_STORAGE_KEY, AI_GOVERNANCE_STORAGE_KEY, MODULE_DRAFT_STORAGE_KEY } from "@/lib/storage-keys"
import type { AiAnswers } from "@/lib/ai-governance-types"
export type CompletionDomain = "foundation" | "ai" | "security" | "technology"
export async function openSyntheticReview(page: Page, domain: CompletionDomain, clearStorage = true) {
  await page.goto("/privacy")
  if (clearStorage) await page.evaluate(() => { localStorage.clear(); sessionStorage.clear() })
  if (domain === "foundation") {
    await page.evaluate(({ key, answers }) => localStorage.setItem(key, JSON.stringify({ v: 7, activeMode: "analyst", questionSet: "core", orderSeed: "product-wide-synthetic", answers, contextAssist: false, itemLatencyBuckets: {}, foundationCopy: { status: "single-copy", locale: "en", version: 2 } })), { key: QUIZ_STORAGE_KEY, answers: syntheticAnswers(17, "core") })
    await page.goto("/quiz/review")
    return page.getByRole("button", { name: "Generate my result →", exact: true })
  }
  if (domain === "ai") {
    const ai = getCurrentAiGovernanceVersion()
    const answers: AiAnswers = Object.fromEntries(ai.schema.getAiCoreQuestions("standard").map((q, i) => [q.id, 1 + (i * 3) % 7]))
    ai.scoring.getAiScenarioSequence(answers, "standard").forEach((q, i) => { const options = ai.schema.getScenarioOptions(q, "standard"); answers[q.id] = options[i % options.length].id })
    await page.evaluate(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), { key: AI_GOVERNANCE_STORAGE_KEY, state: { v: 2, bv: ai.bankVersion, sv: ai.scoringVersion, started: true, mode: "standard", answers, orderSeed: "product-wide-synthetic" } })
    await page.goto("/ai/review")
    return page.getByRole("button", { name: "Generate my profile →", exact: true })
  }
  const fixture = moduleJourneyFixture(domain, "standard")
  fixture.draft.stage = "review"; fixture.draft.currentQuestionId = null
  await page.evaluate(({ key, store }) => localStorage.setItem(key, JSON.stringify(store)), { key: MODULE_DRAFT_STORAGE_KEY, store: fixture.store })
  await page.goto(`/modules/${domain}`)
  return page.getByRole("button", { name: /^See .* result/ })
}
