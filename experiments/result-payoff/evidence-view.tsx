import type { Claim, Comparison } from "./evidence"
import styles from "./payoff.module.css"

export function Evidence({ claim, label }: { claim: Claim; label?: string }) {
  return <details className={styles.evidence}>
    <summary>{label ?? ({ "direct observation": "Evidence for the recorded answers", "editorial interpretation": "Basis for this interpretation", "exact model comparison": "Evidence for the model comparison", "proposed question": "Why ask this follow-up?" }[claim.kind])}</summary>
    <p>{claim.supports}</p>
    <ul>{claim.refs.map(ref => <li key={ref.id}><code>{ref.id}</code> {ref.text}</li>)}</ul>
    <p><strong>Limit.</strong> {claim.doesNotSupport}</p>
    <p className={styles.metadata}><code>{claim.id}</code> · {claim.kind}<br />
      {claim.provenance.instrument} · bank {claim.provenance.bank} · scorer {claim.provenance.scorer} · {claim.provenance.form} · English copy {claim.provenance.copy}<br />
      <code>{claim.provenance.source}</code><br />Experiment interpretation copy: result-payoff/2.</p>
  </details>
}
export function ExactComparison({ comparison, claim }: { comparison: Comparison; claim: Claim }) {
  const sorted = [...comparison.terms].sort((a, b) => Math.abs(b.term) - Math.abs(a.term))
  const max = Math.max(1, ...sorted.map(row => Math.abs(row.term)))
  return <div>
    <h3>What separates the two readings</h3>
    {comparison.tied.length > 1 && <p>Exact tie: {comparison.tied.join(", ")}. These are co-leading readings, with no substantive winner.</p>}
    <p className={styles.small}>Signed terms in {comparison.primary} minus {comparison.alternative}. Positive terms favor the first reading; negative terms favor the alternative.</p>
    <div className={styles.terms} aria-label="Model comparison terms">
      {sorted.slice(0, 3).map(row => <div key={row.axis}>
        <span>{row.axis}</span><strong>{row.term >= 0 ? "+" : ""}{row.term.toFixed(2)}</strong>
        <div className={styles.termTrack}><i style={{ width: `${Math.abs(row.term) / max * 50}%`, left: row.term >= 0 ? "50%" : `${50 - Math.abs(row.term) / max * 50}%` }} /></div>
      </div>)}
    </div>
    <details className={styles.evidence}><summary>Exact calculation and remaining terms</summary>
      <p>These are model-score units, not percentages or causal effects of answers.</p>
      <ul>{comparison.terms.map(row => <li key={row.axis}>{row.axis}: {row.term.toFixed(5)}</li>)}</ul>
      <p>Sum: {comparison.terms.reduce((s, r) => s + r.term, 0).toFixed(5)}. Rounding residual: {comparison.residual.toFixed(5)}. Rounded totals: {comparison.primaryScore.toFixed(2)} − {comparison.alternativeScore.toFixed(2)} = {(comparison.primaryScore - comparison.alternativeScore).toFixed(2)}.</p>
      {comparison.tied.length > 1 && <p>Exact tie: {comparison.tied.join(", ")}. No substantive winner.</p>}
    </details>
    <Evidence claim={claim} />
  </div>
}
