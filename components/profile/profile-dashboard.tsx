"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ProfileReport } from "@/components/profile/profile-report"
import { ProfileShareActions } from "@/components/profile/profile-share-actions"
import { buildIntegratedHeadline } from "@/lib/profile-helpers"
import {
  loadProfileStore,
  type ProfileStore,
} from "@/lib/profile-store"
import {
  buildProfileSharePayload,
  encodeProfileSharePayload,
} from "@/lib/profile-share"

export function ProfileDashboard() {
  const [profile, setProfile] = useState<ProfileStore | null>(null)

  useEffect(() => {
    const load = () => setProfile(loadProfileStore())

    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  if (profile === null) {
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
            <h1>Your Profile builds as you complete layers.</h1>
            <p className="profile-state-panel__body">
              Start with the Foundation. Your results stay on this device unless you choose to
              share them. After that, focus-area modules and AI Governance can sit beside the
              baseline without becoming one fake master score.
            </p>
          </div>

          <div className="profile-state-actions" aria-label="Profile starting points">
            <Link href="/quiz" className="profile-state-action profile-state-action--primary">
              <span className="profile-state-action__label">Start the Foundation</span>
              <span className="profile-state-action__meta">Build the baseline first.</span>
            </Link>
            <Link href="/ai" className="profile-state-action">
              <span className="profile-state-action__label">Try AI Governance</span>
              <span className="profile-state-action__meta">Map your AI-policy instincts.</span>
            </Link>
            <Link href="/explore" className="profile-state-action">
              <span className="profile-state-action__label">Browse the field guide</span>
              <span className="profile-state-action__meta">Read the traditions before taking a quiz.</span>
            </Link>
          </div>

          <p className="profile-state-panel__note">
            No account is required. This page reads saved results from this browser.
          </p>
        </section>
      </div>
    )
  }

  const sharePayload = (() => {
    const payload = buildProfileSharePayload(profile)
    return payload ? encodeProfileSharePayload(payload) : null
  })()

  return (
    <ProfileReport
      profile={profile}
      mode="local"
      actionSlot={
        sharePayload ? (
          <ProfileShareActions
            payload={sharePayload}
            headline={buildIntegratedHeadline(profile)}
          />
        ) : undefined
      }
    />
  )
}
