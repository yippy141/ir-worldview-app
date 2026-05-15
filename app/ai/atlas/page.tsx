import Link from "next/link"
import type { Metadata } from "next"
import { AiArchetypeFingerprint } from "@/components/atlas/ai-archetype-fingerprint"
import {
  aiAtlasArchetypeLeaningTag,
  getAiAtlasEntries,
  getAiAtlasHref,
  getAiAtlasLabel,
  getAiAxisLabel,
} from "@/lib/ai-governance-atlas-content"

const atlasEntries = getAiAtlasEntries()

export const metadata: Metadata = {
  title: "Atlas — AI Governance Compass",
  description:
    "Browse the modeled AI-governance families as compact fingerprint cards: name, one-line definition, two differentiators, nearest neighbor.",
}

export default function AiAtlasPage() {
  return (
    <div className="wide-container">
      <article className="result-article">
        <section className="result-hero stack-md">
          <div className="ai-hero-rule" />
          <p className="ai-hero-eyebrow">AI Governance Atlas · Browse map · Not a typology</p>
          <h1 className="ai-hero-h1">Six archetypes that recur in AI governance answers</h1>
          <p className="ai-hero-summary">
            Each card shows the archetype&rsquo;s relative emphasis across four core axes &mdash;
            a small fingerprint, not a score. The shape lets you scan the page; the prose
            keeps it honest. Definitions, critiques, neighbors, and readings live on the detail pages.
          </p>
          <div className="row gap-sm wrap">
            <Link href="/ai" className="cta-secondary">Back to AI home</Link>
            <Link href="/ai/field-guide" className="cta-secondary">AI Field Guide</Link>
            <Link href="/profile" className="cta-secondary">Profile</Link>
            <Link href="/ai/quiz" className="cta-primary">Take the AI questionnaire</Link>
          </div>
        </section>

        <section className="result-section stack-lg">
          <div className="ai-atlas-fingerprint-grid">
            {atlasEntries.map((entry, index) => {
              const nearestKey = entry.closestNeighbors[0]
              const number = (index + 1).toString().padStart(2, "0")
              const total = atlasEntries.length.toString().padStart(2, "0")

              return (
                <Link
                  key={entry.key}
                  id={`family-${entry.key}`}
                  href={getAiAtlasHref(entry.key)}
                  className="ai-atlas-fingerprint-card ai-atlas-fingerprint-card--link"
                  aria-label={`Open ${entry.label} detail`}
                >
                  <div className="ai-atlas-fingerprint-card__left">
                    <p className="ai-atlas-fingerprint-card__num">
                      {number} / {total} · {aiAtlasArchetypeLeaningTag[entry.key]}
                    </p>
                    <h3 className="ai-atlas-fingerprint-card__name">{entry.label}</h3>
                    <p className="ai-atlas-fingerprint-card__def">{entry.shortSummary}</p>
                    <ul className="ai-atlas-fingerprint-card__diffs">
                      {entry.wantsMost.slice(0, 2).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="ai-atlas-fingerprint-card__meta">
                      <span className="ai-atlas-fingerprint-card__nearest">
                        <span className="ai-atlas-fingerprint-card__meta-k">Nearest</span>
                        <span className="ai-atlas-fingerprint-card__meta-v">
                          {nearestKey ? getAiAtlasLabel(nearestKey) : "Mixed"}
                        </span>
                      </span>
                      <span className="ai-atlas-fingerprint-card__cta" aria-hidden="true">
                        Read this archetype <span>↗</span>
                      </span>
                    </div>
                  </div>

                  <div className="ai-atlas-fingerprint-card__right">
                    <AiArchetypeFingerprint archetype={entry.key} />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="result-section stack-md">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Nearby comparisons</p>
            <h2>Where adjacent archetypes part ways</h2>
            <p
              className="muted"
              style={{ fontSize: "0.9rem", lineHeight: "1.65", maxWidth: "760px" }}
            >
              Use these as comparison notes when your result feels mixed or when two families
              sound similar in rhetoric but diverge on what should actually anchor governance.
            </p>
          </div>

          <div className="atlas-pattern-grid">
            {atlasEntries.map((entry) => (
              <article
                id={`compare-${entry.key}`}
                key={entry.key}
                className="explore-card ai-atlas-card ai-atlas-compare-card stack-sm"
              >
                <div className="stack-xs">
                  <p className="eyebrow">Comparison point</p>
                  <p
                    style={{
                      fontWeight: 600,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "1.04rem",
                      lineHeight: "1.3",
                      margin: 0,
                    }}
                  >
                    {entry.label}
                  </p>
                  <p className="muted" style={{ lineHeight: "1.62", margin: 0 }}>
                    Compare against{" "}
                    {entry.closestNeighbors.map((nearbyKey, index) => {
                      const separator =
                        index === 0
                          ? ""
                          : index === entry.closestNeighbors.length - 1
                            ? " and "
                            : ", "

                      return (
                        <span key={nearbyKey}>
                          {separator}
                          {getAiAtlasLabel(nearbyKey)}
                        </span>
                      )
                    })}
                    .
                  </p>
                </div>

                <p style={{ lineHeight: "1.68", margin: 0 }}>{entry.comparisonNote}</p>

                <div
                  className="atlas-tag-list"
                  aria-label={`${entry.label} contrast axes`}
                >
                  {entry.contrastAxes.map((axisKey) => (
                    <span key={axisKey} className="atlas-tag">
                      {getAiAxisLabel(axisKey)}
                    </span>
                  ))}
                </div>

                <div className="atlas-inline-links">
                  <Link href={getAiAtlasHref(entry.key)} style={{ color: "var(--accent)" }}>
                    Open {entry.label} detail
                  </Link>
                  <a href={`#family-${entry.key}`} style={{ color: "var(--accent)" }}>
                    Back to {entry.label}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="result-section stack-md">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Next</p>
            <h2>Where this map sends you</h2>
            <p
              className="muted"
              style={{ fontSize: "0.9rem", lineHeight: "1.65", maxWidth: "760px" }}
            >
              The Atlas is the browse map. Long-form definitions, the strongest critique of each
              pattern, and the per-archetype reading shelf are kept off these cards on purpose.
            </p>
          </div>
          <div className="row gap-sm wrap">
            <Link href="/ai" className="cta-secondary">Back to AI home</Link>
            <Link href="/ai/field-guide" className="cta-secondary">AI Field Guide</Link>
            <Link href="/profile" className="cta-secondary">Profile</Link>
            <Link href="/ai/quiz" className="cta-primary">Take the AI questionnaire</Link>
            <Link href="/references" className="cta-secondary">References</Link>
          </div>
        </section>
      </article>
    </div>
  )
}
