/** Traceable authored claims; no inference service or response persistence. */
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
