import Link from "next/link"
import { AiProjectBridge } from "@/components/ai/ai-project-bridge"
import { AiProfileSync } from "@/components/profile/ai-profile-sync"
import { ScaleBar } from "@/components/visual-primitives"
import { decodeAiPayload, aiPayloadToAxisScores } from "@/lib/ai-governance-share"
import {
  archetypeLabelFromKey,
  archetypeDescriptions,
  buildAiGovernanceSummary,
  getAxisCards,
} from "@/lib/ai-governance-results"
import {
  buildAiGovernanceDeepDive,
  buildAiGovernanceResultFromSharePayload,
  getAiGovernanceSurprisingFinding,
  getPrimaryAxisSummary,
} from "@/lib/ai-governance-results-v2"
import { ResultCardHero } from "@/components/results/result-card-hero"
import { ResultCardHeroShare } from "@/components/results/result-card-hero-share"
import { AiGovernanceProfileSections } from "@/components/results/ai-governance-profile-sections"
import { AiGovernanceShareActions } from "@/components/results/ai-governance-share-actions"
import { AiGovernanceReadingListSection } from "@/components/results/ai-governance-reading-list-section"
import { ResearchOptIn } from "@/components/research/research-opt-in"
import type { Metadata } from "next"

export async function generateMetadata(
  { params }: { params: Promise<{ payload: string }> },
): Promise<Metadata> {
  const { payload } = await params
  const decoded = decodeAiPayload(payload)
  if (!decoded) return { title: "Result — AI Governance Compass" }

  const label = archetypeLabelFromKey(decoded.ak)
  return {
    title: `${label} — AI Governance Compass`,
    description: `My AI governance profile: ${label} · ${decoded.rl} · ${decoded.pm}`,
  }
}

export default async function AiResultPage(
  { params }: { params: Promise<{ payload: string }> },
) {
  const { payload } = await params
  const decoded = decodeAiPayload(payload)

  if (!decoded) {
    return (
      <div className="container stack-lg" style={{ paddingTop: "48px" }}>
        <div className="panel stack-md">
          <p className="eyebrow">Invalid result</p>
          <h1>This link could not be decoded.</h1>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            The result URL may be incomplete, corrupted, or from an older version of the compass.
          </p>
          <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
            <Link href="/ai/quiz" className="cta-primary">Take the AI questionnaire</Link>
          </div>
        </div>
      </div>
    )
  }

  const axisScores = aiPayloadToAxisScores(decoded)
  const archetypeLabel = archetypeLabelFromKey(decoded.ak)
  const explanation = archetypeDescriptions[decoded.ak]
  const summary = buildAiGovernanceSummary(decoded.ak, axisScores, decoded.rl, decoded.pm)
  const axisCards = getAxisCards(axisScores)
  const heroAxisSignals = [...axisCards]
    .sort((a, b) => Math.abs(b.score - 4) - Math.abs(a.score - 4))
    .slice(0, 3)
  const profileResult = buildAiGovernanceResultFromSharePayload(decoded)
  const deepDive = buildAiGovernanceDeepDive(profileResult)
  const surprisingFinding = getAiGovernanceSurprisingFinding(profileResult)

  return (
    <div className="wide-container">
      <article className="result-article">
        <AiProfileSync
          snapshot={{
            payload,
            resultPath: `/ai/results/${payload}`,
            archetypeKey: profileResult.archetypeKey,
            archetypeLabel,
            riskLens: decoded.rl,
            paceModifier: decoded.pm,
            geopoliticsModifier: decoded.gm,
            axisScores,
            summary,
            governingInstinct: deepDive.governingInstinct,
          }}
        />

        {/* ── 1. Hero ── */}
        <ResultCardHero
          eyebrow="AI Governance Compass"
          label={archetypeLabel}
          accent="ai"
          modifiers={[decoded.rl, decoded.pm, decoded.gm]}
          summary={summary}
          finding={surprisingFinding}
          actions={
            <>
              <Link href={`/ai/atlas/${decoded.ak}`} className="result-card-hero__primary">
                Read archetype page
              </Link>
              <ResultCardHeroShare
                shareUrl={`/ai/results/${payload}`}
                title={`AI Governance Compass: ${archetypeLabel}`}
                text={`My AI governance profile: ${archetypeLabel} · ${decoded.rl} · ${decoded.pm} · ${decoded.gm}`}
              />
              <Link href="/profile" className="result-card-hero__secondary">
                View Profile →
              </Link>
            </>
          }
        />

        <aside className="ai-foundation-bridge" aria-label="Optional depth: IR Foundation">
          <p className="ai-foundation-bridge__text">
            Your AI governance instincts sit on top of deeper foreign-policy assumptions.{" "}
            <Link href="/quiz" className="ai-foundation-bridge__cta">
              Take the IR Foundation
            </Link>{" "}
            to see where they come from.
          </p>
        </aside>

        <div className="result-section stack-md">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Strongest axis signals</p>
            <h2>Where your scores pulled hardest</h2>
            <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65" }}>
              The three axes furthest from the midpoint in your responses — the signals doing the
              most work behind the archetype above.
            </p>
          </div>
          <div className="ai-result-hero__bars">
            {heroAxisSignals.map((card) => (
              <ScaleBar
                key={card.axis}
                label={card.label}
                value={card.score}
                valueLabel={`${card.score.toFixed(1)} / 7`}
                tone="ai"
              />
            ))}
          </div>
          <div className="row gap-sm wrap">
            <Link href="/ai/atlas" className="cta-secondary">Browse AI Atlas</Link>
            <Link href="/ai/field-guide" className="cta-secondary">AI Field Guide</Link>
          </div>

          <div className="profile-summary-grid">
            <article className="profile-summary-card stack-xs">
              <p className="eyebrow">Governing instinct</p>
              <p className="profile-mosaic-body">{deepDive.governingInstinct}</p>
            </article>
            <article className="profile-summary-card stack-xs">
              <p className="eyebrow">Main signal</p>
              <p className="profile-mosaic-body">{getPrimaryAxisSummary(axisScores)}</p>
            </article>
            <article className="profile-summary-card stack-xs">
              <p className="eyebrow">Tension to watch</p>
              <p className="profile-mosaic-body">{deepDive.tensions[0]?.text ?? explanation}</p>
            </article>
            <article className="profile-summary-card stack-xs">
              <p className="eyebrow">Next step</p>
              <p className="profile-mosaic-body">
                Keep this beside the IR Foundation in Profile rather than treating it as a
                replacement for the baseline.
              </p>
              <p style={{ margin: 0 }}>
                <Link href="/profile" style={{ color: "var(--accent)" }}>
                  Open Profile →
                </Link>
              </p>
            </article>
          </div>
          <div className="callout stack-xs" aria-label="Trust and coverage note">
            <p style={{ fontWeight: 600 }}>Trust and coverage</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.875rem" }}>
              This is a structured read within the current compass, not a claim that the field
              divides into fixed camps. The archetype is the closest modeled fit, not a final or
              exhaustive identity.{" "}
              <Link href="/method" style={{ color: "var(--accent)" }}>
                Methods explains the limits →
              </Link>
              {" "}
              <Link href="/ai/field-guide" style={{ color: "var(--accent)" }}>
                Field Guide explains the AI scope →
              </Link>
            </p>
          </div>
        </div>

        <AiProjectBridge mode="result" aiArchetypeKey={profileResult.archetypeKey} />

        {/* ── 2. Explanation ── */}
        <div className="result-section stack-md">
          <details className="profile-details">
            <summary>Read the longer archetype explanation</summary>
            <div className="ai-result-section-intro stack-xs" style={{ marginTop: "16px" }}>
              <p className="eyebrow">Archetype</p>
              <h2>What this means</h2>
            </div>
            <p style={{ lineHeight: "1.78", maxWidth: "680px", fontSize: "0.97rem" }}>{explanation}</p>
          </details>
        </div>

        <AiGovernanceProfileSections result={profileResult} />

        {/* ── 3. Axis profile ── */}
        <div className="result-section stack-md">
          <div className="ai-result-section-intro stack-xs">
            <p className="eyebrow">Eight dimensions</p>
            <h2>Axis profile</h2>
            <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
              These scores run from 1 to 7 in this model. They are positions on the axes, not
              rankings against other people.
            </p>
          </div>
          <div>
            {axisCards.map((card) => (
              <div key={card.axis} className="ai-dim-row">
                <ScaleBar label={card.label} value={card.score} tone="ai" />
                <p className="muted" style={{ fontSize: "0.8rem", lineHeight: "1.55", marginTop: "6px" }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Reading list ── */}
        <AiGovernanceReadingListSection archetypeKey={decoded.ak} />

        {/* ── 5. Methods note + share ── */}
        <div className="result-section stack-md">
          <div className="callout stack-xs">
            <p style={{ fontWeight: 600 }}>About this profile</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.875rem" }}>
              Archetype labels are shorthand, not verdicts. The scores show positions in this
              model, not population percentiles. This is still an early-stage inventory covering a
              defined set of AI governance debates, not the whole field.
            </p>
          </div>

          <div className="callout stack-xs">
            <p style={{ fontWeight: 600, margin: 0 }}>Comparing results with someone else?</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.875rem", margin: 0 }}>
              Compare the axis profile, tensions, and reading buckets as well as the headline
              archetype. The most useful disagreements usually show up in the tradeoffs, not only
              in the top label.
            </p>
          </div>

          <p>
            <Link href={`/feedback?module=ai&result=${payload}`} style={{ color: "var(--accent)" }}>
              Share feedback on this module →
            </Link>
          </p>

          <div className="row gap-sm wrap">
            <Link href={`/ai/atlas/${decoded.ak}`} className="cta-secondary">
              Archetype detail
            </Link>
            <Link href="/ai/field-guide" className="cta-secondary">AI Field Guide</Link>
            <Link href="/profile" className="cta-secondary">Profile</Link>
          </div>

          <ResearchOptIn instrumentLabel="AI Governance Compass" />

          <AiGovernanceShareActions
            payload={payload}
            archetypeLabel={archetypeLabel}
            riskLens={decoded.rl}
            paceModifier={decoded.pm}
            geopoliticsModifier={decoded.gm}
          />
        </div>

      </article>
    </div>
  )
}

