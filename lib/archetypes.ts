import archetypeData from "@/content/archetypes.json" with { type: "json" }
import {
  STRATEGY_LOWER_THRESHOLD,
  STRATEGY_UPPER_THRESHOLD,
  type CanonicalFoundationResult,
} from "@/lib/scoring"
import { LOW_DIFFERENTIATION_THRESHOLD } from "@/lib/scoring-calibration"
import type {
  FamilyKey,
  NormativeModifier,
  StrategyModifier,
} from "@/lib/types"

export type LensCode = "P" | "R" | "M" | "S"
export type PostureSign = "+" | "-"
export type NormSuffix = "o" | "j" | "c"

export type HistoricalAnalogue = {
  label: string
  year: string
  href: string
}

export type Archetype = {
  code: `${LensCode}${PostureSign}`
  name: string
  gloss: string
  lens: LensCode
  posture: PostureSign
  familyKey: FamilyKey
  analogue: HistoricalAnalogue | null
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

type ArchetypeData = Omit<Archetype, "lens" | "posture">

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

const HEDGER_POSTURE_MIDPOINT =
  (STRATEGY_LOWER_THRESHOLD + STRATEGY_UPPER_THRESHOLD) / 2

export const archetypes = (archetypeData as ArchetypeData[]).map(
  (definition): Archetype => ({
    ...definition,
    lens: definition.code[0] as LensCode,
    posture: definition.code[1] as PostureSign,
  }),
)

const ARCHETYPE_BY_CODE = Object.fromEntries(
  archetypes.map((archetype) => [archetype.code, archetype]),
) as Record<Archetype["code"], Archetype>

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

export function resolveArchetype(
  result: CanonicalFoundationResult,
): Archetype | BlendArchetype {
  const posture = postureFromStrategyModifier(
    result.strategyModifier,
    result.dimensionScores.restraint,
  )
  const primaryLens = lensFromFamily(result.familyKey)
  const primary = ARCHETYPE_BY_CODE[`${primaryLens}${posture}`]

  if (
    result.nearestFitGap >= LOW_DIFFERENTIATION_THRESHOLD ||
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
    name: `${first.name}–${second.name}`,
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
