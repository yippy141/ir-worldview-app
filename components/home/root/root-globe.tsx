"use client"

import { useEffect, useRef, useState } from "react"
import type { RootGlobeVisual } from "@/lib/root/orthographic"
import type { GlobeScene } from "@/lib/root/globe-scenes"
const ROOT_REVOLUTION_MS = 140_000
import styles from "./root-globe.module.css"

export function RootGlobe({ visual, scenes, chinese = false }: { visual: RootGlobeVisual; scenes: GlobeScene[]; chinese?: boolean }) {
  const ROOT_SCENE_MS = ROOT_REVOLUTION_MS / scenes.length
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const clock = useRef(0)
  const pausedRef = useRef(false)
  const manual = useRef<(direction: number) => void>(() => {})
  const [paused, setPaused] = useState(false)
  const [sceneIndex, setSceneIndex] = useState(0)
  const scene = scenes[sceneIndex]
  useEffect(() => {
    const element = root.current!
    const media = matchMedia("(prefers-reduced-motion: reduce)")
    let inView = false, disposed = false, frame = 0, last = 0, announced = 0
    let paint: ReturnType<typeof import("./globe-runtime").createGlobePainter> = null
    const render = () => {
      const elapsed = clock.current % ROOT_REVOLUTION_MS
      const index = Math.floor(elapsed / ROOT_SCENE_MS)
      // Caption leads the new fill by 400ms. A paused scene freezes both clocks.
      const caption = Math.floor(((elapsed + 400) % ROOT_REVOLUTION_MS) / ROOT_SCENE_MS)
      if (caption !== announced) { announced = caption; setSceneIndex(caption) }
      const blend = clock.current < 1000 ? 1 : Math.min(1, (elapsed % ROOT_SCENE_MS) / 1000)
      paint?.(15 + elapsed / ROOT_REVOLUTION_MS * 360, scenes[index], scenes[(index + scenes.length - 1) % scenes.length], blend)
      element.dataset.longitude = String(15 + elapsed / ROOT_REVOLUTION_MS * 360)
    }
    const running = () => inView && !document.hidden && !pausedRef.current && !media.matches
    const tick = (time: number) => {
      if (!running() || disposed) { last = 0; return }
      if (last) clock.current += Math.min(time - last, 100)
      last = time
      render()
      frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      cancelAnimationFrame(frame); last = 0
      element.dataset.paused = String(!running())
      if (paint && running()) frame = requestAnimationFrame(tick)
    }
    const motionChange = () => { if (media.matches) { pausedRef.current = true; setPaused(true) }; sync() }
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting
      if (inView && !paint) void import("./globe-runtime").then(({ createGlobePainter }) => {
        if (disposed) return
        paint = createGlobePainter(canvas.current!)
        if (paint) { render(); element.dataset.enhanced = "true"; sync() }
      })
      sync()
    }, { threshold: .1 })
    observer.observe(element)
    manual.current = direction => {
      pausedRef.current = true; setPaused(true)
      const index = (Math.floor(clock.current / ROOT_SCENE_MS) + direction + scenes.length) % scenes.length
      clock.current = index * ROOT_SCENE_MS + 1000
      render(); sync()
    }
    const toggle = () => { sync(); render() }
    element.addEventListener("globe-toggle", toggle)
    document.addEventListener("visibilitychange", sync)
    media.addEventListener("change", motionChange)
    const resize = new ResizeObserver(render); resize.observe(element)
    motionChange()
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect()
      element.removeEventListener("globe-toggle", toggle)
      document.removeEventListener("visibilitychange", sync)
      media.removeEventListener("change", motionChange)
    }
  }, [scenes, ROOT_SCENE_MS])
  return <figure ref={root} className={styles.figure} data-root-globe data-scene={scene.id}>
    <div className={styles.art}>
      <svg className={styles.fallback} viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
        <circle cx="500" cy="500" r="445" fill="var(--bg-2)" stroke="var(--line-2)" />
        <path d={visual.graticule} fill="none" stroke="var(--line)" />
        <path d={visual.land} fill="var(--line-2)" />
        {visual.focus && <path d={visual.focus} fill="var(--steel)" />}
      </svg>
      <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
    </div>
    <figcaption className={styles.caption} lang={chinese ? "zh-Hans" : "en"}>
      <p className={styles.question}>{scene.question}</p>
      <div className={styles.key}>{scene.groups.map(group => <span key={group.label}><i data-color={group.color} />{group.label}</span>)}</div>
      <div className={styles.meta}><span>{scene.date}</span><details><summary>{chinese ? "来源" : "Source"}</summary><div className={styles.source}>
        <p>{chinese ? scene.kind === "Geographic focus" ? "地理范围。" : "有日期的关系记录。" : `${scene.kind}. `}{scene.note}</p>
        <p>{scene.places?.join(" · ")}</p>
        <p>{chinese ? "暗色陆地不在当前问题范围内。点表示小型地域的位置，大小不代表影响力。含174个地理要素的底图未包含某些领土和岛屿。" : "Muted land is outside this question. Points locate small places; sizes do not encode influence. The 174-feature basemap omits some territories and islands."}</p>
        {scene.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>)}
        <a href="https://github.com/yippy141/ir-worldview-app/blob/main/lib/world-stage/data/world-countries-110m.provenance.md">{chinese ? "地理数据与边界说明" : "Geometry and boundary cautions"}</a>
      </div></details></div>
    </figcaption>
    <div className={styles.controls}>
      <button type="button" onClick={() => manual.current(-1)} aria-label={chinese ? "上一场景" : "Previous globe scene"}>←</button>
      <button type="button" aria-pressed={paused} onClick={() => {
        pausedRef.current = !pausedRef.current; setPaused(pausedRef.current)
        root.current?.dispatchEvent(new Event("globe-toggle"))
      }}>{chinese ? (paused ? "播放" : "暂停") : paused ? "Play" : "Pause"}</button>
      <button type="button" onClick={() => manual.current(1)} aria-label={chinese ? "下一场景" : "Next globe scene"}>→</button>
    </div>
  </figure>
}
