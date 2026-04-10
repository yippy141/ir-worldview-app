import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page not found — IR Worldview Inventory",
}

export default function NotFound() {
  return (
    <div className="container" style={{ paddingTop: "48px" }}>
      <div className="stack-md">
        <div className="stack-sm">
          <p className="eyebrow">404 — Page not found</p>
          <h1>This page does not exist.</h1>
          <p className="muted" style={{ lineHeight: "1.65" }}>
            The URL may be mistyped, the page may have moved, or a result link may be from an
            older version of the inventory.
          </p>
        </div>

        <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
          <Link href="/quiz" className="cta-primary">Take the Foundation</Link>
          <Link href="/explore" className="cta-secondary">Explore the perspectives</Link>
          <Link href="/" className="cta-secondary">Home</Link>
        </div>
      </div>
    </div>
  )
}
