import { expect, test } from "@playwright/test"
import { readFileSync, writeFileSync } from "node:fs"

const delta = JSON.parse(readFileSync("docs/evidence/result-interpretation/route-delta.json", "utf8")) as { routes: { route: string; template: string; locale: string; content_id: string }[] }

test("all 162 inherited finite routes render with an internal link enumeration", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium", "The full finite-route crawl runs once; representative interactions run in both engines.")
  test.setTimeout(240_000)
  const routes = new Set(delta.routes.map(row => row.route))
  const observations = []
  await page.goto("/privacy")
  for (const entry of delta.routes) {
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear() })
    const response = await page.goto(entry.route)
    expect(response?.status(), entry.route).toBe(200)
    const heading = page.locator("main h1, main h2").first()
    await expect(heading, entry.route).toBeVisible()
    const links = await page.locator('main a[href^="/"]').evaluateAll(elements => [...new Set(elements.map(el => el.getAttribute("href")!))])
    observations.push({ ...entry, status: response?.status(), heading: await heading.innerText(), internalLinks: links, linkedFiniteTargets: links.filter(link => routes.has(link.split(/[?#]/)[0])), screenshotCaptured: false, screenshotInspected: false, geometryAsserted: false, taskExecuted: "fresh-state render, heading and internal link enumeration" })
  }
  writeFileSync("docs/evidence/result-interpretation/finite-route-results.json", JSON.stringify(observations, null, 2))
})
