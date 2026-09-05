"use client"

import { useEffect, useId, useRef } from "react"
import { FoundationMark } from "@/components/archetypes/archetype-mark"
import { getArchetypeMark, type ArchetypeMarkNode } from "@/lib/archetype-marks"
import styles from "./payoff.module.css"

// Experiment-only drawing guides. The canonical filled/stroked silhouettes below
// remain authoritative. These are contemporary editorial timings, not script rules.
const guides = {
  shi: [
    { d: "M23 29.5 Q44 26.5 66.5 26.8 Q73 27 71 34 L65 62 Q63 72 48 75", width: 12, start: 80, duration: 600 },
    { d: "M51 12 Q54 23 43 45 Q33 66 22 70", width: 12, start: 770, duration: 560 },
  ],
  concert: [
    { d: "M50 20 A30 30 0 1 1 49.99 20", width: 4, start: 80, duration: 600 },
    { d: "M50 20 L78.5 40.7 L67.6 74.3 L32.4 74.3 L21.5 40.7 Z", width: 8, start: 250, duration: 1080 },
  ],
  stewardship: [
    { d: "M42 17 H23 V75 H43", width: 6, start: 80, duration: 530 },
    { d: "M58 83 H77 V25 H57", width: 6, start: 440, duration: 530 },
    { d: "M36 42 H64 M36 58 H64", width: 6, start: 1060, duration: 270 },
  ],
}
// Original offset enclosure with two openings and two internal rails. It belongs
// only to the Stewardship display hypothesis, not the issued AI or IR registries.
const stewardship: ArchetypeMarkNode[] = [{ kind: "group", fill: "none", stroke: "currentColor", strokeWidth: 2.8, strokeLinecap: "butt", strokeLinejoin: "miter", children: guides.stewardship.map(g => ({ kind: "path", d: g.d })) }]
function Nodes({ nodes }: { nodes: readonly ArchetypeMarkNode[] }) {
  return nodes.map((node, i) => {
    const paint = { fill: node.fill, stroke: node.stroke, strokeWidth: node.strokeWidth, strokeLinecap: node.strokeLinecap, strokeLinejoin: node.strokeLinejoin }
    if (node.kind === "group") return <g key={i} {...paint}><Nodes nodes={node.children} /></g>
    if (node.kind === "path") return <path key={i} d={node.d} {...paint} />
    return <circle key={i} cx={node.cx} cy={node.cy} r={node.r} {...paint} />
  })
}
function DrawnMark({ mark, enhanced = false }: { mark: keyof typeof guides; enhanced?: boolean }) {
  const unique = useId().replace(/:/g, "")
  const nodes = mark === "stewardship" ? stewardship : getArchetypeMark(mark === "shi" ? "P-" : "R-")!.nodes
  const masks = guides[mark]
  // Split only where the canonical geometry warrants it: Shi's two filled paths,
  // Concert's boundary vs polygon/terminals, Stewardship's opposed enclosure/rails.
  const groups = mark === "shi" ? (nodes[0] as Extract<ArchetypeMarkNode, { kind: "group" }>).children.map(child => [{ kind: "group", fill: "currentColor", children: [child] }] as ArchetypeMarkNode[])
    : mark === "concert" ? [
      [{ kind: "group", fill: "none", stroke: "currentColor", children: [(nodes[0] as Extract<ArchetypeMarkNode, { kind: "group" }>).children[0]] }] as ArchetypeMarkNode[],
      [{ ...nodes[0], children: [(nodes[0] as Extract<ArchetypeMarkNode, { kind: "group" }>).children[1]] }, nodes[1]] as ArchetypeMarkNode[],
    ] : (stewardship[0] as Extract<ArchetypeMarkNode, { kind: "group" }>).children.map(child => [{ ...stewardship[0], children: [child] }] as ArchetypeMarkNode[])
  return <svg viewBox="0 0 100 100" width="176" height="176" aria-hidden="true" focusable="false" data-drawn-mark={mark}>
    {enhanced ? <><defs>{masks.map((guide, i) => <mask key={i} id={`${unique}-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><path d={guide.d} fill="none" stroke="white" strokeWidth={guide.width} strokeLinecap="round" strokeLinejoin="round" pathLength="100" strokeDasharray="100" data-stroke-mask data-start={guide.start} data-duration={guide.duration} /></mask>)}</defs>
      {groups.map((group, i) => <g key={i} mask={`url(#${unique}-${i})`}><Nodes nodes={group} /></g>)}
    </> : <Nodes nodes={nodes} />}
  </svg>
}
export function HeroMarks({ instrument }: { instrument: "foundation" | "ai" }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = root.current!
    const media = matchMedia("(prefers-reduced-motion: reduce)")
    let animations: Animation[] = []
    let timer: ReturnType<typeof setTimeout> | undefined
    let frame = 0
    let finishing = false
    const finish = () => {
      if (finishing) return
      finishing = true
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      element.dataset.motion = "complete"
      const previous = animations; animations = []
      previous.forEach(animation => animation.cancel())
      finishing = false
    }
    const start = () => {
      finish()
      if (media.matches || document.hidden || !element.animate) return
      element.dataset.motion = "drawing"
      animations = [...element.querySelectorAll<SVGPathElement>("[data-stroke-mask]")].map(path => path.animate(
        [{ strokeDashoffset: "100" }, { strokeDashoffset: "0" }],
        { delay: Number(path.dataset.start), duration: Number(path.dataset.duration), easing: "linear", fill: "both" },
      ))
      // A complete underpainting remains visible even during the authored reveal.
      animations.push(element.querySelector("[data-mark-base]")!.animate(
        [{ opacity: 1 }, { opacity: .42, offset: .12 }, { opacity: .42, offset: .88 }, { opacity: 1 }],
        { duration: 1400, easing: "linear" },
      ))
      animations.forEach(animation => animation.addEventListener("cancel", () => { if (animations.includes(animation)) finish() }, { once: true }))
      timer = setTimeout(finish, 1400)
    }
    frame = requestAnimationFrame(start)
    const hidden = () => { if (document.hidden) finish() }
    window.addEventListener("result-payoff:replay-marks", start)
    window.addEventListener("pagehide", finish)
    window.addEventListener("beforeprint", finish)
    document.addEventListener("visibilitychange", hidden)
    media.addEventListener("change", finish)
    return () => { finish(); window.removeEventListener("result-payoff:replay-marks", start); window.removeEventListener("pagehide", finish); window.removeEventListener("beforeprint", finish); document.removeEventListener("visibilitychange", hidden); media.removeEventListener("change", finish) }
  }, [])
  return <div ref={root} className={styles.markComposition} data-hero-marks={instrument} data-motion="unstarted">
    <div className={styles.markBase} data-mark-base>{instrument === "foundation" ? <FoundationMark code="P/R-" primaryCode="R-" presentation="hero" /> : <DrawnMark mark="stewardship" />}</div>
    <div className={styles.markOverlay} aria-hidden="true">{instrument === "foundation" ? <div className={styles.drawnPair}><DrawnMark mark="shi" enhanced /><span>/</span><DrawnMark mark="concert" enhanced /></div> : <DrawnMark mark="stewardship" enhanced />}</div>
  </div>
}
export function ReplayMarks() {
  return <button className="payoff-dynamic" type="button" onClick={() => window.dispatchEvent(new Event("result-payoff:replay-marks"))}>Replay animation</button>
}
