import { ambiguousFoundationCopy, foundationMidpointCopy, type FoundationPresentation } from "@/lib/results/foundation-result-heading"
import { formatArchetypeReadingCode } from "@/lib/archetype-display"
import { traditionNounLabel, ZH_TRADITION_NOUN_LABELS } from "@/lib/worldview-config"
import type { Locale } from "@/i18n/routing"
import type {
  Archetype,
  BlendArchetype,
  NormSuffix,
} from "@/lib/archetypes"

type FoundationArchetype = Archetype | BlendArchetype

/** A catalog entry can describe a school. A shared score only establishes a modeled fit. */
export function foundationTraditionDescription(archetype: FoundationArchetype, presentation?: FoundationPresentation, locale: Locale = "en") {
  if ("familyKeys" in archetype) {
    const names = archetype.familyKeys.map(key => locale === "en" ? traditionNounLabel(key) : ZH_TRADITION_NOUN_LABELS[key])
    if (presentation?.kind === "two-way-tie") return locale === "en"
      ? `${names.join(" and ")} share the highest score.`
      : `${names.join("与")}得分并列第一。`
    return locale === "en"
      ? `In the model comparison, ${names.join(" and ")} finish close together.`
      : `模型比较中，${names.join("与")}的得分接近。`
  }
  if (locale === "zh-Hans") return `在模型比较的四种传统中，这份结果与${ZH_TRADITION_NOUN_LABELS[archetype.familyKey]}最接近。`
  const questions = {
    realist: "Who has the power to make another government change course?",
    institutionalist: "How does an agreement change the cost of breaking a promise?",
    constructivist: "Can recognition change what a government wants?",
    criticalPoliticalEconomy: "Who controls the markets and resources other countries need?",
  }
  return `The closest match is ${traditionNounLabel(archetype.familyKey)}. ${questions[archetype.familyKey]}`
}

export type FoundationCardCopy = {
  readingCode: string
  name: string
  gloss: string
}

export function buildFoundationCardCopy(
  archetype: FoundationArchetype,
  norm: NormSuffix,
  presentation?: FoundationPresentation,
): FoundationCardCopy {
  if (presentation && !presentation.showArchetype) {
    const copy = ambiguousFoundationCopy(presentation)
    return { readingCode: "Dimension profile", name: copy.title, gloss: presentation.kind === "flat"
      ? "All seven dimensions sit at 4 on the 1 to 7 scale. All four traditions tie."
      : `${copy.candidates}. These traditions share the highest score. The seven dimensions show where the answers differ.` }
  }
  const midpoint = foundationMidpointCopy(presentation)
  if (midpoint) return { readingCode: "Foundation traditions", name: midpoint.title, gloss: midpoint.summary }
  return {
    readingCode: formatArchetypeReadingCode(archetype.code, norm),
    name: archetype.name,
    gloss: foundationTraditionDescription(archetype, presentation),
  }
}

export function buildEnglishFoundationResultSocialCopy(
  archetype: FoundationArchetype,
  norm: NormSuffix,
  presentation?: FoundationPresentation,
) {
  const card = buildFoundationCardCopy(archetype, norm, presentation)
  return {
    title: `${card.name} result | IR Worldview Inventory`,
    description: `Shared IR Worldview result: ${card.name} · ${card.readingCode}. ${card.gloss}`,
    cardAlt: `${card.name} Foundation profile`,
  }
}

export function buildZhHansFoundationResultSocialCopy(
  archetype: FoundationArchetype,
  presentation?: FoundationPresentation,
) {
  if (presentation && !presentation.showArchetype) {
    const copy = ambiguousFoundationCopy(presentation, "zh-Hans")
    return { title: `${copy.title}｜国际关系世界观清单`, description: `${copy.summary} ${copy.qualification}` }
  }
  const midpoint = foundationMidpointCopy(presentation, "zh-Hans")
  if (midpoint) return { title: `${midpoint.title}｜国际关系世界观清单`, description: midpoint.summary }
  return {
    title: `${archetype.name}（基础原型）｜国际关系世界观清单`,
    description: foundationTraditionDescription(archetype, presentation, "zh-Hans"),
  }
}

export function buildEnglishProfileSocialCopy(
  archetype: FoundationArchetype,
  presentation?: FoundationPresentation,
) {
  if (presentation && !presentation.showArchetype) {
    const copy = ambiguousFoundationCopy(presentation)
    return { title: `${copy.title} | IR Worldview Inventory`, description: `${copy.summary} ${copy.qualification}` }
  }
  const midpoint = foundationMidpointCopy(presentation)
  if (midpoint) return { title: `${midpoint.title} | IR Worldview Inventory`, description: midpoint.summary }
  return {
    title: `${archetype.name} profile | IR Worldview Inventory`,
    description: foundationTraditionDescription(archetype, presentation),
  }
}
