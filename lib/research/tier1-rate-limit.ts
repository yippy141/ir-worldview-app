import { createHmac, randomBytes } from "node:crypto"
import { isIP } from "node:net"

export type Tier1AggregateWriteKind = "completion" | "result"

type RateLimitPolicy = {
  capacity: number
  refillIntervalMs: number
}

type Bucket = {
  tokens: number
  updatedAt: number
}

type BucketState = {
  buckets: Map<string, Bucket>
  lastPrunedAt: number
}

type RateLimiterOptions = {
  fingerprintIp?: (ip: string) => string
  maxBuckets?: number
  now?: () => number
  policies?: Record<Tier1AggregateWriteKind, RateLimitPolicy>
  pruneIntervalMs?: number
}

const DEFAULT_MAX_BUCKETS = 4_096
const DEFAULT_PRUNE_INTERVAL_MS = 30_000
const DEFAULT_POLICIES: Record<Tier1AggregateWriteKind, RateLimitPolicy> = {
  // A full Foundation run can submit 68 completion steps. Leave headroom for
  // reloads and shared networks without making unbounded writes possible.
  completion: {
    capacity: 80,
    refillIntervalMs: 30_000,
  },
  result: {
    capacity: 5,
    refillIntervalMs: 60 * 60 * 1_000,
  },
}

export function createTier1AggregateRateLimiter(
  options: RateLimiterOptions = {},
) {
  const now = options.now ?? Date.now
  const maxBuckets = options.maxBuckets ?? DEFAULT_MAX_BUCKETS
  const policies = options.policies ?? DEFAULT_POLICIES
  const pruneIntervalMs =
    options.pruneIntervalMs ?? DEFAULT_PRUNE_INTERVAL_MS
  const secret = randomBytes(32)
  const fingerprintIp =
    options.fingerprintIp ??
    ((ip: string) =>
      createHmac("sha256", secret).update(ip).digest("base64url"))
  const states: Record<Tier1AggregateWriteKind, BucketState> = {
    completion: {
      buckets: new Map(),
      lastPrunedAt: Number.NEGATIVE_INFINITY,
    },
    result: {
      buckets: new Map(),
      lastPrunedAt: Number.NEGATIVE_INFINITY,
    },
  }

  return {
    take(request: Request, kind: Tier1AggregateWriteKind): boolean {
      const policy = policies[kind]
      const timestamp = now()
      const ip = clientIp(request.headers)
      const state = states[kind]
      const buckets = state.buckets
      const key = fingerprintIp(ip)
      let bucket = buckets.get(key)

      if (!bucket) {
        if (
          buckets.size >= maxBuckets &&
          timestamp - state.lastPrunedAt >= pruneIntervalMs
        ) {
          pruneRefilledBuckets(buckets, policy, timestamp)
          state.lastPrunedAt = timestamp
        }
        if (buckets.size >= maxBuckets) return false

        bucket = {
          tokens: policy.capacity,
          updatedAt: timestamp,
        }
        buckets.set(key, bucket)
      }

      bucket.tokens = refilledTokens(bucket, policy, timestamp)
      bucket.updatedAt = timestamp
      if (bucket.tokens < 1) return false

      bucket.tokens -= 1
      return true
    },
  }
}

const aggregateWriteRateLimiter = createTier1AggregateRateLimiter()

export function takeTier1AggregateWriteToken(
  request: Request,
  kind: Tier1AggregateWriteKind,
): boolean {
  return aggregateWriteRateLimiter.take(request, kind)
}

function clientIp(headers: Headers): string {
  if (process.env.VERCEL === "1") {
    // Vercel supplies and overwrites this provider-specific client IP header.
    return (
      normalizedIp(headers.get("x-vercel-forwarded-for")) ?? "unknown"
    )
  }

  // Outside local development, fail closed unless a trusted proxy boundary is
  // added explicitly for that deployment.
  if (process.env.NODE_ENV === "production") {
    return "unknown"
  }

  for (const header of [
    "x-vercel-forwarded-for",
    "x-forwarded-for",
    "x-real-ip",
  ]) {
    const value = headers.get(header)?.split(",", 1)[0] ?? null
    const fallbackIp = normalizedIp(value)
    if (fallbackIp) return fallbackIp
  }

  // Missing or malformed addresses share a deliberately fail-closed bucket.
  return "unknown"
}

function normalizedIp(value: string | null): string | null {
  const normalized = value?.trim() ?? ""
  return isIP(normalized) ? normalized : null
}

function refilledTokens(
  bucket: Bucket,
  policy: RateLimitPolicy,
  timestamp: number,
): number {
  const elapsed = Math.max(0, timestamp - bucket.updatedAt)
  return Math.min(
    policy.capacity,
    bucket.tokens + elapsed / policy.refillIntervalMs,
  )
}

function pruneRefilledBuckets(
  buckets: Map<string, Bucket>,
  policy: RateLimitPolicy,
  timestamp: number,
) {
  for (const [key, bucket] of buckets) {
    if (refilledTokens(bucket, policy, timestamp) >= policy.capacity) {
      buckets.delete(key)
    }
  }
}
