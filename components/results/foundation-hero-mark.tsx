"use client"

import { useId } from "react"
import { FoundationMark, type FoundationMarkProps } from "@/components/archetypes/archetype-mark"
import { getArchetypeMark, type ArchetypeMarkNode } from "@/lib/archetype-marks"
import { getArchetypeByCode } from "@/lib/archetypes"
import styles from "./foundation-hero-mark.module.css"

// Authored brush routes reveal filled silhouettes without changing their geometry.
// Each route follows the actual stroke; none is a radial wipe over the artboard.
const filledGuides: Record<string, Array<{ d: string; width: number }>> = {
  "P-": [
    { d: "M23 29.5 Q44 26.5 66.5 26.8 Q73 27 71 34 L65 62 Q63 72 48 75", width: 12 },
    { d: "M51 12 Q54 23 43 45 Q33 66 22 70", width: 12 },
  ],
  "M-": [
    { d: "M13 67 Q52 35 91 67", width: 12 },
    { d: "M28.5 17 Q29 33 33 49", width: 8 },
    { d: "M49 11 Q49 31 50 48", width: 8 },
    { d: "M72 17 Q72 34 68 49", width: 8 },
  ],
  "S-": [
    { d: "M33 16 C10 45 17 86 59 87", width: 15 },
    { d: "M52 42 H80", width: 26 },
    { d: "M48 62 L85 76", width: 9 },
  ],
}

type Leaf = Exclude<ArchetypeMarkNode, { kind: "group" }>
function flatten(nodes: readonly ArchetypeMarkNode[], inherited = {}): Leaf[] {
  return nodes.flatMap(node => {
    const { kind, ...paint } = node
    return kind === "group" ? flatten(node.children, { ...inherited, ...paint }) : [{ ...inherited, ...node } as Leaf]
  })
}
function Artwork({ node }: { node: Leaf }) {
  const paint = { fill: node.fill, stroke: node.stroke, strokeWidth: node.strokeWidth, strokeLinecap: node.strokeLinecap, strokeLinejoin: node.strokeLinejoin }
  return node.kind === "circle" ? <circle cx={node.cx} cy={node.cy} r={node.r} {...paint} /> : <path d={node.d} {...paint} />
}
function DrawnMark({ code }: { code: string }) {
  const unique = useId().replace(/:/g, "")
  const nodes = flatten(getArchetypeMark(code)!.nodes)
  let filledIndex = 0
  const segments = nodes.flatMap(node => node.kind === "path" && node.fill !== "currentColor"
    ? (node.d.match(/M[^M]+/g) ?? [node.d]).map(d => ({ ...node, d })) : [node])
  return <svg viewBox="0 0 100 100" width="176" height="176" aria-hidden="true" focusable="false" data-drawn-mark={code}>
    {segments.map((node, index) => {
      // Stagger the construction, finishing all marks at the same time.
      const start = 200 + index * Math.min(120, 700 / segments.length)
      const timing = { "data-draw": true, "data-start": start, "data-duration": 1600 - start }
      if (node.fill === "currentColor") {
        const guide = filledGuides[code]?.[filledIndex++] ?? (node.kind === "circle" ? { d: `M${node.cx - node.r} ${node.cy} H${node.cx + node.r}`, width: node.r * 2 + 1 } : null)
        if (!guide) return <Artwork key={index} node={node} />
        return <g key={index}>
          <defs><mask id={`${unique}-${index}`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><path d={guide.d} stroke="white" fill="none" strokeWidth={guide.width} strokeLinecap="round" strokeLinejoin="round" {...timing} /></mask></defs>
          <g mask={`url(#${unique}-${index})`}><Artwork node={node} /></g>
        </g>
      }
      const paint = { fill: node.fill, stroke: node.stroke, strokeWidth: node.strokeWidth, strokeLinecap: node.strokeLinecap, strokeLinejoin: node.strokeLinejoin }
      return node.kind === "circle" ? <circle key={index} cx={node.cx} cy={node.cy} r={node.r} {...paint} {...timing} /> : <path key={index} d={node.d} {...paint} {...timing} />
    })}
  </svg>
}
export function FoundationHeroMark({ payload, ...props }: FoundationMarkProps & { payload: string }) {
  const resolved = getArchetypeByCode(props.code)
  const codes = resolved && "archetypes" in resolved ? resolved.archetypes.map(mark => mark.code) : [props.code]
  return <div className={styles.markComposition} data-foundation-hero-marks={props.code} data-result-payload-present={Boolean(payload)}>
    <div className={styles.markBase} data-mark-base><FoundationMark {...props} presentation="hero" /></div>
    <div className={styles.markOverlay} data-mark-overlay aria-hidden="true"><div className={styles.drawnPair}>{codes.map((code, index) => <span className={styles.pairPart} key={code}>{index > 0 && <span className={styles.connector}>/</span>}<DrawnMark code={code} /></span>)}</div></div>
  </div>
}
