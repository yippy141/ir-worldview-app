import assert from "node:assert/strict"
import test from "node:test"
import {
  aiFieldGuideDisagreements,
  aiFieldGuidePowerRows,
  aiFieldGuideWorkedDecision,
  aiFieldGuideWorkedReadings,
  aiUnderModeledPerspectives,
} from "@/lib/ai-governance-field-guide-content"
import { archetypeProfiles } from "@/lib/ai-governance-scoring"
import { decisionHref, getPublishedDecision } from "@/lib/decision-exercises/catalog"

// The published access episode is the premise authority for the worked guide.
const episode = getPublishedDecision("who-gets-access")
assert.ok(episode, "the access episode must be published")
const situation = [
  aiFieldGuideWorkedDecision.situation, ...aiFieldGuideWorkedDecision.options,
  aiFieldGuideWorkedDecision.originalAdmission, aiFieldGuideWorkedDecision.revisedAdmission,
  aiFieldGuideWorkedDecision.unchanged, aiFieldGuideWorkedDecision.researchPermissions,
  aiFieldGuideWorkedDecision.uncertainty,
].join(" ")
const readings = aiFieldGuideWorkedReadings.map((reading) => reading.reading)
const everything = [
  situation,
  ...readings,
  ...aiFieldGuidePowerRows.flatMap((row) => [row.inspectAndRelease, row.restrictAndStop]),
  ...aiFieldGuideDisagreements.flatMap((pair) => [pair.sharedGround, pair.argument]),
]

test("the worked guide points at the published episode and covers each approach once", () => {
  assert.equal(aiFieldGuideWorkedDecision.exerciseHref, decisionHref("access"))
  assert.equal(aiFieldGuideWorkedDecision.exerciseTitle, episode.title)
  assert.deepEqual(
    aiFieldGuideWorkedReadings.map((reading) => reading.key).sort(),
    Object.keys(archetypeProfiles).sort(),
  )
})

test("the situation restates the episode's fixed evidence without strengthening it", () => {
  // The episode says the tests "do not establish autonomous attacks".
  assert.match(episode.assumptions[0], /do not establish autonomous attacks/u)
  assert.match(situation, /do not establish autonomous attacks/u)
  for (const text of everything) {
    assert.doesNotMatch(
      text,
      /\bno autonomous attacks\b|autonomous attacks (?:were|are|have been) (?:not )?(?:found|observed|ruled out)/iu,
      `must not turn "do not establish" into an observed absence: ${text}`,
    )
  }
  // Misuse: the episode says none was observed outside testing.
  assert.match(episode.assumptions[0], /no observed misuse outside testing/u)
  assert.match(situation, /no misuse has been observed outside testing/u)
})

test("the situation names both admission authorities as the episode defines them", () => {
  assert.match(episode.condition.before, /independent panel/u)
  assert.match(episode.condition.before, /Larch cannot veto a qualified applicant/u)
  assert.match(episode.condition.after, /Larch makes final admission decisions and can veto/u)

  assert.match(situation, /independent panel admits qualified teams/u)
  assert.match(situation, /Larch cannot veto a qualified applicant/u)
  assert.match(situation, /revised arrangement gives Larch final admission power and a veto over applicants who meet the same criteria/u)
  // No reading may describe the original arrangement as developer-run admission.
  for (const text of readings) {
    assert.doesNotMatch(
      text,
      /Larch (?:decides|controls|runs) (?:the )?admission|make Larch the gatekeeper/iu,
      `must not describe both arrangements as developer-controlled: ${text}`,
    )
  }
})

test("fixed resources are not turned into a shortage or a reduction", () => {
  assert.match(episode.assumptions[2], /Screening staff, criteria, budget, wait times and publication rights remain fixed/u)
  assert.match(situation, /Staffing, budget, screening criteria, wait times, research permissions and publication rights stay the same/u)
  const stateCapacity = aiFieldGuideWorkedReadings.find((reading) => reading.key === "stateCapacityBuilder")!
  assert.match(stateCapacity.reading, /asks whether the responsible bodies have the staff, money and authority/u)
  assert.doesNotMatch(
    stateCapacity.reading,
    /cannot staff|capacity is missing|shortage of staff|understaffed|reduced/iu,
  )
  // Staffing is a question to investigate, not an invented deficit or a prediction.
})

test("the options keep the episode's meanings: weights are irretrievable, not uninspectable", () => {
  const weights = episode.options.find((option) => option.id === "weights")!
  assert.match(weights.logic, /examine, modify and run the model/u)
  assert.match(weights.acceptedTradeoff, /cannot revoke copies/u)
  const enclave = episode.options.find((option) => option.id === "enclave")!
  assert.match(enclave.acceptedTradeoff, /Excluded researchers cannot reproduce the work/u)

  assert.match(situation, /downloadable weights/u)
  assert.match(situation, /secure enclave/u)
  assert.match(situation, /hosted service/u)
  for (const text of everything) {
    assert.doesNotMatch(
      text,
      /(?:open|published|downloadable) weights (?:defeat|prevent|make .* impossible)|weights (?:cannot|can't) be (?:inspected|examined|tested|reproduced)/iu,
      `must not say published weights prevent inspection or testing: ${text}`,
    )
  }
  const openEcosystem = aiFieldGuideWorkedReadings.find((reading) => reading.key === "openEcosystemBuilder")!
  assert.match(openEcosystem.reading, /reproduce and modify the model/u)
  assert.match(openEcosystem.reading, /Larch would lose the ability to recall the copies/u)
})

test("the comparisons describe discretion and authority instead of slogans", () => {
  for (const text of everything) {
    assert.doesNotMatch(text, /is not a rule\b/iu)
    assert.doesNotMatch(text, /take opposite sides/iu)
    assert.doesNotMatch(text, /\bworthless\b/iu)
    assert.doesNotMatch(text, /sets no rule\b|restricts no one\b/iu)
  }
  const coordination = aiFieldGuideWorkedReadings.find((reading) => reading.key === "coordinationArchitect")!
  assert.match(coordination.reading, /independent panel gives Larch less discretion to exclude qualified applicants/u)
  assert.match(coordination.reading, /how a developer veto would affect their willingness to rely on it/u)
  const democratic = aiFieldGuideWorkedReadings.find((reading) => reading.key === "democraticGuardrailist")!
  assert.match(democratic.reading, /who appoints that decision-maker, oversees its choices and hears a complaint from an excluded researcher\?/u)
})

// These are regression checks against explicit premises, not proof of semantic equivalence.
test("the scenario preserves access, permission and uncertainty conditions", () => {
  assert.match(episode.options.find(option => option.id === "enclave")!.logic, /Keep general access to a monitored hosted service/u)
  assert.equal(aiFieldGuideWorkedDecision.options[1], "Admit qualified external evaluators to a secure enclave, with general access through a monitored hosted service.")
  assert.match(episode.assumptions[2], /inspect and modify the model.*export approved findings and publish criticism/u)
  assert.equal(aiFieldGuideWorkedDecision.researchPermissions, "Qualified enclave participants may inspect and modify the model, export approved findings and publish criticism under the existing export terms. Weights remain inside the enclave.")
  assert.match(situation, /next three months/u)
  assert.match(situation, /No arrangement guarantees safety or useful criticism/u)
  assert.match(situation, /Capability and misuse evidence, and the public-weights and hosted-service options, also stay fixed/u)
})

test("recall and worker-voice prompts do not imply unlimited legal freedom or a new score", () => {
  const comparison = aiFieldGuideDisagreements.find(pair => pair.id === "concentration")!
  assert.ok(comparison.argument.endsWith("Wider access allows more researchers to reproduce the work, while Larch loses the ability to recall released copies. Shared rules raise a different concern: whether the participating firms and states would exclude others."))
  assert.doesNotMatch(comparison.argument, /nobody can restrict afterward/u)
  assert.equal(aiUnderModeledPerspectives.find(perspective => perspective.id === "labor-automation")!.readingQuestion, "How would you judge workplace AI if workers' bargaining power were your main concern?")
})
