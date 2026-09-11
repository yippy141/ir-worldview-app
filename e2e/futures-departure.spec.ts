import { test, expect, type Page } from "@playwright/test"
import { mkdirSync } from "node:fs"
import { departure, departureQuestions, questionsFor, type Answers, type Comparison } from "../lib/futures/departure"

const choices: Answers = {
  aDesired: "accept", aEvidence: "control", aDecision: "stay", aReason: "attachment", aOthers: "allow",
  bDesired: "welcome", bEvidence: "demonstration", bDecision: "go", bReason: "return",
  cPolicy: "no-veto", cMonitoring: "allow", cIntervention: "joint", cReason: "self-rule",
}
async function fill(page: Page, stage: Comparison, answers = choices) {
  for (const q of questionsFor(stage)) await page.locator(`input[name="${q.id}"][value="${answers[q.id]}"]`).check()
}
async function begin(page: Page) {
  await page.goto(departure.href)
  await page.getByRole("button", { name: "Consider the invitation", exact: true }).click()
}
async function finish(page: Page) {
  await fill(page, "a")
  await page.getByRole("button", { name: "Continue to the next comparison" }).click()
  await fill(page, "b")
  await page.getByRole("button", { name: "Continue to the next comparison" }).click()
  await fill(page, "c")
  await page.getByRole("button", { name: "Review my decisions" }).click()
  await page.getByRole("button", { name: "Submit and read my decisions" }).click()
}

test("explicit submission, back/edit invalidation, scope disclosures and unknown reasons", async ({ page }) => {
  await begin(page)
  await expect(page.locator("fieldset details[open]")).toHaveCount(0)
  await fill(page, "a")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("An invitation, with no known way back")
  await page.getByRole("button", { name: "Continue to the next comparison" }).click()
  await fill(page, "b")
  await page.getByRole("button", { name: "Back", exact: true }).click()
  await expect(page.locator('input[name="aDecision"][value="stay"]')).toBeChecked()
  await page.getByRole("button", { name: "Continue to the next comparison" }).click()
  await expect(page.locator('input[name="bDecision"][value="go"]')).toBeChecked()
  await page.getByRole("button", { name: "Continue to the next comparison" }).click()
  await fill(page, "c")
  await expect(page.getByRole("img", { name: "Earth, the outward journey and the unresolved relationship", exact: true })).toHaveAccessibleDescription(/No AI veto/)
  await page.getByRole("button", { name: "Review my decisions" }).click()
  await expect(page.getByRole("heading", { name: "What your conditions change" })).toHaveCount(0)
  await page.getByRole("button", { name: "Submit and read my decisions" }).click()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("What your conditions change")
  await expect(page.getByText("The revised offer changes your decision", { exact: true })).toBeVisible()
  await expect(page.getByText("Staying and allowing departure can go together", { exact: true })).toBeVisible()
  await page.getByRole("button", { name: "Review or change decisions" }).click()
  await page.getByRole("button", { name: "Edit comparison A" }).click()
  await page.locator('input[name="aReason"][value="other"]').check()
  await expect(page.getByRole("status")).toContainText("cleared")
  await expect(page.locator('input[name="aOthers"]:checked')).toHaveCount(0)
  await page.locator('input[name="aOthers"][value="allow"]').check()
  await page.getByRole("button", { name: "Continue to the next comparison" }).click()
  await expect(page.locator('input[type="radio"]:checked')).toHaveCount(0)
  await fill(page, "b", { ...choices, bReason: "other" })
  await page.getByRole("button", { name: "Continue to the next comparison" }).click()
  await fill(page, "c", { ...choices, cReason: "other" })
  await page.getByRole("button", { name: "Review my decisions" }).click()
  await page.getByRole("button", { name: "Submit and read my decisions" }).click()
  await expect(page.getByRole("heading", { name: "The offered reasons missed your account" })).toBeVisible()
})

test("answer interactions produce no network requests or persistent writes", async ({ page, context }, testInfo) => {
  const configuredServers = testInfo.config.webServer ? [testInfo.config.webServer].flat() : []
  test.skip(configuredServers.some(server => server.command.includes("npm run dev")), "Run playwright.departure.config.ts for privacy assertions against the production build; Next.js development tools write their own storage.")
  await page.addInitScript(() => {
    const writes: string[] = []
    Object.defineProperty(window, "__departureWrites", { value: writes })
    for (const method of ["setItem", "removeItem", "clear"] as const) {
      const original = Storage.prototype[method]
      Object.defineProperty(Storage.prototype, method, { value: function (...args: string[]) { writes.push(`${method}:${args[0] ?? ""}`); return Reflect.apply(original, this, args) } })
    }
  })
  await begin(page)
  await page.waitForLoadState("networkidle")
  const before = await context.cookies()
  const requests: string[] = []
  page.on("request", request => requests.push(`${request.method()} ${request.url()} ${request.postData() ?? ""}`))
  await finish(page)
  await expect(page).toHaveURL(/\/futures\/departure$/)
  expect(requests).toEqual([])
  expect(await page.evaluate(() => (window as unknown as { __departureWrites: string[] }).__departureWrites)).toEqual([])
  expect(await page.evaluate(async () => (await indexedDB.databases()).length)).toBe(0)
  expect(await context.cookies()).toEqual(before)
  await page.reload()
  await expect(page.getByRole("button", { name: "Consider the invitation", exact: true })).toBeVisible()
})

test("keyboard, equal policy framing, reset confirmation and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto(departure.href)
  const policy = page.getByRole("radio", { name: "Less-personal policy framing" })
  await policy.focus()
  await page.keyboard.press("Space")
  await page.getByRole("button", { name: "Consider the invitation", exact: true }).click()
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused()
  await expect(page.getByText("With return terms unknown, what should the fictional adult considering this offer do?", { exact: true })).toBeVisible()
  const radio = page.locator('input[name="aDesired"]').first()
  await radio.focus()
  await page.keyboard.press("Space")
  await page.keyboard.press("ArrowDown")
  await expect(page.locator('input[name="aDesired"][value="accept"]')).toBeChecked()
  expect(await page.locator('input[name="aDesired"][value="accept"]').evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe("none")
  await fill(page, "a")
  await page.getByRole("button", { name: "Return to the story" }).click()
  await page.getByRole("radio", { name: "Personal framing", exact: true }).click()
  await expect(page.getByRole("button", { name: "Keep my draft" })).toBeFocused()
  await page.getByRole("button", { name: "Keep my draft" }).click()
  await expect(page.getByRole("radio", { name: "Personal framing", exact: true })).toBeFocused()
  await expect(policy).toBeChecked()
  await page.getByRole("button", { name: "Resume the comparisons" }).click()
  await page.getByRole("button", { name: "Clear this draft", exact: true }).click()
  await page.getByRole("button", { name: "Clear choices and start again" }).click()
  await expect(policy).toBeChecked()
  const animations = await page.locator("article[lang=en]").evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === "running").length)
  expect(animations).toBe(0)
})

test("320/390/768/1440 reflow and an inspectable visual walkthrough", async ({ page }) => {
  mkdirSync("artifacts/futures-departure", { recursive: true })
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(departure.href)
    await page.evaluate(() => document.fonts.ready)
    const capture = async (state: string) => {
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await page.screenshot({ path: `artifacts/futures-departure/${state}-${width}.png`, fullPage: true })
    }
    await capture("opening")
    await page.getByRole("button", { name: "Consider the invitation", exact: true }).click()
    await fill(page, "a")
    await capture("invitation")
    await page.getByRole("button", { name: "Continue to the next comparison" }).click()
    await fill(page, "b")
    await capture("return")
    await page.getByRole("button", { name: "Continue to the next comparison" }).click()
    await fill(page, "c")
    await capture("authority")
    await page.getByRole("button", { name: "Review my decisions" }).click()
    await capture("review")
    await page.getByRole("button", { name: "Submit and read my decisions" }).click()
    await capture("reading")
    await page.goto("/futures")
    await expect(page.locator("article.trajectory-card")).toHaveCount(12)
    await capture("collection")
  }
  await page.goto("/zh/futures/departure")
  await expect(page.getByRole("button", { name: "Consider the invitation", exact: true })).toHaveCount(0)
  expect(departureQuestions).toHaveLength(13)
})
