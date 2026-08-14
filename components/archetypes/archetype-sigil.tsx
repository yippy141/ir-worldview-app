import {
  getArchetypeSigil,
  type PureArchetypeCode,
} from "@/lib/archetype-sigils"

type SharedArchetypeSigilProps = {
  code: PureArchetypeCode
  size?: number
  className?: string
}

export type ArchetypeSigilProps = SharedArchetypeSigilProps &
  (
    | { decorative?: true; label?: never }
    | { decorative: false; label: string }
  )

/**
 * Static renderer for the canonical sigil geometry. Accessible language is a
 * caller-owned locale decision; this component never derives a label.
 */
export function ArchetypeSigil({
  code,
  size = 24,
  className,
  decorative = true,
  label,
}: ArchetypeSigilProps) {
  const definition = getArchetypeSigil(code)
  const meaningfulLabel = decorative ? null : label?.trim()

  if (
    !definition ||
    !Number.isFinite(size) ||
    size <= 0 ||
    (!decorative && !meaningfulLabel)
  ) {
    return null
  }

  return (
    <svg
      viewBox={definition.viewBox}
      width={size}
      height={size}
      className={className}
      fill={definition.fill}
      stroke={definition.stroke}
      strokeWidth={definition.strokeWidth}
      strokeLinecap={definition.strokeLinecap}
      strokeLinejoin={definition.strokeLinejoin}
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : meaningfulLabel ?? undefined}
      focusable="false"
    >
      {definition.primitives.map((primitive, index) =>
        primitive.kind === "line" ? (
          <line
            key={index}
            x1={primitive.from[0]}
            y1={primitive.from[1]}
            x2={primitive.to[0]}
            y2={primitive.to[1]}
          />
        ) : (
          <path key={index} d={primitive.d} />
        ),
      )}
    </svg>
  )
}
