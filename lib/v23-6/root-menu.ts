import type { WorldStageSceneId } from "@/lib/world-stage/types"

/**
 * One shared root contract for both prototypes.
 *
 * Content, labels, document order, and interaction model are identical across
 * the Atlas Globe and Armillary Atlas roots. Only the central visual and the
 * typography treatment differ, so a direction decision compares those two
 * variables and nothing else.
 *
 * Dispatches is deliberately absent. No public piece exists yet, and an empty
 * public destination would be a promise the site cannot keep.
 */

export type RootDestinationId =
  | "inventory"
  | "world-stage"
  | "atlas"
  | "perspective-runs"
  | "profile"

/** Visual weight only. It never changes document order. */
export type RootDestinationWeight = "dominant" | "medium" | "quiet"

export type RootDestinationLink = Readonly<{
  label: string
  href: string
}>

export type RootDestination = Readonly<{
  id: RootDestinationId
  label: string
  href: string
  weight: RootDestinationWeight
  /** 30 to 80 words. Rendered only while the destination is selected. */
  explanation: string
  action: RootDestinationLink
  contents: readonly RootDestinationLink[]
  /** Camera and overlay selection for the globe root. */
  globe: Readonly<{
    center: readonly [number, number]
    zoom: number
    /** At most one reviewed overlay, and only where the map is the subject. */
    overlaySceneId: WorldStageSceneId | null
  }>
  /** Ring emphasis for the armillary root. */
  armillary: Readonly<{
    /** Degrees of longitude placed at the centre of the visible hemisphere. */
    rotation: number
    /** Which ring carries the highlighted arc. */
    ring: "equator" | "ecliptic" | "meridian" | "polar"
    /** Where the highlighted arc starts, in degrees. */
    arcStart: number
    /** How long the highlighted arc runs, in degrees. */
    arcSweep: number
  }>
}>

const inventory: RootDestination = {
  id: "inventory",
  label: "Inventory",
  href: "/quiz",
  weight: "dominant",
  explanation:
    "Inventory holds the four questionnaires. The Foundation covers seven recurring foreign-policy tradeoffs and produces your baseline. Security, Technology, and AI Governance are separate domains with their own item banks and their own results. Each one is scored on its own. Nothing here combines them into a single number, and no single answer decides a result.",
  action: { label: "Start the Foundation", href: "/quiz" },
  contents: [
    { label: "Foundation", href: "/quiz" },
    { label: "Security", href: "/modules/security" },
    { label: "Technology", href: "/modules/technology" },
    { label: "AI Governance", href: "/ai" },
  ],
  globe: { center: [12, 26], zoom: 1.18, overlaySceneId: null },
  armillary: { rotation: 12, ring: "meridian", arcStart: 200, arcSweep: 130 },
}

const worldStage: RootDestination = {
  id: "world-stage",
  label: "World Stage",
  href: "/cases",
  weight: "medium",
  explanation:
    "World Stage carries the case work and the geography. Current and recent cases each present one sourced international-affairs decision inside a stated evidence window. The reviewed map lives here too, with the controls that switch what it draws and the panel that opens a source. Every country role and every flow on it traces back to a dated source you can open.",
  action: { label: "Open recent cases", href: "/cases" },
  contents: [{ label: "Recent Cases", href: "/cases" }],
  globe: { center: [136, 22], zoom: 1.42, overlaySceneId: "foundation" },
  armillary: { rotation: 128, ring: "equator", arcStart: 24, arcSweep: 150 },
}

const atlas: RootDestination = {
  id: "atlas",
  label: "Atlas",
  href: "/explore",
  weight: "medium",
  explanation:
    "Atlas is the reference side. It holds the four modeled traditions, the thinkers behind them, the editorial Decision Patterns, and dated public positions with their sources and scope. Decision Patterns are authored aids for comparison. They are never assigned to you as a result, and the public positions carry the date and the scope they were coded against.",
  action: { label: "Open the Atlas", href: "/explore" },
  contents: [
    { label: "Traditions", href: "/explore" },
    { label: "Decision Patterns", href: "/explore/atlas" },
    { label: "Public positions", href: "/explore/reference" },
    { label: "Thinkers and reading", href: "/references" },
  ],
  globe: { center: [8, 44], zoom: 1.6, overlaySceneId: null },
  armillary: { rotation: 8, ring: "ecliptic", arcStart: 150, arcSweep: 120 },
}

const perspectiveRuns: RootDestination = {
  id: "perspective-runs",
  label: "Perspective Runs",
  href: "/perspectives",
  weight: "quiet",
  explanation:
    "A Perspective Run asks the same seven dimensions again from a defined position: a named actor in a named situation. The result is stored as its own record. It does not overwrite your Foundation baseline, and the two are shown side by side so you can see where the context moved your answers.",
  action: { label: "Open Perspective Runs", href: "/perspectives" },
  contents: [],
  globe: { center: [58, 30], zoom: 1.34, overlaySceneId: null },
  armillary: { rotation: 58, ring: "polar", arcStart: 300, arcSweep: 96 },
}

const profile: RootDestination = {
  id: "profile",
  label: "Profile",
  href: "/profile",
  weight: "quiet",
  explanation:
    "Profile keeps what you have saved on this device: the Foundation baseline, each domain result, and each Perspective Run, stored as separate records with their own dates. Nothing is uploaded and nothing is merged into an overall score. You can open any saved result, compare two Foundation runs, or delete everything from here.",
  action: { label: "Open Profile", href: "/profile" },
  contents: [],
  globe: { center: [-42, 34], zoom: 1.24, overlaySceneId: null },
  armillary: { rotation: -42, ring: "meridian", arcStart: 96, arcSweep: 108 },
}

export const ROOT_DESTINATIONS = [
  inventory,
  worldStage,
  atlas,
  perspectiveRuns,
  profile,
] as const satisfies readonly RootDestination[]

export const DEFAULT_ROOT_DESTINATION_ID: RootDestinationId = "inventory"

export const ROOT_ORIENTATION_LINE = "Choose where to start."

export const ROOT_SECONDARY_LINKS = [
  { label: "Method", href: "/method" },
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Corrections and contact", href: "/feedback" },
] as const satisfies readonly RootDestinationLink[]

export function getRootDestination(id: RootDestinationId): RootDestination {
  const found = ROOT_DESTINATIONS.find((destination) => destination.id === id)
  if (!found) throw new Error(`Unknown root destination: ${id}`)
  return found
}

/** Word count for the acceptance range recorded in the study contract. */
export function countWords(text: string): number {
  return text.trim().split(/\s+/u).filter(Boolean).length
}
