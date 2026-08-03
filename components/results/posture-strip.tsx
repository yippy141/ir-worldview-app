import Link from "next/link"
import { strategyModifierGloss } from "@/lib/copy/glosses"
import { resolveRestraintPosture, type PostureEndpoint } from "@/lib/results/posture"
import type { DimensionScores, FamilyKey } from "@/lib/types"
import { FAMILY_LABELS } from "@/lib/worldview-config"

type Props = {
  familyKey: FamilyKey
  dimensionScores: DimensionScores
}

function EndpointLabel({ endpoint, side }: { endpoint: PostureEndpoint; side: "low" | "high" }) {
  return (
    <div className="posture-strip__end" data-side={side}>
      <span className="posture-strip__end-label">
        {endpoint.href ? <Link href={endpoint.href}>{endpoint.label}</Link> : endpoint.label}
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
 * domestic filters — never restraint — so profiles that differ only on this
 * dimension share a map coordinate. Drawing them as separate points would
 * manufacture a distance the model does not measure.
 */
export function PostureStrip({ familyKey, dimensionScores }: Props) {
  const posture = resolveRestraintPosture(familyKey, dimensionScores)
  const lensLabel = FAMILY_LABELS[familyKey]

  return (
    <section className="panel result-panel posture-strip stack-sm" aria-labelledby="posture-strip-heading">
      <div className="stack-xs">
        <p className="eyebrow">Not on the map</p>
        <h3 id="posture-strip-heading">Restraint posture</h3>
      </div>

      <div
        className="posture-strip__scale"
        role="img"
        aria-label={`Restraint ${posture.score.toFixed(1)} of 7, read as ${posture.band}, between ${posture.low.label} and ${posture.high.label}.`}
      >
        <div className="posture-strip__track">
          <span
            className="posture-strip__cut"
            style={{ left: `${posture.bandBoundaries.maximizer * 100}%` }}
          />
          <span
            className="posture-strip__cut"
            style={{ left: `${posture.bandBoundaries.restrainer * 100}%` }}
          />
          <span
            className="posture-strip__mark"
            style={{ left: `${posture.fraction * 100}%` }}
          />
        </div>
        <div className="posture-strip__ends">
          <EndpointLabel endpoint={posture.low} side="low" />
          <EndpointLabel endpoint={posture.high} side="high" />
        </div>
      </div>

      <p className="posture-strip__reading">
        <strong>{posture.band}</strong>
        <span className="posture-strip__score">{posture.score.toFixed(1)} / 7</span>
      </p>
      <p className="muted result-note-xs">{strategyModifierGloss(posture.band)}</p>

      <p className="muted result-note-xs">
        {posture.namedProfiles
          ? `Both ends are ${lensLabel} readings; they part company on restraint, not on the two map axes. The map cannot separate them, so the scale does.`
          : `The map axes do not weigh restraint, so this scale is shown beside it. The modeled ${lensLabel} profiles do not yet split into a high- and low-restraint pair, so the ends use the modifier names instead.`}
      </p>
    </section>
  )
}
