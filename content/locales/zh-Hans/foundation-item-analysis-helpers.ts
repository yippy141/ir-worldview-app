import type {
  FoundationBiasAssessment,
  FoundationOptionEditorialNote,
} from "@/content/locales/zh-Hans/foundation-types"

export function risk(
  level: FoundationBiasAssessment["risk"],
  note: string,
): FoundationBiasAssessment {
  return { risk: level, note }
}

export function likertOptionNotes({
  disagree,
  midpoint,
  agree,
}: {
  disagree: string
  midpoint: string
  agree: string
}): readonly FoundationOptionEditorialNote[] {
  return [
    { optionId: "1", note: `“非常不同意”：${disagree}` },
    { optionId: "4", note: `“既不同意也不反对”：${midpoint}` },
    { optionId: "7", note: `“非常同意”：${agree}` },
  ]
}
