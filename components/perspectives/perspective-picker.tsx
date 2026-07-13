"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { perspectiveCatalog } from "@/lib/perspectives/catalog"
import { situationLabel } from "@/lib/perspectives/situations"
import { formatFieldDate } from "@/lib/field/items"
import { loadProfileStore, type FoundationSnapshot } from "@/lib/profile-store"

type BaselineState =
  | { status: "loading" }
  | { status: "absent" }
  | { status: "present"; foundation: FoundationSnapshot }

export function PerspectivePicker() {
  const [baseline, setBaseline] = useState<BaselineState>({ status: "loading" })

  useEffect(() => {
    const load = () => {
      const foundation = loadProfileStore().foundation
      setBaseline(foundation ? { status: "present", foundation } : { status: "absent" })
    }

    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  return (
    <div className="stack-lg">
      <header className="article-header stack-md">
        <div className="stack-xs">
          <p className="eyebrow">Perspectives</p>
          <h1>Advise from a different seat.</h1>
        </div>
        <p className="muted perspective-page-lead">
          The Foundation recorded your own judgment across seven dimensions. A Perspective Run asks
          you to advise from a defined strategic position, such as an exposed ally or a rising
          power. Your baseline stays unchanged.
        </p>
        <p className="muted perspective-page-note">
          Every brief covers the same three situations: a seventy-two-hour security shock, an
          authority decision under public pressure, and a strategic economic exposure. The chair
          changes; the problems repeat.
        </p>
      </header>

      <BaselineStatusStrip baseline={baseline} />

      <div className="perspective-pack-grid" role="list">
        {perspectiveCatalog.map((perspective) => (
          <article key={perspective.id} className="perspective-pack-card stack-sm" role="listitem">
            <p className="eyebrow">Role brief</p>
            <h2 className="perspective-pack-card__title">{perspective.label}</h2>
            <p className="perspective-pack-card__mandate">{perspective.description}</p>
            <div className="stack-xs">
              <p className="perspective-pack-card__kicker">On the agenda</p>
              <ul className="perspective-pack-card__agenda">
                {perspective.scenarios.map((scenario) => (
                  <li key={scenario.id}>{situationLabel(scenario)}</li>
                ))}
              </ul>
            </div>
            <p className="perspective-pack-card__meta">
              {perspective.scenarios.length} scenarios · about 5 min · set v
              {perspective.scenarioSetVersion}
            </p>
            <div className="row gap-sm wrap">
              <Link href={`/perspectives/${perspective.id}`} className="cta-secondary">
                Open the brief
              </Link>
            </div>
          </article>
        ))}
      </div>

      <footer className="result-section stack-sm">
        <p className="muted perspective-page-footnote">
          Runs save to this device only when you choose to keep them. A run produces a contextual
          shift, plotted beside your baseline across the same seven dimensions.{" "}
          <Link href="/method">Read methods</Link>
        </p>
      </footer>
    </div>
  )
}

function BaselineStatusStrip({ baseline }: { baseline: BaselineState }) {
  if (baseline.status === "loading") {
    return (
      <section className="perspective-baseline-strip" aria-busy="true">
        <p className="muted">Checking for a saved Foundation baseline…</p>
      </section>
    )
  }

  if (baseline.status === "absent") {
    return (
      <section className="perspective-baseline-strip perspective-baseline-strip--absent stack-xs">
        <p className="perspective-baseline-strip__line">
          No Foundation baseline is saved on this device.
        </p>
        <p className="muted perspective-baseline-strip__note">
          Take the Foundation first so a run has a baseline for comparison.
        </p>
        <div className="row gap-sm wrap">
          <Link href="/quiz" className="cta-primary">Take the Foundation</Link>
        </div>
      </section>
    )
  }

  const { foundation } = baseline
  return (
    <section className="perspective-baseline-strip stack-xs">
      <p className="perspective-baseline-strip__line">
        <span className="perspective-baseline-strip__dot" aria-hidden="true" />
        Baseline saved: {foundation.familyLabel} · {formatFieldDate(foundation.timestamp)}
      </p>
      <p className="muted perspective-baseline-strip__note">
        Each run is measured against it. <Link href="/profile">View profile</Link>
      </p>
    </section>
  )
}
