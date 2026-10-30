import { expect, test } from "@playwright/test"
import fixture from "../tests/fixtures/profile-store-v5.json"
import { PROFILE_STORAGE_KEY, PROFILE_SAVE_INTENT_KEY, RESULT_HISTORY_STORAGE_KEY, AI_GOVERNANCE_STORAGE_KEY } from "../lib/storage-keys"
import { getAiCoreQuestions, getScenarioOptions } from "../lib/ai-governance-schema"
import { getAiScenarioSequence } from "../lib/ai-governance-scoring"
import { AI_GOVERNANCE_V22_TUPLE } from "../lib/ai-governance-versions"
import { buildFoundationSharePayload, encodePayload } from "../lib/share"
import { buildCanonicalFoundationResult } from "../lib/scoring"
import type { AiAnswers } from "../lib/ai-governance-types"
import { openSyntheticReview } from "./fixtures/product-completion"
import { foundationCoreQuestions } from "../lib/quiz-schema"

const payload = fixture.foundation.payload
const resultPath = `/results/${payload}`

test("shared Foundation is read-only in a fresh browser", async ({ page }) => {
  await page.goto(resultPath)
  await expect(page.locator("h1")).toBeVisible()
  await page.waitForLoadState("networkidle")
  expect(await page.evaluate((key) => localStorage.getItem(key), RESULT_HISTORY_STORAGE_KEY)).toBeNull()
  expect(await page.evaluate((key) => localStorage.getItem(key), PROFILE_STORAGE_KEY)).toBeNull()
  await expect(page.getByText("Saved to this device", { exact: true })).toHaveCount(0)
  await expect(page.locator("[data-foundation-save-status]")).toHaveCount(0)
})

test("completion intent saves once and reload stays read-only", async ({ page }) => {
  await page.goto("/")
  await page.evaluate(({ key, payload }) => sessionStorage.setItem(key, JSON.stringify({ foundation: { identity: payload, mode: "standard" } })), { key: PROFILE_SAVE_INTENT_KEY, payload })
  await page.goto(resultPath)
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), PROFILE_STORAGE_KEY)).not.toBeNull()
  const saved = await page.evaluate((key) => localStorage.getItem(key), PROFILE_STORAGE_KEY)
  expect(JSON.parse(saved!).foundationHistory).toHaveLength(1)
  await expect(page.locator("[data-foundation-save-status]")).toHaveAttribute("data-foundation-save-status", "saved")
  await page.reload()
  await page.waitForLoadState("networkidle")
  expect(await page.evaluate((key) => localStorage.getItem(key), PROFILE_STORAGE_KEY)).toBe(saved)
  await expect(page.locator("[data-foundation-save-status]")).toHaveCount(0)
})

test("throwing storage never reports a saved Foundation", async ({ page }) => {
  await page.goto("/")
  await page.evaluate(({ key, payload }) => sessionStorage.setItem(key, JSON.stringify({ foundation: { identity: payload } })), { key: PROFILE_SAVE_INTENT_KEY, payload })
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException("Full", "QuotaExceededError") }
  })
  await page.goto(resultPath)
  await page.waitForLoadState("networkidle")
  await expect(page.locator("h1")).toBeVisible()
  await expect(page.getByText("Saved to this device", { exact: true })).toHaveCount(0)
  await expect(page.locator("[data-foundation-save-status]")).toContainText("could not be saved")
  expect(await page.evaluate((key) => localStorage.getItem(key), PROFILE_STORAGE_KEY)).toBeNull()
})

test("legacy history with unknown form and scoring provenance is preserved without change claims", async ({ page }) => {
  const history = JSON.stringify([{ ...fixture.foundation, neighborKey: "realist", familyKey: "realist", schemaVersion: 1, locale: "en", localeCopyVersion: 0 }])
  await page.addInitScript(({ key, history }) => localStorage.setItem(key, history), { key: RESULT_HISTORY_STORAGE_KEY, history })
  await page.goto(resultPath)
  await page.waitForLoadState("networkidle")
  await expect(page.getByText("Compared with your last saved result")).toHaveCount(0)
  expect(await page.evaluate((key) => localStorage.getItem(key), RESULT_HISTORY_STORAGE_KEY)).toBe(history)
})

test("AI encoding failure preserves answers and allows retry", async ({ page }) => {
  const answers: AiAnswers = {}
  for (const question of getAiCoreQuestions("standard")) answers[question.id] = 4
  for (let i = 0; i < 10; i++) {
    for (const question of getAiScenarioSequence(answers, "standard")) {
      answers[question.id] ??= getScenarioOptions(question, "standard")[0].id
    }
  }
  const draft = JSON.stringify({ v: 2, bv: AI_GOVERNANCE_V22_TUPLE.bankVersion, sv: AI_GOVERNANCE_V22_TUPLE.scoringVersion, started: true, mode: "standard", answers })
  await page.goto("/")
  await page.evaluate(({ key, draft }) => localStorage.setItem(key, draft), { key: AI_GOVERNANCE_STORAGE_KEY, draft })
  await page.goto("/ai/review")
  const generate = page.getByRole("button", { name: "Generate my profile →" })
  await expect(generate).toBeEnabled()
  await page.evaluate(() => {
    const original = window.btoa
    window.btoa = () => { window.btoa = original; throw new Error("Injected encoding failure") }
  })
  await generate.click()
  await expect(page.getByRole("alert").filter({ hasText: "Your answers are still here" })).toContainText("Your answers are still here")
  expect(await page.evaluate((key) => localStorage.getItem(key), AI_GOVERNANCE_STORAGE_KEY)).toBe(draft)
  await expect(generate).toBeEnabled()
  await generate.click()
  await expect(page).toHaveURL(/\/ai\/results\//)
})

test("genuine Foundation completion saves exactly once", async ({ page }) => {
  await page.goto("/quiz")
  await expect(page.locator(".entrance-count")).toHaveText(`Standard · ${foundationCoreQuestions.length} questions`)
  await page.getByRole("button", { name: "Start Foundation", exact: true }).click()
  await expect(page.getByRole("heading", { name: "Foundation", exact: true })).toBeVisible()
  for (let step = 0; step < 60; step++) {
    const midpoint = page.getByRole("button", { name: "Continue", exact: true })
    if (await midpoint.isVisible()) { await midpoint.click(); continue }
    const choices = page.locator("button.option-card")
    if (await choices.count()) await choices.first().click()
    else await page.locator("button.answer-button").nth(3).click()
    const review = page.getByRole("button", { name: "Review your answers →" })
    if (await review.isVisible()) { await review.click(); break }
    await page.getByRole("button", { name: "Next", exact: true }).click()
  }
  await expect(page).toHaveURL(/\/quiz\/review$/)
  await page.getByRole("button", { name: "Generate my result →" }).click()
  await expect(page).toHaveURL(/\/results\//)
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), PROFILE_STORAGE_KEY)).not.toBeNull()
  const saved = await page.evaluate((key) => localStorage.getItem(key), PROFILE_STORAGE_KEY)
  expect(JSON.parse(saved!).foundationHistory).toHaveLength(1)
  await page.reload()
  await page.waitForLoadState("networkidle")
  expect(await page.evaluate((key) => localStorage.getItem(key), PROFILE_STORAGE_KEY)).toBe(saved)
  expect(await page.evaluate((key) => localStorage.getItem(key), RESULT_HISTORY_STORAGE_KEY)).toBeNull()
})

test("unremovable completion intent cannot replay after reload", async ({ page }) => {
  await page.goto("/")
  await page.evaluate(({ key, payload }) => sessionStorage.setItem(key, JSON.stringify({ foundation: { identity: payload } })), { key: PROFILE_SAVE_INTENT_KEY, payload })
  await page.addInitScript(() => {
    Storage.prototype.removeItem = () => { throw new DOMException("Blocked", "SecurityError") }
  })
  await page.goto(resultPath)
  await expect(page.locator("[data-foundation-save-status]")).toHaveAttribute("data-foundation-save-status", "saved")
  const saved = await page.evaluate((key) => localStorage.getItem(key), PROFILE_STORAGE_KEY)
  await page.reload()
  await page.waitForLoadState("networkidle")
  expect(await page.evaluate((key) => localStorage.getItem(key), PROFILE_STORAGE_KEY)).toBe(saved)
  await expect(page.locator("[data-foundation-save-status]")).toHaveCount(0)
})

test("real completion survives unavailable session storage and failed Profile writes", async ({ page }) => {
  const generate = await openSyntheticReview(page, "foundation")
  await expect(generate).toBeEnabled()
  await page.evaluate(() => {
    Object.defineProperty(window, "sessionStorage", { get() { throw new DOMException("Blocked", "SecurityError") } })
    Storage.prototype.setItem = () => { throw new DOMException("Full", "QuotaExceededError") }
  })
  await generate.click()
  await expect(page).toHaveURL(/\/results\//)
  await expect(page.locator("h1")).toBeVisible()
  await expect(page.locator("[data-foundation-save-status]")).toContainText("could not be saved")
  expect(await page.evaluate((key) => localStorage.getItem(key), PROFILE_STORAGE_KEY)).toBeNull()
})

for (const locale of ["en", "zh"] as const) {
  test(`${locale}: share text is neutral and failed URL copies never report success`, async ({ page }) => {
    await page.addInitScript(() => {
      const calls: ShareData[] = []
      Object.assign(window, { shareCalls: calls })
      Object.defineProperty(navigator, "share", { configurable: true, value: async (data: ShareData) => { calls.push(data) } })
      // Labels would copy successfully: the old fallback falsely reported a link.
      document.execCommand = () => !(document.activeElement as HTMLTextAreaElement)?.value?.startsWith("http")
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text: string) => {
        if (text.startsWith("http")) throw new DOMException("Blocked", "NotAllowedError")
      } } })
    })
    await page.goto(`${locale === "zh" ? "/zh" : ""}${resultPath}`)
    const share = page.getByRole("button", { name: locale === "zh" ? "分享结果" : "Share result", exact: true })
    await expect(share.first()).toBeVisible()
    for (const button of await share.all()) await button.click()
    const calls = await page.evaluate(() => (window as unknown as { shareCalls: ShareData[] }).shareCalls)
    expect(calls).toHaveLength(locale === "zh" ? 1 : 2)
    for (const call of calls) {
      expect(call.text).not.toMatch(/My IR|我的/)
      expect(call.url).toBe(page.url())
    }
    await page.getByRole("button", { name: locale === "zh" ? "复制链接" : "Copy link", exact: true }).click()
    await expect(page.getByRole("button", { name: locale === "zh" ? "无法自动复制" : "Copy unavailable", exact: true })).toHaveCount(2)
    if (locale === "en") {
      await page.evaluate(() => { Object.defineProperty(navigator, "share", { value: async () => { throw new Error("Share failed") } }) })
      await page.locator(".result-card-hero__share").click()
      await expect(page.locator(".result-card-hero__share")).toHaveText("Copy unavailable")
    }
    for (const input of await page.locator(".share-copy-fallback input").all()) await expect(input).toHaveValue(page.url())
    await page.evaluate(() => { document.execCommand = () => true })
    await page.getByRole("button", { name: locale === "zh" ? "无法自动复制" : "Copy unavailable", exact: true }).nth(1).click()
    await expect(page.getByRole("button", { name: locale === "zh" ? "链接已复制" : "Link copied!", exact: true })).toHaveCount(2)
  })
}

test("Chinese Foundation count follows the administered set without a time promise", async ({ page }) => {
  await page.goto("/zh/quiz")
  await expect(page.locator(".quiz-header")).toContainText(`${foundationCoreQuestions.length} 道核心题`)
  await expect(page.locator(".quiz-header")).not.toContainText("分钟")
})

const foundationResult = buildCanonicalFoundationResult(fixture.foundation.dimensionScores)
const corePayload = buildFoundationSharePayload(foundationResult, "en", "core")
const provenanceCases = [
  ["core form", encodePayload(corePayload)],
  ["extended form", encodePayload(buildFoundationSharePayload(foundationResult, "en", "fullExtended"))],
  ["older scoring version", encodePayload({ v: 3, ds: corePayload.ds, fk: corePayload.fk, nk: corePayload.nk, sm: corePayload.sm, nm: corePayload.nm, iv: 3, sv: 1, cl: "en", cv: 1 })],
  ["different wording version", encodePayload({ ...corePayload, cv: 2 })],
] as const

for (const [label, encoded] of provenanceCases) {
  test(`${label} never turns legacy history into personal change`, async ({ page }) => {
    const history = JSON.stringify([{ ...fixture.foundation, familyKey: "realist", neighborKey: "institutionalist", schemaVersion: 4, locale: "en", localeCopyVersion: 1 }])
    await page.addInitScript(({ key, history }) => localStorage.setItem(key, history), { key: RESULT_HISTORY_STORAGE_KEY, history })
    await page.goto(`/results/${encoded}`)
    await page.waitForLoadState("networkidle")
    await expect(page.getByText("This link could not be decoded.")).toHaveCount(0)
    await expect(page.getByText("Compared with your last saved result")).toHaveCount(0)
    await expect(page.getByText("Saved to this device", { exact: true })).toHaveCount(0)
    expect(await page.evaluate((key) => localStorage.getItem(key), RESULT_HISTORY_STORAGE_KEY)).toBe(history)
    expect(await page.evaluate((key) => localStorage.getItem(key), PROFILE_STORAGE_KEY)).toBeNull()
  })
}
