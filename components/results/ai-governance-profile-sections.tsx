import Link from "next/link"
import { aiAxisReading } from "@/lib/results/ai-interpretation"
import type { ResolvedAiPayload } from "@/lib/ai-governance-share"
import { aiPayloadToAxisScores } from "@/lib/ai-governance-share"
import { aiArchetypeDeepProfiles } from "@/lib/ai-governance-profile-copy"
import { getAiAtlasEntry } from "@/lib/ai-governance-atlas-content"
import type { AiAxisKey } from "@/lib/ai-governance-types"

export function AiGovernanceProfileSections({ resolved }: { resolved: ResolvedAiPayload }) {
  const scores = aiPayloadToAxisScores(resolved.payload)
  const key = resolved.payload.ak
  const reference = aiArchetypeDeepProfiles[key]
  const entry = getAiAtlasEntry(key)!
  return <>
    <section className="stack-md">
      <h2>What the remaining positions say</h2>
      {(["militaryRole", "humanFuture"] as AiAxisKey[]).map(axis => <div key={axis} className="stack-xs"><h3>{resolved.schema.aiAxisLabels[axis]}</h3><p>{aiAxisReading(axis, scores[axis])}</p></div>)}
    </section>
    <section className="stack-md">
      <h2>The {resolved.scoring.archetypeLabels[key]} reference argument</h2>
      <p>{entry.coreBelief}</p>
      <p className="result-scope">These are the authored category&apos;s proposals and challenges. Individual positions above can depart from them; the category does not supply missing answers.</p>
      <h3>Institutional priorities</h3>
      <ul className="content-list">{entry.wantsMost.map(item => <li key={item}>{item}</li>)}</ul>
      <h3>Evidence that would challenge this argument</h3>
      <ul className="content-list">{reference.evidenceShift.map(item => <li key={item}>{item}</li>)}</ul>
      <p><Link href={`/ai/atlas/${key}`}>Read the reference argument, its objections and sources</Link></p>
    </section>
  </>
}
