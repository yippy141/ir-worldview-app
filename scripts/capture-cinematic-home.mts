import { mkdirSync, writeFileSync, renameSync } from "node:fs"
import { resolve } from "node:path"
import { chromium, expect } from "@playwright/test"
import { ROOT_GLOBE_SCENES } from "@/lib/root/globe-scenes"

const base = process.env.CINEMATIC_BASE_URL ?? "http://127.0.0.1:3255"
const output = resolve(process.env.CINEMATIC_EVIDENCE_DIR ?? "test-results/cinematic-recording")
mkdirSync(output, { recursive: true })
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, recordVideo: { dir: output, size: { width: 1440, height: 1000 } }, reducedMotion: "no-preference" })
const page = await context.newPage()
const video = page.video()!
const errors: string[] = []
page.on("pageerror", error => errors.push(error.message))
await page.goto(base)
const globe = page.locator("[data-root-globe]")
await expect(globe).toHaveAttribute("data-enhanced", "true")
const seen: string[] = []
for (const scene of ROOT_GLOBE_SCENES) {
  await expect(globe).toHaveAttribute("data-scene", scene.id, { timeout: 18_000 })
  await expect(globe.getByText("Imagined alignments", { exact: true })).toBeVisible()
  seen.push(scene.id)
  await page.waitForTimeout(1000)
}
await expect(globe).toHaveAttribute("data-scene", ROOT_GLOBE_SCENES[0].id, { timeout: 18_000 })
await globe.getByRole("button", { name: "Pause", exact: true }).click()
const art = globe.getByRole("group", { name: "Rotatable globe of imagined alignments", exact: true })
const box = (await art.boundingBox())!
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
await page.mouse.down(); await page.mouse.move(box.x + box.width * .76, box.y + box.height * .62, { steps: 36 }); await page.mouse.up()
await page.waitForTimeout(2000)
await globe.getByRole("button", { name: "Zoom globe in" }).click()
await globe.getByRole("button", { name: "Zoom globe in" }).click()
await page.waitForTimeout(2000)
await globe.getByRole("button", { name: "Zoom globe out" }).click()
await page.waitForTimeout(1000)
await globe.getByRole("button", { name: "Reset view" }).click()
await page.waitForTimeout(1500)
await page.getByRole("link", { name: "Enter", exact: true }).click()
await expect(page.locator("#menu")).toBeVisible()
await page.waitForTimeout(3000)
await page.getByRole("navigation", { name: "Primary destinations" }).getByRole("link", { name: "Foundation", exact: true }).click()
await expect(page).toHaveURL(/\/quiz$/)
await page.waitForTimeout(2000)
await page.goBack(); await expect(page.locator("#menu")).toBeVisible()
await page.waitForTimeout(1500)
// A direct reading URL bypasses the entrance, without any earlier root state.
await page.evaluate(() => { sessionStorage.clear(); localStorage.clear() })
await page.goto(`${base}/explore/realism`)
await expect(page.getByRole("heading", { name: "Realism", exact: true })).toBeVisible()
await expect(globe).toHaveCount(0)
await page.waitForTimeout(3000)
await context.close()
renameSync(await video.path(), resolve(output, "sequence-and-controls.webm"))
writeFileSync(resolve(output, "recording.json"), JSON.stringify({ viewport: { width: 1440, height: 1000 }, speed: "Real time; no clock emulation or montage", seen, returnedToOpeningScene: true, interactions: ["pause", "pointer rotation", "zoom in/out", "reset view", "Enter", "Foundation", "browser Back", "fresh-storage reading deep link"], errors }, null, 2))
// Original-size desktop/tablet/mobile witnesses use completed reduced-motion views.
const stills = resolve(output, "..")
for (const width of [1440, 768, 390, 320]) {
  const stillContext = await browser.newContext({ viewport: { width, height: width === 1440 ? 1000 : 844 }, reducedMotion: "reduce" })
  const still = await stillContext.newPage()
  await still.goto(base)
  await expect(still.locator("[data-root-globe]")).toHaveAttribute("data-enhanced", "true")
  await still.evaluate(() => document.fonts.ready)
  await still.screenshot({ path: resolve(stills, `opening-${width}.png`), fullPage: true })
  await still.getByRole("link", { name: "Enter", exact: true }).click()
  await expect(still.locator("main")).toHaveAttribute("data-root-mode", "menu")
  await still.evaluate(() => scrollTo(0, 0))
  await still.screenshot({ path: resolve(stills, `menu-${width}.png`), fullPage: true })
  if (width === 1440 || width === 390) {
    for (const [name, path] of [["realism", "/explore/realism"], ["thinker", "/explore/reference/susan-strange"], ["ai-reading", "/ai/atlas/precautionarySteward"], ["field-guide", "/ai/field-guide"]]) {
      await still.goto(`${base}${path}`)
      await still.evaluate(() => document.fonts.ready)
      await still.screenshot({ path: resolve(stills, `${name}-${width}.png`) })
    }
  }
  if (width === 390) {
    await still.goto(`${base}/zh#menu`)
    await expect(still.locator("main")).toHaveAttribute("data-root-mode", "menu")
    await still.evaluate(() => document.fonts.ready)
    await still.evaluate(() => scrollTo(0, 0))
    await still.screenshot({ path: resolve(stills, "menu-zh-390.png"), fullPage: true })
  }
  if (width === 1440) {
    await still.goto(`${base}/world-stage#membership-maps`)
    await expect(still.locator("[data-documented-globe]")).toHaveAttribute("data-enhanced", "true")
    await still.locator("[data-documented-globe]").scrollIntoViewIfNeeded()
    await expect(still.locator("[data-documented-globe]").getByRole("button", { name: "Next globe scene" })).toBeVisible()
    await still.screenshot({ path: resolve(stills, "documented-1440.png") })
  }
  await stillContext.close()
}
await browser.close()
