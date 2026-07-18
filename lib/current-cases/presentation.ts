import type {
  CompletedCurrentCaseResponse,
  CurrentCase,
  CurrentCaseCategory,
  CurrentCaseConfidence,
  CurrentCaseSourceKind,
} from "@/lib/current-cases/types"

export type CurrentCasePublicRecord = Omit<
  CurrentCase,
  "disputes" | "sensitiveWording" | "correctionRisks" | "editorialMemo" | "editorialReview"
>

export const CURRENT_CASE_CATEGORY_LABELS: Record<CurrentCaseCategory, string> = {
  security: "Security",
  "economic-statecraft": "Economic statecraft",
  "institutions-and-governance": "Institutions and governance",
}

export const CURRENT_CASE_SOURCE_KIND_LABELS: Record<CurrentCaseSourceKind, string> = {
  primary: "Primary source",
  "authoritative-research": "Authoritative research",
  "high-quality-reporting": "High-quality reporting",
}

export const CURRENT_CASE_CONFIDENCE_LABELS: Record<CurrentCaseConfidence, string> = {
  1: "Very unsure",
  2: "Somewhat unsure",
  3: "Mixed",
  4: "Fairly sure",
  5: "Very sure",
}

export function formatCurrentCaseDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`))
}

export function toCurrentCasePublicRecord(record: CurrentCase): CurrentCasePublicRecord {
  const {
    disputes: _disputes,
    sensitiveWording: _sensitiveWording,
    correctionRisks: _correctionRisks,
    editorialMemo: _editorialMemo,
    editorialReview: _editorialReview,
    ...publicRecord
  } = record
  return publicRecord
}

export function getCurrentCaseOption(
  record: Pick<CurrentCase, "decision">,
  optionId: string,
) {
  return record.decision.options.find((option) => option.id === optionId) ?? null
}

export function describeCurrentCaseMovement(
  record: Pick<CurrentCase, "decision">,
  response: CompletedCurrentCaseResponse,
) {
  const initial = getCurrentCaseOption(record, response.initialOptionId)?.label ?? "Initial option"
  const final = getCurrentCaseOption(record, response.selectedOptionId)?.label ?? "Final option"
  const confidenceChanged = response.initialConfidence !== response.confidence

  if (response.initialOptionId !== response.selectedOptionId) {
    return `You moved from “${initial}” to “${final}”. Confidence went from ${response.initialConfidence} to ${response.confidence} out of 5.`
  }

  if (confidenceChanged) {
    return `You kept “${final}”. Confidence went from ${response.initialConfidence} to ${response.confidence} out of 5.`
  }

  return `You kept “${final}” with confidence at ${response.confidence} out of 5.`
}
