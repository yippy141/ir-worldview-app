"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  loadProfileStore,
  type AiGovernanceSnapshot,
} from "@/lib/profile-store"

export function AiResultReturnLink({
  className = "cta-secondary",
}: {
  className?: string
}) {
  const [snapshot, setSnapshot] = useState<AiGovernanceSnapshot | null>(null)

  useEffect(() => {
    const load = () => setSnapshot(loadProfileStore().aiGovernance)

    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  if (snapshot) {
    return (
      <Link href={snapshot.resultPath} className={`${className} saved-result-action`}>
        Open saved AI result
      </Link>
    )
  }

  return (
    <Link href="/ai/quiz" className={`${className} saved-result-action`}>
      Start AI Governance
    </Link>
  )
}
