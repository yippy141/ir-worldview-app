import { readAggregateStatsForFoundationPayload } from "@/lib/research/aggregate-stats"
import { resolveFoundationPayload } from "@/lib/share"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const CACHE_CONTROL = "public, max-age=300, s-maxage=300"
const NO_STORE = "no-store"

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const payloads = params.getAll("payload")
  if (
    payloads.length !== 1 ||
    [...params.keys()].some((key) => key !== "payload") ||
    payloads[0].trim() === ""
  ) {
    return invalidPayloadResponse()
  }

  const resolved = resolveFoundationPayload(payloads[0])
  const stats = resolved
    ? await readAggregateStatsForFoundationPayload(resolved)
    : null
  if (!stats) {
    return invalidPayloadResponse()
  }

  return Response.json(stats, {
    headers: {
      "cache-control": CACHE_CONTROL,
    },
  })
}

function invalidPayloadResponse() {
  return Response.json(
    {
      ok: false,
      error: "A current Foundation result payload is required.",
    },
    {
      status: 400,
      headers: {
        "cache-control": NO_STORE,
      },
    },
  )
}
