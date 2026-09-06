/* eslint-disable @next/next/no-html-link-for-pages -- Full document navigation is intentional: leaving clears ephemeral answers and avoids speculative prefetch. */
"use client"

import { useState } from "react"
import type { Claim, Provenance } from "./evidence"
import { Evidence } from "./evidence-view"
import styles from "./payoff.module.css"
import { useClearOnExit } from "./use-clear-on-exit"

const followupProvenance: Provenance = { instrument: "episode", bank: "unscored", scorer: "none", form: "optional-reflection", copy: 1, source: "experiments/result-payoff/followups.tsx" }
export function ReflectionPair() {
  const [values, setValues] = useState<[string, string]>(["", ""])
  const [submitted, setSubmitted] = useState<[string, string] | null>(null)
  useClearOnExit(() => { setValues(["", ""]); setSubmitted(null) })
  const questions = ["Over the next five years, how much strategic rivalry do you expect between leading AI powers?", "If coordination costs your country a near-term capability advantage, what should usually take priority?"]
  const options = [["Sustained rivalry", "Rivalry varies by issue", "Substantial easing", "I cannot judge"], ["A verifiable coordination agreement", "Keeping the capability advantage", "It depends on the specific agreement", "I cannot judge"]]
  const claim: Claim | null = submitted ? {
    id: "reflection-expectation-priority", provenance: followupProvenance, kind: "direct observation",
    refs: submitted.map((answer, i) => ({ id: `reflection-${i}`, text: `${questions[i]} Selected: ${answer}.` })),
    text: `You expect: ${submitted[0]}. Your stated priority: ${submitted[1]}.`,
    supports: "These are your two separate answers to this optional reflection.",
    doesNotSupport: "They do not revise the example's score or estimate a latent trait. No answer combination is designated correct.",
  } : null
  return <div className={styles.followup}>
    <h3>Separate the expectation from the priority</h3>
    <p>A fresh optional reflection, not a re-score. These answers are yours; the result above is synthetic.</p>
    <noscript><p>JavaScript is required to submit this reflection. No answer has been recorded.</p><style>{".payoff-dynamic { display: none !important; }"}</style></noscript>
    <div className="payoff-dynamic">
      {questions.map((q, i) => <fieldset key={q}><legend>{q}</legend>{options[i].map(option => <label className={styles.radio} key={option}><input type="radio" name={`reflection-${i}`} value={option} checked={values[i] === option} onChange={() => { const next: [string, string] = [...values]; next[i] = option; setValues(next); setSubmitted(null) }} />{option}</label>)}</fieldset>)}
      <p className={styles.small}>Choose one answer to each question, then submit.</p>
      <button className={styles.primary} disabled={values.some(v => !v)} onClick={() => setSubmitted([...values])}>Read the pair</button>
      <button className={styles.textButton} onClick={() => { setValues(["", ""]); setSubmitted(null) }}>Clear reflection</button>
      {claim && <div role="status" className={styles.readback}><p>{claim.text}</p><Evidence claim={claim} /></div>}
    </div>
  </div>
}
export function FoundationFollowup() {
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState("")
  useClearOnExit(() => { setAnswer(""); setSubmitted("") })
  const question = "A rival accepts outside checks at declared facilities but refuses reciprocal national inspections. Which condition matters most before you accept?"
  const options = ["An independent auditor can see both sides' records", "Each government has the same right to inspect", "The check can meaningfully expose a breach"]
  const claim: Claim = { id: "foundation-condition-followup", provenance: followupProvenance, kind: "direct observation", refs: [{ id: "foundation-condition", text: `${question} Selected: ${submitted}` }], text: `You made this condition the priority: ${submitted}.`, supports: "Your submitted condition in this reflection.", doesNotSupport: "It does not settle your general view of institutions. Try the episode to decide what cost you would accept for this condition." }
  return <div className={styles.followup}>
    <h3>What would make monitoring enough?</h3>
    <p>This unresolved condition is open to you, independent of the example result.</p>
    <noscript><p>Reflect on the question below. JavaScript is needed to submit; nothing has been recorded.</p><style>{".payoff-dynamic { display: none !important; }"}</style></noscript>
    <p>{question}</p><div className="payoff-dynamic"><fieldset><legend>Principal condition</legend>{options.map(option => <label className={styles.radio} key={option}><input type="radio" name="foundation-condition" checked={answer === option} onChange={() => { setAnswer(option); setSubmitted("") }} />{option}</label>)}</fieldset>
      <button className={styles.primary} disabled={!answer} onClick={() => setSubmitted(answer)}>Read this condition</button>
      <button className={styles.textButton} onClick={() => { setAnswer(""); setSubmitted("") }}>Clear reflection</button>
      {submitted && <div role="status" className={styles.readback}><p>{claim.text}</p><Evidence claim={claim} /></div>}
    </div>
    <p><a href="/dev/result-payoff?episode=verify">Try the decision: Who gets to verify? →</a></p>
  </div>
}
