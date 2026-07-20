import { AnalyticsOptOut } from "@/components/privacy/analytics-opt-out"
import { LocalDataControls } from "@/components/privacy/local-data-controls"
import { ZhHansEditorialPage } from "@/components/i18n/zh-hans-editorial-page"
import { zhHansPrivacyPage } from "@/content/locales/zh-Hans/editorial-pages"

export function ChinesePrivacyPage() {
  return (
    <ZhHansEditorialPage
      content={zhHansPrivacyPage}
      renderWithinSection={(sectionId) => {
        if (sectionId === "analytics") return <AnalyticsOptOut />
        if (sectionId === "delete") return <LocalDataControls />
        return null
      }}
    />
  )
}
