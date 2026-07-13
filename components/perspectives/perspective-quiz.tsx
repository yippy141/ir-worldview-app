"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { situationLabel } from "@/lib/perspectives/situations"
import { getPerspectiveDefinition, isPerspectiveId } from "@/lib/perspectives/catalog"
import {
  encodePerspectivePayload,
  perspectiveDimensionScoresToTuple,
} from "@/lib/perspectives/share"
import type {
  PerspectiveAnswers,
  PerspectiveDefinition,
  PerspectiveId,
} from "@/lib/perspectives/types"
import { loadProfileStore } from "@/lib/profile-store"
import type { DimensionScores } from "@/lib/types"

export const PERSPECTIVE_DRAFT_KEY = "ir-perspective-drafts-v1"

type PerspectiveDraft = {
  scenarioSetVersion: number
  answers: PerspectiveAnswers
  updatedAt: number
}

type DraftStore = Record<string, PerspectiveDraft>

const MAX_DRAFT_TIMESTAMP = 8_640_000_000_000_000

type Stage = "start" | "scenario" | "review"

type BaselineState =
  | { status: "loading" }
  | { status: "absent" }
  | { status: "present"; scores: DimensionScores }

function readDrafts(): DraftStore {
  try {
    const raw = window.localStorage.getItem(PERSPECTIVE_DRAFT_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : null
    return normalizeDraftStore(parsed)
  } catch {
    return {}
  }
}

function writeDraft(perspectiveId: string, draft: PerspectiveDraft | null): boolean {
  try {
    const drafts = readDrafts()
    if (draft) {
      drafts[perspectiveId] = draft
    } else {
      delete drafts[perspectiveId]
    }
    window.localStorage.setItem(PERSPECTIVE_DRAFT_KEY, JSON.stringify(drafts))
    return true
  } catch {
    return false
  }
}

function normalizeDraftStore(value: unknown): DraftStore {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {}

  const drafts: DraftStore = {}
  for (const [perspectiveId, rawDraft] of Object.entries(value)) {
    if (!isPerspectiveId(perspectiveId)) continue
    if (typeof rawDraft !== "object" || rawDraft === null || Array.isArray(rawDraft)) continue

    const candidate = rawDraft as Record<string, unknown>
    if (
      !Number.isInteger(candidate.scenarioSetVersion) ||
      (candidate.scenarioSetVersion as number) < 1 ||
      !Number.isInteger(candidate.updatedAt) ||
      (candidate.updatedAt as number) < 0 ||
      (candidate.updatedAt as number) > MAX_DRAFT_TIMESTAMP ||
      typeof candidate.answers !== "object" ||
      candidate.answers === null ||
      Array.isArray(candidate.answers)
    ) {
      continue
    }

    const answers = Object.fromEntries(
      Object.entries(candidate.answers).filter(
        ([scenarioId, optionId]) =>
          scenarioId.length > 0 && typeof optionId === "string" && optionId.length > 0,
      ),
    )
    drafts[perspectiveId] = {
      scenarioSetVersion: candidate.scenarioSetVersion as number,
      answers,
      updatedAt: candidate.updatedAt as number,
    }
  }
  return drafts
}

export function PerspectiveQuiz({ perspectiveId }: { perspectiveId: PerspectiveId }) {
  const router = useRouter()
  const definition = useMemo(
    () => getPerspectiveDefinition(perspectiveId),
    [perspectiveId],
  )

  const [baseline, setBaseline] = useState<BaselineState>({ status: "loading" })
  const [answers, setAnswers] = useState<PerspectiveAnswers>({})
  const [stage, setStage] = useState<Stage>("start")
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [returnToReview, setReturnToReview] = useState(false)
  const [draftDiscarded, setDraftDiscarded] = useState(false)
  const [draftStorageError, setDraftStorageError] = useState(false)
  const [ready, setReady] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generationError, setGenerationError] = useState(false)

  useEffect(() => {
    if (!definition) return

    const restore = () => {
      const foundation = loadProfileStore().foundation
      setBaseline(
        foundation
          ? { status: "present", scores: foundation.dimensionScores }
          : { status: "absent" },
      )

      const draft = readDrafts()[definition.id]
      if (draft) {
        if (draft.scenarioSetVersion === definition.scenarioSetVersion) {
          const valid = Object.fromEntries(
            Object.entries(draft.answers).filter(([scenarioId, optionId]) => {
              const scenario = definition.scenarios.find((candidate) => candidate.id === scenarioId)
              return scenario?.options.some((option) => option.id === optionId)
            }),
          )
          setAnswers(valid)
          const firstUnanswered = definition.scenarios.findIndex(
            (scenario) => valid[scenario.id] === undefined,
          )
          if (firstUnanswered === -1) {
            setStage("review")
          } else {
            setStage(firstUnanswered === 0 && Object.keys(valid).length === 0 ? "start" : "scenario")
            setScenarioIndex(Math.max(0, firstUnanswered))
          }
        } else {
          if (!writeDraft(definition.id, null)) setDraftStorageError(true)
          setDraftDiscarded(true)
        }
      }

      setReady(true)
    }

    restore()
  }, [definition])

  useEffect(() => {
    if (!ready || !definition) return
    if (Object.keys(answers).length === 0) return
    const stored = writeDraft(definition.id, {
      scenarioSetVersion: definition.scenarioSetVersion,
      answers,
      updatedAt: Date.now(),
    })
    if (!stored) queueMicrotask(() => setDraftStorageError(true))
  }, [ready, definition, answers])

  if (!definition) {
    return (
      <div className="container stack-lg">
        <div className="panel stack-md">
          <p className="eyebrow">Unknown brief</p>
          <h1>This vantage point is unavailable.</h1>
          <p className="muted">Choose one of the six role briefs to start a run.</p>
          <div className="row gap-sm wrap">
            <Link href="/perspectives" className="cta-primary">Browse the briefs</Link>
          </div>
        </div>
      </div>
    )
  }

  if (!ready || baseline.status === "loading") {
    return <div className="panel" style={{ padding: "40px" }}>Loading this brief…</div>
  }

  if (baseline.status === "absent") {
    return <BaselineGate definition={definition} />
  }

  const activeDefinition = definition
  const scenarios = activeDefinition.scenarios
  const answeredCount = scenarios.filter((scenario) => answers[scenario.id] !== undefined).length
  const currentScenario = scenarios[Math.min(scenarioIndex, scenarios.length - 1)]
  const isComplete = answeredCount === scenarios.length

  function selectOption(scenarioId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [scenarioId]: optionId }))
  }

  function goNext() {
    if (returnToReview) {
      setReturnToReview(false)
      setStage("review")
      return
    }
    if (scenarioIndex >= scenarios.length - 1) {
      setStage("review")
      return
    }
    setScenarioIndex((prev) => prev + 1)
  }

  function goBack() {
    if (stage === "review") {
      setStage("scenario")
      setScenarioIndex(scenarios.length - 1)
      return
    }
    if (scenarioIndex === 0) {
      setStage("start")
      return
    }
    setScenarioIndex((prev) => prev - 1)
  }

  function editScenario(index: number) {
    setReturnToReview(true)
    setScenarioIndex(index)
    setStage("scenario")
  }

  function startOver() {
    setAnswers({})
    setScenarioIndex(0)
    setStage("start")
    setReturnToReview(false)
    if (!writeDraft(activeDefinition.id, null)) setDraftStorageError(true)
    setGenerationError(false)
  }

  function generateResult() {
    if (!isComplete || baseline.status !== "present") return
    setGenerating(true)
    setGenerationError(false)
    try {
      const payload = encodePerspectivePayload({
        v: 1,
        perspectiveId: activeDefinition.id,
        scenarioSetVersion: activeDefinition.scenarioSetVersion,
        baselineScores: perspectiveDimensionScoresToTuple(baseline.scores),
        answers,
      })
      if (!writeDraft(activeDefinition.id, null)) setDraftStorageError(true)
      router.push(`/perspectives/${activeDefinition.id}/result/${payload}`)
    } catch {
      setGenerating(false)
      setGenerationError(true)
    }
  }

  return (
    <div className="stack-lg perspective-run">
      <div className="perspective-context-strip" role="status">
        <span className="perspective-context-strip__badge">
          Reasoning from: {definition.shortLabel}
        </span>
        <span className="perspective-context-strip__progress">
          {stage === "review"
            ? "Review"
            : stage === "start"
              ? `${scenarios.length} scenarios`
              : `Scenario ${scenarioIndex + 1} of ${scenarios.length}`}
        </span>
        <span
          className="perspective-context-strip__bar"
          aria-hidden="true"
          style={{ width: `${(answeredCount / scenarios.length) * 100}%` }}
        />
      </div>

      {draftDiscarded ? (
        <p className="muted perspective-run__note">
          The scenario set was updated since your earlier draft, so this run starts fresh.
        </p>
      ) : null}

      {draftStorageError ? (
        <p className="muted perspective-run__note" role="status">
          Draft saving is unavailable in this browser. Keep this page open until you finish the
          run.
        </p>
      ) : null}

      {stage === "start" ? (
        <section className="panel stack-md">
          <div className="stack-xs">
            <p className="eyebrow">Perspective run</p>
            <h1>{definition.label}</h1>
            <p className="muted perspective-run__mandate">{definition.description}</p>
          </div>

          <ol className="perspective-run__contract">
            <li>The Foundation recorded how you judge these tradeoffs yourself. That baseline stays fixed.</li>
            <li>This run asks you to advise from a defined strategic position. The role and its constraints stay on screen throughout.</li>
            <li>The result appears beside your baseline as a contextual shift. You can remove it at any time.</li>
          </ol>

          <div className="stack-xs">
            <p className="perspective-pack-card__kicker">On the agenda</p>
            <ul className="perspective-pack-card__agenda">
              {scenarios.map((scenario) => (
                <li key={scenario.id}>{situationLabel(scenario)}</li>
              ))}
            </ul>
          </div>

          <div className="row gap-sm wrap">
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setStage("scenario")
                setScenarioIndex(0)
              }}
            >
              Begin scenario 1
            </button>
            <Link href="/perspectives" className="cta-secondary">All briefs</Link>
          </div>
        </section>
      ) : null}

      {stage === "scenario" && currentScenario ? (
        <section className="panel stack-md">
          <p className="quiz-section-marker">
            Scenario {scenarioIndex + 1} of {scenarios.length} — {situationLabel(currentScenario)}
          </p>

          <dl className="perspective-brief">
            <div className="perspective-brief__row">
              <dt>Actor</dt>
              <dd>{currentScenario.actor}</dd>
            </div>
            <div className="perspective-brief__row">
              <dt>Objective</dt>
              <dd>{currentScenario.objective}</dd>
            </div>
            <div className="perspective-brief__row">
              <dt>Constraint</dt>
              <dd>{currentScenario.constraint}</dd>
            </div>
            <div className="perspective-brief__row">
              <dt>Uncertainty</dt>
              <dd>{currentScenario.uncertainty}</dd>
            </div>
          </dl>

          <div className="stack-xs">
            <h2>{currentScenario.task}</h2>
            <p className="muted perspective-run__instruction">
              Answer from this actor&rsquo;s seat, using this actor&rsquo;s constraints. Choose the
              recommendation you would give.
            </p>
          </div>

          <div className="stack-sm">
            {currentScenario.options.map((option, optionIndex) => {
              const selected = answers[currentScenario.id] === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  className={selected ? "option-card selected" : "option-card"}
                  onClick={() => selectOption(currentScenario.id, option.id)}
                  aria-pressed={selected}
                >
                  <span className="option-badge">{optionIndex + 1}</span>
                  <span className="option-card-content">
                    <span className="option-card-title">{option.title}</span>
                    <span className="option-card-text">{option.response}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <hr className="divider" />

          <div className="row gap-sm wrap">
            <button type="button" className="secondary-button" onClick={goBack}>
              Back
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={goNext}
              disabled={answers[currentScenario.id] === undefined}
            >
              {returnToReview
                ? "Return to review"
                : scenarioIndex === scenarios.length - 1
                  ? "Review your recommendations →"
                  : "Next"}
            </button>
          </div>
        </section>
      ) : null}

      {stage === "review" ? (
        <div className="stack-lg">
          <section className="panel stack-sm">
            <p className="eyebrow">Review</p>
            <h1>Review your recommendations.</h1>
            <p className="muted perspective-run__instruction">
              The result compares this run with your Foundation baseline. Change any answer before
              you generate it.
            </p>
          </section>

          <section className="panel stack-md">
            <div className="review-table">
              {scenarios.map((scenario, index) => {
                const chosen = scenario.options.find(
                  (option) => option.id === answers[scenario.id],
                )
                return (
                  <div key={scenario.id} className="review-row">
                    <div className="review-row-content">
                      <p className="perspective-review__kicker">
                        {situationLabel(scenario)}
                      </p>
                      <p className="perspective-review__task">{scenario.task}</p>
                      <p className="perspective-review__choice">
                        {chosen ? chosen.title : "—"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="secondary-button perspective-review__edit"
                      onClick={() => editScenario(index)}
                    >
                      Change
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="row gap-sm wrap">
              <button
                type="button"
                className="primary-button"
                onClick={generateResult}
                disabled={generating || !isComplete}
              >
                {generating ? "Generating…" : "See where this run lands →"}
              </button>
              <button type="button" className="secondary-button" onClick={startOver}>
                Start over
              </button>
            </div>
            {generationError ? (
              <p className="muted perspective-run__note" role="alert">
                We could not create this result. Your recommendations are still here; try again.
              </p>
            ) : null}
            <p className="muted perspective-run__footnote">
              The result is computed only when you generate it. All processing stays in your
              browser.
            </p>
          </section>
        </div>
      ) : null}
    </div>
  )
}

function BaselineGate({ definition }: { definition: PerspectiveDefinition }) {
  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <div className="stack-xs">
          <p className="eyebrow">Perspective run</p>
          <h1>{definition.label}</h1>
          <p className="muted perspective-run__mandate">{definition.description}</p>
        </div>

        <div className="stack-xs">
          <p className="perspective-pack-card__kicker">On the agenda</p>
          <ul className="perspective-pack-card__agenda">
            {definition.scenarios.map((scenario) => (
              <li key={scenario.id}>{situationLabel(scenario)}</li>
            ))}
          </ul>
        </div>

        <div className="callout stack-xs">
          <p className="perspective-run__gate-line">
            This run needs a Foundation baseline for comparison.
          </p>
          <p className="muted perspective-run__instruction">
            Take the Foundation first so a run has a baseline for comparison.
          </p>
        </div>

        <div className="row gap-sm wrap">
          <Link href="/quiz" className="cta-primary">Take the Foundation</Link>
          <Link href="/perspectives" className="cta-secondary">All briefs</Link>
        </div>
      </section>
    </div>
  )
}
