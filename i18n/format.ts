import type { Locale } from "@/i18n/routing"

function intlLocale(locale: Locale) {
  return locale === "zh-Hans" ? "zh-CN" : "en"
}

export function formatLocalizedDate(
  value: string | number,
  locale: Locale,
  dateStyle: "medium" | "long" = "long",
) {
  const date = typeof value === "number"
    ? new Date(value)
    : new Date(value.includes("T") ? value : `${value}T00:00:00Z`)

  if (!Number.isFinite(date.getTime())) return String(value)

  return new Intl.DateTimeFormat(intlLocale(locale), {
    dateStyle,
    timeZone: "UTC",
  }).format(date)
}
