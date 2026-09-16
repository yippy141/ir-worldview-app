import { test, expect } from "@playwright/test"
import { openSyntheticReview } from "./fixtures/product-completion"

test.beforeEach(async ({ page }) => {
  await page.route("**/*", route => ["GET", "HEAD", "OPTIONS"].includes(route.request().method()) ? route.continue() : route.fulfill({ status: 204, body: "" }))
})

test("questionnaire entrances keep their actions and visible scope without example showcases", async ({ page }) => {
  for (const route of ["/quiz", "/ai", "/modules/security", "/modules/technology"]) {
    await page.goto(route)
    await expect(page.locator(".entrance-example")).toHaveCount(0)
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.getByRole("button", { name: /Start/ }).or(page.getByRole("link", { name: /Start/ })).first()).toBeVisible()
    if (route.startsWith("/modules/")) {
      await expect(page.getByRole("heading", { name: "Scope, lanes, and how to read the cases" })).toBeVisible()
      await expect(page.getByText("What it tests", { exact: true })).toBeVisible()
    }
  }
})

test("partial-position feedback stays opt-in and usable without disturbing the selected question", async ({ page }) => {
  await openSyntheticReview(page, "foundation")
  await page.goto("/quiz?q=3&from=review")
  const disclosure = page.locator(".task-map-disclosure")
  await expect(disclosure).not.toHaveAttribute("open")
  const question = page.locator(".quiz-question-frame")
  const text = await question.innerText()
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    const summary = disclosure.locator("summary")
    await summary.focus(); await page.keyboard.press("Enter")
    await expect(disclosure).toHaveAttribute("open")
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    await expect(question).toHaveText(text, { useInnerText: true })
    await summary.focus(); await page.keyboard.press("Enter")
    await expect(disclosure).not.toHaveAttribute("open")
  }
})

for (const domain of ["foundation", "ai", "security", "technology"] as const) test(`${domain}: worked reading and available answer evidence are in normal flow`, async ({ page }) => {
  const submit = await openSyntheticReview(page, domain)
  await submit.click()
  await expect(page).toHaveURL(/\/results\//)
  await expect(page.locator(".result-application")).toBeVisible()
  const evidence = domain === "foundation" ? page.locator('[data-local-evidence-status="available"]')
    : domain === "ai" ? page.locator("[data-ai-completion-evidence]") : page.getByRole("region", { name: "Recorded answers and perspective choices" })
  await expect(evidence).toBeVisible()
  expect(await evidence.evaluate(el => Boolean(el.closest("details:not([open])")))).toBe(false)
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  }
  await expect(page.getByRole("heading", { name: "Full analysis", exact: true })).toHaveCount(0)
})
