import "./globals.css"
import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"

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
                <nav className="header-nav" aria-label="Site">
                  <div className="header-nav-group">
                    <p className="header-nav-label">Start here</p>
                    <div className="header-nav-row">
                      <Link href="/" className="nav-link">Home</Link>
                      <Link href="/quiz" className="nav-link">Foundation</Link>
                      <Link href="/profile" className="nav-link">Profile</Link>
                    </div>
                  </div>
                  <div className="header-nav-group">
                    <p className="header-nav-label">Browse</p>
                    <div className="header-nav-row">
                      <Link href="/explore" className="nav-link">Explore</Link>
                      <Link href="/modules" className="nav-link">Focus Areas</Link>
                      <Link href="/ai" className="nav-link">AI</Link>
                      <Link href="/references" className="nav-link">References</Link>
                      <Link href="/method" className="nav-link">Methods</Link>
                    </div>
                  </div>
                </nav>
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
