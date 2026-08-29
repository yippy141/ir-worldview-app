"use client"

import { useEffect } from "react"

const SELECTOR = "[data-scroll-section]"

/**
 * A reveal transition and nothing else.
 *
 * The document already renders every section fully visible. This attaches the
 * pending state only after script runs, so a reader without script, or with a
 * reduced-motion preference, sees the finished page instead of an empty one.
 * There is no scroll capture, no pinning, and no scroll-driven position.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const sections = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR))
    if (sections.length === 0) return

    for (const section of sections) section.dataset.reveal = "pending"

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const target = entry.target as HTMLElement
          target.dataset.reveal = "shown"
          observer.unobserve(target)
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    )

    for (const section of sections) observer.observe(section)

    return () => {
      observer.disconnect()
      for (const section of sections) delete section.dataset.reveal
    }
  }, [])

  return null
}
