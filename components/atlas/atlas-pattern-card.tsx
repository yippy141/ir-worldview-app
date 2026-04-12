import Link from "next/link"
import { AtlasFingerprint } from "@/components/atlas/atlas-fingerprint"
import { getAtlasPatternHref, type AtlasLitePattern } from "@/lib/atlas-lite"

export function AtlasPatternCard({ pattern }: { pattern: AtlasLitePattern }) {
  return (
    <article className="atlas-pattern-card stack-sm">
      <div className="stack-xs">
        <p className="eyebrow">Atlas pattern</p>
        <h2 style={{ marginBottom: 0 }}>{pattern.name}</h2>
        <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.94rem" }}>
          {pattern.cardSummary}
        </p>
      </div>

      <AtlasFingerprint fingerprint={pattern.fingerprint} compact />

      <div className="atlas-tag-list" aria-label={`${pattern.name} drivers`}>
        {pattern.cardDrivers.map((driver) => (
          <span key={driver} className="atlas-tag">
            {driver}
          </span>
        ))}
      </div>

      <p className="muted atlas-pressure-note">
        <strong>Under pressure:</strong> {pattern.cardPressureNote}
      </p>

      <div className="atlas-pattern-card__footer">
        <Link href={getAtlasPatternHref(pattern.id)} className="atlas-pattern-cta">
          Read pattern
        </Link>
      </div>
    </article>
  )
}
