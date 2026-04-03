"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  countAnsweredModuleQuestions,
  encodeModulePayload,
  getModuleDefinition,
  getModuleQuestions,
} from "@/lib/modules/framework"
import type { ModuleAnswers, ModuleSlug } from "@/lib/modules/types"
import type { QuizMode } from "@/lib/types"

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
  const [openPrimers, setOpenPrimers] = useState<Record<string, boolean>>({})

  const questions = useMemo(
    () => (moduleDefinition ? getModuleQuestions(moduleDefinition, mode) : []),
    [mode, moduleDefinition],
  )

  const completedCount = useMemo(
    () => (moduleDefinition ? countAnsweredModuleQuestions(moduleDefinition, mode, answers) : 0),
    [answers, mode, moduleDefinition],
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
    setOpenPrimers({})
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
    <div className="stack-lg">
      <section className="panel stack-md">
        <div className="stack-sm">
          <p className="eyebrow">Flagship module</p>
          <h1>{moduleDefinition.title}</h1>
          <p className="muted" style={{ lineHeight: "1.7", maxWidth: "760px" }}>
            {moduleDefinition.description}
          </p>
        </div>

        <div className="stack-sm">
          <div className="stack-xs">
            <p className="eyebrow">Mode</p>
            <p className="muted" style={{ lineHeight: "1.65", maxWidth: "760px" }}>
              Standard keeps the module concise. Analyst adds four extra cases and invites an
              optional second choice on selected cards as a softer signal.
            </p>
          </div>
          <div className="module-mode-grid">
            <ModeCard
              selected={mode === "standard"}
              badge="S"
              title="Standard"
              description={`8 questions · ${moduleDefinition.timeEstimate.standard}`}
              onClick={() => handleModeChange("standard")}
            />
            <ModeCard
              selected={mode === "analyst"}
              badge="A"
              title="Analyst"
              description={`12 questions · ${moduleDefinition.timeEstimate.analyst}`}
              onClick={() => handleModeChange("analyst")}
            />
          </div>
        </div>

        <div className="module-meta-grid">
          <div className="callout stack-xs">
            <p className="eyebrow">Time</p>
            <p style={{ fontWeight: 600 }}>{moduleDefinition.timeEstimate[mode]}</p>
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
        </div>

        {foundationPayload ? (
          <div className="callout stack-xs">
            <p style={{ fontWeight: 600 }}>Foundation comparison is on</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
              This module result can compare back to your foundation profile, but it remains a
              separate issue-specific readout.
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

      {questions.map((question, index) => {
        const primerOpen = openPrimers[question.id] ?? false
        const primarySelection = answers[question.id]?.primary
        const secondarySelection = answers[question.id]?.secondary
        const showSecondChoice =
          mode === "analyst" && question.allowSecondChoiceInAnalyst && Boolean(primarySelection)

        return (
          <section key={question.id} className="panel stack-md">
            <div className="stack-xs">
              <p className="eyebrow">
                {question.kind === "synthesis" ? "Synthesis" : "Case"} · {index + 1} of {questions.length}
              </p>
              <h2>{question.title}</h2>
              <p style={{ lineHeight: "1.7", maxWidth: "880px" }}>{question.prompt}</p>
            </div>

            <div className="stack-xs">
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setOpenPrimers((prev) => ({ ...prev, [question.id]: !primerOpen }))
                }
              >
                {primerOpen ? "Hide context" : "Need context?"}
              </button>
              {primerOpen ? (
                <div className="callout">
                  <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                    {question.primer}
                  </p>
                </div>
              ) : null}
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
                  <p className="eyebrow">Optional second choice</p>
                  <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
                    If another framing also comes close, mark it here. It counts as a softer signal
                    than your main choice.
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
            onClick={() => router.push(foundationPayload ? `/modules?foundation=${encodeURIComponent(foundationPayload)}` : "/modules")}
          >
            Back to modules
          </button>
        </div>
        <p className="muted" style={{ fontSize: "0.82rem", lineHeight: "1.55" }}>
          Module results stay separate from the foundation result. They show how your instincts
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
