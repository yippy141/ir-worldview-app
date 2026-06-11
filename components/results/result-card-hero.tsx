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
  verdict?: string
  summary: string
  finding?: { label?: string; text: string } | null
  actions?: ReactNode
}

export function ResultCardHero({
  eyebrow,
  label,
  accent,
  modifiers,
  verdict,
  summary,
  finding,
  actions,
}: Props) {
  const hasModifiers = Boolean(modifiers && modifiers.length > 0)

  return (
    <section
      className={`result-card-hero result-card-hero--${accent}${
        verdict ? " result-card-hero--verdict-first" : ""
      }`}
      aria-label={`${eyebrow}: ${label}`}
    >
      <p className="result-card-hero__eyebrow">{eyebrow}</p>
      {verdict ? (
        <>
          <h1 className="result-card-hero__verdict">{verdict}</h1>
          <div className="result-card-hero__metadata" aria-label="Result metadata">
            <span className="result-card-hero__metadata-label">Closest modeled fit</span>
            <strong className="result-card-hero__metadata-value">{label}</strong>
            {hasModifiers ? (
              <div className="result-card-hero__modifiers result-card-hero__modifiers--metadata">
                {modifiers?.map((modifier) => (
                  <span key={modifier} className="result-card-hero__chip">
                    {modifier}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <h1 className="result-card-hero__label">{label}</h1>
          {hasModifiers ? (
            <div className="result-card-hero__modifiers">
              {modifiers?.map((modifier) => (
                <span key={modifier} className="result-card-hero__chip">
                  {modifier}
                </span>
              ))}
            </div>
          ) : null}
        </>
      )}
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
