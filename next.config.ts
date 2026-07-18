import type { NextConfig } from "next"

const privacyHeaders = [
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
] as const

const sensitiveShareRoutes = [
  "/results/:path*",
  "/ai/results/:path*",
  "/modules/:slug/results/:path*",
  "/perspectives/:perspectiveId/result/:path*",
  "/profile/share/:path*",
  "/cases/:slug/challenge",
] as const

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...privacyHeaders],
      },
      ...sensitiveShareRoutes.map((source) => ({
        source,
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
        ],
      })),
    ]
  },
}

export default nextConfig
