import type { ReactNode } from "react"

export type ResultCardAccent =
  | "realist"
  | "institutionalist"
  | "constructivist"
  | "cpe"
  | "ai"
  | "profile"

type Props = {
  eyebrow: string
  label: string
  accent: ResultCardAccent
  modifiers?: string[]
  summary: string
  finding?: { label?: string; text: string } | null
  actions?: ReactNode
}

export function ResultCardHero({
  eyebrow,
  label,
  accent,
  modifiers,
  summary,
  finding,
  actions,
}: Props) {
  return (
    <section
      className={`result-card-hero result-card-hero--${accent}`}
      aria-label={`${eyebrow}: ${label}`}
    >
      <p className="result-card-hero__eyebrow">{eyebrow}</p>
      <h1 className="result-card-hero__label">{label}</h1>
      {modifiers && modifiers.length > 0 ? (
        <div className="result-card-hero__modifiers">
          {modifiers.map((modifier) => (
            <span key={modifier} className="result-card-hero__chip">
              {modifier}
            </span>
          ))}
        </div>
      ) : null}
      <p className="result-card-hero__summary">{summary}</p>
      {finding ? (
        <div className="result-card-hero__finding">
          {finding.label ? (
            <p className="result-card-hero__finding-label">{finding.label}</p>
          ) : null}
          <p className="result-card-hero__finding-text">{finding.text}</p>
        </div>
      ) : null}
      {actions ? <div className="result-card-hero__actions">{actions}</div> : null}
    </section>
  )
}
