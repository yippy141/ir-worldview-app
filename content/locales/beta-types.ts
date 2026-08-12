import type { LocalePageMetadata } from "@/content/locales/types"

export type BetaPageContent = {
  metadata: LocalePageMetadata
  eyebrow: string
  title: string
  intro: string
  testingTitle: string
  testingItems: readonly string[]
  participationTitle: string
  participationBody: string
  optionalNote: string
  participationLink: string
  linkUnavailable: string
  opensNewTab: string
  boundariesTitle: string
  boundariesIntro: string
  prohibitedItems: readonly string[]
  dataTitle: string
  productFeedbackBody: string
  tier1Body: string
  externalDataBody: string
  otherRoutesTitle: string
  correctionsBody: string
  correctionsLink: string
  privacyLink: string
  homeLink: string
}
