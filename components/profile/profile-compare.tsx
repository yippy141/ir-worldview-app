"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { parseComparisonInput, MAX_COMPARISON_INPUT } from "@/lib/connected/input"
import { DOMAIN_LABELS, withDeclaredExposure, type EvidenceBundle, type Domain, type Observation } from "@/lib/connected/evidence"
import { buildEvidenceComparison } from "@/lib/profile-compare"
import { loadProfileStore } from "@/lib/profile-store"
import { EvidenceList, loadLocalProfileEvidence } from "@/components/profile/connected-profile"

type Person = { name: string; raw: string; form: string; wording: boolean; selected?: EvidenceBundle }
const emptyPerson = (): Person => ({ name: "", raw: "", form: "", wording: false })
export function ProfileCompare() {
  const [people, setPeople] = useState<[Person, Person]>([emptyPerson(), emptyPerson()])
  const [saved, setSaved] = useState<EvidenceBundle | null>(null)
  const [pair, setPair] = useState<[EvidenceBundle, EvidenceBundle] | null>(null)
  const [names, setNames] = useState<[string, string]>(["First person", "Second person"])
  const [error, setError] = useState("")
  const [legacy, setLegacy] = useState(false)
  const [ready, setReady] = useState(false)
  const resultHeading = useRef<HTMLHeadingElement>(null)
  const firstInput = useRef<HTMLTextAreaElement>(null)
  const savedRequest = useRef(0)
  useEffect(() => {
    const timer = window.setTimeout(() => {
    const query = new URLSearchParams(window.location.search)
    const left = query.get("left"), right = query.get("right")
    if (left || right) {
      setLegacy(true)
      setPeople([{ ...emptyPerson(), raw: left ?? "" }, { ...emptyPerson(), raw: right ?? "" }])
      window.history.replaceState(window.history.state, "", window.location.pathname)
      const l = parseComparisonInput(left ?? "", window.location.origin), r = parseComparisonInput(right ?? "", window.location.origin)
      if (l.ok && r.ok) setPair([l.evidence, r.evidence])
      else setError("One or both historical links could not be read. Paste valid result links below.")
    }
    setReady(true)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])
  useEffect(() => { if (pair) resultHeading.current?.focus() }, [pair])
  function update(index: number, patch: Partial<Person>) {
    setPeople(current => current.map((p, i) => i === index ? { ...p, ...patch } : p) as [Person, Person])
    setPair(null); setError("")
  }
  function replaceResult(index: number, raw: string, selected?: EvidenceBundle) {
    // Manual completion details belong only to the result they were confirmed for.
    update(index, { raw, selected, form: "", wording: false })
  }
  function compare(event: FormEvent) {
    event.preventDefault()
    const decoded = people.map(p => {
      const exposure = { form: p.form || null, language: p.wording ? "en" : null, copy: p.wording ? 1 : null, declared: true }
      return p.selected ? { ok: true as const, evidence: withDeclaredExposure(p.selected, exposure) } : parseComparisonInput(p.raw, window.location.origin, exposure)
    })
    if (!decoded[0].ok || !decoded[1].ok) {
      setError("One or both links could not be read. Use a result or shared Profile link from this app."); setPair(null); return
    }
    setNames([people[0].name.trim() || "First person", people[1].name.trim() || "Second person"])
    setPair([decoded[0].evidence, decoded[1].evidence])
  }
  function reset() {
    savedRequest.current++
    setPeople([emptyPerson(), emptyPerson()]); setPair(null); setSaved(null); setError(""); setLegacy(false)
    firstInput.current?.focus()
  }
  const comparisons = pair ? buildEvidenceComparison(...pair) : []
  return <div className="connected-compare">
    <form className="compare-input-panel stack-md" onSubmit={compare}>
      <div className="compare-form-grid">
        {people.map((person, index) => <fieldset className="compare-person stack-sm" key={index}>
          <legend>{index === 0 ? "First person" : "Second person"}</legend>
          <label className="stack-xs"><span>Display name (optional)</span><input maxLength={60} value={person.name} onChange={e => update(index, { name: e.target.value })} autoComplete="off" /></label>
          <label className="stack-xs"><span>{index === 0 ? "Your result or shared Profile link" : "Their voluntarily shared result or Profile link"}</span><textarea ref={index === 0 ? firstInput : undefined} className="compare-textarea" maxLength={MAX_COMPARISON_INPUT} value={person.raw} onChange={e => replaceResult(index, e.target.value)} autoComplete="off" spellCheck={false} required={!person.selected} /></label>
          {index === 0 && <><button type="button" className="cta-secondary" onClick={() => { const request = ++savedRequest.current; void loadLocalProfileEvidence(loadProfileStore()).then(bundle => { if (request === savedRequest.current) setSaved(bundle) }) }}>Use my saved result</button>
            {saved && <label className="stack-xs"><span>Choose one result to include</span><select value={Object.keys(person.selected ?? {})[0] ?? ""} onChange={e => {
              const domain = e.target.value as Domain
              replaceResult(0, domain ? `Selected: ${DOMAIN_LABELS[domain]}` : "", domain ? { [domain]: saved[domain] } : undefined)
            }}><option value="">Choose a subject</option>{Object.keys(saved).map(key => <option key={key} value={key}>{DOMAIN_LABELS[key as Domain]}</option>)}</select>{Object.keys(saved).length === 0 && <span>No results are saved in this browser.</span>}</label>}</>}
          <details className="compare-completion"><summary>Completion details, if known</summary>
            <p>AI links omit the form. Standalone AI and Security/Technology links omit language and wording details. Leave these unknown unless the original completion confirms them.</p>
            <label className="stack-xs"><span>AI form</span><select value={person.form} onChange={e => update(index, { form: e.target.value })}><option value="">Unknown</option><option value="standard">Standard</option><option value="analyst">Advanced</option></select></label>
            <label className="compare-checkbox"><input type="checkbox" checked={person.wording} onChange={e => update(index, { wording: e.target.checked })} />The original completion used English wording edition 1</label>
          </details>
        </fieldset>)}
      </div>
      <p className="result-scope">Names are local labels. Newly pasted links are read in this page without fetching them, saving them or sending them to the server. Leaving or resetting clears this comparison.</p>
      {legacy && <p role="note">This historical comparison URL already sent its contents to the server when opened. Removing them from the address bar cannot undo that request.</p>}
      <div className="row gap-sm wrap"><button type="submit" className="primary-button" disabled={!ready}>Compare results</button><button className="cta-secondary" type="button" onClick={() => { setPeople([people[1], people[0]]); if (pair) { setPair([pair[1], pair[0]]); setNames([names[1], names[0]]) } }}>Swap people</button><button className="cta-secondary" type="button" onClick={reset}>Reset comparison</button></div>
      {error && <p role="alert">{error}</p>}
    </form>
    {pair && <section className="comparison-output stack-lg" aria-labelledby="comparison-heading">
      <h2 id="comparison-heading" ref={resultHeading} tabIndex={-1}>{names[0]} and {names[1]}</h2>
      {comparisons.map(c => <section className="comparison-domain stack-md" key={c.domain} data-comparison-state={c.state}>
        <h3>{c.title}</h3><p className="comparison-lead">{c.summary}</p>
        {c.rows.length > 0 ? <table className="comparison-table"><caption>Scores on each question area · 1 to 7</caption><thead><tr><th scope="col">Question area</th><th scope="col">{names[0]}</th><th scope="col">{names[1]}</th></tr></thead><tbody>{c.rows.map(row => <tr key={row.key}><th scope="row">{row.label}{row.poles && <span>1: {row.poles.low} · 7: {row.poles.high}</span>}<span>{row.reading}</span></th><td>{row.left.toFixed(2)}</td><td>{row.right.toFixed(2)}</td></tr>)}</tbody></table> : <div className="comparison-independent">{[c.left, c.right].map((r, i) => <article key={i}><h4>{names[i]}</h4>{r ? <><p>{r.title}</p><ul>{Object.entries(r.scores).map(([key, value]) => <li key={key}>{r.labels[key]}: {value.toFixed(2)}{r.poles?.[key] && <span className="comparison-poles">1: {r.poles[key].low} · 7: {r.poles[key].high}</span>}</li>)}</ul></> : <p>No {c.title} result supplied.</p>}</article>)}</div>}
        {c.largest.length > 1 && <p>These gaps are equal; their display order does not rank their importance.</p>}
        {(c.sharedChoices.length > 0 || c.differentChoices.length > 0) && <p>{c.sharedChoices.length} supplied choices match; {c.differentChoices.length} differ. Reasons are compared only when explicitly supplied.</p>}
        <h4>A possible discussion</h4><p>{c.prompt}</p>
        <details><summary>Inspect the contributing evidence</summary>
          <p>{c.comparability.reason} {c.left?.provenance.exposureSource === "declared" || c.right?.provenance.exposureSource === "declared" ? "Some completion details were supplied by the people comparing." : ""}</p>
          <div className="comparison-independent">{[c.left, c.right].map((r, i) => <article key={i}><h4>{names[i]}</h4>{r && <><EvidenceList evidence={r.observations.filter((o: Observation) => o.kind !== "derived-score")} />{r.missingness && <p>{r.missingness}</p>}<p className="result-scope">Bank {r.provenance.bank ?? "unknown"}, scorer {r.provenance.scorer ?? "unknown"}, form {r.provenance.form ?? "unknown"}, language {r.provenance.language ?? "unknown"}, wording {r.provenance.copy ?? "unknown"}</p></>}</article>)}</div>
        </details>
      </section>)}
      <p className="result-scope">A gap below 0.35 is described as small. This is an editorial display rule, not statistical significance. Missing subjects do not count as agreement. <Link href="/method#connected-comparisons">Comparison method</Link></p>
      <p><Link href={comparisons.some(c => c.domain === "ai" || c.domain === "technology") ? "/decisions/who-gets-access" : "/decisions"}>Try a decision together</Link>. The exercise starts without an answer from either person.</p>
    </section>}
  </div>
}
