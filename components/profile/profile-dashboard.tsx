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
    return <div className="panel" style={{ padding: "40px" }}>Loading your profile…</div>
  }

  if (!profile.foundation) {
    return (
      <div className="stack-lg">
        <section className="panel stack-md">
          <p className="eyebrow">Profile</p>
          <h1>Your integrated profile will appear here</h1>
          <p className="muted" style={{ lineHeight: "1.7", maxWidth: "720px" }}>
            Start with the Foundation. Once you generate a result, this page will combine that
            baseline with any completed focus-area modules on this device.
          </p>
          <div className="row gap-sm wrap">
            <Link href="/quiz" className="cta-primary">Take the Foundation questionnaire</Link>
            <Link href="/explore" className="cta-secondary">Browse the field guide</Link>
          </div>
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
