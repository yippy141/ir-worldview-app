import { AiCompletionEvidence } from "@/components/results/ai-completion-evidence"
import { AiArchetypeMark } from "@/components/results/ai-archetype-mark"
import { WorkedApplication } from "@/components/results/worked-application"
import { EvidenceControls } from "@/components/reading/evidence-controls"
import { buildAiInterpretation, aiAxisReading, aiComparisonTerms } from "@/lib/results/ai-interpretation"
import { aiAxisPoles } from "@/lib/ai-governance-results"
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
  const payoff = buildAiGovernancePayoff(profileResult, resolved)
  const interpretation = buildAiInterpretation(resolved)
  const comparison = aiComparisonTerms(resolved)
  // Keep the encoded neighbouring identity authoritative across versions.
  // The section header, table, and contrast sentence use the same frozen key.
  const runnerUpKey = deepDive.comparison.runnerUpKey
  const runnerUpLabel = deepDive.comparison.runnerUpLabel
  const identityCode = [decoded.rl, decoded.pm, decoded.gm]
  const maximum = Math.max(...Object.values(profileResult.archetypeScores))
  const tiedKeys = Object.entries(profileResult.archetypeScores).filter(([, value]) => value === maximum).map(([key]) => key as AiArchetypeKey)
  const tiedLabels = tiedKeys.map(key => resolved.scoring.archetypeLabels[key])
  const hasTiedLead = tiedLabels.length > 1
  const savedLabelLeads = tiedKeys.includes(decoded.ak)


  return (
    <div className="wide-container">
      <article className="result-article result-canvas ai-result-canvas">
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
        <header className={frontispiece.hero} data-ai-lead={hasTiedLead ? "tied" : savedLabelLeads ? "leading" : "saved-nonleading"}>
          <p className="eyebrow">AI Governance Compass</p>
          {hasTiedLead ? <div className="ai-tied-marks">{tiedKeys.map(key => <div key={key}><AiArchetypeMark archetype={key} /><p>{resolved.scoring.archetypeLabels[key]}</p></div>)}</div> : <AiArchetypeMark archetype={decoded.ak} />}
          <h1>{hasTiedLead ? "Co-leading AI readings" : archetypeLabel}</h1>
          {hasTiedLead && <p>{tiedLabels.join(" and ")} share the exact leading model score. The saved label, {archetypeLabel}, does not break that tie.</p>}
          {!savedLabelLeads && <p>The saved name is preserved. These rounded coordinates do not reproduce it as a leading model score; use the positions below as the supported reading.</p>}
          <p className="result-verdict__code">
            {identityCode.map((part, index) => (
              <span key={part}>
                {index > 0 ? <span aria-hidden="true"> · </span> : null}
                <span>{part}</span>
              </span>
            ))}
          </p>
          <p className={frontispiece.lead}>{interpretation.summary}</p>
          <div className="result-verdict__actions print-hidden">
            <a href="#ai-positions" className="cta-primary">Explore these positions</a>
            <Link href="/decisions/who-gets-access" className="cta-secondary">Try a release decision</Link>
            <Link href="/profile" className="cta-secondary">
              View Profile
            </Link>
          </div>
        </header>

        <p className="result-scope">{interpretation.scope}</p>
        <AiCompletionEvidence payload={payload} />
        <WorkedApplication example={interpretation.example} />

        {/* ── 2. Strongest signals ── */}
        <section className="result-section result-figure">
          <h2 id="ai-positions">Positions furthest from the midpoint</h2>
          <div className="result-figure__bars">
            {heroAxisSignals.map((signal) => (
              <div key={signal.key} className="result-axis-reading"><ScaleBar
                className="position-scale"
                label={signal.label}
                value={signal.score}
                valueLabel={signal.score.toFixed(1)}
                lowLabel={aiAxisPoles[signal.key].low}
                highLabel={aiAxisPoles[signal.key].high}
                tone="ai"
              /><p>{aiAxisReading(signal.key, signal.score)}</p></div>
            ))}
          </div>
          <p className="result-figure__note">The marker locates the recorded position on a 1–7 scale. Either endpoint can express a strong position; this is not a progress bar.</p>
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
              lowLabel: aiAxisPoles[row.axis].low,
              highLabel: aiAxisPoles[row.axis].high,
              note: `Comparison term: ${(comparison.rows.find(term => term.axis === row.axis)?.term ?? 0).toFixed(3)}`,
              userScore: row.userScore,
              primaryExpected: row.primaryExpected,
              runnerUpExpected: row.runnerUpExpected,
            }))}
          />
          <p className="result-figure__note">{hasTiedLead ? `This compares the saved ${archetypeLabel} label with ${runnerUpLabel}; an equal score does not establish a winner.` : comparison.difference <= 0 ? `The rounded positions do not establish ${archetypeLabel} ahead of ${runnerUpLabel}. The saved names are preserved without asserting a winner.` : `The recorded positions favor ${archetypeLabel} over ${runnerUpLabel} most through ${resolved.schema.aiAxisLabels[comparison.rows.reduce((best, row) => row.term > best.term ? row : best).axis].toLowerCase()}.`}</p>
          <p className="result-axis-note"><strong>A case that distinguishes these emphases. </strong>{comparison.question}</p>
          <p className="result-figure__note">Each term is the recorded axis position minus 4, multiplied by the difference between these two frozen model weights. Positive terms favor {archetypeLabel}; negative terms favor {runnerUpLabel}.</p>
        </section>

        {/* ── 6. What would change this ── */}
        <section className="result-section result-next">
          <h2>What would change this</h2>
          <p className="result-next__question">{interpretation.followUp.question}</p>
          <p className="result-scope">A new question to consider. No answer is recorded or rescored here.</p>
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
          <EvidenceControls />
          <h2>Full analysis</h2>
          <details className="profile-details">
            <summary>Reasoning and policy debates</summary>
            <div className="stack-lg result-details-body">
              <AiGovernancePayoffSections payoff={payoff} />
              <AiGovernanceProfileSections resolved={resolved} />
              <details>
                <summary>Saved category wording</summary>
                <p className="result-scope">The registered model describes {archetypeLabel} in the words below. This is a category reference; the recorded positions and any co-leading readings determine how far it applies.</p>
                <blockquote className="result-prose ai-result-body">{explanation}</blockquote>
              </details>
            </div>
          </details>
          <details className="profile-details" id="ai-calculations">
            <summary>Positions and exact comparison calculations</summary>
            <div className="stack-lg result-details-body">
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


              <p>Model tuple: bank {resolved.bankVersion}, scorer {resolved.scoringVersion}. Saved comparison: {archetypeLabel} minus {runnerUpLabel} = {comparison.difference.toFixed(2)}. Rounding residual: {comparison.residual.toFixed(4)}.</p>
              <ul className="content-list">{comparison.rows.map(row => <li key={row.axis}>{resolved.schema.aiAxisLabels[row.axis]}: {row.term.toFixed(3)}</li>)}</ul>
              <div className="stack-md">
                <h2>Axis profile</h2>
                <div>
                  {axisCards.map((card) => (
                    <div key={card.axis} className="ai-dim-row">
                      <ScaleBar className="position-scale" label={card.label} value={card.score} lowLabel={aiAxisPoles[card.axis].low} highLabel={aiAxisPoles[card.axis].high} tone="ai" />
                      <p className="muted ai-dim-row__note">{aiAxisReading(card.axis, card.score)}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </details>
          <details className="profile-details" id="ai-sources">
            <summary>Reading, sources and scope</summary>
            <div className="stack-lg result-details-body">
              <AiGovernanceReadingListSection archetypeKey={decoded.ak} interpretation={interpretation} />

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
