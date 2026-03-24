import { Suspense } from "react"
import { QuizApp } from "@/components/quiz-app"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quiz — IR Worldview Inventory",
  description: "Take the IR Worldview Inventory — 21 core questions plus branching scenarios.",
}

export default function QuizPage() {
  return (
    // QuizApp uses useSearchParams, which requires a Suspense boundary in Next.js App Router.
    <Suspense fallback={<div className="panel" style={{ padding: "40px" }}>Loading quiz…</div>}>
      <QuizApp />
    </Suspense>
  )
}
