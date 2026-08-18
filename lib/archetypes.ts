import archetypeData from "@/content/archetypes.json" with { type: "json" }
import type { CanonicalFoundationResult } from "@/lib/scoring"
import { LOW_DIFFERENTIATION_THRESHOLD } from "@/lib/scoring-calibration"
import type {
  FamilyKey,
  NormativeModifier,
  StrategyModifier,
} from "@/lib/types"

export type LensCode = "P" | "R" | "M" | "S"
export type PostureSign = "+" | "-"
export type NormSuffix = "o" | "j" | "c"

/**
 * A slug that has been read from, and validated against, the canonical
 * archetype catalog. The catalog owns the values; callers must not recreate
 * them from codes or names.
 */
export type ArchetypeSlug = `${Lowercase<LensCode>}-${"plus" | "minus"}`

export type HistoricalAnalogue = {
  label: string
  year: string
  href: string
}

export type Archetype = {
  code: `${LensCode}${PostureSign}`
  name: string
  slug: ArchetypeSlug
  gloss: string
  lens: LensCode
  posture: PostureSign
  familyKey: FamilyKey
  analogue: HistoricalAnalogue
}

export type BlendArchetype = {
  code: `${LensCode}/${LensCode}${PostureSign}`
  name: string
  gloss: string
  lenses: [LensCode, LensCode]
  posture: PostureSign
  familyKeys: [FamilyKey, FamilyKey]
  archetypes: [Archetype, Archetype]
  analogue: null
}

type ArchetypeIdentityData = Omit<Archetype, "lens" | "posture">

const LENS_BY_FAMILY: Record<FamilyKey, LensCode> = {
  realist: "P",
  institutionalist: "R",
  constructivist: "M",
  criticalPoliticalEconomy: "S",
}

const FAMILY_BY_LENS: Record<LensCode, FamilyKey> = {
  P: "realist",
  R: "institutionalist",
  M: "constructivist",
  S: "criticalPoliticalEconomy",
}

const NORM_BY_MODIFIER: Record<NormativeModifier, NormSuffix> = {
  Pluralist: "o",
  Universalist: "j",
  "Conditional Solidarist": "c",
}

const LENS_LABELS: Record<LensCode, string> = {
  P: "power",
  R: "rules",
  M: "meaning",
  S: "structure",
}

const LENS_ORDER: LensCode[] = ["P", "R", "M", "S"]

// Restraint is a 1–7 dimension with a neutral midpoint of 4. A Hedger below
// that midpoint leans toward applying advantage (+); one above it leans toward
// restraint (−). This stays valid for both core and extended calibrations.
export const HEDGER_POSTURE_MIDPOINT = 4

const identityDefinitions = readIdentityDefinitions(archetypeData)

export const archetypes = identityDefinitions.map(
  (definition): Archetype => ({
    ...definition,
    lens: definition.code[0] as LensCode,
    posture: definition.code[1] as PostureSign,
  }),
)

const ARCHETYPE_BY_CODE = Object.fromEntries(
  archetypes.map((archetype) => [archetype.code, archetype]),
) as Record<Archetype["code"], Archetype>

const ARCHETYPE_BY_SLUG = new Map<ArchetypeSlug, Archetype>(
  archetypes.map(
    (archetype): [ArchetypeSlug, Archetype] => [archetype.slug, archetype],
  ),
)

export function lensFromFamily(familyKey: FamilyKey): LensCode {
  return LENS_BY_FAMILY[familyKey]
}

export function postureFromStrategyModifier(
  modifier: StrategyModifier,
  restraint = HEDGER_POSTURE_MIDPOINT,
): PostureSign {
  if (modifier === "Maximizer") return "+"
  if (modifier === "Restrainer") return "-"
  return restraint <= HEDGER_POSTURE_MIDPOINT ? "+" : "-"
}

export function normFromNormativeModifier(
  modifier: NormativeModifier,
): NormSuffix {
  return NORM_BY_MODIFIER[modifier]
}

export function getArchetypeByCode(
  code: string,
): Archetype | BlendArchetype | null {
  const pureMatch = code.match(/^([PRMS])([+-])$/)
  if (pureMatch) {
    return ARCHETYPE_BY_CODE[`${pureMatch[1] as LensCode}${pureMatch[2] as PostureSign}`]
  }

  const blendMatch = code.match(/^([PRMS])\/([PRMS])([+-])$/)
  if (!blendMatch || blendMatch[1] === blendMatch[2]) return null

  return buildBlendArchetype(
    blendMatch[1] as LensCode,
    blendMatch[2] as LensCode,
    blendMatch[3] as PostureSign,
  )
}

export function getArchetypeBySlug(slug: string): Archetype | null {
  return ARCHETYPE_BY_SLUG.get(slug as ArchetypeSlug) ?? null
}

export function getArchetypeSlug(
  code: Archetype["code"],
): ArchetypeSlug {
  return ARCHETYPE_BY_CODE[code].slug
}

export function getArchetypePath(code: Archetype["code"]): string {
  return `/archetypes/${getArchetypeSlug(code)}`
}

export function resolveArchetype(
  result: CanonicalFoundationResult,
  lowDifferentiationThreshold = LOW_DIFFERENTIATION_THRESHOLD,
): Archetype | BlendArchetype {
  const posture = postureFromStrategyModifier(
    result.strategyModifier,
    result.dimensionScores.restraint,
  )
  const primaryLens = lensFromFamily(result.familyKey)
  const primary = ARCHETYPE_BY_CODE[`${primaryLens}${posture}`]

  if (
    result.nearestFitGap >= lowDifferentiationThreshold ||
    result.runnerUpKey === result.familyKey
  ) {
    return primary
  }

  const secondaryLens = lensFromFamily(result.runnerUpKey)
  return buildBlendArchetype(primaryLens, secondaryLens, posture)
}

function buildBlendArchetype(
  primaryLens: LensCode,
  secondaryLens: LensCode,
  posture: PostureSign,
): BlendArchetype {
  const primary = ARCHETYPE_BY_CODE[`${primaryLens}${posture}`]
  const secondary = ARCHETYPE_BY_CODE[`${secondaryLens}${posture}`]
  const [first, second] =
    LENS_ORDER.indexOf(primaryLens) < LENS_ORDER.indexOf(secondaryLens)
      ? [primary, secondary]
      : [secondary, primary]

  return {
    code: `${first.lens}/${second.lens}${posture}`,
    name: `${blendNamePart(first.name)}–${blendNamePart(second.name)}`,
    gloss:
      `You read world politics through ${LENS_LABELS[first.lens]} and through ` +
      `${LENS_LABELS[second.lens]} at the same time, and you do not resolve ` +
      "the tension in advance.",
    lenses: [first.lens, second.lens],
    posture,
    familyKeys: [FAMILY_BY_LENS[first.lens], FAMILY_BY_LENS[second.lens]],
    archetypes: [first, second],
    analogue: null,
  }
}

function blendNamePart(name: string): string {
  return name.startsWith("The ") ? name.slice(4) : name
}

function readIdentityDefinitions(value: unknown): ArchetypeIdentityData[] {
  if (!isRecord(value) || !Array.isArray(value.records)) {
    throw new Error("Invalid archetype identity catalog: records must be an array.")
  }

  const definitions = value.records.map((record, index) => {
    if (!isRecord(record)) {
      throw new Error(
        `Invalid archetype identity catalog: records[${index}] must be an object.`,
      )
    }
    return readIdentityDefinition(record.identity, index)
  })
  const codes = new Set(definitions.map(({ code }) => code))
  const slugs = new Set(definitions.map(({ slug }) => slug))
  const expectedCodes = new Set<string>(
    (["P", "R", "M", "S"] as const).flatMap((lens) => [
      `${lens}+`,
      `${lens}-`,
    ]),
  )

  if (
    definitions.length !== expectedCodes.size ||
    codes.size !== expectedCodes.size ||
    [...expectedCodes].some((code) => !codes.has(code as Archetype["code"]))
  ) {
    throw new Error(
      "Invalid archetype identity catalog: expected exactly the eight frozen pure codes.",
    )
  }
  if (slugs.size !== definitions.length) {
    throw new Error("Invalid archetype identity catalog: slugs must be unique.")
  }

  return definitions
}

function readIdentityDefinition(
  value: unknown,
  index: number,
): ArchetypeIdentityData {
  const path = `records[${index}].identity`
  if (!isRecord(value)) {
    throw new Error(`Invalid archetype identity catalog: ${path} must be an object.`)
  }

  const { code, name, slug, gloss, familyKey, analogue } = value
  if (!isPureArchetypeCode(code)) {
    throw new Error(`Invalid archetype identity catalog: ${path}.code is invalid.`)
  }
  if (!isNonEmptyString(name)) {
    throw new Error(`Invalid archetype identity catalog: ${path}.name is required.`)
  }
  if (
    !isArchetypeSlug(slug) ||
    slug !== expectedArchetypeSlug(code)
  ) {
    throw new Error(`Invalid archetype identity catalog: ${path}.slug is invalid.`)
  }
  if (!isNonEmptyString(gloss)) {
    throw new Error(`Invalid archetype identity catalog: ${path}.gloss is required.`)
  }
  if (!isFamilyKey(familyKey) || LENS_BY_FAMILY[familyKey] !== code[0]) {
    throw new Error(
      `Invalid archetype identity catalog: ${path}.familyKey does not match its code.`,
    )
  }
  if (!isHistoricalAnalogue(analogue)) {
    throw new Error(
      `Invalid archetype identity catalog: ${path}.analogue is invalid.`,
    )
  }

  return {
    code,
    name,
    slug,
    gloss,
    familyKey,
    analogue,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function isPureArchetypeCode(value: unknown): value is Archetype["code"] {
  return typeof value === "string" && /^[PRMS][+-]$/u.test(value)
}

function isArchetypeSlug(value: unknown): value is ArchetypeSlug {
  return (
    typeof value === "string" &&
    /^[prms]-(?:plus|minus)$/u.test(value)
  )
}

function expectedArchetypeSlug(code: Archetype["code"]): ArchetypeSlug {
  const lens = code[0].toLowerCase() as Lowercase<LensCode>
  return `${lens}-${code[1] === "+" ? "plus" : "minus"}`
}

function isFamilyKey(value: unknown): value is FamilyKey {
  return (
    typeof value === "string" &&
    Object.hasOwn(LENS_BY_FAMILY, value)
  )
}

function isHistoricalAnalogue(value: unknown): value is HistoricalAnalogue {
  if (
    !isRecord(value) ||
    !isNonEmptyString(value.label) ||
    !isNonEmptyString(value.year) ||
    !isNonEmptyString(value.href)
  ) {
    return false
  }

  try {
    return new URL(value.href).protocol === "https:"
  } catch {
    return false
  }
}
