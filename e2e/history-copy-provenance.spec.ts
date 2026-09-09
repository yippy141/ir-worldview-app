import { test, expect, type Page } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { syntheticAnswers } from '../tests/decision-exercises/fixtures'
import { generateResult } from '../lib/scoring'
import { buildFoundationCopySharePayload } from '../lib/foundation-copy-share'
import { encodePayload, resolveFoundationPayload } from '../lib/share'
import { SCHEMA_VERSION } from '../lib/quiz-schema'
import { RESULT_HISTORY_STORAGE_KEY } from '../lib/storage-keys'
import { resolveArchetype } from '../lib/archetypes'
const dir=process.env.HISTORY_EVIDENCE_DIR ?? 'docs/evidence/batch-b-reading-and-localization/history-amendment'
function fixture(seed:number,copy:number,locale:'en'|'zh-Hans'='en') {
 const raw=generateResult(syntheticAnswers(seed,'core'),'analyst','core')
 const payload=encodePayload(buildFoundationCopySharePayload(raw,locale,'core',undefined,copy))
 const resolved=resolveFoundationPayload(payload)!
 return {payload,name:resolveArchetype(resolved.result).name,snapshot:{timestamp:1700000000000+seed,schemaVersion:SCHEMA_VERSION,familyKey:resolved.result.familyKey,neighborKey:resolved.result.runnerUpKey,strategyModifier:resolved.result.strategyModifier,normativeModifier:resolved.result.normativeModifier,dimensionScores:resolved.dimensionScores,locale,localeCopyVersion:copy}}
}
async function seed(page:Page,snapshots:ReturnType<typeof fixture>['snapshot'][]) {
 await page.goto('/privacy');await page.evaluate(({key,snapshots})=>localStorage.setItem(key,JSON.stringify(snapshots)),{key:RESULT_HISTORY_STORAGE_KEY,snapshots})
}
async function history(page:Page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)??'[]'),RESULT_HISTORY_STORAGE_KEY)}
async function capture(page:Page,name:string){mkdirSync(dir,{recursive:true});await page.locator('.history-saved-note').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/${name}.png`})}
for(const locale of ['en','zh-Hans'] as const) test(`${locale}: unknown saved observations stay individually readable without a comparison`,async({page})=>{
 const prior=fixture(1,0,locale),current=fixture(12,0,locale)
 await seed(page,[prior.snapshot]);await page.goto(`/results/${current.payload}`)
 await expect(page.locator('.history-saved-note')).toBeVisible()
 await expect(page.locator('.history-compare')).toHaveCount(0)
 await expect(page.locator('h1')).toContainText(current.name)
 expect((await history(page)).find((s:{timestamp:number})=>s.timestamp===prior.snapshot.timestamp)).toEqual(prior.snapshot)
 await capture(page,`unknown-${locale}`)
})
test('reopening an unknown result does not churn bounded history or evict unrelated records',async({page})=>{
 const current=fixture(12,0),others=[1,2,3,4].map(n=>fixture(n,1).snapshot)
 await seed(page,[current.snapshot,...others]);const before=await history(page)
 for(let i=0;i<6;i++) {
  await page.goto(`/results/${current.payload}`);await expect(page.locator('.history-saved-note')).toBeVisible();await page.reload();await expect(page.locator('.history-saved-note')).toBeVisible()
 }
 expect(await history(page)).toEqual(before)
 await expect(page.locator('.history-compare')).toHaveCount(0)
})
test('known comparison clears on a same-document Next navigation to an unknown result',async({page})=>{
 const prior=fixture(1,1),known=fixture(12,1),unknown=fixture(12,0)
 // A test-only redirect on the existing Next link supplies another result URL.
 // The result route/RSC and component are real; no new test route or production link is added.
 await page.route('**/feedback*',route=>route.fulfill({status:307,headers:{location:`/results/${unknown.payload}`}}))
 // Register before navigation so link prefetch cannot bypass the deterministic redirect.
 await seed(page,[prior.snapshot]);await page.goto(`/results/${known.payload}`)
 await expect(page.locator('.history-compare')).toBeVisible();await capture(page,'known-control')
 await page.evaluate(()=>{(window as unknown as {historyNavigationSentinel:boolean}).historyNavigationSentinel=true})
 await page.getByRole('link',{name:'Report a factual problem'}).click()
 await expect(page).toHaveURL(new RegExp(`/results/${unknown.payload}$`))
 expect(await page.evaluate(()=>(window as unknown as {historyNavigationSentinel:boolean}).historyNavigationSentinel)).toBe(true)
 await expect(page.locator('.history-saved-note')).toBeVisible()
 await expect(page.locator('.history-compare')).toHaveCount(0)
 expect((await history(page)).find((s:{timestamp:number})=>s.timestamp===prior.snapshot.timestamp)).toEqual(prior.snapshot)
 await expect(page.locator('h1')).toContainText(known.name)
})
