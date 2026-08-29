import { expect, test, type Page } from "@playwright/test"
import { resolveArchetype } from "../lib/archetypes"
import { getFoundationQuestions } from "../lib/quiz-schema"
import {
  buildCanonicalFoundationResult,
  computeCoreDimensionScores,
  getV2ScoringCalibration,
} from "../lib/scoring"
import { QUIZ_STORAGE_KEY } from "../lib/storage-keys"
import { ROOT_DESTINATIONS } from "../lib/v23-6/root-menu"
import {
  RESULT_SCROLL_ROUTE,
  ROOT_ARMILLARY_ATLAS_ROUTE,
  ROOT_ATLAS_GLOBE_ROUTE,
  TYPE_PLATE_ROUTE,
} from "../lib/v23-6/routes"
import type { Answers, DimensionKey } from "../lib/types"

const ROOT_ROUTES = [ROOT_ATLAS_GLOBE_ROUTE, ROOT_ARMILLARY_ATLAS_ROUTE]
const ALL_ROUTES = [...ROOT_ROUTES, TYPE_PLATE_ROUTE, RESULT_SCROLL_ROUTE]
const DESTINATION_LABELS = ROOT_DESTINATIONS.map((destination) => destination.label)

/**
 * A Foundation draft whose answers genuinely recompute to the reading the
 * result prototype displays. Nothing here is a fixture of the result; the
 * scorer in this repository decides what the answers mean.
 */
function buildMatchingDraftAnswers(): Answers {
  const targets: Record<DimensionKey, number> = {
    securityCompetition: 4,
    institutions: 6,
    domesticFilters: 5,
    normsIdentity: 5,
    politicalEconomy: 5,
    restraint: 6,
    orderJustice: 6,
  }
  const answers: Answers = {}

  for (const question of getFoundationQuestions("standard")) {
    if (question.kind === "likert") {
      if ("dimension" in question) {
        const target = targets[question.dimension]
        answers[question.id] = question.reverse ? 8 - target : target
      } else {
        answers[question.id] = 4
      }
      continue
    }
    const strongest = question.options.reduce((best, option) =>
      (option.signals.institutions ?? 0) > (best.signals.institutions ?? 0)
        ? option
        : best,
    )
    answers[question.id] = strongest.id
  }

  return answers
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
}

test.describe("study root prototypes", () => {
  for (const route of ROOT_ROUTES) {
    test(`${route} presents one menu in a stable document order`, async ({ page }) => {
      await page.goto(route)

      const root = page.locator("[data-root-variant]")
      await expect(root).toHaveAttribute("data-selected-destination", "inventory")

      const links = page.locator("nav[aria-label='Destinations'] a")
      await expect(links).toHaveCount(DESTINATION_LABELS.length)
      await expect(links).toHaveText(DESTINATION_LABELS)

      // The choices precede the visual in the accessibility tree.
      const order = await page.evaluate(() => {
        const main = document.querySelector("main")
        return Array.from(main?.children ?? []).map((child) => child.tagName)
      })
      expect(order).toEqual(["HEADER", "DIV", "DIV", "FOOTER"])

      const headingBeforeNav = await page.evaluate(() => {
        const heading = document.querySelector("h1")
        const nav = document.querySelector("nav[aria-label='Destinations']")
        if (!heading || !nav) return false
        return Boolean(
          heading.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING,
        )
      })
      expect(headingBeforeNav).toBe(true)

      await expectNoHorizontalOverflow(page)
    })

    test(`${route} selects a destination from the keyboard`, async ({ page }) => {
      await page.goto(route)
      const root = page.locator("[data-root-variant]")

      for (const destination of ROOT_DESTINATIONS) {
        await page.getByRole("link", { name: destination.label, exact: true }).focus()
        await expect(root).toHaveAttribute(
          "data-selected-destination",
          destination.id,
        )
        await expect(page.locator("section[aria-live]")).toContainText(
          destination.explanation.slice(0, 48),
        )
      }
    })

    test(`${route} keeps the menu still when a saved result appears`, async ({ page }) => {
      await page.goto(`${route}?visitor=new`)
      const dominant = page.getByRole("link", { name: "Inventory", exact: true })
      const before = await dominant.boundingBox()

      await page.goto(`${route}?visitor=returning`)
      await expect(page.locator("[data-root-variant]")).toHaveAttribute(
        "data-visitor",
        "returning",
      )
      const after = await dominant.boundingBox()

      expect(before).not.toBeNull()
      expect(after).not.toBeNull()
      expect(Math.abs((after?.y ?? 0) - (before?.y ?? 0))).toBeLessThanOrEqual(1)
    })

    for (const width of [390, 768, 1440]) {
      test(`${route} fits ${width} without horizontal overflow`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(route)
        await expectNoHorizontalOverflow(page)
      })
    }
  }

  test("the armillary root holds still under a reduced-motion preference", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" })
    const page = await context.newPage()
    await page.goto(ROOT_ARMILLARY_ATLAS_ROUTE)

    await expect(page.locator("[data-root-variant]")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    )
    const animation = await page
      .locator("[data-motion]")
      .first()
      .evaluate((node) => getComputedStyle(node).animationName)
    expect(animation).toBe("none")

    // The still state keeps the whole instrument.
    await expect(page.locator("figure[data-armillary-ring] path")).not.toHaveCount(0)
    await context.close()
  })

  test("the globe root shows Mapbox attribution only while Mapbox is drawing", async ({
    page,
  }) => {
    await page.goto(ROOT_ATLAS_GLOBE_ROUTE)
    const frame = page.locator("figure[data-map-ready]")
    const ready = await frame.getAttribute("data-map-ready")
    const attribution = page.getByRole("link", { name: "OpenStreetMap" })

    if (ready === "true") {
      await expect(attribution).toBeVisible()
    } else {
      await expect(attribution).toHaveCount(0)
      // The drawn base keeps land geography visible without a token.
      await expect(page.locator("figure[data-map-ready] svg path")).not.toHaveCount(0)
    }

    // No root controls, no layer panel, no inspection inside the visual.
    const visual = page.locator("figure[data-map-ready]")
    await expect(visual.locator("select")).toHaveCount(0)
    await expect(visual.locator("details")).toHaveCount(0)
    await expect(visual.locator("button")).toHaveCount(0)
    await expect(page.locator("[data-root-variant] [role='tooltip']")).toHaveCount(0)
  })
})

test.describe("study result prototype", () => {
  test("reads as one argument in document order", async ({ page }) => {
    await page.goto(RESULT_SCROLL_ROUTE)

    const sections = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[data-scroll-section]")).map(
        (node) => (node as HTMLElement).dataset.scrollSection,
      ),
    )
    expect(sections).toEqual([
      "payoff",
      "why",
      "carried",
      "choices",
      "domains",
      "limits",
    ])

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Concert")
    await expect(page.locator("[data-archetype-matrix]")).toHaveCount(1)
    await expect(
      page.locator('[data-archetype-matrix-cell="R-"][data-archetype-matrix-active]'),
    ).toHaveCount(1)
    await expect(page.getByRole("link", { name: "Open the full result" })).toBeVisible()
  })

  test("puts the payoff in the first viewport at 1440", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(RESULT_SCROLL_ROUTE)

    for (const locator of [
      page.locator("[data-foundation-mark], .archetype-mark").first(),
      page.getByRole("heading", { level: 1 }),
      page.locator("[data-archetype-matrix]"),
      page.getByRole("link", { name: "Open the full result" }),
    ]) {
      const box = await locator.boundingBox()
      expect(box).not.toBeNull()
      expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(900)
    }
  })

  test("reports the answer trace as unavailable until this browser holds one", async ({
    page,
  }) => {
    await page.goto(RESULT_SCROLL_ROUTE)
    const choices = page.locator('[data-scroll-section="choices"]')
    await expect(choices).toHaveAttribute("data-trace-status", "no-draft")
    await expect(choices).toContainText("carries no record of which option was taken")

    const answers = buildMatchingDraftAnswers()
    const scores = computeCoreDimensionScores(answers, "standard")
    const result = buildCanonicalFoundationResult(scores)
    const { lowDifferentiationThreshold } = getV2ScoringCalibration("extended")
    const archetype = resolveArchetype(result, lowDifferentiationThreshold)
    expect(archetype.code).toBe("R-")

    await page.evaluate(
      ([key, session]) => window.localStorage.setItem(key, session),
      [
        QUIZ_STORAGE_KEY,
        JSON.stringify({
          v: 7,
          orderSeed: "study",
          questionSet: "core",
          activeMode: "standard",
          contextAssist: false,
          answers,
          itemLatencyBuckets: {},
        }),
      ] as const,
    )
    await page.reload()

    await expect(choices).toHaveAttribute("data-trace-status", "available")
    await expect(choices.locator("li")).not.toHaveCount(0)
    await expect(choices.locator("[data-role='selected']")).not.toHaveCount(0)
    await expect(choices.locator("[data-role='rival']")).not.toHaveCount(0)
    await expect(choices).toContainText("The two options disagree most on")
  })

  test("keeps the four domain records separate and unscored together", async ({
    page,
  }) => {
    await page.goto(RESULT_SCROLL_ROUTE)
    const domains = page.locator('[data-scroll-section="domains"]')

    await expect(domains.locator("[data-domain]")).toHaveCount(4)
    await expect(domains.locator("[data-domain]")).toHaveText([
      /Foundation/,
      /Security/,
      /Technology/,
      /AI Governance/,
    ])
    await expect(domains).toContainText("No combined score is published")
  })

  test("prints as a compact report", async ({ page }) => {
    await page.goto(RESULT_SCROLL_ROUTE)
    await page.emulateMedia({ media: "print" })

    const stickyPosition = await page
      .locator('[data-scroll-section="why"] > div')
      .first()
      .evaluate((node) => getComputedStyle(node).position)
    expect(stickyPosition).toBe("static")

    const actionDisplay = await page
      .locator('a[href^="/results/"]')
      .first()
      .evaluate((node) => getComputedStyle(node).display)
    expect(actionDisplay).toBe("none")
  })

  test("shows the full page under a reduced-motion preference", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" })
    const page = await context.newPage()
    await page.goto(RESULT_SCROLL_ROUTE)

    const hidden = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[data-scroll-section]")).filter(
        (node) => getComputedStyle(node).opacity !== "1",
      ).length,
    )
    expect(hidden).toBe(0)
    await context.close()
  })

  for (const width of [390, 768]) {
    test(`stacks without a pinned column at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(RESULT_SCROLL_ROUTE)

      const position = await page
        .locator('[data-scroll-section="why"] > div')
        .first()
        .evaluate((node) => getComputedStyle(node).position)
      expect(position).toBe("static")
      await expectNoHorizontalOverflow(page)
    })
  }
})

test.describe("study typography plate", () => {
  test("renders one composition in three treatments at both widths", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(TYPE_PLATE_ROUTE)

    await expect(page.locator("[data-treatment]")).toHaveCount(3)
    await expect(page.locator("[data-board]")).toHaveCount(6)
    for (const treatment of ["a", "b", "c"]) {
      await expect(
        page.locator(`[data-treatment='${treatment}'] [data-type-treatment='${treatment}']`),
      ).toHaveCount(2)
    }
    await expectNoHorizontalOverflow(page)
  })

  test("opens a single treatment full screen", async ({ page }) => {
    await page.goto(`${TYPE_PLATE_ROUTE}?treatment=b`)
    await expect(page.locator("[data-root-variant]")).toHaveAttribute(
      "data-type-treatment",
      "b",
    )
  })
})

test("every study route stays out of search results", async ({ page }) => {
  for (const route of ALL_ROUTES) {
    const response = await page.goto(route)
    expect(response?.status()).toBe(200)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    )
  }
})
