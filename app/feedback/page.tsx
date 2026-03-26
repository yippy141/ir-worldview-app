import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Feedback — IR Worldview Inventory",
  description: "Share your feedback on the IR Worldview Inventory pilot.",
}

// TODO: Replace this placeholder with the actual Google Form URL before the pilot
const GOOGLE_FORM_URL = "https://forms.google.com/placeholder"

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
          This instrument is in a pilot phase. The questions, scoring weights, and result framing
          are based on theoretical judgment — not empirical calibration against a large sample.
          Your responses help identify where the questions are confusing, where the results feel
          inaccurate, and what the instrument is currently missing.
        </p>

        <div className="panel-flush stack-xs" style={{ maxWidth: "580px" }}>
          <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>The form covers four things</p>
          <ul style={{ margin: "8px 0 0", paddingLeft: "20px", lineHeight: "1.85", color: "var(--muted)", fontSize: "0.9rem" }}>
            <li>How accurate the result felt — and where it missed</li>
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
            email address unless you choose to enter it. Responses are used only to improve this
            instrument and are not shared with third parties.
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
    </div>
  )
}
