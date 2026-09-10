import { test, expect, type Page } from "@playwright/test"
import { mkdirSync, writeFileSync } from "node:fs"

const route = "/decisions/who-gets-access"
const output = process.env.ACCESS_EVIDENCE_DIR ?? "docs/evidence/access-analytical-experience"
const submit = (page: Page) => page.getByRole("button", { name: "Submit and see the changed condition" }).click()
const finish = (page: Page) => page.getByRole("button", { name: "Submit and read the interpretation" }).click()
async function choose(page: Page, option: string, reason: string) {
  await page.locator(`input[name="access-arrangement"][value="${option}"]`).check()
  await page.locator(`input[name="access-reason"][value="${reason}"]`).check()
}
async function capture(page: Page, name: string, fullPage = true) {
  mkdirSync(output, { recursive: true })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: `${output}/${name}.png`, fullPage })
  if (name.startsWith('candidate-') || name.endsWith('-03-result')) await page.screenshot({path:`${output}/${name}-viewport.png`})
}

test("admission changes while research and publication rights remain identical; no thesis before submission", async ({ page }) => {
  await page.goto(route)
  await expect(page.getByText("Freedom to publish starts before publication")).toHaveCount(0)
  await expect(page.locator('[data-admissions="independent"]')).toBeVisible()
  await expect(page.locator('input:checked')).toHaveCount(0)
  const fixed = await page.locator('[data-fixed-rights]').innerText()
  const publication = await page.locator('[data-publication-route]').innerText()
  await choose(page, "enclave", "scrutiny")
  await expect(page.getByRole('heading', {name:'The original decision'})).toBeVisible()
  await submit(page)
  await expect(page.locator('input:checked')).toHaveCount(0)
  await expect(page.locator('[data-admissions="developer"]')).toBeVisible()
  expect(await page.locator('[data-fixed-rights]').innerText()).toBe(fixed)
  expect(await page.locator('[data-publication-route]').innerText()).toBe(publication)
  await expect(page.locator('[data-authority-edge="developer"]')).toHaveAttribute('data-active', 'true')
  await expect(page.locator('[data-authority-edge="independent"]')).toHaveAttribute('data-active', 'false')
})

test("keyboard inspection changes the visible permission connection, can be interrupted, and never edits submissions", async ({ page }) => {
  await page.goto(route); await choose(page, 'enclave', 'scrutiny'); await submit(page)
  await choose(page, 'enclave', 'contain'); await finish(page)
  const result = page.locator('[data-conditional-readback]')
  const reading = await result.innerText()
  const controls = page.getByRole('group', {name:'Inspect your submitted arrangements'})
  const original = controls.getByRole('button', {name:'Original provision'})
  const changed = controls.getByRole('button', {name:'Changed provision'})
  await original.focus(); await page.keyboard.press('Space')
  await expect(page.locator('[data-admissions="independent"]')).toBeVisible()
  await expect(original).toBeFocused()
  // Change again during the CSS transition. No timer or animation completion owns the result.
  await changed.press('Enter'); await original.press('Enter'); await changed.press('Enter')
  await expect(changed).toHaveAttribute('aria-pressed','true')
  await expect(page.locator('[data-admissions="developer"]')).toBeVisible()
  await expect(result).toHaveText(reading)
  const ledger = page.getByRole('definition').filter({hasText:'Principal reason'})
  await expect(ledger).toHaveCount(2)
  await expect(page.locator('[aria-label="Submitted decisions"]')).toContainText('Keep the ability to limit access')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await original.press('Enter')
  await expect(page.locator('[data-admissions="independent"]')).toBeVisible()
  expect(await page.locator('[data-authority-edge="independent"]').evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s')
  await expect(result).toHaveText(reading)
})

test("inspection shows the submitted arrangement under each condition including unchanged and withheld choices", async ({ page }) => {
  for (const second of ['weights', 'hosted', 'defer']) {
    await page.goto(route); await choose(page, 'enclave', 'scrutiny'); await submit(page)
    await choose(page, second, 'none'); await finish(page)
    await expect(page.locator(`[data-arrangement="${second}"]`)).toBeVisible()
    await expect(page.locator('[data-admissions]')).toHaveCount(0)
    await page.getByRole('group',{name:'Inspect your submitted arrangements'}).getByRole('button',{name:'Original provision'}).click()
    await expect(page.locator('[data-arrangement="enclave"][data-condition="original"]')).toBeVisible()
    await page.getByRole('button',{name:'Back to replay'}).click()
    await page.getByRole('button',{name:'Back to original'}).click()
    await choose(page, 'enclave', 'none'); await submit(page)
    await expect(page.locator('input:checked')).toHaveCount(0)
    await expect(page.getByText('Freedom to publish starts before publication')).toHaveCount(0)
  }
})

test("optional reading and separate-tab source consultation add no response storage or requests", async ({ page, context }) => {
  const requests: string[] = []
  page.on('request', req => requests.push(`${req.method()} ${req.url()} ${req.postData() ?? ''}`))
  await page.addInitScript(() => {
    const writes: string[] = []; const set = Storage.prototype.setItem
    Storage.prototype.setItem = function(key, value) { writes.push(key); return set.call(this,key,value) }
    Object.assign(window, { accessWrites: writes })
  })
  // Deterministic popup check; actual report was separately consulted during authoring.
  await context.route('https://cdn.governance.ai/**', r => r.fulfill({contentType:'text/html', body:'<p>Source consultation test fixture</p>'}))
  await page.goto(route); await choose(page, 'enclave', 'scrutiny'); await submit(page)
  await choose(page, 'enclave', 'contain'); await finish(page)
  await page.getByRole('button', {name:'Read why admission matters'}).click()
  await expect(page.getByRole('heading',{name:'Freedom to publish starts before publication'})).toBeVisible()
  const before = await page.locator('[data-conditional-readback]').innerText()
  const popupPromise = page.waitForEvent('popup')
  await page.getByRole('link',{name:/Read §§4/}).click()
  const popup = await popupPromise; await popup.waitForLoadState(); await popup.close()
  await expect(page.locator('[data-conditional-readback]')).toHaveText(before)
  const state = await page.evaluate(() => ({ local:{...localStorage}, session:{...sessionStorage}, cookies:document.cookie, writes:(window as unknown as {accessWrites:string[]}).accessWrites }))
  expect(state).toEqual({local:{},session:{},cookies:'',writes:[]})
  expect(requests.join('\n')).not.toMatch(/reason=|option=|scrutiny|contain|\/api\/|\/_vercel\//)
  expect(requests.every(value => value.startsWith('GET '))).toBe(true)
  expect(new URL(page.url()).search).toBe('')
  mkdirSync(output,{recursive:true}); writeFileSync(`${output}/access-privacy.json`, JSON.stringify({state,requests},null,2))
  await page.getByRole('link',{name:'Close exercise and clear choices'}).click(); await page.goBack()
  await expect(page.locator('input:checked')).toHaveCount(0)
  await expect(page.locator('[data-conditional-readback]')).toHaveCount(0)
})

for (const width of [1440,390,320,768]) test(`${width}: linear reflow, ordered transition frames and printable analysis`, async ({ page }) => {
  await page.setViewportSize({width,height:width===390?844:900})
  const requests: {method:string;url:string;type:string}[] = []
  page.on('request',r=>requests.push({method:r.method(),url:r.url(),type:r.resourceType()}))
  await page.goto(route); await page.evaluate(()=>document.fonts.ready); await page.waitForLoadState('networkidle')
  if(width===1440) {
    const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>{const r=entry as PerformanceResourceTiming;return {name:r.name,transferSize:r.transferSize,encodedBodySize:r.encodedBodySize,decodedBodySize:r.decodedBodySize,duration:r.duration}}))
    const nav=await page.evaluate(()=>performance.getEntriesByType('navigation').map(entry=>{const r=entry as PerformanceNavigationTiming;return {transferSize:r.transferSize,encodedBodySize:r.encodedBodySize,decodedBodySize:r.decodedBodySize,domContentLoaded:r.domContentLoadedEventEnd,load:r.loadEventEnd}}))
    mkdirSync(output,{recursive:true}); writeFileSync(`${output}/candidate-network.json`,JSON.stringify({requests,resources,nav},null,2))
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  if(width<900) {
    const figure=await page.locator('[data-arrangement]').boundingBox()
    const field=await page.locator('fieldset').first().boundingBox()
    expect(figure!.y + figure!.height).toBeLessThan(field!.y)
  }
  await capture(page, `candidate-${width}`)
  await choose(page,'enclave','scrutiny')
  if(width===1440 || width===390) await capture(page, `${width}-01-original`)
  await submit(page)
  if(width===1440 || width===390) await capture(page, `${width}-02-changed`)
  await choose(page,'enclave','contain'); await finish(page)
  await expect(page.locator('[data-conditional-readback]')).toBeVisible()
  if(width===1440 || width===390) await capture(page, `${width}-03-result`)
  await page.getByText('Continue reading: when outside scrutiny depends on the developer', {exact:true}).click()
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  if(width===1440 || width===390) await capture(page, `${width}-04-reading`)
  if(width===1440) {
    await page.emulateMedia({media:'print'})
    await expect(page.getByRole('heading',{name:'What would change the judgment?'})).toBeVisible()
    await capture(page,'print')
    await page.pdf({path:`${output}/access-print.pdf`,format:'A4',printBackground:true})
  }
})
