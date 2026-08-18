import {
  archetypeEvidenceSchemaVersion,
  getLegacyArchetypeEvidence,
  type LegacyArchetypeEvidence,
} from "@/lib/archetype-content"
import {
  archetypes,
  getArchetypeByCode,
  getArchetypeBySlug,
  getArchetypePath,
  getArchetypeSlug,
  type Archetype,
  type ArchetypeSlug,
  type HistoricalAnalogue,
} from "@/lib/archetypes"

export type ArchetypeEvidenceSource = LegacyArchetypeEvidence["sources"][number]

export type ArchetypeEvidence = LegacyArchetypeEvidence

export type ResolvedArchetypeEvidence = {
  archetype: Archetype
  analogue: HistoricalAnalogue
  evidence: ArchetypeEvidence
}

/**
 * Compatibility list for the eight historical URLs. It is deliberately
 * identity-derived: invalid or withheld rich content cannot remove a stable
 * route, break a result link, or create a ninth path.
 */
export const archetypeEvidence = archetypes.map(({ code }) => ({ code }))
export const archetypeEvidenceVersion = archetypeEvidenceSchemaVersion

export function archetypeEvidenceSlug(
  code: Archetype["code"],
): ArchetypeSlug {
  return getArchetypeSlug(code)
}

export function archetypeEvidencePath(code: Archetype["code"]): string {
  return getArchetypePath(code)
}

export function parseArchetypeEvidenceReturnPath(
  value: string | string[] | undefined,
): string | null {
  if (typeof value !== "string") return null
  return /^\/results\/[A-Za-z0-9_-]+$/u.test(value) ? value : null
}

export function getArchetypeEvidence(
  code: Archetype["code"],
): ResolvedArchetypeEvidence | null {
  const archetype = getArchetypeByCode(code)
  const evidence = getLegacyArchetypeEvidence(code)

  if (!archetype || "lenses" in archetype || !evidence) {
    return null
  }

  return {
    archetype,
    analogue: archetype.analogue,
    evidence,
  }
}

export function getArchetypeEvidenceBySlug(
  slug: string,
): ResolvedArchetypeEvidence | null {
  const archetype = getArchetypeBySlug(slug)
  return archetype ? getArchetypeEvidence(archetype.code) : null
}

/**
 * Retained as a compatibility API. Rich-content validation is owned by
 * `lib/archetype-content.ts`; this adapter reports only whether each stable
 * historical URL currently has a renderable legacy evidence projection.
 */
export function validateArchetypeEvidence(): string[] {
  return archetypes.flatMap((archetype) =>
    getLegacyArchetypeEvidence(archetype.code)
      ? []
      : [`Missing renderable legacy archetype evidence for ${archetype.code}.`],
  )
}
