"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  getZhHansFoundationQuestionsForSet,
} from "@/content/locales/zh-Hans/foundation-instrument"
import {
  zhHansFoundationQuizUi,
  type FoundationQuizUiCopy,
} from "@/content/locales/zh-Hans/foundation-ui"
import { QuizPositionMap } from "@/components/quiz/quiz-position-map"
import { publicPath } from "@/i18n/paths"
import type { Locale } from "@/i18n/routing"
import { trackProductEvent } from "@/lib/analytics/adapter"
import {
  dimensionLabels,
  foundationCoreQuestions,
  getFoundationQuestionsForSet,
  isFoundationFamilyKey,
  likertScale,
  questionCountsBySet,
} from "@/lib/quiz-schema"
import {
  QUIZ_STORAGE_KEY,
  createEmptySession,
  notifyQuizSessionUpdated,
  parseQuizSession,
} from "@/lib/quiz-session"
import { getSeededOptionOrder } from "@/lib/option-order"
import {
  bucketItemResponseLatency,
  submitTier1CompletionStep,
} from "@/lib/research/tier1-aggregate"
import type {
  AnswerValue,
  Clarification,
  ChoiceCardType,
  FamilyKey,
  Question,
  QuizSession,
  RankedChoiceAnswer,
} from "@/lib/types"

const englishFoundationQuizUi = {
  loading: "Loading your draft…",
  eyebrow: "IR Worldview Inventory",
  title: "Foundation",
  adaptedBeta: "",
  setSummary: {
    core: `${questionCountsBySet.core} questions · about 6 to 8 minutes · followed by a provisional result.`,
    targetedExtended:
      "5 follow-up questions selected to separate your two nearest modeled families.",
    fullExtended: `${questionCountsBySet.fullExtended} additional questions · the full extended set.`,
  },
  setLabels: {
    core: "Core set",
    targetedExtended: "Targeted extension",
    fullExtended: "Full extension",
  },
  answered: (answered, total) => `${answered} of ${total} answered`,
  progressAria: "Quiz progress",
  contextAssistOn: "Context assist on",
  contextAssistOff: "Context assist off",
  startOver: "Start over",
  returnToReview: "← Return to review",
  questionProgress: (label, index, total) => `${label} · ${index} of ${total}`,
  howToAnswer: "How to answer this card",
  publicDefensibilityNote:
    "Do not answer based on what sounds most publicly defensible, what another actor in the case would prefer, or what officials currently say unless that is also your own judgment.",
  analystSecondChoiceNote:
    "In Advanced mode, you can also mark a backup answer if a second option still seems plausible.",
  stronglyDisagree: "Strongly disagree",
  stronglyAgree: "Strongly agree",
  likertAria: (value) => `${value} — ${value === 1 ? "strongly disagree" : value === 7 ? "strongly agree" : `${value} out of 7`}`,
  secondMostPersuasive: "Second-most persuasive",
  secondChoiceHelp:
    "Use this only when another option also captures part of your analytic judgment. It counts less than your main choice.",
  back: "Back",
  next: "Next",
  reviewAnswers: "Review your answers →",
  hideExplainer: "Hide explainer",
  plainLanguageExplanation: "Plain-language explanation",
  quickExplainer: "Quick explainer",
  quickGlossary: "Quick glossary",
  questionKinds: {
    likert: "Foundation statement",
    tradeoff: "Tradeoff",
    miniCase: "Mini-case",
  },
  cardTypes: {
    explanation: "Explanation",
    decision: "Decision",
    actorLens: "Actor lens",
    both: "Both",
  },
  choiceInstructions: {
    explanation: "Answer from your own analytic judgment. Choose the option that best explains what is driving the case.",
    decision: "Answer from your own analytic judgment. Choose the consideration that should carry the most weight in the case.",
    actorLens: "Answer from your own analytic judgment. Choose the logic that would look strongest from that actor's own strategic position, not the policy you personally prefer.",
    both: "Answer from your own analytic judgment. Choose the option you find most persuasive overall.",
  },
  dimensionLabels,
  positionMap: {
    label: "Your position so far",
    pending: "Your position appears after a few more answers.",
  },
} satisfies FoundationQuizUiCopy

export function QuizApp({ locale = "en" }: { locale?: Locale }) {
  const router = useRouter()
  // Annotated so optional copy keys stay reachable on every locale branch.
  const copy: FoundationQuizUiCopy =
    locale === "zh-Hans" ? zhHansFoundationQuizUi : englishFoundationQuizUi
  const searchParams = useSearchParams()
  const fromReview = searchParams.get("from") === "review"
  const hasIndexedQuestion = searchParams.get("q") !== null
  const initialQ = parseInt(searchParams.get("q") ?? "0", 10)
  const requestedExtension = searchParams.get("extension")
  const requestedFirstFamily = searchParams.get("first")
  const requestedSecondFamily = searchParams.get("second")

  const [session, setSession] = useState<QuizSession>(createEmptySession())
  const [currentIndex, setCurrentIndex] = useState(
    hasIndexedQuestion && !isNaN(initialQ) ? initialQ : 0,
  )
  const [supportOpen, setSupportOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [renderEpoch, setRenderEpoch] = useState(0)
  const foundationStartTracked = useRef(false)
  const itemVisibleAtRef = useRef<{
    itemId: string
    visibleAtMs: number
  } | null>(null)
  const completionStepsSent = useRef(new Set<string>())

  useEffect(() => {
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY)
    const parsed = parseQuizSession(raw)
    const timeout = window.setTimeout(() => {
      if (!parsed && raw) {
        window.localStorage.removeItem(QUIZ_STORAGE_KEY)
      }

      const baseSession = parsed ?? {
        ...createEmptySession(),
        activeMode: "standard" as const,
      }
      const hasCompleteCore = foundationCoreQuestions.every(
        (question) => baseSession.answers[question.id] !== undefined,
      )
      const requestedPair = getRequestedFamilyPair(
        requestedFirstFamily,
        requestedSecondFamily,
      )

      if (
        requestedExtension === "targeted" &&
        requestedPair &&
        hasCompleteCore
      ) {
        setSession({
          ...baseSession,
          activeMode: "analyst",
          questionSet: "targetedExtended",
          targetedFamilyPair: requestedPair,
        })
      } else if (requestedExtension === "full" && hasCompleteCore) {
        setSession({
          ...baseSession,
          activeMode: "analyst",
          questionSet: "fullExtended",
          targetedFamilyPair: undefined,
        })
      } else if (
        baseSession.questionSet === "targetedExtended" &&
        !baseSession.targetedFamilyPair
      ) {
        setSession({
          ...baseSession,
          activeMode: "standard",
          questionSet: "core",
        })
      } else {
        setSession({
          ...baseSession,
          activeMode: baseSession.activeMode ?? "standard",
        })
      }
      setReady(true)
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [requestedExtension, requestedFirstFamily, requestedSecondFamily])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(session))
    notifyQuizSessionUpdated()
  }, [ready, session])

  const questions = useMemo(
    () => locale === "zh-Hans"
      ? getZhHansFoundationQuestionsForSet(
          session.questionSet,
          session.targetedFamilyPair,
        )
      : getFoundationQuestionsForSet(
          session.questionSet,
          session.targetedFamilyPair,
        ),
    [locale, session.questionSet, session.targetedFamilyPair],
  )
  const effectiveIndex = Math.min(currentIndex, Math.max(0, questions.length - 1))
  const currentQuestion = questions[effectiveIndex]
  const currentQuestionId = currentQuestion?.id
  const currentQuestionHasAnswer = currentQuestionId
    ? session.answers[currentQuestionId] !== undefined
    : false

  useEffect(() => {
    if (!ready || !currentQuestionId) return

    // The render timestamp is ephemeral. Only the derived bucket is persisted.
    itemVisibleAtRef.current = {
      itemId: currentQuestionId,
      visibleAtMs: window.performance.now(),
    }
  }, [currentQuestionId, effectiveIndex, ready, renderEpoch, session.questionSet])

  useEffect(() => {
    if (
      !ready ||
      !currentQuestionId ||
      currentQuestionHasAnswer
    ) {
      return
    }

    const stepKey = `${session.questionSet}:${effectiveIndex}`
    if (completionStepsSent.current.has(stepKey)) return

    completionStepsSent.current.add(stepKey)
    void submitTier1CompletionStep(session.questionSet, effectiveIndex)
  }, [
    currentQuestionHasAnswer,
    currentQuestionId,
    effectiveIndex,
    ready,
    renderEpoch,
    session.questionSet,
  ])

  function updateSession(patch: Partial<QuizSession>) {
    setSession((prev) => ({ ...prev, ...patch }))
  }

  function selectAnswer(value: AnswerValue) {
    const currentQuestion = questions[effectiveIndex]
    if (!currentQuestion) return
    const visibleItem = itemVisibleAtRef.current
    const latencyBucket = visibleItem?.itemId === currentQuestion.id
      ? bucketItemResponseLatency(
          window.performance.now() - visibleItem.visibleAtMs,
        )
      : undefined

    if (!foundationStartTracked.current && Object.keys(session.answers).length === 0) {
      foundationStartTracked.current = true
      trackProductEvent("foundation_started")
    }

    if (currentQuestion.kind === "likert") {
      setSession((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: value,
        },
        itemLatencyBuckets: latencyBucket === undefined
          ? prev.itemLatencyBuckets
          : {
              ...prev.itemLatencyBuckets,
              [currentQuestion.id]: latencyBucket,
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
        itemLatencyBuckets: latencyBucket === undefined
          ? prev.itemLatencyBuckets
          : {
              ...prev.itemLatencyBuckets,
              [currentQuestion.id]: latencyBucket,
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
    setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
    setSupportOpen(false)
  }

  function goToReview() {
    router.push(publicPath(locale, "/quiz/review"))
  }

  function resetQuiz() {
    setSession({ ...createEmptySession(), activeMode: "standard" })
    setCurrentIndex(0)
    setSupportOpen(false)
    foundationStartTracked.current = false
    itemVisibleAtRef.current = null
    completionStepsSent.current.clear()
    setRenderEpoch((epoch) => epoch + 1)
    window.localStorage.removeItem(QUIZ_STORAGE_KEY)
    notifyQuizSessionUpdated()
  }

  if (!ready || !session.activeMode) {
    return <div className="panel" style={{ padding: "40px" }}>{copy.loading}</div>
  }

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
  const presentedChoiceOptions =
    currentQuestion && currentQuestion.kind !== "likert"
      ? getSeededOptionOrder(
          currentQuestion.options,
          session.orderSeed,
          currentQuestion.id,
        )
      : []

  return (
    <div className="stack-lg">
      <section
        className={
          copy.positionMap ? "panel quiz-header quiz-header--with-map" : "panel quiz-header"
        }
      >
        <div className="quiz-header__main stack-md">
          <div className="stack-sm">
            <p className="eyebrow">{copy.eyebrow}</p>
            <div className="row gap-sm wrap center" style={{ justifyContent: "space-between" }}>
              <div className="stack-xs">
                <h1>{copy.title}</h1>
                <p className="muted" style={{ lineHeight: "1.65" }}>
                  {copy.setSummary[session.questionSet]}
                </p>
                {copy.adaptedBeta ? (
                  <p className="muted" style={{ fontSize: "0.82rem" }}>{copy.adaptedBeta}</p>
                ) : null}
              </div>
              <span className="mode-pill">{copy.setLabels[session.questionSet]}</span>
            </div>
          </div>

          <div className="stack-xs">
            <div className="progress-meta">
              <span>{copy.answered(completedCount, questions.length)}</span>
              <span>{progress}%</span>
            </div>
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={copy.progressAria}
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
              {session.contextAssist ? copy.contextAssistOn : copy.contextAssistOff}
            </button>
            <button type="button" className="secondary-button" onClick={resetQuiz}>
              {copy.startOver}
            </button>
          </div>
        </div>

        {copy.positionMap ? (
          <QuizPositionMap
            answers={session.answers}
            mode={session.activeMode}
            answeredCount={completedCount}
            copy={copy.positionMap}
          />
        ) : null}
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
                {copy.returnToReview}
              </button>
            </div>
          ) : null}

          <div className="quiz-question-frame" key={currentQuestion.id}>
            <div className="stack-xs">
              <p className="eyebrow">
                {copy.questionProgress(
                  questionLabel(currentQuestion, copy),
                  effectiveIndex + 1,
                  questions.length,
                )}
              </p>
              <h2>{currentQuestion.prompt}</h2>
            </div>

            {currentQuestion.kind !== "likert" ? (
              <div className="callout stack-sm">
                <div className="stack-xs">
                  <p className="eyebrow">{copy.howToAnswer}</p>
                  <p style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>
                    {copy.choiceInstructions[currentQuestion.cardType]}
                  </p>
                  <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.84rem" }}>
                    {copy.publicDefensibilityNote}
                  </p>
                  {session.activeMode === "analyst" && currentQuestion.allowSecondChoiceInAnalyst ? (
                    <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.84rem" }}>
                      {copy.analystSecondChoiceNote}
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
                copy={copy}
              />
            ) : null}

            {currentQuestion.kind === "likert" ? (
              <div className="stack-sm">
                <div className="likert-labels">
                  <span>{copy.stronglyDisagree}</span>
                  <span>{copy.stronglyAgree}</span>
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
                        aria-label={copy.likertAria(value)}
                      >
                        {value}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="stack-sm">
                {presentedChoiceOptions.map((option, optionIndex) => {
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
                      <p className="eyebrow">{copy.secondMostPersuasive}</p>
                      <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
                        {copy.secondChoiceHelp}
                      </p>
                    </div>
                    <div className="module-secondary-grid">
                      {presentedChoiceOptions
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
                  {copy.back}
                </button>
                <button type="button" className="primary-button" onClick={goToReview}>
                  {completionAction === "return-to-review"
                    ? copy.returnToReview.replace(/^←\s*/, "")
                    : copy.reviewAnswers}
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
                  {copy.back}
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={goNext}
                  disabled={!hasCurrentAnswer || effectiveIndex === questions.length - 1}
                >
                  {copy.next}
                </button>
              </>
            )}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function SupportBlock({
  question,
  visible,
  autoShown,
  onToggle,
  copy,
}: {
  question: Question
  visible: boolean
  autoShown: boolean
  onToggle: () => void
  copy: FoundationQuizUiCopy
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
          {visible ? copy.hideExplainer : supportToggleLabel(question, copy)}
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
            <ClarificationCopy clarification={question.clarification} copy={copy} />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function ClarificationCopy({
  clarification,
  copy,
}: {
  clarification: Clarification
  copy: FoundationQuizUiCopy
}) {
  return (
    <div className="stack-xs">
      <p style={{ fontWeight: 600 }}>{copy.plainLanguageExplanation}</p>
      <p>{clarification.whatItAsks}</p>
      {clarification.whatItDoesNotAsk ? (
        <p className="muted">{clarification.whatItDoesNotAsk}</p>
      ) : null}
      {clarification.terms && clarification.terms.length > 0 ? (
        <div className="stack-xs">
          <p style={{ fontWeight: 600 }}>{copy.quickGlossary}</p>
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

function questionLabel(question: Question, copy: FoundationQuizUiCopy) {
  if (question.kind === "likert") return copy.questionKinds.likert
  return `${copy.questionKinds[question.kind]} · ${copy.cardTypes[question.cardType]}`
}

function hasSupport(question: Question) {
  return Boolean(question.helpText || question.clarification)
}

function supportToggleLabel(question: Question, copy: FoundationQuizUiCopy) {
  return question.clarification ? copy.plainLanguageExplanation : copy.quickExplainer
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

function getRequestedFamilyPair(
  first: string | null,
  second: string | null,
): [FamilyKey, FamilyKey] | undefined {
  if (
    !isFoundationFamilyKey(first) ||
    !isFoundationFamilyKey(second) ||
    first === second
  ) {
    return undefined
  }

  return [first, second]
}
