"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"
import { loadProfileStore } from "@/lib/profile-store"

type ModulesFoundationStateProps = {
  linkedFoundation: boolean
  variant: "actions" | "note"
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange)
  return () => window.removeEventListener("storage", onStoreChange)
}

function getDeviceFoundationSnapshot() {
  return Boolean(loadProfileStore().foundation)
}

function getServerSnapshot() {
  return false
}

export function ModulesFoundationState({
  linkedFoundation,
  variant,
}: ModulesFoundationStateProps) {
  const deviceFoundation = useSyncExternalStore(
    subscribe,
    getDeviceFoundationSnapshot,
    getServerSnapshot,
  )
  const hasFoundation = linkedFoundation || deviceFoundation

  if (variant === "actions") {
    return (
      <div className="row gap-sm wrap">
        {hasFoundation ? (
          <>
            <Link href="#available-modules" className="cta-primary">Choose a focus area</Link>
            <Link href="/profile" className="cta-secondary">View Profile</Link>
          </>
        ) : (
          <>
            <Link href="/quiz" className="cta-primary">Take the Foundation first</Link>
            <Link href="#available-modules" className="cta-secondary">Browse Focus Areas</Link>
          </>
        )}
      </div>
    )
  }

  return hasFoundation ? (
    <div className="lobby-note-band stack-xs">
      <p className="lobby-note-title">Your Foundation is available</p>
      <p className="muted lobby-side-text">
        A completed Focus Area will appear beside it in your Profile.
      </p>
    </div>
  ) : (
    <div className="lobby-note-band stack-xs">
      <p className="lobby-note-title">Foundation is the clearest starting point</p>
      <p className="muted lobby-side-text">
        You can still browse or complete a Focus Area without one.
      </p>
    </div>
  )
}
