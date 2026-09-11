import { expect, test, type Page } from "@playwright/test"
import { PROFILE_STORAGE_KEY, QUIZ_STORAGE_KEY } from "../lib/storage-keys"
import { foundationCoreQuestions, questionCountsBySet } from "../lib/quiz-schema"

const ROUTE = "/dev/product-refoundation"
const AREA_IDS = ["start", "cases", "field-guide", "my-record"] as const

// Playwright serves a production build under CI and a development server
// locally. The route is expected to disappear in the production build.
const productionServer = Boolean(process.env.CI)

function watchForFailures(page: Page) {
  const consoleErrors: string[] = []
  const requests: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text())
  })
  page.on("pageerror", (error) => consoleErrors.push(String(error)))
  page.on("request", (request) => requests.push(request.url()))
  return { consoleErrors, requests }
}

test("the prototype route follows the environment it is served from", async ({ page }) => {
  const response = await page.goto(ROUTE)
  expect(response?.status()).toBe(productionServer ? 404 : 200)
})

test.describe(() => {
  test.skip(productionServer, "The prototype route is absent from a production build.")

  test("the prototype loads with no Mapbox request, no canvas, and no console error", async ({ page }) => {
    const { consoleErrors, requests } = watchForFailures(page)

    await page.goto(ROUTE)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "How do you explain world politics?",
    )
    for (const id of AREA_IDS) {
      await page.locator(`[data-prototype-area="${id}"]`).click()
    }
    await page.getByRole("button", { name: "See how the project works" }).click()
    await page.waitForTimeout(400)

    expect(
      requests.filter((url) =>
        /(?:api|events|tiles)\.mapbox\.com|mapbox-gl|mapbox-runtime/iu.test(url),
      ),
    ).toEqual([])
    await expect(page.locator("canvas")).toHaveCount(0)
    expect(consoleErrors).toEqual([])
  })

  test("the four public labels appear in the index, the navigation, and the expanded state", async ({ page }) => {
    await page.goto(ROUTE)
    const labels = ["Start", "Cases", "Field Guide", "My Record"]

    await expect(page.locator("[data-prototype-area]")).toHaveText(labels)
    await expect(page.locator("[data-prototype-nav]")).toHaveText(labels)

    await page.getByRole("button", { name: "See how the project works" }).click()
    const works = page.locator("#prototype-works")
    await expect(works).toBeVisible()
    for (const label of labels) {
      await expect(works).toContainText(label)
    }
  })

  test("keyboard reaches every area and the entry link inside every panel", async ({ page }) => {
    await page.goto(ROUTE)
    // Document coordinates: focusing a low row scrolls the viewport, which is
    // not a layout change.
    const indexBox = () => page.evaluate(() => {
      const box = document.querySelector('[role="tablist"]')?.getBoundingClientRect()
      return box
        ? {
            top: Math.round(box.top + window.scrollY),
            left: Math.round(box.left + window.scrollX),
            width: Math.round(box.width),
            height: Math.round(box.height),
          }
        : null
    })
    const indexBefore = await indexBox()
    await page.locator('[data-prototype-area="start"]').focus()

    const reached: string[] = []
    for (let step = 0; step < AREA_IDS.length; step += 1) {
      const area = await page.evaluate(
        () => document.activeElement?.getAttribute("data-prototype-area") ?? null,
      )
      expect(area).not.toBeNull()
      reached.push(area as string)

      await expect(page.locator("#prototype-panel")).toHaveAttribute(
        "data-prototype-panel",
        area as string,
      )

      // One Tab from the tablist must land inside the open panel.
      await page.keyboard.press("Tab")
      const inPanel = await page.evaluate(() =>
        Boolean(document.activeElement?.closest("#prototype-panel")),
      )
      expect(inPanel, `panel entry unreachable for ${area}`).toBe(true)

      await page.keyboard.press("Shift+Tab")
      await page.keyboard.press("ArrowDown")
    }

    expect(reached).toEqual([...AREA_IDS])
    expect(await indexBox()).toEqual(indexBefore)
  })

  test("the persistent navigation reaches each area with an ordinary link", async ({ page }) => {
    await page.goto(ROUTE)
    for (const id of AREA_IDS) {
      const link = page.locator(`[data-prototype-nav="${id}"]`)
      await expect(link).toHaveAttribute("href", /^\/[a-z]/u)
    }
    await Promise.all([
      page.waitForURL(/\/profile$/u),
      page.locator('[data-prototype-nav="my-record"]').click(),
    ])
  })

  test("reduced motion leaves a complete still prototype", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto(ROUTE)

    await expect(page.locator("[data-prototype-area]")).toHaveCount(AREA_IDS.length)
    const motion = await page.locator('[data-prototype-area="start"]').evaluate((element) => ({
      animation: getComputedStyle(element).animationName,
      transition: getComputedStyle(element).transitionDuration,
    }))
    expect(motion.animation).toBe("none")
    expect(motion.transition).toBe("0s")

    await page.locator('[data-prototype-area="cases"]').click()
    await expect(page.locator("#prototype-panel")).toHaveAttribute(
      "data-prototype-panel",
      "cases",
    )
  })

  for (const width of [320, 390, 768, 1440] as const) {
    test(`the prototype fits ${width}px without horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 })
      await page.goto(ROUTE)

      for (const id of AREA_IDS) {
        await page.locator(`[data-prototype-area="${id}"]`).click()
        const sizes = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }))
        expect(sizes.scrollWidth, `overflow on ${id}`).toBeLessThanOrEqual(sizes.clientWidth)
      }
    })
  }

  test("the first-time state reserves the continuation line and shows no saved work", async ({ page }) => {
    await page.goto(ROUTE)

    await expect(page.locator("[data-prototype-continuation]")).toHaveAttribute(
      "data-prototype-continuation",
      "absent",
    )
    await page.locator('[data-prototype-area="my-record"]').click()
    await expect(page.locator("#prototype-panel")).toContainText(
      "Nothing saved on this device yet.",
    )
  })

  test("returning state fills the continuation line without moving the four-area index", async ({ page }) => {
    await page.goto(ROUTE)
    const index = page.getByRole("tablist", { name: "Areas" })
    const indexBefore = await index.boundingBox()

    await page.evaluate(
      ({ profileKey, quizKey, answers }) => {
        window.localStorage.setItem(profileKey, JSON.stringify({
          v: 5,
          foundation: { familyLabel: "Liberal Institutionalist" },
          modules: { security: { resultPath: "/modules/security/results/local-only" } },
          aiGovernance: null,
          perspectiveRuns: [],
        }))
        window.localStorage.setItem(quizKey, JSON.stringify({
          v: 7,
          questionSet: "core",
          answers,
        }))
        window.dispatchEvent(new StorageEvent("storage", { key: profileKey }))
      },
      {
        profileKey: PROFILE_STORAGE_KEY,
        quizKey: QUIZ_STORAGE_KEY,
        answers: Object.fromEntries(
          foundationCoreQuestions.slice(0, 8).map((question) => [question.id, 4]),
        ),
      },
    )

    await expect(page.locator("[data-prototype-continuation]")).toContainText(
      `Continue First Principles · 8 of ${questionCountsBySet.core}`,
    )
    expect(await index.boundingBox()).toEqual(indexBefore)

    await page.locator('[data-prototype-area="my-record"]').click()
    await expect(page.locator('[data-record-value="foundation"]')).toHaveText(
      "Liberal Institutionalist",
    )
    await expect(page.locator('[data-record-value="security"]')).toHaveText("Saved")
    await expect(page.locator('[data-record-value="technology"]')).toHaveText("Not started")
  })

  test("the four-area index and the detail region keep one stable geometry", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(ROUTE)

    const readPanelBox = () => page.evaluate(() => {
      const box = document.querySelector("#prototype-panel")?.getBoundingClientRect()
      return box ? { top: Math.round(box.top), height: Math.round(box.height) } : null
    })

    await page.locator('[data-prototype-area="start"]').click()
    const first = await readPanelBox()
    for (const id of AREA_IDS) {
      await page.locator(`[data-prototype-area="${id}"]`).click()
      expect(await readPanelBox(), `panel geometry moved on ${id}`).toEqual(first)
    }

    expect(
      await page.evaluate(() => document.documentElement.scrollHeight),
    ).toBeLessThanOrEqual(1000)
  })
})
