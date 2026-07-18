import type { Metadata } from "next"
import type { Locale } from "@/i18n/routing"
import {
  localizedAlternates,
  publicPath,
  type ApprovedChinesePath,
} from "@/i18n/paths"
import type { LocalePageMetadata } from "@/content/locales/types"

export function createLocalizedMetadata(
  locale: Locale,
  pathname: ApprovedChinesePath,
  content: LocalePageMetadata,
): Metadata {
  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: publicPath(locale, pathname),
      languages: localizedAlternates(pathname),
    },
  }
}

export function createEnglishApprovedMetadata(
  pathname: ApprovedChinesePath,
  content: LocalePageMetadata,
): Metadata {
  return createLocalizedMetadata("en", pathname, content)
}

export function createUnavailableChineseMetadata(pathname: string): Metadata {
  return {
    title: "中文内容状态｜国际关系世界观清单",
    description: "此页面的简体中文内容尚未完成编辑审校。",
    robots: { index: false, follow: true },
    alternates: {
      canonical: publicPath("en", pathname),
      languages: {
        en: publicPath("en", pathname),
        "x-default": publicPath("en", pathname),
      },
    },
  }
}
