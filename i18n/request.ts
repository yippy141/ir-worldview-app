import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { routing } from "@/i18n/routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale
  const messages = locale === "zh-Hans"
    ? (await import("@/messages/zh-Hans.json")).default
    : (await import("@/messages/en.json")).default

  return { locale, messages }
})
