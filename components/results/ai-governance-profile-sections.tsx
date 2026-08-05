import {
  buildAiGovernanceDeepDive,
  getPrimaryAxisSummary,
} from "@/lib/ai-governance-results-v2"
import type {
  AiArchetypeKey,
  AiAxisKey,
  AiResult,
} from "@/lib/ai-governance-types"

export function AiGovernanceProfileSections({
  result,
  archetypeProfiles,
  archetypeLabels,
}: {
  result: AiResult
  archetypeProfiles: Record<
    AiArchetypeKey,
    Partial<Record<AiAxisKey, number>>
  >
  archetypeLabels: Record<AiArchetypeKey, string>
}) {
  const deepDive = buildAiGovernanceDeepDive(
    result,
    archetypeProfiles,
    archetypeLabels,
  )

  return (
    <>
      <div className="stack-md">
        <h2>Policy package</h2>
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
      </div>

      <div className="stack-md">
        <div className="ai-result-columns">
          <article className="ai-result-card stack-sm">
            <h3>World order</h3>
            <ul className="ai-result-list">
              {deepDive.internationalOrder.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="ai-result-card stack-sm">
            <h3>What would change your mind</h3>
            <ul className="ai-result-list">
              {deepDive.evidenceShift.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>

      <div className="stack-md">
        <h2>Pressure points</h2>
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
      </div>

      <div className="stack-md">
        <div className="ai-result-columns">
          <article className="ai-result-card ai-result-card--soft stack-xs">
            <p className="eyebrow">Main signals</p>
            <p className="ai-result-body">{getPrimaryAxisSummary(result.axisScores)}</p>
          </article>

          <article className="ai-result-card stack-xs">
            <p className="eyebrow">Most distant archetype</p>
            <h3 className="ai-result-card-title">{deepDive.comparison.farthestLabel}</h3>
            <p className="ai-result-body">{deepDive.comparison.farthestText}</p>
          </article>
        </div>
      </div>

      <div className="stack-md">
        <div className="ai-result-critique-grid">
          <article className="ai-result-card ai-result-card--accent stack-xs">
            <h3>Best critique of this worldview</h3>
            <p className="ai-result-body">{deepDive.strongestCritique}</p>
          </article>
        </div>
      </div>
    </>
  )
}
