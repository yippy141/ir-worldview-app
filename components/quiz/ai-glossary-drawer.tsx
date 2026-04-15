"use client"

import { useEffect, useRef } from "react"
import { aiGlossary, aiGlossaryById } from "@/lib/ai-governance-glossary"
import type { GlossaryEntry } from "@/lib/ai-governance-glossary"

type Props = {
  open: boolean
  onClose: () => void
}

export function AiGlossaryDrawer({ open, onClose }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const prevFocusRef = useRef<Element | null>(null)

  useEffect(() => {
    if (!open) return
    prevFocusRef.current = document.activeElement
    closeButtonRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      ;(prevFocusRef.current as HTMLElement | null)?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(27, 23, 22, 0.25)",
          zIndex: 40,
          cursor: "default",
        }}
      />
      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-glossary-heading"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(420px, 100vw)",
          background: "var(--panel)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
          zIndex: 50,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Sticky header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            position: "sticky",
            top: 0,
            background: "var(--panel)",
            zIndex: 1,
          }}
        >
          <div>
            <p
              className="eyebrow"
              style={{ marginBottom: "4px" }}
            >
              AI Governance Compass
            </p>
            <h2
              id="ai-glossary-heading"
              style={{ margin: 0, fontSize: "1.15rem" }}
            >
              Glossary
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close glossary"
            className="secondary-button"
            style={{ flexShrink: 0, marginTop: "2px", fontSize: "0.82rem", padding: "5px 12px" }}
          >
            Close
          </button>
        </div>

        {/* Term list */}
        <div style={{ padding: "0 24px 32px" }}>
          <p
            className="muted"
            style={{ fontSize: "0.82rem", lineHeight: "1.65", padding: "14px 0 6px" }}
          >
            Plain-language explanations of key terms used in this inventory.
          </p>
          {aiGlossary.map((entry) => (
            <GlossaryItem key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </>
  )
}

function GlossaryItem({ entry }: { entry: GlossaryEntry }) {
  const seeAlsoLabels = entry.seeAlso
    ?.map((id) => aiGlossaryById[id]?.term)
    .filter((t): t is string => Boolean(t))

  return (
    <div style={{ borderTop: "1px solid var(--border)", padding: "16px 0" }}>
      <p style={{ fontWeight: 600, marginBottom: "6px", fontSize: "0.95rem" }}>
        {entry.term}
      </p>
      <p style={{ fontSize: "0.875rem", lineHeight: "1.7", color: "var(--muted)" }}>
        {entry.definition}
      </p>
      {seeAlsoLabels && seeAlsoLabels.length > 0 ? (
        <p style={{ fontSize: "0.78rem", marginTop: "8px", color: "var(--muted)" }}>
          See also: {seeAlsoLabels.join(", ")}
        </p>
      ) : null}
    </div>
  )
}
