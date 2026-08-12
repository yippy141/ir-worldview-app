import {
  currentCaseCatalog,
  getActivePublishedLaunchCurrentCase,
} from "@/lib/current-cases/catalog"
import type { CurrentCasePublicationValidationOptions } from "@/lib/current-cases/validation"

type CurrentCaseRouteLocale = "en" | "zh-Hans"

export function getCurrentCaseDestination(
  locale: CurrentCaseRouteLocale,
  catalog: readonly unknown[] = currentCaseCatalog,
  options: Pick<CurrentCasePublicationValidationOptions, "referenceDate"> = {},
) {
  const localePrefix = locale === "zh-Hans" ? "/zh" : ""
  const active = getActivePublishedLaunchCurrentCase(catalog, options)
  return active ? `${localePrefix}/cases/${active.slug}` : `${localePrefix}/cases`
}
