import { classifyFoundationPresentation, type FoundationPresentation } from "@/lib/results/foundation-result-heading"
import {
  normFromNormativeModifier,
  resolveArchetype,
  type Archetype,
  type BlendArchetype,
  type NormSuffix,
} from "@/lib/archetypes"
import { absoluteUrl } from "@/i18n/paths"
import { LOW_DIFFERENTIATION_THRESHOLD } from "@/lib/scoring-calibration"
import type { CanonicalFoundationResult } from "@/lib/scoring"
import { toDisplayPosition } from "@/lib/results/position"

export type ShareCardInput = {
  presentation: FoundationPresentation
  archetype: Archetype | BlendArchetype
  norm: NormSuffix
  coordinates: { x: number; y: number }
}

export function buildFoundationShareCardUrl(
  encodedPayload: string,
): string {
  const params = new URLSearchParams({ payload: encodedPayload })
  return absoluteUrl(`/api/card?${params.toString()}`)
}

export function parseFoundationShareCardRequest(
  params: URLSearchParams,
): string | null {
  if ([...params.keys()].some((key) => key !== "payload")) return null

  const payload = params.get("payload")?.trim()
  return payload || null
}

export function buildFoundationShareCardInput(
  result: CanonicalFoundationResult,
  lowDifferentiationThreshold = LOW_DIFFERENTIATION_THRESHOLD,
): ShareCardInput {
  const archetype = resolveArchetype(result, lowDifferentiationThreshold)
  const coordinates = toDisplayPosition(
    result.dimensionScores,
    result.nearestFitGap < lowDifferentiationThreshold,
  )

  return {
    presentation: classifyFoundationPresentation(result, lowDifferentiationThreshold),
    archetype,
    norm: normFromNormativeModifier(result.normativeModifier),
    coordinates,
  }
}
