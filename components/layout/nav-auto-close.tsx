"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function NavAutoClose() {
  const pathname = usePathname()

  useEffect(() => {
    const getDisclosures = () =>
      Array.from(
        document.querySelectorAll<HTMLDetailsElement>(".header-nav .nav-disclosure, details.mobile-nav")
      )

    const closeAll = (except?: HTMLDetailsElement) => {
      getDisclosures().forEach((el) => {
        if (el !== except) {
          el.open = false
        }
      })
    }

    const disclosures = getDisclosures()

    const handlers = disclosures.map((el) => {
      const handler = () => {
        if (el.open) {
          closeAll(el)
        }
      }
      el.addEventListener("toggle", handler)
      return { el, handler }
    })

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return

      getDisclosures().forEach((el) => {
        if (el.open && !el.contains(target)) {
          el.open = false
        }
      })
    }

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return

      getDisclosures().forEach((el) => {
        if (el.open && !el.contains(target)) {
          el.open = false
        }
      })
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAll()
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("focusin", handleFocusIn)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("focusin", handleFocusIn)
      document.removeEventListener("keydown", handleKeyDown)
      handlers.forEach(({ el, handler }) => el.removeEventListener("toggle", handler))
    }
  }, [])

  useEffect(() => {
    document
      .querySelectorAll<HTMLDetailsElement>(".header-nav .nav-disclosure, details.mobile-nav")
      .forEach((el) => {
        el.open = false
      })
  }, [pathname])

  return null
}
