import {
  englishCurrentCaseArchive,
  englishCurrentCaseFlow,
  englishCurrentCaseSharing,
} from "@/content/locales/en/current-cases"
import { zhHansCurrentCaseArchive } from "@/content/locales/zh-Hans/current-cases/archive"
import { zhHansNavigationAndControls } from "@/content/locales/zh-Hans/navigation-controls"
import type { Locale } from "@/i18n/routing"

export function currentCaseContent(locale: Locale) {
  return locale === "zh-Hans"
    ? {
        archive: zhHansCurrentCaseArchive,
        flow: zhHansNavigationAndControls.currentCaseFlow,
        sharing: zhHansNavigationAndControls.sharing,
      }
    : {
        archive: englishCurrentCaseArchive,
        flow: englishCurrentCaseFlow,
        sharing: englishCurrentCaseSharing,
      }
}
