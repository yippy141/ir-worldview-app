/**
 * Aggregate collection and percentile display stay off unless an environment
 * explicitly enables them after the Tier 1 migration and privacy gates pass.
 * DATABASE_URL alone must not activate public measurement.
 */
export function tier1AggregatesEnabled(): boolean {
  return process.env.TIER1_AGGREGATES_ENABLED?.trim().toLowerCase() === "true"
}
