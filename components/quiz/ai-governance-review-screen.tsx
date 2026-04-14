"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AI_GOVERNANCE_STORAGE_KEY, aiCoreQuestions } from "@/lib/ai-governance-schema"
import { generateAiGovernanceResult, getAiScenarioSequence, getNeighboringArchetypeKey } from "@/lib/ai-governance-scoring"
import { encodeAiPayload, aiAxisScoresToArray } from "@/lib/ai-governance-share"
import type { AiAnswers, AiQuestion } from "@/lib/ai-governance-types"

type AiQuizState = {
  started: boolean
  answers: AiAnswers
}

type AnswerRow = {
  question: AiQuestion
  index: number
  answerDisplay: string
}

function loadState(): AiQuizState | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(AI_GOVERNANCE_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === "object" && "answers" in parsed) {
      return parsed as AiQuizState
    }
    return null
  } catch {
    return null
  }
}

export function AiGovernanceReviewScreen() {
  const router = useRouter()
  const [state] = useState<AiQuizState | null>(() => loadState())
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (state === null || !state.started) {
      router.replace("/ai")
    }
  }, [router, state])

  const answers = state?.answers ?? {}
  const questions: AiQuestion[] = [
    ...aiCoreQuestions,
    ...getAiScenarioSequence(answers),
  ]

  const answerRows: AnswerRow[] = questions.map((question, index) => ({
    question,
    index,
    answerDisplay: formatAnswer(question, answers[question.id]),
  }))

  const coreRows = answerRows.filter((r) => r.question.kind === "likert")
  const scenarioRows = answerRows.filter((r) => r.question.kind === "scenario")

  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length
  const isComplete = questions.length > 0 && answeredCount === questions.length

  function handleEdit(index: number) {
    router.push(`/ai?q=${index}&from=review`)
  }

  function handleGenerate() {
    if (!isComplete) return
    setGenerating(true)
    try {
      const result = generateAiGovernanceResult(answers)
      const nk = getNeighboringArchetypeKey(result.archetypeKey, result.archetypeScores)
      const payload = encodeAiPayload({
        v: 1,
        as: aiAxisScoresToArray(result.axisScores),
        ak: result.archetypeKey,
        nk,
        rl: result.riskLens,
        pm: result.paceModifier,
        gm: result.geopoliticsModifier,
      })
      router.push(`/ai/results/${payload}`)
    } catch {
      setGenerating(false)
    }
  }

  function handleBackToQuiz() {
    router.push("/ai")
  }

  function handleReset() {
    window.localStorage.removeItem(AI_GOVERNANCE_STORAGE_KEY)
    router.push("/ai")
  }

  if (state === null || !state.started) {
    return <div className="panel" style={{ padding: "40px" }}>Loading your answers…</div>
  }

  return (
    <div className="stack-lg">
      <section className="panel stack-sm">
        <p className="eyebrow">AI Governance Compass</p>
        <h1>Review your answers</h1>
        <p className="muted" style={{ lineHeight: "1.65" }}>
          Review the full inventory before generating your governance profile. All processing
          stays in your browser.
        </p>
        <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
          {answeredCount} of {questions.length} questions answered
        </p>
      </section>

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

      <section className="panel stack-md">
        {!isComplete ? (
          <div
            className="callout"
            style={{ borderLeft: "3px solid var(--accent-light)", borderRadius: "0 5px 5px 0" }}
          >
            <p style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
              Answer every question before generating your profile.
            </p>
          </div>
        ) : (
          <div
            className="callout"
            style={{ borderLeft: "3px solid var(--accent-light)", borderRadius: "0 5px 5px 0" }}
          >
            <p style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
              Your AI governance profile is ready to generate.
            </p>
          </div>
        )}

        <div className="row gap-sm wrap">
          <button
            type="button"
            className="primary-button"
            onClick={handleGenerate}
            disabled={generating || !isComplete}
          >
            {generating ? "Generating…" : "Generate my profile →"}
          </button>
          <button type="button" className="secondary-button" onClick={handleBackToQuiz}>
            Back to inventory
          </button>
          <button type="button" className="secondary-button" onClick={handleReset}>
            Start over
          </button>
        </div>
        <p className="muted" style={{ fontSize: "0.8rem", lineHeight: "1.55" }}>
          The profile is computed when you click &ldquo;Generate.&rdquo; No data leaves your browser.
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

const likertLabels: Record<number, string> = {
  1: "Strongly disagree",
  2: "Disagree",
  3: "Somewhat disagree",
  4: "Neutral",
  5: "Somewhat agree",
  6: "Agree",
  7: "Strongly agree",
}

function formatAnswer(question: AiQuestion, answer: number | "A" | "B" | "C" | undefined): string {
  if (answer === undefined) return "—"

  if (question.kind === "likert") {
    const n = answer as number
    return `${n} — ${likertLabels[n] ?? ""}`
  }

  const option = question.options.find((o) => o.id === answer)
  if (!option) return String(answer)
  return option.label
}

function questionLabel(question: AiQuestion): string {
  if (question.kind === "likert") return "Foundation statement"
  return `Scenario · ${cardTypeLabel(question.cardType)}`
}

function cardTypeLabel(cardType: "explanation" | "decision" | "actorLens"): string {
  if (cardType === "explanation") return "Explanation"
  if (cardType === "decision") return "Decision"
  return "Actor lens"
}
