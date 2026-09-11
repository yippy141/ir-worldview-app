/** Presentation only. These bands choose prose; they never classify or rescore a result. */
export function positionBand(value: number): "low" | "middle" | "high" {
  return value <= 3 ? "low" : value >= 5 ? "high" : "middle"
}

export type WorkedApplication = {
  kind: "illustrative-implication"
  title: string
  facts: string
  application: string
  rival: string
  change: string
}

export type ResultInterpretation = {
  kind: "model-interpretation"
  summary: string
  scope: string
  example: WorkedApplication
  followUp: { kind: "follow-up"; question: string }
}

/** Select a pair by joint directional distance, never by alleged scorer contribution. */
export function strongestPair<K extends string>(scores: Record<K, number>, pairs: readonly (readonly [K, K])[]) {
  return [...pairs].sort((a, b) =>
    b.reduce((sum, key) => sum + Math.abs(scores[key] - 4), 0) -
    a.reduce((sum, key) => sum + Math.abs(scores[key] - 4), 0),
  )[0]
}
