export type CurrentCaseReasoningTag = {
  id: string
  label: string
}

/**
 * Frozen aliases for labels written by Current Case response-store V1.
 * Keep entries after a case leaves the active catalog so old local records can
 * still migrate without treating display copy as identity.
 */
export const LEGACY_CURRENT_CASE_REASONING_TAGS: readonly CurrentCaseReasoningTag[] = [
  { id: "urgent-capability", label: "Urgent capability" },
  { id: "alliance-reliability", label: "Alliance reliability" },
  { id: "industrial-capacity", label: "Industrial capacity" },
  { id: "interoperability", label: "Interoperability" },
  { id: "escalation-risk", label: "Escalation risk" },
  { id: "long-term-autonomy", label: "Long-term autonomy" },
  { id: "legal-authority", label: "Legal authority" },
  { id: "operational-enforcement", label: "Operational enforcement" },
  { id: "coalition-signalling", label: "Coalition signalling" },
  { id: "regional-diplomacy", label: "Regional diplomacy" },
  { id: "legitimacy", label: "Legitimacy" },
  { id: "economic-leverage", label: "Economic leverage" },
  { id: "domestic-costs", label: "Domestic costs" },
  { id: "policy-autonomy", label: "Policy autonomy" },
  { id: "negotiating-room", label: "Negotiating room" },
  { id: "rules-and-precedent", label: "Rules and precedent" },
  { id: "coalition-support", label: "Coalition support" },
] as const

const TAG_ID_BY_LEGACY_LABEL = new Map(
  LEGACY_CURRENT_CASE_REASONING_TAGS.map((tag) => [tag.label, tag.id]),
)

export function migrateLegacyReasoningTag(label: string): {
  id: string
  legacyLabel?: string
} {
  const known = TAG_ID_BY_LEGACY_LABEL.get(label)
  if (known) return { id: known }
  return { id: `legacy-${stableHash(label)}`, legacyLabel: label }
}

export function isReasoningTagId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
  )
}

function stableHash(value: string) {
  let hash = 0x811c9dc5
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36)
}
