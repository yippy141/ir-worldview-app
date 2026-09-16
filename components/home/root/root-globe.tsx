"use client"

import { GlobeControlIcon } from "./globe-control-icon"

import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { Link } from "@/i18n/navigation"
import { destinations } from "@/lib/navigation"
import { getGlobeCopy } from "@/content/root"
import type { RootGlobeVisual } from "@/lib/root/orthographic"
import { ROOT_REVOLUTION_MS, ROOT_SCENE_MS, type AlignmentScene } from "@/lib/root/globe-types"
import { DEFAULT_CAMERA, dragCamera, rotateCamera, zoomCamera, type GlobeCamera } from "@/lib/root/globe-camera"
import styles from "./root-globe.module.css"

type Controls = { pause: () => void; play: () => void; reset: () => void; zoom: (delta: number) => void; scene: (delta: number) => void; rotate: (x: number, y: number) => void }

export function RootGlobe({ visual, scenes, chinese = false }: { visual: RootGlobeVisual; scenes: AlignmentScene[]; chinese?: boolean }) {
  const copy = getGlobeCopy(chinese ? "zh-Hans" : "en")
  const root = useRef<HTMLElement>(null), art = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null)
  const controls = useRef<Controls | null>(null)
  const [paused, setPaused] = useState(false), [reduced, setReduced] = useState(false)
  const [sceneIndex, setSceneIndex] = useState(0), [touched, setTouched] = useState(false)
  const [inspected, setInspected] = useState<string | null>(null), [zoom, setZoom] = useState(1)
  const scene = scenes[sceneIndex]
  const inspectedPlace = visual.places.find(place => place.code === inspected)
  const inspectedGroup = scene.groups.find(group => group.countries.includes(inspected ?? ""))

  useEffect(() => {
    const element = root.current!, surface = art.current!, media = matchMedia("(prefers-reduced-motion: reduce)")
    let camera: GlobeCamera = { ...DEFAULT_CAMERA }, storyTime = 0, committed = 0, pausedCamera = media.matches
    let inView = false, disposed = false, loading = false, frame = 0, last = 0
    let painter: ReturnType<typeof import("./globe-runtime").createGlobePainter> = null
    let drag: { id: number; x: number; y: number; camera: GlobeCamera; moved: boolean } | null = null
    const running = () => inView && !document.hidden && !pausedCamera && !media.matches
    const render = () => {
      const index = Math.floor(storyTime / ROOT_SCENE_MS) % scenes.length
      // A title and its entire country state change in the same frame. Camera
      // orientation never comes from scene membership or the menu's open state.
      if (index !== committed) { committed = index; flushSync(() => setSceneIndex(index)) }
      painter?.paint(camera, scenes[index])
      element.dataset.longitude = String(camera.longitude)
      element.dataset.latitude = String(camera.latitude)
      element.dataset.zoom = String(camera.zoom)
    }
    const tick = (time: number) => {
      if (disposed || !running()) { last = 0; return }
      if (last) {
        const elapsed = Math.min(time - last, 100)
        storyTime = (storyTime + elapsed) % (ROOT_SCENE_MS * scenes.length)
        camera = rotateCamera(camera, elapsed / ROOT_REVOLUTION_MS * 360, 0)
      }
      last = time; render(); frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      cancelAnimationFrame(frame); last = 0
      element.dataset.paused = String(!running())
      if (painter && running()) frame = requestAnimationFrame(tick)
    }
    const pause = () => { pausedCamera = true; setPaused(true); sync() }
    const manual = () => { pause(); setTouched(true) }
    const changeZoom = (delta: number) => { manual(); camera = zoomCamera(camera, camera.zoom + delta); setZoom(camera.zoom); render() }
    const rotate = (x: number, y: number) => { manual(); camera = rotateCamera(camera, x, y); render() }
    const reset = () => { manual(); camera = { ...DEFAULT_CAMERA }; setZoom(camera.zoom); setInspected(null); render() }
    controls.current = {
      pause, reset, zoom: changeZoom, rotate,
      play: () => { if (!media.matches) { pausedCamera = false; setPaused(false); setInspected(null); sync() } },
      scene: delta => { pause(); storyTime = ((committed + delta + scenes.length) % scenes.length) * ROOT_SCENE_MS; render() },
    }
    const cancelDrag = (event?: PointerEvent) => {
      if (!drag || (event && event.pointerId !== drag.id)) return
      const id = drag.id; drag = null; element.dataset.dragging = "false"
      if (surface.hasPointerCapture(id)) surface.releasePointerCapture(id)
    }
    const down = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || !painter) return
      manual(); surface.focus({ preventScroll: true })
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, camera: { ...camera }, moved: false }
      surface.setPointerCapture(event.pointerId); element.dataset.dragging = "true"
    }
    const move = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y
      drag.moved ||= Math.hypot(dx, dy) > 4
      camera = dragCamera(drag.camera, dx, dy, surface.clientWidth); render()
    }
    const up = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return
      if (!drag.moved) {
        const box = surface.getBoundingClientRect()
        setInspected(painter?.inspect(camera, (event.clientX - box.x) / box.width * 1000, (event.clientY - box.y) / box.height * 1000) ?? "ocean")
      }
      cancelDrag(event) // Retain the last orientation; never restore an idle longitude.
    }
    const wheel = (event: WheelEvent) => {
      if (document.activeElement !== surface || event.ctrlKey) return
      event.preventDefault(); changeZoom(Math.sign(-event.deltaY) * .12)
    }
    const key = (event: KeyboardEvent) => {
      const step = event.shiftKey ? 20 : 7
      if (event.key === "ArrowLeft") rotate(-step, 0)
      else if (event.key === "ArrowRight") rotate(step, 0)
      else if (event.key === "ArrowUp") rotate(0, step)
      else if (event.key === "ArrowDown") rotate(0, -step)
      else if (event.key === "+" || event.key === "=") changeZoom(.2)
      else if (event.key === "-") changeZoom(-.2)
      else if (event.key === "Home") reset()
      else if (event.key === "Escape") { cancelDrag(); surface.blur(); return }
      else return // Tab, Shift+Tab and browser shortcuts leave normally.
      event.preventDefault()
    }
    const blur = () => cancelDrag()
    const motionChange = () => { setReduced(media.matches); if (media.matches) pause(); sync() }
    const visibility = () => { if (document.hidden) cancelDrag(); sync() }
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting
      if (inView && painter) render()
      if (inView && !painter && !loading) {
        loading = true
        void import("./globe-runtime").then(({ createGlobePainter }) => {
          if (disposed) return
          painter = createGlobePainter(canvas.current!)
          if (painter) { render(); element.dataset.enhanced = "true"; sync() }
        }).catch(() => { loading = false }) // The server still and semantic menu remain usable.
      }
      sync()
    }, { threshold: .1 })
    observer.observe(surface)
    const resize = new ResizeObserver(() => { if (inView && !document.hidden) render() }); resize.observe(surface)
    surface.addEventListener("pointerdown", down); surface.addEventListener("pointermove", move)
    surface.addEventListener("pointerup", up); surface.addEventListener("pointercancel", cancelDrag); surface.addEventListener("lostpointercapture", cancelDrag)
    surface.addEventListener("wheel", wheel, { passive: false }); surface.addEventListener("keydown", key)
    surface.addEventListener("blur", blur)
    document.addEventListener("visibilitychange", visibility); media.addEventListener("change", motionChange)
    window.addEventListener("beforeprint", pause)
    motionChange(); render()
    return () => {
      disposed = true; cancelAnimationFrame(frame); cancelDrag(); observer.disconnect(); resize.disconnect(); controls.current = null
      surface.removeEventListener("pointerdown", down); surface.removeEventListener("pointermove", move)
      surface.removeEventListener("pointerup", up); surface.removeEventListener("pointercancel", cancelDrag); surface.removeEventListener("lostpointercapture", cancelDrag)
      surface.removeEventListener("wheel", wheel); surface.removeEventListener("keydown", key); surface.removeEventListener("blur", blur)
      document.removeEventListener("visibilitychange", visibility); media.removeEventListener("change", motionChange); window.removeEventListener("beforeprint", pause)
    }
  }, [scenes])

  return <figure ref={root} className={styles.figure} data-root-globe data-mode="imagined" data-scene={scene.id}>
    <div ref={art} className={styles.art} tabIndex={0} role="group" aria-label={copy.globe} aria-describedby="globe-instructions">
      <svg className={styles.fallback} viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
        <circle cx="500" cy="500" r="445" fill="var(--bg-2)" stroke="var(--line-2)" />
        <path d={visual.graticule} fill="none" stroke="var(--line)" />
        <path d={visual.land} fill="var(--line-2)" />
        {visual.groups.map(group => <path key={group.color} d={group.path} fill={group.fill} stroke="var(--bg-2)" strokeWidth=".9" />)}
      </svg>
      <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
      {!touched && <span className={styles.hint}>{copy.drag}</span>}
    </div>
    <figcaption className={styles.caption}>
      <h2 className={styles.title}>{scene.title}</h2>
      <p className={styles.label}>{copy.label}</p>
      <div className={styles.key}>{scene.groups.filter(group => group.color !== "muted").map(group => <span key={group.color}><i data-color={group.color} />{copy.groups[group.color]}</span>)}</div>
    </figcaption>
    <div className={styles.controls}>
      <button type="button" onClick={() => controls.current?.scene(-1)} aria-label={copy.previous}><GlobeControlIcon kind="previous" /></button>
      <button type="button" aria-pressed={paused} disabled={reduced} title={reduced ? copy.reduced : undefined} onClick={() => paused ? controls.current?.play() : controls.current?.pause()}>{paused ? copy.play : copy.pause}</button>
      <button type="button" onClick={() => controls.current?.scene(1)} aria-label={copy.next}><GlobeControlIcon kind="next" /></button>
      <span className={styles.controlDivider} />
      <button type="button" disabled={zoom <= 1} onClick={() => controls.current?.zoom(-.2)} aria-label={copy.zoomOut}><GlobeControlIcon kind="out" /></button>
      <button type="button" disabled={zoom >= 2.4} onClick={() => controls.current?.zoom(.2)} aria-label={copy.zoomIn}><GlobeControlIcon kind="in" /></button>
      <button type="button" onClick={() => controls.current?.reset()}>{copy.reset}</button>
    </div>
    <p className={styles.inspected} role="status">{inspected ? inspectedPlace && inspectedGroup ? `${inspectedPlace.name} · ${copy.groups[inspectedGroup.color]}` : copy.ocean : ""}</p>
    <details className={styles.about} id="map-details" onToggle={event => { if (event.currentTarget.open) controls.current?.pause() }} onFocus={() => controls.current?.pause()}>
      <summary>{copy.about}</summary>
      <p>{copy.explanation}</p>
      <p id="globe-instructions">{copy.instructions}</p>
      <label className={styles.placeSelect}>{copy.inspect}<select value={inspectedPlace?.code ?? ""} onChange={event => { controls.current?.pause(); setInspected(event.currentTarget.value) }}>
        <option value="">{copy.choose}</option>{visual.places.map(place => <option key={place.code} value={place.code}>{place.name}</option>)}
      </select></label>
      <div className={styles.manualControls}>
        {([[copy.west, -15, 0], [copy.east, 15, 0], [copy.north, 0, 10], [copy.south, 0, -10]] as const).map(([label, x, y]) => <button key={label} type="button" onClick={() => controls.current?.rotate(x, y)}>{label}</button>)}
      </div>
      <p>{copy.geometry}</p>
      <a href="https://github.com/yippy141/ir-worldview-app/blob/main/lib/world-stage/data/world-countries-110m.provenance.md">{copy.attribution}</a>
      <Link href={destinations.worldStage.href} prefetch={false}>{copy.mapLink}</Link>
    </details>
  </figure>
}
