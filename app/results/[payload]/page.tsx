import Link from "next/link"
import { AtlasFingerprint } from "@/components/atlas/atlas-fingerprint"
import { getAtlasPatternHref, matchAtlasLiteFoundation } from "@/lib/atlas-lite"
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
  const soWhatBlock = foundationNarrative.sections.find(
    (section) => section.title === "So what this usually means",
  )
  const deepFoundationSections = foundationNarrative.sections.filter(
    (section) => section.title !== "So what this usually means",
  )
  const atlasMatch = matchAtlasLiteFoundation({
    familyKey: result.familyKey,
    runnerUpKey: neighborKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    dimensionScores,
    foundationState: foundationNarrative.state,
  })

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
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
            <span className={`tradition-chip ${traditionClass}`}>{familyLabel}</span>
          </div>
          <p style={{ fontSize: "1rem", lineHeight: "1.75", maxWidth: "720px", marginBottom: "10px" }}>
            {soWhatBlock?.text ?? summary}
          </p>
        </div>

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

        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Main signals</h2>
            <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65" }}>
              The clearest pulls in the baseline before the lower-level comparison and method notes.
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
            <p style={{ fontWeight: 600 }}>How settled this baseline is</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>{mixedNote}</p>
          </div>
          <div className="row gap-sm wrap">
            <Link
              href={`/modules?foundation=${encodeURIComponent(payload)}`}
              className="cta-primary"
            >
              Add a focus-area module
            </Link>
            <Link href="/profile" className="cta-secondary">
              View profile
            </Link>
          </div>
        </div>

        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Atlas</h2>
            <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65" }}>
              A browse map of recurring profile patterns in the model. It is an editorial guide,
              not a live cluster or rarity map.
            </p>
          </div>
          <div className="atlas-pattern-card atlas-pattern-card--compact stack-sm">
            <div className="stack-xs">
              <p className="eyebrow">Nearest Atlas pattern</p>
              <p style={{ fontWeight: 700, fontFamily: "Georgia, serif", fontSize: "1.05rem" }}>
                {atlasMatch.nearest.name}
              </p>
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                {atlasMatch.nearest.cardSummary}
              </p>
            </div>
            <AtlasFingerprint fingerprint={atlasMatch.nearest.fingerprint} compact />
            <div className="stack-xs">
              <p style={{ fontWeight: 600 }}>What usually drives it</p>
              <div className="atlas-tag-list">
                {atlasMatch.nearest.cardDrivers.map((driver) => (
                  <span key={driver} className="atlas-tag">
                    {driver}
                  </span>
                ))}
              </div>
            </div>
            <p className="muted atlas-pressure-note">
              <strong>Under pressure:</strong> {atlasMatch.nearest.cardPressureNote}
            </p>
            <div className="stack-xs">
              <p style={{ fontWeight: 600 }}>Nearby patterns worth opening</p>
              <div className="atlas-inline-links">
                {atlasMatch.neighbors.map((pattern) => (
                  <Link key={pattern.id} href={getAtlasPatternHref(pattern.id)} style={{ color: "var(--accent)" }}>
                    {pattern.name}
                  </Link>
                ))}
                <Link href={getAtlasPatternHref(atlasMatch.nearest.id)} style={{ color: "var(--accent)" }}>
                  Read this pattern
                </Link>
                <Link href="/explore/atlas" style={{ color: "var(--accent)" }}>
                  Open Atlas
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Add a focus-area overlay</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              The Foundation is the baseline. The modules below stay separate and show how your
              instincts travel in a harder issue domain before feeding into your local Profile page.
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

        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Interpretation and comparison</h2>
            <p className="muted" style={{ fontSize: "0.85rem" }}>
              The shorthand and longer interpretation stay below the main payoff. Open only the
              parts you want to inspect more closely.
            </p>
          </div>
          <details className="profile-details">
            <summary>Closest traditions and why this shorthand fits</summary>
            <div className="stack-md" style={{ marginTop: "16px" }}>
              <p className="muted" style={{ fontSize: "0.875rem" }}>{closestTraditions.note}</p>
              <div className="driver-grid">
                <div className="driver-card stack-xs">
                  <p className="eyebrow">Strategic style</p>
                  <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>{result.strategyModifier}</p>
                  <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.55" }}>
                    {STRATEGY_STYLE_NOTES[result.strategyModifier]}
                  </p>
                </div>
                <div className="driver-card stack-xs">
                  <p className="eyebrow">Normative style</p>
                  <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>{result.normativeModifier}</p>
                  <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.55" }}>
                    {NORMATIVE_STYLE_NOTES[result.normativeModifier]}
                  </p>
                </div>
              </div>
              {strongLenses.length > 0 ? (
                <div className="stack-sm">
                  <p className="eyebrow">Other lenses that stay active</p>
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
              ) : null}
              <div className="neighbor-columns">
                <div className="stack-xs">
                  <p className="eyebrow">Closest shorthand</p>
                  <p style={{ fontWeight: 700, fontFamily: "Georgia, serif", fontSize: "1.05rem" }}>
                    {familyLabel}
                  </p>
                </div>
                <div className="stack-xs">
                  <p className="eyebrow">{closestTraditions.showBoth ? "Also very close" : "Nearest overlap"}</p>
                  <p style={{ fontWeight: 700, fontFamily: "Georgia, serif", fontSize: "1.05rem" }}>
                    {neighborLabel}
                  </p>
                </div>
              </div>
              <div className="result-prose stack-md">
                <p style={{ lineHeight: "1.65" }}>{explanation}</p>
                {neighborText ? (
                  <p className="muted" style={{ lineHeight: "1.65" }}>{neighborText}</p>
                ) : null}
                {foundationNarrative.state !== "lowDifferentiation" && runnerUpSeparation ? (
                  <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                    {runnerUpSeparation}
                  </p>
                ) : null}
                {foundationNarrative.state !== "lowDifferentiation" && flipAnalysis ? (
                  <div className="flip-note">
                    <p style={{ fontSize: "0.875rem", lineHeight: "1.65" }}>{flipAnalysis}</p>
                  </div>
                ) : null}
                {subtraditionAffinity ? (
                  <div className="stack-xs">
                    <p style={{ fontWeight: 600, fontFamily: "Georgia, serif", fontSize: "0.95rem" }}>
                      {subtraditionAffinity.name}
                    </p>
                    <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.875rem" }}>
                      {subtraditionAffinity.note}
                    </p>
                  </div>
                ) : null}
                <div className="stack-xs">
                  <p className="muted" style={{ fontSize: "0.85rem" }}>
                    {foundationNarrative.state === "lowDifferentiation"
                      ? "What still pulls the profile toward the nearest fit:"
                      : "Why this shorthand won over the runner-up:"}
                  </p>
                  <ul className="content-list" style={{ margin: 0 }}>
                    {whyThisResult.map((bullet, index) => <li key={index}>{bullet}</li>)}
                  </ul>
                </div>
              </div>
              <div>
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
              <p style={{ fontSize: "0.875rem" }}>
                <Link href={`/explore/${familySlug(neighborKey)}`} style={{ color: "var(--accent)" }}>
                  Learn more about {neighborLabel} →
                </Link>
              </p>
            </div>
          </details>
          <details className="profile-details">
            <summary>Longer interpretation, issue bridges, and pressure-test questions</summary>
            <div className="result-prose stack-md" style={{ marginTop: "16px" }}>
              {deepFoundationSections.map((section) => (
                <div key={section.title} className="stack-xs">
                  <p className="eyebrow">{section.title}</p>
                  <p style={{ lineHeight: "1.7" }}>{section.text}</p>
                </div>
              ))}
              <div className="stack-xs">
                <p className="eyebrow">Pressure-test your worldview</p>
                <ol className="pressure-list result-prose">
                  {pressureQuestions.map((question, index) => (
                    <li key={index} className="pressure-q">
                      <p>{question}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="stack-xs">
                <p className="eyebrow">How this profile may travel across issues</p>
                <div>
                  {issueStances.map((stance) => (
                    <div key={stance.issue} className="issue-module">
                      <p className="issue-module-title">{stance.issue}</p>
                      <p className="issue-module-text">{stance.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              {issueAreaTilts.length > 0 ? (
                <div className="stack-xs">
                  <p className="muted" style={{ fontSize: "0.8rem", fontStyle: "italic" }}>
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
              ) : null}
            </div>
          </details>
        </div>

        <div className="result-section stack-md">
          <div className="stack-xs">
            <h2>Reading and terminology</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Reading lists and definitions are kept below the main payoff.
            </p>
          </div>
          <details className="profile-details">
            <summary>Suggested reading</summary>
            <div style={{ marginTop: "16px" }}>
              {readings.map((item) => (
                <div key={item.title} className="reading-bib">
                  <p style={{ fontWeight: 600 }}>{item.title}</p>
                  <p className="muted" style={{ fontSize: "0.875rem", marginTop: "2px" }}>{item.author}</p>
                  <p style={{ fontSize: "0.875rem", lineHeight: "1.55", marginTop: "6px" }}>{item.note}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "16px" }}>
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
          </details>
          <details className="profile-details">
            <summary>Glossary</summary>
            <div style={{ marginTop: "16px" }}>
              {glossaryTerms.map((term) => (
                <div key={term.term} className="definition-item">
                  <p style={{ fontWeight: 600, marginBottom: "4px" }}>{term.term}</p>
                  <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                    {term.definition}
                  </p>
                </div>
              ))}
            </div>
          </details>
        </div>

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

  return "The baseline is clear, but a nearby runner-up still stays live in harder cases. That overlap is part of the result, not noise to be scrubbed out."
}
