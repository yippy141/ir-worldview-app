import { resolvePlacementFirmness } from "@/lib/results/placement-firmness"
import type { FoundationNarrativeState } from "@/lib/narrative/foundation"

type Props = {
  nearestFitGap: number
  state: FoundationNarrativeState
  runnerUpLabel: string
  lowDifferentiationThreshold: number
  sharplyDifferentiatedThreshold: number
}

/**
 * How firmly the map placement is fixed, as a bar rather than a ring on the
 * plot. A ring around the dot reads as confidence no matter what it encodes,
 * and the old one grew as the profile committed less. Here the fill grows with
 * the top-two gap, so more fill means more firmly fixed — and the plot is left
 * to carry position alone.
 */
export function PlacementFirmnessBar({
  nearestFitGap,
  state,
  runnerUpLabel,
  lowDifferentiationThreshold,
  sharplyDifferentiatedThreshold,
}: Props) {
  const firmness = resolvePlacementFirmness({
    nearestFitGap,
    state,
    runnerUpLabel,
    lowDifferentiationThreshold,
    sharplyDifferentiatedThreshold,
  })

  return (
    <section className="firmness-bar stack-sm" aria-labelledby="firmness-bar-heading">
      <div className="firmness-bar__head">
        <h3 id="firmness-bar-heading">How firmly the placement is fixed</h3>
        <strong className="firmness-bar__label" data-band={firmness.band}>
          {firmness.label}
        </strong>
      </div>

      <div
        className="firmness-bar__track"
        data-band={firmness.band}
        role="img"
        aria-label={`${firmness.label}. Top-two family-score gap ${firmness.gap.toFixed(2)}.`}
      >
        <span
          className="firmness-bar__fill"
          style={{ width: `${firmness.fraction * 100}%` }}
        />
        <span
          className="firmness-bar__cut"
          style={{ left: `${firmness.looseCut * 100}%` }}
        />
      </div>

      <p className="muted result-note-xs">{firmness.reading}</p>
      <p className="muted result-note-xs">
        The bar is the gap between the leading tradition and the runner-up, drawn
        against the model&rsquo;s own cut points. It is not a percentile, and not a
        margin of error.
      </p>
    </section>
  )
}
