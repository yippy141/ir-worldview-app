"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import {
  getNextWorldStageMenuIndex,
  WORLD_STAGE_IDLE_INTERVAL_MS,
} from "@/lib/world-stage/map-config"
import { getWorldStageScene, worldStageMenuItems } from "@/lib/world-stage/scenes"
import { WorldStageMap } from "./world-stage-map"
import styles from "./world-stage.module.css"

const secondaryLinks = [
  { label: "Compare", href: "/compare" },
  { label: "About", href: "/about" },
  { label: "Methods", href: "/method" },
  { label: "References", href: "/references" },
  { label: "Privacy", href: "/privacy" },
  { label: "Feedback", href: "/feedback" },
] as const

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

export function WorldStageHome() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null)
  const [menuAutoPaused, setMenuAutoPaused] = useState(false)
  const idleIntervalRef = useRef<number | null>(null)
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )
  const activeItem = worldStageMenuItems[activeIndex]
  const activeScene = getWorldStageScene(activeItem.sceneId)
  const motionPaused = motionOverride ?? reducedMotion

  const clearMenuInterval = useCallback(() => {
    if (idleIntervalRef.current !== null) {
      window.clearInterval(idleIntervalRef.current)
      idleIntervalRef.current = null
    }
  }, [])

  const selectItem = useCallback(
    (index: number, deliberate = false) => {
      if (deliberate) {
        clearMenuInterval()
        setMenuAutoPaused(true)
      }
      setActiveIndex(index)
    },
    [clearMenuInterval],
  )

  const toggleMotion = useCallback(() => {
    setMotionOverride(!motionPaused)
  }, [motionPaused])

  useEffect(() => {
    if (menuAutoPaused || motionPaused) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => getNextWorldStageMenuIndex(current))
    }, WORLD_STAGE_IDLE_INTERVAL_MS)
    idleIntervalRef.current = interval

    return () => {
      window.clearInterval(interval)
      if (idleIntervalRef.current === interval) idleIntervalRef.current = null
    }
  }, [menuAutoPaused, motionPaused])

  return (
    <main
      className={styles.stage}
      id="site-main"
      data-sequence={menuAutoPaused || motionPaused ? "paused" : "running"}
    >
      <WorldStageMap
        activeItem={activeItem}
        motionPaused={motionPaused}
        reducedMotion={reducedMotion}
      />

      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="IR Worldview Inventory home">
          IR Worldview Inventory
        </Link>
        <button
          type="button"
          className={styles.motionControl}
          aria-label={`${motionPaused ? "Resume" : "Pause"} automatic globe rotation and menu cycling`}
          aria-pressed={motionPaused}
          onClick={toggleMotion}
        >
          {motionPaused ? "Resume motion" : "Pause motion"}
        </button>
      </header>

      <div className={styles.mapMeta} key={`lens-${activeItem.id}`}>
        <p className={styles.lensLabel}>
          {activeScene?.publicLabel ?? "Reviewed scene unavailable"}
        </p>
        {activeScene ? (
          <>
            <p className={styles.mapDate}>
              As of <time dateTime={activeScene.asOf}>{activeScene.asOf}</time> ·{" "}
              {activeScene.sourceRefs.length} sources · reviewed editorial map, not live
              intelligence
            </p>
            <p className={styles.mapQualification}>{activeScene.caption}</p>
          </>
        ) : (
          <p className={styles.mapQualification}>
            This layer failed closed because its reviewed record is incomplete.
          </p>
        )}
      </div>

      <div className={styles.primaryLayout}>
        <section className={styles.menuRegion} aria-labelledby="world-stage-heading">
          <div className={styles.introduction}>
            <h1 id="world-stage-heading">Choose where to begin.</h1>
            <p>Map your judgments, test them in context, or read the field.</p>
          </div>

          <nav aria-label="World Stage sections">
            <ul className={styles.menuList}>
              {worldStageMenuItems.map((item, index) => {
                const isActive = index === activeIndex

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`${styles.menuItem} ${
                        isActive ? styles.menuItemActive : ""
                      }`}
                      data-active={isActive ? "true" : "false"}
                      aria-describedby={`world-stage-description-${item.id}`}
                      onFocus={() => selectItem(index, true)}
                      onPointerEnter={() => selectItem(index)}
                      onPointerDown={() => selectItem(index, true)}
                      onClick={() => selectItem(index, true)}
                    >
                      <span className={styles.menuIndex}>{item.index}</span>
                      <span className={styles.menuLabel}>{item.label}</span>
                      <span className={styles.menuLens}>{item.lens}</span>
                      <span className={styles.menuIndicator} aria-hidden="true">
                        →
                      </span>
                      <span
                        className={styles.visuallyHidden}
                        id={`world-stage-description-${item.id}`}
                      >
                        {item.description} {item.action}.
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </section>

        <aside
          className={styles.detail}
          aria-label={`${activeItem.label} details`}
          key={`detail-${activeItem.id}`}
        >
          <p className={styles.detailDescription}>{activeItem.description}</p>
          <Link className={styles.routeLink} href={activeItem.href}>
            {activeItem.action}
            <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>

      <footer className={styles.footer}>
        <nav className={styles.secondaryNav} aria-label="Secondary">
          {secondaryLinks.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </footer>
    </main>
  )
}
