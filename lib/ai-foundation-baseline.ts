import { resolveFoundationIdentityFromSnapshot } from "@/lib/profile-foundation-identity"
import type { FoundationSnapshot } from "@/lib/profile-store"
import { traditionNounLabel } from "@/lib/worldview-config"

export type AiFoundationBaseline =
  | {
      status: "resolved"
      primaryLabel: string
      secondaryLabel: string
    }
  | {
      status: "archived-unresolvable"
      primaryLabel: "Archived Foundation result"
      secondaryLabel: string
    }

/**
 * Hydrate the baseline through the snapshot's exact payload/scorer contract.
 * Cached family labels and scores are never used to reconstruct an identity.
 */
export function buildAiFoundationBaseline(
  snapshot: FoundationSnapshot,
): AiFoundationBaseline {
  const identity = resolveFoundationIdentityFromSnapshot(snapshot)
  if (!identity) {
    return {
      status: "archived-unresolvable",
      primaryLabel: "Archived Foundation result",
      secondaryLabel:
        "This saved record cannot be resolved through its original payload contract.",
    }
  }

  return {
    status: "resolved",
    primaryLabel: identity.archetype.name,
    secondaryLabel: `Closest modeled tradition: ${traditionNounLabel(identity.result.familyKey)}`,
  }
}
