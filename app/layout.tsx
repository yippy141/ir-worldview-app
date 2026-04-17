import "./globals.css"
import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import { NavAutoClose } from "@/components/layout/nav-auto-close"
import type { Metadata } from "next"

type NavItem = { href: string; label: string; description: string }

type NavSection = {
  key: string
  label: string
  mobileLabel?: string
  menuEnd?: boolean
  items: NavItem[]
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

export const metadata: Metadata = {
  title: siteConfig.publicTitle,
  description:
    "Map how you think about world politics — IR theory, security, technology, and AI governance.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const contactLinks = siteConfig.links.filter((l) => l.kind === "contact")

  return (
    <html lang="en">
      <body>
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
                          <span className="mobile-nav-link-text">Map your IR worldview. The starting point for everything else.</span>
                        </Link>
                        <Link href="/profile" className="mobile-nav-link">
                          <span className="mobile-nav-link-title">My Profile</span>
                          <span className="mobile-nav-link-text">View your saved results.</span>
                        </Link>
                      </div>
                    </div>
                    {navSections.filter((s) => s.key !== "foundation").map((section) => (
                      <div key={section.key} className="mobile-nav-group">
                        <p className="mobile-nav-label">{section.mobileLabel ?? section.label}</p>
                        <div className="mobile-nav-links">
                          {section.items.filter((item) => !item.label.toLowerCase().includes("overview") && !item.label.toLowerCase().includes("all module")).map((item) => (
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
                  <Link href="/feedback" className="footer-link">Feedback</Link>
                  <Link href="/method" className="footer-link">Methods</Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
