import Link from "next/link"
import { ScaleBar } from "@/components/visual-primitives"
import {
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
          }}
        />

        <section className="result-section stack-md">
          <p className="eyebrow">Focus-area result</p>
          <h1>{result.headline}</h1>
          <p className="muted" style={{ lineHeight: "1.75", maxWidth: "760px" }}>
            {result.summary}
          </p>
          <div className="profile-module-grid">
            {result.laneSummaries.map((lane) => (
              <div key={lane.key} className="explore-card stack-sm">
                <div className="stack-xs">
                  <p className="eyebrow">{lane.label}</p>
                  <p style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>{lane.summary}</p>
                </div>
                <ScaleBar
                  value={lane.score}
                  lowLabel={lane.lowLabel}
                  highLabel={lane.highLabel}
                  tone={slug}
                  className="module-lane-meter"
                />
                {lane.delta ? (
                  <p className="muted" style={{ fontSize: "0.84rem", lineHeight: "1.55" }}>
                    <strong>Relative to Foundation:</strong> {lane.delta}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
          <div className="callout stack-xs">
            <p style={{ fontWeight: 600 }}>What this still leaves open</p>
            <p style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>{result.challenge}</p>
          </div>
        </section>

        <section className="result-section stack-md">
          <div className="stack-xs">
            <p className="eyebrow">Foundation linkage</p>
            <h2>How this relates to your Foundation</h2>
            <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65", maxWidth: "760px" }}>
              {foundation
                ? "This result does not replace your Foundation read. It shows what still tracks, what gets messier, and where this issue area pulls you in a different direction."
                : "This result was opened without a linked Foundation baseline, so the comparison below stays limited until you run the module from a saved Foundation result or from a device with one saved."}
            </p>
          </div>

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
              <p style={{ fontWeight: 600 }}>No linked Foundation baseline was available</p>
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>
                This module still gives you its own read, but the reinforce / complicate / pull-away comparison needs a saved or linked Foundation baseline.
              </p>
            </div>
          )}
        </section>

        <section className="result-section stack-md">
          <div className="stack-xs">
            <h2>Decisive calls</h2>
            <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65", maxWidth: "760px" }}>
              These are the selected choices carrying the clearest information in this result. The
              full answer record stays below for audit, but quieter calls do not need to lead the
              page.
            </p>
          </div>
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
                  <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                    {call.implication}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {result.cardTypeRead ? (
          <section className="result-section stack-md">
            <div className="stack-xs">
              <h2>{result.cardTypeRead.headline}</h2>
              <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65" }}>
                {hasActorLens
                  ? "Actor-lens cards stay separate, so perspective-taking does not overwrite your own issue read."
                  : "This shows what changes when the question shifts from diagnosis to choice."}
              </p>
            </div>
            <p className="result-prose" style={{ lineHeight: "1.7" }}>
              {result.cardTypeRead.summary}
            </p>
          </section>
        ) : null}

        <section className="result-section stack-md">
          <h2>What you keep coming back to</h2>
          <ul className="content-list result-prose">
            {result.instincts.map((instinct) => (
              <li key={instinct}>{instinct}</li>
            ))}
          </ul>
        </section>

        <section className="result-section stack-md">
          <div className="stack-xs">
            <h2>How to read this module</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              Framing and scope notes sit down here if you want them.
            </p>
          </div>
          <details className="profile-details">
            <summary>Open framing and scope notes</summary>
            <div className="driver-grid" style={{ marginTop: "16px" }}>
              <div className="driver-card stack-xs">
                <p className="eyebrow">Mode</p>
                <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>
                  {mode === "standard" ? "Standard" : "Advanced"}
                </p>
                <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
                  {questionCount} questions · {moduleDefinition.timeEstimate[mode]}
                </p>
              </div>
              <div className="driver-card stack-xs">
                <p className="eyebrow">In-flow shorthand</p>
                <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>
                  {moduleDefinition.shorthand}
                </p>
                <p className="muted" style={{ fontSize: "0.88rem", lineHeight: "1.65" }}>
                  This is an issue read, not a replacement for the Foundation baseline.
                </p>
              </div>
              <div className="driver-card stack-xs">
                <p className="eyebrow">What it measured</p>
                <p className="muted" style={{ fontSize: "0.88rem", lineHeight: "1.65" }}>
                  {moduleDefinition.measures.join("; ")}.
                </p>
              </div>
              <div className="driver-card stack-xs">
                <p className="eyebrow">What it did not claim</p>
                <p className="muted" style={{ fontSize: "0.88rem", lineHeight: "1.65" }}>
                  {moduleDefinition.doesNotClaim.join("; ")}.
                </p>
              </div>
            </div>
          </details>
        </section>

        <section className="result-section stack-md">
          <div className="stack-xs">
            <h2>Module profile</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              These scores run from 1 to 7 within this module. The labels below name the two poles,
              not population percentiles{hasActorLens ? ", and the main lane read comes from Explanation and Decision cards rather than Actor lens cards." : "."}
            </p>
          </div>

          <div>
            {moduleDefinition.axes.map((axis) => (
              <div key={axis.key} className="dim-row">
                <ScaleBar
                  label={axis.label}
                  value={result.scores[axis.key]}
                  lowLabel={axis.lowLabel}
                  highLabel={axis.highLabel}
                  tone={slug}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="result-section stack-md">
          <div className="stack-xs">
            <h2>Evidence log</h2>
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              The complete record of choices used to produce this module result.
            </p>
          </div>
          <details className="profile-details">
            <summary>Open full evidence log</summary>
            <div className="driver-grid" style={{ marginTop: "16px" }}>
              {selected.map(({ question, primary, secondary }) => (
                <div key={question.id} className="driver-card stack-sm">
                  <div className="stack-xs">
                    <p className="eyebrow">{question.title}</p>
                    <p className="muted" style={{ fontSize: "0.8rem", lineHeight: "1.55" }}>
                      {laneLabelMap[question.lane] ?? question.lane} · {formatCardType(question.cardType)}
                    </p>
                    <p style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>{question.prompt}</p>
                  </div>
                  <div className="stack-xs">
                    <span className="option-card-meta">Most persuasive</span>
                    <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>
                      {primary?.title ?? "No selection"}
                    </p>
                    <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
                      {primary?.label ?? "This question was not answered."}
                    </p>
                  </div>
                  {secondary ? (
                    <div className="stack-xs">
                      <span className="option-card-meta option-card-meta--secondary">Second-most persuasive</span>
                      <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>{secondary.title}</p>
                      <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.6" }}>
                        {secondary.label}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </details>
        </section>

        <section className="result-section stack-md">
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
    .map(({ selection, strongest }) => {
      const axis = axisMap[strongest.axisKey]
      const leansHigh = strongest.value >= 4
      const direction = leansHigh ? axis.highLabel : axis.lowLabel
      const contrast = leansHigh ? axis.lowLabel : axis.highLabel

      return {
        id: selection.question.id,
        caseTitle: selection.question.title,
        laneLabel: laneLabelMap[selection.question.lane] ?? selection.question.lane,
        cardType: formatCardType(selection.question.cardType),
        framing: selection.primary.title,
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
            `Your ${moduleTitle} read still looks like an overlay on the same baseline rather than a replacement for it.`,
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
