"use client"

import { useEffect } from "react"

export function NavAutoClose() {
  useEffect(() => {
    const disclosures = Array.from(
      document.querySelectorAll<HTMLDetailsElement>(".header-nav .nav-disclosure")
    )

    const handlers = disclosures.map((el) => {
      const handler = () => {
        if (el.open) {
          disclosures.forEach((other) => {
            if (other !== el) {
              other.open = false
            }
          })
        }
      }
      el.addEventListener("toggle", handler)
      return { el, handler }
    })

    return () => {
      handlers.forEach(({ el, handler }) => el.removeEventListener("toggle", handler))
    }
  }, [])

  return null
}
