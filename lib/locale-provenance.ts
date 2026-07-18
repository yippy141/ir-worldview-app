import type { Locale } from "@/i18n/routing"

export const LEGACY_LOCALE_COPY_VERSION = 0 as const

export const INSTRUMENT_COPY_VERSIONS = {
  foundation: { en: 1, "zh-Hans": 1 },
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
 * Locale variants may coexist in a personal profile, but they are not treated
 * as equivalent observations for longitudinal or research-style comparisons.
 */
export function sameResearchEquivalenceCohort(
  left: CompletionProvenance,
  right: CompletionProvenance,
): boolean {
  return (
    left.locale === right.locale &&
    left.localeCopyVersion === right.localeCopyVersion
  )
}
