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
): FoundationCardCopy {
  return {
    readingCode: formatArchetypeReadingCode(archetype.code, norm),
    name: archetype.name,
    gloss: archetype.gloss,
  }
}

export function buildEnglishFoundationResultSocialCopy(
  archetype: FoundationArchetype,
  norm: NormSuffix,
) {
  const card = buildFoundationCardCopy(archetype, norm)
  return {
    title: `${card.name} result | IR Worldview Inventory`,
    description: `Shared IR Worldview result: ${card.name} · ${card.readingCode}. ${card.gloss}`,
    cardAlt: `${card.name} Foundation profile`,
  }
}

export function buildZhHansFoundationResultSocialCopy(
  archetype: FoundationArchetype,
  narrativeSummary: string,
) {
  return {
    title: `${archetype.name}（基础原型）｜国际关系世界观清单`,
    description: `规范基础原型 ${archetype.name}（${formatArchetypeDisplayCode(archetype.code)}）。${narrativeSummary}`,
  }
}

export function buildEnglishProfileSocialCopy(
  archetype: FoundationArchetype,
) {
  return {
    title: `${archetype.name} profile | IR Worldview Inventory`,
    description: `Shared Foundation profile: ${archetype.name}. ${archetype.gloss}`,
  }
}
