"use client"

/*
 * THESIS: An editorial opening question leads into one four-area index.
 * OWN-WORLD: Existing navy, brass, Spectral and Libre Franklin; no new identity system.
 * STORY: Understand the project, begin First Principles, then test a judgment in context.
 * FIRST VIEWPORT: Reading column left, still geography right, index and details below.
 * FORM: Owner-pinned composition; one prototype, not a concept tournament.
 * FINISH: Review screenshots and preserve one prototype record; production DESIGN.md is untouched.
 */
import Link from "next/link"
import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import type { RootGlobeVisual } from "@/lib/root/orthographic"
import { CURRENT_CASE_RESPONSE_STORAGE_KEY, MODULE_DRAFT_STORAGE_KEY, PROFILE_STORAGE_KEY, QUIZ_STORAGE_KEY } from "@/lib/storage-keys"
import type { LocalRecord } from "./local-record"
import { AREAS, GUIDE_PATHS, HOW_IT_WORKS, INTRO, START_PATHS, type AreaId, type CaseEntry } from "./content"
import styles from "./prototype.module.css"

function Arrow() {
  return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
}

function Globe({ visual }: { visual: RootGlobeVisual }) {
  // One fixed meridian. Menu state is deliberately absent from this component.
  const meridian = visual.states.inventory
  return (
    <figure className={styles.globe} aria-hidden="true" data-prototype-globe>
      <svg viewBox="70 70 860 860" focusable="false">
        <defs><clipPath id="refoundation-geography"><circle cx="500" cy="500" r="370" /></clipPath></defs>
        <path className={styles.backMeridian} d={meridian.back} />
        <g clipPath="url(#refoundation-geography)">
          <circle className={styles.ocean} cx="500" cy="500" r="370" />
          <path className={styles.graticule} d={visual.graticule} />
          <path className={styles.land} d={visual.land} fillRule="evenodd" />
        </g>
        <circle className={styles.limb} cx="500" cy="500" r="370" />
        <path className={styles.meridian} d={meridian.front} />
      </svg>
    </figure>
  )
}

function SavedWork({ record }: { record: LocalRecord | null }) {
  if (!record) return <p>Reading saved work on this device…</p>
  if (record.unavailable) return <p>Saved work cannot be read in this browser. <Link href="/profile" prefetch={false}>Open My Record</Link></p>
  if (!record.hasSavedWork && !record.continuation && !record.caseDrafts && !record.unfinishedAreas.length) {
    return <><p>Nothing saved on this device yet.</p><Link className={styles.entry} href="/quiz" prefetch={false}>Begin First Principles <Arrow /></Link></>
  }
  return (
    <>
      {record.foundationName && <p className={styles.savedName}><span>Latest First Principles result</span><strong>{record.foundationName}</strong></p>}
      {record.savedAreas.length > 0 && <p>Also saved: {record.savedAreas.join(", ")}.</p>}
      {record.caseJudgments > 0 && <p>{record.caseJudgments} saved case {record.caseJudgments === 1 ? "judgment" : "judgments"}.</p>}
      {record.continuation && <p><Link href={record.continuation.href} prefetch={false}>{record.continuation.label}</Link></p>}
      {record.unfinishedAreas.map((item) => <p key={item.href}><Link href={item.href} prefetch={false}>{item.label}</Link></p>)}
      {record.caseDrafts > 0 && <p>{record.caseDrafts} unfinished case {record.caseDrafts === 1 ? "judgment" : "judgments"}.</p>}
      <p className={styles.quiet}>Saved work and its history stay on this device.</p>
      <Link className={styles.entry} href="/profile" prefetch={false}>Open My Record <Arrow /></Link>
    </>
  )
}

export function ProductRefoundation({ visual, caseEntry }: { visual: RootGlobeVisual; caseEntry: CaseEntry }) {
  const [area, setArea] = useState<AreaId>("start")
  const [record, setRecord] = useState<LocalRecord | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const index = useRef<HTMLElement>(null)
  const tabs = useRef<Partial<Record<AreaId, HTMLButtonElement | null>>>({})

  useEffect(() => {
    let disposed = false
    let revision = 0
    const refresh = async () => {
      const request = ++revision
      // The full saved-result readers load only on devices with relevant data.
      let hasData = false
      try {
        hasData = [PROFILE_STORAGE_KEY, QUIZ_STORAGE_KEY, CURRENT_CASE_RESPONSE_STORAGE_KEY, MODULE_DRAFT_STORAGE_KEY]
          .some((key) => window.localStorage.getItem(key) !== null)
      } catch { hasData = true }
      const empty: LocalRecord = { foundationName: null, savedAreas: [], caseJudgments: 0, caseDrafts: 0, historyCount: 0, continuation: null, unfinishedAreas: [], hasSavedWork: false, unavailable: false }
      try {
        const next = hasData ? (await import("./local-record")).readLocalRecord(window.localStorage) : empty
        if (!disposed && request === revision) setRecord(next)
      } catch {
        if (!disposed && request === revision) setRecord({ ...empty, unavailable: true })
      }
    }
    void refresh()
    window.addEventListener("storage", refresh)
    window.addEventListener("ir-worldview-session-updated", refresh)
    window.addEventListener("pageshow", refresh)
    return () => {
      disposed = true
      window.removeEventListener("storage", refresh)
      window.removeEventListener("ir-worldview-session-updated", refresh)
      window.removeEventListener("pageshow", refresh)
    }
  }, [])

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, position: number) {
    const change = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1
      : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0
    const next = event.key === "Home" ? 0 : event.key === "End" ? AREAS.length - 1
      : (position + change + AREAS.length) % AREAS.length
    if (!change && event.key !== "Home" && event.key !== "End") return
    event.preventDefault()
    tabs.current[AREAS[next].id]?.focus()
  }

  function selectFromHeader(id: AreaId) {
    setArea(id)
    index.current?.scrollIntoView({ block: "nearest" })
    tabs.current[id]?.focus({ preventScroll: true })
  }

  return (
    <main id="site-main" className={styles.page} data-prototype-local={record ? "ready" : "pending"}>
      <header className={styles.header}>
        <a href="#opening" className={styles.brand}>Worldview Atlas</a>
        <p className={styles.descriptor}>World politics · strategy · technology · AI</p>
        <nav aria-label="Public areas" className={styles.headerNav}>
          {AREAS.map((item) => <button key={item.id} onClick={() => selectFromHeader(item.id)} aria-controls="area-detail" aria-pressed={area === item.id}>{item.label}</button>)}
        </nav>
      </header>

      <section id="opening" className={styles.opening} aria-labelledby="opening-question">
        <div className={styles.introduction}>
          <h1 id="opening-question">How do you explain<br className={styles.desktopBreak} /> world politics?</h1>
          <p className={styles.intro}>{INTRO}</p>
          <div className={styles.actions}>
            <div>
              <Link href="/quiz" prefetch={false} className={styles.primary}>Begin First Principles <Arrow /></Link>
              <p className={styles.timing}>14 questions · about 5 minutes</p>
            </div>
            <Link href={caseEntry.href} prefetch={false} className={styles.secondary}>Open a case <Arrow /></Link>
          </div>
          <div className={styles.continuation} aria-live="polite">
            {record?.continuation
              ? <Link href={record.continuation.href} prefetch={false}>{record.continuation.label}</Link>
              : record?.foundationName
                ? <span>Latest result: {record.foundationName} · <Link href="/profile" prefetch={false}>Open My Record</Link></span>
                : null}
          </div>
          <details className={styles.explanation}>
            <summary>See how the project works</summary>
            <div className={styles.explanationBody}>
              <p>An interactive project on how people reason about world politics.</p>
              <dl>{HOW_IT_WORKS.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.description}</dd></div>)}</dl>
              <p>My Record keeps your saved work on this device.</p>
            </div>
          </details>
        </div>
        <Globe visual={visual} />
      </section>

      <section className={styles.directory} ref={index} aria-label="Explore the four areas">
        <div role="tablist" aria-label="Project areas" aria-orientation="vertical" className={styles.index}>
          {AREAS.map((item, position) => (
            <button key={item.id} id={`area-${item.id}`} role="tab" aria-label={item.label} aria-selected={area === item.id} aria-controls="area-detail" tabIndex={area === item.id ? 0 : -1}
              ref={(element) => { tabs.current[item.id] = element }}
              onFocus={() => setArea(item.id)} onClick={() => setArea(item.id)} onKeyDown={(event) => moveTab(event, position)}>
              <span>{item.label}<Arrow /></span><small>{item.note}</small>
            </button>
          ))}
        </div>
        <div id="area-detail" role="tabpanel" aria-labelledby={`area-${area}`} tabIndex={0} ref={panel} className={styles.detail} data-area={area}>
          <h2>{AREAS.find((item) => item.id === area)?.label}</h2>
          {area === "start" && <>
            <dl className={styles.paths}>{START_PATHS.map((item) => <div key={item.href}><dt><Link href={item.href} prefetch={false}>{item.label}</Link></dt><dd>{item.description}</dd></div>)}</dl>
            <Link className={styles.entry} href="/quiz" prefetch={false}>Enter Start <Arrow /></Link>
          </>}
          {area === "cases" && <>
            <div className={styles.caseFeature}><p>{caseEntry.label}</p><Link href={caseEntry.href} prefetch={false}>{caseEntry.title ?? "Browse published cases"}</Link></div>
            <div className={styles.caseContents}>
              <div><h3>Historical Cases</h3><p>Case readings currently sit within the <Link href="/explore#decision-patterns" prefetch={false}>Decision Patterns</Link>. A shared case browser is proposed here.</p></div>
              <div><h3><Link href="/perspectives" prefetch={false}>From Another Seat</Link></h3><p>Answer from another actor’s institutional and strategic position.</p></div>
              <div className={styles.futures}><h3><Link href="/futures" prefetch={false}>Futures: Twelve Trajectories <Arrow /></Link></h3><p>Explore the existing accounts of where advanced AI could take us.</p></div>
              <div><h3><Link href="/world-stage" prefetch={false}>Map</Link></h3><p>The existing geographic display. A combined case/map destination is not built in this study.</p></div>
            </div>
            <Link className={styles.entry} href={caseEntry.href} prefetch={false}>Enter Cases <Arrow /></Link>
          </>}
          {area === "guide" && <>
            <p className={styles.guideIntro}>Follow an argument further, or check what a result is drawing on.</p>
            <ul className={styles.guideLinks}>{GUIDE_PATHS.map((item) => <li key={item.href}><Link href={item.href} prefetch={false}>{item.label}</Link></li>)}</ul>
            <Link className={styles.entry} href="/explore" prefetch={false}>Open Field Guide <Arrow /></Link>
          </>}
          {area === "record" && <SavedWork record={record} />}
        </div>
      </section>
      <footer className={styles.footer}>Development study. Destination links open the existing project; public naming there is unchanged.</footer>
    </main>
  )
}
