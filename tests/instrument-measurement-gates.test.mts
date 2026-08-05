import test from "node:test"
import assert from "node:assert/strict"
import aiGovernanceBank from "@/content/instrument/ai-governance.v3.json" with {
  type: "json",
}
import {
  findAttainableRangeFindings,
  findCompromiseReviewFindings,
  findConcentrationFindings,
  findDeclaredAxisFindings,
  findDiscriminatingCoverageFindings,
  findMissingDeclaredAxisFindings,
  findNoQualifyingAxisFindings,
  findPoleAccessFindings,
  findReverseCodingFindings,
  findSaturationFindings,
  findThresholdRangeFindings,
  findUniformMeanCenteringFindings,
  evaluateBankGateSummary,
  evaluateDeclaredAxis,
  getAxisOptionStats,
  getOptionSignalStats,
  getTopHalfQualifyingAxes,
  isMeasurementFindingBlocking,
  MEASUREMENT_GATES_BLOCKING,
  type AxisOptionStats,
} from "@/lib/instrument/measurement-gates"

test("V22 measurement gates are blocking after Prompt 2C", () => {
  assert.equal(MEASUREMENT_GATES_BLOCKING, true)
})

test("item checks inspect declared axes only", () => {
  const options = [
    { id: "A", signals: { primary: 2, incidental: 4 } },
    { id: "B", signals: { primary: 6, incidental: 5 } },
  ]

  assert.deepEqual(
    findDeclaredAxisFindings({
      subject: "security.item",
      declaredAxes: ["primary"],
      options,
      midpoint: 4,
      minimumSpread: 2,
    }),
    [],
  )
  assert.deepEqual(
    findDeclaredAxisFindings({
      subject: "security.item",
      declaredAxes: ["incidental"],
      options,
      midpoint: 4,
      minimumSpread: 2,
    }).map(({ code }) => code),
    ["item-midpoint-straddle", "item-minimum-spread"],
  )
})

test("axis qualification includes top-half ties within epsilon", () => {
  const stats: AxisOptionStats<"a" | "b" | "c" | "d">[] = [
    { axis: "a", minimum: 0, maximum: 4, spread: 4 },
    { axis: "b", minimum: 0, maximum: 3, spread: 3 },
    { axis: "c", minimum: 0, maximum: 3 - 5e-10, spread: 3 - 5e-10 },
    { axis: "d", minimum: 0, maximum: 1, spread: 1 },
  ]

  assert.deepEqual(getTopHalfQualifyingAxes(stats, 1.5), ["a", "b", "c"])
})

test("axis qualification applies the minimum spread with epsilon", () => {
  const options = [
    { id: "A", signals: { axis: 0 } },
    { id: "B", signals: { axis: 1.5 - 5e-10 } },
  ]
  const stats = getAxisOptionStats(options, ["axis"], 0)

  assert.deepEqual(getTopHalfQualifyingAxes(stats, 1.5), ["axis"])
})

test("simple signal and declared-axis evaluators expose reusable stats", () => {
  assert.deepEqual(getOptionSignalStats([2, 4, 6], 4), {
    minimum: 2,
    maximum: 6,
    mean: 4,
    spread: 4,
    straddles: true,
  })
  assert.deepEqual(evaluateDeclaredAxis([4, 6], 4, 2), {
    minimum: 4,
    maximum: 6,
    mean: 5,
    spread: 2,
    straddles: false,
    meetsMinimumSpread: true,
    passes: false,
  })
})

test("zero qualifying axes produce a gate finding controlled by activation", () => {
  const [finding] = findNoQualifyingAxisFindings("technology.item", [])

  assert.equal(finding.code, "no-discriminating-axis")
  assert.equal(finding.classification, "gate")
  assert.equal(isMeasurementFindingBlocking(finding, false), false)
  assert.equal(isMeasurementFindingBlocking(finding, true), true)
})

test("the seven Advanced valence repairs are opposed propositions without negation", () => {
  const expectedAxes = new Map([
    ["rh3", "riskHorizon"],
    ["dp4", "deploymentPace"],
    ["ov5", "oversight"],
    ["gp3", "geopolitics"],
    ["op3", "openness"],
    ["lg4", "legitimacy"],
    ["hf3", "humanFuture"],
  ])
  const items = aiGovernanceBank.items.filter(
    (item) => item.kind === "likert" && expectedAxes.has(item.id),
  )

  assert.equal(items.length, expectedAxes.size)
  for (const item of items) {
    assert.deepEqual(item.modes, ["analyst"], item.id)
    assert.equal(item.axis, expectedAxes.get(item.id), item.id)
    assert.equal(item.reverse, true, item.id)
    assert.doesNotMatch(item.prompt, /\b(?:not|never|no longer)\b/i, item.id)
  }
})

test("an empty declaration cannot bypass item gates", () => {
  const [finding] = findMissingDeclaredAxisFindings("security.item", [])

  assert.equal(finding.code, "no-discriminating-axis")
  assert.equal(finding.classification, "gate")
  assert.deepEqual(
    findMissingDeclaredAxisFindings("security.item", ["activism"]),
    [],
  )
})

test("range and pole gates preserve their exact boundary semantics", () => {
  assert.deepEqual(findAttainableRangeFindings("axis", 2, 5, 3), [])
  assert.equal(
    findAttainableRangeFindings("axis", 2, 4.99, 3)[0].code,
    "bank-attainable-range",
  )

  assert.deepEqual(findAttainableRangeFindings("delta", -0.4, 0.4, 0.8), [])
  assert.deepEqual(findPoleAccessFindings("delta", -0.4, 0.4, 0), [])
  assert.equal(
    findPoleAccessFindings("delta", 0, 0.8, 0)[0].code,
    "bank-pole-access",
  )
})

test("coverage and calibrated thresholds preserve their boundaries", () => {
  assert.deepEqual(
    findDiscriminatingCoverageFindings("security.standard.escalation", 4, 4),
    [],
  )
  assert.equal(
    findDiscriminatingCoverageFindings(
      "security.standard.escalation",
      3,
      4,
    )[0].code,
    "discriminating-coverage",
  )

  assert.deepEqual(findThresholdRangeFindings("lower", 2, 2, 6), [])
  assert.deepEqual(findThresholdRangeFindings("upper", 6, 2, 6), [])
  assert.equal(
    findThresholdRangeFindings("upper", 6.001, 2, 6)[0].code,
    "threshold-outside-attainable-range",
  )
})

test("uniform mean may sit exactly at the maximum centre distance", () => {
  assert.deepEqual(
    findUniformMeanCenteringFindings("axis", 4.3, 1, 7, 0.3),
    [],
  )
  assert.equal(
    findUniformMeanCenteringFindings("axis", 4.301, 1, 7, 0.3)[0].code,
    "bank-uniform-mean",
  )
})

test("concentration and saturation must stay strictly below their limits", () => {
  assert.equal(
    findConcentrationFindings("headline", 0.4, 0.4)[0].code,
    "outcome-concentration",
  )
  assert.deepEqual(findConcentrationFindings("headline", 0.399, 0.4), [])
  assert.match(
    findConcentrationFindings(
      "headline",
      0.4,
      0.4,
      "default headline",
    )[0].message,
    /default headline share/,
  )

  assert.deepEqual(
    findSaturationFindings("axis", 0.1, 0.1, 0.1).map(({ code }) => code),
    ["floor-saturation", "ceiling-saturation"],
  )
  assert.deepEqual(findSaturationFindings("axis", 0.099, 0.099, 0.1), [])
})

test("reverse coding may sit exactly at its minimum ratio", () => {
  assert.deepEqual(findReverseCodingFindings("axis", 0.4, 0.4), [])
  assert.equal(
    findReverseCodingFindings("axis", 0.399, 0.4)[0].code,
    "reverse-coding",
  )
})

test("bank summary uses the same inclusive and strict boundary rules", () => {
  assert.deepEqual(
    evaluateBankGateSummary({
      minimum: 1,
      maximum: 4,
      midpoint: 2.5,
      minimumRange: 3,
      uniformMean: 2.8,
      maximumCenterDistance: 0.3,
      modalShare: 0.4,
      maximumConcentration: 0.4,
      floorShare: 0.099,
      ceilingShare: 0.1,
      maximumSaturation: 0.1,
      reverseRatio: 0.4,
      minimumReverseRatio: 0.4,
    }),
    {
      minimumRangeMet: true,
      bothPolesReached: true,
      uniformMeanCentered: true,
      concentrationBelowLimit: false,
      floorSaturationBelowLimit: true,
      ceilingSaturationBelowLimit: false,
      reverseCodingMet: true,
    },
  )
})

test("compromise findings are review-only even when gates are blocking", () => {
  const findings = findCompromiseReviewFindings({
    subject: "ai.scenario",
    axes: ["x", "y"],
    midpoint: 0,
    options: [
      { id: "A", signals: { x: -1, y: -1 } },
      { id: "B", signals: { x: 0, y: 0 } },
      { id: "C", signals: { x: 1, y: 1 } },
    ],
  })

  assert.deepEqual(
    findings.map(({ code, classification }) => ({ code, classification })),
    [{ code: "compromise-option", classification: "review" }],
  )
  assert.equal(isMeasurementFindingBlocking(findings[0], true), false)
})
