import europeMissileDefence from "@/content/current-cases/europe-missile-defence-coalition-ukraine.json" with {
  type: "json",
}
import southChinaSeaAward from "@/content/current-cases/south-china-sea-award-at-ten.json" with {
  type: "json",
}
import usBrazilTariffs from "@/content/current-cases/us-brazil-section-301-tariffs.json" with {
  type: "json",
}
import type { CurrentCase, CurrentCaseSource } from "@/lib/current-cases/types"
import {
  getEffectiveCurrentCaseFreshnessStatus,
  validateCurrentCaseForPublication,
  type CurrentCasePublicationValidationOptions,
  type CurrentCaseValidationError,
} from "@/lib/current-cases/validation"

export const CURRENT_CASE_CATALOG_STATUS = "approved-research-pack" as const

export const currentCaseCatalog: readonly CurrentCase[] = [
  europeMissileDefence,
  usBrazilTariffs,
  southChinaSeaAward,
] as readonly CurrentCase[]

export type CurrentCaseCatalogValidationResult =
  | { ok: true; errors: readonly [] }
  | {
      ok: false
      errors: ReadonlyArray<
        CurrentCaseValidationError & { caseId: string; caseIndex: number }
      >
    }

export function validateCurrentCaseCatalogForPublication(
  catalog: readonly unknown[] = currentCaseCatalog,
  options: CurrentCasePublicationValidationOptions = {},
): CurrentCaseCatalogValidationResult {
  const errors: Array<
    CurrentCaseValidationError & { caseId: string; caseIndex: number }
  > = []
  const ids = new Set<string>()
  const slugs = new Set<string>()
  let launchCount = 0

  catalog.forEach((record, caseIndex) => {
    const candidate = record as Partial<CurrentCase>
    const caseId = typeof candidate?.id === "string" ? candidate.id : `case-${caseIndex}`

    if (candidate.publicationStatus !== "published") return

    if (candidate.launchRole === "launch") launchCount += 1
    const result = validateCurrentCaseForPublication(record, options)
    if (!result.ok) {
      for (const error of result.errors) {
        errors.push({ ...error, caseId, caseIndex })
      }
    }

    if (typeof candidate.id === "string") {
      if (ids.has(candidate.id)) {
        errors.push({
          code: "field.invalid",
          path: "id",
          message: "Published case IDs must be unique in the active catalog.",
          caseId,
          caseIndex,
        })
      }
      ids.add(candidate.id)
    }
    if (typeof candidate.slug === "string") {
      if (slugs.has(candidate.slug)) {
        errors.push({
          code: "field.invalid",
          path: "slug",
          message: "Published case slugs must be unique in the active catalog.",
          caseId,
          caseIndex,
        })
      }
      slugs.add(candidate.slug)
    }
  })

  if (launchCount > 1) {
    errors.push({
      code: "field.invalid",
      path: "launchRole",
      message: "A published catalog may contain at most one launch case.",
      caseId: "catalog",
      caseIndex: -1,
    })
  }

  return errors.length === 0 ? { ok: true, errors: [] } : { ok: false, errors }
}

export function getPublishedCurrentCases(
  catalog: readonly unknown[] = currentCaseCatalog,
): CurrentCase[] {
  const catalogValidation = validateCurrentCaseCatalogForPublication(
    catalog,
    getCompatibilityValidationOptions(catalog),
  )
  if (!catalogValidation.ok) return []

  return catalog
    .filter((record): record is CurrentCase => {
      const candidate = record as Partial<CurrentCase>
      return candidate.publicationStatus === "published"
    })
    .sort(comparePublishedCases)
}

export function getPublishedCurrentCaseBySlug(
  slug: string,
  catalog: readonly unknown[] = currentCaseCatalog,
) {
  return getPublishedCurrentCases(catalog).find((record) => record.slug === slug) ?? null
}

export function getPublishedCurrentCaseById(
  caseId: string,
  catalog: readonly unknown[] = currentCaseCatalog,
) {
  return getPublishedCurrentCases(catalog).find((record) => record.id === caseId) ?? null
}

export function getLatestPublishedCurrentCase(
  catalog: readonly unknown[] = currentCaseCatalog,
  options: Pick<CurrentCasePublicationValidationOptions, "referenceDate"> = {},
) {
  return getActivePublishedLaunchCurrentCase(catalog, options)
}

export function getActivePublishedLaunchCurrentCase(
  catalog: readonly unknown[] = currentCaseCatalog,
  options: Pick<CurrentCasePublicationValidationOptions, "referenceDate"> = {},
) {
  const published = getPublishedCurrentCases(catalog)
  const launch =
    published.find(
      (record) =>
        record.launchRole === "launch" && record.freshnessStatus === "active",
    ) ?? null
  if (!launch) return null

  const referenceDate = options.referenceDate ?? new Date()
  if (
    getEffectiveCurrentCaseFreshnessStatus(launch, referenceDate) !== "active"
  ) {
    return null
  }

  return validateCurrentCaseForPublication(launch, { referenceDate }).ok
    ? launch
    : null
}

export function getSourcesForCurrentCaseClaim(
  record: CurrentCase,
  claimId: string,
): CurrentCaseSource[] {
  return record.sources.filter((source) => source.claimIds.includes(claimId))
}

function comparePublishedCases(left: CurrentCase, right: CurrentCase) {
  const launchOrder = Number(right.launchRole === "launch") - Number(left.launchRole === "launch")
  if (launchOrder) return launchOrder
  const dateOrder = (right.publishedAt ?? "").localeCompare(left.publishedAt ?? "")
  return dateOrder || right.version - left.version
}

const shippedCatalogValidation = validateCurrentCaseCatalogForPublication(
  currentCaseCatalog,
  getCompatibilityValidationOptions(currentCaseCatalog),
)

if (!shippedCatalogValidation.ok) {
  throw new Error(
    `Invalid published Current Case catalog: ${JSON.stringify(shippedCatalogValidation.errors)}`,
  )
}

/**
 * A record remains readable after its active window closes. Compatibility
 * rendering therefore validates an authored launch on its inclusive deadline;
 * active selection validates it again against the requested UTC day.
 */
function getCompatibilityValidationOptions(
  catalog: readonly unknown[],
): Pick<CurrentCasePublicationValidationOptions, "referenceDate"> {
  const launch = catalog.find((record) => {
    const candidate = record as Partial<CurrentCase>
    return (
      candidate.publicationStatus === "published" &&
      candidate.launchRole === "launch"
    )
  }) as Partial<CurrentCase> | undefined

  return typeof launch?.reviewDueAt === "string"
    ? { referenceDate: launch.reviewDueAt }
    : {}
}
