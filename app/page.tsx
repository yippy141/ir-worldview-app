import type { Metadata } from "next"
import { WorldStageHome } from "@/components/home/world-stage/world-stage-home"
import { createEnglishApprovedMetadata } from "@/i18n/metadata"
import { getActivePublishedLaunchCurrentCase } from "@/lib/current-cases/catalog"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = createEnglishApprovedMetadata("/", {
  title: siteConfig.publicTitle,
  description:
    "Map your foreign-policy judgments, test them in context, and explore the arguments behind the inventory.",
})

// Current Case availability depends on an editorial date window. Keep the
// homepage request-bound so an expired case cannot remain promoted from a
// stale build or cache entry.
export const dynamic = "force-dynamic"

export default function HomePage() {
  const referenceDate = new Date().toISOString().slice(0, 10)
  const hasActiveCurrentCase = Boolean(
    getActivePublishedLaunchCurrentCase(undefined, { referenceDate }),
  )

  return <WorldStageHome hasActiveCurrentCase={hasActiveCurrentCase} />
}
