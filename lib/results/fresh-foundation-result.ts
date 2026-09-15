// One navigation hint in page memory. No storage, identifier or URL parameter.
export type ResultDomain = "foundation" | "ai" | "security" | "technology"
let pending: { domain: ResultDomain; payload: string } | null = null
export function markFreshResult(domain: ResultDomain, payload: string) { pending = { domain, payload } }
export function consumeFreshResult(domain: ResultDomain, payload: string) {
  const fresh = pending?.domain === domain && pending.payload === payload
  pending = null
  return fresh
}
export function markFreshFoundationResult(payload: string) { markFreshResult("foundation", payload) }
export function consumeFreshFoundationResult(payload: string) { return consumeFreshResult("foundation", payload) }
