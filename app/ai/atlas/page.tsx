import Link from "next/link"
import {
  aiAtlasAxisGuide,
  getAiAtlasEntries,
  getAiAtlasLabel,
  getAiAtlasSharedReadings,
  getAiAxisLabel,
} from "@/lib/ai-governance-atlas-content"
import type { Metadata } from "next"

const atlasEntries = getAiAtlasEntries()
const sharedReadings = getAiAtlasSharedReadings()

export const metadata: Metadata = {
  title: "Atlas — AI Governance Compass",
  description:
    "Browse the modeled AI-governance families, compare nearby archetypes, and use the core axes as a field guide to the current AI module.",
}

export default function AiAtlasPage() {
  return (
    <div className="wide-container">
      <article className="result-article">
        <section className="result-hero stack-md">
          <div className="ai-hero-rule" />
          <p className="ai-hero-eyebrow">AI Governance Compass</p>
          <h1 className="ai-hero-h1">AI Governance Atlas</h1>
          <p className="ai-hero-summary">
            This is the browse map for the AI module: six modeled archetype families, the core
            axes they summarize, and the nearby comparison points that matter when a result does
            not cleanly sit in one camp.
          </p>
          <p className="muted" style={{ maxWidth: "760px", lineHeight: "1.72", margin: 0 }}>
            Treat these as editorial shorthand inside the current model, not as exhaustive schools
            of thought or fixed identities. Real profiles can still be mixed, adjacent, or
            conditional on the issue.
          </p>
          <div className="row gap-sm wrap">
            <Link href="/ai" className="cta-secondary">Back to AI home</Link>
            <Link href="/ai/quiz" className="cta-primary">Take the inventory</Link>
          </div>
        </section>

        <section className="result-section stack-lg">
          <div className="profile-module-grid">
            <div className="callout stack-sm">
              <p style={{ fontWeight: 600, margin: 0 }}>How to read this page</p>
              <p className="muted" style={{ lineHeight: "1.68", margin: 0 }}>
                Start with the axes if you want the cleanest conceptual map. Then use the archetype
                cards as shorthand summaries of recurring combinations rather than as a substitute
                for the underlying dimensions.
              </p>
            </div>

            <div className="callout stack-sm">
              <p style={{ fontWeight: 600, margin: 0 }}>What “nearby” means here</p>
              <p className="muted" style={{ lineHeight: "1.68", margin: 0 }}>
                Nearby comparisons are the most useful adjacent reads inside the current model.
                They are not claims of exact mathematical neighbors and they do not exhaust the
                whole AI governance debate.
              </p>
            </div>
          </div>
        </section>

        <section className="result-section stack-md">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Core axes</p>
            <h2>What the AI module is actually measuring</h2>
            <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
              Higher and lower positions on these axes describe stances inside the model. They are
              not percentiles and not moral rankings.
            </p>
          </div>

          <div className="explore-grid">
            {aiAtlasAxisGuide.map((axis) => (
              <article key={axis.key} className="callout stack-sm ai-axis-guide-card">
                <div className="stack-xs">
                  <p className="eyebrow">{axis.label}</p>
                  <p className="muted" style={{ lineHeight: "1.62", fontSize: "0.88rem", margin: 0 }}>
                    {axis.explainer}
                  </p>
                </div>
                <div className="ai-axis-poles">
                  <span className="ai-axis-pole">{axis.lowLabel}</span>
                  <span className="ai-axis-pole ai-axis-pole--high">{axis.highLabel}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="result-section stack-lg">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Modeled families</p>
            <h2>Archetype cards</h2>
            <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
              Each card is a shorthand family in the result layer. Use the nearby links on each
              card to jump to the comparison section below.
            </p>
          </div>

          <div className="atlas-pattern-grid">
            {atlasEntries.map((entry) => (
              <article id={`family-${entry.key}`} key={entry.key} className="explore-card ai-atlas-card stack-sm">
                <div className="stack-xs">
                  <p className="eyebrow">Modeled family</p>
                  <p
                    style={{
                      fontWeight: 600,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "1.1rem",
                      lineHeight: "1.28",
                      margin: 0,
                    }}
                  >
                    {entry.label}
                  </p>
                  <p className="muted" style={{ lineHeight: "1.68", margin: 0 }}>
                    {entry.shortSummary}
                  </p>
                </div>

                <div className="stack-xs">
                  <p className="eyebrow">Core belief</p>
                  <p style={{ lineHeight: "1.68", fontSize: "0.92rem", margin: 0 }}>
                    {entry.coreBelief}
                  </p>
                </div>

                <div className="ai-atlas-pillars">
                  <div className="stack-xs">
                    <p className="eyebrow">Wants most</p>
                    <ul className="content-list ai-atlas-list" style={{ margin: 0 }}>
                      {entry.wantsMost.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="stack-xs">
                    <p className="eyebrow">Worries most</p>
                    <ul className="content-list ai-atlas-list" style={{ margin: 0 }}>
                      {entry.worriesMost.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="ai-atlas-reading stack-xs">
                  <p className="eyebrow">Question to sit with</p>
                  <p className="muted" style={{ lineHeight: "1.65", margin: 0 }}>
                    {entry.questionToSitWith}
                  </p>
                </div>

                <div className="ai-atlas-reading stack-xs">
                  <p className="eyebrow">Nearby in this model</p>
                  <div className="atlas-inline-links">
                    {entry.closestNeighbors.map((nearbyKey) => (
                      <a
                        key={nearbyKey}
                        href={`#compare-${entry.key}`}
                        style={{ color: "var(--accent)" }}
                      >
                        Compare with {getAiAtlasLabel(nearbyKey)}
                      </a>
                    ))}
                  </div>
                </div>

                {entry.startHere ? (
                  <div className="ai-atlas-reading stack-xs">
                    <p className="eyebrow">Read first</p>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>
                      {entry.startHere.title}
                    </p>
                    <p className="muted" style={{ fontSize: "0.82rem", lineHeight: "1.55", margin: 0 }}>
                      {entry.startHere.author} · {entry.startHere.year}
                    </p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="result-section stack-md">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Nearby comparisons</p>
            <h2>Where adjacent archetypes part ways</h2>
            <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65", maxWidth: "760px" }}>
              Use these as comparison notes when your result feels mixed or when two families sound
              similar in rhetoric but diverge on what should actually anchor governance.
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
                        index === 0 ? "" : index === entry.closestNeighbors.length - 1 ? " and " : ", "

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

                <div className="stack-xs">
                  <p className="eyebrow">International lens</p>
                  <p className="muted" style={{ lineHeight: "1.62", margin: 0 }}>
                    {entry.internationalLens}
                  </p>
                </div>

                <div className="atlas-tag-list" aria-label={`${entry.label} contrast axes`}>
                  {entry.contrastAxes.map((axisKey) => (
                    <span key={axisKey} className="atlas-tag">
                      {getAiAxisLabel(axisKey)}
                    </span>
                  ))}
                </div>

                <div className="stack-xs">
                  <p className="eyebrow">Likely tensions</p>
                  <ul className="content-list ai-atlas-list" style={{ margin: 0 }}>
                    {entry.likelyTensions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="atlas-inline-links">
                  <a href={`#family-${entry.key}`} style={{ color: "var(--accent)" }}>
                    Back to {entry.label}
                  </a>
                  {entry.closestNeighbors.map((nearbyKey) => (
                    <a key={nearbyKey} href={`#family-${nearbyKey}`} style={{ color: "var(--accent)" }}>
                      View {getAiAtlasLabel(nearbyKey)}
                    </a>
                  ))}
                </div>

                {entry.critique ? (
                  <div className="ai-atlas-reading stack-xs">
                    <p className="eyebrow">Best critique</p>
                    <p className="muted" style={{ lineHeight: "1.6", margin: 0 }}>
                      {entry.critique.title}
                    </p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="result-section stack-md">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Shared starting points</p>
            <h2>Read these before you settle on a camp</h2>
          </div>

          <div>
            {sharedReadings.map((reading) => (
              <div key={reading.id} className="neighbor-entry">
                <p style={{ fontWeight: 600, marginBottom: "4px" }}>{reading.title}</p>
                <p className="muted" style={{ fontSize: "0.84rem", marginBottom: "6px" }}>
                  {reading.author} · {reading.year}
                </p>
                <p className="muted" style={{ lineHeight: "1.65", margin: 0 }}>
                  {reading.description}
                </p>
              </div>
            ))}
          </div>

          <div className="row gap-sm wrap">
            <Link href="/ai" className="cta-secondary">Back to AI home</Link>
            <Link href="/ai/quiz" className="cta-primary">Take the inventory</Link>
            <Link href="/references" className="cta-secondary">References</Link>
          </div>
        </section>
      </article>
    </div>
  )
}
