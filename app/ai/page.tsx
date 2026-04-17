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
      <article className="lobby-page stack-xl">
        <section className="lobby-hero">
          <div className="lobby-hero-grid">
            <div className="stack-md">
              <p className="section-kicker">Companion module</p>
              <h1>AI Governance Compass</h1>
              <p className="lobby-lead">
                A branching inventory of how you think about AI safety, governance, geopolitical
                rivalry, openness, military use, and the future of human agency.
              </p>
              <p className="muted lobby-side-text">
                Use it as an editorial field guide to governing instincts, not as a validated
                instrument or a claim that the field divides neatly into timeless camps.
              </p>
              <div className="row gap-sm wrap">
                <Link href="/ai/quiz" className="cta-primary">Open the AI module</Link>
                <Link href="/ai/atlas" className="cta-secondary">Browse the AI atlas</Link>
              </div>
            </div>

            <aside className="lobby-side-note stack-sm">
              <div className="stack-xs">
                <p className="section-kicker">How it fits in the product family</p>
                <p className="muted lobby-side-text">
                  This module sits beside the IR Foundation and its issue overlays. It adds a
                  parallel technology-governance lens without pretending to replace the IR baseline
                  or collapse everything into one master score.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="lobby-signals">
          <div className="signal-list signal-list--three">
            <div className="signal-list-item">
              <strong>What it covers</strong>
              Position statements and branching scenarios map your stance across eight governance
              dimensions from risk horizon to human future.
            </div>
            <div className="signal-list-item">
              <strong>How long it takes</strong>
              Standard is the cleaner first pass. Advanced adds denser prompts and sharper tradeoffs
              without changing the underlying axes.
            </div>
            <div className="signal-list-item">
              <strong>What it does not claim</strong>
              The result is a structured interpretation inside this model. It does not certify
              expertise or reduce the whole field to one permanent identity.
            </div>
          </div>
        </section>

        <section className="stack-md">
          <div className="stack-xs">
            <p className="section-kicker">Choose your route</p>
            <h2>Start in Standard or Advanced mode</h2>
            <p className="muted lobby-side-text">
              Both modes score the same model. Advanced adds technically sharper prompts on audits,
              compute governance, incident reporting, security competition, critical
              infrastructure, and legitimacy under pressure.
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
                total. Deeper prompts on audits, compute governance, security competition, and
                legitimacy under pressure.
              </p>
              <span className="atlas-pattern-cta">Open Advanced →</span>
            </Link>
          </div>
        </section>

        <section className="lobby-related-grid">
          <div className="stack-sm">
            <p className="section-kicker">Continue through the rest of the product</p>
            <h2>Keep AI adjacent to the IR baseline, the field guide, and the integrated profile</h2>
            <p className="muted lobby-side-text">
              The most useful read often comes from comparing the AI result against the IR
              Foundation, the issue overlays, and the broader methods and reading surfaces.
            </p>
          </div>
          <div className="resource-list">
            <Link href="/quiz" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">IR Foundation</span>
                <span className="resource-list-text">Open the shared baseline used across the wider product.</span>
              </span>
            </Link>
            <Link href="/modules" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Security and Technology</span>
                <span className="resource-list-text">See the IR issue overlays that sit beside the AI module.</span>
              </span>
            </Link>
            <Link href="/profile" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Profile</span>
                <span className="resource-list-text">Keep saved IR and AI results in one integrated view.</span>
              </span>
            </Link>
            <Link href="/method" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Methods</span>
                <span className="resource-list-text">Read the guardrails and scope notes behind the whole project.</span>
              </span>
            </Link>
            <Link href="/references" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">References</span>
                <span className="resource-list-text">Use the bibliography as a companion shelf while you compare positions.</span>
              </span>
            </Link>
            <Link href="/feedback?module=ai" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Feedback</span>
                <span className="resource-list-text">Send notes on the AI module while this beta polish pass is in progress.</span>
              </span>
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}
