"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { siteConfig } from "@/lib/site-config"

type QuizChromeMeta = {
  title: string
  sectionLabel: string
  exitHref: string
  exitLabel: string
  steps: string[]
  activeStep: string
}

type PublicNavItem = {
  href: string
  label: string
  active: (pathname: string) => boolean
}

type MobileNavGroup = {
  label: string
  intro: string
  items: Array<{ href: string; label: string }>
}

const publicNavItems: PublicNavItem[] = [
  {
    href: "/quiz",
    label: "Foundation",
    active: (pathname) => pathname.startsWith("/results"),
  },
  {
    href: "/modules",
    label: "Focus Areas",
    active: (pathname) => pathname === "/modules" || pathname.startsWith("/modules/"),
  },
  {
    href: "/ai",
    label: "AI",
    active: (pathname) => pathname === "/ai" || pathname.startsWith("/ai/"),
  },
  {
    href: "/explore/atlas",
    label: "Atlas",
    active: (pathname) =>
      pathname === "/explore/atlas" || pathname.startsWith("/explore/atlas/"),
  },
]

const profileNavItem: PublicNavItem = {
  href: "/profile",
  label: "Profile",
  active: (pathname) =>
    pathname === "/profile" || pathname.startsWith("/profile/") || pathname.startsWith("/compare"),
}

const moreNavItems = [
  { href: "/explore", label: "Worldview Guide" },
  { href: "/method", label: "Methods" },
  { href: "/references", label: "References" },
  { href: "/feedback", label: "Feedback" },
] as const

const mobileNavGroups: MobileNavGroup[] = [
  {
    label: "Start here",
    intro: "Begin with the shared baseline, then return to Profile once you have a saved result.",
    items: [
      { href: "/quiz", label: "Foundation" },
      { href: "/profile", label: "Profile" },
    ],
  },
  {
    label: "Go deeper",
    intro: "Issue overlays, the AI companion, and Atlas all sit beside the Foundation rather than replacing it.",
    items: [
      { href: "/modules", label: "Focus Areas" },
      { href: "/ai", label: "AI" },
      { href: "/explore/atlas", label: "Atlas" },
    ],
  },
  {
    label: "More",
    intro: "Use the guide, methods, and references when you want context or want to challenge the model.",
    items: [
      { href: "/explore", label: "Worldview Guide" },
      { href: "/method", label: "Methods" },
      { href: "/references", label: "References" },
      { href: "/feedback", label: "Feedback" },
    ],
  },
]

const moduleTitles: Record<string, string> = {
  security: "Security & Strategy",
  technology: "Technology & Geoeconomics",
}

function matchesPath(pathname: string, href: string) {
  if (href === "/explore") {
    return pathname === "/explore" || (
      pathname.startsWith("/explore/") && !pathname.startsWith("/explore/atlas")
    )
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function getQuizChromeMeta(pathname: string | null): QuizChromeMeta | null {
  if (!pathname) return null

  if (pathname === "/quiz" || pathname === "/quiz/review") {
    return {
      title: "Foundation",
      sectionLabel: "IR Worldview Inventory",
      exitHref: "/",
      exitLabel: "Exit to home",
      steps: ["Quiz", "Review"],
      activeStep: pathname === "/quiz/review" ? "Review" : "Quiz",
    }
  }

  if (pathname === "/ai/quiz" || pathname === "/ai/review") {
    return {
      title: "AI Governance Compass",
      sectionLabel: "Companion module",
      exitHref: "/ai",
      exitLabel: "Exit to AI home",
      steps: ["Quiz", "Review"],
      activeStep: pathname === "/ai/review" ? "Review" : "Quiz",
    }
  }

  const moduleMatch = pathname.match(/^\/modules\/([^/]+)$/)
  if (moduleMatch) {
    const slug = moduleMatch[1]

    return {
      title: moduleTitles[slug] ?? "Focus-area module",
      sectionLabel: "Issue module",
      exitHref: "/modules",
      exitLabel: "Exit to modules",
      steps: ["Questions"],
      activeStep: "Questions",
    }
  }

  return null
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentPath = pathname ?? "/"
  const quizMeta = getQuizChromeMeta(pathname)
  const contactLinks = siteConfig.links.filter((link) => link.kind === "contact")
  const moreActive = moreNavItems.some((item) => matchesPath(currentPath, item.href))

  if (quizMeta) {
    return (
      <div className="site-shell site-shell--quiz">
        <header className="quiz-shell-header">
          <div className="wide-container">
            <div className="quiz-shell-inner">
              <div className="quiz-shell-branding">
                <Link href="/" className="quiz-shell-brand-link">
                  <span className="quiz-shell-brand">{siteConfig.publicTitle}</span>
                </Link>
                <div className="quiz-shell-context">
                  <p className="quiz-shell-label">{quizMeta.sectionLabel}</p>
                  <p className="quiz-shell-title">{quizMeta.title}</p>
                </div>
              </div>

              <div className="quiz-shell-actions">
                <div className="quiz-shell-steps" aria-label="Route progress">
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

        <main className="site-main page-space quiz-shell-main">{children}</main>
      </div>
    )
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="wide-container">
          <div className="header-inner">
            <Link href="/" className="site-brand-link">
              <p className="brand">{siteConfig.publicTitle}</p>
            </Link>

            <nav className="header-nav header-nav--desktop" aria-label="Primary">
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
                      {item.label}
                    </Link>
                  )
                })}
                <Link
                  href={profileNavItem.href}
                  className={`nav-link${profileNavItem.active(currentPath) ? " nav-link--active" : ""}`}
                  aria-current={profileNavItem.active(currentPath) ? "page" : undefined}
                >
                  {profileNavItem.label}
                </Link>
                <details className="nav-disclosure nav-disclosure--end">
                  <summary
                    className={`nav-disclosure-summary${moreActive ? " nav-disclosure-summary--active" : ""}`}
                  >
                    More
                  </summary>
                  <div className="nav-disclosure-menu nav-disclosure-menu--compact">
                    {moreNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="nav-disclosure-link nav-disclosure-link--compact"
                      >
                        <span className="nav-disclosure-link-title">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </details>
              </div>
            </nav>

            <details className="mobile-nav">
              <summary className="mobile-nav-summary">Menu</summary>
              <div className="mobile-nav-sheet mobile-nav-sheet--compact">
                {mobileNavGroups.map((group) => (
                  <div key={group.label} className="mobile-nav-group">
                    <p className="mobile-nav-label">{group.label}</p>
                    <p className="mobile-nav-group-text">{group.intro}</p>
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
                            {item.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      </header>

      <main className="site-main page-space">{children}</main>

      <footer className="site-footer">
        <div className="wide-container">
          <div className="footer-inner">
            <div className="footer-brand">
              <strong>{siteConfig.publicTitle}</strong>
              <span className="footer-sep">·</span>
              Beta
              <span className="footer-sep">·</span>
              {siteConfig.byline}
            </div>
            <div className="footer-links">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="footer-link"
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                >
                  {link.label}
                </a>
              ))}
              <Link href="/feedback" className="footer-link">
                Feedback
              </Link>
              <Link href="/method" className="footer-link">
                Methods
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
