import {
  atlasLitePatterns,
  getAtlasPatternHref,
  type AtlasLitePattern,
} from "@/lib/atlas-lite"
import { STRATEGY_MODIFIER_THRESHOLDS, getStrategyModifier } from "@/lib/scoring"
import type { DimensionScores, FamilyKey, StrategyModifier } from "@/lib/types"

// ---------------------------------------------------------------------------
// Restraint posture
// ---------------------------------------------------------------------------
//
// Restraint does not feed the field-map projection (see lib/results/position.ts:
// neither axis weights it). Two worldview profiles that share a lens and differ
// only on restraint therefore land on the SAME map coordinate. Plotting them as
// separate points would invent a separation the model does not have, so this
// module supplies a one-dimensional scale to sit BESIDE the map instead.
//
// Endpoints are derived from data that already exists. A lens earns named
// endpoints only when it actually has one profile at each restraint extreme;
// otherwise the ends fall back to the product's own restraint vocabulary. No
// new archetype names are introduced here.

const SCALE_MIN = 1
const SCALE_MAX = 7

export type PostureEndpointKind = "profile" | "modifier"

export type PostureEndpoint = {
  label: string
  /** Present only for worldview-profile endpoints. */
  href?: string
  kind: PostureEndpointKind
}

export type RestraintPosture = {
  /** Raw restraint score on the 1-7 dimension scale. */
  score: number
  /** Position along the drawn track, 0 (press advantage) to 1 (hold back). */
  fraction: number
  band: StrategyModifier
  /** Band boundaries as track fractions, for drawing the same cut points. */
  bandBoundaries: { maximizer: number; restrainer: number }
  low: PostureEndpoint
  high: PostureEndpoint
  /**
   * True when both ends name worldview profiles that share the lens. False
   * means the modeled profiles for this lens do not separate on restraint,
   * and the scale is shown against the modifier vocabulary instead.
   */
  namedProfiles: boolean
}

function toFraction(score: number): number {
  const clamped = Math.max(SCALE_MIN, Math.min(SCALE_MAX, score))
  return (clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)
}

function sharesLens(pattern: AtlasLitePattern, familyKey: FamilyKey): boolean {
  return (
    pattern.primaryFamily === familyKey ||
    (pattern.rules.families?.includes(familyKey) ?? false)
  )
}

/** A profile sits at the press-advantage end of its lens. */
function isAdvantageEnd(pattern: AtlasLitePattern): boolean {
  return (
    pattern.fingerprint.restraint === "low" ||
    (pattern.rules.strategyModifiers?.includes("Maximizer") ?? false)
  )
}

/** A profile sits at the hold-back end of its lens. */
function isRestraintEnd(pattern: AtlasLitePattern): boolean {
  const modifiers = pattern.rules.strategyModifiers
  return (
    pattern.fingerprint.restraint === "high" ||
    (modifiers?.length === 1 && modifiers[0] === "Restrainer")
  )
}

function toProfileEndpoint(pattern: AtlasLitePattern): PostureEndpoint {
  return {
    label: pattern.publicName,
    href: getAtlasPatternHref(pattern.id),
    kind: "profile",
  }
}

const MODIFIER_ENDPOINTS: { low: PostureEndpoint; high: PostureEndpoint } = {
  low: { label: "Maximizer", kind: "modifier" },
  high: { label: "Restrainer", kind: "modifier" },
}

/**
 * Find the worldview profiles that share a lens and sit at opposite ends of
 * restraint. Returns null when the lens has no such pair — which is the honest
 * answer for most lenses in the current catalog, not a bug.
 */
export function findRestraintProfilePair(
  familyKey: FamilyKey,
  patterns: readonly AtlasLitePattern[] = atlasLitePatterns,
): { low: AtlasLitePattern; high: AtlasLitePattern } | null {
  const lensPatterns = patterns.filter((pattern) => sharesLens(pattern, familyKey))
  const low = lensPatterns.find(isAdvantageEnd)
  const high = lensPatterns.find(isRestraintEnd)

  if (!low || !high || low.id === high.id) return null
  return { low, high }
}

export function resolveRestraintPosture(
  familyKey: FamilyKey,
  dimensionScores: DimensionScores,
): RestraintPosture {
  const pair = findRestraintProfilePair(familyKey)

  return {
    score: dimensionScores.restraint,
    fraction: toFraction(dimensionScores.restraint),
    band: getStrategyModifier(dimensionScores),
    bandBoundaries: {
      maximizer: toFraction(STRATEGY_MODIFIER_THRESHOLDS.maximizer),
      restrainer: toFraction(STRATEGY_MODIFIER_THRESHOLDS.restrainer),
    },
    low: pair ? toProfileEndpoint(pair.low) : MODIFIER_ENDPOINTS.low,
    high: pair ? toProfileEndpoint(pair.high) : MODIFIER_ENDPOINTS.high,
    namedProfiles: pair !== null,
  }
}
