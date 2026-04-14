import {
  buildAiGovernanceDeepDive,
  getPrimaryAxisSummary,
} from "@/lib/ai-governance-results-v2"
import { AiResult } from "@/lib/ai-governance-types"

export function AiGovernanceProfileSections({ result }: { result: AiResult }) {
  const deepDive = buildAiGovernanceDeepDive(result)
  const hybridLabel = deepDive.comparison.hybridLabel

  return (
    <>
      <section className="result-section stack-md">
        <div className="ai-result-overview">
          <div className="ai-result-overview-main stack-md">
            <div className="ai-result-section-intro stack-xs result-prose">
              <p className="eyebrow">{deepDive.clarityLabel}</p>
              {hybridLabel ? (
                <p className="ai-result-hybrid-note">Hybrid read: {hybridLabel}</p>
              ) : null}
              <h2>Governing instinct</h2>
            </div>

            <article className="ai-result-lead-card">
              <p className="ai-result-lead">{deepDive.governingInstinct}</p>
            </article>
          </div>

          <aside className="ai-result-card ai-result-card--muted stack-xs">
            <p className="eyebrow">Profile clarity</p>
            <p className="ai-result-metric">{result.clarity} / 100</p>
            <p className="ai-result-body muted">
              A higher score means your top archetype pulled clearly ahead. A lower score means
              you sit in a more mixed or hybrid zone.
            </p>
          </aside>
        </div>

        <div className="ai-result-summary-grid">
          <article className="ai-result-card ai-result-card--soft stack-xs">
            <p className="eyebrow">Shareable read</p>
            <p className="ai-result-body">{deepDive.shareBlurb}</p>
          </article>

          <article className="ai-result-card ai-result-card--soft stack-xs">
            <p className="eyebrow">Strongest signals</p>
            <p className="ai-result-body">{getPrimaryAxisSummary(result.axisScores)}</p>
          </article>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="ai-result-section-intro stack-xs result-prose">
          <h2>Likely policy package</h2>
          <p className="ai-result-body muted">
            These are the policy instincts that most naturally follow from your result. They are not fixed party positions. They are the directions your worldview pulls when concrete governance choices arrive.
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
              <h2>International order implications</h2>
              <p className="ai-result-body muted">
                This is where your AI worldview becomes geopolitical. These points are most useful when thinking about rivalry, middle-power dependence, standards politics, and whether legitimacy has to travel beyond one lab or one state.
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
                A useful worldview should be able to say what evidence would actually move it.
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
            These are the places where your values and strategic instincts can pull in different directions under pressure.
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
            This gives you the nearest alternative to your result and the worldview family from which you are farthest.
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
