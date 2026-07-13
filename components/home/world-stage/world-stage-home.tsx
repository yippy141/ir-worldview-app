"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import {
  getNextWorldStageMenuIndex,
  WORLD_STAGE_IDLE_INTERVAL_MS,
} from "@/lib/world-stage/map-config"
import { worldStageMenuItems, worldStageScenes } from "@/lib/world-stage/scenes"
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
  const [idlePaused, setIdlePaused] = useState(false)
  const idleIntervalRef = useRef<number | null>(null)
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )
  const activeItem = worldStageMenuItems[activeIndex]
  const activeScene = worldStageScenes.find((scene) => scene.id === activeItem.sceneId)

  const pauseIdle = useCallback(() => {
    if (idleIntervalRef.current !== null) {
      window.clearInterval(idleIntervalRef.current)
      idleIntervalRef.current = null
    }
    setIdlePaused(true)
  }, [])

  const selectItem = useCallback(
    (index: number) => {
      pauseIdle()
      setActiveIndex(index)
    },
    [pauseIdle],
  )

  useEffect(() => {
    if (idlePaused || reducedMotion) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => getNextWorldStageMenuIndex(current))
    }, WORLD_STAGE_IDLE_INTERVAL_MS)
    idleIntervalRef.current = interval

    return () => {
      window.clearInterval(interval)
      if (idleIntervalRef.current === interval) idleIntervalRef.current = null
    }
  }, [idlePaused, reducedMotion])

  return (
    <main
      className={styles.stage}
      id="site-main"
      data-sequence={idlePaused || reducedMotion ? "paused" : "running"}
    >
      <WorldStageMap
        activeItem={activeItem}
        idlePaused={idlePaused}
        reducedMotion={reducedMotion}
        onDirectInteraction={pauseIdle}
      />

      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="IR Worldview Inventory home">
          <span className={styles.brandMark} aria-hidden="true">
            IR
          </span>
          <span>Worldview Inventory</span>
        </Link>
        <div className={styles.stageMeta} aria-label="Section">
          <span>World Stage</span>
          <span>Editorial navigation</span>
        </div>
      </header>

      <div className={styles.mapMeta} key={`lens-${activeItem.id}`}>
        <p className={styles.lensLabel}>
          <span>Current lens</span>
          {activeItem.lens}
        </p>
        <p className={styles.mapQualification}>
          {activeScene?.qualification ?? "Illustrative editorial scene · not live intelligence"}
        </p>
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
                      onFocus={() => selectItem(index)}
                      onPointerEnter={() => selectItem(index)}
                      onPointerDown={() => selectItem(index)}
                      onClick={() => selectItem(index)}
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
          aria-labelledby={`world-stage-detail-${activeItem.id}`}
          key={`detail-${activeItem.id}`}
        >
          <div>
            <p className={styles.detailIndex}>{activeItem.index} / 06</p>
            <h2 id={`world-stage-detail-${activeItem.id}`}>{activeItem.label}</h2>
            <p className={styles.detailDescription}>{activeItem.description}</p>
          </div>
          <Link className={styles.routeLink} href={activeItem.href} onClick={pauseIdle}>
            {activeItem.action}
            <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>

      <footer className={styles.footer}>
        <nav className={styles.secondaryNav} aria-label="Secondary">
          {secondaryLinks.map((link) => (
            <Link key={link.label} href={link.href} onClick={pauseIdle}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.legend} aria-label="Map symbol key">
          <span>
            <i className={styles.nodeSymbol} /> Nodes: editorial prompts
          </span>
          <span>
            <i className={styles.routeSymbol} /> Routes: thematic links
          </span>
        </div>
      </footer>
    </main>
  )
}
