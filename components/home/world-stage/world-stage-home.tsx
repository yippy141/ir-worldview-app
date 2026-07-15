"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import {
  getNextWorldStageSceneIndex,
  WORLD_STAGE_SCENE_IDLE_RESUME_MS,
  WORLD_STAGE_SCENE_INTERVAL_MS,
} from "@/lib/world-stage/map-config"
import {
  getWorldStageScene,
  worldStageMenuItems,
  worldStageSceneOptions,
} from "@/lib/world-stage/scenes"
import { WorldStageMap, type WorldStageMapHandle } from "./world-stage-map"
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
  const [previewIndex, setPreviewIndex] = useState(0)
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null)
  const [sceneHeld, setSceneHeld] = useState(false)
  const sceneIntervalRef = useRef<number | null>(null)
  const sceneResumeTimerRef = useRef<number | null>(null)
  const mapRef = useRef<WorldStageMapHandle>(null)
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )
  const activeItem = worldStageMenuItems[previewIndex]
  const activeSceneOption = worldStageSceneOptions[activeSceneIndex]
  const activeScene = getWorldStageScene(activeSceneOption.sceneId)
  const motionPaused = motionOverride ?? reducedMotion
  const automaticMotionPaused = motionPaused || sceneHeld

  const clearSceneInterval = useCallback(() => {
    if (sceneIntervalRef.current !== null) {
      window.clearInterval(sceneIntervalRef.current)
      sceneIntervalRef.current = null
    }
  }, [])

  const clearSceneResumeTimer = useCallback(() => {
    if (sceneResumeTimerRef.current !== null) {
      window.clearTimeout(sceneResumeTimerRef.current)
      sceneResumeTimerRef.current = null
    }
  }, [])

  const resumeSceneCycle = useCallback(() => {
    clearSceneResumeTimer()
    setSceneHeld(false)
  }, [clearSceneResumeTimer])

  const holdSceneForInspection = useCallback(() => {
    clearSceneInterval()
    clearSceneResumeTimer()
    setSceneHeld(true)
    sceneResumeTimerRef.current = window.setTimeout(() => {
      sceneResumeTimerRef.current = null
      setSceneHeld(false)
    }, WORLD_STAGE_SCENE_IDLE_RESUME_MS)
  }, [clearSceneInterval, clearSceneResumeTimer])

  const selectScene = useCallback(
    (index: number) => {
      holdSceneForInspection()
      setActiveSceneIndex(index)
    },
    [holdSceneForInspection],
  )

  const toggleMotion = useCallback(() => {
    if (motionPaused) {
      setMotionOverride(false)
      resumeSceneCycle()
      return
    }

    setMotionOverride(true)
  }, [motionPaused, resumeSceneCycle])

  useEffect(() => {
    if (sceneHeld || motionPaused) return

    const interval = window.setInterval(() => {
      setActiveSceneIndex((current) => getNextWorldStageSceneIndex(current))
    }, WORLD_STAGE_SCENE_INTERVAL_MS)
    sceneIntervalRef.current = interval

    return () => {
      window.clearInterval(interval)
      if (sceneIntervalRef.current === interval) sceneIntervalRef.current = null
    }
  }, [motionPaused, sceneHeld])

  useEffect(
    () => () => {
      clearSceneInterval()
      clearSceneResumeTimer()
    },
    [clearSceneInterval, clearSceneResumeTimer],
  )

  return (
    <main
      className={styles.stage}
      id="site-main"
      data-sequence={automaticMotionPaused ? "paused" : "running"}
    >
      <WorldStageMap
        ref={mapRef}
        scene={activeScene}
        motionPaused={automaticMotionPaused}
        reducedMotion={reducedMotion}
        onInteraction={holdSceneForInspection}
      />

      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="IR Worldview Inventory home">
          IR Worldview Inventory
        </Link>
        <button
          type="button"
          className={styles.motionControl}
          aria-label={`${motionPaused ? "Resume" : "Pause"} automatic globe rotation and map cycling`}
          aria-pressed={motionPaused}
          onClick={toggleMotion}
        >
          {motionPaused ? "Resume motion" : "Pause motion"}
        </button>
      </header>

      <div className={styles.mapMeta} key={`map-${activeSceneOption.sceneId}`}>
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
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={styles.menuItem}
                      aria-describedby={`world-stage-description-${item.id}`}
                      onFocus={() => setPreviewIndex(index)}
                      onPointerEnter={() => setPreviewIndex(index)}
                    >
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

      <div className={styles.mapControls} role="group" aria-label="Map controls">
        <label className={styles.mapControlLabel} htmlFor="world-stage-map-view">
          Map view
        </label>
        <select
          id="world-stage-map-view"
          className={styles.mapSelect}
          value={activeSceneOption.sceneId}
          onChange={(event) => {
            const nextIndex = worldStageSceneOptions.findIndex(
              (option) => option.sceneId === event.target.value,
            )
            if (nextIndex >= 0) selectScene(nextIndex)
          }}
        >
          {worldStageSceneOptions.map((option) => (
            <option key={option.sceneId} value={option.sceneId}>
              {option.label}
            </option>
          ))}
        </select>
        <div className={styles.zoomControls} role="group" aria-label="Globe zoom">
          <button
            type="button"
            className={styles.zoomButton}
            aria-label="Zoom globe out"
            onClick={() => mapRef.current?.zoomOut()}
          >
            −
          </button>
          <button
            type="button"
            className={styles.zoomButton}
            aria-label="Zoom globe in"
            onClick={() => mapRef.current?.zoomIn()}
          >
            +
          </button>
        </div>
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
