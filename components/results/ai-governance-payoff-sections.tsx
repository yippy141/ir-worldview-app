import type { AiGovernancePayoff } from "@/lib/results/ai-governance-payoff"

type Props = {
  payoff: AiGovernancePayoff
}

export function AiGovernancePayoffSections({ payoff }: Props) {
  return (
    <section
      className="ai-governance-payoff result-section stack-lg"
      aria-labelledby="ai-governance-payoff-heading"
    >
      <div className="ai-governance-payoff__intro stack-xs">
        <p className="eyebrow">Policy payoff</p>
        <h2 id="ai-governance-payoff-heading">How to use this profile</h2>
        <p className="muted">
          The useful read is not the archetype name by itself. It is the governing instinct, the
          tension it leaves unresolved, and the questions it makes harder to ignore.
        </p>
      </div>

      <div className="ai-governance-payoff__snapshot">
        <PayoffCard title="Governing instinct" text={payoff.governingInstinct} />
        <PayoffCard title="Main signal" text={payoff.mainSignal} />
        <PayoffCard title={payoff.mainTension.title} text={payoff.mainTension.text} />
      </div>

      <div className="ai-governance-payoff__block stack-md">
        <div className="stack-xs">
          <p className="section-kicker">Policy debates you will read differently</p>
          <h3>Questions your profile keeps bringing back</h3>
        </div>
        <div className="ai-governance-payoff__debate-grid">
          {payoff.policyDebates.map((debate) => (
            <article key={debate.title} className="ai-governance-payoff__card stack-xs">
              <h4>{debate.title}</h4>
              <p className="ai-governance-payoff__question">{debate.question}</p>
              <p>{debate.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="ai-governance-payoff__block ai-governance-payoff__pressure stack-sm">
        <div className="stack-xs">
          <p className="section-kicker">Pressure test</p>
          <h3>{payoff.pressureTest.title}</h3>
        </div>
        <p>{payoff.pressureTest.text}</p>
      </div>
    </section>
  )
}

function PayoffCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="ai-governance-payoff__card stack-xs">
      <h4>{title}</h4>
      <p>{text}</p>
    </article>
  )
}
