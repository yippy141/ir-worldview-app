import Link from "next/link"
import { decisionPublications, getPublishedDecision, decisionHref } from "@/lib/decision-exercises/catalog"
import styles from "@/components/decision-exercises/exercise.module.css"
export const metadata = { title: "Decision exercises | IR Worldview Inventory", description: "Choose an arrangement, reconsider one changed provision, and examine what your choices support." }
export default function DecisionsPage() {
 return <article className={styles.page}>
  <h1>Decision exercises</h1>
  <p className={styles.lead}>Make a decision, reconsider one changed condition, then examine your choices and stated reasons.</p>
  <p>These fictional, unscored exercises work on their own. Available in English.</p>
  <ul className={styles.index}>{decisionPublications.map(record => {
   const episode = getPublishedDecision(record.slug)!
   return <li key={record.id}><h2><Link href={decisionHref(record.id)} prefetch={false}>{episode.title} →</Link></h2><p>{episode.id === "verify" ? "Advise a cabinet on an agreement limiting sensitive AI training. Decide who can inspect whom when national access becomes one-sided." : "Decide how a research institute provides access to a capable model. Reconsider when the developer gains control over evaluator admissions."}</p></li>
  })}</ul>
  <p><Link href="/cases">Explore sourced cases</Link> · <Link href="/ai">AI Governance</Link></p>
 </article>
}
