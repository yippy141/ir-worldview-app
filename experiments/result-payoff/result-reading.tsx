/* eslint-disable @next/next/no-html-link-for-pages -- Full document navigation is intentional: leaving clears ephemeral answers and avoids speculative prefetch. */
import { FoundationMark } from "@/components/archetypes/archetype-mark"
import { lensFromFamily, type BlendArchetype } from "@/lib/archetypes"
import type { PureArchetypeCode } from "@/lib/archetype-marks"
import { foundationExample, aiExample, makeSyntheticRecord } from "./fixtures"
import { Evidence, ExactComparison } from "./evidence-view"
import { FoundationFollowup, ReflectionPair } from "./followups"
import type { Claim } from "./evidence"
import styles from "./payoff.module.css"

export function ResultReading({ instrument }: { instrument: "foundation" | "ai" }) {
  if (instrument === "ai") return <AiReading />
  const example = foundationExample()
  if (!example) return <MissingReading />
  const { archetype, result, claim, evidence, comparison } = example
  const modelClaim: Claim = { ...claim, id: "foundation-exact-comparison", kind: "exact model comparison", text: "The two leading families remain close.", refs: [{ id: "foundation-synthetic-result", text: JSON.stringify(result.dimensionScores) }], supports: "Each term uses this core form's registered neutral mean and standard deviation, multiplied by the difference in the exact V2 family profiles. The rounded leading scores differ by 0.30.", doesNotSupport: "A narrow model gap does not establish a stable identity, a probability, or that the reader is undecided." }
  const rival: Claim = { ...claim, id: "foundation-rival-explanation", kind: "editorial interpretation", text: "Does monitoring sustain the bargain, or does the balance of power sustain the monitoring?", refs: [...claim.refs, { id: "inf-reviewed-rival", text: "research/worldview-cases/verified-case-library.json: security-arms-control-verification / verifiedProfileReading" }], supports: "A substantive rival argument consistent with the preparation answer: agreements may endure because both parties fear the costs of unconstrained competition. The disagreement concerns how much monitoring can do when interests diverge.", doesNotSupport: "This is an editorial rival, not the reader's second choice, and not an extreme numerical answer substitution." }
  return <article className={styles.resultGrid}>
    <div>
      <header className={styles.hero}>
      <h1>{claim.text}</h1>
      <p className={styles.lead}>{claim.supports}</p>
      <div className={styles.resultIdentity}>
        {"archetypes" in archetype ? <FoundationMark code={archetype.code as BlendArchetype["code"]} primaryCode={`${lensFromFamily(result.familyKey)}${archetype.posture}` as PureArchetypeCode} presentation="hero" /> : <FoundationMark code={archetype.code} presentation="hero" />}
        <div><h2>{archetype.name}</h2></div>
      </div>
      <p>Two live readings: <strong>{comparison.primary}</strong> and <strong>{comparison.alternative}</strong>. The small model gap leaves their disagreement worth exploring.</p>
      <a className={styles.primary} href="#foundation-answers">See the three answers together ↓</a>
      </header>
      <section id="foundation-answers" className={styles.act}>
        <h2>Prepare for rivalry. Make agreements work.</h2>
        <div className={styles.answerList}>{evidence.map(e => <div key={e.id}><p>“{e.text}”</p><strong>{e.answer}/7 · {e.answer === 7 ? "Strongly agree" : "Agree"}</strong></div>)}</div>
        <p>The combination is the finding: preparation remains necessary, yet distrust does not make agreements futile. Avoiding overextension also limits how far this example would press an advantage.</p>
        <Evidence claim={claim} />
      </section>
      <section className={styles.act}><h2>{rival.text}</h2>
        <p>The institutional reading gives inspections and repeated contact an independent role: they can make cooperation possible even with limited trust.</p>
        <p>The realist rival asks whether those arrangements last only while the costs of unconstrained competition keep both parties inside them. If a one-sided advantage becomes large enough, better monitoring may reveal defection without preventing it.</p>
        <Evidence claim={rival} /><FoundationFollowup />
      </section>
      <RecordDisclosure instrument="foundation" />
    </div>
    <aside className={styles.sticky}><div className={styles.readingDiagram}>
      <h2>Two ways to read the same combination</h2>
      <p><strong>{comparison.primary}</strong><br />Monitoring helps sustain a bargain despite distrust.</p>
      <div className={styles.hinge}>Preparation + monitoring + limits on commitment</div>
      <p><strong>{comparison.alternative}</strong><br />A bargain holds while power and incentives support it.</p>
      <ExactComparison comparison={comparison} claim={modelClaim} />
    </div></aside>
  </article>
}
function AiReading() {
  const example = aiExample()
  if (!example) return <MissingReading />
  const { result, claim, pairClaim, evidence, pair, comparison } = example
  const modelClaim: Claim = { ...claim, id: "ai-exact-comparison", kind: "exact model comparison", refs: [{ id: "ai-synthetic-axis-scores", text: JSON.stringify(result.axisScores) }], text: "Terms in the exact leading-minus-alternative model comparison.", supports: "For bank 3/scorer 2: (axis score − 4) × (primary profile weight − runner profile weight), using the version registry. Sum plus rounding residual equals the 0.87 rounded-score gap.", doesNotSupport: "Distance from midpoint is a different quantity. These terms do not identify causal effects of individual items." }
  const rival: Claim = { ...claim, id: "ai-rival-accountability", kind: "editorial interpretation", text: "Who can challenge a release decision?", supports: "The nearest model alternative, Democratic Guardrailist, puts more weight on public oversight and legitimacy. A substantive rival asks who can contest a lab's thresholds and evaluator admissions, even if release is cautious.", doesNotSupport: "The model comparison does not prove this is the strongest scholarly objection or the reader's own next-best policy." }
  return <article className={styles.resultGrid}>
    <div>
      <header className={styles.hero}>
      <h1>{claim.text}</h1>
      <p className={styles.lead}>{claim.supports}</p>
      <p>Current name: <strong>{result.archetypeLabel}</strong>. Closest modeled alternative: <strong>{comparison.alternative}</strong>.</p>
      <a href="#ai-answers" className={styles.primary}>See what the broad name leaves out ↓</a>
      </header>
      <section className={styles.act} id="ai-answers"><h2>Contain capability without closing scrutiny</h2>
        <div className={styles.answerList}>{evidence.map(e => <div key={e.id}><p>“{e.text}”</p><strong>{e.answer}</strong></div>)}</div>
        <p>Concern about severe risks supplies the reason to slow release. The two scenario choices distinguish pausing broad deployment from closing off outside testing.</p><Evidence claim={claim} />
      </section>
      <section className={styles.act}><h2>{rival.text}</h2><p>A cautious developer can still control whose criticism gets heard. The rival argument asks for public authority over the rules and independent access to test them. Its disagreement is about who has power to challenge decisions, not simply how slowly the model ships.</p><Evidence claim={rival} />
        <p><a href="/dev/result-payoff?episode=access">Make that decision: Who gets access? →</a></p>
        <ReflectionPair />
      </section>
      <details className={styles.sources}><summary>Exact model comparison</summary><ExactComparison comparison={comparison} claim={modelClaim} /></details>
      <RecordDisclosure instrument="ai-governance" />
    </div>
    <aside className={styles.sticky}><figure className={styles.readingDiagram}>
      <figcaption><h2>Expecting rivalry.<br />Preferring coordination.</h2></figcaption>
      <p>{pairClaim.text}</p>
      {pair.map((answer, i) => <div className={styles.pairItem} key={answer.id}><h3>{i === 0 ? "Expectation" : "Priority"}</h3><p>{answer.text}</p><strong>{answer.answer}/7 · Strongly agree</strong></div>)}
      <div className={styles.hinge}>Current core average: (7 + (8 − 7)) / 2 = 4</div>
      <p className={styles.small}>The pairs (1, 1) and (4, 4) also give 4. With every other answer fixed, all three produce the same full Standard result, including the scenario-adjusted geopolitics score of 3.7.</p>
      <Evidence claim={pairClaim} />
    </figure></aside>
  </article>
}
function RecordDisclosure({ instrument }: { instrument: "foundation" | "ai-governance" }) {
  const record = makeSyntheticRecord(instrument)
  return <details className={styles.sources}><summary>Complete synthetic fixture and binding</summary><p>This example was authored from scratch. Item responses are bound to this exact form and generated result before any answer-based claim is displayed. No browser profile is loaded.</p><pre>{JSON.stringify(record, null, 2)}</pre></details>
}
export function MissingReading() {
  return <article className={styles.missing}>

    <h1>The score cannot tell us why.</h1>
    <p className={styles.lead}>A shared score vector does not preserve the answers that produced it. This example has no correctly bound item evidence, so there is no answer-based reading to show.</p>
    <p>The useful next step is specific: would reciprocal access matter more to you than an independent check?</p>
    <FoundationFollowup />
    <details className={styles.evidence}><summary>Why the evidence stays unavailable</summary><p>Missing responses, a stale bank/scorer/form/copy tuple, a changed result or a mismatched answer binding all fail closed. A matching score alone cannot recover item responses.</p><p>No moderation, indecision or stable identity is inferred from a midpoint or a narrow gap.</p></details>
  </article>
}
