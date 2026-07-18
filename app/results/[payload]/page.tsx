import Link from "next/link"
import { AtlasFingerprint } from "@/components/atlas/atlas-fingerprint"
import { AtlasPatternFamily } from "@/components/atlas/atlas-pattern-family"
import { ScaleBar } from "@/components/visual-primitives"
import { ResultCardHeroShare } from "@/components/results/result-card-hero-share"
import { getAtlasPatternHref, matchAtlasLiteFoundation } from "@/lib/atlas-lite"
import { resolveFoundationPayload } from "@/lib/share"
import {
  buildProfileTitle,
  familyLabelFromKey,
  getClosestTraditions,
  getKeyDrivers,
  getActiveTensions,
  getFoundationSurprisingFinding,
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
import { buildFoundationPayoff } from "@/lib/results/foundation-payoff"
import { normativeModifierGloss, strategyModifierGloss } from "@/lib/copy/glosses"
import { familySlug } from "@/lib/worldview-config"
import { DimensionFieldMap } from "@/components/results/dimension-field-map"
import { ShareActions } from "@/components/results/share-actions"
import { HistoryCompare } from "@/components/results/history-compare"
import { FoundationProfileSync } from "@/components/profile/foundation-profile-sync"
import { ReadingPathSection } from "@/components/results/reading-path-section"
import { ResearchStatusNotice } from "@/components/research/research-status-notice"
import { modules } from "@/lib/modules/framework"
import type { DimensionKey, FamilyKey, NormativeModifier, StrategyModifier } from "@/lib/types"
import type { Metadata } from "next"

export async function generateMetadata(
  { params }: { params: Promise<{ payload: string }> },
): Promise<Metadata> {
  const { payload } = await params
  const resolved = resolveFoundationPayload(payload)
  if (!resolved) {
    const title = "Shared IR result — IR Worldview Inventory"
    const description =
      "Open a shared IR Worldview Inventory result, or take the Foundation questionnaire to generate your own profile."

    return buildResultMetadata(title, description)
  }

  const familyLabel = resolved.result.familyLabel
  const resultLabel = `${familyLabel} · ${resolved.result.strategyModifier} · ${resolved.result.normativeModifier}`
  const title = `${familyLabel} result — IR Worldview Inventory`
  const description =
    `Shared IR Worldview result: ${resultLabel}. See the closest modeled tradition, modifiers, and dimension profile.`

  return buildResultMetadata(title, description)
}

function buildResultMetadata(title: string, description: string): Metadata {
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

const TRADITION_COLOR: Record<FamilyKey, string> = {
  realist: "var(--t-realist)",
  institutionalist: "var(--t-institutionalist)",
  constructivist: "var(--t-constructivist)",
  criticalPoliticalEconomy: "var(--t-cpe)",
}

const FAMILY_ACCENT: Record<FamilyKey, "realist" | "institutionalist" | "constructivist" | "cpe"> = {
  realist: "realist",
  institutionalist: "institutionalist",
  constructivist: "constructivist",
  criticalPoliticalEconomy: "cpe",
}

export default async function ResultPage(
  { params }: { params: Promise<{ payload: string }> },
) {
  const { payload } = await params
  const resolved = resolveFoundationPayload(payload)

  if (!resolved) {
    return (
      <div className="container stack-lg result-invalid">
        <div className="panel stack-md">
          <p className="eyebrow">Invalid result</p>
          <h1>This link could not be decoded.</h1>
          <p className="muted history-line">
            The result URL may be incomplete, corrupted, or from an older version of the inventory.
          </p>
          <div className="row gap-sm wrap">
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
  const traditionColor = TRADITION_COLOR[result.familyKey]
  const accentVariant = FAMILY_ACCENT[result.familyKey]

  const profileTitle = buildProfileTitle(dimensionScores)
  const explanation = result.explanation
  const keyDrivers = getKeyDrivers(dimensionScores)
  const topDimensions = getTopDimensionScores(dimensionScores)
  const strongLenses = getStrongLenses(dimensionScores)
  const tensions = getActiveTensions(dimensionScores)
  const surprisingFinding = getFoundationSurprisingFinding(
    result.familyKey,
    neighborKey,
    dimensionScores,
  )
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
  const lowDifferentiation = foundationNarrative.state === "lowDifferentiation"

  const issueStances = getHowYouReadTheWorld(
    result.familyKey,
    result.strategyModifier,
    result.normativeModifier,
  )
  const foundationPayoff = buildFoundationPayoff({
    dimensionScores,
    familyKey: result.familyKey,
    familyLabel,
    runnerUpKey: neighborKey,
    runnerUpLabel: neighborLabel,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
  })
  const pressureQuestions = getPressureTestQuestions(result.familyKey)
  const mixedNote = tensions[0]?.text ?? getFallbackMixedNote(foundationNarrative.state, closestTraditions.note)
  const deepFoundationSections = foundationNarrative.sections
  const atlasMatch = matchAtlasLiteFoundation({
    familyKey: result.familyKey,
    runnerUpKey: neighborKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    dimensionScores,
    foundationState: foundationNarrative.state,
  })
  const readingPaths = [
    {
      key: "start-here",
      heading: "Read the closest tradition",
      subheading:
        "Read the modeled tradition page first, then begin with one anchor text before you widen the frame.",
      entries: readings.slice(0, 1).map((item) => ({
        id: `${result.familyKey}-${item.title}`,
        title: item.title,
        author: item.author,
        note: item.note,
      })),
      links: [
        {
          href: `/explore/${familySlug(result.familyKey)}`,
          label: `Read ${familyLabel}`,
          text: "See the tradition guide, issue readings, and critique shelf in one place.",
        },
      ],
    },
    {
      key: "go-deeper",
      heading: "Go deeper",
      subheading:
        "Stay with the nearest fit long enough to see its internal variation, methods, and adjacent debates.",
      entries: readings.slice(1).map((item) => ({
        id: `${result.familyKey}-${item.title}`,
        title: item.title,
        author: item.author,
        note: item.note,
      })),
      links: [
        {
          href: "/references",
          label: "Browse references",
          text: "Use the wider bibliography when you want more than the result-page shelf.",
        },
        {
          href: "/method",
          label: "Read methods",
          text: "See the model limits, terminology choices, and why the labels stay interpretive.",
        },
      ],
    },
    {
      key: "challenge-your-view",
      heading: "Challenge your view",
      subheading:
        `Read the nearest runner-up and test the profile in harder issue settings rather than treating the top label as closed.`,
      entries: neighborReadings.slice(0, 2).map((item) => ({
        id: `${neighborKey}-${item.title}`,
        title: item.title,
        author: item.author,
        note: item.note,
      })),
      links: [
        {
          href: `/explore/${familySlug(neighborKey)}`,
          label: `Read ${neighborLabel}`,
          text: "Read the closest alternative tradition and compare its issue logic directly.",
        },
        {
          href: `/modules?foundation=${encodeURIComponent(payload)}`,
          label: "Add a focus-area overlay",
          text: "Pressure-test the baseline in Security or Technology before treating it as settled.",
        },
      ],
    },
  ]

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

        <section className="result-section stack-lg" aria-labelledby="foundation-result-heading">
          <div className="stack-md">
            <p className="eyebrow">Foundation result</p>
            <h1 id="foundation-result-heading" className="result-hero-title">
              {foundationNarrative.state === "lowDifferentiation"
                ? "Your answers keep several ways of reading world politics in play."
                : foundationPayoff.corePattern.noticeFirst}
            </h1>
            <p className="muted result-lead">
              {foundationNarrative.state === "lowDifferentiation"
                ? "Your result identifies the tradeoffs that remain unsettled and the scenarios most likely to separate them."
                : foundationPayoff.mainTension.body}
            </p>
            <div className="row gap-sm wrap" aria-label="Technical result labels">
              <span className="atlas-tag">{familyLabel}</span>
              <span className="atlas-tag">{result.strategyModifier}</span>
              <span className="atlas-tag">{result.normativeModifier}</span>
              <span className="atlas-tag">Nearest overlap: {neighborLabel}</span>
            </div>
            <dl className="modifier-glosses" aria-label="What the modifier labels mean">
              <div className="modifier-gloss">
                <dt>{result.strategyModifier}</dt>
                <dd>{strategyModifierGloss(result.strategyModifier)}</dd>
              </div>
              <div className="modifier-gloss">
                <dt>{result.normativeModifier}</dt>
                <dd>{normativeModifierGloss(result.normativeModifier)}</dd>
              </div>
            </dl>
          </div>

          <div className="result-hero-grid">
            <div className="panel result-panel stack-md">
              <div className="stack-xs">
                <p className="eyebrow">Dimension map</p>
                <h2>Where your answers place you</h2>
                <p className="muted result-note">
                  This map projects your seven dimension scores onto two reading axes and places
                  you among the four modeled traditions. The dashed ring shows how loosely that
                  placement is fixed.
                </p>
              </div>
              <DimensionFieldMap
                dimensionScores={dimensionScores}
                lowDifferentiation={lowDifferentiation}
              />
            </div>

            <aside className="panel result-panel stack-md" aria-label="Trust and coverage">
              <div className="stack-xs">
                <p className="eyebrow">Where this may be wrong</p>
                <p className="result-emphasis result-emphasis--lg">
                  Closest fit among the four scored families.
                </p>
                <p className="muted result-note">
                  If your strongest instincts come from feminist, postcolonial or decolonial,
                  green, or English School IR, this inventory will place you near one of its four
                  modeled families rather than name that orientation directly.
                </p>
                <p className="muted result-note">
                  {foundationNarrative.state === "lowDifferentiation"
                    ? "Your answers leave several centers plausible in this model, so read the family label lightly."
                    : "Use the label as shorthand for the dimension pattern, then test it against concrete issue areas."}
                </p>
                <Link href="/method" className="result-strong">
                  Read methods and coverage limits →
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="result-section stack-md" aria-labelledby="foundation-payoff-heading">
          <div className="stack-xs">
            <p className="eyebrow">Payoff</p>
            <h2 id="foundation-payoff-heading">What to do with this result</h2>
          </div>
          <div className="driver-grid">
            <article className="driver-card stack-xs">
              <p className="eyebrow">What would change this</p>
              <p className="result-emphasis">{foundationPayoff.mainTension.title}</p>
              <p className="muted result-note-snug">
                {foundationPayoff.mainTension.rivalArgument}
              </p>
              <p className="muted result-note-snug">
                {foundationNarrative.state === "lowDifferentiation"
                  ? "A focused module may reveal which tradeoff actually matters once the issue is specific."
                  : foundationPayoff.corePattern.underweight}
              </p>
            </article>

            <article className="driver-card stack-xs">
              <p className="eyebrow">Nearest worldview profile</p>
              <p className="result-emphasis">{atlasMatch.nearest.publicName}</p>
              <AtlasPatternFamily pattern={atlasMatch.nearest} compact />
              <p className="muted result-note-snug">
                {atlasMatch.nearest.cardSummary}
              </p>
              <p>
                <Link href={getAtlasPatternHref(atlasMatch.nearest.id)} className="result-strong">
                  Read {atlasMatch.nearest.publicName} →
                </Link>
              </p>
            </article>

            <article className="driver-card stack-xs">
              <p className="eyebrow">Try another vantage point</p>
              <p className="result-emphasis">Advise from a defined strategic seat</p>
              <p className="muted result-note-snug">
                See how your answers move when you advise from a defined strategic position. The
                run plots beside this baseline and leaves it unchanged.
              </p>
              <p>
                <Link href="/perspectives" className="result-strong">
                  Open the briefs →
                </Link>
              </p>
            </article>
          </div>

          <div className="row gap-sm wrap">
            <Link href={`/modules?foundation=${encodeURIComponent(payload)}`} className="cta-primary">
              Add a focus-area module
            </Link>
            <Link href="/explore/atlas" className="cta-secondary">Open Worldview Map</Link>
            <Link href="/profile" className="cta-secondary">View Profile</Link>
            <ResultCardHeroShare
              shareUrl={`/results/${payload}`}
              title={`IR Worldview: ${familyLabel}`}
              text={`My IR worldview result: ${familyLabel} · ${result.strategyModifier} · ${result.normativeModifier}`}
            />
          </div>
        </section>

        <section className="result-section stack-md">
          <details className="profile-details">
            <summary>Read full analysis</summary>
            <div className="stack-lg result-details-body">
              <div className="stack-md">
                <h2>Dimension profile</h2>
                <div>
                  {(Object.entries(dimensionScores) as [DimensionKey, number][]).map(([dim, value]) => (
                    <div key={dim} className="dim-row">
                      <ScaleBar label={dimensionLabels[dim]} value={value} tone="baseline" />
                      <p className="muted result-note-xs">
                        {dimensionOneLiners[dim](value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <ResultSignaturePanel
                familyLabel={familyLabel}
                strategyModifier={result.strategyModifier}
                normativeModifier={result.normativeModifier}
                neighborLabel={neighborLabel}
                topDimensions={topDimensions}
              />

              <div className="result-prose stack-md">
                <p>{explanation}</p>
                {neighborText ? <p className="muted">{neighborText}</p> : null}
                <p className="muted">{mixedNote}</p>
                <ul className="content-list">
                  {whyThisResult.map((bullet, index) => <li key={index}>{bullet}</li>)}
                </ul>
              </div>

              <div className="stack-md">
                <h2>Questions that could change this reading</h2>
                <ol className="pressure-list result-prose">
                  {pressureQuestions.map((question, index) => (
                    <li key={index} className="pressure-q"><p>{question}</p></li>
                  ))}
                </ol>
              </div>
            </div>
          </details>
        </section>

        <section className="result-section stack-md">
          <details className="profile-details">
            <summary>More resources, glossary, and saved-result tools</summary>
            <div className="stack-lg result-details-body">
              <ReadingPathSection
                title="Read the result from another angle"
                intro="Compare this result with its nearest alternative, then examine the arguments and evidence behind both readings."
                paths={readingPaths}
              />

              <div className="stack-md">
                <div className="stack-xs">
                  <h2>Glossary</h2>
                  <p className="muted result-note-sm">
                    Short definitions for the recurring terms on this page.
                  </p>
                </div>
                <div>
                  {glossaryTerms.map((term) => (
                    <div key={term.term} className="definition-item">
                      <p className="definition-term">{term.term}</p>
                      <p className="muted result-note">
                        {term.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="stack-md">
                <div className="callout stack-xs">
                  <p className="result-strong">About this classification</p>
                  <p className="muted result-note-sm">
                    Structured thought exercise with interpretive labels rather than a validated scientific diagnostic. Tradition labels
                    are shorthand for a multidimensional profile, and case-based readings stay separate
                    from the foundation result. Scores are comparative positions within this model rather than population
                    percentiles.{" "}
                    <Link href="/method">
                      Full methods note →
                    </Link>
                  </p>
                </div>
                <p>
                  <Link href="/feedback">
                    Report a factual or interface problem →
                  </Link>
                </p>
                <ResearchStatusNotice instrumentLabel="Foundation" />
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
            </div>
          </details>
        </section>

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

function getTopDimensionScores(dimensionScores: Record<DimensionKey, number>) {
  return (Object.entries(dimensionScores) as [DimensionKey, number][])
    .sort(([, a], [, b]) => Math.abs(b - 4) - Math.abs(a - 4))
    .slice(0, 3)
}

function ResultSignaturePanel({
  familyLabel,
  strategyModifier,
  normativeModifier,
  neighborLabel,
  topDimensions,
}: {
  familyLabel: string
  strategyModifier: StrategyModifier
  normativeModifier: NormativeModifier
  neighborLabel: string
  topDimensions: [DimensionKey, number][]
}) {
  return (
    <aside className="result-signature-panel stack-sm" aria-label="Result signature">
      <div className="stack-xs">
        <p className="eyebrow">Result signature</p>
        <p className="muted result-note">
          A compact read of the strongest dimension pulls and modifiers shaping this Foundation result.
        </p>
      </div>

      <div className="result-signature-scales">
        {topDimensions.map(([dimension, score]) => (
          <ScaleBar
            key={dimension}
            label={dimensionLabels[dimension]}
            value={score}
            tone="baseline"
          />
        ))}
      </div>

      <dl className="result-signature-meta">
        <div>
          <dt>Family</dt>
          <dd>{familyLabel}</dd>
        </div>
        <div>
          <dt>Strategy</dt>
          <dd>{strategyModifier}</dd>
          <dd className="result-signature-gloss">{strategyModifierGloss(strategyModifier)}</dd>
        </div>
        <div>
          <dt>Norms</dt>
          <dd>{normativeModifier}</dd>
          <dd className="result-signature-gloss">{normativeModifierGloss(normativeModifier)}</dd>
        </div>
        <div>
          <dt>Nearest overlap</dt>
          <dd>{neighborLabel}</dd>
        </div>
      </dl>
    </aside>
  )
}
