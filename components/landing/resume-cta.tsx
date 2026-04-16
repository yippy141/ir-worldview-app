"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"
import {
  QUIZ_STORAGE_KEY,
  QUIZ_SESSION_EVENT,
  countAnsweredQuestions,
  notifyQuizSessionUpdated,
  parseQuizSession,
} from "@/lib/quiz-session"

type DraftState = {
  hasDraft: boolean
  draftCount: number
  modeLabel?: string
}

const NO_DRAFT: DraftState = { hasDraft: false, draftCount: 0 }

let cached: DraftState = NO_DRAFT
const listeners = new Set<() => void>()

function readFromStorage(): DraftState {
  const session = parseQuizSession(window.localStorage.getItem(QUIZ_STORAGE_KEY))
  if (!session || !session.activeMode) return NO_DRAFT

  const draftCount = countAnsweredQuestions(session)
  if (draftCount === 0) return NO_DRAFT

  return {
    hasDraft: true,
    draftCount,
    modeLabel: session.activeMode === "standard" ? "Standard" : "Advanced",
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  window.addEventListener("storage", callback)
  window.addEventListener(QUIZ_SESSION_EVENT, callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", callback)
    window.removeEventListener(QUIZ_SESSION_EVENT, callback)
  }
}

function getSnapshot(): DraftState {
  const next = readFromStorage()
  if (
    next.hasDraft === cached.hasDraft &&
    next.draftCount === cached.draftCount &&
    next.modeLabel === cached.modeLabel
  ) {
    return cached
  }

  cached = next
  return cached
}

function getServerSnapshot(): DraftState {
  return NO_DRAFT
}

export function QuizMenuCard() {
  const { hasDraft, draftCount, modeLabel } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  function clearDraft() {
    window.localStorage.removeItem(QUIZ_STORAGE_KEY)
    notifyQuizSessionUpdated()
  }

  if (!hasDraft) {
    return (
      <Link href="/quiz" className="menu-card">
        <p className="menu-card-title">Take the foundation</p>
        <p className="menu-card-desc">
          Choose Standard or Advanced mode and map your instincts across seven IR dimensions.
        </p>
      </Link>
    )
  }

  return (
    <Link href="/quiz" className="menu-card">
      <p className="menu-card-title">Resume foundation</p>
      <p className="menu-card-desc">
        {modeLabel} mode · {draftCount} {draftCount === 1 ? "question" : "questions"} answered.{" "}
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            clearDraft()
          }}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "var(--muted)",
            fontSize: "inherit",
            textDecoration: "underline",
            font: "inherit",
          }}
        >
          Start over
        </button>
      </p>
    </Link>
  )
}
