import Link from "next/link"
import { resolveFoundationPayload } from "@/lib/share"
import {
  buildProfileTitle,
  familyLabelFromKey,
  getClosestTraditions,
  getKeyDrivers,
  getActiveTensions,
  neighborOverlapTexts,
  dimensionOneLiners,
  glossaryTerms,
  suggestedReadings,
  getStrongLenses,
  getSubtraditionAffinity,
  getIssueAreaTilts,
  getRunnerUpSeparation,
  getFlipAnalysis,
  getWhyThisResult,
  getComparisonDimensions,
  getHowYouReadTheWorld,
  getPressureTestQuestions,
} from "@/lib/result-helpers"
import { dimensionLabels } from "@/lib/quiz-schema"
import { buildFoundationNarrative } from "@/lib/narrative/foundation"
import { familySlug, familyTraditionClass } from "@/lib/worldview-config"
import { ShareActions } from "@/components/results/share-actions"
import { HistoryCompare } from "@/components/results/history-compare"
import { FoundationProfileSync } from "@/components/profile/foundation-profile-sync"
import { modules } from "@/lib/modules/framework"
import type { DimensionKey, FamilyKey } from "@/lib/types"
import type { Metadata } from "next"

export async function generateMetadata(
  { params }: { params: Promise<{ payload: string }> },
): Promise<Metadata> {
  const { payload } = await params
  const resolved = resolveFoundationPayload(payload)
  if (!resolved) return { title: "Result — IR Worldview Inventory" }

  const familyLabel = familyLabelFromKey(resolved.result.familyKey)

  return {
    title: `${familyLabel} — IR Worldview Inventory`,
    description: `My IR Worldview result: ${familyLabel} · ${resolved.result.strategyModifier} · ${resolved.result.normativeModifier}`,
  }
}

const TRADITION_COLOR: Record<FamilyKey, string> = {
  realist: "var(--t-realist)",
  institutionalist: "var(--t-institutionalist)",
  constructivist: "var(--t-constructivist)",
  criticalPoliticalEconomy: "var(--t-cpe)",
}

const TRADITION_RULE_CLASS: Record<FamilyKey, string> = {
  realist: "result-hero-rule--realist",
  institutionalist: "result-hero-rule--institutionalist",
  constructivist: "result-hero-rule--constructivist",
  criticalPoliticalEconomy: "result-hero-rule--cpe",
}

const STRATEGY_STYLE_NOTES = {
  Restrainer:
    "You lean toward limiting commitments and avoiding overextension rather than pressing every available advantage.",
  Hedger:
    "You keep both competition and restraint live. The strategic answer depends on the case, not a fixed rule.",
  Maximizer:
    "You are comparatively more willing to press for durable advantage when the strategic opening looks real.",
} as const

const NORMATIVE_STYLE_NOTES = {
  Pluralist:
    "You usually give order, sovereignty, and precedent more weight than wider moral claims when they collide.",
  "Conditional Solidarist":
    "You treat order and justice as a live tension. Neither side settles the question in advance.",
  Universalist:
    "You are more willing to let severe moral stakes override sovereignty in extreme cases.",
} as const

export default async function ResultPage(
  { params }: { params: Promise<{ payload: string }> },
) {
  const { payload } = await params
  const resolved = resolveFoundationPayload(payload)

  if (!resolved) {
    return (
      <div className="container stack-lg" style={{ paddingTop: "48px" }}>
        <div className="panel stack-md">
          <p className="eyebrow">Invalid result</p>
          <h1>This link could not be decoded.</h1>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            The result URL may be incomplete, corrupted, or from an older version of the inventory.
          </p>
          <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
            <Link href="/quiz" className="cta-primary">Take the Foundation</Link>
            <Link href="/explore" className="cta-secondary">Explore the perspectives</Link>
            <Link href="/method" className="cta-secondary">Methods</Link>
          </div>
        </div>
      </div>
    )
  }

  const { dimensionScores, result } = resolved
  const familyScores = result.familyScores
  const closestTraditions = getClosestTraditions(familyScores)
  const familyLabel = result.familyLabel
  const neighborKey = result.runnerUpKey
  const neighborLabel = result.runnerUpLabel
  const traditionClass = familyTraditionClass(result.familyKey)
  const neighborTraditionClass = familyTraditionClass(neighborKey)
  const traditionColor = TRADITION_COLOR[result.familyKey]
  const ruleClass = TRADITION_RULE_CLASS[result.familyKey]

  const profileTitle = buildProfileTitle(dimensionScores)
  const explanation = result.explanation
  const keyDrivers = getKeyDrivers(dimensionScores)
  const strongLenses = getStrongLenses(dimensionScores)
  const tensions = getActiveTensions(dimensionScores)
  const neighborText = neighborOverlapTexts[result.familyKey]?.[neighborKey] ?? ""
  const readings = suggestedReadings[result.familyKey]
  const neighborReadings = suggestedReadings[neighborKey]
  const subtraditionAffinity = getSubtraditionAffinity(result.familyKey, dimensionScores)
  const issueAreaTilts = getIssueAreaTilts(result.familyKey, dimensionScores)
  const runnerUpSeparation = getRunnerUpSeparation(result.familyKey, neighborKey, dimensionScores)
  const flipAnalysis = getFlipAnalysis(result.familyKey, neighborKey, dimensionScores)
  const whyThisResult = getWhyThisResult(result.familyKey, neighborKey, dimensionScores)
  const comparisonDims = getComparisonDimensions(result.familyKey, neighborKey, dimensionScores)
  const foundationNarrative = buildFoundationNarrative({
    familyKey: result.familyKey,
    runnerUpKey: neighborKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    dimensionScores,
  })
  const summary = foundationNarrative.summary

  const issueStances = getHowYouReadTheWorld(
    result.familyKey,
    result.strategyModifier,
    result.normativeModifier,
  )
  const pressureQuestions = getPressureTestQuestions(result.familyKey)
  const mixedNote = tensions[0]?.text ?? getFallbackMixedNote(foundationNarrative.state, closestTraditions.note)

  return (
    <div className="wide-container">
      <article className="result-article">
        <FoundationProfileSync
          snapshot={{
            payload,
            resultPath: `/results/${payload}`,
            familyKey: result.familyKey,
            familyLabel,
            runnerUpKey: neighborKey,
            runnerUpLabel: neighborLabel,
            summary,
            dimensionScores,
            strategyModifier: result.strategyModifier,
            normativeModifier: result.normativeModifier,
            keyDrivers: keyDrivers.map((driver) => ({
              type: driver.type,
              label: driver.label,
              description: driver.description,
            })),
            strongLenses: strongLenses.map((lens) => ({
              label: lens.label,
              description: lens.description,
            })),
          }}
        />

        {/* ── 1. Hero ── */}
        <div className="result-hero">
          <div className={`result-hero-rule ${ruleClass}`} />
          <p className="eyebrow">Foundation result</p>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
            {profileTitle}
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "8px" }}>
            {foundationNarrative.state === "lowDifferentiation"
              ? "Nearest-fit tradition"
              : closestTraditions.showBoth
                ? "Closest traditions"
                : "Closest tradition"}:{" "}
            {closestTraditions.displayLabel}
          </p>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
            <span className={`tradition-chip ${traditionClass}`}>{familyLabel}</span>
            {closestTraditions.showBoth && (
              <span className={`tradition-chip ${neighborTraditionClass}`}>{neighborLabel}</span>
            )}
          </div>
          <p style={{ fontSize: "1rem", lineHeight: "1.75", maxWidth: "720px", marginBottom: "10px" }}>
            {summary}
          </p>
        </div>

        {/* ── 2. Main payoff ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Main signals</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              The strongest pulls in your Foundation result, before the deeper taxonomy and methods
              notes.
            </p>
          </div>
          <div className="driver-grid">
            {keyDrivers.map((driver) => (
              <div key={driver.dimension} className="driver-card stack-xs">
                <p className="eyebrow">{driver.type}</p>
                <p style={{ fontWeight: 600, fontFamily: "Georgia, serif", marginTop: "6px" }}>
                  {driver.label}
                </p>
                <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.55", marginTop: "6px" }}>
                  {driver.description}
                </p>
              </div>
            ))}
          </div>
          <div className="callout stack-xs">
            <p style={{ fontWeight: 600 }}>Where you were mixed or what may shift under pressure</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
              {mixedNote}
            </p>
          </div>
          {strongLenses.length > 0 && (
            <div className="stack-sm" style={{ marginTop: "8px" }}>
              <p className="eyebrow">Strong lenses</p>
              <div className="driver-grid">
                {strongLenses.map((lens) => (
                  <div key={lens.key} className="driver-card stack-xs">
                    <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>{lens.label}</p>
                    <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.55" }}>
                      {lens.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="driver-grid" style={{ marginTop: "8px" }}>
            <div className="driver-card stack-xs">
              <p className="eyebrow">Strategic style</p>
              <p style={{ fontWeight: 600, fontFamily: "Georgia, serif", marginTop: "6px" }}>
                {result.strategyModifier}
              </p>
              <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.55", marginTop: "6px" }}>
                {STRATEGY_STYLE_NOTES[result.strategyModifier]}
              </p>
            </div>
            <div className="driver-card stack-xs">
              <p className="eyebrow">Normative style</p>
              <p style={{ fontWeight: 600, fontFamily: "Georgia, serif", marginTop: "6px" }}>
                {result.normativeModifier}
              </p>
              <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.55", marginTop: "6px" }}>
                {NORMATIVE_STYLE_NOTES[result.normativeModifier]}
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. Dimension profile ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Dimension profile</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Scores run from 1 to 7 inside this model. They are relative positions, not population
              percentiles.
            </p>
          </div>
          <div>
            {(Object.entries(dimensionScores) as [DimensionKey, number][]).map(([dim, value]) => (
              <div key={dim} className="dim-row">
                <div className="progress-meta">
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>
                    {dimensionLabels[dim]}
                  </span>
                  <span>{value.toFixed(1)} / 7</span>
                </div>
                <div className="score-bar" style={{ margin: "6px 0" }} aria-hidden="true">
                  <div className="score-fill" style={{ width: `${(value / 7) * 100}%` }} />
                </div>
                <p className="muted" style={{ fontSize: "0.8rem", lineHeight: "1.5" }}>
                  {dimensionOneLiners[dim](value)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Closest traditions ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Closest traditions</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              {closestTraditions.note}
            </p>
          </div>
          <div className="neighbor-columns">
            <div className="stack-xs">
              <p className="eyebrow">Closest shorthand</p>
              <p style={{ fontWeight: 700, fontFamily: "Georgia, serif", fontSize: "1.05rem", marginTop: "6px" }}>
                {familyLabel}
              </p>
            </div>
            <div className="stack-xs">
              <p className="eyebrow">{closestTraditions.showBoth ? "Also very close" : "Nearest overlap"}</p>
              <p style={{ fontWeight: 700, fontFamily: "Georgia, serif", fontSize: "1.05rem", marginTop: "6px" }}>
                {neighborLabel}
              </p>
            </div>
          </div>
          <details className="profile-details">
            <summary>Why these traditions are close</summary>
            <div className="result-prose stack-md" style={{ marginTop: "16px" }}>
              <p style={{ lineHeight: "1.65" }}>{explanation}</p>
              {neighborText && (
                <p className="muted" style={{ lineHeight: "1.65" }}>{neighborText}</p>
              )}
              {foundationNarrative.state !== "lowDifferentiation" && runnerUpSeparation && (
                <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                  {runnerUpSeparation}
                </p>
              )}
              {foundationNarrative.state !== "lowDifferentiation" && flipAnalysis && (
                <div className="flip-note">
                  <p style={{ fontSize: "0.875rem", lineHeight: "1.65" }}>{flipAnalysis}</p>
                </div>
              )}
            </div>
            <div style={{ marginTop: "20px" }}>
              <p className="muted" style={{ fontSize: "0.85rem", marginBottom: "10px" }}>
                Dimensions where {familyLabel} and {neighborLabel} diverge most:
              </p>
              <div className="comparison-strip">
                <div className="comparison-header">
                  <span className="comparison-label" />
                  <span className="comparison-family">{familyLabel}</span>
                  <span className="comparison-score-head">Your score</span>
                  <span className="comparison-family">{neighborLabel}</span>
                </div>
                {comparisonDims.map((cd) => (
                  <div key={cd.dim} className="comparison-row">
                    <span className="comparison-label">{cd.label}</span>
                    <span className={`comparison-expected comparison-expected--${cd.primaryExpected}`}>
                      {cd.primaryExpected === "high" ? "Higher" : cd.primaryExpected === "low" ? "Lower" : "Neutral"}
                    </span>
                    <span className="comparison-score">{cd.userScore.toFixed(1)}</span>
                    <span className={`comparison-expected comparison-expected--${cd.runnerUpExpected}`}>
                      {cd.runnerUpExpected === "high" ? "Higher" : cd.runnerUpExpected === "low" ? "Lower" : "Neutral"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </details>
          <p style={{ fontSize: "0.875rem", marginTop: "16px" }}>
            <Link href={`/explore/${familySlug(neighborKey)}`} style={{ color: "var(--accent)" }}>
              Learn more about {neighborLabel} →
            </Link>
          </p>
        </div>

        {/* ── 5. Module bridge ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Add a focus-area overlay</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              The Foundation result is the base layer. The modules below stay separate and show how
              your instincts travel in one issue domain, then feed into your local Profile page.
            </p>
          </div>
          <div className="module-card-grid">
            {modules.map((moduleDefinition) => (
              <Link
                key={moduleDefinition.slug}
                href={`/modules/${moduleDefinition.slug}?foundation=${encodeURIComponent(payload)}`}
                className="explore-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <p className="eyebrow" style={{ marginBottom: "10px" }}>Focus-area module</p>
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    marginBottom: "8px",
                  }}
                >
                  {moduleDefinition.title}
                </p>
                <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.88rem" }}>
                  {moduleDefinition.description}
                </p>
                <p style={{ marginTop: "12px", fontSize: "0.82rem", color: "var(--accent-light)", fontWeight: 600 }}>
                  Standard: {moduleDefinition.timeEstimate.standard} · Deep-dive: {moduleDefinition.timeEstimate.analyst}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* ── 6. Interpretive read ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Interpretive read</h2>
            <p className="muted" style={{ fontSize: "0.85rem" }}>
              Kept below the headline payoff so the page leads with the result, not the editorial
              scaffolding around it.
            </p>
          </div>
          <details className="profile-details">
            <summary>Open the longer interpretation</summary>
            <div className="result-prose stack-md" style={{ marginTop: "16px" }}>
              {foundationNarrative.sections.map((section) => (
                <div key={section.title} className="stack-xs">
                  <p className="eyebrow">{section.title}</p>
                  <p style={{ lineHeight: "1.7" }}>{section.text}</p>
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* ── 7. Why this shorthand fits ── */}
        <div className="result-section stack-md">
          <h2>{foundationNarrative.state === "lowDifferentiation" ? "Why this nearest fit still appears" : "Why this shorthand fits"}</h2>
          <details className="profile-details">
            <summary>Open the shorthand breakdown</summary>
            {subtraditionAffinity && (
              <div className="result-prose" style={{ marginTop: "16px" }}>
                <p style={{ fontWeight: 600, fontFamily: "Georgia, serif", fontSize: "0.95rem" }}>
                  {subtraditionAffinity.name}
                </p>
                <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.875rem", marginTop: "6px" }}>
                  {subtraditionAffinity.note}
                </p>
              </div>
            )}
            <div className="result-prose" style={{ marginTop: "16px" }}>
              <p className="muted" style={{ fontSize: "0.85rem", marginBottom: "8px" }}>
                {foundationNarrative.state === "lowDifferentiation"
                  ? "What still pulls this profile slightly closer to the nearest fit:"
                  : "Why this result won over the runner-up:"}
              </p>
              <ul className="content-list">
                {whyThisResult.map((bullet, i) => <li key={i}>{bullet}</li>)}
              </ul>
            </div>
          </details>
        </div>

        {/* ── 8. Pressure-test ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Pressure-test your worldview</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Three questions designed to probe the limits of this framework.
            </p>
          </div>
          <ol className="pressure-list result-prose">
            {pressureQuestions.map((q, i) => (
              <li key={i} className="pressure-q">
                <p>{q}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* ── 9. Issue-area reading ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>How this profile may travel across issues</h2>
            <p className="muted" style={{ fontSize: "0.85rem" }}>
              Illustrative bridges from the Foundation baseline, not substitutes for a dedicated
              module result.
            </p>
          </div>
          <details className="profile-details">
            <summary>Open the issue-bridge notes</summary>
            <div className="result-prose" style={{ marginTop: "16px" }}>
              {issueStances.map((stance) => (
                <div key={stance.issue} className="issue-module">
                  <p className="issue-module-title">{stance.issue}</p>
                  <p className="issue-module-text">{stance.text}</p>
                </div>
              ))}
            </div>
            {issueAreaTilts.length > 0 && (
              <div className="result-prose" style={{ marginTop: "8px" }}>
                <p className="muted" style={{ fontSize: "0.8rem", fontStyle: "italic", marginBottom: "12px" }}>
                  Where your scores suggest a different instinct than the primary shorthand alone
                  would predict:
                </p>
                <div>
                  {issueAreaTilts.map((tilt) => (
                    <div key={tilt.issue} className="issue-tilt-row">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", flexWrap: "wrap", marginBottom: "4px" }}>
                        <p style={{ fontWeight: 600, fontFamily: "Georgia, serif", fontSize: "0.875rem" }}>
                          {tilt.issue}
                        </p>
                        <p style={{ fontSize: "0.68rem", fontWeight: 600, color: traditionColor, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>
                          {tilt.tilt}
                        </p>
                      </div>
                      <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.85rem" }}>
                        {tilt.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </details>
        </div>

        {/* ── 10. Suggested reading ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Suggested reading</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Three starting points for your primary worldview. Two for the runner-up.
            </p>
          </div>
          <div>
            {readings.map((item) => (
              <div key={item.title} className="reading-bib">
                <p style={{ fontWeight: 600 }}>{item.title}</p>
                <p className="muted" style={{ fontSize: "0.875rem", marginTop: "2px" }}>{item.author}</p>
                <p style={{ fontSize: "0.875rem", lineHeight: "1.55", marginTop: "6px" }}>{item.note}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="muted" style={{ fontSize: "0.875rem", marginBottom: "8px" }}>
              Also worth reading — {neighborLabel}:
            </p>
            {neighborReadings.slice(0, 2).map((item) => (
              <div key={item.title} className="reading-bib">
                <p style={{ fontWeight: 600 }}>{item.title}</p>
                <p className="muted" style={{ fontSize: "0.875rem", marginTop: "2px" }}>{item.author}</p>
                <p style={{ fontSize: "0.875rem", lineHeight: "1.55", marginTop: "6px" }}>{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 11. Glossary ── */}
        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Glossary</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Key terms used in your result, defined without assuming prior IR knowledge.
            </p>
          </div>
          <div>
            {glossaryTerms.map((term) => (
              <div key={term.term} className="definition-item">
                <p style={{ fontWeight: 600, marginBottom: "4px" }}>{term.term}</p>
                <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                  {term.definition}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 12. Methods note + share ── */}
        <div className="result-section stack-md">
          <div className="callout stack-xs">
            <p style={{ fontWeight: 600 }}>About this classification</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.875rem" }}>
              Structured thought exercise, not a validated scientific diagnostic. Tradition labels
              are shorthand for a multidimensional profile, and case-based readings stay separate
              from the foundation result. Scores are comparative within this model, not population
              percentiles.{" "}
              <Link href="/method" style={{ color: "var(--accent)" }}>
                Full methods note →
              </Link>
            </p>
          </div>
          <p>
            <Link href="/profile" style={{ color: "var(--accent)" }}>
              View your integrated profile →
            </Link>
          </p>
          <p>
            <Link href={`/explore/${familySlug(result.familyKey)}`} style={{ color: "var(--accent)" }}>
              Explore {familyLabel} in depth →
            </Link>
          </p>
          <p>
            <Link href={`/feedback?result=${payload}`} style={{ color: "var(--accent)" }}>
              Share feedback on this inventory →
            </Link>
          </p>
          <ShareActions
            payload={payload}
            familyLabel={familyLabel}
            strategyModifier={result.strategyModifier}
            normativeModifier={result.normativeModifier}
          />
          <HistoryCompare
            familyKey={result.familyKey}
            neighborKey={neighborKey}
            strategyModifier={result.strategyModifier}
            normativeModifier={result.normativeModifier}
            dimensionScores={dimensionScores}
          />
        </div>

      </article>
    </div>
  )
}

function getFallbackMixedNote(
  state: "lowDifferentiation" | "stableModeration" | "sharplyDifferentiated",
  closestTraditionsNote: string,
) {
  if (state === "lowDifferentiation") {
    return closestTraditionsNote
  }

  if (state === "sharplyDifferentiated") {
    return "The baseline is comparatively consistent across dimensions. The main test now is whether it still holds under issue-specific pressure."
  }

  return "The baseline is clear, but a nearby runner-up still matters in harder cases. That overlap is part of the result, not noise to be scrubbed out."
}
