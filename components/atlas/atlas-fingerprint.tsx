import {
  atlasFingerprintLabels,
  atlasFingerprintOrder,
  type AtlasLitePattern,
} from "@/lib/atlas-lite"

const FINGERPRINT_LEVEL_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
} as const

const FINGERPRINT_LEVEL_SCORES = {
  low: 1,
  medium: 2,
  high: 3,
} as const

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
        const activeCount = FINGERPRINT_LEVEL_SCORES[value]

        return (
          <div key={key} className="atlas-fingerprint-row">
            <span className="atlas-fingerprint-label">{atlasFingerprintLabels[key]}</span>
            <div
              className="atlas-fingerprint-strip"
              aria-label={`${atlasFingerprintLabels[key]}: ${FINGERPRINT_LEVEL_LABELS[value]}`}
            >
              {[1, 2, 3].map((segment) => (
                <span
                  key={`${key}-${segment}`}
                  className={`atlas-fingerprint-segment${
                    segment <= activeCount ? " atlas-fingerprint-segment--active" : ""
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            {!compact ? (
              <span className="atlas-fingerprint-value">{FINGERPRINT_LEVEL_LABELS[value]}</span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
