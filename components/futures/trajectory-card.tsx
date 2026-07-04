import type { Trajectory } from "@/lib/futures/trajectories"

type Props = {
  trajectory: Trajectory
}

// One card per trajectory. The name and plain-language summary stay visible;
// the reasoning, reception, signals, and disputes sit behind a native
// disclosure so the grid reads as a calm field of summaries until opened.
export function TrajectoryCard({ trajectory }: Props) {
  const {
    id,
    name,
    tegmarkName,
    plainSummary,
    assumptions,
    advocates,
    objection,
    signals,
    disputes,
  } = trajectory

  return (
    <article id={`trajectory-${id}`} className="trajectory-card">
      <div className="trajectory-card__summary">
        <p className="trajectory-card__origin">After: {tegmarkName}</p>
        <h3 className="trajectory-card__name">{name}</h3>
        <p className="trajectory-card__plain">{plainSummary}</p>
      </div>

      <details className="trajectory-card__details">
        <summary className="trajectory-card__disclosure">Read the reasoning</summary>

        <div className="trajectory-card__body">
          <section className="trajectory-card__group">
            <h4 className="trajectory-card__group-title">How we might get there</h4>
            <ul className="trajectory-card__list">
              {assumptions.map((assumption) => (
                <li key={assumption}>{assumption}</li>
              ))}
            </ul>
          </section>

          <section className="trajectory-card__group">
            <h4 className="trajectory-card__group-title">
              Who takes it seriously / main objection
            </h4>
            <p className="trajectory-card__prose">
              <span className="trajectory-card__prose-label">Taken seriously by:</span> {advocates}
            </p>
            <p className="trajectory-card__prose">
              <span className="trajectory-card__prose-label">Strongest objection:</span> {objection}
            </p>
          </section>

          <section className="trajectory-card__group">
            <h4 className="trajectory-card__group-title">2026 signals to watch</h4>
            <ul className="trajectory-card__list">
              {signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </section>

          <section className="trajectory-card__group">
            <h4 className="trajectory-card__group-title">Where serious people disagree</h4>
            <ul className="trajectory-card__list">
              {disputes.map((dispute) => (
                <li key={dispute}>{dispute}</li>
              ))}
            </ul>
          </section>
        </div>
      </details>
    </article>
  )
}
