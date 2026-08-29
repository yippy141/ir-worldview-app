import type { Metadata } from "next"
import { WorldStageHome } from "@/components/home/world-stage/world-stage-home"
import { createEnglishApprovedMetadata } from "@/i18n/metadata"
import { getActivePublishedLaunchCurrentCase } from "@/lib/current-cases/catalog"

export const metadata: Metadata = createEnglishApprovedMetadata("/world-stage", {
  title: "World Stage | IR Worldview Inventory",
  description:
    "Use the full geographic display to inspect a reviewed scene and its dated sources before opening a current or recent case.",
})

// Current Case availability depends on an editorial date window. Keep this
// route request-bound so an expired case cannot remain promoted from a stale
// build or cache entry.
export const dynamic = "force-dynamic"

export default function WorldStagePage() {
  const referenceDate = new Date().toISOString().slice(0, 10)
  const hasActiveCurrentCase = Boolean(
    getActivePublishedLaunchCurrentCase(undefined, { referenceDate }),
  )

  return <WorldStageHome hasActiveCurrentCase={hasActiveCurrentCase} />
}
