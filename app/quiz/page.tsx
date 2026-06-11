import { Suspense } from "react"
import { QuizApp } from "@/components/quiz-app"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Foundation — IR Worldview Inventory",
  description:
    "Choose Standard or Advanced mode and complete the shared Foundation of the IR Worldview Inventory.",
}

export default function QuizPage() {
  return (
    <div className="wide-container">
      {/* QuizApp uses useSearchParams, which requires a Suspense boundary in Next.js App Router. */}
      <Suspense fallback={<div className="panel" style={{ padding: "40px" }}>Loading quiz…</div>}>
        <QuizApp />
      </Suspense>
    </div>
  )
}
