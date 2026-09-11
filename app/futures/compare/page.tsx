import Link from "next/link"
import type { Metadata } from "next"
import { findFuture, futureCatalogue, futuresRoutes } from "@/lib/futures/catalogue/index"
import { ComparisonExplorer } from "@/components/futures/comparison-explorer"
import styles from "@/components/futures/catalogue.module.css"
export const metadata: Metadata = { title: "Compare futures | IR Worldview Inventory", robots: { index: false, follow: false } }
export default async function ComparePage({ searchParams }: { searchParams: Promise<{ a?: string; b?: string }> }) {
  const { a, b } = await searchParams
  const invalid = (a !== undefined && !findFuture(a)) || (b !== undefined && !findFuture(b))
  return <article className={styles.page} lang="en"><nav className={styles.localNav} aria-label="Futures"><Link href={futuresRoutes.collection} prefetch={false}>All futures</Link><Link href={futuresRoutes.preferences} prefetch={false}>Consider your preferred conditions</Link></nav><header className={styles.header}><h1>Compare two futures</h1><p className={styles.lead}>Who governs, who benefits, and which terms remain open?</p><p>Compare any two entries. Their differences are editorial descriptions, not distances on a common scale.</p></header>{invalid && <p role="status">An entry in this link was not recognized. Choose from the published catalogue below.</p>}<ComparisonExplorer initialA={a && findFuture(a) ? a : futureCatalogue[0].id} initialB={b && findFuture(b) ? b : futureCatalogue[1].id} /></article>
}
