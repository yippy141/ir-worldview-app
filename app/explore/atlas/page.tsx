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
      <div className="article-header stack-sm">
        <p className="eyebrow">Atlas</p>
        <h1>Recurring profile patterns in the current model</h1>
        <p className="muted" style={{ lineHeight: "1.7", fontSize: "1.05rem", maxWidth: "720px" }}>
          This is a browse map of patterns that recur in the current inventory. It is not a live
          user distribution, and it is not a claim that people fit into fixed natural kinds.
        </p>
      </div>

      <div className="callout stack-sm" style={{ marginBottom: "28px" }}>
        <p style={{ fontWeight: 600 }}>How to read this page</p>
        <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>
          The inventory runs on continuous dimensions. These pattern names are editorial summaries
          of recurring combinations in the current model, not percentiles or exhaustive IR types.
        </p>
        <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>
          Some traditions and strategic cultures remain under-modeled. The point is to help users
          browse nearby patterns honestly without implying more precision than the instrument can
          support.
        </p>
      </div>

      <div className="atlas-pattern-grid">
        {patterns.map((pattern) => (
          <AtlasPatternCard key={pattern.id} pattern={pattern} />
        ))}
      </div>

      <div className="result-section stack-sm">
        <p className="eyebrow">Continue</p>
        <div className="row gap-sm wrap">
          <Link href="/explore" className="cta-secondary">Back to Explore</Link>
          <Link href="/quiz" className="cta-primary">Take the Foundation</Link>
          <Link href="/profile" className="cta-secondary">View your Profile</Link>
        </div>
      </div>
    </div>
  )
}
