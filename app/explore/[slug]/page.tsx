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

const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "core-claims", label: "Core claims" },
  { id: "subtraditions", label: "Subtraditions" },
  { id: "emphasizes", label: "What it emphasizes" },
  { id: "underweights", label: "What it underweights" },
  { id: "issue-readings", label: "How it reads major issues" },
  { id: "neighbors", label: "Neighboring traditions" },
  { id: "readings", label: "Suggested readings" },
  { id: "quiz-coverage", label: "How this quiz models it" },
]

export default async function ExploreDetailPage({ params }: Props) {
  const { slug } = await params
  const family = getFamilyBySlug(slug)
  if (!family) notFound()

  return (
    <div className="wide-container">
      {/* Back link */}
      <div style={{ marginBottom: "28px" }}>
        <Link
          href="/explore"
          style={{ fontSize: "0.85rem", color: "var(--muted)", textDecoration: "none" }}
        >
          ← All perspectives
        </Link>
      </div>

      {/* Page header (full width, above atlas grid) */}
      <div className="article-header stack-sm" style={{ maxWidth: "680px", marginBottom: "48px" }}>
        <p className="eyebrow">Worldview library</p>
        <h1>{family.name}</h1>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.65", color: "var(--muted)" }}>
          {family.tagline}
        </p>
      </div>

      {/* Atlas two-column layout */}
      <div className="atlas-layout">
        {/* Sticky TOC */}
        <nav className="atlas-toc">
          {tocItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="atlas-toc-link">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Main body */}
        <div className="atlas-body">
          {/* Overview */}
          <section id="overview" className="article-section">
            <h2 style={{ marginBottom: "20px" }}>Overview</h2>
            {family.summary.split("\n\n").map((para, i) => (
              <p key={i} style={{ lineHeight: "1.75", marginBottom: "16px" }}>
                {para}
              </p>
            ))}
          </section>

          <hr className="divider" />

          {/* Core claims */}
          <section id="core-claims" className="article-section stack-md">
            <h2>Core claims</h2>
            <ul className="content-list">
              {family.coreClaims.map((claim) => (
                <li key={claim}>{claim}</li>
              ))}
            </ul>
          </section>

          <hr className="divider" />

          {/* Subtraditions */}
          <section id="subtraditions" className="article-section stack-md">
            <h2>Subtraditions</h2>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
              This tradition is not monolithic. These are the main strands within it.
            </p>
            <div>
              {family.subtraditions.map((sub) => (
                <div key={sub.name} className="subtradition-entry">
                  <p style={{ fontWeight: 600, fontFamily: "Georgia, serif", marginBottom: "6px" }}>
                    {sub.name}
                  </p>
                  <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                    {sub.note}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <hr className="divider" />

          {/* Emphasizes */}
          <section id="emphasizes" className="article-section stack-md">
            <h2>What it emphasizes</h2>
            <ul className="content-list">
              {family.emphasizes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <hr className="divider" />

          {/* Underweights */}
          <section id="underweights" className="article-section stack-md">
            <h2>What it often underweights</h2>
            <ul className="content-list">
              {family.underweights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <hr className="divider" />

          {/* How it reads major issues */}
          <section id="issue-readings" className="article-section stack-md">
            <h2>How it reads major issues</h2>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
              Arguments this tradition tends to find persuasive, and how it interprets three
              recurring debates in contemporary foreign policy.
            </p>
            <div>
              {family.issueReadings.map((ir) => (
                <div key={ir.issue} className="neighbor-entry">
                  <p style={{ fontWeight: 600, fontFamily: "Georgia, serif", marginBottom: "6px" }}>
                    {ir.issue}
                  </p>
                  <p className="muted" style={{ lineHeight: "1.65" }}>
                    {ir.note}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "20px" }}>
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--muted)",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Arguments this tradition finds persuasive
              </p>
              <ul className="content-list">
                {family.persuasiveArguments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <hr className="divider" />

          {/* Neighboring traditions */}
          <section id="neighbors" className="article-section stack-md">
            <h2>Neighboring traditions</h2>
            <div>
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
          </section>

          <hr className="divider" />

          {/* Readings */}
          <section id="readings" className="article-section stack-md">
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
          </section>

          <hr className="divider" />

          {/* Quiz coverage */}
          <section id="quiz-coverage" className="article-section stack-sm">
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
            {family.modelingNote ? (
              <div
                className="callout"
                style={{
                  borderLeft: "3px solid var(--accent-light)",
                  marginTop: "12px",
                }}
              >
                <p
                  style={{
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                    color: "var(--muted)",
                    marginBottom: "8px",
                  }}
                >
                  What this page models (and what it does not)
                </p>
                <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                  {family.modelingNote}
                </p>
              </div>
            ) : null}
          </section>

          <hr className="divider" />

          <div className="article-section row gap-sm" style={{ flexWrap: "wrap" }}>
            <Link href="/quiz" className="cta-primary">Take the quiz →</Link>
            <Link href="/explore" className="cta-secondary">← All perspectives</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
