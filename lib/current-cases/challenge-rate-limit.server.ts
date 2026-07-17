import { createHash, randomBytes } from "node:crypto"

export const CURRENT_CASE_CHALLENGE_RATE_LIMIT = 5
export const CURRENT_CASE_CHALLENGE_RATE_WINDOW_MS = 60_000

type RateBucket = {
  count: number
  resetAt: number
}

type RateLimitResult = {
  allowed: boolean
  limit: number
  remaining: number
  retryAfterSeconds: number
}

const buckets = new Map<string, RateBucket>()
const processSalt = randomBytes(32)

export function consumeCurrentCaseChallengeRateLimit(
  request: Request,
  scope: "create" | "validate" | "reveal",
  now = Date.now(),
): RateLimitResult {
  const key = `${scope}:${fingerprintRequest(request)}`
  pruneExpiredBuckets(now)

  const existing = buckets.get(key)
  const bucket =
    existing && existing.resetAt > now
      ? existing
      : { count: 0, resetAt: now + CURRENT_CASE_CHALLENGE_RATE_WINDOW_MS }

  if (bucket.count >= CURRENT_CASE_CHALLENGE_RATE_LIMIT) {
    buckets.set(key, bucket)
    return {
      allowed: false,
      limit: CURRENT_CASE_CHALLENGE_RATE_LIMIT,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    }
  }

  bucket.count += 1
  buckets.set(key, bucket)
  return {
    allowed: true,
    limit: CURRENT_CASE_CHALLENGE_RATE_LIMIT,
    remaining: CURRENT_CASE_CHALLENGE_RATE_LIMIT - bucket.count,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  }
}

export function challengeRateLimitHeaders(result: RateLimitResult) {
  return {
    "Cache-Control": "no-store",
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    ...(result.allowed ? {} : { "Retry-After": String(result.retryAfterSeconds) }),
  }
}

function fingerprintRequest(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  const source = forwarded || request.headers.get("x-real-ip")?.trim() || "unavailable"
  return createHash("sha256")
    .update(processSalt)
    .update(source.slice(0, 128))
    .digest("base64url")
}

function pruneExpiredBuckets(now: number) {
  if (buckets.size < 1000) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}
