import type { AiAxisKey, AiAxisScores, AiArchetypeKey } from "@/lib/ai-governance-types"
import { getAiGovernanceVersion } from "@/lib/ai-governance-versions"

/** Small, experiment-local claim contract. No storage, inference service or issued result. */
export type Provenance = {
  instrument: "foundation" | "ai-governance" | "episode"
  bank: number | "unscored"
  scorer: number | "none"
  form: string
  copy: number
  source: string
}
export type Claim = {
  id: string
  provenance: Provenance
  refs: { id: string; text: string }[]
  kind: "direct observation" | "exact model comparison" | "editorial interpretation" | "proposed question"
  supports: string
  doesNotSupport: string
  text: string
}
export type ComparisonTerm = { axis: string; term: number }
export type Comparison = {
  primary: string; alternative: string; primaryScore: number; alternativeScore: number
  tied: string[]; terms: ComparisonTerm[]; residual: number
}

/** Keep all exact leaders. Ordering is only for display, never a tie-breaking claim. */
export function rankExact(scores: Record<string, number>) {
  const ordered = Object.entries(scores).sort((a, b) => b[1] - a[1])
  return { ordered, tied: ordered.filter(([, score]) => score === ordered[0][1]).map(([key]) => key) }
}

export function compareAi(scores: AiAxisScores, bank: number, scorer: number): Comparison | null {
  const version = getAiGovernanceVersion(bank, scorer)
  if (!version) return null
  const totals = version.scoring.scoreArchetypes(scores)
  const { ordered, tied } = rankExact(totals)
  const [primary, alternative] = ordered.slice(0, 2).map(([key]) => key as AiArchetypeKey)
  const profiles = version.scoring.archetypeProfiles
  const terms = (Object.entries(scores) as [AiAxisKey, number][]).map(([axis, score]) => ({
    axis: version.schema.aiAxisLabels[axis],
    term: (score - 4) * ((profiles[primary][axis] ?? 0) - (profiles[alternative][axis] ?? 0)),
  }))
  return {
    primary: version.scoring.archetypeLabels[primary], alternative: version.scoring.archetypeLabels[alternative],
    primaryScore: totals[primary], alternativeScore: totals[alternative],
    tied: tied.length > 1 ? tied.map(key => version.scoring.archetypeLabels[key as AiArchetypeKey]) : [],
    terms, residual: totals[primary] - totals[alternative] - terms.reduce((sum, row) => sum + row.term, 0),
  }
}
