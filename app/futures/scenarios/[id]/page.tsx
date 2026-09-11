import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { findFuture, futuresRoutes } from "@/lib/futures/catalogue/index"
import { ScenarioDetail } from "@/components/futures/catalogue-content"
import styles from "@/components/futures/catalogue.module.css"
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const scenario = findFuture((await params).id)
  return { title: `${scenario?.name ?? "Scenario unavailable"} | Futures`, robots: { index: false, follow: false } }
}
export default async function ScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  const scenario = findFuture((await params).id)
  if (!scenario) notFound()
  return <article className={styles.page} lang="en"><nav className={styles.localNav} aria-label="Futures"><Link href={futuresRoutes.collection} prefetch={false}>All futures</Link><Link href={futuresRoutes.preferences} prefetch={false}>Answer the questions</Link></nav><ScenarioDetail scenario={scenario} /></article>
}
