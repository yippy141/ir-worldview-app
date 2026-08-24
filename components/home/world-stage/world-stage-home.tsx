"use client"

import { useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react"
import {
  getZhHansWorldStageMenuItems,
  zhHansWorldStageUi,
} from "@/content/locales/zh-Hans/world-stage"
import { zhHansSiteMetadata } from "@/content/locales/zh-Hans/metadata"
import { LanguageSwitcher } from "@/components/language-switcher"
import { formatLocalizedDate } from "@/i18n/format"
import type { Locale } from "@/i18n/routing"
import {
  getNextWorldStageSceneIndex,
  WORLD_STAGE_FLOW_RELATION_COLORS,
  WORLD_STAGE_SCENE_IDLE_RESUME_MS,
  WORLD_STAGE_SCENE_INTERVAL_MS,
  WORLD_STAGE_SEMICONDUCTOR_ROLE_COLORS,
} from "@/lib/world-stage/map-config"
import {
  getWorldStageScene,
  getWorldStageMenuItems,
  groupWorldStageMenuItems,
  worldStageSceneOptions,
  worldStageUtilityDestinations,
} from "@/lib/world-stage/scenes"
import { getZhHansWorldStageScene } from "@/lib/world-stage/zh-hans"
import {
  WORLD_STAGE_FLOW_RELATIONS,
  WORLD_STAGE_SEMICONDUCTOR_ROLES,
  type WorldStageFlowRelation,
  type WorldStageMenuId,
  type WorldStageSemiconductorRole,
} from "@/lib/world-stage/types"
import { WorldStageMap, type WorldStageMapHandle } from "./world-stage-map"
import styles from "./world-stage.module.css"

const secondaryLinks = [
  { label: "Compare", href: "/compare" },
  { label: "About", href: "/about" },
  { label: "Futures", href: "/futures" },
  { label: "Methods", href: "/method" },
  { label: "References", href: "/references" },
  { label: "Privacy", href: "/privacy" },
  { label: "Corrections and contact", href: "/feedback" },
] as const

const semiconductorRoleLabels: Record<WorldStageSemiconductorRole, string> = {
  fab: "Fabrication",
  design: "Chip design",
  sme: "Equipment",
  materials: "Materials",
  packaging: "Packaging",
  eda: "EDA",
}

const relationLabels: Record<WorldStageFlowRelation, string> = {
  ownership: "Ownership",
  supply: "Supply",
  "export-control jurisdiction": "Export-control jurisdiction",
  "research collaboration": "Research collaboration",
  capital: "Capital",
  "standards participation": "Standards participation",
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

export function WorldStageHome({
  hasActiveCurrentCase,
}: {
  hasActiveCurrentCase: boolean
}) {
  const locale = useLocale() as Locale
  const chinese = locale === "zh-Hans"
  const menuItems = chinese
    ? getZhHansWorldStageMenuItems(hasActiveCurrentCase)
    : getWorldStageMenuItems(hasActiveCurrentCase)
  const menuGroups = groupWorldStageMenuItems(menuItems)
  const choiceGroups = [
    {
      id: "start-here",
      label: chinese ? zhHansWorldStageUi.choiceGroups.startHere : "Start here",
      items: menuGroups.startHere,
      listClassName: styles.startHereList,
    },
    {
      id: "continue-exploring",
      label: chinese
        ? zhHansWorldStageUi.choiceGroups.continueExploring
        : "Continue exploring",
      items: menuGroups.continueExploring,
      listClassName: styles.continueExploringList,
    },
  ] as const
  const sceneOptions = chinese ? zhHansWorldStageUi.sceneOptions : worldStageSceneOptions
  const utilityDestinations = chinese
    ? zhHansWorldStageUi.utility
    : worldStageUtilityDestinations
  const footerLinks = chinese ? zhHansWorldStageUi.secondaryLinks : secondaryLinks
  const controls = zhHansWorldStageUi.controls
  const [previewItemId, setPreviewItemId] = useState<WorldStageMenuId>(
    menuItems[0]?.id ?? "foundation",
  )
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null)
  const [sceneHeld, setSceneHeld] = useState(false)
  const [semiconductorRoleFilter, setSemiconductorRoleFilter] =
    useState<WorldStageSemiconductorRole | "all">("all")
  const [relationFilter, setRelationFilter] =
    useState<WorldStageFlowRelation | "all">("all")
  const sceneIntervalRef = useRef<number | null>(null)
  const sceneResumeTimerRef = useRef<number | null>(null)
  const mapRef = useRef<WorldStageMapHandle>(null)
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )
  const activeItem = menuItems.find((item) => item.id === previewItemId) ?? menuItems[0]
  const activeSceneOption = sceneOptions[activeSceneIndex]
  const activeScene = chinese
    ? getZhHansWorldStageScene(activeSceneOption.sceneId)
    : getWorldStageScene(activeSceneOption.sceneId)
  const motionPaused = motionOverride ?? reducedMotion
  const automaticMotionPaused = motionPaused || sceneHeld
  const availableSemiconductorRoles = WORLD_STAGE_SEMICONDUCTOR_ROLES.filter(
    (role) => activeScene?.nodes.some((node) => node.semiconductorRole === role),
  )
  const availableRelations = WORLD_STAGE_FLOW_RELATIONS.filter((relation) =>
    activeScene?.flows.some((flow) => flow.relation === relation),
  )
  const hasLayerFilters =
    availableSemiconductorRoles.length > 0 || availableRelations.length > 0
  const mapFilters = {
    semiconductorRole: availableSemiconductorRoles.includes(
      semiconductorRoleFilter as WorldStageSemiconductorRole,
    )
      ? semiconductorRoleFilter
      : "all",
    relation: availableRelations.includes(relationFilter as WorldStageFlowRelation)
      ? relationFilter
      : "all",
  } as const

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
      setSemiconductorRoleFilter("all")
      setRelationFilter("all")
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
      setSemiconductorRoleFilter("all")
      setRelationFilter("all")
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
      <header className={styles.header}>
        <Link
          href="/"
          className={styles.brand}
          aria-label={chinese ? zhHansWorldStageUi.brandAriaLabel : "IR Worldview Inventory home"}
        >
          {chinese ? zhHansSiteMetadata.publicTitle : "IR Worldview Inventory"}
        </Link>
        <div className={styles.headerActions}>
          {utilityDestinations.map((destination) => (
            <Link key={destination.id} href={destination.href} className={styles.profileUtility}>
              {destination.label}
            </Link>
          ))}
          <LanguageSwitcher className={styles.languageControl} />
          <button
            type="button"
            className={styles.motionControl}
            aria-label={chinese
              ? controls.motionAria(motionPaused)
              : `${motionPaused ? "Resume" : "Pause"} automatic globe rotation and map cycling`}
            aria-pressed={motionPaused}
            onClick={toggleMotion}
          >
            {chinese
              ? motionPaused
                ? controls.resumeMotion
                : controls.pauseMotion
              : motionPaused
                ? "Resume motion"
                : "Pause motion"}
          </button>
        </div>
      </header>

      <div className={styles.primaryLayout}>
        <section className={styles.menuRegion} aria-labelledby="world-stage-heading">
          <div className={styles.introduction}>
            <h1 id="world-stage-heading">
              {chinese ? zhHansWorldStageUi.heading : "Choose a starting point."}
            </h1>
            <p>{chinese
              ? hasActiveCurrentCase
                ? zhHansWorldStageUi.introduction
                : zhHansWorldStageUi.archiveIntroduction
              : hasActiveCurrentCase
                ? "Answer the Foundation, work through a current decision, or compare the arguments behind the traditions and Decision Patterns."
                : "Answer the Foundation, review recent cases, or compare the arguments behind the traditions and Decision Patterns."}
            </p>
          </div>

          <nav aria-label={chinese ? controls.worldStageSections : "World Stage sections"}>
            <div className={styles.choiceGroups}>
              {choiceGroups.map((group) => (
                <div className={styles.choiceGroup} key={group.id}>
                  <h2 className={styles.choiceGroupHeading} id={`world-stage-${group.id}`}>
                    {group.label}
                  </h2>
                  <ul
                    className={`${styles.menuList} ${group.listClassName}`}
                    aria-labelledby={`world-stage-${group.id}`}
                  >
                    {group.items.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className={styles.menuItem}
                          aria-describedby={`world-stage-description-${item.id}`}
                          onFocus={() => setPreviewItemId(item.id)}
                          onPointerEnter={() => setPreviewItemId(item.id)}
                        >
                          <span className={styles.menuIndex} aria-hidden="true">
                            {item.index}
                          </span>
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
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </section>

        <aside
          className={styles.detail}
          aria-label={chinese ? controls.details(activeItem.label) : `${activeItem.label} details`}
          key={`detail-${activeItem.id}`}
        >
          <p className={styles.detailDescription}>{activeItem.description}</p>
          <Link className={styles.routeLink} href={activeItem.href}>
            {activeItem.action}
            <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>

      <div className={styles.mapMeta} key={`map-${activeSceneOption.sceneId}`}>
        <p className={styles.lensLabel}>
          {activeScene?.publicLabel
            ?? (chinese ? controls.unavailableLabel : "Reviewed scene unavailable")}
        </p>
        {activeScene ? (
          <>
            <p className={styles.mapDate}>
              {chinese ? controls.reviewedThrough : "Reviewed through"}{" "}
              <time dateTime={activeScene.asOf}>
                {formatLocalizedDate(activeScene.asOf, locale)}
              </time>
            </p>
            <p className={styles.mapQualification}>{activeScene.caption}</p>
          </>
        ) : (
          <p className={styles.mapQualification}>
            {chinese
              ? controls.unavailableBody
              : "This layer failed closed because its reviewed record is incomplete."}
          </p>
        )}
      </div>

      <WorldStageMap
        ref={mapRef}
        scene={activeScene}
        filters={mapFilters}
        motionPaused={automaticMotionPaused}
        reducedMotion={reducedMotion}
        onInteraction={holdSceneForInspection}
        copy={chinese ? controls : undefined}
      />

      <div
        className={styles.mapControls}
        role="group"
        aria-label={chinese ? controls.mapControls : "Map controls"}
      >
        <label className={styles.mapControlLabel} htmlFor="world-stage-map-view">
          {chinese ? controls.mapView : "Map view"}
        </label>
        <select
          id="world-stage-map-view"
          className={styles.mapSelect}
          value={activeSceneOption.sceneId}
          onChange={(event) => {
            const nextIndex = sceneOptions.findIndex(
              (option) => option.sceneId === event.target.value,
            )
            if (nextIndex >= 0) selectScene(nextIndex)
          }}
        >
          {sceneOptions.map((option) => (
            <option key={option.sceneId} value={option.sceneId}>
              {option.label}
            </option>
          ))}
        </select>
        {hasLayerFilters ? (
          <details
            className={styles.layerFilters}
            data-testid="world-stage-layer-filters"
            onToggle={(event) => {
              if (event.currentTarget.open) holdSceneForInspection()
            }}
          >
            <summary>{chinese ? controls.layers : "Layers"}</summary>
            <div className={styles.layerFilterPanel}>
              {availableSemiconductorRoles.length > 0 ? (
                <label htmlFor="world-stage-node-type-filter">
                  <span>{chinese ? controls.nodeType : "Node type"}</span>
                  <select
                    id="world-stage-node-type-filter"
                    className={styles.layerSelect}
                    value={mapFilters.semiconductorRole}
                    onChange={(event) => {
                      holdSceneForInspection()
                      setSemiconductorRoleFilter(
                        event.target.value as WorldStageSemiconductorRole | "all",
                      )
                    }}
                  >
                    <option value="all">{chinese ? controls.allLayers : "All types"}</option>
                    {availableSemiconductorRoles.map((role) => (
                      <option key={role} value={role}>
                        {chinese
                          ? controls.semiconductorRoleLabels[role]
                          : semiconductorRoleLabels[role]}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              {availableRelations.length > 0 ? (
                <label htmlFor="world-stage-relation-filter">
                  <span>{chinese ? controls.relation : "Relation"}</span>
                  <select
                    id="world-stage-relation-filter"
                    className={styles.layerSelect}
                    value={mapFilters.relation}
                    onChange={(event) => {
                      holdSceneForInspection()
                      setRelationFilter(
                        event.target.value as WorldStageFlowRelation | "all",
                      )
                    }}
                  >
                    <option value="all">{chinese ? controls.allRelations : "All relations"}</option>
                    {availableRelations.map((relation) => (
                      <option key={relation} value={relation}>
                        {chinese
                          ? controls.relationLabels[relation]
                          : relationLabels[relation]}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              <div className={styles.layerLegend}>
                <p>{chinese ? controls.legend : "Legend"}</p>
                <ul>
                  {availableSemiconductorRoles.map((role) => (
                    <li key={`node-${role}`}>
                      <span
                        className={styles.legendSwatch}
                        style={{
                          "--world-stage-legend-color":
                            WORLD_STAGE_SEMICONDUCTOR_ROLE_COLORS[role],
                        } as CSSProperties}
                      />
                      {chinese
                        ? controls.semiconductorRoleLabels[role]
                        : semiconductorRoleLabels[role]}
                    </li>
                  ))}
                  {availableRelations.map((relation) => (
                    <li key={`relation-${relation}`}>
                      <span
                        className={`${styles.legendSwatch} ${styles.legendLine}`}
                        style={{
                          "--world-stage-legend-color":
                            WORLD_STAGE_FLOW_RELATION_COLORS[relation],
                        } as CSSProperties}
                      />
                      {chinese
                        ? controls.relationLabels[relation]
                        : relationLabels[relation]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>
        ) : null}
        <div
          className={styles.zoomControls}
          role="group"
          aria-label={chinese ? controls.mapControls : "Globe zoom"}
        >
          <button
            type="button"
            className={styles.zoomButton}
            aria-label={chinese ? controls.zoomOut : "Zoom globe out"}
            onClick={() => mapRef.current?.zoomOut()}
          >
            −
          </button>
          <button
            type="button"
            className={styles.zoomButton}
            aria-label={chinese ? controls.zoomIn : "Zoom globe in"}
            onClick={() => mapRef.current?.zoomIn()}
          >
            +
          </button>
        </div>
      </div>

      <footer className={styles.footer}>
        <nav
          className={styles.secondaryNav}
          aria-label={chinese ? controls.secondaryNavigation : "Secondary"}
        >
          {footerLinks.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </footer>
    </main>
  )
}
