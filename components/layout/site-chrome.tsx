"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NavAutoClose } from "@/components/layout/nav-auto-close"
import { Link } from "@/i18n/navigation"
import { internalPath } from "@/i18n/paths"
import { getBetaNavigationItem } from "@/lib/beta-config"
import { getQuizChromeMeta } from "@/lib/quiz-chrome"
import { destinations, destinationLabel, navigationItem, navigationSections, type DestinationId } from "@/lib/navigation"
import { NavigationDirectory } from "@/components/layout/navigation-directory"
import {
  immersiveRouteOwnsLanguageControl,
  isImmersiveRoute,
} from "@/lib/site-shell"

type PublicNavItem = {
  href: string
  labelKey: string
  active: (pathname: string) => boolean
}

const publicNavItems: PublicNavItem[] = [
  {
    ...navigationItem("cases"),
    active: (pathname) => pathname === "/current" || pathname.startsWith("/cases"),
  },
  {
    ...navigationItem("foundation"),
    active: (pathname) =>
      pathname === "/quiz" || pathname === "/quiz/review" || pathname.startsWith("/results"),
  },
  {
    ...navigationItem("modules"),
    active: (pathname) => pathname === "/modules" || pathname.startsWith("/modules/"),
  },
  {
    ...navigationItem("ai"),
    active: (pathname) => pathname === "/ai" || pathname.startsWith("/ai/"),
  },
  {
    ...navigationItem("profile"),
    active: (pathname) =>
      pathname === "/profile" || pathname.startsWith("/profile/") || pathname.startsWith("/compare"),
  },
]

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
  const sectionHome = ([...navigationSections.flatMap(section => [...section.children]), "modules"] as DestinationId[]).find(id => destinations[id].href === currentPath)
  const quizMeta = getQuizChromeMeta(currentPath, locale)
  const betaNavigationItem = getBetaNavigationItem(betaNavigationEnabled)
  const betaLink = betaNavigationItem ? { href: betaNavigationItem.href, label: t(betaNavigationItem.labelKey) } : null

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
            <Link href="/#menu" className="site-brand-link">
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
                    className="nav-disclosure-summary"
                  >
                    {t("menu")}
                  </summary>
                  <div className="nav-disclosure-menu nav-disclosure-menu--directory"><NavigationDirectory betaLink={betaLink} /></div>
                </details>
                <LanguageSwitcher />
              </div>
            </nav>

            <details className="mobile-nav">
              <summary className="mobile-nav-summary">{t("menu")}</summary>
              <div className="mobile-nav-sheet mobile-nav-sheet--directory"><NavigationDirectory betaLink={betaLink} /></div>
            </details>
          </div>
        </div>
      </header>

      <main id="site-main" className="site-main page-space">
        {sectionHome && <nav className="section-location wide-container" aria-label={locale === "zh-Hans" ? "当前位置" : "Current location"}>
          <Link href={destinations.menu.href}>{destinationLabel("menu", locale)}</Link><span aria-hidden="true">/</span><span aria-current="page">{destinationLabel(sectionHome, locale)}</span>
        </nav>}
        {children}
      </main>

      <footer className="site-footer">
        <div className="wide-container">
          <div className="footer-inner">
            <div className="footer-brand">
              <strong>{t("brand")}</strong>
              <span className="footer-sep">·</span>
              {t("byline")}
            </div>
            <div className="footer-links">
              <Link href="/about" prefetch={false} className="footer-link">
                {t("nav.about")}
              </Link>
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
