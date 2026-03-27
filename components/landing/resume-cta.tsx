"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"
import { QUIZ_STORAGE_KEY } from "@/components/quiz-app"
import { Answers } from "@/lib/types"

type DraftState = { hasDraft: boolean; draftCount: number }

const NO_DRAFT: DraftState = { hasDraft: false, draftCount: 0 }

let _cached: DraftState = NO_DRAFT

function readFromStorage(): DraftState {
  const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY)
  if (!raw) return NO_DRAFT
  try {
    const parsed = JSON.parse(raw) as Answers
    const count = Object.keys(parsed).length
    if (count > 0) return { hasDraft: true, draftCount: count }
  } catch {
    // Corrupt data — ignore.
  }
  return NO_DRAFT
}

const _listeners = new Set<() => void>()

function subscribe(cb: () => void) {
  _listeners.add(cb)
  return () => _listeners.delete(cb)
}

function getSnapshot(): DraftState {
  const next = readFromStorage()
  if (next.hasDraft === _cached.hasDraft && next.draftCount === _cached.draftCount) {
    return _cached
  }
  _cached = next
  return _cached
}

function getServerSnapshot(): DraftState {
  return NO_DRAFT
}

export function QuizMenuCard() {
  const { hasDraft, draftCount } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  function clearDraft() {
    window.localStorage.removeItem(QUIZ_STORAGE_KEY)
    _listeners.forEach((cb) => cb())
  }

  if (!hasDraft) {
    return (
      <Link href="/quiz" className="menu-card">
        <p className="menu-card-title">Take the quiz</p>
        <p className="menu-card-desc">
          Map your instincts across seven dimensions drawn from IR theory. Takes 10–15 minutes.
        </p>
      </Link>
    )
  }

  return (
    <Link href="/quiz" className="menu-card">
      <p className="menu-card-title">Resume quiz</p>
      <p className="menu-card-desc">
        {draftCount} {draftCount === 1 ? "question" : "questions"} answered.{" "}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
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
