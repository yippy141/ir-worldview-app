import type { Metadata } from "next"
import { WorldStageHome } from "@/components/home/world-stage/world-stage-home"
import { createEnglishApprovedMetadata } from "@/i18n/metadata"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = createEnglishApprovedMetadata("/", {
  title: siteConfig.publicTitle,
  description:
    "Map your foreign-policy judgments, test them in context, and explore the arguments behind the inventory.",
})

export default function HomePage() {
  return <WorldStageHome />
}
