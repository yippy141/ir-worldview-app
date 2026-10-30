import type { CanonicalFoundationResult } from "@/lib/scoring"
import { MODELED_FAMILY_KEYS, traditionNounLabel } from "@/lib/worldview-config"
import { questionCountsBySet } from "@/lib/quiz-schema"
import type { Locale } from "@/i18n/routing"
import type { DimensionScores, FamilyKey, FoundationQuestionSet, FoundationTier } from "@/lib/types"

export type FoundationPresentationKind = "flat" | "multiway-tie" | "two-way-tie" | "close" | "clear"
export type FoundationPresentation = {
  kind: FoundationPresentationKind
  tiedFamilies: FamilyKey[]
  showArchetype: boolean
  dimensionScores: DimensionScores
}

/** Presentation only. Ties use the scorer's published two-decimal precision,
 * never a new threshold or a reordered issued family/payload. */
export function classifyFoundationPresentation(
  result: Pick<CanonicalFoundationResult, "dimensionScores" | "familyScores" | "nearestFitGap">,
  lowDifferentiationThreshold: number,
): FoundationPresentation {
  const scores = MODELED_FAMILY_KEYS.map(key => [key, Math.round(result.familyScores[key] * 100)] as const)
  const top = Math.max(...scores.map(([, score]) => score))
  const tiedFamilies = scores.filter(([, score]) => score === top).map(([key]) => key)
  const flat = Object.values(result.dimensionScores).every(score => score === 4)
    && scores.every(([, score]) => score === 0)
  const kind: FoundationPresentationKind = flat ? "flat"
    : tiedFamilies.length > 2 ? "multiway-tie"
    : tiedFamilies.length === 2 ? "two-way-tie"
    : result.nearestFitGap < lowDifferentiationThreshold ? "close" : "clear"
  return { kind, tiedFamilies, showArchetype: kind !== "flat" && kind !== "multiway-tie", dimensionScores: result.dimensionScores }
}

const lensSubtitles: Record<Locale, Record<FamilyKey, string>> = {
  en: {
    realist: "Power / realist emphasis",
    institutionalist: "Rules / institutionalist emphasis",
    constructivist: "Meaning / constructivist emphasis",
    criticalPoliticalEconomy: "Structure / critical political economy emphasis",
  },
  "zh-Hans": {
    realist: "权力／现实主义侧重",
    institutionalist: "规则／制度主义侧重",
    constructivist: "意义／建构主义侧重",
    criticalPoliticalEconomy: "结构／批判政治经济学侧重",
  },
}
export function foundationLensSubtitle(families: readonly FamilyKey[], locale: Locale = "en") {
  return families.map(key => lensSubtitles[locale][key]).join(" · ")
}

export function ambiguousFoundationCopy(presentation: FoundationPresentation, locale: Locale = "en") {
  const flat = presentation.kind === "flat"
  if (locale === "zh-Hans") return {
    title: flat ? "各维度均处于中点" : `${presentation.tiedFamilies.length} 种传统并列领先`,
    summary: flat
      ? "七个维度均为 4（量尺为 1 至 7），四个传统分数均为 0。这组汇总分数没有区分出领先传统，也不能说明你为何这样作答。"
      : "按公布的小数精度，多种传统并列领先。下方维度分数仍有差异；并列并不表示所有立场相同，也不能据此任选两个传统作为你的身份。",
    qualification: "已发布链接和已保存记录保持原样。原先由排序产生的名称保留在记录中，但不作为此处的解释。",
    candidates: foundationLensSubtitle(presentation.tiedFamilies, locale),
  }
  return {
    title: flat ? "All dimensions at the midpoint" : `${presentation.tiedFamilies.length} traditions tied at the top`,
    summary: flat
      ? "All seven dimension scores are 4 on the 1 to 7 scale, and all four family scores are zero. These totals do not distinguish a leading tradition or explain why the answers produced this pattern."
      : "Several traditions tie at the published precision. The dimension scores below still show distinct positions; the tie does not make those positions identical or justify selecting an arbitrary pair as your identity.",
    qualification: "The issued link and saved record remain unchanged. Their original name is retained for compatibility, but its ordering does not establish an interpretation here.",
    candidates: presentation.tiedFamilies.map(traditionNounLabel).join(" · "),
  }
}

export type FoundationResultHeadingInput = {
  resultTier: FoundationTier
  questionSet: FoundationQuestionSet | null
  legacy: boolean
  lowDifferentiation: boolean
  primaryLabel: string
  runnerUpLabel: string
  presentation?: FoundationPresentation
}
export type FoundationResultHeading = { eyebrow: string; title: string; lead: string }

export function buildFoundationResultHeading(input: FoundationResultHeadingInput): FoundationResultHeading {
  const { resultTier, questionSet, legacy, lowDifferentiation, primaryLabel, runnerUpLabel, presentation } = input
  const formLabel = foundationFormLabel(questionSet, resultTier)
  if (presentation && !presentation.showArchetype) {
    const copy = ambiguousFoundationCopy(presentation)
    return { eyebrow: `Foundation result from the ${formLabel}`, title: copy.title, lead: copy.summary }
  }
  if (presentation?.kind === "two-way-tie") return {
    eyebrow: `Foundation result from the ${formLabel}`,
    title: `${primaryLabel} and ${runnerUpLabel} are tied`,
    lead: "The two family scores are equal at the published precision. Their order in the saved result does not establish a winner; the blend name summarizes both interpretations.",
  }
  if (legacy) return {
    eyebrow: "Issued Foundation result from an earlier payload",
    title: `Registered legacy Foundation result: ${primaryLabel}`,
    lead: "This link preserves its issued result. Its exact completed-form tuple is unavailable, so this page does not reconstruct calibrated contribution claims from the score summary.",
  }
  if (lowDifferentiation && resultTier === "core") return {
    eyebrow: `Initial Foundation result from the ${formLabel}`,
    title: `An initial Foundation result: ${primaryLabel} and ${runnerUpLabel}`,
    lead: "Both interpretations remain live in the current item set. The registered name summarizes the model output while targeted follow-up items test the boundary between them.",
  }
  if (lowDifferentiation) return {
    eyebrow: `Foundation result from the ${formLabel}`,
    title: `${primaryLabel} and ${runnerUpLabel} remain close`,
    lead: "The current item set does not give either interpretation a clear modeled lead. The registered name summarizes this nearby pair.",
  }
  return {
    eyebrow: `Foundation result from the ${formLabel}`,
    title: `${primaryLabel} leads this Foundation result`,
    lead: `The lead is clearer within the current item set. ${runnerUpLabel} remains the nearest alternative. This is a model result. It does not establish a durable trait.`,
  }
}
function foundationFormLabel(questionSet: FoundationQuestionSet | null, resultTier: FoundationTier) {
  if (questionSet === "core" || resultTier === "core") return `${questionCountsBySet.core}-item core form`
  if (questionSet === "targetedExtended") return "targeted refinement form"
  if (questionSet === "baselineExtended") return "baseline extension form"
  if (questionSet === "fullExtended") return "full extended form"
  return "legacy Foundation form"
}
