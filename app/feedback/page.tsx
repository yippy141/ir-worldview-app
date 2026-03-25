import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Feedback — IR Worldview Inventory",
  description: "Share your feedback on the IR Worldview Inventory pilot.",
}

// TODO: Replace this placeholder with the actual Google Form URL before the pilot
const GOOGLE_FORM_URL = "https://forms.google.com/placeholder"

export default function FeedbackPage() {
  return (
    <div className="container stack-lg" style={{ paddingTop: "48px" }}>
      <div className="panel stack-md">
        <p className="eyebrow">Pilot feedback</p>
        <h1>Share your thoughts</h1>
        <p style={{ lineHeight: "1.7", maxWidth: "560px" }}>
          This inventory is in a pilot phase. Your feedback helps improve the questions, results,
          and framing for future versions.
        </p>
        <p style={{ lineHeight: "1.7", maxWidth: "560px" }}>
          The form is anonymous. It takes about two minutes. There are no required fields.
        </p>
        <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65", maxWidth: "560px" }}>
          The form asks: how accurate did the result feel, which question was hardest to answer,
          what felt missing or off, and an optional role (student / practitioner / academic /
          other).
        </p>
        <div className="row gap-sm" style={{ flexWrap: "wrap", marginTop: "8px" }}>
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary"
          >
            Open feedback form →
          </a>
          <Link href="/" className="cta-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
