"use client"

import { useEffect, useMemo, useState } from "react"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { RootCopy } from "@/content/root"
import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import {
  DEFAULT_ROOT_DESTINATION_ID,
  ROOT_DESTINATIONS,
  type RootDestinationId,
} from "@/lib/root/destinations"
import { readRootLocalStatus, type RootLocalStatus } from "@/lib/root/local-status"
import type { RootGlobeVisual } from "@/lib/root/orthographic"
import styles from "./root-home.module.css"

const QUIZ_SESSION_EVENT = "ir-worldview-session-updated"
const ROOT_GLOBE_VIEW_SIZE = 1000
const ROOT_GLOBE_CENTER = ROOT_GLOBE_VIEW_SIZE / 2
const ROOT_GLOBE_RADIUS = 370

function fillTemplate(template: string, replacements: Record<string, string | number>) {
  return Object.entries(replacements).reduce(
    (value, [key, replacement]) => value.replaceAll(`{{${key}}}`, String(replacement)),
    template,
  )
}

function localStatusText(copy: RootCopy, status: RootLocalStatus | null) {
  if (!status) return copy.localState.newDevice
  const { foundation, domains, perspectives, draft } = status
  if (!foundation && domains === 0 && perspectives === 0 && draft === 0) {
    return copy.localState.newDevice
  }
  if (foundation && domains === 0 && perspectives === 0 && draft === 0) {
    return copy.localState.foundationOnly
  }
  if (!foundation && domains === 0 && perspectives === 0 && draft > 0) {
    return fillTemplate(copy.localState.draftOnly, {
      count: draft,
      answerLabel: draft === 1 ? "answer" : "answers",
    })
  }
  const parts: string[] = []
  if (foundation) parts.push(copy.localState.foundationRecord)
  if (domains > 0) {
    parts.push(fillTemplate(copy.localState.domainRecords, {
      count: domains,
      recordLabel: domains === 1 ? "record" : "records",
    }))
  }
  if (perspectives > 0) {
    parts.push(fillTemplate(copy.localState.perspectiveRuns, {
      count: perspectives,
      runLabel: perspectives === 1 ? "Run" : "Runs",
    }))
  }
  if (draft > 0) {
    parts.push(fillTemplate(copy.localState.unfinishedDraft, { count: draft }))
  }
  return fillTemplate(copy.localState.returningTemplate, {
    items: parts.join(copy.localState.separator),
  })
}

function RootGlobe({
  activeId,
  visual,
}: {
  activeId: RootDestinationId
  visual: RootGlobeVisual
}) {
  const ring = visual.states[activeId]
  const clipId = "root-geographic-globe"

  return (
    <figure
      className={styles.globeFigure}
      data-root-visual-state={activeId}
      aria-hidden="true"
    >
      <svg
        className={styles.globe}
        viewBox={`0 0 ${ROOT_GLOBE_VIEW_SIZE} ${ROOT_GLOBE_VIEW_SIZE}`}
        focusable="false"
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx={ROOT_GLOBE_CENTER} cy={ROOT_GLOBE_CENTER} r={ROOT_GLOBE_RADIUS} />
          </clipPath>
        </defs>
        <path className={styles.ringBack} d={ring.back} />
        <g clipPath={`url(#${clipId})`}>
          <circle
            className={styles.ocean}
            cx={ROOT_GLOBE_CENTER}
            cy={ROOT_GLOBE_CENTER}
            r={ROOT_GLOBE_RADIUS}
          />
          <path className={styles.graticule} d={visual.graticule} />
          <path className={styles.land} d={visual.land} fillRule="evenodd" />
        </g>
        <circle
          className={styles.limb}
          cx={ROOT_GLOBE_CENTER}
          cy={ROOT_GLOBE_CENTER}
          r={ROOT_GLOBE_RADIUS}
        />
        <path className={styles.ringFront} d={ring.front} />
      </svg>
    </figure>
  )
}

export function RootHome({
  locale,
  copy,
  visual,
}: {
  locale: Locale
  copy: RootCopy
  visual: RootGlobeVisual
}) {
  const [selectedId, setSelectedId] = useState<RootDestinationId>(
    DEFAULT_ROOT_DESTINATION_ID,
  )
  const [localStatus, setLocalStatus] = useState<RootLocalStatus | null>(null)
  const selectedCopy = copy.destinationCopy[selectedId]
  const statusText = useMemo(
    () => localStatusText(copy, localStatus),
    [copy, localStatus],
  )

  useEffect(() => {
    const refresh = () => setLocalStatus(readRootLocalStatus(window.localStorage))
    refresh()
    window.addEventListener("storage", refresh)
    window.addEventListener(QUIZ_SESSION_EVENT, refresh)
    return () => {
      window.removeEventListener("storage", refresh)
      window.removeEventListener(QUIZ_SESSION_EVENT, refresh)
    }
  }, [])

  return (
    <main className={styles.root} id="site-main" data-locale={locale}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label={copy.brandAriaLabel}>
          {copy.brand}
        </Link>
        <div className={styles.utilityCluster}>
          <nav className={styles.utilityNav} aria-label={locale === "zh-Hans" ? "网站信息" : "Site information"}>
            {copy.utilityLinks.map((link) => (
              <Link key={link.href} href={link.href} prefetch={false}>
                {link.label}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher className={styles.languageControl} />
        </div>
      </header>

      <div className={styles.composition} data-root-selected={selectedId}>
        <section className={styles.menuRegion}>
          <h1>{copy.heading}</h1>
          <nav aria-label={copy.primaryNavigationLabel}>
            <ol className={styles.menuList}>
              {ROOT_DESTINATIONS.map((destination) => {
                const destinationCopy = copy.destinationCopy[destination.id]
                const selected = destination.id === selectedId
                return (
                  <li key={destination.id}>
                    <Link
                      href={destination.href}
                      prefetch={false}
                      className={styles.menuLink}
                      data-root-destination={destination.id}
                      data-selected={selected ? "true" : "false"}
                      onFocus={() => setSelectedId(destination.id)}
                      onPointerEnter={() => setSelectedId(destination.id)}
                    >
                      <span>{destinationCopy.label}</span>
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M5 12h13M13 7l5 5-5 5" />
                      </svg>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </nav>
        </section>

        <section
          className={styles.detailRegion}
          data-root-detail-state={selectedId}
          aria-labelledby="root-selected-destination"
        >
          <h2 id="root-selected-destination">{selectedCopy.label}</h2>
          <p className={styles.explanation}>{selectedCopy.explanation}</p>
          <div className={styles.localState} data-root-returning={localStatus ? "resolved" : "pending"}>
            <h3>{copy.localState.heading}</h3>
            <p>{statusText}</p>
          </div>
        </section>

        <RootGlobe activeId={selectedId} visual={visual} />
      </div>
    </main>
  )
}
