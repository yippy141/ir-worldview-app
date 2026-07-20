"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getZhHansFoundationQuestions } from "@/content/locales/zh-Hans/foundation-instrument"
import {
  zhHansFoundationReviewUi,
  type FoundationReviewUiCopy,
} from "@/content/locales/zh-Hans/foundation-ui"
import { publicPath } from "@/i18n/paths"
import type { Locale } from "@/i18n/routing"
import { trackProductEvent } from "@/lib/analytics/adapter"
import { getFoundationQuestions } from "@/lib/quiz-schema"
import { generateResult } from "@/lib/scoring"
import { buildFoundationSharePayload, encodePayload } from "@/lib/share"
import { markProfileSaveIntent } from "@/lib/profile-save-intent"
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

const englishFoundationReviewUi = {
  loading: "Loading your answers…",
  eyebrow: "Review your answers",
  title: "Review your Foundation answers",
  intro:
    "Check each answer before generating your result. You can add separate Security and Technology readings afterward.",
  progress: (mode, answered, total) => `${mode} · ${answered} of ${total} questions answered`,
  questionsHeading: "Foundation questions",
  incomplete: "Finish every foundation question before generating the result.",
  complete:
    "Your foundation result is ready. Afterward you can take Security or Technology as separate Focus Areas.",
  generating: "Generating…",
  generate: "Generate my result →",
  back: "Back to foundation",
  startOver: "Start over",
  localProcessing:
    "The result is computed only when you click “Generate.” All processing stays in your browser.",
  upgradeEyebrow: "Want a deeper read?",
  upgradeTitle: "You completed the Standard version.",
  upgradeBody:
    "The scoring method is the same. Analyst mode adds more evidence from specific tradeoffs and questions asked from a defined actor’s position.",
  upgradeAction: "Try Analyst mode",
  upgradeConfirm:
    "Analyst mode repeats the Foundation with more scenarios that require tradeoffs and more questions asked from a defined actor’s position. Your current Standard answers will be cleared. Continue?",
  edit: "Edit",
  likertLabels: {
    1: "Strongly disagree",
    2: "Disagree",
    3: "Somewhat disagree",
    4: "Neutral",
    5: "Somewhat agree",
    6: "Agree",
    7: "Strongly agree",
  },
  mostPersuasive: (title, label) => `Most persuasive: ${title} — ${label}`,
  rankedPersuasive: (primary, secondary) =>
    `Most persuasive: ${primary} · Second-most persuasive: ${secondary}`,
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
  modeLabels: { standard: "Standard mode", analyst: "Analyst mode" },
} satisfies FoundationReviewUiCopy

export function ReviewScreen({ locale = "en" }: { locale?: Locale }) {
  const router = useRouter()
  const copy = locale === "zh-Hans" ? zhHansFoundationReviewUi : englishFoundationReviewUi
  const [session, setSession] = useState<QuizSession | null>(null)
  const [ready, setReady] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSession(parseQuizSession(window.localStorage.getItem(QUIZ_STORAGE_KEY)))
      setReady(true)
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (ready && (session === null || !session.activeMode)) {
      router.replace(publicPath(locale, "/quiz"))
    }
  }, [locale, ready, router, session])

  const questions = session?.activeMode
    ? locale === "zh-Hans"
      ? getZhHansFoundationQuestions(session.activeMode)
      : getFoundationQuestions(session.activeMode)
    : []

  const answerRows: AnswerRow[] = session
    ? questions.map((question, index) => ({
        question,
        index,
        answerDisplay: formatAnswer(question, session.answers[question.id], copy),
      }))
    : []

  const answeredCount = session ? countAnsweredQuestions(session) : 0
  const foundationComplete = session ? answeredCount >= questions.length : false

  function handleEdit(index: number) {
    router.push(`${publicPath(locale, "/quiz")}?q=${index}&from=review`)
  }

  function handleGenerate() {
    if (!session || !session.activeMode || !foundationComplete) return

    setGenerating(true)

    try {
      const result = generateResult(session.answers, session.activeMode)
      const payload = encodePayload(buildFoundationSharePayload(result, locale))

      markProfileSaveIntent("foundation", payload, { mode: session.activeMode })
      trackProductEvent("foundation_completed")
      router.push(publicPath(locale, `/results/${payload}`))
    } catch {
      setGenerating(false)
    }
  }

  function handleBackToQuiz() {
    router.push(publicPath(locale, "/quiz"))
  }

  function handleReset() {
    window.localStorage.removeItem(QUIZ_STORAGE_KEY)
    notifyQuizSessionUpdated()
    router.push(publicPath(locale, "/quiz"))
  }

  if (!ready || session === null || !session.activeMode) {
    return <div className="panel" style={{ padding: "40px" }}>{copy.loading}</div>
  }

  return (
    <div className="stack-lg">
      <section className="panel stack-sm">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className="muted" style={{ lineHeight: "1.65" }}>
          {copy.intro}
        </p>
        <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
          {copy.progress(
            copy.modeLabels[session.activeMode],
            answeredCount,
            questions.length,
          )}
        </p>
      </section>

      {answerRows.length > 0 ? (
        <section className="panel stack-md">
          <h2>{copy.questionsHeading}</h2>
          <div className="review-table">
            {answerRows.map((row) => (
              <ReviewRow
                key={row.question.id}
                row={row}
                onEdit={() => handleEdit(row.index)}
                copy={copy}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="panel stack-md">
        {!foundationComplete ? (
          <div className="callout">
            <p style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
              {copy.incomplete}
            </p>
          </div>
        ) : (
          <div className="callout">
            <p style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
              {copy.complete}
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
            {generating ? copy.generating : copy.generate}
          </button>
          <button type="button" className="secondary-button" onClick={handleBackToQuiz}>
            {copy.back}
          </button>
          <button type="button" className="secondary-button" onClick={handleReset}>
            {copy.startOver}
          </button>
        </div>
        <p className="muted" style={{ fontSize: "0.8rem", lineHeight: "1.55" }}>
          {copy.localProcessing}
        </p>
      </section>

      {foundationComplete && session.activeMode === "standard" ? (
        <AnalystUpgradeOffer onUpgrade={handleUpgradeToAnalyst} copy={copy} />
      ) : null}
    </div>
  )

  function handleUpgradeToAnalyst() {
    if (
      !window.confirm(
        copy.upgradeConfirm,
      )
    ) {
      return
    }
    window.localStorage.removeItem(QUIZ_STORAGE_KEY)
    notifyQuizSessionUpdated()
    router.push(`${publicPath(locale, "/quiz")}?mode=analyst`)
  }
}

function AnalystUpgradeOffer({
  onUpgrade,
  copy,
}: {
  onUpgrade: () => void
  copy: FoundationReviewUiCopy
}) {
  return (
    <section className="panel stack-sm analyst-upgrade-offer">
      <p className="eyebrow">{copy.upgradeEyebrow}</p>
      <h2 style={{ margin: 0 }}>
        {copy.upgradeTitle}
      </h2>
      <p className="muted" style={{ lineHeight: "1.65" }}>
        {copy.upgradeBody}
      </p>
      <div className="row gap-sm wrap">
        <button type="button" className="secondary-button" onClick={onUpgrade}>
          {copy.upgradeAction}
        </button>
      </div>
    </section>
  )
}

function ReviewRow({
  row,
  onEdit,
  copy,
}: {
  row: AnswerRow
  onEdit: () => void
  copy: FoundationReviewUiCopy
}) {
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
          {questionLabel(row.question, copy)}
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
        {copy.edit}
      </button>
    </div>
  )
}

function formatAnswer(
  question: Question,
  answer: QuizSession["answers"][string] | undefined,
  copy: FoundationReviewUiCopy,
): string {
  if (answer === undefined) return "—"

  if (question.kind === "likert") {
    const n = answer as number
    return `${n} — ${copy.likertLabels[n] ?? ""}`
  }

  const primaryId = typeof answer === "string" ? answer : getRankedChoiceAnswer(answer)?.primary
  const secondaryId = getRankedChoiceAnswer(answer)?.secondary
  const primary = question.options.find((candidate) => candidate.id === primaryId)
  const secondary = question.options.find((candidate) => candidate.id === secondaryId)

  if (!primary) {
    return String(primaryId ?? answer)
  }

  if (!secondary) {
    return copy.mostPersuasive(primary.title, primary.label)
  }

  return copy.rankedPersuasive(primary.title, secondary.title)
}

function questionLabel(question: Question, copy: FoundationReviewUiCopy) {
  if (question.kind === "likert") return copy.questionKinds.likert
  return `${copy.questionKinds[question.kind]} · ${copy.cardTypes[question.cardType]}`
}

function getRankedChoiceAnswer(answer: AnswerValue | undefined): RankedChoiceAnswer | null {
  if (typeof answer !== "object" || answer === null || typeof answer.primary !== "string") {
    return null
  }

  return answer
}
