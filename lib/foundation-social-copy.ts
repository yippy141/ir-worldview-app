import { ambiguousFoundationCopy, type FoundationPresentation } from "@/lib/results/foundation-result-heading"
import {
  formatArchetypeDisplayCode,
  formatArchetypeReadingCode,
} from "@/lib/archetype-display"
import type {
  Archetype,
  BlendArchetype,
  NormSuffix,
} from "@/lib/archetypes"

type FoundationArchetype = Archetype | BlendArchetype

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
      ? "Seven dimensions at 4 of 7; four family scores at zero. No leading tradition. The issued name is retained only in the saved record."
      : `${copy.candidates}. Equal top scores at published precision. Dimension positions still differ; the saved name does not establish a two-family identity.` }
  }
  return {
    readingCode: formatArchetypeReadingCode(archetype.code, norm),
    name: archetype.name,
    gloss: archetype.gloss,
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
  narrativeSummary: string,
  presentation?: FoundationPresentation,
) {
  if (presentation && !presentation.showArchetype) {
    const copy = ambiguousFoundationCopy(presentation, "zh-Hans")
    return { title: `${copy.title}｜国际关系世界观清单`, description: `${copy.summary} ${copy.qualification}` }
  }
  return {
    title: `${archetype.name}（基础原型）｜国际关系世界观清单`,
    description: `规范基础原型 ${archetype.name}（${formatArchetypeDisplayCode(archetype.code)}）。${narrativeSummary}`,
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
  return {
    title: `${archetype.name} profile | IR Worldview Inventory`,
    description: `Shared Foundation profile: ${archetype.name}. ${archetype.gloss}`,
  }
}
