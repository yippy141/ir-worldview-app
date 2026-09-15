import assert from "node:assert/strict"
import test from "node:test"
import {
  aiFieldGuideDisagreements,
  aiFieldGuidePowerRows,
  aiFieldGuideWorkedDecision,
  aiFieldGuideWorkedReadings,
} from "@/lib/ai-governance-field-guide-content"
import { archetypeProfiles } from "@/lib/ai-governance-scoring"
import { decisionHref, getPublishedDecision } from "@/lib/decision-exercises/catalog"

// The published access episode is the premise authority for the worked guide.
const episode = getPublishedDecision("who-gets-access")
assert.ok(episode, "the access episode must be published")
const situation = aiFieldGuideWorkedDecision.situation
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
  assert.match(situation, /revised arrangement gives Larch the final veto/u)
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
  assert.match(situation, /Staffing, screening criteria, wait times and publication rights stay the same/u)
  const stateCapacity = aiFieldGuideWorkedReadings.find((reading) => reading.key === "stateCapacityBuilder")!
  assert.match(stateCapacity.reading, /stay fixed/u)
  assert.doesNotMatch(
    stateCapacity.reading,
    /cannot staff|capacity is missing|shortage of staff|understaffed|reduced/iu,
  )
  // The reading may say hosted access is not yet shown to be the only workable
  // arrangement; it may not assert that the capacity is absent.
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
  assert.match(openEcosystem.reading, /copies Larch cannot revoke/u)
})

test("the comparisons describe discretion and authority instead of slogans", () => {
  for (const text of everything) {
    assert.doesNotMatch(text, /is not a rule\b/iu)
    assert.doesNotMatch(text, /take opposite sides/iu)
    assert.doesNotMatch(text, /\bworthless\b/iu)
    assert.doesNotMatch(text, /sets no rule\b|restricts no one\b/iu)
  }
  const coordination = aiFieldGuideWorkedReadings.find((reading) => reading.key === "coordinationArchitect")!
  assert.match(coordination.reading, /final discretion/u)
  assert.match(coordination.reading, /contest the decision/u)
})
