import {
  getArchetypeByCode,
  normFromNormativeModifier,
  resolveArchetype,
  type Archetype,
  type BlendArchetype,
  type NormSuffix,
} from "@/lib/archetypes"
import { absoluteUrl } from "@/i18n/paths"
import { getPercentile, type AggregateStats } from "@/lib/percentiles"
import { dimensionLabels } from "@/lib/quiz-schema"
import { LOW_DIFFERENTIATION_THRESHOLD } from "@/lib/scoring-calibration"
import type { CanonicalFoundationResult } from "@/lib/scoring"
import { toDisplayPosition } from "@/lib/results/position"
import type { DimensionKey } from "@/lib/types"

const DIMENSION_KEYS = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
] as const satisfies readonly DimensionKey[]

export type ShareCardPercentile = {
  dimension: DimensionKey
  label: string
  percentile: number
}

export type ShareCardInput = {
  archetype: Archetype | BlendArchetype
  norm: NormSuffix
  percentiles: ShareCardPercentile[]
  coordinates: { x: number; y: number }
  rarityPercentage: number | null
}

export function buildFoundationShareCardUrl(
  result: CanonicalFoundationResult,
  stats: AggregateStats | null,
  rarityPercentage: number | null = null,
): string {
  const archetype = resolveArchetype(result)
  const coordinates = toDisplayPosition(
    result.dimensionScores,
    result.nearestFitGap < LOW_DIFFERENTIATION_THRESHOLD,
  )
  const params = new URLSearchParams({
    code: archetype.code,
    norm: normFromNormativeModifier(result.normativeModifier),
    x: coordinates.x.toFixed(4),
    y: coordinates.y.toFixed(4),
  })
  const strongestDimensions = (Object.entries(result.dimensionScores) as [
    DimensionKey,
    number,
  ][])
    .sort(([, left], [, right]) => Math.abs(right - 4) - Math.abs(left - 4))
    .slice(0, 3)
  const percentiles = stats
    ? strongestDimensions.map(([dimension, score]) => ({
        dimension,
        result: getPercentile(dimension, score, stats),
      }))
    : []

  if (
    percentiles.length === 3 &&
    percentiles.every(
      (entry): entry is {
        dimension: DimensionKey
        result: NonNullable<typeof entry.result>
      } => entry.result !== null,
    )
  ) {
    percentiles.forEach((entry, index) => {
      const slot = index + 1
      params.set(`d${slot}`, entry.dimension)
      params.set(`p${slot}`, String(entry.result.percentile))
    })

    if (isPercentage(rarityPercentage)) {
      params.set("rarity", formatPercentage(rarityPercentage))
    }
  }

  return absoluteUrl(`/api/card?${params.toString()}`)
}

export function parseShareCardParams(
  searchParams: URLSearchParams,
): ShareCardInput | null {
  const archetype = getArchetypeByCode(searchParams.get("code") ?? "")
  const norm = parseNormSuffix(searchParams.get("norm"))
  const x = parseBoundedNumber(searchParams.get("x"), -1, 1)
  const y = parseBoundedNumber(searchParams.get("y"), -1, 1)
  if (!archetype || !norm || x === null || y === null) return null

  const percentiles: Array<ShareCardPercentile | null> = [1, 2, 3].map((slot) => {
    const dimension = searchParams.get(`d${slot}`)
    const percentile = parseBoundedNumber(
      searchParams.get(`p${slot}`),
      0,
      100,
    )

    if (!isDimensionKey(dimension) || percentile === null) return null
    return {
      dimension,
      label: dimensionLabels[dimension],
      percentile: Math.round(percentile),
    }
  })
  const completePercentiles =
    percentiles.every(
      (entry): entry is ShareCardPercentile => entry !== null,
    ) &&
    new Set(percentiles.map((entry) => entry.dimension)).size === 3
      ? percentiles
      : []
  const rarity = parseBoundedNumber(searchParams.get("rarity"), 0, 100)

  return {
    archetype,
    norm,
    percentiles: completePercentiles,
    coordinates: { x, y },
    rarityPercentage:
      completePercentiles.length === 3 && rarity !== null ? rarity : null,
  }
}

function parseNormSuffix(value: string | null): NormSuffix | null {
  return value === "o" || value === "j" || value === "c" ? value : null
}

function isDimensionKey(value: string | null): value is DimensionKey {
  return value !== null && (DIMENSION_KEYS as readonly string[]).includes(value)
}

function parseBoundedNumber(
  value: string | null,
  minimum: number,
  maximum: number,
): number | null {
  if (value === null || value.trim() === "") return null
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= minimum && parsed <= maximum
    ? parsed
    : null
}

function isPercentage(value: number | null): value is number {
  return value !== null && Number.isFinite(value) && value >= 0 && value <= 100
}

function formatPercentage(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}
