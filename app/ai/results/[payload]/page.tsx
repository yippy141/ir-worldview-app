import frontispiece from "@/components/results/ai-frontispiece.module.css"
import type { AiArchetypeKey } from "@/lib/ai-governance-types"
import Link from "next/link"
import { AiProjectBridge } from "@/components/ai/ai-project-bridge"
import { AiProfileSync } from "@/components/profile/ai-profile-sync"
import { ScaleBar } from "@/components/visual-primitives"
import { aiPayloadToAxisScores, resolveAiPayload } from "@/lib/ai-governance-share"
import {
  buildAiGovernanceSummary,
  getAiAxisPush,
  getAiComparisonAxes,
  getAxisCards,
} from "@/lib/ai-governance-results"
import {
  buildAiGovernanceDeepDive,
  buildAiGovernanceResultFromSharePayload,
} from "@/lib/ai-governance-results-v2"
import { ResultCardHeroShare } from "@/components/results/result-card-hero-share"
import { PushChart } from "@/components/results/push-chart"
import { NearestAlternative } from "@/components/results/nearest-alternative"
import { AiGovernancePayoffSections } from "@/components/results/ai-governance-payoff-sections"
import { AiGovernanceProfileSections } from "@/components/results/ai-governance-profile-sections"
import { AiGovernanceShareActions } from "@/components/results/ai-governance-share-actions"
import { AiGovernanceReadingListSection } from "@/components/results/ai-governance-reading-list-section"
import { ResearchStatusNotice } from "@/components/research/research-status-notice"
import { buildAiGovernancePayoff } from "@/lib/results/ai-governance-payoff"
import type { Metadata } from "next"

export async function generateMetadata(
  { params }: { params: Promise<{ payload: string }> },
): Promise<Metadata> {
  const { payload } = await params
  const resolved = resolveAiPayload(payload)
  if (!resolved) {
    const title = "Shared AI Governance result | AI Governance Compass"
    const description =
      "Open a shared AI Governance Compass result, or take the questionnaire to map your frontier-AI governance instincts."

    return buildAiResultMetadata(title, description)
  }

  const decoded = resolved.payload
  const profileResult = buildAiGovernanceResultFromSharePayload(
    decoded,
    resolved,
  )
  const deepDive = buildAiGovernanceDeepDive(
    profileResult,
    resolved.scoring.archetypeProfiles,
    resolved.scoring.archetypeLabels,
  )
  const label = resolved.scoring.archetypeLabels[decoded.ak]
  const title = `${label} result | AI Governance Compass`
  const description = `Shared AI Governance Compass result: ${deepDive.governingInstinct}`

  return buildAiResultMetadata(title, description)
}

function buildAiResultMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function AiResultPage(
  { params }: { params: Promise<{ payload: string }> },
) {
  const { payload } = await params
  const resolved = resolveAiPayload(payload)

  if (!resolved) {
    return (
      <div className="container stack-lg result-invalid">
        <div className="panel stack-md">
          <p className="eyebrow">Invalid result</p>
          <h1>This link could not be decoded.</h1>
          <p className="muted history-line">
            The result URL may be incomplete or corrupted.
          </p>
          <div className="row gap-sm wrap">
            <Link href="/ai/quiz" className="cta-primary">Take the AI questionnaire</Link>
          </div>
        </div>
      </div>
    )
  }

  const decoded = resolved.payload
  const axisScores = aiPayloadToAxisScores(decoded)
  const archetypeLabel = resolved.scoring.archetypeLabels[decoded.ak]
  const explanation = resolved.scoring.archetypeDescriptions[decoded.ak]
  const profileSummary = buildAiGovernanceSummary(
    decoded.ak,
    axisScores,
    decoded.rl,
    decoded.pm,
    resolved.scoring.archetypeLabels,
  )
  const axisCards = getAxisCards(axisScores)
  const axisPush = getAiAxisPush(axisScores)
  const heroAxisSignals = axisPush.slice(0, 3)
  const profileResult = buildAiGovernanceResultFromSharePayload(
    decoded,
    resolved,
  )
  const deepDive = buildAiGovernanceDeepDive(
    profileResult,
    resolved.scoring.archetypeProfiles,
    resolved.scoring.archetypeLabels,
  )
  const payoff = buildAiGovernancePayoff(profileResult)
  // Keep the encoded neighbouring identity authoritative across versions.
  // The section header, table, and contrast sentence use the same frozen key.
  const runnerUpKey = deepDive.comparison.runnerUpKey
  const runnerUpLabel = deepDive.comparison.runnerUpLabel
  const identityCode = [decoded.rl, decoded.pm, decoded.gm]
  const maximum = Math.max(...Object.values(profileResult.archetypeScores))
  const tiedLabels = Object.entries(profileResult.archetypeScores).filter(([, value]) => value === maximum).map(([key]) => resolved.scoring.archetypeLabels[key as AiArchetypeKey])
  const hasTiedLead = tiedLabels.length > 1


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
            summary: profileSummary,
            governingInstinct: deepDive.governingInstinct,
          }}
        />

        {/* ── 1. Verdict ── */}
        <header className={frontispiece.hero}>
          <p className="eyebrow">AI Governance Compass</p>
          <h1>{archetypeLabel}</h1>
          {hasTiedLead && <p>{tiedLabels.join(" and ")} share the exact leading model score. The saved label above does not break that tie.</p>}
          <p className="result-verdict__code">
            {identityCode.map((part, index) => (
              <span key={part}>
                {index > 0 ? <span aria-hidden="true"> · </span> : null}
                <span>{part}</span>
              </span>
            ))}
          </p>
          <p className={frontispiece.lead}>{hasTiedLead ? "The recorded axis positions support co-leading interpretations. Read the positions and comparison before treating one name as the answer." : deepDive.governingInstinct}</p>
          <div className="result-verdict__actions print-hidden">
            <a href="#ai-positions" className="cta-primary">Explore these positions</a>
            <Link href="/decisions/who-gets-access" className="cta-secondary">Try a release decision</Link>
            <Link href="/profile" className="cta-secondary">
              View Profile
            </Link>
          </div>
        </header>

        {/* ── 2. Strongest signals ── */}
        <section className="result-section result-figure">
          <h2 id="ai-positions">Positions furthest from the midpoint</h2>
          <div className="result-figure__bars">
            {heroAxisSignals.map((signal) => (
              <ScaleBar
                key={signal.key}
                label={signal.label}
                value={signal.score}
                valueLabel={signal.score.toFixed(1)}
                tone="ai"
              />
            ))}
          </div>
          <p className="result-figure__note">{profileSummary}</p>
        </section>

        {/* ── 3. What is doing the work ── */}
        <section className="result-section result-figure">
          <h2>Your positions on the AI questions</h2>
          <PushChart
            rows={axisPush}
            lowCaption="Toward the low pole"
            centreCaption="Model midpoint"
            highCaption="Toward the high pole"
            tone="ai"
          />
          <p className="result-figure__note">
            Each bar shows distance from the midpoint of the 1-7 axis. Bar length does not
            measure rarity or isolate how much one axis caused the archetype result.{" "}
            <Link href="/method">Methods sets out the limits →</Link>
          </p>
        </section>

        {/* ── 4. Nearest alternative ── */}
        <section className="result-section result-figure">
          <h2>{hasTiedLead ? "Comparison of the saved readings" : `Nearest alternative: ${runnerUpLabel}`}</h2>
          <NearestAlternative
            primaryLabel={archetypeLabel}
            runnerUpLabel={runnerUpLabel}
            rows={getAiComparisonAxes(
              decoded.ak,
              runnerUpKey,
              axisScores,
              resolved.scoring.archetypeProfiles,
            ).map((row) => ({
              key: row.axis,
              label: row.label,
              userScore: row.userScore,
              primaryExpected: row.primaryExpected,
              runnerUpExpected: row.runnerUpExpected,
            }))}
          />
          <p className="result-figure__note">{hasTiedLead ? `This compares the saved ${archetypeLabel} label with ${runnerUpLabel}; an equal score does not establish a winner.` : deepDive.comparison.contrastText}</p>
        </section>

        {/* ── 5. Policy payoff ── */}
        <AiGovernancePayoffSections payoff={payoff} />

        {/* ── 6. What would change this ── */}
        <section className="result-section result-next">
          <h2>What would change this</h2>
          <p className="result-next__question">{deepDive.questionToSitWith}</p>
          <div className="row gap-sm wrap">
            <Link href={`/ai/atlas/${decoded.ak}`} className="cta-primary">
              Read the archetype page
            </Link>
            <Link href="/quiz" className="cta-secondary">Take the IR Foundation</Link>
            <Link href="/profile" className="cta-secondary">View Profile</Link>
            <ResultCardHeroShare
              shareUrl={`/ai/results/${payload}`}
              title={`AI Governance Compass: ${archetypeLabel}`}
              text={`My AI governance profile: ${archetypeLabel} · ${decoded.rl} · ${decoded.pm} · ${decoded.gm}`}
            />
          </div>
        </section>

        <AiProjectBridge mode="result" />

        <section className="result-section result-appendix-section stack-md">
          <details className="profile-details">
            <summary>Full analysis</summary>
            <div className="stack-lg result-details-body">
              <div className="stack-md">
                <h2>How this profile weighs AI governance</h2>
                <p className="result-prose ai-result-body">{explanation}</p>
              </div>

              <AiGovernanceProfileSections
                result={profileResult}
                archetypeProfiles={resolved.scoring.archetypeProfiles}
                archetypeLabels={resolved.scoring.archetypeLabels}
              />

              <div className="stack-md">
                <h2>Axis profile</h2>
                <div>
                  {axisCards.map((card) => (
                    <div key={card.axis} className="ai-dim-row">
                      <ScaleBar label={card.label} value={card.score} tone="ai" />
                      <p className="muted ai-dim-row__note">{card.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <AiGovernanceReadingListSection archetypeKey={decoded.ak} />

              <div className="callout stack-xs">
                <p className="result-strong">Coverage limits</p>
                <p className="muted result-note-sm">
                  The Compass covers a defined set of AI governance debates and leaves others
                  outside its scope. The raw scores locate this response inside the model. The
                  archetype is the closest fit among six authored profiles.{" "}
                  <Link href="/method">Full methods note →</Link>{" "}
                  <Link href="/ai/field-guide">AI scope →</Link>
                </p>
              </div>

              <div className="stack-md">
                <p>
                  <Link href="/feedback">
                    Report a factual problem →
                  </Link>
                </p>
                <div className="row gap-sm wrap">
                  <Link href="/ai/atlas" className="cta-secondary">Browse AI Atlas</Link>
                  <Link href="/ai/field-guide" className="cta-secondary">AI Field Guide</Link>
                </div>
                <ResearchStatusNotice instrumentLabel="AI Governance Compass" />
                <AiGovernanceShareActions
                  payload={payload}
                  archetypeLabel={archetypeLabel}
                  riskLens={decoded.rl}
                  paceModifier={decoded.pm}
                  geopoliticsModifier={decoded.gm}
                />
              </div>
            </div>
          </details>
        </section>

      </article>
    </div>
  )
}
