import { chromium } from "@playwright/test"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resultFixtures } from "@/tests/decision-exercises/fixtures"
import { moduleJourneyFixture } from "@/e2e/fixtures/module-journey"
import { PROFILE_STORAGE_KEY } from "@/lib/storage-keys"
import { parseProfileStore } from "@/lib/profile-store"

const stage = process.argv[2] ?? "before"
const root = `docs/evidence/result-interpretation/${stage}`
mkdirSync(root, { recursive: true })
const fixtures = resultFixtures()
const ai = Object.values(fixtures.governance)[0]
const foundation = Object.values(fixtures.foundation)[0]
const routes = {
  ai: `/ai/results/${ai.payload}`,
  atlas: "/ai/atlas",
  foundation: `/results/${foundation.payload}`,
  security: moduleJourneyFixture("security", "standard").resultPath,
  technology: moduleJourneyFixture("technology", "analyst").resultPath,
}
writeFileSync(`${root}/synthetic-routes.json`, JSON.stringify({ ...routes, allAi: fixtures.governance, tie: fixtures.tie }, null, 2))
const browser = await chromium.launch()
const page = await browser.newPage({ reducedMotion: "reduce" })
const measurements = []
for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 1000 })
  for (const [name, path] of Object.entries(routes)) {
    await page.goto(`http://127.0.0.1:3241${path}`)
    await page.evaluate(() => document.fonts.ready)
    const geometry = await page.evaluate(() => {
      const rect = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.x, width: r.width, center: r.x + r.width / 2 } }
      return {
        viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        chain: [".wide-container", ".result-article", "article > header", ".nav-container"].map(selector => ({ selector, boxes: [...document.querySelectorAll(selector)].map(rect) })),
        fingerprints: [...document.querySelectorAll(".ai-archetype-fingerprint")].map(el => ({ box: rect(el), rows: [...el.querySelectorAll(".ai-archetype-fingerprint__row")].map(row => ({ row: rect(row), label: rect(row.querySelector(".v10-segmented-level__label")!), bar: rect(row.querySelector(".v10-segmented-level__cells")!), value: rect(row.querySelector(".v10-segmented-level__value")!) })) })),
      }
    })
    measurements.push({ name, width, ...geometry })
    if ([390, 1440].includes(width) || name === "atlas") await page.screenshot({ path: `${root}/${name}-${width}.png`, fullPage: true })
    if ([390, 1440].includes(width)) {
      await page.locator("details").evaluateAll(elements => elements.forEach(el => { (el as HTMLDetailsElement).open = true }))
      await page.screenshot({ path: `${root}/${name}-${width}-expanded.png`, fullPage: true })
    }
  }
}
writeFileSync(`${root}/geometry.json`, JSON.stringify(measurements, null, 2))
if (stage === "after") {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    for (const [name, route] of Object.entries({ chinese: `/zh/results/${foundation.payload}`, "ai-tie": `/ai/results/${fixtures.tie}`, "ai-reference": "/ai/atlas/precautionarySteward" })) {
      await page.goto(`http://127.0.0.1:3241${route}`)
      await page.evaluate(() => document.fonts.ready)
      await page.screenshot({ path: `${root}/${name}-${width}.png`, fullPage: true })
    }
    // These are the same declared synthetic compatibility records used by e2e.
    const read = (version: number) => parseProfileStore(readFileSync(`tests/fixtures/profile-store-v${version}.json`, "utf8"), "en")
    const profile = { ...read(5), modules: { ...read(4).modules, ...read(2).modules } }
    await page.goto("http://127.0.0.1:3241/privacy")
    await page.evaluate(({ key, profile }) => localStorage.setItem(key, JSON.stringify(profile)), { key: PROFILE_STORAGE_KEY, profile })
    for (const route of ["/profile", "/zh/profile"]) {
      await page.goto(`http://127.0.0.1:3241${route}`)
      await page.getByRole("heading", { level: 1 }).waitFor()
      await page.evaluate(() => document.fonts.ready)
      await page.screenshot({ path: `${root}/${route === "/profile" ? "profile" : "profile-zh"}-${width}.png`, fullPage: true })
    }
    await page.evaluate(() => localStorage.clear())
  }
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(`http://127.0.0.1:3241${routes.ai}`)
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")))
  await page.emulateMedia({ media: "print" })
  await page.pdf({ path: `${root}/ai-print.pdf`, format: "A4", printBackground: true })
  await page.screenshot({ path: `${root}/ai-print.png`, fullPage: true })
  await page.emulateMedia({ media: "screen" })
  await page.setViewportSize({ width: 768, height: 1000 })
  await page.goto(`http://127.0.0.1:3241${routes.foundation}`)
  await page.evaluate(() => {
    const elements = [...document.querySelectorAll<HTMLElement>("body *")].filter(el => !el.closest("svg"))
    const sizes = elements.map(el => parseFloat(getComputedStyle(el).fontSize))
    elements.forEach((el, index) => { el.style.fontSize = `${sizes[index] * 2}px` })
    document.querySelectorAll("details").forEach(el => { el.open = true })
  })
  await page.screenshot({ path: `${root}/foundation-768-text-200.png`, fullPage: true })
}
await browser.close()
