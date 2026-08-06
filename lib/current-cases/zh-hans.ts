import type { ZhHansCurrentCaseRecord } from "@/content/locales/zh-Hans/types"
import type { CurrentCasePublicRecord } from "@/lib/current-cases/presentation"

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
