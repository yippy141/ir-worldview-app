"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { fillPrototypeTemplate } from "@/content/prototypes/product-refoundation"
import type { PrototypeAreaId, PrototypeConfig } from "@/lib/dev/product-refoundation/areas"
import {
  EMPTY_PROTOTYPE_LOCAL_RECORD,
  hasAnyPrototypeRecord,
  readPrototypeLocalRecord,
  type PrototypeLocalRecord,
} from "@/lib/dev/product-refoundation/local-record"
import type { RootGlobeVisual } from "@/lib/root/orthographic"
import styles from "./product-refoundation.module.css"

const QUIZ_SESSION_EVENT = "ir-worldview-session-updated"
const GLOBE_VIEW_SIZE = 1000
const GLOBE_CENTER = GLOBE_VIEW_SIZE / 2
const GLOBE_RADIUS = 370

/**
 * One static brass great circle. The production root swings a different ring
 * into place for every menu selection; here the instrument stays put so the
 * geography never answers a navigation question.
 */
const STATIC_RING_STATE = "world-stage" as const

function Globe({ visual }: { visual: RootGlobeVisual }) {
  const ring = visual.states[STATIC_RING_STATE]
  const clipId = "prototype-globe-clip"

  return (
    <figure className={styles.globeFigure} aria-hidden="true">
      <svg className={styles.globe} viewBox={`0 0 ${GLOBE_VIEW_SIZE} ${GLOBE_VIEW_SIZE}`} focusable="false">
        <defs>
          <clipPath id={clipId}>
            <circle cx={GLOBE_CENTER} cy={GLOBE_CENTER} r={GLOBE_RADIUS} />
          </clipPath>
        </defs>
        <path className={styles.ringBack} d={ring.back} />
        <g clipPath={`url(#${clipId})`}>
          <circle className={styles.ocean} cx={GLOBE_CENTER} cy={GLOBE_CENTER} r={GLOBE_RADIUS} />
          <path className={styles.graticule} d={visual.graticule} />
          <path className={styles.land} d={visual.land} fillRule="evenodd" />
        </g>
        <circle className={styles.limb} cx={GLOBE_CENTER} cy={GLOBE_CENTER} r={GLOBE_RADIUS} />
        <path className={styles.ringFront} d={ring.front} />
      </svg>
    </figure>
  )
}

function RecordPanel({
  config,
  record,
}: {
  config: PrototypeConfig
  record: PrototypeLocalRecord
}) {
  const copy = config.copy.areas.myRecord

  if (!hasAnyPrototypeRecord(record)) {
    return (
      <div className={styles.recordEmpty}>
        <p>{copy.emptyLine}</p>
        <Link className={styles.panelEntry} href={config.primaryHref}>
          {copy.emptyLink}
        </Link>
      </div>
    )
  }

  return (
    <>
      <p className={styles.panelLead}>{copy.lead}</p>
      <dl className={styles.recordList}>
        <div className={styles.recordRow}>
          <dt>{copy.foundationLabel}</dt>
          <dd data-record-value="foundation">{record.foundationLabel ?? copy.notStarted}</dd>
        </div>
        {config.domains.map((domain) => (
          <div key={domain.key} className={styles.recordRow}>
            <dt>{domain.label}</dt>
            <dd data-record-value={domain.key}>{record[domain.key] ? copy.saved : copy.notStarted}</dd>
          </div>
        ))}
        {record.draftAnswered > 0 ? (
          <div className={styles.recordRow}>
            <dt>{copy.unfinishedLabel}</dt>
            <dd data-record-value="draft">
              {fillPrototypeTemplate(
                record.draftIsCore ? copy.draftTemplate : copy.draftPlainTemplate,
                { answered: record.draftAnswered, total: config.coreQuestionCount },
              )}
            </dd>
          </div>
        ) : null}
      </dl>
      <Link className={styles.panelEntry} href={config.recordHref}>
        {copy.entry}
      </Link>
    </>
  )
}

export function ProductRefoundationPrototype({
  config,
  visual,
}: {
  config: PrototypeConfig
  visual: RootGlobeVisual
}) {
  const { areas, copy } = config
  const works = copy.works
  const [activeId, setActiveId] = useState<PrototypeAreaId>("start")
  const [worksOpen, setWorksOpen] = useState(false)
  const [record, setRecord] = useState<PrototypeLocalRecord>(EMPTY_PROTOTYPE_LOCAL_RECORD)
  const [recordReady, setRecordReady] = useState(false)
  const tabRefs = useRef(new Map<PrototypeAreaId, HTMLButtonElement | null>())
  const worksHeadingRef = useRef<HTMLHeadingElement | null>(null)
  const activeArea = areas.find((area) => area.id === activeId) ?? areas[0]

  useEffect(() => {
    const refresh = () => {
      setRecord(readPrototypeLocalRecord(window.localStorage, config.coreQuestionIds))
      setRecordReady(true)
    }
    refresh()
    window.addEventListener("storage", refresh)
    window.addEventListener(QUIZ_SESSION_EVENT, refresh)
    return () => {
      window.removeEventListener("storage", refresh)
      window.removeEventListener(QUIZ_SESSION_EVENT, refresh)
    }
  }, [config.coreQuestionIds])

  const focusTab = useCallback((id: PrototypeAreaId) => {
    setActiveId(id)
    tabRefs.current.get(id)?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const keys: Record<string, number | undefined> = {
        ArrowDown: index + 1,
        ArrowRight: index + 1,
        ArrowUp: index - 1,
        ArrowLeft: index - 1,
        Home: 0,
        End: areas.length - 1,
      }
      const target = keys[event.key]
      if (target === undefined) return
      event.preventDefault()
      const wrapped = (target + areas.length) % areas.length
      focusTab(areas[wrapped].id)
    },
    [areas, focusTab],
  )

  const continuation = useMemo(() => {
    if (!recordReady) return null
    const line = copy.continuation
    if (record.draftAnswered > 0) {
      return {
        text: record.draftIsCore
          ? fillPrototypeTemplate(line.draftTemplate, {
              answered: record.draftAnswered,
              total: config.coreQuestionCount,
            })
          : line.draftPlain,
        href: config.primaryHref,
        action: null,
      }
    }
    if (record.foundationLabel) {
      return {
        text: fillPrototypeTemplate(line.latestTemplate, { label: record.foundationLabel }),
        href: config.recordHref,
        action: line.openRecord,
      }
    }
    return null
  }, [config, copy.continuation, record, recordReady])

  function toggleWorks() {
    const next = !worksOpen
    setWorksOpen(next)
    if (next) {
      window.requestAnimationFrame(() => worksHeadingRef.current?.focus())
    }
  }

  return (
    <main className={styles.page} id="site-main" data-prototype="product-refoundation">
      <header className={styles.masthead}>
        <div className={styles.brandBlock}>
          <p className={styles.brand}>{copy.brand}</p>
          <p className={styles.descriptor}>{copy.descriptor}</p>
        </div>
        <nav className={styles.mastheadNav} aria-label={copy.navigationLabel}>
          {areas.map((area) => (
            <Link key={area.id} href={area.navHref} data-prototype-nav={area.id}>
              {area.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className={styles.stage}>
        <section className={styles.hero}>
          <h1 className={styles.headline}>{copy.headline}</h1>
          <p className={styles.intro}>{copy.intro}</p>

          <div className={styles.actions}>
            <Link className={styles.primaryAction} href={config.primaryHref}>
              {copy.primaryAction}
            </Link>
            <p className={styles.support}>{config.supportLine}</p>
            <Link className={styles.secondaryAction} href={config.secondaryHref}>
              {copy.secondaryAction}
            </Link>
          </div>

          <p className={styles.continuation} data-prototype-continuation={continuation ? "present" : "absent"}>
            {continuation ? (
              <>
                <Link href={continuation.href}>{continuation.text}</Link>
                {continuation.action ? (
                  <>
                    <span className={styles.separator} aria-hidden="true">
                      ·
                    </span>
                    <Link href={config.recordHref}>{continuation.action}</Link>
                  </>
                ) : null}
              </>
            ) : null}
          </p>

          <button
            type="button"
            className={styles.tertiaryAction}
            aria-expanded={worksOpen}
            aria-controls="prototype-works"
            onClick={toggleWorks}
          >
            {worksOpen ? copy.tertiaryClose : copy.tertiaryOpen}
          </button>
        </section>

        <Globe visual={visual} />
      </div>

      <div className={styles.band}>
        <div
          className={styles.index}
          role="tablist"
          aria-orientation="vertical"
          aria-label={copy.navigationLabel}
        >
          {areas.map((area, index) => {
            const selected = area.id === activeId
            return (
              <button
                key={area.id}
                type="button"
                role="tab"
                id={`prototype-tab-${area.id}`}
                aria-selected={selected}
                aria-controls="prototype-panel"
                tabIndex={selected ? 0 : -1}
                data-prototype-area={area.id}
                data-selected={selected ? "true" : "false"}
                className={styles.indexItem}
                ref={(node) => {
                  tabRefs.current.set(area.id, node)
                }}
                onClick={() => setActiveId(area.id)}
                onFocus={() => setActiveId(area.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch") setActiveId(area.id)
                }}
              >
                <span className={styles.indexRule} aria-hidden="true" />
                <span>{area.label}</span>
              </button>
            )
          })}
        </div>

        <section
          className={styles.panel}
          id="prototype-panel"
          role="tabpanel"
          aria-labelledby={`prototype-tab-${activeArea.id}`}
          data-prototype-panel={activeArea.id}
        >
          <h2 className={styles.panelHeading}>{activeArea.label}</h2>
          {activeArea.id === "my-record" ? (
            <RecordPanel config={config} record={record} />
          ) : (
            <>
              <p className={styles.panelLead}>{activeArea.lead}</p>
              <ul className={styles.panelItems}>
                {activeArea.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href}>{item.label}</Link>
                    <span>{item.line}</span>
                  </li>
                ))}
              </ul>
              <Link className={styles.panelEntry} href={activeArea.entry.href}>
                {activeArea.entry.label}
              </Link>
            </>
          )}
        </section>
      </div>

      <section className={styles.works} id="prototype-works" hidden={!worksOpen}>
        <h2 className={styles.worksHeading} tabIndex={-1} ref={worksHeadingRef}>
          {works.heading}
        </h2>
        <p className={styles.worksFrame}>{works.frame}</p>
        <dl className={styles.worksList}>
          {works.statements.map((statement) => (
            <div key={statement.label}>
              <dt>{statement.label}</dt>
              <dd>{statement.line}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.worksRecord}>{works.record}</p>
        <p className={styles.worksNote}>{works.note}</p>
      </section>
    </main>
  )
}
