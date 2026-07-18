import type { AiArchetypeKey } from "@/lib/ai-governance-types"
import type { ModuleSlug } from "@/lib/modules/types"
import type { PerspectiveId } from "@/lib/perspectives/types"
import type {
  DimensionKey,
  FamilyKey,
  NormativeModifier,
  StrategyModifier,
} from "@/lib/types"

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

export type ChineseProfileShareContent = {
  familyLabels: Readonly<Record<FamilyKey, string>>
  strategyLabels: Readonly<Record<StrategyModifier, string>>
  normativeLabels: Readonly<Record<NormativeModifier, string>>
  moduleLabels: Readonly<Record<ModuleSlug, string>>
  aiLabels: Readonly<Record<AiArchetypeKey, string>>
  perspectiveLabels: Readonly<Record<PerspectiveId, string>>
  eyebrow: string
  title: (familyLabel: string) => string
  intro: string
  foundationHeading: string
  foundationSummary: (familyLabel: string, runnerUpLabel: string) => string
  moduleSummary: string
  aiTitle: string
  aiSummary: string
  provenanceNotice: string
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
  profileShare: ChineseProfileShareContent
  unavailable: {
    metadata: LocalePageMetadata
    eyebrow: string
    title: string
    body: string
    scope: string
  }
}
