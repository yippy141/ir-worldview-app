import type { Trajectory } from "@/lib/futures/trajectories"
import Link from "next/link"
import { futuresSources, premiseClaim } from "@/lib/futures/sources"
import { departure } from "@/lib/futures/departure"

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
    objection,
    disputes,
  } = trajectory
  const premise = premiseClaim(id, tegmarkName)

  return (
    <article id={`trajectory-${id}`} className="trajectory-card">
      <div className="trajectory-card__summary">
        <p className="trajectory-card__origin">Original: {tegmarkName} · Max Tegmark, Life 3.0</p>
        <h3 className="trajectory-card__name">{name}</h3>
        <p className="trajectory-card__plain"><strong>Original premise:</strong> {premise.text}</p>
        <p className="trajectory-card__origin">Project interpretation and extension</p>
        <p className="trajectory-card__plain">{plainSummary}</p>
      </div>

      <details className="trajectory-card__details">
        <summary className="trajectory-card__disclosure">Read the reasoning</summary>

        <div className="trajectory-card__body">
          <p className="trajectory-card__prose">The premise above is paraphrased from <a href={futuresSources.aftermath.url}>FLI’s scenario reference</a> ({premise.citations[0].locator}). Checked {premise.checked}. The assumptions, criticism and questions below are authored by IR Worldview Inventory; they are not statements of Tegmark’s position.</p>
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
              Project criticism
            </h4>
            <p className="trajectory-card__prose">
              <span className="trajectory-card__prose-label">Strongest objection:</span> {objection}
            </p>
          </section>

          <section className="trajectory-card__group">
            <h4 className="trajectory-card__group-title">Evidence status</h4>
            <p className="trajectory-card__prose">Earlier current-development and community-attribution claims are withheld pending claim-level sourcing. These editorial possibilities do not establish that this scenario is arriving.</p>
          </section>

          <section className="trajectory-card__group">
            <h4 className="trajectory-card__group-title">Questions raised by the project</h4>
            <ul className="trajectory-card__list">
              {disputes.map((dispute) => (
                <li key={dispute}>{dispute}</li>
              ))}
            </ul>
          </section>
          {(id === "gatekeeper" || id === "protector") && <p className="trajectory-card__prose"><Link href={departure.href} prefetch={false}>Consider these powers in {departure.title} (draft)</Link></p>}
        </div>
      </details>
    </article>
  )
}
