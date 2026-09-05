import { test, expect, type Page } from "@playwright/test"
import { mkdirSync, writeFileSync } from "node:fs"

const evidenceDir = "docs/experiments/result-payoff/screenshots"
const route = "/dev/result-payoff"
const sizes = [{ width: 1440, height: 900 }, { width: 390, height: 844 }]
async function capture(page: Page, name: string, fullPage = false) {
  mkdirSync(evidenceDir, { recursive: true })
  await page.screenshot({ path: `${evidenceDir}/${name}.png`, fullPage, animations: "disabled" })
}
async function choose(page: Page, arrangement: string, reason: string) {
  await page.getByRole("radio", { name: new RegExp(`^${arrangement}`) }).check()
  await page.getByRole("radio", { name: reason, exact: true }).check()
}
async function continueDecision(page: Page) {
  await page.getByRole("button", { name: "Submit and see the changed condition" }).click()
}
async function finish(page: Page) {
  await page.getByRole("button", { name: "Submit and read the interpretation" }).click()
  await expect(page.getByRole("heading", { name: "Your decision under each condition" })).toBeVisible()
}

test("all result fixtures retain real evidence, responsive screenshots, and low separation", async ({ page }) => {
  for (const size of sizes) {
    await page.setViewportSize(size)
    for (const fixture of ["foundation", "ai", "missing"]) {
      await page.goto(`${route}?fixture=${fixture}`)
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator("h1")).toHaveCount(1)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      if (fixture === "foundation") {
        await expect(page.getByText("Shi (勢)–Concert", { exact: true })).toBeVisible()
        await expect(page.locator("[data-foundation-mark=blend]")).toBeVisible()
        await expect(page.getByText(/Two live readings:/)).toBeVisible()
        await page.getByRole("link", { name: /See the three answers together/ }).click()
        await expect(page.getByRole("heading", { name: "Prepare for rivalry. Make agreements work." })).toBeVisible()
        await page.evaluate(() => scrollTo(0, 0))
      } else if (fixture === "ai") {
        await expect(page.getByRole("heading", { name: "Delay a dangerous release. Keep outside testing possible." })).toBeVisible()
        await expect(page.getByText("This example expects rivalry and gives coordination priority.")).toBeVisible()
      } else {
        await expect(page.getByRole("heading", { name: "The score cannot tell us why." })).toBeVisible()
        await expect(page.locator("[data-foundation-mark]")).toHaveCount(0)
      }
      await capture(page, `${size.width}-${fixture}`)
      await capture(page, `${size.width}-${fixture}-full`, true)
    }
  }
})

for (const size of sizes) {
  test(`${size.width}: two episode-first paths and ordered changed-choice evidence`, async ({ page }) => {
    await page.setViewportSize(size)
    for (const episode of ["verify", "access"]) {
      await page.goto(`${route}?episode=${episode}`)
      await expect(page.getByRole("button", { name: "Submit and see the changed condition" })).toBeDisabled()
      if (episode === "verify") await choose(page, "National inspection teams", "Get timely, first-hand evidence at declared sites.")
      else await choose(page, "Qualified external evaluation", "Enable criticism the developer cannot veto.")
      await expect(page.getByRole("heading", { name: "The original decision" })).toBeVisible()
      await capture(page, `${size.width}-${episode}-a-original`, true)
      await continueDecision(page)
      await expect(page.getByRole("heading", { name: "Replay: one condition changes" })).toBeVisible()
      if (episode === "verify") await choose(page, "A neutral technical custodian", "Make the right to inspect reciprocal.")
      else await choose(page, "Publish the model weights", "Enable independent reproduction and modification.")
      await capture(page, `${size.width}-${episode}-b-replay`, true)
      await finish(page)
      await expect(page.getByText("Arrangement changed", { exact: true })).toBeVisible()
      await expect(page.getByText(episode === "verify" ? /You selected National inspection teams under/ : /You selected Qualified external evaluation under/)).toBeVisible()
      await capture(page, `${size.width}-${episode}-c-finding`, true)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
  })
}

test("returning reader opens access directly, no retake and inspectable synthetic history", async ({ page }) => {
  for (const size of sizes) {
    await page.setViewportSize(size)
    await page.goto(`${route}?fixture=returning`)
    await expect(page.getByRole("heading", { name: "Who gets access?", exact: true })).toBeVisible()
    await expect(page.getByText(/Synthetic prior completion:/)).toBeVisible()
    await capture(page, `${size.width}-returning`)
    await page.getByText("Inspect fictional prior completion", { exact: true }).click()
    await expect(page.getByText(/These are authored fixture selections, not yours/)).toBeVisible()
  }
  await choose(page, "Qualified external evaluation", "Keep the ability to limit access if a new hazard appears.")
  await continueDecision(page)
  await choose(page, "Qualified external evaluation", "Enable criticism the developer cannot veto.")
  await finish(page)
  await expect(page.getByText("Arrangement unchanged", { exact: true })).toBeVisible()
  await expect(page.getByText(/Original principal reason:/)).toContainText("Keep the ability to limit access")
  await expect(page.getByText(/Replay principal reason:/)).toContainText("Enable criticism")
})

test("unchanged verification, reversible navigation, reset clears both decisions", async ({ page }) => {
  await page.goto(`${route}?fixture=episode-first`)
  await choose(page, "A neutral technical custodian", "Keep sensitive records away from foreign governments.")
  await continueDecision(page)
  await choose(page, "A neutral technical custodian", "Keep sensitive records away from foreign governments.")
  await finish(page)
  await expect(page.getByText("Arrangement unchanged", { exact: true })).toBeVisible()
  await expect(page.getByText(/Your arrangement stayed the same/)).toBeVisible()
  await page.getByRole("button", { name: "Back to replay" }).click()
  await expect(page.getByRole("radio", { name: /^A neutral technical custodian/ })).toBeChecked()
  await page.getByRole("button", { name: "Back to original" }).click()
  await expect(page.getByRole("radio", { name: /^A neutral technical custodian/ })).toBeChecked()
  await page.getByRole("button", { name: "Reset and clear choices" }).click()
  await expect(page.locator("input:checked")).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Submit and see the changed condition" })).toBeDisabled()
  await choose(page, "National inspection teams", "Get timely, first-hand evidence at declared sites.")
  await page.getByRole("link", { name: "Close exercise and clear choices" }).click()
  await page.goBack()
  await expect(page.locator("input:checked")).toHaveCount(0)
})

test("optional reflections report submitted inputs separately and clear cleanly", async ({ page }) => {
  await page.goto(`${route}?fixture=ai`)
  await page.getByRole("radio", { name: "Sustained rivalry", exact: true }).check()
  await page.getByRole("radio", { name: "Keeping the capability advantage", exact: true }).check()
  await page.getByRole("button", { name: "Read the pair" }).click()
  await expect(page.getByRole("status")).toContainText("You expect: Sustained rivalry. Your stated priority: Keeping the capability advantage.")
  await page.getByRole("button", { name: "Clear reflection" }).click()
  await expect(page.locator("input:checked")).toHaveCount(0)
  await expect(page.getByRole("status")).toHaveCount(0)
  await page.goto(`${route}?fixture=missing`)
  await page.getByRole("radio", { name: "Each government has the same right to inspect" }).check()
  await page.getByRole("button", { name: "Read this condition" }).click()
  await expect(page.getByRole("status")).toContainText("Each government has the same right to inspect")
})

test("keyboard, reduced motion, 320/390/768 reflow and no-JS fixture evidence", async ({ browser, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto(`${route}?episode=access`)
  const radio = page.getByRole("radio", { name: /^Publish the model weights/ })
  await radio.focus(); await page.keyboard.press("Space")
  await expect(radio).toBeChecked()
  const reason = page.getByRole("radio", { name: "Enable independent reproduction and modification." })
  await reason.focus(); await page.keyboard.press("Space")
  const next = page.getByRole("button", { name: "Submit and see the changed condition" })
  await next.focus()
  expect(await next.evaluate(el => getComputedStyle(el).outlineStyle)).toBe("solid")
  await page.keyboard.press("Enter")
  await expect(page.locator("h1")).toBeFocused()
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await capture(page, "768-reduced-motion", true)
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
  const noJs = await context.newPage()
  for (const fixture of ["foundation", "ai", "missing", "episode-first"]) {
    await noJs.goto(`http://127.0.0.1:3227${route}?fixture=${fixture}`)
    await expect(noJs.locator("h1")).toBeVisible()
    await expect(noJs.locator("noscript").first()).toBeVisible()
    expect(await noJs.locator('input[type="radio"]:visible').count()).toBe(0)
  }
  await noJs.goto(`http://127.0.0.1:3227${route}?fixture=foundation`)
  await noJs.getByText("Basis for this interpretation", { exact: true }).first().click()
  await expect(noJs.getByText("foundation-cooperation-with-preparation", { exact: true })).toBeVisible()
  await capture(noJs, "390-foundation-no-js", true)
  await context.close()
})

test("no answer-bearing requests, URL changes, persistent writes or personal profile reads", async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await context.addInitScript(() => {
    const audit = { reads: [] as string[], writes: [] as { kind: string; key: string; value: string }[] }
    Object.assign(window, { payoffAudit: audit })
    const get = Storage.prototype.getItem
    Storage.prototype.getItem = function(key) { audit.reads.push(key); return get.call(this, key) }
    const set = Storage.prototype.setItem
    Storage.prototype.setItem = function(key, value) { audit.writes.push({ kind: this === window.localStorage ? "local" : "session", key, value }); return set.call(this, key, value) }
  })
  const requests: { url: string; method: string; body: string | null }[] = []
  page.on("request", request => requests.push({ url: request.url(), method: request.method(), body: request.postData() }))
  await page.goto(`http://127.0.0.1:3227${route}?episode=verify`)
  await page.waitForFunction(() => (window as unknown as { payoffAudit: { writes: unknown[] } }).payoffAudit.writes.length > 0)
  const beforeVerify = await page.evaluate(() => JSON.stringify((window as unknown as { payoffAudit: unknown }).payoffAudit))
  const originalUrl = page.url()
  await choose(page, "National inspection teams", "Get timely, first-hand evidence at declared sites.")
  await continueDecision(page)
  await choose(page, "A neutral technical custodian", "Make the right to inspect reciprocal.")
  await finish(page)
  expect(page.url()).toBe(originalUrl)
  expect(await page.evaluate(() => JSON.stringify((window as unknown as { payoffAudit: unknown }).payoffAudit))).toBe(beforeVerify)
  await page.getByRole("link", { name: /Next decision: Who gets access/ }).click()
  await page.waitForFunction(() => (window as unknown as { payoffAudit: { writes: unknown[] } }).payoffAudit.writes.length > 0)
  const beforeAccess = await page.evaluate(() => JSON.stringify((window as unknown as { payoffAudit: unknown }).payoffAudit))
  await choose(page, "Qualified external evaluation", "Enable criticism the developer cannot veto.")
  await continueDecision(page)
  await choose(page, "Publish the model weights", "Enable independent reproduction and modification.")
  await finish(page)
  expect(page.url()).toBe(`http://127.0.0.1:3227${route}?episode=access`)
  const audit = await page.evaluate(() => (window as unknown as { payoffAudit: { reads: string[]; writes: { kind: string; key: string; value: string }[] } }).payoffAudit)
  expect(audit.reads).toEqual([])
  expect(JSON.stringify(audit)).toBe(beforeAccess)
  // Next 16 dev debug-channel.js caches initial server-debug chunks in sessionStorage.
  // It is present before input; both whole-exercise checkpoints must stay identical.
  expect(audit.writes.every(w => w.kind === "session" && w.key.startsWith("__next_debug_channel:"))).toBe(true)
  expect(await context.storageState()).toEqual({ cookies: [], origins: [] })
  expect(requests.filter(r => r.method !== "GET" || r.body)).toEqual([])
  expect(requests.some(r => /api\/analytics|api\/research|api\/aggregate/.test(r.url))).toBe(false)
  expect(requests.every(r => new URL(r.url).hostname === "127.0.0.1")).toBe(true)
  expect(requests.some(r => /timely|scrutiny|custodian|weights|gp1|gp2/.test(r.url))).toBe(false)
  writeFileSync("docs/experiments/result-payoff/privacy-check.json", JSON.stringify({ syntheticOnly: true, requests, audit: { reads: audit.reads, writes: audit.writes.map(w => ({ kind: w.kind, key: "__next_debug_channel:<development-request>", frameworkOnly: true })), noChangesDuringEitherExercise: true }, storage: await context.storageState() }, null, 2))
  await page.reload()
  await expect(page.locator("input:checked")).toHaveCount(0)
  await context.close()
})

test("production 404 and representative public routes unaffected", async ({ request }) => {
  for (const query of ["", "?fixture=ai", "?episode=verify", "?episode=access", "?fixture=returning"]) {
    const response = await request.get(`http://127.0.0.1:3228${route}${query}`)
    expect(response.status()).toBe(404)
    expect(await response.text()).not.toContain("Cooperation does not require confidence")
  }
  for (const path of ["/", "/quiz", "/ai", "/profile", "/futures", "/method", "/explore/atlas"]) {
    const response = await request.get(`http://127.0.0.1:3228${path}`)
    expect(response.status(), path).toBe(200)
    expect(await response.text()).not.toContain("/dev/result-payoff")
  }
  const futures = await request.get("http://127.0.0.1:3228/futures")
  const html = await futures.text()
  expect(html).toContain("trajectory-gatekeeper")
  expect(html).toContain("trajectory-libertarian-market")
})
