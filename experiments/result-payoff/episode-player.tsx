"use client"
import { EpisodePlayer as SharedPlayer } from "@/components/decision-exercises/episode-player"
import type { Episode } from "./episodes"
export { Arrangement } from "@/components/decision-exercises/episode-player"
export function EpisodePlayer({ episode }: { episode: Episode }) {
 return <SharedPlayer episode={episode} preview links={{ next: `/dev/result-payoff?episode=${episode.id === "verify" ? "access" : "verify"}`, exit: "/dev/result-payoff" }} />
}
