import test from "node:test"
import assert from "node:assert/strict"
import { createTier1AggregateRateLimiter } from "@/lib/research/tier1-rate-limit"

const mutableProcessEnv = process.env as {
  VERCEL?: string
  NODE_ENV?: string
}

function request(ipHeader?: string, header = "x-vercel-forwarded-for") {
  return new Request("https://example.test/api/aggregate/result", {
    headers: ipHeader ? { [header]: ipHeader } : {},
  })
}

function testLimiter(options: {
  maxBuckets?: number
  now: () => number
}) {
  return createTier1AggregateRateLimiter({
    ...options,
    fingerprintIp: (ip) => ip,
    policies: {
      completion: {
        capacity: 3,
        refillIntervalMs: 500,
      },
      result: {
        capacity: 2,
        refillIntervalMs: 1_000,
      },
    },
  })
}

test("Tier 1 result buckets enforce burst and refill limits per IP", () => {
  let timestamp = 0
  const limiter = testLimiter({ now: () => timestamp })
  const firstIp = request("198.51.100.10")

  assert.equal(limiter.take(firstIp, "result"), true)
  assert.equal(limiter.take(firstIp, "result"), true)
  assert.equal(limiter.take(firstIp, "result"), false)
  assert.equal(limiter.take(request("198.51.100.11"), "result"), true)

  timestamp = 1_000
  assert.equal(limiter.take(firstIp, "result"), true)
})

test("completion and result traffic use independent token buckets", () => {
  const limiter = testLimiter({ maxBuckets: 1, now: () => 0 })
  const sameIp = request("2001:db8::1")

  assert.equal(limiter.take(sameIp, "result"), true)
  assert.equal(limiter.take(sameIp, "result"), true)
  assert.equal(limiter.take(sameIp, "result"), false)
  assert.equal(limiter.take(request("2001:db8::2"), "completion"), true)
})

test("trusted forwarding headers take priority and malformed IPs fail closed", () => {
  const limiter = testLimiter({ now: () => 0 })

  assert.equal(
    limiter.take(
      new Request("https://example.test", {
        headers: {
          "x-vercel-forwarded-for": "198.51.100.20",
          "x-forwarded-for": "198.51.100.21",
        },
      }),
      "result",
    ),
    true,
  )
  assert.equal(limiter.take(request("198.51.100.20"), "result"), true)
  assert.equal(limiter.take(request("198.51.100.20"), "result"), false)
  assert.equal(limiter.take(request("not-an-ip"), "result"), true)
  assert.equal(limiter.take(request(), "result"), true)
  assert.equal(limiter.take(request("also-not-an-ip"), "result"), false)
})

test("Vercel production uses its spoof-resistant client IP header", () => {
  const originalVercel = mutableProcessEnv.VERCEL
  const originalNodeEnv = mutableProcessEnv.NODE_ENV
  mutableProcessEnv.VERCEL = "1"
  mutableProcessEnv.NODE_ENV = "production"

  try {
    const limiter = testLimiter({ now: () => 0 })
    const firstIpWithSpoofedFallback = new Request("https://example.test", {
      headers: {
        "x-vercel-forwarded-for": "198.51.100.50",
        "x-forwarded-for": "198.51.100.51",
      },
    })

    assert.equal(limiter.take(firstIpWithSpoofedFallback, "result"), true)
    assert.equal(limiter.take(request("198.51.100.50"), "result"), true)
    assert.equal(limiter.take(request("198.51.100.50"), "result"), false)
    assert.equal(limiter.take(request("198.51.100.51"), "result"), true)
  } finally {
    if (originalVercel === undefined) {
      delete mutableProcessEnv.VERCEL
    } else {
      mutableProcessEnv.VERCEL = originalVercel
    }
    if (originalNodeEnv === undefined) {
      delete mutableProcessEnv.NODE_ENV
    } else {
      mutableProcessEnv.NODE_ENV = originalNodeEnv
    }
  }
})

test("non-Vercel production ignores caller-supplied forwarding headers", () => {
  const originalVercel = mutableProcessEnv.VERCEL
  const originalNodeEnv = mutableProcessEnv.NODE_ENV
  delete mutableProcessEnv.VERCEL
  mutableProcessEnv.NODE_ENV = "production"

  try {
    const limiter = testLimiter({ now: () => 0 })
    assert.equal(limiter.take(request("198.51.100.40"), "result"), true)
    assert.equal(limiter.take(request("198.51.100.41"), "result"), true)
    assert.equal(limiter.take(request("198.51.100.42"), "result"), false)
  } finally {
    if (originalVercel === undefined) {
      delete mutableProcessEnv.VERCEL
    } else {
      mutableProcessEnv.VERCEL = originalVercel
    }
    if (originalNodeEnv === undefined) {
      delete mutableProcessEnv.NODE_ENV
    } else {
      mutableProcessEnv.NODE_ENV = originalNodeEnv
    }
  }
})

test("bucket storage is bounded and fully refilled entries are pruned", () => {
  let timestamp = 0
  const limiter = testLimiter({
    maxBuckets: 1,
    now: () => timestamp,
  })

  assert.equal(limiter.take(request("198.51.100.30"), "result"), true)
  assert.equal(limiter.take(request("198.51.100.31"), "result"), false)

  timestamp = 30_000
  assert.equal(limiter.take(request("198.51.100.31"), "result"), true)
})
