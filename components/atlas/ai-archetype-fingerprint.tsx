import { SegmentedLevel } from "@/components/visual-primitives"
import {
  aiAtlasFingerprintAxes,
  aiAtlasArchetypeFingerprints,
  getAiAtlasFingerprintShortLabel,
} from "@/lib/ai-governance-atlas-content"
import type { AiArchetypeKey } from "@/lib/ai-governance-types"

export function AiArchetypeFingerprint({ archetype }: { archetype: AiArchetypeKey }) {
  const emphasis = aiAtlasArchetypeFingerprints[archetype]

  return (
    <div className="ai-archetype-fingerprint" aria-label="Editorial emphasis across four core axes">
      <div className="ai-archetype-fingerprint__head">
        <span>Fingerprint</span>
        <span className="ai-archetype-fingerprint__scale">L · M · H</span>
      </div>
      <div className="ai-archetype-fingerprint__rows">
        {aiAtlasFingerprintAxes.map((axis) => (
          <SegmentedLevel
            key={axis}
            label={getAiAtlasFingerprintShortLabel(axis)}
            level={emphasis[axis]}
            compact
            className="ai-archetype-fingerprint__row"
          />
        ))}
      </div>
    </div>
  )
}
