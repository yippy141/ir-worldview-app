import {
  RESEARCH_BODY_LIMIT_BYTES,
  readLimitedJson,
  validateResearchSubmission,
} from "@/lib/research/validation"
import { storeResearchSubmission } from "@/lib/research/server-storage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const validation = await readLimitedJson(
    request,
    RESEARCH_BODY_LIMIT_BYTES,
    validateResearchSubmission,
  )

  if (!validation.ok) {
    return Response.json({ ok: false, error: validation.error }, { status: validation.status })
  }

  const result = await storeResearchSubmission(validation.payload)
  if (result.disabled) {
    return Response.json(
      {
        ok: false,
        disabled: true,
        reason: result.reason,
        message: "Research storage is disabled for this build.",
      },
      { status: 200 },
    )
  }

  return Response.json(
    {
      ok: false,
      disabled: false,
      reason: result.reason,
      message: "Research storage is scaffolded, but no first-party storage adapter is active.",
    },
    { status: 501 },
  )
}
