import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { getFoundationQuestionsForSet, getFoundationResultQuestions, foundationExtendedQuestions, foundationBaselineForm, selectFoundationAnswersForSet } from "@/lib/quiz-schema"
import { foundationScoringCalibrationForForm, generateResult } from "@/lib/scoring"
import { buildFoundationSharePayload, encodePayload, resolveFoundationPayload } from "@/lib/share"
import { parseQuizSession, createEmptySession } from "@/lib/quiz-session"
import { buildTier1Cohort } from "@/lib/research/tier1-aggregate"
import { syntheticAnswers } from "@/tests/decision-exercises/fixtures"
import { getZhHansFoundationQuestionsForSet } from "@/content/locales/zh-Hans/foundation-instrument"
import { persistFoundationLocalEvidence } from "@/lib/results/local-evidence"
import { draftEpisodes, completeEpisode } from "@/lib/decision-exercises/content"
import { getPublishedDecision, decisionHref, decisionPublications } from "@/lib/decision-exercises/catalog"
import { comparisonStatus } from "@/lib/decision-exercises/status"
import { consumeFreshFoundationResult, markFreshFoundationResult } from "@/lib/results/fresh-foundation-result"
import { hasCompleteFoundationAnswers } from "@/lib/quiz-completion"
import type { FamilyKey, FoundationQuestionSet } from "@/lib/types"

test("all fourteen tier-core omissions block every baseline, saved-full and targeted completion", () => {
  const core = getFoundationQuestionsForSet("core")
  assert.equal(core.length, 14)
  assert.equal(core.find(q => q.id === "sc2")?.tier, "core")
  assert.equal(getFoundationQuestionsForSet("baselineExtended").find(q => q.id === "sc1")?.tier, "extended")
  const families: FamilyKey[] = ["realist", "institutionalist", "constructivist", "criticalPoliticalEconomy"]
  const forms: { questionSet: FoundationQuestionSet; targetedFamilyPair?: [FamilyKey, FamilyKey] }[] = [
    { questionSet:"baselineExtended" }, { questionSet:"fullExtended" },
  ]
  for (let i=0;i<families.length;i++) for (let j=i+1;j<families.length;j++) forms.push({ questionSet:"targetedExtended", targetedFamilyPair:[families[i],families[j]] })
  for (const form of forms) {
    const extension = getFoundationQuestionsForSet(form.questionSet,form.targetedFamilyPair)
    const answers = Object.fromEntries(getFoundationResultQuestions(form.questionSet,form.targetedFamilyPair).map(q => [q.id, q.kind === "likert" ? 4 : { primary:q.options[0].id }]))
    assert.equal(hasCompleteFoundationAnswers({ ...form, answers }), true)
    for (const question of core) {
      assert.equal(question.tier,"core")
      const incomplete = { ...answers }; delete incomplete[question.id]
      assert.ok(extension.every(q => incomplete[q.id] !== undefined))
      assert.equal(hasCompleteFoundationAnswers({ ...form, answers:incomplete }),false, `${form.questionSet}: ${question.id}`)
    }
    const incompleteExtension = { ...answers }; delete incompleteExtension[extension[0].id]
    assert.equal(hasCompleteFoundationAnswers({ ...form, answers:incompleteExtension }),false)
  }
  assert.equal(hasCompleteFoundationAnswers({ questionSet:"targetedExtended", answers:syntheticAnswers(12) }),false)
})

test("new baseline form preserves every scored item and order without the comparison battery", () => {
  const current = getFoundationQuestionsForSet("baselineExtended")
  assert.equal(current.length, 42)
  assert.equal(getFoundationResultQuestions("baselineExtended").length, 56)
  assert.equal(getFoundationQuestionsForSet("fullExtended").length, 54)
  assert.equal(getFoundationResultQuestions("fullExtended").length, 68)
  assert.deepEqual(current, foundationExtendedQuestions.filter(q => q.scoringBlock === "core"))
  assert.equal(foundationScoringCalibrationForForm("baselineExtended"), "extended")
  assert.equal(foundationBaselineForm.comparisonStatus, "common-item-only")
  assert.ok(getFoundationQuestionsForSet("core").every(q => q.scoringBlock === "core"))
  for (const localeQuestions of [current, getZhHansFoundationQuestionsForSet("baselineExtended")]) {
    assert.deepEqual(localeQuestions.map(q => q.id), current.map(q => q.id))
    assert.ok(localeQuestions.every(q => q.scoringBlock === "core"))
  }
})

test("512 scored synthetic records, ranked choices and both modes ignore low/high/mixed/omitted validation answers", () => {
  const validation = foundationExtendedQuestions.filter(q => q.scoringBlock === "validation")
  assert.equal(validation.length, 12)
  for (let seed = 1; seed <= 512; seed++) {
    const scored = syntheticAnswers(seed)
    for (const mode of ["standard", "analyst"] as const) {
      const expected = generateResult(scored, mode, "extended")
      for (const variant of [1, 7, 0]) {
        const answers = { ...scored, ...Object.fromEntries(validation.map((q,i) => [q.id, variant || 1 + (seed+i) % 7])) }
        assert.deepEqual(generateResult(answers, mode, "extended"), expected, `seed ${seed} / ${mode} / ${variant}`)
        assert.deepEqual(selectFoundationAnswersForSet(answers, "baselineExtended"), scored)
      }
    }
  }
})

test("additive form roundtrips without changing legacy payloads, sessions, aggregate separation or evidence bindings", async () => {
  class MemoryStorage { values = new Map<string,string>(); getItem(k:string){ return this.values.get(k) ?? null }; setItem(k:string,v:string){this.values.set(k,v)}; removeItem(k:string){this.values.delete(k)} }
  const answers = syntheticAnswers(12)
  const result = generateResult(answers, "analyst", "extended")
  for (const form of ["baselineExtended", "fullExtended"] as const) {
    const issued = buildFoundationSharePayload(result, "en", form)
    const encoded = encodePayload(issued)
    const resolved = resolveFoundationPayload(encoded)!
    assert.deepEqual(resolved.payload, issued)
    const session = { ...createEmptySession(), activeMode: "analyst", questionSet: form, answers }
    assert.deepEqual(JSON.parse(JSON.stringify(parseQuizSession(JSON.stringify(session)))), session)
  }
  assert.notDeepEqual(buildTier1Cohort("baselineExtended", "en"), buildTier1Cohort("fullExtended", "en"))
  const payload = encodePayload(buildFoundationSharePayload(result, "en", "baselineExtended"))
  const evidence = await persistFoundationLocalEvidence({ storage:new MemoryStorage(),sessionStorage:new MemoryStorage(),payload,answers,completionLocale:"en",questionSet:"baselineExtended",mode:"analyst",scoringCalibration:"extended",localCompletionId:"synthetic-new-form" })
  assert.equal(evidence.binding.formId, "baselineExtended")
  await assert.rejects(persistFoundationLocalEvidence({storage:new MemoryStorage(),sessionStorage:new MemoryStorage(),payload,answers,completionLocale:"en",questionSet:"fullExtended",mode:"analyst",scoringCalibration:"extended"}))
})

test("only the two listed English episode records publish; other drafts and unknown slugs fail closed", () => {
  assert.equal(decisionPublications.length, 2)
  for (const record of decisionPublications) {
    const episode = getPublishedDecision(record.slug)!
    assert.equal(episode.status, "published")
    assert.equal(episode.version, 3)
    assert.deepEqual(episode.options, draftEpisodes[episode.id].options)
    assert.deepEqual(episode.reasons, draftEpisodes[episode.id].reasons)
    assert.deepEqual(episode.condition, draftEpisodes[episode.id].condition)
    assert.match(decisionHref(episode.id), /^\/decisions\//)
  }
  for (const slug of ["verify", "draft", "new-episode", "../who-gets-access"]) assert.equal(getPublishedDecision(slug), null)
})

test("compact status does not turn withheld decisions and unexpressed reasons into policy or rationale equality", () => {
  const cases = [
    ["defer","defer","none","none","Both decisions withheld","Neither reason expressed by the offered choices"],
    ["national","defer","timely","none","Revised decision withheld","Revised reason unexpressed"],
    ["defer","custodian","none","equal","Original decision withheld","Original reason unexpressed"],
    ["custodian","custodian","equal","equal","Arrangement unchanged","Same stated reason"],
    ["national","custodian","timely","equal","Arrangement changed","Different stated reasons"],
    ["custodian","custodian","secrets","equal","Arrangement unchanged","Different stated reasons"],
  ]
  for (const [a,b,r1,r2,decisions,reasons] of cases) {
    assert.deepEqual(comparisonStatus({option:a,reason:r1},{option:b,reason:r2}),{decisions,reasons})
  }
})

test("published episodes retain all 800 authored response combinations and required specific meanings", () => {
  for (const {slug} of decisionPublications) {
    const e = getPublishedDecision(slug)!
    for (const a of [...e.options.map(o=>o.id),"defer"]) for (const b of [...e.options.map(o=>o.id),"defer"]) for (const r1 of e.reasons) for (const r2 of e.reasons) {
      const result = completeEpisode(e,{option:a,reason:r1.id},{option:b,reason:r2.id})!
      assert.ok(result)
      assert.doesNotMatch(result.interpretation.text,/undefined|this proves|your personality/)
      if (a === "defer" || b === "defer") assert.equal(result.relation,"decision-deferred")
    }
  }
  const verify=getPublishedDecision("who-gets-to-verify")!, access=getPublishedDecision("who-gets-access")!
  const result=(e:typeof verify,a:string,b:string,r1:string,r2:string)=>completeEpisode(e,{option:a,reason:r1},{option:b,reason:r2})!
  assert.match(result(verify,"national","custodian","timely","equal").interpretation.text,/retained an external check while abandoning asymmetric national inspection/)
  assert.match(result(verify,"custodian","custodian","equal","equal").interpretation.text,/remains reciprocal/)
  assert.match(result(access,"enclave","hosted","scrutiny","contain").interpretation.text,/not a blanket rejection of outside criticism/)
  assert.match(result(access,"enclave","weights","scrutiny","reproduce").interpretation.text,/cannot recall copies/)
  assert.match(result(access,"enclave","enclave","contain","scrutiny").interpretation.text,/decision stayed the same, while your stated rationale moved/)
})

test("fresh mark hint is consumed once in page memory, and production imports no experiment fixtures", () => {
  assert.equal(consumeFreshFoundationResult("synthetic"),false)
  markFreshFoundationResult("synthetic")
  assert.equal(consumeFreshFoundationResult("synthetic"),true)
  assert.equal(consumeFreshFoundationResult("synthetic"),false)
  for (const path of ["components/decision-exercises/episode-player.tsx","lib/decision-exercises/content.ts","lib/decision-exercises/catalog.ts","components/results/foundation-hero-mark.tsx","app/ai/results/[payload]/page.tsx"]) {
    assert.doesNotMatch(readFileSync(path,"utf8"), /@\/experiments|makeSyntheticRecord|syntheticPrior|node:crypto|Stewardship/)
  }
})
