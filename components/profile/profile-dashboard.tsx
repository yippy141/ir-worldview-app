"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { trackProductEvent } from "@/lib/analytics/adapter"
import { CurrentJudgmentsSection } from "@/components/profile/current-judgments-section"
import { ProfileReport } from "@/components/profile/profile-report"
import { hasAnyCurrentProfileRecord } from "@/components/profile/profile-record-presence"
import { ProfileShareActions } from "@/components/profile/profile-share-actions"
import { loadCurrentCaseResponseStore } from "@/lib/current-cases/response-store"
import type { CurrentCaseResponseStore } from "@/lib/current-cases/types"
import { foundationIdentityTitle, resolveFoundationIdentityFromSnapshot } from "@/lib/profile-foundation-identity"
import {
  loadProfileStore,
  type ProfileStore,
} from "@/lib/profile-store"
import {
  buildCompatibleProfileSharePayload,
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
          <h1>Loading your Profile from this browser</h1>
          <p className="profile-state-panel__body">
            Profile is stored locally on this device unless you choose to share it.
          </p>
        </div>
        <div className="profile-state-loading-bar" aria-hidden="true" />
      </section>
    )
  }

  if (!hasAnyCurrentProfileRecord(profile)) {
    return (
      <div className="stack-lg">
        <section className="profile-state-panel profile-state-panel--empty stack-lg">
          <div className="profile-state-panel__intro stack-sm">
            <p className="eyebrow">Profile</p>
            <h1>Your results, ready to return to</h1>
            <p className="profile-state-panel__body">
              Start with Foundation or AI Governance. Your completed results will appear here.
              Results stay on this device unless you choose to share them.
            </p>
          </div>

          <div className="profile-state-actions" aria-label="Profile starting points">
            <Link href="/quiz" className="profile-state-action profile-state-action--primary">
              <span className="profile-state-action__label">Start the Foundation</span>
              <span className="profile-state-action__meta">Answer fourteen broad questions.</span>
            </Link>
            <Link href="/ai" className="profile-state-action">
              <span className="profile-state-action__label">Try AI Governance</span>
              <span className="profile-state-action__meta">Examine who should govern capable AI.</span>
            </Link>
            <Link href="/modules/security" className="profile-state-action">
              <span className="profile-state-action__label">Security archive</span>
              <span className="profile-state-action__meta">New questionnaires are paused. Earlier result links still open.</span>
            </Link>
            <Link href="/modules/technology" className="profile-state-action">
              <span className="profile-state-action__label">Technology archive</span>
              <span className="profile-state-action__meta">Reopen an earlier result or try a short decision exercise.</span>
            </Link>
          </div>

          <p className="profile-state-panel__note">
            No results are saved yet. No account is required. <Link href="/decisions">Try a short decision</Link> or <Link href="/explore">browse the Library</Link>.
          </p>
        </section>
        <CurrentJudgmentsSection store={currentCases} />
      </div>
    )
  }

  const sharePayload = (() => {
    const payload = buildCompatibleProfileSharePayload(profile)
    return payload ? encodeProfileSharePayload(payload) : null
  })()
  const foundationIdentity = profile.foundation
    ? resolveFoundationIdentityFromSnapshot(profile.foundation)
    : null

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
                foundationIdentityTitle(foundationIdentity)
              }
            />
          ) : undefined
        }
      />
      <CurrentJudgmentsSection store={currentCases} />
    </>
  )
}
