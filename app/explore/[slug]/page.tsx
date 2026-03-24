import { notFound } from "next/navigation"
import Link from "next/link"
import { coverageLevelLabels, getFamilyByKey, getFamilyBySlug } from "@/lib/explore-content"
import { familySlug, MODELED_FAMILY_KEYS } from "@/lib/worldview-config"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return MODELED_FAMILY_KEYS.map((familyKey) => ({ slug: familySlug(familyKey) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const family = getFamilyBySlug(slug)
  if (!family) return { title: "Explore — IR Worldview Inventory" }
  return {
    title: `${family.name} — IR Worldview Inventory`,
    description: family.tagline,
  }
}

export default async function ExploreDetailPage({ params }: Props) {
  const { slug } = await params
  const family = getFamilyBySlug(slug)
  if (!family) notFound()

  return (
    <div className="article-page">
      {/* Back link */}
      <div style={{ marginBottom: "32px" }}>
        <Link
          href="/explore"
          style={{ fontSize: "0.85rem", color: "var(--muted)", textDecoration: "none" }}
        >
          ← All perspectives
        </Link>
      </div>

      {/* Header */}
      <div className="article-header stack-sm">
        <p className="eyebrow">Worldview library</p>
        <h1>{family.name}</h1>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: "1.65",
            color: "var(--muted)",
            maxWidth: "560px",
          }}
        >
          {family.tagline}
        </p>
      </div>

      <hr className="divider" />

      {/* Summary */}
      <div className="article-section">
        {family.summary.split("\n\n").map((para, i) => (
          <p key={i} style={{ lineHeight: "1.75", marginBottom: "16px" }}>
            {para}
          </p>
        ))}
      </div>

      <hr className="divider" />

      {/* What it emphasizes */}
      <div className="article-section stack-md">
        <h2>What it emphasizes</h2>
        <ul className="content-list">
          {family.emphasizes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <hr className="divider" />

      {/* What it underweights */}
      <div className="article-section stack-md">
        <h2>What it often underweights</h2>
        <ul className="content-list">
          {family.underweights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <hr className="divider" />

      {/* Persuasive arguments */}
      <div className="article-section stack-md">
        <h2>Arguments this tradition tends to find persuasive</h2>
        <ul className="content-list">
          {family.persuasiveArguments.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <hr className="divider" />

      {/* Neighboring traditions */}
      <div className="article-section stack-md">
        <h2>Neighboring traditions</h2>
        <div className="stack-md">
          {family.neighbors.map((neighbor) => (
            <div key={neighbor.familyKey} className="neighbor-entry">
              <p style={{ fontWeight: 600, fontFamily: "Georgia, serif", marginBottom: "6px" }}>
                <Link href={`/explore/${familySlug(neighbor.familyKey)}`} style={{ color: "inherit" }}>
                  {getFamilyByKey(neighbor.familyKey)?.name ?? "Related perspective"}
                </Link>
              </p>
              <p className="muted" style={{ lineHeight: "1.65" }}>
                {neighbor.contrast}
              </p>
            </div>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Readings */}
      <div className="article-section stack-md">
        <h2>Suggested starting points</h2>
        <div>
          {family.readings.map((reading) => (
            <div key={reading.title} className="reading-bib">
              <p style={{ fontWeight: 600 }}>{reading.title}</p>
              <p className="muted" style={{ fontSize: "0.875rem", marginTop: "2px" }}>
                {reading.author}
              </p>
              <p style={{ fontSize: "0.875rem", lineHeight: "1.55", marginTop: "6px" }}>
                {reading.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Quiz coverage note */}
      <div className="article-section stack-sm">
        <h2>How this quiz models it</h2>
        <div className="callout stack-xs">
          <p
            style={{
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 600,
              color: "var(--accent-light)",
            }}
          >
            {coverageLevelLabels[family.quizCoverage.level]}
          </p>
          <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
            {family.quizCoverage.note}
          </p>
        </div>
      </div>

      <hr className="divider" />

      <div className="article-section row gap-sm" style={{ flexWrap: "wrap" }}>
        <Link href="/quiz" className="cta-primary">Take the quiz →</Link>
        <Link href="/explore" className="cta-secondary">← All perspectives</Link>
      </div>
    </div>
  )
}
