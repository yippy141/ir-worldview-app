import type { AtlasLitePattern } from "@/lib/atlas-lite"
import { familyTraditionClass, familyLabel } from "@/lib/worldview-config"

export function AtlasPatternFamily({
  pattern,
  compact = false,
}: {
  pattern: Pick<AtlasLitePattern, "primaryFamily" | "secondaryFamilies">
  compact?: boolean
}) {
  const secondaryFamilies = pattern.secondaryFamilies ?? []

  return (
    <div className={`atlas-family-meta${compact ? " atlas-family-meta--compact" : ""}`}>
      <span className={`tradition-chip ${familyTraditionClass(pattern.primaryFamily)}`}>
        Mostly {familyLabel(pattern.primaryFamily)}
      </span>
      {secondaryFamilies.length > 0 ? (
        <p className="atlas-family-secondary">
          Also overlaps with {formatFamilyList(secondaryFamilies.map((family) => familyLabel(family)))}.
        </p>
      ) : null}
    </div>
  )
}

function formatFamilyList(labels: string[]) {
  if (labels.length === 1) {
    return labels[0]
  }

  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`
  }

  return `${labels.slice(0, -1).join(", ")}, and ${labels.at(-1)}`
}
