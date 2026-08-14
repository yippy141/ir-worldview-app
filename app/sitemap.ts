import type { MetadataRoute } from "next"
import {
  absoluteUrl,
  englishSitemapPaths,
  isApprovedChinesePath,
  localizedAlternates,
  publicPath,
} from "@/i18n/paths"
import { getAtlasLitePatterns } from "@/lib/atlas-lite"
import { archetypes, getArchetypePath } from "@/lib/archetypes"
import { getPublishedCurrentCases } from "@/lib/current-cases/catalog"
import { getVisibleReferenceEntities } from "@/lib/field/items"
import { familySlug, MODELED_FAMILY_KEYS } from "@/lib/worldview-config"

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...englishSitemapPaths,
    "/archetypes",
    ...archetypes.map(({ code }) => getArchetypePath(code)),
    ...MODELED_FAMILY_KEYS.map((familyKey) => `/explore/${familySlug(familyKey)}`),
    ...getPublishedCurrentCases().flatMap((record) => [
      `/cases/${record.slug}`,
      `/cases/${record.slug}/sources`,
      `/cases/${record.slug}/corrections`,
    ]),
    ...getAtlasLitePatterns().map((pattern) => `/explore/atlas/${pattern.id}`),
    ...getVisibleReferenceEntities().map((entity) => `/explore/reference/${entity.id}`),
  ]

  return [...new Set(paths)].flatMap((pathname) => {
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
