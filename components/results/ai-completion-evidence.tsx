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
  return <section className="result-section" aria-label="Exact choices from this completion" data-ai-completion-evidence>
    <h2>Where you separate competition from coordination</h2>
    <p>How your answers balance great-power rivalry against joint safety red lines.</p>
    {geopolitical.map(row => <article className="result-axis-reading" key={row.id}><h3>{row.prompt}</h3><p>{row.selection}</p></article>)}
    <h2>All choices from this completion</h2><div className="result-details-body">
      {evidence.observations.map(row => <article className="result-axis-reading" key={row.id}><h3>{row.prompt}</h3><p>{row.selection}</p>{row.secondary ? <p><strong>Recorded second choice. </strong>{row.secondary}</p> : null}</article>)}
      <p className="result-scope">Exact English wording from bank {evidence.bank}, scorer {evidence.scorer}, {evidence.mode} form. These details remain in page memory only and disappear on reload. Shared links contain scores, not these choices.</p>
    </div>
  </section>
}
