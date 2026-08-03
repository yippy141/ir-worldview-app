"use client"

import { Link } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { trackProductEvent } from "@/lib/analytics/adapter"
import { zhHansWorldviewMapUi } from "@/content/locales/zh-Hans/worldview-map"
import type { Locale } from "@/i18n/routing"
import { FieldDetailCard } from "@/components/field/field-detail-card"
import { FieldList } from "@/components/field/field-list"
import { FieldMap, FieldMapKey, type FieldMapMarker } from "@/components/field/field-map"
import { LayerControls } from "@/components/field/layer-controls"
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
  type WorldviewMapReviewWindow,
  type WorldviewMapView,
} from "@/lib/field/map-state"
import {
  PUBLIC_FIELD_LAYER_CONFIGS,
  WORLDVIEW_MAP_LABEL,
  fieldSelectionKey,
  filterFieldItems,
  findSelectedFieldItem,
  getNextFieldSelectionKey,
  getStableFieldItems,
  parseFieldFilters,
  parseFieldLayerIds,
  toggleActiveFieldLayer,
  toggleFieldSelectionKey,
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
  const copy = locale === "zh-Hans" ? zhHansWorldviewMapUi : undefined
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [initialQuery] = useState(() =>
    parseWorldviewMapQuery(searchParams.toString()),
  )

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
  const [view, setView] = useState<WorldviewMapView>(initialQuery.view)
  /** Small-screen bottom sheet for the control bar; ignored above 900px. */
  const [sheetOpen, setSheetOpen] = useState(false)
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

  // Lock the document only for the dedicated small-screen map state.
  useEffect(() => {
    const media = window.matchMedia("(max-width: 899px)")
    const applyLock = () => {
      document.body.style.overflow = view === "map" && media.matches ? "hidden" : ""
    }
    applyLock()
    media.addEventListener("change", applyLock)
    return () => {
      media.removeEventListener("change", applyLock)
      document.body.style.overflow = ""
    }
  }, [view])

  const resolvedLayers: FieldLayerId[] =
    activeLayerIds ??
    (profileLoaded
      ? parseFieldLayerIds(
          initialQuery.layerParam ?? DEFAULT_LAYERS.join(","),
          availability,
        )
      : DEFAULT_LAYERS)

  const shareableQuery = useMemo(
    () =>
      serializeWorldviewMapQuery(
        {
          activeLayerIds: resolvedLayers,
          filters,
          familyKeys,
          reviewedWithin,
          selectedKey,
          view,
        },
        availability,
      ),
    [availability, familyKeys, filters, resolvedLayers, reviewedWithin, selectedKey, view],
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
    // Facets never hide the user's baseline when its layer is explicitly active.
    const withBaseline =
      baselineItem && resolvedLayers.includes("my-profile")
        ? [baselineItem, ...narrowed]
        : narrowed
    return getStableFieldItems(withBaseline)
  }, [
    atlasItems,
    baselineItem,
    familyKeys,
    filters,
    referenceItems,
    resolvedLayers,
    reviewedWithin,
    runItems,
  ])

  const selectedItem = findSelectedFieldItem(visibleItems, selectedKey)
  const selectedItemKey = selectedItem ? fieldSelectionKey(selectedItem) : null

  useEffect(() => {
    if (!selectedItem || !window.matchMedia("(max-width: 899px)").matches) return
    window.requestAnimationFrame(() => {
      detailDrawerRef.current?.querySelector<HTMLButtonElement>("button")?.focus()
    })
  }, [selectedItem])

  const mapRunIds = useMemo(
    () =>
      new Set(
        latestRunPerPerspective(profile?.perspectiveRuns ?? []).map((run) => run.id),
      ),
    [profile],
  )

  const currentBaselineRunIds = useMemo(() => {
    const foundationScores = profile?.foundation?.dimensionScores
    if (!foundationScores) return new Set<string>()
    return new Set(
      latestRunPerPerspective(profile?.perspectiveRuns ?? [])
        .filter((run) => perspectiveRunMatchesBaseline(run, foundationScores))
        .map((run) => run.id),
    )
  }, [profile])

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
    setActiveLayerIds(toggleActiveFieldLayer(resolvedLayers, layerId, availability))
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
      className={styles.explorer}
      data-view={view}
      data-sheet={sheetOpen ? "open" : "closed"}
      aria-busy={loading}
    >
      {/* One horizontal control bar above the map. On small screens the same
          element becomes the bottom sheet over the full-bleed map. */}
      <div className={styles.controlBar} aria-label={copy?.toolbar.ariaLabel ?? "Map workspace toolbar"}>
        <button
          type="button"
          className={styles.sheetHandle}
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen((open) => !open)}
        >
          <span className={styles.sheetHandleLabel}>
            {copy?.layers.heading ?? "Layers"}
          </span>
          <span className={styles.sheetHandleSummary}>
            {activeLayerSummary || copy?.toolbar.noActiveLayers || "No active layers"}
          </span>
        </button>

        <div className={styles.controlBarBody}>
          <div className={styles.controlBarPrimary}>
            <LayerControls
              activeLayerIds={resolvedLayers}
              availability={availability}
              counts={layerCounts}
              onToggle={handleToggleLayer}
              copy={copy}
            />

            <div className={styles.controlBarActions}>
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
            </div>
          </div>

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
        </div>
      </div>

      <div
        className={`${styles.workspace}${selectedItem ? ` ${styles.workspaceWithDrawer}` : ""}`}
      >
        <main className={styles.mapColumn}>
          <section className={styles.mapStage} aria-label={copy?.page.title ?? WORLDVIEW_MAP_LABEL}>
            <div className={styles.mobileMapHeader}>
              <button
                type="button"
                className={styles.mapBack}
                onClick={() => setView("list")}
              >
                ← {copy?.toolbar.backToList ?? "Back to list"}
              </button>
              <strong>{copy?.page.title ?? WORLDVIEW_MAP_LABEL}</strong>
            </div>
            <div className={styles.mapStageBody}>
              {loading ? (
                <p className={styles.mapLoading}>{copy?.map.loadingSavedLayers ?? "Loading saved layers…"}</p>
              ) : mappableItems.length > 0 ? (
                <FieldMap
                  ariaLabel={copy?.map.ariaLabel ?? "Layered worldview map. Every plotted item also appears in the complete semantic list with the same details."}
                  markers={markers}
                  connectors={connectors}
                  hulls={hulls}
                  showAnchors
                  onSelect={(key) => handleSelect(key as FieldSelectionKey)}
                  markerHrefPrefix="field-item-"
                  caption={
                    filters.scopes.includes("ai-governance" as ReferenceScope)
                      ? copy?.map.aiCaption ?? "AI-governance positions use different axes and remain available in the list."
                      : copy?.map.spacingCaption ?? "Spacing is comparative, not calibrated. Overlapping marks stack into one cluster that fans open on hover or selection."
                  }
                  copy={copy}
                />
              ) : (
                <p className={styles.mapEmpty}>{emptyLine}</p>
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
              activeLayerIds={resolvedLayers}
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
            aria-label={copy?.map.selectedDetailsAria ?? "Selected item details"}
            onKeyDown={(event) => {
              if (event.key === "Escape") handleCloseDetails()
            }}
          >
            <FieldDetailCard item={selectedItem} onClose={handleCloseDetails} copy={copy} />
          </aside>
        ) : null}
      </div>

      <p className="sr-only" role="status">
        {loading
          ? copy?.map.statusLoading ?? "Loading saved layers."
          : copy?.map.statusShown(visibleItems.length, selectedItem?.label) ??
            `${visibleItems.length} items shown.${selectedItem ? ` ${selectedItem.label} selected.` : ""}`}
      </p>
    </div>
  )
}
