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
