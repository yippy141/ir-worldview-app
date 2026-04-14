"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getFoundationQuestions } from "@/lib/quiz-schema"
import { generateResult, getNeighboringFamilyKey } from "@/lib/scoring"
import { encodePayload, dimensionScoresToArray } from "@/lib/share"
import {
  QUIZ_STORAGE_KEY,
  countAnsweredQuestions,
  notifyQuizSessionUpdated,
  parseQuizSession,
} from "@/lib/quiz-session"
import type { AnswerValue, Question, QuizSession, RankedChoiceAnswer } from "@/lib/types"

type AnswerRow = {
  question: Question
  index: number
  answerDisplay: string
}

export function ReviewScreen() {
  const router = useRouter()
  const [session] = useState<QuizSession | null>(() => {
    if (typeof window === "undefined") return null
    return parseQuizSession(window.localStorage.getItem(QUIZ_STORAGE_KEY))
  })
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (session === null || !session.activeMode) {
      router.replace("/quiz")
    }
  }, [router, session])

  const questions = session?.activeMode ? getFoundationQuestions(session.activeMode) : []

  const answerRows: AnswerRow[] = session
    ? questions.map((question, index) => ({
        question,
        index,
        answerDisplay: formatAnswer(question, session.answers[question.id]),
      }))
    : []

  const answeredCount = session ? countAnsweredQuestions(session) : 0
  const foundationComplete = session ? answeredCount >= questions.length : false

  function handleEdit(index: number) {
    router.push(`/quiz?q=${index}&from=review`)
  }

  function handleGenerate() {
    if (!session || !session.activeMode || !foundationComplete) return

    setGenerating(true)

    try {
      const result = generateResult(session.answers, session.activeMode)
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

  function handleReset() {
    window.localStorage.removeItem(QUIZ_STORAGE_KEY)
    notifyQuizSessionUpdated()
    router.push("/quiz")
  }

  if (session === null || !session.activeMode) {
    return <div className="panel" style={{ padding: "40px" }}>Loading your answers…</div>
  }

  return (
    <div className="stack-lg">
      <section className="panel stack-sm">
        <p className="eyebrow">Review your answers</p>
        <h1>Before you generate your foundation result</h1>
        <p className="muted" style={{ lineHeight: "1.65" }}>
          Review the full foundation before you generate the result. Focus-area modules come
          afterward as issue-specific overlays, not as replacements for the baseline.
        </p>
        <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
          {session.activeMode === "standard" ? "Standard mode" : "Deep-dive mode"} · {answeredCount} of{" "}
          {questions.length} questions answered
        </p>
      </section>

      {answerRows.length > 0 ? (
        <section className="panel stack-md">
          <h2>Foundation questions</h2>
          <div className="review-table">
            {answerRows.map((row) => (
              <ReviewRow
                key={row.question.id}
                row={row}
                onEdit={() => handleEdit(row.index)}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="panel stack-md">
        {!foundationComplete ? (
          <div
            className="callout"
            style={{ borderLeft: "3px solid var(--accent-light)", borderRadius: "0 5px 5px 0" }}
          >
            <p style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
              Finish every foundation question before generating the result.
            </p>
          </div>
        ) : (
          <div
            className="callout"
            style={{ borderLeft: "3px solid var(--accent-light)", borderRadius: "0 5px 5px 0" }}
          >
            <p style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
              Your foundation result is ready. Afterward you can take Security or Technology as
              separate focus-area modules.
            </p>
          </div>
        )}

        <div className="row gap-sm wrap">
          <button
            type="button"
            className="primary-button"
            onClick={handleGenerate}
            disabled={generating || !foundationComplete}
          >
            {generating ? "Generating…" : "Generate my result →"}
          </button>
          <button type="button" className="secondary-button" onClick={handleBackToQuiz}>
            Back to foundation
          </button>
          <button type="button" className="secondary-button" onClick={handleReset}>
            Start over
          </button>
        </div>
        <p className="muted" style={{ fontSize: "0.8rem", lineHeight: "1.55" }}>
          The result is computed only when you click “Generate.” All processing stays in your
          browser.
        </p>
      </section>
    </div>
  )
}

function ReviewRow({ row, onEdit }: { row: AnswerRow; onEdit: () => void }) {
  const answered = row.answerDisplay !== "—"

  return (
    <div className="review-row">
      <div className="review-row-content">
        <p
          className="muted"
          style={{
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "3px",
          }}
        >
          {questionLabel(row.question)}
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

function formatAnswer(question: Question, answer: QuizSession["answers"][string] | undefined): string {
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

  const primaryId = typeof answer === "string" ? answer : getRankedChoiceAnswer(answer)?.primary
  const secondaryId = getRankedChoiceAnswer(answer)?.secondary
  const primary = question.options.find((candidate) => candidate.id === primaryId)
  const secondary = question.options.find((candidate) => candidate.id === secondaryId)

  if (!primary) {
    return String(primaryId ?? answer)
  }

  if (!secondary) {
    return `Most persuasive: ${primary.title} — ${primary.label}`
  }

  return `Most persuasive: ${primary.title} · Second-most persuasive: ${secondary.title}`
}

function questionLabel(question: Question) {
  if (question.kind === "tradeoff") return `Tradeoff · ${cardTypeLabel(question.cardType)}`
  if (question.kind === "miniCase") return `Mini-case · ${cardTypeLabel(question.cardType)}`
  return "Foundation statement"
}

function cardTypeLabel(cardType: "explanation" | "decision" | "actorLens" | "both") {
  if (cardType === "explanation") return "Explanation"
  if (cardType === "decision") return "Decision"
  if (cardType === "actorLens") return "Actor lens"
  return "Both"
}

function getRankedChoiceAnswer(answer: AnswerValue | undefined): RankedChoiceAnswer | null {
  if (typeof answer !== "object" || answer === null || typeof answer.primary !== "string") {
    return null
  }

  return answer
}
