import { buildFoundationCopySharePayload } from "@/lib/foundation-copy-share"
import { test, expect, type Page } from "@playwright/test"
import { mkdirSync, writeFileSync } from "node:fs"
import { resultFixtures, syntheticAnswers } from "./fixtures"
import { getFoundationQuestionsForSet, selectFoundationAnswersForSet } from "@/lib/quiz-schema"
import { foundationScoringCalibrationForForm, generateResult } from "@/lib/scoring"
import { FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY, FOUNDATION_LOCAL_EVIDENCE_HANDOFF_KEY, PROFILE_SAVE_INTENT_KEY, RESULT_HISTORY_STORAGE_KEY, PROFILE_STORAGE_KEY } from "@/lib/storage-keys"
import type { FamilyKey } from "@/lib/types"
const fixtures = resultFixtures()
const evidenceDir = process.env.DECISION_EVIDENCE_DIR ?? "docs/evidence/decision-exercises-release/screenshots"
const repairDir = process.env.DECISION_REPAIR_DIR ?? "docs/evidence/decision-exercises-release/repair"
const verify="/decisions/who-gets-to-verify", access="/decisions/who-gets-access"
const sizes=[{width:1440,height:900},{width:390,height:844}]
const storageKey="ir-worldview-session-v3"
const none="None of these quite describes my reason."
test.beforeEach(async ({ context }) => {
  await context.route(/\/api\/|\/_vercel\//,route=>route.abort())
  await context.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/,route=>route.abort())
})
async function screenshot(page:Page,name:string,fullPage=false) {
 mkdirSync(evidenceDir,{recursive:true});await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`${evidenceDir}/${name}.png`,fullPage,animations:"disabled"})
}
async function choose(page:Page,option:string,reason:string) {
 await page.locator(`input[name$="-arrangement"][value="${option}"]`).check()
 await page.locator(`input[name$="-reason"][value="${reason}"]`).check()
}
async function next(page:Page) {await page.getByRole("button",{name:"Submit and see the changed condition"}).click()}
async function finish(page:Page) {await page.getByRole("button",{name:"Submit and read the interpretation"}).click();await expect(page.locator('[data-conditional-readback]')).toBeVisible()}

for (const size of sizes) test(`${size.width}: public entry and two conditional decisions`,async({page})=>{
 await page.setViewportSize(size)
 await page.goto("/decisions");await expect(page.getByRole("heading",{name:"Decision exercises",exact:true})).toBeVisible()
 await screenshot(page,`${size.width}-decisions`)
 for (const [route,id,first,second,r1,r2,expected] of [[verify,"verify","national","custodian","timely","equal","retained an external check while abandoning asymmetric national inspection"],[access,"access","enclave","weights","scrutiny","reproduce","cannot recall copies"]]) {
  await page.goto(route)
  await expect(page.getByText(/Draft for local review|completed.*last week/)).toHaveCount(0)
  await expect(page.getByRole("button",{name:"Submit and see the changed condition"})).toBeDisabled()
  await expect(page.getByLabel("Scenario assumptions")).toBeVisible()
  await choose(page,first,r1);await screenshot(page,`${size.width}-${id}-original`,true)
  await next(page);await choose(page,second,r2)
  if(id==="verify") await expect(page.locator('[data-inspection-edge="blocked"]')).toHaveCount(0) // custodian selected; national edge no longer applies
  else await expect(page.locator('[data-arrangement="weights"]')).toBeVisible()
  await screenshot(page,`${size.width}-${id}-replay`,true)
  await finish(page);await expect(page.locator('[data-conditional-readback]')).toContainText(expected)
  await screenshot(page,`${size.width}-${id}-finding`,true)
  await page.getByText("Complete transcript and interpretation evidence",{exact:true}).click()
  await expect(page.getByText(/^You selected /).first()).toBeVisible()
  const links=await page.locator('article a[href]').evaluateAll(as=>as.map(a=>a.getAttribute('href')))
  expect(links.every(href=>!href?.includes('/dev/'))).toBe(true)
  for(const width of [320,768]) {await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true)}
  await page.setViewportSize(size)
 }
})

test("withheld/unexpressed statuses agree with interpretation; decisions and reasons are independent",async({page})=>{
 for(const [a,b,r1,r2,status,reasonStatus] of [
  ["defer","defer","none","none","Both decisions withheld","Neither reason expressed"],
  ["national","defer","timely","equal","Revised decision withheld","Different stated reasons"],
  ["defer","custodian","none","equal","Original decision withheld","Original reason unexpressed"],
  ["custodian","custodian","none","none","Arrangement unchanged","Neither reason expressed"],
  ["custodian","custodian","equal","none","Arrangement unchanged","Revised reason unexpressed"],
  ["custodian","custodian","equal","equal","Arrangement unchanged","Same stated reason"],
  ["custodian","custodian","secrets","equal","Arrangement unchanged","Different stated reasons"],
 ]) {
  await page.goto(verify);await choose(page,a,r1);await next(page)
  await expect(page.locator('input[name$="-reason"]:checked')).toHaveCount(0)
  await choose(page,b,r2);await finish(page)
  await expect(page.locator('[data-comparison-status]')).toContainText(status)
  await expect(page.locator('[data-comparison-status]')).toContainText(reasonStatus)
  if(a==="custodian"&&b==="custodian") await expect(page.locator('[data-conditional-readback]')).toContainText("remains reciprocal")
 }
 await screenshot(page,"1440-same-choice-different-reasons",true)
})

test("editing an earlier submission invalidates the replay; escape responses and reset retain control",async({page})=>{
 await page.goto(access);await choose(page,"enclave","scrutiny");await next(page);await choose(page,"hosted","contain");await finish(page)
 await expect(page.locator('[data-conditional-readback]')).toContainText("not a blanket rejection of outside criticism")
 await screenshot(page,"1440-enclave-hosted",true)
 await page.getByRole('button',{name:'Back to replay'}).click();await page.getByRole('button',{name:'Back to original'}).click()
 await choose(page,"enclave","none")
 await expect(page.getByRole('status')).toContainText('replay was cleared')
 await expect(page.locator('[data-conditional-readback]')).toHaveCount(0)
 await next(page);await expect(page.locator('input:checked')).toHaveCount(0)
 await choose(page,"defer","none");await finish(page)
 await expect(page.locator('[data-comparison-status]')).toContainText('Revised decision withheld')
 await page.getByRole('button',{name:'Reset and clear choices'}).click()
 await expect(page.locator('input:checked')).toHaveCount(0)
})

test("inspection edge and admissions reflect the supplied provision",async({page})=>{
 await page.goto(verify);await choose(page,"national","timely");await next(page)
 await expect(page.locator('[data-inspection-edge="blocked"]')).toHaveCount(1)
 await expect(page.getByText('Arden may not inspect Belvar.',{exact:true})).toBeVisible()
 await page.goto(access);await choose(page,"enclave","scrutiny");await next(page)
 await expect(page.locator('[data-admissions="developer"]')).toBeVisible()
 await expect(page.getByText(/Fixed rights for admitted teams/)).toBeVisible()
})

test("public episodes do not read profiles, persist inputs, change URLs or send answer-bearing requests",async({page})=>{
 const requests:string[]=[];page.on('request',req=>requests.push(`${req.method()} ${req.url()} ${req.postData()??''}`))
 await page.addInitScript(()=>{
  const writes:string[]=[];const reads:string[]=[]
  const oldSet=Storage.prototype.setItem,oldGet=Storage.prototype.getItem
  Storage.prototype.setItem=function(k,v){writes.push(`${k}=${v}`);return oldSet.call(this,k,v)}
  Storage.prototype.getItem=function(k){reads.push(k);return oldGet.call(this,k)}
  Object.assign(window,{exerciseWrites:writes,exerciseReads:reads})
 })
 await page.goto(verify);await choose(page,"national","timely");await next(page);await choose(page,"custodian","equal");await finish(page)
 expect(new URL(page.url()).pathname).toBe(verify);expect(new URL(page.url()).search).toBe('')
 const report=await page.evaluate(()=>({writes:(window as unknown as {exerciseWrites:string[]}).exerciseWrites,reads:(window as unknown as {exerciseReads:string[]}).exerciseReads,local:{...localStorage},session:{...sessionStorage},cookies:document.cookie}))
 expect(report.writes.filter(v=>!v.startsWith('__next_debug_channel:'))).toEqual([])
 expect(report.reads.filter(v=>/profile|answers|session-v3/.test(v))).toEqual([])
 expect(report.local).toEqual({});expect(report.cookies).toBe('')
 expect(requests.filter(r=>!/^(GET|HEAD) /.test(r))).toEqual([])
 expect(requests.join('\n')).not.toMatch(/reason=|option=|timely|custodian|\/api\/|\/_vercel\//)
 writeFileSync(process.env.DECISION_EVIDENCE_DIR ? `${evidenceDir}/privacy-check.json` : 'docs/evidence/decision-exercises-release/privacy-check.json',JSON.stringify({report,requests,scope:'Synthetic episode browser context; hosting network metadata is outside this application check.'},null,2))
 await page.getByRole('link',{name:/Next decision:/}).click();await page.goBack()
 await expect(page.locator('input:checked')).toHaveCount(0)
 await expect(page.locator('[data-conditional-readback]')).toHaveCount(0)
})

test("keyboard activation, no-JavaScript, reduced motion and print preserve explanations",async({browser,page})=>{
 await page.goto(access)
 await page.locator('input[value="weights"]').focus();await page.keyboard.press('Space')
 await page.locator('input[value="reproduce"]').focus();await page.keyboard.press('Space')
 await next(page);await choose(page,'weights','reproduce');await finish(page)
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}})
 const staticPage=await context.newPage()
 await staticPage.goto(page.url().replace(access,verify))
 await expect(staticPage.getByText(/This technical reach is stipulated/)).toBeVisible()
 await expect(staticPage.getByText(/Submission and comparison require JavaScript/)).toBeVisible()
 await expect(staticPage.locator('input:visible')).toHaveCount(0)
 await screenshot(staticPage,'390-verify-no-js',true)
 await context.close()
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(access)
 await screenshot(page,'1440-access-reduced',true)
 await page.emulateMedia({media:'print'});await screenshot(page,'1440-access-print',true)
})

test("actual Foundation identities, pure/blended/close and Chinese shared results preserve their issued name",async({page})=>{
 for(const fixture of Object.values(fixtures.foundation)) {
  await page.goto(`/results/${fixture.payload}`)
  await expect(page.locator('h1')).toHaveText(fixture.name)
  await expect(page.locator('[data-foundation-hero-marks]')).toHaveAttribute('data-foundation-hero-marks',fixture.code)
  await expect(page.locator('[data-foundation-hero-marks]')).toHaveAttribute('data-motion','unstarted')
  const marks=await page.locator('[data-mark-base] [data-archetype-mark]').evaluateAll(ms=>ms.map(m=>m.getAttribute('data-archetype-mark')))
  expect(marks.length).toBe(fixture.code.includes('/')?2:1)
  await expect(page.getByText(/Preparation, agreements and limits|no authored reading/i)).toHaveCount(0)
 }
 for(const size of sizes) {
  await page.setViewportSize(size)
  for(const code of ['P-','R/M+']) {
   const f=fixtures.foundation[code];await page.goto(`/results/${f.payload}`);await screenshot(page,`${size.width}-foundation-${code==='P-'?'pure':'blend'}`)
   const widths=await page.locator('[data-mark-base] [data-archetype-mark]').evaluateAll(ms=>ms.map(m=>m.getBoundingClientRect().width))
   expect(widths).toEqual(code.includes('/') ? [size.width===390?110:176,size.width===390?110:176] : [size.width===390?110:176])
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  }
 }
 await page.goto(`/zh/results/${fixtures.foundation['R/M+'].payload}`)
 await expect(page.locator('h1')).toHaveText(fixtures.foundation['R/M+'].name)
 await screenshot(page,'390-foundation-zh')
 await page.goto('/results/invalid');await expect(page.locator('h1')).toContainText('could not be decoded')
})

test("all actual AI labels, alternative outputs and exact ties remain distinct from the display experiment",async({page})=>{
 for(const f of Object.values(fixtures.governance)) {
  await page.goto(`/ai/results/${f.payload}`);await expect(page.locator('h1')).toHaveText(f.name)
  await expect(page.getByRole('heading',{name:'Your positions on the AI questions'})).toBeVisible()
  await expect(page.getByRole('heading',{name:'What is doing the work'})).toHaveCount(0)
  await expect(page.locator('[data-drawn-mark]')).toHaveCount(0)
 }
 for(const size of sizes) {await page.setViewportSize(size);await page.goto(`/ai/results/${fixtures.governance.coordinationArchitect.payload}`);await screenshot(page,`${size.width}-ai-coordination`);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)}
 await page.goto(`/ai/results/${fixtures.tie}`);await expect(page.getByText(/share the exact leading model score/)).toBeVisible()
 await screenshot(page,'390-ai-tie')
})

test("legacy full draft stays intact; new full extension excludes research comparison; restart is explicit",async({page})=>{
 const answers=syntheticAnswers(12)
 const draft={v:7,questionSet:'fullExtended',activeMode:'analyst',orderSeed:'synthetic',answers:{...answers,val_mi_1:7},contextAssist:false,itemLatencyBuckets:{}}
 await page.addInitScript(({key,draft})=>{localStorage.setItem(key,JSON.stringify(draft))},{key:storageKey,draft})
 await page.goto('/quiz?extension=full')
 await expect(page.getByRole('heading',{name:'Keep the form you started'})).toBeVisible()
 expect(JSON.parse(await page.evaluate(key=>localStorage.getItem(key)!,storageKey)).questionSet).toBe('fullExtended')
 await page.getByRole('button',{name:'Continue this saved form'}).click()
 await expect(page.getByText(/54 additional questions/)).toBeVisible()
 await screenshot(page,'1440-legacy-form')
 await page.getByRole('button',{name:'Start over',exact:true}).click()
 await page.getByRole('button',{name:'Keep draft',exact:true}).click()
 expect(JSON.parse(await page.evaluate(key=>localStorage.getItem(key)!,storageKey)).answers.val_mi_1).toBe(7)
 await page.getByRole('button',{name:'Start over',exact:true}).click();await page.getByRole('button',{name:'Clear draft',exact:true}).click()
 expect(JSON.parse(await page.evaluate(key=>localStorage.getItem(key)!,storageKey)).answers).toEqual({})
})

async function seedDraft(page: Page, questionSet: string, answers: Record<string, unknown>) {
 await page.goto('/privacy')
 await page.evaluate(({key,questionSet,answers})=>localStorage.setItem(key,JSON.stringify({v:7,questionSet,activeMode:'analyst',orderSeed:'synthetic-current',answers,contextAssist:false,itemLatencyBuckets:{}})),{key:storageKey,questionSet,answers})
}
test("new form completion and missing-extension protection use the truthful form",async({page})=>{
 const answers=syntheticAnswers(12)
 await seedDraft(page,'core',answers)
 await page.goto('/quiz?extension=full');await expect(page.getByText(/42 additional questions/)).toBeVisible()
 expect(JSON.parse(await page.evaluate(key=>localStorage.getItem(key)!,storageKey)).questionSet).toBe('baselineExtended')
 await page.goto('/quiz/review')
 await expect(page.getByRole('button',{name:'Generate my result →'})).toBeEnabled()
 await page.getByRole('button',{name:'Generate my result →'}).click()
 await expect(page).toHaveURL(/\/results\//)
 const decoded=JSON.parse(Buffer.from(page.url().split('/').pop()!, 'base64url').toString())
 expect(decoded.qs).toBe('baselineExtended')
 await screenshot(page,'1440-new-form-result')
 const extensionItem = getFoundationQuestionsForSet('baselineExtended').find(q => q.id === 'sc1')!
 expect(extensionItem.tier).toBe('extended')
 expect(extensionItem.scoringBlock).toBe('core')
 const incomplete={...answers};delete incomplete[extensionItem.id]
 await seedDraft(page,'baselineExtended',incomplete)
 await page.goto('/quiz/review')
 await expect(page.getByRole('button',{name:'Generate my result →'})).toBeDisabled()
 await expect(page.getByText('Finish every foundation question before generating the result.')).toBeVisible()
 await screenshot(page,'1440-missing-extension',true)
 await page.goto('/zh/quiz?extension=full');await expect(page.getByText(/42/).first()).toBeVisible()
})

test("genuine missing tier-core answers recover without losing baseline or targeted form identity", async ({ page }) => {
 const core = getFoundationQuestionsForSet("core")
 const missing = core.find(q => q.id === "sc2")!
 expect(core).toHaveLength(14)
 expect(missing.tier).toBe("core")
 const families: FamilyKey[] = ["realist", "institutionalist", "constructivist", "criticalPoliticalEconomy"]
 const pairs: [FamilyKey, FamilyKey][] = []
 for (let i=0;i<families.length;i++) for (let j=i+1;j<families.length;j++) pairs.push([families[i],families[j]])
 const forms = [{ questionSet: "baselineExtended" as const, pair: undefined as [FamilyKey, FamilyKey] | undefined }, ...pairs.map(pair => ({ questionSet: "targetedExtended" as const, pair }))]
 const records = []
 for (const { questionSet, pair } of forms) {
  const complete = selectFoundationAnswersForSet(syntheticAnswers(12), questionSet, pair)
  const incomplete = { ...complete }; delete incomplete[missing.id]
  const extension = getFoundationQuestionsForSet(questionSet, pair)
  expect(extension.every(q => incomplete[q.id] !== undefined)).toBe(true)
  expect(core.filter(q => incomplete[q.id] === undefined).map(q => q.id)).toEqual([missing.id])
  await page.goto("/privacy")
  await page.evaluate(({ key, questionSet, pair, answers }) => {
   localStorage.clear(); sessionStorage.clear()
   localStorage.setItem(key, JSON.stringify({ v:7, questionSet, targetedFamilyPair:pair, activeMode:"analyst", orderSeed:"synthetic-core-repair", foundationCopy:{status:"single-copy",locale:"en",version:1}, answers, contextAssist:false, itemLatencyBuckets:{} }))
  }, { key:storageKey, questionSet, pair, answers:incomplete })
  await page.goto("/quiz/review")
  const generate = page.getByRole("button", { name:"Generate my result →" })
  await expect(generate).toBeDisabled()
  expect(new URL(page.url()).pathname).toBe("/quiz/review")
  for (const key of [FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY, FOUNDATION_LOCAL_EVIDENCE_HANDOFF_KEY, PROFILE_SAVE_INTENT_KEY, RESULT_HISTORY_STORAGE_KEY, PROFILE_STORAGE_KEY]) {
   expect(await page.evaluate(k => localStorage.getItem(k), key)).toBeNull()
   expect(await page.evaluate(k => sessionStorage.getItem(k), key)).toBeNull()
  }
  await expect(page.locator('a[href*="/results/"]')).toHaveCount(0)
  const row = page.locator(`[data-question-id="${missing.id}"]`)
  await expect(row.getByText(missing.prompt, { exact:true })).toBeVisible()
  if (!pair) {
   mkdirSync(`${repairDir}`, { recursive:true })
   await row.scrollIntoViewIfNeeded()
   await page.screenshot({ path:`${repairDir}/missing-tier-core-baseline.png` })
  }
  await row.getByRole("button", { name:"Edit", exact:true }).click()
  await expect(page.getByRole("heading", { name:missing.prompt, exact:true })).toBeVisible()
  await page.reload() // repair view and original form both survive resume
  await expect(page.getByRole("heading", { name:missing.prompt, exact:true })).toBeVisible()
  const resumed = JSON.parse(await page.evaluate(key => localStorage.getItem(key)!, storageKey))
  expect(resumed.questionSet).toBe(questionSet)
  expect(resumed.targetedFamilyPair).toEqual(pair)
  expect(resumed.answers[missing.id]).toBeUndefined()
  await page.getByRole("button", { name:new RegExp(`^${complete[missing.id]} `) }).click()
  await page.getByRole("button", { name:/Return to review/ }).first().click()
  await expect(generate).toBeEnabled()
  // An ordinary extension Edit, reload and review must still retain the form.
  await page.locator(`[data-question-id="${extension[0].id}"]`).getByRole("button", { name:"Edit", exact:true }).click()
  await expect(page.getByRole("heading", { name:extension[0].prompt, exact:true })).toBeVisible()
  await page.reload()
  await expect(page.getByRole("heading", { name:extension[0].prompt, exact:true })).toBeVisible()
  expect(JSON.parse(await page.evaluate(key => localStorage.getItem(key)!, storageKey)).questionSet).toBe(questionSet)
  await page.getByRole("button", { name:/Return to review/ }).first().click()
  await expect(generate).toBeEnabled()
  await generate.click()
  await expect(page).toHaveURL(/\/results\//)
  const payload = JSON.parse(Buffer.from(page.url().split("/").pop()!, "base64url").toString())
  const calibration = foundationScoringCalibrationForForm(questionSet,pair)!
  expect(payload).toEqual(buildFoundationCopySharePayload(generateResult(complete,"analyst",calibration),"en",questionSet,pair,1))
  await expect.poll(() => page.evaluate(key => localStorage.getItem(key), FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY)).not.toBeNull()
  records.push({ questionSet, pair, missingId:missing.id, allExtensionAnswersPresent:true, blockedUntilRestored:true, restoredPayload:payload })
  if (!pair) await page.screenshot({ path:`${repairDir}/restored-core-result.png` })
 }
 writeFileSync(`${repairDir}/core-recovery.json`,JSON.stringify(records,null,2))
})

test("fresh supported marks draw once with final, interrupted, reduced, print and no-JS silhouettes",async({browser,page})=>{
 const fixture=fixtures.foundation['P/R-']
 expect(fixture).toBeTruthy()
 // Install a local clock so the captured stroke times are explicit, without altering result identity.
 await page.clock.install()
 await seedDraft(page,'core',fixture.answers)
 await page.goto('/quiz/review')
 await page.getByRole('button',{name:'Generate my result →'}).click()
 await expect(page).toHaveURL(/\/results\//)
 const hero=page.locator('[data-foundation-hero-marks]')
 await page.clock.runFor(80)
 await expect(hero).toHaveAttribute('data-motion','drawing')
 await expect(page.locator('h1')).toHaveText(fixture.name)
 await expect(page.getByRole('link',{name:'Explore this reading'})).toBeVisible()
 await page.evaluate(()=>document.getAnimations().forEach(a=>{a.pause();a.currentTime=400}))
 await page.screenshot({path:`${evidenceDir}/1440-fresh-strokes-partial.png`,animations:'allow'})
 await page.clock.runFor(1500)
 await expect(hero).toHaveAttribute('data-motion','complete')
 await screenshot(page,'1440-fresh-strokes-final')
 expect(await hero.locator('[data-mark-base]').evaluate(el=>getComputedStyle(el).opacity)).toBe('1')
 const resultURL=page.url()
 await page.reload();await expect(hero).toHaveAttribute('data-motion','unstarted')
 await page.clock.resume()
 // Re-enter a real completion for an interruption, never a public replay button.
 await seedDraft(page,'core',fixture.answers);await page.goto('/quiz/review')
 await page.getByRole('button',{name:'Generate my result →'}).click();await expect(page).toHaveURL(/\/results\//)
 await expect(hero).toHaveAttribute('data-motion','drawing')
 await page.evaluate(()=>document.getAnimations().forEach(a=>a.cancel()))
 await expect(hero).toHaveAttribute('data-motion','complete')
 expect(await hero.locator('[data-mark-base]').evaluate(el=>getComputedStyle(el).opacity)).toBe('1')
 await screenshot(page,'1440-fresh-strokes-interrupted')
 await page.emulateMedia({reducedMotion:'reduce'})
 await seedDraft(page,'core',fixture.answers);await page.goto('/quiz/review');await page.getByRole('button',{name:'Generate my result →'}).click()
 await expect(page).toHaveURL(/\/results\//);await expect(hero).not.toHaveAttribute('data-motion','drawing')
 expect(await hero.locator('[data-mark-base]').evaluate(el=>getComputedStyle(el).opacity)).toBe('1')
 await page.emulateMedia({media:'print'});await screenshot(page,'1440-foundation-print',true)
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}})
 const staticPage=await context.newPage();await staticPage.goto(resultURL)
 await expect(staticPage.locator('h1')).toHaveText(fixture.name)
 await expect(staticPage.locator('[data-mark-base] [data-archetype-mark]')).toHaveCount(2)
 await expect(staticPage.getByRole('link',{name:'Explore this reading'})).toBeVisible()
 await screenshot(staticPage,'390-foundation-no-js')
 await context.close()
})

test("public availability guards and contextual entry links",async({page,request})=>{
 for(const route of ['/decisions/not-published']) {
  const response=await request.get(route);expect(response.status()).toBe(404)
 }
 for(const route of ['/zh/decisions/who-gets-access','/zh/decisions']) {
  await page.goto(route);await expect(page.locator('input')).toHaveCount(0);await expect(page.locator('h1')).toContainText('中文')
 }
 if(!process.env.DECISION_BASE_URL) {
  for(const route of ['/dev/result-payoff','/learn','/world-stage-prototype']) expect((await request.get(route)).status()).toBe(404)
 }
 await page.goto('/cases');await expect(page.getByRole('link',{name:/decision exercises/i})).toBeVisible()
 await page.goto('/ai');await expect(page.locator('a[href="/decisions/who-gets-access"]')).toBeVisible()
})
