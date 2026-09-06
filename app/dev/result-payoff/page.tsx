import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = { title: "Result payoff experiment | IR Worldview Inventory", robots: { index: false, follow: false } }
export const dynamic = "force-dynamic"

export default async function ResultPayoffPage({ searchParams }: { searchParams: Promise<{ fixture?: string; episode?: string }> }) {
  // Existing guard: production-mode Vercel previews also return 404.
  if (process.env.NODE_ENV === "production") notFound()
  const { default: Experiment } = await import("@/experiments/result-payoff/experiment")
  return <Experiment searchParams={searchParams} />
}
