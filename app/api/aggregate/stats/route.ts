import { readCurrentAggregateStats } from "@/lib/research/aggregate-stats"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const STATS_CACHE_SECONDS = 5 * 60
const CACHE_CONTROL = `public, max-age=${STATS_CACHE_SECONDS}, s-maxage=${STATS_CACHE_SECONDS}`
export async function GET() {
  const stats = await readCurrentAggregateStats()

  return Response.json(
    stats,
    {
      headers: {
        "cache-control": CACHE_CONTROL,
      },
    },
  )
}
