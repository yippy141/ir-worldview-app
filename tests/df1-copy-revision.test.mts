import test from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { getFoundationQuestions, getFoundationQuestionsForSet, getFoundationResultQuestions } from "@/lib/quiz-schema"
import { getEnglishFoundationQuestions, getEnglishFoundationQuestionsForSet } from "@/lib/foundation-english-copy"
import { getZhHansFoundationQuestions, getZhHansFoundationQuestionsForSet } from "@/content/locales/zh-Hans/foundation-instrument"
import { isSupportedFoundationCopyVersion } from "@/lib/foundation-copy-versions"
import { initializeFoundationDraftCopy, foundationDraftCompletion, foundationDraftCopyVersion, parseFoundationDraftCopy } from "@/lib/foundation-draft-copy"
import { createEmptySession, parseQuizSession } from "@/lib/quiz-session"
import { buildFoundationCopySharePayload } from "@/lib/foundation-copy-share"
import { encodePayload, resolveFoundationPayload } from "@/lib/share"
import { sameResearchEquivalenceCohort } from "@/lib/locale-provenance"
import { generateResult } from "@/lib/scoring"
import { consumeFoundationEvidenceHandoff, foundationPayloadDigest, lookupFoundationLocalEvidence, persistFoundationLocalEvidence } from "@/lib/results/local-evidence"
import { MODELED_FAMILY_KEYS } from "@/lib/worldview-config"
import { syntheticAnswers } from "@/tests/decision-exercises/fixtures"
import type { Locale } from "@/i18n/routing"
import type { FamilyKey, FoundationQuestionSet } from "@/lib/types"
const record=JSON.parse(readFileSync('docs/evidence/df1-constant-threat-copy/copy-fixtures.json','utf8')) as {bank:string,bankSha256:string,fixtures:{locale:Locale,version:number,prompt:string,clarification:{whatItAsks:string}}[]}
const all=(locale:Locale,version?:number)=>locale==='en'?getEnglishFoundationQuestions('analyst',version):getZhHansFoundationQuestions('analyst',version)
const pairs=MODELED_FAMILY_KEYS.flatMap((a,i)=>MODELED_FAMILY_KEYS.slice(i+1).map(b=>[a,b] as const))
const forms: [FoundationQuestionSet,(readonly [FamilyKey,FamilyKey])?][]=[['core'],['baselineExtended'],['fullExtended'],...pairs.map(p=>['targetedExtended',p] as [FoundationQuestionSet,readonly [FamilyKey,FamilyKey]])]

test('issued English bank hash and every non-authorized field remain exact across five copy revisions',()=>{
 assert.equal(createHash('sha256').update(readFileSync(record.bank)).digest('hex'),record.bankSha256)
 const original=getFoundationQuestions('analyst');const before=JSON.stringify(original)
 for(const f of record.fixtures){
  const questions=all(f.locale,f.version),df1=questions.find(q=>q.id==='df1')!
  assert.deepEqual({prompt:df1.prompt,clarification:df1.clarification},{prompt:f.prompt,clarification:f.clarification})
  const baseline=f.locale==='en'?original:all('zh-Hans',f.version===3?2:f.version)
  for(let i=0;i<questions.length;i++){
   if(questions[i].id!=='df1')assert.deepEqual(questions[i],baseline[i])
   else {const {prompt:_p,clarification:_c,...rest}=questions[i];const {prompt:_p2,clarification:_c2,...old}=baseline[i];assert.deepEqual(rest,old)}
  }
 }
 assert.equal(all('en',2).find(q=>q.id==='df1')!.prompt,'A new governing coalition often redirects foreign policy even when the external threat remains unchanged.')
 assert.deepEqual(getEnglishFoundationQuestions('analyst'),all('en',2))
 assert.deepEqual(getZhHansFoundationQuestions('analyst'),all('zh-Hans',3))
 assert.equal(JSON.stringify(getFoundationQuestions('analyst')),before)
})

test('one supported-copy rule governs drafts, sharing and explicit historical form dispatch',()=>{
 const result=generateResult(syntheticAnswers(12,'core'),'analyst','core')
 for(const locale of ['en','zh-Hans'] as const){
  const fresh=initializeFoundationDraftCopy(createEmptySession(),locale)
  assert.deepEqual(foundationDraftCompletion(fresh,locale),{locale,localeCopyVersion:locale==='en'?2:3})
  for(const version of [0,1,2,3,4,99]){
   const supported=version>=1&&version<=(locale==='en'?2:3)
   assert.equal(isSupportedFoundationCopyVersion(locale,version),supported)
   assert.equal(parseFoundationDraftCopy({status:'single-copy',locale,version})?.status,supported?'single-copy':'unavailable')
   if(!supported&&version!==0)assert.throws(()=>buildFoundationCopySharePayload(result,locale,'core',undefined,version))
   if(!supported)assert.throws(()=>all(locale,version))
  }
  const unknown=initializeFoundationDraftCopy({...createEmptySession(),answers:{df1:6}},locale)
  assert.equal(foundationDraftCopyVersion(unknown),1);assert.equal(foundationDraftCompletion(unknown,locale).localeCopyVersion,0)
  assert.equal(sameResearchEquivalenceCohort({locale,localeCopyVersion:0},{locale,localeCopyVersion:0}),false)
 }
 for(const f of record.fixtures)for(const [form,pair] of forms){
  const session=parseQuizSession(JSON.stringify({...createEmptySession(),activeMode:'analyst',questionSet:form,targetedFamilyPair:pair,answers:syntheticAnswers(12,'core'),foundationCopy:{status:'single-copy',locale:f.locale,version:f.version}}))!
  assert.equal(foundationDraftCompletion(session,f.locale).localeCopyVersion,f.version)
  const actual=f.locale==='en'?getEnglishFoundationQuestionsForSet(form,pair,f.version):getZhHansFoundationQuestionsForSet(form,pair,f.version)
  assert.deepEqual(actual.map(q=>q.id),getFoundationQuestionsForSet(form,pair).map(q=>q.id))
  assert.equal(getFoundationResultQuestions(form,pair).filter(q=>q.id==='df1').length,1)
 }
 for(const a of record.fixtures)for(const b of record.fixtures)assert.equal(sameResearchEquivalenceCohort({locale:a.locale,localeCopyVersion:a.version},{locale:b.locale,localeCopyVersion:b.version}),a.locale===b.locale&&a.version===b.version)
})

class Storage {values=new Map<string,string>();getItem(k:string){return this.values.get(k)??null}setItem(k:string,v:string){this.values.set(k,v)}removeItem(k:string){this.values.delete(k)}}
test('saved wording and result identity remain bound to each supported copy; unknown and future evidence stay unavailable',async()=>{
 let answers=syntheticAnswers(1,'core')
 // Find a complete synthetic fixture whose existing evidence selection includes df1.
 let witnessed=false
 for(let seed=1;seed<=40;seed++){
  answers=syntheticAnswers(seed,'core');const result=generateResult(answers,'analyst','core')
  const payload=encodePayload(buildFoundationCopySharePayload(result,'zh-Hans','core',undefined,3))
  const evidence=await persistFoundationLocalEvidence({storage:new Storage(),sessionStorage:new Storage(),answers,payload,completionLocale:'zh-Hans',copyVersion:3,questionSet:'core',mode:'analyst',scoringCalibration:'core'})
  if(evidence.records.some(r=>r.itemId==='df1')){witnessed=true;break}
 }
 assert.ok(witnessed,'a complete synthetic df1 evidence witness is required')
 const result=generateResult(answers,'analyst','core');let first:unknown
 for(const f of record.fixtures){
  const store=new Storage(),handoff=new Storage()
  const payload=encodePayload(buildFoundationCopySharePayload(result,f.locale,'core',undefined,f.version))
  const resolved=resolveFoundationPayload(payload)!
  if(first)assert.deepEqual(resolved.result,first);else first=resolved.result
  assert.equal(resolved.provenance.localeCopyVersion,f.version)
  const input={storage:store,sessionStorage:handoff,answers,payload,completionLocale:f.locale,copyVersion:f.version,questionSet:'core' as const,mode:'analyst' as const,scoringCalibration:'core' as const}
  const evidence=await persistFoundationLocalEvidence(input)
  assert.equal(evidence.records.find(r=>r.itemId==='df1')!.prompt,f.prompt)
  const digest=(await foundationPayloadDigest(payload))!,binding=consumeFoundationEvidenceHandoff(handoff,digest)
  const bytes=JSON.stringify([...store.values])
  assert.equal(lookupFoundationLocalEvidence(store,payload,digest,binding,f.locale).status,'available')
  assert.equal(JSON.stringify([...store.values]),bytes)
  for(const version of [0,99]){
   const unsupported=encodePayload({...buildFoundationCopySharePayload(result,f.locale,'core',undefined,0),cv:version})
   await assert.rejects(persistFoundationLocalEvidence({...input,payload:unsupported,copyVersion:version}))
   assert.equal(lookupFoundationLocalEvidence(store,unsupported,(await foundationPayloadDigest(unsupported))!,binding,f.locale).status,'unavailable')
  }
  const different=record.fixtures.find(other=>other.locale===f.locale&&other.version!==f.version)!
  const mismatch=encodePayload(buildFoundationCopySharePayload(result,f.locale,'core',undefined,different.version))
  assert.equal(lookupFoundationLocalEvidence(store,mismatch,(await foundationPayloadDigest(mismatch))!,binding,f.locale).status,'unavailable')
 }
})
