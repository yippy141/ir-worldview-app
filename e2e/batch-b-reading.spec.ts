import { expect, test, type Page } from "@playwright/test"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { getZhHansFoundationQuestionsForSet } from "../content/locales/zh-Hans/foundation-instrument"
import { MODELED_FAMILY_KEYS } from "../lib/worldview-config"
import { getFoundationResultQuestions } from "../lib/quiz-schema"
import { syntheticAnswers } from "../tests/decision-exercises/fixtures"
import { FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY } from "../lib/storage-keys"
const dir = process.env.BATCH_B_EVIDENCE_DIR ?? "docs/evidence/batch-b-reading-and-localization/screenshots"
const key = "ir-worldview-session-v3"
const reference = "/explore/reference/robert-keohane"
const ai = "/ai/atlas/precautionarySteward"
const delta = JSON.parse(readFileSync("docs/evidence/batch-b-reading-and-localization/reading-delta.json", "utf8")) as {routes:{route:string}[]}
async function capture(page:Page,name:string,fullPage=true) { mkdirSync(dir,{recursive:true}); await page.screenshot({path:`${dir}/${name}.png`,fullPage,animations:"disabled"}) }
async function geometry(page:Page) {
 return page.evaluate(()=>({ viewport:innerWidth,document:document.documentElement.scrollWidth,wide:[...document.querySelectorAll('main a,main button,main summary,main input,main select')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.left < -1 || r.right > innerWidth+1)}).map(e=>({text:e.textContent?.slice(0,90),tag:e.tagName})) }))
}
async function seed(page:Page,binding:unknown,version:1|2=2,complete=true) {
 await page.goto('/privacy')
 await page.evaluate(({key,answers,binding})=>{localStorage.clear();sessionStorage.clear();localStorage.setItem(key,JSON.stringify({v:7,questionSet:'core',activeMode:'analyst',orderSeed:'batch-b-synthetic',answers,contextAssist:false,itemLatencyBuckets:{},...(binding?{foundationCopy:binding}:{})}))},{key,answers:complete?syntheticAnswers(12,'core'):{sc2:7},binding})
 await page.goto('/zh/quiz/review')
 const sc2=getZhHansFoundationQuestionsForSet('core',undefined,version).find(q=>q.id==='sc2')!
 await expect(page.locator('[data-question-id="sc2"]')).toContainText(sc2.prompt)
}

test('the finite baseline reading routes still render, including unavailable and deeper destinations',async({page})=>{
 test.setTimeout(240_000)
 const results=[]
 for (const {route} of delta.routes) {const response=await page.goto(route);expect(response?.status(),route).toBe(200);await expect(page.locator('h1').first(),route).toBeVisible();results.push({route,status:response?.status(),heading:await page.locator('h1').first().innerText()})}
 mkdirSync(dir,{recursive:true});writeFileSync(`${dir}/finite-routes.json`,JSON.stringify(results,null,2))
})

for (const width of [320,390,768,1440]) test(`reading geometry and meaningful default/expanded content at ${width}`,async({page})=>{
 test.setTimeout(90_000);await page.setViewportSize({width,height:width<768?844:900});await page.emulateMedia({reducedMotion:'reduce'})
 const observations=[]
 for(const route of [reference,ai,'/explore/atlas/institution-builder','/world-stage','/zh/world-stage','/zh/explore/reference/robert-keohane']) {
  await page.goto(route);await expect(page.locator('h1').first()).toBeVisible()
  const before=await geometry(page);expect(before.document,route).toBeLessThanOrEqual(width+1)
  if(route===reference) {
   await expect(page.getByText(/Repeated negotiations make reputation/)).toBeVisible()
   await expect(page.locator('.reference-evidence-preview').first()).toBeVisible()
   await capture(page,`reference-${width}-default`)
   await page.getByRole('button',{name:'Expand evidence for reading'}).click()
   await expect(page.locator('.reading-evidence-source:not([open])')).toHaveCount(0)
   await capture(page,`reference-${width}-expanded`)
  }
  if(route===ai) {await expect(page.getByText(/These proposals belong/)).toBeVisible();await page.getByText('Full reading shelves',{exact:true}).click();await capture(page,`ai-${width}-expanded`)}
  if(route==='/world-stage'&&[390,1440].includes(width))await capture(page,`world-stage-${width}`)
  const after=await geometry(page);expect(after.document,route).toBeLessThanOrEqual(width+1);observations.push({route,before,after})
 }
 writeFileSync(`${dir}/geometry-${width}.json`,JSON.stringify(observations,null,2))
})

test('second, third and fourth clicks reach arguments, evidence, rivals and a new decision',async({page})=>{
 await page.goto('/explore');await page.getByRole('link',{name:/Thinkers and public positions/}).first().click()
 await page.locator('a[href="/explore/reference/robert-keohane"]').first().click()
 await page.getByRole('link',{name:'Inspect supporting evidence ↓'}).click()
 await page.locator('.reading-evidence-source').first().locator('summary').click()
 await expect(page.locator('.reading-evidence-source[open]')).toHaveCount(1)
 await page.getByRole('link',{name:'Read the case, its rival and source record →'}).click()
 await expect(page).toHaveURL(/institution-builder#case-security-arms-control-verification/)
 await expect(page.locator('#case-security-arms-control-verification')).toBeVisible()
 await page.locator('#case-security-arms-control-verification a[href="/explore/atlas/constraint-first-realist"]').click()
 await expect(page.locator('h1')).toContainText('Power with Limits')
 await page.goBack();await expect(page.locator('#case-security-arms-control-verification')).toBeVisible()
 await page.goto('/ai/atlas');await page.locator('#family-precautionarySteward').click()
 await page.getByText('Full reading shelves',{exact:true}).click();await expect(page.getByText('Read the profile’s foundations')).toBeVisible()
 await page.getByRole('link',{name:'Decide who gets access'}).click();await expect(page.locator('input[name$="-arrangement"]')).toHaveCount(4)
})

test('new and old Chinese copies retain exact review, result and answer-evidence provenance',async({page})=>{
 for (const version of [1,2] as const) {
  await seed(page,{status:'single-copy',locale:'zh-Hans',version},version)
  await page.getByRole('button',{name:/生成.*结果/}).click();await expect(page).toHaveURL(/\/zh\/results\//)
  const payload=JSON.parse(Buffer.from(page.url().split('/').pop()!,'base64url').toString());expect(payload.cv).toBe(version)
  const stored=await page.evaluate(k=>localStorage.getItem(k),FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY)
  expect(stored).toContain(`"copyVersion":${version}`)
  const url=page.url();await page.reload();expect(page.url()).toBe(url)
  await capture(page,`zh-copy-${version}-result`,false)
 }
})

test('unknown and interrupted drafts preserve older copy, decline invented evidence and require confirmed restart',async({page})=>{
 await seed(page,undefined,1)
 await expect(page.getByRole('heading',{name:'这份草稿没有语言版本记录'})).toBeVisible()
 await page.getByRole('button',{name:/生成.*结果/}).click();await expect(page).toHaveURL(/\/zh\/results\//)
 expect(JSON.parse(Buffer.from(page.url().split('/').pop()!,'base64url').toString()).cv).toBe(0)
 expect(await page.evaluate(k=>localStorage.getItem(k),FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY)).toBeNull()
 await seed(page,{status:'single-copy',locale:'zh-Hans',version:2},2,false)
 await expect(page.getByRole('button',{name:/生成.*结果/})).toBeDisabled()
 await page.goto('/quiz');await expect(page.getByRole('heading',{name:'Keep the language of this draft'})).toBeVisible()
 await expect(page.locator('input[type="radio"]')).toHaveCount(0)
 await page.reload();await expect(page.getByRole('heading',{name:'Keep the language of this draft'})).toBeVisible()
 page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'Clear draft and restart'}).click()
 expect(JSON.parse((await page.evaluate(k=>localStorage.getItem(k),key))!).answers.sc2).toBe(7)
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Clear draft and restart'}).click()
 await expect(page.getByRole('heading',{name:'Keep the language of this draft'})).toHaveCount(0)
 const draft=JSON.parse((await page.evaluate(k=>localStorage.getItem(k),key))!);expect(draft.foundationCopy).toEqual({status:'single-copy',locale:'en',version:1});expect(draft.answers).toEqual({})
})

test('no-JS, print, keyboard and reduced-motion reading retain the argument and source route',async({browser,page})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}})
 const staticPage=await context.newPage();await staticPage.goto(reference);await expect(staticPage.getByText(/Repeated negotiations/)).toBeVisible();await expect(staticPage.locator('.reference-evidence-preview').first()).toBeVisible();await context.close()
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(reference)
 const target=page.getByRole('link',{name:'Inspect supporting evidence ↓'})
 for(let i=0;i<90 && !await target.evaluate(e=>e===document.activeElement);i++)await page.keyboard.press(test.info().project.use.browserName === 'webkit' ? 'Alt+Tab' : 'Tab')
 await expect(target).toBeFocused();await page.keyboard.press('Enter');await expect(page).toHaveURL(/#reference-support-heading/)
 await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));await page.emulateMedia({media:'print'});await expect(page.locator('.reading-evidence-source').first().locator('.reference-evidence-list')).toBeVisible();await capture(page,'reference-print')
 await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));await page.emulateMedia({media:'screen'});await expect(page.locator('.reading-evidence-source[open]')).toHaveCount(0);await page.goto('/zh/ai/atlas');await expect(page.getByRole('heading',{name:'此页面的简体中文内容尚未通过编辑审校。'})).toBeVisible()
 await page.goto('/zh/ai/quiz');await expect(page.getByRole('heading',{name:'中文版问卷正在校对。'})).toBeVisible()
})

test('two-times-equivalent reflow, unavailable records and separate source consultation preserve access',async({page,context,browser})=>{
 // 720 CSS px at 2x DPR represents the reflow available at 200% in a 1440px window;
 // this is explicitly not a claim of native browser zoom or a physical device run.
 const zoomContext=await browser.newContext({viewport:{width:720,height:450},deviceScaleFactor:2})
 const zoomPage=await zoomContext.newPage();await zoomPage.goto(reference)
 expect((await geometry(zoomPage)).document).toBeLessThanOrEqual(721)
 await expect(zoomPage.getByText(/Repeated negotiations/)).toBeVisible()
 await capture(zoomPage,'reference-720-css-2x-dpr',false);await zoomContext.close()
 await page.goto(reference)
 await page.getByRole('button',{name:'Expand evidence for reading'}).click()
 const source=page.getByRole('link',{name:'Read the source (opens in another tab) ↗'})
 await expect(source).toHaveAttribute('target','_blank');await expect(source).toHaveAttribute('rel','noopener noreferrer')
 const href=await source.getAttribute('href');expect(href).toBe('https://www.columbia.edu/itc/sipa/S6800/courseworks/international_keohane.pdf')
 await context.route(href!,route=>route.fulfill({contentType:'text/html',body:'Synthetic publisher response for source-consultation test.'}))
 const popupPromise=page.waitForEvent('popup');await source.click();const popup=await popupPromise;await popup.waitForLoadState();expect(popup.url()).toBe(href);await popup.close()
 await expect(page.locator('.reading-evidence-source:not([open])')).toHaveCount(0)
 expect(await page.evaluate(()=>localStorage.length)).toBe(0)
 await page.goto('/explore/reference/not-a-published-record');await expect(page.getByRole('heading',{name:'This profile is unavailable.'})).toBeVisible()
})

test('Chinese copy binding survives baseline, all targeted extensions and a preserved historical draft',async({page})=>{
 test.setTimeout(90_000)
 const pairs=MODELED_FAMILY_KEYS.flatMap((a,i)=>MODELED_FAMILY_KEYS.slice(i+1).map(b=>[a,b]))
 const allAnswers=Object.fromEntries(getFoundationResultQuestions('fullExtended').map((q,i)=>[q.id,q.kind==='likert'?1+i%7:q.options[0].id]))
 for (const version of [1,2] as const) for (const pair of [undefined,...pairs]) {
  await seed(page,{status:'single-copy',locale:'zh-Hans',version},version)
  // All selected responses below are synthetic; extension answers are supplied only for review compatibility.
  await page.evaluate(({key,answers})=>{const s=JSON.parse(localStorage.getItem(key)!);s.answers=answers;localStorage.setItem(key,JSON.stringify(s))},{key,answers:allAnswers})
  await page.goto(pair?`/zh/quiz?extension=targeted&first=${pair[0]}&second=${pair[1]}`:'/zh/quiz?extension=full')
  const expected=pair?'targetedExtended':'baselineExtended'
  await expect.poll(async()=>JSON.parse((await page.evaluate(k=>localStorage.getItem(k),key))!).questionSet).toBe(expected)
  await page.goto('/zh/quiz/review');await expect(page.getByRole('button',{name:'生成我的结果 →'})).toBeEnabled()
  await page.locator('[data-question-id] button').first().click();await page.reload()
  const draft=JSON.parse((await page.evaluate(k=>localStorage.getItem(k),key))!);expect(draft.foundationCopy).toEqual({status:'single-copy',locale:'zh-Hans',version});expect(draft.questionSet).toBe(expected)
 }
 await seed(page,{status:'single-copy',locale:'zh-Hans',version:1},1,false)
 await page.evaluate(key=>{const s=JSON.parse(localStorage.getItem(key)!);s.questionSet='fullExtended';localStorage.setItem(key,JSON.stringify(s))},key)
 await page.goto('/zh/quiz');await page.reload()
 const old=JSON.parse((await page.evaluate(k=>localStorage.getItem(k),key))!);expect(old.questionSet).toBe('fullExtended');expect(old.foundationCopy.version).toBe(1)
})
