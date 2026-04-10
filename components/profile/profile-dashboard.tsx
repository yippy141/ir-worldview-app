"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { dimensionLabels } from "@/lib/quiz-schema"
import {
  loadProfileStore,
  type ModuleSnapshot,
  type ProfileStore,
} from "@/lib/profile-store"
import {
  buildCrossDomainTensions,
  buildIntegratedHeadline,
} from "@/lib/profile-helpers"

const STRATEGY_LABELS = {
  Restrainer: "Restrained strategy",
  Hedger: "Conditional strategy",
  Maximizer: "Harder competitive strategy",
} as const

const NORMATIVE_LABELS = {
  Pluralist: "Order-first normative style",
  "Conditional Solidarist": "Mixed normative style",
  Universalist: "Justice-forward normative style",
} as const

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
            <Link href="/quiz" className="cta-primary">Take the Foundation</Link>
            <Link href="/explore" className="cta-secondary">Explore the perspectives</Link>
          </div>
        </section>
      </div>
    )
  }

  const foundation = profile.foundation
  const moduleSnapshots = Object.values(profile.modules)
    .filter((moduleSnapshot): moduleSnapshot is ModuleSnapshot => Boolean(moduleSnapshot))
    .sort((a, b) => b.timestamp - a.timestamp)
  const tensions = buildCrossDomainTensions(profile)

  return (
    <article className="result-article">
      <section className="profile-hero">
        <p className="eyebrow">Profile</p>
        <h1>{buildIntegratedHeadline(profile)}</h1>
        <p className="muted" style={{ lineHeight: "1.75", maxWidth: "760px" }}>
          {foundation.summary}
        </p>
        <div className="row gap-sm wrap" style={{ marginTop: "18px" }}>
          <span className="mode-pill">{foundation.familyLabel}</span>
          <span className="mode-pill">{foundation.runnerUpLabel}</span>
          <span className="mode-pill">{STRATEGY_LABELS[foundation.strategyModifier]}</span>
          <span className="mode-pill">{NORMATIVE_LABELS[foundation.normativeModifier]}</span>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>Foundation spine</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            The baseline dimensions remain the anchor. Focus-area modules overlay this spine; they
            do not replace it.
          </p>
        </div>
        <div>
          {Object.entries(foundation.dimensionScores).map(([dimension, value]) => (
            <div key={dimension} className="dim-row">
              <div className="progress-meta">
                <span style={{ fontWeight: 600, color: "var(--text)" }}>
                  {dimensionLabels[dimension as keyof typeof dimensionLabels]}
                </span>
                <span>{value.toFixed(1)} / 7</span>
              </div>
              <div className="score-bar" style={{ margin: "6px 0" }} aria-hidden="true">
                <div className="score-fill" style={{ width: `${(value / 7) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>Strongest lenses</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            The strongest baseline signals before any focus-area overlay.
          </p>
        </div>
        <div className="driver-grid">
          {foundation.keyDrivers.map((driver) => (
            <div key={driver.label} className="driver-card stack-xs">
              <p className="eyebrow">{driver.type}</p>
              <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>{driver.label}</p>
              <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
                {driver.description}
              </p>
            </div>
          ))}
          {foundation.strongLenses.map((lens) => (
            <div key={lens.label} className="driver-card stack-xs">
              <p className="eyebrow">Lens</p>
              <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>{lens.label}</p>
              <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
                {lens.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>Focus-area overlays</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            Completed modules are shown here as issue reads layered on top of the Foundation.
          </p>
        </div>
        {moduleSnapshots.length > 0 ? (
          <div className="profile-module-grid">
            {moduleSnapshots.map((moduleSnapshot) => (
              <div key={moduleSnapshot.slug} className="explore-card stack-sm">
                <div className="stack-xs">
                  <p className="eyebrow">{moduleSnapshot.title}</p>
                  <h3>{moduleSnapshot.headline}</h3>
                  <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                    {moduleSnapshot.summary}
                  </p>
                </div>
                {moduleSnapshot.comparison ? (
                  <div className="callout">
                    <p style={{ fontSize: "0.88rem", lineHeight: "1.6" }}>
                      <strong>Baseline delta:</strong> {moduleSnapshot.comparison}
                    </p>
                  </div>
                ) : null}
                <ul className="content-list" style={{ margin: 0 }}>
                  {moduleSnapshot.instincts.slice(0, 3).map((instinct) => (
                    <li key={instinct}>{instinct}</li>
                  ))}
                </ul>
                <p className="muted" style={{ fontSize: "0.84rem", lineHeight: "1.6" }}>
                  <strong>Caveat:</strong> {moduleSnapshot.challenge}
                </p>
                <p>
                  <Link href={moduleSnapshot.resultPath} style={{ color: "var(--accent)" }}>
                    Open full result →
                  </Link>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="callout stack-xs">
            <p style={{ fontWeight: 600 }}>No focus-area overlays yet</p>
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
              The Foundation already gives you a complete baseline. Focus-area modules add pressure
              tests in Security and Technology when you want to see how that baseline travels.
            </p>
            <p>
              <Link href={`/modules?foundation=${encodeURIComponent(foundation.payload)}`} style={{ color: "var(--accent)" }}>
                Browse focus-area modules →
              </Link>
            </p>
          </div>
        )}
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>Cross-domain tensions</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            Places where the baseline and issue-specific overlays pull in different directions.
          </p>
        </div>
        {tensions.length > 0 ? (
          <ul className="content-list result-prose">
            {tensions.map((tension) => (
              <li key={tension}>{tension}</li>
            ))}
          </ul>
        ) : (
          <p className="muted" style={{ lineHeight: "1.65" }}>
            Your current saved results are more aligned than conflicted. Add another focus-area
            module if you want more cross-domain contrast.
          </p>
        )}
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs">
          <h2>Evidence and detail</h2>
          <p className="muted" style={{ fontSize: "0.9rem", lineHeight: "1.65" }}>
            Open the drawers below for the saved Foundation result and the lower-evidence module
            logs on this device.
          </p>
        </div>

        <details className="profile-details">
          <summary>Foundation result</summary>
          <div className="stack-sm">
            <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
              Closest traditions: {foundation.familyLabel} and {foundation.runnerUpLabel}.
            </p>
            <p>
              <Link href={foundation.resultPath} style={{ color: "var(--accent)" }}>
                Open Foundation result →
              </Link>
            </p>
          </div>
        </details>

        {moduleSnapshots.map((moduleSnapshot) => (
          <details key={moduleSnapshot.slug} className="profile-details">
            <summary>{moduleSnapshot.title} evidence log</summary>
            <div className="stack-sm">
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                What it measured: {moduleSnapshot.measures.join("; ")}.
              </p>
              <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
                What it did not claim: {moduleSnapshot.doesNotClaim.join("; ")}.
              </p>
              <div className="stack-xs">
                {moduleSnapshot.evidence.map((item) => (
                  <div key={`${moduleSnapshot.slug}-${item.question}`} className="panel-flush stack-xs">
                    <p style={{ fontWeight: 600, fontSize: "0.92rem" }}>{item.question}</p>
                    <p className="muted" style={{ fontSize: "0.86rem", lineHeight: "1.6" }}>
                      Most persuasive: {item.primary}
                      {item.secondary ? ` · Second-most persuasive: ${item.secondary}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </details>
        ))}
      </section>
    </article>
  )
}
