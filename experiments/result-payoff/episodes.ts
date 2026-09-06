export { draftEpisodes as episodes, completeEpisode, episodeProvenance, deferredDecision } from "@/lib/decision-exercises/content"
export type { EpisodeId, EpisodeSource, Episode, Decision, EpisodeCompletion } from "@/lib/decision-exercises/content"
export const syntheticPrior = { episode: "verify" as const, completedOn: "2026-09-01", first: { option: "national", reason: "timely" }, second: { option: "custodian", reason: "equal" } }
