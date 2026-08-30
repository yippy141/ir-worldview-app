"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { MouseEvent, ReactNode } from "react"
import type { FoundationSnapshot } from "@/lib/profile-store"
import {
  writeFoundationEvidenceHandoffForProfileSnapshot,
} from "@/lib/results/local-evidence"

export function FoundationProfileResultLink({
  href,
  snapshot,
  className,
  children,
}: {
  href: string
  snapshot: Pick<
    FoundationSnapshot,
    "payload" | "mode" | "localEvidenceId"
  >
  className?: string
  children: ReactNode
}) {
  const router = useRouter()

  async function openLocalResult(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
      || !snapshot.localEvidenceId
      || !snapshot.mode
    ) {
      return
    }

    event.preventDefault()
    try {
      await writeFoundationEvidenceHandoffForProfileSnapshot(
        window.sessionStorage,
        snapshot,
      )
    } catch {
      // A digest or session-storage failure keeps the result truthful by
      // navigating without a local binding.
    }
    router.push(href)
  }

  return (
    <Link href={href} className={className} onClick={openLocalResult}>
      {children}
    </Link>
  )
}
