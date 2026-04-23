import Link from "next/link"
import { AtlasPatternCard } from "@/components/atlas/atlas-pattern-card"
import { getAtlasLitePatterns } from "@/lib/atlas-lite"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Atlas — IR Worldview Inventory",
  description:
    "An editorial map of recurring profile patterns grounded in the current IR Worldview Inventory model.",
}

export default function AtlasLitePage() {
  const patterns = getAtlasLitePatterns()

  return (
    <div className="wide-container">
      <div className="article-header stack-md">
        <div className="stack-xs">
          <p className="eyebrow">Atlas</p>
          <h1>Recurring profile patterns in the current model</h1>
        </div>
        <p className="muted atlas-page-lead">
          Atlas is a browse map of patterns that show up repeatedly in the current inventory. It is
          not a live user distribution, and it is not claiming that people fall into fixed natural
          kinds.
        </p>
      </div>

      <section className="atlas-page-intro stack-md">
        <div className="stack-xs">
          <p className="eyebrow">Reading note</p>
          <p className="muted atlas-page-copy">
            The inventory runs on continuous dimensions. These names are plain-English labels for
            patterns that show up repeatedly in the current model, not percentiles or exhaustive IR
            types.
          </p>
        </div>
        <p className="muted atlas-page-intro__note">
          Some traditions and strategic cultures are still under-modeled. The point is to help you
          browse nearby patterns without pretending the quiz is more precise than it is.
        </p>
      </section>

      <div className="atlas-pattern-grid atlas-pattern-grid--browse" role="list">
        {patterns.map((pattern) => (
          <AtlasPatternCard key={pattern.id} pattern={pattern} />
        ))}
      </div>

      <div className="result-section stack-sm atlas-page-actions">
        <p className="eyebrow">Continue</p>
        <div className="row gap-sm wrap">
          <Link href="/quiz" className="cta-primary">Take the Foundation</Link>
          <Link href="/explore" className="cta-secondary">Browse the field guide</Link>
          <Link href="/profile" className="cta-secondary">View Profile</Link>
        </div>
      </div>
    </div>
  )
}
