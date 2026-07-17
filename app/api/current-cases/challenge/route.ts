import { getPublishedCurrentCaseById } from "@/lib/current-cases/catalog"
import { createCurrentCaseChallengeToken } from "@/lib/current-cases/challenge-token.server"
import {
  challengeRateLimitHeaders,
  consumeCurrentCaseChallengeRateLimit,
} from "@/lib/current-cases/challenge-rate-limit.server"
import {
  hasExactKeys,
  readChallengeRequestJson,
} from "@/lib/current-cases/challenge-request.server"
import { isCurrentCaseConfidence } from "@/lib/current-cases/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const rateLimit = consumeCurrentCaseChallengeRateLimit(request, "create")
  const headers = challengeRateLimitHeaders(rateLimit)
  if (!rateLimit.allowed) {
    return Response.json(
      {
        ok: false,
        error: "Too many challenge links were requested. Try again shortly.",
      },
      { status: 429, headers },
    )
  }

  const json = await readChallengeRequestJson(request)
  if (!json.ok) {
    return Response.json(
      { ok: false, error: json.error },
      { status: json.status, headers },
    )
  }
  if (!hasExactKeys(json.value, ["caseId", "optionId", "confidence"])) {
    return Response.json(
      { ok: false, error: "Challenge request fields are invalid." },
      { status: 400, headers },
    )
  }

  const value = json.value as Record<string, unknown>
  if (
    typeof value.caseId !== "string" ||
    typeof value.optionId !== "string" ||
    !isCurrentCaseConfidence(value.confidence)
  ) {
    return Response.json(
      { ok: false, error: "Challenge request values are invalid." },
      { status: 400, headers },
    )
  }

  const record = getPublishedCurrentCaseById(value.caseId)
  if (!record || !record.decision.options.some((option) => option.id === value.optionId)) {
    return Response.json(
      { ok: false, error: "The published case or final option could not be verified." },
      { status: 400, headers },
    )
  }

  const created = createCurrentCaseChallengeToken({
    caseId: record.id,
    inviterFinalOptionId: value.optionId,
    inviterConfidence: value.confidence,
  })
  if (!created.ok) {
    return Response.json(
      {
        ok: false,
        error: "Challenge links are temporarily unavailable.",
      },
      { status: 503, headers },
    )
  }

  return Response.json(
    {
      ok: true,
      token: created.token,
      expiresAt: created.claims.expiresAt,
    },
    { status: 201, headers },
  )
}
