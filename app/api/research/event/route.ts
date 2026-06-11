import {
  RESEARCH_EVENT_BODY_LIMIT_BYTES,
  readLimitedJson,
  validateResearchEvent,
} from "@/lib/research/validation"
import { storeResearchEvent } from "@/lib/research/server-storage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const validation = await readLimitedJson(
    request,
    RESEARCH_EVENT_BODY_LIMIT_BYTES,
    validateResearchEvent,
  )

  if (!validation.ok) {
    return Response.json({ ok: false, error: validation.error }, { status: validation.status })
  }

  const result = await storeResearchEvent(validation.payload)
  if (result.disabled) {
    return Response.json(
      {
        ok: false,
        disabled: true,
        reason: result.reason,
        message: "Research event storage is disabled for this build.",
      },
      { status: 200 },
    )
  }

  return Response.json(
    {
      ok: false,
      disabled: false,
      reason: result.reason,
      message: "Research event storage is scaffolded, but no first-party storage adapter is active.",
    },
    { status: 501 },
  )
}
