"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { coreQuestions, dimensionLabels } from "@/lib/quiz-schema"
import { generateResult, getNeighboringFamilyKey, getScenarioSequence } from "@/lib/scoring"
import { encodePayload, dimensionScoresToArray } from "@/lib/share"
import { Answers, Question } from "@/lib/types"
import { QUIZ_STORAGE_KEY } from "@/components/quiz-app"

type AnswerRow = {
  question: Question
  index: number
  sectionLabel: string
  answerDisplay: string
}

export function ReviewScreen() {
  const router = useRouter()
  const [answers] = useState<Answers | null>(() => {
    if (typeof window === "undefined") return null
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as Answers
    } catch {
      return null
    }
  })
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (answers === null) {
      router.replace("/quiz")
    }
  }, [answers, router])

  const scenarioSequence = useMemo(
    () => (answers ? getScenarioSequence(answers) : []),
    [answers],
  )

  const allQuestions = useMemo<Question[]>(
    () => [...coreQuestions, ...scenarioSequence],
    [scenarioSequence],
  )

  const answerRows = useMemo<AnswerRow[]>(() => {
    if (!answers) return []
    return allQuestions.map((q, index) => ({
      question: q,
      index,
      sectionLabel: index < coreQuestions.length ? "Core question" : "Scenario",
      answerDisplay: formatAnswer(q, answers[q.id]),
    }))
  }, [allQuestions, answers])

  const coreRows = answerRows.filter((r) => r.sectionLabel === "Core question")
  const scenarioRows = answerRows.filter((r) => r.sectionLabel === "Scenario")

  const completedCount = allQuestions.filter((q) => answers?.[q.id] !== undefined).length
  const isComplete = allQuestions.length > 0 && completedCount === allQuestions.length

  function handleEdit(index: number) {
    router.push(`/quiz?q=${index}&from=review`)
  }

  function handleGenerate() {
    if (!answers || !isComplete) return
    setGenerating(true)
    try {
      const result = generateResult(answers)
      const nk = getNeighboringFamilyKey(result.familyKey, result.familyScores)
      const payload = encodePayload({
        v: 2,
        ds: dimensionScoresToArray(result.dimensionScores),
        fk: result.familyKey,
        nk,
        sm: result.strategyModifier,
        nm: result.normativeModifier,
      })
      router.push(`/results/${payload}`)
    } catch {
      setGenerating(false)
    }
  }

  function handleBackToQuiz() {
    router.push("/quiz")
  }

  if (answers === null) {
    return <div className="panel" style={{ padding: "40px" }}>Loading your answers…</div>
  }

  return (
    <div className="stack-lg">
      {/* Header */}
      <section className="panel stack-sm">
        <p className="eyebrow">Review your answers</p>
        <h1>Before you see your result</h1>
        <p className="muted" style={{ lineHeight: "1.65" }}>
          Check your answers below. You can edit any response before generating your result. Your
          result is only generated when you click the button at the bottom.
        </p>
        <p className="muted" style={{ fontSize: "0.875rem" }}>
          {completedCount} of {allQuestions.length} questions answered
          {!isComplete && (
            <span style={{ color: "var(--accent-light)", marginLeft: "8px" }}>
              — some questions are unanswered
            </span>
          )}
        </p>
      </section>

      {/* Core questions */}
      {coreRows.length > 0 ? (
        <section className="panel stack-md">
          <h2>Core questions</h2>
          <div className="review-table">
            {coreRows.map((row) => (
              <ReviewRow
                key={row.question.id}
                row={row}
                onEdit={() => handleEdit(row.index)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Scenario questions */}
      {scenarioRows.length > 0 ? (
        <section className="panel stack-md">
          <h2>Scenarios</h2>
          <div className="review-table">
            {scenarioRows.map((row) => (
              <ReviewRow
                key={row.question.id}
                row={row}
                onEdit={() => handleEdit(row.index)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Actions */}
      <section className="panel stack-md">
        {!isComplete ? (
          <div
            className="callout"
            style={{ borderLeft: "3px solid var(--accent-light)", borderRadius: "0 5px 5px 0" }}
          >
            <p style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
              You have unanswered questions. You can still generate a result, but unanswered items
              will default to the neutral midpoint (4). For the most accurate classification, we
              recommend completing all questions.
            </p>
          </div>
        ) : null}

        <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
          <button
            type="button"
            className="primary-button"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? "Generating…" : "Generate my result →"}
          </button>
          <button type="button" className="secondary-button" onClick={handleBackToQuiz}>
            Back to quiz
          </button>
        </div>
        <p className="muted" style={{ fontSize: "0.8rem", lineHeight: "1.55" }}>
          Your result is only computed when you click &ldquo;Generate.&rdquo; No data is sent anywhere — all
          processing happens in your browser.
        </p>
      </section>
    </div>
  )
}

// ── Row component ─────────────────────────────────────────────────────────────

function ReviewRow({ row, onEdit }: { row: AnswerRow; onEdit: () => void }) {
  const answered = row.answerDisplay !== "—"
  return (
    <div className="review-row">
      <div className="review-row-content">
        <p
          className="muted"
          style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}
        >
          {dimensionOrScenarioLabel(row.question)}
        </p>
        <p style={{ lineHeight: "1.5", fontSize: "0.95rem" }}>{row.question.prompt}</p>
        <p
          style={{
            marginTop: "4px",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: answered ? "var(--accent)" : "var(--muted)",
          }}
        >
          {row.answerDisplay}
        </p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="secondary-button"
        style={{ flexShrink: 0, fontSize: "0.8rem", padding: "6px 12px" }}
      >
        Edit
      </button>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatAnswer(question: Question, answer: number | "A" | "B" | "C" | undefined): string {
  if (answer === undefined) return "—"

  if (question.kind === "likert") {
    const n = answer as number
    const labels: Record<number, string> = {
      1: "Strongly disagree",
      2: "Disagree",
      3: "Somewhat disagree",
      4: "Neutral",
      5: "Somewhat agree",
      6: "Agree",
      7: "Strongly agree",
    }
    return `${n} — ${labels[n] ?? ""}`
  }

  // Scenario: find the option label
  if (question.kind === "scenario") {
    const option = question.options.find((o) => o.id === answer)
    return option ? `${option.id}: ${option.label}` : String(answer)
  }

  return String(answer)
}

function dimensionOrScenarioLabel(question: Question): string {
  if (question.kind === "likert") {
    return dimensionLabels[question.dimension]
  }
  return "Scenario"
}
