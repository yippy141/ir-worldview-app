/** Synthetic, isolated review evidence. Blocks network writes and never reads an existing browser profile. */
import { chromium, expect, type Page } from "@playwright/test"
import { mkdir, rename, writeFile } from "node:fs/promises"
import { syntheticProfile, foundationToken, aiFixture, moduleToken } from "@/tests/connected-fixtures"
import { resultFixtures } from "@/tests/decision-exercises/fixtures"
import { serializeProfileStore } from "@/lib/profile-store"
import { PROFILE_STORAGE_KEY, QUIZ_STORAGE_KEY } from "@/lib/storage-keys"
import { openSyntheticReview } from "@/e2e/fixtures/product-completion"
const output = "docs/review/connected-profile"
await mkdir(`${output}/after`, { recursive: true })
await mkdir(`${output}/print`, { recursive: true })
await mkdir(`${output}/recordings`, { recursive: true })
const browser = await chromium.launch()
const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3251"
const context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", recordVideo: { dir: `${output}/recordings`, size: { width: 1440, height: 1000 } } })
await context.route("**/*", route => ["GET", "HEAD"].includes(route.request().method()) ? route.continue() : route.abort())
const page = await context.newPage()
const fixture = syntheticProfile()
await page.goto("/privacy")
await page.evaluate(({ key, value }) => localStorage.setItem(key, value), { key: PROFILE_STORAGE_KEY, value: serializeProfileStore(fixture.profile) })
await page.goto(`/results/${fixture.token}`)
await expect(page.locator("h1")).toBeVisible()
await page.waitForTimeout(700)
await page.getByRole("link", { name: /profile/i }).first().click()
await page.waitForURL("**/profile")
await expect(page.locator("[data-relation]")).toHaveCount(3)
await page.screenshot({ path: `${output}/after/profile-1440.png`, fullPage: true })
await page.locator("#connected-profile-heading").scrollIntoViewIfNeeded()
await page.waitForTimeout(600)
await page.getByRole("link", { name: "compare a result with someone" }).click()
await page.getByRole("button", { name: "Use my saved result" }).click()
await page.getByLabel("Choose one result to include").selectOption("technology")
await page.locator(".compare-textarea").nth(1).fill(moduleToken("technology", 1))
await page.locator(".compare-person").nth(1).locator("summary").click()
await page.locator(".compare-person").nth(1).getByLabel("The original completion used English wording edition 1").check()
await page.getByRole("button", { name: "Compare results", exact: true }).click()
await page.getByText("Inspect the contributing evidence", { exact: true }).click()
await page.locator(".comparison-output details").scrollIntoViewIfNeeded()
await page.waitForTimeout(700)
await page.getByRole("link", { name: "Try a decision together" }).click()
await expect(page.locator("h1")).toBeVisible()
await page.waitForTimeout(700)
await page.close()
await context.close()
await rename((await page.video()!.path()), `${output}/recordings/result-profile-comparison.webm`)

const stills = await browser.newContext({ baseURL, viewport: { width:1440, height:1000 }, reducedMotion: "reduce" })
await stills.route("**/*", route => ["GET", "HEAD"].includes(route.request().method()) ? route.continue() : route.abort())
const p = await stills.newPage()
async function pair(name: string, left: string, right: string, known = false) {
  await p.goto("/compare")
  await p.locator(".compare-textarea").nth(0).fill(left)
  await p.locator(".compare-textarea").nth(1).fill(right)
  await p.getByLabel("Display name (optional)").nth(0).fill("Morgan")
  await p.getByLabel("Display name (optional)").nth(1).fill("Taylor")
  if (known) for (const field of await p.locator(".compare-person").all()) {
    await field.locator("summary").click()
    await field.getByLabel("AI form").selectOption("standard")
    await field.getByLabel("The original completion used English wording edition 1").check()
  }
  await p.getByRole("button", { name: "Compare results", exact: true }).click()
  await expect(p.locator(".comparison-output")).toBeVisible()
  await p.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))
  await p.screenshot({ path: `${output}/after/${name}-${name === "mobile-pair" ? 390 : 1440}.png`, fullPage: true })
}
await pair("identical-pair", fixture.token, fixture.token)
await pair("differing-pair", foundationToken([6,2,4,4,4,4,4]), foundationToken([2,6,4,4,4,4,4]))
await pair("ai-only", aiFixture(7).token, aiFixture(19).token, true)
await pair("unknown-evidence", aiFixture().token, aiFixture(19).token)
await pair("missing-evidence", aiFixture().token, fixture.token)
await pair("incompatible-evidence", moduleToken("technology"), moduleToken("technology", 0, "analyst"), true)
await p.setViewportSize({ width: 390, height: 844 })
await pair("mobile-pair", fixture.token, foundationToken())
await p.evaluate(({ key, value }) => localStorage.setItem(key, value), { key: PROFILE_STORAGE_KEY, value: serializeProfileStore(fixture.profile) })
await p.goto("/profile")
await expect(p.locator("[data-relation]")).toHaveCount(3)
await p.screenshot({ path: `${output}/after/profile-390.png`, fullPage: true })
await p.setViewportSize({ width: 1440, height:1000 })
for (const [name, path] of [["foundation", `/results/${fixture.token}`], ["ai", `/ai/results/${aiFixture().token}`]]) {
  await p.goto(path)
  await expect(p.locator("h1")).toBeVisible()
  for (const landscape of [false, true]) await p.pdf({ path: `${output}/print/${name}-${landscape ? "landscape" : "portrait"}.pdf`, format: "A4", landscape, printBackground: false, margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" } })
}
await stills.close()

const motion = await browser.newContext({ baseURL, viewport: { width: 1100, height: 900 }, reducedMotion: "no-preference", recordVideo: { dir: `${output}/recordings`, size: { width: 1100, height: 900 } } })
await motion.route("**/*", route => ["GET", "HEAD"].includes(route.request().method()) ? route.continue() : route.abort())
const m = await motion.newPage()
const fixtures = resultFixtures().foundation
const frames: unknown[] = []
for (const f of [fixtures["S-"], fixtures["P-"], Object.values(fixtures).find(f => f.code.includes("/"))!]) {
  await openSyntheticReview(m, "foundation")
  await m.evaluate(({ key, answers }) => { const draft = JSON.parse(localStorage.getItem(key)!); draft.answers = answers; localStorage.setItem(key, JSON.stringify(draft)) }, { key: QUIZ_STORAGE_KEY, answers: f.answers })
  await m.reload()
  await m.getByRole("button", { name: "Generate my result →", exact: true }).click()
  const reveal = m.locator("[data-result-reveal=foundation]")
  await expect(reveal).toHaveAttribute("data-motion", "drawing")
  await expect(reveal.locator("[data-mark-base]")).toHaveCSS("opacity", "0")
  const file = f.code.replaceAll("/", "-")
  await m.waitForTimeout(450)
  await m.screenshot({ path: `${output}/after/mark-${file}-fresh.png` })
  await expect(reveal).toHaveAttribute("data-motion", "complete")
  await reveal.getByRole("button", { name: /Replay/ }).click()
  await m.waitForTimeout(1050)
  await m.screenshot({ path: `${output}/after/mark-${file}-replay.png` })
  await expect(reveal).toHaveAttribute("data-motion", "complete")
  await m.screenshot({ path: `${output}/after/mark-${file}-complete.png` })
  frames.push({ code: f.code, fresh: "drawing with canonical base opacity 0", replay: "frame sampled about 1050ms after click", complete: "canonical base restored", text: await reveal.locator("h1").innerText() })
}
await m.close(); await motion.close()
await rename(await m.video()!.path(), `${output}/recordings/filled-mark-correction.webm`)
await writeFile(`${output}/after/capture-notes.json`, JSON.stringify({ synthetic: true, browser: "Playwright Chromium", viewport: [1440,1000], print: "A4 portrait and landscape, backgrounds disabled", frames }, null, 2) + "\n")
await browser.close()
