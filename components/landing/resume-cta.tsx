"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { QUIZ_STORAGE_KEY } from "@/components/quiz-app"
import { Answers } from "@/lib/types"

export function ResumeCta() {
  const [hasDraft, setHasDraft] = useState(false)
  const [draftCount, setDraftCount] = useState(0)

  useEffect(() => {
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as Answers
      const count = Object.keys(parsed).length
      if (count > 0) {
        setHasDraft(true)
        setDraftCount(count)
      }
    } catch {
      // Corrupt data — ignore.
    }
  }, [])

  function clearDraft() {
    window.localStorage.removeItem(QUIZ_STORAGE_KEY)
    setHasDraft(false)
    setDraftCount(0)
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
