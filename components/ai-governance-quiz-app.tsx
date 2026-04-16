"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  AI_GOVERNANCE_STORAGE_KEY,
  aiLikertScale,
  aiQuestionCountsByMode,
  aiTotalQuestionCountsByMode,
  getAiCoreQuestions,
  getScenarioOptions,
  getScenarioPrompt,
} from "@/lib/ai-governance-schema"
import { getAiScenarioSequence } from "@/lib/ai-governance-scoring"
import type { AiAnswers, AiClarification, AiQuestion, AiQuizMode, AiRankedChoiceAnswer } from "@/lib/ai-governance-types"
import { isAiRankedChoiceAnswer } from "@/lib/ai-governance-types"
import { AiGlossaryDrawer } from "@/components/quiz/ai-glossary-drawer"

type AiQuizState = {
  started: boolean
  mode: AiQuizMode
  answers: AiAnswers
}

function parseRequestedMode(value: string | null): AiQuizMode | null {
  if (value === "standard") return "standard"
  if (value === "advanced" || value === "analyst") return "analyst"
  return null
}

function createEmptyState(): AiQuizState {
  return { started: false, mode: "standard", answers: {} }
}

function normalizeState(parsed: unknown): AiQuizState | null {
  if (typeof parsed !== "object" || parsed === null || !("answers" in parsed)) return null
  const raw = parsed as Record<string, unknown>
  return {
    started: Boolean(raw.started),
    mode: raw.mode === "analyst" ? "analyst" : "standard",
    answers: typeof raw.answers === "object" && raw.answers !== null
      ? (raw.answers as AiAnswers)
      : {},
  }
}

export function AiGovernanceQuizApp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromReview = searchParams.get("from") === "review"
  const hasIndexedQuestion = searchParams.get("q") !== null
  const initialQ = parseInt(searchParams.get("q") ?? "0", 10)
  const requestedMode = parseRequestedMode(searchParams.get("mode"))

  const [state, setState] = useState<AiQuizState>(createEmptyState())
  const [currentIndex, setCurrentIndex] = useState(
    hasIndexedQuestion && !isNaN(initialQ) ? initialQ : 0,
  )
  const [supportOpen, setSupportOpen] = useState(false)
  const [glossaryOpen, setGlossaryOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const raw = window.localStorage.getItem(AI_GOVERNANCE_STORAGE_KEY)
    const timeout = window.setTimeout(() => {
      if (raw) {
        try {
          const normalized = normalizeState(JSON.parse(raw))
          if (normalized) setState(normalized)
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
    return [...getAiCoreQuestions(state.mode), ...getAiScenarioSequence(state.answers, state.mode)]
  }, [state.started, state.mode, state.answers])

  const effectiveIndex = Math.min(currentIndex, Math.max(0, questions.length - 1))

  function start(mode: AiQuizMode) {
    setState((prev) => ({
      ...prev,
      started: true,
      mode,
      answers: prev.started && prev.mode !== mode ? {} : prev.answers,
    }))
    setCurrentIndex(0)
    setSupportOpen(false)
  }

  function setAnswer(questionId: string, value: number | "A" | "B" | "C" | "D") {
    setState((prev) => {
      const existing = prev.answers[questionId]
      // Preserve secondary if re-selecting primary on a ranked question
      const secondary =
        isAiRankedChoiceAnswer(existing) && existing.secondary !== value
          ? existing.secondary
          : undefined
      const newValue: AiAnswers[string] =
        typeof value === "number"
          ? value
          : secondary !== undefined
            ? { primary: value, secondary }
            : value
      return { ...prev, answers: { ...prev.answers, [questionId]: newValue } }
    })
  }

  function setBackupChoice(questionId: string, value: "A" | "B" | "C" | "D" | undefined) {
    setState((prev) => {
      const existing = prev.answers[questionId]
      const primaryId = isAiRankedChoiceAnswer(existing)
        ? existing.primary
        : typeof existing === "string" && ["A", "B", "C", "D"].includes(existing as string)
          ? (existing as "A" | "B" | "C" | "D")
          : undefined
      if (!primaryId) return prev
      const newValue: AiRankedChoiceAnswer = value !== undefined
        ? { primary: primaryId, secondary: value }
        : { primary: primaryId }
      return { ...prev, answers: { ...prev.answers, [questionId]: newValue } }
    })
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
    const hasDraft = Object.keys(state.answers).length > 0
    const gateMode = hasDraft ? state.mode : requestedMode ?? state.mode

    return (
      <>
        <ModeGate
          currentMode={gateMode}
          hasDraft={hasDraft}
          onStart={start}
          onReset={resetQuiz}
          onOpenGlossary={() => setGlossaryOpen(true)}
        />
        <AiGlossaryDrawer open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
      </>
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
          <div className="row gap-sm" style={{ alignItems: "center" }}>
            <p className="eyebrow">AI Governance Compass</p>
            <span className="ai-mode-pill">
              {state.mode === "analyst" ? "Advanced" : "Standard"}
            </span>
          </div>
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
          <button type="button" className="secondary-button" onClick={() => setGlossaryOpen(true)}>
            Glossary
          </button>
        </div>
      </section>

      <AiGlossaryDrawer open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />

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
            <h2>
              {currentQuestion.kind === "scenario"
                ? getScenarioPrompt(currentQuestion, state.mode)
                : currentQuestion.prompt}
            </h2>
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
              {(() => {
                const rawAnswer = state.answers[currentQuestion.id]
                const primaryId = isAiRankedChoiceAnswer(rawAnswer)
                  ? rawAnswer.primary
                  : typeof rawAnswer === "string"
                    ? (rawAnswer as "A" | "B" | "C" | "D")
                    : undefined
                const secondaryId = isAiRankedChoiceAnswer(rawAnswer) ? rawAnswer.secondary : undefined
                const scenarioOptions = getScenarioOptions(currentQuestion, state.mode)
                const showBackup =
                  state.mode === "analyst" &&
                  currentQuestion.kind === "scenario" &&
                  currentQuestion.allowBackupChoiceInAnalyst === true &&
                  primaryId !== undefined

                return (
                  <>
                    <div className="stack-sm">
                      {scenarioOptions.map((option, optionIndex) => {
                        const selected = option.id === primaryId
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

                    {showBackup ? (
                      <div className="stack-xs" style={{ marginTop: "8px" }}>
                        <p className="muted" style={{ fontSize: "0.8rem" }}>
                          Optional: which would be your backup choice?
                        </p>
                        <div className="module-secondary-grid">
                          {scenarioOptions
                            .filter((option) => option.id !== primaryId)
                            .map((option) => {
                              const isSecondary = option.id === secondaryId
                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  className={isSecondary ? "secondary-choice-button selected" : "secondary-choice-button"}
                                  aria-pressed={isSecondary}
                                  onClick={() =>
                                    setBackupChoice(
                                      currentQuestion.id,
                                      isSecondary ? undefined : option.id,
                                    )
                                  }
                                >
                                  {option.label}
                                </button>
                              )
                            })}
                        </div>
                      </div>
                    ) : null}
                  </>
                )
              })()}
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
  currentMode,
  hasDraft,
  onStart,
  onReset,
  onOpenGlossary,
}: {
  currentMode: AiQuizMode
  hasDraft: boolean
  onStart: (mode: AiQuizMode) => void
  onReset: () => void
  onOpenGlossary: () => void
}) {
  const [selectedMode, setSelectedMode] = useState<AiQuizMode>(currentMode)
  const modeChanged = hasDraft && selectedMode !== currentMode

  useEffect(() => {
    setSelectedMode(currentMode)
  }, [currentMode])

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

        <div className="stack-sm">
          <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>Choose your depth</p>
          <div className="module-mode-grid">
            <button
              type="button"
              className={selectedMode === "standard" ? "option-card selected" : "option-card"}
              onClick={() => setSelectedMode("standard")}
              aria-pressed={selectedMode === "standard"}
              style={{ textAlign: "left" }}
            >
              <span className="option-card-content">
                <span className="option-card-text" style={{ fontWeight: 600 }}>Standard</span>
                <span className="muted" style={{ display: "block", fontSize: "0.82rem", marginTop: "4px", lineHeight: "1.55" }}>
                  {aiQuestionCountsByMode.standard} statements · {aiTotalQuestionCountsByMode.standard} questions total. Plain-language prompts covering all eight governance dimensions.
                </span>
              </span>
            </button>
            <button
              type="button"
              className={selectedMode === "analyst" ? "option-card selected" : "option-card"}
              onClick={() => setSelectedMode("analyst")}
              aria-pressed={selectedMode === "analyst"}
              style={{ textAlign: "left" }}
            >
              <span className="option-card-content">
                <span className="option-card-text" style={{ fontWeight: 600 }}>Advanced</span>
                <span className="muted" style={{ display: "block", fontSize: "0.82rem", marginTop: "4px", lineHeight: "1.55" }}>
                  {aiQuestionCountsByMode.analyst} statements · {aiTotalQuestionCountsByMode.analyst} questions total. Adds materially deeper questions on audits, compute governance, incident reporting, weight security, critical infrastructure, global legitimacy, and moral-status overlays.
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="row gap-sm wrap">
          <button type="button" className="primary-button" onClick={() => onStart(selectedMode)}>
            {hasDraft && !modeChanged ? "Resume draft" : "Begin"}
          </button>
          {hasDraft ? (
            <button type="button" className="secondary-button" onClick={onReset}>
              Start over
            </button>
          ) : null}
          <button type="button" className="secondary-button" onClick={onOpenGlossary}>
            Glossary
          </button>
        </div>
        {modeChanged ? (
          <p className="muted" style={{ fontSize: "0.82rem" }}>
            Switching modes will clear your current draft.
          </p>
        ) : null}
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
