import type { AiArchetypeKey } from "@/lib/ai-governance-types"

/** Original editorial marks. One artboard, stroke weight and color for every reading. */
export const AI_MARK_VISUAL_VERSION = "fable-2" as const
const strokes: Record<AiArchetypeKey, string[]> = {
  precautionarySteward: ["M28 82V24H72V82", "M20 46H80", "M50 84V59", "M50 34V16"],
  strategicCompetitor: ["M18 33H74L62 21", "M74 33L62 45", "M82 67H26L38 55", "M26 67L38 79"],
  coordinationArchitect: ["M59 20H23V63H43", "M41 80H77V37H57", "M43 37V63H57V37Z"],
  democraticGuardrailist: ["M38 20H20V80H80V20H62", "M38 20V38", "M62 20V38", "M35 61H65"],
  stateCapacityBuilder: ["M18 28L50 15L82 28Z", "M27 39V70", "M43 39V70", "M57 39V70", "M73 39V70", "M20 80H80"],
  openEcosystemBuilder: ["M50 31V12", "M64 36L78 22", "M69 50H88", "M64 64L78 78", "M50 69V88", "M36 64L22 78", "M31 50H12", "M36 36L22 22"],
}

export function AiArchetypeMark({ archetype, size = "hero" }: { archetype: AiArchetypeKey; size?: "hero" | "compact" }) {
  return <svg className={`ai-archetype-mark ai-archetype-mark--${size}`} data-ai-mark={archetype}
    viewBox="0 0 100 100" aria-hidden="true" focusable="false" fill="none" stroke="currentColor"
    strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    {strokes[archetype].map((d, index) => <path key={index} d={d} data-draw data-start={200 + index * 120} data-duration={1400 - index * 120} />)}
  </svg>
}
