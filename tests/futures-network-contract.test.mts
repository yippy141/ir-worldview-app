import test from "node:test"
import assert from "node:assert/strict"
import { isAllowedFooterPrefetch, type ObservedRequest } from "@/tests/fixtures/futures-network-contract"

test("only the three exact footer requests are allowed, independently of configured port", () => {
  for (const port of [3000, 3110]) {
    const origin = `http://127.0.0.1:${port}`
    for (const path of ["/privacy", "/method", "/feedback"]) {
      const request: ObservedRequest = { url: `${origin}${path}?_rsc=Ab_1-x`, method: "GET", body: null }
      assert.ok(isAllowedFooterPrefetch(request, origin))
      const invalid: ObservedRequest[] = [
        { ...request, url: `https://foreign.example${path}?_rsc=Ab_1-x` },
        { ...request, url: `http://127.0.0.1:${port + 1}${path}?_rsc=Ab_1-x` },
        { ...request, url: `${request.url}&humanAuthority=present` },
        { ...request, url: `${request.url}&_rsc=duplicate` },
        { ...request, url: `${origin}/api/research/submit?_rsc=Ab_1-x` },
        { ...request, url: `${origin}${path}` },
        { ...request, url: `${origin}${path}?_rsc=` },
        { ...request, body: '{"answer":"present"}' },
        { ...request, method: "POST" },
      ]
      for (const rejected of invalid) assert.equal(isAllowedFooterPrefetch(rejected, origin), false, JSON.stringify(rejected))
    }
  }
})
