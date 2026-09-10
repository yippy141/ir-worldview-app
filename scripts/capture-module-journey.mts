import { mkdir, writeFile } from "node:fs/promises"
import { chromium } from "@playwright/test"
import { moduleJourneyFixture } from "@/e2e/fixtures/module-journey"
import { MODULE_DRAFT_STORAGE_KEY } from "@/lib/storage-keys"

const phase = process.env.JOURNEY_PHASE ?? "after"
const baseURL = process.env.JOURNEY_BASE_URL ?? "http://127.0.0.1:3240"
const directory = `docs/evidence/module-journey/${phase}`
await mkdir(directory, { recursive: true })
const browser = await chromium.launch()
const records = []
try {
  for (const width of [320, 390, 768, 1440]) {
    for (const state of ["question", "review", "result"] as const) {
      const fixture = moduleJourneyFixture("security", "analyst")
      if (state === "review") {
        fixture.draft.stage = "review"
        fixture.draft.currentQuestionId = null
      }
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" })
      await context.addInitScript(({ key, store }) => localStorage.setItem(key, JSON.stringify(store)), { key: MODULE_DRAFT_STORAGE_KEY, store: fixture.store })
      const page = await context.newPage()
      const route = state === "result" ? fixture.resultPath : "/modules/security"
      const responses: Promise<{ type: string; bytes: number }>[] = []
      page.on("response", response => responses.push(response.body().then(body => ({ type: response.request().resourceType(), bytes: body.length })).catch(() => ({ type: "unavailable", bytes: 0 }))))
      await page.goto(`${baseURL}${route}`)
      await page.locator(state === "question" ? ".quiz-question-frame" : state === "review" ? "#module-review-heading" : ".result-verdict").waitFor()
      await page.evaluate(() => document.fonts.ready)
      await page.waitForLoadState("networkidle")
      // Arrival and task position are different evidence: compare the document top,
      // and record the focused heading after normal resume scroll separately.
      const focused = await page.evaluate(() => ({ text: document.activeElement?.textContent, top: document.activeElement?.getBoundingClientRect().top }))
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.screenshot({ path: `${directory}/${width}-${state}.png` })
      const dom = await page.locator("main").evaluate(main => Array.from(main.querySelectorAll("h1, h2, h3, .result-verdict__gloss")).map(node => ({ tag: node.tagName, text: node.textContent, top: node.getBoundingClientRect().top + window.scrollY })))
      const metrics = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, width: innerWidth, height: document.documentElement.scrollHeight }))
      records.push({ width, state, route, focused, dom, metrics, resources: await Promise.all(responses) })
      if (width === 1440 && state === "result") {
        await page.screenshot({ path: `${directory}/1440-result-full.png`, fullPage: true })
        await page.emulateMedia({ media: "print" })
        await page.pdf({ path: `${directory}/result-print.pdf`, format: "A4" })
        await page.screenshot({ path: `${directory}/1440-result-print.png`, fullPage: true })
      }
      await context.close()
    }
  }
  await writeFile(`${directory}/observations.json`, JSON.stringify({ phase, synthetic: true, browser: browser.version(), records }, null, 2) + "\n")
} finally {
  await browser.close()
}
