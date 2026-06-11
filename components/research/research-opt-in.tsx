"use client"

import Link from "next/link"
import { useState } from "react"

type Props = {
  instrumentLabel: string
}

export function ResearchOptIn({ instrumentLabel }: Props) {
  const [researchConsent, setResearchConsent] = useState(false)
  const [contactEmail, setContactEmail] = useState("")

  return (
    <section className="callout stack-sm" aria-label="Optional research contribution">
      <div className="stack-xs">
        <p className="eyebrow">Optional research contribution</p>
        <h2 style={{ margin: 0, fontSize: "1.05rem" }}>Help improve the inventory</h2>
        <p className="muted" style={{ lineHeight: "1.65", fontSize: "0.9rem" }}>
          You can use, save, and share this {instrumentLabel} result without contributing answers
          to a research dataset. In a later beta, opt-in responses may be stored as pseudonymous or
          de-identified research records for question testing and aggregate analysis. This build
          does not submit your answers from this block.
        </p>
      </div>

      <label
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "flex-start",
          lineHeight: "1.55",
          fontSize: "0.92rem",
        }}
      >
        <input
          type="checkbox"
          checked={researchConsent}
          onChange={(event) => setResearchConsent(event.target.checked)}
          style={{ marginTop: "3px" }}
        />
        <span>
          I would opt in to pseudonymous answer and result storage for research and product
          improvement when storage is activated.
        </span>
      </label>

      {researchConsent ? (
        <div className="stack-xs">
          <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.85rem" }}>
            Contact details are optional and for follow-up only. They should stay separate from
            answer and result data. No ads, no sale of profile data, no political targeting.
          </p>
          <label className="stack-xs" style={{ fontSize: "0.86rem", fontWeight: 600 }}>
            Optional contact email for follow-up only
            <input
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                maxWidth: "360px",
                padding: "10px 12px",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                background: "var(--panel)",
                color: "var(--text)",
                font: "inherit",
              }}
            />
          </label>
          <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.8rem" }}>
            Current state: opt-in UI only. The checkbox and email field stay in this page state and
            are not submitted or stored by this build.
          </p>
        </div>
      ) : (
        <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.85rem", margin: 0 }}>
          No opt-in selected. You can still use, save, and share your result normally.
        </p>
      )}

      <p className="muted" style={{ lineHeight: "1.6", fontSize: "0.82rem", margin: 0 }}>
        Read the{" "}
        <Link href="/privacy" style={{ color: "var(--accent)" }}>
          privacy and data-use note
        </Link>
        , including the deletion request path.
      </p>
    </section>
  )
}
