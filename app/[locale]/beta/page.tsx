import type { Metadata } from "next"
import { ControlledBetaPage } from "@/components/beta/controlled-beta-page"
import { zhHansBetaPage } from "@/content/locales/zh-Hans/beta"
import { createLocalizedMetadata } from "@/i18n/metadata"
import { getBetaParticipationUrl } from "@/lib/beta-config"

export function generateMetadata(): Metadata {
  return createLocalizedMetadata("zh-Hans", "/beta", zhHansBetaPage.metadata)
}

export default function ZhHansBetaPage() {
  return (
    <ControlledBetaPage
      content={zhHansBetaPage}
      participationUrl={getBetaParticipationUrl()}
    />
  )
}
