"use client"

// An established navy/brass editorial world. The globe is the opening artifact;
// Enter reveals the grouped menu beside that same mounted, independently held view.
import { useEffect, useMemo, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { DestinationLink } from "@/components/layout/destination-link"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { RootCopy } from "@/content/root"
import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { ROOT_DESTINATIONS } from "@/lib/root/destinations"
import { readRootLocalStatus, type RootLocalStatus } from "@/lib/root/local-status"
import type { AlignmentScene } from "@/lib/root/globe-types"
import type { RootGlobeVisual } from "@/lib/root/orthographic"
import styles from "./root-home.module.css"
import { RootGlobe } from "./root-globe"

const QUIZ_SESSION_EVENT = "ir-worldview-session-updated"
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
      recordLabel: domains === 1 ? "result" : "results",
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

export function RootHome({ locale, copy, visual, scenes }: {
  locale: Locale; copy: RootCopy; visual: RootGlobeVisual; scenes: AlignmentScene[]
}) {
  const [mode, setMode] = useState<"static" | "entrance" | "menu">("static")
  const [localStatus, setLocalStatus] = useState<RootLocalStatus | null>(null)
  const menuHeading = useRef<HTMLHeadingElement>(null)
  const globeRegion = useRef<HTMLDivElement>(null)
  const menuLinks = useRef<HTMLElement>(null)
  const enterLink = useRef<HTMLAnchorElement>(null)
  const motion = useRef<Animation[]>([])
  const finishMotion = () => { motion.current.forEach(animation => animation.cancel()); motion.current = [] }
  const statusText = useMemo(() => localStatusText(copy, localStatus), [copy, localStatus])
  useEffect(() => {
    const refresh = () => {
      try { setLocalStatus(readRootLocalStatus(window.localStorage)) } catch { /* Storage may be unavailable. */ }
    }
    const location = () => {
      finishMotion()
      const hash = window.location.hash
      setMode(hash === "#entrance" ? "entrance" : hash === "#menu" || hash === "#map-details" ? "menu" : "entrance")
    }
    refresh(); location()
    // The SSR menu has different geometry from the hydrated composition.
    // Cancel its initial fragment scroll once; subsequent history scroll stays native.
    const initialMenu = window.location.hash === "#menu"
    const settleScroll = initialMenu ? requestAnimationFrame(() => window.scrollTo(0, 0)) : null
    window.addEventListener("storage", refresh); window.addEventListener(QUIZ_SESSION_EVENT, refresh)
    window.addEventListener("hashchange", location); window.addEventListener("popstate", location)
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    reduced.addEventListener("change", finishMotion)
    window.addEventListener("resize", finishMotion); window.addEventListener("beforeprint", finishMotion); window.addEventListener("pagehide", finishMotion)
    return () => {
      finishMotion()
      if (settleScroll !== null) cancelAnimationFrame(settleScroll)
      window.removeEventListener("storage", refresh); window.removeEventListener(QUIZ_SESSION_EVENT, refresh)
      window.removeEventListener("hashchange", location); window.removeEventListener("popstate", location)
      reduced.removeEventListener("change", finishMotion)
      window.removeEventListener("resize", finishMotion); window.removeEventListener("beforeprint", finishMotion); window.removeEventListener("pagehide", finishMotion)
    }
  }, [])
  const transition = (next: "menu" | "entrance") => {
    const globe = globeRegion.current!
    // Read the current visual position before cancelling an interrupted move.
    const first = globe.getBoundingClientRect()
    finishMotion()
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}#${next}`)
    flushSync(() => setMode(next))
    window.scrollTo(0, 0)
    const last = globe.getBoundingClientRect()
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches && globe.animate) {
      if (matchMedia("(min-width: 901px)").matches) motion.current.push(globe.animate([
        { transformOrigin: "top left", transform: `translate(${first.left - last.left}px, ${first.top - last.top}px) scale(${first.width / last.width})` },
        { transformOrigin: "top left", transform: "none" },
      ], { duration: 650, easing: "cubic-bezier(.22,1,.36,1)" }))
      if (next === "menu" && menuLinks.current) motion.current.push(menuLinks.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: 90, fill: "backwards", easing: "ease-out" }))
    }
    ;(next === "menu" ? menuHeading.current : enterLink.current)?.focus({ preventScroll: true })
  }
  const enter = () => {
    // Replace the entrance entry so browser Back from a child returns to the menu.
    transition("menu")
  }
  const explore = () => {
    const details = document.getElementById("map-details") as HTMLDetailsElement | null
    if (details) { details.open = true; details.querySelector("summary")?.focus(); details.scrollIntoView({ block: "nearest" }) }
  }
  return <main className={styles.root} id="site-main" data-locale={locale} data-root-mode={mode}>
    <header className={styles.header}>
      <h1><Link href="/#menu" className={styles.brand} aria-label={copy.brandAriaLabel}>{copy.brand}</Link></h1>
      <div className={styles.utilityCluster}>
        <nav className={styles.utilityNav} aria-label={locale === "zh-Hans" ? "网站信息" : "Site information"}>
          {copy.utilityLinks.map(link => <Link key={link.href} href={link.href} prefetch={false}>{link.label}</Link>)}
        </nav>
        <LanguageSwitcher className={styles.languageControl} />
      </div>
    </header>
    <div className={styles.entrance}>
      <p>{copy.introduction}</p>
      <a ref={enterLink} href="#menu" className={styles.enter} onClick={event => {
        if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault(); enter()
      }}>{copy.enter}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg></a>
    </div>
    <div className={styles.composition}>
      <div ref={globeRegion} className={styles.globeRegion}><RootGlobe visual={visual} scenes={scenes} chinese={locale === "zh-Hans"} /></div>
      <section className={styles.menuRegion} id="menu" aria-labelledby="menu-heading">
        <div className={styles.menuHeading}>
          <h2 ref={menuHeading} tabIndex={-1} id="menu-heading">{copy.heading}</h2>
          <a href="#map-details" onClick={explore}>{copy.map}</a>
        </div>
        <nav ref={menuLinks} aria-label={copy.primaryNavigationLabel} className={styles.groups} onFocusCapture={finishMotion}>
          {ROOT_DESTINATIONS.map(group => <section key={group.id} className={styles.group} data-root-group={group.id}>
            <h3>{copy.destinationCopy[group.id].label}</h3>
            <p>{copy.destinationCopy[group.id].explanation}</p>
            <ul>{group.children.map(id => <li key={id}><DestinationLink destination={id} className={styles.destination} /></li>)}</ul>
            {group.id === "questionnaires" && <p className={styles.independent}>{copy.independent}</p>}
          </section>)}
        </nav>
        <div className={styles.localState} data-root-returning={localStatus ? "resolved" : "pending"}>
          <h3>{copy.localState.heading}</h3><p>{statusText}</p>
        </div>
        <a className={styles.returnOpening} href="#entrance" onClick={event => {
          if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
          event.preventDefault(); transition("entrance")
        }}>{locale === "zh-Hans" ? "回到开场" : "View the opening"}</a>
      </section>
    </div>
  </main>
}
