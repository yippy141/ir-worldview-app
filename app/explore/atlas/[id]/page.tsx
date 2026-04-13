import Link from "next/link"
import { AtlasFingerprint } from "@/components/atlas/atlas-fingerprint"
import {
  getAtlasLiteNeighbors,
  getAtlasLitePattern,
  getAtlasLitePatterns,
  getAtlasPatternHref,
} from "@/lib/atlas-lite"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return getAtlasLitePatterns().map((pattern) => ({
    id: pattern.id,
  }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params
  const pattern = getAtlasLitePattern(id)

  if (!pattern) {
    return { title: "Atlas — IR Worldview Inventory" }
  }

  return {
    title: `${pattern.name} — Atlas — IR Worldview Inventory`,
    description: pattern.cardSummary,
  }
}

export default async function AtlasPatternDetailPage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const pattern = getAtlasLitePattern(id)

  if (!pattern) {
    notFound()
  }

  const neighbors = getAtlasLiteNeighbors(pattern)

  return (
    <div className="wide-container">
      <div className="article-header stack-sm">
        <p className="eyebrow">Atlas</p>
        <h1>{pattern.name}</h1>
        <p className="muted" style={{ lineHeight: "1.72", fontSize: "1.04rem", maxWidth: "760px" }}>
          {pattern.detailSummary}
        </p>
        <div className="row gap-sm wrap">
          <Link href="/explore/atlas" className="cta-secondary">Back to Atlas</Link>
          <Link href="/quiz" className="cta-primary">Take the Foundation</Link>
          <Link href="/profile" className="cta-secondary">View your Profile</Link>
        </div>
      </div>

      <section className="result-section atlas-detail-hero-grid">
        <div className="stack-sm">
          <div className="callout stack-xs profile-so-what" style={{ margin: 0 }}>
            <p className="eyebrow">So what this usually means</p>
            <p style={{ lineHeight: "1.75", marginBottom: 0 }}>{pattern.soWhat}</p>
          </div>
          <div className="stack-xs">
            <p className="eyebrow">At a glance</p>
            <p style={{ lineHeight: "1.75", maxWidth: "760px" }}>{pattern.cardSummary}</p>
          </div>
        </div>

        <aside className="atlas-detail-side stack-sm">
          <div className="callout stack-sm atlas-detail-fingerprint-card" style={{ margin: 0 }}>
            <div className="stack-xs">
              <p className="eyebrow">Visual fingerprint</p>
              <div className="atlas-tag-list" aria-label={`${pattern.name} drivers`}>
                {pattern.cardDrivers.map((driver) => (
                  <span key={driver} className="atlas-tag">
                    {driver}
                  </span>
                ))}
              </div>
            </div>
            <AtlasFingerprint fingerprint={pattern.fingerprint} />
            <p className="muted atlas-pressure-note" style={{ marginBottom: 0 }}>
              <strong>Under pressure:</strong> {pattern.cardPressureNote}
            </p>
          </div>
        </aside>
      </section>

      <section className="result-section stack-md">
        <div className="atlas-detail-columns">
          <div className="stack-sm">
            <p className="eyebrow">Emphasis</p>
            <h2 style={{ marginBottom: 0 }}>What this usually emphasizes</h2>
            <ul className="content-list" style={{ margin: 0 }}>
              {pattern.detailDrivers.map((driver) => (
                <li key={driver}>{driver}</li>
              ))}
            </ul>
          </div>
          <div className="stack-sm">
            <p className="eyebrow">Blind spots</p>
            <h2 style={{ marginBottom: 0 }}>What this often underestimates</h2>
            <ul className="content-list" style={{ margin: 0 }}>
              {pattern.underestimates.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="atlas-detail-columns">
          <div className="stack-sm">
            <p className="eyebrow">Security</p>
            <h2 style={{ marginBottom: 0 }}>How this often shifts in Security</h2>
            <p style={{ lineHeight: "1.75" }}>{pattern.securitySummary}</p>
          </div>
          <div className="stack-sm">
            <p className="eyebrow">Technology</p>
            <h2 style={{ marginBottom: 0 }}>How this often shifts in Technology</h2>
            <p style={{ lineHeight: "1.75" }}>{pattern.technologySummary}</p>
          </div>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="atlas-detail-columns">
          <div className="stack-sm">
            <p className="eyebrow">Pressure test</p>
            <h2 style={{ marginBottom: 0 }}>Questions to pressure-test</h2>
            <ul className="content-list" style={{ margin: 0 }}>
              {pattern.pressureTestQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </div>
          <div className="stack-sm">
            <p className="eyebrow">Common confusion</p>
            <h2 style={{ marginBottom: 0 }}>Where nearby patterns can look similar</h2>
            <p style={{ lineHeight: "1.75" }}>{pattern.confusionNote}</p>
          </div>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <p className="eyebrow">Neighbors</p>
          <h2>Nearby Atlas patterns</h2>
          <p className="muted" style={{ lineHeight: "1.65", maxWidth: "720px" }}>
            These are the closest neighboring reads in the current model. They are useful comparison
            points when the line between patterns still feels live.
          </p>
        </div>
        <div className="stack-sm">
          {neighbors.map((neighbor) => (
            <div key={neighbor.id} className="neighbor-entry stack-xs">
              <h3 style={{ marginBottom: 0 }}>{neighbor.name}</h3>
              <p className="muted" style={{ lineHeight: "1.65", marginBottom: 0 }}>
                {neighbor.cardSummary}
              </p>
              <div className="atlas-inline-links">
                <Link href={getAtlasPatternHref(neighbor.id)} style={{ color: "var(--accent)" }}>
                  Open {neighbor.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
