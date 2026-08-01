import { db } from "@/lib/db"
import type {
  AggregateDimensionBucket,
  AggregateStats,
} from "@/lib/percentiles"
import { FOUNDATION_INSTRUMENT_VERSION } from "@/lib/quiz-schema"
import { FOUNDATION_SCORING_VERSION } from "@/lib/scoring"
import { PAYLOAD_DIMENSION_ORDER } from "@/lib/share"
import type { DimensionKey } from "@/lib/types"

const SELECT_CURRENT_BUCKETS = `
  select dimension, bucket::text, count::text
  from agg_dimension_buckets
  where instrument_version = $1::integer
    and scoring_version = $2::integer
  order by dimension, bucket
`
const ALLOWED_DIMENSIONS = new Set<string>(PAYLOAD_DIMENSION_ORDER)

type BucketRow = {
  dimension: string
  bucket: string | number
  count: string | number
}

export async function readCurrentAggregateStats(): Promise<AggregateStats> {
  let buckets: AggregateDimensionBucket[] = []

  try {
    const rows = await db.query<BucketRow>(SELECT_CURRENT_BUCKETS, [
      FOUNDATION_INSTRUMENT_VERSION,
      FOUNDATION_SCORING_VERSION,
    ])
    buckets = rows.flatMap((row) => normalizeBucketRow(row))
  } catch {
    // Missing or unavailable storage returns an empty aggregate distribution.
  }

  return {
    instrumentVersion: FOUNDATION_INSTRUMENT_VERSION,
    scoringVersion: FOUNDATION_SCORING_VERSION,
    buckets,
  }
}

function normalizeBucketRow(row: BucketRow): AggregateDimensionBucket[] {
  const bucket = Number(row.bucket)
  const count = Number(row.count)

  if (
    !ALLOWED_DIMENSIONS.has(row.dimension) ||
    !Number.isFinite(bucket) ||
    bucket < 1 ||
    bucket > 7 ||
    !Number.isSafeInteger(count) ||
    count < 0
  ) {
    return []
  }

  return [{
    dimension: row.dimension as DimensionKey,
    bucket,
    count,
  }]
}
