import { acceptsModuleCompletions } from "@/lib/modules/manifests"
import { expect, test, type Locator, type Page } from "@playwright/test"

function questionFrame(page: Page): Locator {
  return page.locator("section.quiz-question-frame")
}

async function chooseFirstAnswer(page: Page) {
  const frame = questionFrame(page)
  await expect(frame).toHaveCount(1)
  await frame.locator("button.option-card").first().click()
}

async function expectFocusedHeadingBelowStickyHeader(page: Page) {
  const heading = questionFrame(page).getByRole("heading", { level: 2 })
  await expect(heading).toBeFocused()
  const [headingBox, headerBox] = await Promise.all([
    heading.boundingBox(),
    page.locator(".quiz-shell-header").boundingBox(),
  ])
  expect(headingBox).not.toBeNull()
  expect(headerBox).not.toBeNull()
  expect(headingBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1)
}

test("Security entrance reflows at 320px and has a keyboard action", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/modules/security")
  if (!acceptsModuleCompletions("security")) {
    await expect(page.getByRole("heading", { name: "Security questionnaire paused" })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
    const exercise = page.getByRole("link", { name: "Try the decision exercise" })
    await exercise.focus()
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/decisions\/who-gets-to-verify$/)
    return
  }
  await page.getByRole("button", { name: "Start questions", exact: true }).click()
  await expect(page.getByRole("heading", { level: 1, name: /Security/ })).toBeVisible()
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320)

  const frame = questionFrame(page)
  await expect(frame).toHaveCount(1)
  const firstTitle = await frame.getByRole("heading", { level: 2 }).innerText()

  await chooseFirstAnswer(page)
  await expect(frame.getByRole("heading", { level: 2 })).toHaveText(firstTitle)
  await frame.getByRole("button", { name: "Next", exact: true }).click()
  await expect(frame.getByText(/^2 of \d+$/)).toBeVisible()
  await expect(frame.getByRole("heading", { level: 2 })).not.toHaveText(firstTitle)
  await expectFocusedHeadingBelowStickyHeader(page)

  await page.reload()
  await expect(questionFrame(page).getByText(/^2 of \d+$/)).toBeVisible()
  await expectFocusedHeadingBelowStickyHeader(page)

  await questionFrame(page).getByRole("button", { name: "Back", exact: true }).click()
  await expect(questionFrame(page).getByRole("heading", { level: 2 })).toHaveText(firstTitle)
  await expect(questionFrame(page).locator('button.option-card[aria-pressed="true"]')).toHaveCount(1)
})

test("Security has a return path to the module index", async ({ page }) => {
  await page.goto("/modules/security")
  if (!acceptsModuleCompletions("security")) {
    await page.locator("main").getByRole("link", { name: "Security and Technology", exact: true }).click()
    await expect(page).toHaveURL(/\/modules$/)
    await expect(page.getByRole("link", { name: "Security questionnaire paused" })).toHaveAttribute("href", "/modules/security")
    return
  }
  await page.getByRole("button", { name: "Start questions", exact: true }).click()
  await expect(questionFrame(page).getByText(/^1 of \d+$/)).toBeVisible()

  await questionFrame(page).getByRole("button", { name: "Back", exact: true }).click()

  await expect(page).toHaveURL(/\/modules$/)
  await expect(page.getByRole("heading", { level: 1, name: "Security and Technology", exact: true })).toBeVisible()
})

test("Technology respects whether the two form modes can accept answers", async ({
  page,
}) => {
  await page.goto("/modules/technology")
  if (!acceptsModuleCompletions("technology")) {
    await expect(page.getByRole("heading", { name: "Technology questionnaire paused" })).toBeVisible()
    await expect(page.getByRole("combobox", { name: "Mode", exact: true })).toHaveCount(0)
    await expect(page.getByRole("button", { name: "Start over", exact: true })).toHaveCount(0)
    await expect(page.getByRole("link", { name: "Try the decision exercise" })).toHaveAttribute("href", "/decisions/who-gets-access")
    return
  }
  await page.getByRole("button", { name: "Start questions", exact: true }).click()
  await chooseFirstAnswer(page)
  await questionFrame(page).getByRole("button", { name: "Next", exact: true }).click()
  await expect(questionFrame(page).getByText(/^2 of \d+$/)).toBeVisible()

  await page.getByRole("combobox", { name: "Mode", exact: true }).selectOption("analyst")
  await expect(questionFrame(page).getByText(/^1 of \d+$/)).toBeVisible()
  await chooseFirstAnswer(page)

  await page.getByRole("combobox", { name: "Mode", exact: true }).selectOption("standard")
  await expect(questionFrame(page).getByText(/^2 of \d+$/)).toBeVisible()

  await page.getByRole("combobox", { name: "Mode", exact: true }).selectOption("analyst")
  await expect(questionFrame(page).getByText(/^1 of \d+$/)).toBeVisible()
  await expect(questionFrame(page).locator('button.option-card[aria-pressed="true"]')).toHaveCount(1)

  await page.getByRole("button", { name: "Start over", exact: true }).click()
  await expect(page.getByText("Clear only your Advanced draft? Your other mode will remain saved.")).toBeVisible()
  await page.getByRole("button", { name: "Keep answers", exact: true }).click()
  await expect(questionFrame(page).locator('button.option-card[aria-pressed="true"]')).toHaveCount(1)

  await page.getByRole("button", { name: "Start over", exact: true }).click()
  await page.getByRole("button", { name: "Clear draft", exact: true }).click()
  await expect(questionFrame(page).locator('button.option-card[aria-pressed="true"]')).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Start over", exact: true })).toBeFocused()

  await page.getByRole("combobox", { name: "Mode", exact: true }).selectOption("standard")
  await expect(questionFrame(page).getByText(/^2 of \d+$/)).toBeVisible()
})

test("Security enforces the completion boundary and preserves Profile access", async ({
  page,
}) => {
  await page.goto("/modules/security")
  if (!acceptsModuleCompletions("security")) {
    await expect(page.getByRole("button", { name: /^See Security result/ })).toHaveCount(0)
    await page.locator("main").getByRole("link", { name: "your Profile" }).click()
    await expect(page).toHaveURL(/\/profile$/)
    return
  }
  await page.getByRole("button", { name: "Start questions", exact: true }).click()

  for (let step = 0; step < 80; step += 1) {
    if (await page.getByRole("heading", { name: "Check your answers" }).isVisible()) break

    await chooseFirstAnswer(page)
    const next = questionFrame(page).getByRole("button", {
      name: /^(?:Next|Review answers)$/,
    })
    await next.click()
  }

  await expect(page.getByRole("heading", { name: "Check your answers" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Check your answers" })).toBeFocused()
  const reviewRows = page.locator("ol li")
  expect(await reviewRows.count()).toBeGreaterThan(0)
  await expect(page.getByRole("button", { name: /^See Security result/ })).toBeVisible()

  await page.getByRole("button", { name: /^See Security result/ }).click()
  await expect(page).toHaveURL(/\/modules\/security\/results\/[A-Za-z0-9_-]+$/)
  await expect(page.getByRole("heading", { name: "How this relates to the Foundation" })).toBeVisible()
})

test("Foundation reset is immediate when empty and reversible when answers exist", async ({ page }) => {
  await page.goto("/quiz")

  const startOver = page.getByRole("button", { name: "Start over", exact: true })
  await startOver.click()
  await expect(page.getByText(/Starting over will clear every answer/)).toHaveCount(0)

  await page.getByRole("button", { name: "4 out of 7" }).click()
  await expect(page.locator('button.answer-button[aria-pressed="true"]')).toHaveCount(1)

  await startOver.click()
  await expect(page.getByText(/Starting over will clear every answer/)).toBeVisible()
  await page.getByRole("button", { name: "Keep draft", exact: true }).click()
  await expect(page.locator('button.answer-button[aria-pressed="true"]')).toHaveCount(1)
  await expect(startOver).toBeFocused()

  await startOver.click()
  await page.getByRole("button", { name: "Clear draft", exact: true }).click()
  await expect(page.locator('button.answer-button[aria-pressed="true"]')).toHaveCount(0)
  await expect(startOver).toBeFocused()
})

test("AI reset preserves answers on cancel and clears them only on confirmation", async ({ page }) => {
  await page.goto("/ai/quiz")
  await page.getByRole("button", { name: "Begin", exact: true }).click()

  const emptyStartOver = page.getByRole("button", { name: "Start over", exact: true })
  await emptyStartOver.click()
  await expect(page.getByText(/Starting over will clear every answer/)).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Begin", exact: true })).toBeFocused()
  await page.getByRole("button", { name: "Begin", exact: true }).click()

  await page.getByRole("button", { name: "4 out of 7" }).click()

  const startOver = page.getByRole("button", { name: "Start over", exact: true })
  await startOver.click()
  await expect(page.getByText(/Starting over will clear every answer/)).toBeVisible()
  await page.getByRole("button", { name: "Keep draft", exact: true }).click()
  await expect(page.locator('button.answer-button[aria-pressed="true"]')).toHaveCount(1)
  await expect(startOver).toBeFocused()

  await startOver.click()
  await page.getByRole("button", { name: "Clear draft", exact: true }).click()
  await expect(page.locator('button.answer-button[aria-pressed="true"]')).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Begin", exact: true })).toBeFocused()
})
