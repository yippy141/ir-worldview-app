import { isSupportedFoundationCopyVersion, type FoundationCopyVersion } from "@/lib/foundation-copy-versions"
import type { Locale } from "@/i18n/routing"
import { INSTRUMENT_COPY_VERSIONS, type CompletionProvenance } from "@/lib/locale-provenance"
import type { QuizSession as IssuedQuizSession } from "@/lib/types"

export type FoundationQuizSession = IssuedQuizSession & { foundationCopy?: FoundationDraftCopy }

/** One draft-level binding, not item exposure history. Never infer it from completion locale. */
export type FoundationDraftCopy =
  | { status: "single-copy"; locale: Locale; version: FoundationCopyVersion }
  | { status: "legacy-unknown" }
  | { status: "unavailable" }

export function parseFoundationDraftCopy(value: unknown): FoundationDraftCopy | undefined {
  if (value === undefined) return undefined
  if (typeof value === "object" && value !== null) {
    const v = value as Record<string, unknown>
    if (v.status === "legacy-unknown") return { status: "legacy-unknown" }
    if (v.status === "single-copy" && (v.locale === "en" || v.locale === "zh-Hans") && isSupportedFoundationCopyVersion(v.locale, v.version)) {
      return { status: "single-copy", locale: v.locale as Locale, version: v.version }
    }
  }
  return { status: "unavailable" }
}

export function initializeFoundationDraftCopy(session: FoundationQuizSession, locale: Locale): FoundationQuizSession {
  if (session.foundationCopy) return session
  return { ...session, foundationCopy: Object.keys(session.answers).length
    ? { status: "legacy-unknown" }
    : { status: "single-copy", locale, version: INSTRUMENT_COPY_VERSIONS.foundation[locale] } }
}

export function foundationDraftCopyVersion(session: FoundationQuizSession): FoundationCopyVersion {
  return session.foundationCopy?.status === "single-copy" ? session.foundationCopy.version : 1
}

export function foundationDraftMatchesLocale(session: FoundationQuizSession, locale: Locale): boolean {
  return session.foundationCopy?.status !== "unavailable" && (session.foundationCopy?.status !== "single-copy" || session.foundationCopy.locale === locale)
}

export function foundationDraftCompletion(session: FoundationQuizSession, locale: Locale): CompletionProvenance {
  if (!foundationDraftMatchesLocale(session, locale)) throw new Error("The draft must be completed in its bound language or explicitly restarted.")
  return { locale, localeCopyVersion: session.foundationCopy?.status === "single-copy" ? session.foundationCopy.version : 0 }
}

/** Revision 2 restores supplied scenarios; it is not empirically linked to revision 1. */
export const foundationChineseCopyRevisions = {
  1: {  status: "adapted-beta", comparison: "not-validated-or-equivalent" },
  2: {  status: "adapted-beta", comparison: "not-validated-or-equivalent" },
  3: {  status: "adapted-beta", comparison: "not-validated-or-equivalent" },
} as const
