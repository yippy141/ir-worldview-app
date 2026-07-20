import type { Metadata } from "next"
import { ZhHansProfileDashboard } from "@/components/profile/zh-hans-profile-dashboard"
import { zhHansProfileRecordsUi } from "@/content/locales/zh-Hans/profile-records"
import { createDynamicLocalizedMetadata } from "@/i18n/metadata"

export const metadata: Metadata = createDynamicLocalizedMetadata(
  "zh-Hans",
  "/profile",
  zhHansProfileRecordsUi.metadata,
)

export default function ChineseProfilePage() {
  return (
    <div className="wide-container">
      <ZhHansProfileDashboard />
    </div>
  )
}
