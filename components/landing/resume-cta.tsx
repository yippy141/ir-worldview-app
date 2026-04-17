"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"
import {
  QUIZ_STORAGE_KEY,
  QUIZ_SESSION_EVENT,
  countAnsweredQuestions,
  parseQuizSession,
} from "@/lib/quiz-session"

type DraftState = {
  hasDraft: boolean
  draftCount: number
  modeLabel?: string
}

const NO_DRAFT: DraftState = { hasDraft: false, draftCount: 0 }

let cached: DraftState = NO_DRAFT

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
  window.addEventListener("storage", callback)
  window.addEventListener(QUIZ_SESSION_EVENT, callback)

  return () => {
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

function useFoundationDraftState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function FoundationHeroActions() {
  const { hasDraft, draftCount, modeLabel } = useFoundationDraftState()

  return (
    <div className="stack-xs">
      <div className="landing-action-row">
        <Link href="/quiz" className="cta-primary">
          Take the Foundation
        </Link>
        {hasDraft ? (
          <Link href="/quiz" className="cta-secondary">
            Resume Foundation
          </Link>
        ) : null}
      </div>
      {hasDraft ? (
        <p className="landing-draft-note">
          {modeLabel} mode · {draftCount} {draftCount === 1 ? "question" : "questions"} answered
          on this device.
        </p>
      ) : null}
    </div>
  )
}

export function QuizMenuCard() {
  const { hasDraft, draftCount, modeLabel } = useFoundationDraftState()

  if (!hasDraft) {
    return (
      <Link href="/quiz" className="menu-card">
        <p className="menu-card-title">Foundation</p>
        <p className="menu-card-desc">
          Choose Standard or Advanced mode and map your instincts across seven IR dimensions.
        </p>
      </Link>
    )
  }

  return (
    <Link href="/quiz" className="menu-card">
      <p className="menu-card-title">Resume Foundation</p>
      <p className="menu-card-desc">
        {modeLabel} mode · {draftCount} {draftCount === 1 ? "question" : "questions"} answered.
      </p>
    </Link>
  )
}
