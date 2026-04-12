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
          <div className="stack-xs">
            <p className="eyebrow">Executive summary</p>
            <p style={{ lineHeight: "1.75", maxWidth: "760px" }}>{pattern.cardSummary}</p>
          </div>
          <div className="stack-xs">
            <p style={{ fontWeight: 600 }}>What usually drives this pattern</p>
            <ul className="content-list" style={{ margin: 0 }}>
              {pattern.detailDrivers.map((driver) => (
                <li key={driver}>{driver}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="atlas-detail-side stack-sm">
          <div className="callout stack-sm" style={{ margin: 0 }}>
            <div className="stack-xs">
              <p className="eyebrow">Visual fingerprint</p>
              <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
                An editorial sketch of the pattern shape across five core dimensions.
              </p>
            </div>
            <AtlasFingerprint fingerprint={pattern.fingerprint} />
          </div>
        </aside>
      </section>

      <section className="result-section stack-md">
        <div className="atlas-detail-columns">
          <div className="stack-sm">
            <p className="eyebrow">Security</p>
            <h2 style={{ marginBottom: 0 }}>How it often looks under Security pressure</h2>
            <p style={{ lineHeight: "1.75" }}>{pattern.securitySummary}</p>
          </div>
          <div className="stack-sm">
            <p className="eyebrow">Technology</p>
            <h2 style={{ marginBottom: 0 }}>How it often looks under Technology pressure</h2>
            <p style={{ lineHeight: "1.75" }}>{pattern.technologySummary}</p>
          </div>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="atlas-detail-columns">
          <div className="stack-sm">
            <p className="eyebrow">Nearby confusion</p>
            <h2 style={{ marginBottom: 0 }}>Where this pattern is often confused with neighbors</h2>
            <p style={{ lineHeight: "1.75" }}>{pattern.confusionNote}</p>
          </div>
          <div className="stack-sm">
            <p className="eyebrow">Pressure test</p>
            <h2 style={{ marginBottom: 0 }}>Questions worth asking</h2>
            <ul className="content-list" style={{ margin: 0 }}>
              {pattern.pressureTestQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
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
