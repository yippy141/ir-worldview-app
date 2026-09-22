import { test, expect } from '/private/tmp/ir-final-audit-20260919/source/node_modules/@playwright/test/index.mjs'
import { writeFileSync } from 'node:fs'
const output='/private/tmp/ir-final-audit-20260919/evidence/'
const payload={v:5,ds:[4.5,5.5,5,6,5,5.5,4.5],fk:'constructivist',nk:'institutionalist',sm:'Restrainer',nm:'Conditional Solidarist',iv:4,bv:2,sv:2,cv:2,cl:'en',qs:'core'}
const encode=(p:unknown)=>Buffer.from(JSON.stringify(p)).toString('base64url')
test('fresh share recipient: history and personal Profile are separately recorded',async({page})=>{
  await page.goto('/results/'+encode(payload))
  await expect(page.getByText('Saved to this device',{exact:true})).toBeVisible()
  const storage=await page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).map(k=>[k,JSON.parse(localStorage.getItem(k)??'null')])))
  writeFileSync(output+'share-recipient-storage.json',JSON.stringify(storage,null,2))
  await page.goto('/profile')
  writeFileSync(output+'share-recipient-profile.txt',await page.locator('main').innerText())
})
test('same locale core and full-form links trigger old history comparison',async({page})=>{
  await page.goto('/results/'+encode(payload))
  await expect(page.getByText('Saved to this device',{exact:true})).toBeVisible()
  await page.goto('/results/'+encode({...payload,qs:'baselineExtended',ds:[5.5,4,5,4,4,5,4]}))
  await expect(page.getByText('Saved to this device',{exact:true})).toBeVisible()
  writeFileSync(output+'cross-form-history.txt',await page.locator('main').innerText())
})
test('blocked persistence and 404 metadata',async({page})=>{
  await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Audit blocked storage','QuotaExceededError')}})
  await page.goto('/results/'+encode(payload))
  await expect(page.getByText('Saved to this device',{exact:true})).toBeVisible()
  const saved=await page.evaluate(()=>({keys:Object.keys(localStorage),label:document.body.innerText.includes('Saved to this device')}))
  await page.goto('/audit-page-does-not-exist')
  await expect(page.getByRole('heading',{name:'This page does not exist'})).toBeVisible()
  const errorPage=await page.evaluate(()=>({title:document.title,lang:document.documentElement.lang}))
  writeFileSync(output+'storage-failure-and-404.json',JSON.stringify({saved,errorPage},null,2))
})
test('neutral result and print layout evidence',async({page})=>{
  await page.setViewportSize({width:390,height:844})
  await page.goto('/results/'+encode({...payload,ds:[4,4,4,4,4,4,4],fk:'realist',nk:'institutionalist',sm:'Hedger'}))
  await expect(page.getByRole('heading',{level:1})).toBeVisible()
  writeFileSync(output+'neutral-result.txt',await page.locator('main').innerText())
  await page.screenshot({path:output+'neutral-result-mobile.png'})
  await page.emulateMedia({media:'print'})
  await page.pdf({path:output+'neutral-result-print.pdf',format:'A4',printBackground:true})
})
