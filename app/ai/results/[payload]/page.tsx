import Link from "next/link"
import { AiProjectBridge } from "@/components/ai/ai-project-bridge"
import { AiProfileSync } from "@/components/profile/ai-profile-sync"
import { ScaleBar } from "@/components/visual-primitives"
import { decodeAiPayload, aiPayloadToAxisScores } from "@/lib/ai-governance-share"
import {
  archetypeLabelFromKey,
  archetypeDescriptions,
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
  const decoded = decodeAiPayload(payload)
  if (!decoded) {
    const title = "Shared AI Governance result — AI Governance Compass"
    const description =
      "Open a shared AI Governance Compass result, or take the questionnaire to map your frontier-AI governance instincts."

    return buildAiResultMetadata(title, description)
  }

  const profileResult = buildAiGovernanceResultFromSharePayload(decoded)
  const deepDive = buildAiGovernanceDeepDive(profileResult)
  const label = archetypeLabelFromKey(decoded.ak)
  const title = `${label} result — AI Governance Compass`
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
  const decoded = decodeAiPayload(payload)

  if (!decoded) {
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

  const axisScores = aiPayloadToAxisScores(decoded)
  const archetypeLabel = archetypeLabelFromKey(decoded.ak)
  const explanation = archetypeDescriptions[decoded.ak]
  const profileSummary = buildAiGovernanceSummary(decoded.ak, axisScores, decoded.rl, decoded.pm)
  const axisCards = getAxisCards(axisScores)
  const axisPush = getAiAxisPush(axisScores)
  const heroAxisSignals = axisPush.slice(0, 3)
  const profileResult = buildAiGovernanceResultFromSharePayload(decoded)
  const deepDive = buildAiGovernanceDeepDive(profileResult)
  const payoff = buildAiGovernancePayoff(profileResult)
  // The comparison card recomputes the neighbour from the decoded axis scores.
  // Use that key for the table too, so the section header, the table, and the
  // contrast sentence all name the same archetype.
  const runnerUpKey = deepDive.comparison.runnerUpKey
  const runnerUpLabel = deepDive.comparison.runnerUpLabel
  const identityCode = [archetypeLabel, decoded.rl, decoded.pm, decoded.gm]

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
        <header className="result-verdict">
          <p className="eyebrow">AI Governance Compass</p>
          <h1 className="result-verdict__name">{archetypeLabel}</h1>
          <p className="result-verdict__code">
            {identityCode.map((part, index) => (
              <span key={part}>
                {index > 0 ? <span aria-hidden="true"> · </span> : null}
                <span>{part}</span>
              </span>
            ))}
          </p>
          <p className="result-verdict__gloss">{deepDive.governingInstinct}</p>
        </header>

        {/* ── 2. Strongest signals ── */}
        <section className="result-section result-figure">
          <h2>Your three strongest axes</h2>
          <div className="result-figure__bars">
            {heroAxisSignals.map((signal) => (
              <ScaleBar
                key={signal.key}
                label={signal.label}
                value={signal.score}
                valueLabel={`${signal.score.toFixed(1)} / 7`}
                tone="ai"
              />
            ))}
          </div>
          <p className="result-figure__note">{profileSummary}</p>
        </section>

        {/* ── 3. What is doing the work ── */}
        <section className="result-section result-figure">
          <h2>What is doing the work</h2>
          <PushChart
            rows={axisPush}
            lowCaption="Toward the low pole"
            centreCaption="Model midpoint"
            highCaption="Toward the high pole"
            tone="ai"
          />
          <p className="result-figure__note">
            Each bar is the distance from the midpoint of the 1-7 axis. Long bars moved the
            archetype; short bars did not.{" "}
            <Link href="/method">Methods sets out the limits →</Link>
          </p>
        </section>

        {/* ── 4. Nearest alternative ── */}
        <section className="result-section result-figure">
          <h2>Nearest alternative: {runnerUpLabel}</h2>
          <NearestAlternative
            primaryLabel={archetypeLabel}
            runnerUpLabel={runnerUpLabel}
            rows={getAiComparisonAxes(decoded.ak, runnerUpKey, axisScores).map((row) => ({
              key: row.axis,
              label: row.label,
              userScore: row.userScore,
              primaryExpected: row.primaryExpected,
              runnerUpExpected: row.runnerUpExpected,
            }))}
          />
          <p className="result-figure__note">{deepDive.comparison.contrastText}</p>
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

        <AiProjectBridge mode="result" aiArchetypeKey={profileResult.archetypeKey} />

        <section className="result-section result-appendix-section stack-md">
          <details className="profile-details">
            <summary>Full analysis</summary>
            <div className="stack-lg result-details-body">
              <div className="stack-md">
                <h2>How this profile weighs AI governance</h2>
                <p className="result-prose ai-result-body">{explanation}</p>
              </div>

              <AiGovernanceProfileSections result={profileResult} />

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
                  outside its scope. Scores locate you inside this model and carry no
                  population-percentile meaning. The archetype is the closest fit among six
                  authored profiles.{" "}
                  <Link href="/method">Full methods note →</Link>{" "}
                  <Link href="/ai/field-guide">AI scope →</Link>
                </p>
              </div>

              <div className="stack-md">
                <p>
                  <Link href="/feedback">
                    Report a factual or interface problem →
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
