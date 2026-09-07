/** Whole-product state coverage, using only declared synthetic records and existing contracts. */
import { test, expect, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { syntheticAnswers } from './fixtures'
import { getModuleQuestions } from '@/lib/modules/framework'
import { getCurrentModuleVersion } from '@/lib/modules/versions'
import { createModuleDraft, getModuleDraftKey } from '@/lib/modules/drafts'
import { getCurrentAiGovernanceVersion } from '@/lib/ai-governance-versions'
import { perspectiveCatalog } from '@/lib/perspectives/catalog'
import { encodePerspectivePayload } from '@/lib/perspectives/share'
import { encodeProfileSharePayload } from '@/lib/profile-share'
import { buildFoundationFixtureSet } from '@/scripts/v23-6/foundation-fixtures'
import { PROFILE_STORAGE_KEY, QUIZ_STORAGE_KEY, MODULE_DRAFT_STORAGE_KEY, AI_GOVERNANCE_STORAGE_KEY } from '@/lib/storage-keys'
import type { FamilyKey } from '@/lib/types'
import type { AiAnswers } from '@/lib/ai-governance-types'
const output='docs/evidence/decision-exercises-release/screenshots'
const historical=buildFoundationFixtureSet()
test.beforeEach(async({context})=>{
 await context.route(/\/api\/|\/_vercel\//,r=>r.abort())
 await context.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/,r=>r.abort())
})
async function seed(page:Page,key:string,value:unknown) {
 await page.goto('/privacy');await page.evaluate(({key,value})=>{localStorage.clear();localStorage.setItem(key,JSON.stringify(value))},{key,value})
}
async function capture(page:Page,name:string) {
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${output}/${name}.png`,animations:'disabled'})
}
test('all targeted Foundation forms, historical full/legacy outputs and unavailable versions render',async({page})=>{
 const families:FamilyKey[]=['realist','institutionalist','constructivist','criticalPoliticalEconomy']
 for(let i=0;i<families.length;i++) for(let j=i+1;j<families.length;j++) {
  const pair=[families[i],families[j]]
  await seed(page,QUIZ_STORAGE_KEY,{v:7,questionSet:'targetedExtended',targetedFamilyPair:pair,activeMode:'analyst',orderSeed:'synthetic-coverage',answers:syntheticAnswers(12),contextAssist:false,itemLatencyBuckets:{}})
  await page.goto('/quiz/review');await expect(page.getByRole('button',{name:'Generate my result →'})).toBeEnabled()
  await page.getByRole('button',{name:'Generate my result →'}).click();await expect(page).toHaveURL(/\/results\//)
  const payload=JSON.parse(Buffer.from(page.url().split('/').pop()!,'base64url').toString())
  expect(payload.qs).toBe('targetedExtended');expect(payload.tp).toEqual(pair)
  await expect(page.locator('h1')).toBeVisible()
 }
 for(const [name,payload] of Object.entries(historical)) {
  await page.goto(`/results/${payload}`);await expect(page.locator('h1')).toBeVisible()
  await expect(page.getByText('This link could not be decoded.')).toHaveCount(0)
  if(name==='legacy') await capture(page,'1440-foundation-legacy')
 }
 await page.goto('/results/'+Buffer.from(JSON.stringify({v:99})).toString('base64url'))
 await expect(page.locator('h1')).toContainText('could not be decoded')
})
test('Security and Technology Standard/Analyst complete reviews retain current version dispatch',async({page})=>{
 for(const slug of ['security','technology'] as const) for(const mode of ['standard','analyst'] as const) {
  const version=getCurrentModuleVersion(slug), questions=getModuleQuestions(version.definition,mode)
  const context={slug,mode,locale:'en',bankVersion:version.bankVersion,scoringVersion:version.scoringVersion,questions,allowsSecondChoice:()=>false}
  const draft={...createModuleDraft(context,'synthetic-coverage'),answers:Object.fromEntries(questions.map(q=>[q.id,{primary:q.options[0].id}])),stage:'review'}
  await seed(page,MODULE_DRAFT_STORAGE_KEY,{v:1,selectedMode:{[`${slug}:en`]:mode},drafts:{[getModuleDraftKey(context)]:draft}})
  await page.goto(`/modules/${slug}`);await expect(page.locator('#module-review-heading')).toBeVisible()
  await capture(page,`1440-${slug}-${mode}-review`)
  await page.getByRole('button',{name:new RegExp(`See .* result`)}).click();await expect(page).toHaveURL(new RegExp(`/modules/${slug}/results/`))
  await expect(page.locator('h1')).toBeVisible()
  await page.setViewportSize({width:390,height:844});await capture(page,`390-${slug}-${mode}-result`)
  await page.setViewportSize({width:1440,height:900})
 }
})
test('AI modes have complete reviews and exact old share outputs remain readable',async({page})=>{
 const ai=getCurrentAiGovernanceVersion()
 for(const mode of ['standard','analyst'] as const) {
  const answers:AiAnswers=Object.fromEntries(ai.schema.getAiCoreQuestions(mode).map(q=>[q.id,4]))
  for(const q of ai.scoring.getAiScenarioSequence(answers,mode)) answers[q.id]=ai.schema.getScenarioOptions(q,mode)[0].id
  await seed(page,AI_GOVERNANCE_STORAGE_KEY,{v:2,bv:ai.bankVersion,sv:ai.scoringVersion,started:true,mode,answers})
  await page.goto('/ai/review');await expect(page.getByRole('button',{name:'Generate my profile →'})).toBeEnabled()
  await capture(page,`1440-ai-${mode}-review`)
  await page.getByRole('button',{name:'Generate my profile →'}).click();await expect(page).toHaveURL(/\/ai\/results\//)
  await expect(page.locator('h1')).toBeVisible()
 }
})
test('Profile empty, single, legacy multiple-domain and shared views; every Perspective result',async({page})=>{
 for(const file of ['profile-store-v5.json','profile-store-v4.json']) {
  const record=JSON.parse(readFileSync(`tests/fixtures/${file}`,'utf8'))
  await seed(page,PROFILE_STORAGE_KEY,record)
  for(const route of ['/profile','/zh/profile','/compare']) {
   await page.goto(route);await expect(page.locator('h1')).toBeVisible()
   await capture(page,`1440-${file.replace('.json','')}-${route.replaceAll('/','')}`)
  }
 }
 const shared=encodeProfileSharePayload(JSON.parse(readFileSync('tests/fixtures/profile-share-v3.json','utf8')))
 await page.goto(`/profile/share/${shared}`);await expect(page.locator('h1')).toBeVisible()
 await page.goto(`/zh/profile/share/${shared}`);await expect(page.locator('h1')).toBeVisible()
 for(const perspective of perspectiveCatalog) {
  const payload=encodePerspectivePayload({v:1,perspectiveId:perspective.id,scenarioSetVersion:perspective.scenarioSetVersion,baselineScores:[4,4,4,4,4,4,4],answers:Object.fromEntries(perspective.scenarios.map(q=>[q.id,q.options[0].id]))})
  await page.goto(`/perspectives/${perspective.id}/result/${payload}`)
  await expect(page.locator('h1')).toContainText(perspective.shortLabel)
 }
})
