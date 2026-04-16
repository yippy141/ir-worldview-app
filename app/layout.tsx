import "./globals.css"
import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"

const primaryNavItems = [
  { href: "/quiz", label: "Foundation" },
  { href: "/modules", label: "Focus Areas" },
  { href: "/ai", label: "AI" },
  { href: "/explore", label: "Explore" },
] as const

const secondaryNavItems = [
  { href: "/profile", label: "Profile" },
  { href: "/method", label: "Methods" },
  { href: "/references", label: "References" },
  { href: "/feedback", label: "Feedback" },
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
                    {primaryNavItems.map((item) => (
                      <Link key={item.href} href={item.href} className="nav-link">
                        {item.label}
                      </Link>
                    ))}
                    <details className="nav-disclosure">
                      <summary className="nav-disclosure-summary">More</summary>
                      <div className="nav-disclosure-menu">
                        {secondaryNavItems.map((item) => (
                          <Link key={item.href} href={item.href} className="nav-disclosure-link">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </details>
                  </div>
                </nav>
                <details className="mobile-nav">
                  <summary className="mobile-nav-summary">Menu</summary>
                  <div className="mobile-nav-sheet">
                    <div className="mobile-nav-group">
                      <p className="mobile-nav-label">Main routes</p>
                      <div className="mobile-nav-links">
                        {primaryNavItems.map((item) => (
                          <Link key={item.href} href={item.href} className="mobile-nav-link">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="mobile-nav-group">
                      <p className="mobile-nav-label">Project</p>
                      <div className="mobile-nav-links">
                        {secondaryNavItems.map((item) => (
                          <Link key={item.href} href={item.href} className="mobile-nav-link">
                            {item.label}
                          </Link>
                        ))}
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
