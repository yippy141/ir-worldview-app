import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import {
  localizedSensitiveShareRoutes,
  mapReferrerHeader,
  privacyHeaders,
  privateNoStoreHeader,
  resultIndexingHeader,
} from "./lib/http-headers"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

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
      // Vercel matches the public prefix while local Next starts may match the
      // internal locale key after next-intl rewrites it. Cover both forms.
      ...["/world-stage", "/zh/world-stage", "/zh-Hans/world-stage"].map((source) => ({
        source,
        headers: [mapReferrerHeader],
      })),
      { source: "/api/card", headers: [resultIndexingHeader] },
      ...localizedSensitiveShareRoutes.map((source) => ({
        source,
        headers: [
          resultIndexingHeader,
          { key: "Cache-Control", value: privateNoStoreHeader },
        ],
      })),
    ]
  },
}

export default withNextIntl(nextConfig)
