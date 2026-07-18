import { AnalyticsOptOut } from "@/components/privacy/analytics-opt-out"
import { LocalDataControls } from "@/components/privacy/local-data-controls"
import { LocaleEditorialPageView } from "@/components/i18n/locale-editorial-page"
import { chineseShellContent } from "@/content/locales"

export function ChinesePrivacyPage() {
  return (
    <LocaleEditorialPageView
      content={chineseShellContent.privacy}
      renderWithinSection={(section) => {
        if (section.id === "analytics") return <AnalyticsOptOut />
        if (section.id === "delete-data") return <LocalDataControls />
        return null
      }}
    />
  )
}
