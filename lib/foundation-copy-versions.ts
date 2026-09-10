import type { Locale } from "@/i18n/routing"

/** Supported wording, not evidence of response or cross-language equivalence. */
export const SUPPORTED_FOUNDATION_COPY_VERSIONS = {
  en: [1, 2],
  "zh-Hans": [1, 2, 3],
} as const
export type FoundationCopyVersion = typeof SUPPORTED_FOUNDATION_COPY_VERSIONS[Locale][number]
export const CURRENT_FOUNDATION_COPY_VERSIONS = { en: 2, "zh-Hans": 3 } as const

export function isSupportedFoundationCopyVersion(
  locale: Locale,
  version: unknown,
): version is FoundationCopyVersion {
  return typeof version === "number" && (SUPPORTED_FOUNDATION_COPY_VERSIONS[locale] as readonly number[]).includes(version)
}
