"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { CurrentCaseApp } from "@/components/current-case/current-case-app"
import type { CurrentCaseChallengeFailureReason } from "@/lib/current-cases/challenge"
import type { CurrentCasePublicRecord } from "@/lib/current-cases/presentation"
import styles from "./current-case.module.css"

type ChallengeGateFailureReason =
  | CurrentCaseChallengeFailureReason
  | "rate-limited"
  | "unavailable"

type ChallengeGateState =
  | { status: "checking" }
  | { status: "valid"; token: string; expiresAt: number }
  | {
      status: "invalid"
      reason: ChallengeGateFailureReason
    }

type ChallengeValidationResponse =
  | { ok: true; expiresAt: number }
  | {
      ok: false
      reason?: ChallengeGateFailureReason
      error: string
    }

export function CurrentCaseChallengeGate({
  record,
}: {
  record: CurrentCasePublicRecord
}) {
  const [state, setState] = useState<ChallengeGateState>({ status: "checking" })
  const validationAttempted = useRef(false)

  useEffect(() => {
    if (validationAttempted.current) return
    validationAttempted.current = true
    let cancelled = false
    const failSoon = (reason: ChallengeGateFailureReason) => {
      queueMicrotask(() => {
        if (!cancelled) setState({ status: "invalid", reason })
      })
    }
    const fragment = window.location.hash.slice(1)
    let token = ""
    try {
      token = decodeURIComponent(fragment)
    } catch {
      failSoon("malformed")
      return () => {
        cancelled = true
      }
    }
    if (!token) {
      failSoon("malformed")
      return () => {
        cancelled = true
      }
    }

    async function validateChallenge() {
      try {
        const response = await fetch("/api/current-cases/challenge/validate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token, caseId: record.id }),
        })
        const body = (await response.json()) as ChallengeValidationResponse
        if (cancelled) return
        if (!response.ok || !body.ok) {
          setState({
            status: "invalid",
            reason: body.ok ? "invalid" : body.reason ?? "invalid",
          })
          return
        }
        setState({ status: "valid", token, expiresAt: body.expiresAt })
      } catch {
        if (!cancelled) setState({ status: "invalid", reason: "unavailable" })
      }
    }

    void validateChallenge()
    return () => {
      cancelled = true
    }
  }, [record.id])

  if (state.status === "checking") {
    return (
      <section className={styles.challengeChecking} aria-busy="true" aria-live="polite">
        Verifying this challenge link…
      </section>
    )
  }

  if (state.status === "invalid") {
    return <ChallengeRecovery reason={state.reason} slug={record.slug} />
  }

  return (
    <>
      <aside className={styles.challengeInvitation} aria-labelledby="challenge-invitation-heading">
        <h2 id="challenge-invitation-heading">Make your call before seeing theirs</h2>
        <p>
          A friend has shared an encrypted final judgment. Complete the case first; their choice
          and confidence will be revealed beside yours afterward.
        </p>
      </aside>
      <CurrentCaseApp
        record={record}
        challenge={{ token: state.token, expiresAt: state.expiresAt }}
      />
    </>
  )
}

function ChallengeRecovery({
  reason,
  slug,
}: {
  reason: ChallengeGateFailureReason
  slug: string
}) {
  const content = recoveryContent(reason)
  return (
    <section className={styles.recoveryPanel} aria-labelledby="challenge-recovery-heading">
      <p className={`${styles.recoveryEyebrow} eyebrow`}>Current Case challenge</p>
      <h1 id="challenge-recovery-heading">{content.heading}</h1>
      <p>{content.message}</p>
      <div className={styles.recoveryActions}>
        <Link href={`/cases/${slug}`} className={styles.primaryLink}>
          Open the case without the challenge
        </Link>
        <Link href="/cases" className={styles.secondaryLink}>
          Browse Current Cases
        </Link>
      </div>
    </section>
  )
}

function recoveryContent(
  reason: ChallengeGateFailureReason,
) {
  if (reason === "expired") {
    return {
      heading: "This challenge link has expired.",
      message:
        "Challenge links expire after 30 days. You can still complete the case, but the inviter’s reading can no longer be revealed from this link.",
    }
  }
  if (reason === "wrong-case") {
    return {
      heading: "This challenge does not match this case.",
      message:
        "The link may have been edited or paired with a different case address. Open the case normally to make your own judgment.",
    }
  }
  if (reason === "missing-secret") {
    return {
      heading: "Challenge links are temporarily unavailable.",
      message:
        "The case remains available, but this deployment cannot verify encrypted challenges right now.",
    }
  }
  if (reason === "rate-limited") {
    return {
      heading: "This challenge cannot be checked yet.",
      message:
        "Too many challenge links were checked from this connection. Wait a minute, then reload this page.",
    }
  }
  if (reason === "unavailable") {
    return {
      heading: "This challenge could not be checked.",
      message:
        "A connection problem prevented verification. Reload this page to try again, or open the ordinary case without the comparison.",
    }
  }
  return {
    heading: "This challenge link is not valid.",
    message:
      "The link may be incomplete or altered. No inviter answer has been shown. You can still open the ordinary case.",
  }
}
