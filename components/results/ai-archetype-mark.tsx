import type { AiArchetypeKey } from "@/lib/ai-governance-types"

/** Original editorial marks. One artboard, stroke weight and color for every reading. */
const strokes: Record<AiArchetypeKey, string[]> = {
  precautionarySteward: ["M73 77A35 35 0 1 1 84 43", "M62 69A23 23 0 1 1 73 48", "M40 57A12 12 0 1 1 61 49"],
  strategicCompetitor: ["M18 33H70L61 24M70 33L61 42", "M82 67H30L39 58M30 67L39 76", "M26 47V62M74 38V53", "M44 50H56"],
  coordinationArchitect: ["M18 26V42L42 50", "M82 26V42L58 50", "M18 74V58L42 50", "M82 74V58L58 50", "M42 43H58V57H42Z"],
  democraticGuardrailist: ["M30 18H70M18 30V70M82 30V70M30 82H70", "M34 34H66V66H34Z", "M42 18V25M58 18V25M18 42H25M18 58H25M75 42H82M75 58H82M42 75V82M58 75V82"],
  stateCapacityBuilder: ["M16 29H84M22 39H78", "M29 39V70M43 39V70M57 39V70M71 39V70", "M22 70H78M16 80H84", "M38 20H62"],
  openEcosystemBuilder: ["M35 19H19V35M65 19H81V35M19 65V81H35M65 81H81V65", "M35 50H10M65 50H90M50 35V10M50 65V90", "M42 42H58V58H42Z"],
}

export function AiArchetypeMark({ archetype, size = "hero" }: { archetype: AiArchetypeKey; size?: "hero" | "compact" }) {
  return <svg className={`ai-archetype-mark ai-archetype-mark--${size}`} data-ai-mark={archetype}
    viewBox="0 0 100 100" aria-hidden="true" focusable="false" fill="none" stroke="currentColor"
    strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    {strokes[archetype].map((d, index) => <path key={index} d={d} />)}
  </svg>
}
