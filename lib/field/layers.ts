import {
  isReferenceEntityType,
  isReferenceScope,
  type ReferenceEntityType,
  type ReferenceScope,
} from "@/lib/reference-profiles/types"

export const FIELD_LAYER_IDS = [
  "my-profile",
  "atlas-patterns",
  "perspective-runs",
  "reference-profiles",
  "friends",
  "commons",
] as const

export type FieldLayerId = (typeof FIELD_LAYER_IDS)[number]
export type FieldLayerKind = "personal" | "contextual" | "aggregate"
export type FieldLayerReleaseStatus = "available" | "hidden"

export type FieldLayerConfig = {
  id: FieldLayerId
  label: string
  kind: FieldLayerKind
  releaseStatus: FieldLayerReleaseStatus
  defaultAvailable: boolean
}

export const MAX_ACTIVE_FIELD_LAYERS = 2
export const WORLDVIEW_MAP_LABEL = "Worldview Map"

export const FIELD_LAYER_CONFIGS = [
  {
    id: "my-profile",
    label: "My baseline",
    kind: "personal",
    releaseStatus: "available",
    defaultAvailable: true,
  },
  {
    id: "atlas-patterns",
    label: "Decision Patterns",
    kind: "contextual",
    releaseStatus: "available",
    defaultAvailable: true,
  },
  {
    id: "perspective-runs",
    label: "My perspective shifts",
    kind: "contextual",
    releaseStatus: "available",
    defaultAvailable: true,
  },
  {
    id: "reference-profiles",
    label: "Thinkers & public positions",
    kind: "contextual",
    releaseStatus: "available",
    defaultAvailable: true,
  },
  {
    id: "friends",
    label: "Friends",
    kind: "contextual",
    releaseStatus: "hidden",
    defaultAvailable: false,
  },
  {
    id: "commons",
    label: "Commons",
    kind: "aggregate",
    releaseStatus: "hidden",
    defaultAvailable: false,
  },
] as const satisfies readonly FieldLayerConfig[]

/** Public controls intentionally omit future social and aggregate layers. */
export const PUBLIC_FIELD_LAYER_CONFIGS = FIELD_LAYER_CONFIGS.filter(
  (config) => config.releaseStatus === "available",
)

export const FIELD_LAYER_CONFIG_BY_ID: Readonly<
  Record<FieldLayerId, FieldLayerConfig>
> = Object.fromEntries(
  FIELD_LAYER_CONFIGS.map((config) => [config.id, config]),
) as Record<FieldLayerId, FieldLayerConfig>

export type FieldLayerAvailability = Readonly<
  Partial<Record<FieldLayerId, boolean>>
>

export const DEFAULT_FIELD_LAYER_AVAILABILITY: Readonly<
  Record<FieldLayerId, boolean>
> = Object.fromEntries(
  FIELD_LAYER_CONFIGS.map((config) => [config.id, config.defaultAvailable]),
) as Record<FieldLayerId, boolean>

export function isFieldLayerId(value: unknown): value is FieldLayerId {
  return (
    typeof value === "string" &&
    (FIELD_LAYER_IDS as readonly string[]).includes(value)
  )
}

export function isFieldLayerAvailable(
  layerId: FieldLayerId,
  availability: FieldLayerAvailability = {},
): boolean {
  if (FIELD_LAYER_CONFIG_BY_ID[layerId].releaseStatus !== "available") {
    return false
  }
  return availability[layerId] ?? DEFAULT_FIELD_LAYER_AVAILABILITY[layerId]
}

function uniqueAvailableLayerIds(
  requested: readonly unknown[],
  availability: FieldLayerAvailability,
): FieldLayerId[] {
  const seen = new Set<FieldLayerId>()
  const result: FieldLayerId[] = []

  for (const value of requested) {
    if (
      !isFieldLayerId(value) ||
      seen.has(value) ||
      !isFieldLayerAvailable(value, availability)
    ) {
      continue
    }
    seen.add(value)
    result.push(value)
  }

  return result
}

function fallbackLayerId(
  availability: FieldLayerAvailability,
): FieldLayerId | undefined {
  if (isFieldLayerAvailable("my-profile", availability)) return "my-profile"
  return FIELD_LAYER_IDS.find((layerId) =>
    isFieldLayerAvailable(layerId, availability),
  )
}

/**
 * Enforce the Field's layer contract.
 *
 * One or two explicitly requested layers remain active. Unknown, duplicate,
 * hidden, and unavailable layer IDs are removed. The fallback keeps the map
 * usable without forcing a saved baseline beside every contextual layer.
 */
export function normalizeActiveFieldLayers(
  requested: readonly unknown[],
  availability: FieldLayerAvailability = {},
): FieldLayerId[] {
  const available = uniqueAvailableLayerIds(requested, availability)

  if (available.length === 0) {
    const fallback = fallbackLayerId(availability)
    return fallback ? [fallback] : []
  }

  return available.slice(0, MAX_ACTIVE_FIELD_LAYERS)
}

/** Toggle a layer while preserving the active-layer contract. */
export function toggleActiveFieldLayer(
  current: readonly FieldLayerId[],
  layerId: FieldLayerId,
  availability: FieldLayerAvailability = {},
): FieldLayerId[] {
  if (!isFieldLayerAvailable(layerId, availability)) {
    return normalizeActiveFieldLayers(current, availability)
  }

  if (current.includes(layerId)) {
    return normalizeActiveFieldLayers(
      current.filter((activeLayerId) => activeLayerId !== layerId),
      availability,
    )
  }

  // Activating a third layer replaces the oldest active layer. This keeps the
  // newly requested layer visible and permits contextual-only comparisons.
  return normalizeActiveFieldLayers(
    [...current.slice(-(MAX_ACTIVE_FIELD_LAYERS - 1)), layerId],
    availability,
  )
}

export const FIELD_LAYER_QUERY_KEY = "layers"

export function serializeFieldLayerIds(
  activeLayerIds: readonly FieldLayerId[],
  availability: FieldLayerAvailability = {},
): string {
  return normalizeActiveFieldLayers(activeLayerIds, availability).join(",")
}

export function parseFieldLayerIds(
  value: string | null | undefined,
  availability: FieldLayerAvailability = {},
): FieldLayerId[] {
  return normalizeActiveFieldLayers(value?.split(",") ?? [], availability)
}

// ---------------------------------------------------------------------------
// URL filters
// ---------------------------------------------------------------------------

export type FieldFilters = {
  query: string
  entityTypes: readonly ReferenceEntityType[]
  scopes: readonly ReferenceScope[]
  movementIds: readonly string[]
}

export const EMPTY_FIELD_FILTERS: FieldFilters = {
  query: "",
  entityTypes: [],
  scopes: [],
  movementIds: [],
}

export type FieldFilterableItem = {
  id: string
  layerId: FieldLayerId
  label: string
  sortKey?: string
  searchableText?: string | readonly string[]
  entityType?: ReferenceEntityType
  scope?: ReferenceScope
  movementIds?: readonly string[]
}

const FILTER_QUERY_KEYS = {
  query: "q",
  entityType: "entity",
  scope: "scope",
  movement: "movement",
} as const

const FIELD_FACET_ID_PATTERN = /^[a-z0-9](?:[a-z0-9._-]{0,79})$/

function compareStrings(left: string, right: string): number {
  if (left === right) return 0
  return left < right ? -1 : 1
}

function uniqueSorted<T extends string>(values: readonly T[]): T[] {
  return [...new Set(values)].sort(compareStrings)
}

function isFieldFacetId(value: unknown): value is string {
  return typeof value === "string" && FIELD_FACET_ID_PATTERN.test(value)
}

export function normalizeFieldFilters(
  filters: Partial<FieldFilters> = {},
): FieldFilters {
  const rawQuery = typeof filters.query === "string" ? filters.query : ""
  const query = rawQuery.trim().replace(/\s+/g, " ")
  const entityTypes = uniqueSorted(
    (filters.entityTypes ?? []).filter(isReferenceEntityType),
  )
  const scopes = uniqueSorted(
    (filters.scopes ?? []).filter(isReferenceScope),
  )
  const movementIds = uniqueSorted(
    (filters.movementIds ?? []).filter(isFieldFacetId),
  )

  return { query, entityTypes, scopes, movementIds }
}

function toSearchParams(value: string | URLSearchParams): URLSearchParams {
  if (value instanceof URLSearchParams) return new URLSearchParams(value)

  const trimmed = value.trim()
  const queryStart = trimmed.indexOf("?")
  const query = queryStart >= 0 ? trimmed.slice(queryStart + 1) : trimmed
  return new URLSearchParams(query)
}

function readMultiValue(
  params: URLSearchParams,
  key: string,
): string[] {
  return params
    .getAll(key)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean)
}

/** Parse known filter values and safely discard malformed URL facets. */
export function parseFieldFilters(
  value: string | URLSearchParams,
): FieldFilters {
  const params = toSearchParams(value)
  return normalizeFieldFilters({
    query: params.get(FILTER_QUERY_KEYS.query) ?? "",
    entityTypes: readMultiValue(
      params,
      FILTER_QUERY_KEYS.entityType,
    ).filter(isReferenceEntityType),
    scopes: readMultiValue(params, FILTER_QUERY_KEYS.scope).filter(
      isReferenceScope,
    ),
    movementIds: readMultiValue(
      params,
      FILTER_QUERY_KEYS.movement,
    ).filter(isFieldFacetId),
  })
}

/** Serialize filters in a canonical order suitable for a URL query string. */
export function serializeFieldFilters(
  filters: Partial<FieldFilters>,
): string {
  const normalized = normalizeFieldFilters(filters)
  const params = new URLSearchParams()

  if (normalized.query) {
    params.set(FILTER_QUERY_KEYS.query, normalized.query)
  }
  for (const entityType of normalized.entityTypes) {
    params.append(FILTER_QUERY_KEYS.entityType, entityType)
  }
  for (const scope of normalized.scopes) {
    params.append(FILTER_QUERY_KEYS.scope, scope)
  }
  for (const movementId of normalized.movementIds) {
    params.append(FILTER_QUERY_KEYS.movement, movementId)
  }

  return params.toString()
}

function itemSearchText(item: FieldFilterableItem): string {
  const supplemental = Array.isArray(item.searchableText)
    ? item.searchableText
    : item.searchableText
      ? [item.searchableText]
      : []

  return [item.label, ...supplemental].join(" ").toLowerCase()
}

/**
 * Apply Field filters with OR behavior within a facet and AND behavior across
 * facets. Source order is preserved; selection helpers provide canonical order.
 */
export function filterFieldItems<T extends FieldFilterableItem>(
  items: readonly T[],
  filters: Partial<FieldFilters> = EMPTY_FIELD_FILTERS,
  activeLayerIds: readonly FieldLayerId[] = FIELD_LAYER_IDS,
): T[] {
  const normalized = normalizeFieldFilters(filters)
  const activeLayers = new Set(activeLayerIds)
  const entityTypes = new Set(normalized.entityTypes)
  const scopes = new Set(normalized.scopes)
  const movementIds = new Set(normalized.movementIds)
  const queryTerms = normalized.query.toLowerCase().split(" ").filter(Boolean)

  return items.filter((item) => {
    if (!activeLayers.has(item.layerId)) return false
    if (
      entityTypes.size > 0 &&
      (!item.entityType || !entityTypes.has(item.entityType))
    ) {
      return false
    }
    if (scopes.size > 0 && (!item.scope || !scopes.has(item.scope))) {
      return false
    }
    if (
      movementIds.size > 0 &&
      !item.movementIds?.some((movementId) => movementIds.has(movementId))
    ) {
      return false
    }

    if (queryTerms.length > 0) {
      const searchableText = itemSearchText(item)
      if (!queryTerms.every((term) => searchableText.includes(term))) {
        return false
      }
    }

    return true
  })
}

// ---------------------------------------------------------------------------
// Stable selection
// ---------------------------------------------------------------------------

export type FieldSelectableItem = Pick<
  FieldFilterableItem,
  "id" | "layerId" | "label" | "sortKey"
>

export type FieldSelection = {
  layerId: FieldLayerId
  itemId: string
}

export type FieldSelectionKey = `${FieldLayerId}::${string}`
export type FieldSelectionDirection = "next" | "previous"

const layerOrder = new Map<FieldLayerId, number>(
  FIELD_LAYER_IDS.map((layerId, index) => [layerId, index]),
)

export function fieldSelectionKey(
  selection: FieldSelection | FieldSelectableItem,
): FieldSelectionKey {
  const itemId = "id" in selection ? selection.id : selection.itemId
  return `${selection.layerId}::${encodeURIComponent(itemId)}`
}

export function parseFieldSelectionKey(
  value: string | null | undefined,
): FieldSelection | null {
  if (!value) return null
  const separatorIndex = value.indexOf("::")
  if (separatorIndex < 0) return null

  const layerId = value.slice(0, separatorIndex)
  if (!isFieldLayerId(layerId)) return null

  try {
    const itemId = decodeURIComponent(value.slice(separatorIndex + 2))
    return itemId ? { layerId, itemId } : null
  } catch {
    return null
  }
}

/** Select a new item, or clear the drawer when the selected item is chosen again. */
export function toggleFieldSelectionKey(
  current: FieldSelectionKey | null,
  requested: FieldSelectionKey,
): FieldSelectionKey | null {
  return current === requested ? null : requested
}

function compareFieldItems(
  left: FieldSelectableItem,
  right: FieldSelectableItem,
): number {
  const layerDifference =
    (layerOrder.get(left.layerId) ?? Number.MAX_SAFE_INTEGER) -
    (layerOrder.get(right.layerId) ?? Number.MAX_SAFE_INTEGER)
  if (layerDifference !== 0) return layerDifference

  const leftSortKey = (left.sortKey ?? left.label).toLowerCase()
  const rightSortKey = (right.sortKey ?? right.label).toLowerCase()
  const sortKeyDifference = compareStrings(leftSortKey, rightSortKey)
  if (sortKeyDifference !== 0) return sortKeyDifference

  const labelDifference = compareStrings(left.label, right.label)
  if (labelDifference !== 0) return labelDifference
  return compareStrings(left.id, right.id)
}

/** Return one deterministic item per layer-scoped selection key. */
export function getStableFieldItems<T extends FieldSelectableItem>(
  items: readonly T[],
): T[] {
  const sorted = [...items].sort(compareFieldItems)
  const seen = new Set<FieldSelectionKey>()

  return sorted.filter((item) => {
    const key = fieldSelectionKey(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export type FieldListGroup<T extends FieldSelectableItem> = {
  layerId: FieldLayerId
  label: string
  items: T[]
}

/**
 * Build the semantic-list groups from the same stable visible-item set used by
 * keyboard selection. Hidden future layers are never exposed as public groups.
 */
export function getFieldListGroups<T extends FieldSelectableItem>(
  items: readonly T[],
  activeLayerIds: readonly FieldLayerId[],
): FieldListGroup<T>[] {
  const activeLayers = new Set(activeLayerIds)
  const stableItems = getStableFieldItems(items).filter((item) =>
    activeLayers.has(item.layerId),
  )

  return PUBLIC_FIELD_LAYER_CONFIGS.filter((config) =>
    activeLayers.has(config.id),
  ).map((config) => ({
    layerId: config.id,
    label: config.label,
    items: stableItems.filter((item) => item.layerId === config.id),
  }))
}

/** Resolve an exact selection key. Missing or malformed keys return null. */
export function findSelectedFieldItem<T extends FieldSelectableItem>(
  items: readonly T[],
  selectedKey: string | null | undefined,
): T | null {
  const selection = parseFieldSelectionKey(selectedKey)
  if (!selection) return null

  const key = fieldSelectionKey(selection)
  return (
    getStableFieldItems(items).find(
      (item) => fieldSelectionKey(item) === key,
    ) ?? null
  )
}

/** Resolve the selected item, falling back to the stable first visible item. */
export function resolveSelectedFieldItem<T extends FieldSelectableItem>(
  items: readonly T[],
  selectedKey: string | null | undefined,
): T | null {
  const stableItems = getStableFieldItems(items)
  if (stableItems.length === 0) return null

  const selected = findSelectedFieldItem(stableItems, selectedKey)
  return selected ?? stableItems[0]
}

/**
 * Return the next keyboard/list selection in canonical order, wrapping at both
 * ends. If the current selection is absent, next starts first and previous last.
 */
export function getNextFieldItem<T extends FieldSelectableItem>(
  items: readonly T[],
  selectedKey: string | null | undefined,
  direction: FieldSelectionDirection = "next",
): T | null {
  const stableItems = getStableFieldItems(items)
  if (stableItems.length === 0) return null

  const parsedSelection = parseFieldSelectionKey(selectedKey)
  const canonicalSelectedKey = parsedSelection
    ? fieldSelectionKey(parsedSelection)
    : null
  const currentIndex = stableItems.findIndex(
    (item) => fieldSelectionKey(item) === canonicalSelectedKey,
  )
  if (currentIndex < 0) {
    return direction === "next"
      ? stableItems[0]
      : stableItems[stableItems.length - 1]
  }

  const offset = direction === "next" ? 1 : -1
  const nextIndex =
    (currentIndex + offset + stableItems.length) % stableItems.length
  return stableItems[nextIndex]
}

export function getNextFieldSelectionKey<T extends FieldSelectableItem>(
  items: readonly T[],
  selectedKey: string | null | undefined,
  direction: FieldSelectionDirection = "next",
): FieldSelectionKey | null {
  const nextItem = getNextFieldItem(items, selectedKey, direction)
  return nextItem ? fieldSelectionKey(nextItem) : null
}
