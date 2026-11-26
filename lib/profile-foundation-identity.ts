import { ambiguousFoundationCopy, classifyFoundationPresentation, foundationMidpointCopy } from "@/lib/results/foundation-result-heading"
import {
  resolveArchetype,
  type Archetype,
  type BlendArchetype,
} from "@/lib/archetypes"
import type { FoundationSnapshot } from "@/lib/profile-store"
import { getV2ScoringCalibration } from "@/lib/scoring"
import { resolveFoundationPayload } from "@/lib/share"

export function resolveFoundationIdentityFromSnapshot(
  snapshot: FoundationSnapshot,
) {
  const resolved = resolveFoundationPayload(snapshot.payload)
  if (!resolved) return null

  const { lowDifferentiationThreshold } = getV2ScoringCalibration(
    resolved.scoringCalibration,
  )

  return {
    archetype: resolveArchetype(
      resolved.result,
      lowDifferentiationThreshold,
    ),
    result: resolved.result,
    presentation: classifyFoundationPresentation(resolved.result, lowDifferentiationThreshold, resolved.payload.v === 5),
  }
}

/**
 * Resolve the Profile identity through the exact Foundation payload contract.
 *
 * The snapshot's display fields are intentionally not used as a fallback:
 * legacy payloads must keep their registered scorer and encoded result rather
 * than being reinterpreted through current rules.
 */
export function resolveFoundationArchetypeFromSnapshot(
  snapshot: FoundationSnapshot,
): Archetype | BlendArchetype | null {
  return resolveFoundationIdentityFromSnapshot(snapshot)?.archetype ?? null
}

/** A display title never promotes an enumeration-order identity for a broad tie. */
export function foundationIdentityTitle(
  identity: ReturnType<typeof resolveFoundationIdentityFromSnapshot>,
  locale: "en" | "zh-Hans" = "en",
): string {
  if (!identity) return locale === "en" ? "Foundation result unavailable" : "基础结果不可用"
  if (!identity.presentation.showArchetype) return ambiguousFoundationCopy(identity.presentation, locale).title
  return foundationMidpointCopy(identity.presentation, locale)?.title ?? identity.archetype.name
}
