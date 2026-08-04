import evidenceData from "@/content/archetype-evidence.json" with { type: "json" }
import {
  archetypes,
  type Archetype,
  type HistoricalAnalogue,
} from "@/lib/archetypes"

export type ArchetypeEvidenceSource = {
  label: string
  href: string
}

export type ArchetypeEvidence = {
  code: Archetype["code"]
  whyItFits: string
  whereItBreaks: string
  /**
   * Optional footnote about the archetype's name rather than its analogue —
   * used where the term collides with an established usage the product also
   * borrows, or carries a live meaning outside the one the archetype intends.
   */
  nameNote?: string
  sources: ArchetypeEvidenceSource[]
}

type ArchetypeEvidenceData = {
  version: 1
  records: ArchetypeEvidence[]
}

export type ResolvedArchetypeEvidence = {
  archetype: Archetype
  analogue: HistoricalAnalogue
  evidence: ArchetypeEvidence
}

const data = evidenceData as ArchetypeEvidenceData
const evidenceByCode = Object.fromEntries(
  data.records.map((record) => [record.code, record]),
) as Partial<Record<Archetype["code"], ArchetypeEvidence>>

const validationErrors = validateEvidenceData(data)
if (validationErrors.length > 0) {
  throw new Error(
    `Invalid archetype evidence data:\n${validationErrors.join("\n")}`,
  )
}

export const archetypeEvidenceVersion = data.version
export const archetypeEvidence = data.records

export function archetypeEvidenceSlug(code: Archetype["code"]): string {
  return `${code[0].toLowerCase()}-${code[1] === "+" ? "plus" : "minus"}`
}

export function archetypeEvidencePath(code: Archetype["code"]): string {
  return `/archetypes/${archetypeEvidenceSlug(code)}`
}

export function parseArchetypeEvidenceReturnPath(
  value: string | string[] | undefined,
): string | null {
  if (typeof value !== "string") return null
  return /^\/results\/[A-Za-z0-9_-]+$/u.test(value) ? value : null
}

export function getArchetypeEvidence(
  code: Archetype["code"],
): ResolvedArchetypeEvidence {
  const archetype = archetypes.find((candidate) => candidate.code === code)
  const evidence = evidenceByCode[code]

  if (!archetype || !archetype.analogue || !evidence) {
    throw new Error(`Missing archetype evidence for ${code}.`)
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
  const archetype = archetypes.find(
    (candidate) => archetypeEvidenceSlug(candidate.code) === slug,
  )

  return archetype ? getArchetypeEvidence(archetype.code) : null
}

export function validateArchetypeEvidence(): string[] {
  return validateEvidenceData(data)
}

function validateEvidenceData(candidate: ArchetypeEvidenceData): string[] {
  const errors: string[] = []
  const knownCodes = new Set(archetypes.map((archetype) => archetype.code))
  const seenCodes = new Set<string>()
  const seenSlugs = new Set<string>()

  if (candidate.version !== 1) {
    errors.push(`Unsupported evidence version ${String(candidate.version)}.`)
  }

  for (const archetype of archetypes) {
    if (!archetype.analogue) {
      errors.push(`${archetype.code} is missing its authored analogue.`)
    } else if (!isHttpsUrl(archetype.analogue.href)) {
      errors.push(`${archetype.code} analogue href must be an HTTPS URL.`)
    }

    const slug = archetypeEvidenceSlug(archetype.code)
    if (seenSlugs.has(slug)) {
      errors.push(`Duplicate archetype evidence slug ${slug}.`)
    }
    seenSlugs.add(slug)
  }

  for (const record of candidate.records) {
    if (!knownCodes.has(record.code)) {
      errors.push(`Unknown archetype evidence code ${record.code}.`)
    }
    if (seenCodes.has(record.code)) {
      errors.push(`Duplicate archetype evidence code ${record.code}.`)
    }
    seenCodes.add(record.code)

    if (!record.whyItFits.trim()) {
      errors.push(`${record.code} is missing whyItFits.`)
    }
    if (!record.whereItBreaks.trim()) {
      errors.push(`${record.code} is missing whereItBreaks.`)
    }
    if (record.nameNote !== undefined && !record.nameNote.trim()) {
      errors.push(`${record.code} has an empty nameNote.`)
    }
    if (!Array.isArray(record.sources) || record.sources.length === 0) {
      errors.push(`${record.code} must have at least one reviewed source.`)
    }

    for (const source of record.sources) {
      if (!source.label.trim()) {
        errors.push(`${record.code} has a source without a label.`)
      }
      if (!isHttpsUrl(source.href)) {
        errors.push(`${record.code} source href must be an HTTPS URL.`)
      }
    }
  }

  for (const code of knownCodes) {
    if (!seenCodes.has(code)) {
      errors.push(`Missing archetype evidence record for ${code}.`)
    }
  }

  return errors
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:"
  } catch {
    return false
  }
}
