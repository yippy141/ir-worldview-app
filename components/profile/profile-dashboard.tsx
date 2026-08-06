"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { trackProductEvent } from "@/lib/analytics/adapter"
import { CurrentJudgmentsSection } from "@/components/profile/current-judgments-section"
import { ProfileReport } from "@/components/profile/profile-report"
import { ProfileShareActions } from "@/components/profile/profile-share-actions"
import { loadCurrentCaseResponseStore } from "@/lib/current-cases/response-store"
import type { CurrentCaseResponseStore } from "@/lib/current-cases/types"
import { resolveFoundationArchetypeFromSnapshot } from "@/lib/profile-foundation-identity"
import {
  loadProfileStore,
  type ProfileStore,
} from "@/lib/profile-store"
import {
  buildProfileSharePayload,
  buildProfileSharePayloadV1,
  encodeProfileSharePayload,
} from "@/lib/profile-share"

export function ProfileDashboard() {
  const [profile, setProfile] = useState<ProfileStore | null>(null)
  const [currentCases, setCurrentCases] = useState<CurrentCaseResponseStore | null>(null)
  const viewTracked = useRef(false)

  useEffect(() => {
    if (!viewTracked.current) {
      viewTracked.current = true
      trackProductEvent("profile_viewed")
    }
    const load = () => {
      setProfile(loadProfileStore())
      setCurrentCases(loadCurrentCaseResponseStore())
    }

    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  if (profile === null || currentCases === null) {
    return (
      <section className="profile-state-panel profile-state-panel--loading stack-md" aria-busy="true">
        <p className="eyebrow">Profile</p>
        <div className="stack-xs">
          <h1>Loading your Profile from this browser...</h1>
          <p className="profile-state-panel__body">
            Profile is stored locally on this device unless you choose to share it.
          </p>
        </div>
        <div className="profile-state-loading-bar" aria-hidden="true" />
      </section>
    )
  }

  if (!profile.foundation) {
    return (
      <div className="stack-lg">
        <section className="profile-state-panel profile-state-panel--empty stack-lg">
          <div className="profile-state-panel__intro stack-sm">
            <p className="eyebrow">Profile</p>
            <h1>Your Profile begins with the Foundation.</h1>
            <p className="profile-state-panel__body">
              Start with the Foundation. Your results stay on this device unless you choose to
              share them. Afterward, you can add Focus Area and AI results. Each remains separate
              so you can read each domain on its own terms.
            </p>
          </div>

          <div className="profile-state-actions" aria-label="Profile starting points">
            <Link href="/quiz" className="profile-state-action profile-state-action--primary">
              <span className="profile-state-action__label">Start the Foundation</span>
              <span className="profile-state-action__meta">Build the baseline first.</span>
            </Link>
            <Link href="/ai" className="profile-state-action">
              <span className="profile-state-action__label">Try AI Governance</span>
              <span className="profile-state-action__meta">Read your AI-policy judgments.</span>
            </Link>
            <Link href="/explore" className="profile-state-action">
              <span className="profile-state-action__label">Browse the field guide</span>
              <span className="profile-state-action__meta">Read the traditions and Decision Patterns before answering questions.</span>
            </Link>
          </div>

          <p className="profile-state-panel__note">
            No account is required. This page reads saved results from this browser.
          </p>
        </section>
        <CurrentJudgmentsSection store={currentCases} />
      </div>
    )
  }

  // Current, canonical records use V3, which stores each domain independently.
  // V1 remains available only when a legacy module has no canonical token and
  // would otherwise disappear from the shared record.
  const sharePayload = (() => {
    const hasLegacyModule = Object.values(profile.modules).some(
      (snapshot) => snapshot && !snapshot.payload,
    )
    const payload = hasLegacyModule
      ? buildProfileSharePayloadV1(profile)
      : buildProfileSharePayload(profile)
    return payload ? encodeProfileSharePayload(payload) : null
  })()
  const foundationArchetype =
    resolveFoundationArchetypeFromSnapshot(profile.foundation)

  return (
    <>
      <ProfileReport
        profile={profile}
        mode="local"
        actionSlot={
          sharePayload ? (
            <ProfileShareActions
              payload={sharePayload}
              headline={
                foundationArchetype?.name ?? "Foundation identity unavailable"
              }
            />
          ) : undefined
        }
      />
      <CurrentJudgmentsSection store={currentCases} />
    </>
  )
}
