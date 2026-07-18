import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import {
  localizedSensitiveShareRoutes,
  privacyHeaders,
  privateNoStoreHeader,
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
      ...localizedSensitiveShareRoutes.map((source) => ({
        source,
        headers: [
          { key: "Cache-Control", value: privateNoStoreHeader },
        ],
      })),
    ]
  },
}

export default withNextIntl(nextConfig)
