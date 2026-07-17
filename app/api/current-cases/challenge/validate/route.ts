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

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const rateLimit = consumeCurrentCaseChallengeRateLimit(request, "validate")
  const headers = challengeRateLimitHeaders(rateLimit)
  if (!rateLimit.allowed) {
    return Response.json(
      {
        ok: false,
        reason: "rate-limited",
        error: "Too many challenge checks. Try again shortly.",
      },
      { status: 429, headers },
    )
  }

  const json = await readChallengeRequestJson(request)
  if (!json.ok) {
    return Response.json(
      { ok: false, reason: "malformed", error: json.error },
      { status: json.status, headers },
    )
  }
  if (!hasExactKeys(json.value, ["token", "caseId"])) {
    return Response.json(
      { ok: false, reason: "malformed", error: "Challenge request fields are invalid." },
      { status: 400, headers },
    )
  }

  const value = json.value as Record<string, unknown>
  if (typeof value.token !== "string" || typeof value.caseId !== "string") {
    return Response.json(
      { ok: false, reason: "malformed", error: "Challenge request values are invalid." },
      { status: 400, headers },
    )
  }

  const record = getPublishedCurrentCaseById(value.caseId)
  if (!record) {
    return Response.json(
      { ok: false, reason: "wrong-case", error: "This challenge does not match a published case." },
      { status: 400, headers },
    )
  }

  const validated = readCurrentCaseChallengeToken(value.token, {
    expectedCaseId: record.id,
  })
  if (!validated.ok) {
    const status = validated.reason === "expired" ? 410 : validated.reason === "missing-secret" ? 503 : 400
    const error =
      validated.reason === "expired"
        ? "This challenge link has expired."
        : validated.reason === "missing-secret"
          ? "Challenge links are temporarily unavailable."
          : validated.reason === "wrong-case"
            ? "This challenge does not match this case."
            : "This challenge link is invalid."
    return Response.json(
      { ok: false, reason: validated.reason, error },
      { status, headers },
    )
  }
  if (
    !record.decision.options.some(
      (option) => option.id === validated.claims.inviterFinalOptionId,
    )
  ) {
    return Response.json(
      {
        ok: false,
        reason: "invalid",
        error: "This challenge no longer matches the published case.",
      },
      { status: 409, headers },
    )
  }

  return Response.json(
    { ok: true, expiresAt: validated.claims.expiresAt },
    { status: 200, headers },
  )
}
