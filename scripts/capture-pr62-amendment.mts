/** Review evidence only. Isolated synthetic drafts; every network write is blocked. */
import { chromium, expect, type BrowserContext, type Page } from "@playwright/test"
import { mkdir, rename, writeFile } from "node:fs/promises"
import { openSyntheticReview, type CompletionDomain } from "@/e2e/fixtures/product-completion"
import { ROOT_GLOBE_SCENES } from "@/lib/root/globe-scenes"
import { ROOT_SCENE_MS } from "@/lib/root/globe-types"

const baseURL = "http://127.0.0.1:3255"
const output = "docs/review/cinematic-home/amendment/after"
const task = process.argv[2] ?? "views"
await mkdir(`${output}/recordings`, { recursive: true })
const browser = await chromium.launch()
const blocked: string[] = []
async function guard(context: BrowserContext) {
  await context.route("**/*", async route => {
    if (!["GET", "HEAD", "OPTIONS"].includes(route.request().method())) {
      blocked.push(`${route.request().method()} ${new URL(route.request().url()).pathname}`)
      await route.fulfill({ status: 204, body: "" })
    } else await route.continue()
  })
}
async function settled(page: Page) { await page.evaluate(() => document.fonts.ready) }
const manifest: unknown[] = []
if (task === "films") {
  const viewport = { width: 1440, height: 1000 }
  const context = await browser.newContext({ baseURL, viewport, recordVideo: { dir: `${output}/recordings`, size: viewport }, reducedMotion: "no-preference" })
  await guard(context)
  const page = await context.newPage(), video = page.video()!
  await page.goto("/"); await expect(page.locator("[data-root-globe]")).toHaveAttribute("data-enhanced", "true"); await settled(page)
  await page.waitForTimeout(800)
  await page.getByRole("link", { name: "Enter", exact: true }).click()
  await expect(page.locator("#menu-heading")).toBeFocused()
  await page.waitForTimeout(1200)
  await page.getByRole("link", { name: "View the opening", exact: true }).click()
  await page.waitForTimeout(900)
  await page.getByRole("link", { name: "Enter", exact: true }).click()
  await page.waitForTimeout(1000)
  await context.close(); await rename(await video.path(), `${output}/recordings/enter-and-return.webm`)
  manifest.push({ clip: "enter-and-return.webm", viewport, speed: "real time; continuous" })
  for (const domain of ["foundation", "ai", "security", "technology"] as CompletionDomain[]) {
    // Seed in an unrecorded context, then record the actual review and submit.
    const setup = await browser.newContext({ baseURL }); await guard(setup)
    const seed = await setup.newPage(); await openSyntheticReview(seed, domain)
    const review = seed.url(), storageState = await setup.storageState(); await setup.close()
    const run = await browser.newContext({ baseURL, storageState, viewport, recordVideo: { dir: `${output}/recordings`, size: viewport }, reducedMotion: "no-preference" })
    await guard(run)
    const page = await run.newPage(), video = page.video()!
    await page.goto(review); await settled(page)
    const submit = page.getByRole("button", { name: domain === "foundation" ? "Generate my result →" : domain === "ai" ? "Generate my profile →" : /^See .* result/ })
    await expect(submit).toBeEnabled(); await page.waitForTimeout(650)
    await submit.scrollIntoViewIfNeeded(); await page.waitForTimeout(850)
    await submit.click()
    const reveal = page.locator("[data-result-reveal]")
    await expect(reveal).toHaveAttribute("data-motion", "drawing")
    await expect(reveal.locator("[data-foundation-hero-marks], [data-ai-mark], [data-domain-mark]").first()).toBeInViewport({ ratio: 1 })
    await expect(reveal.locator("h1")).toBeVisible()
    await page.waitForTimeout(2600)
    await page.screenshot({ path: `${output}/${domain}-result-1440.png` })
    await run.close(); await rename(await video.path(), `${output}/recordings/${domain}-completion.webm`)
    manifest.push({ clip: `${domain}-completion.webm`, viewport, route: "synthetic draft → real review → real submit handler → client result navigation", onScreenDrawing: true, speed: "real time; continuous" })
  }
} else if (task === "cycle") {
  const context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" }); await guard(context)
  const page = await context.newPage(); await page.goto("/")
  const globe = page.locator("[data-root-globe]"); await expect(globe).toHaveAttribute("data-enhanced", "true")
  const start = Date.now()
  for (const scene of ROOT_GLOBE_SCENES) {
    await expect(globe).toHaveAttribute("data-scene", scene.id, { timeout: 12_000 })
    await page.waitForTimeout(500)
    const camera = await globe.evaluate(el => ({ longitude: el.getAttribute("data-longitude"), latitude: el.getAttribute("data-latitude") }))
    await globe.screenshot({ path: `${output}/cycle-${scene.id}.png` })
    manifest.push({ scene: scene.id, elapsedMs: Date.now() - start, camera, key: scene.groups.map(({ id, label, color }) => ({ id, label, color })) })
  }
  await expect(globe).toHaveAttribute("data-scene", ROOT_GLOBE_SCENES[0].id, { timeout: 12_000 })
  manifest.push({ wrapped: true, elapsedMs: Date.now() - start, holdMs: ROOT_SCENE_MS })
  await context.close()
} else {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ baseURL, viewport: { width, height: width === 1440 ? 1000 : 844 }, reducedMotion: "reduce" }); await guard(context)
    const page = await context.newPage(); await page.goto("/"); await settled(page)
    await expect(page.locator("[data-root-globe]")).toHaveAttribute("data-enhanced", "true")
    if (width === 390 || width === 1440) await page.screenshot({ path: `${output}/opening-${width}.png` })
    await page.getByRole("link", { name: "Enter", exact: true }).click()
    await page.screenshot({ path: `${output}/menu-${width}.png` })
    if (width === 390) {
      await page.goto("/zh#menu"); await settled(page)
      await page.screenshot({ path: `${output}/menu-zh-390.png` })
    }
    await context.close()
  }
  for (const width of [390, 1440]) for (const domain of ["foundation", "ai", "security", "technology"] as CompletionDomain[]) {
    const context = await browser.newContext({ baseURL, viewport: { width, height: width === 1440 ? 1000 : 844 }, reducedMotion: "reduce" }); await guard(context)
    const page = await context.newPage(); const submit = await openSyntheticReview(page, domain); await submit.click()
    await expect(page.locator("[data-result-reveal]")).toBeVisible(); await settled(page)
    await page.screenshot({ path: `${output}/${domain}-result-${width}.png` })
    const evidence = domain === "foundation" ? page.locator('[data-local-evidence-status="available"]') : domain === "ai" ? page.locator("[data-ai-completion-evidence]") : page.getByRole("region", { name: "Recorded answers and perspective choices" })
    await expect(evidence).toBeVisible(); await evidence.evaluate(el => window.scrollTo(0, scrollY + el.getBoundingClientRect().top - 100))
    await page.screenshot({ path: `${output}/${domain}-evidence-${width}.png` })
    manifest.push({ domain, width, evidenceVisibleWithoutOpening: true, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) })
    await context.close()
  }
}
await browser.close()
await writeFile(`${output}/${task}.json`, JSON.stringify({ task, manifest, blocked }, null, 2) + "\n")
