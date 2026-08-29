import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ResultScroll } from "@/components/dev/v23-6/result-scroll"

export const metadata: Metadata = {
  title: "Foundation result scroll prototype | IR Worldview Inventory",
  description:
    "An isolated prototype that reads one frozen Foundation result as a single argument from payoff to limits.",
  robots: { index: false, follow: false },
}

export default function ResultScrollPage() {
  if (process.env.NODE_ENV === "production") notFound()

  return <ResultScroll />
}
