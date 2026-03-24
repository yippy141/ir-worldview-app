import { DimensionKey, DimensionScores, SharePayload } from "@/lib/types"

// Fixed dimension order for the payload array.
// This order must never change — it is part of the v2 payload contract.
export const PAYLOAD_DIMENSION_ORDER: DimensionKey[] = [
  "securityCompetition",
  "institutions",
  "domesticFilters",
  "normsIdentity",
  "politicalEconomy",
  "restraint",
  "orderJustice",
]

// btoa and atob are available as globals in both browsers and Node.js 18+.
// Next.js 16 requires Node.js 18.18+, so this is safe in all environments.
export function encodePayload(payload: SharePayload): string {
  const json = JSON.stringify(payload)
  // Convert to URL-safe Base64 and strip padding.
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

export function decodePayload(encoded: string): SharePayload | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/")
    const json = atob(base64)
    const parsed = JSON.parse(json)
    if (
      parsed.v !== 2 ||
      !Array.isArray(parsed.ds) ||
      parsed.ds.length !== 7 ||
      !parsed.fk ||
      !parsed.nk ||
      !parsed.sm ||
      !parsed.nm
    ) {
      return null
    }
    return parsed as SharePayload
  } catch {
    return null
  }
}

export function payloadToDimensionScores(payload: SharePayload): DimensionScores {
  const [sc, i, df, ni, pe, re, oj] = payload.ds
  return {
    securityCompetition: sc,
    institutions: i,
    domesticFilters: df,
    normsIdentity: ni,
    politicalEconomy: pe,
    restraint: re,
    orderJustice: oj,
  }
}

export function dimensionScoresToArray(
  scores: DimensionScores,
): [number, number, number, number, number, number, number] {
  return PAYLOAD_DIMENSION_ORDER.map((key) =>
    Number(scores[key].toFixed(2)),
  ) as [number, number, number, number, number, number, number]
}
