import type { Claim } from "@/lib/decision-exercises/evidence"
import styles from "./exercise.module.css"

export function Evidence({ claim }: { claim: Claim }) {
  return <section className={styles.evidence}>
    <h3>{claim.kind === "direct observation" ? "Submitted choices" : claim.kind === "proposed question" ? "Follow-up" : "Interpretation"}</h3>
    <p>{claim.supports}</p>
    <ul>{claim.refs.map(ref => <li key={ref.id}><code>{ref.id}</code> {ref.text}</li>)}</ul>
    <p>{claim.doesNotSupport}</p>
    <p className={styles.metadata}>{claim.id} · {claim.kind}<br />{claim.provenance.form} · English copy {claim.provenance.copy}<br />{claim.provenance.source}</p>
  </section>
}
