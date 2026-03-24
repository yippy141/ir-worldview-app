"use client"

import { useState } from "react"
import Link from "next/link"
import { QUIZ_STORAGE_KEY } from "@/components/quiz-app"
import { Answers } from "@/lib/types"

function readDraft(): { hasDraft: boolean; draftCount: number } {
  if (typeof window === "undefined") return { hasDraft: false, draftCount: 0 }
  const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY)
  if (!raw) return { hasDraft: false, draftCount: 0 }
  try {
    const parsed = JSON.parse(raw) as Answers
    const count = Object.keys(parsed).length
    if (count > 0) return { hasDraft: true, draftCount: count }
  } catch {
    // Corrupt data — ignore.
  }
  return { hasDraft: false, draftCount: 0 }
}

export function ResumeCta() {
  const [{ hasDraft, draftCount }, setDraft] = useState(readDraft)

  function clearDraft() {
    window.localStorage.removeItem(QUIZ_STORAGE_KEY)
    setDraft({ hasDraft: false, draftCount: 0 })
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
