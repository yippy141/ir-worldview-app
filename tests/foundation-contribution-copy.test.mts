import assert from "node:assert/strict"
import test from "node:test"
import { dimensionLabels } from "@/lib/quiz-schema"
import { buildFoundationContributionCopy } from "@/lib/results/foundation-contribution-copy"
import { decomposeFoundationFamilyDifference } from "@/lib/results/foundation-contributions"
import { familyProfiles, getV2ScoringCalibration } from "@/lib/scoring"
import type { DimensionKey, DimensionScores } from "@/lib/types"

const DIMENSIONS: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

const CLEAR_REALIST_SCORES: DimensionScores = {
  securityCompetition: 6.48,
  institutions: 2.16,
  domesticFilters: 4,
  normsIdentity: 2.9,
  politicalEconomy: 4.27,
  restraint: 2.5,
  orderJustice: 3.17,
}

function copyFor(
  scores: DimensionScores,
  options: { legacy?: boolean; lowDifferentiation?: boolean } = {},
) {
  const decomposition = decomposeFoundationFamilyDifference({
    dimensionScores: scores,
    calibration: "core",
    primaryFamily: "realist",
    runnerUpFamily: "institutionalist",
  })
  return {
    decomposition,
    copy: buildFoundationContributionCopy({
      rows: decomposition.rows,
      legacy: options.legacy ?? false,
      lowDifferentiation: options.lowDifferentiation ?? false,
      primaryLabel: "Realism",
      runnerUpLabel: "Institutionalism",
      dimensionLabel: (dimension) => dimensionLabels[dimension],
    }),
  }
}

test("scores at the calibration means give zero terms and claim no midpoint or tie", () => {
  const baseline = getV2ScoringCalibration("core").neutralBaseline
  const scores = Object.fromEntries(
    DIMENSIONS.map((dimension) => [dimension, baseline[dimension].mean]),
  ) as DimensionScores

  const { decomposition, copy } = copyFor(scores)
  for (const row of decomposition.rows) assert.equal(Math.abs(row.signedContribution), 0)
  assert.equal(copy.state, "no-advantage")
  assert.equal(copy.lead, "These dimension terms give neither interpretation an advantage.")
  assert.doesNotMatch(copy.lead, /midpoint|tie|level/u)
  assert.equal(copy.unavailableNote, null)
})

test("a clear result names the largest positive term as a relative contribution, and the opposing term where one exists", () => {
  const { decomposition, copy } = copyFor(CLEAR_REALIST_SCORES)
  const largest = decomposition.rows[0]
  assert.ok(largest.signedContribution > 0)
  const lowest = [...decomposition.rows].sort(
    (left, right) => left.signedContribution - right.signedContribution,
  )[0]

  assert.equal(copy.state, "leading")
  assert.match(copy.lead, new RegExp(`^Your answers on ${dimensionLabels[largest.dimension]} made the largest positive contribution`, "u"))
  assert.match(copy.lead, /counted for Realism more than for Institutionalism/u)
  assert.doesNotMatch(copy.lead, /sided with|endorse|believe/u)
  if (lowest.signedContribution < 0) {
    assert.match(copy.lead, new RegExp(`On ${dimensionLabels[lowest.dimension]} they made the largest opposing contribution`, "u"))
    assert.doesNotMatch(copy.lead, /stayed close/u)
    assert.match(
      copyFor(CLEAR_REALIST_SCORES, { lowDifferentiation: true }).copy.lead,
      /and why it stayed close\.$/u,
    )
  }
})

test("two dimensions with the same largest positive term are named together", () => {
  // Build a real decomposition where two dimensions carry equal terms: set
  // each standardized position to a common constant divided by its weight
  // difference, and leave every other dimension at the calibration mean.
  const baseline = getV2ScoringCalibration("core").neutralBaseline
  const weightDifference = (dimension: DimensionKey) =>
    (familyProfiles.realist[dimension] ?? 0) - (familyProfiles.institutionalist[dimension] ?? 0)
  const paired: DimensionKey[] = ["securityCompetition", "institutions"]
  const target = 0.5
  const scores = Object.fromEntries(
    DIMENSIONS.map((dimension) => {
      const { mean, sd } = baseline[dimension]
      if (!paired.includes(dimension)) return [dimension, mean]
      return [dimension, mean + sd * (target / weightDifference(dimension))]
    }),
  ) as DimensionScores

  const { decomposition, copy } = copyFor(scores)
  const [first, second] = paired.map(
    (dimension) => decomposition.rows.find((row) => row.dimension === dimension)!,
  )
  assert.ok(Math.abs(first.signedContribution - second.signedContribution) < 1e-9)
  assert.ok(first.signedContribution > 0)
  assert.equal(copy.state, "tied-leading")
  // Row order follows the scorer's stable sort, so only the pairing is asserted.
  assert.match(copy.lead, /^Your answers on (Security rivalry and Institutions and rules|Institutions and rules and Security rivalry) made the largest positive contributions, in equal measure/u)
})

test("no positive term names where the runner-up gets support and invents no tie", () => {
  // Reverse the clear result's terms so nothing counts for the primary reading.
  const { decomposition } = copyFor(CLEAR_REALIST_SCORES)
  const rows = decomposition.rows.map((row) => ({
    ...row,
    signedContribution: -Math.abs(row.signedContribution),
  }))
  const copy = buildFoundationContributionCopy({
    rows,
    legacy: false,
    lowDifferentiation: true,
    primaryLabel: "Realism",
    runnerUpLabel: "Institutionalism",
    dimensionLabel: (dimension) => dimensionLabels[dimension],
  })
  assert.equal(copy.state, "no-positive")
  assert.match(copy.lead, /^No dimension counted for Realism over Institutionalism\. On /u)
  assert.match(copy.lead, /that is where Institutionalism gets its support, and why it stayed close\.$/u)
  assert.doesNotMatch(copy.lead, /tie|level|midpoint|rounding/u)
})

test("a legacy link and an empty modern comparison are told apart", () => {
  const shared = {
    rows: [],
    lowDifferentiation: false,
    primaryLabel: "Realism",
    runnerUpLabel: "Institutionalism",
    dimensionLabel: (dimension: DimensionKey) => dimensionLabels[dimension],
  }
  const legacy = buildFoundationContributionCopy({ ...shared, legacy: true })
  assert.equal(legacy.state, "legacy")
  assert.match(legacy.lead, /^This link predates the dimension-by-dimension comparison/u)
  assert.match(legacy.unavailableNote ?? "", /cannot be shown for this link/u)

  const empty = buildFoundationContributionCopy({ ...shared, legacy: false })
  assert.equal(empty.state, "unavailable")
  assert.doesNotMatch(empty.lead, /link|legacy|predates/u)
  assert.match(empty.lead, /not available for this result/u)
})
