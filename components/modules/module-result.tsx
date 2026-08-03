import Link from "next/link"
import { ScaleBar } from "@/components/visual-primitives"
import { ResearchStatusNotice } from "@/components/research/research-status-notice"
import {
  buildModuleAnalytics,
  buildModuleResult,
  getModuleDefinition,
  getModuleQuestions,
  getSelectedModuleOptions,
} from "@/lib/modules/framework"
import { ModuleProfileSync } from "@/components/profile/module-profile-sync"
import type {
  ModuleAnswers,
  ModuleDefinition,
  ModuleOption,
  ModuleQuestion,
  ModuleSlug,
} from "@/lib/modules/types"
import type { ChoiceCardType, DimensionScores, QuizMode } from "@/lib/types"

export function ModuleResultView({
  slug,
  payload,
  mode,
  answers,
  foundation,
  foundationPayload,
}: {
  slug: ModuleSlug
  payload: string
  mode: QuizMode
  answers: ModuleAnswers
  foundation?: DimensionScores
  foundationPayload?: string
}) {
  const moduleDefinition = getModuleDefinition(slug)
  if (!moduleDefinition) return null

  const result = buildModuleResult(moduleDefinition, mode, answers, foundation)
  const analytics = buildModuleAnalytics(moduleDefinition, mode, answers)
  const selected = getSelectedModuleOptions(moduleDefinition, mode, answers)
  const questionCount = getModuleQuestions(moduleDefinition, mode).length
  const laneLabelMap = Object.fromEntries(
    moduleDefinition.lanes.map((lane) => [lane.key, lane.label]),
  ) as Record<string, string>
  const hasActorLens = Boolean(result.cardTypeScores.actorLens)
  const resultPath = `/modules/${slug}/results/${payload}${foundationPayload ? `?foundation=${encodeURIComponent(foundationPayload)}` : ""}`
  const decisiveCalls = buildDecisiveCalls({
    moduleDefinition,
    selected,
    laneLabelMap,
  })
  const foundationRelation = buildFoundationRelation({
    moduleTitle: moduleDefinition.shortTitle,
    comparison: result.comparison,
    challenge: result.challenge,
    cardTypeSummary: result.cardTypeRead?.summary,
    laneSummaries: result.laneSummaries,
  })
  const identityCode = [
    moduleDefinition.shorthand,
    mode === "standard" ? "Standard" : "Advanced",
    `${questionCount} questions`,
  ]

  return (
    <div className="stack-lg">
      <article className="result-article">
        <ModuleProfileSync
          snapshot={{
            slug,
            title: moduleDefinition.shortTitle,
            subtitle: moduleDefinition.subtitle,
            shorthand: moduleDefinition.shorthand,
            mode,
            headline: result.headline,
            summary: result.summary,
            resultPath,
            scores: result.scores,
            instincts: result.instincts,
            comparison: result.comparison,
            challenge: result.challenge,
            measures: moduleDefinition.measures,
            doesNotClaim: moduleDefinition.doesNotClaim,
            evidence: selected.map(({ question, primary, secondary }) => ({
              question: question.title,
              primary: primary?.title ?? "No selection",
              ...(secondary?.title ? { secondary: secondary.title } : {}),
            })),
            laneSummaries: result.laneSummaries,
            ...(result.cardTypeRead ? { cardTypeRead: result.cardTypeRead } : {}),
            ...(Object.keys(result.cardTypeScores).length > 0
              ? { cardTypeScores: result.cardTypeScores }
              : {}),
            overlayDeltas: result.overlayDeltas,
            payload,
            ...(foundationPayload ? { foundationPayload } : {}),
            laneScores: analytics.laneScores,
            instrumentVersion: 2,
          }}
        />

        {/* ── 1. Verdict ── */}
        <header className="result-verdict">
          <p className="eyebrow">{moduleDefinition.shortTitle} result</p>
          <h1 className="result-verdict__name">{result.headline}</h1>
          <p className="result-verdict__code">
            {identityCode.map((part, index) => (
              <span key={part}>
                {index > 0 ? <span aria-hidden="true"> · </span> : null}
                <span>{part}</span>
              </span>
            ))}
          </p>
          <p className="result-verdict__gloss">{result.summary}</p>
        </header>

        {/* ── 2. Lane meters ── */}
        <section className="result-section result-figure">
          <h2>Where the three lanes sit</h2>
          <div className="profile-module-grid">
            {result.laneSummaries.map((lane) => (
              <div key={lane.key} className="explore-card stack-sm">
                <div className="stack-xs">
                  <p className="eyebrow">{lane.label}</p>
                  <p className="module-lane-copy">{lane.summary}</p>
                </div>
                <ScaleBar
                  value={lane.score}
                  valueLabel={lane.score.toFixed(1)}
                  lowLabel={lane.lowLabel}
                  highLabel={lane.highLabel}
                  tone={slug}
                  className="module-lane-meter"
                />
                {lane.delta ? (
                  <p className="muted module-lane-delta">
                    <strong>Relative to Foundation:</strong> {lane.delta}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Axis profile ── */}
        <section className="result-section result-figure">
          <h2>{moduleDefinition.shortTitle} axes</h2>
          <div>
            {moduleDefinition.axes.map((axis) => (
              <div key={axis.key} className="dim-row">
                <ScaleBar
                  label={axis.label}
                  value={result.scores[axis.key]}
                  valueLabel={result.scores[axis.key].toFixed(1)}
                  lowLabel={axis.lowLabel}
                  highLabel={axis.highLabel}
                  tone={slug}
                />
              </div>
            ))}
          </div>
          <p className="result-figure__note">
            These are directional scores inside this module, not population percentiles. The
            labels name the two directions rather than empirical endpoints
            {hasActorLens ? ", and the main lane read comes from Explanation and Decision cards rather than Actor lens cards." : "."}{" "}
            <Link href="/method">Methods sets out the limits →</Link>
          </p>
        </section>

        {/* ── 4. Relation to the Foundation baseline ── */}
        <section className="result-section result-figure">
          <h2>Against your Foundation baseline</h2>
          {foundation ? (
            <div className="module-relation-grid">
              <article className="module-relation-card module-relation-card--reinforce stack-xs">
                <p className="module-relation-kicker">Reinforces</p>
                <ul className="content-list module-relation-list">
                  {foundationRelation.reinforces.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="module-relation-card module-relation-card--complicate stack-xs">
                <p className="module-relation-kicker">Complicates</p>
                <ul className="content-list module-relation-list">
                  {foundationRelation.complicates.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="module-relation-card module-relation-card--pull stack-xs">
                <p className="module-relation-kicker">Pulls away</p>
                <ul className="content-list module-relation-list">
                  {foundationRelation.pullsAway.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          ) : (
            <div className="callout stack-xs">
              <p className="result-strong">No linked Foundation baseline</p>
              <p className="muted module-lane-copy">
                Open this module from a saved Foundation result to get the comparison.
              </p>
            </div>
          )}
        </section>

        {/* ── 5. Decisive calls ── */}
        <section className="result-section result-figure">
          <h2>The calls that decided it</h2>
          <div className="module-decisive-list">
            {decisiveCalls.map((call, index) => (
              <article key={call.id} className="module-decisive-call">
                <div className="module-decisive-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{call.laneLabel}</span>
                  <span>{call.cardType}</span>
                </div>
                <div className="stack-xs">
                  <h3>{call.caseTitle}</h3>
                  <p className="module-decisive-framing">{call.framing}</p>
                  <p className="muted module-lane-delta">{call.implication}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 6. What would change this ── */}
        <section className="result-section result-next">
          <h2>What would change this</h2>
          <p className="result-next__question">{result.challenge}</p>
          <div className="row gap-sm wrap">
            <Link
              href={foundationPayload ? `/modules?foundation=${encodeURIComponent(foundationPayload)}` : "/modules"}
              className="cta-primary"
            >
              Try another focus-area module
            </Link>
            <Link href={`/modules/${slug}${foundationPayload ? `?foundation=${encodeURIComponent(foundationPayload)}` : ""}`} className="cta-secondary">
              Retake this module
            </Link>
            {foundationPayload ? (
              <Link href={`/results/${foundationPayload}`} className="cta-secondary">
                Back to Foundation result
              </Link>
            ) : null}
            <Link href="/profile" className="cta-secondary">
              View your Profile
            </Link>
          </div>
        </section>

        <section className="result-section result-appendix-section stack-md">
          <details className="profile-details">
            <summary>Full analysis</summary>
            <div className="stack-lg result-details-body">
              {result.cardTypeRead ? (
                <div className="stack-md">
                  <h2>{result.cardTypeRead.headline}</h2>
                  <p className="result-prose module-prose">{result.cardTypeRead.summary}</p>
                </div>
              ) : null}

              <div className="stack-md">
                <h2>What you keep coming back to</h2>
                <ul className="content-list result-prose">
                  {result.instincts.map((instinct) => (
                    <li key={instinct}>{instinct}</li>
                  ))}
                </ul>
              </div>

              <div className="stack-md">
                <h2>Scope</h2>
                <div className="driver-grid">
                  <div className="driver-card stack-xs">
                    <p className="eyebrow">Form</p>
                    <p className="driver-card__value">
                      {mode === "standard" ? "Standard" : "Advanced"}
                    </p>
                    <p className="muted module-lane-delta">
                      {questionCount} questions · {moduleDefinition.timeEstimate[mode]}
                    </p>
                  </div>
                  <div className="driver-card stack-xs">
                    <p className="eyebrow">What it measured</p>
                    <p className="muted module-lane-delta">
                      {moduleDefinition.measures.join("; ")}.
                    </p>
                  </div>
                  <div className="driver-card stack-xs">
                    <p className="eyebrow">What it did not claim</p>
                    <p className="muted module-lane-delta">
                      {moduleDefinition.doesNotClaim.join("; ")}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="stack-md">
                <h2>Evidence log</h2>
                <div className="driver-grid">
                  {selected.map(({ question, primary, secondary }) => (
                    <div key={question.id} className="driver-card stack-sm">
                      <div className="stack-xs">
                        <p className="eyebrow">{question.title}</p>
                        <p className="muted module-evidence-meta">
                          {laneLabelMap[question.lane] ?? question.lane} · {formatCardType(question.cardType)}
                        </p>
                        <p className="module-lane-copy">{question.prompt}</p>
                      </div>
                      <div className="stack-xs">
                        <span className="option-card-meta">Most persuasive</span>
                        <p className="driver-card__value">
                          {primary?.title ?? "No selection"}
                        </p>
                        <p className="muted module-lane-delta">
                          {primary?.label ?? "This question was not answered."}
                        </p>
                      </div>
                      {secondary ? (
                        <div className="stack-xs">
                          <span className="option-card-meta option-card-meta--secondary">Second-most persuasive</span>
                          <p className="driver-card__value">{secondary.title}</p>
                          <p className="muted module-lane-delta">{secondary.label}</p>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <ResearchStatusNotice instrumentLabel={`${moduleDefinition.shortTitle} module`} />
            </div>
          </details>
        </section>
      </article>
    </div>
  )
}

type SelectedModuleCall = {
  question: ModuleQuestion
  primary: ModuleOption | null
  secondary: ModuleOption | null
}

type DecisiveCall = {
  id: string
  caseTitle: string
  laneLabel: string
  cardType: string
  framing: string
  implication: string
}

function buildDecisiveCalls({
  moduleDefinition,
  selected,
  laneLabelMap,
}: {
  moduleDefinition: ModuleDefinition
  selected: SelectedModuleCall[]
  laneLabelMap: Record<string, string>
}): DecisiveCall[] {
  const axisMap = Object.fromEntries(
    moduleDefinition.axes.map((axis) => [axis.key, axis]),
  ) as Record<string, ModuleDefinition["axes"][number]>

  return selected
    .flatMap((selection) => {
      if (!selection.primary) return []

      const signalStrength = Object.entries(selection.primary.signals)
        .map(([axisKey, value]) => ({
          axisKey,
          value,
          strength: Math.abs(value - 4),
        }))
        .sort((left, right) => right.strength - left.strength)

      const strongest = signalStrength.find((signal) => axisMap[signal.axisKey])
      if (!strongest) return []

      return [
        {
          selection,
          primary: selection.primary,
          strongest,
          rank:
            strongest.strength +
            (signalStrength[1]?.strength ?? 0) * 0.35 +
            (selection.question.cardType === "actorLens" ? 0.15 : 0),
        },
      ]
    })
    .sort((left, right) => right.rank - left.rank)
    .slice(0, 6)
    .map(({ selection, primary, strongest }) => {
      const axis = axisMap[strongest.axisKey]
      const leansHigh = strongest.value >= 4
      const direction = leansHigh ? axis.highLabel : axis.lowLabel
      const contrast = leansHigh ? axis.lowLabel : axis.highLabel

      return {
        id: selection.question.id,
        caseTitle: selection.question.title,
        laneLabel: laneLabelMap[selection.question.lane] ?? selection.question.lane,
        cardType: formatCardType(selection.question.cardType),
        framing: primary.title,
        implication: buildDecisiveImplication({
          cardType: selection.question.cardType,
          axisLabel: axis.label,
          direction,
          contrast,
        }),
      }
    })
}

function buildDecisiveImplication({
  cardType,
  axisLabel,
  direction,
  contrast,
}: {
  cardType: ChoiceCardType
  axisLabel: string
  direction: string
  contrast: string
}) {
  const axis = axisLabel.toLowerCase()
  const toward = direction.toLowerCase()
  const away = contrast.toLowerCase()

  if (cardType === "actorLens") {
    return `From that actor's position, this makes ${axis} the pressure point: closer to ${toward} than ${away}.`
  }

  if (cardType === "decision") {
    return `As a decision, this puts the response mainly on ${axis}: closer to ${toward} than ${away}.`
  }

  if (cardType === "explanation") {
    return `As an explanation, this reads the case mainly through ${axis}: closer to ${toward} than ${away}.`
  }

  return `This choice makes ${axis} the clearest pressure point: closer to ${toward} than ${away}.`
}

function formatCardType(cardType: ChoiceCardType) {
  if (cardType === "explanation") return "Explanation"
  if (cardType === "decision") return "Decision"
  if (cardType === "actorLens") return "Actor lens"
  return "Both"
}

function buildFoundationRelation({
  moduleTitle,
  comparison,
  challenge,
  cardTypeSummary,
  laneSummaries,
}: {
  moduleTitle: string
  comparison?: string
  challenge: string
  cardTypeSummary?: string
  laneSummaries: Array<{ label: string; delta?: string }>
}) {
  const comparisonSentences = splitSentences(comparison)
  const reinforceCandidates = comparisonSentences.filter((sentence) =>
    /(reinforces|stays visible|still matters|still shows up)/i.test(sentence),
  )
  const pullAwayCandidates = [
    ...laneSummaries
      .filter((lane) => lane.delta)
      .map((lane) => `${lane.label}: ${lane.delta}`),
    ...comparisonSentences.filter((sentence) =>
      /(pulls?|harden|harder|more bounded|more comfortable|more control|more capacity|more coordination|more coalition|more protection|more order-first)/i.test(sentence),
    ),
  ]

  return {
    reinforces:
      reinforceCandidates.length > 0
        ? reinforceCandidates.slice(0, 2)
        : [
            `Your ${moduleTitle} read tracks the same baseline it started from.`,
          ],
    complicates: [cardTypeSummary ?? challenge],
    pullsAway:
      pullAwayCandidates.length > 0
        ? uniqueStrings(pullAwayCandidates).slice(0, 3)
        : ["No strong break from the linked Foundation baseline shows up in this module."],
  }
}

function splitSentences(text?: string) {
  if (!text) return []

  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

function uniqueStrings(values: string[]) {
  return [...new Set(values)]
}
