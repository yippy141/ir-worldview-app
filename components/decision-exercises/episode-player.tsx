/* eslint-disable @next/next/no-html-link-for-pages -- Full document navigation is intentional: leaving clears ephemeral answers and avoids speculative prefetch. */
"use client"

import { useRef, useState } from "react"
import { completeEpisode, episodeProvenance, type Episode, type Decision, deferredDecision } from "@/lib/decision-exercises/content"
import { Evidence } from "./evidence"
import styles from "./exercise.module.css"
import { comparisonStatus } from "@/lib/decision-exercises/status"
import { decisionHref } from "@/lib/decision-exercises/catalog"
import { useClearOnExit } from "./use-clear-on-exit"

const empty = (): Decision => ({ option: "", reason: "" })
function InspectionEdge({ from, to, allowed }: { from: string; to: string; allowed: boolean }) {
  return <div><strong>{from}</strong><svg width="40" height="28" viewBox="0 0 40 28" aria-hidden="true" data-inspection-edge={allowed ? "allowed" : "blocked"}>
    {allowed ? <path d="M2 14 H36 M28 7 L36 14 L28 21" /> : <path d="M14 8 L26 20 M26 8 L14 20" />}
  </svg><strong>{to}</strong><small>{from} {allowed ? "may" : "may not"} inspect {to}.</small></div>
}
export function Arrangement({ episode, optionId, replay, submitted = false }: { episode: Episode; optionId: string; replay: boolean; submitted?: boolean }) {
  const option = episode.options.find(o => o.id === optionId)
  if (optionId === "defer") return <figure className={styles.arrangement}><figcaption>Decision withheld</figcaption><p>More information or revised terms are needed. No inspection or release arrangement has been selected.</p></figure>
  const nodes = option?.diagram
  const national = episode.id === "verify" && (!option || option.id === "national")
  const enclave = episode.id === "access" && (!option || option.id === "enclave")
  return <figure className={styles.arrangement} data-arrangement={option?.id ?? "proposed"}>
    <figcaption>{option ? `${submitted ? "Selected" : "Considering"}: ${option.label}` : episode.id === "verify" ? "Proposed national inspection rights" : "Proposed evaluator admissions"}</figcaption>
    {national ? <><div className={styles.accessLines}>
      <InspectionEdge from="Arden" to="Belvar" allowed={!replay} />
      <InspectionEdge from="Belvar" to="Arden" allowed />
    </div><p className={styles.small}>Arrow: authorized inspection. Cross: no inspection right.</p></> : enclave ? <>
      <div className={styles.admissionGate} data-admissions={replay ? "developer" : "independent"}>
        <strong>{replay ? "Larch controls admission" : "Independent panel controls admission"}</strong>
        <span>{replay ? "Developer may veto a qualified applicant" : "No developer veto"}</span>
      </div>
      <div className={styles.nodes}><span className={styles.connector}>Admits qualified teams</span><strong>Secure research enclave</strong></div>
      <p>Fixed rights for admitted teams: examine and modify inside the enclave; publish criticism. Weights stay inside.</p>
    </> : <div className={styles.nodes}>
      <strong>{nodes![0]}</strong><span className={styles.connector}>{nodes![1]}</span><strong>{nodes![2]}</strong>
      {option?.id === "custodian" && <p className={styles.fixedRights}>Custodian access to both sides remains reciprocal.</p>}
    </div>}
    {!option && <p className={styles.small}>These are proposed rights. Selecting an arrangement below decides whether to use them.</p>}
  </figure>
}
export function EpisodePlayer({ episode, links, preview = false }: { episode: Episode; links?: { next: string; exit: string }; preview?: boolean }) {
  const [stage, setStage] = useState<0 | 1 | 2>(0)
  const [first, setFirst] = useState<Decision>(empty)
  const [submittedOriginal, setSubmittedOriginal] = useState(false)
  const [invalidated, setInvalidated] = useState(false)
  const [second, setSecond] = useState<Decision>(empty)
  useClearOnExit(() => { setFirst(empty()); setSecond(empty()); setStage(0); setSubmittedOriginal(false); setInvalidated(false) })
  const heading = useRef<HTMLHeadingElement>(null)
  const answer = stage === 0 ? first : second
  function setAnswer(next: Decision) {
    if (stage === 0) {
      setFirst(next)
      if (next.option !== first.option || next.reason !== first.reason) {
        setSecond(empty())
        if (submittedOriginal) setInvalidated(true)
      }
    } else setSecond(next)
  }
  const result = stage === 2 ? completeEpisode(episode, first, second) : null
  function move(next: 0 | 1 | 2) {
    setStage(next)
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: "start" }) })
  }
  function reset() { setFirst(empty()); setSecond(empty()); setSubmittedOriginal(false); setInvalidated(false); move(0) }
  const nextEpisode = episode.id === "verify" ? "access" : "verify"
  const status = comparisonStatus(first, second)
  const label = (id: string) => id === "defer" ? "Decision withheld" : episode.options.find(option => option.id === id)!.label
  return <article className={`${styles.page} ${preview ? styles.embedded : ""}`}>
    <h1 ref={heading} tabIndex={-1}>{episode.title}</h1>
    <p className={styles.lead}>{episode.invitation}</p>
    <p className={styles.small}>Fictional decision exercise · Unscored{preview ? " · Draft for local review" : ""}</p>
    <noscript><p>The assumptions and arrangements below can be read without JavaScript. Submission and comparison require JavaScript; no choice has been submitted.</p><style>{".payoff-dynamic { display: none !important; }"}</style></noscript>
    {result ? <div className={styles.episodeGrid}>
      <div>
        <h2>Your decision under each condition</h2>
        <dl className={styles.comparison} aria-label="Submitted decisions"><div><dt>Original provision</dt><dd>{label(first.option)}</dd></div><div><dt>Changed provision</dt><dd>{label(second.option)}</dd></div></dl>
        <p data-conditional-readback data-rule={result.ruleId}>{result.interpretation.text}</p>
        <p className={styles.small}>{result.interpretation.doesNotSupport}</p>
        <details className={styles.evidence}><summary>Complete transcript and interpretation evidence</summary>
          <p>{result.observation.text}</p>
          <p>Original principal reason: {episode.reasons.find(reason => reason.id === first.reason)!.text}</p>
          <p>Replay principal reason: {episode.reasons.find(reason => reason.id === second.reason)!.text}</p>
          <Evidence claim={result.observation} /><Evidence claim={result.interpretation} /><Evidence claim={result.question} />
        </details>
        <div className={styles.next}><h3>A question left open</h3><p>{result.question.text}</p>
          <a className={styles.primary} href={links?.next ?? decisionHref(nextEpisode)}>{episode.id === "verify" ? "Next decision: Who gets access?" : "Another decision: Who gets to verify?"} →</a>
          <p><a href={episode.related.href}>{episode.related.title} →</a><br />{episode.related.why}</p>
          <details className={styles.evidence}><summary>Optional personal baseline</summary><p>A baseline can supply another question to examine. It is not needed to complete either episode, and similar choices across them do not establish a cross-domain relationship.</p><p><a href="/quiz">Existing Foundation questionnaire</a>{" · "}<a href="/ai/quiz">Existing AI Governance questionnaire</a></p></details>
        </div>
        <button className={styles.textButton} onClick={() => move(1)}>Back to replay</button><button className={styles.textButton} onClick={reset}>Reset and clear choices</button>
      </div>
      <aside className={styles.sticky} aria-label="Choice comparison"><p className={styles.choiceStatus} data-comparison-status>{status.decisions}<br /><span className={styles.small}>{status.reasons}</span></p>
        <p>{episode.condition.after}</p><Arrangement episode={episode} optionId={second.option} replay submitted />
      </aside>
    </div> : <div className={styles.episodeGrid}>
      <div>
        <h2>{stage === 0 ? "The original decision" : "Replay: one condition changes"}</h2>
        {stage === 0 ? <><p>{episode.actor}</p><div aria-label="Scenario assumptions">{episode.assumptions.map(a => <p key={a}>{a}</p>)}</div><p className={styles.small}><strong>Unknown.</strong> {episode.unknown}</p></> : <p>{episode.condition.unchanged}</p>}
        <div className={styles.changed}><h3>{episode.condition.label}</h3>{stage === 1 && <p className={styles.small}>Before: {episode.condition.before}</p>}<p><strong>{stage === 1 ? "Now: " : ""}{stage === 0 ? episode.condition.before : episode.condition.after}</strong></p></div>
        {invalidated && <p role="status">The replay was cleared after editing the original decision. Submit both decisions again.</p>}
        <fieldset><legend>{episode.question}</legend><p className={styles.small}>Choose among these three arrangements, or withhold a decision if you need different terms or information.</p>{episode.options.map(option => <label className={styles.option} key={option.id}>
          <input className="payoff-dynamic" type="radio" name={`${episode.id}-arrangement`} value={option.id} checked={answer.option === option.id} onChange={() => setAnswer({ ...answer, option: option.id })} />
          <span><strong>{option.label}</strong><span>{option.logic}</span><span className={styles.cost}>Accepted cost: {option.acceptedTradeoff}</span></span>
        </label>)}<label className={`${styles.radio} payoff-dynamic`}><input type="radio" name={`${episode.id}-arrangement`} value="defer" checked={answer.option === "defer"} onChange={() => setAnswer({ ...answer, option: "defer" })} /><span>{deferredDecision.label}<span className={styles.deferNote}>{deferredDecision.logic}</span></span></label></fieldset>
        <div className="payoff-dynamic"><fieldset><legend>What is your principal reason?</legend>{episode.reasons.map(reason => <label className={styles.radio} key={reason.id}>
          <input type="radio" name={`${episode.id}-reason`} value={reason.id} checked={answer.reason === reason.id} onChange={() => setAnswer({ ...answer, reason: reason.id })} />{reason.text}
        </label>)}</fieldset>
          <p className={styles.small}>Choose an arrangement and a principal reason, then submit. Selection does not advance.</p>
          <div className={styles.actions}>{stage === 1 && <button className={styles.textButton} onClick={() => move(0)}>Back to original</button>}
            <button className={styles.primary} disabled={!answer.option || !answer.reason} onClick={() => { if (stage === 0) setSubmittedOriginal(true); else setInvalidated(false); move(stage === 0 ? 1 : 2) }}>{stage === 0 ? "Submit and see the changed condition" : "Submit and read the interpretation"}</button>
            <button className={styles.textButton} onClick={reset}>Reset and clear choices</button></div>
        </div>
      </div>
      <aside className={styles.sticky}><Arrangement episode={episode} optionId={answer.option} replay={stage === 1} /></aside>
    </div>}
    <details className={styles.sources}><summary>Sources and fictional assumptions</summary><p>All scenario facts are supplied assumptions, not contemporary intelligence or forecasts. These sources support mechanisms, not a correct policy choice or a verified hypothetical outcome. Fiction does not remove wording effects or bias.</p><p>Two responses and self-reported reasons do not isolate causal effects. A later research design would be needed for that. No interpretation uses nationality, citizenship, inferred location or language.</p><p>{episode.outcome.caveat}</p>
      {episode.sources.map(source => <div key={source.id}><h3><a href={source.url}>{source.title}</a></h3><p>{source.scope}</p><p className={styles.metadata}>{source.kind === "internal-editorial" ? "Internal editorial material, not independent research" : source.kind === "primary" ? "Primary source record" : "Research source"}<br />{source.publisher} · {source.publishedAt ?? "Undated"} · accessed {source.accessedAt}<br /><code>{source.locator}</code></p></div>)}
      <p className={styles.metadata}>{episode.id} v{episode.version} · {episode.status} · {episodeProvenance(episode).form}</p>
    </details>
    <p className={styles.small}>Choices live only in this page&apos;s memory. Reset, close or leave this page to clear them. Opening the next exercise clears these choices.</p>
    <a href={links?.exit ?? "/decisions"}>Close exercise and clear choices</a>
  </article>
}
