"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { consumeFreshResult, type ResultDomain } from "@/lib/results/fresh-foundation-result"
import styles from "./result-reveal.module.css"

/** A completed server render enhanced only by a matching submission in page memory. */
export function ResultReveal({ domain, payload, children }: { domain: ResultDomain; payload: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const completion = useRef<{ payload: string; fresh: boolean } | null>(null)
  const replay = useRef<() => void>(() => {})
  useEffect(() => {
    const element = root.current!
    const media = matchMedia("(prefers-reduced-motion: reduce)")
    let animations: Animation[] = []
    let timer: ReturnType<typeof setTimeout> | undefined
    let frame = 0
    const finish = () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      element.dataset.motion = "complete"
      animations.forEach(animation => animation.cancel())
      animations = []
    }
    const start = () => {
      finish()
      if (media.matches || document.hidden || !element.animate) return
      try {
      element.querySelectorAll<SVGGeometryElement>("[data-draw]").forEach(path => {
        const length = path.getTotalLength()
        const start = Number(path.dataset.start ?? 200)
        const duration = Number(path.dataset.duration ?? 1100)
        animations.push(path.animate([
          { strokeDasharray: `${length} ${length}`, strokeDashoffset: `${length}` },
          { strokeDasharray: `${length} ${length}`, strokeDashoffset: "0" },
        ], { delay: start, duration, fill: "both", easing: "linear" }))
      })
      element.querySelectorAll<SVGElement>("[data-deposit]").forEach(dot => animations.push(dot.animate(
        [{ opacity: 0 }, { opacity: 1 }], { delay: Number(dot.dataset.start ?? 700), duration: 180, fill: "both" },
      )))
      // Hide the canonical base only after every enhancement starts successfully.
      element.dataset.motion = "drawing"
      timer = setTimeout(finish, 2000)
      } catch { finish() }
    }
    // Consume in an effect, once per mounted payload. Strict Mode's rehearsal
    // cancels the scheduled frame and reschedules it with the same decision.
    if (completion.current?.payload !== payload) completion.current = { payload, fresh: consumeFreshResult(domain, payload) }
    if (completion.current.fresh) frame = requestAnimationFrame(start)
    element.dataset.ready = "true"
    replay.current = () => {
      // Replay used to run above the viewport when a tall introduction scrolled
      // its trailing button into view. Bring the existing mark into view first.
      if (media.matches) return
      const mark = element.querySelector("[data-foundation-hero-marks], [data-ai-mark], [data-domain-mark]")
      const box = mark?.getBoundingClientRect()
      if (box && (box.top < 0 || box.bottom > window.innerHeight)) mark?.scrollIntoView({ block: "center", behavior: "instant" })
      start()
    }
    const hidden = () => { if (document.hidden) finish() }
    window.addEventListener("pagehide", finish)
    window.addEventListener("beforeprint", finish)
    document.addEventListener("visibilitychange", hidden)
    media.addEventListener("change", finish)
    return () => {
      finish()
      window.removeEventListener("pagehide", finish)
      window.removeEventListener("beforeprint", finish)
      document.removeEventListener("visibilitychange", hidden)
      media.removeEventListener("change", finish)
      replay.current = () => {}
    }
  }, [domain, payload])
  return <div ref={root} className={styles.reveal} data-result-reveal={domain} data-motion="complete">
    <button className={styles.replay} type="button" onClick={() => replay.current()} aria-label={`Replay ${domain === "ai" ? "AI" : domain} reveal`}>Replay reveal</button>
    {children}
    <svg className={styles.rule} viewBox="0 0 1000 2" preserveAspectRatio="none" aria-hidden="true"><path d="M0 1H1000" data-draw data-start="1600" data-duration="350" stroke="currentColor" strokeWidth="1" /></svg>
  </div>
}
