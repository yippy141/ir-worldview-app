import { track } from "@vercel/analytics/server"
import { createAnalyticsAdapter } from "@/lib/analytics/adapter"

const providerConfigured = Boolean(
  process.env.VERCEL_WEB_ANALYTICS_ENDPOINT || process.env.VERCEL_URL,
)

export const productAnalytics = createAnalyticsAdapter(
  providerConfigured
    ? async ({ name, properties }) => {
        await track(name, properties, {
          headers: {
            // Product context is already reduced to the adapter allowlist. Do not
            // forward request IP, cookie, user-agent, or referrer headers.
            "user-agent": "",
            "x-forwarded-for": "",
            cookie: "",
            referer: "",
          },
        })
      }
    : undefined,
)
