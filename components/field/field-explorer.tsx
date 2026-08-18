"use client"

import { Link } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { trackProductEvent } from "@/lib/analytics/adapter"
import { zhHansWorldviewMapUi } from "@/content/locales/zh-Hans/worldview-map"
import type { Locale } from "@/i18n/routing"
import { FieldDetailCard } from "@/components/field/field-detail-card"
import { FieldList } from "@/components/field/field-list"
import { FieldMap, FieldMapKey, type FieldMapMarker } from "@/components/field/field-map"
import { ArchetypeMatrix } from "@/components/field/archetype-matrix"
import { LayerControls } from "@/components/field/layer-controls"
import { resolveWorldviewMapBaseline } from "@/lib/field/archetype-matrix"
import {
  applyExtendedFieldFilters,
  buildAtlasPatternFieldItems,
  buildBaselineFieldItem,
  buildPerspectiveRunFieldItems,
  buildReferenceFieldItems,
  getMovementMemberPositions,
  latestRunPerPerspective,
  referenceEntityTypeLabel,
  type FieldItem,
} from "@/lib/field/items"
import {
  parseWorldviewMapQuery,
  serializeWorldviewMapQuery,
  WORLDVIEW_MAP_FAMILY_KEYS,
  type WorldviewMapProjection,
  type WorldviewMapReviewWindow,
  type WorldviewMapView,
} from "@/lib/field/map-state"
import {
  PUBLIC_FIELD_LAYER_CONFIGS,
  WORLDVIEW_MAP_OVERLAY_LAYER_IDS,
  WORLDVIEW_MAP_LABEL,
  fieldSelectionKey,
  filterFieldItems,
  findSelectedFieldItem,
  getNextFieldSelectionKey,
  getStableFieldItems,
  isWorldviewMapOverlayLayerId,
  normalizeWorldviewMapOverlayLayers,
  parseFieldFilters,
  parseFieldLayerIds,
  toggleActiveFieldLayer,
  toggleFieldSelectionKey,
  toggleWorldviewMapOverlayLayer,
  type FieldFilters,
  type FieldLayerAvailability,
  type FieldLayerId,
  type FieldSelectionKey,
} from "@/lib/field/layers"
import { calculateMovementHull, type MapPosition } from "@/lib/field/position"
import { perspectiveRunMatchesBaseline } from "@/lib/perspectives/result-helpers"
import { REFERENCE_PROFILE_CATALOG } from "@/lib/reference-profiles/catalog"
import {
  IR_REFERENCE_SCOPES,
  type ReferenceEntityType,
  type ReferenceScope,
} from "@/lib/reference-profiles/types"
import { loadProfileStore, type ProfileStore } from "@/lib/profile-store"
import { FAMILY_LABELS } from "@/lib/worldview-config"
import type { FamilyKey } from "@/lib/types"
import styles from "./worldview-map.module.css"

const DEFAULT_LAYERS: FieldLayerId[] = ["my-profile", "atlas-patterns"]
const REVIEWED_OPTIONS: readonly WorldviewMapReviewWindow[] = ["", "12", "24"]

const ENGLISH_SCOPE_LABELS: Record<ReferenceScope, string> = {
  foundation: "Foundation",
  security: "Security",
  technology: "Technology",
  "ai-governance": "AI governance",
}

export function FieldExplorer() {
  const locale = useLocale() as Locale
  const matrixAvailable = locale === "en"
  const copy = locale === "zh-Hans" ? zhHansWorldviewMapUi : undefined
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [initialQuery] = useState(() =>
    parseWorldviewMapQuery(searchParams.toString()),
  )
  const [initialUrlState] = useState(() => ({
    hasLayerParam: searchParams.has("layers"),
    hasProjectionParam: searchParams.has("projection"),
  }))

  const [profile, setProfile] = useState<ProfileStore | null>(null)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [activeLayerIds, setActiveLayerIds] = useState<FieldLayerId[] | null>(null)
  const [filters, setFilters] = useState<FieldFilters>(initialQuery.filters)
  const [familyKeys, setFamilyKeys] = useState<FamilyKey[]>(initialQuery.familyKeys)
  const [reviewedWithin, setReviewedWithin] =
    useState<WorldviewMapReviewWindow>(initialQuery.reviewedWithin)
  const [selectedKey, setSelectedKey] = useState<FieldSelectionKey | null>(
    initialQuery.selectedKey,
  )
  const [projection, setProjection] = useState<WorldviewMapProjection>(
    matrixAvailable ? initialQuery.projection : "continuous",
  )
  const [view, setView] = useState<WorldviewMapView>(() =>
    matrixAvailable
      ? initialQuery.view
      : searchParams.has("view")
        ? initialQuery.view
        : "list",
  )
  /** Small-screen bottom sheet for the control bar; ignored above 900px. */
  const [sheetOpen, setSheetOpen] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)
  const explorerRef = useRef<HTMLDivElement | null>(null)
  const mobileMapBackRef = useRef<HTMLButtonElement | null>(null)
  const focusReturnKeyRef = useRef<FieldSelectionKey | null>(null)
  const detailDrawerRef = useRef<HTMLElement | null>(null)
  const viewTracked = useRef(false)

  const availability: FieldLayerAvailability = useMemo(
    () => ({
      "my-profile": Boolean(profile?.foundation),
      friends: false,
      commons: false,
    }),
    [profile],
  )

  useEffect(() => {
    if (!viewTracked.current) {
      viewTracked.current = true
      trackProductEvent("worldview_map_viewed")
    }
    const load = () => {
      setProfile(loadProfileStore(locale))
      setProfileLoaded(true)
    }
    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [locale])

  // Track the breakpoint used by the mobile map and modal detail sheet.
  useEffect(() => {
    const media = window.matchMedia("(max-width: 899px)")
    const update = () => setIsNarrow(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  const initialLegacyCompatibilityMode =
    matrixAvailable &&
    initialQuery.projection === "continuous" &&
    !initialUrlState.hasProjectionParam

  const resolvedLayers = useMemo<FieldLayerId[]>(
    () =>
      activeLayerIds ??
      (profileLoaded
        ? matrixAvailable
          ? initialUrlState.hasLayerParam
            ? parseFieldLayerIds(initialQuery.layerParam, availability)
            : initialLegacyCompatibilityMode
              ? parseFieldLayerIds(DEFAULT_LAYERS.join(","), availability)
              : []
          : parseFieldLayerIds(
              initialQuery.layerParam ?? DEFAULT_LAYERS.join(","),
              availability,
            )
        : matrixAvailable
          ? []
          : DEFAULT_LAYERS),
    [
      activeLayerIds,
      availability,
      initialLegacyCompatibilityMode,
      initialQuery.layerParam,
      initialUrlState.hasLayerParam,
      matrixAvailable,
      profileLoaded,
    ],
  )

  const shouldIncludeLayerParam =
    !matrixAvailable ||
    resolvedLayers.length > 0

  const shareableQuery = useMemo(
    () =>
      serializeWorldviewMapQuery(
        {
          activeLayerIds: resolvedLayers,
          filters,
          familyKeys,
          projection,
          reviewedWithin,
          selectedKey,
          view,
        },
        availability,
        {
          includeLayerParam: shouldIncludeLayerParam,
          includeViewParam: matrixAvailable ? true : undefined,
        },
      ),
    [
      availability,
      familyKeys,
      filters,
      matrixAvailable,
      projection,
      resolvedLayers,
      reviewedWithin,
      selectedKey,
      shouldIncludeLayerParam,
      view,
    ],
  )

  useEffect(() => {
    if (!profileLoaded) return
    const nextUrl = shareableQuery ? `${pathname}?${shareableQuery}` : pathname
    const currentUrl = `${window.location.pathname}${window.location.search}`
    if (currentUrl === nextUrl) return
    window.history.replaceState(window.history.state, "", nextUrl)
  }, [pathname, profileLoaded, shareableQuery])

  const baselineItem = useMemo(
    () => buildBaselineFieldItem(profile?.foundation ?? null, locale),
    [locale, profile],
  )
  const matrixBaseline = useMemo(
    () => resolveWorldviewMapBaseline(profile?.foundation ?? null),
    [profile],
  )
  const runItems = useMemo(
    () => buildPerspectiveRunFieldItems(profile?.perspectiveRuns ?? [], locale),
    [locale, profile],
  )
  const atlasItems = useMemo(() => buildAtlasPatternFieldItems(locale), [locale])
  const referenceItems = useMemo(
    () => buildReferenceFieldItems(REFERENCE_PROFILE_CATALOG, {}, locale),
    [locale],
  )

  const layerCounts: Partial<Record<FieldLayerId, number>> = {
    "my-profile": baselineItem ? 1 : 0,
    "perspective-runs": runItems.length,
    "atlas-patterns": atlasItems.length,
    "reference-profiles": referenceItems.length,
  }

  const visibleItems: FieldItem[] = useMemo(() => {
    const contextual = filterFieldItems(
      [...runItems, ...atlasItems, ...referenceItems],
      filters,
      resolvedLayers,
    )
    const narrowed = applyExtendedFieldFilters(contextual, {
      familyKeys,
      reviewedWithinMonths: reviewedWithin ? Number(reviewedWithin) : null,
    })
    // The exact-payload English baseline is independent of contextual overlays.
    // The approved Chinese workspace retains its legacy My profile layer rule.
    const withBaseline =
      baselineItem && (matrixAvailable || resolvedLayers.includes("my-profile"))
        ? [baselineItem, ...narrowed]
        : narrowed
    return getStableFieldItems(withBaseline)
  }, [
    atlasItems,
    baselineItem,
    familyKeys,
    filters,
    matrixAvailable,
    referenceItems,
    resolvedLayers,
    reviewedWithin,
    runItems,
  ])

  const selectedItem = findSelectedFieldItem(visibleItems, selectedKey)
  const selectedItemKey = selectedItem ? fieldSelectionKey(selectedItem) : null
  const semanticListLayerIds: FieldLayerId[] =
    matrixAvailable && baselineItem
      ? [
          "my-profile",
          ...resolvedLayers.filter((layerId) => layerId !== "my-profile"),
        ]
      : resolvedLayers

  useEffect(() => {
    if (!selectedItem || !window.matchMedia("(max-width: 899px)").matches) return
    window.requestAnimationFrame(() => {
      detailDrawerRef.current?.querySelector<HTMLButtonElement>("button")?.focus()
    })
  }, [selectedItem])

  useEffect(() => {
    document.body.style.overflow =
      isNarrow && (view === "map" || Boolean(selectedItem)) ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isNarrow, selectedItem, view])

  useEffect(() => {
    const modalActive =
      isNarrow && (view === "map" || Boolean(selectedItem))
    const explorer = explorerRef.current
    if (!modalActive || !explorer) return

    const siteMain = explorer.closest<HTMLElement>("#site-main")
    const siteShell = explorer.closest<HTMLElement>(".site-shell")
    const page = explorer.parentElement
    const outside = new Set<HTMLElement>()

    if (siteShell) {
      for (const child of siteShell.children) {
        if (child instanceof HTMLElement && child !== siteMain) {
          outside.add(child)
        }
      }
    }
    if (page) {
      for (const child of page.children) {
        if (child instanceof HTMLElement && child !== explorer) {
          outside.add(child)
        }
      }
    }

    const priorInert = [...outside].map(
      (element) => [element, element.inert] as const,
    )
    for (const element of outside) element.inert = true

    if (view === "map" && !explorer.contains(document.activeElement)) {
      window.requestAnimationFrame(() => mobileMapBackRef.current?.focus())
    }

    return () => {
      for (const [element, inert] of priorInert) element.inert = inert
    }
  }, [isNarrow, selectedItem, view])

  const mapRunIds = useMemo(
    () =>
      new Set(
        latestRunPerPerspective(profile?.perspectiveRuns ?? []).map((run) => run.id),
      ),
    [profile],
  )

  const currentBaselineRunIds = useMemo(() => {
    const foundationScores = matrixBaseline?.dimensionScores
    if (!foundationScores) return new Set<string>()
    return new Set(
      latestRunPerPerspective(profile?.perspectiveRuns ?? [])
        .filter((run) => perspectiveRunMatchesBaseline(run, foundationScores))
        .map((run) => run.id),
    )
  }, [matrixBaseline, profile])

  const mappableItems = visibleItems.filter(
    (item) =>
      item.position !== null &&
      (item.kind !== "perspective-run" || mapRunIds.has(item.id)),
  )

  const markers: FieldMapMarker[] = mappableItems.map((item) => {
    const key = fieldSelectionKey(item)
    return {
      key,
      kind: item.kind,
      entityType: item.entityType,
      familyKey: item.familyKey,
      label: item.label,
      position: item.position as MapPosition,
      selected: key === selectedItemKey,
      draft: item.draft,
    }
  })

  const connectors =
    baselineItem?.position && resolvedLayers.includes("perspective-runs")
      ? mappableItems
          .filter(
            (item) =>
              item.kind === "perspective-run" && currentBaselineRunIds.has(item.id),
          )
          .map((item) => ({
            from: baselineItem.position as MapPosition,
            to: item.position as MapPosition,
          }))
      : []

  const hulls = resolvedLayers.includes("reference-profiles")
    ? visibleItems
        .filter((item) => item.kind === "reference-movement")
        .map((item) => {
          const movement = REFERENCE_PROFILE_CATALOG.movements.find(
            (candidate) => candidate.id === item.id,
          )
          if (!movement) return null
          const points = calculateMovementHull(getMovementMemberPositions(movement))
          return points.length >= 2
            ? { id: movement.id, label: movement.shortName, points }
            : null
        })
        .filter((hull): hull is NonNullable<typeof hull> => hull !== null)
    : []

  const presentEntityTypes = useMemo(() => {
    const present = new Set<ReferenceEntityType>()
    for (const item of referenceItems) {
      if (item.entityType) present.add(item.entityType)
    }
    return [...present].sort()
  }, [referenceItems])

  const filtersActive =
    filters.query !== "" ||
    filters.entityTypes.length > 0 ||
    filters.scopes.length > 0 ||
    filters.movementIds.length > 0 ||
    familyKeys.length > 0 ||
    reviewedWithin !== ""

  const activeLayerSummary = PUBLIC_FIELD_LAYER_CONFIGS.filter((config) =>
    resolvedLayers.includes(config.id),
  )
    .map((config) => copy?.layers.labels[config.id] ?? config.label)
    .join(" + ")

  function handleToggleLayer(layerId: FieldLayerId) {
    if (matrixAvailable && isWorldviewMapOverlayLayerId(layerId)) {
      const current = normalizeWorldviewMapOverlayLayers(
        resolvedLayers,
        availability,
      )
      const next = toggleWorldviewMapOverlayLayer(
        current,
        layerId,
        availability,
      )
      setActiveLayerIds(next)
      if (!current.includes(layerId) && next.includes(layerId)) {
        setProjection("continuous")
        setView("map")
      }
      return
    }
    setActiveLayerIds(toggleActiveFieldLayer(resolvedLayers, layerId, availability))
  }

  function handleProjectionChange(next: WorldviewMapProjection) {
    setProjection(next)
    setView("map")
    setSheetOpen(false)
    if (next === "matrix") setSelectedKey(null)
  }

  function handleMobileMapExit() {
    setView("list")
    setSheetOpen(false)
    window.requestAnimationFrame(() => {
      const pageHeading = document.getElementById("worldview-map-page-heading")
      pageHeading?.focus({ preventScroll: true })
      pageHeading?.scrollIntoView({ block: "start" })
    })
  }

  function handleSelect(key: FieldSelectionKey) {
    focusReturnKeyRef.current = key
    setSelectedKey((current) => toggleFieldSelectionKey(current, key))
  }

  function handleCloseDetails() {
    const returnKey = focusReturnKeyRef.current ?? selectedItemKey
    setSelectedKey(null)
    if (!returnKey) return

    window.requestAnimationFrame(() => {
      const listButton = document
        .getElementById(`field-item-${returnKey}`)
        ?.querySelector<HTMLButtonElement>("button")
      const marker = Array.from(
        document.querySelectorAll<HTMLElement>("[data-field-marker-key]"),
      ).find((element) => element.dataset.fieldMarkerKey === returnKey)
      const target = view === "map" ? marker ?? listButton : listButton ?? marker
      target?.focus()
    })
  }

  function handleDetailKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      handleCloseDetails()
      return
    }
    if (event.key !== "Tab" || !isNarrow) return

    const focusable = Array.from(
      detailDrawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    ).filter((element) => !element.hasAttribute("hidden"))
    if (focusable.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  function handleArrowNavigate(
    direction: "next" | "previous",
    fromKey: FieldSelectionKey,
  ) {
    const nextKey = getNextFieldSelectionKey(visibleItems, fromKey, direction)
    if (!nextKey) return
    focusReturnKeyRef.current = nextKey
    setSelectedKey(nextKey)
    document
      .getElementById(`field-item-${nextKey}`)
      ?.querySelector<HTMLButtonElement>("button")
      ?.focus()
  }

  function clearFilters() {
    setFilters(parseFieldFilters(""))
    setFamilyKeys([])
    setReviewedWithin("")
  }

  const loading = !profileLoaded
  const emptyLine = filtersActive
    ? copy?.map.emptyFiltered ?? "No items match these filters. Clear one or more to widen the view."
    : copy?.map.empty ?? "Nothing to show yet. Activate a layer with saved or reviewed entries."

  return (
    <div
      ref={explorerRef}
      className={styles.explorer}
      data-matrix-available={matrixAvailable ? "true" : "false"}
      data-projection={projection}
      data-view={view}
      data-sheet={sheetOpen ? "open" : "closed"}
      role={isNarrow && view === "map" && !selectedItem ? "dialog" : undefined}
      aria-modal={isNarrow && view === "map" && !selectedItem ? true : undefined}
      aria-label={
        isNarrow && view === "map" && !selectedItem
          ? copy?.page.title ?? WORLDVIEW_MAP_LABEL
          : undefined
      }
      aria-busy={loading}
    >
      {/* One horizontal control bar above the map. On small screens the same
          element becomes the bottom sheet over the full-bleed map. */}
      <nav
        className={styles.controlBar}
        aria-label={copy?.toolbar.ariaLabel ?? "Worldview Map views and context"}
        inert={isNarrow && Boolean(selectedItem) ? true : undefined}
      >
        <button
          type="button"
          className={styles.sheetHandle}
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen((open) => !open)}
        >
          <span className={styles.sheetHandleLabel}>
            {copy?.layers.heading ?? "Context overlays"}
          </span>
          <span className={styles.sheetHandleSummary}>
            {activeLayerSummary || copy?.toolbar.noActiveLayers || "No context overlays"}
          </span>
        </button>

        <div className={styles.controlBarBody}>
          <div className={styles.controlBarPrimary}>
            <LayerControls
              activeLayerIds={resolvedLayers}
              availability={availability}
              counts={layerCounts}
              onToggle={handleToggleLayer}
              layerIds={matrixAvailable ? WORLDVIEW_MAP_OVERLAY_LAYER_IDS : undefined}
              heading="Context overlays"
              note="Optional positions shown only in the continuous view. Choose up to two."
              copy={copy}
            />

            <div className={styles.controlBarActions}>
              {matrixAvailable ? (
                <div
                  className={styles.projectionToggle}
                  role="group"
                  aria-label="Map projection"
                >
                  <button
                    type="button"
                    className={`${styles.projectionButton}${projection === "matrix" ? ` ${styles.projectionButtonActive}` : ""}`}
                    aria-pressed={projection === "matrix"}
                    onClick={() => handleProjectionChange("matrix")}
                  >
                    Matrix
                  </button>
                  <button
                    type="button"
                    className={`${styles.projectionButton}${projection === "continuous" ? ` ${styles.projectionButtonActive}` : ""}`}
                    aria-pressed={projection === "continuous"}
                    onClick={() => handleProjectionChange("continuous")}
                  >
                    Continuous
                  </button>
                </div>
              ) : null}
              {matrixAvailable && projection === "matrix" ? (
                <span className={styles.toolbarMeta}>8 archetypes</span>
              ) : (
                <>
                  <span className={styles.toolbarMeta}>
                    {copy?.toolbar.itemCount(visibleItems.length) ??
                      `${visibleItems.length} ${visibleItems.length === 1 ? "item" : "items"}`}
                  </span>
                  <a className={styles.listJump} href="#worldview-map-list">
                    {copy?.toolbar.completeList ?? "Complete list"} ↓
                  </a>
                  <div className={styles.viewToggle} role="group" aria-label={copy?.toolbar.view ?? "View"}>
                    <button
                      type="button"
                      className={`${styles.viewButton}${view === "list" ? ` ${styles.viewButtonActive}` : ""}`}
                      aria-pressed={view === "list"}
                      onClick={() => setView("list")}
                    >
                      {copy?.toolbar.list ?? "List"}
                    </button>
                    <button
                      type="button"
                      className={`${styles.viewButton}${view === "map" ? ` ${styles.viewButtonActive}` : ""}`}
                      aria-pressed={view === "map"}
                      onClick={() => setView("map")}
                    >
                      {copy?.toolbar.map ?? "Map"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {!matrixAvailable || projection === "continuous" ? (
            <div className={styles.controlBarSecondary}>
            <details className={styles.filterDetails}>
              <summary className={styles.filterSummary}>
                {copy?.filters.heading ?? "Filters"}
                {filtersActive ? ` · ${copy?.filters.active ?? "active"}` : ""}
              </summary>
              <div className={styles.filterPanel}>
                <label className={styles.filterLabel}>
                  {copy?.filters.search ?? "Search"}
                  <input
                    type="search"
                    className={styles.filterInput}
                    value={filters.query}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        query: event.target.value,
                      }))
                    }
                    placeholder={copy?.filters.searchPlaceholder ?? "Name or topic"}
                  />
                </label>

                {presentEntityTypes.length > 0 ? (
                  <fieldset className={styles.filterGroup}>
                    <legend>{copy?.filters.type ?? "Type"}</legend>
                    {presentEntityTypes.map((entityType) => {
                      const active = filters.entityTypes.includes(entityType)
                      return (
                        <button
                          key={entityType}
                          type="button"
                          className={`${styles.filterOption}${active ? ` ${styles.filterOptionActive}` : ""}`}
                          aria-pressed={active}
                          onClick={() =>
                            setFilters((current) => ({
                              ...current,
                              entityTypes: active
                                ? current.entityTypes.filter(
                                    (value) => value !== entityType,
                                  )
                                : [...current.entityTypes, entityType],
                            }))
                          }
                        >
                          {referenceEntityTypeLabel(entityType, locale)}
                        </button>
                      )
                    })}
                  </fieldset>
                ) : null}

                <fieldset className={styles.filterGroup}>
                  <legend>{copy?.filters.scope ?? "Scope"}</legend>
                  {[...IR_REFERENCE_SCOPES, "ai-governance" as ReferenceScope].map(
                    (scope) => {
                      const active = filters.scopes.includes(scope)
                      const label = copy
                        ? copy.filters.scopes[scope === "ai-governance" ? "aiGovernance" : scope]
                        : ENGLISH_SCOPE_LABELS[scope]
                      return (
                        <button
                          key={scope}
                          type="button"
                          className={`${styles.filterOption}${active ? ` ${styles.filterOptionActive}` : ""}`}
                          aria-pressed={active}
                          onClick={() =>
                            setFilters((current) => ({
                              ...current,
                              scopes: active
                                ? current.scopes.filter((value) => value !== scope)
                                : [...current.scopes, scope],
                            }))
                          }
                        >
                          {label}
                        </button>
                      )
                    },
                  )}
                </fieldset>

                <fieldset className={styles.filterGroup}>
                  <legend>{copy?.filters.family ?? "Family"}</legend>
                  {WORLDVIEW_MAP_FAMILY_KEYS.map((familyKey) => {
                    const active = familyKeys.includes(familyKey)
                    return (
                      <button
                        key={familyKey}
                        type="button"
                        className={`${styles.filterOption}${active ? ` ${styles.filterOptionActive}` : ""}`}
                        aria-pressed={active}
                        onClick={() =>
                          setFamilyKeys((current) =>
                            active
                              ? current.filter((value) => value !== familyKey)
                              : [...current, familyKey],
                          )
                        }
                      >
                        {copy?.filters.families[familyKey] ?? FAMILY_LABELS[familyKey]}
                      </button>
                    )
                  })}
                </fieldset>

                <label className={styles.filterLabel}>
                  {copy?.filters.referenceDate ?? "Reference date"}
                  <select
                    className={styles.filterInput}
                    value={reviewedWithin}
                    onChange={(event) =>
                      setReviewedWithin(
                        event.target.value as WorldviewMapReviewWindow,
                      )
                    }
                  >
                    {REVIEWED_OPTIONS.map((value) => (
                      <option key={value} value={value}>
                        {value === ""
                          ? copy?.filters.anyTime ?? "Any time"
                          : value === "12"
                            ? copy?.filters.last12Months ?? "Last 12 months"
                            : copy?.filters.last24Months ?? "Last 24 months"}
                      </option>
                    ))}
                  </select>
                </label>

                {filtersActive ? (
                  <button
                    type="button"
                    className={styles.clearFilters}
                    onClick={clearFilters}
                  >
                    {copy?.filters.clear ?? "Clear filters"}
                  </button>
                ) : null}
              </div>
            </details>

            <details className={styles.keyDetails}>
              <summary className={styles.filterSummary}>{copy?.map.mapKey ?? "Map key"}</summary>
              <FieldMapKey
                kinds={["baseline", "perspective-run", "atlas-pattern", "reference"]}
                copy={copy}
              />
            </details>
            </div>
          ) : null}
        </div>
      </nav>

      <div
        className={`${styles.workspace}${selectedItem ? ` ${styles.workspaceWithDrawer}` : ""}`}
      >
        <main
          className={styles.mapColumn}
          inert={isNarrow && Boolean(selectedItem) ? true : undefined}
        >
          <section className={styles.mapStage} aria-label={copy?.page.title ?? WORLDVIEW_MAP_LABEL}>
            <div className={styles.mobileMapHeader}>
              <button
                ref={mobileMapBackRef}
                type="button"
                className={styles.mapBack}
                onClick={
                  matrixAvailable && projection === "matrix"
                    ? handleMobileMapExit
                    : () => setView("list")
                }
              >
                {matrixAvailable && projection === "matrix"
                  ? "← Back to page"
                  : `← ${copy?.toolbar.backToList ?? "Back to list"}`}
              </button>
              <strong>{copy?.page.title ?? WORLDVIEW_MAP_LABEL}</strong>
            </div>
            <div className={styles.mapStageBody}>
              {loading ? (
                <p className={styles.mapLoading}>{copy?.map.loadingSavedLayers ?? "Loading saved layers…"}</p>
              ) : (
                <>
                  {matrixAvailable ? (
                    <div
                      className={styles.matrixProjection}
                      aria-hidden={projection === "matrix" ? undefined : true}
                      inert={projection === "matrix" ? undefined : true}
                    >
                      <ArchetypeMatrix baseline={matrixBaseline} />
                    </div>
                  ) : null}

                  <div
                    className={styles.continuousProjection}
                    aria-hidden={projection === "continuous" ? undefined : true}
                    inert={projection === "continuous" ? undefined : true}
                  >
                    {matrixAvailable ? (
                      <p className={styles.continuousNote}>
                        Secondary view. This projection does not encode applying
                        advantage or restraint.
                      </p>
                    ) : null}
                    {mappableItems.length > 0 ? (
                      <FieldMap
                        ariaLabel={copy?.map.ariaLabel ?? "Continuous worldview projection. Every plotted item also appears in the complete semantic list with the same details."}
                        markers={markers}
                        connectors={connectors}
                        hulls={hulls}
                        showAnchors
                        onSelect={(key) => handleSelect(key as FieldSelectionKey)}
                        markerHrefPrefix="field-item-"
                        caption={
                          filters.scopes.includes("ai-governance" as ReferenceScope)
                            ? copy?.map.aiCaption ?? "AI-governance positions use different axes and remain available in the list."
                            : copy?.map.spacingCaption ?? "Spacing is comparative, not calibrated. The vertical axis separates Realism, Institutionalism, and Critical political economy only weakly because all three include material explanations. Exact collisions form one cluster at the shared coordinate; opening it reveals every item without changing its source position."
                        }
                        copy={copy}
                      />
                    ) : (
                      <p className={styles.mapEmpty}>{emptyLine}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>

          <section
            id="worldview-map-list"
            className={styles.listRegion}
            aria-labelledby="worldview-map-list-heading"
          >
            <div className={styles.listHeader}>
              <h2 id="worldview-map-list-heading" className={styles.listTitle}>
                {copy?.map.completeListHeading ?? "Complete list"}
              </h2>
              <p className={styles.listNote}>
                {copy?.map.completeListNote ?? "All visible and list-only entries. Use ↑ and ↓ from an item to move."}
              </p>
            </div>
            <FieldList
              items={visibleItems}
              activeLayerIds={semanticListLayerIds}
              selectedKey={selectedItemKey}
              onSelect={handleSelect}
              onArrowNavigate={handleArrowNavigate}
              emptyLine={emptyLine}
              copy={copy}
            />

            <p className={styles.railFoot}>
              {copy ? (
                <Link href="/perspectives">{copy.map.railFoot}</Link>
              ) : (
                <><Link href="/perspectives">Try another vantage point</Link> to see how a
                defined context shifts your baseline judgments.</>
              )}
            </p>
          </section>
        </main>

        {selectedItem ? (
          <aside
            ref={detailDrawerRef}
            className={styles.detailDrawer}
            role={isNarrow ? "dialog" : undefined}
            aria-modal={isNarrow ? true : undefined}
            aria-label={copy?.map.selectedDetailsAria ?? "Selected item details"}
            onKeyDown={handleDetailKeyDown}
          >
            <FieldDetailCard item={selectedItem} onClose={handleCloseDetails} copy={copy} />
          </aside>
        ) : null}
      </div>

      <p className="sr-only" role="status">
        {loading
          ? copy?.map.statusLoading ?? "Loading saved layers."
          : matrixAvailable && projection === "matrix"
            ? `Eight archetypes shown.${matrixBaseline ? ` ${matrixBaseline.resolvedArchetype.name} is your Foundation reading.` : " No Foundation baseline is saved."}`
            : copy?.map.statusShown(visibleItems.length, selectedItem?.label) ??
              `${visibleItems.length} items shown.${selectedItem ? ` ${selectedItem.label} selected.` : ""}`}
      </p>
    </div>
  )
}
