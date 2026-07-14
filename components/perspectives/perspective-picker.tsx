"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react"
import { SectionStage } from "@/components/landing/section-stage"
import { perspectiveCatalog } from "@/lib/perspectives/catalog"
import { situationLabel } from "@/lib/perspectives/situations"
import { formatFieldDate } from "@/lib/field/items"
import { loadProfileStore, type FoundationSnapshot } from "@/lib/profile-store"
import { getSectionStage } from "@/lib/world-stage/section-stages"
import styles from "./perspectives.module.css"

type BaselineState =
  | { status: "loading" }
  | { status: "absent" }
  | { status: "present"; foundation: FoundationSnapshot }

const perspectivesStage = getSectionStage("perspectives")

export function PerspectivePicker() {
  const [baseline, setBaseline] = useState<BaselineState>({ status: "loading" })
  const [activeIndex, setActiveIndex] = useState(0)
  const roleRefs = useRef<Array<HTMLButtonElement | null>>([])
  const briefRef = useRef<HTMLElement | null>(null)
  const activePerspective = perspectiveCatalog[activeIndex]

  // On narrow layouts the brief renders below the index; without this, tapping
  // a seat gives no visible feedback.
  const revealBriefOnNarrowViewports = useCallback(() => {
    if (!window.matchMedia("(max-width: 900px)").matches) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    briefRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
    })
  }, [])

  useEffect(() => {
    const load = () => {
      const foundation = loadProfileStore().foundation
      setBaseline(foundation ? { status: "present", foundation } : { status: "absent" })
    }

    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  function handleRoleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null

    if (event.key === "ArrowDown") {
      nextIndex = (index + 1) % perspectiveCatalog.length
    } else if (event.key === "ArrowUp") {
      nextIndex = (index - 1 + perspectiveCatalog.length) % perspectiveCatalog.length
    } else if (event.key === "Home") {
      nextIndex = 0
    } else if (event.key === "End") {
      nextIndex = perspectiveCatalog.length - 1
    }

    if (nextIndex === null) return

    event.preventDefault()
    setActiveIndex(nextIndex)
    roleRefs.current[nextIndex]?.focus()
  }

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

      <SectionStage stage={perspectivesStage} variant="band" className={styles.stageBand} />

      <div className={styles.workspace}>
        <div
          className={styles.roleIndex}
          role="tablist"
          aria-label="Strategic seats"
          aria-orientation="vertical"
        >
          {perspectiveCatalog.map((perspective, index) => {
            const isActive = index === activeIndex

            return (
              <button
                key={perspective.id}
                ref={(node) => {
                  roleRefs.current[index] = node
                }}
                type="button"
                role="tab"
                id={`perspective-tab-${perspective.id}`}
                aria-selected={isActive}
                aria-controls="perspective-brief"
                tabIndex={isActive ? 0 : -1}
                className={styles.roleItem}
                onClick={() => {
                  setActiveIndex(index)
                  revealBriefOnNarrowViewports()
                }}
                onKeyDown={(event) => handleRoleKeyDown(event, index)}
              >
                <span className={styles.roleLabel}>{perspective.label}</span>
                <span className={styles.roleHint}>{perspective.shortLabel}</span>
                <span className={styles.roleMarker} aria-hidden="true">
                  →
                </span>
              </button>
            )
          })}
        </div>

        <section
          ref={briefRef}
          className={styles.brief}
          id="perspective-brief"
          role="tabpanel"
          aria-labelledby={`perspective-tab-${activePerspective.id}`}
          key={activePerspective.id}
        >
          <p className="eyebrow">Role brief</p>
          <h2 className={styles.briefTitle}>{activePerspective.label}</h2>
          <p className={styles.briefMandate}>{activePerspective.description}</p>

          <p className={styles.briefAgendaKicker}>On the agenda</p>
          <ul className={styles.briefAgenda}>
            {activePerspective.scenarios.map((scenario) => (
              <li key={scenario.id}>{situationLabel(scenario)}</li>
            ))}
          </ul>

          <p className={styles.briefMeta}>
            {activePerspective.scenarios.length} scenarios · about 5 min · set v
            {activePerspective.scenarioSetVersion}
          </p>

          <div className={styles.briefActions}>
            <Link href={`/perspectives/${activePerspective.id}`} className="cta-primary">
              Open the brief
            </Link>
            {baseline.status === "absent" ? (
              <Link href="/quiz" className="cta-secondary">
                Take the Foundation first
              </Link>
            ) : null}
          </div>
        </section>
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
