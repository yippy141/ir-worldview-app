import { getPublishedCurrentCaseById } from "@/lib/current-cases/catalog"
import { validateAnalyticsEvent } from "@/lib/analytics/adapter"
import { productAnalytics } from "@/lib/analytics/vercel.server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ANALYTICS_BODY_LIMIT_BYTES = 2 * 1024

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0")
  if (contentLength > ANALYTICS_BODY_LIMIT_BYTES) {
    return Response.json({ ok: false, error: "Analytics event is too large." }, { status: 413 })
  }

  const body = await request.text()
  if (new TextEncoder().encode(body).byteLength > ANALYTICS_BODY_LIMIT_BYTES) {
    return Response.json({ ok: false, error: "Analytics event is too large." }, { status: 413 })
  }

  let value: unknown
  try {
    value = JSON.parse(body)
  } catch {
    return Response.json({ ok: false, error: "Analytics event must be valid JSON." }, { status: 400 })
  }

  const validation = validateAnalyticsEvent(value)
  if (!validation.ok) {
    return Response.json({ ok: false, error: validation.error }, { status: 400 })
  }
  if (
    validation.event.properties.caseId &&
    !getPublishedCurrentCaseById(validation.event.properties.caseId)
  ) {
    return Response.json({ ok: false, error: "Unknown Current Case ID." }, { status: 400 })
  }

  const result = await productAnalytics.track(validation.event)
  if (!result.accepted) {
    return Response.json({ ok: false, error: result.error }, { status: 400 })
  }

  // Provider absence or failure is intentionally a no-op so measurement can
  // never block the product interaction that triggered it.
  return Response.json({ ok: true }, { status: 202 })
}
