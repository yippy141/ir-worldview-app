import {
  buildAiGovernanceDeepDive,
  getPrimaryAxisSummary,
} from "@/lib/ai-governance-results-v2"
import { AiResult } from "@/lib/ai-governance-types"

export function AiGovernanceProfileSections({ result }: { result: AiResult }) {
  const deepDive = buildAiGovernanceDeepDive(result)
  const nearbyAlternativeLabel = deepDive.comparison.nearbyAlternativeLabel

  return (
    <>
      <section className="result-section stack-md">
        <div className="ai-result-overview">
          <div className="ai-result-overview-main stack-md">
            <div className="ai-result-section-intro stack-xs result-prose">
              <p className="eyebrow">Closest modeled fit</p>
              {nearbyAlternativeLabel ? (
                <p className="ai-result-hybrid-note">Nearby alternative: {nearbyAlternativeLabel}</p>
              ) : null}
              <h2>Governing instinct</h2>
            </div>

            <article className="ai-result-lead-card">
              <p className="ai-result-lead">{deepDive.governingInstinct}</p>
            </article>
          </div>

          <aside className="ai-result-card ai-result-card--muted stack-xs">
            <p className="eyebrow">Nearby alternative</p>
            <p className="ai-result-card-title">{deepDive.comparison.runnerUpLabel}</p>
            <p className="ai-result-body muted">
              This is the closest neighboring read inside the current AI Atlas. It is a comparison
              aid, not a confidence score.
            </p>
          </aside>
        </div>

        <div className="ai-result-summary-grid">
          <article className="ai-result-card ai-result-card--soft stack-xs">
            <p className="eyebrow">Short read</p>
            <p className="ai-result-body">{deepDive.shareBlurb}</p>
          </article>

          <article className="ai-result-card ai-result-card--soft stack-xs">
            <p className="eyebrow">Main signals</p>
            <p className="ai-result-body">{getPrimaryAxisSummary(result.axisScores)}</p>
          </article>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="ai-result-section-intro stack-xs result-prose">
          <h2>Likely policy package</h2>
          <p className="ai-result-body muted">
            These are the policy moves your answers make easier to defend when the tradeoffs become
            concrete.
          </p>
        </div>

        <div className="ai-result-policy-grid">
          {deepDive.policySignals.map((signal) => (
            <article
              key={signal.title}
              className="ai-result-card ai-result-card--accent stack-xs"
            >
              <p className="eyebrow">{signal.title}</p>
              <h3 className="ai-result-card-title">{signal.stance}</h3>
              <p className="ai-result-body muted">{signal.explanation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="ai-result-columns">
          <article className="ai-result-card stack-sm">
            <div className="stack-xs">
              <h2>What this means for world order</h2>
              <p className="ai-result-body muted">
                How this result reads once the question becomes rivalry, dependence, standards, and
                coordination.
              </p>
            </div>
            <ul className="ai-result-list">
              {deepDive.internationalOrder.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="ai-result-card stack-sm">
            <div className="stack-xs">
              <h2>What would change your mind</h2>
              <p className="ai-result-body muted">
                A strong worldview should also say what evidence could make it rethink itself.
              </p>
            </div>
            <ul className="ai-result-list">
              {deepDive.evidenceShift.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="ai-result-section-intro stack-xs result-prose">
          <h2>Pressure points</h2>
          <p className="ai-result-body muted">
            These are the places where your principles and strategic instincts may tug in different
            directions.
          </p>
        </div>

        <div className="ai-result-tension-grid">
          {deepDive.tensions.map((tension) => (
            <article
              key={`${tension.title}-${tension.text}`}
              className="ai-result-card ai-result-card--soft stack-xs"
            >
              <h3 className="ai-result-card-title">{tension.title}</h3>
              <p className="ai-result-body muted">{tension.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="ai-result-section-intro stack-xs result-prose">
          <h2>Boundary cases</h2>
          <p className="ai-result-body muted">
            This shows the nearest alternative to your result and the archetype furthest from your
            instincts.
          </p>
        </div>

        <div className="ai-result-columns">
          <article className="ai-result-card ai-result-card--accent stack-xs">
            <p className="eyebrow">Runner-up comparison</p>
            <h3 className="ai-result-card-title">
              Why you are not {deepDive.comparison.runnerUpLabel}
            </h3>
            <p className="ai-result-body">{deepDive.comparison.contrastText}</p>
          </article>

          <article className="ai-result-card stack-xs">
            <p className="eyebrow">Most distant archetype</p>
            <h3 className="ai-result-card-title">
              Farthest from {deepDive.comparison.farthestLabel}
            </h3>
            <p className="ai-result-body">{deepDive.comparison.farthestText}</p>
          </article>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="ai-result-critique-grid">
          <article className="ai-result-card ai-result-card--accent stack-xs">
            <h2>Best critique of your worldview</h2>
            <p className="ai-result-body">{deepDive.strongestCritique}</p>
          </article>

          <article className="ai-result-card ai-result-card--question stack-xs">
            <p className="eyebrow">Sit with this question</p>
            <p className="ai-result-question">{deepDive.questionToSitWith}</p>
          </article>
        </div>
      </section>
    </>
  )
}
