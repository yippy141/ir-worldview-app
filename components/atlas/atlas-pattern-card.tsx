import Link from "next/link"
import { AtlasPatternFamily } from "@/components/atlas/atlas-pattern-family"
import { getAtlasPatternHref, type AtlasLitePattern } from "@/lib/atlas-lite"

export function AtlasPatternCard({ pattern }: { pattern: AtlasLitePattern }) {
  return (
    <article className="atlas-pattern-card atlas-pattern-card--browse stack-sm">
      <div className="atlas-pattern-card__lead">
        <div className="stack-xs">
          <p className="eyebrow">Atlas pattern</p>
          <h2 style={{ marginBottom: 0 }}>{pattern.name}</h2>
          <p className="muted atlas-pattern-card__summary">{pattern.cardSummary}</p>
        </div>

        <div className="atlas-pattern-card__family stack-xs">
          <p className="eyebrow">Primary family cue</p>
          <AtlasPatternFamily pattern={pattern} compact />
        </div>
      </div>

      <div className="atlas-pattern-card__signals stack-xs">
        <p className="atlas-pattern-card__kicker">Common drivers</p>
        <div className="atlas-tag-list" aria-label={`${pattern.name} drivers`}>
          {pattern.cardDrivers.slice(0, 3).map((driver) => (
            <span key={driver} className="atlas-tag">
              {driver}
            </span>
          ))}
        </div>
      </div>

      <p className="muted atlas-pattern-card__pressure">
        <span className="atlas-pattern-card__pressure-label">Under pressure</span>
        {pattern.cardPressureNote}
      </p>

      <div className="atlas-pattern-card__footer">
        <Link href={getAtlasPatternHref(pattern.id)} className="atlas-pattern-cta">
          Read pattern
        </Link>
      </div>
    </article>
  )
}
