import type { Metadata } from "next"
import { WorldStageHome } from "@/components/home/world-stage/world-stage-home"
import { zhHansRouteMetadata } from "@/content/locales/zh-Hans/metadata"
import { createLocalizedMetadata } from "@/i18n/metadata"
import { getActivePublishedLaunchCurrentCase } from "@/lib/current-cases/catalog"

export function generateMetadata(): Metadata {
  return createLocalizedMetadata("zh-Hans", "/", zhHansRouteMetadata.home)
}

// Match the English route's request-time Current Case availability contract.
export const dynamic = "force-dynamic"

export default function ChineseHomePage() {
  const referenceDate = new Date().toISOString().slice(0, 10)
  const hasActiveCurrentCase = Boolean(
    getActivePublishedLaunchCurrentCase(undefined, { referenceDate }),
  )

  return <WorldStageHome hasActiveCurrentCase={hasActiveCurrentCase} />
}
