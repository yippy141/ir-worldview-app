"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NavAutoClose } from "@/components/layout/nav-auto-close"
import { Link } from "@/i18n/navigation"
import { internalPath } from "@/i18n/paths"
import { trackProductEvent } from "@/lib/analytics/adapter"
import { getBetaNavigationItem } from "@/lib/beta-config"
import { getQuizChromeMeta } from "@/lib/quiz-chrome"
import { siteConfig } from "@/lib/site-config"
import {
  immersiveRouteOwnsLanguageControl,
  isImmersiveRoute,
} from "@/lib/site-shell"

type PublicNavItem = {
  href: string
  labelKey: string
  active: (pathname: string) => boolean
}

type MobileNavGroup = {
  labelKey: string
  introKey: string
  items: Array<{ href: string; labelKey: string }>
}

const publicNavItems: PublicNavItem[] = [
  {
    href: "/cases",
    labelKey: "nav.currentCase",
    active: (pathname) => pathname === "/current" || pathname.startsWith("/cases"),
  },
  {
    href: "/quiz",
    labelKey: "nav.foundation",
    active: (pathname) =>
      pathname === "/quiz" || pathname === "/quiz/review" || pathname.startsWith("/results"),
  },
  {
    href: "/modules",
    labelKey: "nav.focusAreas",
    active: (pathname) => pathname === "/modules" || pathname.startsWith("/modules/"),
  },
  {
    href: "/ai",
    labelKey: "nav.ai",
    active: (pathname) => pathname === "/ai" || pathname.startsWith("/ai/"),
  },
  {
    href: "/profile",
    labelKey: "nav.profile",
    active: (pathname) =>
      pathname === "/profile" || pathname.startsWith("/profile/") || pathname.startsWith("/compare"),
  },
]

const moreNavItems = [
  { href: "/perspectives", labelKey: "nav.perspectives" },
  { href: "/explore/atlas", labelKey: "nav.worldviewMap" },
  { href: "/explore", labelKey: "nav.explore" },
  { href: "/futures", labelKey: "nav.futures" },
  { href: "/method", labelKey: "nav.methods" },
  { href: "/privacy", labelKey: "nav.privacy" },
  { href: "/references", labelKey: "nav.references" },
  { href: "/feedback", labelKey: "nav.feedback" },
] as const

const mobileNavGroups: MobileNavGroup[] = [
  {
    labelKey: "productPath",
    introKey: "productIntro",
    items: [
      { href: "/cases", labelKey: "nav.currentCase" },
      { href: "/quiz", labelKey: "nav.foundation" },
      { href: "/modules", labelKey: "nav.focusAreas" },
      { href: "/ai", labelKey: "nav.ai" },
      { href: "/perspectives", labelKey: "nav.perspectives" },
      { href: "/profile", labelKey: "nav.profile" },
    ],
  },
  {
    labelKey: "browseContext",
    introKey: "browseIntro",
    items: [
      { href: "/explore/atlas", labelKey: "nav.worldviewMap" },
      { href: "/explore/reference", labelKey: "nav.publicPositions" },
      { href: "/explore", labelKey: "nav.explore" },
      { href: "/futures", labelKey: "nav.futures" },
      { href: "/method", labelKey: "nav.methods" },
      { href: "/privacy", labelKey: "nav.privacy" },
      { href: "/references", labelKey: "nav.references" },
      { href: "/feedback", labelKey: "nav.feedback" },
    ],
  },
]

function matchesPath(pathname: string, href: string) {
  if (href === "/explore") {
    return pathname === "/explore" || (
      pathname.startsWith("/explore/") &&
      !pathname.startsWith("/explore/atlas") &&
      !pathname.startsWith("/explore/reference")
    )
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteChrome({
  children,
  betaNavigationEnabled,
}: {
  children: React.ReactNode
  betaNavigationEnabled: boolean
}) {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations("chrome")
  const currentPath = internalPath(pathname ?? "/")
  const quizMeta = getQuizChromeMeta(currentPath, locale)
  const contactLinks = siteConfig.links.filter((link) => link.kind === "contact")
  const betaNavigationItem = getBetaNavigationItem(betaNavigationEnabled)
  const visibleMoreNavItems = betaNavigationItem
    ? [...moreNavItems, betaNavigationItem]
    : moreNavItems
  const visibleMobileNavGroups = betaNavigationItem
    ? mobileNavGroups.map((group, index) => (
        index === 1
          ? { ...group, items: [...group.items, betaNavigationItem] }
          : group
      ))
    : mobileNavGroups
  const moreActive = visibleMoreNavItems.some((item) =>
    matchesPath(currentPath, item.href),
  )

  if (isImmersiveRoute(currentPath)) {
    return (
      <div className="site-shell">
        <a href="#site-main" className="skip-link">{t("skip")}</a>
        {immersiveRouteOwnsLanguageControl(currentPath) ? null : (
          <div className="immersive-language-switcher">
            <LanguageSwitcher />
          </div>
        )}
        {children}
      </div>
    )
  }

  if (quizMeta) {
    const perspectiveRunChrome = quizMeta.steps.length === 0
    return (
      <div
        className={`site-shell site-shell--quiz${
          perspectiveRunChrome ? " site-shell--perspective-run" : ""
        }`}
      >
        <a href="#site-main" className="skip-link">{t("skip")}</a>
        <header className="quiz-shell-header">
          <div className="wide-container">
            <div className="quiz-shell-inner">
              <Link href="/" className="quiz-shell-brand-link">
                <span className="quiz-shell-brand">{t("brand")}</span>
              </Link>

              <div className="quiz-shell-heading">
                <p className="quiz-shell-label">{quizMeta.sectionLabel}</p>
                <p className="quiz-shell-title">{quizMeta.title}</p>
              </div>

              <div className="quiz-shell-actions">
                <div className="quiz-shell-steps" aria-label={quizMeta.progressLabel}>
                  {quizMeta.steps.map((step) => (
                    <span
                      key={step}
                      className={`quiz-shell-step${step === quizMeta.activeStep ? " quiz-shell-step--active" : ""}`}
                    >
                      {step}
                    </span>
                  ))}
                </div>
                <Link href={quizMeta.exitHref} className="quiz-shell-exit">
                  {quizMeta.exitLabel}
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main id="site-main" className="site-main page-space quiz-shell-main">{children}</main>
      </div>
    )
  }

  return (
    <div className="site-shell">
      <a href="#site-main" className="skip-link">{t("skip")}</a>
      <NavAutoClose />
      <header className="site-header">
        <div className="wide-container">
          <div className="header-inner">
            <Link href="/" className="site-brand-link">
              <p className="brand">{t("brand")}</p>
            </Link>

            <nav className="header-nav header-nav--desktop" aria-label={t("primary")}>
              <div className="header-nav-row">
                {publicNavItems.map((item) => {
                  const active = item.active(currentPath)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`nav-link${active ? " nav-link--active" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      {t(item.labelKey)}
                    </Link>
                  )
                })}
                <details className="nav-disclosure nav-disclosure--end">
                  <summary
                    className={`nav-disclosure-summary${moreActive ? " nav-disclosure-summary--active" : ""}`}
                  >
                    {t("more")}
                  </summary>
                  <div className="nav-disclosure-menu nav-disclosure-menu--compact">
                    {visibleMoreNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="nav-disclosure-link nav-disclosure-link--compact"
                      >
                        <span className="nav-disclosure-link-title">{t(item.labelKey)}</span>
                      </Link>
                    ))}
                  </div>
                </details>
                <LanguageSwitcher />
              </div>
            </nav>

            <details className="mobile-nav">
              <summary className="mobile-nav-summary">{t("menu")}</summary>
              <div className="mobile-nav-sheet mobile-nav-sheet--compact">
                {visibleMobileNavGroups.map((group) => (
                  <div key={group.labelKey} className="mobile-nav-group">
                    <p className="mobile-nav-label">{t(group.labelKey)}</p>
                    <p className="mobile-nav-group-text">{t(group.introKey)}</p>
                    <div className="mobile-nav-list">
                      {group.items.map((item) => {
                        const active = matchesPath(currentPath, item.href)

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`mobile-nav-list-link${active ? " mobile-nav-list-link--active" : ""}`}
                            aria-current={active ? "page" : undefined}
                          >
                            {t(item.labelKey)}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
                <div className="mobile-nav-language">
                  <LanguageSwitcher />
                </div>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main id="site-main" className="site-main page-space">{children}</main>

      <footer className="site-footer">
        <div className="wide-container">
          <div className="footer-inner">
            <div className="footer-brand">
              <strong>{t("brand")}</strong>
              <span className="footer-sep">·</span>
              {t("byline")}
            </div>
            <div className="footer-links">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="footer-link"
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  onClick={() => {
                    if (link.label === "Substack") trackProductEvent("newsletter_clicked")
                  }}
                >
                  {link.label}
                </a>
              ))}
              <Link href="/feedback" className="footer-link">
                {t("nav.feedback")}
              </Link>
              <Link href="/method" className="footer-link">
                {t("nav.methods")}
              </Link>
              <Link href="/privacy" className="footer-link">
                {t("nav.privacy")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
