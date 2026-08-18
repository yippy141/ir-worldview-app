import {
  fieldSelectionKey,
  parseFieldFilters,
  parseFieldSelectionKey,
  serializeFieldFilters,
  serializeFieldLayerIds,
  type FieldFilters,
  type FieldLayerAvailability,
  type FieldLayerId,
  type FieldSelectionKey,
} from "@/lib/field/layers"
import type { FamilyKey } from "@/lib/types"
import { FAMILY_LABELS } from "@/lib/worldview-config"

export type WorldviewMapView = "list" | "map"
export type WorldviewMapProjection = "matrix" | "continuous"
export type WorldviewMapReviewWindow = "" | "12" | "24"

export type ParsedWorldviewMapQuery = {
  filters: FieldFilters
  layerParam: string | null
  familyKeys: FamilyKey[]
  projection: WorldviewMapProjection
  reviewedWithin: WorldviewMapReviewWindow
  selectedKey: FieldSelectionKey | null
  view: WorldviewMapView
}

export type SerializableWorldviewMapState = Omit<
  ParsedWorldviewMapQuery,
  "layerParam"
> & {
  activeLayerIds: readonly FieldLayerId[]
}

export type WorldviewMapQuerySerializationOptions = Readonly<{
  /** Omit the legacy layer key when serializing the matrix's default state. */
  includeLayerParam?: boolean
  /** Omit the responsive list/map preference from the matrix's bare route. */
  includeViewParam?: boolean
}>

export const WORLDVIEW_MAP_FAMILY_KEYS = Object.keys(FAMILY_LABELS) as FamilyKey[]

function toSearchParams(value: string | URLSearchParams): URLSearchParams {
  if (value instanceof URLSearchParams) return new URLSearchParams(value)
  const trimmed = value.trim()
  const queryStart = trimmed.indexOf("?")
  return new URLSearchParams(queryStart >= 0 ? trimmed.slice(queryStart + 1) : trimmed)
}

function parseWorldviewMapProjection(
  params: URLSearchParams,
): WorldviewMapProjection {
  const explicitProjection = params.get("projection")
  if (
    explicitProjection === "matrix" ||
    explicitProjection === "continuous"
  ) {
    return explicitProjection
  }

  // Only links issued before the projection key existed receive compatibility
  // behavior. A present but invalid value fails closed to the current matrix.
  if (explicitProjection !== null) return "matrix"
  return params.has("layers") || params.has("sel")
    ? "continuous"
    : "matrix"
}

/** Decode the complete shareable workspace state from one URL source. */
export function parseWorldviewMapQuery(
  value: string | URLSearchParams,
): ParsedWorldviewMapQuery {
  const params = toSearchParams(value)
  const parsedSelection = parseFieldSelectionKey(params.get("sel"))
  const reviewed = params.get("reviewed")
  const projection = parseWorldviewMapProjection(params)
  const requestedView = params.get("view")

  return {
    filters: parseFieldFilters(params),
    layerParam: params.get("layers"),
    familyKeys: WORLDVIEW_MAP_FAMILY_KEYS.filter((familyKey) =>
      params.getAll("family").some((value) => value === familyKey),
    ),
    projection,
    reviewedWithin: reviewed === "12" || reviewed === "24" ? reviewed : "",
    selectedKey: parsedSelection ? fieldSelectionKey(parsedSelection) : null,
    view:
      requestedView === "map" || requestedView === "list"
        ? requestedView
        : projection === "matrix"
          ? "map"
          : "list",
  }
}

/** Encode the complete workspace state without changing legacy query keys. */
export function serializeWorldviewMapQuery(
  state: SerializableWorldviewMapState,
  availability: FieldLayerAvailability = {},
  options: WorldviewMapQuerySerializationOptions = {},
): string {
  const params = new URLSearchParams(serializeFieldFilters(state.filters))
  const includeLayerParam = options.includeLayerParam ?? true
  const includeViewParam = options.includeViewParam ?? true
  const defaultView = state.projection === "matrix" ? "map" : "list"
  const viewChanged = includeViewParam && state.view !== defaultView
  const needsExplicitProjection =
    state.projection === "continuous" ||
    includeLayerParam ||
    state.selectedKey !== null ||
    viewChanged

  if (needsExplicitProjection) params.set("projection", state.projection)
  if (includeLayerParam) {
    params.set(
      "layers",
      serializeFieldLayerIds(state.activeLayerIds, availability),
    )
  }

  for (const familyKey of WORLDVIEW_MAP_FAMILY_KEYS) {
    if (state.familyKeys.includes(familyKey)) {
      params.append("family", familyKey)
    }
  }
  if (state.reviewedWithin) params.set("reviewed", state.reviewedWithin)
  if (state.selectedKey) params.set("sel", state.selectedKey)
  if (viewChanged) {
    params.set("view", state.view)
  }

  return params.toString()
}
