import Link from "next/link"
import {
  formatArchetypeCodeSpeech,
  formatArchetypeDisplayCode,
} from "@/lib/archetype-display"
import { resolveRestraintPosture, type PostureEndpoint } from "@/lib/results/posture"
import type { CanonicalFoundationResult } from "@/lib/scoring"

type Props = {
  result: CanonicalFoundationResult
  lowDifferentiationThreshold?: number
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
}: Props) {
  const posture = resolveRestraintPosture(result, lowDifferentiationThreshold)
  const scoreLabel = `raw score ${posture.score.toFixed(1)}`

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
        aria-label={`Restraint ${scoreLabel}, between ${posture.low.name} (${formatArchetypeCodeSpeech(posture.low.code)}) and ${posture.high.name} (${formatArchetypeCodeSpeech(posture.high.code)}). The registered raw-score routing boundary is 4. This profile reads as ${posture.current.name}.`}
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

      <p className="muted result-note-xs">
        A raw score of 4 is the registered routing boundary for the posture sign. It is not a
        symmetric center for every form.
      </p>

      <p className="muted result-note-xs">
        {posture.blend
          ? "Both ends read world politics through the same two lenses. They part company on restraint, which the map's two axes do not weigh. The map cannot separate them, but this scale can."
          : "Both ends read world politics through the same lens. They part company on restraint, which the map's two axes do not weigh. The map cannot separate them, but this scale can."}
      </p>
    </section>
  )
}
