import type { MetadataRoute } from "next"
import {
  absoluteUrl,
  englishSitemapPaths,
  isApprovedChinesePath,
  localizedAlternates,
  publicPath,
} from "@/i18n/paths"

export default function sitemap(): MetadataRoute.Sitemap {
  return englishSitemapPaths.flatMap((pathname) => {
    if (!isApprovedChinesePath(pathname)) {
      return [{ url: absoluteUrl(publicPath("en", pathname)) }]
    }

    const languages = Object.fromEntries(
      Object.entries(localizedAlternates(pathname)).map(([locale, path]) => [
        locale,
        absoluteUrl(path),
      ]),
    )

    return (["en", "zh-Hans"] as const).map((locale) => ({
      url: absoluteUrl(publicPath(locale, pathname)),
      alternates: { languages },
    }))
  })
}
