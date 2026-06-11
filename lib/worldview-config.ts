import type { FamilyKey } from "@/lib/types"

// Single source of truth for worldview family identifiers, slugs, and display labels.
// All route generation, result display, and explore linking should reference these.

export const MODELED_FAMILY_KEYS: FamilyKey[] = [
  "realist",
  "institutionalist",
  "constructivist",
  "criticalPoliticalEconomy",
]

export const FAMILY_LABELS: Record<FamilyKey, string> = {
  realist: "Strategic Realist",
  institutionalist: "Liberal Institutionalist",
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

// Tradition-specific CSS class for accent styling on Explore pages.
// Maps each family to a modifier class used with .tradition-chip and .tradition-rule.
export const FAMILY_TRADITION_CLASS: Record<FamilyKey, string> = {
  realist: "tradition--realist",
  institutionalist: "tradition--institutionalist",
  constructivist: "tradition--constructivist",
  criticalPoliticalEconomy: "tradition--cpe",
}

export function familyTraditionClass(key: FamilyKey): string {
  return FAMILY_TRADITION_CLASS[key]
}
