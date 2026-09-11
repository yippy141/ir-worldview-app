"use client"

import { useEffect, useRef, useState } from "react"
import { takeAiCompletion, type AiCompletionEvidence as Evidence } from "@/lib/results/ai-completion-evidence"

export function AiCompletionEvidence({ payload }: { payload: string }) {
  const [evidence, setEvidence] = useState<Evidence | null>(null)
  const loaded = useRef<{ payload: string; evidence: Evidence | null } | null>(null)
  useEffect(() => {
    if (loaded.current?.payload !== payload) loaded.current = { payload, evidence: takeAiCompletion(payload) }
    const completion = loaded.current.evidence
    const timer = window.setTimeout(() => setEvidence(completion), 0)
    return () => window.clearTimeout(timer)
  }, [payload])
  if (!evidence || evidence.payload !== payload) return null
  const geopolitical = evidence.observations.filter(row => row.id === "gp1" || row.id === "gp2")
  const pair = geopolitical.map(row => row.selection)
  const pairRead = pair.every(value => /^(Strongly agree|Agree)/.test(value))
    ? "You endorsed both propositions: durable strategic competition and a usual priority for coordination over competitive advantage. In this completion, treating rivalry as a constraint does not eliminate the case for cooperation."
    : pair.every(value => /^(Strongly disagree|Disagree)/.test(value))
      ? "You rejected both propositions. The average cannot turn that pair into an endorsement of a balanced competition-and-coordination position."
      : pair.every(value => value.startsWith("Neutral"))
        ? "You gave a neutral answer to both propositions. That does not establish which institutional arrangement you would accept."
        : "These separate answers show how you judged each proposition. Their average cannot establish one general view of cooperation under rivalry."
  return <section className="result-section" aria-label="Exact choices from this completion" data-ai-completion-evidence>
    <h2>Two answers the average cannot distinguish</h2>
    <p>{pairRead}</p>
    <p>The competition axis combines separate propositions. Your submitted pair remains visible here; its average cannot substitute for either answer.</p>
    {geopolitical.map(row => <article className="result-axis-reading" key={row.id}><h3>{row.prompt}</h3><p>{row.selection}</p></article>)}
    <details className="profile-details"><summary>All choices from this completion</summary><div className="result-details-body">
      {evidence.observations.map(row => <article className="result-axis-reading" key={row.id}><h3>{row.prompt}</h3><p>{row.selection}</p>{row.secondary ? <p><strong>Recorded second choice. </strong>{row.secondary}</p> : null}</article>)}
      <p className="result-scope">Exact English wording from bank {evidence.bank}, scorer {evidence.scorer}, {evidence.mode} form. These details remain in page memory only and disappear on reload. Shared links contain scores, not these choices.</p>
    </div></details>
  </section>
}
