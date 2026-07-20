import { zhHansEuropeMissileDefenceCase } from "@/content/locales/zh-Hans/current-cases/europe-missile-defence-coalition-ukraine"
import { zhHansSouthChinaSeaAwardCase } from "@/content/locales/zh-Hans/current-cases/south-china-sea-award-at-ten"
import { zhHansUsBrazilTariffsCase } from "@/content/locales/zh-Hans/current-cases/us-brazil-section-301-tariffs"
import type { ZhHansCurrentCaseRecord } from "@/content/locales/zh-Hans/types"

export { zhHansCurrentCaseArchive } from "@/content/locales/zh-Hans/current-cases/archive"
export { zhHansEuropeMissileDefenceCase } from "@/content/locales/zh-Hans/current-cases/europe-missile-defence-coalition-ukraine"
export { zhHansSouthChinaSeaAwardCase } from "@/content/locales/zh-Hans/current-cases/south-china-sea-award-at-ten"
export { zhHansUsBrazilTariffsCase } from "@/content/locales/zh-Hans/current-cases/us-brazil-section-301-tariffs"

export const zhHansCurrentCases: readonly ZhHansCurrentCaseRecord[] = [
  zhHansEuropeMissileDefenceCase,
  zhHansUsBrazilTariffsCase,
  zhHansSouthChinaSeaAwardCase,
]

export const zhHansCurrentCaseById: Readonly<
  Record<string, ZhHansCurrentCaseRecord>
> = Object.fromEntries(zhHansCurrentCases.map((record) => [record.id, record]))

export const zhHansCurrentCaseBySlug: Readonly<
  Record<string, ZhHansCurrentCaseRecord>
> = Object.fromEntries(zhHansCurrentCases.map((record) => [record.slug, record]))
