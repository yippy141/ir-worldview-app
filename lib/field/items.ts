import {
  atlasLitePatterns,
  getAtlasPatternHref,
  type AtlasFingerprintKey,
  type AtlasFingerprintLevel,
  type AtlasLitePattern,
} from "@/lib/atlas-lite"
import type { FieldFilterableItem, FieldLayerId } from "@/lib/field/layers"
import {
  ARCHETYPE_MATRIX_CELLS,
  resolveWorldviewMapBaseline,
} from "@/lib/field/archetype-matrix"
import { toMapPosition, type MapPosition } from "@/lib/field/position"
import type { PerspectiveRunSnapshot } from "@/lib/perspectives/types"
import type { FoundationSnapshot } from "@/lib/profile-store"
import { REFERENCE_PROFILE_CATALOG } from "@/lib/reference-profiles/catalog"
import type {
  ReferenceCatalog,
  ReferenceEntity,
  ReferenceEntityType,
  ReferenceMovement,
  ReferenceProfile,
} from "@/lib/reference-profiles/types"
import {
  getReferenceProfilePosition,
  isReferenceProfilePublishable,
  validateReferenceCatalog,
} from "@/lib/reference-profiles/validation"
import { FAMILY_LABELS, traditionNounLabel } from "@/lib/worldview-config"
import { chineseShellContent } from "@/content/locales/zh-Hans"
import { zhHansReferenceProfilesUi } from "@/content/locales/zh-Hans/reference-profiles-ui"
import { zhHansWorldviewMapUi } from "@/content/locales/zh-Hans/worldview-map"
import { zhHansWorldviewProfileById } from "@/content/locales/zh-Hans/worldview-profiles"
import { formatLocalizedDate } from "@/i18n/format"
import { internalPath } from "@/i18n/paths"
import type { Locale } from "@/i18n/routing"
import type { DimensionScores, FamilyKey } from "@/lib/types"

// ---------------------------------------------------------------------------
// Field items
// ---------------------------------------------------------------------------
//
// The Field Explorer renders one item model across every layer. Items are
// UI-independent: each carries the facets the shared filter helpers understand
// plus the map position computed through the one canonical projection.

export type FieldItemKind =
  | "baseline"
  | "perspective-run"
  | "atlas-pattern"
  | "reference-profile"
  | "reference-movement"

export type FieldItem = FieldFilterableItem & {
  kind: FieldItemKind
  /** Null when the item is list-only (AI-governance scope, sparse evidence). */
  position: MapPosition | null
  summary: string
  href: string
  /** Compact factual line rendered in monospace (dates, versions). */
  metaLine?: string
  familyKey?: FamilyKey
  reviewedAt?: string
  /** True for entries that have not passed independent editorial review. */
  draft?: boolean
  /** Set for reference movements so the hull can be drawn from members. */
  memberProfileIds?: readonly string[]
}

// ---------------------------------------------------------------------------
// My profile
// ---------------------------------------------------------------------------

export function buildBaselineFieldItem(
  foundation: FoundationSnapshot | null,
  locale: Locale = "en",
): FieldItem | null {
  if (!foundation) return null
  const baseline = resolveWorldviewMapBaseline(foundation)
  if (!baseline) return null
  const leadingCell = ARCHETYPE_MATRIX_CELLS.find(
    ({ archetypeCode }) => archetypeCode === baseline.leadingPureCode,
  )
  if (!leadingCell) return null

  const zh = locale === "zh-Hans"
  const familyKey = leadingCell.archetype.familyKey
  const familyLabel = zh
    ? zhHansWorldviewMapUi.filters.families[familyKey]
    : traditionNounLabel(familyKey)

  return {
    id: "my-baseline",
    layerId: "my-profile",
    kind: "baseline",
    label: zh ? zhHansWorldviewMapUi.fieldItems.myBaseline : "My baseline",
    sortKey: "0-my-baseline",
    searchableText: ["baseline", familyLabel],
    position: {
      x: baseline.continuousProjection.x,
      y: baseline.continuousProjection.y,
    },
    summary: zh
      ? zhHansWorldviewMapUi.fieldItems.baselineSummary(familyLabel)
      : `Foundation baseline · closest to ${familyLabel}.`,
    href: internalPath(foundation.resultPath),
    metaLine: formatFieldDate(foundation.timestamp, locale),
    familyKey,
  }
}

// ---------------------------------------------------------------------------
// Perspective runs
// ---------------------------------------------------------------------------

export function buildPerspectiveRunFieldItems(
  runs: readonly PerspectiveRunSnapshot[],
  locale: Locale = "en",
): FieldItem[] {
  const zh = locale === "zh-Hans"
  return runs.map((run) => {
    const localizedLabel =
      zh && run.perspectiveId in chineseShellContent.profileShare.perspectiveLabels
        ? chineseShellContent.profileShare.perspectiveLabels[
            run.perspectiveId as keyof typeof chineseShellContent.profileShare.perspectiveLabels
          ]
        : null
    const label = zh
      ? localizedLabel ?? zhHansWorldviewMapUi.key.perspectiveShift
      : run.perspectiveLabel

    return {
      id: run.id,
      layerId: "perspective-runs" as FieldLayerId,
      kind: "perspective-run" as const,
      label,
      sortKey: `${label}-${run.timestamp}`,
      searchableText: zh
        ? ["情境变化", label]
        : ["perspective run", run.perspectiveLabel],
      position: toMapPosition(run.dimensionScores),
      summary: zh
        ? zhHansWorldviewMapUi.fieldItems.perspectiveSummary
        : "Contextual shift recorded beside the Foundation baseline.",
      href: internalPath(run.resultPath),
      metaLine: formatFieldDate(run.timestamp, locale),
    }
  })
}

/** Keep the latest run per pack — the map plots one dot per vantage point. */
export function latestRunPerPerspective(
  runs: readonly PerspectiveRunSnapshot[],
): PerspectiveRunSnapshot[] {
  const latest = new Map<string, PerspectiveRunSnapshot>()
  for (const run of runs) {
    const current = latest.get(run.perspectiveId)
    if (!current || run.timestamp > current.timestamp) {
      latest.set(run.perspectiveId, run)
    }
  }
  return [...latest.values()]
}

// ---------------------------------------------------------------------------
// Atlas patterns
// ---------------------------------------------------------------------------
//
// Atlas patterns are authored as five-key fingerprints, so the field position
// runs a documented editorial mapping onto the seven dimensions and then
// through the same projection as every other layer. Unmapped dimensions stay
// at the neutral midpoint.

const FINGERPRINT_DIMENSION: Record<AtlasFingerprintKey, keyof DimensionScores> = {
  competition: "securityCompetition",
  institutions: "institutions",
  legitimacy: "normsIdentity",
  politicalEconomy: "politicalEconomy",
  restraint: "restraint",
}

const FINGERPRINT_LEVEL_SCORE: Record<AtlasFingerprintLevel, number> = {
  low: 2.5,
  medium: 4,
  high: 5.5,
}

export function atlasFingerprintToDimensionScores(
  pattern: AtlasLitePattern,
): DimensionScores {
  const scores: DimensionScores = {
    securityCompetition: 4,
    institutions: 4,
    domesticFilters: 4,
    normsIdentity: 4,
    politicalEconomy: 4,
    restraint: 4,
    orderJustice: 4,
  }

  for (const [fingerprintKey, dimension] of Object.entries(FINGERPRINT_DIMENSION) as [
    AtlasFingerprintKey,
    keyof DimensionScores,
  ][]) {
    scores[dimension] = FINGERPRINT_LEVEL_SCORE[pattern.fingerprint[fingerprintKey]]
  }

  return scores
}

export function buildAtlasPatternFieldItems(locale: Locale = "en"): FieldItem[] {
  const zh = locale === "zh-Hans"
  return atlasLitePatterns.flatMap((pattern) => {
    const localized = zh ? zhHansWorldviewProfileById[pattern.id] : undefined
    if (zh && !localized) return []

    const label = zh ? localized!.publicName : pattern.publicName
    const summary = zh ? localized!.cardSummary : pattern.cardSummary

    return [{
      id: pattern.id,
      layerId: "atlas-patterns" as FieldLayerId,
      kind: "atlas-pattern" as const,
      label,
      sortKey: label,
      searchableText: zh
        ? ["决策模式", label, summary]
        : [
            "decision pattern",
            pattern.technicalDescriptor,
            pattern.cardSummary,
            FAMILY_LABELS[pattern.primaryFamily],
          ],
      position: toMapPosition(atlasFingerprintToDimensionScores(pattern)),
      summary,
      href: getAtlasPatternHref(pattern.id),
      familyKey: pattern.primaryFamily,
    }]
  })
}

// ---------------------------------------------------------------------------
// Reference profiles
// ---------------------------------------------------------------------------

/**
 * Demo fixtures never reach catalog views. Internal-review entries are opt-in
 * outside production; published catalogs surface only validated, publishable
 * records. This prevents a status-label mistake from exposing draft research.
 */
export type ReferenceVisibilityOptions = {
  includeInternalReview?: boolean
}

export function getVisibleReferenceEntities(
  catalog: ReferenceCatalog = REFERENCE_PROFILE_CATALOG,
  options: ReferenceVisibilityOptions = {},
): ReferenceEntity[] {
  if (!validateReferenceCatalog(catalog).ok) return []
  if (catalog.dataStatus === "non-public-demo") return []

  const entities: ReferenceEntity[] = [...catalog.profiles, ...catalog.movements]
  if (catalog.dataStatus === "public") {
    return entities.filter((entity) =>
      isMovement(entity) ? entity.public && entity.publicationStatus === "published" : isReferenceProfilePublishable(entity),
    )
  }

  const includeInternalReview =
    options.includeInternalReview ?? process.env.NODE_ENV !== "production"
  if (!includeInternalReview) return []

  return entities.filter((entity) => entity.publicationStatus !== "withdrawn")
}

export function isReferenceEntityDraft(entity: ReferenceEntity): boolean {
  if (isMovement(entity)) {
    return !(entity.public && entity.publicationStatus === "published")
  }
  return !isReferenceProfilePublishable(entity)
}

export function getVisibleReferenceEntityById(
  id: string,
  catalog: ReferenceCatalog = REFERENCE_PROFILE_CATALOG,
  options: ReferenceVisibilityOptions = {},
): ReferenceEntity | null {
  return (
    getVisibleReferenceEntities(catalog, options).find((entity) => entity.id === id) ?? null
  )
}

function isMovement(entity: ReferenceEntity): entity is ReferenceMovement {
  return entity.entityType === "movement"
}

const ENTITY_TYPE_LABELS: Record<ReferenceEntityType, string> = {
  thinker: "Thinker",
  leader: "Leader",
  government: "Government",
  movement: "Movement",
  institution: "Institution",
  doctrine: "Doctrine",
  "ai-current": "AI current",
}

export function referenceEntityTypeLabel(
  entityType: ReferenceEntityType,
  locale: Locale = "en",
): string {
  return locale === "zh-Hans"
    ? zhHansReferenceProfilesUi.entityTypes[entityType]
    : ENTITY_TYPE_LABELS[entityType]
}

export function buildReferenceFieldItems(
  catalog: ReferenceCatalog = REFERENCE_PROFILE_CATALOG,
  options: ReferenceVisibilityOptions = {},
  locale: Locale = "en",
): FieldItem[] {
  const entities = getVisibleReferenceEntities(catalog, options)
  const profileById = new Map(
    catalog.profiles.map((profile) => [profile.id, profile]),
  )

  return entities.map((entity) => {
    if (isMovement(entity)) {
      return {
        id: entity.id,
        layerId: "reference-profiles" as FieldLayerId,
        kind: "reference-movement" as const,
        label: entity.name,
        sortKey: entity.name,
        searchableText: ["movement", entity.scopeNote],
        entityType: entity.entityType,
        scope: entity.scope,
        position: null,
        summary: locale === "zh-Hans"
          ? zhHansReferenceProfilesUi.metadata.detailDescription(entity.name)
          : entity.scopeNote,
        href: `/explore/reference/${entity.id}`,
        metaLine: `${referenceDateLabel(entity, locale)} ${formatFieldDateString(entity.reviewedAt, locale)}`,
        reviewedAt: entity.reviewedAt,
        draft: isReferenceEntityDraft(entity),
        memberProfileIds: entity.memberProfileIds,
        movementIds: [entity.id],
      }
    }

    const profile = entity as ReferenceProfile
    return {
      id: profile.id,
      layerId: "reference-profiles" as FieldLayerId,
      kind: "reference-profile" as const,
      label: profile.name,
      sortKey: profile.shortName,
      searchableText: [
        referenceEntityTypeLabel(profile.entityType, locale),
        profile.domain,
        profile.summary,
      ],
      entityType: profile.entityType,
      scope: profile.scope,
      position: getReferenceProfilePosition(profile),
      summary: locale === "zh-Hans"
        ? zhHansReferenceProfilesUi.metadata.detailDescription(profile.name)
        : profile.summary,
      href: `/explore/reference/${profile.id}`,
      metaLine: `${referenceDateLabel(profile, locale)} ${formatFieldDateString(profile.reviewedAt, locale)}`,
      reviewedAt: profile.reviewedAt,
      draft: isReferenceEntityDraft(profile),
      movementIds: catalog.movements
        .filter((movement) => movement.memberProfileIds.includes(profile.id))
        .map((movement) => movement.id),
    }
  })
}

function referenceDateLabel(entity: ReferenceEntity, locale: Locale): string {
  if (locale === "zh-Hans") {
    return isReferenceEntityDraft(entity)
      ? zhHansWorldviewMapUi.fieldItems.researchDated
      : zhHansWorldviewMapUi.fieldItems.reviewed
  }
  return isReferenceEntityDraft(entity) ? "Research dated" : "Reviewed"
}

/** Positions for a movement hull, computed from its mappable members. */
export function getMovementMemberPositions(
  movement: ReferenceMovement,
  catalog: ReferenceCatalog = REFERENCE_PROFILE_CATALOG,
): MapPosition[] {
  return movement.memberProfileIds
    .map((memberId) => catalog.profiles.find((profile) => profile.id === memberId))
    .filter((profile): profile is ReferenceProfile => Boolean(profile))
    .map((profile) => getReferenceProfilePosition(profile))
    .filter((position): position is MapPosition => position !== null)
}

// ---------------------------------------------------------------------------
// Extended facets: family and review date
// ---------------------------------------------------------------------------
//
// These two facets extend the shared filter helpers without changing their
// contract. Baseline items bypass narrowing facets: the layer rules promise
// the user position stays visible whenever the My profile layer is active.

export type ExtendedFieldFilters = {
  familyKeys?: readonly FamilyKey[]
  reviewedWithinMonths?: number | null
}

export function applyExtendedFieldFilters<T extends FieldItem>(
  items: readonly T[],
  filters: ExtendedFieldFilters,
  now: number = Date.now(),
): T[] {
  const familyKeys = new Set(filters.familyKeys ?? [])
  const months = filters.reviewedWithinMonths ?? null

  return items.filter((item) => {
    if (item.kind === "baseline") return true

    if (familyKeys.size > 0 && (!item.familyKey || !familyKeys.has(item.familyKey))) {
      return false
    }

    if (months !== null) {
      if (!item.reviewedAt) return false
      const reviewed = Date.parse(item.reviewedAt)
      if (!Number.isFinite(reviewed)) return false
      const windowStart = new Date(now)
      windowStart.setMonth(windowStart.getMonth() - months)
      if (reviewed < windowStart.getTime()) return false
    }

    return true
  })
}

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

const FIELD_DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

export function formatFieldDate(timestamp: number, locale: Locale = "en"): string {
  const date = new Date(timestamp)
  if (!Number.isFinite(date.getTime())) return locale === "zh-Hans" ? "日期未知" : "Unknown date"
  return locale === "zh-Hans"
    ? formatLocalizedDate(timestamp, locale, "medium")
    : FIELD_DATE_FORMAT.format(date)
}

export function formatFieldDateString(isoDate: string, locale: Locale = "en"): string {
  const parsed = Date.parse(isoDate)
  if (!Number.isFinite(parsed)) return isoDate
  return locale === "zh-Hans"
    ? formatLocalizedDate(isoDate, locale, "medium")
    : FIELD_DATE_FORMAT.format(new Date(parsed))
}
