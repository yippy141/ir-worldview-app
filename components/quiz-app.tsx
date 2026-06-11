"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  dimensionLabels,
  foundationMidpointQuestionIndex,
  foundationSectionTotal,
  foundationStandardSections,
  getFoundationQuestions,
  getFoundationSectionForQuestionId,
  likertScale,
  questionCountsByMode,
} from "@/lib/quiz-schema"
import {
  QUIZ_STORAGE_KEY,
  createEmptySession,
  notifyQuizSessionUpdated,
  parseQuizSession,
} from "@/lib/quiz-session"
import { computeCoreDimensionScores } from "@/lib/scoring"
import { getTopDimensions } from "@/lib/result-helpers"
import type {
  AnswerValue,
  Clarification,
  ChoiceCardType,
  Question,
  QuizMode,
  QuizSession,
  RankedChoiceAnswer,
} from "@/lib/types"

const foundationTimeEstimateByMode = {
  standard: "12 to 16 minutes",
  analyst: "30 to 40 minutes",
} as const

export function QuizApp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromReview = searchParams.get("from") === "review"
  const hasIndexedQuestion = searchParams.get("q") !== null
  const initialQ = parseInt(searchParams.get("q") ?? "0", 10)
  const requestedMode = searchParams.get("mode") === "analyst" ? "analyst" : undefined

  const [session, setSession] = useState<QuizSession>(createEmptySession())
  const [currentIndex, setCurrentIndex] = useState(
    hasIndexedQuestion && !isNaN(initialQ) ? initialQ : 0,
  )
  const [supportOpen, setSupportOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [showMidpoint, setShowMidpoint] = useState(false)

  useEffect(() => {
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY)
    const parsed = parseQuizSession(raw)
    const timeout = window.setTimeout(() => {
      if (parsed) {
        // V14: if the saved session has no active mode, default to Standard
        // (or honor an explicit ?mode=analyst URL upgrade).
        setSession(
          parsed.activeMode
            ? parsed
            : { ...parsed, activeMode: requestedMode ?? "standard" },
        )
      } else {
        if (raw) {
          window.localStorage.removeItem(QUIZ_STORAGE_KEY)
        }
        // First-time user: start in Standard mode without a mode gate.
        setSession((prev) => ({ ...prev, activeMode: requestedMode ?? "standard" }))
      }

      setReady(true)
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [requestedMode])

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

  function switchMode(mode: QuizMode) {
    setSession((prev) => ({
      ...prev,
      activeMode: mode,
      // Preserve answers when staying in the same mode; clear if switching.
      answers: prev.activeMode && prev.activeMode !== mode ? {} : prev.answers,
      midpointAcknowledged:
        prev.activeMode && prev.activeMode !== mode ? undefined : prev.midpointAcknowledged,
    }))
    setCurrentIndex(0)
    setSupportOpen(false)
  }

  function selectAnswer(value: AnswerValue) {
    const currentQuestion = questions[effectiveIndex]
    if (!currentQuestion) return

    if (currentQuestion.kind === "likert") {
      setSession((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: value,
        },
      }))
      return
    }

    setSession((prev) => {
      const prior = getRankedChoiceAnswer(prev.answers[currentQuestion.id])
      const primary = String(value)
      const secondary =
        prior?.secondary && prior.secondary !== primary ? prior.secondary : undefined

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: {
            primary,
            ...(secondary ? { secondary } : {}),
          },
        },
      }
    })
  }

  function setSecondaryChoice(optionId: string) {
    const currentQuestion = questions[effectiveIndex]
    if (!currentQuestion || currentQuestion.kind === "likert") return

    setSession((prev) => {
      const currentAnswer = getRankedChoiceAnswer(prev.answers[currentQuestion.id])
      if (!currentAnswer?.primary || currentAnswer.primary === optionId) {
        return prev
      }

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: {
            primary: currentAnswer.primary,
            secondary: currentAnswer.secondary === optionId ? undefined : optionId,
          },
        },
      }
    })
  }

  function goBack() {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
    setSupportOpen(false)
  }

  function goNext() {
    // After section 1 — and only on a clean forward step in Standard — show
    // the midpoint preview interstitial once.
    if (
      session.activeMode === "standard" &&
      !session.midpointAcknowledged &&
      effectiveIndex === foundationMidpointQuestionIndex
    ) {
      setShowMidpoint(true)
      return
    }
    setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
    setSupportOpen(false)
  }

  function continueFromMidpoint() {
    setSession((prev) => ({ ...prev, midpointAcknowledged: true }))
    setShowMidpoint(false)
    setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
    setSupportOpen(false)
  }

  function goToReview() {
    router.push("/quiz/review")
  }

  function resetQuiz() {
    setSession({ ...createEmptySession(), activeMode: "standard" })
    setCurrentIndex(0)
    setSupportOpen(false)
    setShowMidpoint(false)
    window.localStorage.removeItem(QUIZ_STORAGE_KEY)
    notifyQuizSessionUpdated()
  }

  if (!ready || !session.activeMode) {
    return <div className="panel" style={{ padding: "40px" }}>Loading your draft…</div>
  }

  const currentQuestion = questions[effectiveIndex]
  const completedCount = questions.filter((question) => session.answers[question.id] !== undefined).length
  const progress = questions.length === 0 ? 0 : Math.round((completedCount / questions.length) * 100)
  const isComplete = questions.length > 0 && completedCount === questions.length
  const currentPrimarySelection =
    currentQuestion && currentQuestion.kind !== "likert"
      ? getPrimarySelection(session.answers[currentQuestion.id])
      : undefined
  const currentSecondarySelection =
    currentQuestion && currentQuestion.kind !== "likert"
      ? getSecondarySelection(session.answers[currentQuestion.id])
      : undefined
  const hasCurrentAnswer =
    currentQuestion?.kind === "likert"
      ? session.answers[currentQuestion.id] !== undefined
      : Boolean(currentPrimarySelection)
  const completionAction = isComplete
    ? fromReview
      ? "return-to-review"
      : "go-to-review"
    : null
  const supportVisible = session.contextAssist || supportOpen
  const currentSection =
    session.activeMode === "standard" && currentQuestion
      ? getFoundationSectionForQuestionId(currentQuestion.id)
      : undefined

  if (showMidpoint) {
    return (
      <MidpointPreview
        answers={session.answers}
        onContinue={continueFromMidpoint}
      />
    )
  }

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <div className="stack-sm">
          <p className="eyebrow">IR Worldview Inventory</p>
          <div className="row gap-sm wrap center" style={{ justifyContent: "space-between" }}>
            <div className="stack-xs">
              <h1>Foundation</h1>
              <p className="muted" style={{ lineHeight: "1.65" }}>
                {session.activeMode === "standard"
                  ? `${questionCountsByMode.standard} questions · about ${foundationTimeEstimateByMode.standard}.`
                  : `${questionCountsByMode.analyst} questions · about ${foundationTimeEstimateByMode.analyst} · more cross-pressure cases and actor-lens questions.`}
              </p>
            </div>
            <span className="mode-pill">{modeLabel(session.activeMode)}</span>
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

        <div className="row gap-sm wrap center quiz-controls-row">
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
          {session.activeMode === "standard" ? (
            <button
              type="button"
              className="quiz-mode-link"
              onClick={() => {
                if (
                  Object.keys(session.answers).length === 0 ||
                  window.confirm(
                    "Switching to Analyst mode will clear your current answers. Continue?",
                  )
                ) {
                  switchMode("analyst")
                }
              }}
            >
              Switch to Analyst mode →
            </button>
          ) : (
            <button
              type="button"
              className="quiz-mode-link"
              onClick={() => {
                if (
                  Object.keys(session.answers).length === 0 ||
                  window.confirm(
                    "Switching back to Standard mode will clear your current Analyst answers. Continue?",
                  )
                ) {
                  switchMode("standard")
                }
              }}
            >
              ← Back to Standard mode
            </button>
          )}
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

          {currentSection ? (
            <p className="quiz-section-marker">
              Part {currentSection.index} of {foundationSectionTotal} — {currentSection.title}
            </p>
          ) : null}

          <div className="quiz-question-frame" key={currentQuestion.id}>
            <div className="stack-xs">
              <p className="eyebrow">
                {questionLabel(currentQuestion)} · {effectiveIndex + 1} of {questions.length}
              </p>
              <h2>{currentQuestion.prompt}</h2>
            </div>

            {currentQuestion.kind !== "likert" ? (
              <div className="callout stack-sm">
                <div className="stack-xs">
                  <p className="eyebrow">How to answer this card</p>
                  <p style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>
                    {choiceInstructionCopy(currentQuestion)}
                  </p>
                  <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.84rem" }}>
                    Do not answer based on what sounds most publicly defensible, what another actor
                    in the case would prefer, or what officials currently say unless that is also
                    your own judgment.
                  </p>
                  {session.activeMode === "analyst" && currentQuestion.allowSecondChoiceInAnalyst ? (
                    <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.84rem" }}>
                      In Advanced mode, you can also mark a backup answer if a second option still
                      seems plausible.
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

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
                  const selected = currentPrimarySelection === option.id
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

                {session.activeMode === "analyst" && currentQuestion.allowSecondChoiceInAnalyst && currentPrimarySelection ? (
                  <div className="callout stack-sm">
                    <div className="stack-xs">
                      <p className="eyebrow">Second-most persuasive</p>
                      <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
                        Use this only when another option also captures part of your analytic
                        judgment. It counts less than your main choice.
                      </p>
                    </div>
                    <div className="module-secondary-grid">
                      {currentQuestion.options
                        .filter((option) => option.id !== currentPrimarySelection)
                        .map((option) => {
                          const selected = currentSecondarySelection === option.id
                          return (
                            <button
                              key={option.id}
                              type="button"
                              className={selected ? "secondary-choice-button selected" : "secondary-choice-button"}
                              onClick={() => setSecondaryChoice(option.id)}
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
              </div>
            )}
          </div>

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

function MidpointPreview({
  answers,
  onContinue,
}: {
  answers: QuizSession["answers"]
  onContinue: () => void
}) {
  const dimensionScores = useMemo(
    () => computeCoreDimensionScores(answers, "standard"),
    [answers],
  )
  const topTwo = useMemo(() => getTopDimensions(dimensionScores, 2), [dimensionScores])

  const firstLabel = dimensionLabels[topTwo[0]]
  const secondLabel = dimensionLabels[topTwo[1]]

  return (
    <div className="stack-lg">
      <section className="panel stack-md quiz-midpoint">
        <div className="stack-xs">
          <p className="eyebrow">{foundationStandardSections[0].title} complete</p>
          <h1 className="quiz-midpoint__h1">Your profile is starting to take shape.</h1>
        </div>
        <p className="quiz-midpoint__lead">
          You have strong pulls on{" "}
          <strong>{firstLabel}</strong> and <strong>{secondLabel}</strong>.
        </p>
        <p className="quiz-midpoint__note">
          This is a partial read based on your first answers. The remaining questions will sharpen
          it.
        </p>
        <div className="row gap-sm wrap">
          <button type="button" className="primary-button" onClick={onContinue}>
            Continue
          </button>
        </div>
      </section>
    </div>
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
          {visible ? "Hide explainer" : supportToggleLabel(question)}
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
      <p style={{ fontWeight: 600 }}>What this is really asking</p>
      <p>{clarification.whatItAsks}</p>
      {clarification.whatItDoesNotAsk ? (
        <p className="muted">{clarification.whatItDoesNotAsk}</p>
      ) : null}
      {clarification.terms && clarification.terms.length > 0 ? (
        <div className="stack-xs">
          <p style={{ fontWeight: 600 }}>Quick glossary</p>
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
  if (question.kind === "tradeoff") {
    return `Tradeoff · ${cardTypeLabel(question.cardType)}`
  }
  if (question.kind === "miniCase") {
    return `Mini-case · ${cardTypeLabel(question.cardType)}`
  }
  return "Foundation statement"
}

function hasSupport(question: Question) {
  return Boolean(question.helpText || question.clarification)
}

function supportToggleLabel(question: Question) {
  return question.clarification ? "What this is really asking" : "Quick explainer"
}

function modeLabel(mode: QuizMode) {
  return mode === "standard" ? "Standard mode" : "Analyst mode"
}

function cardTypeLabel(cardType: ChoiceCardType) {
  if (cardType === "explanation") return "Explanation"
  if (cardType === "decision") return "Decision"
  if (cardType === "actorLens") return "Actor lens"
  return "Both"
}

function choiceInstructionCopy(question: Extract<Question, { kind: "tradeoff" | "miniCase" }>) {
  if (question.cardType === "explanation") {
    return "Answer from your own analytic judgment. Choose the option that best explains what is driving the case."
  }

  if (question.cardType === "decision") {
    return "Answer from your own analytic judgment. Choose the consideration that should carry the most weight in the case."
  }

  if (question.cardType === "actorLens") {
    return "Answer from your own analytic judgment. Choose the logic that would look strongest from that actor's own strategic position, not the policy you personally prefer."
  }

  return "Answer from your own analytic judgment. Choose the option you find most persuasive overall."
}

function getPrimarySelection(answer: AnswerValue | undefined) {
  if (typeof answer === "string") return answer
  if (isRankedChoiceAnswer(answer)) return answer.primary
  return undefined
}

function getSecondarySelection(answer: AnswerValue | undefined) {
  if (isRankedChoiceAnswer(answer)) return answer.secondary
  return undefined
}

function getRankedChoiceAnswer(answer: AnswerValue | undefined): RankedChoiceAnswer | null {
  return isRankedChoiceAnswer(answer) ? answer : null
}

function isRankedChoiceAnswer(answer: AnswerValue | undefined): answer is RankedChoiceAnswer {
  return typeof answer === "object" && answer !== null && typeof answer.primary === "string"
}
