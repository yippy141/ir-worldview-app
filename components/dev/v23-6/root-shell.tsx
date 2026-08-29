"use client"

import Link from "next/link"
import { useId, useMemo, useState, useSyncExternalStore, type ReactNode } from "react"
import { ArchetypeMark } from "@/components/archetypes/archetype-mark"
import { formatLocalizedDate } from "@/i18n/format"
import { resolveArchetype } from "@/lib/archetypes"
import { getV2ScoringCalibration } from "@/lib/scoring"
import { resolveFoundationPayload } from "@/lib/share"
import type { FoundationSnapshot } from "@/lib/profile-store"
import {
  getLocalRecordsServerSnapshot,
  getLocalRecordsSnapshot,
  subscribeLocalRecords,
  type LocalRecords,
} from "@/lib/v23-6/local-records"
import {
  DEFAULT_ROOT_DESTINATION_ID,
  ROOT_DESTINATIONS,
  ROOT_ORIENTATION_LINE,
  ROOT_SECONDARY_LINKS,
  getRootDestination,
  type RootDestinationId,
} from "@/lib/v23-6/root-menu"
import { buildStudyFoundationSnapshot } from "@/lib/v23-6/study-fixture"
import styles from "./root-shell.module.css"

export type RootTypeTreatment = "a" | "b" | "c"

export type RootVisitorMode = "auto" | "new" | "returning"

export type RootShellProps = Readonly<{
  /** Which prototype is being viewed. Recorded on the root element. */
  variant: string
  typeTreatment?: RootTypeTreatment
  visitor?: RootVisitorMode
  reducedMotionOverride?: boolean
  /**
   * The composition is a page region on the prototype roots and a specimen
   * board on the typography plate, where several boards share one document.
   */
  container?: "main" | "div"
  /** The central visual, controlled by the same selected destination state. */
  renderVisual: (state: RootVisualState) => ReactNode
}>

export type RootVisualState = Readonly<{
  destinationId: RootDestinationId
  reducedMotion: boolean
  savedArchetypeCode: string | null
}>

type ReturningState = Readonly<{
  savedFoundation: FoundationSnapshot | null
  savedArchetypeCode: string | null
  savedArchetypeName: string | null
  draftAnswerCount: number
}>

const EMPTY_RETURNING: ReturningState = {
  savedFoundation: null,
  savedArchetypeCode: null,
  savedArchetypeName: null,
  draftAnswerCount: 0,
}

function subscribeToReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)")
  media.addEventListener("change", onStoreChange)
  return () => media.removeEventListener("change", onStoreChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getReducedMotionServerSnapshot() {
  return true
}

function describeSavedFoundation(
  snapshot: FoundationSnapshot | null,
): Pick<ReturningState, "savedArchetypeCode" | "savedArchetypeName"> {
  if (!snapshot) return { savedArchetypeCode: null, savedArchetypeName: null }
  const resolved = resolveFoundationPayload(snapshot.payload)
  if (!resolved) return { savedArchetypeCode: null, savedArchetypeName: null }
  const { lowDifferentiationThreshold } = getV2ScoringCalibration(
    resolved.scoringCalibration,
  )
  const archetype = resolveArchetype(resolved.result, lowDifferentiationThreshold)
  // A blend is two marks under the registered construction rules, so it never
  // collapses into one pictorial mark. The blend keeps its name and no mark.
  const pure = !archetype.code.includes("/")
  return {
    savedArchetypeCode: pure ? archetype.code : null,
    savedArchetypeName: archetype.name,
  }
}

function toReturningState(records: LocalRecords): ReturningState {
  const saved = records.store?.foundation ?? null
  return {
    savedFoundation: saved,
    ...describeSavedFoundation(saved),
    draftAnswerCount: records.session
      ? Object.keys(records.session.answers).length
      : 0,
  }
}

let studyState: ReturningState | null = null

function studyReturningState(): ReturningState {
  if (!studyState) {
    const snapshot = buildStudyFoundationSnapshot()
    studyState = {
      savedFoundation: snapshot,
      ...describeSavedFoundation(snapshot),
      draftAnswerCount: 0,
    }
  }
  return studyState
}

export function RootShell({
  variant,
  typeTreatment = "a",
  visitor = "auto",
  reducedMotionOverride,
  container = "main",
  renderVisual,
}: RootShellProps) {
  const Container = container
  // Several boards share one document on the typography plate, so the
  // orientation line drops to a paragraph there instead of repeating an h1.
  const Orientation = container === "main" ? "h1" : "p"
  const [selected, setSelected] = useState<RootDestinationId>(
    DEFAULT_ROOT_DESTINATION_ID,
  )
  const panelId = useId()
  const localRecords = useSyncExternalStore(
    subscribeLocalRecords,
    getLocalRecordsSnapshot,
    getLocalRecordsServerSnapshot,
  )
  const systemReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )
  const reducedMotion = reducedMotionOverride ?? systemReducedMotion

  const returning = useMemo<ReturningState>(() => {
    if (visitor === "new") return EMPTY_RETURNING
    if (visitor === "returning") return studyReturningState()
    return toReturningState(localRecords)
  }, [localRecords, visitor])

  const active = getRootDestination(selected)
  const hasSavedFoundation = Boolean(returning.savedFoundation)
  const hasDraft = returning.draftAnswerCount > 0

  return (
    <Container
      className={styles.root}
      id={container === "main" ? "site-main" : undefined}
      data-root-variant={variant}
      data-type-treatment={typeTreatment}
      data-visitor={hasSavedFoundation || hasDraft ? "returning" : "new"}
      data-selected-destination={selected}
      data-reduced-motion={reducedMotion ? "true" : "false"}
    >
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          IR Worldview Inventory
        </Link>
      </header>

      <div className={styles.menuRegion}>
        <Orientation className={styles.orientation}>{ROOT_ORIENTATION_LINE}</Orientation>

        <div className={styles.resumeSlot} data-filled={hasSavedFoundation || hasDraft}>
          {returning.savedFoundation ? (
            <>
              <p className={styles.resumeLine}>
                {returning.savedArchetypeCode ? (
                  <ArchetypeMark
                    code={returning.savedArchetypeCode as never}
                    size={32}
                    className={styles.resumeMark}
                  />
                ) : null}
                <span className={styles.resumeText}>
                  Your saved Foundation reads as {returning.savedArchetypeName}.
                </span>
              </p>
              <p className={styles.resumeMeta}>
                <time
                  className={styles.evidenceStamp}
                  dateTime={new Date(returning.savedFoundation.timestamp).toISOString()}
                >
                  Saved {formatLocalizedDate(returning.savedFoundation.timestamp, "en", "medium")}
                </time>
                <Link className={styles.resumeLink} href={returning.savedFoundation.resultPath}>
                  Open your saved result
                </Link>
              </p>
            </>
          ) : hasDraft ? (
            <>
              <p className={styles.resumeLine}>
                <span className={styles.resumeText}>
                  You have an unfinished Foundation with {returning.draftAnswerCount} answers on this device.
                </span>
              </p>
              <p className={styles.resumeMeta}>
                <Link className={styles.resumeLink} href="/quiz">
                  Resume the Foundation
                </Link>
              </p>
            </>
          ) : null}
        </div>

        <nav className={styles.menuNav} aria-label="Destinations">
          <ul className={styles.menuList}>
            {ROOT_DESTINATIONS.map((destination) => {
              const isActive = destination.id === selected
              const emphasised =
                destination.id === "profile" && hasSavedFoundation

              return (
                <li
                  key={destination.id}
                  className={styles.menuItem}
                  data-weight={destination.weight}
                  data-emphasised={emphasised ? "true" : undefined}
                  data-active={isActive ? "true" : undefined}
                >
                  <Link
                    href={destination.href}
                    className={styles.menuLink}
                    aria-describedby={isActive ? panelId : undefined}
                    aria-current={isActive ? "true" : undefined}
                    onFocus={() => setSelected(destination.id)}
                    onPointerEnter={() => setSelected(destination.id)}
                  >
                    {destination.label}
                    {emphasised && returning.savedArchetypeCode ? (
                      <ArchetypeMark
                        code={returning.savedArchetypeCode as never}
                        size={32}
                        className={styles.menuMark}
                      />
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <section className={styles.panel} id={panelId} aria-live="polite">
          <p className={styles.panelExplanation}>{active.explanation}</p>
          {active.contents.length > 1 ? (
            <ul className={styles.panelContents}>
              {active.contents.map((entry) => (
                <li key={entry.href}>
                  <Link href={entry.href}>{entry.label}</Link>
                </li>
              ))}
            </ul>
          ) : null}
          <Link className={styles.panelAction} href={active.action.href}>
            {active.action.label}
          </Link>
        </section>
      </div>

      <div className={styles.visual}>
        {renderVisual({
          destinationId: selected,
          reducedMotion,
          savedArchetypeCode: returning.savedArchetypeCode,
        })}
      </div>

      <footer className={styles.footer}>
        <nav aria-label="Secondary">
          <ul className={styles.footerList}>
            {ROOT_SECONDARY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.studyStamp}>Prototype. Not the production root.</p>
      </footer>
    </Container>
  )
}
