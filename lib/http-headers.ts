export const privacyHeaders = [
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
] as const

export const mapReferrerHeader = {
  key: "Referrer-Policy",
  value: "strict-origin-when-cross-origin",
} as const

export const privateNoStoreHeader = "private, no-store, max-age=0"

export const sensitiveShareRoutes = [
  "/results/:path*",
  "/ai/results/:path*",
  "/modules/:slug/results/:path*",
  "/perspectives/:perspectiveId/result/:path*",
  "/profile/share/:path*",
  "/cases/:slug/challenge",
] as const

export const localizedSensitiveShareRoutes = sensitiveShareRoutes.flatMap((source) => [
  source,
  `/zh${source}`,
])

export function isSensitiveSharePath(pathname: string) {
  const normalized = pathname.replace(/^\/(?:zh-Hans|zh|en)(?=\/|$)/, "") || "/"

  return (
    normalized.startsWith("/results/") ||
    normalized.startsWith("/ai/results/") ||
    /^\/modules\/[^/]+\/results\//.test(normalized) ||
    /^\/perspectives\/[^/]+\/result\//.test(normalized) ||
    normalized.startsWith("/profile/share/") ||
    /^\/cases\/[^/]+\/challenge(?:\/|$)/.test(normalized)
  )
}
