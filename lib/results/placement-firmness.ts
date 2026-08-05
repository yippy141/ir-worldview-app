import type { FoundationNarrativeState } from "@/lib/narrative/foundation"

// ---------------------------------------------------------------------------
// Placement firmness
// ---------------------------------------------------------------------------
//
// The map used to carry a dashed ring around the respondent's dot whose radius
// grew as the profile committed LESS. Every reader reads a ring as confidence,
// so the encoding said the opposite of what it meant: the flattest, least
// informative profile drew the boldest ring. V21 removed the ring; this module
// restores the information it was carrying, in the direction readers expect.
//
// The measure is the top-two family-score gap (nearestFitGap), not answer
// dispersion. Dispersion says how spiky a profile is; the gap says how far the
// leading family sits from its runner-up, which is what "how firmly is this
// reading fixed" actually asks. The gap also has calibrated cut points from the
// independent-null sample in lib/scoring-calibration.ts, so the bands are not
// invented here.
//
// Direction: MORE fill means MORE firmly fixed. The bar is not a percentile
// and is not a confidence interval; it is the gap drawn against the same
// thresholds the narrative uses.

export type PlacementFirmnessBand = "loose" | "moderate" | "firm"

export type PlacementFirmness = {
  /** Top-two family-score gap. */
  gap: number
  /** Fill along the bar, 0 (no separation) to 1 (at or past the firm cut). */
  fraction: number
  band: PlacementFirmnessBand
  /** Where the loose band ends, as a bar fraction. */
  looseCut: number
  label: string
  /** One plain sentence naming what the reader should do with the reading. */
  reading: string
}

const BAND_LABELS: Record<PlacementFirmnessBand, string> = {
  loose: "Loosely fixed",
  moderate: "Moderately fixed",
  firm: "Firmly fixed",
}

function bandFromState(state: FoundationNarrativeState): PlacementFirmnessBand {
  if (state === "lowDifferentiation") return "loose"
  if (state === "sharplyDifferentiated") return "firm"
  return "moderate"
}

function bandReading(band: PlacementFirmnessBand, runnerUpLabel: string): string {
  if (band === "loose") {
    return `Several traditions remain live. Read the placement lightly and treat ${runnerUpLabel} as equally plausible.`
  }
  if (band === "firm") {
    return `The leading tradition sits well clear of ${runnerUpLabel}. The placement is stable enough to argue from.`
  }
  return `The leading tradition is ahead of ${runnerUpLabel}, but not by enough to close the question.`
}

/**
 * Resolve how firmly the map placement is fixed.
 *
 * The band comes from the narrative state so this never disagrees with the
 * prose on the same page — that classification also weighs how far the profile
 * sits from the midpoint, which the gap alone does not capture. The bar
 * position comes from the gap itself.
 */
export function resolvePlacementFirmness({
  nearestFitGap,
  state,
  runnerUpLabel,
  lowDifferentiationThreshold,
  sharplyDifferentiatedThreshold,
}: {
  nearestFitGap: number
  state: FoundationNarrativeState
  runnerUpLabel: string
  lowDifferentiationThreshold: number
  sharplyDifferentiatedThreshold: number
}): PlacementFirmness {
  const band = bandFromState(state)
  const fullScale = Math.max(sharplyDifferentiatedThreshold, Number.EPSILON)

  return {
    gap: nearestFitGap,
    fraction: Math.max(0, Math.min(1, nearestFitGap / fullScale)),
    band,
    looseCut: Math.max(0, Math.min(1, lowDifferentiationThreshold / fullScale)),
    label: BAND_LABELS[band],
    reading: bandReading(band, runnerUpLabel),
  }
}
