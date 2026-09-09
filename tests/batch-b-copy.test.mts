import { buildFoundationCopySharePayload } from "@/lib/foundation-copy-share"
import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import { getFoundationQuestions, getFoundationQuestionsForSet, getFoundationResultQuestions } from "@/lib/quiz-schema"
import { getZhHansFoundationQuestions, getZhHansFoundationQuestionsForSet } from "@/content/locales/zh-Hans/foundation-instrument"
import { createEmptySession, parseQuizSession } from "@/lib/quiz-session"
import { initializeFoundationDraftCopy, foundationDraftCompletion, foundationDraftCopyVersion, foundationDraftMatchesLocale, foundationChineseCopyRevisions } from "@/lib/foundation-draft-copy"
import { encodePayload, resolveFoundationPayload } from "@/lib/share"
import { generateResult, foundationScoringCalibrationForForm } from "@/lib/scoring"
import { sameResearchEquivalenceCohort } from "@/lib/locale-provenance"
import { consumeFoundationEvidenceHandoff, foundationPayloadDigest, lookupFoundationLocalEvidence, persistFoundationLocalEvidence } from "@/lib/results/local-evidence"
import type { Answers } from "@/lib/types"

const old = getZhHansFoundationQuestions("analyst", 1)
const current = getZhHansFoundationQuestions("analyst", 2)
const english = getFoundationQuestions("analyst")
const record = JSON.parse(readFileSync("docs/evidence/batch-b-reading-and-localization/semantic-dispositions.json", "utf8"))
const visible = (q: typeof old[number]) => ({ prompt: q.prompt, helpText: q.helpText ?? null, clarification: q.clarification ?? null, options: q.kind === "likert" ? [] : q.options.map(({ id, title, label }) => ({ id, title, label })) })

test("ten ledger findings retain exact bilingual runtime evidence and finite dispositions", () => {
 assert.equal(record.ledgerRows, 605)
 assert.equal(record.uniqueFindings, 10)
 assert.equal(record.records.length, 10)
 assert.equal(record.records.filter((r: { disposition: string }) => r.disposition === "faithful-correction").length, 9)
 for (const r of record.records) {
  assert.deepEqual(r.english, visible(english.find(q => q.id === r.id)!))
  assert.deepEqual(r.servedChineseV1, visible(old.find(q => q.id === r.id)!))
  assert.ok(r.affectedLedgerExposures.length > 0)
  assert.ok(r.registryExposure.length > 0)
  if (r.id === "df1") assert.deepEqual(current.find(q => q.id === r.id), old.find(q => q.id === r.id))
  else assert.deepEqual(r.proposedChinese, visible(current.find(q => q.id === r.id)!))
 }
 // Independent meaning checks; these are mapping checks, not a human equivalence study.
 assert.match(current.find(q => q.id === "sc2")!.prompt, /即使双方持续合作.*军事准备.*必要/)
 assert.doesNotMatch(current.find(q => q.id === "v21_in_rev_03")!.prompt, /才能/)
 assert.match(current.find(q => q.id === "an_pe4")!.prompt, /未来十年.*关键基础设施.*相匹敌/)
 assert.match(current.find(q => q.id === "an_case_intervention_memory")!.prompt, /萨赫勒.*前殖民宗主国.*派兵援助/)
 assert.match(current.find(q => q.id === "an_tradeoff_energy_alignment")!.prompt, /基地使用权.*邻近对手.*就业岗位/)
 assert.match(old.find(q => q.id === "an_tradeoff_energy_alignment")!.prompt, /经济联系.*物价/)
})

test("copy revisions preserve every item, option and signal; 14/56/68 administration stays intact", () => {
 const strip = (q: typeof old[number]) => {
  const { prompt: _p, helpText: _h, clarification: _c, ...rest } = q
  return q.kind === "likert" ? rest : { ...rest, options: q.options.map(({ title: _t, label: _l, ...o }) => o) }
 }
 for (let i=0;i<english.length;i++) {
  assert.deepEqual(strip(old[i]), strip(english[i]))
  assert.deepEqual(strip(current[i]), strip(english[i]))
 }
 assert.equal(getFoundationQuestionsForSet("core").length,14)
 assert.equal(getFoundationResultQuestions("baselineExtended").length,56)
 assert.equal(getFoundationResultQuestions("fullExtended").length,68)
 for (const v of [1,2] as const) assert.equal(getZhHansFoundationQuestionsForSet("baselineExtended",undefined,v).length,42)
 assert.equal(foundationChineseCopyRevisions[2].comparison,"not-validated-or-equivalent")
 assert.equal(sameResearchEquivalenceCohort({locale:"zh-Hans",localeCopyVersion:1},{locale:"zh-Hans",localeCopyVersion:2}),false)
})

test("draft binding survives reload and extension; absent/mixed/future provenance is never upgraded", () => {
 const fresh=initializeFoundationDraftCopy(createEmptySession(),"zh-Hans")
 assert.deepEqual(fresh.foundationCopy,{status:"single-copy",locale:"zh-Hans",version:3})
 const started={...fresh,answers:{sc2:7},questionSet:"baselineExtended" as const}
 const reloaded=parseQuizSession(JSON.stringify(started))!
 assert.deepEqual(reloaded.foundationCopy,fresh.foundationCopy)
 assert.equal(foundationDraftMatchesLocale(reloaded,"en"),false)
 assert.throws(()=>foundationDraftCompletion(reloaded,"en"))
 const legacy=initializeFoundationDraftCopy({...createEmptySession(),answers:{sc2:7}},"zh-Hans")
 assert.equal(foundationDraftCopyVersion(legacy),1)
 assert.equal(foundationDraftCompletion(legacy,"zh-Hans").localeCopyVersion,0)
 assert.equal(foundationDraftCompletion(initializeFoundationDraftCopy(legacy,"en"),"en").localeCopyVersion,0)
 const v1={...started,foundationCopy:{status:"single-copy" as const,locale:"zh-Hans" as const,version:1 as const}}
 assert.equal(foundationDraftCopyVersion(initializeFoundationDraftCopy(v1,"zh-Hans")),1)
 const future=parseQuizSession(JSON.stringify({...started,foundationCopy:{status:"single-copy",locale:"zh-Hans",version:99}}))!
 assert.equal(foundationDraftMatchesLocale(future,"zh-Hans"),false)
})

class Storage {
 values=new Map<string,string>()
 getItem(k:string){return this.values.get(k)??null}
 setItem(k:string,v:string){this.values.set(k,v)}
 removeItem(k:string){this.values.delete(k)}
}
test("old shares and answer evidence resolve the recorded copy; unknown exposure cannot mint evidence",async()=>{
 const calibration=foundationScoringCalibrationForForm("core")!
 const answers:Answers=Object.fromEntries(getFoundationResultQuestions("core").map((q,i)=>[q.id,q.kind==="likert"?1+i%7:{primary:q.options[0].id}]))
 const result=generateResult(answers,"analyst",calibration)
 const store=new Storage(),handoff=new Storage()
 const payload1=encodePayload(buildFoundationCopySharePayload(result,"zh-Hans","core",undefined,1))
 const payload2=encodePayload(buildFoundationCopySharePayload(result,"zh-Hans","core",undefined,2))
 assert.deepEqual(resolveFoundationPayload(payload1)!.result,resolveFoundationPayload(payload2)!.result)
 const resolvedOld = resolveFoundationPayload(payload1)!
 assert.ok("cv" in resolvedOld.payload)
 assert.equal(resolvedOld.payload.cv,1)
 const input={storage:store,sessionStorage:handoff,payload:payload1,answers,completionLocale:"zh-Hans" as const,copyVersion:1,questionSet:"core" as const,mode:"analyst" as const,scoringCalibration:calibration}
 const evidence=await persistFoundationLocalEvidence(input)
 assert.equal(evidence.binding.copyVersion,1)
 const digest=await foundationPayloadDigest(payload1)
 assert.ok(digest)
 const digest2 = await foundationPayloadDigest(payload2)
 assert.ok(digest2)
 const binding=consumeFoundationEvidenceHandoff(handoff,digest)
 const storedBefore=JSON.stringify([...store.values])
 assert.equal(lookupFoundationLocalEvidence(store,payload1,digest,binding,"zh-Hans").status,"available")
 assert.equal(lookupFoundationLocalEvidence(store,payload2,digest2,binding,"zh-Hans").status,"unavailable")
 assert.equal(JSON.stringify([...store.values]),storedBefore)
 await assert.rejects(persistFoundationLocalEvidence({...input,copyVersion:2}))
 await assert.rejects(persistFoundationLocalEvidence({...input,copyVersion:0,payload:encodePayload(buildFoundationCopySharePayload(result,"zh-Hans","core",undefined,0))}))
})
