import type { Locale } from "./routing"

export const approvedChinesePaths = [
  "/",
  "/about",
  "/method",
  "/privacy",
  "/feedback",
  "/profile",
  "/cases",
  "/quiz",
  "/explore/atlas",
  "/explore/reference",
] as const

export type ApprovedChinesePath = (typeof approvedChinesePaths)[number]

const approvedChineseDynamicPatterns = [
  /^\/results\/[^/]+$/,
  /^\/cases\/[^/]+(?:\/(?:sources|corrections))?$/,
  /^\/explore\/atlas\/[^/]+$/,
  /^\/explore\/reference\/[^/]+$/,
] as const

export const englishSitemapPaths = [
  ...approvedChinesePaths,
  "/ai",
  "/ai/atlas",
  "/ai/field-guide",
  "/explore",
  "/explore/atlas",
  "/explore/reference",
  "/futures",
  "/modules",
  "/perspectives",
  "/profile",
  "/quiz",
  "/references",
] as const

export function publicPath(locale: Locale, pathname: string): string {
  const normalized = normalizePathname(pathname)
  if (locale === "en") return normalized
  if (normalized === "/") return "/zh"
  return `/zh${normalized}`
}

export function buildLanguageSwitchHref(
  locale: Locale,
  pathname: string,
  search = "",
  hash = "",
) {
  const targetLocale: Locale = locale === "zh-Hans" ? "en" : "zh-Hans"
  const targetPathname = publicPath(targetLocale, internalPath(pathname))
  const normalizedSearch = search && !search.startsWith("?") ? `?${search}` : search
  const normalizedHash = hash && !hash.startsWith("#") ? `#${hash}` : hash

  return `${targetPathname}${normalizedSearch}${normalizedHash}`
}

export function internalPath(pathname: string): string {
  if (pathname === "/zh" || pathname === "/zh-Hans" || pathname === "/en") return "/"
  if (pathname.startsWith("/zh-Hans/")) return pathname.slice(8) || "/"
  if (pathname.startsWith("/zh/")) return pathname.slice(3) || "/"
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/"
  return normalizePathname(pathname)
}

export function isApprovedChinesePath(pathname: string): boolean {
  const normalized = internalPath(pathname)
  return (
    (approvedChinesePaths as readonly string[]).includes(normalized) ||
    approvedChineseDynamicPatterns.some((pattern) => pattern.test(normalized))
  )
}

export function isUnapprovedInstrumentPath(pathname: string): boolean {
  const normalized = internalPath(pathname)
  return ["/ai", "/modules", "/perspectives"].some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  )
}

export function localizedAlternates(pathname: string) {
  return {
    en: publicPath("en", pathname),
    "zh-Hans": publicPath("zh-Hans", pathname),
    "x-default": publicPath("en", pathname),
  }
}

export function resolveMetadataBase() {
  const configured = process.env.SITE_URL?.trim()
  const deploymentHost = process.env.VERCEL_URL?.trim()
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  const previewUrl =
    process.env.VERCEL_ENV === "preview" && deploymentHost
      ? `https://${deploymentHost}`
      : ""
  const candidate =
    previewUrl ||
    configured ||
    (productionHost ? `https://${productionHost}` : "")

  try {
    return new URL(candidate || "http://localhost:3000")
  } catch {
    return new URL("http://localhost:3000")
  }
}

export function absoluteUrl(pathname: string) {
  return new URL(pathname, resolveMetadataBase()).toString()
}

function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") return "/"
  return pathname.startsWith("/") ? pathname : `/${pathname}`
}
