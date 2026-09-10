import { decisionHref, getPublishedDecision } from "@/lib/decision-exercises/catalog"
import type { EpisodeId } from "@/lib/decision-exercises/content"
import type { ModuleSlug } from "@/lib/modules/types"

const continuations = {
  security: {
    episode: "verify",
    reason: "Explore who gets inspection rights under a reciprocal agreement. The technical reach of the checks is a supplied assumption.",
  },
  technology: {
    episode: "access",
    reason: "Explore who controls outside researchers’ access to a model. The exercise keeps the access conditions explicit.",
  },
} satisfies Record<ModuleSlug, { episode: EpisodeId; reason: string }>

export function getModuleContinuation(slug: ModuleSlug) {
  const continuation = continuations[slug]
  const href = decisionHref(continuation.episode)
  const episode = getPublishedDecision(href.split("/").at(-1)!)
  return episode ? { href, title: episode.title, reason: continuation.reason } : null
}
