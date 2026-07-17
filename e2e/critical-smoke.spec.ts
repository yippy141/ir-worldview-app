import { expect, test, type Page } from "@playwright/test"
import { getLatestPublishedCurrentCase } from "../lib/current-cases/catalog"
import { CURRENT_CASE_CHALLENGE_LIFETIME_SECONDS } from "../lib/current-cases/challenge"
import { createCurrentCaseChallengeToken } from "../lib/current-cases/challenge-token.server"

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

async function completeLoadedCurrentCase(
  page: Page,
  finalOptionId: string,
  finalConfidence = "4",
) {
  await page.getByRole("button", { name: "Make your first judgment" }).click()
  await page.locator('input[name="initial-option"][value="o1"]').check()
  await page.locator('input[name="initial-confidence"][value="3"]').check()
  await page.getByRole("button", { name: "Continue", exact: true }).click()
  await page.getByRole("button", { name: "See the worldview readings" }).click()
  await page.getByRole("button", { name: "Test an assumption" }).click()
  await page.getByRole("radio", {
    name: "It changes the priority, not the conclusion.",
  }).check()
  await page.getByRole("button", { name: "Make your final judgment" }).click()
  await page.locator(`input[name="final-option"][value="${finalOptionId}"]`).check()
  await page.locator(`input[name="final-confidence"][value="${finalConfidence}"]`).check()
  await page.getByRole("button", { name: "See what moved" }).click()
  await expect(page.getByRole("heading", { name: "What moved" })).toBeVisible()
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

test("Current Case resumes, records movement, and appears in My Profile", async ({ page }) => {
  await page.goto("/current")
  await expect(page).toHaveURL(/\/cases\/europe-missile-defence-coalition-ukraine$/)

  await page.getByRole("button", { name: "Make your first judgment" }).click()
  await page.locator('input[name="initial-option"][value="o1"]').check()
  await page.locator('input[name="initial-confidence"][value="3"]').check()
  await page.getByRole("button", { name: "Continue", exact: true }).click()
  await page.getByRole("checkbox", { name: "Urgent capability" }).check()

  await page.reload()
  await expect(page.getByText("Draft restored from this browser.")).toBeVisible()
  await expect(page.getByRole("checkbox", { name: "Urgent capability" })).toBeChecked()

  await page.getByRole("button", { name: "See the worldview readings" }).click()
  await expect(page.getByRole("heading", { name: "Four ways to read the same case" })).toBeVisible()
  await page.getByRole("button", { name: "Test an assumption" }).click()
  await page.getByRole("radio", {
    name: "It changes the priority, not the conclusion.",
  }).check()
  await page.getByRole("button", { name: "Make your final judgment" }).click()
  await page.locator('input[name="final-option"][value="o2"]').check()
  await page.locator('input[name="final-confidence"][value="4"]').check()
  await page.getByRole("button", { name: "See what moved" }).click()

  await expect(page.getByRole("heading", { name: "What moved" })).toBeVisible()
  await expect(page.getByText(/You moved from/)).toBeVisible()
  await expect(page.getByText("Judgment saved on this device.")).toBeVisible()

  await page.getByRole("link", { name: "View current judgments in My Profile" }).click()
  await expect(page).toHaveURL(/\/profile$/)
  await expect(page.getByRole("heading", { name: "How your calls moved in live cases" })).toBeVisible()
  await expect(page.getByText(/You moved from/)).toBeVisible()
})

test("Current Case creates a challenge only after explicit reading selection", async ({ page }) => {
  await page.goto("/current")
  await completeLoadedCurrentCase(page, "o2")

  await expect(page.getByRole("button", { name: "Share my reading" })).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Challenge a friend" })).toHaveCount(0)
  await page.getByRole("checkbox", { name: /Include my final choice/ }).check()
  const challengeResponse = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/current-cases/challenge") &&
      response.request().method() === "POST",
  )
  await page.getByRole("button", { name: "Challenge a friend" }).click()

  await expect(page.getByText("Challenge link copied.")).toBeVisible()
  const body = await (await challengeResponse).json()
  expect(body.ok).toBe(true)
  expect(body.token).toMatch(/^cc1\./)
})

test("a friend completes the case before the inviter answer is revealed", async ({ page }) => {
  const record = getLatestPublishedCurrentCase()
  expect(record).not.toBeNull()
  if (!record) return
  const secret = process.env.CURRENT_CASE_CHALLENGE_SECRET
  expect(secret).toBeTruthy()
  const created = createCurrentCaseChallengeToken(
    {
      caseId: record.id,
      inviterFinalOptionId: "o2",
      inviterConfidence: 4,
    },
    { secret },
  )
  expect(created.ok).toBe(true)
  if (!created.ok) return

  const navigationRequests: string[] = []
  page.on("request", (request) => {
    if (request.isNavigationRequest()) navigationRequests.push(request.url())
  })
  await page.goto(`/cases/${record.slug}/challenge#${created.token}`)
  expect(navigationRequests.some((url) => url.includes(created.token))).toBe(false)
  await expect(
    page.getByRole("heading", { name: "Make your call before seeing theirs" }),
  ).toBeVisible()
  await expect(page.getByText("Inviter’s final judgment")).toHaveCount(0)

  await completeLoadedCurrentCase(page, "o1")

  await expect(page.getByText("Inviter’s final judgment")).toBeVisible()
  const inviterRow = page.locator("div").filter({
    has: page.getByText("Inviter’s final judgment", { exact: true }),
  }).last()
  await expect(inviterRow).toContainText(record.decision.options[1].label)
  await expect(inviterRow).toContainText("Confidence 4/5")
})

test("an expired Current Case challenge recovers to the ordinary case", async ({ page }) => {
  const record = getLatestPublishedCurrentCase()
  expect(record).not.toBeNull()
  if (!record) return
  const secret = process.env.CURRENT_CASE_CHALLENGE_SECRET
  expect(secret).toBeTruthy()
  const now = new Date()
  const created = createCurrentCaseChallengeToken(
    {
      caseId: record.id,
      inviterFinalOptionId: "o2",
      inviterConfidence: 4,
    },
    {
      secret,
      now: new Date(now.valueOf() - (CURRENT_CASE_CHALLENGE_LIFETIME_SECONDS + 60) * 1000),
    },
  )
  expect(created.ok).toBe(true)
  if (!created.ok) return

  await page.goto(`/cases/${record.slug}/challenge#${created.token}`)
  await expect(
    page.getByRole("heading", { name: "This challenge link has expired." }),
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Open the case without the challenge" }),
  ).toHaveAttribute("href", `/cases/${record.slug}`)
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

  test("Current Case brief remains within the viewport", async ({ page }) => {
    await page.goto("/current")

    await expect(page.getByRole("heading", { name: "The case" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Read the claim and source ledger" })).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true)
  })
})
