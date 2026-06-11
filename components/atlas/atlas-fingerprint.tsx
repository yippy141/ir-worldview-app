import {
  atlasFingerprintLabels,
  atlasFingerprintOrder,
  type AtlasLitePattern,
} from "@/lib/atlas-lite"
import { SegmentedLevel } from "@/components/visual-primitives"

export function AtlasFingerprint({
  fingerprint,
  compact = false,
}: {
  fingerprint: AtlasLitePattern["fingerprint"]
  compact?: boolean
}) {
  return (
    <div className={`atlas-fingerprint${compact ? " atlas-fingerprint--compact" : ""}`}>
      {atlasFingerprintOrder.map((key) => {
        const value = fingerprint[key]

        return (
          <SegmentedLevel
            key={key}
            label={atlasFingerprintLabels[key]}
            level={value}
            compact={compact}
            className="atlas-fingerprint-row"
          />
        )
      })}
    </div>
  )
}
