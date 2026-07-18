"use client"

import { useState } from "react"
import { clearLocalWorldviewHistory } from "@/lib/local-data"

type State = "idle" | "confirm" | "deleted" | "error"

export function LocalDataControls() {
  const [state, setState] = useState<State>("idle")

  function clearHistory() {
    const result = clearLocalWorldviewHistory(window.localStorage, window.sessionStorage)
    setState(result.failed.length === 0 ? "deleted" : "error")
  }

  return (
    <div className="stack-sm">
      {state === "confirm" ? (
        <div className="stack-sm">
          <p style={{ lineHeight: "1.7", margin: 0 }}>
            This removes saved Profile layers, Foundation and AI drafts, Perspective drafts,
            Current Case judgments, and local result history from this browser. It cannot remove
            links you already shared or entries in browser history.
          </p>
          <div className="row gap-sm wrap">
            <button type="button" className="primary-button" onClick={clearHistory}>
              Delete local history now
            </button>
            <button type="button" className="secondary-button" onClick={() => setState("idle")}>
              Keep my local history
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setState("confirm")}
          >
            Delete local history
          </button>
        </div>
      )}

      {state === "deleted" ? (
        <p role="status" style={{ lineHeight: "1.7", margin: 0 }}>
          Local results and drafts were deleted. Your analytics opt-out preference, if set, was
          preserved.
        </p>
      ) : null}
      {state === "error" ? (
        <p role="alert" style={{ lineHeight: "1.7", margin: 0 }}>
          This browser blocked at least one deletion. Use its site-data settings to clear storage
          for this site.
        </p>
      ) : null}
    </div>
  )
}
