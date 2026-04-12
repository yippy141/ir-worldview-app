import Link from "next/link"
import { getAtlasLitePatterns, getAtlasLitePattern } from "@/lib/atlas-lite"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Atlas Lite — IR Worldview Inventory",
  description:
    "A lightweight editorial map of canonical profile patterns grounded in the current IR Worldview Inventory model.",
}

export default function AtlasLitePage() {
  const patterns = getAtlasLitePatterns()

  return (
    <div className="wide-container">
      <div className="article-header stack-sm">
        <p className="eyebrow">Atlas Lite</p>
        <h1>Canonical profile patterns in the current model</h1>
        <p className="muted" style={{ lineHeight: "1.7", fontSize: "1.05rem", maxWidth: "720px" }}>
          This is a curated map of recognizable patterns that recur in the current inventory. It is
          not a rarity chart, not a live distribution, and not a claim that users fall into fixed
          natural kinds.
        </p>
      </div>

      <div className="callout stack-sm" style={{ marginBottom: "28px" }}>
        <p style={{ fontWeight: 600 }}>How to read this page</p>
        <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>
          The inventory is built on continuous dimensions. These pattern names are editorial
          shorthand for recurring combinations in the current model, not population percentiles or
          exhaustive IR types.
        </p>
        <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>
          Some traditions and strategic cultures remain under-modeled. The point here is to help
          users browse nearby patterns honestly, not to imply more precision than the instrument
          currently supports.
        </p>
      </div>

      <div className="atlas-pattern-grid">
        {patterns.map((pattern) => (
          <article key={pattern.id} id={pattern.id} className="atlas-pattern-card stack-sm">
            <div className="stack-xs">
              <p className="eyebrow">Canonical pattern</p>
              <h2 style={{ marginBottom: 0 }}>{pattern.name}</h2>
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.94rem" }}>
                {pattern.description}
              </p>
            </div>

            <div className="stack-xs">
              <p style={{ fontWeight: 600 }}>Strongest likely drivers</p>
              <ul className="content-list" style={{ margin: 0 }}>
                {pattern.strongestLikelyDrivers.map((driver) => (
                  <li key={driver}>{driver}</li>
                ))}
              </ul>
            </div>

            <div className="stack-xs">
              <p style={{ fontWeight: 600 }}>Likely module shifts</p>
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                <strong>Security:</strong> {pattern.likelyModuleShifts.security}
              </p>
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                <strong>Technology:</strong> {pattern.likelyModuleShifts.technology}
              </p>
            </div>

            <div className="stack-xs">
              <p style={{ fontWeight: 600 }}>Neighboring patterns</p>
              <div className="atlas-inline-links">
                {pattern.neighborIds.map((neighborId) => {
                  const neighbor = getAtlasLitePattern(neighborId)
                  if (!neighbor) return null

                  return (
                    <Link key={neighbor.id} href={`/explore/atlas#${neighbor.id}`} style={{ color: "var(--accent)" }}>
                      {neighbor.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </article>
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
