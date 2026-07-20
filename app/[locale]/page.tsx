import type { Metadata } from "next"
import { WorldStageHome } from "@/components/home/world-stage/world-stage-home"
import { zhHansRouteMetadata } from "@/content/locales/zh-Hans/metadata"
import { createLocalizedMetadata } from "@/i18n/metadata"

export function generateMetadata(): Metadata {
  return createLocalizedMetadata("zh-Hans", "/", zhHansRouteMetadata.home)
}

export default function ChineseHomePage() {
  return <WorldStageHome />
}
