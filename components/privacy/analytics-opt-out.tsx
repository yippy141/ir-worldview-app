"use client"

import { useState, useSyncExternalStore } from "react"
import {
  analyticsOptedOut,
  setAnalyticsOptOut,
} from "@/lib/analytics/adapter"

export function AnalyticsOptOut() {
  const [, forceRender] = useState(0)
  const optedOut = useSyncExternalStore(
    subscribeToNothing,
    analyticsOptedOut,
    () => true,
  )

  function updatePreference(nextOptedOut: boolean) {
    setAnalyticsOptOut(nextOptedOut)
    forceRender((revision) => revision + 1)
  }

  return (
    <div className="stack-sm">
      <p role="status" style={{ lineHeight: "1.7" }}>
        Coarse product measurement is <strong>{optedOut ? "off" : "on"}</strong> in this
        browser.
      </p>
      <div>
        <button
          type="button"
          className={optedOut ? "secondary-button" : "primary-button"}
          onClick={() => updatePreference(!optedOut)}
        >
          {optedOut ? "Allow coarse measurement" : "Opt out on this browser"}
        </button>
      </div>
      <p className="muted" style={{ fontSize: "0.84rem", lineHeight: "1.6" }}>
        This preference is stored only in this browser. Opting out also removes the local
        first-seen date used to form a broad return-age bucket. No saved-result flag or custom
        event timestamp is sent.
      </p>
    </div>
  )
}

const subscribeToNothing = () => () => {}
