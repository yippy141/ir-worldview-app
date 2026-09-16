import { expect, test } from "@playwright/test"
import { getPublishedCurrentCases } from "../lib/current-cases/catalog"
import { encodeAiPayload } from "../lib/ai-governance-share"
import { AI_GOVERNANCE_V22_TUPLE } from "../lib/ai-governance-versions"
import { getArchetypePath } from "../lib/archetypes"
import { moduleJourneyFixture } from "./fixtures/module-journey"
import { buildCompatibleProfileSharePayload, encodeProfileSharePayload } from "../lib/profile-share"
import { parseProfileStore } from "../lib/profile-store"
import { MODULE_DRAFT_STORAGE_KEY } from "../lib/storage-keys"
import profileFixture from "../tests/fixtures/profile-store-v5.json"

const caseRecord = getPublishedCurrentCases()[0]!
const sharedProfile = buildCompatibleProfileSharePayload(parseProfileStore(JSON.stringify(profileFixture)))!
const sharedPath = `/profile/share/${encodeProfileSharePayload(sharedProfile)}`
const security = moduleJourneyFixture("security", "standard")
const technology = moduleJourneyFixture("technology", "standard")
const aiPayload = encodeAiPayload({
  v: 2, bv: AI_GOVERNANCE_V22_TUPLE.bankVersion, sv: AI_GOVERNANCE_V22_TUPLE.scoringVersion,
  as: [4.2, 5.1, 6, 3.8, 4.6, 2.9, 5.4, 4], ak: "coordinationArchitect", nk: "stateCapacityBuilder",
  rl: "Frontier-risk first", pm: "Threshold guardrails", gm: "Coordination-first",
})
const parents = [
  [`/results/${profileFixture.foundation.payload}`, "/quiz", "Foundation"],
  [`/zh/results/${profileFixture.foundation.payload}`, "/zh/quiz", "基础问卷"],
  ["/results/missing", "/quiz", "Take the Foundation"],
  [`/ai/results/${aiPayload}`, "/ai", "AI Governance"],
  ["/ai/field-guide", "/ai", "AI Governance"],
  ["/ai/atlas", "/ai", "AI Governance"],
  ["/ai/atlas/precautionarySteward", "/ai/atlas", "AI approaches"],
  ["/ai/results/missing", "/ai", "AI Governance"],
  ["/explore/reference", "/explore", "Library"],
  ["/explore/reference/susan-strange", "/explore/reference", "Thinkers"],
  ["/explore/reference/missing", "/explore/reference", "Thinkers"],
  ["/explore/realism", "/explore", "← Library"],
  ["/archetypes", "/explore", "Library"],
  [getArchetypePath("P+"), "/archetypes", "Foundation archetypes"],
  ["/explore/atlas/institution-builder", "/explore/atlas", "Worldview Map"],
  [`/cases/${caseRecord.slug}`, "/cases", "Cases"],
  [`/cases/${caseRecord.slug}/sources`, `/cases/${caseRecord.slug}`, caseRecord.title],
  [`/cases/${caseRecord.slug}/corrections`, `/cases/${caseRecord.slug}`, caseRecord.title],
  ["/decisions/who-gets-access", "/decisions", "All decisions"],
  ["/decisions/who-gets-to-verify", "/decisions", "All decisions"],
  [security.resultPath, "/modules/security", "Security"],
  [technology.resultPath, "/modules/technology", "Technology"],
  ["/modules/security/results/missing", "/modules/security", "Security"],
  ["/modules/technology/results/missing", "/modules/technology", "Technology"],
  [sharedPath, "/profile", "Profile"],
  ["/profile/share/missing", "/profile", "Open your Profile"],
  ["/compare", "/profile", "Profile"],
  ["/compare?left=missing", "/profile", "Profile"],
  [`/cases/${caseRecord.slug}/challenge`, "/cases", "Cases"],
  ["/futures/departure", "/futures", "All futures"],
  ["/futures/preferences", "/futures", "All futures"],
  ["/futures/scenarios/gatekeeper", "/futures", "All futures"],
  ["/futures/compare", "/futures", "All futures"],
  ["/zh/explore/reference", "/zh/explore", "观点资料"],
  ["/zh/explore/reference/susan-strange", "/zh/explore/reference", "思想家"],
  ["/zh/explore/reference/missing", "/zh/explore/reference", "思想家"],
  ["/zh/explore/atlas/institution-builder", "/zh/explore/atlas", "世界观地图"],
  [`/zh${sharedPath}`, "/zh/profile", "档案"],
  ["/zh/profile/share/missing", "/zh/profile", "档案"],
] as const

for (const width of [320, 390, 768, 1440]) test(`section links work on fresh deep links and recovery states at ${width}px`, async ({ browser }) => {
  test.setTimeout(180_000)
  const context = await browser.newContext({ viewport: { width, height: 900 } })
  for (const [route, parent, label] of parents) {
    // Each route starts in a fresh page with no earlier site history.
    const page = await context.newPage()
    const response = await page.goto(`${process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000"}${route}`)
    expect(response?.status(), route).toBe(200)
    const link = page.locator('main').getByRole("link", { name: label, exact: true }).first()
    await expect(link, route).toHaveAttribute("href", parent)
    await expect(link, route).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBeLessThanOrEqual(width + 1)
    if (route === sharedPath) {
      const labelsFit = await page.locator('.result-card-hero__modifiers').evaluate(element => {
        const container = element.getBoundingClientRect()
        return Array.from(element.children).every(label => {
          const bounds = label.getBoundingClientRect()
          return bounds.left >= container.left - 1 && bounds.right <= container.right + 1
        })
      })
      expect(labelsFit, 'Shared Profile labels stay within the card text area').toBe(true)
    }
    await page.close()
  }
  await context.close()
})

test("Field Guide keeps all powers and visible premises, with semantic header associations", async ({ page }) => {
  await page.goto("/ai/field-guide")
  await expect(page.locator('.ai-hero-summary')).toHaveText("A lab has built a powerful model. Releasing its weights would let others study and use it independently; keeping the weights inside the lab would limit that access. Who should decide, and what would justify their choice?")
  for (const heading of ["Original admission", "Revised admission", "Unchanged conditions"]) await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible()
  const table = page.getByRole("table", { name: "Where each AI approach would put the four powers" })
  await expect(table.locator('thead th[scope="col"]')).toHaveText(["Approach", "Inspect and release", "Restrict and stop"])
  await expect(table.locator('tbody th[scope="row"]')).toHaveText(["Precautionary Steward", "Strategic Competitor", "Coordination Architect", "Democratic Guardrailist", "State Capacity Builder", "Open Ecosystem Builder"])
  await expect(table.locator("td")).toHaveCount(12)
  const associations = await table.locator("td").evaluateAll(cells => cells.every(cell => {
    const ids = cell.getAttribute("headers")!.split(" ")
    return ids.length === 2 && ids.every(id => document.getElementById(id)?.tagName === "TH")
  }))
  expect(associations).toBe(true)
  await expect(table.locator("tbody td").first()).toHaveText(/Outside evaluators test for dangerous capability before release\. Release is staged and gated on those tests\.$/)
  await expect(table.locator("tbody td").last()).toHaveText(/Checks on gatekeepers and closed bottlenecks\. A stop imposed by incumbents on safety grounds is a claim to be tested\.$/)
  await page.locator('a[href="#powers"]').last().click()
  const bounds = await page.locator('#powers').boundingBox()
  const header = await page.locator('.site-header').boundingBox()
  expect(bounds!.y).toBeGreaterThanOrEqual(header!.height)
})

test("Field Guide is readable without JavaScript and in print", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await page.goto(`${process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000"}/ai/field-guide`)
  await expect(page.locator('#disagree')).toContainText("Weights remain inside the enclave.")
  await expect(page.locator('#disagree h3')).toHaveCount(10)
  await expect(page.locator('#powers tbody tr')).toHaveCount(6)
  await expect(page.locator('#axes')).toContainText("Each approach weights those positions differently; the comparison determines which result leads.")
  await expect(page.locator('#axes').getByRole('link', { name: 'Method', exact: true })).toHaveAttribute('href', '/method')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  await page.emulateMedia({ media: 'print' })
  await expect(page.locator('.ai-fg-anchorbar')).toBeHidden()
  await expect(page.locator('.ai-fg-rail')).toBeHidden()
  await expect(page.locator('#powers thead')).toBeVisible()
  await expect(page.locator('#powers td')).toHaveCount(12)
  await expect(page.getByRole('heading', { name: 'Unchanged conditions', exact: true })).toBeVisible()
  await context.close()
})

test("module parent navigation preserves the saved answers and resumes through root secondary links", async ({ page }) => {
  await page.goto('/privacy')
  await page.evaluate(({ key, store }) => localStorage.setItem(key, JSON.stringify(store)), { key: MODULE_DRAFT_STORAGE_KEY, store: security.store })
  await page.goto('/modules/security')
  await expect(page.locator('.quiz-shell-exit')).toHaveText('Security and Technology')
  await page.locator('.quiz-shell-exit').click()
  await expect(page).toHaveURL(/\/modules$/)
  await page.goto('/#menu')
  await page.locator('[data-root-group=questionnaires]').getByRole('link', { name: 'Security', exact: true }).click()
  await expect(page).toHaveURL(/\/modules\/security$/)
  const drafts = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).drafts, MODULE_DRAFT_STORAGE_KEY)
  expect(Object.values(drafts).some(value => JSON.stringify((value as { answers: unknown }).answers) === JSON.stringify(security.answers))).toBe(true)
})

test("the new Decisions parent performs the existing deliberate clear on exit", async ({ page }) => {
  await page.goto('/decisions/who-gets-access')
  await page.locator('input[name$="-arrangement"][value="weights"]').check()
  await page.getByRole('link', { name: 'All decisions', exact: true }).click()
  await expect(page).toHaveURL(/\/decisions$/)
  await page.goBack()
  await expect(page.locator('input[name$="-arrangement"]:checked')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Submit and see the changed condition' })).toBeDisabled()
})

test("Chinese navigation keeps unsupported surfaces behind the existing translation notice", async ({ page }) => {
  await page.goto('/zh/explore/reference')
  await page.locator('main').getByRole('link', { name: '观点资料', exact: true }).click()
  await expect(page).toHaveURL(/\/zh\/explore$/)
  await expect(page.locator('main')).not.toContainText('The traditions, readings')
  await expect(page.locator('main h1')).toHaveText("此页面的简体中文内容尚未通过编辑审校。")
  await expect(page.locator('main [lang="en"]')).toHaveCount(0)
})
