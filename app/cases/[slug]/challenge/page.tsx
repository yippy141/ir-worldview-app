import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CurrentCaseChallengeGate } from "@/components/current-case/current-case-challenge-gate"
import { CurrentCasePageHeader } from "@/components/current-case/current-case-page-header"
import { CurrentCasePrintSummary } from "@/components/current-case/current-case-print-summary"
import styles from "@/components/current-case/current-case.module.css"
import {
  getPublishedCurrentCaseBySlug,
  getPublishedCurrentCases,
} from "@/lib/current-cases/catalog"
import { toCurrentCasePublicRecord } from "@/lib/current-cases/presentation"

type CurrentCaseChallengePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: CurrentCaseChallengePageProps): Promise<Metadata> {
  const { slug } = await params
  const record = getPublishedCurrentCaseBySlug(slug)
  return {
    title: record
      ? `Invitation: ${record.title} | IR Worldview Inventory`
      : "Current Case invitation | IR Worldview Inventory",
    description: "Open the ordinary Current Case without an answer-bearing link.",
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  }
}

export function generateStaticParams() {
  return getPublishedCurrentCases().map((record) => ({ slug: record.slug }))
}

export default async function CurrentCaseChallengePage({
  params,
}: CurrentCaseChallengePageProps) {
  const { slug } = await params
  const record = getPublishedCurrentCaseBySlug(slug)
  if (!record) notFound()
  const publicRecord = toCurrentCasePublicRecord(record)

  return (
    <article className={styles.page}>
      <CurrentCasePageHeader record={publicRecord} />
      <CurrentCaseChallengeGate record={publicRecord} />
      <CurrentCasePrintSummary record={publicRecord} />
    </article>
  )
}
