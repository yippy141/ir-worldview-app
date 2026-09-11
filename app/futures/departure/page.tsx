import type { Metadata } from "next"
import Link from "next/link"
import { DeparturePlayer } from "@/components/futures/departure-player"
import styles from "@/components/futures/departure.module.css"
import { departure } from "@/lib/futures/departure"
import { departureClaims, futuresSources } from "@/lib/futures/sources"
import { trajectories } from "@/lib/futures/trajectories"

export const metadata: Metadata = {
  title: `${departure.title} · Draft | IR Worldview Inventory`,
  description: "An unscored fictional decision about leaving Earth, returning and authorizing power over future AI.",
  robots: { index: false, follow: false },
}

const nearby = [
  { id: "gatekeeper", reason: "Examine this if the successor veto matters to you. Its restriction on later superintelligence helps expose the difference between a limited safety mandate and a permanent ceiling. The Departure leaves that choice open." },
  { id: "protector", reason: "Examine this if noninterference matters to you. Hidden protection can preserve a feeling of control without giving people final authority. The Departure makes the proposed relationship visible and contestable." },
] as const

export default function DeparturePage() {
  return <article className={styles.page} lang="en">
    <DeparturePlayer />
    <section className={styles.shelf} id="nearby-scenarios" aria-labelledby="shelf-title">
      <h2 id="shelf-title">Different answers to who remains in charge</h2>
      <p>Browse these comparisons at any time. They are overlapping scenarios to examine, not matches assigned to you. No personal preference is placed on the two-axis field map.</p>
      <div className={styles.shelfList}>
        {nearby.map(item => {
          const scenario = trajectories.find(t => t.id === item.id)!
          return <article key={item.id}><div><h3><Link href={`/futures#trajectory-${scenario.id}`} prefetch={false}>{scenario.name}</Link></h3><p className={styles.small}>Original: {scenario.tegmarkName}<br />Max Tegmark, Life 3.0, chapter 5</p></div><p>{item.reason}</p></article>
        })}
        <article><div><h3>Constitutional Delegation</h3><p className={styles.small}>Proposed project extension · outline only</p></div><p>AI administration under a public mandate people can genuinely revise. Compare it with an AI ruler or a narrowly empowered gatekeeper: competent administration, legitimate authority and practical reversibility can come apart. Its enforcement problem still needs an authored case.</p></article>
      </div>
      <Link href="/futures" prefetch={false}>Browse all twelve inherited trajectories</Link>
    </section>
    <section className={styles.sources} aria-labelledby="source-title">
      <h2 id="source-title">Where the framework ends and this story begins</h2>
      <p>The twelve inherited scenarios come from Max Tegmark’s <a href={futuresSources.book.url}>Life 3.0</a> (2017), chapter 5. <a href={futuresSources.aftermath.url}>FLI’s scenario reference</a> supplies a concise source anchor. The Departure develops JinHua Yip’s proposed scenario; its narrative, questions, critiques and interpretation rules are this project’s AI-assisted draft. Attribution does not imply permission or endorsement.</p>
      <p className={styles.small}>The <a href={futuresSources.survey.url}>FLI survey</a> provides historical context for asking about desired futures. Its responses are not population norms and are not used by this exercise. Editorial source check: 11 September 2026.</p>
      <details><summary>Source ledger and scientific assumptions</summary>
        {departureClaims.map(claim => <section className={styles.claim} key={claim.id} id={claim.id}><h3>{claim.kind}</h3><p>{claim.text}</p><small>{claim.author} · Checked {claim.checked}<br />{claim.confirmation}</small>{claim.citations.length > 0 && <ul>{claim.citations.map(citation => <li key={citation.source}><a href={futuresSources[citation.source].url}>{futuresSources[citation.source].title}</a> · {citation.locator}</li>)}</ul>}</section>)}
      </details>
    </section>
  </article>
}
