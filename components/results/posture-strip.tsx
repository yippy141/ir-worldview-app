import Link from "next/link"
import {
  formatArchetypeCodeSpeech,
  formatArchetypeDisplayCode,
} from "@/lib/archetype-display"
import { resolveRestraintPosture, type PostureEndpoint } from "@/lib/results/posture"
import type { PercentileResult } from "@/lib/percentiles"
import type { CanonicalFoundationResult } from "@/lib/scoring"

type Props = {
  result: CanonicalFoundationResult
  lowDifferentiationThreshold?: number
  percentile?: PercentileResult | null
}

function Endpoint({
  endpoint,
  side,
  current,
}: {
  endpoint: PostureEndpoint
  side: "low" | "high"
  current: boolean
}) {
  return (
    <div className="posture-strip__end" data-side={side} data-current={current}>
      <span
        className="posture-strip__end-code"
        aria-label={formatArchetypeCodeSpeech(endpoint.code)}
      >
        {formatArchetypeDisplayCode(endpoint.code)}
      </span>
      <span className="posture-strip__end-label">
        {endpoint.href ? <Link href={endpoint.href}>{endpoint.name}</Link> : endpoint.name}
      </span>
      <span className="posture-strip__end-note">
        {side === "low" ? "Presses advantage" : "Holds back"}
      </span>
    </div>
  )
}

/**
 * Restraint sits beside the map, not on it. The field-map projection weights
 * institutions, security competition, political economy, norms, order, and
 * domestic filters — never restraint — so the + and − archetypes of a lens
 * share a map coordinate. Drawing them as separate points would manufacture a
 * distance the model does not measure.
 */
export function PostureStrip({
  result,
  lowDifferentiationThreshold,
  percentile = null,
}: Props) {
  const posture = resolveRestraintPosture(result, lowDifferentiationThreshold)
  const scoreLabel = percentile
    ? `${formatOrdinal(percentile.percentile)} percentile, raw score ${posture.score.toFixed(1)}`
    : `raw score ${posture.score.toFixed(1)}`

  return (
    <section
      className="posture-strip stack-sm"
      aria-labelledby="posture-strip-heading"
    >
      <div className="stack-xs">
        <p className="eyebrow">Not on the map</p>
        <h3 id="posture-strip-heading">Restraint posture</h3>
      </div>

      <div
        className="posture-strip__scale"
        role="img"
        aria-label={`Restraint ${scoreLabel}, between ${posture.low.name} (${formatArchetypeCodeSpeech(posture.low.code)}) and ${posture.high.name} (${formatArchetypeCodeSpeech(posture.high.code)}). This profile reads as ${posture.current.name}.`}
      >
        <div className="posture-strip__track">
          <span
            className="posture-strip__cut"
            style={{ left: `${posture.postureCut * 100}%` }}
          />
          <span
            className="posture-strip__mark"
            style={{ left: `${posture.fraction * 100}%` }}
          />
        </div>
        <div className="posture-strip__ends">
          <Endpoint
            endpoint={posture.low}
            side="low"
            current={posture.posture === "+"}
          />
          <Endpoint
            endpoint={posture.high}
            side="high"
            current={posture.posture === "-"}
          />
        </div>
      </div>

      <p className="posture-strip__reading">
        <strong>{posture.current.name}</strong>
        <span className="posture-strip__score">
          restraint {scoreLabel}
        </span>
      </p>

      {percentile ? (
        <p className="muted result-note-xs" role="note">
          Restraint percentile cohort n=
          {percentile.n.toLocaleString("en-US")}.
        </p>
      ) : null}

      <p className="muted result-note-xs">
        {posture.blend
          ? "Both ends read world politics through the same two lenses. They part company on restraint, which the map's two axes do not weigh — so the map cannot separate them and this scale does."
          : "Both ends read world politics through the same lens. They part company on restraint, which the map's two axes do not weigh — so the map cannot separate them and this scale does."}
      </p>
    </section>
  )
}

function formatOrdinal(value: number) {
  const mod100 = value % 100
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`
  if (value % 10 === 1) return `${value}st`
  if (value % 10 === 2) return `${value}nd`
  if (value % 10 === 3) return `${value}rd`
  return `${value}th`
}
