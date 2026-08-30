"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  emptyProfileStore,
  loadProfileStore,
  type ModuleSnapshot,
  type ProfileStore,
} from "@/lib/profile-store"
import styles from "./foundation-result-story.module.css"

type DomainRecord = {
  key: string
  label: string
  record: ModuleSnapshot | ProfileStore["aiGovernance"] | null
  startHref: string
}

export function FoundationDomainRecords() {
  const [profile, setProfile] = useState<ProfileStore>(() => emptyProfileStore())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const load = () => {
      setProfile(loadProfileStore())
      setReady(true)
    }

    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  const records: DomainRecord[] = [
    {
      key: "security",
      label: "Security",
      record: profile.modules.security ?? null,
      startHref: "/modules/security",
    },
    {
      key: "technology",
      label: "Technology",
      record: profile.modules.technology ?? null,
      startHref: "/modules/technology",
    },
    {
      key: "ai-governance",
      label: "AI Governance",
      record: profile.aiGovernance,
      startHref: "/ai",
    },
  ]

  return (
    <div className={styles.domainRecords} aria-live="polite">
      {records.map(({ key, label, record, startHref }) => (
        <article key={key} className={styles.domainRecord}>
          <h3>{label}</h3>
          {!ready ? (
            <p>Checking this device for a saved record.</p>
          ) : record ? (
            <>
              <p>
                {"headline" in record
                  ? record.headline
                  : record.archetypeLabel}
              </p>
              <Link href={record.resultPath}>Open the saved {label} record</Link>
            </>
          ) : (
            <>
              <p>No saved {label} record is available on this device.</p>
              <Link href={startHref}>Open {label}</Link>
            </>
          )}
        </article>
      ))}
    </div>
  )
}
