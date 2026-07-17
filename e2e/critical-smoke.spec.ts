import { expect, test, type Page } from "@playwright/test"

async function answerCurrentFoundationQuestion(page: Page) {
  const choiceCards = page.locator("button.option-card")
  if (await choiceCards.count()) {
    await choiceCards.first().click()
    return
  }

  const likertChoices = page.locator("button.answer-button")
  await expect(likertChoices).toHaveCount(7)
  await likertChoices.nth(3).click()
}

async function completeFoundation(page: Page) {
  await page.goto("/quiz")
  await expect(page.getByRole("heading", { name: "Foundation", exact: true })).toBeVisible()

  for (let step = 0; step < 60; step += 1) {
    const midpointContinue = page.getByRole("button", { name: "Continue", exact: true })
    if (await midpointContinue.isVisible()) {
      await midpointContinue.click()
      continue
    }

    await answerCurrentFoundationQuestion(page)

    const reviewButton = page.getByRole("button", { name: "Review your answers →" })
    if (await reviewButton.isVisible()) {
      await reviewButton.click()
      await expect(page).toHaveURL(/\/quiz\/review$/)
      return
    }

    await page.getByRole("button", { name: "Next", exact: true }).click()
  }

  throw new Error("Foundation did not reach review within the expected question limit.")
}

test("World Stage opens the Foundation and a draft resumes after reload", async ({ page }) => {
  await page.goto("/")

  const stageNav = page.getByRole("navigation", { name: "World Stage sections" })
  await stageNav.getByRole("link", { name: /Foundation/ }).click()
  await expect(page).toHaveURL(/\/quiz$/)

  await answerCurrentFoundationQuestion(page)
  await expect(page.getByText(/1 of \d+ answered/)).toBeVisible()

  await page.reload()
  await expect(page.getByText(/1 of \d+ answered/)).toBeVisible()
  await expect(page.locator('button[aria-pressed="true"]')).toHaveCount(1)
})

test("Foundation review generates a result, share link, and saved Profile", async ({
  context,
  page,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: "http://127.0.0.1:3000",
  })

  await completeFoundation(page)
  await expect(
    page.getByRole("heading", { name: "Before you generate your foundation result" }),
  ).toBeVisible()

  await page.getByRole("button", { name: "Generate my result →" }).click()
  await expect(page).toHaveURL(/\/results\/[A-Za-z0-9_-]+$/)
  await expect(page.getByRole("link", { name: "View Profile" })).toBeVisible()

  await page.getByRole("button", { name: "Copy share link" }).click()
  await expect(page.getByRole("button", { name: "Link copied" })).toBeVisible()
  const shareUrl = await page.evaluate(() => navigator.clipboard.readText())
  expect(shareUrl).toBe(page.url())

  const sharedResult = await context.newPage()
  await sharedResult.goto(shareUrl)
  await expect(sharedResult).toHaveURL(/\/results\/[A-Za-z0-9_-]+$/)
  await expect(sharedResult.getByText("Invalid result")).toHaveCount(0)
  await sharedResult.close()

  await page.getByRole("link", { name: "View Profile" }).click()
  await expect(page).toHaveURL(/\/profile$/)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await expect(page.getByText("No Foundation baseline is saved", { exact: false })).toHaveCount(0)
})

test("Worldview Map switches between list and map views", async ({ page }) => {
  // Desktop shows the map and semantic list together. The explicit view switch
  // is the small-screen affordance, so exercise it below that breakpoint.
  await page.setViewportSize({ width: 800, height: 900 })
  await page.goto("/explore/atlas")
  await expect(page.getByRole("heading", { name: "Worldview Map", exact: true })).toBeVisible()

  const listButton = page.getByRole("button", { name: "List", exact: true })
  const mapButton = page.getByRole("button", { name: "Map", exact: true })

  await listButton.click()
  await expect(listButton).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByRole("heading", { name: "Complete list" })).toBeVisible()

  await mapButton.click()
  await expect(mapButton).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByRole("region", { name: "Worldview Map" })).toBeVisible()
})

test("invalid Foundation result shows a plain recovery path", async ({ page }) => {
  await page.goto("/results/not-a-valid-payload")

  await expect(page.getByText("Invalid result", { exact: true })).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "This link could not be decoded." }),
  ).toBeVisible()
  await expect(page.getByRole("link", { name: "Take the Foundation" })).toBeVisible()
})

test.describe("390px viewport", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("World Stage and Foundation remain within the viewport", async ({ page }) => {
    await page.goto("/")

    const mapViews = page.locator("#world-stage-map-view option")
    await expect(mapViews).toHaveText([
      "Pacific alliances",
      "Chip networks",
      "Regional security",
      "Hedging states",
      "AI infrastructure",
    ])
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true)

    await page
      .getByRole("navigation", { name: "World Stage sections" })
      .getByRole("link", { name: /Foundation/ })
      .click()
    await expect(page.getByRole("heading", { name: "Foundation", exact: true })).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true)
  })
})
