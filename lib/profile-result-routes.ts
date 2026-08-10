import { internalPath, publicPath } from "@/i18n/paths"
import type { Locale } from "@/i18n/routing"

export type ProfileResultSurface =
  | "foundation"
  | "module"
  | "ai"
  | "perspective"

export type ProfileResultRoute =
  | { availability: "translated"; href: string }
  | { availability: "english-only"; href: string }

const RESULT_ROUTE_AVAILABILITY: Record<
  ProfileResultSurface,
  ProfileResultRoute["availability"]
> = {
  foundation: "translated",
  module: "english-only",
  ai: "english-only",
  perspective: "english-only",
}

/**
 * Profile snapshots may have been hydrated with a public locale prefix.
 * Link renderers consume the locale-neutral route and then apply the explicit
 * availability contract below.
 */
export function getProfileResultRoute(
  surface: ProfileResultSurface,
  resultPath: string,
): ProfileResultRoute {
  return {
    availability: RESULT_ROUTE_AVAILABILITY[surface],
    href: internalPath(resultPath),
  }
}

export function getProfileResultHref(
  route: ProfileResultRoute,
  locale: Locale,
): string {
  return route.availability === "translated"
    ? publicPath(locale, route.href)
    : route.href
}
