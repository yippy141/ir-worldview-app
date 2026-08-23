"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { loadProfileStore, type FoundationSnapshot } from "@/lib/profile-store"
import { DEFAULT_DOMAIN_RELATION_READ } from "@/lib/modules/authoring-contract"
import { buildAiFoundationBaseline } from "@/lib/ai-foundation-baseline"

export function AiProjectBridge({
  mode,
}: {
  mode: "landing" | "result"
}) {
  const [foundation, setFoundation] = useState<FoundationSnapshot | null>(null)

  useEffect(() => {
    const load = () => setFoundation(loadProfileStore().foundation)

    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  const baseline = foundation
    ? buildAiFoundationBaseline(foundation)
    : null

  if (mode === "landing") {
    return (
      <section className="ai-bridge-panel stack-md" aria-label="AI project bridge">
        <div className="stack-xs">
          <p className="eyebrow">Same overall project</p>
          <h2 style={{ margin: 0 }}>AI belongs beside the IR baseline</h2>
          <p className="ai-bridge-note">
            The Foundation records a broad view of world politics. The AI Governance Compass
            records judgments about frontier-AI governance on its own domain scale.
          </p>
        </div>

        <div className="ai-bridge-grid">
          <article className="ai-bridge-card stack-xs">
            <p className="ai-bridge-kicker">Current IR baseline</p>
            {baseline ? (
              <>
                <p className="ai-bridge-title">{baseline.primaryLabel}</p>
                <p className="ai-bridge-note">{baseline.secondaryLabel}</p>
              </>
            ) : (
              <>
                <p className="ai-bridge-title">No Foundation result saved yet</p>
                <p className="ai-bridge-note">
                  You can take AI on its own. It reads better beside a saved Foundation result.
                </p>
              </>
            )}
          </article>

          <article className="ai-bridge-card stack-xs">
            <p className="ai-bridge-kicker">What changes here</p>
            <p className="ai-bridge-note">
              The AI result does not rewrite the Foundation. Without a reviewed bridge, the two
              records sit side by side and no relationship is inferred between them.
            </p>
          </article>
        </div>
      </section>
    )
  }

  return (
    <section className="result-section stack-md">
      <div className="stack-xs">
        <p className="eyebrow">IR relationship</p>
        <h2>AI and the Foundation remain separate domain reads</h2>
        {baseline ? null : (
          <p className="muted result-note">
            No IR Foundation baseline is saved on this device yet. The AI result still stands on
            its own.
          </p>
        )}
      </div>

      {baseline ? (
        <div className="ai-bridge-grid">
          <article className="ai-bridge-card stack-xs">
            <p className="ai-bridge-kicker">IR baseline on this device</p>
            <p className="ai-bridge-title">{baseline.primaryLabel}</p>
            <p className="ai-bridge-note">{baseline.secondaryLabel}</p>
          </article>

          <article className="ai-bridge-card stack-xs">
            <p className="ai-bridge-kicker">Relation status</p>
            <p className="ai-bridge-title">
              {DEFAULT_DOMAIN_RELATION_READ.relation === "not-comparable"
                ? "Separate reads — no reviewed bridge"
                : DEFAULT_DOMAIN_RELATION_READ.relation}
            </p>
            <p className="ai-bridge-note">
              No explicit reviewed bridge currently connects AI axes to Foundation dimensions.
            </p>
          </article>

          <article className="ai-bridge-card stack-xs">
            <p className="ai-bridge-kicker">How to read the two records</p>
            <p className="ai-bridge-note">
              Read them side by side. The app does not infer alignment from a Foundation family,
              an AI archetype, or raw 1–7 values, and it does not combine them into a master score.
            </p>
            <p style={{ margin: 0 }}>
              <Link href="/profile" style={{ color: "var(--accent)" }}>
                Open Profile →
              </Link>
            </p>
          </article>
        </div>
      ) : (
        <div className="callout stack-xs">
          <p style={{ fontWeight: 600 }}>Foundation baseline not yet saved</p>
          <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.92rem" }}>
            You may save a Foundation result and read the two records side by side inside Profile.
            The records remain separate unless a reviewed bridge is explicitly authored.
          </p>
          <p style={{ margin: 0 }}>
            <Link href="/quiz" style={{ color: "var(--accent)" }}>
              Take the Foundation →
            </Link>
          </p>
        </div>
      )}
    </section>
  )
}
