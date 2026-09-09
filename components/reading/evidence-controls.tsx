"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"
const subscribe = () => () => {}

/** Optional reading convenience. Default evidence remains server rendered. */
export function EvidenceControls() {
  const enhanced = useSyncExternalStore(subscribe, () => true, () => false)
  const controls = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let previous: Array<[HTMLDetailsElement, boolean]> = []
    const before = () => {
      if (previous.length) return
      previous = Array.from(controls.current?.closest("article")?.querySelectorAll("details") ?? []).map(detail => [detail, detail.open])
      previous.forEach(([detail]) => { detail.open = true })
    }
    const after = () => { previous.forEach(([detail, open]) => { detail.open = open }); previous = [] }
    window.addEventListener("beforeprint", before)
    window.addEventListener("afterprint", after)
    return () => { window.removeEventListener("beforeprint", before); window.removeEventListener("afterprint", after); after() }
  }, [])
  if (!enhanced) return null
  return <div className="reading-controls" ref={controls}>
    <button type="button" className="cta-secondary" onClick={(event) => {
      const article = event.currentTarget.closest("article")
      article?.querySelectorAll("details").forEach((detail) => { detail.open = true })
    }}>Expand evidence for reading</button>
    <button type="button" className="cta-secondary" onClick={() => window.print()}>Print this reading</button>
  </div>
}
