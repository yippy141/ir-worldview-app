import test from "node:test"
import assert from "node:assert/strict"
import sitemap from "@/app/sitemap"
import {
  approvedChinesePaths,
  buildLanguageSwitchHref,
  internalPath,
  localizedAlternates,
  publicPath,
} from "@/i18n/paths"
import { routing } from "@/i18n/routing"
import {
  isSensitiveSharePath,
  localizedSensitiveShareRoutes,
  privateNoStoreHeader,
} from "@/lib/http-headers"

test("routing keeps English unprefixed and maps zh-Hans to the public /zh prefix", () => {
  assert.deepEqual(routing.locales, ["en", "zh-Hans"])
  assert.equal(routing.defaultLocale, "en")
  assert.deepEqual(routing.localePrefix, {
    mode: "as-needed",
    prefixes: { "zh-Hans": "/zh" },
  })
  assert.equal(routing.localeDetection, false)
  assert.equal(routing.localeCookie, false)

  assert.equal(publicPath("en", "/about"), "/about")
  assert.equal(publicPath("zh-Hans", "/about"), "/zh/about")
})

test("locale path helpers preserve slugs and opaque encoded payload segments", () => {
  const payloadPath = "/modules/security/results/v2_A-b.9%2Fopaque"

  assert.equal(publicPath("zh-Hans", payloadPath), `/zh${payloadPath}`)
  assert.equal(internalPath(`/zh${payloadPath}`), payloadPath)
  assert.equal(internalPath(`/zh-Hans${payloadPath}`), payloadPath)
  assert.equal(internalPath(`/en${payloadPath}`), payloadPath)
  assert.equal(internalPath("/current"), "/current")
})

test("language switching preserves pathname, query string, and hash fragment", () => {
  assert.equal(
    buildLanguageSwitchHref(
      "en",
      "/results/v2_A-b.9",
      "?foundation=f_123&source=share",
      "#reading-path",
    ),
    "/zh/results/v2_A-b.9?foundation=f_123&source=share#reading-path",
  )
  assert.equal(
    buildLanguageSwitchHref(
      "zh-Hans",
      "/zh/results/v2_A-b.9",
      "foundation=f_123&source=share",
      "reading-path",
    ),
    "/results/v2_A-b.9?foundation=f_123&source=share#reading-path",
  )
})

test("the approved Chinese Foundation route receives reciprocal language alternates", () => {
  assert.deepEqual(approvedChinesePaths, [
    "/",
    "/about",
    "/method",
    "/privacy",
    "/feedback",
    "/beta",
    "/profile",
    "/cases",
    "/quiz",
    "/explore/atlas",
    "/explore/reference",
  ])
  assert.deepEqual(localizedAlternates("/method"), {
    en: "/method",
    "zh-Hans": "/zh/method",
    "x-default": "/method",
  })

  const entries = sitemap()
  const aboutEntries = entries.filter((entry) => new URL(entry.url).pathname.endsWith("/about"))
  const quizEntries = entries.filter((entry) => new URL(entry.url).pathname.endsWith("/quiz"))
  const atlasDetailEntries = entries.filter((entry) =>
    new URL(entry.url).pathname.endsWith("/explore/atlas/institution-builder"),
  )
  const caseSourceEntries = entries.filter((entry) =>
    new URL(entry.url).pathname.includes("/cases/") &&
      new URL(entry.url).pathname.endsWith("/sources"),
  )

  assert.equal(aboutEntries.length, 2)
  assert.ok(aboutEntries.every((entry) => entry.alternates?.languages?.["zh-Hans"]))
  assert.equal(quizEntries.length, 2)
  assert.ok(quizEntries.every((entry) => entry.alternates?.languages?.["zh-Hans"]))
  assert.equal(atlasDetailEntries.length, 2)
  assert.ok(atlasDetailEntries.every((entry) => entry.alternates?.languages?.["zh-Hans"]))
  assert.ok(caseSourceEntries.length >= 2)
  assert.ok(caseSourceEntries.every((entry) => entry.alternates?.languages?.["zh-Hans"]))
})

test("private share routing covers matching English and Chinese payload paths", () => {
  const payloadPaths = [
    "/results/foundation_payload",
    "/ai/results/ai_payload",
    "/modules/security/results/module_payload",
    "/perspectives/exposed-ally/result/run_payload",
    "/profile/share/profile_payload",
    "/cases/example/challenge",
  ]

  for (const pathname of payloadPaths) {
    assert.equal(isSensitiveSharePath(pathname), true, pathname)
    assert.equal(isSensitiveSharePath(`/zh${pathname}`), true, `/zh${pathname}`)
  }

  assert.equal(privateNoStoreHeader, "private, no-store, max-age=0")
  assert.equal(localizedSensitiveShareRoutes.length, 12)
  assert.ok(localizedSensitiveShareRoutes.includes("/zh/results/:path*"))
})
