import test from "node:test"
import assert from "node:assert/strict"
import { evidenceFromProfile, withAiEvidence, evidenceFromToken } from "@/lib/connected/evidence"
import { buildConnectedRelations } from "@/lib/connected/relations"
import { syntheticProfile, aiFixture, moduleToken } from "@/tests/connected-fixtures"
import { qualifyAiCompletion, handoffAiCompletion, takeAiCompletion, bindAiCompletionToSnapshot, aiEvidenceForSnapshot } from "@/lib/results/ai-completion-evidence"
import { buildEvidenceComparison } from "@/lib/profile-compare"

function bundle() {
  const b = evidenceFromProfile(syntheticProfile().profile)
  const a = aiFixture()
  return withAiEvidence(b, qualifyAiCompletion(a.token, a.answers, "standard")!)
}
test("each relation preserves source IDs, kinds, provenance, applicability and change conditions", () => {
  for (const r of buildConnectedRelations(bundle())) {
    assert.notEqual(r.state, "unavailable")
    assert.ok(r.ruleId && r.applicability && r.changesWith)
    assert.ok(r.followUp.options.includes("I am uncertain"))
    assert.ok(r.followUp.options.includes("Another reason"))
    for (const source of r.evidence) { assert.ok(source.resultId && source.provenance.bank); assert.notEqual(source.kind, "actor-role-judgment") }
  }
  assert.ok(buildConnectedRelations({}).every(r => r.state === "unavailable"))
  assert.ok(buildConnectedRelations({ ai: bundle().ai }).every(r => r.state === "unavailable"))
})
test("access supports staged release with wider AI access, opposing emphases and moderate scores", () => {
  const b = bundle()
  const release = b.technology!.observations.find(o => o.id === "open_weight_models")!
  const access = b.ai!.observations.find(o => o.id === "score:openness")!
  release.choiceId = "staged_release_rules"; access.value = 2
  let r = buildConnectedRelations(b)[0]
  assert.equal(r.state, "applicable"); assert.match(r.text, /Wider investigation and restricted release can coexist/)
  assert.doesNotMatch(r.text, /contradiction|you believe|you want/)
  release.choiceId = "restrict_above_threshold"
  assert.equal(buildConnectedRelations(b)[0].state, "contrary")
  access.value = 4
  assert.equal(buildConnectedRelations(b)[0].state, "mixed")
  b.ai!.observations = b.ai!.observations.filter(o => o.kind === "derived-score")
  r = buildConnectedRelations(b)[0]
  assert.equal(r.state, "score-only"); assert.match(r.text, /underlying AI choices are unavailable/)
  delete b.technology
  assert.equal(buildConnectedRelations(b)[0].state, "unavailable")
})
test("authority separates public rules, capacity and ownership; labels alone cannot activate it", () => {
  const b = bundle(), oversight = b.ai!.observations.find(o => o.id === "score:oversight")!
  const compute = b.technology!.observations.find(o => o.id === "public_compute")!
  compute.choiceId = "build_public_compute"; oversight.value = 6
  assert.equal(buildConnectedRelations(b)[1].state, "applicable")
  compute.choiceId = "let_private_scale_lead"
  assert.equal(buildConnectedRelations(b)[1].state, "contrary")
  assert.match(buildConnectedRelations(b)[1].text, /Public rule-setting, the ability to deliver a service and national ownership are separate/)
  oversight.value = 4
  assert.equal(buildConnectedRelations(b)[1].state, "mixed")
  b.ai!.observations = b.ai!.observations.filter(o => o.kind === "derived-score")
  assert.equal(buildConnectedRelations(b)[1].state, "score-only")
  b.technology!.observations = b.technology!.observations.filter(o => o.id !== "public_compute")
  assert.equal(buildConnectedRelations(b)[1].state, "unavailable")
})
test("cooperation does not turn an actor role or the AI average into a personal preference", () => {
  const b = bundle(), rivalry = b.foundation!.observations.find(o => o.id === "score:securityCompetition")!
  rivalry.value = 6
  b.ai!.observations.find(o => o.id === "gp1")!.value = 6
  b.ai!.observations.find(o => o.id === "gp2")!.value = 6
  assert.equal(buildConnectedRelations(b)[2].state, "applicable")
  b.ai!.observations.find(o => o.id === "gp2")!.value = 2
  assert.equal(buildConnectedRelations(b)[2].state, "contrary")
  rivalry.value = 4
  assert.equal(buildConnectedRelations(b)[2].state, "mixed")
  b.ai!.observations = b.ai!.observations.filter(o => o.kind === "derived-score")
  assert.equal(buildConnectedRelations(b)[2].state, "score-only")
  assert.match(buildConnectedRelations(b)[2].text, /AI average cannot recover/)
  b.security!.observations = b.security!.observations.filter(o => o.kind === "actor-role-judgment")
  assert.equal(buildConnectedRelations(b)[2].state, "unavailable")
})
test("exact AI choices follow only their saved completion in memory", () => {
  const f = aiFixture()
  handoffAiCompletion(f.token, f.answers, "standard")
  bindAiCompletionToSnapshot(f.token, 1800000000010)
  assert.ok(takeAiCompletion(f.token))
  assert.ok(aiEvidenceForSnapshot({ payload: f.token, timestamp: 1800000000010 }))
  assert.equal(aiEvidenceForSnapshot({ payload: f.token, timestamp: 1800000000009 }), null)
  assert.equal(aiEvidenceForSnapshot({ payload: "another", timestamp: 1800000000010 }), null)
})
test("different selections with the same module result name remain inspectable", () => {
  const seen = new Map<string, ReturnType<typeof evidenceFromToken>>()
  let found = false
  for (let offset = 0; offset < 4; offset++) {
    const r = evidenceFromToken("technology", moduleToken("technology", offset), { language: "en", copy: 1 })!
    const previous = seen.get(r.title)
    if (previous) { assert.ok(buildEvidenceComparison({ technology: previous }, { technology: r })[0].differentChoices.length); found = true }
    seen.set(r.title, r)
  }
  // Title never participates in the claim contract, even for equal aggregate names.
  if (!found) {
    const l = seen.values().next().value!, r = structuredClone(l!)
    r.observations.find(o => o.kind === "exact-decision")!.text = "A different synthetic decision supplied for the same aggregate"
    assert.equal(buildEvidenceComparison({ technology: l! }, { technology: r })[0].state, "identical")
    assert.ok(buildEvidenceComparison({ technology: l! }, { technology: r })[0].differentChoices.length)
  }
})
