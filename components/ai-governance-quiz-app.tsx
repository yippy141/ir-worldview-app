"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AI_GOVERNANCE_STORAGE_KEY, aiCoreQuestions, aiLikertScale } from "@/lib/ai-governance-schema"
import { getAiScenarioSequence } from "@/lib/ai-governance-scoring"
import type { AiAnswers, AiClarification, AiQuestion } from "@/lib/ai-governance-types"

type AiQuizState = {
  started: boolean
  answers: AiAnswers
}

function createEmptyState(): AiQuizState {
  return { started: false, answers: {} }
}

export function AiGovernanceQuizApp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromReview = searchParams.get("from") === "review"
  const hasIndexedQuestion = searchParams.get("q") !== null
  const initialQ = parseInt(searchParams.get("q") ?? "0", 10)

  const [state, setState] = useState<AiQuizState>(createEmptyState())
  const [currentIndex, setCurrentIndex] = useState(
    hasIndexedQuestion && !isNaN(initialQ) ? initialQ : 0,
  )
  const [supportOpen, setSupportOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const raw = window.localStorage.getItem(AI_GOVERNANCE_STORAGE_KEY)
    const timeout = window.setTimeout(() => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          if (parsed && typeof parsed === "object" && "answers" in parsed) {
            setState(parsed as AiQuizState)
          }
        } catch {
          window.localStorage.removeItem(AI_GOVERNANCE_STORAGE_KEY)
        }
      }
      setReady(true)
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(AI_GOVERNANCE_STORAGE_KEY, JSON.stringify(state))
  }, [ready, state])

  const questions: AiQuestion[] = useMemo(() => {
    if (!state.started) return []
    return [...aiCoreQuestions, ...getAiScenarioSequence(state.answers)]
  }, [state.started, state.answers])

  const effectiveIndex = Math.min(currentIndex, Math.max(0, questions.length - 1))

  function start() {
    setState((prev) => ({ ...prev, started: true }))
    setCurrentIndex(0)
    setSupportOpen(false)
  }

  function setAnswer(questionId: string, value: number | "A" | "B" | "C") {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }))
  }

  function goBack() {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
    setSupportOpen(false)
  }

  function goNext() {
    setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
    setSupportOpen(false)
  }

  function goToReview() {
    router.push("/ai/review")
  }

  function resetQuiz() {
    setState(createEmptyState())
    setCurrentIndex(0)
    setSupportOpen(false)
    window.localStorage.removeItem(AI_GOVERNANCE_STORAGE_KEY)
  }

  if (!ready) {
    return <div className="panel" style={{ padding: "40px" }}>Loading your draft…</div>
  }

  if (!state.started) {
    return (
      <StartGate
        hasDraft={Object.keys(state.answers).length > 0}
        onStart={start}
        onReset={resetQuiz}
      />
    )
  }

  const currentQuestion = questions[effectiveIndex]
  const completedCount = questions.filter((q) => state.answers[q.id] !== undefined).length
  const progress = questions.length === 0 ? 0 : Math.round((completedCount / questions.length) * 100)
  const isComplete = questions.length > 0 && completedCount === questions.length
  const hasCurrentAnswer = currentQuestion
    ? state.answers[currentQuestion.id] !== undefined
    : false
  const completionAction = isComplete
    ? fromReview
      ? "return-to-review"
      : "go-to-review"
    : null

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <div className="stack-sm">
          <p className="eyebrow">AI Governance Compass</p>
          <div className="row gap-sm wrap center" style={{ justifyContent: "space-between" }}>
            <h1>Map how you think about AI safety, governance, and the future</h1>
          </div>
        </div>

        <div className="stack-xs">
          <div className="progress-meta">
            <span>{completedCount} of {questions.length} answered</span>
            <span>{progress}%</span>
          </div>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Quiz progress"
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="row gap-sm wrap center">
          <button type="button" className="secondary-button" onClick={resetQuiz}>
            Start over
          </button>
        </div>
      </section>

      {currentQuestion ? (
        <section className="panel stack-md">
          {fromReview ? (
            <div>
              <button
                type="button"
                onClick={goToReview}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "var(--accent-light)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                }}
              >
                ← Return to review
              </button>
            </div>
          ) : null}

          <div className="stack-xs">
            <p className="eyebrow">
              {questionLabel(currentQuestion)} · {effectiveIndex + 1} of {questions.length}
            </p>
            <h2>{currentQuestion.prompt}</h2>
          </div>

          {currentQuestion.kind === "scenario" && currentQuestion.actorRole ? (
            <div className="callout stack-sm">
              <div className="stack-xs">
                <p className="eyebrow">Your role</p>
                <p style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>
                  {currentQuestion.actorRole}
                </p>
              </div>
            </div>
          ) : null}

          {hasSupport(currentQuestion) ? (
            <SupportBlock
              question={currentQuestion}
              visible={supportOpen}
              onToggle={() => setSupportOpen((open) => !open)}
            />
          ) : null}

          {currentQuestion.kind === "likert" ? (
            <div className="stack-sm">
              <div className="likert-labels">
                <span>Strongly disagree</span>
                <span>Strongly agree</span>
              </div>
              <div className="likert-grid">
                {aiLikertScale.map((value) => {
                  const selected = state.answers[currentQuestion.id] === value
                  return (
                    <button
                      key={value}
                      type="button"
                      className={selected ? "answer-button selected" : "answer-button"}
                      onClick={() => setAnswer(currentQuestion.id, value)}
                      aria-pressed={selected}
                      aria-label={`${value} — ${value === 1 ? "strongly disagree" : value === 7 ? "strongly agree" : `${value} out of 7`}`}
                    >
                      {value}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="stack-sm">
              {currentQuestion.options.map((option, optionIndex) => {
                const selected = state.answers[currentQuestion.id] === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={selected ? "option-card selected" : "option-card"}
                    onClick={() => setAnswer(currentQuestion.id, option.id)}
                    aria-pressed={selected}
                  >
                    <span className="option-badge">{optionIndex + 1}</span>
                    <span className="option-card-content">
                      <span className="option-card-text">{option.label}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          <hr className="divider" />

          <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
            {completionAction ? (
              <>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={goBack}
                  disabled={effectiveIndex === 0}
                >
                  Back
                </button>
                <button type="button" className="primary-button" onClick={goToReview}>
                  {completionAction === "return-to-review"
                    ? "Return to review"
                    : "Review your answers →"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={goBack}
                  disabled={effectiveIndex === 0}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={goNext}
                  disabled={!hasCurrentAnswer || effectiveIndex === questions.length - 1}
                >
                  Next
                </button>
              </>
            )}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function StartGate({
  hasDraft,
  onStart,
  onReset,
}: {
  hasDraft: boolean
  onStart: () => void
  onReset: () => void
}) {
  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <div className="stack-sm">
          <p className="eyebrow">AI Governance Compass</p>
          <h1>Map how you think about AI safety, governance, and the future</h1>
          <p className="muted" style={{ lineHeight: "1.7", maxWidth: "640px" }}>
            Position statements and branching scenarios map where you stand across eight AI
            governance dimensions. The result is a structured interpretation — not a personality
            profile or a validated instrument.
          </p>
        </div>

        <div className="row gap-sm wrap">
          <button type="button" className="primary-button" onClick={onStart}>
            {hasDraft ? "Resume draft" : "Begin"}
          </button>
          {hasDraft ? (
            <button type="button" className="secondary-button" onClick={onReset}>
              Start over
            </button>
          ) : null}
        </div>
      </section>
    </div>
  )
}

function SupportBlock({
  question,
  visible,
  onToggle,
}: {
  question: AiQuestion
  visible: boolean
  onToggle: () => void
}) {
  return (
    <div className="stack-xs">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={visible}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "var(--muted)",
          fontSize: "0.8rem",
          textDecoration: "underline",
          textDecorationStyle: "dotted",
          textUnderlineOffset: "3px",
        }}
      >
        {visible ? "Hide context" : "Need context?"}
      </button>

      {visible ? (
        <div
          className="stack-xs"
          style={{
            padding: "14px 16px",
            background: "var(--panel-2)",
            borderRadius: "5px",
            border: "1px solid var(--border)",
            fontSize: "0.85rem",
            lineHeight: "1.6",
          }}
        >
          {question.helpText ? <p>{question.helpText}</p> : null}
          {question.kind === "likert" && question.clarification ? (
            <ClarificationCopy clarification={question.clarification} />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function ClarificationCopy({ clarification }: { clarification: AiClarification }) {
  return (
    <div className="stack-xs">
      {clarification.title ? <p><strong>{clarification.title}</strong></p> : null}
      <p>{clarification.whatItAsks}</p>
      {clarification.whatItDoesNotAsk ? (
        <p className="muted">{clarification.whatItDoesNotAsk}</p>
      ) : null}
      {clarification.terms && clarification.terms.length > 0 ? (
        <div className="stack-xs">
          {clarification.terms.map((term) => (
            <p key={term.term}>
              <strong>{term.term}:</strong> <span className="muted">{term.definition}</span>
            </p>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function questionLabel(question: AiQuestion): string {
  if (question.kind === "likert") return "Foundation statement"
  return `Scenario · ${cardTypeLabel(question.cardType)}`
}

function hasSupport(question: AiQuestion): boolean {
  if (question.kind === "likert") return Boolean(question.helpText || question.clarification)
  return Boolean(question.helpText)
}

function cardTypeLabel(cardType: "explanation" | "decision" | "actorLens"): string {
  if (cardType === "explanation") return "Explanation"
  if (cardType === "decision") return "Decision"
  if (cardType === "actorLens") return "Actor lens"
  return cardType
}
