import { expect, test } from "@playwright/test"
import { PROFILE_STORAGE_KEY } from "../lib/storage-keys"

const destinationIds = [
  "inventory",
  "world-stage",
  "atlas",
  "perspective-runs",
  "profile",
] as const

test("root loads without Mapbox and keeps every destination as an ordinary link", async ({ page }) => {
  const requests: string[] = []
  page.on("request", (request) => requests.push(request.url()))

  await page.goto("/")
  await page.waitForTimeout(500)

  await expect(page.locator("canvas")).toHaveCount(0)
  await expect(page.locator('[role="tab"], [aria-selected]')).toHaveCount(0)
  await expect(page.locator("[data-root-detail-state] a, [data-root-detail-state] button"))
    .toHaveCount(0)
  await expect(page.locator("[data-root-destination]"))
    .toHaveCount(destinationIds.length)
  expect(
    requests.filter((url) => /(?:api|events|tiles)\.mapbox\.com|mapbox-gl|mapbox-runtime/iu.test(url)),
  ).toEqual([])
})

test("Tab reaches all five root destinations and one state drives link, copy, and globe", async ({ page }) => {
  await page.goto("/")
  const menuBefore = await page
    .getByRole("navigation", { name: "Primary destinations" })
    .boundingBox()
  expect(menuBefore).not.toBeNull()

  const reached: string[] = []
  for (let presses = 0; presses < 18 && reached.length < destinationIds.length; presses += 1) {
    await page.keyboard.press("Tab")
    const destination = await page.evaluate(() =>
      document.activeElement?.getAttribute("data-root-destination") ?? null,
    )
    if (!destination || reached.includes(destination)) continue
    reached.push(destination)

    await expect(page.locator("[data-root-selected]"))
      .toHaveAttribute("data-root-selected", destination)
    await expect(page.locator("[data-root-detail-state]"))
      .toHaveAttribute("data-root-detail-state", destination)
    await expect(page.locator("[data-root-visual-state]"))
      .toHaveAttribute("data-root-visual-state", destination)
    await expect(page.locator(`[data-root-destination="${destination}"]`))
      .toHaveAttribute("data-selected", "true")

    const menuAfter = await page
      .getByRole("navigation", { name: "Primary destinations" })
      .boundingBox()
    expect(menuAfter).toEqual(menuBefore)
  }

  expect(reached).toEqual(destinationIds)
  await Promise.all([
    page.waitForURL(/\/profile$/u),
    page.keyboard.press("Enter"),
  ])
})

test("returning-state hydration changes detail text without moving menu geometry", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("[data-root-returning]"))
    .toHaveAttribute("data-root-returning", "resolved")
  const menuBefore = await page
    .getByRole("navigation", { name: "Primary destinations" })
    .boundingBox()

  await page.evaluate(({ key }) => {
    window.localStorage.setItem(key, JSON.stringify({
      v: 5,
      foundation: { payload: "local-only" },
      modules: { security: { resultPath: "/modules/security/results/local-only" } },
      aiGovernance: null,
      perspectiveRuns: [{ id: "run-1" }],
    }))
    window.dispatchEvent(new StorageEvent("storage", { key }))
  }, { key: PROFILE_STORAGE_KEY })

  await expect(page.getByText(/saved Foundation read/iu)).toBeVisible()
  await expect(page.getByText(/1 saved domain record/iu)).toBeVisible()
  await expect(page.getByText(/1 saved Perspective Run/iu)).toBeVisible()
  const menuAfter = await page
    .getByRole("navigation", { name: "Primary destinations" })
    .boundingBox()
  expect(menuAfter).toEqual(menuBefore)
})

for (const width of [320, 390, 768, 1440] as const) {
  test(`root fits ${width}px without horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 })
    await page.goto("/")
    await expect(page.locator("[data-root-destination]"))
      .toHaveCount(destinationIds.length)
    const sizes = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.clientWidth)
  })
}

test("Simplified Chinese root is complete at 390px and does not substitute English copy", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/zh")

  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")
  await expect(page.getByRole("navigation", { name: "主要入口" })).toBeVisible()
  await expect(page.locator("[data-root-destination]")).toHaveText([
    "问卷",
    "世界舞台",
    "图谱",
    "情境推演",
    "档案",
  ])
  await expect(page.getByText("Start with the Foundation", { exact: false })).toHaveCount(0)
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
})

test("reduced motion leaves a complete still root", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  await expect(page.locator("[data-root-visual-state]"))
    .toHaveAttribute("data-root-visual-state", "inventory")
  const motion = await page.locator("[data-root-destination='inventory']").evaluate(
    (element) => ({
      animation: getComputedStyle(element).animationName,
      transition: getComputedStyle(element).transitionDuration,
    }),
  )
  expect(motion.animation).toBe("none")
  expect(motion.transition).toBe("0s")
})

test("World Stage retains map controls, fallback semantics, sources, and one locale switch", async ({ page }) => {
  await page.goto("/world-stage")

  await expect(page.locator("#world-stage-map-view")).toBeVisible()
  await expect(page.getByRole("button", { name: "Zoom globe out" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Zoom globe in" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Map details and sources" })).toBeAttached()
  await expect(page.locator("path[data-iso3]")).toHaveCount(174)
  await expect(page.locator(".language-switcher")).toHaveCount(1)

  if (await page.locator("canvas.mapboxgl-canvas").count()) {
    await expect(page.getByText("OpenStreetMap", { exact: true })).toBeVisible()
    await expect(page.getByText("Improve this map", { exact: true })).toBeVisible()
  }
})
