import {
  RESEARCH_DELETE_BODY_LIMIT_BYTES,
  readLimitedJson,
  validateResearchDeletion,
} from "@/lib/research/validation"
import { storeResearchDeletionRequest } from "@/lib/research/server-storage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const validation = await readLimitedJson(
    request,
    RESEARCH_DELETE_BODY_LIMIT_BYTES,
    validateResearchDeletion,
  )

  if (!validation.ok) {
    return Response.json({ ok: false, error: validation.error }, { status: validation.status })
  }

  const result = await storeResearchDeletionRequest(validation.payload)
  if (result.disabled) {
    return Response.json(
      {
        ok: false,
        disabled: true,
        reason: result.reason,
        message: "Research deletion intake is disabled for this build.",
      },
      { status: 200 },
    )
  }

  return Response.json(
    {
      ok: false,
      disabled: false,
      reason: result.reason,
      message: "Research deletion intake is scaffolded, but no first-party storage adapter is active.",
    },
    { status: 501 },
  )
}
