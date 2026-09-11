import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { departureQuestions, departureReducer, initialDepartureState, interpretDeparture, complete, steps, type Answers, type DepartureState } from "@/lib/futures/departure"
import { departureClaims, futuresSources, premiseClaim } from "@/lib/futures/sources"
import { trajectories } from "@/lib/futures/trajectories"

const base: Answers = {
  aDesired: "open", aEvidence: "other", aDecision: "defer", aReason: "unsure", aOthers: "open",
  bDesired: "open", bEvidence: "other", bDecision: "defer", bReason: "unsure",
  cPolicy: "defer", cMonitoring: "defer", cIntervention: "defer", cReason: "unsure",
}
const ids = (answers: Answers) => interpretDeparture(answers).map(r => r.id)

test("interpretations have applicability and counterexamples; no answers are inferred", () => {
  const cases: Array<[string, Answers, Answers]> = [
    ["return-changes-choice", { aDecision: "stay", bDecision: "go", bReason: "return" }, { bDecision: "defer" }],
    ["personal-and-permitted", { aDecision: "stay", aOthers: "allow" }, { aOthers: "conditions" }],
    ["benefits-without-veto", { bDesired: "accept", cPolicy: "no-veto" }, { bDesired: "open" }],
    ["information-not-rule", { cMonitoring: "allow", cIntervention: "joint" }, { cIntervention: "unilateral" }],
    ["objection-under-premise", { bDesired: "reject" }, { bDesired: "open" }],
    ["desire-not-decision", { bDesired: "welcome", bDecision: "stay" }, { bDecision: "go" }],
    ["missing-reasons", { aReason: "other", bReason: "other", cReason: "other" }, { cReason: "unsure" }],
    ["terms-to-reconcile", { cPolicy: "compact", cMonitoring: "reject" }, { cMonitoring: "allow" }],
  ]
  for (const [id, applies, counter] of cases) {
    assert.ok(ids({ ...base, ...applies }).includes(id), id)
    assert.ok(!ids({ ...base, ...applies, ...counter }).includes(id), `${id} counterexample`)
  }
  assert.deepEqual(ids(base), ["decisions-first"])
  assert.deepEqual(interpretDeparture({ aDecision: "stay" }), [])
})

test("return interpretation names the reason rather than attributing distrust", () => {
  const reading = interpretDeparture({ ...base, aDecision: "stay", bDecision: "go", bReason: "opportunity" })[0]
  assert.match(reading.text, /opportunities offered elsewhere/)
  assert.match(reading.text, /does not isolate/)
  assert.doesNotMatch(reading.text, /you distrust|you fear/i)
  assert.match(interpretDeparture({ ...base, aDecision: "stay", bDecision: "go" }, "policy")[0].text, /fictional adult/)
})

test("explicit review and submission, reversible navigation and draft invalidation", () => {
  let state: DepartureState = { ...initialDepartureState }
  assert.equal(departureReducer(state, { type: "submit" }).step, "intro")
  assert.equal(departureReducer(state, { type: "navigate", step: "b" }).step, "intro")
  state = departureReducer(state, { type: "navigate", step: "a" })
  for (const q of departureQuestions.filter(q => q.stage === "a")) state = departureReducer(state, { type: "answer", id: q.id, value: base[q.id]! })
  assert.equal(state.step, "a", "selection must not advance")
  assert.ok(complete("a", state.answers))
  assert.equal(departureReducer({ ...state, answers: { ...base } }, { type: "submit" }).step, "a", "review is required even with complete answers")
  state = { ...state, answers: { ...base }, step: "review" }
  state = departureReducer(state, { type: "submit" })
  assert.equal(state.step, "result")
  const unchanged = departureReducer(state, { type: "navigate", step: "a" })
  assert.deepEqual(unchanged.answers, base)
  state = departureReducer(unchanged, { type: "answer", id: "aDecision", value: "stay" })
  assert.deepEqual(state.answers, { aDesired: "open", aEvidence: "other", aDecision: "stay" })
  assert.match(state.notice, /cleared/)
  assert.equal(state.step, "a")
  assert.equal(departureReducer(state, { type: "submit" }).step, "a")
  assert.deepEqual(interpretDeparture(state.answers), [])
})

test("invalid choices cannot produce a reading; resets clear draft and preserve explicit framing", () => {
  const state: DepartureState = { ...initialDepartureState, answers: base, step: "review" }
  assert.deepEqual(departureReducer(state, { type: "answer", id: "aDecision", value: "invented" }), state)
  assert.deepEqual(departureReducer(state, { type: "reset", framing: "policy" }), { ...initialDepartureState, framing: "policy" })
  assert.ok(steps.every(s => complete(s, base)))
  assert.deepEqual(interpretDeparture({ ...base, cPolicy: "invented" }), [])
})

test("all twelve historical IDs have source-located premises; reports remain qualified", () => {
  assert.equal(trajectories.length, 12)
  for (const trajectory of trajectories) {
    const claim = premiseClaim(trajectory.id, trajectory.tegmarkName)
    assert.ok(claim.text, trajectory.id)
    assert.ok(claim.citations[0].locator.includes(trajectory.tegmarkName))
  }
  assert.match(trajectories.find(t => t.id === "protector")!.plainSummary, /feeling of control/)
  assert.ok(departureClaims.some(c => c.kind === "Reported result" && c.confirmation === "Report not independently verified here"))
  for (const claim of departureClaims) for (const citation of claim.citations) assert.ok(futuresSources[citation.source].url.startsWith("https://"))
})

test("the bounded player has no storage, scoring, answer transport or answer URL encoder", () => {
  const files = ["components/futures/departure-player.tsx", "components/futures/departure-diagram.tsx", "lib/futures/departure.ts"]
  const code = files.map(file => readFileSync(new URL(`../${file}`, import.meta.url), "utf8")).join("\n")
  assert.doesNotMatch(code, /localStorage|sessionStorage|indexedDB|document\.cookie|fetch\(|sendBeacon|XMLHttpRequest|URLSearchParams|trackProductEvent/)
  assert.doesNotMatch(code, /ai-governance-share|scoreFoundation|resolveAiPayload/)
})
