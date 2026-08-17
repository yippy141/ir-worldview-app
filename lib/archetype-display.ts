import type {
  Archetype,
  BlendArchetype,
  LensCode,
  NormSuffix,
} from "@/lib/archetypes"

export type ArchetypeDisplayCode =
  | Archetype["code"]
  | BlendArchetype["code"]

export const PUBLIC_LENS_LABELS = {
  P: "Power",
  R: "Rules",
  M: "Meaning",
  S: "Structure",
} as const satisfies Readonly<Record<LensCode, string>>

export const NORMATIVE_DISPLAY_ALIASES = {
  o: "Order-first",
  c: "Conditional",
  j: "Justice-first",
} as const satisfies Readonly<Record<NormSuffix, string>>

export function publicLensLabel(lens: LensCode): string {
  return PUBLIC_LENS_LABELS[lens]
}

export function normativeDisplayAlias(suffix: NormSuffix): string {
  return NORMATIVE_DISPLAY_ALIASES[suffix]
}

/**
 * Formats a validated internal archetype code for visible English display.
 * Internal codes retain their ASCII suffix for payload and resolver stability.
 */
export function formatArchetypeDisplayCode(code: ArchetypeDisplayCode): string {
  return code.endsWith("-") ? `${code.slice(0, -1)}−` : code
}

/** Formats the same code without requiring punctuation to convey the sign. */
export function formatArchetypeCodeSpeech(
  code: ArchetypeDisplayCode,
): string {
  const lens = code.slice(0, -1).replace("/", " slash ")
  return `${lens} ${code.endsWith("+") ? "plus" : "minus"}`
}

export function formatArchetypeReadingCode(
  code: ArchetypeDisplayCode,
  normativeSuffix: NormSuffix,
): string {
  return `${formatArchetypeDisplayCode(code)} · ${normativeDisplayAlias(normativeSuffix)}`
}

export function formatArchetypeReadingCodeForSpeech(
  code: ArchetypeDisplayCode,
  normativeSuffix: NormSuffix,
): string {
  return `${formatArchetypeCodeSpeech(code)}, ${normativeDisplayAlias(normativeSuffix)}`
}
