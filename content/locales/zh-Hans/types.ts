import type {
  CurrentCaseCategory,
  CurrentCaseEditorialReview,
  CurrentCaseLaunchRole,
  CurrentCasePublicationStatus,
  CurrentCaseSourceKind,
} from "@/lib/current-cases/types"
import type {
  CountryRole,
  StrategicFlowKind,
  StrategicNodeKind,
  WorldStageConfidence,
  WorldStageFlowDirection,
  WorldStageFlowWeight,
  WorldStageSceneId,
} from "@/lib/world-stage/types"

export type ZhHansStatus = "approved" | "provisional" | "flagged"

export type ZhHansTerm = {
  id: string
  english: string
  zhHans: string
  status: ZhHansStatus
  contexts: readonly string[]
  note?: string
  alternatives?: readonly string[]
}

export type ZhHansAction = {
  href: string
  label: string
}

export type ZhHansPageSection = {
  id: string
  title: string
  paragraphs?: readonly string[]
  bullets?: readonly string[]
  items?: readonly { heading: string; body: string }[]
  actions?: readonly ZhHansAction[]
}

export type ZhHansEditorialPage = {
  eyebrow: string
  title: string
  intro: string
  sections: readonly ZhHansPageSection[]
}

export type ZhHansMetadata = {
  title: string
  description: string
  openGraph?: {
    title: string
    description: string
    type: "website" | "article"
  }
}

export type CanonicalDisplayName = {
  canonical: string
  display: string
}

export type ZhHansCurrentCaseSource = {
  id: string
  originalTitle: string
  displayTitle: string
  publisher: string
  publishedAt: string | null
  accessedAt: string
  url: string
  kind: CurrentCaseSourceKind
  claimIds: readonly string[]
}

export type ZhHansCurrentCaseRecord = {
  schemaVersion: 1
  id: string
  slug: string
  version: number
  publicationStatus: CurrentCasePublicationStatus
  launchRole: CurrentCaseLaunchRole
  originalTitle: string
  title: string
  dek: string
  category: CurrentCaseCategory
  publishedAt: string | null
  updatedAt: string
  evidenceWindow: { start: string; end: string }
  briefing: string
  actors: readonly CanonicalDisplayName[]
  perspectives: {
    global: string
    counterparties: readonly {
      actor: CanonicalDisplayName
      perspective: string
    }[]
  }
  factualClaims: readonly { id: string; text: string }[]
  knownUncertainties: readonly string[]
  reasoningTags: readonly { id: string; label: string }[]
  decision: {
    prompt: string
    options: readonly {
      id: string
      label: string
      logic: string
      acceptedTradeoff: string
    }[]
  }
  worldviewReadings: readonly {
    profileId: string
    noticesFirst: string
    interpretation: string
    recommendation: string
    recommendedOptionIds: readonly string[]
    strongestObjection: string
    updateCondition: string
  }[]
  assumptionChallenge: {
    newInformation: string
    prompt: string
    options: readonly {
      id: "weakens" | "priority" | "strengthens" | "unsure"
      label: string
    }[]
  }
  nextRoutes: readonly { href: string; label: string; reason: string }[]
  sources: readonly ZhHansCurrentCaseSource[]
  disputes: { factual: readonly string[]; interpretive: readonly string[] }
  sensitiveWording: readonly {
    term: string
    displayTerm: string
    guidance: string
    alternatives?: readonly string[]
  }[]
  correctionRisks: readonly { risk: string; mitigation: string }[]
  editorialMemo: string
  editorialReview: CurrentCaseEditorialReview
  correctionHistory: {
    status: "none-recorded" | "corrected"
    statusCopy: string
    lastEditorialUpdate: string
    evidenceThrough: string
    entries: readonly {
      date: string
      summary: string
      affectedClaimIds: readonly string[]
    }[]
  }
}

export type ZhHansWorldStageCountryCopy = {
  iso3: string
  role: CountryRole
  rationale: string
  confidence: WorldStageConfidence
  sourceRefs: readonly string[]
}

export type ZhHansWorldStageNodeCopy = {
  researchId: string
  kind: StrategicNodeKind
  label: string
  whyItMatters: string
  confidence: WorldStageConfidence
  sourceRefs: readonly string[]
}

export type ZhHansWorldStageFlowCopy = {
  researchId: string
  kind: StrategicFlowKind
  label: string
  meaning: string
  direction: WorldStageFlowDirection
  weight: WorldStageFlowWeight
  confidence: WorldStageConfidence
  sourceRefs: readonly string[]
}

export type ZhHansWorldStageSceneCopy = {
  sceneId: WorldStageSceneId
  researchSceneId: string
  publicLabel: string
  caption: string
  lensOwner: string
  asOf: string
  countryRoles: readonly ZhHansWorldStageCountryCopy[]
  nodes: readonly ZhHansWorldStageNodeCopy[]
  flows: readonly ZhHansWorldStageFlowCopy[]
}

export type ZhHansWorldviewProfileCopy = {
  id: string
  originalPublicName: string
  publicName: string
  originalTechnicalDescriptor: string
  decisionRule: string
  cardSummary: string
  detailSummary: string
}
