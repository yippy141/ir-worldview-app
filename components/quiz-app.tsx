"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getFoundationQuestions, likertScale } from "@/lib/quiz-schema"
import {
  QUIZ_STORAGE_KEY,
  createEmptySession,
  getRecommendedMode,
  notifyQuizSessionUpdated,
  parseQuizSession,
} from "@/lib/quiz-session"
import type {
  AnswerValue,
  Clarification,
  FamiliarityLevel,
  Question,
  QuizMode,
  QuizSession,
} from "@/lib/types"

export function QuizApp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromReview = searchParams.get("from") === "review"
  const hasIndexedQuestion = searchParams.get("q") !== null
  const initialQ = parseInt(searchParams.get("q") ?? "0", 10)

  const [session, setSession] = useState<QuizSession>(createEmptySession())
  const [currentIndex, setCurrentIndex] = useState(
    hasIndexedQuestion && !isNaN(initialQ) ? initialQ : 0,
  )
  const [supportOpen, setSupportOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY)
    const parsed = parseQuizSession(raw)
    const timeout = window.setTimeout(() => {
      if (parsed) {
        setSession(parsed)
      } else if (raw) {
        window.localStorage.removeItem(QUIZ_STORAGE_KEY)
      }

      setReady(true)
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(session))
    notifyQuizSessionUpdated()
  }, [ready, session])

  const questions = useMemo(
    () => (session.activeMode ? getFoundationQuestions(session.activeMode) : []),
    [session.activeMode],
  )
  const effectiveIndex = Math.min(currentIndex, Math.max(0, questions.length - 1))

  function updateSession(patch: Partial<QuizSession>) {
    setSession((prev) => ({ ...prev, ...patch }))
  }

  function setFamiliarity(familiarity: FamiliarityLevel) {
    setSession((prev) => {
      const nextRequestedDepth = prev.requestedDepth
      return {
        ...prev,
        familiarity,
        recommendedMode: getRecommendedMode(familiarity, nextRequestedDepth),
      }
    })
  }

  function setRequestedDepth(requestedDepth: QuizMode) {
    setSession((prev) => ({
      ...prev,
      requestedDepth,
      recommendedMode: getRecommendedMode(prev.familiarity, requestedDepth),
    }))
  }

  function startMode(mode: QuizMode) {
    setSession((prev) => ({
      ...prev,
      activeMode: mode,
      requestedDepth: prev.requestedDepth ?? mode,
      recommendedMode: getRecommendedMode(prev.familiarity, prev.requestedDepth ?? mode),
      answers: prev.activeMode && prev.activeMode !== mode ? {} : prev.answers,
    }))
    setCurrentIndex(0)
    setSupportOpen(false)
  }

  function selectAnswer(value: AnswerValue) {
    const currentQuestion = questions[effectiveIndex]
    if (!currentQuestion) return

    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: value,
      },
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
    router.push("/quiz/review")
  }

  function resetQuiz() {
    setSession(createEmptySession())
    setCurrentIndex(0)
    setSupportOpen(false)
    window.localStorage.removeItem(QUIZ_STORAGE_KEY)
    notifyQuizSessionUpdated()
  }

  if (!ready) {
    return <div className="panel" style={{ padding: "40px" }}>Loading your draft…</div>
  }

  if (!session.activeMode) {
    return (
      <ModeGate
        familiarity={session.familiarity}
        requestedDepth={session.requestedDepth}
        recommendedMode={session.recommendedMode}
        onSetFamiliarity={setFamiliarity}
        onSetRequestedDepth={setRequestedDepth}
        onStartMode={startMode}
      />
    )
  }

  const currentQuestion = questions[effectiveIndex]
  const completedCount = questions.filter((question) => session.answers[question.id] !== undefined).length
  const progress = questions.length === 0 ? 0 : Math.round((completedCount / questions.length) * 100)
  const isComplete = questions.length > 0 && completedCount === questions.length
  const hasCurrentAnswer = currentQuestion ? session.answers[currentQuestion.id] !== undefined : false
  const completionAction = isComplete
    ? fromReview
      ? "return-to-review"
      : "go-to-review"
    : null
  const supportVisible = session.contextAssist || supportOpen

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <div className="stack-sm">
          <p className="eyebrow">IR Worldview Inventory</p>
          <div className="row gap-sm wrap center" style={{ justifyContent: "space-between" }}>
            <div className="stack-xs">
              <h1>Foundation questionnaire</h1>
              <p className="muted" style={{ lineHeight: "1.65" }}>
                {session.activeMode === "standard"
                  ? "Standard mode keeps the foundation concise and plain-language."
                  : "Analyst mode adds harder tradeoffs, denser framing, and a longer pass through the same foundation."}
              </p>
            </div>
            <span className="mode-pill">
              {session.activeMode === "standard" ? "Standard mode" : "Analyst mode"}
            </span>
          </div>
          <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
            The recommendation changes pacing and depth only. It does not alter the scoring model.
          </p>
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
          <button
            type="button"
            className={session.contextAssist ? "primary-button" : "secondary-button"}
            onClick={() => updateSession({ contextAssist: !session.contextAssist })}
          >
            {session.contextAssist ? "Context assist on" : "Context assist off"}
          </button>
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

          {hasSupport(currentQuestion) ? (
            <SupportBlock
              question={currentQuestion}
              visible={supportVisible}
              onToggle={() => setSupportOpen((open) => !open)}
              autoShown={session.contextAssist}
            />
          ) : null}

          {currentQuestion.kind === "likert" ? (
            <div className="stack-sm">
              <div className="likert-labels">
                <span>Strongly disagree</span>
                <span>Strongly agree</span>
              </div>
              <div className="likert-grid">
                {likertScale.map((value) => {
                  const selected = session.answers[currentQuestion.id] === value
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
              {currentQuestion.options.map((option, optionIndex) => {
                const selected = session.answers[currentQuestion.id] === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={selected ? "option-card selected" : "option-card"}
                    onClick={() => selectAnswer(option.id)}
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

function ModeGate({
  familiarity,
  requestedDepth,
  recommendedMode,
  onSetFamiliarity,
  onSetRequestedDepth,
  onStartMode,
}: {
  familiarity?: FamiliarityLevel
  requestedDepth?: QuizMode
  recommendedMode?: QuizMode
  onSetFamiliarity: (value: FamiliarityLevel) => void
  onSetRequestedDepth: (value: QuizMode) => void
  onStartMode: (value: QuizMode) => void
}) {
  const ready = Boolean(familiarity && requestedDepth && recommendedMode)

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <div className="stack-sm">
          <p className="eyebrow">IR Worldview Inventory</p>
          <h1>Choose how deep you want to go</h1>
          <p className="muted" style={{ lineHeight: "1.7", maxWidth: "640px" }}>
            The foundation uses one shared scoring model. The choice here changes depth and pacing,
            not what the result means.
          </p>
        </div>

        <div className="stack-lg">
          <div className="stack-sm">
            <h2>How familiar are you with IR debates?</h2>
            <div className="stack-sm">
              <ChoiceSelect
                selected={familiarity === "new"}
                title="New / casual"
                description="Best if you want the plainest route through the foundation."
                onClick={() => onSetFamiliarity("new")}
              />
              <ChoiceSelect
                selected={familiarity === "some"}
                title="Some familiarity"
                description="You know some of the terrain and want a little more pressure."
                onClick={() => onSetFamiliarity("some")}
              />
              <ChoiceSelect
                selected={familiarity === "very"}
                title="Very familiar / study or work in this area"
                description="Best if you want more ambiguity, tension, and denser cases."
                onClick={() => onSetFamiliarity("very")}
              />
            </div>
          </div>

          <div className="stack-sm">
            <h2>How deep do you want to go right now?</h2>
            <div className="stack-sm">
              <ChoiceSelect
                selected={requestedDepth === "standard"}
                title="Standard"
                description="About 10 to 14 minutes. Cleaner wording and fewer follow-ups."
                onClick={() => onSetRequestedDepth("standard")}
              />
              <ChoiceSelect
                selected={requestedDepth === "analyst"}
                title="Analyst"
                description="About 18 to 25 minutes. More ambiguity, sharper tradeoffs, and deeper cases."
                onClick={() => onSetRequestedDepth("analyst")}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="panel stack-md">
        <div className="stack-sm">
          <p className="eyebrow">Recommendation</p>
          {ready ? (
            <>
              <h2>
                {recommendedMode === "analyst"
                  ? "Analyst is the recommended fit."
                  : "Standard is the recommended fit."}
              </h2>
              <p className="muted" style={{ lineHeight: "1.65" }}>
                You can still override it. Familiarity helps set expectations, but it does not
                directly affect the score.
              </p>
            </>
          ) : (
            <p className="muted" style={{ lineHeight: "1.65" }}>
              Answer both questions above to see the recommendation and choose your route.
            </p>
          )}
        </div>

        <div className="row gap-sm wrap">
          <button
            type="button"
            className={recommendedMode === "standard" ? "primary-button" : "secondary-button"}
            onClick={() => onStartMode("standard")}
            disabled={!ready}
          >
            Continue in Standard
          </button>
          <button
            type="button"
            className={recommendedMode === "analyst" ? "primary-button" : "secondary-button"}
            onClick={() => onStartMode("analyst")}
            disabled={!ready}
          >
            Continue in Analyst
          </button>
        </div>
      </section>
    </div>
  )
}

function ChoiceSelect({
  selected,
  title,
  description,
  onClick,
}: {
  selected: boolean
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
      <span className="option-badge">{selected ? "✓" : ""}</span>
      <span className="option-card-content">
        <span className="option-card-title">{title}</span>
        <span className="option-card-text">{description}</span>
      </span>
    </button>
  )
}

function SupportBlock({
  question,
  visible,
  autoShown,
  onToggle,
}: {
  question: Question
  visible: boolean
  autoShown: boolean
  onToggle: () => void
}) {
  return (
    <div className="stack-xs">
      {!autoShown ? (
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
      ) : null}

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
          {question.clarification ? (
            <ClarificationCopy clarification={question.clarification} />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function ClarificationCopy({ clarification }: { clarification: Clarification }) {
  return (
    <div className="stack-xs">
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

function questionLabel(question: Question) {
  if (question.kind === "tradeoff") return "Tradeoff"
  if (question.kind === "miniCase") return "Mini-case"
  return "Foundation statement"
}

function hasSupport(question: Question) {
  return Boolean(question.helpText || question.clarification)
}
