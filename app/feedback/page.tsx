import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Feedback — IR Worldview Inventory",
  description: "Share feedback on the Foundation, focus-area modules, and AI Governance Compass.",
}

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeGxaUUwUYmo0YI8mcmqKGnne66MyGhPSWO88lSUwC91NZlyQ/viewform"

interface Props {
  searchParams: Promise<{ module?: string; result?: string; topic?: string }>
}

export default async function FeedbackPage({ searchParams }: Props) {
  const { module, result, topic } = await searchParams
  const aiContext = module === "ai"
  const deletionContext = topic === "deletion"
  const backHref = result
    ? aiContext
      ? `/ai/results/${result}`
      : `/results/${result}`
    : aiContext
      ? "/ai"
      : "/"

  return (
    <div className="container stack-lg" style={{ paddingTop: "48px" }}>
      <div className="panel stack-md">
        <p className="eyebrow">Pilot feedback</p>
        <h1>Help improve this inventory</h1>

        {deletionContext ? (
          <div
            className="panel-flush"
            style={{
              maxWidth: "580px",
              padding: "12px 16px",
              background: "var(--panel-2)",
              borderRadius: "4px",
              borderLeft: "3px solid var(--accent)",
            }}
          >
            <p className="muted" style={{ fontSize: "0.84rem", lineHeight: "1.6" }}>
              <strong>Deletion request:</strong> If you opted into research storage, include a
              respondent ID, session ID, or result link if you have one. Do not include raw answer
              text unless it is needed to identify the record.
            </p>
          </div>
        ) : null}

        <p style={{ lineHeight: "1.7", maxWidth: "580px" }}>
          This pilot is testing the architecture as much as the wording. The most useful feedback
          is not just whether the top label felt right, but whether the profile, shorthand labels,
          module structure, and overall framing felt honest and useful.
        </p>

        <div className="panel-flush stack-xs" style={{ maxWidth: "580px" }}>
          <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>The most useful feedback covers six things</p>
          <ul style={{ margin: "8px 0 0", paddingLeft: "20px", lineHeight: "1.85", color: "var(--muted)", fontSize: "0.9rem" }}>
            <li>What result you expected before taking the inventory</li>
            <li>Whether the core profile fit better than the tradition label</li>
            <li>Which part felt most wrong: profile, label, style, or the whole structure</li>
            <li>Whether political economy here should read as a worldview, a lens, or both</li>
            <li>Which question or case pushed you in the wrong direction</li>
            <li>What felt missing, under-modeled, or structurally off</li>
          </ul>
        </div>

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
            If the whole architecture felt wrong, that is especially useful feedback. You do not
            need to translate it into a better-fitting label first.
          </p>
        </div>

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
            <strong>Friend-testing note:</strong> If you tried this with a friend, classmate, or
            seminar partner, the most useful note is where two people with similar instincts still
            diverged because of one prompt, tradeoff, or label.
          </p>
        </div>

        <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65", maxWidth: "580px" }}>
          <strong>Time:</strong> About two to three minutes. No required fields. Blunt reactions are
          more useful than polite agreement.
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
            <strong>Privacy:</strong> The Google Form does not ask for your name or email by
            default. Do not include identifying details unless you want follow-up or are requesting
            deletion. Feedback is separate from opt-in research answer storage; raw quiz answers
            are not sent to third-party analytics. If you are requesting deletion of opt-in
            research data, include your respondent ID, session ID, or result link if available.
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
            {result ? "← Back to result" : aiContext ? "← Back to AI module" : "← Back to home"}
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
