import type { DimensionKey } from "@/lib/types"

export type LocalePageMetadata = {
  title: string
  description: string
}

export type LocaleAction = {
  href: string
  label: string
  kind: "primary" | "secondary"
}

export type LocaleContentItem = {
  heading: string
  body: string
}

export type LocaleSection = {
  id: string
  title: string
  paragraphs?: readonly string[]
  bullets?: readonly string[]
  items?: readonly LocaleContentItem[]
  note?: string
  actions?: readonly LocaleAction[]
}

export type LocaleEditorialPage = {
  metadata: LocalePageMetadata
  eyebrow: string
  title: string
  intro: string
  sections: readonly LocaleSection[]
}

export type ChineseShellContent = {
  home: LocaleEditorialPage
  about: LocaleEditorialPage
  methods: LocaleEditorialPage & {
    dimensions: Readonly<Record<DimensionKey, LocaleContentItem>>
  }
  privacy: LocaleEditorialPage
  corrections: LocaleEditorialPage
  cases: {
    metadata: LocalePageMetadata
    eyebrow: string
    title: string
    intro: string
    privacyNote: string
    englishContentNotice: string
    emptyTitle: string
    emptyBody: string
  }
  unavailable: {
    metadata: LocalePageMetadata
    eyebrow: string
    title: string
    body: string
    scope: string
  }
}
