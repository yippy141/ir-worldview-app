import { Suspense } from "react"
import { AiGovernanceQuizApp } from "@/components/ai-governance-quiz-app"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Questionnaire — AI Governance Compass",
  description:
    "Position statements and branching scenarios map where you stand across eight AI governance dimensions. The result is a structured interpretation, not a validated instrument.",
}

export default function AiQuizPage() {
  return (
    <div className="wide-container">
      {/* AiGovernanceQuizApp uses useSearchParams, which requires a Suspense boundary in Next.js App Router. */}
      <Suspense fallback={<div className="panel" style={{ padding: "40px" }}>Loading…</div>}>
        <AiGovernanceQuizApp />
      </Suspense>
    </div>
  )
}
