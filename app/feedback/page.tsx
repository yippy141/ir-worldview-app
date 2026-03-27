import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Feedback — IR Worldview Inventory",
  description: "Share your feedback on the IR Worldview Inventory pilot.",
}

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeGxaUUwUYmo0YI8mcmqKGnne66MyGhPSWO88lSUwC91NZlyQ/viewform"

interface Props {
  searchParams: Promise<{ result?: string }>
}

export default async function FeedbackPage({ searchParams }: Props) {
  const { result } = await searchParams
  const backHref = result ? `/results/${result}` : "/"

  return (
    <div className="container stack-lg" style={{ paddingTop: "48px" }}>
      <div className="panel stack-md">
        <p className="eyebrow">Pilot feedback</p>
        <h1>Help improve this inventory</h1>

        <p style={{ lineHeight: "1.7", maxWidth: "580px" }}>
          This quiz is in a pilot phase. The questions, scoring weights, and result framing are
          based on theoretical judgment, not empirical calibration. Your responses help identify
          where the questions are confusing, where results feel off, and what is missing.
        </p>

        <div className="panel-flush stack-xs" style={{ maxWidth: "580px" }}>
          <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>The form covers four things</p>
          <ul style={{ margin: "8px 0 0", paddingLeft: "20px", lineHeight: "1.85", color: "var(--muted)", fontSize: "0.9rem" }}>
            <li>How accurate the result felt, and where it missed</li>
            <li>Which question was hardest to answer and why</li>
            <li>What was missing, unclear, or felt off</li>
            <li>An optional role (student / practitioner / academic / other)</li>
          </ul>
        </div>

        <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65", maxWidth: "580px" }}>
          <strong>Time:</strong> About two to three minutes. No required fields.
        </p>

        <div
          className="panel-flush"
          style={{
            maxWidth: "580px",
            padding: "12px 16px",
            background: "var(--panel-2)",
            borderRadius: "4px",
            borderLeft: "3px solid var(--border)",
          }}
        >
          <p className="muted" style={{ fontSize: "0.8rem", lineHeight: "1.6" }}>
            <strong>Privacy:</strong> The form is anonymous by default. It does not collect your
            email address unless you choose to provide it. Responses are not shared with third
            parties.
          </p>
        </div>

        <div className="row gap-sm" style={{ flexWrap: "wrap", marginTop: "8px" }}>
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary"
          >
            Open feedback form →
          </a>
          <Link href={backHref} className="cta-secondary">
            {result ? "← Back to result" : "← Back to home"}
          </Link>
        </div>
      </div>

      {/* Direct contact */}
      {siteConfig.links.filter((l) => l.kind === "contact").length > 0 && (
        <div className="panel stack-sm" style={{ marginTop: "24px" }}>
          <p className="eyebrow">Direct contact</p>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.65", maxWidth: "580px" }}>
            Prefer to write directly? The links below reach {siteConfig.author}. This is most
            useful for longer feedback, collaboration inquiries, or pilot arrangements.
          </p>
          <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
            {siteConfig.links
              .filter((l) => l.kind === "contact")
              .map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="cta-secondary"
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                >
                  {link.label} →
                </a>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
