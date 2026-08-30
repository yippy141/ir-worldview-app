"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import styles from "@/components/modules/module-app.module.css"
import { DestructiveActionConfirmation } from "@/components/ui/destructive-action-confirmation"
import { markProfileSaveIntent } from "@/lib/profile-save-intent"
import {
  countAnsweredModuleQuestions,
  countAnsweredModuleQuestionsByLane,
  encodeModulePayload,
  getModuleDefinition,
  getModulePerspectiveCoverage,
  getModuleQuestions,
  moduleAllowsSecondChoice,
} from "@/lib/modules/framework"
import { getCurrentModuleVersion } from "@/lib/modules/versions"
import {
  ACTOR_LENS_INSTRUCTION,
  hasPerspectiveBankCapability,
} from "@/lib/modules/perspective-bank"
import { loadProfileStore, type FoundationSnapshot } from "@/lib/profile-store"
import { resolveFoundationPayload } from "@/lib/share"
import type {
  ModuleAnswers,
  ModuleDefinition,
  ModuleLane,
  ModuleSlug,
} from "@/lib/modules/types"
import type { ChoiceCardType, QuizMode } from "@/lib/types"
import {
  createOptionOrderSeed,
  getSeededOptionOrder,
} from "@/lib/option-order"
import {
  clearModuleDraft,
  createModuleDraft,
  loadModuleDraft,
  loadSelectedModuleMode,
  saveModuleDraft,
  type ModuleDraftContext,
  type ModuleDraftStage,
} from "@/lib/modules/drafts"

const MODULE_LOCALE = "en"

export function ModuleApp({
  slug,
  foundationPayload,
}: {
  slug: ModuleSlug
  foundationPayload?: string
}) {
  const router = useRouter()
  const moduleDefinition = getModuleDefinition(slug)
  const currentVersion = moduleDefinition ? getCurrentModuleVersion(slug) : null
  const [mode, setMode] = useState<QuizMode>("standard")
  const [answers, setAnswers] = useState<ModuleAnswers>({})
  const [orderSeed, setOrderSeed] = useState("")
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null)
  const [stage, setStage] = useState<ModuleDraftStage>("questions")
  const [draftReady, setDraftReady] = useState(false)
  const [deviceFoundation, setDeviceFoundation] = useState<FoundationSnapshot | null>(null)
  const pendingFocusTarget = useRef<"question" | "review" | null>(null)
  const questionHeadingRef = useRef<HTMLHeadingElement>(null)
  const reviewHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!moduleDefinition || !currentVersion) return

    const selectedMode = loadSelectedModuleMode(
      window.localStorage,
      slug,
      MODULE_LOCALE,
    ) ?? "standard"
    const context = buildDraftContext(
      slug,
      selectedMode,
      moduleDefinition,
      currentVersion.bankVersion,
      currentVersion.scoringVersion,
    )
    const draft = loadModuleDraft(window.localStorage, context)
      ?? createModuleDraft(context, createOptionOrderSeed())

    const timeout = window.setTimeout(() => {
      if (draft.stage === "review" || Object.keys(draft.answers).length > 0) {
        pendingFocusTarget.current = draft.stage === "review" ? "review" : "question"
      }
      setMode(selectedMode)
      setAnswers(draft.answers)
      setOrderSeed(draft.orderSeed)
      setCurrentQuestionId(draft.currentQuestionId)
      setStage(draft.stage)
      setDraftReady(true)
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [currentVersion, moduleDefinition, slug])

  useEffect(() => {
    const load = () => setDeviceFoundation(loadProfileStore().foundation)

    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  useEffect(() => {
    const targetName = pendingFocusTarget.current
    if (!targetName) return

    const target = targetName === "question"
      ? questionHeadingRef.current
      : reviewHeadingRef.current
    if (!target) return

    pendingFocusTarget.current = null
    target.focus({ preventScroll: true })
    const stickyHeader = document.querySelector<HTMLElement>(".quiz-shell-header")
    if (stickyHeader) {
      const headerBottom = stickyHeader.getBoundingClientRect().bottom
      target.style.scrollMarginTop = `${Math.ceil(headerBottom + 12)}px`
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    })
  }, [currentQuestionId, stage])

  const questions = useMemo(
    () => (moduleDefinition ? getModuleQuestions(moduleDefinition, mode) : []),
    [mode, moduleDefinition],
  )

  useEffect(() => {
    if (!draftReady || !moduleDefinition || !currentVersion || !orderSeed) return

    const context = buildDraftContext(
      slug,
      mode,
      moduleDefinition,
      currentVersion.bankVersion,
      currentVersion.scoringVersion,
    )
    saveModuleDraft(window.localStorage, {
      v: 1,
      slug,
      locale: MODULE_LOCALE,
      mode,
      bankVersion: currentVersion.bankVersion,
      scoringVersion: currentVersion.scoringVersion,
      orderSeed,
      answers,
      currentQuestionId: stage === "review" ? null : currentQuestionId,
      stage,
      updatedAt: Date.now(),
    })
  }, [
    answers,
    currentQuestionId,
    currentVersion,
    draftReady,
    mode,
    moduleDefinition,
    orderSeed,
    slug,
    stage,
  ])

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
  const linkedFoundation = useMemo(() => {
    if (!foundationPayload) return null

    const resolved = resolveFoundationPayload(foundationPayload)
    if (!resolved) return null

    return {
      payload: foundationPayload,
      familyLabel: resolved.result.familyLabel,
      strategyModifier: resolved.result.strategyModifier,
      normativeModifier: resolved.result.normativeModifier,
      summary: resolved.result.explanation,
    }
  }, [foundationPayload])

  if (!moduleDefinition) {
    return null
  }
  const activeModuleDefinition = moduleDefinition

  if (!draftReady || !orderSeed) {
    return <div className="panel" style={{ padding: "40px" }}>Loading your draft…</div>
  }

  const standardQuestionCount = moduleDefinition.questionsByMode.standard.length
  const analystQuestionCount = moduleDefinition.questionsByMode.analyst.length
  const analystAdditionCount = analystQuestionCount - standardQuestionCount
  const currentFoundationPayload = foundationPayload ?? deviceFoundation?.payload
  const modulesLandingPath = foundationPayload
    ? `/modules?foundation=${encodeURIComponent(foundationPayload)}`
    : "/modules"
  const currentFoundation = deviceFoundation
    ? {
        familyLabel: deviceFoundation.familyLabel,
        strategyModifier: deviceFoundation.strategyModifier,
        normativeModifier: deviceFoundation.normativeModifier,
        summary: deviceFoundation.summary,
        source: "device" as const,
      }
    : linkedFoundation
      ? {
          familyLabel: linkedFoundation.familyLabel,
          strategyModifier: linkedFoundation.strategyModifier,
          normativeModifier: linkedFoundation.normativeModifier,
          summary: linkedFoundation.summary,
          source: "linked" as const,
        }
      : null

  const progress = questions.length === 0 ? 0 : Math.round((completedCount / questions.length) * 100)
  const ready = questions.length > 0 && completedCount === questions.length
  const usesPerspectiveBankExperience = Boolean(
    currentVersion &&
      hasPerspectiveBankCapability({
        slug,
        bankVersion: currentVersion.bankVersion,
      }),
  )

  function handleModeChange(nextMode: QuizMode) {
    if (nextMode === mode || !currentVersion) return
    const context = buildDraftContext(
      slug,
      nextMode,
      activeModuleDefinition,
      currentVersion.bankVersion,
      currentVersion.scoringVersion,
    )
    const draft = loadModuleDraft(window.localStorage, context)
      ?? createModuleDraft(context, createOptionOrderSeed())

    setMode(nextMode)
    setAnswers(draft.answers)
    setOrderSeed(draft.orderSeed)
    setCurrentQuestionId(draft.currentQuestionId)
    setStage(draft.stage)
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
    if (!currentVersion || !ready || stage !== "review") return
    const payload = encodeModulePayload({
      v: 3,
      bv: currentVersion.bankVersion,
      sv: currentVersion.scoringVersion,
      slug,
      mode,
      answers,
    })

    const query = currentFoundationPayload ? `?foundation=${encodeURIComponent(currentFoundationPayload)}` : ""
    const resultPath = `/modules/${slug}/results/${payload}${query}`
    markProfileSaveIntent("module", resultPath)
    router.push(resultPath)
  }

  function handleReset() {
    if (!currentVersion) return
    const context = buildDraftContext(
      slug,
      mode,
      activeModuleDefinition,
      currentVersion.bankVersion,
      currentVersion.scoringVersion,
    )
    clearModuleDraft(window.localStorage, context)
    const next = createModuleDraft(context, createOptionOrderSeed())
    setAnswers(next.answers)
    setOrderSeed(next.orderSeed)
    setCurrentQuestionId(next.currentQuestionId)
    setStage(next.stage)
  }

  const currentQuestionIndex = Math.max(
    0,
    questions.findIndex((question) => question.id === currentQuestionId),
  )
  const currentQuestion = questions[currentQuestionIndex] ?? null
  const currentLane = currentQuestion
    ? moduleDefinition.lanes.find((lane) => lane.key === currentQuestion.lane) ?? null
    : null
  const primarySelection = currentQuestion
    ? answers[currentQuestion.id]?.primary
    : undefined
  const secondarySelection = currentQuestion
    ? answers[currentQuestion.id]?.secondary
    : undefined
  const presentedOptions = currentQuestion
    ? getSeededOptionOrder(currentQuestion.options, orderSeed, currentQuestion.id)
    : []
  const showSecondChoice = Boolean(
    currentQuestion &&
      (!usesPerspectiveBankExperience || mode === "analyst") &&
      moduleAllowsSecondChoice(currentQuestion) &&
      primarySelection,
  )

  function moveToQuestion(index: number) {
    const nextQuestion = questions[index]
    if (!nextQuestion) return
    pendingFocusTarget.current = "question"
    setCurrentQuestionId(nextQuestion.id)
    setStage("questions")
  }

  function handleNext() {
    if (!currentQuestion || !answers[currentQuestion.id]?.primary) return
    if (currentQuestionIndex < questions.length - 1) {
      moveToQuestion(currentQuestionIndex + 1)
      return
    }
    if (ready) {
      pendingFocusTarget.current = "review"
      setCurrentQuestionId(null)
      setStage("review")
      return
    }
    const firstUnansweredIndex = questions.findIndex(
      (question) => !answers[question.id]?.primary,
    )
    if (firstUnansweredIndex >= 0) moveToQuestion(firstUnansweredIndex)
  }

  return (
    <div className="stack-xl">
      <section className="panel stack-md">
        <div className="stack-sm">
          <p className="eyebrow">Focus-area module</p>
          <h1>{moduleDefinition.title}</h1>
          <p className="muted" style={{ lineHeight: "1.7", maxWidth: "760px" }}>
            <strong>{moduleDefinition.subtitle}.</strong> {moduleDefinition.description}
          </p>
        </div>

        <section className="module-linkage-strip" aria-label="Foundation linkage">
          <div className="stack-xs">
            <p className="module-linkage-kicker">Foundation linkage</p>
            {currentFoundation ? (
              <p className="module-linkage-title">
                {currentFoundation.familyLabel}
                {currentFoundation.source === "device" ? " on this device" : ""}
              </p>
            ) : (
              <p className="module-linkage-title">No saved Foundation baseline yet</p>
            )}
            <p className="module-linkage-text">
              {currentFoundation
                ? `${currentFoundation.strategyModifier} · ${currentFoundation.normativeModifier}`
                : "This module can be completed independently and saved beside a later Foundation."}
            </p>
          </div>
          <p className="module-linkage-strip-text">
            This module records a separate {moduleDefinition.shortTitle.toLowerCase()} read across
            {" "}
            {moduleDefinition.lanes.map((lane) => lane.label).join(", ")}. A linked Foundation is
            kept for provenance and navigation; its dimensions and archetype remain unchanged.
          </p>
        </section>

        <div className="stack-sm">
          <div className="stack-xs">
            <p className="eyebrow">Mode</p>
            <p className="muted" style={{ lineHeight: "1.65", maxWidth: "760px" }}>
              Standard uses {standardQuestionCount} questions. Advanced adds{" "}
              {usesPerspectiveBankExperience ? (
                <>
                  {analystAdditionCount} additional cases, for {analystQuestionCount} in total.
                  Choose one main answer in either mode; in Advanced, optionally mark one
                  second-most persuasive choice.
                </>
              ) : (
                <>
                  {analystAdditionCount} cases and actor-position questions, for{" "}
                  {analystQuestionCount} in total. In either mode, choose one main answer per case
                  and add a backup only when another option genuinely fits.
                </>
              )}
            </p>
          </div>
          <div className="module-mode-grid">
            <ModeCard
              selected={mode === "standard"}
              badge="S"
              title="Standard"
              description={`${standardQuestionCount} questions · ${moduleDefinition.timeEstimate.standard}`}
              onClick={() => handleModeChange("standard")}
            />
            <ModeCard
              selected={mode === "analyst"}
              badge="A"
              title="Advanced"
              description={`${analystQuestionCount} questions · ${moduleDefinition.timeEstimate.analyst}`}
              onClick={() => handleModeChange("analyst")}
            />
          </div>
        </div>

        <details className="profile-details module-scope-details">
          <summary>Scope, lanes, and how to read the cases</summary>
          <div className="module-scope-grid">
            <div className="stack-xs">
              <p className="eyebrow">What it tests</p>
              <ul className="content-list module-note-list">
                {moduleDefinition.measures.map((measure) => (
                  <li key={measure}>{measure}</li>
                ))}
              </ul>
            </div>
            <div className="stack-xs">
              <p className="eyebrow">What it does not claim</p>
              <ul className="content-list module-note-list">
                {moduleDefinition.doesNotClaim.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="stack-xs">
              <p className="eyebrow">Lanes</p>
              <div className="module-lane-grid module-lane-grid--compact">
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
            <div className="stack-xs">
              <p className="eyebrow">Reading rule</p>
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                Read the scene and tradeoff before answering. On Explanation cards, choose the
                cause that best accounts for the case. On Decision cards, choose the consideration
                that should guide the response. On Actor lens cards,{" "}
                {usesPerspectiveBankExperience
                  ? "choose which instrument best fits the actor’s stated objectives and constraints. Understanding that logic is not an endorsement of the actor, its objectives, or the action."
                  : "choose the logic that actor would find strongest."}
              </p>
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                {usesPerspectiveBankExperience
                  ? "Answer from your analytic judgment. In Advanced, if two options fit, make one your main choice and mark the other as secondary."
                  : "Answer from your analytic judgment. If two options fit, make one your main choice and mark the other as secondary."}
              </p>
            </div>
          </div>
          <p className="module-coverage-line">
            Perspective coverage in the full set: {perspectiveCoverage.map((role) => role.label).join(" · ")}
          </p>
        </details>

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

      {stage === "questions" && currentQuestion && currentLane ? (
        <section className="panel stack-md quiz-question-frame" key={currentQuestion.id}>
          <div className={styles.questionHeader}>
            <div className="stack-xs">
              <p className="eyebrow">
                {currentLane.label} · {cardTypeLabel(currentQuestion.cardType)}
              </p>
              <h2
                ref={questionHeadingRef}
                className={styles.focusHeading}
                tabIndex={-1}
              >
                {currentQuestion.title}
              </h2>
            </div>
            <p className={styles.questionCount} aria-live="polite">
              {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>

          <div className="module-case-frame stack-sm">
            <div className="stack-xs">
              <p className="eyebrow">Scene</p>
              <p style={{ lineHeight: "1.7", maxWidth: "880px" }}>{currentQuestion.scene}</p>
            </div>
            <div className="callout stack-xs">
              <p className="eyebrow">What makes this hard</p>
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                {currentQuestion.whyHard}
              </p>
            </div>
            <div className="stack-xs">
              <p className="eyebrow">Question</p>
              <p style={{ lineHeight: "1.7", maxWidth: "880px" }}>{currentQuestion.prompt}</p>
            </div>
            {currentQuestion.contextBullets && currentQuestion.contextBullets.length > 0 ? (
              <details className="profile-details">
                <summary>Optional context</summary>
                <div className="stack-xs">
                  {currentQuestion.contextBullets.map((bullet) => (
                    <p
                      key={`${currentQuestion.id}-${bullet.label}`}
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
              {moduleInstructionCopy(
                currentQuestion.cardType,
                usesPerspectiveBankExperience,
              )}
            </p>
          </div>

          <div className="stack-sm">
            {presentedOptions.map((option, optionIndex) => {
              const selected = primarySelection === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  className={selected ? "option-card selected" : "option-card"}
                  onClick={() => setPrimary(currentQuestion.id, option.id)}
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
                  Mark another option only when it captures part of your judgment. It receives
                  less weight than your main choice.
                </p>
              </div>
              <div className="module-secondary-grid">
                {presentedOptions
                  .filter((option) => option.id !== primarySelection)
                  .map((option) => {
                    const selected = secondarySelection === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={selected ? "secondary-choice-button selected" : "secondary-choice-button"}
                        onClick={() => setSecondary(currentQuestion.id, option.id)}
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

          <nav className={styles.questionNavigation} aria-label="Question navigation">
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                if (currentQuestionIndex === 0) {
                  router.push(modulesLandingPath)
                  return
                }
                moveToQuestion(currentQuestionIndex - 1)
              }}
            >
              Back
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={handleNext}
              disabled={!primarySelection}
            >
              {currentQuestionIndex === questions.length - 1 ? "Review answers" : "Next"}
            </button>
          </nav>
        </section>
      ) : null}

      {stage === "review" ? (
        <section className="panel stack-md" aria-labelledby="module-review-heading">
          <div className="stack-xs">
            <p className="eyebrow">Review</p>
            <h2
              id="module-review-heading"
              ref={reviewHeadingRef}
              className={styles.focusHeading}
              tabIndex={-1}
            >
              Check your answers
            </h2>
            <p className="muted">
              Nothing is final yet. Change any answer before generating your result.
            </p>
          </div>
          <ol className={styles.reviewList}>
            {questions.map((question, index) => {
              const selection = answers[question.id]
              const primary = question.options.find((option) => option.id === selection?.primary)
              const secondary = question.options.find((option) => option.id === selection?.secondary)
              return (
                <li key={question.id} className={styles.reviewRow}>
                  <div className="stack-xs">
                    <p className="eyebrow">{index + 1} · {question.title}</p>
                    <p className={styles.reviewAnswer}>{primary?.title ?? "Not answered"}</p>
                    {secondary ? (
                      <p className="muted">Second choice: {secondary.title}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => moveToQuestion(index)}
                  >
                    Change
                  </button>
                </li>
              )
            })}
          </ol>
          <div className="row gap-sm wrap">
            <button type="button" className="primary-button" onClick={handleGenerate}>
              See {moduleDefinition.shortTitle} result →
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => moveToQuestion(questions.length - 1)}
            >
              Back to questions
            </button>
          </div>
        </section>
      ) : null}

      <section className="panel stack-md">
        <div className="row gap-sm wrap">
          <DestructiveActionConfirmation
            hasData={completedCount > 0}
            triggerLabel="Start over"
            prompt={`Clear only your ${mode === "analyst" ? "Advanced" : "Standard"} draft? Your other mode will remain saved.`}
            confirmLabel="Clear draft"
            cancelLabel="Keep answers"
            onConfirm={handleReset}
          />
          <button
            type="button"
            className="secondary-button"
            onClick={() => router.push(modulesLandingPath)}
          >
            Back to Focus Areas
          </button>
        </div>
        <p className="muted" style={{ fontSize: "0.82rem", lineHeight: "1.55" }}>
          Standard and Advanced drafts are kept separately on this device. Generating a result
          does not change your Foundation record.
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

function moduleInstructionCopy(
  cardType: ChoiceCardType,
  usesPerspectiveBankExperience: boolean,
) {
  if (cardType === "explanation") {
    return "Choose the option that best explains what is driving the case."
  }

  if (cardType === "decision") {
    return "Choose the consideration that should guide the response."
  }

  if (cardType === "actorLens") {
    return usesPerspectiveBankExperience
      ? ACTOR_LENS_INSTRUCTION
      : "Choose the logic this actor would find strongest. Do not substitute the policy you personally prefer."
  }

  return "Choose the option that best explains the case and should guide the response."
}

function buildDraftContext(
  slug: ModuleSlug,
  mode: QuizMode,
  moduleDefinition: ModuleDefinition,
  bankVersion: number,
  scoringVersion: number,
): ModuleDraftContext {
  const usesPerspectiveBankExperience = hasPerspectiveBankCapability({
    slug,
    bankVersion,
  })

  return {
    slug,
    locale: MODULE_LOCALE,
    mode,
    bankVersion,
    scoringVersion,
    questions: getModuleQuestions(moduleDefinition, mode),
    allowsSecondChoice: (question) =>
      (!usesPerspectiveBankExperience || mode === "analyst") &&
      moduleAllowsSecondChoice(question),
  }
}
