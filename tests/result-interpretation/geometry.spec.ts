import { test, expect, type Page } from "@playwright/test"
import { resultFixtures } from "../decision-exercises/fixtures"
import { moduleJourneyFixture } from "../../e2e/fixtures/module-journey"
import { aiAnswers } from "../../experiments/result-payoff/fixtures"
import { getCurrentAiGovernanceVersion } from "../../lib/ai-governance-versions"
import { AI_GOVERNANCE_STORAGE_KEY } from "../../lib/storage-keys"

const fixtures = resultFixtures()
const sampleAi = Object.values(fixtures.governance)[0]
const foundation = Object.values(fixtures.foundation)[0]

async function fitsPage(page: Page) {
  const geometry = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, offenders: [...document.querySelectorAll("main *")].filter(el => el.getBoundingClientRect().right > innerWidth + 1).slice(0, 12).map(el => ({ tag: el.tagName, class: el.className, right: el.getBoundingClientRect().right, text: el.textContent?.slice(0, 65) })) }))
  expect(geometry.overflow, JSON.stringify({ url: page.url(), offenders: geometry.offenders })).toBeLessThanOrEqual(1)
}

for (const width of [320, 390, 719, 720, 721, 768, 1024, 1440, 1920]) {
  test(`shared canvas, all six marks and fingerprint columns at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(`/ai/results/${sampleAi.payload}`)
    await page.evaluate(() => document.fonts.ready)
    await fitsPage(page)
    for (const selector of [".ai-result-canvas", ".ai-result-canvas > header"]) {
      const box = await page.locator(selector).boundingBox()
      expect(Math.abs(box!.x + box!.width / 2 - width / 2)).toBeLessThanOrEqual(1)
    }
    await expect(page.locator(".result-application")).toBeVisible()
    await expect(page.locator(".result-figure__bars .v10-scale-bar__poles")).toHaveCount(3)
    await page.goto("/ai/atlas")
    await page.evaluate(() => document.fonts.ready)
    await fitsPage(page)
    const sizes = await page.locator("[data-ai-mark]").evaluateAll(els => els.map(el => { const r = el.getBoundingClientRect(); return [r.width, r.height] }))
    expect(sizes).toHaveLength(6)
    expect(new Set(sizes.map(s => s.join(","))).size).toBe(1)
    const diagrams = await page.locator(".ai-archetype-fingerprint").evaluateAll(els => els.map(el => {
      const parent = el.getBoundingClientRect()
      const rows = [...el.querySelectorAll(".ai-archetype-fingerprint__row")].map(row => [...row.children].map(child => { const r = child.getBoundingClientRect(); return { x: r.x, right: r.right, width: r.width } }))
      return { left: parent.left, right: parent.right, rows }
    }))
    for (const diagram of diagrams) {
      for (const row of diagram.rows) {
        expect(Math.abs(row[1].x - diagram.rows[0][1].x)).toBeLessThanOrEqual(1)
        expect(Math.abs(row[2].x - diagram.rows[0][2].x)).toBeLessThanOrEqual(1)
        expect(row[0].right).toBeLessThanOrEqual(row[1].x)
        expect(row[1].right).toBeLessThanOrEqual(row[2].x)
        expect(row[2].right).toBeLessThanOrEqual(diagram.right + 1)
      }
    }
  })
}

test("six real AI identities, truthful tied marks, expanded reading and 200 percent text", async ({ page }) => {
  test.setTimeout(120_000)
  for (const [key, result] of Object.entries(fixtures.governance)) {
    await page.goto(`/ai/results/${result.payload}`)
    await expect(page.locator("h1")).toHaveText(result.name)
    await expect(page.locator(`[data-ai-mark="${key}"]`)).toBeVisible()
    for (const label of ["Reasoning and policy debates", "Positions and exact comparison calculations", "Reading, sources and scope"]) await page.getByText(label, { exact: true }).click()
    await expect(page.locator("#ai-sources .reading-entry").first()).toBeVisible()
    await fitsPage(page)
  }
  await page.goto(`/ai/results/${fixtures.tie}`)
  await expect(page.locator("h1")).toHaveText("Co-leading AI readings")
  await expect(page.locator(".ai-tied-marks [data-ai-mark]")).toHaveCount(6)
  await page.setViewportSize({ width: 768, height: 1000 })
  for (const route of ["/ai/atlas", `/ai/results/${sampleAi.payload}`, `/results/${foundation.payload}`, `/zh/results/${foundation.payload}`, moduleJourneyFixture("technology", "analyst").resultPath]) {
    await page.goto(route)
    // Explicit 200% text enlargement, not a misleading DPR-only zoom proxy.
    await page.evaluate(() => {
      const elements = [...document.querySelectorAll<HTMLElement>("body *")].filter(el => !el.closest("svg"))
      const sizes = elements.map(el => parseFloat(getComputedStyle(el).fontSize))
      elements.forEach((el, index) => { el.style.fontSize = `${sizes[index] * 2}px` })
      document.querySelectorAll("details").forEach(el => { el.open = true })
    })
    await fitsPage(page)
    await expect(page.locator("h1")).toBeVisible()
  }
})

test("fresh exact AI observations survive same-score alternatives, then disappear on reload", async ({ page }) => {
  test.setTimeout(90_000)
  const version = getCurrentAiGovernanceVersion()
  for (const value of [7, 1, 4]) {
    await page.goto("/ai")
    await page.evaluate(({ key, bank, scorer, answers }) => localStorage.setItem(key, JSON.stringify({ v: 2, bv: bank, sv: scorer, started: true, mode: "standard", answers })), { key: AI_GOVERNANCE_STORAGE_KEY, bank: version.bankVersion, scorer: version.scoringVersion, answers: { ...aiAnswers, gp1: value, gp2: value } })
    await page.goto("/ai/review")
    await page.getByRole("button", { name: "Generate my profile" }).click()
    await expect(page.locator("[data-ai-completion-evidence]")).toBeVisible()
    await expect(page.locator("[data-ai-completion-evidence] > article").first()).toContainText(`${value} of 7`)
    await page.reload()
    await expect(page.locator("[data-ai-completion-evidence]")).toHaveCount(0)
    await expect(page.locator(".result-application")).toBeVisible()
  }
})

test("no-JS payoff, keyboard disclosures, print expansion and return anchors", async ({ page, browser }) => {
  await page.goto(`/ai/results/${sampleAi.payload}`)
  const summary = page.locator("#ai-sources > summary")
  await summary.focus(); await page.keyboard.press("Enter")
  await expect(page.locator("#ai-sources")).toHaveAttribute("open")
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")))
  expect(await page.locator(".result-appendix-section details:not([open])").count()).toBe(0)
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")))
  await expect(page.locator("#ai-sources")).toHaveAttribute("open")
  await expect(page.locator("#ai-calculations")).not.toHaveAttribute("open")
  await page.goto(`/results/${foundation.payload}`)
  await page.getByRole("link", { name: "Explore this reading", exact: true }).click()
  await expect(page).toHaveURL(/#nearest$/)
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } })
  const staticPage = await context.newPage()
  await staticPage.goto(`http://127.0.0.1:3241/ai/results/${sampleAi.payload}`)
  await expect(staticPage.locator(".result-application")).toBeVisible()
  await expect(staticPage.locator("[data-ai-mark]")).toBeVisible()
  await staticPage.locator("#ai-sources > summary").click()
  await expect(staticPage.locator(".reading-entry").first()).toBeVisible()
  await context.close()
})
