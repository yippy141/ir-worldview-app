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
  href: string
  linkText: string
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
      href: "/modules/security",
      linkText: "Security questionnaire status",
    },
    {
      key: "technology",
      label: "Technology",
      record: profile.modules.technology ?? null,
      href: "/modules/technology",
      linkText: "Technology questionnaire status",
    },
    {
      key: "ai-governance",
      label: "AI Governance",
      record: profile.aiGovernance,
      href: "/ai",
      linkText: "Try AI Governance",
    },
  ]

  return (
    <div className={styles.domainRecords} aria-live="polite">
      {records.map(({ key, label, record, href, linkText }) => (
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
              <Link href={record.resultPath}>Open your saved {label} result</Link>
            </>
          ) : (
            <>
              <p>No {label} result saved here.</p>
              <Link href={href}>{linkText}</Link>
            </>
          )}
        </article>
      ))}
    </div>
  )
}
