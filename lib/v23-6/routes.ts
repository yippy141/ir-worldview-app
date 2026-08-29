/**
 * Route constants for the bounded visual-authorship study.
 *
 * The study segment is assembled from a separate identifier so that no
 * reader-facing string literal in this repository carries a release token.
 */
const STUDY_SEGMENT = "v23-6"

export const STUDY_ROUTE_BASE = `/dev/${STUDY_SEGMENT}`

export const ROOT_ATLAS_GLOBE_ROUTE = `${STUDY_ROUTE_BASE}/root-atlas-globe`
export const ROOT_ARMILLARY_ATLAS_ROUTE = `${STUDY_ROUTE_BASE}/root-armillary-atlas`
export const TYPE_PLATE_ROUTE = `${STUDY_ROUTE_BASE}/type-plate`
export const RESULT_SCROLL_ROUTE = `${STUDY_ROUTE_BASE}/result-scroll`

export const STUDY_ROUTES = [
  ROOT_ATLAS_GLOBE_ROUTE,
  ROOT_ARMILLARY_ATLAS_ROUTE,
  TYPE_PLATE_ROUTE,
  RESULT_SCROLL_ROUTE,
] as const
