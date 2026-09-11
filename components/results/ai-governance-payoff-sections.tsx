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
      <h2 id="ai-governance-payoff-heading">Questions raised by these positions</h2>

      <div className="ai-governance-payoff__debate-grid">
        {payoff.policyDebates.map((debate) => (
          <article key={debate.title} className="ai-governance-payoff__card stack-xs">
            <h3>{debate.title}</h3>
            <p className="ai-governance-payoff__question">{debate.question}</p>
            <p>{debate.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
