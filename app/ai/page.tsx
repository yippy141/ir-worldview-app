import Link from "next/link"
import { aiQuestionCountsByMode, aiTotalQuestionCountsByMode } from "@/lib/ai-governance-schema"
import type { Metadata } from "next"

const standardQuestionTotal = aiTotalQuestionCountsByMode.standard
const advancedQuestionTotal = aiTotalQuestionCountsByMode.analyst

export const metadata: Metadata = {
  title: "AI Governance Compass",
  description:
    "A first-class entry to the AI Governance Compass: choose Standard or Advanced mode, browse the AI atlas, and continue into methods and references.",
}

export default function AiPage() {
  return (
    <div className="wide-container">
      <article className="result-article">
        <section className="result-hero stack-md">
          <div className="ai-hero-rule" />
          <p className="ai-hero-eyebrow">Companion module</p>
          <h1 className="ai-hero-h1">AI Governance Compass</h1>
          <p className="ai-hero-summary">
            A branching inventory of how you think about AI safety, governance, geopolitical
            rivalry, openness, military use, and the future of human agency.
          </p>
          <p className="muted" style={{ maxWidth: "760px", lineHeight: "1.72", margin: 0 }}>
            Use it as an editorial field guide to your governing instincts, not as a validated
            instrument or a claim that the AI-governance field divides neatly into fixed camps.
          </p>
          <div className="row gap-sm wrap">
            <Link href="/ai/quiz" className="cta-primary">Open the quiz</Link>
            <Link href="/ai/atlas" className="cta-secondary">Browse the atlas</Link>
            <Link href="/method" className="cta-secondary">Methods</Link>
            <Link href="/references" className="cta-secondary">Resources</Link>
          </div>
        </section>

        <section className="result-section stack-lg">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">What this module is</p>
            <h2>An interpretive map of recurring AI-governance logics</h2>
          </div>

          <div className="profile-module-grid">
            <div className="callout stack-sm">
              <p style={{ fontWeight: 600, margin: 0 }}>What it covers</p>
              <p className="muted" style={{ lineHeight: "1.68", margin: 0 }}>
                Position statements and scenario branches map your stance across eight dimensions:
                risk horizon, deployment pace, oversight, geopolitics, openness, military role,
                legitimacy, and the future of human agency.
              </p>
            </div>

            <div className="callout stack-sm">
              <p style={{ fontWeight: 600, margin: 0 }}>What the result means</p>
              <p className="muted" style={{ lineHeight: "1.68", margin: 0 }}>
                The output is a structured interpretation inside this model. It does not certify
                expertise, predict policy behavior, or reduce the field to one timeless identity.
              </p>
            </div>
          </div>
        </section>

        <section className="result-section stack-md">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Choose your route</p>
            <h2>Start in Standard or Advanced mode</h2>
            <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
              Both modes score the same model. Advanced adds denser prompts and technically sharper
              cases; it does not change the underlying axes or result structure.
            </p>
          </div>

          <div className="atlas-pattern-grid">
            <Link href="/ai/quiz?mode=standard" className="explore-card ai-lobby-card-link stack-sm">
              <div className="stack-xs">
                <p className="option-card-meta">Standard</p>
                <p
                  style={{
                    fontWeight: 600,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "1.1rem",
                    margin: 0,
                  }}
                >
                  Clear first pass through the module
                </p>
              </div>
              <p className="muted" style={{ lineHeight: "1.68", margin: 0 }}>
                {aiQuestionCountsByMode.standard} statements and {standardQuestionTotal} questions
                total. Plain-language prompts across all eight governance dimensions.
              </p>
              <span className="atlas-pattern-cta">Open Standard →</span>
            </Link>

            <Link href="/ai/quiz?mode=advanced" className="explore-card ai-lobby-card-link stack-sm">
              <div className="stack-xs">
                <p className="option-card-meta">Advanced</p>
                <p
                  style={{
                    fontWeight: 600,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "1.1rem",
                    margin: 0,
                  }}
                >
                  Denser framing and sharper tradeoffs
                </p>
              </div>
              <p className="muted" style={{ lineHeight: "1.68", margin: 0 }}>
                {aiQuestionCountsByMode.analyst} statements and {advancedQuestionTotal} questions
                total. Adds materially deeper prompts on audits, compute governance, incident
                reporting, weight security, critical infrastructure, global legitimacy, and moral
                status or augmentation overlays.
              </p>
              <span className="atlas-pattern-cta">Open Advanced →</span>
            </Link>
          </div>
        </section>

        <section className="result-section stack-md">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Continue reading</p>
            <h2>Atlas, methods, and references</h2>
          </div>

          <div className="explore-grid">
            <Link href="/ai/atlas" className="explore-card ai-lobby-card-link stack-sm">
              <p className="option-card-meta">AI atlas</p>
              <p
                style={{
                  fontWeight: 600,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "1rem",
                  margin: 0,
                }}
              >
                Browse the modeled AI-governance families
              </p>
              <p className="muted" style={{ lineHeight: "1.68", margin: 0 }}>
                See the six shorthand archetypes, the instincts they summarize, and the pressure
                points that differentiate them.
              </p>
              <span className="atlas-pattern-cta">Open the atlas →</span>
            </Link>

            <Link href="/method" className="explore-card ai-lobby-card-link stack-sm">
              <p className="option-card-meta">Methods</p>
              <p
                style={{
                  fontWeight: 600,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "1rem",
                  margin: 0,
                }}
              >
                Read how the model is framed
              </p>
              <p className="muted" style={{ lineHeight: "1.68", margin: 0 }}>
                Review the methodological guardrails, scope limits, and interpretive cautions that
                shape the broader project.
              </p>
              <span className="atlas-pattern-cta">Open methods →</span>
            </Link>

            <Link href="/references" className="explore-card ai-lobby-card-link stack-sm">
              <p className="option-card-meta">Resources</p>
              <p
                style={{
                  fontWeight: 600,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "1rem",
                  margin: 0,
                }}
              >
                Continue into sources and further reading
              </p>
              <p className="muted" style={{ lineHeight: "1.68", margin: 0 }}>
                Use the project bibliography as a companion reading shelf while you compare the
                modeled positions against the wider literature.
              </p>
              <span className="atlas-pattern-cta">Open references →</span>
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}
