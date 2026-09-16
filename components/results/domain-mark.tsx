import type { ModuleSlug } from "@/lib/modules/types"

// Editorial domain marks. They distinguish the instrument, never a scored identity.
const strokes: Record<ModuleSlug, string[]> = {
  security: ["M22 28L50 14L78 28V54Q73 75 50 88Q27 75 22 54Z", "M34 46L50 35L66 46", "M34 62L50 51L66 62"],
  technology: ["M20 20H80V80H20Z", "M20 40H80", "M20 60H80", "M40 20V80", "M60 20V80", "M11 50H20", "M80 50H89"],
}
export function DomainMark({ domain, compact = false }: { domain: ModuleSlug; compact?: boolean }) {
  return <svg viewBox="0 0 100 100" className={`domain-mark${compact ? " domain-mark--compact" : ""}`} data-domain-mark={domain} width={compact ? 48 : 144} height={compact ? 48 : 144} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    {strokes[domain].map((d, index) => <path key={index} d={d} data-draw data-start={200 + index * 120} data-duration={1400 - index * 120} />)}
  </svg>
}
