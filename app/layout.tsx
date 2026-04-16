import "./globals.css"
import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"

const navSections = [
  {
    key: "foundation",
    label: "Foundation",
    mobileLabel: "Start here",
    items: [
      {
        href: "/quiz",
        label: "Take the Foundation",
        description: "Start with the shared IR baseline.",
      },
      {
        href: "/method",
        label: "Methods",
        description: "How the model, labels, and scoring work.",
      },
      {
        href: "/references",
        label: "References",
        description: "Browse the source shelf behind the project.",
      },
    ],
  },
  {
    key: "focus-areas",
    label: "Focus Areas",
    mobileLabel: "Focus Areas",
    items: [
      {
        href: "/modules",
        label: "Modules overview",
        description: "Open the Security and Technology overlays.",
      },
      {
        href: "/modules/security",
        label: "Security",
        description: "Deterrence, alliances, and protection under pressure.",
      },
      {
        href: "/modules/technology",
        label: "Technology",
        description: "Controls, capacity, and AI governance.",
      },
    ],
  },
  {
    key: "ai",
    label: "AI",
    mobileLabel: "AI",
    items: [
      {
        href: "/ai",
        label: "AI overview",
        description: "Open the companion module landing page.",
      },
      {
        href: "/ai/quiz",
        label: "Take the AI module",
        description: "Run the AI Governance Compass.",
      },
      {
        href: "/ai/atlas",
        label: "AI Atlas",
        description: "Browse recurring AI governance archetypes.",
      },
    ],
  },
  {
    key: "explore",
    label: "Explore",
    mobileLabel: "Explore",
    items: [
      {
        href: "/explore",
        label: "Worldview guide",
        description: "Explore modeled traditions and coverage gaps.",
      },
      {
        href: "/explore/atlas",
        label: "IR Atlas",
        description: "Browse recurring IR profile patterns.",
      },
      {
        href: "/profile",
        label: "Profile",
        description: "See your saved worldview mosaic.",
      },
      {
        href: "/compare",
        label: "Compare profiles",
        description: "Read two shared profiles side by side.",
      },
    ],
  },
] as const

export const metadata: Metadata = {
  title: siteConfig.publicTitle,
  description:
    "An editorial interactive about how you read world politics across the Foundation, focus-area modules, and integrated Profile.",
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
                  <p className="brand-subtitle">{siteConfig.byline}</p>
                </Link>
                <nav className="header-nav header-nav--desktop" aria-label="Primary">
                  <div className="header-nav-row">
                    {navSections.map((section) => (
                      <details key={section.key} className="nav-disclosure">
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
                  </div>
                </nav>
                {/* Auto-close sibling nav dropdowns when one opens */}
                <script dangerouslySetInnerHTML={{ __html: `(function(){var d=document.querySelectorAll('.header-nav .nav-disclosure');d.forEach(function(el){el.addEventListener('toggle',function(){if(el.open){d.forEach(function(o){if(o!==el)o.removeAttribute('open');});}});});})();` }} />
                <details className="mobile-nav">
                  <summary className="mobile-nav-summary">Menu</summary>
                  <div className="mobile-nav-sheet">
                    {navSections.map((section, sectionIndex) => (
                      <div key={section.key} className="mobile-nav-group">
                        <p className="mobile-nav-label">
                          {section.mobileLabel ?? section.label}
                        </p>
                        <div className="mobile-nav-links">
                          {section.items.map((item, itemIndex) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`mobile-nav-link${
                                sectionIndex === 0 && itemIndex === 0
                                  ? " mobile-nav-link--primary"
                                  : ""
                              }`}
                            >
                              <span className="mobile-nav-link-title">{item.label}</span>
                              <span className="mobile-nav-link-text">{item.description}</span>
                            </Link>
                          ))}
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
