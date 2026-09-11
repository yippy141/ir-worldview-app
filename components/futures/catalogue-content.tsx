import Link from "next/link"
import { findFuture, scenarioHref, compareHref } from "@/lib/futures/catalogue/index"
import { featureIds, featureDefinitions, featureStatement, type FeatureState, type FeatureId } from "@/lib/futures/catalogue/features"
import type { FutureScenario } from "@/lib/futures/catalogue/types"
import { scenarioRationales, rationaleBasisLabels } from "@/lib/futures/catalogue/rationales"
import styles from "./catalogue.module.css"

export function FeatureStateLabel({ state }: { state: FeatureState }) {
  return <span className={styles.featureState} data-state={state}><span aria-hidden="true" />{state === "inapplicable" ? "Inapplicable" : state === "variant-dependent" ? "Variant-dependent" : state === "present" ? "Present" : state === "absent" ? "Absent" : "Unspecified"}</span>
}
export function ScenarioSources({ scenario }: { scenario: FutureScenario }) {
  return <div className={styles.sources}><h3>Origin and source status</h3>
    <p>{scenario.origin === "inherited" ? "Original concept: Max Tegmark, Life 3.0 (2017), chapter 5. The short premise is paraphrased from FLI’s reference. Life, institutions and feature descriptors are this project’s editorial interpretation, not additional claims from the book." : "Project-authored hypothetical. These institutional arrangements are declared premises, not observed developments or claims of original invention."}</p>
    <ul>{scenario.sources.map(source => <li key={source.url}><a href={source.url} rel="noreferrer">{source.title}</a> · {source.locator}<br /><span className={styles.small}>{source.kind} · Checked {source.checked}</span></li>)}</ul>
    <p className={styles.small}>IR Worldview Inventory · AI-assisted editorial draft · {scenario.version}. Attribution does not imply endorsement. No current-development or community-attribution claim is inferred from this entry.</p>
  </div>
}
export function DescriptorRationale({ scenario, feature }: { scenario: FutureScenario; feature: FeatureId }) {
  const [, basis, reason] = scenarioRationales(scenario.id)[feature]
  return <p className={styles.small}><strong>{rationaleBasisLabels[basis]}.</strong> {reason}</p>
}
export function FeatureLedger({ scenario }: { scenario: FutureScenario }) {
  return <details className={styles.disclosure}><summary>All authored features used in comparison</summary><p className={styles.small}>These are editorial descriptors, independent of the historical map. Unspecified and variant-dependent properties remain unresolved when matching preferences.</p><dl className={styles.featureLedger}>{featureIds.map(id => <div key={id}><dt>{featureDefinitions[id].label}</dt><dd><FeatureStateLabel state={scenario.features[id]} /><p>{featureStatement(id, scenario.features[id])}</p><DescriptorRationale scenario={scenario} feature={id} /></dd></div>)}</dl></details>
}
export function ScenarioDetail({ scenario }: { scenario: FutureScenario }) {
  return <>
    <header className={styles.detailHeader}><h1>{scenario.name}</h1><p className={styles.origin}>{scenario.origin === "inherited" ? "An inherited Life 3.0 scenario" : "A project-authored scenario"}{scenario.aliases.length ? ` · Also shown as ${scenario.aliases.join(", ")}` : ""}</p><p className={styles.lead}>{scenario.premise}</p></header>
    <section className={styles.reading}><h2>Life under this arrangement</h2><p>{scenario.life}</p><dl className={styles.facts}>{([ ["Practical authority", scenario.authority], ["Benefits and ownership", scenario.distribution], ["Human and digital status", scenario.status], ["Technical premises", scenario.assumptions], ["Attractions", scenario.attractions], ["Costs and objections", scenario.costs], ["Not specified", scenario.unknowns] ] as const).map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl></section>
    {scenario.comparisonKind === "catastrophic-endpoint" && <p className={styles.reading}>This catastrophic endpoint does not instantiate preferred institutions or a valued successor world. It remains available for expectations and risk comparison, but supplies no positive preference support. Known conflicts, including the loss of biological humanity, still count.</p>}
    {scenario.legacySummary && <details className={styles.disclosure}><summary>Earlier project summary and extension</summary><p>{scenario.legacySummary}</p><p className={styles.small}>Preserved from the earlier project catalogue. This is project interpretation, not a source quotation or an extra matching descriptor. Where its extension differs from the original premise, the source distinction above governs.</p></details>}
    <FeatureLedger scenario={scenario} />
    <section className={styles.section}><h2>Compare the institutional difference</h2><div className={styles.related}>{scenario.comparisons.map(id => { const other = findFuture(id); return other ? <Link key={id} href={compareHref(scenario.id, id)} prefetch={false}>{scenario.name} and {other.name}</Link> : null })}</div></section>
    {scenario.exercise && <section className={styles.section}><h2>Optional deeper exercise</h2><p>This exercise concerns decisions inside this scenario. It does not determine your general Futures preferences.</p><Link href={scenario.exercise.href} prefetch={false}>{scenario.exercise.label}</Link></section>}
    <ScenarioSources scenario={scenario} />
  </>
}
export function CatalogueEntry({ scenario }: { scenario: FutureScenario }) {
  const preview: FeatureId[] = ["humanAuthority", "biologicalContinuity", "revisablePower"]
  return <article id={`trajectory-${scenario.id}`} className={styles.entry} data-origin={scenario.origin}>
    <div><h3><Link href={scenarioHref(scenario.id)} prefetch={false}>{scenario.name}</Link></h3><p className={styles.origin}>{scenario.origin === "inherited" ? "Max Tegmark · Life 3.0" : "Project-authored"}</p>{scenario.aliases.length > 0 && <p className={styles.small}>Previously shown as {scenario.aliases.join(", ")}</p>}</div>
    <div><p>{scenario.premise}</p><dl className={styles.miniFeatures}>{preview.map(id => <div key={id}><dt>{featureDefinitions[id].label}</dt><dd><FeatureStateLabel state={scenario.features[id]} /></dd></div>)}</dl><div className={styles.rowActions}><Link href={scenarioHref(scenario.id)} prefetch={false}>Read the scenario</Link><Link href={compareHref(scenario.id, scenario.comparisons[0])} prefetch={false}>Compare conditions</Link>{scenario.exercise && <Link href={scenario.exercise.href} prefetch={false}>Optional exercise</Link>}</div></div>
  </article>
}
