import test from "node:test"
import assert from "node:assert/strict"
import { sameResearchEquivalenceCohort } from "@/lib/locale-provenance"
import { getLastComparableSnapshot, getLastSnapshotWithProvenance, loadHistory, RESULT_HISTORY_STORAGE_KEY, type ResultSnapshot } from "@/lib/result-history"
import { generateResult } from "@/lib/scoring"
import { syntheticAnswers } from "@/tests/decision-exercises/fixtures"
import { SCHEMA_VERSION } from "@/lib/quiz-schema"

for (const locale of ["en", "zh-Hans"] as const) test(`${locale}: equal unknown copy markers cannot establish comparison eligibility`, () => {
 for (const [left,right,eligible] of [[0,0,false],[0,1,false],[1,0,false],[0,2,false],[2,0,false],[1,1,true],[2,2,true],[1,2,false]] as const) {
  assert.equal(sameResearchEquivalenceCohort({locale,localeCopyVersion:left},{locale,localeCopyVersion:right}),eligible,`${left}/${right}`)
 }
 assert.equal(sameResearchEquivalenceCohort({locale,localeCopyVersion:1},{locale:locale==='en'?'zh-Hans':'en',localeCopyVersion:1}),false)
})

test("history selection rejects unknown priors without rewriting saved records", () => {
 const result = generateResult(syntheticAnswers(12,'core'),'analyst','core')
 const snapshots: ResultSnapshot[] = [0,1].map((copy,i)=>({timestamp:100+i,schemaVersion:SCHEMA_VERSION,familyKey:result.familyKey,neighborKey:result.runnerUpKey,strategyModifier:result.strategyModifier,normativeModifier:result.normativeModifier,dimensionScores:result.dimensionScores,locale:'en',localeCopyVersion:copy}))
 const bytes=JSON.stringify(snapshots)
 const original=Object.getOwnPropertyDescriptor(globalThis,'window')
 Object.defineProperty(globalThis,'window',{configurable:true,value:{localStorage:{getItem:(key:string)=>key===RESULT_HISTORY_STORAGE_KEY?bytes:null}}})
 try {
  assert.equal(getLastComparableSnapshot({locale:'en',localeCopyVersion:0}),null)
  assert.deepEqual(getLastComparableSnapshot({locale:'en',localeCopyVersion:1}),snapshots[1])
  assert.deepEqual(getLastSnapshotWithProvenance({locale:'en',localeCopyVersion:0}),snapshots[0])
  assert.deepEqual(loadHistory(),snapshots)
 } finally {if(original)Object.defineProperty(globalThis,'window',original);else Reflect.deleteProperty(globalThis,'window')}
})
