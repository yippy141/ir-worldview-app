import { getPublishedCurrentCaseById } from "@/lib/current-cases/catalog"
import { readCurrentCaseChallengeToken } from "@/lib/current-cases/challenge-token.server"
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
  const rateLimit = consumeCurrentCaseChallengeRateLimit(request, "reveal")
  const headers = challengeRateLimitHeaders(rateLimit)
  if (!rateLimit.allowed) {
    return Response.json(
      { ok: false, error: "Too many reveal attempts. Try again shortly." },
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
  if (
    !hasExactKeys(json.value, [
      "token",
      "caseId",
      "friendOptionId",
      "friendConfidence",
    ])
  ) {
    return Response.json(
      { ok: false, error: "Reveal request fields are invalid." },
      { status: 400, headers },
    )
  }

  const value = json.value as Record<string, unknown>
  if (
    typeof value.token !== "string" ||
    typeof value.caseId !== "string" ||
    typeof value.friendOptionId !== "string" ||
    !isCurrentCaseConfidence(value.friendConfidence)
  ) {
    return Response.json(
      { ok: false, error: "Reveal request values are invalid." },
      { status: 400, headers },
    )
  }

  const record = getPublishedCurrentCaseById(value.caseId)
  if (
    !record ||
    !record.decision.options.some((option) => option.id === value.friendOptionId)
  ) {
    return Response.json(
      { ok: false, error: "Complete the published case before revealing the invitation." },
      { status: 400, headers },
    )
  }

  const revealed = readCurrentCaseChallengeToken(value.token, {
    expectedCaseId: record.id,
  })
  if (!revealed.ok) {
    const status = revealed.reason === "expired" ? 410 : revealed.reason === "missing-secret" ? 503 : 400
    const error =
      revealed.reason === "expired"
        ? "This challenge link has expired."
        : revealed.reason === "missing-secret"
          ? "Challenge reveals are temporarily unavailable."
          : "This challenge link is invalid."
    return Response.json({ ok: false, error }, { status, headers })
  }
  if (
    !record.decision.options.some(
      (option) => option.id === revealed.claims.inviterFinalOptionId,
    )
  ) {
    return Response.json(
      { ok: false, error: "This challenge no longer matches the published case." },
      { status: 409, headers },
    )
  }

  return Response.json(
    {
      ok: true,
      inviterFinalOptionId: revealed.claims.inviterFinalOptionId,
      inviterConfidence: revealed.claims.inviterConfidence,
    },
    { status: 200, headers },
  )
}
