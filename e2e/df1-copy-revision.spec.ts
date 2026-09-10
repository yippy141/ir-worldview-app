import { test, expect, type Page } from '@playwright/test'
import { readFileSync, mkdirSync } from 'node:fs'
import { getFoundationQuestionsForSet, getFoundationResultQuestions } from '../lib/quiz-schema'
import { MODELED_FAMILY_KEYS } from '../lib/worldview-config'
import { QUIZ_STORAGE_KEY, FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY, PROFILE_STORAGE_KEY } from '../lib/storage-keys'
import type { Locale } from '../i18n/routing'
const fixtures=JSON.parse(readFileSync('docs/evidence/df1-constant-threat-copy/copy-fixtures.json','utf8')).fixtures as {locale:Locale,version:number,prompt:string,clarification:{whatItAsks:string}}[]
const index=getFoundationQuestionsForSet('core').findIndex(q=>q.id==='df1')
const answers=Object.fromEntries(getFoundationResultQuestions('fullExtended').map((q,i)=>[q.id,q.kind==='likert'?1+i%7:q.options[0].id]))
const pairs=MODELED_FAMILY_KEYS.flatMap((a,i)=>MODELED_FAMILY_KEYS.slice(i+1).map(b=>[a,b]))
const url=(locale:Locale,path:string)=>(locale==='zh-Hans'?'/zh':'')+path
const generate=(page:Page,locale:Locale)=>page.getByRole('button',{name:locale==='en'?'Generate my result →':'生成我的结果 →'})
async function writeDraft(page:Page,binding:unknown,draftAnswers:Record<string,unknown>,questionSet='core'){
 await page.goto('/privacy')
 await page.evaluate(({key,binding,answers,questionSet})=>localStorage.setItem(key,JSON.stringify({v:7,activeMode:'analyst',questionSet,orderSeed:'df1-synthetic',answers,contextAssist:false,itemLatencyBuckets:{},...(binding?{foundationCopy:binding}:{})})),{key:QUIZ_STORAGE_KEY,binding,answers:draftAnswers,questionSet})
}
async function openHelp(page:Page,f:typeof fixtures[number]){
 const legacy=page.getByRole('button',{name:f.locale==='en'?'Continue this saved form':'继续已保存的题组'})
 await expect(page.locator('.quiz-question-frame h2').or(legacy)).toBeVisible()
 if(await legacy.isVisible())await legacy.click()
 await expect(page.locator('.quiz-question-frame h2')).toHaveText(f.prompt)
 await page.getByRole('button',{name:f.locale==='en'?'Plain-language explanation':'查看简明说明',exact:true}).click()
 await expect(page.getByText(f.clarification.whatItAsks,{exact:true})).toBeVisible()
}
async function binding(page:Page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).foundationCopy,QUIZ_STORAGE_KEY)}
async function result(page:Page,f:typeof fixtures[number]){
 await generate(page,f.locale).click();await expect(page).toHaveURL(/\/results\//)
 expect(JSON.parse(Buffer.from(page.url().split('/').pop()!,'base64url').toString()).cv).toBe(f.version)
 await expect(page.locator('h1')).toBeVisible()
}
for(const f of fixtures)test(`${f.locale} copy ${f.version}: actual clarification, review, carried core and extension provenance`,async({page})=>{
 test.setTimeout(120_000)
 await page.setViewportSize({width:f.locale==='en'?1440:390,height:f.locale==='en'?900:844})
 const current=f.version===(f.locale==='en'?2:3)
 const known={status:'single-copy',locale:f.locale,version:f.version}
 await writeDraft(page,current?undefined:known,current?{}:{df1:5})
 await page.goto(url(f.locale,`/quiz?q=${index}&from=review`));await openHelp(page,f)
 expect(await binding(page)).toEqual(known)
 if(current){const dir=process.env.DF1_EVIDENCE_DIR??'docs/evidence/df1-constant-threat-copy/screenshots';mkdirSync(dir,{recursive:true});await page.locator('.quiz-question-frame').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/${f.locale}-copy-${f.version}-clarification.png`})}
 await page.locator('.likert-grid button').nth(5).click()
 await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).answers.df1,QUIZ_STORAGE_KEY)).toBe(6)
 await page.goto('/privacy')
 await page.evaluate(({key,answers})=>{const d=JSON.parse(localStorage.getItem(key)!);d.answers={...answers,df1:6};localStorage.setItem(key,JSON.stringify(d))},{key:QUIZ_STORAGE_KEY,answers})
 await page.goto(url(f.locale,'/quiz/review'));await page.locator('[data-question-id="df1"] button').click();await expect(page).toHaveURL(/\/quiz\?/);await page.reload();await openHelp(page,f)
 await page.getByRole('button',{name:f.locale==='en'?'← Return to review':'← 返回复核页',exact:true}).click();await result(page,f)
 // Real extension entry retains the already answered core's wording version.
 const forms=[['baselineExtended',undefined],...pairs.map(p=>['targetedExtended',p]),...(!current?[['fullExtended',undefined]]:[])] as [string,string[]|undefined][]
 for(const [form,pair] of forms){
  await writeDraft(page,known,answers,form==='fullExtended'?'fullExtended':'core')
  await page.goto(url(f.locale,form==='fullExtended'?'/quiz':pair?`/quiz?extension=targeted&first=${pair[0]}&second=${pair[1]}`:'/quiz?extension=full'))
  await expect.poll(async()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).questionSet,QUIZ_STORAGE_KEY)).toBe(form)
  expect(await binding(page)).toEqual(known)
  await page.goto('/privacy')
  await page.evaluate(key=>{const d=JSON.parse(localStorage.getItem(key)!);delete d.answers.df1;localStorage.setItem(key,JSON.stringify(d))},QUIZ_STORAGE_KEY)
  await page.goto(url(f.locale,'/quiz/review'));await expect(generate(page,f.locale)).toBeDisabled()
  await expect(page.locator('[data-question-id="df1"]')).toContainText(f.prompt)
  await page.locator('[data-question-id="df1"] button').click();await expect(page).toHaveURL(/\/quiz\?/);await page.reload();await openHelp(page,f)
  await page.locator('.likert-grid button').nth(5).click()
  await page.getByRole('button',{name:f.locale==='en'?'← Return to review':'← 返回复核页',exact:true}).click()
  await expect(generate(page,f.locale)).toBeEnabled();await result(page,f);expect(await binding(page)).toEqual(known)
 }
})

test('unknown, unsupported and switched-language drafts never inherit new wording without restart',async({page})=>{
 for(const locale of ['en','zh-Hans'] as const){
  const old=fixtures.find(f=>f.locale===locale&&f.version===1)!
  await writeDraft(page,undefined,answers);await page.goto(url(locale,`/quiz?q=${index}&from=review`));await openHelp(page,old)
  await page.evaluate(k=>localStorage.removeItem(k),FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY)
  await page.goto(url(locale,'/quiz/review'));await result(page,{...old,version:0})
  expect(await page.evaluate(k=>localStorage.getItem(k),FOUNDATION_LOCAL_EVIDENCE_STORAGE_KEY)).toBeNull()
  await writeDraft(page,{status:'single-copy',locale,version:locale==='en'?3:4},answers)
  await page.goto(url(locale,'/quiz'));await expect(page.locator('.quiz-question-frame')).toHaveCount(0)
  await expect(page.getByRole('heading',{name:locale==='en'?"This draft's copy revision is unavailable":'无法识别草稿的文字版本'})).toBeVisible()
  await page.goto(url(locale,'/quiz/review'));await expect(generate(page,locale)).toHaveCount(0)
 }
 const zh2=fixtures.find(f=>f.locale==='zh-Hans'&&f.version===2)!
 await writeDraft(page,{status:'single-copy',locale:'zh-Hans',version:2},answers)
 await page.goto('/quiz');await expect(page.getByRole('heading',{name:'Keep the language of this draft'})).toBeVisible()
 await expect(page.locator('.quiz-question-frame')).toHaveCount(0)
 await page.getByRole('link',{name:'Continue in the original language'}).click();await page.goto(`/zh/quiz?q=${index}`);await openHelp(page,zh2)
 await page.goto('/quiz')
 const profileBefore=await page.evaluate(k=>localStorage.getItem(k),PROFILE_STORAGE_KEY)
 page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'Clear draft and restart'}).click();expect(await binding(page)).toEqual({status:'single-copy',locale:'zh-Hans',version:2})
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Clear draft and restart'}).click()
 await expect.poll(()=>binding(page)).toEqual({status:'single-copy',locale:'en',version:2})
 expect(await page.evaluate(k=>localStorage.getItem(k),PROFILE_STORAGE_KEY)).toBe(profileBefore)
 await page.goto(`/quiz?q=${index}`);await openHelp(page,fixtures.find(f=>f.locale==='en'&&f.version===2)!)
})
