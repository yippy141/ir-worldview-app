import test from "node:test"
import assert from "node:assert/strict"
import { buildFoundationInterpretation, foundationAxisReading } from "@/lib/results/foundation-interpretation"
import { positionBand } from "@/lib/results/interpretation"
import { buildCanonicalFoundationResult } from "@/lib/scoring"
import { buildFoundationSharePayload, decodePayload, encodePayload, payloadToDimensionScores } from "@/lib/share"
import type { DimensionScores } from "@/lib/types"

const middle: DimensionScores = { securityCompetition: 4, institutions: 4, domesticFilters: 4, normsIdentity: 4, politicalEconomy: 4, restraint: 4, orderJustice: 4 }
const domestic = { ...middle, domesticFilters: 6 }
const composed = "You give domestic politics an important role in foreign policy. Parties, interest groups and political institutions help explain why governments facing similar pressures can make different choices.\n\nThe summary scores do not settle how far you would press an advantage, or when justice should take priority over sovereignty and established rules. Those questions need a more specific case."
const original = (scores: DimensionScores, first: keyof DimensionScores) => `${foundationAxisReading(first, scores[first])} ${foundationAxisReading("restraint", scores.restraint)} ${foundationAxisReading("orderJustice", scores.orderJustice)}`

test("domestic high with both existing middle bands composes two precise paragraphs", () => {
  assert.deepEqual([3, 3.01, 4.99, 5].map(positionBand), ["low", "middle", "middle", "high"])
  for (const domesticFilters of [5, 6, 7]) for (const restraint of [3.01, 4, 4.99]) for (const orderJustice of [3.01, 4, 4.99]) {
    const scores = { ...domestic, domesticFilters, restraint, orderJustice }
    const reading = buildFoundationInterpretation(scores)
    assert.equal(reading.summary, composed)
    assert.equal(reading.kind, "model-interpretation")
    assert.deepEqual(scores, { ...domestic, domesticFilters, restraint, orderJustice })
    assert.doesNotMatch(reading.summary, /undecided|inconsistent|you (?:answered|selected|chose)|determined|contribut/i)
  }
})

test("low and high strategic or normative bands retain their original readings", () => {
  for (const axis of ["restraint", "orderJustice"] as const) for (const value of [1, 3, 5, 7]) {
    const scores = { ...domestic, [axis]: value }
    assert.equal(buildFoundationInterpretation(scores).summary, original(scores, "domesticFilters"))
  }
  for (const domesticFilters of [1, 3, 3.5, 4.5]) {
    const scores = { ...middle, domesticFilters }
    assert.equal(buildFoundationInterpretation(scores).summary, original(scores, "domesticFilters"))
  }
})

test("stable explanatory ties and all-midpoint inputs keep their historical selection order", () => {
  for (const first of ["securityCompetition", "institutions"] as const) {
    const scores = { ...domestic, [first]: 6 }
    assert.equal(buildFoundationInterpretation(scores).summary, original(scores, first))
  }
  for (const later of ["normsIdentity", "politicalEconomy"] as const) {
    assert.equal(buildFoundationInterpretation({ ...domestic, [later]: 6 }).summary, composed)
  }
  assert.equal(buildFoundationInterpretation(middle).summary, original(middle, "securityCompetition"))
})

test("score-only shared input gives the same reading without recovering answers or changing its payload", () => {
  const result = buildCanonicalFoundationResult(domestic, "core")
  const encoded = encodePayload(buildFoundationSharePayload(result, "en", "core"))
  const decoded = decodePayload(encoded)!
  assert.equal(buildFoundationInterpretation(payloadToDimensionScores(decoded)).summary, composed)
  assert.equal(encodePayload(decoded), encoded)
  assert.equal("answers" in decoded, false)
})
