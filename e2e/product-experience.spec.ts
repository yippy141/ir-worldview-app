import { test, expect, type Page } from "@playwright/test"
import { geoOrthographic } from "d3-geo"
import { ROOT_GLOBE_SCENES } from "../lib/root/globe-scenes"
import { openSyntheticReview, type CompletionDomain } from "./fixtures/product-completion"

for (const domain of ["foundation", "ai", "security", "technology"] as CompletionDomain[]) {
  test(`${domain}: real completion draws; reload, Back, reduced motion and no-JS are complete`, async ({ page, browser }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" })
    const submit = await openSyntheticReview(page, domain)
    await expect(submit).toBeEnabled()
    await submit.click()
    await expect(page).toHaveURL(/\/results\//)
    const reveal = page.locator(`[data-result-reveal="${domain}"]`)
    await expect(reveal).toHaveAttribute("data-motion", "drawing")
    await expect(reveal.locator("h1")).toBeVisible()
    expect((await reveal.locator("h1").innerText()).length).toBeGreaterThan(3)
    const strokes = await reveal.locator("[data-draw]").evaluateAll(paths => paths.map(path => ({ length: (path as SVGGeometryElement).getTotalLength(), animation: path.getAnimations().length })))
    expect(strokes.length).toBeGreaterThan(2)
    expect(strokes.every(path => path.length > 0 && path.animation > 0)).toBe(true)
    await expect(reveal).toHaveAttribute("data-motion", "complete", { timeout: 4000 })
    const result = page.url(), title = await reveal.locator("h1").innerText()
    await reveal.getByRole("button", { name: /Replay/ }).click()
    await expect(reveal).toHaveAttribute("data-motion", "drawing")
    await page.evaluate(() => dispatchEvent(new Event("beforeprint")))
    await expect(reveal).toHaveAttribute("data-motion", "complete")
    await page.reload(); await expect(reveal).toHaveAttribute("data-motion", "complete")
    await page.locator('a[href="/profile"]').first().click(); await page.goBack()
    await expect(reveal).toHaveAttribute("data-motion", "complete")
    await page.emulateMedia({ reducedMotion: "reduce" })
    const reducedSubmit = await openSyntheticReview(page, domain)
    await reducedSubmit.click(); await expect(page).toHaveURL(/\/results\//)
    await expect(reveal).toHaveAttribute("data-motion", "complete")
    await expect(reveal.getByRole("button", { name: /Replay/ })).toBeHidden()
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
    const staticPage = await context.newPage(); await staticPage.goto(result)
    await expect(staticPage.locator("h1")).toHaveText(title)
    await expect(staticPage.locator("[data-result-reveal]")).toHaveAttribute("data-motion", "complete")
    await context.close()
  })
}

test("globe reprojects, pauses both clocks, ignores menu hover, and remains manual with reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")
  const globe = page.locator("[data-root-globe]")
  await expect(globe).toHaveAttribute("data-enhanced", "true")
  const first = Number(await globe.getAttribute("data-longitude"))
  await expect.poll(async () => Number(await globe.getAttribute("data-longitude"))).toBeGreaterThan(first + 1)
  await globe.getByRole("button", { name: "Pause", exact: true }).click()
  const frozen = await globe.getAttribute("data-longitude"), scene = await globe.getAttribute("data-scene")
  await page.locator('[data-root-destination="atlas"]').hover()
  await page.waitForTimeout(500)
  await expect(globe).toHaveAttribute("data-longitude", frozen!)
  await expect(globe).toHaveAttribute("data-scene", scene!)
  await globe.getByRole("button", { name: "Next globe scene" }).click()
  await expect(globe).not.toHaveAttribute("data-scene", scene!)
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.reload()
  await expect(globe).toHaveAttribute("data-enhanced", "true")
  await expect(globe.getByRole("button", { name: "Play", exact: true })).toBeHidden()
  const still = await globe.getAttribute("data-longitude")
  await page.waitForTimeout(300); await expect(globe).toHaveAttribute("data-longitude", still!)
  await globe.getByRole("button", { name: "Next globe scene" }).click()
  await expect(globe).not.toHaveAttribute("data-scene", "eu-nato")
})

// Read actual Canvas pixels at known interior locations, independently of the
// caption state. This catches a correct label attached to an outgoing paint.
async function expectGlobePaint(page: Page, sceneIndex: number, samples: Array<[number, number, string]>) {
  const globe = page.locator("[data-root-globe]")
  const scene = ROOT_GLOBE_SCENES[sceneIndex]
  await expect(globe).toHaveAttribute("data-scene", scene.id)
  await expect(globe.locator("figcaption > p")).toHaveText(scene.question)
  const date = globe.locator("figcaption > div").last().locator(":scope > span")
  if (scene.date) await expect(date).toHaveText(scene.date)
  else await expect(date).toHaveCount(0)
  await expect(globe.locator("figcaption i")).toHaveCount(scene.groups.length)
  expect(await globe.locator("figcaption i").evaluateAll(nodes => nodes.map(node => ({
    color: (node as HTMLElement).dataset.color, label: node.parentElement!.textContent,
  })))).toEqual(scene.groups.map(group => ({ color: group.color, label: group.label })))
  expect(await globe.locator("details a").evaluateAll(nodes => nodes.slice(0, -1).map(node => node.getAttribute("href")))).toEqual(scene.sources.map(source => source.url))
  const longitude = Number(await globe.getAttribute("data-longitude"))
  const projection = geoOrthographic().translate([500, 500]).scale(445).rotate([-longitude, -8, 0])
  for (const [lon, lat, color] of samples) {
    const [x, y] = projection([lon, lat])!
    const actual = await globe.locator("canvas").evaluate((canvas: HTMLCanvasElement, position) => {
      // A one-pixel neighbourhood accommodates raster rounding at tiny points;
      // it still requires the exact, fully committed group color in the paint.
      const pixels = canvas.getContext("2d")!.getImageData(Math.round(position[0] * canvas.width / 1000) - 1, Math.round(position[1] * canvas.width / 1000) - 1, 3, 3).data
      return Array.from({ length: 9 }, (_, i) => `#${[...pixels].slice(i * 4, i * 4 + 3).map(value => value.toString(16).padStart(2, "0")).join("")}`)
    }, [x, y])
    expect(actual, `${scene.id}: paint at ${lon},${lat}`).toContain(color)
  }
}

async function clockedGlobe(page: Page) {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.clock.install({ time: new Date("2026-09-16T00:00:00Z") })
  await page.goto("/")
  const globe = page.locator("[data-root-globe]")
  await expect(globe).toHaveAttribute("data-enhanced", "true")
  await page.clock.pauseAt(new Date("2026-09-16T00:01:00Z"))
  // Ordinary navigation resets the scene clock exactly; no runtime test hooks.
  await globe.getByRole("button", { name: "Pause", exact: true }).click()
  while (await globe.getAttribute("data-scene") !== "eu-nato") await globe.getByRole("button", { name: "Previous globe scene" }).click()
  await globe.getByRole("button", { name: "Next globe scene" }).click()
  await globe.getByRole("button", { name: "Previous globe scene" }).click()
  await globe.getByRole("button", { name: "Play", exact: true }).click()
  await page.clock.runFor(16) // first animation frame establishes the baseline
  return globe
}

test("globe commits caption, key, sources and actual country paint atomically at boundaries and wrap", async ({ page }) => {
  const globe = await clockedGlobe(page)
  let elapsed = 0
  const at = async (target: number) => { await page.clock.runFor(target - elapsed); elapsed = target }
  const europe: Array<[number, number, string]> = [[10, 51, "#86abd2"], [14, 47.6, "#d98a5a"], [34, 39, "#cea857"], [40, 8, "#293b50"]]
  for (const time of [9584, 9792, 9984]) { await at(time); await expectGlobePaint(page, 0, europe) }
  for (const time of [10000, 10208, 10512, 11008]) {
    await at(time)
    await expectGlobePaint(page, 1, [[10, 51, "#293b50"], [40, 8, "#cea857"]])
  }
  // Deliberately choose the last scene, then exercise its complete wrap interval.
  await globe.getByRole("button", { name: "Previous globe scene" }).click()
  await globe.getByRole("button", { name: "Previous globe scene" }).click()
  await expectGlobePaint(page, 13, [[-1, 8, "#cea857"], [10, 51, "#293b50"]])
  await globe.getByRole("button", { name: "Play", exact: true }).click()
  await page.clock.runFor(16)
  await page.clock.runFor(9984)
  await expectGlobePaint(page, 13, [[-1, 8, "#cea857"], [10, 51, "#293b50"]])
  await page.clock.runFor(16)
  await expectGlobePaint(page, 0, europe)
  await page.clock.runFor(512)
  await expectGlobePaint(page, 0, europe)
})

test("Source consultation holds its scene and focused URL through a full interval until explicit Play", async ({ page }) => {
  const globe = await clockedGlobe(page)
  await page.clock.runFor(9792)
  const source = globe.locator("details")
  await source.locator("summary").focus()
  await page.keyboard.press("Enter")
  await expect(source).toHaveAttribute("open", "")
  await page.keyboard.press("Tab")
  const link = source.getByRole("link").first()
  await expect(link).toBeFocused()
  const href = await link.getAttribute("href")
  const frozen = await globe.getAttribute("data-longitude")
  await page.clock.runFor(12000)
  await expect(link).toHaveAttribute("href", href!)
  await expect(link).toBeFocused()
  await expect(globe).toHaveAttribute("data-longitude", frozen!)
  await expectGlobePaint(page, 0, [[10, 51, "#86abd2"], [14, 47.6, "#d98a5a"], [34, 39, "#cea857"]])
  await source.locator("summary").click()
  await page.clock.runFor(12000)
  await expect(globe).toHaveAttribute("data-longitude", frozen!)
  await globe.getByRole("button", { name: "Play", exact: true }).click()
  await page.clock.runFor(512)
  await expectGlobePaint(page, 1, [[40, 8, "#cea857"]])
  // Prior explicit pause, deliberate selection while Source is open, and the
  // new trade grouping remain coherent without restarting on blur/close.
  await globe.getByRole("button", { name: "Pause", exact: true }).click()
  await source.locator("summary").click()
  for (let i = 0; i < 3; i++) await globe.getByRole("button", { name: "Next globe scene" }).click()
  await expectGlobePaint(page, 4, [[105, 34, "#86abd2"], [134, -25, "#86abd2"], [103.81482, 1.359364, "#86abd2"]])
  await source.getByRole("link").first().focus()
  await page.clock.runFor(12000)
  await expectGlobePaint(page, 4, [[105, 34, "#86abd2"]])
  await globe.getByRole("button", { name: "Play", exact: true }).click()
  await expect(source).not.toHaveAttribute("open", "")
  await page.clock.runFor(10032)
  await expectGlobePaint(page, 5, [[134, -25, "#cea857"]])
})

test("globe suspends offscreen and hidden clocks, and preserves a matching no-JS still", async ({ page, browser }) => {
  const globe = await clockedGlobe(page)
  // Reflow the real page into a short viewport, then scroll its globe away.
  await page.setViewportSize({ width: 390, height: 300 })
  await page.evaluate(() => scrollTo(0, 0))
  await expect(globe).toHaveAttribute("data-paused", "true")
  let frozen = await globe.getAttribute("data-longitude")
  await page.clock.runFor(12000)
  await expect(globe).toHaveAttribute("data-longitude", frozen!)
  await globe.scrollIntoViewIfNeeded()
  await expect(globe).toHaveAttribute("data-paused", "false")
  await page.clock.runFor(512)
  await expect(globe).not.toHaveAttribute("data-longitude", frozen!)
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true })
    document.dispatchEvent(new Event("visibilitychange"))
  })
  frozen = await globe.getAttribute("data-longitude")
  await page.clock.runFor(12000)
  await expect(globe).toHaveAttribute("data-longitude", frozen!)
  await page.evaluate(() => {
    delete (document as unknown as { hidden?: boolean }).hidden
    document.dispatchEvent(new Event("visibilitychange"))
  })
  await page.clock.runFor(512)
  await expect(globe).not.toHaveAttribute("data-longitude", frozen!)
  await page.evaluate(() => dispatchEvent(new Event("beforeprint")))
  await expect(globe.getByRole("button", { name: "Play", exact: true })).toBeVisible()
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
  const stillPage = await context.newPage()
  await stillPage.goto(new URL("/", page.url()).href)
  const still = stillPage.locator("[data-root-globe]")
  await expect(still).toHaveAttribute("data-scene", "eu-nato")
  await expect(still.locator('svg path[fill="#86abd2"]')).toHaveCount(1)
  await expect(still.locator('svg path[fill="#d98a5a"]')).toHaveCount(1)
  await expect(still.locator('svg path[fill="#cea857"]')).toHaveCount(1)
  await expect(still.getByText("Both EU and NATO", { exact: true })).toBeVisible()
  await still.locator("summary").click()
  await expect(still.getByRole("link", { name: /NATO member countries/ })).toBeVisible()
  await context.close()
})
