import { draftEpisodes, type Episode, type EpisodeId } from "@/lib/decision-exercises/content"

/** Explicit publication selection. Owner merge authorizes these two English records only. */
export const decisionPublications = [
  { id: "verify", slug: "who-gets-to-verify", version: 3, locale: "en", status: "published" },
  { id: "access", slug: "who-gets-access", version: 3, locale: "en", status: "published" },
] as const

const sources: Record<EpisodeId, Episode["sources"]> = {
  verify: [{
    ...draftEpisodes.verify.sources[0],
    publisher: "Ronald Reagan Presidential Library and Museum, National Archives",
    publishedAt: "1987-12-08", accessedAt: "2026-09-07",
    url: "https://www.reaganlibrary.gov/archives/speech/treaty-between-united-states-america-and-union-soviet-socialist-republics",
    locator: "Article IX (data and notifications); Article XI, paragraphs 1–3 (reciprocal on-site rights and baseline checks); Protocol on Inspection",
    scope: "Historical mechanisms for exchanging declared data and checking treaty obligations through on-site inspections. This hardware treaty does not establish the feasibility of the fictional AI monitoring scheme. Its technical reach, timing and refusal rules are supplied assumptions.",
  }, draftEpisodes.verify.sources[1]],
  access: [{
    ...draftEpisodes.access.sources[0], publishedAt: "2023-09-29", accessedAt: "2026-09-07",
    url: "https://cdn.governance.ai/Open-Sourcing_Highly_Capable_Foundation_Models_2023_GovAI.pdf",
    locator: "Seger, Dreksler, Moulange et al.; GovAI report, §§4.1.3 and 4.2.3, printed pp. 19–20 and 25. Publisher catalog dated 29 September 2023.",
    scope: "Discusses structured external evaluation and mediation of researcher access. These mechanisms inform the exercise; Larch, its model evidence, admission veto and costs are fictional assumptions. The paper does not establish a correct release choice.",
  }, draftEpisodes.access.sources[1]],
}
export function decisionHref(id: EpisodeId) {
  return `/decisions/${decisionPublications.find(record => record.id === id)!.slug}`
}
export function getPublishedDecision(slug: string): Episode | null {
  const record = decisionPublications.find(record => record.slug === slug && record.status === "published")
  return record ? { ...draftEpisodes[record.id], version: record.version, status: record.status, sources: sources[record.id] } : null
}
