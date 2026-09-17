"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { ProfileStore } from "@/lib/profile-store"
import { evidenceFromProfile, withAiEvidence, withFoundationEvidence, DOMAIN_LABELS, type Observation, type EvidenceBundle } from "@/lib/connected/evidence"
import { buildConnectedRelations, type Relation } from "@/lib/connected/relations"
import { foundationPayloadDigest, lookupFoundationLocalEvidence } from "@/lib/results/local-evidence"
import { aiEvidenceForSnapshot } from "@/lib/results/ai-completion-evidence"

export function localProfileEvidence(profile: ProfileStore): EvidenceBundle {
  const bundle = evidenceFromProfile(profile)
  const ai = profile.aiGovernance && aiEvidenceForSnapshot(profile.aiGovernance)
  return ai ? withAiEvidence(bundle, ai) : bundle
}
export async function loadLocalProfileEvidence(profile: ProfileStore): Promise<EvidenceBundle> {
  const bundle = localProfileEvidence(profile)
  const foundation = profile.foundation
  if (foundation?.localEvidenceId && foundation.mode) {
    try {
      const digest = await foundationPayloadDigest(foundation.payload)
      if (digest) {
        const evidence = lookupFoundationLocalEvidence(window.localStorage, foundation.payload, digest, { v: 1, payloadDigest: digest, localCompletionId: foundation.localEvidenceId, mode: foundation.mode }, foundation.locale)
        if (evidence.status === "available") return withFoundationEvidence(bundle, evidence.evidence)
      }
    } catch { /* Keep scores readable when exact local evidence is unavailable. */ }
  }
  return bundle
}
export function ConnectedProfile({ profile, mode }: { profile: ProfileStore; mode: "local" | "shared" }) {
  const [local, setLocal] = useState<EvidenceBundle | null>(null)
  useEffect(() => {
    if (mode !== "local") return
    let cancelled = false
    void loadLocalProfileEvidence(profile).then(bundle => { if (!cancelled) setLocal(bundle) })
    return () => { cancelled = true }
  }, [profile, mode])
  const bundle = local ?? evidenceFromProfile(profile, mode === "local" ? "local" : "supplied")
  const relations = buildConnectedRelations(bundle).filter(r => r.state !== "unavailable").slice(0, 3)
  const next = relations[0] ?? buildConnectedRelations(bundle).find(r => bundle.ai || bundle.technology ? r.topic === "access" : r.topic === "cooperation")!
  return <section className="connected-profile" aria-labelledby="connected-profile-heading">
    <h2 id="connected-profile-heading">Connections worth examining</h2>
    {relations.length ? relations.map(relation => <RelationReading key={relation.ruleId} relation={relation} />) : <p>{Object.keys(bundle).length <= 1 ? "One subject is enough to start a discussion. Open your result above or consider the question below." : "These results do not contain enough matching context for a cross-topic observation. You can still compare their separate readings or explore the question below."}</p>}
    <section className="connected-next stack-sm"><h2>One next question</h2><Reflection relation={next} /><p><Link href={next.exercise}>Try a related decision</Link> or <Link href="/compare">compare a result with someone</Link>.</p></section>
  </section>
}
export function EvidenceList({ evidence }: { evidence: Observation[] }) {
  return <ul className="connected-evidence">{evidence.map(e => <li key={`${e.domain}:${e.id}`}><p className="connected-source">{DOMAIN_LABELS[e.domain]} · {e.kind === "derived-score" ? "supplied score" : e.kind === "actor-role-judgment" ? "actor-role judgment, not a personal choice" : e.kind === "explanation" ? "selected explanation" : "recorded choice"}</p><p><strong>{e.context}</strong></p><p>{e.text}</p>{e.secondChoice && <p>Recorded second choice: {e.secondChoice}</p>}</li>)}</ul>
}
function RelationReading({ relation }: { relation: Relation }) {
  const [correcting, setCorrecting] = useState(false)
  const [rejected, setRejected] = useState(false)
  const [clarification, setClarification] = useState("")
  return <article className="connected-relation" data-relation={relation.ruleId}>
    <h3>{relation.title}</h3>
    <p>{rejected ? "You set this interpretation aside. The source choices remain below so you can explain the distinction in your own words." : relation.text}</p>
    <EvidenceList evidence={relation.evidence} />
    <button className="connected-text-button" type="button" aria-expanded={correcting} onClick={() => setCorrecting(!correcting)}>That is not what I meant</button>
    {correcting && <div className="connected-correction stack-sm"><p>This interpretation uses the sources above. {relation.changesWith}</p><label className="stack-xs"><span>What should someone understand differently?</span><textarea maxLength={1500} value={clarification} onChange={e => setClarification(e.target.value)} /></label><button type="button" className="cta-secondary" onClick={() => setRejected(!rejected)}>{rejected ? "Restore interpretation" : "Set this interpretation aside"}</button><p className="result-scope">Your correction is unscored. It stays in this page only and clears when you leave or reset.</p><button className="connected-text-button" type="button" onClick={() => { setClarification(""); setRejected(false); setCorrecting(false) }}>Reset correction</button></div>}
  </article>
}
function Reflection({ relation }: { relation: Relation }) {
  const [answer, setAnswer] = useState("")
  const [reason, setReason] = useState("")
  return <div className="connected-reflection stack-sm"><p>{relation.followUp.scenario}</p><fieldset><legend>{relation.followUp.question}</legend>{relation.followUp.options.map(option => <label className="compare-checkbox" key={option}><input type="radio" name={`reflection-${relation.ruleId}`} checked={answer === option} onChange={() => setAnswer(option)} />{option}</label>)}</fieldset>{answer === "Another reason" && <label className="stack-xs"><span>Your reason</span><textarea maxLength={1500} value={reason} onChange={e => setReason(e.target.value)} /></label>}<p className="result-scope">Optional and unscored. This does not change your issued result. Leaving or resetting clears your response.</p>{answer && <button type="button" className="connected-text-button" onClick={() => { setAnswer(""); setReason("") }}>Reset reflection</button>}</div>
}
