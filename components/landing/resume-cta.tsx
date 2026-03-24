"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"
import { QUIZ_STORAGE_KEY } from "@/components/quiz-app"
import { Answers } from "@/lib/types"

type DraftState = { hasDraft: boolean; draftCount: number }

const NO_DRAFT: DraftState = { hasDraft: false, draftCount: 0 }

// Cached snapshot — useSyncExternalStore requires a stable reference when
// the value hasn't changed, otherwise React throws in development.
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

// Listeners are called when we mutate localStorage in this tab so React
// can re-run getSnapshot and schedule a re-render if the value changed.
const _listeners = new Set<() => void>()

function subscribe(cb: () => void) {
  _listeners.add(cb)
  return () => _listeners.delete(cb)
}

function getSnapshot(): DraftState {
  const next = readFromStorage()
  // Return the same reference when nothing changed — prevents spurious re-renders.
  if (next.hasDraft === _cached.hasDraft && next.draftCount === _cached.draftCount) {
    return _cached
  }
  _cached = next
  return _cached
}

function getServerSnapshot(): DraftState {
  // Matches the server-rendered HTML (no localStorage on the server).
  return NO_DRAFT
}

export function ResumeCta() {
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
      <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
        <Link href="/quiz" className="cta-primary">
          Take the quiz
        </Link>
        <Link href="/explore" className="cta-secondary">
          Explore the perspectives
        </Link>
      </div>
    )
  }

  return (
    <div className="stack-sm">
      <div
        className="callout"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}
      >
        <p style={{ fontSize: "0.9rem", lineHeight: "1.55" }}>
          You have a draft in progress — <strong>{draftCount}</strong>{" "}
          {draftCount === 1 ? "question" : "questions"} answered.
        </p>
        <button
          type="button"
          onClick={clearDraft}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "var(--muted)",
            fontSize: "0.8rem",
            textDecoration: "underline",
            flexShrink: 0,
          }}
        >
          Start over
        </button>
      </div>
      <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
        <Link href="/quiz" className="cta-primary">
          Resume quiz
        </Link>
        <Link href="/explore" className="cta-secondary">
          Explore the perspectives
        </Link>
      </div>
    </div>
  )
}
