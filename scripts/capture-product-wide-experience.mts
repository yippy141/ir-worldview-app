/** Review-only synthetic evidence. No public runtime imports this script. */
import { chromium, expect, type Page } from "@playwright/test"
import { mkdirSync, readFileSync, renameSync } from "node:fs"
import { openSyntheticReview, type CompletionDomain } from "@/e2e/fixtures/product-completion"
import { resultFixtures } from "@/tests/decision-exercises/fixtures"
import { moduleJourneyFixture } from "@/e2e/fixtures/module-journey"
import { ROOT_GLOBE_SCENES } from "@/lib/root/globe-scenes"
import { preferenceQuestions, type PreferenceAnswers } from "@/lib/futures/preferences"
import { humanPlural, allConflict, preferenceFixture } from "@/tests/fixtures/futures-preferences"

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3106"
const output = "artifacts/product-wide-experience"
for (const directory of ["captures", "identities", "recordings"]) mkdirSync(`${output}/${directory}`, { recursive: true })
const browser = await chromium.launch()
const fixtures = resultFixtures()
const foundation = Object.values(fixtures.foundation)[0]
const ai = Object.values(fixtures.governance)[0]
const domains: CompletionDomain[] = ["foundation", "ai", "security", "technology"]

async function capture(page: Page, name: string, directory = "captures") {
  await page.evaluate(async () => { await document.fonts.ready; scrollTo(0, 0) })
  await expect(page.locator("main h1").first()).toBeVisible()
  await page.waitForTimeout(180)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name}: horizontal reflow`).toBe(true)
  await page.screenshot({ path: `${output}/${directory}/${name}.png`, animations: "disabled" })
}

// Continuous recordings start on the actual review and include its actual submit.
async function recordCompletions() {
  for (const domain of domains) {
    const context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 1000 }, recordVideo: { dir: `${output}/recordings`, size: { width: 1440, height: 1000 } } })
    const page = await context.newPage()
    const submit = await openSyntheticReview(page, domain)
    await expect(submit).toBeEnabled()
    await page.evaluate(() => scrollTo(0, 0))
    await page.waitForTimeout(900)
    await submit.scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)
    await submit.click()
    const reveal = page.locator(`[data-result-reveal="${domain}"]`)
    await expect(reveal).toHaveAttribute("data-motion", "drawing")
    await expect(reveal.locator("h1")).toBeVisible()
    await expect(reveal).toHaveAttribute("data-motion", "complete", { timeout: 4000 })
    await page.waitForTimeout(2200)
    const video = page.video()!
    await context.close()
    renameSync(await video.path(), `${output}/recordings/${domain}-submit-to-result.webm`)
    console.log(`Recorded ${domain}: review → drawing → completed result`)
  }
}

async function recordGlobeCycle() {
  const context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 1000 }, recordVideo: { dir: `${output}/recordings`, size: { width: 1440, height: 1000 } } })
  const page = await context.newPage()
  await page.goto("/")
  await expect(page.locator("[data-root-globe]")).toHaveAttribute("data-enhanced", "true")
  const seen = new Set<string>()
  const start = Date.now()
  while (Date.now() - start < 143_000) {
    const id = await page.locator("[data-root-globe]").getAttribute("data-scene")
    if (id && !seen.has(id)) { seen.add(id); console.log(`Globe ${seen.size}/14: ${id}`) }
    await page.waitForTimeout(950)
  }
  expect([...seen].sort()).toEqual(ROOT_GLOBE_SCENES.map(scene => scene.id).sort())
  await expect(page.locator("[data-root-globe]")).toHaveAttribute("data-scene", ROOT_GLOBE_SCENES[0].id, { timeout: 12_000 })
  const video = page.video()!
  await context.close()
  renameSync(await video.path(), `${output}/recordings/root-complete-scene-cycle.webm`)
}

async function globeCloseout() {
  // New evidence only: preserve the accepted full-product captures and videos.
  const directory = `${output}/globe-closeout`
  mkdirSync(directory, { recursive: true })
  const context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference", recordVideo: { dir: directory, size: { width: 1440, height: 1000 } } })
  const page = await context.newPage()
  await page.goto("/")
  const globe = page.locator("[data-root-globe]")
  await expect(globe).toHaveAttribute("data-enhanced", "true")
  await expect.poll(async () => Number(await globe.getAttribute("data-longitude")), { timeout: 14000 }).toBeGreaterThan(38)
  await globe.locator("summary").click()
  const source = globe.locator("details a").first()
  await page.keyboard.press("Tab")
  const href = await source.getAttribute("href"), longitude = await globe.getAttribute("data-longitude")
  await page.waitForTimeout(11500)
  await expect(source).toBeFocused()
  await expect(source).toHaveAttribute("href", href!)
  await expect(globe).toHaveAttribute("data-longitude", longitude!)
  await expect(globe).toHaveAttribute("data-scene", "eu-nato")
  await globe.locator("summary").click()
  await page.waitForTimeout(700)
  await globe.getByRole("button", { name: "Play", exact: true }).click()
  await page.evaluate(() => scrollTo(0, 0))
  await expect(globe).toHaveAttribute("data-scene", "east-africa", { timeout: 5000 })
  await page.waitForTimeout(1800)
  for (let i = 0; i < 3; i++) {
    await globe.getByRole("button", { name: "Next globe scene" }).click()
    await page.waitForTimeout(600)
  }
  await expect(globe).toHaveAttribute("data-scene", "rcep-signing")
  await page.waitForTimeout(3000)
  await globe.locator("summary").click()
  await page.waitForTimeout(1800)
  const video = page.video()!
  await context.close()
  renameSync(await video.path(), `${directory}/pause-source-relationships.webm`)

  const stillContext = await browser.newContext({ baseURL, reducedMotion: "reduce" })
  const still = await stillContext.newPage()
  for (const width of [390, 1440]) for (const locale of ["en", "zh"]) {
    await still.setViewportSize({ width, height: width === 390 ? 844 : 1000 })
    await still.goto(locale === "en" ? "/" : "/zh")
    const figure = still.locator("[data-root-globe]")
    await figure.scrollIntoViewIfNeeded()
    await expect(figure).toHaveAttribute("data-enhanced", "true")
    const next = figure.getByRole("button", { name: locale === "en" ? "Next globe scene" : "下一场景" })
    for (const id of ["eu-nato", "rcep-signing"]) {
      if (id === "rcep-signing") for (let i = 0; i < 4; i++) await next.click()
      await expect(figure).toHaveAttribute("data-scene", id)
      await figure.scrollIntoViewIfNeeded()
      await still.evaluate(async () => document.fonts.ready)
      expect(await still.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
      await still.screenshot({ path: `${directory}/${id}-${locale}-${width}.png` })
    }
  }
  await stillContext.close()
  console.log("Recorded continuous Source hold through >10 seconds, explicit Play/transition, and both relationship scenes; captured only the changed globe at 390/1440 in English/Chinese.")
}

async function stills() {
  const context = await browser.newContext({ baseURL, reducedMotion: "reduce" })
  const page = await context.newPage()
  const routes: Record<string, string> = {
    root: "/", foundation: "/quiz", ai: "/ai", selector: "/modules", security: "/modules/security", technology: "/modules/technology",
    foundationResult: `/results/${foundation.payload}`, aiResult: `/ai/results/${ai.payload}`,
    securityResult: moduleJourneyFixture("security", "standard").resultPath, technologyResult: moduleJourneyFixture("technology", "standard").resultPath,
    library: "/explore", tradition: "/explore/realism", thinker: "/explore/reference/alexander-wendt", pattern: "/explore/atlas/institution-builder", aiReading: "/ai/atlas/coordinationArchitect",
    worldviewMap: "/explore/atlas", archetypes: "/archetypes", aiApproaches: "/ai/atlas", thinkers: "/explore/reference", fieldGuide: "/ai/field-guide",
    futures: "/futures", futureScenario: "/futures/scenarios/constitutional-delegation", departureScenario: "/futures/scenarios/departure", departureExercise: "/futures/departure",
    worldStage: "/world-stage", cases: "/cases", caseReading: "/cases/europe-missile-defence-coalition-ukraine", decisions: "/decisions", decisionReading: "/decisions/who-gets-access", perspectives: "/perspectives",
    method: "/method", references: "/references", about: "/about", privacy: "/privacy", feedback: "/feedback", profileEmpty: "/profile",
  }
  for (const width of [390, 1440, 320, 768]) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 })
    for (const [name, route] of Object.entries(routes)) {
      if ([320, 768].includes(width) && !["root", "foundation", "ai", "security", "technology", "aiResult", "library", "thinker", "aiReading", "futures", "profileEmpty"].includes(name)) continue
      await page.goto(route)
      if (name === "foundation") await expect(page.getByRole("button", { name: "Start Foundation", exact: true })).toBeVisible()
      await capture(page, `${name}-${width}`)
    }
    await page.goto("/cases")
    const menu = page.locator(width <= 720 ? "details.mobile-nav" : ".header-nav details.nav-disclosure")
    await menu.locator(":scope > summary").click()
    await capture(page, `navigation-${width}`)
    // Save four real synthetic completions using the ordinary save flow.
    for (const domain of domains) {
      const submit = await openSyntheticReview(page, domain, domain === "foundation")
      await submit.click()
      await expect(page.locator(`[data-result-reveal="${domain}"]`)).toBeVisible()
      await page.waitForTimeout(200)
    }
    await page.goto("/profile")
    await expect(page.locator(".profile-domain-record")).toHaveCount(3)
    await capture(page, `profileMultiple-${width}`)
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear() })
  }
  await page.setViewportSize({ width: 390, height: 844 })
  // One ordinary viewport for every finite reading identity; no synthetic label stand-ins.
  const delta = JSON.parse(readFileSync("docs/evidence/result-interpretation/route-delta.json", "utf8")) as { routes: { route: string; template: string }[] }
  const templates = ["app/explore/[slug]/page.tsx", "app/explore/reference/[id]/page.tsx", "app/ai/atlas/[id]/page.tsx", "app/archetypes/[slug]/page.tsx", "components/worldview-profile/worldview-profile-page.tsx"]
  for (const row of delta.routes.filter(row => templates.includes(row.template))) {
    await page.goto(row.route)
    await capture(page, row.route.slice(1).replaceAll("/", "-"), "identities")
  }
  await page.setViewportSize({ width: 768, height: 900 })
  for (const [code, result] of Object.entries(fixtures.foundation)) {
    await page.goto(`/results/${result.payload}`)
    await page.locator("[data-foundation-hero-marks]").screenshot({ path: `${output}/identities/mark-foundation-${code.replaceAll("/", "_").replaceAll("+", "plus").replaceAll("-", "minus")}.png` })
  }
  for (const [key, result] of Object.entries(fixtures.governance)) {
    await page.goto(`/ai/results/${result.payload}`)
    await page.locator("[data-ai-mark]").first().screenshot({ path: `${output}/identities/mark-ai-${key}.png` })
  }
  for (const slug of ["security", "technology"] as const) {
    await page.goto(moduleJourneyFixture(slug, "standard").resultPath)
    await page.locator("[data-domain-mark]").first().screenshot({ path: `${output}/identities/mark-${slug}.png` })
  }
  // Review and edge-state layouts in Futures, using its existing synthetic fixtures.
  const states: Array<[string, PreferenceAnswers]> = [["human", humanPlural], ["tied", preferenceFixture()], ["conflicted", allConflict], ["unconfirmed", { ...humanPlural, personalExit: { choice: "present", nonNegotiable: true } }]]
  for (const [name, answers] of states) {
    await page.goto("/futures/preferences")
    await page.getByRole("button", { name: "Begin the twelve questions" }).click()
    for (const [index, question] of preferenceQuestions.entries()) {
      await page.locator(`input[name="${question.id}"][value="${answers[question.id]!.choice}"]`).check()
      if (answers[question.id]!.nonNegotiable) await page.getByRole("checkbox").check()
      await page.getByRole("button", { name: index === 11 ? "Review all answers" : "Next question", exact: true }).click()
    }
    if (name === "human") for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 })
      await capture(page, `futuresReview-${width}`)
    }
    await page.getByRole("button", { name: "Compare my preferred conditions", exact: true }).click()
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 })
      await capture(page, `futures-${name}-${width}`)
    }
  }
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 })
    await page.goto("/futures/compare?a=reversion&b=constitutional-delegation")
    await capture(page, `futuresComparison-${width}`)
  }
  await context.close()
  console.log(`Captured finite identities: ${Object.keys(fixtures.foundation).length} Foundation marks, ${Object.keys(fixtures.governance).length} AI marks, 2 domains; 32 reading identities.`)
}

try {
  const only = process.argv[2]
  if (!only || only === "stills") await stills()
  if (!only || only === "completions") await recordCompletions()
  if (!only || only === "globe") await recordGlobeCycle()
  if (only === "globe-closeout") await globeCloseout()
} finally { await browser.close() }
