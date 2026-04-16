"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  countAnsweredModuleQuestions,
  countAnsweredModuleQuestionsByLane,
  encodeModulePayload,
  getModuleDefinition,
  getModulePerspectiveCoverage,
  getModuleQuestions,
  moduleAllowsSecondChoice,
} from "@/lib/modules/framework"
import type { ModuleAnswers, ModuleLane, ModuleSlug } from "@/lib/modules/types"
import type { ChoiceCardType, QuizMode } from "@/lib/types"

export function ModuleApp({
  slug,
  foundationPayload,
}: {
  slug: ModuleSlug
  foundationPayload?: string
}) {
  const router = useRouter()
  const moduleDefinition = getModuleDefinition(slug)
  const [mode, setMode] = useState<QuizMode>("standard")
  const [answers, setAnswers] = useState<ModuleAnswers>({})

  const questions = useMemo(
    () => (moduleDefinition ? getModuleQuestions(moduleDefinition, mode) : []),
    [mode, moduleDefinition],
  )

  const questionsByLane = useMemo(
    () =>
      moduleDefinition
        ? moduleDefinition.lanes.map((lane) => ({
            lane,
            questions: questions.filter((question) => question.lane === lane.key),
          }))
        : [],
    [moduleDefinition, questions],
  )

  const completedCount = useMemo(
    () => (moduleDefinition ? countAnsweredModuleQuestions(moduleDefinition, mode, answers) : 0),
    [answers, mode, moduleDefinition],
  )

  const answeredByLane = useMemo(
    () =>
      moduleDefinition ? countAnsweredModuleQuestionsByLane(moduleDefinition, mode, answers) : {},
    [answers, mode, moduleDefinition],
  )

  const perspectiveCoverage = useMemo(
    () =>
      moduleDefinition
        ? getModulePerspectiveCoverage(moduleDefinition, "analyst").filter((role) => role.count > 0)
        : [],
    [moduleDefinition],
  )

  if (!moduleDefinition) {
    return null
  }

  const progress = questions.length === 0 ? 0 : Math.round((completedCount / questions.length) * 100)
  const ready = questions.length > 0 && completedCount === questions.length

  function handleModeChange(nextMode: QuizMode) {
    if (nextMode === mode) return
    setMode(nextMode)
    setAnswers({})
  }

  function setPrimary(questionId: string, optionId: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        primary: optionId,
      },
    }))
  }

  function setSecondary(questionId: string, optionId: string) {
    setAnswers((prev) => {
      const current = prev[questionId]
      if (!current?.primary || current.primary === optionId) {
        return prev
      }

      return {
        ...prev,
        [questionId]: {
          primary: current.primary,
          secondary: current.secondary === optionId ? undefined : optionId,
        },
      }
    })
  }

  function handleGenerate() {
    const payload = encodeModulePayload({
      v: 2,
      slug,
      mode,
      answers,
    })

    const query = foundationPayload ? `?foundation=${encodeURIComponent(foundationPayload)}` : ""
    router.push(`/modules/${slug}/results/${payload}${query}`)
  }

  return (
    <div className="stack-xl">
      <section className="panel stack-md">
        <div className="stack-sm">
          <p className="eyebrow">Focus-area module</p>
          <h1>{moduleDefinition.title}</h1>
          <p style={{ fontWeight: 600, maxWidth: "760px" }}>{moduleDefinition.subtitle}</p>
          <p className="muted" style={{ lineHeight: "1.7", maxWidth: "760px" }}>
            {moduleDefinition.description}
          </p>
        </div>

        <div className="stack-sm">
          <div className="stack-xs">
            <p className="eyebrow">Mode</p>
            <p className="muted" style={{ lineHeight: "1.65", maxWidth: "760px" }}>
              Standard keeps the module to nine lane-balanced cases. Advanced adds one more case
              per lane. In both modes, scenario cards can carry an optional second-most persuasive
              answer as a softer signal once you choose a primary one.
            </p>
          </div>
          <div className="module-mode-grid">
            <ModeCard
              selected={mode === "standard"}
              badge="S"
              title="Standard"
              description={`9 questions · ${moduleDefinition.timeEstimate.standard}`}
              onClick={() => handleModeChange("standard")}
            />
            <ModeCard
              selected={mode === "analyst"}
              badge="A"
              title="Advanced"
              description={`12 questions · ${moduleDefinition.timeEstimate.analyst}`}
              onClick={() => handleModeChange("analyst")}
            />
          </div>
        </div>

        <div className="module-meta-grid">
          <div className="callout stack-xs">
            <p className="eyebrow">In-flow shorthand</p>
            <p style={{ fontWeight: 600 }}>{moduleDefinition.shorthand}</p>
            <p className="muted" style={{ fontSize: "0.85rem", lineHeight: "1.55" }}>
              {questions.length} scored items in this mode.
            </p>
          </div>
          <div className="callout stack-xs">
            <p className="eyebrow">What it measures</p>
            <ul className="content-list" style={{ margin: 0 }}>
              {moduleDefinition.measures.map((measure) => (
                <li key={measure}>{measure}</li>
              ))}
            </ul>
          </div>
          <div className="callout stack-xs">
            <p className="eyebrow">What it does not claim</p>
            <ul className="content-list" style={{ margin: 0 }}>
              {moduleDefinition.doesNotClaim.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="callout stack-sm">
          <div className="stack-xs">
            <p style={{ fontWeight: 600 }}>Visible lanes</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
              Each case sits inside one lane so the module reads like a structured issue file
              rather than one large basket of debates.
            </p>
          </div>
          <div className="module-lane-grid">
            {questionsByLane.map(({ lane, questions: laneQuestions }) => (
              <LaneProgressCard
                key={lane.key}
                lane={lane}
                answered={answeredByLane[lane.key] ?? 0}
                total={laneQuestions.length}
              />
            ))}
          </div>
        </div>

        <div className="callout stack-xs">
          <p style={{ fontWeight: 600 }}>Perspective coverage across the full issue file</p>
          <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
            This module is meant to test the issue through multiple actor positions, not only from
            one coalition-manager point of view.
          </p>
          <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.88rem" }}>
            {perspectiveCoverage.map((role) => role.label).join(" · ")}
          </p>
        </div>

        <div className="callout stack-xs">
          <p style={{ fontWeight: 600 }}>How to answer these cases</p>
          <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
            Read the scene first, then the tradeoff.
          </p>
          <ul
            className="muted"
            style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.65", fontSize: "0.9rem" }}
          >
            <li>On <strong>Explanation</strong> cards, choose the logic that best explains the case.</li>
            <li>On <strong>Decision</strong> cards, choose the consideration that should carry the most weight in the response.</li>
            <li>On <strong>Actor lens</strong> cards, choose the logic that would look strongest from that actor&apos;s own strategic position.</li>
          </ul>
          <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
            Answer from your own analytic judgment, not from what sounds most moderate or most
            publicly defensible. If another option also fits, add it as your second-most
            persuasive answer.
          </p>
        </div>

        {foundationPayload ? (
          <div className="callout stack-xs">
            <p style={{ fontWeight: 600 }}>Foundation comparison is on</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
              This module can compare back to your Foundation result, but it remains an
              issue-specific read rather than a replacement for the baseline.
            </p>
          </div>
        ) : null}

        <div className="stack-xs">
          <div className="progress-meta">
            <span>{completedCount} of {questions.length} answered</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      {questionsByLane.map(({ lane, questions: laneQuestions }) => (
        <section key={lane.key} className="stack-md">
          <div className="stack-xs">
            <p className="eyebrow">{moduleDefinition.shorthand} · Lane</p>
            <h2>{lane.label}</h2>
            <p className="muted" style={{ lineHeight: "1.65", maxWidth: "760px" }}>
              {lane.description}
            </p>
            <div className="progress-meta">
              <span>{answeredByLane[lane.key] ?? 0} of {laneQuestions.length} answered in this lane</span>
              <span>{Math.round(((answeredByLane[lane.key] ?? 0) / Math.max(laneQuestions.length, 1)) * 100)}%</span>
            </div>
          </div>

          {laneQuestions.map((question, questionIndex) => {
            const primarySelection = answers[question.id]?.primary
            const secondarySelection = answers[question.id]?.secondary
            const showSecondChoice = moduleAllowsSecondChoice(question) && Boolean(primarySelection)

            return (
              <section key={question.id} className="panel stack-md">
                <div className="stack-xs">
                  <p className="eyebrow">
                    {lane.label} · {cardTypeLabel(question.cardType)} · {questionIndex + 1} of {laneQuestions.length}
                  </p>
                  <h3>{question.title}</h3>
                </div>

                <div className="module-case-frame stack-sm">
                  <div className="stack-xs">
                    <p className="eyebrow">Scene</p>
                    <p style={{ lineHeight: "1.7", maxWidth: "880px" }}>{question.scene}</p>
                  </div>
                  <div className="callout stack-xs">
                    <p className="eyebrow">What Makes This Hard</p>
                    <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                      {question.whyHard}
                    </p>
                  </div>
                  <div className="stack-xs">
                    <p className="eyebrow">Question</p>
                    <p style={{ lineHeight: "1.7", maxWidth: "880px" }}>{question.prompt}</p>
                  </div>
                  {question.contextBullets && question.contextBullets.length > 0 ? (
                    <details className="profile-details">
                      <summary>Optional context</summary>
                      <div className="stack-xs">
                        {question.contextBullets.map((bullet) => (
                          <p
                            key={`${question.id}-${bullet.label}`}
                            className="muted"
                            style={{ lineHeight: "1.6", fontSize: "0.88rem" }}
                          >
                            <strong>{bullet.label}:</strong> {bullet.text}
                          </p>
                        ))}
                      </div>
                    </details>
                  ) : null}
                </div>

                <div className="callout">
                  <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                    {moduleInstructionCopy(question.cardType)}
                  </p>
                </div>

                <div className="stack-sm">
                  {question.options.map((option, optionIndex) => {
                    const selected = primarySelection === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={selected ? "option-card selected" : "option-card"}
                        onClick={() => setPrimary(question.id, option.id)}
                        aria-pressed={selected}
                      >
                        <span className="option-badge">{optionIndex + 1}</span>
                        <span className="option-card-content">
                          <span className="option-card-title">{option.title}</span>
                          <span className="option-card-text">{option.label}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>

                {showSecondChoice ? (
                  <div className="callout stack-sm">
                    <div className="stack-xs">
                      <p className="eyebrow">Second-most persuasive</p>
                      <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
                        Use this only when another option also captures part of your judgment. It
                        counts less than your main choice and should stay genuinely secondary.
                      </p>
                    </div>
                    <div className="module-secondary-grid">
                      {question.options
                        .filter((option) => option.id !== primarySelection)
                        .map((option) => {
                          const selected = secondarySelection === option.id
                          return (
                            <button
                              key={option.id}
                              type="button"
                              className={selected ? "secondary-choice-button selected" : "secondary-choice-button"}
                              onClick={() => setSecondary(question.id, option.id)}
                              aria-pressed={selected}
                            >
                              <span className="option-card-content">
                                <span className="option-card-title" style={{ fontSize: "0.94rem" }}>
                                  {option.title}
                                </span>
                                <span className="option-card-text" style={{ fontSize: "0.86rem" }}>
                                  {option.label}
                                </span>
                              </span>
                            </button>
                          )
                        })}
                    </div>
                  </div>
                ) : null}
              </section>
            )
          })}
        </section>
      ))}

      <section className="panel stack-md">
        <div className="row gap-sm wrap">
          <button
            type="button"
            className="primary-button"
            onClick={handleGenerate}
            disabled={!ready}
          >
            Generate module result →
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              router.push(
                foundationPayload
                  ? `/modules?foundation=${encodeURIComponent(foundationPayload)}`
                  : "/modules",
              )
            }
          >
            Back to modules
          </button>
        </div>
        <p className="muted" style={{ fontSize: "0.82rem", lineHeight: "1.55" }}>
          Module results stay separate from the Foundation baseline. They show how your instincts
          travel inside one issue domain.
        </p>
      </section>
    </div>
  )
}

function ModeCard({
  selected,
  badge,
  title,
  description,
  onClick,
}: {
  selected: boolean
  badge: string
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={selected ? "option-card selected" : "option-card"}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="option-badge">{badge}</span>
      <span className="option-card-content">
        <span className="option-card-title">{title}</span>
        <span className="option-card-text">{description}</span>
      </span>
    </button>
  )
}

function LaneProgressCard({
  lane,
  answered,
  total,
}: {
  lane: ModuleLane
  answered: number
  total: number
}) {
  const progress = Math.round((answered / Math.max(total, 1)) * 100)

  return (
    <div className="module-lane-card stack-xs">
      <p className="eyebrow">{lane.label}</p>
      <p className="muted" style={{ lineHeight: "1.55", fontSize: "0.86rem" }}>
        {lane.description}
      </p>
      <div className="progress-meta">
        <span>{answered} of {total}</span>
        <span>{progress}%</span>
      </div>
      <div className="progress-bar" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

function cardTypeLabel(cardType: ChoiceCardType) {
  if (cardType === "explanation") return "Explanation"
  if (cardType === "decision") return "Decision"
  if (cardType === "actorLens") return "Actor lens"
  return "Both"
}

function moduleInstructionCopy(cardType: ChoiceCardType) {
  if (cardType === "explanation") {
    return "Choose the option that best explains what is driving the case."
  }

  if (cardType === "decision") {
    return "Choose the consideration that should carry the most weight in the response."
  }

  if (cardType === "actorLens") {
    return "Choose the logic that would look strongest from that actor's own strategic position, not the policy you personally prefer."
  }

  return "Choose the framing you find most persuasive overall."
}
