import { test, expect, type Page } from "@playwright/test"
import { mkdirSync, writeFileSync } from "node:fs"

const evidenceDir = "docs/experiments/result-payoff/screenshots/amendment"
const route = "/dev/result-payoff"
const sizes = [{ width: 1440, height: 900 }, { width: 390, height: 844 }]
async function capture(page: Page, name: string, fullPage = false, motion = false) {
  mkdirSync(evidenceDir, { recursive: true })
  await page.screenshot({ path: `${evidenceDir}/${name}.png`, fullPage, animations: motion ? "allow" : "disabled" })
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
        await expect(page.getByText(/Two modeled readings remain close:/)).toBeVisible()
        await page.getByRole("link", { name: /See the three answers together/ }).click()
        await expect(page.getByRole("heading", { name: "Preparation, agreements and limits" })).toBeVisible()
        await page.evaluate(() => scrollTo(0, 0))
      } else if (fixture === "ai") {
        await expect(page.getByRole("heading", { name: "Stewardship" })).toBeVisible()
        await expect(page.getByText("This example expects rivalry and gives coordination priority.")).toBeVisible()
      } else {
        await expect(page.getByRole("heading", { name: "The score cannot tell us why." })).toBeVisible()
        await expect(page.locator("[data-foundation-mark]")).toHaveCount(0)
      }
      await capture(page, `${size.width}-${fixture}`)
      await capture(page, `${size.width}-${fixture}-full`, true)
      if (fixture === "foundation") {
        const dimensions = await page.locator("[data-mark-base] .archetype-mark").evaluateAll(marks => marks.map(m => m.getBoundingClientRect().width))
        expect(dimensions).toEqual(size.width === 390 ? [116, 116] : [176, 176])
        const action = await page.locator("header a").boundingBox()
        expect(action!.y + action!.height).toBeLessThan(size.height)
      }
      for (const width of [320, 768]) {
        await page.setViewportSize({ width, height: 844 })
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      }
      await page.setViewportSize(size)
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
      await expect(page.getByText("Arrangement changed", { exact: false }).first()).toBeVisible()
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
  await expect(page.getByText("Arrangement unchanged", { exact: false }).first()).toBeVisible()
  await expect(page.getByText(/Original principal reason:/)).toContainText("Keep the ability to limit access")
  await expect(page.getByText(/Replay principal reason:/)).toContainText("Enable criticism")
})

test("unchanged verification, reversible navigation, reset clears both decisions", async ({ page }) => {
  await page.goto(`${route}?fixture=episode-first`)
  await choose(page, "A neutral technical custodian", "Keep sensitive records away from foreign governments.")
  await continueDecision(page)
  await choose(page, "A neutral technical custodian", "Keep sensitive records away from foreign governments.")
  await finish(page)
  await expect(page.getByText("Arrangement unchanged", { exact: false }).first()).toBeVisible()
  await expect(page.locator("[data-conditional-readback]")).toContainText("custodian's access remains reciprocal in both conditions")
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
    expect(await response.text()).not.toContain("data-hero-marks")
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


test("valid counterexamples and equal-score AI pairs get truthful alternative states", async ({ page }) => {
  await page.goto(`${route}?fixture=counterexample`)
  await expect(page.getByRole("heading", { name: "These answers need another reading." })).toBeVisible()
  await expect(page.getByText(/These complete answers do not support this authored reading/)).toBeVisible()
  await expect(page.locator("[data-hero-marks]")).toHaveCount(0)
  for (const fixture of ["ai-pair-low", "ai-pair-mid"]) {
    await page.goto(`${route}?fixture=${fixture}`)
    await expect(page.getByRole("heading", { name: "Stewardship" })).toBeVisible()
    await expect(page.getByText(/These recorded answers do not endorse both/)).toBeVisible()
    await expect(page.getByText("This example expects rivalry and gives coordination priority.")).toHaveCount(0)
    await expect(page.getByText("ai-rivalry-and-coordination", { exact: true })).toHaveCount(0)
    await expect(page.getByText("Core geopolitics:", { exact: false })).not.toBeVisible()
  }
})

test("editing an earlier submitted answer invalidates the downstream comparison", async ({ page }) => {
  await page.goto(`${route}?episode=access`)
  await choose(page, "Qualified external evaluation", "Enable criticism the developer cannot veto.")
  await continueDecision(page)
  await choose(page, "Publish the model weights", "Enable independent reproduction and modification.")
  await finish(page)
  await page.getByRole("button", { name: "Back to replay" }).click()
  await page.getByRole("button", { name: "Back to original" }).click()
  await choose(page, "Hosted service with internal evaluation", "Keep the evaluation workload within the institute's capacity.")
  await expect(page.locator("[data-conditional-readback]")).toHaveCount(0)
  await expect(page.getByRole("status")).toContainText("replay was cleared")
  await continueDecision(page)
  await expect(page.locator("input:checked")).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Submit and read the interpretation" })).toBeDisabled()
  await choose(page, "Qualified external evaluation", "Keep the ability to limit access if a new hazard appears.")
  await finish(page)
  await expect(page.locator("[data-conditional-readback]")).toContainText("added qualified access to the model's internals")
  await expect(page.getByText(/Original principal reason:/)).toContainText("workload")
  await expect(page.getByText(/Replay principal reason:/)).toContainText("limit access")
})

test("unsupported reasons and withheld decisions continue without forced attribution", async ({ page }) => {
  await page.goto(`${route}?episode=verify`)
  await choose(page, "I need more information or revised terms", "None of these quite describes my reason.")
  await continueDecision(page)
  await choose(page, "A neutral technical custodian", "None of these quite describes my reason.")
  await finish(page)
  await expect(page.locator("[data-conditional-readback]")).toContainText("no two-policy comparison")
  await expect(page.locator("[data-conditional-readback]")).toContainText("choices alone do not supply that missing rationale")
  await page.goto(`${route}?episode=access`)
  await choose(page, "Publish the model weights", "Keep the ability to limit access if a new hazard appears.")
  await continueDecision(page)
  await choose(page, "Publish the model weights", "Keep the ability to limit access if a new hazard appears.")
  await finish(page)
  await expect(page.getByText(/Released weights cannot be recalled or access revoked/).first()).toBeVisible()
  await expect(page.locator("[data-conditional-readback]")).toContainText("new veto does not govern this arrangement")
})

test("inspection edges and admission control represent rights, not unchanged arrows", async ({ page }) => {
  await page.goto(`${route}?episode=verify`)
  await expect(page.getByText("Proposed national inspection rights", { exact: true })).toBeVisible()
  await expect(page.locator("[data-inspection-edge=allowed]")).toHaveCount(2)
  await choose(page, "National inspection teams", "Get timely, first-hand evidence at declared sites.")
  await continueDecision(page)
  await expect(page.locator("[data-inspection-edge=allowed]")).toHaveCount(1)
  await expect(page.locator("[data-inspection-edge=blocked]")).toHaveCount(1)
  await expect(page.getByText("Arden may not inspect Belvar.", { exact: true })).toBeVisible()
  await choose(page, "A neutral technical custodian", "Make the right to inspect reciprocal.")
  await expect(page.locator("[data-inspection-edge=blocked]")).toHaveCount(0)
  await expect(page.getByText("Custodian access to both sides remains reciprocal.")).toBeVisible()
  await page.goto(`${route}?episode=access`)
  await expect(page.locator("[data-admissions=independent]")).toBeVisible()
  await choose(page, "Qualified external evaluation", "Enable criticism the developer cannot veto.")
  await continueDecision(page)
  await expect(page.locator("[data-admissions=developer]")).toBeVisible()
  await expect(page.getByText(/Fixed rights for admitted teams:/)).toContainText("publish criticism")
})

for (const size of sizes) {
  test(`${size.width}: specific conditional findings captured`, async ({ page }) => {
    await page.setViewportSize(size)
    const paths = [
      { id: "verify", name: "unaffected", a: "A neutral technical custodian", b: "A neutral technical custodian", r1: "Make the right to inspect reciprocal.", r2: "Make the right to inspect reciprocal.", finding: "custodian's access remains reciprocal in both conditions" },
      { id: "access", name: "same-choice-new-reason", a: "Qualified external evaluation", b: "Qualified external evaluation", r1: "Keep the ability to limit access if a new hazard appears.", r2: "Enable criticism the developer cannot veto.", finding: "decision stayed the same, while your stated rationale moved" },
      { id: "access", name: "enclave-to-hosted", a: "Qualified external evaluation", b: "Hosted service with internal evaluation", r1: "Enable criticism the developer cannot veto.", r2: "Keep the ability to limit access if a new hazard appears.", finding: "not a blanket rejection of outside criticism" },
    ]
    for (const path of paths) {
      await page.goto(`${route}?episode=${path.id}`)
      await choose(page, path.a, path.r1); await continueDecision(page)
      await choose(page, path.b, path.r2); await finish(page)
      await expect(page.locator("[data-conditional-readback]")).toContainText(path.finding)
      await capture(page, `${size.width}-${path.name}`, true)
    }
  })
}

test("marks: initial, partial, completed, interrupted, print and reduced-motion composition", async ({ page, browser, request }) => {
  const html = await (await request.get(`${route}?fixture=foundation`)).text()
  expect(html).toContain('data-motion="unstarted"')
  expect(html).toContain('data-foundation-mark="blend"')
  for (const fixture of ["foundation", "ai"]) {
    await page.goto(`${route}?fixture=${fixture}`)
    await page.evaluate(() => document.fonts.ready)
    const marks = page.locator("[data-hero-marks]")
    await expect(marks).toHaveAttribute("data-motion", "complete")
    await page.getByRole("button", { name: "Replay animation" }).click()
    await expect(marks).toHaveAttribute("data-motion", "drawing")
    await page.evaluate(async () => {
      const animations = document.getAnimations()
      animations.forEach(a => a.pause())
      await Promise.all(animations.map(a => a.ready))
      animations.forEach(a => { a.currentTime = 400 })
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    })
    expect(await marks.locator("[data-mark-base]").evaluate(e => Number(getComputedStyle(e).opacity))).toBeCloseTo(.42, 2)
    expect(await marks.locator("[data-stroke-mask]").evaluateAll(paths => paths.some(p => parseFloat(getComputedStyle(p).strokeDashoffset) > 30))).toBe(true)
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.locator("header a")).toBeEnabled()
    if (fixture === "foundation") {
      await page.waitForTimeout(50) // allow the paused SVG mask to paint before compositor capture
      await page.screenshot({ path: `${evidenceDir}/1440-strokes-partial-400ms.png`, animations: "allow" })
    }
    await expect(marks).toHaveAttribute("data-motion", "drawing")
    expect(await marks.locator("[data-mark-base]").evaluate(e => Number(getComputedStyle(e).opacity))).toBeCloseTo(.42, 2)
    await page.evaluate(() => document.getAnimations().forEach(a => a.play()))
    await expect(marks).toHaveAttribute("data-motion", "complete")
    if (fixture === "foundation") await capture(page, "1440-strokes-final")
    expect(await marks.locator("[data-mark-base]").evaluate(e => getComputedStyle(e).opacity)).toBe("1")
    await page.getByRole("button", { name: "Replay animation" }).click()
    await page.evaluate(() => document.getAnimations().forEach(a => a.cancel()))
    await expect(marks).toHaveAttribute("data-motion", "complete")
    expect(await marks.locator("[data-mark-base]").evaluate(e => getComputedStyle(e).opacity)).toBe("1")
    const shapeBefore = await marks.locator("[data-mark-base]").innerHTML()
    await page.getByRole("button", { name: "Replay animation" }).click()
    await expect(marks).toHaveAttribute("data-motion", "drawing")
    await page.emulateMedia({ media: "print" })
    expect(await marks.locator("[data-mark-base]").innerHTML()).toBe(shapeBefore)
    expect(await marks.locator("[data-mark-base]").evaluate(e => getComputedStyle(e).opacity)).toBe("1")
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")))
    await expect(marks).toHaveAttribute("data-motion", "complete")
    await capture(page, `1440-${fixture}-print`)
    await page.emulateMedia({ media: "screen", reducedMotion: "reduce" })
    await page.getByRole("button", { name: "Replay animation" }).click()
    await expect(marks).toHaveAttribute("data-motion", "complete")
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0)
    expect(await marks.locator("[data-mark-base]").innerHTML()).toBe(shapeBefore)
    await page.emulateMedia({ reducedMotion: "no-preference" })
  }
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
  const noJs = await context.newPage()
  for (const fixture of ["foundation", "ai"]) {
    await noJs.goto(`http://127.0.0.1:3227${route}?fixture=${fixture}`)
    await expect(noJs.locator("[data-hero-marks]")).toHaveAttribute("data-motion", "unstarted")
    expect(await noJs.locator("[data-mark-base]").evaluate(e => getComputedStyle(e).opacity)).toBe("1")
    await expect(noJs.getByRole("heading", { name: fixture === "foundation" ? "Shi (勢)–Concert" : "Stewardship", exact: true })).toBeVisible()
    await capture(noJs, `390-${fixture}-static`)
  }
  await context.close()
})
