import {
  HEDGER_POSTURE_MIDPOINT,
  getArchetypeByCode,
  resolveArchetype,
  type Archetype,
  type BlendArchetype,
  type PostureSign,
} from "@/lib/archetypes"
import { archetypeEvidencePath } from "@/lib/archetype-evidence"
import { LOW_DIFFERENTIATION_THRESHOLD } from "@/lib/scoring-calibration"
import type { CanonicalFoundationResult } from "@/lib/scoring"

// ---------------------------------------------------------------------------
// Restraint posture
// ---------------------------------------------------------------------------
//
// Restraint does not feed the field-map projection (see lib/results/position.ts:
// neither axis weights it). The archetype layer, however, splits every lens on
// restraint — the trailing + or − in a code like P+ is the posture sign. Two
// archetypes that share a lens therefore differ ONLY on a dimension the map
// cannot see, and would land on the same coordinate. Plotting them would invent
// the separation, so this module supplies a one-dimensional scale to sit BESIDE
// the map instead.
//
// Every name here comes from content/archetypes.json via lib/archetypes.ts. No
// label is authored in this module.

const SCALE_MIN = 1
const SCALE_MAX = 7

export type PostureEndpoint = {
  code: string
  name: string
  gloss: string
  /** Present only for pure archetypes; blends have no evidence page. */
  href: string | null
}

export type RestraintPosture = {
  /** Raw restraint score on the 1-7 dimension scale. */
  score: number
  /** Position along the drawn track, 0 (press advantage) to 1 (hold back). */
  fraction: number
  /** Where the + / − sign flips, as a track fraction. */
  postureCut: number
  /** The sign the respondent's own archetype carries. */
  posture: PostureSign
  /** The end the respondent currently sits on. */
  current: PostureEndpoint
  /** Press-advantage end (+). */
  low: PostureEndpoint
  /** Hold-back end (−). */
  high: PostureEndpoint
  /** True when the reading is a two-lens blend rather than a single lens. */
  blend: boolean
}

function toFraction(score: number): number {
  const clamped = Math.max(SCALE_MIN, Math.min(SCALE_MAX, score))
  return (clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)
}

function isBlend(archetype: Archetype | BlendArchetype): archetype is BlendArchetype {
  return archetype.code.includes("/")
}

/** Swap a code's posture sign: P+ <-> P-, P/R+ <-> P/R-. */
function withPosture(code: string, posture: PostureSign): string {
  return `${code.slice(0, -1)}${posture}`
}

function toEndpoint(archetype: Archetype | BlendArchetype): PostureEndpoint {
  return {
    code: archetype.code,
    name: archetype.name,
    gloss: archetype.gloss,
    href: isBlend(archetype) ? null : archetypeEvidencePath(archetype.code),
  }
}

/**
 * Resolve the pair of archetypes that share the respondent's lens (or lens
 * blend) and differ only on the posture sign, plus where the respondent sits
 * between them on restraint.
 */
export function resolveRestraintPosture(
  result: CanonicalFoundationResult,
  lowDifferentiationThreshold = LOW_DIFFERENTIATION_THRESHOLD,
): RestraintPosture {
  const current = resolveArchetype(result, lowDifferentiationThreshold)
  const advantage = getArchetypeByCode(withPosture(current.code, "+"))
  const restraint = getArchetypeByCode(withPosture(current.code, "-"))

  // Both signs exist for every lens and every lens blend in the catalog; the
  // fallback keeps a malformed code from taking the result page down with it.
  const low = advantage ? toEndpoint(advantage) : toEndpoint(current)
  const high = restraint ? toEndpoint(restraint) : toEndpoint(current)

  return {
    score: result.dimensionScores.restraint,
    fraction: toFraction(result.dimensionScores.restraint),
    postureCut: toFraction(HEDGER_POSTURE_MIDPOINT),
    posture: current.posture,
    current: toEndpoint(current),
    low,
    high,
    blend: isBlend(current),
  }
}
