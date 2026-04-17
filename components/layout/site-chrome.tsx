"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { siteConfig } from "@/lib/site-config"
import { NavAutoClose } from "@/components/layout/nav-auto-close"

type NavItem = { href: string; label: string; description: string }

type NavSection = {
  key: string
  label: string
  mobileLabel?: string
  menuEnd?: boolean
  items: NavItem[]
}

type QuizChromeMeta = {
  title: string
  sectionLabel: string
  exitHref: string
  exitLabel: string
  steps: string[]
  activeStep: string
}

const navSections: NavSection[] = [
  {
    key: "foundation",
    label: "IR Foundation",
    mobileLabel: "IR Foundation",
    items: [
      {
        href: "/quiz",
        label: "Take the Foundation Quiz",
        description: "Start here. Maps your views on power, institutions, and world order.",
      },
      {
        href: "/method",
        label: "Methods",
        description: "How the model, labels, and scoring work.",
      },
      {
        href: "/references",
        label: "References",
        description: "Source shelf behind the project.",
      },
    ],
  },
  {
    key: "focus-areas",
    label: "Issue Modules",
    mobileLabel: "Issue Modules",
    menuEnd: true,
    items: [
      {
        href: "/modules/security",
        label: "Security & Strategy",
        description: "Deterrence, alliances, and the use of force.",
      },
      {
        href: "/modules/technology",
        label: "Technology & Geoeconomics",
        description: "Tech competition, industrial policy, and trade.",
      },
      {
        href: "/modules",
        label: "All modules",
        description: "Overview of both issue modules.",
      },
    ],
  },
  {
    key: "ai",
    label: "AI",
    mobileLabel: "AI",
    menuEnd: true,
    items: [
      {
        href: "/ai/quiz",
        label: "Take the AI Quiz",
        description: "Map your instincts on AI safety and governance.",
      },
      {
        href: "/ai/atlas",
        label: "AI Atlas",
        description: "Browse AI governance archetypes.",
      },
      {
        href: "/ai",
        label: "AI overview",
        description: "About the AI Governance Compass.",
      },
    ],
  },
  {
    key: "explore",
    label: "Explore",
    mobileLabel: "Explore",
    menuEnd: true,
    items: [
      {
        href: "/explore",
        label: "Worldview Guide",
        description: "Browse the IR theory families behind the quiz.",
      },
      {
        href: "/explore/atlas",
        label: "IR Atlas",
        description: "Recurring profile patterns in the current model.",
      },
      {
        href: "/compare",
        label: "Compare Profiles",
        description: "Read two shared profiles side by side.",
      },
    ],
  },
]

const moduleTitles: Record<string, string> = {
  security: "Security & Strategy",
  technology: "Technology & Geoeconomics",
}

function getQuizChromeMeta(
  pathname: string | null,
): QuizChromeMeta | null {
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
  const quizMeta = getQuizChromeMeta(pathname)
  const contactLinks = siteConfig.links.filter((link) => link.kind === "contact")

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
                {navSections.map((section) => (
                  <details
                    key={section.key}
                    className={`nav-disclosure${section.menuEnd ? " nav-disclosure--end" : ""}`}
                  >
                    <summary className="nav-disclosure-summary">{section.label}</summary>
                    <div className="nav-disclosure-menu">
                      {section.items.map((item) => (
                        <Link key={item.href} href={item.href} className="nav-disclosure-link">
                          <span className="nav-disclosure-link-title">{item.label}</span>
                          <span className="nav-disclosure-link-text">{item.description}</span>
                        </Link>
                      ))}
                    </div>
                  </details>
                ))}
                <Link href="/profile" className="nav-profile-link">
                  My Profile
                </Link>
              </div>
            </nav>

            <NavAutoClose />

            <details className="mobile-nav">
              <summary className="mobile-nav-summary">Menu</summary>
              <div className="mobile-nav-sheet">
                <div className="mobile-nav-group">
                  <p className="mobile-nav-label">Start here</p>
                  <div className="mobile-nav-links">
                    <Link href="/quiz" className="mobile-nav-link mobile-nav-link--primary">
                      <span className="mobile-nav-link-title">Take the Foundation Quiz</span>
                      <span className="mobile-nav-link-text">
                        Map your IR worldview. The starting point for everything else.
                      </span>
                    </Link>
                    <Link href="/profile" className="mobile-nav-link">
                      <span className="mobile-nav-link-title">My Profile</span>
                      <span className="mobile-nav-link-text">View your saved results.</span>
                    </Link>
                  </div>
                </div>
                {navSections.filter((section) => section.key !== "foundation").map((section) => (
                  <div key={section.key} className="mobile-nav-group">
                    <p className="mobile-nav-label">{section.mobileLabel ?? section.label}</p>
                    <div className="mobile-nav-links">
                      {section.items
                        .filter(
                          (item) =>
                            !item.label.toLowerCase().includes("overview") &&
                            !item.label.toLowerCase().includes("all module"),
                        )
                        .map((item) => (
                          <Link key={item.href} href={item.href} className="mobile-nav-link">
                            <span className="mobile-nav-link-title">{item.label}</span>
                            <span className="mobile-nav-link-text">{item.description}</span>
                          </Link>
                        ))}
                    </div>
                  </div>
                ))}
                <div className="mobile-nav-group">
                  <p className="mobile-nav-label">Resources</p>
                  <div className="mobile-nav-links">
                    <Link href="/method" className="mobile-nav-link">
                      <span className="mobile-nav-link-title">Methods</span>
                      <span className="mobile-nav-link-text">How the scoring and labels work.</span>
                    </Link>
                    <Link href="/references" className="mobile-nav-link">
                      <span className="mobile-nav-link-title">References</span>
                      <span className="mobile-nav-link-text">Source shelf behind the project.</span>
                    </Link>
                  </div>
                </div>
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
