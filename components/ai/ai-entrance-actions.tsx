"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { AI_GOVERNANCE_STORAGE_KEY } from "@/lib/storage-keys"
import { AI_GOVERNANCE_V22_TUPLE } from "@/lib/ai-governance-versions"
import { aiTotalQuestionCountsByMode } from "@/lib/ai-governance-schema"

export function AiEntranceActions({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState("standard")
  const [draft, setDraft] = useState(false)
  useEffect(() => {
    const load = () => { try {
      const raw = JSON.parse(localStorage.getItem(AI_GOVERNANCE_STORAGE_KEY) ?? "null")
      const hasDraft = Boolean(raw?.bv === AI_GOVERNANCE_V22_TUPLE.bankVersion && raw?.sv === AI_GOVERNANCE_V22_TUPLE.scoringVersion && Object.keys(raw.answers ?? {}).length)
      setDraft(hasDraft)
      if (hasDraft) {
        setMode(raw.mode === "analyst" ? "advanced" : "standard")
      }
    } catch { setDraft(false) /* The questionnaire owns draft recovery. */ } }
    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])
  return <>
    <p className="ai-landing-hero__lead">{mode === "advanced" ? aiTotalQuestionCountsByMode.analyst : aiTotalQuestionCountsByMode.standard} questions.{mode === "standard" ? " About eight minutes." : " More detailed scenarios."}</p>
    {children}
    <div className="entrance-actions">
    <Link href={draft ? "/ai/quiz" : `/ai/quiz?mode=${mode}`} className="cta-primary saved-result-action">{draft ? "Resume AI Governance" : "Start AI Governance"}</Link>
    <label>Mode <select disabled={draft} value={mode} onChange={event => setMode(event.target.value)}>
      <option value="standard">Standard · {aiTotalQuestionCountsByMode.standard} questions</option>
      <option value="advanced">Advanced · {aiTotalQuestionCountsByMode.analyst} questions</option>
    </select></label>
  </div></>
}
