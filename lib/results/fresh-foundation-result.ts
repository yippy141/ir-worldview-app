// One navigation hint in page memory. No storage, identifier or URL parameter.
let pending: string | null = null
export function markFreshFoundationResult(payload: string) { pending = payload }
export function consumeFreshFoundationResult(payload: string) {
  const fresh = pending === payload
  pending = null
  return fresh
}
