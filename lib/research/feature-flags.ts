/**
 * Aggregate collection and percentile display stay off unless production has
 * explicitly enabled them after migrations, monitoring, and platform request
 * throttling are in place. DATABASE_URL alone must not activate public
 * measurement.
 */
export function tier1AggregatesEnabled(): boolean {
  return process.env.TIER1_AGGREGATES_ENABLED?.trim().toLowerCase() === "true"
}
