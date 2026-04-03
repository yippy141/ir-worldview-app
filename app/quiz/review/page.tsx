import { ReviewScreen } from "@/components/quiz/review-screen"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Review — IR Worldview Inventory",
  description: "Review your answers before generating your worldview result.",
}

export default function ReviewPage() {
  return (
    <div className="wide-container">
      <ReviewScreen />
    </div>
  )
}
