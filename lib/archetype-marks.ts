import type { Archetype } from "@/lib/archetypes"

export const ARCHETYPE_MARK_VERSION = "v23-system-a-derived-1" as const
export const ARCHETYPE_MARK_VIEW_BOX = "0 0 100 100" as const
export const ARCHETYPE_MARK_MIN_PICTORIAL_SIZE = 32 as const
export const ARCHETYPE_MARK_DIRECTORY_SIZE = 48 as const
export const ARCHETYPE_MARK_HERO_SIZE = 112 as const

export type PureArchetypeCode = Archetype["code"]

type MarkPaint = Readonly<{
  fill?: "none" | "currentColor"
  stroke?: "currentColor"
  strokeWidth?: number
  strokeLinecap?: "butt" | "round"
  strokeLinejoin?: "miter" | "round"
}>

export type ArchetypeMarkNode =
  | Readonly<
      MarkPaint & {
        kind: "group"
        children: readonly ArchetypeMarkNode[]
      }
    >
  | Readonly<
      MarkPaint & {
        kind: "path"
        d: string
      }
    >
  | Readonly<
      MarkPaint & {
        kind: "circle"
        cx: number
        cy: number
        r: number
      }
    >

export type ArchetypeMarkDefinition = Readonly<{
  code: PureArchetypeCode
  viewBox: typeof ARCHETYPE_MARK_VIEW_BOX
  nodes: readonly ArchetypeMarkNode[]
}>

/**
 * The eight owner-selected System A marks, translated directly from the
 * supplied V23 manifest. They are independent editorial artworks rather than
 * generated lens bases or posture transforms.
 */
export const archetypeMarks = [
  {
    code: "P+",
    viewBox: ARCHETYPE_MARK_VIEW_BOX,
    nodes: [
      {
        kind: "group",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 3.6,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        children: [
          { kind: "path", d: "M34 18 L34 82" },
          { kind: "path", d: "M27 18 L41 18" },
          { kind: "path", d: "M27 82 L41 82" },
          { kind: "path", d: "M34 50 L74 20" },
          { kind: "path", d: "M34 50 L74 78" },
        ],
      },
    ],
  },
  {
    code: "P-",
    viewBox: ARCHETYPE_MARK_VIEW_BOX,
    nodes: [
      {
        kind: "group",
        fill: "currentColor",
        children: [
          {
            kind: "path",
            d: "M24 27 C38 25 54 24 66 24 C72 24 74.5 27.5 73.5 32.5 L67 63 C65.4 71 59 75.5 49 76.5 L48.4 72.8 C56 71.6 61 68 62.4 61.6 L68.4 33 C69 30.4 68 29.2 65.6 29.4 C54 30 39 30.8 24.6 32.6 Z",
          },
          {
            kind: "path",
            d: "M50 12 C53.5 12 56 14.5 55 18 C51 34 43 52 33 65 C30 68.6 26.5 70.8 23 71.6 L21.8 68 C25 66.6 28 64 30.4 60.6 C39.5 47 46 30.5 47.6 17.5 C47.9 14.4 48 12.6 50 12 Z",
          },
        ],
      },
    ],
  },
  {
    code: "R+",
    viewBox: ARCHETYPE_MARK_VIEW_BOX,
    nodes: [
      {
        kind: "group",
        fill: "none",
        stroke: "currentColor",
        strokeLinecap: "butt",
        children: [
          { kind: "circle", cx: 50, cy: 46, r: 30, strokeWidth: 1 },
          { kind: "circle", cx: 50, cy: 46, r: 24, strokeWidth: 3.2 },
          { kind: "path", d: "M14 70 L86 70", strokeWidth: 3.2 },
          { kind: "path", d: "M50 12 L50 70", strokeWidth: 3.2 },
        ],
      },
      { kind: "circle", cx: 50, cy: 46, r: 2.2, fill: "currentColor" },
    ],
  },
  {
    code: "R-",
    viewBox: ARCHETYPE_MARK_VIEW_BOX,
    nodes: [
      {
        kind: "group",
        fill: "none",
        stroke: "currentColor",
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        children: [
          { kind: "circle", cx: 50, cy: 50, r: 30, strokeWidth: 1 },
          {
            kind: "path",
            d: "M50 20 L78.5 40.7 L67.6 74.3 L32.4 74.3 L21.5 40.7 Z",
            strokeWidth: 3,
          },
        ],
      },
      {
        kind: "group",
        fill: "currentColor",
        children: [
          { kind: "circle", cx: 50, cy: 20, r: 2.4 },
          { kind: "circle", cx: 78.5, cy: 40.7, r: 2.4 },
          { kind: "circle", cx: 67.6, cy: 74.3, r: 2.4 },
          { kind: "circle", cx: 32.4, cy: 74.3, r: 2.4 },
          { kind: "circle", cx: 21.5, cy: 40.7, r: 2.4 },
        ],
      },
    ],
  },
  {
    code: "M+",
    viewBox: ARCHETYPE_MARK_VIEW_BOX,
    nodes: [
      {
        kind: "group",
        fill: "none",
        stroke: "currentColor",
        strokeLinejoin: "round",
        children: [
          {
            kind: "path",
            d: "M20 28 L80 28",
            strokeWidth: 4.6,
            strokeLinecap: "butt",
          },
          {
            kind: "path",
            d: "M30 28 C30 46 37 58 49 58 C59 58 63 50 58.5 44.5 C54 39 46.5 41.5 45 49.5 C41 68 58 80 82 74",
            strokeWidth: 3.6,
            strokeLinecap: "round",
          },
        ],
      },
    ],
  },
  {
    code: "M-",
    viewBox: ARCHETYPE_MARK_VIEW_BOX,
    nodes: [
      {
        kind: "group",
        fill: "currentColor",
        children: [
          {
            kind: "path",
            d: "M14 66 C27 54 40 48 52 48 C64 48 77 54 90 66 C77 58 64 54 52 54 C40 54 27 58 14 66 Z",
          },
          {
            kind: "path",
            d: "M29 18 C30 29 31.5 38 34.8 47.4 L30.8 48.8 C28.8 39 28 29 28 18.2 Z",
          },
          {
            kind: "path",
            d: "M50 12 C50 25 50.5 35 51.9 45.9 L48 46.8 C47.4 35.8 47.6 25 48.6 12.2 Z",
          },
          {
            kind: "path",
            d: "M71 18 C70.2 29 69 38.2 65.9 47.4 L69.7 48.9 C71.7 39.2 72.4 29 72.6 18.4 Z",
          },
        ],
      },
    ],
  },
  {
    code: "S+",
    viewBox: ARCHETYPE_MARK_VIEW_BOX,
    nodes: [
      {
        kind: "group",
        fill: "none",
        stroke: "currentColor",
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        children: [
          {
            kind: "path",
            d: "M22 18 L22 80 L86 80",
            strokeWidth: 2.8,
          },
          { kind: "path", d: "M22 30 L86 30", strokeWidth: 1.1 },
          {
            kind: "path",
            d: "M18 66 L22 66 M18 56 L22 56 M18 44 L22 44 M18 32 L22 32",
            strokeWidth: 1.1,
          },
          { kind: "path", d: "M34 80 L34 66", strokeWidth: 2.8 },
          { kind: "path", d: "M48 80 L48 56", strokeWidth: 2.8 },
          { kind: "path", d: "M62 80 L62 44", strokeWidth: 2.8 },
          { kind: "path", d: "M76 80 L76 32", strokeWidth: 2.8 },
        ],
      },
    ],
  },
  {
    code: "S-",
    viewBox: ARCHETYPE_MARK_VIEW_BOX,
    nodes: [
      {
        kind: "group",
        fill: "currentColor",
        children: [
          {
            kind: "path",
            d: "M28 14 L37 21 C25 35 24 58 35 71 C41 78.5 49 82.5 58 82 L58.5 92 C46 92.5 33 86 25 76 C11 58 12 31 28 14 Z",
          },
          { kind: "circle", cx: 66, cy: 42, r: 12.5 },
          {
            kind: "path",
            d: "M50 60 L84 72 L82.4 78 L48.4 66 Z",
          },
        ],
      },
    ],
  },
] as const satisfies readonly ArchetypeMarkDefinition[]

const ARCHETYPE_MARK_BY_CODE = new Map<PureArchetypeCode, ArchetypeMarkDefinition>(
  archetypeMarks.map((definition) => [definition.code, definition]),
)

export function getArchetypeMark(
  code: string,
): ArchetypeMarkDefinition | null {
  return ARCHETYPE_MARK_BY_CODE.get(code as PureArchetypeCode) ?? null
}

function serializePaint(paint: MarkPaint): string {
  const attributes: string[] = []
  if (paint.fill !== undefined) attributes.push(`fill="${paint.fill}"`)
  if (paint.stroke !== undefined) attributes.push(`stroke="${paint.stroke}"`)
  if (paint.strokeWidth !== undefined) {
    attributes.push(`stroke-width="${paint.strokeWidth}"`)
  }
  if (paint.strokeLinecap !== undefined) {
    attributes.push(`stroke-linecap="${paint.strokeLinecap}"`)
  }
  if (paint.strokeLinejoin !== undefined) {
    attributes.push(`stroke-linejoin="${paint.strokeLinejoin}"`)
  }
  return attributes.length > 0 ? ` ${attributes.join(" ")}` : ""
}

function serializeMarkNode(node: ArchetypeMarkNode): string {
  if (node.kind === "group") {
    return `<g${serializePaint(node)}>${node.children
      .map(serializeMarkNode)
      .join("")}</g>`
  }
  if (node.kind === "path") {
    return `<path d="${node.d}"${serializePaint(node)}/>`
  }
  return `<circle cx="${node.cx}" cy="${node.cy}" r="${node.r}"${serializePaint(node)}/>`
}

/** Canonical body serialization used to bind production JSX to the manifest. */
export function serializeArchetypeMarkBody(
  definition: ArchetypeMarkDefinition,
): string {
  return definition.nodes.map(serializeMarkNode).join("")
}
