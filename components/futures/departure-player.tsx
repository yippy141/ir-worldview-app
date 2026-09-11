"use client"

import { useEffect, useReducer, useRef, useState } from "react"
import Link from "next/link"
import { answerLabel, comparisonTitles, complete, departure, departureReducer, initialDepartureState, interpretDeparture, questionsFor, steps, type Comparison, type Framing } from "@/lib/futures/departure"
import { departureContinuation } from "@/lib/futures/sources"
import { DepartureDiagram } from "./departure-diagram"
import styles from "./departure.module.css"

export function DeparturePlayer() {
  const [state, dispatch] = useReducer(departureReducer, initialDepartureState)
  const [resetFraming, setResetFraming] = useState<Framing | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const keepDraft = useRef<HTMLButtonElement>(null)
  const resetTrigger = useRef<HTMLElement | null>(null)
  const previousStep = useRef(state.step)
  const { step, answers, framing } = state
  const isComparison = steps.includes(step as Comparison)
  const stage = isComparison ? step as Comparison : "a"
  const readings = step === "result" ? interpretDeparture(answers, framing) : []

  useEffect(() => {
    if (previousStep.current !== step) {
      heading.current?.focus()
      previousStep.current = step
    }
  }, [step])

  useEffect(() => {
    if (resetFraming) keepDraft.current?.focus()
  }, [resetFraming])

  function requestReset(value: Framing) {
    resetTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setResetFraming(value)
  }

  function changeFraming(value: Framing) {
    if (value === framing) return
    if (Object.keys(answers).length) requestReset(value)
    else dispatch({ type: "reset", framing: value })
  }

  function decisionRecord(editable: boolean) {
    return <div className={styles.record}>{steps.map(s => <section key={s}>
      <div className={styles.recordHeading}><h3>{comparisonTitles[s]}</h3>{editable && <button type="button" className={styles.textButton} onClick={() => dispatch({ type: "navigate", step: s })}>Edit comparison {s.toUpperCase()}</button>}</div>
      <dl>{questionsFor(s).map(q => <div key={q.id}><dt>{q.task}</dt><dd>{answerLabel(q.id, answers)}</dd></div>)}</dl>
    </section>)}</div>
  }

  return <div className={styles.player}>
    <div className={styles.localNav}>
      <Link href="/futures" prefetch={false}>All twelve trajectories</Link>
      <a href="#nearby-scenarios">Browse the comparison shelf</a>
    </div>
    <div className={styles.statusLine}><span>{departure.status}</span><span>No score · Choices stay in this page</span></div>

    {step === "intro" ? <>
      <header className={styles.introHeading}>
        <h1 ref={heading} tabIndex={-1}>{departure.title}</h1>
        <p className={styles.lead}>An AI offers a life beyond Earth.<br />What would make it an offer you could accept?</p>
      </header>
      <div className={styles.introGrid}>
        <div className={styles.narrative}>
          <p>An artificial superintelligence has helped develop treatments for diseases that resisted human medicine and technologies capable of greatly reducing material scarcity. In this story, those achievements are given. How people use them remains contested.</p>
          <p>Now it announces that it will leave Earth. It offers settlements elsewhere for anyone who wants to accompany it. Those who stay keep the tools already shared and govern themselves. Declining does not cost them access.</p>
          <p>The AI says it will neither govern Earth nor punish refusal. It warns that a future superintelligence built on Earth could be dangerous. What power it reserves over such a system has not been agreed.</p>
          <p className={styles.personal}>{framing === "personal" ? "You are considering the invitation. Someone close to you intends to stay. You do not know whether you could meet again, or who could enforce a right to return." : "Consider a fictional adult deciding whether to leave. Other people in their life will stay. A policy assessment must consider separation, return and authority without requiring you to imagine your own relationships."}</p>
        </div>
        <div className={styles.introAside}>
          <DepartureDiagram stage="intro" />
          <p>The AI’s achievements show formidable competence. They do not establish every claim about life beyond Earth.</p>
        </div>
      </div>
      <fieldset className={styles.framing}><legend>How would you like to consider the story?</legend>
        <label><input type="radio" name="framing" checked={framing === "personal"} onChange={() => changeFraming("personal")} /> Personal framing</label>
        <label><input type="radio" name="framing" checked={framing === "policy"} onChange={() => changeFraming("policy")} /> Less-personal policy framing</label>
      </fieldset>
      <p className={styles.small}>The person who stays is fictional. No names or personal history are requested. Both framings use the same choices and carry equal weight.</p>
      <div className={styles.actions}><button className="cta-primary" type="button" onClick={() => dispatch({ type: "navigate", step: "a" })}>{Object.keys(answers).length ? "Resume the comparisons" : "Consider the invitation"}</button><span>Three comparisons, then review. Nothing advances on selection.</span></div>
      <p className={styles.small}>This is proposed fiction, not a forecast. Leave or reload this page and the answers are lost. You can return to this opening while keeping them in page memory.</p>
    </> : <>
      <nav className={styles.progress} aria-label="Departure journey">
        {steps.map((s, i) => <button type="button" key={s} aria-current={step === s ? "step" : undefined} disabled={!steps.slice(0, i).every(prior => complete(prior, answers))} onClick={() => dispatch({ type: "navigate", step: s })}><span>{s.toUpperCase()}</span>{["The invitation", "The return", "The authority"][i]}</button>)}
        <button type="button" aria-current={step === "review" || step === "result" ? "step" : undefined} disabled={!steps.every(s => complete(s, answers))} onClick={() => dispatch({ type: "navigate", step: "review" })}>Review</button>
      </nav>
      <p className={styles.small}>{framing === "personal" ? "Personal framing" : "Policy framing · decisions concern a fictional adult"}. {isComparison ? "Complete this comparison to open the next. Selection stays on this page." : "Your choices are still editable."}</p>
      <p className={styles.notice} role="status">{state.notice}</p>
      {isComparison && <>
        <header className={styles.stageHeading}><h1 ref={heading} tabIndex={-1}>{comparisonTitles[stage]}</h1></header>
        <div className={styles.comparisonGrid}>
          <div>
            <div className={styles.conditions}>
              <h2>{stage === "a" ? "The initial offer" : stage === "b" ? "What changes, and what does not" : "Departure does not settle jurisdiction"}</h2>
              {stage === "a" ? <p>Travel and settlement are offered. Earth keeps self-government and access to the tools. Return, future reunion and reliable communication have no agreed terms. The AI’s successor policy remains open.</p> : stage === "b" ? <><p>The revised offer promises a return service, maintained for each traveler’s lifetime; two-way communication, subject to travel-related delays; and departure from the settlement without asking the AI’s permission.</p><p>Earth keeps the same tools and self-government. The offer still supplies no independently verified travel time, enforcement mechanism, or guarantee of reunion with a particular person. The successor policy is still open.</p></> : <p>The AI has left. Earth still governs itself and retains the tools. Consider three possible arrangements for successor AI, then separately decide what information and intervention powers you would authorize. A vote for one does not silently grant the others.</p>}
            </div>
            <form onSubmit={event => { event.preventDefault(); if (complete(stage, answers)) dispatch({ type: "navigate", step: stage === "a" ? "b" : stage === "b" ? "c" : "review" }) }}>
              {questionsFor(stage).map(q => <fieldset key={q.id} className={styles.question}>
                <legend><span className={styles.taskLabel}>{q.task}</span><span>{framing === "policy" && "policyPrompt" in q ? q.policyPrompt : q.prompt}</span></legend>
                {"clarification" in q && <details className={styles.clarification}><summary>Clarify the scope</summary><p>{q.clarification}</p></details>}
                <div className={styles.options}>{q.options.map(option => <label key={option.value} className={styles.option} data-selected={answers[q.id] === option.value}>
                  <input type="radio" name={q.id} value={option.value} checked={answers[q.id] === option.value} onChange={() => dispatch({ type: "answer", id: q.id, value: option.value })} />
                  <span>{option.label}</span>
                </label>)}</div>
              </fieldset>)}
              <div className={styles.actions}>
                <button type="button" className="cta-secondary" onClick={() => dispatch({ type: "navigate", step: stage === "a" ? "intro" : stage === "b" ? "a" : "b" })}>Back</button>
                <button type="submit" className="cta-primary" disabled={!complete(stage, answers)} aria-describedby="comparison-help">{stage === "c" ? "Review my decisions" : "Continue to the next comparison"}</button>
              </div>
              <p id="comparison-help" className={styles.small}>{complete(stage, answers) ? "Ready when you are. You can return and edit." : `Choose one response for each question (${questionsFor(stage).filter(q => answers[q.id]).length} of ${questionsFor(stage).length} answered). “Not sure” and “none of these” are valid responses.`}</p>
            </form>
          </div>
          <aside className={styles.conditionAside}><DepartureDiagram stage={stage} policy={answers.cPolicy} /><p>{stage === "c" ? "The diagram shows the package you selected. Monitoring and intervention have their own separate questions." : "First consider the declared protections as true. Then assess their credibility as claims. Finally decide under the unverified offer."}</p></aside>
        </div>
      </>}
      {step === "review" && <>
        <header className={styles.stageHeading}><h1 ref={heading} tabIndex={-1}>Review your decisions</h1><p className={styles.lead}>The world you want, the evidence you need and the powers you permit.</p></header>
        <p>No reading has been submitted. Editing an earlier answer clears later answers so you can reconsider them; going back without changing a choice preserves them.</p>
        {decisionRecord(true)}
        <div className={styles.actions}><button type="button" className="cta-secondary" onClick={() => dispatch({ type: "navigate", step: "c" })}>Back to authority</button><button type="button" className="cta-primary" onClick={() => dispatch({ type: "submit" })}>Submit and read my decisions</button></div>
        <p className={styles.small}>Submit builds a reading here in your browser. It does not send, save or publish your answers.</p>
      </>}
      {step === "result" && <>
        <header className={styles.stageHeading}><h1 ref={heading} tabIndex={-1}>What your conditions change</h1><p className={styles.lead}>{readings[0].title}</p><p>{readings[0].text}</p></header>
        <div className={styles.readings}>{readings.slice(1).map(reading => <section key={reading.id}><h2>{reading.title}</h2><p>{reading.text}</p></section>)}</div>
        <section className={styles.readingNote}><h2>What this reading can say</h2><p>It connects choices you actually made. It does not rank futures, infer motives or change your Foundation or AI Governance result. No plausibility estimate was collected, so it says nothing about what you expect to happen.</p><p className={styles.small}>Authored interpretation rules · {departure.version}. A preference exercise among fictional alternatives, with no validated matching claim.</p></section>
        <details className={styles.recordDisclosure}><summary>See every decision and stated reason</summary>{decisionRecord(false)}</details>
        <div className={styles.actions}><button type="button" className="cta-secondary" onClick={() => dispatch({ type: "navigate", step: "review" })}>Review or change decisions</button><a href="#nearby-scenarios">Examine related scenarios</a></div>
        <section className={styles.continuation}><h2>The political questions the offer leaves open</h2>{departureContinuation.map(item => <section key={item.title}><h3>{item.title}</h3><p>{item.text}</p></section>)}</section>
      </>}
      <div className={styles.exitRow}><button type="button" className={styles.textButton} onClick={() => dispatch({ type: "navigate", step: "intro" })}>Return to the story</button><button type="button" className={styles.textButton} onClick={() => requestReset(framing)}>Clear this draft</button></div>
    </>}
    {resetFraming && <div className={styles.reset} role="group" aria-label="Confirm clearing your draft"><p id="reset-explanation">{resetFraming === framing ? "Clear all choices and return to the opening?" : "Changing the framing starts a new draft and clears these choices."}</p><div className={styles.actions}><button ref={keepDraft} type="button" className="cta-secondary" aria-describedby="reset-explanation" onClick={() => { setResetFraming(null); resetTrigger.current?.focus() }}>Keep my draft</button><button type="button" className="cta-primary" onClick={() => { dispatch({ type: "reset", framing: resetFraming }); setResetFraming(null); heading.current?.focus() }}>Clear choices and start again</button></div></div>}
    <noscript>This journey needs JavaScript to keep choices in page memory. You can still browse the comparison shelf and sources below.</noscript>
  </div>
}
