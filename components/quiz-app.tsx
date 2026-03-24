"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { coreQuestions, likertScale } from "@/lib/quiz-schema"
import { getScenarioSequence } from "@/lib/scoring"
import { Answers, Clarification, Question } from "@/lib/types"

export const QUIZ_STORAGE_KEY = "ir-worldview-answers-v2"

export function QuizApp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromReview = searchParams.get("from") === "review"
  const initialQ = parseInt(searchParams.get("q") ?? "0", 10)

  const [answers, setAnswers] = useState<Answers>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [clarificationOpen, setClarificationOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Answers
        setAnswers(parsed)
      } catch {
        window.localStorage.removeItem(QUIZ_STORAGE_KEY)
      }
    }
    // Jump to the specified question index when entering from the review screen.
    if (!isNaN(initialQ) && initialQ > 0) {
      setCurrentIndex(initialQ)
    }
    setReady(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(answers))
  }, [answers, ready])

  const scenarioSequence = useMemo(() => getScenarioSequence(answers), [answers])
  const allQuestions = useMemo<Question[]>(
    () => [...coreQuestions, ...scenarioSequence],
    [scenarioSequence],
  )

  // Clamp currentIndex if the question list contracts (branching can remove questions).
  useEffect(() => {
    if (currentIndex > allQuestions.length - 1) {
      setCurrentIndex(Math.max(0, allQuestions.length - 1))
    }
  }, [allQuestions.length, currentIndex])

  // Reset clarification disclosure when the question changes.
  useEffect(() => {
    setClarificationOpen(false)
  }, [currentIndex])

  const currentQuestion = allQuestions[currentIndex]
  const completedCount = allQuestions.filter((q) => answers[q.id] !== undefined).length
  const progress =
    allQuestions.length === 0 ? 0 : Math.round((completedCount / allQuestions.length) * 100)
  const isComplete = allQuestions.length > 0 && completedCount === allQuestions.length
  const hasCurrentAnswer = currentQuestion ? answers[currentQuestion.id] !== undefined : false

  function selectAnswer(value: number | "A" | "B" | "C") {
    if (!currentQuestion) return
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
  }

  function goBack() {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  function goNext() {
    setCurrentIndex((prev) => Math.min(allQuestions.length - 1, prev + 1))
  }

  function goToReview() {
    router.push("/quiz/review")
  }

  function resetQuiz() {
    setAnswers({})
    setCurrentIndex(0)
    window.localStorage.removeItem(QUIZ_STORAGE_KEY)
  }

  if (!ready) {
    return <div className="panel" style={{ padding: "40px" }}>Loading your draft…</div>
  }

  const isCorePart = currentIndex < coreQuestions.length
  const sectionLabel = isCorePart ? "Core questions" : "Scenario"

  // Determine the primary completion action for the nav row.
  const completionAction = isComplete
    ? fromReview
      ? "return-to-review"
      : "go-to-review"
    : null

  return (
    <div className="stack-lg">
      {/* Hero */}
      <section className="panel stack-md">
        <div className="stack-sm">
          <p className="eyebrow">IR Worldview Inventory</p>
          <h1>Map how you think about world politics</h1>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            This inventory combines a common core of theoretical questions with branching policy
            scenarios. The result is a classification, not a diagnosis — treat it as a prompt for
            reflection, not a verdict.
          </p>
        </div>

        <div className="stack-xs">
          <div className="progress-meta">
            <span>{completedCount} of {allQuestions.length} answered</span>
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
      </section>

      {/* Question */}
      {currentQuestion ? (
        <section className="panel stack-md">
          {/* Review-edit mode breadcrumb */}
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
              {sectionLabel} · {currentIndex + 1} of {allQuestions.length}
            </p>
            <h2>{currentQuestion.prompt}</h2>
          </div>

          {/* Clarification disclosure — Likert questions only */}
          {currentQuestion.kind === "likert" && currentQuestion.clarification ? (
            <ClarificationDisclosure
              clarification={currentQuestion.clarification}
              open={clarificationOpen}
              onToggle={() => setClarificationOpen((o) => !o)}
            />
          ) : null}

          {/* Answer controls */}
          {currentQuestion.kind === "likert" ? (
            <div className="stack-sm">
              <div className="likert-labels">
                <span>Strongly disagree</span>
                <span>Strongly agree</span>
              </div>
              <div className="likert-grid">
                {likertScale.map((value) => {
                  const selected = answers[currentQuestion.id] === value
                  return (
                    <button
                      key={value}
                      type="button"
                      className={selected ? "answer-button selected" : "answer-button"}
                      onClick={() => selectAnswer(value)}
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
              {currentQuestion.options.map((option) => {
                const selected = answers[currentQuestion.id] === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={selected ? "option-card selected" : "option-card"}
                    onClick={() => selectAnswer(option.id)}
                    aria-pressed={selected}
                  >
                    <span className="option-badge">{option.id}</span>
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </div>
          )}

          <hr className="divider" />

          {/* Navigation */}
          <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
            {completionAction ? (
              // Quiz is complete: primary action is review navigation.
              <>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={goBack}
                  disabled={currentIndex === 0}
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
              // Normal navigation.
              <>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={goBack}
                  disabled={currentIndex === 0}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={goNext}
                  disabled={!hasCurrentAnswer || currentIndex === allQuestions.length - 1}
                >
                  Next
                </button>
              </>
            )}
            <button
              type="button"
              className="secondary-button"
              onClick={resetQuiz}
              style={{ marginLeft: "auto" }}
            >
              Reset
            </button>
          </div>
        </section>
      ) : null}
    </div>
  )
}

// ── Clarification disclosure ───────────────────────────────────────────────────

function ClarificationDisclosure({
  clarification,
  open,
  onToggle,
}: {
  clarification: Clarification
  open: boolean
  onToggle: () => void
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
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
        {open ? "Hide clarification" : "Clarify this question"}
      </button>

      {open ? (
        <div
          className="stack-xs"
          style={{
            marginTop: "10px",
            padding: "14px 16px",
            background: "var(--panel-2)",
            borderRadius: "5px",
            border: "1px solid var(--border)",
            fontSize: "0.85rem",
            lineHeight: "1.6",
          }}
        >
          <p>{clarification.whatItAsks}</p>
          {clarification.whatItDoesNotAsk ? (
            <p className="muted">{clarification.whatItDoesNotAsk}</p>
          ) : null}
          {clarification.terms && clarification.terms.length > 0 ? (
            <div className="stack-xs" style={{ marginTop: "8px" }}>
              {clarification.terms.map((t) => (
                <p key={t.term}>
                  <strong>{t.term}:</strong>{" "}
                  <span className="muted">{t.definition}</span>
                </p>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
