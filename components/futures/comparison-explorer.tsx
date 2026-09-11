"use client"
import { useState } from "react"
import Link from "next/link"
import { futureCatalogue, findFuture, scenarioHref } from "@/lib/futures/catalogue/index"
import { featureIds, featureDefinitions, featureStatement } from "@/lib/futures/catalogue/features"
import { FeatureStateLabel } from "./catalogue-content"
import styles from "./catalogue.module.css"
export function ComparisonExplorer({ initialA = futureCatalogue[0].id, initialB = futureCatalogue[1].id, preserveSession = false }: { initialA?: string; initialB?: string; preserveSession?: boolean }) {
  const [a, setA] = useState(initialA), [b, setB] = useState(initialB)
  const left = findFuture(a), right = findFuture(b)
  const linkMode = preserveSession ? { target: "_blank", rel: "noopener" } : {}
  return <div className={styles.comparator}>
    <div className={styles.selectPair}>{([["First scenario", a, setA], ["Second scenario", b, setB]] as const).map(([label, value, set]) => <label key={label}>{label}<select value={value} onChange={e => set(e.target.value)}>{futureCatalogue.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>)}</div>
    {preserveSession && <p className={styles.small}>Scenario and source links below open in a new tab, keeping this exercise available.</p>}
    {!left || !right || a === b ? <p role="status">Choose two different published scenarios to compare their terms.</p> : <>
      <div role="table" aria-label={`${left.name} compared with ${right.name}`}>
        <div className={styles.comparisonHeader} role="row"><div role="columnheader"><span className={styles.srOnly}>Condition</span></div><div role="columnheader"><h3><Link href={scenarioHref(a)} {...linkMode} prefetch={false}>{left.name}</Link></h3></div><div role="columnheader"><h3><Link href={scenarioHref(b)} {...linkMode} prefetch={false}>{right.name}</Link></h3></div></div>
        {([ ["Life and institutions", left.life, right.life], ["Practical authority", left.authority, right.authority], ["Benefits and costs", `${left.attractions} ${left.costs}`, `${right.attractions} ${right.costs}`] ] as const).map(([label, first, second]) => <div key={label} className={styles.comparisonRow} role="row"><div role="rowheader"><h4>{label}</h4></div><p role="cell">{first}</p><p role="cell">{second}</p></div>)}
        {featureIds.map(id => { const different = left.features[id] !== right.features[id]; const definite = ["present", "absent"].includes(left.features[id]) && ["present", "absent"].includes(right.features[id]); return <div key={id} className={styles.comparisonRow} data-different={different} role="row"><div role="rowheader"><h4>{featureDefinitions[id].label}{different && <small>{definite ? "Explicit difference" : "Different or incomplete terms"}</small>}</h4></div>{[left, right].map(s => <div key={s.id} role="cell"><FeatureStateLabel state={s.features[id]} /><p>{featureStatement(id, s.features[id])}</p></div>)}</div> })}
        <div className={styles.comparisonRow} role="row"><div role="rowheader"><h4>Open questions</h4></div><p role="cell">{left.unknowns}</p><p role="cell">{right.unknowns}</p></div>
      </div>
      <p className={styles.small}>These are authored descriptors. An unresolved feature is not evidence of a guarantee, a conflict or equivalence. <Link href={scenarioHref(a)} {...linkMode} prefetch={false}>Consult {left.name} sources</Link> or <Link href={scenarioHref(b)} {...linkMode} prefetch={false}>{right.name} sources</Link>.</p>
    </>}
  </div>
}
