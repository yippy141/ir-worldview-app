import { expect, test } from "@playwright/test"
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { additionalThinkers } from "../content/reading/additional-thinkers"

const routes = ["/", "/#menu", "/quiz", "/modules", "/modules/security", "/modules/technology", "/ai", "/profile", "/compare", "/explore", "/explore/realism", "/explore/institutionalism", "/explore/constructivism", "/explore/critical-political-economy", "/explore/reference", "/explore/reference/robert-keohane", "/archetypes", "/archetypes/r-plus", "/archetypes/s-minus", "/ai/atlas", "/ai/field-guide", "/explore/atlas", "/futures", "/futures/preferences", "/futures/compare", "/decisions", "/cases", "/perspectives", "/method", "/about", "/privacy", "/feedback"]
const captures = new Set(["/#menu", "/archetypes/r-plus", "/explore/reference", "/ai/field-guide", "/explore/atlas", "/futures"])
test.beforeEach(async ({ context }) => { await context.route("**/*", route => ["GET", "HEAD"].includes(route.request().method()) ? route.continue() : route.abort()) })
for (const width of [320, 390, 768, 1440]) test(`editorial routes keep headings and prose legible at ${width}px`, async ({ page }, info) => {
  test.setTimeout(240_000)
  await page.setViewportSize({ width, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  const findings: { route: string; issue: string }[] = []
  const evidence = process.env.EDITORIAL_EVIDENCE_DIR
  if (evidence) mkdirSync(evidence, { recursive: true })
  for (const route of routes) {
    const response = await page.goto(route)
    if (route !== "/#menu") expect(response?.status(), route).toBe(200)
    else await expect(page).toHaveURL(/#menu$/)
    await expect(page.locator("main")).toBeVisible()
    await page.evaluate(() => document.fonts.ready)
    if (route === "/" || route === "/#menu") await expect(page.locator("[data-root-mode]")).not.toHaveAttribute("data-root-mode", "static")
    if (route === "/explore/atlas") await expect(page.locator("[data-archetype-matrix]")).toBeVisible()
    const issues = await page.evaluate(() => {
      const issues: string[] = []
      if (document.documentElement.scrollWidth > innerWidth + 1) issues.push(`Overflow: ${document.documentElement.scrollWidth} > ${innerWidth}`)
      for (const h of document.querySelectorAll<HTMLElement>("main h1, main h2, main h3, main h4")) {
        if (!h.checkVisibility()) continue
        const title = h.innerText.trim()
        // Questionnaire prompts are complete statements, not editorial titles.
        if (!h.closest(".quiz-question-frame") && /[.。]$/.test(title)) issues.push(`Heading punctuation: ${title}`)
        const p = h.nextElementSibling
        if (!p?.matches("p") || !p.checkVisibility()) continue
        const a = h.getBoundingClientRect(), b = p.getBoundingClientRect()
        // Only vertically stacked siblings; horizontal editorial rows have their own grid gaps.
        if (b.top >= a.bottom - 1 && Math.abs(a.left - b.left) < 2 && b.top - a.bottom < 7) issues.push(`Tight heading/body: ${title} (${(b.top - a.bottom).toFixed(1)}px)`)
      }
      return issues
    })
    findings.push(...issues.map(issue => ({ route, issue })))
    if (evidence && captures.has(route)) await page.screenshot({ path: join(evidence, `${route.replaceAll("/", "_").replaceAll("#", "")}-${width}.jpg`), fullPage: true, type: "jpeg", quality: 65 })
  }
  writeFileSync(info.outputPath("reading-findings.json"), JSON.stringify(findings, null, 2))
  expect(findings).toEqual([])
})
test("the Thinkers library includes sourced reading essays without invented scores", async ({ page }) => {
  await page.goto("/explore/reference")
  await expect(page.locator(".reference-card")).toHaveCount(8)
  for (const thinker of additionalThinkers) {
    await page.goto(`/explore/reference/${thinker.id}`)
    await expect(page.getByRole("heading", { name: thinker.name, exact: true })).toBeVisible()
    await expect(page.locator("[data-thinker-reading]")).toContainText("no questionnaire scores or position")
    await expect(page.getByRole("link", { name: thinker.source.title, exact: false })).toHaveAttribute("href", thinker.source.url)
    await page.goto(`/zh/explore/reference/${thinker.id}`)
    await expect(page.getByRole("heading", { name: "此页面的简体中文内容尚未通过编辑审校" })).toBeVisible()
    await expect(page.locator("main").getByRole("link", { name: "切换至英文" })).toHaveAttribute("href", `/explore/reference/${thinker.id}`)
  }
})

test("Decision Patterns retain all Institutionalist entries without implying quadrant membership", async ({ page }) => {
  await page.goto("/explore/atlas")
  await page.getByRole("button", { name: /Decision Patterns/ }).click()
  await expect(page.locator("[data-projection]")).toHaveAttribute("data-projection", "continuous")
  await expect(page.getByText("Position reflects the axes below", { exact: false })).toBeVisible()
  const entries = page.locator('li[id^="field-item-atlas-patterns::"]')
  await expect(entries).toHaveCount(10)
  await expect(entries.filter({ hasText: "Institutionalism" })).toHaveCount(4)
  await expect(page.locator('svg').getByText("Institutionalism", { exact: true })).toHaveCount(0)
})
