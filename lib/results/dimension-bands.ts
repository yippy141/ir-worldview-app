import type { DimensionKey } from "@/lib/types"

// ---------------------------------------------------------------------------
// Dimension bands
// ---------------------------------------------------------------------------
//
// The seven dimensions are reported on a 1-7 scale, but the scorer does not use
// that scale evenly. Sweeping randomised respondents through both quiz modes
// (the same method scripts/diagnose-instrument.mts applies to one mode) shows
// every dimension concentrating in a band roughly 1.3 points wide, and two of
// them — domestic politics and markets and dependence — centring above the
// nominal midpoint of 4.
//
// A flat `score >= 5` cutoff therefore handed conviction copy to scores sitting
// at or below the middle of what the instrument actually produces. A domestic
// politics score of 5.0 is below the observed mean of 4.88 plus a rounding
// error, yet it used to read as "you emphasize regime type and coalitions".
//
// Band copy now requires a score to clear two thresholds at once:
//
//   - the nominal lean on the 1-7 scale (5 high, 3 low), and
//   - the tenth or ninetieth percentile of the observed distribution.
//
// Anything between them is mid-range and gets copy that describes a dimension
// doing no distinctive work. These are authored cutpoints informed by the
// observed distribution. They carry no claim about any population.

export type DimensionBand = "high" | "midRange" | "low"

export type ObservedDimensionRange = {
  /** Mean score across the diagnostic sweep. */
  mean: number
  /** Tenth percentile across the diagnostic sweep. */
  p10: number
  /** Ninetieth percentile across the diagnostic sweep. */
  p90: number
}

// Measured against the V21 scorer (lib/scoring/v2). Recompute these whenever
// the scoring version changes: they describe what that scorer produces, and a
// stale set silently hands conviction copy back to average scores.
export const OBSERVED_DIMENSION_RANGES: Record<DimensionKey, ObservedDimensionRange> = {
  securityCompetition: { mean: 4.49, p10: 3.83, p90: 5.12 },
  institutions: { mean: 4.52, p10: 3.84, p90: 5.06 },
  domesticFilters: { mean: 4.79, p10: 3.77, p90: 5.54 },
  normsIdentity: { mean: 4.53, p10: 3.5, p90: 5.47 },
  politicalEconomy: { mean: 4.79, p10: 3.85, p90: 5.5 },
  restraint: { mean: 4.55, p10: 3.97, p90: 5.01 },
  orderJustice: { mean: 4.21, p10: 3.35, p90: 5.07 },
}

/** Lean thresholds on the reported 1-7 scale. */
const NOMINAL_HIGH = 5
const NOMINAL_LOW = 3

export function dimensionHighCut(dimension: DimensionKey): number {
  return Math.max(NOMINAL_HIGH, OBSERVED_DIMENSION_RANGES[dimension].p90)
}

export function dimensionLowCut(dimension: DimensionKey): number {
  return Math.min(NOMINAL_LOW, OBSERVED_DIMENSION_RANGES[dimension].p10)
}

export function dimensionBand(dimension: DimensionKey, score: number): DimensionBand {
  if (score >= dimensionHighCut(dimension)) return "high"
  if (score <= dimensionLowCut(dimension)) return "low"
  return "midRange"
}

export const dimensionBandLabels: Record<DimensionBand, string> = {
  high: "High",
  midRange: "Mid-range",
  low: "Low",
}

/** Pick the copy written for the band a score falls into. */
export function byBand<T>(
  dimension: DimensionKey,
  score: number,
  copy: Record<DimensionBand, T>,
): T {
  return copy[dimensionBand(dimension, score)]
}

/** Short, concrete names for the two ends of each dimension. */
export const DIMENSION_POLES: Record<DimensionKey, { low: string; high: string }> = {
  securityCompetition: { low: "Reassurance", high: "Rivalry" },
  institutions: { low: "Power first", high: "Rules bind" },
  domesticFilters: { low: "System pressure", high: "Domestic politics" },
  normsIdentity: { low: "Material interest", high: "Legitimacy" },
  politicalEconomy: { low: "Security and diplomacy", high: "Markets and dependence" },
  restraint: { low: "Press advantage", high: "Set limits" },
  orderJustice: { low: "Justice can override", high: "Order first" },
}

export type DimensionPush = {
  dimension: DimensionKey
  score: number
  /** Signed position on the reported 1-7 scale, centred at its midpoint. */
  deviation: number
  /** Pole the score sits toward. */
  pole: string
}

/**
 * Express each dimension on its declared 1-7 scale. The midpoint is zero and
 * either endpoint is one. This is a direct position display, not a comparison
 * with synthetic respondents or a claim about which dimension caused the
 * family classification.
 */
export function getDimensionPush(scores: Record<DimensionKey, number>): DimensionPush[] {
  return (Object.keys(OBSERVED_DIMENSION_RANGES) as DimensionKey[])
    .map((dimension) => {
      const raw = (scores[dimension] - 4) / 3
      const deviation = Math.max(-1, Math.min(1, raw))

      return {
        dimension,
        score: scores[dimension],
        deviation,
        pole: deviation >= 0
          ? DIMENSION_POLES[dimension].high
          : DIMENSION_POLES[dimension].low,
      }
    })
    .sort((left, right) => Math.abs(right.deviation) - Math.abs(left.deviation))
}
