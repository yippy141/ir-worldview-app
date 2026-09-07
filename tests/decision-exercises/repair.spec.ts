import { expect, test, type Page } from "@playwright/test"
import { mkdirSync, writeFileSync } from "node:fs"
import { getPublishedDecision } from "@/lib/decision-exercises/catalog"

const evidence = "docs/evidence/decision-exercises-release/repair"
const verify = "/decisions/who-gets-to-verify"

// macOS WebKit defaults to Option+Tab for links; Chromium uses Tab.
const tabKey = (backwards = false) => `${test.info().project.use.browserName === "webkit" ? "Alt+" : ""}${backwards ? "Shift+" : ""}Tab`

// A bounded native traversal. It inspects focus, never assigns it.
async function tabTo(page: Page, selector: string, backwards = false) {
  for (let i = 0; i < 70; i++) {
    await page.keyboard.press(tabKey(backwards))
    if (await page.locator(selector).evaluateAll(es => es.some(e => e === document.activeElement))) return i + 1
  }
  throw new Error(`Native tab path did not reach ${selector}`)
}
async function focusVisible(page: Page) {
  const focus = await page.evaluate(() => {
    const e = document.activeElement!, s = getComputedStyle(e), r = e.getBoundingClientRect()
    return { tag: e.tagName, text: e.textContent, value: e.getAttribute("value"), visible: e.matches(":focus-visible"), outline: parseFloat(s.outlineWidth), left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: innerWidth, height: innerHeight }
  })
  expect(focus.visible).toBe(true)
  expect(focus.outline).toBeGreaterThanOrEqual(2)
  expect(focus.left).toBeGreaterThanOrEqual(0)
  expect(focus.right).toBeLessThanOrEqual(focus.width)
  expect(focus.top).toBeGreaterThanOrEqual(0)
  expect(focus.bottom).toBeLessThanOrEqual(focus.height)
  return focus
}

for (const width of [390, 1440]) test(`native keyboard path at ${width}px reaches navigation, both decisions, result and reset`, async ({ page }) => {
  mkdirSync(evidence, { recursive: true })
  await page.setViewportSize({ width, height: 900 })
  await page.goto(verify)
  const log = []
  const trigger = width < 720 ? ".mobile-nav-summary" : ".header-nav .nav-disclosure-summary"
  const disclosure = page.locator(width < 720 ? ".mobile-nav" : ".header-nav .nav-disclosure")
  await tabTo(page, trigger)
  log.push(await focusVisible(page))
  await page.keyboard.press("Enter")
  await page.keyboard.press(tabKey())
  await expect(disclosure.locator("a").first()).toBeFocused()
  log.push(await focusVisible(page))
  await page.keyboard.press("Escape")
  await expect(page.locator(trigger)).toBeFocused()
  await expect(disclosure).not.toHaveAttribute("open", "")
  await page.keyboard.press("Enter")
  await page.keyboard.press(tabKey(true))
  await expect(disclosure).not.toHaveAttribute("open", "") // focus can leave
  await page.keyboard.press(tabKey())
  await expect(page.locator(trigger)).toBeFocused()

  await tabTo(page, 'input[value="national"]')
  log.push(await focusVisible(page))
  await page.keyboard.press("Space")
  await page.keyboard.press("ArrowDown")
  await expect(page.locator('input[value="custodian"]')).toBeChecked()
  await page.keyboard.press("ArrowUp")
  await expect(page.locator('input[value="national"]')).toBeChecked()
  await page.keyboard.press(tabKey())
  await expect(page.locator('input[value="timely"]')).toBeFocused()
  await page.keyboard.press("Space")
  log.push(await focusVisible(page))
  await page.keyboard.press(tabKey())
  await expect(page.getByRole("button", { name: "Submit and see the changed condition" })).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("heading", { name: "Replay: one condition changes" })).toBeFocused()
  log.push(await focusVisible(page))
  await expect(page.getByText(/Now: Only Belvar's teams may inspect Arden/)).toBeVisible()

  await tabTo(page, 'input[value="national"]')
  await page.keyboard.press("ArrowDown")
  await expect(page.locator('input[value="custodian"]')).toBeChecked()
  await page.keyboard.press(tabKey())
  await page.keyboard.press("ArrowDown")
  await expect(page.locator('input[value="equal"]')).toBeChecked()
  await page.keyboard.press(tabKey()) // Back to original precedes submission
  await page.keyboard.press(tabKey())
  await expect(page.getByRole("button", { name: "Submit and read the interpretation" })).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("heading", { name: "Your decision under each condition" })).toBeFocused()
  log.push(await focusVisible(page))
  await expect(page.locator("[data-conditional-readback]")).toContainText("retained an external check while abandoning asymmetric national inspection")
  await page.screenshot({ path: `${evidence}/keyboard-result-${width}.png` })
  await tabTo(page, 'button:has-text("Back to replay")')
  await page.keyboard.press("Enter")
  await expect(page.getByRole("heading", { name: "Replay: one condition changes" })).toBeFocused()
  await tabTo(page, 'button:has-text("Reset and clear choices")')
  await page.keyboard.press("Enter")
  await expect(page.getByRole("heading", { name: "The original decision" })).toBeFocused()
  await expect(page.locator("input:checked")).toHaveCount(0)
  await expect(page.locator("[data-conditional-readback]")).toHaveCount(0)
  writeFileSync(`${evidence}/keyboard-${width}.json`, JSON.stringify(log, null, 2))
})

test("external consultation opens separately, preserves choices and leaves the ephemeral exit contract intact", async ({ page, context }) => {
  mkdirSync(evidence, { recursive: true })
  const requests: { method: string; url: string; body: string | null }[] = []
  context.on("request", r => requests.push({ method: r.method(), url: r.url(), body: r.postData() }))
  // Mock only the actual publisher URLs. Do not hide same-tab navigation with a global intercept.
  const sourceURLs = ["who-gets-to-verify", "who-gets-access"].map(slug => getPublishedDecision(slug)!.sources.find(s => /^https?:/.test(s.url))!.url)
  for (const url of sourceURLs) await context.route(url, r => r.fulfill({ contentType: "text/html", body: "<h1>Synthetic publisher response</h1>" }))
  await context.addInitScript(() => {
    const writes: string[] = []
    const original = Storage.prototype.setItem
    Storage.prototype.setItem = function (k, v) { writes.push(k); return original.call(this, k, v) }
    const open = indexedDB.open.bind(indexedDB)
    indexedDB.open = (...args) => { writes.push("indexedDB.open"); return open(...args) }
    Object.assign(window, { repairWrites: writes })
  })
  const storage = () => page.evaluate(async () => ({ local: { ...localStorage }, session: { ...sessionStorage }, cookie: document.cookie,
    databases: typeof indexedDB.databases === "function" ? await indexedDB.databases() : null,
    writes: (window as unknown as { repairWrites: string[] }).repairWrites }))
  const consultations = []
  for (const [slug, option, reason, url] of [
    ["who-gets-to-verify", "national", "timely", sourceURLs[0]],
    ["who-gets-access", "enclave", "scrutiny", sourceURLs[1]],
  ]) {
    await page.goto(`/decisions/${slug}`)
    await page.locator(`input[value="${option}"]`).check()
    await page.locator(`input[value="${reason}"]`).check()
    await page.getByText("Sources and fictional assumptions", { exact: true }).click()
    const link = page.locator("details[open] a").filter({ hasText: "opens in a new tab" }).first()
    await expect(link).toHaveAttribute("target", "_blank")
    await expect(link).toHaveAttribute("rel", "noopener noreferrer")
    await expect(link).toHaveAccessibleName(/opens in a new tab/)
    await expect(link).toHaveAttribute("href", url)
    const originalURL = page.url()
    const [popup] = await Promise.all([page.waitForEvent("popup"), link.click()])
    await popup.waitForLoadState()
    expect(popup.url()).toBe(url) // no appended answers, payload or person identifier
    expect(await popup.evaluate(() => window.opener === null)).toBe(true)
    expect(page.url()).toBe(originalURL)
    await expect(page.locator(`input[value="${option}"]`)).toBeChecked()
    await expect(page.locator(`input[value="${reason}"]`)).toBeChecked()
    await expect(popup.getByRole("heading", { name: "Synthetic publisher response" })).toBeVisible()
    const state = await storage()
    expect(state).toEqual({ local: {}, session: {}, cookie: "", databases: [], writes: [] })
    consultations.push({ slug, publisherURL: popup.url(), retained: [option, reason], state })
    await page.screenshot({ path: `${evidence}/source-consultation-${slug}.png` })
    await popup.close()
    await page.getByRole("button", { name: "Reset and clear choices" }).click()
    await expect(page.locator("input:checked")).toHaveCount(0)
    const internal = page.locator('details[open] a[href="/ai/field-guide"]')
    await expect(internal).toHaveAccessibleName(/leaves this exercise and clears choices/)
    await expect(internal).not.toHaveAttribute("target", "_blank")
    await page.locator(`input[value="${option}"]`).check()
    await page.locator(`input[value="${reason}"]`).check()
    await internal.click()
    await expect(page).toHaveURL(/\/ai\/field-guide$/)
    await page.goBack()
    await expect(page.locator("input:checked")).toHaveCount(0)
  }
  await page.goto(verify)
  const choose = async () => {
    await page.locator('input[value="national"]').check()
    await page.locator('input[value="timely"]').check()
  }
  await choose()
  await page.getByRole("link", { name: "Close exercise and clear choices" }).click()
  await page.goBack()
  await expect(page.locator("input:checked")).toHaveCount(0)
  await choose()
  await page.getByRole("button", { name: "Submit and see the changed condition" }).click()
  await choose()
  await page.getByRole("button", { name: "Submit and read the interpretation" }).click()
  await page.getByRole("link", { name: /Next decision:/ }).click()
  await page.goBack()
  await expect(page.locator("input:checked")).toHaveCount(0)
  await expect(page.locator("[data-conditional-readback]")).toHaveCount(0)
  await choose()
  await page.locator('.header-nav a[href="/cases"]').click()
  await page.goBack()
  await expect(page.locator("input:checked")).toHaveCount(0)
  expect(await storage()).toEqual({ local: {}, session: {}, cookie: "", databases: [], writes: [] })
  expect(requests.every(r => ["GET", "HEAD"].includes(r.method) && r.body === null)).toBe(true)
  expect(requests.map(r => r.url).join("\n")).not.toMatch(/reason=|option=|timely|custodian|\/api\/|\/_vercel\//)
  writeFileSync(`${evidence}/source-consultation.json`, JSON.stringify({ consultations, requests }, null, 2))
})
