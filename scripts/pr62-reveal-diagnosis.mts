/** Isolated synthetic reviews; real submit handlers/navigation, with all network writes blocked. */
import { chromium, webkit } from "@playwright/test"
import { mkdir, writeFile } from "node:fs/promises"
import { openSyntheticReview, type CompletionDomain } from "@/e2e/fixtures/product-completion"

const stage = process.argv[2] ?? "before"
const output = `docs/review/cinematic-home/amendment/${stage}`
await mkdir(output, { recursive: true })
const results: unknown[] = []
for (const [engine, launcher] of Object.entries({ chromium, webkit })) {
  const browser = await launcher.launch()
  for (const width of [390, 1440]) for (const domain of ["foundation", "ai", "security", "technology"] as CompletionDomain[]) {
    const context = await browser.newContext({ baseURL: "http://127.0.0.1:3255", viewport: { width, height: 900 }, reducedMotion: "no-preference" })
    const blocked: string[] = []
    await context.route("**/*", async route => {
      if (!["GET", "HEAD", "OPTIONS"].includes(route.request().method())) {
        blocked.push(`${route.request().method()} ${new URL(route.request().url()).pathname}`)
        await route.fulfill({ status: 204, body: "" })
      } else await route.continue()
    })
    const page = await context.newPage()
    const submit = await openSyntheticReview(page, domain)
    await submit.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    await page.evaluate(() => {
      const state = { token: Math.random(), beforeScroll: scrollY, mounts: 0, samples: [] as unknown[] }
      ;(window as unknown as { __pr62: typeof state }).__pr62 = state
      const sample = (event: string) => {
        const reveal = document.querySelector("[data-result-reveal]")
        if (!reveal) return
        const mark = reveal.querySelector("[data-foundation-hero-marks], [data-ai-mark], [data-domain-mark]")
        const rect = mark?.getBoundingClientRect()
        state.samples.push({ event, t: Math.round(performance.now()), motion: reveal.getAttribute("data-motion"), scroll: scrollY, fonts: document.fonts.status, hidden: document.hidden, reduced: matchMedia("(prefers-reduced-motion: reduce)").matches, mark: rect && { x: rect.x, y: rect.y, width: rect.width, height: rect.height, onScreen: rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth }, animations: mark?.getAnimations({ subtree: true }).length ?? 0 })
      }
      const seen = new WeakSet<Element>()
      new MutationObserver(records => {
        const reveal = document.querySelector("[data-result-reveal]")
        if (reveal && !seen.has(reveal)) { seen.add(reveal); state.mounts++; sample("mount") }
        for (const record of records) if (record.type === "attributes" && record.attributeName === "data-motion") {
          sample("motion")
          requestAnimationFrame(() => requestAnimationFrame(() => sample("motion+2frames")))
        }
      }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-motion"] })
    })
    const token = await page.evaluate(() => (window as unknown as { __pr62: { token: number } }).__pr62.token)
    await submit.click()
    await page.waitForURL(/\/results\//, { waitUntil: "domcontentloaded" }).catch(async error => { console.log(JSON.stringify({ engine, width, domain, failure: String(error), url: page.url(), tail: (await page.locator("body").innerText()).slice(-1000) })); throw error })
    await page.locator("[data-result-reveal][data-ready=true]").waitFor()
    await page.waitForTimeout(2300)
    const trace = await page.evaluate(() => (window as unknown as { __pr62?: unknown }).__pr62 ?? null)
    const record = { engine, width, domain, clientNavigation: !!trace && (trace as { token: number }).token === token, trace, blocked }
    results.push(record)
    console.log(JSON.stringify(record))
    await context.close()
  }
  await browser.close()
}
await writeFile(`${output}/reveal-diagnosis.json`, JSON.stringify(results, null, 2) + "\n")
