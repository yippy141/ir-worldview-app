"use client"

import { useEffect } from "react"
import { flushSync } from "react-dom"

/** Clear even when the browser keeps a full document in its back/forward cache. */
export function useClearOnExit(clear: () => void) {
  useEffect(() => {
    const onHide = () => flushSync(clear)
    const onShow = (event: PageTransitionEvent) => { if (event.persisted) flushSync(clear) }
    window.addEventListener("pagehide", onHide)
    window.addEventListener("pageshow", onShow)
    return () => { window.removeEventListener("pagehide", onHide); window.removeEventListener("pageshow", onShow) }
  }, [clear])
}
