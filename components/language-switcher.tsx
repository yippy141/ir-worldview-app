"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import {
  buildLanguageSwitchHref,
  internalPath,
  publicPath,
} from "@/i18n/paths"
import type { Locale } from "@/i18n/routing"

type LanguageSwitcherProps = {
  className?: string
  label?: "label" | "englishPage"
}

export function LanguageSwitcher({
  className = "",
  label = "label",
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale
  const pathname = usePathname() || "/"
  const t = useTranslations("language")
  const targetLocale: Locale = locale === "zh-Hans" ? "en" : "zh-Hans"
  const targetPathname = publicPath(targetLocale, internalPath(pathname))

  return (
    <a
      href={targetPathname}
      hrefLang={targetLocale}
      aria-label={t("aria")}
      className={`language-switcher ${className}`.trim()}
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return
        }

        event.preventDefault()
        window.location.assign(
          buildLanguageSwitchHref(
            locale,
            window.location.pathname,
            window.location.search,
            window.location.hash,
          ),
        )
      }}
    >
      {t(label)}
    </a>
  )
}
