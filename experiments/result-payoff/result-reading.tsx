/* eslint-disable @next/next/no-html-link-for-pages -- Full document navigation is intentional: leaving clears ephemeral answers and avoids speculative prefetch. */
import { foundationExample, aiExample, makeSyntheticRecord, qualifyRecord, authoredReadingUnavailable, type SyntheticRecord } from "./fixtures"
import { Evidence, ExactComparison } from "./evidence-view"
import { FoundationFollowup, ReflectionPair } from "./followups"
import { HeroMarks } from "./hero-marks"
import type { Claim } from "./evidence"
import styles from "./payoff.module.css"

export function ResultReading({ instrument, record }: { instrument: "foundation" | "ai"; record?: SyntheticRecord }) {
  if (instrument === "ai") return <AiReading record={record} />
  const example = foundationExample(record)
  if (!example) return <MissingReading applicable={record ? qualifyRecord(record) : false} />
  const { archetype, result, claim, evidence, comparison } = example
  const modelClaim: Claim = { ...claim, id: "foundation-exact-comparison", kind: "exact model comparison", text: "The two leading families remain close.", refs: [{ id: "foundation-synthetic-result", text: JSON.stringify(result.dimensionScores) }], supports: `Each term uses this core form's registered neutral mean and standard deviation, multiplied by the difference in the exact V2 family profiles. The rounded leading scores differ by ${(comparison.primaryScore - comparison.alternativeScore).toFixed(2)}.`, doesNotSupport: "A narrow model gap does not establish a stable identity, a probability, or that the reader is undecided." }
  const rival: Claim = { ...claim, id: "foundation-rival-explanation", kind: "editorial interpretation", text: "Does monitoring sustain the bargain, or does the balance of power sustain the monitoring?", refs: [...claim.refs, { id: "inf-reviewed-rival", text: "research/worldview-cases/verified-case-library.json: security-arms-control-verification / verifiedProfileReading (internal editorial interpretation)" }], supports: "A substantive rival argument consistent with the preparation answer: agreements may endure because both parties fear the costs of unconstrained competition. The disagreement concerns how much monitoring can do when interests diverge.", doesNotSupport: "This is an editorial rival, not the reader's second choice, and not an extreme numerical answer substitution." }
  return <article>
    <header className={styles.hero}>
      <HeroMarks instrument="foundation" />
      <h1>{archetype.name}</h1>
      <p className={styles.qualification}>Two modeled readings remain close: {comparison.primary} and {comparison.alternative}.</p>
      <p className={styles.lead}>{claim.text}</p>
      <a className={styles.primary} href="#foundation-answers">See the three answers together ↓</a>
    </header>
    <div className={styles.resultGrid}>
      <div>
        <section id="foundation-answers" className={styles.act}>
          <h2>Preparation, agreements and limits</h2>
          <div className={styles.answerList}>{evidence.map(e => <div key={e.id}><p>“{e.text}”</p><strong>{e.answer}/7 · {e.answer === 7 ? "Strongly agree" : "Agree"}</strong></div>)}</div>
          <p>The combination matters: preparation remains necessary, yet distrust does not make agreements futile. Avoiding overextension limits how far this example would press an advantage.</p>
          <Evidence claim={claim} />
        </section>
        <section className={styles.act}><h2>{rival.text}</h2>
          <p>The institutional reading gives inspections and repeated contact an independent role: they can make cooperation possible even with limited trust.</p>
          <p>The realist rival asks whether those arrangements last only while the costs of unconstrained competition keep both parties inside them. If a one-sided advantage becomes large enough, better monitoring may reveal defection without preventing it.</p>
          <Evidence claim={rival} /><FoundationFollowup />
        </section>
        <RecordDisclosure record={record ?? makeSyntheticRecord("foundation")} />
      </div>
      <aside className={styles.sticky}><div className={styles.readingDiagram}>
        <h2>Two readings of these answers</h2>
        <p><strong>{comparison.primary}</strong><br />Monitoring helps sustain a bargain despite distrust.</p>
        <div className={styles.hinge}>Preparation + monitoring + limits on commitment</div>
        <p><strong>{comparison.alternative}</strong><br />A bargain holds while power and incentives support it.</p>
        <details className={styles.evidence}><summary>Method: compare the two readings</summary><ExactComparison comparison={comparison} claim={modelClaim} /></details>
      </div></aside>
    </div>
  </article>
}
function AiReading({ record }: { record?: SyntheticRecord }) {
  const example = aiExample(record)
  if (!example) return <MissingReading applicable={record ? qualifyRecord(record) : false} />
  const { result, claim, pairClaim, evidence, pair, comparison, pairDiagnostic } = example
  const modelClaim: Claim = { ...claim, id: "ai-exact-comparison", kind: "exact model comparison", refs: [{ id: "ai-synthetic-axis-scores", text: JSON.stringify(result.axisScores) }], text: "Terms in the exact leading-minus-alternative model comparison.", supports: `For bank 3/scorer 2: (axis score − 4) × (primary profile weight − runner profile weight), using the version registry. Sum plus rounding residual equals the ${(comparison.primaryScore - comparison.alternativeScore).toFixed(2)} rounded-score gap.`, doesNotSupport: "Distance from midpoint is a different quantity. These terms do not identify causal effects of individual items." }
  const rival: Claim = { ...claim, id: "ai-rival-accountability", kind: "editorial interpretation", text: "Who can challenge a release decision?", supports: `The nearest model alternative, ${comparison.alternative}, puts more weight on public oversight and legitimacy. A substantive rival asks who can contest a lab's thresholds and evaluator admissions, even if release is cautious.`, doesNotSupport: "The model comparison does not prove this is the strongest scholarly objection or the reader's own next-best policy." }
  const pairCore = (pair[0].answer + 8 - pair[1].answer) / 2
  return <article>
    <header className={styles.hero}>
      <HeroMarks instrument="ai" />
      <h1>Stewardship</h1>
      <p className={styles.qualification}>Current model label: <strong>{result.archetypeLabel}</strong></p>
      <p className={styles.lead}>{claim.text}</p>
      <a href="#ai-answers" className={styles.primary}>Read the answers and the alternative ↓</a>
    </header>
    <div className={styles.resultGrid}>
      <div>
        <section className={styles.act} id="ai-answers"><h2>Risk concern and outside evaluation</h2>
          <div className={styles.answerList}>{evidence.map(e => <div key={e.id}><p>“{e.text}”</p><strong>{e.answer}</strong></div>)}</div>
          <p>The risk answer and two scenario choices distinguish concern about severe consequences from how access should be governed. They do not establish whether the supplied capability evidence is conclusive.</p><Evidence claim={claim} />
        </section>
        <section className={styles.act}><h2>{rival.text}</h2><p>Closest modeled alternative: <strong>{comparison.alternative}</strong>. A cautious developer can still control whose criticism gets heard. The rival argument asks for public authority over the rules and independent access to test them.</p><Evidence claim={rival} />
          <p><a href="/dev/result-payoff?episode=access">Make that decision: Who gets access? →</a></p>
          <ReflectionPair />
        </section>
        <details className={styles.sources}><summary>Method: comparison, averaging and display title</summary>
          <ExactComparison comparison={comparison} claim={modelClaim} />
          <h3>What this particular average leaves out</h3>
          <p>Core geopolitics: ({pair[0].answer} + (8 − {pair[1].answer})) / 2 = {pairCore}. The pairs (7, 7), (1, 1) and (4, 4) all give 4. With every other answer fixed to this synthetic record, these pairs produce {pairDiagnostic.identical ? "identical" : "different"} full Standard results; final geopolitics for the paired counterexamples is {pairDiagnostic.finalGeopolitics}. Their distinct answers remain separate above.</p>
          <p>This concerns the different meanings of these two questions. It does not establish that every average is invalid or that their midpoint means moderation or indecision.</p>
          <p>Stewardship and its mark are experiment-only editorial display hypotheses for this example. The issued name, ranking and scorer remain unchanged. The mark depicts no nation, religion, organization or IR family.</p>
        </details>
        <RecordDisclosure record={record ?? makeSyntheticRecord("ai-governance")} />
      </div>
      <aside className={styles.sticky}><figure className={styles.readingDiagram}>
        <figcaption><h2>Expectation and priority</h2></figcaption>
        <p>{pairClaim?.text ?? "These recorded answers do not endorse both rivalry and coordination. They do not support the example's high-endorsement reading of this pair."}</p>
        {pair.map((answer, i) => <div className={styles.pairItem} key={answer.id}><h3>{i === 0 ? "Expectation" : "Priority"}</h3><p>{answer.text}</p><strong>{answer.answer}/7 · {answer.answer === 7 ? "Strongly agree" : answer.answer === 1 ? "Strongly disagree" : answer.answer === 4 ? "Scale midpoint" : "Recorded response"}</strong></div>)}
        {pairClaim && <Evidence claim={pairClaim} />}
      </figure></aside>
    </div>
  </article>
}
function RecordDisclosure({ record }: { record: SyntheticRecord }) {
  return <details className={styles.sources}><summary>Complete synthetic fixture and binding</summary><p>This example was authored from scratch. Integrity checks bind responses to their exact form and result; separate applicability checks test whether each authored claim fits those responses. No browser profile is loaded.</p><pre>{JSON.stringify(record, null, 2)}</pre></details>
}
export function MissingReading({ applicable = false }: { applicable?: boolean }) {
  return <article className={styles.missing}>
    <h1>{applicable ? "These answers need another reading." : "The score cannot tell us why."}</h1>
    <p className={styles.lead}>{applicable ? authoredReadingUnavailable : "A shared score vector does not preserve the answers that produced it. This example has no correctly bound item evidence, so there is no answer-based reading to show."}</p>
    <p>The useful next step is specific: would reciprocal access matter more to you than an independent check?</p>
    <FoundationFollowup />
    <details className={styles.evidence}><summary>Why this reading stays unavailable</summary><p>Missing responses, a stale bank/scorer/form/copy tuple, a changed result or a mismatched answer binding all fail closed. Valid evidence also needs to satisfy the authored claim&apos;s answer conditions and comparison scope. A matching score alone cannot recover item responses.</p><p>No moderation, indecision or stable identity is inferred from a midpoint or a narrow gap.</p></details>
  </article>
}
