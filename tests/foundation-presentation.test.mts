import assert from "node:assert/strict"
import test from "node:test"
import profileFixture from "./fixtures/profile-store-v5.json" with { type: "json" }
import { syntheticAnswers } from "@/tests/decision-exercises/fixtures"
import { foundationCoreQuestions } from "@/lib/quiz-schema"
import { generateResult, buildCanonicalFoundationResult, foundationScoringCalibrationForForm } from "@/lib/scoring"
import { encodePayload, buildFoundationSharePayload } from "@/lib/share"
import { classifyFoundationPresentation, buildFoundationResultHeading } from "@/lib/results/foundation-result-heading"
import { buildFoundationCardCopy, buildEnglishFoundationResultSocialCopy, buildEnglishProfileSocialCopy, buildZhHansFoundationResultSocialCopy } from "@/lib/foundation-social-copy"
import { buildFoundationShareCardInput } from "@/lib/share-card"
import { resolveFoundationIdentityFromSnapshot, foundationIdentityTitle } from "@/lib/profile-foundation-identity"
import { parseProfileStore } from "@/lib/profile-store"
import { buildLocalizedProfileShareView } from "@/lib/profile-share-locale"
import { buildFoundationExtensionPayoff } from "@/lib/results/foundation-extension-payoff"
import { persistFoundationLocalEvidence } from "@/lib/results/local-evidence"
import { foundationGlossary } from "@/lib/foundation-glossary"

const classify = (result: ReturnType<typeof generateResult>) => classifyFoundationPresentation(result, .3675)
const core = (seed: number) => generateResult(syntheticAnswers(seed, "core"), "analyst", "core")

test("all-1/4/7 core vectors are flat; exact ties are distinct from close and clear results", () => {
  for (const answer of [1, 4, 7]) {
    const result = generateResult(Object.fromEntries(foundationCoreQuestions.map(q => [q.id, answer])), "analyst", "core")
    assert.deepEqual(Object.values(result.dimensionScores), Array(7).fill(4))
    assert.deepEqual(Object.values(result.familyScores), Array(4).fill(0))
    assert.equal(classify(result).kind, "flat")
    assert.equal(classify(result).showArchetype, false)
  }
  assert.deepEqual(core(25282).familyScores, { realist: .33, institutionalist: -.36, constructivist: .33, criticalPoliticalEconomy: .33 })
  assert.equal(classify(core(25282)).kind, "multiway-tie")
  assert.equal(classify(core(1)).kind, "two-way-tie")
  assert.equal(classify(core(2)).kind, "close")
  assert.equal(classify(core(3)).kind, "clear")
  assert.notEqual(classify(core(4)).kind, "multiway-tie", "a small top-to-third gap is not an exact tie")
  const midpoint = Object.fromEntries(Object.keys(core(3).dimensionScores).map(key => [key, 4])) as ReturnType<typeof core>["dimensionScores"]
  const nonflatFour = { ...buildCanonicalFoundationResult({ ...midpoint, restraint: 5 }, "core"), familyScores: {realist:0,institutionalist:0,constructivist:0,criticalPoliticalEconomy:0}, nearestFitGap:0 }
  assert.equal(classify(nonflatFour).kind, "multiway-tie")
  assert.equal(classify(nonflatFour).tiedFamilies.length, 4)
})

test("ambiguous results use dimension-first titles across Profile, metadata and cards without rewriting snapshots", () => {
  for (const result of [core(25282), generateResult(Object.fromEntries(foundationCoreQuestions.map(q => [q.id, 4])), "analyst", "core")]) {
    const payload = encodePayload(buildFoundationSharePayload(result, "en", "core"))
    const profile = parseProfileStore(JSON.stringify(profileFixture), "en")
    assert.ok(profile.foundation)
    profile.foundation = { ...profile.foundation, payload, resultPath: `/results/${payload}` }
    const frozen = JSON.stringify(profile)
    const identity = resolveFoundationIdentityFromSnapshot(profile.foundation)!
    const card = buildFoundationShareCardInput(result, .3675)
    const cardCopy = buildFoundationCardCopy(card.archetype, card.norm, card.presentation)
    assert.equal(cardCopy.name, foundationIdentityTitle(identity))
    assert.equal(cardCopy.readingCode, "Dimension profile")
    for (const locale of ["en", "zh-Hans"] as const) {
      const view = buildLocalizedProfileShareView(profile, locale)!
      assert.equal(view.foundation?.ambiguous, true)
      assert.equal(view.foundation?.archetypeCode, "")
      assert.ok(view.foundation?.qualification)
      assert.equal(view.foundation?.dimensions.length, 7)
      assert.equal(view.foundation?.archetypeName, foundationIdentityTitle(identity, locale))
    }
    for (const social of [buildEnglishFoundationResultSocialCopy(card.archetype, card.norm, card.presentation), buildEnglishProfileSocialCopy(card.archetype, card.presentation), buildZhHansFoundationResultSocialCopy(card.archetype, "arbitrary rationale", card.presentation)]) {
      assert.ok(!social.title.includes(card.archetype.name))
      assert.ok(!social.description.includes("arbitrary rationale"))
    }
    assert.equal(JSON.stringify(profile), frozen)
  }
  const result = core(1)
  const heading = buildFoundationResultHeading({resultTier:"core", questionSet:"core", legacy:false, lowDifferentiation:true, primaryLabel:result.familyLabel, runnerUpLabel:result.runnerUpLabel, presentation:classify(result)})
  assert.match(heading.title, /are tied/)
  assert.match(heading.lead, /does not establish a winner/)
})

class MemoryStorage {
  data = new Map<string, string>()
  getItem(key: string) { return this.data.get(key) ?? null }
  setItem(key: string, value: string) { this.data.set(key, value) }
  removeItem(key: string) { this.data.delete(key) }
}

test("extended and targeted payoff uses exact completion evidence, never a shared URL or mismatched draft as history", async () => {
  for (const questionSet of ["baselineExtended", "targetedExtended"] as const) {
    const pair = questionSet === "targetedExtended" ? ["realist", "institutionalist"] as const : undefined
    const calibration = foundationScoringCalibrationForForm(questionSet, pair)!
    const answers = syntheticAnswers(12)
    // Build with exact administered subset just as completion does.
    const { selectFoundationAnswersForSet } = await import("@/lib/quiz-schema")
    const exact = selectFoundationAnswersForSet(answers, questionSet, pair)
    const payload = encodePayload(buildFoundationSharePayload(generateResult(exact,"analyst",calibration), "en", questionSet, pair))
    const evidence = await persistFoundationLocalEvidence({storage:new MemoryStorage(),sessionStorage:new MemoryStorage(),payload,answers:exact,completionLocale:"en",questionSet,targetedFamilyPair:pair,mode:"analyst",scoringCalibration:calibration})
    const draft = JSON.stringify({v:7,questionSet,targetedFamilyPair:pair,activeMode:"analyst",orderSeed:"test",answers:exact,contextAssist:false,itemLatencyBuckets:{}})
    const bound = buildFoundationExtensionPayoff(payload,evidence,"en",draft)!
    assert.ok(bound.comparison)
    assert.match(bound.note, /not score changes between core and extended/)
    assert.equal(buildFoundationExtensionPayoff(payload,null,"en",draft)!.comparison,null)
    assert.equal(buildFoundationExtensionPayoff(payload,evidence,"en",draft.replace('"answers":', '"discardedAnswers":'))!.comparison,null)
    assert.match(buildFoundationExtensionPayoff(payload,null,"zh-Hans")!.title,/追加题目/)
  }
  assert.equal(buildFoundationExtensionPayoff(encodePayload(buildFoundationSharePayload(core(3),"en","core")),null),null)
})

test("supplemental glossary defines the requested terms without touching administered content", () => {
  for (const locale of ["en", "zh-Hans"] as const) {
    assert.equal(foundationGlossary("case_protection",locale).length,2)
    assert.equal(foundationGlossary("v21_rs_rev_05",locale).length,1)
    assert.deepEqual(foundationGlossary("not-an-item",locale),[])
  }
})
