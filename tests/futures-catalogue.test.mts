import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { futureCatalogue, findFuture, catalogueVersion, scenarioHref, compareHref } from "@/lib/futures/catalogue/index"
import { featureIds, featureDefinitions, features } from "@/lib/futures/catalogue/features"
import { trajectories } from "@/lib/futures/trajectories"
import { matchFutures, comparePreferences } from "@/lib/futures/matching"
import { preferenceReducer, initialPreferenceState } from "@/lib/futures/preference-state"
import { preferenceQuestions, preferencesComplete } from "@/lib/futures/preferences"
import { humanPlural, centralizedCare, lowTechnology, allConflict, preferenceFixture } from "@/tests/fixtures/futures-preferences"
import { interpretDeparture, type Answers } from "@/lib/futures/departure"

const shortlist = (answers: typeof humanPlural) => matchFutures(answers).shortlist.map(c => c.scenario.id)

test("all nineteen entries preserve the original twelve identities and contain reviewable data", () => {
  assert.equal(futureCatalogue.length, 19)
  assert.equal(new Set(futureCatalogue.map(s => s.id)).size, 19)
  assert.equal(futureCatalogue.filter(s => s.exercise).length, 1)
  assert.deepEqual(futureCatalogue.filter(s => s.origin === "inherited").map(s => s.name), ["Libertarian Utopia", "Benevolent Dictator", "Egalitarian Utopia", "Gatekeeper", "Protector God", "Enslaved God", "Conquerors", "Descendants", "Zookeeper", "1984", "Reversion", "Self-destruction"])
  for (const old of trajectories) {
    const current = findFuture(old.id)!
    assert.ok(current)
    assert.equal(current.legacySummary, old.plainSummary)
    assert.ok(current.name === old.name || current.aliases.includes(old.name))
  }
  for (const s of futureCatalogue) {
    for (const field of [s.name, s.premise, s.life, s.authority, s.distribution, s.status, s.assumptions, s.attractions, s.costs, s.unknowns]) assert.ok(field.trim().length > 3)
    assert.equal(s.version, catalogueVersion)
    assert.ok(s.comparisons.length >= 2 && s.comparisons.length <= 3)
    assert.equal(new Set(s.comparisons).size, s.comparisons.length)
    for (const id of s.comparisons) { assert.ok(findFuture(id)); assert.notEqual(id, s.id); assert.ok(compareHref(s.id, id).includes("?a=")) }
    assert.equal(Object.keys(s.features).length, featureIds.length)
    for (const value of Object.values(s.features)) assert.ok(["present", "absent", "variant-dependent", "unspecified", "inapplicable"].includes(value))
    assert.ok(s.sources.length)
    for (const source of s.sources) { assert.ok(source.locator); assert.equal(source.checked, "2026-09-11"); assert.ok(source.url.startsWith(s.origin === "inherited" ? "https://futureoflife.org/" : "/futures")) }
    assert.equal(scenarioHref(s.id), `/futures/scenarios/${s.id}`)
  }
  assert.equal(findFuture("protector")!.features.humanAuthority, "absent")
  assert.equal(findFuture("egalitarian-commons")!.features.humanAuthority, "unspecified")
  assert.equal(findFuture("libertarian-market")!.features.personalExit, "unspecified")
  assert.equal(findFuture("departure")!.features.personalExit, "variant-dependent")
})

test("different declared conditions produce different shortlists including human and no-ASI futures", () => {
  assert.notDeepEqual(shortlist(humanPlural), shortlist(centralizedCare))
  assert.ok(shortlist(humanPlural).includes("constitutional-delegation"))
  assert.ok(shortlist(centralizedCare).includes("benevolent-singleton"))
  assert.ok(shortlist(lowTechnology).includes("reversion"))
  assert.ok(shortlist(lowTechnology).includes("negotiated-ceiling"))
  assert.ok(!shortlist(humanPlural).includes("departure"))
})

test("hard conflicts cannot be averaged away and a catalogue may produce no result", () => {
  const answers = structuredClone(centralizedCare)
  answers.humanAuthority = { choice: "present", nonNegotiable: true }
  const comparison = comparePreferences(findFuture("benevolent-singleton")!, answers)
  assert.ok(comparison.supported.length > comparison.hardConflicts.length)
  assert.deepEqual(comparison.hardConflicts, ["humanAuthority"])
  assert.ok(!shortlist(answers).includes("benevolent-singleton"))
  assert.equal(matchFutures(allConflict).outcome, "all-conflict")
  assert.deepEqual(shortlist(allConflict), [])
})

test("unknowns keep their weight unresolved and cannot masquerade as guaranteed support", () => {
  const answers = preferenceFixture({ humanAuthority: "present", sharedBenefits: "present", biologicalContinuity: "present", personalExit: "present" })
  answers.personalExit!.nonNegotiable = true
  const c = comparePreferences(findFuture("egalitarian-commons")!, answers)
  assert.ok(c.unresolved.includes("humanAuthority"))
  assert.deepEqual(c.unconfirmedConstraints, ["personalExit"])
  assert.ok(!c.supported.includes("personalExit"))
  const known = { ...findFuture("egalitarian-commons")!, features: features({ humanAuthority: "present", sharedBenefits: "present", biologicalContinuity: "present", personalExit: "present" }) }
  assert.ok(comparePreferences(known, answers).orderingValue > c.orderingValue)
  const blank = { ...known, features: features({}) }
  assert.equal(comparePreferences(blank, answers).orderingValue, 0)
  assert.equal(matchFutures(answers, [blank]).outcome, "insufficient-scenario-evidence")
})

test("minimum domain evidence and neutral responses do not force a middle or a winner", () => {
  assert.equal(matchFutures({}).outcome, "insufficient-preferences")
  assert.equal(matchFutures(preferenceFixture()).outcome, "insufficient-preferences")
  const choices = preferenceFixture({ humanAuthority: "present", capabilityLimits: "present" })
  assert.equal(matchFutures(choices).outcome, "insufficient-preferences")
  choices.biologicalContinuity = { choice: "present", nonNegotiable: false }
  assert.equal(matchFutures(choices).outcome, "shortlist")
  const sparse = { ...findFuture("reversion")!, features: features({ humanAuthority: "present", capabilityLimits: "present" }) }
  assert.equal(matchFutures(choices, [sparse]).outcome, "insufficient-scenario-evidence")
  for (const choice of ["uncertain", "no-preference", "other"] as const) assert.deepEqual(matchFutures(preferenceFixture({ humanAuthority: choice })).shortlist, [])
})

test("domains have equal budgets, prose length has no effect, and cutoff ties are preserved", () => {
  const c = findFuture("constitutional-delegation")!
  const answers = preferenceFixture({ humanAuthority: "present", revisablePower: "present", personalExit: "present", sharedBenefits: "present", privateOwnership: "absent" })
  const clone = { ...c, features: features({ humanAuthority: "present", revisablePower: "present", personalExit: "present", sharedBenefits: "present", privateOwnership: "absent" }) }
  assert.equal(comparePreferences(clone, answers).orderingValue, 3)
  const unknownExit = { ...clone, features: { ...clone.features, personalExit: "unspecified" as const } }
  assert.equal(comparePreferences(unknownExit, answers).orderingValue, 2.5)
  const entries = ["Delta", "Beta", "Alpha", "Gamma"].map((name, index) => ({ ...clone, id: `fixture-${index}`, name, life: clone.life.repeat(index + 1) }))
  const matched = matchFutures(answers, entries)
  assert.equal(matched.shortlist.length, 4)
  assert.deepEqual(matched.shortlist.map(s => s.scenario.name), ["Alpha", "Beta", "Delta", "Gamma"])
  assert.equal(new Set(matched.shortlist.map(c => c.orderingValue)).size, 1)
})

test("identical synthetic Departure answers do not determine general preferences", () => {
  const departureAnswers: Answers = { aDesired: "accept", aEvidence: "control", aDecision: "stay", aReason: "attachment", aOthers: "allow", bDesired: "welcome", bEvidence: "demonstration", bDecision: "go", bReason: "return", cPolicy: "no-veto", cMonitoring: "allow", cIntervention: "joint", cReason: "self-rule" }
  const readers = [{ departure: departureAnswers, general: humanPlural }, { departure: structuredClone(departureAnswers), general: centralizedCare }]
  assert.deepEqual(interpretDeparture(readers[0].departure), interpretDeparture(readers[1].departure))
  assert.notDeepEqual(shortlist(readers[0].general), shortlist(readers[1].general))
  const matcher = readFileSync("lib/futures/matching.ts", "utf8")
  assert.doesNotMatch(matcher, /interpretDeparture|departureReducer|\.x\b|\.y\b|ai-governance|localStorage/)
})

test("review is mandatory; edits invalidate the submitted reading and clear changed constraints", () => {
  assert.equal(preferenceQuestions.length, 12)
  assert.equal(new Set(preferenceQuestions.map(q => q.id)).size, 12)
  assert.deepEqual(preferenceQuestions.map(q => q.id), featureIds)
  assert.equal(new Set(featureIds.map(id => featureDefinitions[id].domain)).size, 8)
  assert.equal(preferenceReducer(initialPreferenceState, { type: "submit" }), initialPreferenceState)
  let state = { ...initialPreferenceState, answers: structuredClone(humanPlural) }
  assert.ok(preferencesComplete(state.answers))
  state = preferenceReducer(state, { type: "review" })
  state = preferenceReducer(state, { type: "constraint", id: "humanAuthority", confirmed: true })
  state = preferenceReducer(state, { type: "submit" })
  assert.ok(state.submitted)
  state = preferenceReducer(state, { type: "question", index: 0 })
  state = preferenceReducer(state, { type: "answer", id: "humanAuthority", choice: "absent" })
  assert.equal(state.submitted, null)
  assert.equal(state.answers.humanAuthority!.nonNegotiable, false)
  state = preferenceReducer(state, { type: "answer", id: "humanAuthority", choice: "uncertain" })
  assert.equal(preferenceReducer(state, { type: "constraint", id: "humanAuthority", confirmed: true }), state)
  assert.equal(preferenceReducer(state, { type: "question", index: -1 }), state)
  assert.deepEqual(preferenceReducer(state, { type: "reset" }), initialPreferenceState)
})

test("expectations stay separate, preserve unassessed entries, and never affect matching", () => {
  let state = preferenceReducer({ ...initialPreferenceState, step: "review", answers: humanPlural }, { type: "submit" })
  assert.deepEqual(state.expectations, {})
  const before = shortlist(state.submitted!)
  state = preferenceReducer(state, { type: "expectations" })
  state = preferenceReducer(state, { type: "expectation", id: "conquerors", value: "plausible" })
  state = preferenceReducer(state, { type: "expectation", id: "reversion", value: "unlikely" })
  state = preferenceReducer(state, { type: "read-expectations" })
  assert.deepEqual(shortlist(state.submitted!), before)
  assert.equal(Object.keys(state.expectations).length, 2)
  state = preferenceReducer(state, { type: "question", index: 0 })
  state = preferenceReducer(state, { type: "answer", id: "humanAuthority", choice: "absent" })
  assert.equal(state.expectations.conquerors, "plausible")
  state = preferenceReducer(state, { type: "expectation", id: "conquerors", value: "unassessed" })
  assert.ok(!("conquerors" in state.expectations))
  assert.equal(preferenceReducer(state, { type: "expectation", id: "not-published", value: "plausible" }), state)
})

test("new preference surfaces have no storage, telemetry, result-codec or network integration", () => {
  for (const path of ["components/futures/preference-player.tsx", "components/futures/comparison-explorer.tsx", "lib/futures/preferences.ts", "lib/futures/preference-state.ts", "lib/futures/matching.ts"]) {
    assert.doesNotMatch(readFileSync(path, "utf8"), /localStorage|sessionStorage|indexedDB|document\.cookie|fetch\(|sendBeacon|XMLHttpRequest|useSearchParams|result-codec|saveProfile/)
  }
})


test("catastrophic absence supplies no preferred institutions or valued-succession support", () => {
  const absent = preferenceFixture(Object.fromEntries(featureIds.map(id => [id, "absent"])))
  for (const id of ["self-destruction", "conquerors"]) {
    const comparison = comparePreferences(findFuture(id)!, absent)
    assert.deepEqual(comparison.supported, [])
    assert.equal(comparison.evidenceSufficient, false)
    assert.equal(comparison.inapplicable.length, 12)
    assert.ok(!shortlist(absent).includes(id))
    const conflicts = comparePreferences(findFuture(id)!, humanPlural)
    assert.ok(conflicts.conflicts.includes("biologicalContinuity"))
    assert.ok(futureCatalogue.some(s => s.id === id))
  }
  const successors = comparePreferences(findFuture("descendants")!, absent)
  assert.ok(successors.supported.includes("biologicalContinuity"))
})
