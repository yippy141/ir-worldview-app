import {
  archetypes,
  normFromNormativeModifier,
  resolveArchetype,
  type Archetype,
  type BlendArchetype,
  type LensCode,
  type PostureSign,
} from "@/lib/archetypes"
import {
  normativeDisplayAlias,
  publicLensLabel,
} from "@/lib/archetype-display"
import type { PureArchetypeCode } from "@/lib/archetype-marks"
import type { FoundationSnapshot } from "@/lib/profile-store"
import {
  FIELD_PROJECTION_VERSION,
  toMapPosition,
} from "@/lib/results/position"
import {
  getV2ScoringCalibration,
  type FoundationScoringCalibration,
} from "@/lib/scoring"
import {
  resolveFoundationPayload,
  type FoundationCompletionRecord,
} from "@/lib/share"
import type {
  DimensionScores,
  NormativeModifier,
  SharePayload,
} from "@/lib/types"

export type ArchetypeMatrixLens = Readonly<{
  lens: LensCode
  label: ReturnType<typeof publicLensLabel>
}>

export type ArchetypeMatrixPosture = Readonly<{
  posture: PostureSign
  label: "Applying advantage" | "Restraint"
}>

export type ArchetypeMatrixCell = Readonly<{
  lens: LensCode
  lensLabel: ReturnType<typeof publicLensLabel>
  posture: PostureSign
  postureLabel: ArchetypeMatrixPosture["label"]
  archetypeCode: PureArchetypeCode
  /** Canonical identity record; names and slugs are never copied into Map config. */
  archetype: Archetype
}>

export const ARCHETYPE_MATRIX_LENSES = [
  { lens: "P", label: publicLensLabel("P") },
  { lens: "R", label: publicLensLabel("R") },
  { lens: "M", label: publicLensLabel("M") },
  { lens: "S", label: publicLensLabel("S") },
] as const satisfies readonly ArchetypeMatrixLens[]

export const ARCHETYPE_MATRIX_POSTURES = [
  { posture: "+", label: "Applying advantage" },
  { posture: "-", label: "Restraint" },
] as const satisfies readonly ArchetypeMatrixPosture[]

/**
 * The reference matrix in canonical lens-major order: P+/P-, R+/R-, M+/M-,
 * S+/S-. Each cell points at the frozen archetype catalog instead of copying
 * any public identity string.
 */
export const ARCHETYPE_MATRIX_CELLS: readonly ArchetypeMatrixCell[] =
  ARCHETYPE_MATRIX_LENSES.flatMap(({ lens, label: lensLabel }) =>
    ARCHETYPE_MATRIX_POSTURES.map(({ posture, label: postureLabel }) => {
      const archetypeCode = `${lens}${posture}` as PureArchetypeCode
      const archetype = archetypes.find(
        (candidate) => candidate.code === archetypeCode,
      )

      if (!archetype) {
        throw new Error(`Missing canonical archetype matrix cell: ${archetypeCode}`)
      }

      return {
        lens,
        lensLabel,
        posture,
        postureLabel,
        archetypeCode,
        archetype,
      }
    }),
  )

export type ActiveMatrixCodes =
  | readonly []
  | readonly [PureArchetypeCode]
  | readonly [PureArchetypeCode, PureArchetypeCode]

export type NormativeStatePresentation = Readonly<{
  persistedState: NormativeModifier
  suffix: ReturnType<typeof normFromNormativeModifier>
  publicLabel: ReturnType<typeof normativeDisplayAlias>
}>

export type WorldviewMapBaseline = Readonly<{
  source: "exact-foundation-payload"
  payloadVersion: SharePayload["v"]
  scoringCalibration: FoundationScoringCalibration
  provenance: FoundationCompletionRecord
  resolvedArchetype: Archetype | BlendArchetype
  normativeState: NormativeStatePresentation
  activeCellCodes:
    | readonly [PureArchetypeCode]
    | readonly [PureArchetypeCode, PureArchetypeCode]
  /**
   * Presentation-only leading mark for the existing FoundationMark API. It
   * must not change cell weight, blend code order, or matrix placement.
   */
  leadingPureCode: PureArchetypeCode
  dimensionScores: DimensionScores
  continuousProjection: Readonly<{
    version: typeof FIELD_PROJECTION_VERSION
    x: number
    y: number
    limitation: "posture-not-represented"
  }>
}>

function isBlendArchetype(
  archetype: Archetype | BlendArchetype,
): archetype is BlendArchetype {
  return "archetypes" in archetype
}

/** Return the one or two reference cells activated by a resolved Foundation. */
export function activeMatrixCodes(
  archetype: Archetype | BlendArchetype | null | undefined,
): ActiveMatrixCodes {
  if (!archetype) return []
  if (!isBlendArchetype(archetype)) return [archetype.code]

  const [first, second] = archetype.archetypes
  if (
    first.lens === second.lens ||
    first.posture !== archetype.posture ||
    second.posture !== archetype.posture
  ) {
    throw new Error(`Blend ${archetype.code} does not occupy one matrix row`)
  }

  return [first.code, second.code]
}

/**
 * Resolve Map identity exclusively from the saved Foundation token.
 *
 * Cached snapshot labels, family keys, modifiers, and scores are deliberately
 * ignored. Legacy payloads retain the compatibility resolver's preserved
 * encoded identity and provenance conventions; malformed tokens fail closed.
 */
export function resolveWorldviewMapBaseline(
  snapshot: FoundationSnapshot | null | undefined,
): WorldviewMapBaseline | null {
  if (!snapshot) return null

  const resolved = resolveFoundationPayload(snapshot.payload)
  if (!resolved) return null

  const calibration = getV2ScoringCalibration(resolved.scoringCalibration)
  const resolvedArchetype = resolveArchetype(
    resolved.result,
    calibration.lowDifferentiationThreshold,
  )
  const activeCellCodes = activeMatrixCodes(resolvedArchetype)
  if (activeCellCodes.length === 0) return null

  const leadingPureCode = isBlendArchetype(resolvedArchetype)
    ? resolvedArchetype.archetypes.find(
        ({ familyKey }) => familyKey === resolved.result.familyKey,
      )?.code
    : resolvedArchetype.code
  if (!leadingPureCode) return null

  const suffix = normFromNormativeModifier(resolved.result.normativeModifier)
  const continuousPosition = toMapPosition(resolved.dimensionScores)

  return {
    source: "exact-foundation-payload",
    payloadVersion: resolved.payload.v,
    scoringCalibration: resolved.scoringCalibration,
    provenance: resolved.provenance,
    resolvedArchetype,
    normativeState: {
      persistedState: resolved.result.normativeModifier,
      suffix,
      publicLabel: normativeDisplayAlias(suffix),
    },
    activeCellCodes,
    leadingPureCode,
    dimensionScores: resolved.dimensionScores,
    continuousProjection: {
      version: FIELD_PROJECTION_VERSION,
      x: continuousPosition.x,
      y: continuousPosition.y,
      limitation: "posture-not-represented",
    },
  }
}
