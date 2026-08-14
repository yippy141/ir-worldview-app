import type {
  Archetype,
  LensCode,
  PostureSign,
} from "@/lib/archetypes"

export const SIGIL_GEOMETRY_VERSION = "v23.1b-geometry-v1" as const
export const SIGIL_VIEW_BOX = "0 0 24 24" as const
export const SIGIL_STROKE = "currentColor" as const
export const SIGIL_FILL = "none" as const
export const SIGIL_STROKE_WIDTH = 1.75 as const
export const SIGIL_STROKE_LINECAP = "round" as const
export const SIGIL_STROKE_LINEJOIN = "round" as const

export type PureArchetypeCode = Archetype["code"]
export type SigilPoint = readonly [x: number, y: number]

export type SigilPrimitive =
  | Readonly<{ kind: "line"; from: SigilPoint; to: SigilPoint }>
  | Readonly<{ kind: "path"; d: string }>

export type PostureAnchor = Readonly<{
  point: SigilPoint
  outward: SigilPoint
}>

export type LensSigilBase = Readonly<{
  lens: LensCode
  viewBox: typeof SIGIL_VIEW_BOX
  primitives: readonly SigilPrimitive[]
  postureAnchors: readonly [PostureAnchor, PostureAnchor]
}>

export type PostureTransform = Readonly<{
  posture: PostureSign
  operation: "project" | "contain"
  extension: number
}>

export type SigilDefinition = Readonly<{
  code: PureArchetypeCode
  lens: LensCode
  posture: PostureSign
  viewBox: typeof SIGIL_VIEW_BOX
  fill: typeof SIGIL_FILL
  stroke: typeof SIGIL_STROKE
  strokeWidth: typeof SIGIL_STROKE_WIDTH
  strokeLinecap: typeof SIGIL_STROKE_LINECAP
  strokeLinejoin: typeof SIGIL_STROKE_LINEJOIN
  primitives: readonly SigilPrimitive[]
}>

const SIGIL_CENTER: SigilPoint = [12, 12]

function point(x: number, y: number): SigilPoint {
  return [x, y]
}

function line(from: SigilPoint, to: SigilPoint): SigilPrimitive {
  return { kind: "line", from, to }
}

function path(d: string): SigilPrimitive {
  return { kind: "path", d }
}

function anchor(pointValue: SigilPoint, outward: SigilPoint): PostureAnchor {
  return { point: pointValue, outward }
}

/**
 * The four neutral lens topologies. Posture is intentionally absent here:
 * both marks in a lens family are derived from the same base.
 */
export const lensSigilBases = [
  {
    lens: "P",
    viewBox: SIGIL_VIEW_BOX,
    primitives: [
      line(point(7, 5), point(7, 19)),
      line(point(17, 5), point(17, 19)),
      line(point(7, 10), point(17, 10)),
    ],
    postureAnchors: [
      anchor(point(7, 5), point(0, -1)),
      anchor(point(17, 5), point(0, -1)),
    ],
  },
  {
    lens: "R",
    viewBox: SIGIL_VIEW_BOX,
    primitives: [
      line(point(5, 8), point(19, 8)),
      line(point(19, 8), point(19, 10.5)),
      line(point(5, 16), point(19, 16)),
      line(point(5, 13.5), point(5, 16)),
    ],
    postureAnchors: [
      anchor(point(5, 8), point(-1, 0)),
      anchor(point(19, 16), point(1, 0)),
    ],
  },
  {
    lens: "M",
    viewBox: SIGIL_VIEW_BOX,
    primitives: [
      path("M 9 5 C 9 7 5 8 5 12 C 5 16 9 17 9 19"),
      path("M 15 5 C 15 7 19 8 19 12 C 19 16 15 17 15 19"),
    ],
    postureAnchors: [
      anchor(point(9, 5), point(0, -1)),
      anchor(point(15, 5), point(0, -1)),
    ],
  },
  {
    lens: "S",
    viewBox: SIGIL_VIEW_BOX,
    primitives: [
      line(point(4, 8), point(20, 8)),
      line(point(4, 12), point(20, 12)),
      line(point(4, 16), point(20, 16)),
      line(point(9, 5), point(9, 7)),
      line(point(9, 9), point(9, 11)),
      line(point(9, 13), point(9, 15)),
      line(point(9, 17), point(9, 19)),
    ],
    postureAnchors: [
      anchor(point(9, 5), point(0, -1)),
      anchor(point(9, 19), point(0, 1)),
    ],
  },
] as const satisfies readonly LensSigilBase[]

/** The only two posture operations in the grammar. */
export const postureTransforms = [
  { posture: "+", operation: "project", extension: 2 },
  { posture: "-", operation: "contain", extension: 2 },
] as const satisfies readonly PostureTransform[]

function addScaled(
  origin: SigilPoint,
  direction: SigilPoint,
  distance: number,
): SigilPoint {
  return [
    origin[0] + direction[0] * distance,
    origin[1] + direction[1] * distance,
  ]
}

function dot(left: SigilPoint, right: SigilPoint): number {
  return left[0] * right[0] + left[1] * right[1]
}

function directionTowardCenter(anchorValue: PostureAnchor): SigilPoint {
  const [outwardX, outwardY] = anchorValue.outward
  const candidates = [
    point(-outwardY, outwardX),
    point(outwardY, -outwardX),
  ] as const
  const centerVector = point(
    SIGIL_CENTER[0] - anchorValue.point[0],
    SIGIL_CENTER[1] - anchorValue.point[1],
  )

  return dot(candidates[0], centerVector) >= dot(candidates[1], centerVector)
    ? candidates[0]
    : candidates[1]
}

function transformAnchor(
  anchorValue: PostureAnchor,
  transform: PostureTransform,
): SigilPrimitive {
  const direction =
    transform.operation === "project"
      ? anchorValue.outward
      : directionTowardCenter(anchorValue)

  return line(
    anchorValue.point,
    addScaled(anchorValue.point, direction, transform.extension),
  )
}

function deriveSigilDefinition(
  base: LensSigilBase,
  transform: PostureTransform,
): SigilDefinition {
  return {
    code: `${base.lens}${transform.posture}` as PureArchetypeCode,
    lens: base.lens,
    posture: transform.posture,
    viewBox: SIGIL_VIEW_BOX,
    fill: SIGIL_FILL,
    stroke: SIGIL_STROKE,
    strokeWidth: SIGIL_STROKE_WIDTH,
    strokeLinecap: SIGIL_STROKE_LINECAP,
    strokeLinejoin: SIGIL_STROKE_LINEJOIN,
    primitives: [
      ...base.primitives,
      ...base.postureAnchors.map((postureAnchor) =>
        transformAnchor(postureAnchor, transform),
      ),
    ],
  }
}

/** Rebuilds the manifest from the four bases and two transforms. */
export function deriveArchetypeSigils(): readonly SigilDefinition[] {
  return lensSigilBases.flatMap((base) =>
    postureTransforms.map((transform) =>
      deriveSigilDefinition(base, transform),
    ),
  )
}

/** The exact eight pure-code definitions, in canonical P/R/M/S then +/- order. */
export const archetypeSigils = deriveArchetypeSigils()

const SIGIL_BY_CODE = new Map<PureArchetypeCode, SigilDefinition>(
  archetypeSigils.map((definition) => [definition.code, definition]),
)

export function getArchetypeSigil(code: string): SigilDefinition | null {
  return SIGIL_BY_CODE.get(code as PureArchetypeCode) ?? null
}

function serializePoint(pointValue: SigilPoint): string {
  return `${pointValue[0]},${pointValue[1]}`
}

function serializePrimitive(primitive: SigilPrimitive): string {
  return primitive.kind === "line"
    ? `line:${serializePoint(primitive.from)}>${serializePoint(primitive.to)}`
    : `path:${primitive.d}`
}

/** Canonical render-geometry serialization for uniqueness and review binding. */
export function serializeSigilDefinition(
  definition: SigilDefinition,
): string {
  return [
    `code:${definition.code}`,
    `lens:${definition.lens}`,
    `posture:${definition.posture}`,
    `viewBox:${definition.viewBox}`,
    `fill:${definition.fill}`,
    `stroke:${definition.stroke}`,
    `strokeWidth:${definition.strokeWidth}`,
    `strokeLinecap:${definition.strokeLinecap}`,
    `strokeLinejoin:${definition.strokeLinejoin}`,
    `primitives:${definition.primitives.map(serializePrimitive).join(";")}`,
  ].join("|")
}

function serializeBase(base: LensSigilBase): string {
  return [
    `lens:${base.lens}`,
    `viewBox:${base.viewBox}`,
    `primitives:${base.primitives.map(serializePrimitive).join(";")}`,
    `anchors:${base.postureAnchors
      .map(
        (postureAnchor) =>
          `${serializePoint(postureAnchor.point)}>${serializePoint(postureAnchor.outward)}`,
      )
      .join(";")}`,
  ].join("|")
}

function serializeTransform(transform: PostureTransform): string {
  return [
    `posture:${transform.posture}`,
    `operation:${transform.operation}`,
    `extension:${transform.extension}`,
  ].join("|")
}

/**
 * Canonical input for the collision-review geometry digest. It binds the
 * construction grammar as well as all eight rendered output definitions.
 */
export function serializeSigilGrammar(): string {
  return [
    `version:${SIGIL_GEOMETRY_VERSION}`,
    `bases:${lensSigilBases.map(serializeBase).join("||")}`,
    `transforms:${postureTransforms.map(serializeTransform).join("||")}`,
    `definitions:${archetypeSigils
      .map(serializeSigilDefinition)
      .join("||")}`,
  ].join("\n")
}

export const SIGIL_GEOMETRY_DIGEST_INPUT = serializeSigilGrammar()
