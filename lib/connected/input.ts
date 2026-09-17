import { resolveProfileSharePayload } from "@/lib/profile-share"
import { evidenceFromProfile, evidenceFromToken, withDeclaredExposure, type EvidenceBundle, type Exposure } from "@/lib/connected/evidence"

export const MAX_COMPARISON_INPUT = 50_000
// Explicit approved origins. Pasted URLs are parsed, never fetched.
const APPROVED_ORIGINS = new Set(["https://irworldview.jhyip.com", "https://www.irworldview.jhyip.com"])
export type ComparisonInput = { ok: true; evidence: EvidenceBundle } | { ok: false; error: string }
export function parseComparisonInput(raw: string, currentOrigin?: string, exposure?: Exposure): ComparisonInput {
  const fail = { ok: false as const, error: "Use a valid result or shared Profile link from this app (up to 50,000 characters)." }
  if (!raw.trim() || raw.length > MAX_COMPARISON_INPUT) return fail
  let token = raw.trim()
  let kind: "foundation" | "ai" | "security" | "technology" | "profile" | undefined
  if (!/^[A-Za-z0-9_-]+$/.test(token)) {
    try {
      const url = new URL(token, currentOrigin ?? "https://irworldview.jhyip.com")
      if (url.username || url.password || (!APPROVED_ORIGINS.has(url.origin) && url.origin !== currentOrigin)) return fail
      if (!/^https?:$/.test(url.protocol) || url.hash) return fail
      const match = url.pathname.match(/^\/(?:(?:zh|zh-Hans)\/)?(?:(profile\/share)|(ai\/results)|(modules\/(security|technology)\/results)|(results))\/([A-Za-z0-9_-]+)\/?$/)
      if (!match || [...url.searchParams.keys()].some(k => k !== "foundation")) return fail
      kind = match[1] ? "profile" : match[2] ? "ai" : match[4] ? match[4] as "security" | "technology" : "foundation"
      token = match[6]
    } catch { return fail }
  }
  if (!kind || kind === "profile") {
    const shared = resolveProfileSharePayload(token)
    if (shared) return { ok: true, evidence: withDeclaredExposure(evidenceFromProfile(shared.profile, "supplied"), exposure) }
    if (kind) return fail
  }
  for (const domain of kind ? [kind] : ["foundation", "ai", "security", "technology"] as const) {
    const result = evidenceFromToken(domain, token, exposure)
    if (result) return { ok: true, evidence: { [domain]: result } }
  }
  return fail
}
