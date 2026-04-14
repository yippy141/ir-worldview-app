import { Suspense } from "react"
import { AiGovernanceQuizApp } from "@/components/ai-governance-quiz-app"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Governance Compass",
  description:
    "Map how you think about AI safety, governance, and the future. A prototype profile for reflection, not a validated psychometric diagnosis.",
}

export default function AiPage() {
  return (
    <div className="wide-container">
      {/* AiGovernanceQuizApp uses useSearchParams, which requires a Suspense boundary in Next.js App Router. */}
      <Suspense fallback={<div className="panel" style={{ padding: "40px" }}>Loading…</div>}>
        <AiGovernanceQuizApp />
      </Suspense>
    </div>
  )
}
