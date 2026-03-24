import "./globals.css"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "IR Worldview Inventory",
  description:
    "A prototype classification tool that maps how you think about world politics across seven analytical dimensions from International Relations theory.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <div className="container" style={{ padding: "0" }}>
              <div className="header-inner">
                <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                  <p className="brand">IR Worldview Inventory</p>
                  <p className="brand-subtitle">A prototype classification tool</p>
                </Link>
                <nav className="header-nav">
                  <Link href="/explore" className="nav-link">Explore</Link>
                  <Link href="/method" className="nav-link">Methods</Link>
                  <Link href="/quiz" className="nav-cta">Take the quiz</Link>
                </nav>
              </div>
            </div>
          </header>
          <main className="site-main container page-space">{children}</main>
        </div>
      </body>
    </html>
  )
}
