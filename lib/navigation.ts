import english from "@/messages/en.json" with { type: "json" }
import chinese from "@/messages/zh-Hans.json" with { type: "json" }

// Presentation destinations only. Result returns keep their existing allowlists;
// questionnaire steps and deliberate exits remain owned by their flows.
export const destinations = {
  foundation: { href: "/quiz", labelKey: "foundation" },
  worldStage: { href: "/world-stage", labelKey: "worldStage" },
  library: { href: "/explore", labelKey: "explore" },
  modules: { href: "/modules", labelKey: "focusAreas" },
  security: { href: "/modules/security", labelKey: "security", parent: "modules" },
  technology: { href: "/modules/technology", labelKey: "technology", parent: "modules" },
  ai: { href: "/ai", labelKey: "ai" },
  aiApproaches: { href: "/ai/atlas", labelKey: "aiApproaches", parent: "ai" },
  aiFieldGuide: { href: "/ai/field-guide", labelKey: "fieldGuide", parent: "ai" },
  profile: { href: "/profile", labelKey: "profile" },
  perspectives: { href: "/perspectives", labelKey: "perspectives" },
  worldviewMap: { href: "/explore/atlas", labelKey: "worldviewMap", parent: "library" },
  thinkers: { href: "/explore/reference", labelKey: "publicPositions", parent: "library" },
  archetypes: { href: "/archetypes", labelKey: "archetypes", parent: "library" },
  cases: { href: "/cases", labelKey: "currentCase", parent: "worldStage" },
  decisions: { href: "/decisions", labelKey: "decisions" },
  futures: { href: "/futures", labelKey: "futures" },
  method: { href: "/method", labelKey: "methods" },
  privacy: { href: "/privacy", labelKey: "privacy" },
  references: { href: "/references", labelKey: "references", parent: "library" },
  feedback: { href: "/feedback", labelKey: "feedback" },
  about: { href: "/about", labelKey: "about" },
} as const satisfies Record<string, { href: string; labelKey: keyof typeof english.chrome.nav; parent?: string }>

export type DestinationId = keyof typeof destinations

/** Section homes and their reading/exercise destinations, shared by every menu. */
export const navigationSections: ReadonlyArray<{ home: DestinationId; children: readonly DestinationId[] }> = [
  { home: "foundation", children: [] },
  { home: "ai", children: ["aiApproaches", "aiFieldGuide"] },
  { home: "modules", children: ["security", "technology"] },
  { home: "library", children: ["worldviewMap", "thinkers", "archetypes", "references"] },
  { home: "worldStage", children: ["cases", "decisions"] },
  { home: "futures", children: [] },
  { home: "perspectives", children: [] },
  { home: "profile", children: [] },
]

export const navigationUtilities: readonly DestinationId[] = ["method", "about", "privacy", "feedback"]

export function destinationIsCurrent(id: DestinationId, pathname: string) {
  const href = destinations[id].href
  return pathname === href || pathname.startsWith(`${href}/`)
    || (id === "foundation" && pathname.startsWith("/results/"))
    || (id === "profile" && pathname === "/compare")
}

export function destinationLabel(id: DestinationId, locale = "en") {
  const labels = locale === "zh-Hans" ? chinese.chrome.nav : english.chrome.nav
  return labels[destinations[id].labelKey]
}

export function navigationItem(id: DestinationId) {
  const destination = destinations[id]
  return { href: destination.href, labelKey: `nav.${destination.labelKey}` }
}
