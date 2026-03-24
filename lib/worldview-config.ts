import { FamilyKey } from "@/lib/types"

// Single source of truth for worldview family identifiers, slugs, and display labels.
// All route generation, result display, and explore linking should reference these.

export const FAMILY_LABELS: Record<FamilyKey, string> = {
  realist: "Strategic Realist",
  institutionalist: "Critical Institutionalist",
  constructivist: "Social Constructivist",
  criticalPoliticalEconomy: "Critical Political Economist",
}

// Canonical URL slugs for /explore/[slug] pages.
// These must match the slugs defined in lib/explore-content.ts exploreFamilies.
export const FAMILY_SLUGS: Record<FamilyKey, string> = {
  realist: "realism",
  institutionalist: "institutionalism",
  constructivist: "constructivism",
  criticalPoliticalEconomy: "critical-political-economy",
}

const SLUG_TO_KEY = Object.fromEntries(
  (Object.entries(FAMILY_SLUGS) as [FamilyKey, string][]).map(([key, slug]) => [slug, key]),
) as Record<string, FamilyKey>

export function familyLabel(key: FamilyKey): string {
  return FAMILY_LABELS[key]
}

export function familySlug(key: FamilyKey): string {
  return FAMILY_SLUGS[key]
}

export function familyKeyFromSlug(slug: string): FamilyKey | null {
  return SLUG_TO_KEY[slug] ?? null
}
