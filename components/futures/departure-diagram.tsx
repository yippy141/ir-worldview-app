import { useId } from "react"
import type { Comparison } from "@/lib/futures/departure"
import styles from "./departure.module.css"

export function DepartureDiagram({ stage, policy }: { stage: Comparison | "intro"; policy?: string }) {
  const id = useId()
  const revised = stage === "b"
  const authority = stage === "c"
  const mandate = policy === "ban" ? "Unilateral, permanent ban" : policy === "compact" ? "Joint compact; review every five years" : policy === "no-veto" ? "No AI veto over successors" : "Authority not agreed"
  return (
    <figure className={styles.diagram}>
      <svg viewBox="0 0 560 345" role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}>
        <title id={`${id}-title`}>Earth, the outward journey and the unresolved relationship</title>
        <desc id={`${id}-description`}>{authority ? mandate : revised ? "The revised offer promises a return service and two-way communication. Outside the trusted premise, these remain unverified." : "Earth remains self-governing. The AI offers an outward journey. Return and communication terms are unknown."} Shared tools remain on Earth. Distances and travel times are not represented.</desc>
        <defs>
          <marker id={`${id}-arrow`} markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto-start-reverse"><path d="M0 0 L6 3 L0 6" fill="none" stroke="currentColor" /></marker>
        </defs>
        <g className={styles.earth} fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="94" cy="137" r="57" />
          <ellipse cx="94" cy="137" rx="26" ry="57" />
          <ellipse cx="94" cy="137" rx="57" ry="22" />
          <path d="M37 137 H151 M94 80 V 194" />
        </g>
        <g className={styles.route} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M166 110 C242 48 350 48 433 109" markerEnd={`url(#${id}-arrow)`} />
          <circle cx="461" cy="136" r="20" />
          <path d="M435 155 C340 210 247 210 163 161" strokeDasharray="5 7" markerEnd={revised ? `url(#${id}-arrow)` : undefined} />
        </g>
        <g className={styles.diagramText}>
          <text x="299" y="43" textAnchor="middle">Outward passage</text>
          <text x="94" y="225" textAnchor="middle">Earth</text>
          <text x="461" y="225" textAnchor="middle">Settlements</text>
          <text x="280" y="253" textAnchor="middle" className={styles.diagramSmall}>{revised ? "Return + contact promised" : "Return + contact unknown"}</text>
        </g>
        <path d="M38 274 H522" stroke="var(--line-2)" />
        <text x="38" y="305" className={styles.diagramSmall}>Reserved authority</text>
        <text x="38" y="332" className={styles.diagramText}>{authority ? mandate : "Successor-AI terms still open"}</text>
      </svg>
      <figcaption>{revised ? "The dashed relation is a promised return service, not verified access. In the preference question only, it works as stipulated." : "The dashed relation marks unresolved return and communication terms. Tools already shared remain available to those who stay."} Diagram of relationships, not distance or probability.</figcaption>
    </figure>
  )
}
