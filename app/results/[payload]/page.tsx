import Link from "next/link"
import { ScaleBar } from "@/components/visual-primitives"
import { ResultCardHeroShare } from "@/components/results/result-card-hero-share"
import { getAtlasPatternHref, matchAtlasLiteFoundation } from "@/lib/atlas-lite"
import { verifiedCaseLibrary } from "@/lib/content/verified-case-library"
import { resolveFoundationPayload } from "@/lib/share"
import {
  getClosestTraditions,
  getKeyDrivers,
  getActiveTensions,
  neighborOverlapTexts,
  dimensionOneLiners,
  suggestedReadings,
  getStrongLenses,
  getIssueAreaTilts,
  getRunnerUpSeparation,
  getFlipAnalysis,
  getWhatWouldChangeThis,
  getWhyThisResult,
  getPressureTestQuestions,
} from "@/lib/result-helpers"
import { dimensionBand, dimensionBandLabels } from "@/lib/results/dimension-bands"
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
import { localizedAlternates, publicPath } from "@/i18n/paths"
import type { DimensionKey } from "@/lib/types"
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

    return buildResultMetadata(payload, title, description)
  }

  const familyLabel = resolved.result.familyLabel
  const resultLabel = `${familyLabel} · ${resolved.result.strategyModifier} · ${resolved.result.normativeModifier}`
  const title = `${familyLabel} result — IR Worldview Inventory`
  const description =
    `Shared IR Worldview result: ${resultLabel}. See the closest modeled tradition, modifiers, and dimension profile.`

  return buildResultMetadata(payload, title, description)
}

function buildResultMetadata(payload: string, title: string, description: string): Metadata {
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
    alternates: {
      canonical: publicPath("en", `/results/${payload}`),
      languages: localizedAlternates(`/results/${payload}`),
    },
  }
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

  const explanation = result.explanation
  const keyDrivers = getKeyDrivers(dimensionScores)
  const topDimensions = getTopDimensionScores(dimensionScores)
  const strongLenses = getStrongLenses(dimensionScores)
  const tensions = getActiveTensions(dimensionScores)
  const neighborText = neighborOverlapTexts[result.familyKey]?.[neighborKey] ?? ""
  const readings = suggestedReadings[result.familyKey]
  const neighborReadings = suggestedReadings[neighborKey]
  const issueAreaTilts = getIssueAreaTilts(result.familyKey, dimensionScores)
  const runnerUpSeparation = getRunnerUpSeparation(result.familyKey, neighborKey, dimensionScores)
  const flipAnalysis = getFlipAnalysis(result.familyKey, neighborKey, dimensionScores)
  const whatWouldChangeThis = getWhatWouldChangeThis(
    result.familyKey,
    neighborKey,
    dimensionScores,
  )
  const whyThisResult = getWhyThisResult(result.familyKey, neighborKey, dimensionScores)
  const foundationNarrative = buildFoundationNarrative({
    familyKey: result.familyKey,
    runnerUpKey: neighborKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    dimensionScores,
  })
  const summary = foundationNarrative.summary
  const lowDifferentiation = foundationNarrative.state === "lowDifferentiation"

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
  const atlasMatch = matchAtlasLiteFoundation({
    familyKey: result.familyKey,
    runnerUpKey: neighborKey,
    strategyModifier: result.strategyModifier,
    normativeModifier: result.normativeModifier,
    dimensionScores,
    foundationState: foundationNarrative.state,
  })
  const pressureCase = verifiedCaseLibrary.cases.find(
    (caseStudy) => caseStudy.caseId === foundationPayoff.caseTest.caseId,
  ) ?? null
  const pressureCaseHref = pressureCase
    ? `${getAtlasPatternHref(pressureCase.verifiedProfileReading.bestFitProfileId)}#case-${pressureCase.caseId}`
    : null
  const nextStepHref = withFoundationPayload(foundationPayoff.nextStep.href, payload)
  const resultCode = `${familyLabel} · ${result.strategyModifier} · ${result.normativeModifier}`
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

        <header
          className="result-section foundation-result-lede"
          aria-labelledby="foundation-result-heading"
        >
          <div className="foundation-result-lede__copy stack-lg">
            <div className="stack-sm">
              <p className="eyebrow">Foundation result</p>
              <h1 id="foundation-result-heading" className="result-hero-title">
                {atlasMatch.nearest.publicName}
              </h1>
              <p className="foundation-result-code">{resultCode}</p>
              <p className="result-lead">{atlasMatch.nearest.decisionRule}</p>
            </div>

            <div className="foundation-result-bands stack-sm">
              <h2 className="foundation-result-subhead">Strongest three dimensions</h2>
              {topDimensions.map(([dimension, score]) => (
                <div key={dimension} className="foundation-result-band">
                  <ScaleBar
                    label={dimensionLabels[dimension]}
                    value={score}
                    tone="baseline"
                  />
                  <span
                    className="foundation-result-band__tag"
                    data-band={dimensionBand(dimension, score)}
                  >
                    {dimensionBandLabels[dimensionBand(dimension, score)]}
                  </span>
                </div>
              ))}
            </div>

            <p className="foundation-result-change">{whatWouldChangeThis}</p>

            <div className="foundation-result-action print-hidden">
              <Link href={nextStepHref} className="cta-primary">
                {foundationPayoff.nextStep.label}
              </Link>
              <p>{foundationPayoff.nextStep.reason}</p>
            </div>
          </div>

          <div className="foundation-result-lede__map">
            <DimensionFieldMap
              dimensionScores={dimensionScores}
              lowDifferentiation={lowDifferentiation}
            />
          </div>
        </header>

        <section className="result-section result-appendix-section stack-lg">
          <p className="foundation-result-methods-line muted">
            Scores are positions on this inventory&apos;s 1–7 scale, and the family name is a nearby
            label for that pattern.{" "}
            <Link href="/method">How this is built, and where it stops →</Link>
          </p>

          <details className="profile-details">
            <summary>Full analysis</summary>
            <div className="stack-lg result-details-body">
              <section className="stack-lg" aria-labelledby="foundation-payoff-heading">
                <h2 id="foundation-payoff-heading">How your logic hangs together</h2>
                <div className="foundation-result-reading-grid">
                  <article className="foundation-result-reading stack-xs">
                    <p className="foundation-result-reading__label">Starts with</p>
                    <h3>Your first question</h3>
                    <p>{foundationPayoff.corePattern.noticeFirst}</p>
                  </article>
                  <article className="foundation-result-reading stack-xs">
                    <p className="foundation-result-reading__label">Leaves open</p>
                    <h3>{foundationPayoff.mainTension.title}</h3>
                    <p>{foundationPayoff.mainTension.body}</p>
                  </article>
                  <article className="foundation-result-reading stack-xs">
                    <p className="foundation-result-reading__label">Pulls the other way</p>
                    <h3>Why {neighborLabel} remains nearby</h3>
                    <p>{runnerUpSeparation || foundationPayoff.mainTension.rivalArgument}</p>
                  </article>
                </div>
              </section>

              <section className="stack-md" aria-labelledby="foundation-modifiers-heading">
                <h2 id="foundation-modifiers-heading">What the modifiers mean</h2>
                <dl className="modifier-glosses">
                  <div className="modifier-gloss">
                    <dt>{result.strategyModifier}</dt>
                    <dd>{strategyModifierGloss(result.strategyModifier)}</dd>
                  </div>
                  <div className="modifier-gloss">
                    <dt>{result.normativeModifier}</dt>
                    <dd>{normativeModifierGloss(result.normativeModifier)}</dd>
                  </div>
                </dl>
                <p>
                  <Link href={getAtlasPatternHref(atlasMatch.nearest.id)} className="result-strong">
                    Read the {atlasMatch.nearest.publicName} profile →
                  </Link>
                </p>
              </section>

              {pressureCase ? (
                <section className="stack-md" aria-labelledby="foundation-case-heading">
                  <h2 id="foundation-case-heading">Put the profile against a real case</h2>
                  <div className="foundation-case-test">
                    <div className="foundation-case-test__identity stack-xs">
                      <p>Reviewed historical case</p>
                      <h3>{pressureCase.title}</h3>
                      <span>{pressureCase.theme}</span>
                    </div>
                    <div className="foundation-case-test__question stack-sm">
                      <p>{foundationPayoff.caseTest.question}</p>
                      <p className="muted">{foundationPayoff.caseTest.reason}</p>
                      {pressureCaseHref ? (
                        <Link href={pressureCaseHref} className="result-strong">
                          Read the case, sources, and rival interpretation →
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </section>
              ) : null}

              <section className="stack-md" aria-labelledby="foundation-domain-heading">
                <h2 id="foundation-domain-heading">Where this profile may change by issue</h2>
                <div className="foundation-domain-grid">
                  <article className="foundation-domain-note stack-xs">
                    <h3>Security</h3>
                    <p>{atlasMatch.nearest.securitySummary}</p>
                  </article>
                  <article className="foundation-domain-note stack-xs">
                    <h3>Technology</h3>
                    <p>{atlasMatch.nearest.technologySummary}</p>
                  </article>
                  <article className="foundation-domain-note stack-xs">
                    <h3>{issueAreaTilts[0]?.issue ?? "What may change the reading"}</h3>
                    {issueAreaTilts[0] ? (
                      <>
                        <p className="foundation-domain-note__tilt">{issueAreaTilts[0].tilt}</p>
                        <p>{issueAreaTilts[0].note}</p>
                      </>
                    ) : (
                      <p>{foundationPayoff.corePattern.underweight}</p>
                    )}
                  </article>
                </div>
              </section>

              <section className="stack-md" aria-labelledby="foundation-signals-heading">
                <h2 id="foundation-signals-heading">What is doing the most work in the score</h2>
                <ol className="foundation-signal-list">
                  {keyDrivers.map((driver) => (
                    <li key={driver.dimension} className="foundation-signal-row">
                      <div className="stack-xs">
                        <p className="foundation-signal-row__dimension">
                          {dimensionLabels[driver.dimension]}
                        </p>
                        <h3>{driver.label}</h3>
                        <p>{driver.description}</p>
                      </div>
                      <span className="foundation-signal-row__score">
                        {dimensionScores[driver.dimension].toFixed(2)} / 7
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="stack-md" aria-labelledby="foundation-dimensions-heading">
                <h2 id="foundation-dimensions-heading">Dimension profile</h2>
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
              </section>

              <div className="result-prose stack-md">
                <p>{explanation}</p>
                {neighborText ? <p className="muted">{neighborText}</p> : null}
                <p className="muted">{mixedNote}</p>
                <ul className="content-list">
                  {whyThisResult.map((bullet, index) => <li key={index}>{bullet}</li>)}
                </ul>
                {flipAnalysis ? <p className="muted">{flipAnalysis}</p> : null}
              </div>

              <section className="stack-md" aria-labelledby="foundation-questions-heading">
                <h2 id="foundation-questions-heading">Questions that could change this reading</h2>
                <ol className="pressure-list result-prose">
                  {pressureQuestions.map((question, index) => (
                    <li key={index} className="pressure-q"><p>{question}</p></li>
                  ))}
                </ol>
              </section>

              <section className="stack-md" aria-labelledby="foundation-coverage-heading">
                <h2 id="foundation-coverage-heading">Closest fit among four scored families</h2>
                <p className="muted result-note">
                  Feminist, postcolonial or decolonial, green, and English School approaches are
                  under-modeled here. The inventory may place those instincts near one of its four
                  scored families without naming them directly.
                </p>
                <p>
                  <Link href="/method" className="result-strong">
                    Read methods and coverage limits →
                  </Link>
                </p>
              </section>

              <ReadingPathSection
                title="Read the result from another angle"
                intro="Compare this result with its nearest alternative, then examine the arguments and evidence behind both readings."
                paths={readingPaths}
              />

              <div className="stack-md">
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
                  provenance={{
                    locale: resolved.provenance.completionLocale,
                    localeCopyVersion: resolved.provenance.localeCopyVersion,
                  }}
                />
              </div>
            </div>
          </details>

          <div className="row gap-sm wrap print-hidden">
            <Link href="/perspectives" className="cta-secondary">Advise from another vantage point</Link>
            <Link href="/profile" className="cta-secondary">View Profile</Link>
            <ResultCardHeroShare
              shareUrl={`/results/${payload}`}
              title={`IR Worldview: ${familyLabel}`}
              text={`My IR worldview result: ${familyLabel} · ${result.strategyModifier} · ${result.normativeModifier}`}
            />
          </div>
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

  return "The baseline is clear, but a nearby runner-up still stays live in harder cases. That overlap is part of the result."
}

function withFoundationPayload(href: string, payload: string) {
  if (!href.startsWith("/modules/")) return href

  return `${href}?foundation=${encodeURIComponent(payload)}`
}

function getTopDimensionScores(dimensionScores: Record<DimensionKey, number>) {
  return (Object.entries(dimensionScores) as [DimensionKey, number][])
    .sort(([, a], [, b]) => Math.abs(b - 4) - Math.abs(a - 4))
    .slice(0, 3)
}
