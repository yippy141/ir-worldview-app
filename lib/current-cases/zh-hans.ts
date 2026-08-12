import {
  zhHansCurrentCaseById,
} from "@/content/locales/zh-Hans/current-cases/index"
import type { ZhHansCurrentCaseRecord } from "@/content/locales/zh-Hans/types"
import {
  currentCaseCatalog,
  getPublishedCurrentCases,
} from "@/lib/current-cases/catalog"
import type { CurrentCasePublicRecord } from "@/lib/current-cases/presentation"
import type { CurrentCase } from "@/lib/current-cases/types"

/**
 * The canonical catalog controls publication in every locale. Chinese copy is
 * joined only after validation, by stable case ID, so a fail-closed canonical
 * catalog cannot leave a different Chinese set visible.
 */
export function getPublishedZhHansCurrentCases(
  catalog: readonly unknown[] = currentCaseCatalog,
): ZhHansCurrentCaseRecord[] {
  return localizePublishedCurrentCases(getPublishedCurrentCases(catalog))
}

export function localizePublishedCurrentCases(
  canonicalCases: readonly CurrentCase[],
): ZhHansCurrentCaseRecord[] {
  return canonicalCases.map((canonical) => {
    const localized = zhHansCurrentCaseById[canonical.id]
    if (!localized) {
      throw new Error(`Missing zh-Hans Current Case localization for ${canonical.id}.`)
    }
    return localized
  })
}

export function getPublishedZhHansCurrentCaseBySlug(
  slug: string,
  catalog: readonly unknown[] = currentCaseCatalog,
) {
  return (
    getPublishedZhHansCurrentCases(catalog).find(
      (record) => record.slug === slug,
    ) ?? null
  )
}

export function toZhHansCurrentCasePublicRecord(
  record: ZhHansCurrentCaseRecord,
): CurrentCasePublicRecord {
  return {
    schemaVersion: record.schemaVersion,
    id: record.id,
    slug: record.slug,
    version: record.version,
    publicationStatus: record.publicationStatus,
    launchRole: record.launchRole,
    title: record.title,
    dek: record.dek,
    category: record.category,
    publishedAt: record.publishedAt,
    updatedAt: record.updatedAt,
    asOf: record.asOf,
    reviewDueAt: record.reviewDueAt,
    freshnessStatus: record.freshnessStatus,
    cadence: record.cadence,
    evidenceWindow: { ...record.evidenceWindow },
    briefing: record.briefing,
    actors: record.actors.map((actor) => actor.display),
    perspectives: {
      global: record.perspectives.global,
      counterparties: record.perspectives.counterparties.map((entry) => ({
        actor: entry.actor.display,
        perspective: entry.perspective,
      })),
    },
    factualClaims: record.factualClaims.map((claim) => ({ ...claim })),
    knownUncertainties: [...record.knownUncertainties],
    reasoningTags: record.reasoningTags.map((tag) => ({ ...tag })),
    decision: {
      prompt: record.decision.prompt,
      options: record.decision.options.map((option) => ({ ...option })),
    },
    worldviewReadings: record.worldviewReadings.map((reading) => ({
      ...reading,
      recommendedOptionIds: [...reading.recommendedOptionIds],
    })),
    assumptionChallenge: {
      newInformation: record.assumptionChallenge.newInformation,
      prompt: record.assumptionChallenge.prompt,
      options: record.assumptionChallenge.options.map((option) => ({ ...option })),
    },
    nextRoutes: record.nextRoutes.map((route) => ({ ...route })),
    sources: record.sources.map((source) => ({
      id: source.id,
      title: source.displayTitle,
      publisher: source.publisher,
      publishedAt: source.publishedAt,
      accessedAt: source.accessedAt,
      url: source.url,
      kind: source.kind,
      claimIds: [...source.claimIds],
    })),
  }
}
