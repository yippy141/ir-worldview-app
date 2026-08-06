import type { Locale } from "@/i18n/routing"
import { chineseShellContent } from "@/content/locales/zh-Hans"
import {
  getPerspectiveDefinition,
  isPerspectiveId,
} from "@/lib/perspectives/catalog"
import { dimensionLabels } from "@/lib/quiz-schema"
import { resolveFoundationIdentityFromSnapshot } from "@/lib/profile-foundation-identity"
import { familyLabelFromKey } from "@/lib/result-helpers"
import type { ModuleSnapshot, ProfileStore } from "@/lib/profile-store"
import type { DimensionKey } from "@/lib/types"

const ZH_SHARE = chineseShellContent.profileShare

export type LocalizedProfileShareView = {
  locale: Locale
  eyebrow: string
  title: string
  intro: string
  foundation: {
    heading: string
    archetypeName: string
    archetypeCode: string
    familyLabel: string
    runnerUpLabel: string
    modifiers: string[]
    summary: string
    dimensions: Array<{ key: DimensionKey; label: string; score: number }>
  }
  modules: Array<{ slug: ModuleSnapshot["slug"]; title: string; summary: string }>
  ai: { title: string; label: string; summary: string } | null
  perspectives: Array<{ id: string; label: string }>
  provenanceNotice: string | null
}

export function buildLocalizedProfileShareView(
  profile: ProfileStore,
  locale: Locale,
): LocalizedProfileShareView | null {
  const foundation = profile.foundation
  if (!foundation) return null
  const foundationIdentity =
    resolveFoundationIdentityFromSnapshot(foundation)
  if (!foundationIdentity) return null
  const { archetype: foundationArchetype, result: foundationResult } =
    foundationIdentity
  const zh = locale === "zh-Hans"
  const familyLabel = zh
    ? ZH_SHARE.familyLabels[foundationResult.familyKey]
    : familyLabelFromKey(foundationResult.familyKey)
  const runnerUpLabel = zh
    ? ZH_SHARE.familyLabels[foundationResult.runnerUpKey]
    : familyLabelFromKey(foundationResult.runnerUpKey)
  const origins = profileOriginCohorts(profile)

  return {
    locale,
    eyebrow: zh ? ZH_SHARE.eyebrow : "Shared Foundation profile",
    title: zh
      ? ZH_SHARE.title(foundationArchetype.name)
      : foundationArchetype.name,
    intro: zh
      ? ZH_SHARE.intro
      : foundationArchetype.gloss,
    foundation: {
      heading: zh ? ZH_SHARE.foundationHeading : "Foundation",
      archetypeName: foundationArchetype.name,
      archetypeCode: foundationArchetype.code,
      familyLabel,
      runnerUpLabel,
      modifiers: [
        zh
          ? ZH_SHARE.strategyLabels[foundationResult.strategyModifier]
          : foundationResult.strategyModifier,
        zh
          ? ZH_SHARE.normativeLabels[foundationResult.normativeModifier]
          : foundationResult.normativeModifier,
      ],
      summary: zh
        ? ZH_SHARE.foundationSummary(familyLabel, runnerUpLabel)
        : foundationResult.explanation,
      dimensions: (Object.keys(dimensionLabels) as DimensionKey[]).map(
        (key) => ({
          key,
          label: zh
            ? chineseShellContent.methods.dimensions[key].heading
            : dimensionLabels[key],
          score: foundationResult.dimensionScores[key],
        }),
      ),
    },
    modules: Object.values(profile.modules).flatMap((snapshot) =>
      snapshot
        ? [{
            slug: snapshot.slug,
            title: zh
              ? ZH_SHARE.moduleLabels[snapshot.slug]
              : snapshot.title,
            summary: zh
              ? ZH_SHARE.moduleSummary
              : snapshot.summary,
          }]
        : [],
    ),
    ai: profile.aiGovernance
      ? {
          title: zh ? ZH_SHARE.aiTitle : "AI governance",
          label: zh
            ? ZH_SHARE.aiLabels[profile.aiGovernance.archetypeKey]
            : profile.aiGovernance.archetypeLabel,
          summary: zh
            ? ZH_SHARE.aiSummary
            : profile.aiGovernance.summary,
        }
      : null,
    perspectives: profile.perspectiveRuns.map((run) => ({
      id: run.id,
      label: zh && isPerspectiveId(run.perspectiveId)
        ? ZH_SHARE.perspectiveLabels[run.perspectiveId]
        : getPerspectiveDefinition(run.perspectiveId)?.label ?? run.perspectiveLabel,
    })),
    provenanceNotice: origins.size > 1
      ? zh
        ? ZH_SHARE.provenanceNotice
        : "This profile contains completions from different locale or copy versions. They may be viewed together, but are not presented as research-equivalent measurements."
      : null,
  }
}

function profileOriginCohorts(profile: ProfileStore) {
  const records = [
    ...(profile.foundation ? [profile.foundation] : []),
    ...Object.values(profile.modules).filter(
      (record): record is ModuleSnapshot => Boolean(record),
    ),
    ...(profile.aiGovernance ? [profile.aiGovernance] : []),
    ...profile.perspectiveRuns,
  ]
  return new Set(
    records.map((record) => `${record.locale}:${record.localeCopyVersion}`),
  )
}
