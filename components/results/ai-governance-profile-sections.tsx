import {
  buildAiGovernanceDeepDive,
  getPrimaryAxisSummary,
} from "@/lib/ai-governance-results-v2"
import { AiResult } from "@/lib/ai-governance-types"

const threeUpGridStyle = {
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
}

const twoColumnGridStyle = {
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
}

const listStyle = {
  margin: 0,
  paddingLeft: "18px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
}

export function AiGovernanceProfileSections({ result }: { result: AiResult }) {
  const deepDive = buildAiGovernanceDeepDive(result)

  return (
    <>
      <section className="result-section stack-md">
        <div className="stack-xs result-prose">
          <p className="eyebrow">
            {deepDive.clarityLabel}
            {deepDive.comparison.hybridLabel
              ? ` - ${deepDive.comparison.hybridLabel}`
              : ""}
          </p>
          <h2>Governing instinct</h2>
          <p style={{ lineHeight: "1.75" }}>{deepDive.governingInstinct}</p>
        </div>

        <div style={threeUpGridStyle}>
          <div className="driver-card stack-xs">
            <p className="eyebrow">Shareable read</p>
            <p style={{ lineHeight: "1.7", margin: 0 }}>{deepDive.shareBlurb}</p>
          </div>

          <div className="driver-card stack-xs">
            <p className="eyebrow">Strongest signals</p>
            <p style={{ lineHeight: "1.7", margin: 0 }}>
              {getPrimaryAxisSummary(result.axisScores)}
            </p>
          </div>

          <div className="callout stack-xs">
            <p className="eyebrow">Profile clarity</p>
            <p
              style={{
                fontSize: "1.75rem",
                lineHeight: "1.1",
                fontWeight: 700,
                margin: 0,
                color: "var(--text)",
              }}
            >
              {result.clarity} / 100
            </p>
            <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65", margin: 0 }}>
              A higher score means your top archetype pulled clearly ahead. A lower score means you sit in a more mixed or hybrid zone.
            </p>
          </div>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs result-prose">
          <h2>Likely policy package</h2>
          <p className="muted" style={{ lineHeight: "1.7" }}>
            These are the policy instincts that most naturally follow from your result. They are not fixed party positions. They are the directions your worldview pulls when concrete governance choices arrive.
          </p>
        </div>

        <div className="driver-grid">
          {deepDive.policySignals.map((signal) => (
            <article key={signal.title} className="driver-card stack-xs">
              <p className="eyebrow">{signal.title}</p>
              <h3 style={{ fontSize: "1.05rem", margin: 0 }}>{signal.stance}</h3>
              <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65", margin: 0 }}>
                {signal.explanation}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="result-section stack-md">
        <div style={twoColumnGridStyle}>
          <article className="driver-card stack-sm">
            <div className="stack-xs">
              <h2>International order implications</h2>
              <p className="muted" style={{ lineHeight: "1.7", margin: 0 }}>
                This is where your AI worldview becomes geopolitical. These points are most useful when thinking about rivalry, middle-power dependence, standards politics, and whether legitimacy has to travel beyond one lab or one state.
              </p>
            </div>
            <ul style={listStyle}>
              {deepDive.internationalOrder.map((item) => (
                <li key={item} style={{ lineHeight: "1.7" }}>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="driver-card stack-sm">
            <div className="stack-xs">
              <h2>What would change your mind</h2>
              <p className="muted" style={{ lineHeight: "1.7", margin: 0 }}>
                A useful worldview should be able to say what evidence would actually move it.
              </p>
            </div>
            <ul style={listStyle}>
              {deepDive.evidenceShift.map((item) => (
                <li key={item} style={{ lineHeight: "1.7" }}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs result-prose">
          <h2>Pressure points</h2>
          <p className="muted" style={{ lineHeight: "1.7" }}>
            These are the places where your values and strategic instincts can pull in different directions under pressure.
          </p>
        </div>

        <div style={threeUpGridStyle}>
          {deepDive.tensions.map((tension) => (
            <article key={`${tension.title}-${tension.text}`} className="driver-card stack-xs">
              <h3 style={{ fontSize: "1.05rem", margin: 0 }}>{tension.title}</h3>
              <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65", margin: 0 }}>
                {tension.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="result-section stack-md">
        <div className="stack-xs result-prose">
          <h2>Boundary cases</h2>
          <p className="muted" style={{ lineHeight: "1.7" }}>
            This gives you the nearest alternative to your result and the worldview family from which you are farthest.
          </p>
        </div>

        <div style={twoColumnGridStyle}>
          <article className="driver-card stack-xs">
            <p className="eyebrow">Runner-up comparison</p>
            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>
              Why you are not {deepDive.comparison.runnerUpLabel}
            </h3>
            <p style={{ lineHeight: "1.7", margin: 0 }}>{deepDive.comparison.contrastText}</p>
          </article>

          <article className="driver-card stack-xs">
            <p className="eyebrow">Most distant archetype</p>
            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>
              Farthest from {deepDive.comparison.farthestLabel}
            </h3>
            <p style={{ lineHeight: "1.7", margin: 0 }}>{deepDive.comparison.farthestText}</p>
          </article>
        </div>
      </section>

      <section className="result-section stack-md">
        <div style={twoColumnGridStyle}>
          <article className="driver-card stack-xs">
            <h2>Best critique of your worldview</h2>
            <p style={{ lineHeight: "1.75", margin: 0 }}>{deepDive.strongestCritique}</p>
          </article>

          <article className="callout stack-xs">
            <p className="eyebrow">Sit with this question</p>
            <p style={{ fontSize: "1.05rem", lineHeight: "1.8", margin: 0 }}>
              {deepDive.questionToSitWith}
            </p>
          </article>
        </div>
      </section>
    </>
  )
}
