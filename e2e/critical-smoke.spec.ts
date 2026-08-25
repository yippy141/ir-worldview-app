import { expect, test, type Page } from "@playwright/test"
import {
  getActivePublishedLaunchCurrentCase,
  getPublishedCurrentCases,
} from "../lib/current-cases/catalog"
import {
  formatArchetypeCodeSpeech,
  formatArchetypeDisplayCode,
} from "../lib/archetype-display"
import { archetypes, getArchetypePath } from "../lib/archetypes"
import { EXPLORE_HUB_SECTION_ORDER } from "../lib/explore-content"
import {
  LOCAL_HISTORY_STORAGE_KEYS,
  SESSION_HISTORY_STORAGE_KEYS,
} from "../lib/local-data"
import {
  ANALYTICS_OPT_OUT_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
} from "../lib/storage-keys"
import profileStoreV1 from "../tests/fixtures/profile-store-v1.json"
import profileStoreV2 from "../tests/fixtures/profile-store-v2.json"
import profileStoreV5 from "../tests/fixtures/profile-store-v5.json"
import { familySlug, MODELED_FAMILY_KEYS } from "../lib/worldview-config"

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
    name: "It changes which option comes first; my conclusion stays the same.",
  }).check()
  await page.getByRole("button", { name: "Make your final judgment" }).click()
  await page.locator(`input[name="final-option"][value="${finalOptionId}"]`).check()
  await page.locator(`input[name="final-confidence"][value="${finalConfidence}"]`).check()
  await page.getByRole("button", { name: "See your final judgment" }).click()
  await expect(
    page.getByRole("heading", { name: "Your judgment after the challenge" }),
  ).toBeVisible()
}

test("public entry points match reviewed Current Case availability", async ({ page }) => {
  const record = getPublishedCurrentCases()[0] ?? null
  const activeCase = getActivePublishedLaunchCurrentCase()
  expect(record).not.toBeNull()
  if (!record) return

  await page.goto("/")
  if (activeCase) {
    await expect(page.getByRole("link", { name: /^Current Case\b/ })).toBeVisible()
  } else {
    await expect(page.getByRole("link", { name: /^Foundation\b/ }).first()).toBeVisible()
    await expect(page.getByRole("link", { name: /^Recent Cases\b/ })).toBeVisible()
    await expect(page.getByRole("link", { name: /^Current Case\b/ })).toHaveCount(0)
  }
  await expect(page.getByText("Atlas", { exact: true })).toHaveCount(0)

  const svgFallback = page.locator('svg:has(path[data-iso3])')
  await expect(svgFallback).toBeVisible()
  expect(await svgFallback.locator('path[data-iso3]').count()).toBeGreaterThan(0)
  await expect(page.locator("canvas.mapboxgl-canvas")).toHaveCount(0)

  await page.goto("/current")
  if (activeCase) {
    await expect(page).toHaveURL(new RegExp(`/cases/${activeCase.slug}$`))
  } else {
    await expect(page).toHaveURL(/\/cases$/)
    await expect(page.getByRole("heading", { name: "Recent cases" })).toBeVisible()
    await expect(page.locator("li").getByText("Current case", { exact: true })).toHaveCount(0)
    await expect(page.locator("li").first()).toContainText("Review due")
    await expect(page.locator("li").last()).toContainText("Background")
  }

  await page.goto(`/cases/${record.slug}`)
  await expect(page.getByRole("heading", { name: "Read the case briefing" })).toBeVisible()
})

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
  await page.goto("/cases/europe-missile-defence-coalition-ukraine")

  await page.getByRole("button", { name: "Make your first judgment" }).click()
  await page.locator('input[name="initial-option"][value="o1"]').check()
  await page.locator('input[name="initial-confidence"][value="3"]').check()
  await page.getByRole("button", { name: "Continue", exact: true }).click()
  await page.getByRole("checkbox", { name: "Urgent capability" }).check()

  await page.reload()
  await expect(page.getByText("Draft restored from this browser.")).toBeVisible()
  await expect(page.getByRole("checkbox", { name: "Urgent capability" })).toBeChecked()

  await page.getByRole("button", { name: "See the worldview readings" }).click()
  await expect(page.getByRole("heading", { name: "Compare four readings of the case" })).toBeVisible()
  await page.getByRole("button", { name: "Test an assumption" }).click()
  await page.getByRole("radio", {
    name: "It changes which option comes first; my conclusion stays the same.",
  }).check()
  await page.getByRole("button", { name: "Make your final judgment" }).click()
  await page.locator('input[name="final-option"][value="o2"]').check()
  await page.locator('input[name="final-confidence"][value="4"]').check()
  await page.getByRole("button", { name: "See your final judgment" }).click()

  await expect(
    page.getByRole("heading", { name: "Your judgment after the challenge" }),
  ).toBeVisible()
  await expect(page.getByText(/You moved from/)).toBeVisible()
  await expect(page.getByText("Not inferred", { exact: true })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Foundation connection" })).toBeVisible()
  await expect(
    page.getByText(
      "This case does not yet include a reviewed, versioned mapping between its readings and the Foundation. Your case judgment remains separate and does not create or change a Foundation result.",
      { exact: true },
    ),
  ).toBeVisible()
  await expect(page.getByText("Judgment saved on this device.")).toBeVisible()

  await page.getByRole("link", { name: "View current judgments in My Profile" }).click()
  await expect(page).toHaveURL(/\/profile$/)
  await expect(page.getByRole("heading", { name: "How your calls moved in live cases" })).toBeVisible()
  await expect(page.getByText(/You moved from/)).toBeVisible()
})

test("Current Case shares a case-only invitation without an answer-bearing API", async ({ page }) => {
  const record = getPublishedCurrentCases()[0] ?? null
  expect(record).not.toBeNull()
  if (!record) return

  let challengeApiCalls = 0
  await page.route("**/api/current-cases/challenge**", async (route) => {
    challengeApiCalls += 1
    await route.fulfill({ status: 500, body: "legacy challenge API must not be called" })
  })

  await page.goto(`/cases/${record.slug}`)
  await completeLoadedCurrentCase(page, "o2")

  await expect(page.getByRole("button", { name: "Share my reading" })).toHaveCount(0)
  await page.getByRole("button", { name: "Invite someone to this case" }).click()
  await expect(page.getByText("Case invitation copied.")).toBeVisible()
  expect(challengeApiCalls).toBe(0)

  await page.getByRole("checkbox", { name: /Add my final choice/ }).check()
  await expect(page.getByRole("button", { name: "Share my reading" })).toBeVisible()
  expect(challengeApiCalls).toBe(0)
})

test("legacy answer-bearing challenge links recover to the ordinary case", async ({ page }) => {
  const record = getPublishedCurrentCases()[0] ?? null
  expect(record).not.toBeNull()
  if (!record) return

  const navigationRequests: string[] = []
  page.on("request", (request) => {
    if (request.isNavigationRequest()) navigationRequests.push(request.url())
  })
  await page.goto(`/cases/${record.slug}/challenge#legacy-answer-bearing-token`)
  expect(navigationRequests.some((url) => url.includes("legacy-answer-bearing-token"))).toBe(false)
  await expect(
    page.getByRole("heading", { name: "Answer-bearing challenge links have been retired." }),
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Open the ordinary case" }),
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
    page.getByRole("heading", { name: "Review your Foundation answers" }),
  ).toBeVisible()

  await page.getByRole("button", { name: "Generate my result →" }).click()
  await expect(page).toHaveURL(/\/results\/[A-Za-z0-9_-]+$/)
  await expect(page.getByRole("link", { name: "View Profile" })).toBeVisible()
  const foundationArchetype = await page
    .locator("#foundation-result-heading")
    .innerText()
  await expect(
    page.getByRole("link", { name: /^Read the .+ profile →$/ }),
  ).toHaveCount(0)

  const analogueLink = page.locator(".foundation-result-analogue a")
  if (await analogueLink.count()) {
    await expect(analogueLink).toBeVisible()
    await expect(analogueLink).toHaveAttribute(
      "href",
      /^\/archetypes\/[prms]-(plus|minus)\?from=%2Fresults%2F[A-Za-z0-9_-]+$/,
    )
    const evidencePage = await context.newPage()
    await evidencePage.goto(await analogueLink.getAttribute("href") ?? "/")
    await expect(
      evidencePage.getByRole("heading", { name: "Why this comparison fits" }),
    ).toBeVisible()
    await expect(
      evidencePage.getByRole("heading", { name: "Where the comparison breaks" }),
    ).toBeVisible()
    const backToResult = evidencePage.getByRole("link", {
      name: "← Back to your result",
    })
    await expect(backToResult).toHaveAttribute(
      "href",
      new URL(page.url()).pathname,
    )
    await backToResult.click()
    await expect(evidencePage).toHaveURL(page.url())
    await expect(evidencePage.getByText("Invalid result")).toHaveCount(0)
    await evidencePage.close()
  }

  const fullAnalysis = page.locator(
    ".result-appendix-section details.profile-details",
  )
  await fullAnalysis.locator("summary").click()
  const resultActions = fullAnalysis.locator(".result-details-body")
  await resultActions
    .getByRole("button", { name: "Copy share link", exact: true })
    .click()
  await expect(
    resultActions.getByRole("button", { name: "Copied!", exact: true }),
  ).toBeVisible()
  const shareUrl = await page.evaluate(() => navigator.clipboard.readText())
  expect(shareUrl).toBe(page.url())

  const sharedResult = await context.newPage()
  await sharedResult.goto(shareUrl)
  await expect(sharedResult).toHaveURL(/\/results\/[A-Za-z0-9_-]+$/)
  await expect(sharedResult.getByText("Invalid result")).toHaveCount(0)
  await sharedResult.close()

  await page.getByRole("link", { name: "View Profile" }).click()
  await expect(page).toHaveURL(/\/profile$/)
  await expect(
    page.getByRole("heading", { level: 1, name: foundationArchetype }),
  ).toBeVisible()
  await expect(
    page.getByText(
      "The Foundation is your core record. Completed Focus Areas and AI results appear beside it as issue-specific records; none changes the Foundation result.",
      { exact: true },
    ),
  ).toBeVisible()
  await expect(page.getByText("separate-domain-read", { exact: true })).toHaveCount(0)
  await expect(page.getByText("No numeric bridge", { exact: true })).toHaveCount(0)
  await expect(page.getByText("No master score", { exact: true })).toHaveCount(0)
  await expect(page.getByText(/^Worldview profile:/)).toHaveCount(0)
  await expect(page.getByText("No Foundation baseline is saved", { exact: false })).toHaveCount(0)
})

test("legacy Profiles preserve saved results without inventing a Foundation identity", async ({
  page,
}) => {
  await page.goto("/")

  for (const fixture of [
    { profile: profileStoreV1, result: "Legacy security result" },
    { profile: profileStoreV2, result: "Legacy technology result" },
  ]) {
    await page.evaluate(
      ({ key, value }) => window.localStorage.setItem(key, value),
      {
        key: PROFILE_STORAGE_KEY,
        value: JSON.stringify(fixture.profile),
      },
    )
    await page.goto("/profile")

    await expect(
      page.getByRole("heading", { name: "Foundation result unavailable" }),
    ).toBeVisible()
    await expect(page.getByText("Stable thread", { exact: true })).toHaveCount(0)
    await expect(page.getByText("Closest traditions:", { exact: false })).toHaveCount(0)
    await expect(
      page.getByText(
        "The Foundation is your core record. Completed Focus Areas and AI results appear beside it as issue-specific records; none changes the Foundation result.",
        { exact: true },
      ),
    ).toBeVisible()
    await expect(page.getByText("separate-domain-read", { exact: true })).toHaveCount(0)
    await expect(page.getByText("Biggest shift", { exact: true })).toHaveCount(0)
    await expect(page.getByText("Relative pull", { exact: false })).toHaveCount(0)
    await expect(
      page.getByText("What stayed steady, what shifted", { exact: true }),
    ).toHaveCount(0)
    await expect(page.getByText("Directional read:", { exact: false })).toHaveCount(0)
    await page.getByText("Archived Foundation record", { exact: true }).click()
    await expect(
      page.getByText("Cached family labels and derived anchors", { exact: false }),
    ).toBeVisible()
    await page.getByText("Completed Focus Areas", { exact: true }).click()
    await expect(
      page.getByRole("heading", { name: fixture.result }),
    ).toBeVisible()
    await expect(page.getByRole("button", { name: "Share profile" })).toBeVisible()
  }
})

test("historical analogue pages show both the comparison and its limit", async ({
  page,
}) => {
  await page.goto("/archetypes/p-plus")

  await expect(
    page.getByRole("heading", { level: 1, name: "Kairos" }),
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Why this comparison fits" }),
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Where the comparison breaks" }),
  ).toBeVisible()
  await expect(page.getByText("This is a comparison, not an identity")).toBeVisible()

  // P+ has no name collision to footnote; R+ does.
  await expect(
    page.getByRole("heading", { name: "A note on the name" }),
  ).toHaveCount(0)

  await page.goto("/archetypes/r-plus")
  await expect(
    page.getByRole("heading", { name: "A note on the name" }),
  ).toBeVisible()
  await expect(page.getByText("Martin Wight", { exact: false })).toBeVisible()
})

test("the archetype directory exposes exactly the eight canonical pure routes", async ({
  page,
}) => {
  await page.goto("/archetypes")
  await expect(
    page.getByRole("heading", { level: 1, name: "Foundation archetypes" }),
  ).toBeVisible()
  await expect(page.locator("main")).toHaveCount(1)

  const links = page.locator("[data-archetype-directory] a[data-archetype-code]")
  await expect(links).toHaveCount(8)
  expect(await links.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("href")),
  )).toEqual(
    archetypes.map(({ code }) => getArchetypePath(code)),
  )
  await expect(page.locator("[data-archetype-directory] svg")).toHaveCount(8)
  const codeLabels = page.locator(
    "[data-archetype-directory] [data-archetype-code-label]",
  )
  await expect(codeLabels).toHaveCount(8)
  await expect(codeLabels).toHaveText(
    archetypes.map(({ code }) => formatArchetypeDisplayCode(code)),
  )
  for (const archetype of archetypes) {
    const row = page.getByRole("link", {
      name: `Open ${archetype.name}, ${formatArchetypeCodeSpeech(archetype.code)}`,
      exact: true,
    })
    await expect(row).toBeVisible()
    await expect(row).toHaveAccessibleDescription(archetype.gloss)
    await expect(
      row.locator(`[data-archetype-mark="${archetype.code}"]`),
    ).toHaveAttribute("data-archetype-mark-size", "48")
  }
  await expect(page.getByText(/8 types|eight types/i)).toHaveCount(0)
})

test("Explore renders the contracted nine sections in order", async ({ page }) => {
  await page.goto("/explore")
  const sections = page.locator("[data-explore-section]")
  await expect(sections).toHaveCount(9)
  expect(await sections.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("data-explore-section")),
  )).toEqual(EXPLORE_HUB_SECTION_ORDER)
})

test("all eight archetype details publish the qualified partial core and legacy comparison", async ({
  page,
}) => {
  for (const archetype of archetypes) {
    await page.goto(getArchetypePath(archetype.code))
    await expect(page.locator("main")).toHaveCount(1)
    await expect(
      page.getByRole("heading", { level: 1, name: archetype.name, exact: true }),
    ).toBeVisible()
    const detail = page.locator("[data-archetype-detail]")
    const codeLabel = detail.locator("[data-archetype-code-label]")
    await expect(codeLabel).toHaveCount(1)
    await expect(codeLabel).toHaveText(formatArchetypeDisplayCode(archetype.code))
    await expect(codeLabel).toBeVisible()
    await expect(detail.locator("svg")).toHaveCount(1)
    const mark = detail.locator(
      `[data-foundation-mark="pure"] [data-archetype-mark="${archetype.code}"]`,
    )
    await expect(mark).toHaveCount(1)
    await expect(mark).toHaveAttribute("data-archetype-mark-render", "pictorial")
    await expect(mark).toHaveAttribute("data-archetype-mark-size", "112")
    await expect(mark).toHaveAttribute("aria-hidden", "true")
    await expect(detail.locator("[data-archetype-sigil-frame]")).toHaveCount(0)
    await expect(
      page.getByRole("heading", { name: "About the mark", exact: true }),
    ).toBeVisible()
    await expect(
      page.getByText(
        "This contemporary mark is editorial artwork created for the inventory. It is not an authentic historical emblem, a cultural classification, or an endorsement. The visible code and name carry the meaning.",
        { exact: true },
      ),
    ).toBeVisible()
    await expect(
      page.getByText(
        "Supporting evidence for the Foundation result, not another Foundation result.",
        { exact: true },
      ),
    ).toBeVisible()
    const researchStatus = detail.locator(
      "details[data-archetype-research-status]",
    )
    await expect(researchStatus).toHaveCount(1)
    await expect(
      researchStatus.locator("summary"),
    ).toHaveText("Research and publication status")
    await researchStatus.locator("summary").click()
    await expect(researchStatus).toContainText(
      "Owner-authorized AI-assisted English beta copy",
    )
    await expect(researchStatus).toContainText("pending human editorial review")
    await expect(researchStatus).toContainText(
      "No external expert review or validation has been completed.",
    )
    await expect(researchStatus).toContainText(
      "Historical evidence remains a provisional legacy comparison.",
    )
    await expect(researchStatus).toContainText("empty sections are omitted")
    await expect(researchStatus.locator("dl, dt, dd")).toHaveCount(0)
    await expect(detail.getByRole("status")).toHaveCount(0)
    await expect(detail.locator("footer dl")).toHaveCount(0)
    await expect(
      page.getByRole("heading", { name: "What this reading notices first" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Why this comparison fits" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Where the comparison breaks" }),
    ).toBeVisible()
    await expect(
      detail.locator('#historical-comparison [role="note"]'),
    ).toBeVisible()
    for (const omittedHeading of [
      "Nearest neighbors",
      "Common blends",
      "Domain expressions",
      "Related Current Cases",
      "Related Decision Patterns",
    ]) {
      await expect(
        page.getByRole("heading", { name: omittedHeading, exact: true }),
      ).toHaveCount(0)
    }
    await expect(page.getByText("Interpretation under review")).toHaveCount(0)
  }
})

test("archetype return paths accept only opaque local Foundation result links", async ({
  page,
}) => {
  await page.goto("/archetypes/p-plus?from=%2Fresults%2Fabc_DEF-123")
  await expect(
    page.getByRole("link", { name: "← Back to your result" }),
  ).toHaveAttribute("href", "/results/abc_DEF-123")

  await page.goto(
    "/archetypes/p-plus?from=https%3A%2F%2Fevil.example%2Fresults%2Ftoken",
  )
  await expect(page.getByRole("link", { name: "← Take the Foundation" })).toHaveAttribute(
    "href",
    "/quiz",
  )
  await expect(page.locator('a[href*="evil.example"]')).toHaveCount(0)
})

test("tradition pages remain supporting evidence and publish no thinker assignment cards", async ({
  page,
}) => {
  for (const familyKey of MODELED_FAMILY_KEYS) {
    await page.goto(`/explore/${familySlug(familyKey)}`)
    await expect(
      page.getByRole("heading", { name: "Supporting tradition, not a Foundation result" }),
    ).toBeVisible()
    await expect(page.locator("[data-tradition-archetype]")).toHaveCount(2)
    await expect(
      page.locator("[data-tradition-boundary] [data-archetype-code-label]"),
    ).toHaveCount(2)
    await expect(page.locator("[data-tradition-boundary] svg")).toHaveCount(0)
    await expect(page.getByRole("heading", { name: "Associated thinkers" })).toHaveCount(0)
    await expect(page.locator(".thinker-entry")).toHaveCount(0)
    await expect(
      page.getByRole("link", { name: "Browse the reference directory →" }),
    ).toHaveAttribute("href", "/explore/reference")
  }
})

test("unapproved Chinese archetype and Explore routes remain explicit status surfaces", async ({
  page,
}) => {
  for (const path of ["/zh/archetypes", "/zh/archetypes/p-plus", "/zh/explore"]) {
    await page.goto(path)
    await expect(page.getByRole("status")).toBeVisible()
    await expect(page.locator("[data-archetype-directory], [data-archetype-detail]"))
      .toHaveCount(0)
    await expect(page.locator("[data-explore-section]"))
      .toHaveCount(0)
    await expect(page.locator("[data-archetype-code-label]")).toHaveCount(0)
    await expect(page.locator("[data-archetype-mark]")).toHaveCount(0)
  }
})

test("Worldview Map bare and legacy routes select the correct projection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1000 })
  await page.goto("/explore/atlas")

  const matrix = page.locator("[data-archetype-matrix]")
  await expect(matrix).toBeVisible()
  await expect(matrix.locator("[data-archetype-matrix-cell]")).toHaveCount(8)
  await expect(matrix.locator('[data-archetype-mark-render="pictorial"]')).toHaveCount(8)
  await expect(matrix.locator('[data-archetype-matrix-active="true"]')).toHaveCount(0)
  await expect(
    page.getByRole("heading", { name: "Contextual positions", exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText(
      "No baseline or contextual overlays are active. The eight Foundation archetypes remain available in the matrix above.",
      { exact: true },
    ),
  ).toBeVisible()
  await expect(page.getByText("Nothing to show yet", { exact: true })).toHaveCount(0)

  for (const archetype of archetypes) {
    const cell = matrix.locator(
      `[data-archetype-matrix-cell="${archetype.code}"]`,
    )
    await expect(cell.getByText(archetype.name, { exact: true })).toBeVisible()
    await expect(
      cell.getByText(formatArchetypeDisplayCode(archetype.code), { exact: true }),
    ).toBeVisible()
  }

  await expect(page.getByRole("button", { name: "Matrix" })).toHaveAttribute(
    "aria-pressed",
    "true",
  )
  for (const overlay of [
    "Decision Patterns",
    "My perspective shifts",
    "Thinkers & public positions",
  ]) {
    await expect(page.getByRole("button", { name: new RegExp(`^${overlay}`) }))
      .toHaveAttribute("aria-pressed", "false")
  }
  await expect.poll(() => new URL(page.url()).search).toBe("")

  const blendPayload =
    "eyJ2Ijo1LCJkcyI6WzEsMSw0LDQsNCw0LDRdLCJmayI6ImNyaXRpY2FsUG9saXRpY2FsRWNvbm9teSIsIm5rIjoiY29uc3RydWN0aXZpc3QiLCJzbSI6IkhlZGdlciIsIm5tIjoiQ29uZGl0aW9uYWwgU29saWRhcmlzdCIsIml2Ijo0LCJidiI6Miwic3YiOjIsImN2IjoxLCJjbCI6ImVuIiwicXMiOiJjb3JlIn0"
  await page.evaluate(
    ({ key, fixture, payload }) => {
      const profile = structuredClone(fixture)
      if (profile.foundation) profile.foundation.payload = payload
      window.localStorage.setItem(key, JSON.stringify(profile))
    },
    { key: PROFILE_STORAGE_KEY, fixture: profileStoreV5, payload: blendPayload },
  )
  await page.reload()

  await expect(matrix.locator('[data-archetype-matrix-active="true"]')).toHaveCount(2)
  await expect(matrix.locator('[data-archetype-matrix-cell="M+"]'))
    .toHaveAttribute("data-archetype-matrix-active", "true")
  await expect(matrix.locator('[data-archetype-matrix-cell="S+"]'))
    .toHaveAttribute("data-archetype-matrix-active", "true")
  const connector = matrix.locator("[data-archetype-matrix-connector]")
  await expect(connector).toBeVisible()
  const diptych = matrix.locator(
    '[data-foundation-mark="blend"][data-foundation-mark-layout="diptych"]',
  )
  await expect(diptych).toBeVisible()
  await expect(diptych.locator("[data-foundation-mark-primary]")).toHaveAttribute(
    "data-foundation-mark-primary",
    "M+",
  )
  await expect(diptych.locator("[data-foundation-mark-runner-up]")).toHaveAttribute(
    "data-foundation-mark-runner-up",
    "S+",
  )
  await expect(diptych.locator("[data-foundation-mark-name]")).toHaveText([
    "Satyagraha",
    "Dirigisme",
  ])
  await expect(matrix.locator('[data-archetype-mark="M/S+"]')).toHaveCount(0)
  await expect(matrix.locator("[data-matrix-normative-alias]")).toHaveText(
    "Conditional",
  )

  const connectorBox = await connector.boundingBox()
  if (!connectorBox) throw new Error("Expected a rendered matrix connector.")
  for (const badge of await matrix.getByText("Shared result", { exact: true }).all()) {
    const badgeBox = await badge.boundingBox()
    if (!badgeBox) throw new Error("Expected a rendered matrix result badge.")
    const overlaps = !(
      connectorBox.x + connectorBox.width <= badgeBox.x ||
      badgeBox.x + badgeBox.width <= connectorBox.x ||
      connectorBox.y + connectorBox.height <= badgeBox.y ||
      badgeBox.y + badgeBox.height <= connectorBox.y
    )
    expect(overlaps).toBe(false)
  }

  const identityBox = await matrix.locator("[data-matrix-baseline-identity]").boundingBox()
  const normativeBox = await matrix
    .locator("dl:has([data-matrix-normative-alias])")
    .boundingBox()
  if (!identityBox || !normativeBox) {
    throw new Error("Expected the baseline identity and normative state.")
  }
  expect(normativeBox.x - (identityBox.x + identityBox.width)).toBeLessThan(48)

  await page.emulateMedia({ media: "print" })
  await expect(connector).not.toBeVisible()
  await page.emulateMedia({ media: "screen" })
  await expect(
    page.locator('#worldview-map-list [id^="field-item-my-profile"]'),
  ).toHaveCount(1)
  const baselineListButton = page
    .locator('#worldview-map-list [id^="field-item-my-profile"]')
    .getByRole("button")
  await baselineListButton.click()
  await page.getByRole("button", { name: "Close details" }).click()
  await expect(baselineListButton).toBeFocused()

  await page.getByRole("button", { name: "Continuous" }).click()
  await expect(
    page.getByText(
      "Secondary view. This projection does not encode applying advantage or restraint.",
      { exact: true },
    ),
  ).toBeVisible()
  await expect(matrix).not.toBeVisible()
  await expect(page).toHaveURL(/projection=continuous/)

  await page.goto("/explore/atlas?layers=atlas-patterns")
  await expect(page.getByRole("button", { name: "Continuous" })).toHaveAttribute(
    "aria-pressed",
    "true",
  )
  await expect(page.getByRole("button", { name: /^Decision Patterns/ }))
    .toHaveAttribute("aria-pressed", "true")
  await expect(matrix).not.toBeVisible()

  const filters = page.locator("[data-worldview-map-filters]")
  await filters.locator("summary").click()
  const filterBox = await filters.boundingBox()
  if (!filterBox) throw new Error("Expected the open filter disclosure.")
  expect(filterBox.width).toBeGreaterThan(600)
  for (const label of [
    "Realism",
    "Institutionalism",
    "Constructivism",
    "Critical political economy",
  ]) {
    await expect(filters.getByRole("button", { name: label, exact: true })).toBeVisible()
  }
  for (const label of [
    "Strategic Realist",
    "Liberal Institutionalist",
    "Social Constructivist",
    "Critical Political Economist",
  ]) {
    await expect(filters.getByRole("button", { name: label, exact: true })).toHaveCount(0)
  }

  const collision = page
    .getByRole("button", { name: /overlapping items/i })
    .first()
  await expect(collision).toHaveAttribute("aria-expanded", "false")
  await expect(collision).toHaveAttribute("aria-label", / · /)
  await collision.focus()
  await collision.press("Space")
  await expect(collision).toHaveAttribute("aria-expanded", "true")
  await collision.press("Escape")
  await expect(collision).toHaveAttribute("aria-expanded", "false")

  const decisionPatterns = page.getByRole("button", {
    name: /^Decision Patterns/,
  })
  await decisionPatterns.click()
  await expect(decisionPatterns).toHaveAttribute("aria-pressed", "false")
  await expect.poll(() => new URL(page.url()).searchParams.has("layers")).toBe(
    false,
  )
  await page.reload()
  await expect(decisionPatterns).toHaveAttribute("aria-pressed", "false")

  await page.setViewportSize({ width: 800, height: 900 })
  await page.goto("/explore/atlas?view=list")
  await expect(matrix).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Contextual positions", exact: true }),
  ).toBeVisible()
  await expect.poll(() => new URL(page.url()).search).toBe(
    "?projection=matrix&view=list",
  )
})

test("mobile matrix stays inline while the continuous map keeps its focused modal flow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/explore/atlas")

  const explorer = page.locator('[data-matrix-available="true"]')
  const matrix = page.locator("[data-archetype-matrix]")
  await expect(matrix).toBeVisible()
  await expect(matrix.locator("[data-archetype-matrix-cell]")).toHaveCount(8)
  await expect(
    page.getByRole("heading", { name: "Contextual positions", exact: true }),
  ).toBeVisible()
  await expect(explorer).not.toHaveAttribute("role", "dialog")
  await expect(page.getByRole("button", { name: /Back to list/ })).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  )

  await page.getByRole("button", { name: "Continuous", exact: true }).click()
  const back = page.getByRole("button", { name: /Back to list/ })
  await expect(explorer).toHaveAttribute("role", "dialog")
  await expect(back).toBeFocused()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  )

  await back.click()
  const listHeading = page.getByRole("heading", {
    name: "Complete list",
    exact: true,
  })
  await expect(listHeading).toBeFocused()
  const siteHeaderBox = await page.locator(".site-header").boundingBox()
  const listHeadingBox = await listHeading.boundingBox()
  if (!siteHeaderBox || !listHeadingBox) {
    throw new Error("Expected the sticky header and focused list heading.")
  }
  expect(listHeadingBox.y).toBeGreaterThanOrEqual(
    siteHeaderBox.y + siteHeaderBox.height - 1,
  )
  await expect.poll(() => new URL(page.url()).search).toBe(
    "?projection=continuous",
  )

  await page.getByRole("button", { name: "Matrix", exact: true }).click()
  await expect(matrix).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Contextual positions", exact: true }),
  ).toBeVisible()
  await expect(explorer).not.toHaveAttribute("role", "dialog")
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  )
})

test("print forces the English matrix without removing the Chinese map", async ({
  page,
}) => {
  await page.goto("/explore/atlas?projection=continuous")
  await page.emulateMedia({ media: "print" })
  await expect(page.locator("[data-archetype-matrix]")).toBeVisible()
  await expect(page.locator("figure.field-canvas")).not.toBeVisible()

  await page.goto("/zh/explore/atlas")
  await expect(page.locator("[data-archetype-matrix]")).toHaveCount(0)
  await expect(page.locator("figure.field-canvas")).toBeVisible()
})

test("Worldview Map switches between list and map views", async ({ page }) => {
  // Desktop shows the map and semantic list together. The explicit view switch
  // is the small-screen affordance, so exercise it below that breakpoint.
  await page.setViewportSize({ width: 800, height: 900 })
  await page.goto("/explore/atlas")
  await expect(page.getByRole("heading", { name: "Worldview Map", exact: true })).toBeVisible()
  await page.getByRole("button", { name: "Continuous", exact: true }).click()

  const listButton = page.getByRole("button", { name: "List", exact: true })
  const mapButton = page.getByRole("button", { name: "Map", exact: true })

  await listButton.click()
  await expect(listButton).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByRole("heading", { name: "Complete list" })).toBeVisible()
  await expect.poll(() => new URL(page.url()).search).toBe(
    "?projection=continuous",
  )

  await mapButton.click()
  await expect(mapButton).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByRole("region", { name: "Worldview Map" })).toBeVisible()

  await page.goto("/explore/atlas/institution-builder")
  await expect(page).toHaveURL(/\/explore\/atlas\/institution-builder$/)
  await expect(page.getByText("Decision Pattern", { exact: true })).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Rules and Cooperation", exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText(/not calculated from, matched to, or assigned to a user’s answers/),
  ).toBeVisible()
})

test("invalid Foundation result shows a plain recovery path", async ({ page }) => {
  await page.goto("/results/not-a-valid-payload")

  await expect(page.getByText("Invalid result", { exact: true })).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "This link could not be decoded." }),
  ).toBeVisible()
  await expect(page.getByRole("link", { name: "Take the Foundation" })).toBeVisible()
})

test("coarse measurement uses the allowlist and honors local opt-out", async ({ page }) => {
  const record = getPublishedCurrentCases()[0] ?? null
  expect(record).not.toBeNull()
  if (!record) return
  const events: Array<{
    name: string
    properties: Record<string, unknown>
    referer?: string
  }> = []

  await page.route("**/api/analytics/event", async (route) => {
    const request = route.request()
    const body = request.postDataJSON() as {
      name: string
      properties: Record<string, unknown>
    }
    events.push({
      ...body,
      referer: request.headers().referer,
    })
    await route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    })
  })

  await page.goto(`/cases/${record.slug}`)
  await expect
    .poll(() => events.some((event) => event.name === "current_case_viewed"))
    .toBe(true)

  const viewed = events.find((event) => event.name === "current_case_viewed")
  expect(viewed).toBeDefined()
  expect(Object.keys(viewed?.properties ?? {}).sort()).toEqual([
    "caseId",
    "deviceClass",
    "referrerCategory",
    "returningAgeBucket",
    "routeCategory",
  ])
  expect(viewed?.referer).toBeUndefined()
  await expect(page.locator('script[src*="insights"]')).toHaveCount(0)

  await page.goto("/privacy")
  await page.getByRole("button", { name: "Opt out on this browser" }).click()
  await expect(page.getByText(/Coarse product measurement is off/)).toBeVisible()
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.localStorage.getItem("ir-worldview-analytics-opt-out-v1"),
      ),
    )
    .toBe("true")

  events.length = 0
  await page.goto(`/cases/${record.slug}`)
  await expect(page.getByRole("heading", { name: "Read the case briefing" })).toBeVisible()
  expect(
    await page.evaluate(() =>
      window.localStorage.getItem("ir-worldview-analytics-opt-out-v1"),
    ),
  ).toBe("true")
  await page.waitForTimeout(250)
  expect(events).toEqual([])
})

test("privacy control deletes app history while preserving analytics opt-out", async ({ page }) => {
  await page.goto("/privacy")
  await page.evaluate(
    ({ localKeys, sessionKeys, optOutKey }) => {
      for (const key of localKeys) window.localStorage.setItem(key, "sensitive-local-state")
      for (const key of sessionKeys) window.sessionStorage.setItem(key, "sensitive-session-state")
      window.localStorage.setItem(optOutKey, "true")
    },
    {
      localKeys: LOCAL_HISTORY_STORAGE_KEYS,
      sessionKeys: SESSION_HISTORY_STORAGE_KEYS,
      optOutKey: ANALYTICS_OPT_OUT_STORAGE_KEY,
    },
  )

  await page.getByRole("button", { name: "Delete local history" }).click()
  await expect(page.getByRole("button", { name: "Delete local history now" })).toBeVisible()
  await page.getByRole("button", { name: "Delete local history now" }).click()
  await expect(page.getByText("Local results and drafts were deleted.")).toBeVisible()

  const stored = await page.evaluate(
    ({ localKeys, sessionKeys, optOutKey }) => ({
      localValues: localKeys.map((key) => window.localStorage.getItem(key)),
      sessionValues: sessionKeys.map((key) => window.sessionStorage.getItem(key)),
      optOut: window.localStorage.getItem(optOutKey),
    }),
    {
      localKeys: LOCAL_HISTORY_STORAGE_KEYS,
      sessionKeys: SESSION_HISTORY_STORAGE_KEYS,
      optOutKey: ANALYTICS_OPT_OUT_STORAGE_KEY,
    },
  )

  expect(stored.localValues.every((value) => value === null)).toBe(true)
  expect(stored.sessionValues.every((value) => value === null)).toBe(true)
  expect(stored.optOut).toBe("true")
})

test.describe("390px viewport", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("World Stage and Foundation remain within the viewport", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
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

    await page.locator("#world-stage-map-view").selectOption("focus-areas")
    const layerFilters = page.getByTestId("world-stage-layer-filters")
    await layerFilters.locator("summary").click()
    await page.getByRole("combobox", { name: "Node type" }).selectOption("materials")
    await page.getByRole("combobox", { name: "Relation" }).selectOption("supply")
    await expect(page.getByRole("combobox", { name: "Node type" })).toHaveValue("materials")
    await expect(page.getByRole("combobox", { name: "Relation" })).toHaveValue("supply")
    await expect(layerFilters).toContainText("Materials")
    await expect(layerFilters).toContainText("Supply")
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true)

    const sourcedMaterialNode = page.locator(
      '[data-node-id="focus-areas--n_jp_jsr_yokkaichi"]',
    )
    await expect(sourcedMaterialNode).toBeVisible()
    await sourcedMaterialNode.click()
    const sourceDialog = page.getByRole("dialog", { name: "JSR Yokkaichi" })
    await expect(sourceDialog).toBeVisible()
    await expect(
      sourceDialog.getByRole("link", {
        name: "Leading-edge photoresist development and Yokkaichi site materials",
      }),
    ).toBeVisible()
    await sourceDialog.getByRole("button", { name: "Close source details" }).click()
    await layerFilters.locator("summary").click()

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
    const record = getPublishedCurrentCases()[0] ?? null
    expect(record).not.toBeNull()
    if (!record) return

    await page.goto(`/cases/${record.slug}`)

    await expect(page.getByRole("heading", { name: "Read the case briefing" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Read the claim and source ledger" })).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true)
  })
})
