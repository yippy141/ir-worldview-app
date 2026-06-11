"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { getCrossModuleSynthesis } from "@/lib/ai-governance-cross-module-synthesis"
import { loadProfileStore, type FoundationSnapshot } from "@/lib/profile-store"
import type { AiArchetypeKey } from "@/lib/ai-governance-types"

export function AiProjectBridge({
  mode,
  aiArchetypeKey,
}: {
  mode: "landing" | "result"
  aiArchetypeKey?: AiArchetypeKey
}) {
  const [foundation, setFoundation] = useState<FoundationSnapshot | null>(null)

  useEffect(() => {
    const load = () => setFoundation(loadProfileStore().foundation)

    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  const synthesis = useMemo(
    () => getCrossModuleSynthesis(foundation?.familyKey ?? null, aiArchetypeKey ?? null),
    [foundation, aiArchetypeKey],
  )

  if (mode === "landing") {
    return (
      <section className="ai-bridge-panel stack-md" aria-label="AI project bridge">
        <div className="stack-xs">
          <p className="eyebrow">Same overall project</p>
          <h2 style={{ margin: 0 }}>AI belongs beside the IR baseline</h2>
          <p className="ai-bridge-note">
            The Foundation names your starting view of world politics. The AI Governance Compass
            asks how that view travels when the problem is frontier AI.
          </p>
        </div>

        <div className="ai-bridge-grid">
          <article className="ai-bridge-card stack-xs">
            <p className="ai-bridge-kicker">Current IR baseline</p>
            {foundation ? (
              <>
                <p className="ai-bridge-title">{foundation.familyLabel} on this device</p>
                <p className="ai-bridge-note">
                  {foundation.strategyModifier} · {foundation.normativeModifier}
                </p>
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
              The AI result does not rewrite your Foundation label. It shows how your governing
              instincts behave in a different policy field.
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
        <h2>How this AI result relates to your IR baseline</h2>
        <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65", maxWidth: "760px" }}>
          {foundation
            ? "Read this as a relationship between two saved layers in the same project, not as a rewritten Foundation identity or a single combined score."
            : "This AI result is part of the same project, but no IR Foundation baseline is saved on this device yet, so the relationship read stays general."}
        </p>
      </div>

      {foundation ? (
        <div className="ai-bridge-grid">
          <article className="ai-bridge-card stack-xs">
            <p className="ai-bridge-kicker">IR baseline on this device</p>
            <p className="ai-bridge-title">{foundation.familyLabel}</p>
            <p className="ai-bridge-note">
              {foundation.strategyModifier} · {foundation.normativeModifier}
            </p>
          </article>

          <article className="ai-bridge-card stack-xs">
            <p className="ai-bridge-kicker">Compared with your IR baseline</p>
            <ul className="content-list ai-bridge-list">
              {synthesis.likelyAlignment.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
              <li>{synthesis.likelyTensions[0]}</li>
            </ul>
          </article>

          <article className="ai-bridge-card stack-xs">
            <p className="ai-bridge-kicker">So what this adds</p>
            <p className="ai-bridge-note">{synthesis.practicalImplication}</p>
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
            The AI result still stands on its own, but the best next step is to save a Foundation result and then read the two together inside Profile.
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
