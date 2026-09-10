import type { Episode } from "@/lib/decision-exercises/content"
import type { RefObject } from "react"
import { accessComparisonRows } from "@/lib/decision-exercises/access-presentation"
import styles from "./access-experience.module.css"

/** Optional post-submission editorial continuation. Never included in the decision stage. */
export function AccessReading({ episode, detailsRef }: { episode: Episode; detailsRef: RefObject<HTMLDetailsElement | null> }) {
  const source = episode.sources.find(item => item.id === "seger-2023-open-sourcing")!
  return <section className={styles.reading} aria-labelledby="access-reading-title">
    <details ref={detailsRef} tabIndex={-1}>
      <summary id="access-reading-title">Continue reading: when outside scrutiny depends on the developer</summary>
      <div className={styles.readingBody}>
        <h2>Freedom to publish starts before publication</h2>
        <p className={styles.judgment}>An evaluator can be free to publish criticism and still depend on the developer for the chance to investigate. In Larch&apos;s case, transferring admission authority changes who can get that chance. It does not change what an admitted team is allowed to do.</p>
        <p>This is the project&apos;s judgment about the supplied arrangement. It supports examining admission rules alongside research and publication rights. It does not establish that Larch will use its veto to suppress criticism, or that any present-day institution does so.</p>
        <p>The mechanism is selection. A right to publish applies to people who have already gained access. If an organization can exclude a qualified applicant, it can affect which questions get investigated without editing the eventual report. The fiction holds competence criteria, screening staff, budget and waiting times constant, so the replay supplies no extra workload or technical reason for moving that authority.</p>
        <p>Seger and colleagues distinguish public release from controlled access for external evaluation. They discuss research interfaces with permissions suited to the work, and propose mediation of researcher admission to address favoritism and developer control over research opportunities. These are proposals and concerns in a 2023 report, not proof that a particular access program is independent or effective. <a href={`${source.url}#page=19`} target="_blank" rel="noopener noreferrer">Read §§4.1.3 and 4.2.3, pp. 19–20 and 25 (new tab)</a>.</p>
      </div>
      <figure className={styles.exhibit}>
        <figcaption><strong>Only the enclave&apos;s admission authority changes</strong><span>The three proposed release plans over the same three-month period. Every entry describes the exercise&apos;s fictional terms or identifies a term it leaves unspecified.</span></figcaption>
        <div className={styles.comparisonRows}>
          {accessComparisonRows(episode).map(row => <section key={row.id} aria-label={row.label}>
            <h3>{row.label}</h3>
            <dl>{([['Admission', row.admission], ['Observation', row.observation], ['Publication', row.publication], ['Revocation', row.revocation]] as const).map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>
          </section>)}
        </div>
        <p>Research context: the cited report discusses structured access and independent mediation. It does not supply Larch&apos;s permissions. In particular, this exercise specifies an admission veto, not a new power to revoke access or block publication after admission.</p>
      </figure>
      <div className={styles.readingBody}>
        <h3>The tradeoff survives the comparison</h3>
        <p>A release committee could accept developer admission control because it wants the organization responsible for hosting the model to retain authority over entry. That is a governance choice with a cost: outside scrutiny can depend on the subject&apos;s permission. The exercise does not establish that the independent panel has better judgment, that the veto will be abused, or that public release is safe.</p>
        <p>Public weights avoid this admission gate, but the supplied terms also remove Larch&apos;s ability to recall downloaded copies. Hosted access retains the model inside the institute while denying outsiders direct examination of its internals. Neither alternative becomes consequence-free because the enclave has a governance weakness. Choosing one requires saying which cost you are prepared to accept.</p>
        <h3>What would change the judgment?</h3>
        <p>A binding appeal that can overturn an exclusion would weaken the claim that developer permission is decisive. Evidence of how qualified applicants are admitted or rejected, whether research permissions fit the questions being asked, and whether critical findings can be published would matter more than the label “external.” These are questions for evaluating a real arrangement; the exercise supplies none of those records.</p>
        <p>For discussion, take one disputed application and ask who could reverse a refusal. Then ask which new cost that safeguard would impose. That keeps the debate on an institutional choice people can examine, while leaving open whether any particular release plan is justified.</p>
        <p className={styles.sourceNote}>Source consulted 10 September 2026: {source.title}, Centre for the Governance of AI, 2023. No current institution is assessed here. The exhibit is an original comparison of fictional stipulations; the judgment and discussion questions are the project&apos;s editorial interpretation.</p>
      </div>
    </details>
  </section>
}
