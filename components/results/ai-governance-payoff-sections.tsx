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
      <h2 id="ai-governance-payoff-heading">Debates you will read differently</h2>

      <div className="ai-governance-payoff__debate-grid">
        {payoff.policyDebates.map((debate) => (
          <article key={debate.title} className="ai-governance-payoff__card stack-xs">
            <h3>{debate.title}</h3>
            <p className="ai-governance-payoff__question">{debate.question}</p>
            <p>{debate.text}</p>
          </article>
        ))}
      </div>

      <div className="ai-governance-payoff__block ai-governance-payoff__pressure stack-sm">
        <h3>{payoff.mainTension.title}</h3>
        <p>{payoff.mainTension.text}</p>
      </div>
    </section>
  )
}
