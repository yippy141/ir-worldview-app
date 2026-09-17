import { expect, test, type Page } from "@playwright/test"
import { foundationToken, aiFixture, moduleToken, syntheticProfile } from "../tests/connected-fixtures"
import { PROFILE_STORAGE_KEY } from "../lib/storage-keys"
import { serializeProfileStore } from "../lib/profile-store"
import { buildCompatibleProfileSharePayload, encodeProfileSharePayload } from "../lib/profile-share"

// Every context is isolated. Diagnostics never submit production writes.
test.beforeEach(async ({ context }) => {
  await context.route("**/*", route => route.request().method() === "GET" || route.request().method() === "HEAD" ? route.continue() : route.abort())
})
async function fillPair(page: Page, left: string, right: string) {
  const fields = page.locator(".compare-textarea")
  await fields.nth(0).fill(left); await fields.nth(1).fill(right)
  await page.getByRole("button", { name: "Compare results", exact: true }).click()
}
async function knownAi(page: Page) {
  for (const field of await page.locator(".compare-person").all()) {
    await field.locator("summary").click()
    await field.getByLabel("AI form").selectOption("standard")
    await field.getByLabel("The original completion used English wording edition 1").check()
  }
}
async function fits(page: Page) { expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1) }

test("identical and tiny pairs, differing pair, ties, signs and names survive swap", async ({ page }) => {
  await page.goto("/compare")
  const a = foundationToken([6,2,4,4,4,4,4]), b = foundationToken([5,3,4,4,4,4,4])
  await fillPair(page, a, a)
  await expect(page.locator("[data-comparison-state=identical]")).toContainText("The supplied scores match")
  await expect(page.locator("#comparison-heading")).toBeFocused()
  await fillPair(page, foundationToken([3.99,4,4,4,4,4,4]), foundationToken([4.01,4,4,4,4,4,4]))
  await expect(page.locator("[data-comparison-state=small]")).toContainText("do not establish a disagreement")
  await page.getByLabel("Display name (optional)").nth(0).fill("Morgan")
  await page.getByLabel("Display name (optional)").nth(1).fill("Taylor")
  await fillPair(page, a, b)
  await expect(page.locator(".comparison-lead")).toContainText("gaps are tied")
  await expect(page.locator("tbody tr").first()).toContainText("1: Reassurance · 7: Rivalry")
  await expect(page.locator(".comparison-domain")).toContainText("institutional limit")
  const values = await page.locator("tbody tr").first().locator("td").allTextContents()
  await page.getByRole("button", { name: "Swap people" }).click()
  await expect(page.locator("#comparison-heading")).toHaveText("Taylor and Morgan")
  expect(await page.locator("tbody tr").first().locator("td").allTextContents()).toEqual(values.reverse())
  await page.getByRole("button", { name: "Reset comparison" }).click()
  await expect(page.locator(".compare-textarea").first()).toBeFocused()
  await expect(page.locator(".comparison-output")).toHaveCount(0)
})
test("AI-only, module-only, missing, unknown, incompatible and invalid inputs", async ({ page }) => {
  await page.goto("/compare")
  const ai = aiFixture().token
  await fillPair(page, ai, ai)
  await expect(page.locator(".comparison-lead")).toContainText("not fully known")
  await knownAi(page)
  await page.getByRole("button", { name: "Compare results", exact: true }).click()
  await expect(page.locator("[data-comparison-state=identical]")).toContainText("AI Governance")
  await fillPair(page, moduleToken("technology"), moduleToken("technology", 1))
  await expect(page.locator(".comparison-domain")).toContainText("supplied choices")
  await fillPair(page, moduleToken("technology"), moduleToken("technology", 1, "analyst"))
  await expect(page.locator(".comparison-lead")).toContainText("forms or languages differ")
  await expect(page.locator(".comparison-table")).toHaveCount(0)
  await fillPair(page, ai, foundationToken())
  await expect(page.locator(".comparison-domain")).toHaveCount(2)
  await expect(page.locator(".comparison-domain").first()).toContainText("Only one person")
  await fillPair(page, "https://unrecognized.example/result", ai)
  await expect(page.locator(".connected-compare [role=alert]")).toBeVisible()
})
test("new comparison inputs and names produce no requests, URL state or persistent storage", async ({ page }) => {
  await page.goto("/compare")
  await expect(page.getByRole("button", { name: "Compare results", exact: true })).toBeEnabled()
  await page.waitForLoadState("networkidle")
  const before = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }))
  const requests: string[] = []
  page.on("request", r => requests.push(`${r.url()} ${r.postData() ?? ""}`))
  const token = aiFixture(81).token
  const hostileName = "<img src=x onerror=alert(1)>"
  await page.getByLabel("Display name (optional)").first().fill(hostileName)
  await fillPair(page, token, token)
  await expect(page.locator("#comparison-heading")).toContainText(hostileName)
  await expect(page.locator("#comparison-heading img")).toHaveCount(0)
  expect(requests.some(r => r.includes(token) || r.includes(hostileName))).toBe(false)
  expect(new URL(page.url()).search).toBe("")
  expect(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }))).toEqual(before)
  await page.getByRole("link", { name: "Try a decision together" }).click()
  await page.goBack()
  await expect(page.locator(".comparison-output")).toHaveCount(0)
})
test("connected Profile exposes sources, corrections and a clearing unscored reflection; saved comparison is selective", async ({ page }) => {
  await page.goto("/privacy")
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), { key: PROFILE_STORAGE_KEY, value: serializeProfileStore(syntheticProfile().profile) })
  await page.goto("/profile")
  await expect(page.locator("[data-relation]")).toHaveCount(3)
  await expect(page.getByText("Public authority and practical capacity", { exact: true })).toBeVisible()
  await page.getByRole("button", { name: "That is not what I meant" }).first().click()
  await page.getByLabel("What should someone understand differently?").fill("Synthetic correction")
  await page.getByRole("button", { name: "Set this interpretation aside" }).click()
  await expect(page.locator(".connected-relation").first()).toContainText("You set this interpretation aside")
  await page.getByLabel("Publication rights", { exact: true }).check()
  const storage = await page.evaluate(() => JSON.stringify({ ...localStorage }))
  expect(storage).not.toContain("Synthetic correction")
  await page.getByRole("link", { name: "compare a result with someone" }).click()
  await page.getByRole("button", { name: "Use my saved result" }).click()
  await page.getByLabel("Choose one result to include").selectOption("technology")
  await page.locator(".compare-textarea").nth(1).fill(moduleToken("technology", 1))
  await page.getByRole("button", { name: "Compare results", exact: true }).click()
  await expect(page.locator(".comparison-domain")).toHaveCount(1)
  await expect(page.locator(".comparison-domain > h3")).toHaveText("Technology")
  await page.goBack()
  await expect(page.getByLabel("Publication rights", { exact: true })).not.toBeChecked()
})
test("historical comparison links remain readable and disclose their original request exposure", async ({ page }) => {
  const shared = encodeProfileSharePayload(buildCompatibleProfileSharePayload(syntheticProfile().profile)!)
  await page.goto(`/compare?left=${shared}&right=${shared}`)
  await expect(page.locator(".comparison-output")).toBeVisible()
  await expect(page.getByRole("note")).toContainText("already sent its contents to the server")
  expect(new URL(page.url()).search).toBe("")
})
test("phone reflow and keyboard access", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 850 })
  await page.goto("/compare")
  await fillPair(page, foundationToken(), foundationToken([2,6,5,3,4,2,6]))
  await fits(page)
  await page.locator(".comparison-domain summary").focus()
  await page.keyboard.press("Enter")
  await expect(page.locator(".comparison-domain details")).toHaveAttribute("open")
  await page.getByRole("button", { name: "Reset comparison" }).focus(); await page.keyboard.press("Enter")
  await expect(page.locator(".compare-textarea").first()).toBeFocused()
})
