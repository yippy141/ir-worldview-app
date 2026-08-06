import type { Metadata } from "next"
import { ControlledBetaPage } from "@/components/beta/controlled-beta-page"
import { englishBetaPage } from "@/content/locales/en/beta"
import { createEnglishApprovedMetadata } from "@/i18n/metadata"
import { getBetaParticipationUrl } from "@/lib/beta-config"

export const metadata: Metadata = createEnglishApprovedMetadata(
  "/beta",
  englishBetaPage.metadata,
)

export default function BetaPage() {
  return (
    <ControlledBetaPage
      content={englishBetaPage}
      participationUrl={getBetaParticipationUrl()}
    />
  )
}
