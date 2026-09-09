import { CURRENT_FOUNDATION_COPY_VERSIONS } from "@/lib/foundation-copy-versions"
import type { Locale } from "@/i18n/routing"

export const LEGACY_LOCALE_COPY_VERSION = 0 as const

export const INSTRUMENT_COPY_VERSIONS = {
  foundation: CURRENT_FOUNDATION_COPY_VERSIONS,
  module: { en: 1, "zh-Hans": 1 },
  aiGovernance: { en: 1, "zh-Hans": 1 },
  perspective: { en: 1, "zh-Hans": 1 },
  currentCase: { en: 1, "zh-Hans": 1 },
} as const satisfies Record<InstrumentId, Record<Locale, number>>

export type InstrumentId =
  | "foundation"
  | "module"
  | "aiGovernance"
  | "perspective"
  | "currentCase"

export type CompletionProvenance = {
  locale: Locale
  localeCopyVersion: number
}

export const LEGACY_ENGLISH_PROVENANCE: CompletionProvenance = {
  locale: "en",
  localeCopyVersion: LEGACY_LOCALE_COPY_VERSION,
}

export function completionProvenance(
  instrument: InstrumentId,
  locale: Locale,
): CompletionProvenance {
  return {
    locale,
    localeCopyVersion: INSTRUMENT_COPY_VERSIONS[instrument][locale],
  }
}

export function isCompletionLocale(value: unknown): value is Locale {
  return value === "en" || value === "zh-Hans"
}

export function isLocaleCopyVersion(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0
}

/**
 * Known matching locale/copy metadata permits the existing comparison; it is
 * not empirical validation. Equal unknown markers do not establish exposure.
 */
export function sameResearchEquivalenceCohort(
  left: CompletionProvenance,
  right: CompletionProvenance,
): boolean {
  return (
    left.localeCopyVersion > LEGACY_LOCALE_COPY_VERSION &&
    right.localeCopyVersion > LEGACY_LOCALE_COPY_VERSION &&
    left.locale === right.locale &&
    left.localeCopyVersion === right.localeCopyVersion
  )
}
