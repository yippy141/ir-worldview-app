import Link from "next/link"
import { aiQuestionCountsByMode, aiTotalQuestionCountsByMode } from "@/lib/ai-governance-schema"
import type { Metadata } from "next"

const standardQuestionTotal = aiTotalQuestionCountsByMode.standard
const advancedQuestionTotal = aiTotalQuestionCountsByMode.analyst

export const metadata: Metadata = {
  title: "AI Governance Compass",
  description:
    "Map your instincts on frontier AI governance — 16 questions, around 8 minutes.",
}

export default function AiPage() {
  return (
    <div className="wide-container">
      <article className="lobby-page stack-xl">
        <section className="ai-landing-hero stack-md">
          <p className="ai-landing-hero__eyebrow">AI Governance Compass</p>
          <h1 className="ai-landing-hero__h1">Map your instincts on frontier AI governance</h1>
          <p className="ai-landing-hero__lead">
            16 questions. Around 8 minutes.
          </p>
          <p className="ai-landing-hero__sub">
            A structured read across eight axes — risk horizon, deployment pace, oversight,
            geopolitics, openness, military use, legitimacy, and human future.
          </p>
          <div className="ai-landing-hero__actions">
            <Link href="/ai/quiz" className="ai-landing-hero__cta">
              Take the AI Compass
            </Link>
            <Link href="/ai/atlas" className="ai-landing-hero__cta-secondary">
              Browse the AI Atlas →
            </Link>
          </div>
          <p className="ai-landing-hero__bridge">
            Want the deeper foreign-policy layer?{" "}
            <Link href="/quiz">Take the IR Foundation afterward</Link>.
          </p>
        </section>

        <section className="lobby-signals lobby-signals--plain">
          <div className="signal-list signal-list--three">
            <div className="signal-list-item">
              <strong>What it covers</strong>
              Position statements and scenarios map eight governance dimensions, from risk horizon
              to human future.
            </div>
            <div className="signal-list-item">
              <strong>How long it takes</strong>
              Standard is the cleaner first pass. Advanced adds denser prompts and more specific
              tradeoffs.
            </div>
            <div className="signal-list-item">
              <strong>What it does not claim</strong>
              The result does not certify expertise or reduce the whole field to one permanent
              identity.
            </div>
          </div>
        </section>

        <section className="stack-md">
          <div className="stack-xs">
            <p className="section-kicker">Choose your route</p>
            <h2>Start in Standard or Advanced mode</h2>
            <p className="muted lobby-side-text">
              Both modes use the same axes. Advanced adds more specific prompts on audits, compute,
              incident reporting, security competition, infrastructure, and legitimacy.
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
                  Clear first pass
                </p>
              </div>
              <p className="muted" style={{ lineHeight: "1.68", margin: 0 }}>
                {aiQuestionCountsByMode.standard} statements and {standardQuestionTotal} questions.
                Plain-language prompts across all eight dimensions.
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
                  Denser framing and more specific tradeoffs
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
            <p className="section-kicker">Optional depth</p>
            <h2>Where the AI Compass connects to the rest of the project</h2>
            <p className="muted lobby-side-text">
              The AI result stands on its own. If you want the deeper foreign-policy layer
              underneath it, the IR Foundation and issue modules sit one click away.
            </p>
          </div>
          <div className="resource-list">
            <Link href="/quiz" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Foundation Questionnaire</span>
                <span className="resource-list-text">Open the shared IR baseline.</span>
              </span>
            </Link>
            <Link href="/modules" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Security and Technology</span>
                <span className="resource-list-text">See the IR issue modules that sit beside AI.</span>
              </span>
            </Link>
            <Link href="/profile" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">Profile</span>
                <span className="resource-list-text">Keep saved IR and AI results in one place.</span>
              </span>
            </Link>
            <Link href="/ai/field-guide" className="resource-list-link">
              <span className="resource-list-copy">
                <span className="resource-list-title">AI Field Guide</span>
                <span className="resource-list-text">Read the axes, limits, and under-modeled perspectives.</span>
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
                <span className="resource-list-text">Use the bibliography while comparing positions.</span>
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
