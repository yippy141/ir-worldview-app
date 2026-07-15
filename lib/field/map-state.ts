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
export type WorldviewMapReviewWindow = "" | "12" | "24"

export type ParsedWorldviewMapQuery = {
  filters: FieldFilters
  layerParam: string | null
  familyKeys: FamilyKey[]
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

export const WORLDVIEW_MAP_FAMILY_KEYS = Object.keys(FAMILY_LABELS) as FamilyKey[]

function toSearchParams(value: string | URLSearchParams): URLSearchParams {
  if (value instanceof URLSearchParams) return new URLSearchParams(value)
  const trimmed = value.trim()
  const queryStart = trimmed.indexOf("?")
  return new URLSearchParams(queryStart >= 0 ? trimmed.slice(queryStart + 1) : trimmed)
}

/** Decode the complete shareable workspace state from one URL source. */
export function parseWorldviewMapQuery(
  value: string | URLSearchParams,
): ParsedWorldviewMapQuery {
  const params = toSearchParams(value)
  const parsedSelection = parseFieldSelectionKey(params.get("sel"))
  const reviewed = params.get("reviewed")

  return {
    filters: parseFieldFilters(params),
    layerParam: params.get("layers"),
    familyKeys: WORLDVIEW_MAP_FAMILY_KEYS.filter((familyKey) =>
      params.getAll("family").some((value) => value === familyKey),
    ),
    reviewedWithin: reviewed === "12" || reviewed === "24" ? reviewed : "",
    selectedKey: parsedSelection ? fieldSelectionKey(parsedSelection) : null,
    view: params.get("view") === "map" ? "map" : "list",
  }
}

/** Encode the complete workspace state without changing legacy query keys. */
export function serializeWorldviewMapQuery(
  state: SerializableWorldviewMapState,
  availability: FieldLayerAvailability = {},
): string {
  const params = new URLSearchParams(serializeFieldFilters(state.filters))
  params.set(
    "layers",
    serializeFieldLayerIds(state.activeLayerIds, availability),
  )

  for (const familyKey of WORLDVIEW_MAP_FAMILY_KEYS) {
    if (state.familyKeys.includes(familyKey)) {
      params.append("family", familyKey)
    }
  }
  if (state.reviewedWithin) params.set("reviewed", state.reviewedWithin)
  if (state.selectedKey) params.set("sel", state.selectedKey)
  if (state.view === "map") params.set("view", "map")

  return params.toString()
}
