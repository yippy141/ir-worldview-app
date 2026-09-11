import test from "node:test"
import assert from "node:assert/strict"
import { findFuture } from "@/lib/futures/catalogue/index"
import { features } from "@/lib/futures/catalogue/features"
import { matchFutures, comparePreferences, descriptorEquivalenceGroups, equivalenceExplanation } from "@/lib/futures/matching"
import { interpretPreferences, comparisonParagraph, conditionQualification } from "@/lib/futures/interpretation"
import { humanPlural, allConflict, preferenceFixture } from "@/tests/fixtures/futures-preferences"

const text = (answers: typeof humanPlural) => interpretPreferences(answers).paragraphs.join("\n")
test("the same shortlisted candidate receives different applicable prose for contrary authority and mandate choices", () => {
  const delegated = humanPlural
  const nonhuman = { ...humanPlural, humanAuthority: { choice: "absent" as const, nonNegotiable: false } }
  const durable = { ...humanPlural, revisablePower: { choice: "absent" as const, nonNegotiable: false } }
  for (const answers of [delegated, nonhuman, durable]) assert.ok(matchFutures(answers).shortlist.some(c => c.scenario.id === "constitutional-delegation"))
  assert.match(text(delegated), /humans to retain final authority.*replace governing mandates/)
  assert.match(text(nonhuman), /favor nonhuman final authority/)
  assert.doesNotMatch(text(nonhuman), /You want humans to retain final authority/)
  assert.match(text(durable), /binding later generations to an enduring mandate/)
  assert.notEqual(text(delegated), text(nonhuman))
  assert.notEqual(text(delegated), text(durable))
  const candidate = findFuture("constitutional-delegation")!
  assert.match(comparisonParagraph(comparePreferences(candidate, nonhuman), nonhuman), /conflicts with your preference for nonhuman final authority/)
  assert.doesNotMatch(comparisonParagraph(comparePreferences(candidate, delegated), delegated), /conflicts with your preference/)
})

test("an indispensable ceiling leads the interpretation without turning permission into preference", () => {
  const answers = { ...humanPlural, capabilityLimits: { choice: "present" as const, nonNegotiable: true } }
  assert.ok(matchFutures(answers).shortlist.some(c => c.scenario.id === "constitutional-delegation"))
  assert.match(text(answers), /You want an enforced capability ceiling/)
  assert.notEqual(text(answers), text(humanPlural))
  const candidate = comparePreferences(findFuture("constitutional-delegation")!, answers)
  assert.ok(candidate.unconfirmedConstraints.includes("capabilityLimits"))
  assert.ok(!candidate.supported.includes("capabilityLimits"))
})

test("all four non-result interpretations identify the actual reason", () => {
  const answers = preferenceFixture({ humanAuthority: "present", biologicalContinuity: "present", capabilityLimits: "present" })
  const contrary = { ...findFuture("constitutional-delegation")!, features: features({ humanAuthority: "absent", biologicalContinuity: "absent", capabilityLimits: "absent" }) }
  const poor = interpretPreferences(answers, matchFutures(answers, [contrary]))
  assert.equal(poor.title, "The described worlds do not align closely enough")
  assert.match(poor.paragraphs[0], /mismatch.*rather than simply missing information/)
  const sparse = interpretPreferences(answers, matchFutures(answers, [{ ...contrary, features: features({}) }]))
  assert.equal(sparse.title, "The scenarios leave too much unresolved")
  assert.doesNotMatch(sparse.paragraphs[0], /mismatch/)
  const neutral = interpretPreferences(preferenceFixture())
  assert.equal(neutral.title, "More of your preferences remain open")
  assert.doesNotMatch(neutral.paragraphs.join(" "), /You favor|You want|You prefer/)
  assert.equal(interpretPreferences(allConflict).title, "No entry meets your confirmed requirements")
})

test("contextual explanations distinguish an uninstantiated institution, missing income and catastrophe", () => {
  const answers = preferenceFixture({ digitalStanding: "absent", sharedBenefits: "present", biologicalContinuity: "absent" })
  assert.match(conditionQualification(comparePreferences(findFuture("reversion")!, answers), "digitalStanding"), /no advanced artificial persons.*not a policy of excluding persons/)
  assert.match(conditionQualification(comparePreferences(findFuture("libertarian-market")!, answers), "sharedBenefits"), /does not say whether everyone receives a guaranteed material floor/)
  assert.match(conditionQualification(comparePreferences(findFuture("conquerors")!, answers), "biologicalContinuity"), /extinction cannot supply/)
  const equivalent = descriptorEquivalenceGroups().find(group => group.some(s => s.id === "planetary-restoration"))!
  assert.match(equivalenceExplanation(equivalent), /ecological mandate is an additional premise, not a preference inferred/)
})


test("human-only standing never implies human control when nonhuman authority is explicitly preferred", () => {
  const answers = preferenceFixture({ humanAuthority: "absent", biologicalContinuity: "present", digitalStanding: "absent", transparentPower: "absent" })
  const result = matchFutures(answers)
  assert.equal(result.shortlist[0].scenario.id, "protector")
  const reading = interpretPreferences(answers, result).paragraphs.join(" ")
  assert.match(reading, /does not by itself determine who has final governing authority/)
  assert.doesNotMatch(reading, /preserve human institutional control/)
  assert.match(comparisonParagraph(result.shortlist[0], answers), /nonhuman final authority/)
})
