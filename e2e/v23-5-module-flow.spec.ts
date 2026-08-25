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

test("Focus Area keeps one reversible question on screen and restores position", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/modules/security")
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

test("Focus Area Back from the first question returns to the mode choice", async ({ page }) => {
  await page.goto("/modules/security")
  await expect(questionFrame(page).getByText(/^1 of \d+$/)).toBeVisible()

  await questionFrame(page).getByRole("button", { name: "Back", exact: true }).click()

  await expect(page).toHaveURL(/\/modules$/)
  await expect(page.getByRole("heading", { level: 1, name: /focused issue read/ })).toBeVisible()
})

test("Standard and Advanced Focus Area drafts survive mode switches independently", async ({
  page,
}) => {
  await page.goto("/modules/technology")
  await chooseFirstAnswer(page)
  await questionFrame(page).getByRole("button", { name: "Next", exact: true }).click()
  await expect(questionFrame(page).getByText(/^2 of \d+$/)).toBeVisible()

  await page.getByRole("button", { name: /\bAdvanced\b/ }).click()
  await expect(questionFrame(page).getByText(/^1 of \d+$/)).toBeVisible()
  await chooseFirstAnswer(page)

  await page.getByRole("button", { name: /\bStandard\b/ }).click()
  await expect(questionFrame(page).getByText(/^2 of \d+$/)).toBeVisible()

  await page.getByRole("button", { name: /\bAdvanced\b/ }).click()
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

  await page.getByRole("button", { name: /\bStandard\b/ }).click()
  await expect(questionFrame(page).getByText(/^2 of \d+$/)).toBeVisible()
})

test("Focus Area requires a complete review before preserving the existing result tuple", async ({
  page,
}) => {
  await page.goto("/modules/security")

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
