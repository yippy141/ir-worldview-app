import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "zh-Hans"],
  defaultLocale: "en",
  localePrefix: {
    mode: "as-needed",
    prefixes: {
      "zh-Hans": "/zh",
    },
  },
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false,
})

export type Locale = (typeof routing.locales)[number]

export const locales = routing.locales

export function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value)
}
