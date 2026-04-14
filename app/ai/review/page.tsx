import { AiGovernanceReviewScreen } from "@/components/quiz/ai-governance-review-screen"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Review — AI Governance Compass",
  description: "Review your answers before generating your AI governance profile.",
}

export default function AiReviewPage() {
  return (
    <div className="wide-container">
      <AiGovernanceReviewScreen />
    </div>
  )
}
