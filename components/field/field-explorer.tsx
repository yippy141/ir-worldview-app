"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
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
  fieldSelectionKey,
  filterFieldItems,
  findSelectedFieldItem,
  getNextFieldSelectionKey,
  getStableFieldItems,
  parseFieldFilters,
  parseFieldLayerIds,
  serializeFieldFilters,
  serializeFieldLayerIds,
  toggleActiveFieldLayer,
  type FieldFilters,
  type FieldLayerAvailability,
  type FieldLayerId,
  type FieldSelectionKey,
} from "@/lib/field/layers"
import { calculateMovementHull, type MapPosition } from "@/lib/field/position"
import { REFERENCE_PROFILE_CATALOG } from "@/lib/reference-profiles/catalog"
import {
  IR_REFERENCE_SCOPES,
  type ReferenceEntityType,
  type ReferenceScope,
} from "@/lib/reference-profiles/types"
import { loadProfileStore, type ProfileStore } from "@/lib/profile-store"
import { FAMILY_LABELS } from "@/lib/worldview-config"
import type { FamilyKey } from "@/lib/types"

const DEFAULT_LAYERS: FieldLayerId[] = ["my-profile", "atlas-patterns"]
const FAMILY_KEYS = Object.keys(FAMILY_LABELS) as FamilyKey[]
const REVIEWED_OPTIONS = [
  { value: "", label: "Any time" },
  { value: "12", label: "Last 12 months" },
  { value: "24", label: "Last 24 months" },
] as const

type ViewMode = "list" | "map"

export function FieldExplorer() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [profile, setProfile] = useState<ProfileStore | null>(null)
  const [activeLayerIds, setActiveLayerIds] = useState<FieldLayerId[] | null>(null)
  const [filters, setFilters] = useState<FieldFilters>(() =>
    parseFieldFilters(searchParams.toString()),
  )
  const [familyKeys, setFamilyKeys] = useState<FamilyKey[]>(() =>
    (searchParams.getAll("family") ?? []).filter((value): value is FamilyKey =>
      FAMILY_KEYS.includes(value as FamilyKey),
    ),
  )
  const [reviewedWithin, setReviewedWithin] = useState<string>(() => {
    const value = searchParams.get("reviewed") ?? ""
    return value === "12" || value === "24" ? value : ""
  })
  const [selectedKey, setSelectedKey] = useState<FieldSelectionKey | null>(() => {
    const raw = searchParams.get("sel")
    return raw ? (raw as FieldSelectionKey) : null
  })
  const [view, setView] = useState<ViewMode>(() =>
    searchParams.get("view") === "map" ? "map" : "list",
  )

  const availability: FieldLayerAvailability = useMemo(
    () => ({
      "my-profile": Boolean(profile?.foundation),
      friends: false,
      commons: false,
    }),
    [profile],
  )

  useEffect(() => {
    const load = () => setProfile(loadProfileStore())
    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  // Layers resolve from the URL until the user toggles one; the URL parse
  // waits for the profile so availability rules apply to the saved layers.
  const urlLayerParam = searchParams.get("layers")
  const resolvedLayers: FieldLayerId[] =
    activeLayerIds ??
    (profile !== null
      ? parseFieldLayerIds(urlLayerParam ?? DEFAULT_LAYERS.join(","), availability)
      : DEFAULT_LAYERS)

  // Keep filter, layer, selection, and view state shareable in the URL.
  useEffect(() => {
    if (profile === null) return
    const params = new URLSearchParams(serializeFieldFilters(filters))
    params.set("layers", serializeFieldLayerIds(resolvedLayers, availability))
    for (const familyKey of familyKeys) params.append("family", familyKey)
    if (reviewedWithin) params.set("reviewed", reviewedWithin)
    if (selectedKey) params.set("sel", selectedKey)
    if (view === "map") params.set("view", "map")
    const query = params.toString()
    window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname)
  })

  const baselineItem = useMemo(
    () => buildBaselineFieldItem(profile?.foundation ?? null),
    [profile],
  )
  const runItems = useMemo(
    () => buildPerspectiveRunFieldItems(profile?.perspectiveRuns ?? []),
    [profile],
  )
  const atlasItems = useMemo(() => buildAtlasPatternFieldItems(), [])
  const referenceItems = useMemo(() => buildReferenceFieldItems(), [])

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
    // The baseline bypasses narrowing facets: the layer contract keeps the
    // user position visible whenever the My profile layer is active.
    const withBaseline =
      baselineItem && resolvedLayers.includes("my-profile")
        ? [baselineItem, ...narrowed]
        : narrowed
    return getStableFieldItems(withBaseline)
  }, [runItems, atlasItems, referenceItems, filters, resolvedLayers, familyKeys, reviewedWithin, baselineItem])

  const selectedItem = findSelectedFieldItem(visibleItems, selectedKey)

  const mapRunIds = useMemo(
    () => new Set(latestRunPerPerspective(profile?.perspectiveRuns ?? []).map((run) => run.id)),
    [profile],
  )

  const mappableItems = visibleItems.filter(
    (item) =>
      item.position !== null &&
      (item.kind !== "perspective-run" || mapRunIds.has(item.id)),
  )

  const neighborKeys = useMemo(() => {
    if (!selectedItem?.position) return new Set<FieldSelectionKey>()
    const selected = fieldSelectionKey(selectedItem)
    return new Set(
      mappableItems
        .filter((item) => fieldSelectionKey(item) !== selected)
        .map((item) => ({
          key: fieldSelectionKey(item),
          distance: squaredDistance(item.position as MapPosition, selectedItem.position as MapPosition),
        }))
        .sort((left, right) => left.distance - right.distance)
        .slice(0, 3)
        .map((entry) => entry.key),
    )
  }, [mappableItems, selectedItem])

  const selectedItemKey = selectedItem ? fieldSelectionKey(selectedItem) : null

  const markers: FieldMapMarker[] = mappableItems.map((item) => {
    const key = fieldSelectionKey(item)
    return {
      key,
      kind: item.kind,
      entityType: item.entityType,
      label: item.label,
      position: item.position as MapPosition,
      selected: key === selectedItemKey,
      labeled:
        item.kind === "baseline" ||
        key === selectedItemKey ||
        neighborKeys.has(key),
      draft: item.draft,
    }
  })

  const connectors =
    baselineItem?.position && resolvedLayers.includes("perspective-runs")
      ? mappableItems
          .filter((item) => item.kind === "perspective-run")
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
    familyKeys.length > 0 ||
    reviewedWithin !== ""

  function handleToggleLayer(layerId: FieldLayerId) {
    setActiveLayerIds(toggleActiveFieldLayer(resolvedLayers, layerId, availability))
  }

  function handleSelect(key: FieldSelectionKey) {
    setSelectedKey((current) => (current === key ? null : key))
  }

  function handleArrowNavigate(direction: "next" | "previous") {
    const nextKey = getNextFieldSelectionKey(visibleItems, selectedKey, direction)
    if (!nextKey) return
    setSelectedKey(nextKey)
    const row = document.getElementById(`field-item-${nextKey}`)
    row?.querySelector("button")?.focus()
  }

  function clearFilters() {
    setFilters(parseFieldFilters(""))
    setFamilyKeys([])
    setReviewedWithin("")
  }

  const loading = profile === null

  return (
    <div className={`field-explorer field-explorer--${view}`} aria-busy={loading}>
      <div className="field-view-toggle" role="group" aria-label="View">
        <button
          type="button"
          className={`field-view-toggle__button${view === "list" ? " field-view-toggle__button--active" : ""}`}
          aria-pressed={view === "list"}
          onClick={() => setView("list")}
        >
          List view
        </button>
        <button
          type="button"
          className={`field-view-toggle__button${view === "map" ? " field-view-toggle__button--active" : ""}`}
          aria-pressed={view === "map"}
          onClick={() => setView("map")}
        >
          Map view
        </button>
      </div>

      <div className="field-explorer-grid">
        <div className="field-map-panel panel">
          {loading ? (
            <p className="muted field-map-panel__loading">Loading saved layers…</p>
          ) : mappableItems.length > 0 ? (
            <FieldMap
              ariaLabel="Layered field map. Every plotted item also appears in the list below with the same details."
              markers={markers}
              connectors={connectors}
              hulls={hulls}
              onSelect={(key) => handleSelect(key as FieldSelectionKey)}
              markerHrefPrefix="field-item-"
              caption={
                filters.scopes.includes("ai-governance" as ReferenceScope)
                  ? "AI-governance profiles use their own axes and appear in the list."
                  : "Labels show for your baseline, the selected item, and its nearest neighbors. Select any mark for details."
              }
            />
          ) : (
            <p className="muted field-map-panel__empty">
              {filtersActive
                ? "No items match these filters. Clear one or more to widen the view."
                : "Nothing to plot yet. Activate a layer with saved or coded entries."}
            </p>
          )}
        </div>

        <aside className="field-rail stack-md">
          {selectedItem ? (
            <FieldDetailCard item={selectedItem} onClose={() => setSelectedKey(null)} />
          ) : null}

          <LayerControls
            activeLayerIds={resolvedLayers}
            availability={availability}
            counts={layerCounts}
            onToggle={handleToggleLayer}
          />

          <details className="field-rail-section">
            <summary className="field-rail__heading field-rail-section__summary">
              Filters{filtersActive ? " · on" : ""}
            </summary>
            <div className="field-filters stack-sm">
              <label className="field-filters__label">
                Search
                <input
                  type="search"
                  className="field-filters__input"
                  value={filters.query}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, query: event.target.value }))
                  }
                  placeholder="Name or topic"
                />
              </label>

              {presentEntityTypes.length > 0 ? (
                <fieldset className="field-filters__group">
                  <legend>Type</legend>
                  {presentEntityTypes.map((entityType) => {
                    const active = filters.entityTypes.includes(entityType)
                    return (
                      <button
                        key={entityType}
                        type="button"
                        className={`field-filter-chip${active ? " field-filter-chip--active" : ""}`}
                        aria-pressed={active}
                        onClick={() =>
                          setFilters((current) => ({
                            ...current,
                            entityTypes: active
                              ? current.entityTypes.filter((value) => value !== entityType)
                              : [...current.entityTypes, entityType],
                          }))
                        }
                      >
                        {referenceEntityTypeLabel(entityType)}
                      </button>
                    )
                  })}
                </fieldset>
              ) : null}

              <fieldset className="field-filters__group">
                <legend>Scope</legend>
                {[...IR_REFERENCE_SCOPES, "ai-governance" as ReferenceScope].map((scope) => {
                  const active = filters.scopes.includes(scope)
                  const label =
                    scope === "ai-governance"
                      ? "AI governance"
                      : scope.charAt(0).toUpperCase() + scope.slice(1)
                  return (
                    <button
                      key={scope}
                      type="button"
                      className={`field-filter-chip${active ? " field-filter-chip--active" : ""}`}
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
                })}
              </fieldset>

              <fieldset className="field-filters__group">
                <legend>Family</legend>
                {FAMILY_KEYS.map((familyKey) => {
                  const active = familyKeys.includes(familyKey)
                  return (
                    <button
                      key={familyKey}
                      type="button"
                      className={`field-filter-chip${active ? " field-filter-chip--active" : ""}`}
                      aria-pressed={active}
                      onClick={() =>
                        setFamilyKeys((current) =>
                          active
                            ? current.filter((value) => value !== familyKey)
                            : [...current, familyKey],
                        )
                      }
                    >
                      {FAMILY_LABELS[familyKey]}
                    </button>
                  )
                })}
              </fieldset>

              <label className="field-filters__label">
                Reviewed
                <select
                  className="field-filters__input"
                  value={reviewedWithin}
                  onChange={(event) => setReviewedWithin(event.target.value)}
                >
                  {REVIEWED_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {filtersActive ? (
                <button type="button" className="field-filters__clear" onClick={clearFilters}>
                  Clear filters
                </button>
              ) : null}
            </div>
          </details>

          <details className="field-rail-section">
            <summary className="field-rail__heading field-rail-section__summary">Key</summary>
            <FieldMapKey kinds={["baseline", "perspective-run", "atlas-pattern", "reference"]} />
          </details>

          <p className="muted field-rail__foot">
            <Link href="/perspectives">Try another vantage point</Link> — advise from a defined
            position and see the shift plotted beside your baseline.
          </p>
        </aside>
      </div>

      <p className="sr-only" role="status">
        {loading ? "Loading saved layers." : `${visibleItems.length} items shown.`}
      </p>

      <section className="field-list-region" aria-label="All field items as a list">
        <FieldList
          items={visibleItems}
          activeLayerIds={resolvedLayers}
          selectedKey={selectedItemKey}
          onSelect={handleSelect}
          onArrowNavigate={handleArrowNavigate}
          emptyLine={
            filtersActive
              ? "No items match these filters. Clear one or more to widen the view."
              : "Nothing to list yet. Activate a layer with saved or coded entries."
          }
        />
      </section>
    </div>
  )
}

function squaredDistance(left: MapPosition, right: MapPosition): number {
  const x = left.x - right.x
  const y = left.y - right.y
  return x * x + y * y
}
