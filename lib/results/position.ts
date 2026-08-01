import type { DimensionKey, DimensionScores, FamilyKey } from "@/lib/types"

// ---------------------------------------------------------------------------
// Field-map projection
// ---------------------------------------------------------------------------
//
// The Foundation result is a seven-dimension profile on a 1-7 scale (4 is the
// neutral midpoint). The field map projects that profile onto two authored
// reading axes so a respondent can locate themselves relative to the four
// modeled traditions. Like the family-fit coefficients in lib/scoring.ts and
// the coefficients the Methods page documents, the projection weights below are
// an EDITORIAL CHOICE, not an empirical measurement. They are transparent,
// centered on the midpoint, and identical for every respondent.
//
// Both axes are weighted sums of centered dimension scores (score - 4):
//
//   X  (horizontal): power / competition  <-->  rules / institutions
//     Positive = the profile reads world politics through rules, monitoring,
//     and institutional design. Negative = it reads through power, rivalry,
//     and structural competition. Institutions push right; security
//     competition pushes left; political economy is treated as a form of
//     structural competition and pushes gently left as well.
//
//   Y  (vertical): material / economic structure  <-->  ideas / norms
//     Positive = the profile foregrounds ideas, norms, identity, legitimacy,
//     order, and sovereignty. Negative = it foregrounds material and economic
//     structure. Norms/identity and order/justice push up; political economy
//     and domestic material filters push down.
//
// A note on the traditions: three of the four modeled families (realist,
// institutionalist, critical political economy) are materially oriented, so
// a two-axis map cannot separate all four on "material vs ideas" alone. The
// weights place realism on the power side but tipped slightly toward the
// order/sovereignty (normative) pole, because realism organizes around order
// and sovereignty rather than economic structure, while critical political
// economy sits at the material extreme. This limitation is deliberate and is
// surfaced in the caption rather than hidden.
//
// The raw axis sums are normalized by empirically chosen spread constants so
// that strongly differentiated profiles reach roughly half to two-thirds of
// the way to an edge (never pinned to the rim), then clamped to [-1, 1]. The
// output is in math coordinates where +Y is UP; SVG rendering flips it.

type AxisWeights = Partial<Record<DimensionKey, number>>

// Bump only when the authored projection coefficients or normalization change.
// Profile Share V2 records this value so a shared field can be interpreted
// against the projection that produced it.
export const FIELD_PROJECTION_VERSION = 1

// Horizontal axis: rules/institutions (+) vs power/competition (-).
const X_WEIGHTS: AxisWeights = {
  institutions: 0.5,
  securityCompetition: -0.45,
  politicalEconomy: -0.2,
}

// Vertical axis: ideas/norms (+) vs material/economic structure (-).
const Y_WEIGHTS: AxisWeights = {
  normsIdentity: 0.4,
  orderJustice: 0.45,
  politicalEconomy: -0.45,
  domesticFilters: -0.35,
}

// Normalization constants. Chosen so real profiles spread visibly without
// hitting the rim; larger than the strongest observed synthetic profile.
const X_SCALE = 3.0
const Y_SCALE = 2.5

// Maximum plausible mean absolute deviation for seven values on a 1-7 scale
// (roughly 2.94 at the extremes); used to normalize answerSpread into [0, 1].
const MAX_MEAN_ABS_DEVIATION = 3

export type MapPosition = {
  /** -1 (power / competition) .. +1 (rules / institutions) */
  x: number
  /** -1 (material / economic structure) .. +1 (ideas / norms), +Y is up */
  y: number
}

const DIMENSION_KEYS = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
] as const

function clampUnit(value: number): number {
  return Math.max(-1, Math.min(1, value))
}

function projectAxis(scores: DimensionScores, weights: AxisWeights): number {
  return (Object.entries(weights) as [DimensionKey, number][]).reduce(
    (sum, [dimension, weight]) => sum + (scores[dimension] - 4) * weight,
    0,
  )
}

/**
 * Project a seven-dimension Foundation profile onto the 2D field map.
 * A flat (all-midpoint) profile lands exactly at the center {x: 0, y: 0}.
 * Returns normalized coordinates in [-1, 1] with +Y pointing up.
 */
export function toMapPosition(scores: DimensionScores): MapPosition {
  return {
    x: clampUnit(projectAxis(scores, X_WEIGHTS) / X_SCALE),
    y: clampUnit(projectAxis(scores, Y_WEIGHTS) / Y_SCALE),
  }
}

// ---------------------------------------------------------------------------
// Partial profiles: placing a position mid-questionnaire
// ---------------------------------------------------------------------------
//
// The quiz shows the same projection while a respondent is still answering.
// Unanswered dimensions score at the neutral midpoint, so a profile with one or
// two answers projects to a point that swings hard on every keystroke and says
// more about question order than about the respondent. The live map therefore
// waits for a minimum number of answers AND for at least one answer feeding
// each axis before it plots anything.

/** Dimensions that move the horizontal axis. */
export const X_AXIS_DIMENSIONS = Object.keys(X_WEIGHTS) as DimensionKey[]

/** Dimensions that move the vertical axis. */
export const Y_AXIS_DIMENSIONS = Object.keys(Y_WEIGHTS) as DimensionKey[]

export const MIN_ANSWERS_FOR_LIVE_POSITION = 4

export function canPlaceLivePosition({
  answeredCount,
  dimensionWeights,
}: {
  answeredCount: number
  /** Per-dimension evidence weight, from computeCoreDimensionAudit. */
  dimensionWeights: Record<DimensionKey, number>
}): boolean {
  if (answeredCount < MIN_ANSWERS_FOR_LIVE_POSITION) return false

  const hasHorizontal = X_AXIS_DIMENSIONS.some((key) => dimensionWeights[key] > 0)
  const hasVertical = Y_AXIS_DIMENSIONS.some((key) => dimensionWeights[key] > 0)

  return hasHorizontal && hasVertical
}

// Plain-language readout of a projected position. Names the axis and the pole
// the profile leans toward. It never names a worldview family and never refers
// to an individual answer.
// Pole names match the axis labels drawn on the plot and stay short enough to
// read on one line in the compact phone layout.
const AXIS_READOUT = {
  x: {
    name: "Power and rules",
    positive: "rules",
    negative: "power",
  },
  y: {
    name: "Ideas and material",
    positive: "ideas and norms",
    negative: "material structure",
  },
} as const

// Cutoffs on the normalized [-1, 1] axis, chosen so a profile has to move a
// visible distance from the center before the wording firms up.
const CENTERED_BELOW = 0.12
const SLIGHT_BELOW = 0.4
const CLEAR_BELOW = 0.7

export type AxisReading = {
  /** Axis name, suitable as a list term. */
  name: string
  /** Where the profile currently sits on that axis. */
  reading: string
}

function readAxis(
  value: number,
  axis: { name: string; positive: string; negative: string },
): AxisReading {
  const magnitude = Math.abs(value)

  // The axis name carries both poles already, so the centered reading stays
  // short. Spelling out both poles here stacks three "and"s in one line.
  if (magnitude < CENTERED_BELOW) {
    return { name: axis.name, reading: "Near the center" }
  }

  const strength = magnitude < SLIGHT_BELOW
    ? "Slightly toward"
    : magnitude < CLEAR_BELOW
      ? "Toward"
      : "Clearly toward"

  return {
    name: axis.name,
    reading: `${strength} ${value > 0 ? axis.positive : axis.negative}`,
  }
}

/** Two-item text equivalent of a plotted position, for a semantic list. */
export function describeMapPosition(position: MapPosition): AxisReading[] {
  return [readAxis(position.x, AXIS_READOUT.x), readAxis(position.y, AXIS_READOUT.y)]
}

/**
 * Dispersion of a profile: the mean absolute deviation of the seven dimension
 * scores from the respondent's OWN mean, normalized to [0, 1] by the maximum
 * plausible deviation on a 1-7 scale.
 *
 * A flat profile (every dimension equal) returns 0 — the respondent commits to
 * no dimension over any other. A spiky, opinionated profile returns a larger
 * value. The map inverts this into the spread-ring radius: LOW spread means the
 * profile is equally close to several traditions, so the position is loosely
 * determined and the ring is WIDE; HIGH spread means the profile commits, so
 * the ring is tight. See spreadRingFraction below.
 */
export function answerSpread(scores: DimensionScores): number {
  const values = DIMENSION_KEYS.map((key) => scores[key])
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const meanAbsoluteDeviation =
    values.reduce((sum, value) => sum + Math.abs(value - mean), 0) / values.length

  return Math.max(0, Math.min(1, meanAbsoluteDeviation / MAX_MEAN_ABS_DEVIATION))
}

// Ring radius as a fraction of the plot half-extent. High answer spread
// (commitment) tightens the ring; low spread (or the honest low-differentiation
// state) widens it. A flat profile therefore renders the maximal ring.
const RING_MAX_FRACTION = 0.82
const RING_MIN_FRACTION = 0.3
const RING_LOW_DIFFERENTIATION_FLOOR = 0.75

export function spreadRingFraction(
  scores: DimensionScores,
  lowDifferentiation = false,
): number {
  const spread = answerSpread(scores)
  const fraction =
    RING_MAX_FRACTION - (RING_MAX_FRACTION - RING_MIN_FRACTION) * spread

  return lowDifferentiation
    ? Math.max(fraction, RING_LOW_DIFFERENTIATION_FLOOR)
    : fraction
}

// When the profile barely differentiates, pull the rendered position back
// toward the center so the map does not imply a confident single-tradition read.
const LOW_DIFFERENTIATION_POSITION_DAMPING = 0.55

export function toDisplayPosition(
  scores: DimensionScores,
  lowDifferentiation = false,
): MapPosition {
  const position = toMapPosition(scores)
  if (!lowDifferentiation) return position

  return {
    x: position.x * LOW_DIFFERENTIATION_POSITION_DAMPING,
    y: position.y * LOW_DIFFERENTIATION_POSITION_DAMPING,
  }
}

// ---------------------------------------------------------------------------
// Tradition anchors
// ---------------------------------------------------------------------------
//
// Authored anchor positions for the four modeled traditions, one per quadrant,
// consistent with where representative profiles of each tradition project.
// These orient the reader; they are labels, not scored centroids. Each anchor
// is encoded by BOTH a color token and a text label (never color alone).

export type TraditionAnchor = {
  key: FamilyKey
  /** Position in the same [-1, 1] math space as toMapPosition (+Y up). */
  position: MapPosition
  /** CSS custom property holding the tradition color. */
  colorVar: string
  /** Short plain-language descriptor of the quadrant reading. */
  quadrant: string
}

export const TRADITION_ANCHORS: TraditionAnchor[] = [
  {
    key: "realist",
    position: { x: -0.62, y: 0.3 },
    colorVar: "--t-realist",
    quadrant: "Power-first, ordered around sovereignty",
  },
  {
    key: "constructivist",
    position: { x: 0.55, y: 0.6 },
    colorVar: "--t-constructivist",
    quadrant: "Rules and cooperation, read through ideas",
  },
  {
    key: "institutionalist",
    position: { x: 0.6, y: -0.42 },
    colorVar: "--t-institutionalist",
    quadrant: "Rules and institutions, materially grounded",
  },
  {
    key: "criticalPoliticalEconomy",
    position: { x: -0.58, y: -0.66 },
    colorVar: "--t-cpe",
    quadrant: "Structural competition over economic hierarchy",
  },
]

export const AXIS_LABELS = {
  left: "Power & competition",
  right: "Rules & institutions",
  top: "Ideas, norms & legitimacy",
  bottom: "Material & economic structure",
} as const
